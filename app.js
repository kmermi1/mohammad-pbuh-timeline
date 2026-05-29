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
  const tlList = document.getElementById("timeline-list");
  EVENTS.forEach(ev => {
    const li = document.createElement("li");
    li.className = "tl-item";
    li.innerHTML = `
      <div class="tl-year">
        <strong>${ev.year}</strong>
        <span class="ce">CE</span>
      </div>
      <div class="tl-marker" aria-hidden="true"></div>
      <div class="tl-body">
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
