/* =========================================================
   Sīrah — interactive logic
   - D3 force-directed graph of 100 figures
   - Searchable, filterable by category
   - Click a node → detail card with related figures
   - Renders chronological timeline
   ========================================================= */

(function () {
  "use strict";

  // ── Color lookup keyed by category ───────────────────────
  const CAT_COLOR = {
    prophet:    "#1c1611",
    family:     "#7a1f25",
    wife:       "#8f4a6b",
    child:      "#a85a2a",
    grandchild: "#b08538",
    caliph:     "#1f3552",
    companion:  "#4a5a2e",
    opponent:   "#4a3325",
    ally:       "#6b5a47"
  };

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
  const { width, height } = svgEl.getBoundingClientRect();

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

  // Force simulation
  const sim = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id)
      .distance(l => {
        if (l.type === "spouse" || l.type === "parent") return 55;
        if (l.type === "close_companion") return 75;
        if (l.type === "companion") return 95;
        if (l.type === "opponent") return 130;
        return 85;
      })
      .strength(l => {
        if (l.type === "spouse" || l.type === "parent") return 0.9;
        if (l.type === "close_companion") return 0.6;
        if (l.type === "opponent") return 0.25;
        return 0.45;
      })
    )
    .force("charge", d3.forceManyBody().strength(d => d.id === "muhammad" ? -700 : -180))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide().radius(d => d.radius + 14))
    // Soft radial: keep the Prophet ﷺ near the center, others further out
    .force("radial", d3.forceRadial(d => d.id === "muhammad" ? 0 : 230, width / 2, height / 2).strength(0.04));

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
    .on("mouseenter", (e, d) => highlight(d.id))
    .on("mouseleave", () => clearHighlight());

  nodeSel.append("circle")
    .attr("r", d => d.radius)
    .attr("fill", d => CAT_COLOR[d.category] || "#666");

  // Inner glyph for the Prophet ﷺ node only
  nodeSel.filter(d => d.id === "muhammad")
    .append("circle")
    .attr("r", 6)
    .attr("fill", "#f4ecdb")
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
    nodeSel.classed("lit", false).classed("dim", false);
    linkSel.classed("lit", false).classed("dim", false);
  }

  // ── Detail card ──────────────────────────────────────────
  const detailEl  = document.querySelector("#detail-card .detail-body");
  const closeBtn  = document.getElementById("close-detail");

  function selectNode(id) {
    const p = nodeById.get(id);
    if (!p) return;
    highlight(id);

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
    if (activeCats.size === 0) { clearHighlight(); return; }
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
    const { width: w, height: h } = svgEl.getBoundingClientRect();
    sim.force("center", d3.forceCenter(w / 2, h / 2));
    sim.force("radial", d3.forceRadial(d => d.id === "muhammad" ? 0 : 230, w / 2, h / 2).strength(0.04));
    sim.alpha(0.4).restart();
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
})();
