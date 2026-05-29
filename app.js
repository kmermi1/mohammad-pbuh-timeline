/* =========================================================
   Sīrah — interactive logic
   - D3 force-directed graph of 100 figures
   - Searchable, filterable by category
   - Click a node → detail card with related figures
   - Renders chronological timeline

   © 2026 All Rights Reserved.
   This source code may not be reproduced or reused without
   prior written permission from the author.
   ========================================================= */

(function () {
  "use strict";

  const CAT_LABEL = {
    prophet:    "Prophet",
    family:     "Family",
    wife:       "Wife of the Prophet",
    child:      "Child of the Prophet",
    grandchild: "Grandchild of the Prophet",
    caliph:     "Rightly-Guided Caliph",
    companion:  "Companion",
    opponent:   "Opponent",
    ally:       "Ally"
  };

  const REL_LABEL = {
    parent:           "parent",
    child:            "child",
    spouse:           "spouse",
    sibling:          "sibling",
    uncle:            "paternal uncle",
    aunt:             "paternal aunt",
    cousin:           "cousin",
    adopted:          "adopted son",
    nursed_by:        "wet-nursed",
    companion:        "companion",
    close_companion:  "close companion",
    ally:             "ally",
    opponent:         "opponent",
    father_in_law:    "father-in-law",
    mother_in_law:    "mother-in-law",
    son_in_law:       "son-in-law",
    daughter_in_law:  "daughter-in-law"
  };

  // ── Build node + link arrays ─────────────────────────────
  // D3 mutates these objects, so clone the source data.
  const nodes = PEOPLE.map(p => ({
    ...p,
    radius: p.id === "muhammad" ? 18
          : p.category === "wife" || p.category === "child" || p.category === "caliph" ? 9
          : p.category === "family" ? 8
          : 6.5
  }));
  const nodeById = new Map(nodes.map(n => [n.id, n]));

  // Filter out any relationship referencing a missing id (safety).
  const links = RELATIONSHIPS
    .filter(r => nodeById.has(r.source) && nodeById.has(r.target))
    .map(r => ({ ...r }));

  // Adjacency map for highlighting & relation list.
  const adjacency = new Map();   // id -> [{ otherId, type, direction }]
  links.forEach(l => {
    if (!adjacency.has(l.source)) adjacency.set(l.source, []);
    if (!adjacency.has(l.target)) adjacency.set(l.target, []);
    adjacency.get(l.source).push({ other: l.target, type: l.type, dir: "out" });
    adjacency.get(l.target).push({ other: l.source, type: l.type, dir: "in" });
  });

  // ── SVG setup ────────────────────────────────────────────
  const svgEl = document.getElementById("graph-svg");
  const svg = d3.select(svgEl);
  let { width, height } = svgEl.getBoundingClientRect();

  // Group that pans/zooms
  const root = svg.append("g").attr("class", "root");

  // Zoom + pan
  const zoom = d3.zoom()
    .scaleExtent([0.35, 3.5])
    .on("zoom", (event) => root.attr("transform", event.transform));
  svg.call(zoom);

  // Layers (links below nodes)
  const linkLayer = root.append("g").attr("class", "links");
  const nodeLayer = root.append("g").attr("class", "nodes");

  // Force simulation. All size-dependent parameters are scaled via configureForces().
  function baseLinkDistance(type) {
    if (type === "spouse" || type === "parent") return 55;
    if (type === "close_companion") return 75;
    if (type === "companion") return 95;
    if (type === "opponent") return 130;
    return 85;
  }

  // Elliptical placement force: pulls Muhammad to centre, pushes others toward
  // an ellipse perimeter sized to the canvas. Lets wide screens spread nodes
  // horizontally instead of clustering inside a fixed-radius circle.
  function ellipseForce(cx, cy, rx, ry, strength) {
    let simNodes;
    function f(alpha) {
      const k = alpha * strength;
      for (const n of simNodes) {
        if (n.id === "muhammad") {
          n.vx += (cx - n.x) * k;
          n.vy += (cy - n.y) * k;
          continue;
        }
        const dx = n.x - cx;
        const dy = n.y - cy;
        if (dx === 0 && dy === 0) continue;
        const angle = Math.atan2(dy, dx);
        const tx = cx + rx * Math.cos(angle);
        const ty = cy + ry * Math.sin(angle);
        n.vx += (tx - n.x) * k;
        n.vy += (ty - n.y) * k;
      }
    }
    f.initialize = (_n) => { simNodes = _n; };
    return f;
  }

  // Aggressive scale so the cluster actually grows with the canvas.
  // Use the larger dimension so wide screens get longer links and a bigger ellipse.
  function computeScale(w, h) {
    return Math.max(w / 810, h / 640);
  }
  let forceScale = computeScale(width, height);

  const sim = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id)
      .distance(l => baseLinkDistance(l.type) * forceScale)
      .strength(l => {
        if (l.type === "spouse" || l.type === "parent") return 0.7;
        if (l.type === "close_companion") return 0.45;
        if (l.type === "opponent") return 0.18;
        return 0.3;
      })
    )
    .force("charge", d3.forceManyBody().strength(d => (d.id === "muhammad" ? -700 : -180) * forceScale))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide().radius(d => d.radius + 14))
    .force("ellipse", ellipseForce(width / 2, height / 2, width * 0.44, height * 0.44, 0.18));

  function reconfigureForces(w, h) {
    forceScale = computeScale(w, h);
    sim.force("center").x(w / 2).y(h / 2);
    sim.force("ellipse", ellipseForce(w / 2, h / 2, w * 0.44, h * 0.44, 0.18));
    sim.force("link").distance(l => baseLinkDistance(l.type) * forceScale);
    sim.force("charge").strength(d => (d.id === "muhammad" ? -700 : -180) * forceScale);
  }

  // Draw links
  const linkSel = linkLayer.selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("class", d => `link ${d.type}`);

  // Draw nodes
  const nodeSel = nodeLayer.selectAll("g.node")
    .data(nodes, d => d.id)
    .enter()
    .append("g")
    .attr("class", d => `node ${d.id === "muhammad" ? "prophet" : ""}`)
    .call(d3.drag()
      .on("start", dragStarted)
      .on("drag",  dragged)
      .on("end",   dragEnded))
    .on("click",      (e, d) => { e.stopPropagation(); selectNode(d.id); })
    .on("mouseenter", (e, d) => { if (activeCats.size === 0) highlight(d.id); })
    .on("mouseleave", () => { if (activeCats.size === 0) clearHighlight(); });

  nodeSel.append("circle")
    .attr("r", d => d.radius)
    .attr("class", d => `node-circle cat-${d.category}`);

  // Inner glyph for the Prophet ﷺ node only
  nodeSel.filter(d => d.id === "muhammad")
    .append("circle")
    .attr("r", 6)
    .attr("class", "node-inner-glyph")
    .attr("pointer-events", "none");

  nodeSel.append("text")
    .attr("dy", d => d.radius + 12)
    .text(d => shortName(d.name));

  // Background click clears detail
  svg.on("click", () => clearHighlight());

  // Simulation tick
  sim.on("tick", () => {
    // Soft bounds so nodes don't drift off forever
    nodes.forEach(d => {
      d.x = Math.max(40, Math.min(width - 40, d.x));
      d.y = Math.max(40, Math.min(height - 40, d.y));
    });
    linkSel
      .attr("x1", d => d.source.x).attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
    nodeSel.attr("transform", d => `translate(${d.x},${d.y})`);
  });

  // ── Helpers ──────────────────────────────────────────────
  function shortName(full) {
    // Truncate long names so they don't overlap; show first segment + ﷺ marker if present.
    const noKunya = full.replace(/^Abu /,"Abu ").replace(/^Umm /,"Umm ");
    if (full.length <= 22) return noKunya;
    // Try to keep the first 2 words
    const parts = noKunya.split(" ");
    if (parts.length <= 2) return noKunya;
    return parts.slice(0, 2).join(" ");
  }

  function dragStarted(event, d) {
    if (!event.active) sim.alphaTarget(0.3).restart();
    d.fx = d.x; d.fy = d.y;
  }
  function dragged(event, d) {
    d.fx = event.x; d.fy = event.y;
  }
  function dragEnded(event, d) {
    if (!event.active) sim.alphaTarget(0);
    d.fx = null; d.fy = null;
  }

  // Highlight a node and its neighbours
  function highlight(id) {
    const neighbours = new Set([id]);
    (adjacency.get(id) || []).forEach(a => neighbours.add(a.other));

    nodeSel
      .classed("lit", n => neighbours.has(n.id))
      .classed("dim", n => !neighbours.has(n.id));

    linkSel
      .classed("lit", l => l.source.id === id || l.target.id === id)
      .classed("dim", l => l.source.id !== id && l.target.id !== id);
  }
  function clearHighlight() {
    if (activeCats.size > 0) {
      applyFilterClasses();
      return;
    }
    nodeSel.classed("lit", false).classed("dim", false);
    linkSel.classed("lit", false).classed("dim", false);
  }

  function applyFilterClasses() {
    nodeSel
      .classed("lit", n => activeCats.has(n.category) || n.id === "muhammad")
      .classed("dim", n => !activeCats.has(n.category) && n.id !== "muhammad");
    linkSel
      .classed("lit", false)
      .classed("dim", l => {
        const okS = activeCats.has(l.source.category) || l.source.id === "muhammad";
        const okT = activeCats.has(l.target.category) || l.target.id === "muhammad";
        return !(okS && okT);
      });
  }

  // ── Detail card ──────────────────────────────────────────
  const detailEl  = document.querySelector("#detail-card .detail-body");
  const closeBtn  = document.getElementById("close-detail");

  function selectNode(id) {
    const p = nodeById.get(id);
    if (!p) return;
    highlight(id);

    // Fit zoom to the lit cluster (selected node + neighbours)
    const litIds = new Set([id]);
    (adjacency.get(id) || []).forEach(a => litIds.add(a.other));
    focusOnNodes(nodes.filter(n => litIds.has(n.id)));

    const rels = (adjacency.get(id) || [])
      .map(r => ({ other: nodeById.get(r.other), type: r.type, dir: r.dir }))
      .filter(r => r.other)
      .sort((a, b) => relWeight(a.type) - relWeight(b.type));

    const yrs = (p.born || p.died)
      ? `${p.born ?? "?"} – ${p.died ?? "?"} CE`
      : "Dates unknown";

    let html = "";
    html += `<h3>${escapeHtml(p.name)}</h3>`;
    if (p.arabic) html += `<span class="arabic">${escapeHtml(p.arabic)}</span>`;
    html += `<div class="cat">${CAT_LABEL[p.category] || p.category}</div>`;
    html += `<div class="years">${yrs}</div>`;
    html += `<p>${escapeHtml(p.description || "")}</p>`;

    if (rels.length) {
      html += `<div class="relations-head">Related figures (${rels.length})</div>`;
      rels.forEach(r => {
        const lbl = relationLabel(r.type, r.dir, p, r.other);
        html += `<button class="relation" data-id="${r.other.id}">`
              + escapeHtml(r.other.name)
              + `<span class="rel-type">${lbl}</span>`
              + `</button>`;
      });
    }

    detailEl.innerHTML = html;
    // Wire up the relation buttons
    detailEl.querySelectorAll(".relation").forEach(btn => {
      btn.addEventListener("click", () => selectNode(btn.dataset.id));
    });
  }

  function relationLabel(type, dir, self, other) {
    // Reword based on direction so the label reads from the selected node's POV
    if (type === "parent") return dir === "out" ? "child"     : "parent";
    if (type === "child")  return dir === "out" ? "parent"    : "child";
    if (type === "uncle")  return dir === "out" ? "nephew"    : "uncle";
    if (type === "aunt")   return dir === "out" ? "nephew"    : "aunt";
    if (type === "adopted")return dir === "out" ? "adopted son" : "adoptive father";
    if (type === "nursed_by") return dir === "out" ? "milk-child" : "wet-nurse";
    if (type === "opponent") return "opponent";
    if (type === "ally")     return "ally";
    return REL_LABEL[type] || type;
  }

  function relWeight(t) {
    // Rough sort order for the relations list
    const order = ["spouse","parent","child","sibling","cousin","uncle","aunt",
                   "nursed_by","adopted","close_companion","companion","ally","opponent"];
    const i = order.indexOf(t);
    return i === -1 ? 99 : i;
  }

  closeBtn.addEventListener("click", () => {
    detailEl.innerHTML = `<p class="detail-hint">Click a node to read about a figure.</p>`;
    clearHighlight();
  });

  // ── Search & filter ──────────────────────────────────────
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) { clearHighlight(); return; }
    const matches = new Set(
      nodes.filter(n =>
        n.name.toLowerCase().includes(q) ||
        (n.arabic && n.arabic.includes(q))
      ).map(n => n.id)
    );

    // Lift matched, dim the rest
    nodeSel
      .classed("lit", n => matches.has(n.id))
      .classed("dim", n => !matches.has(n.id));
    linkSel.classed("dim", true).classed("lit", false);

    if (matches.size === 1) {
      const onlyId = [...matches][0];
      selectNode(onlyId);
    }
  });

  // Category toggle (legend buttons act as filters)
  const activeCats = new Set();
  document.querySelectorAll(".legend-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.cat;
      if (activeCats.has(cat)) { activeCats.delete(cat); btn.classList.remove("active"); }
      else                      { activeCats.add(cat);    btn.classList.add("active"); }
      applyCategoryFilter();
    });
  });
  function applyCategoryFilter() {
    if (activeCats.size === 0) {
      clearHighlight();
      svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
      return;
    }
    applyFilterClasses();
    const matches = nodes.filter(n => activeCats.has(n.category) || n.id === "muhammad");
    focusOnNodes(matches);
  }

  function focusOnNodes(matches) {
    if (!matches || matches.length === 0) return;
    const { width: vw, height: vh } = svgEl.getBoundingClientRect();
    // Wait briefly for simulation to settle nodes near the cluster, then fit.
    // Using current positions; simulation alpha is low so positions are stable.
    const pad = 70;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    matches.forEach(n => {
      if (typeof n.x !== "number" || typeof n.y !== "number") return;
      const r = n.radius || 8;
      minX = Math.min(minX, n.x - r);
      maxX = Math.max(maxX, n.x + r);
      minY = Math.min(minY, n.y - r);
      maxY = Math.max(maxY, n.y + r);
    });
    if (!isFinite(minX)) return;
    const bw = (maxX - minX) + pad * 2;
    const bh = (maxY - minY) + pad * 2;
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    // Fit bbox to viewport, but cap scale so we don't blow up a single tight cluster.
    const scale = Math.min(vw / bw, vh / bh, 2.4);
    const tx = vw / 2 - cx * scale;
    const ty = vh / 2 - cy * scale;
    const t = d3.zoomIdentity.translate(tx, ty).scale(scale);
    svg.transition().duration(650).call(zoom.transform, t);
  }

  // Reset
  document.getElementById("reset-btn").addEventListener("click", () => {
    searchInput.value = "";
    activeCats.clear();
    document.querySelectorAll(".legend-item").forEach(b => b.classList.remove("active"));
    clearHighlight();
    svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
    sim.alpha(0.6).restart();
  });

  // Re-center on resize
  window.addEventListener("resize", () => {
    const r = svgEl.getBoundingClientRect();
    width = r.width;
    height = r.height;
    reconfigureForces(width, height);
    sim.alpha(0.5).restart();
  });

  // ── Timeline ─────────────────────────────────────────────
  // Manuscript-style line-art glyphs depicting each event.
  // 64x64 viewBox; stroked with currentColor so themes recolor them.
  const SVG_ATTR = 'viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  const EVENT_ICONS = {
    // 570 — Elephant (body, trunk, legs, ear, eye)
    "Year of the Elephant":
      `<svg ${SVG_ATTR}><path d="M8 44 Q8 26 24 22 Q40 19 50 24 Q56 28 56 38 L56 48 L50 48 L50 42 M40 48 L40 42 M24 48 L24 42 M14 48 L14 42 M50 26 Q56 18 60 16 M8 44 Q4 44 4 50 Q4 52 6 52"/><circle cx="18" cy="30" r="1.2" fill="currentColor" stroke="none"/></svg>`,
    // 576 — Teardrop with rays
    "Death of his mother":
      `<svg ${SVG_ATTR}><path d="M32 14 C20 30 20 42 32 46 C44 42 44 30 32 14 Z M12 24 L18 26 M12 36 L18 34 M52 24 L46 26 M52 36 L46 34 M32 52 L32 56 M22 52 L26 54 M42 52 L38 54"/></svg>`,
    // 578 — Cypress tree silhouette (mourning)
    "Death of his grandfather":
      `<svg ${SVG_ATTR}><path d="M32 54 L32 10 M32 14 L24 24 L32 22 L40 24 Z M32 24 L22 36 L32 32 L42 36 Z M32 34 L20 46 L32 42 L44 46 Z M24 54 L40 54"/></svg>`,
    // 583 — Camel (humped silhouette)
    "Journey to Syria with Abu Talib":
      `<svg ${SVG_ATTR}><path d="M10 46 L18 30 Q22 22 26 30 Q30 40 34 30 Q38 22 42 30 L50 46 M50 46 L54 52 L54 46 L50 46 L46 52 M18 46 L14 52 L14 46 L18 46 L22 52 M42 22 Q44 16 50 16 M44 22 L44 18"/></svg>`,
    // 595 — Two interlocked rings
    "Marriage to Khadijah":
      `<svg ${SVG_ATTR}><circle cx="24" cy="32" r="13"/><circle cx="40" cy="32" r="13"/></svg>`,
    // 605 — Ka'bah (cube with door)
    "Rebuilding of the Ka'bah":
      `<svg ${SVG_ATTR}><path d="M12 20 L32 12 L52 20 L52 50 L32 58 L12 50 Z M32 12 L32 58 M12 20 L32 28 L52 20 M28 40 L36 38 L36 52 L28 54 Z"/></svg>`,
    // 610 — Open book with rays
    "The First Revelation":
      `<svg ${SVG_ATTR}><path d="M10 30 L32 24 L54 30 L54 50 L32 44 L10 50 Z M32 24 L32 44 M32 6 L32 12 M16 14 L20 18 M48 14 L44 18 M22 8 L25 14 M42 8 L39 14"/></svg>`,
    // 613 — Mountain with sound waves
    "Public preaching begins":
      `<svg ${SVG_ATTR}><path d="M6 52 L22 28 L34 42 L42 32 L58 52 Z M42 14 Q48 14 48 20 M46 10 Q54 10 54 18 M50 6 Q60 6 60 16"/></svg>`,
    // 615 — Sailing boat on waves
    "First Migration to Abyssinia":
      `<svg ${SVG_ATTR}><path d="M32 12 L32 38 M32 14 L48 36 L32 36 Z M32 14 L16 36 L32 36 M14 36 L50 36 M6 44 Q12 40 18 44 T30 44 T42 44 T54 44 T58 44"/></svg>`,
    // 616 — Sword pointing up
    "Conversion of Umar and Hamza":
      `<svg ${SVG_ATTR}><path d="M32 6 L32 44 M22 44 L42 44 M28 44 L28 52 L36 52 L36 44 M32 52 L32 58"/></svg>`,
    // 617 — Broken chain
    "Boycott of Banu Hashim":
      `<svg ${SVG_ATTR}><path d="M10 24 a8 6 0 1 0 0 16 L18 40 M22 40 L26 36 M28 36 L32 32 M34 28 L38 24 M42 24 L46 24 a8 6 0 1 1 0 16 L42 40"/></svg>`,
    // 619 — Wilted branch (sorrow)
    "The Year of Sorrow":
      `<svg ${SVG_ATTR}><path d="M16 10 Q22 30 32 36 Q42 42 50 56 M22 16 Q26 14 30 16 M30 22 Q34 20 38 22 M38 28 Q42 26 46 28 M44 36 Q48 34 52 36 M24 46 Q22 52 26 54 Q30 52 28 46 Z"/></svg>`,
    // 619 — Stones falling at mountain
    "Journey to Ta'if":
      `<svg ${SVG_ATTR}><path d="M6 52 L22 28 L32 40 L40 30 L58 52 Z"/><circle cx="14" cy="14" r="2"/><circle cx="28" cy="10" r="1.6"/><circle cx="44" cy="16" r="2"/><circle cx="54" cy="12" r="1.6"/><circle cx="20" cy="22" r="1.4"/></svg>`,
    // 620 — Crescent and star with ascending arc
    "Al-Isra wal-Mi'raj":
      `<svg ${SVG_ATTR}><path d="M22 32 a12 12 0 1 0 9 -11 a9 9 0 1 1 -9 11 Z M46 14 L47.4 18 L51.5 18 L48.2 20.5 L49.5 24.5 L46 22 L42.5 24.5 L43.8 20.5 L40.5 18 L44.6 18 Z M10 52 Q32 38 54 52"/></svg>`,
    // 621 — Clasped hands
    "First Pledge of Aqaba":
      `<svg ${SVG_ATTR}><path d="M6 32 L18 32 L24 28 Q28 26 32 30 L38 36 Q42 38 38 42 L32 44 L22 44 L16 48 L8 48 L8 32 M58 32 L46 32 L40 28 Q36 26 32 30 M32 30 L32 36 M40 34 L44 32 M44 38 L48 36"/></svg>`,
    // 622 — Cave with spider web and star
    "The Hijra to Medina":
      `<svg ${SVG_ATTR}><path d="M14 50 Q14 18 32 18 Q50 18 50 50 Z M16 24 L24 32 M22 20 L30 28 M32 18 L32 30 M42 20 L34 28 M48 24 L40 32 M20 40 a1.8 1.8 0 1 0 0.1 0 M50 10 L51.4 14 L55.5 14 L52.2 16.5 L53.5 20.5 L50 18 L46.5 20.5 L47.8 16.5 L44.5 14 L48.6 14 Z"/></svg>`,
    // 623 — Unrolled scroll
    "Constitution of Medina":
      `<svg ${SVG_ATTR}><path d="M12 18 Q12 14 16 14 L48 14 Q52 14 52 18 L52 46 Q52 50 48 50 L16 50 Q12 50 12 46 Z M12 18 Q16 18 16 22 L16 46 M52 18 Q48 18 48 22 L48 46 M22 26 L42 26 M22 32 L42 32 M22 38 L36 38"/></svg>`,
    // 624 — Crossed swords with crescent
    "Battle of Badr":
      `<svg ${SVG_ATTR}><path d="M14 18 L46 50 M50 18 L18 50 M42 18 L50 18 L50 26 M22 18 L14 18 L14 26 M14 42 L14 50 L22 50 M42 50 L50 50 L50 42 M28 8 a6 6 0 1 0 6 0"/></svg>`,
    // 625 — Mountain with arrow embedded
    "Battle of Uhud":
      `<svg ${SVG_ATTR}><path d="M6 54 L22 26 L34 40 L44 28 L58 54 Z M38 6 L50 18 M44 6 L50 6 L50 12 M38 6 L40 12"/></svg>`,
    // 627 — Trench with battlement above
    "Battle of the Trench (Khandaq)":
      `<svg ${SVG_ATTR}><path d="M6 38 L14 38 L18 50 L22 30 L26 50 L30 30 L34 50 L38 30 L42 50 L46 30 L50 50 L58 38 M10 38 L10 22 L14 22 L14 28 L18 28 L18 22 L22 22 L22 28 L26 28 L26 22 L30 22 L30 28 L34 28 L34 22 L38 22 L38 28 L42 28 L42 22 L46 22 L46 28 L50 28 L50 22 L54 22 L54 38"/></svg>`,
    // 628 — Olive branch (peace)
    "Treaty of Hudaybiyyah":
      `<svg ${SVG_ATTR}><path d="M12 50 Q22 28 50 14 M18 42 Q12 38 12 32 Q18 32 22 36 M24 36 Q18 30 20 22 Q26 24 28 30 M30 30 Q26 22 30 16 Q36 20 36 26 M38 24 Q36 16 42 12 Q46 18 44 24 M46 18 Q48 12 54 12"/></svg>`,
    // 628 — Letter with wax seal
    "Letters to kings":
      `<svg ${SVG_ATTR}><path d="M10 18 L54 18 L54 46 L10 46 Z M10 18 L32 36 L54 18 M42 38 a6 6 0 1 0 10 -2 a6 6 0 1 0 -10 2 Z M44 36 L50 40 M44 40 L50 36"/></svg>`,
    // 629 — Fortress with battlements
    "Battle of Khaybar":
      `<svg ${SVG_ATTR}><path d="M10 54 L10 26 L14 26 L14 20 L20 20 L20 26 L24 26 L24 20 L30 20 L30 26 L34 26 L34 20 L40 20 L40 26 L44 26 L44 20 L50 20 L50 26 L54 26 L54 54 Z M26 54 L26 38 L38 38 L38 54 M30 44 L34 44"/></svg>`,
    // 629 — Crossed swords with cross above (Byzantine frontier)
    "Battle of Mu'tah":
      `<svg ${SVG_ATTR}><path d="M10 14 L50 50 M54 14 L14 50 M44 14 L50 14 L50 20 M16 14 L10 14 L10 20 M10 44 L10 50 L16 50 M44 50 L50 50 L50 44 M32 4 L32 12 M28 8 L36 8"/></svg>`,
    // 630 — Ka'bah with banner above
    "Conquest of Mecca":
      `<svg ${SVG_ATTR}><path d="M14 28 L32 20 L50 28 L50 54 L14 54 Z M14 28 L32 36 L50 28 M32 20 L32 54 M28 44 L36 42 L36 54 L28 54 Z M32 6 L32 20 M32 8 L48 8 L44 12 L48 16 L32 16"/></svg>`,
    // 630 — Bow and arrow
    "Battle of Hunayn and siege of Ta'if":
      `<svg ${SVG_ATTR}><path d="M14 14 Q42 14 50 32 Q42 50 14 50 M14 14 L14 50 M16 32 L52 32 M48 28 L52 32 L48 36 M50 32 L58 32"/></svg>`,
    // 631 — Three tents
    "Year of Delegations":
      `<svg ${SVG_ATTR}><path d="M4 50 L16 22 L28 50 Z M16 22 L16 50 M22 50 L34 30 L46 50 Z M34 30 L34 50 M40 50 L50 34 L60 50 Z M50 34 L50 50"/></svg>`,
    // 632 — Mount Arafat with sun rays
    "The Farewell Pilgrimage":
      `<svg ${SVG_ATTR}><path d="M4 52 L22 24 L34 40 L44 28 L60 52 Z M50 12 a6 6 0 1 0 0.1 0 M50 2 L50 6 M50 18 L50 22 M40 12 L44 12 M56 12 L60 12 M43 5 L46 8 M57 5 L54 8 M43 19 L46 16 M57 19 L54 16"/></svg>`,
    // 632 — Green dome with crescent
    "Death of the Prophet ﷺ":
      `<svg ${SVG_ATTR}><path d="M14 54 L14 38 Q14 18 32 14 Q50 18 50 38 L50 54 Z M32 14 L32 4 M18 54 L18 44 M46 54 L46 44 M22 54 L22 48 M42 54 L42 48 M28 6 a3.5 3.5 0 1 0 6 0"/></svg>`,
  };
  const DEFAULT_ICON =
    `<svg ${SVG_ATTR}><path d="M32 12 L36 28 L52 28 L40 38 L44 54 L32 44 L20 54 L24 38 L12 28 L28 28 Z"/></svg>`;

  const tlList = document.getElementById("timeline-list");
  EVENTS.forEach(ev => {
    const li = document.createElement("li");
    li.className = "tl-item";
    const icon = EVENT_ICONS[ev.title] || DEFAULT_ICON;
    li.innerHTML = `
      <div class="tl-year">
        <strong>${ev.year}</strong>
        <span class="ce">CE</span>
      </div>
      <div class="tl-marker" aria-hidden="true"></div>
      <div class="tl-body">
        <div class="tl-icon" aria-hidden="true">${icon}</div>
        <h3>${escapeHtml(ev.title)}</h3>
        <span class="age">Age ${ev.age}</span>
        <p>${escapeHtml(ev.body)}</p>
      </div>
    `;
    tlList.appendChild(li);
  });

  // ── Utility ──────────────────────────────────────────────
  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Auto-select the Prophet ﷺ on first load so the card isn't empty
  setTimeout(() => selectNode("muhammad"), 600);

  // ── Theme switcher ───────────────────────────────────────
  const THEMES = {
    parchment:  "Parchment",
    modern:     "Modern",
    newspaper:  "Newspaper",
    midnight:   "Midnight",
    gold:       "Gold"
  };
  const themeBtn  = document.getElementById("theme-switcher-btn");
  const themeMenu = document.getElementById("theme-switcher-menu");
  const themeCur  = document.getElementById("theme-switcher-current");

  function applyTheme(name) {
    if (!THEMES[name]) name = "parchment";
    document.documentElement.setAttribute("data-theme", name);
    themeCur.textContent = THEMES[name];
    themeMenu.querySelectorAll("li").forEach(li => {
      li.setAttribute("aria-selected", li.dataset.select === name ? "true" : "false");
    });
    try { localStorage.setItem("sirah-theme", name); } catch (e) { /* ignore */ }
  }

  function openMenu() {
    themeMenu.hidden = false;
    themeBtn.setAttribute("aria-expanded", "true");
  }
  function closeMenu() {
    themeMenu.hidden = true;
    themeBtn.setAttribute("aria-expanded", "false");
  }

  // Initialize from the attribute already set by the inline head script
  applyTheme(document.documentElement.getAttribute("data-theme") || "parchment");

  themeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    themeMenu.hidden ? openMenu() : closeMenu();
  });
  themeMenu.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-select]");
    if (!li) return;
    applyTheme(li.dataset.select);
    closeMenu();
    themeBtn.focus();
  });
  themeMenu.addEventListener("keydown", (e) => {
    const li = e.target.closest("li[data-select]");
    if (!li) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      applyTheme(li.dataset.select);
      closeMenu();
      themeBtn.focus();
    }
  });
  document.addEventListener("click", (e) => {
    if (!themeMenu.hidden && !e.target.closest("#theme-switcher")) closeMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !themeMenu.hidden) { closeMenu(); themeBtn.focus(); }
  });
})();
