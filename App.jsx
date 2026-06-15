import { useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { SKUS as RAW_SKUS, getStatus, CATEGORIES, CATEGORY_COLORS, RETAILERS_LIST } from "./data.js";
import ProductCatalog from "./ProductCatalog.jsx";

// ─── Shared components ────────────────────────────────────────────────────────
function StatusBadge({ raw }) {
  const s = getStatus(raw);
  return (
    <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 99,
      background: s.bg, color: s.color, whiteSpace: "nowrap" }}>{s.label}</span>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ skus }) {
  const total = skus.length;
  const active = skus.filter(s => s.status && (s.status.includes("CURRENT") || s.status.includes("AWARDED")) && !s.status.toLowerCase().includes("dropping") && !s.status.includes("DROPPED")).length;
  const dropping = skus.filter(s => s.status && (s.status.toLowerCase().includes("dropping") || s.status.includes("DROPPED"))).length;
  const passed = skus.filter(s => s.status && s.status.toUpperCase().includes("PASSED")).length;
  const priced = skus.filter(s => s.price);
  const avgPrice = priced.length ? priced.reduce((a, b) => a + b.price, 0) / priced.length : 0;
  const withPromo = skus.filter(s => s.promo).length;

  const catBreakdown = CATEGORIES.map(cat => ({
    name: cat.replace("Waffle Licensed", "Licensed").replace("Griddle/Skillet", "Griddle"),
    count: skus.filter(s => s.category === cat).length,
    fill: CATEGORY_COLORS[cat] || "#888",
  })).sort((a, b) => b.count - a.count);

  const statusBreakdown = [
    { name: "Active", value: active, fill: "#059669" },
    { name: "Dropping", value: dropping, fill: "#b45309" },
    { name: "Passed", value: passed, fill: "#dc2626" },
    { name: "50/50", value: skus.filter(s => s.status === "50% Probability").length, fill: "#7c3aed" },
  ].filter(d => d.value > 0);

  const priceRanges = [
    { range: "$0–15", count: skus.filter(s => s.price && s.price < 15).length },
    { range: "$15–30", count: skus.filter(s => s.price && s.price >= 15 && s.price < 30).length },
    { range: "$30–50", count: skus.filter(s => s.price && s.price >= 30 && s.price < 50).length },
    { range: "$50+", count: skus.filter(s => s.price && s.price >= 50).length },
  ];

  const replenCount = skus.filter(s => s.buyType && s.buyType.includes("REPLEN")).length;
  const dropInCount = skus.filter(s => s.buyType === "DROP IN").length;
  const droppingItems = skus.filter(s => s.status && (s.status.toLowerCase().includes("dropping") || s.status.includes("DROPPED")));

  return (
    <div>
      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Total SKUs", value: total, icon: "ti-box", accent: "#7F77DD" },
          { label: "Active / Awarded", value: active, icon: "ti-circle-check", accent: "#059669" },
          { label: "Avg Retail Price", value: `$${avgPrice.toFixed(2)}`, icon: "ti-tag", accent: "#0369a1" },
          { label: "Dropping Sept '26", value: dropping, icon: "ti-trending-down", accent: "#b45309" },
          { label: "With Promo Price", value: withPromo, icon: "ti-percentage", accent: "#D85A30" },
          { label: "Passed / Not Awarded", value: passed, icon: "ti-circle-x", accent: "#dc2626" },
        ].map(kpi => (
          <div key={kpi.label} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: kpi.accent + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className={`ti ${kpi.icon}`} style={{ fontSize: 13, color: kpi.accent }} aria-hidden="true" />
              </div>
              <span style={{ fontSize: 10, color: "var(--color-text-secondary)", fontWeight: 500 }}>{kpi.label}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, color: "var(--color-text-primary)" }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: 16 }}>
          <h3 style={{ fontSize: 12, fontWeight: 500, margin: "0 0 12px", color: "var(--color-text-secondary)" }}>SKUs by category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={catBreakdown} layout="vertical" barCategoryGap="20%">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={72} tick={{ fontSize: 10, fill: "var(--color-text-secondary)" }} />
              <Tooltip formatter={v => [v, "SKUs"]} contentStyle={{ fontSize: 11, borderRadius: 8, border: "0.5px solid var(--color-border-secondary)" }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {catBreakdown.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: 16 }}>
          <h3 style={{ fontSize: 12, fontWeight: 500, margin: "0 0 8px", color: "var(--color-text-secondary)" }}>Status breakdown</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={statusBreakdown} dataKey="value" cx="50%" cy="50%" outerRadius={65} innerRadius={35} paddingAngle={2}>
                {statusBreakdown.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v + " SKUs", n]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 10px" }}>
            {statusBreakdown.map(s => (
              <span key={s.name} style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 4, color: "var(--color-text-secondary)" }}>
                <span style={{ width: 7, height: 7, borderRadius: 2, background: s.fill, display: "inline-block" }} />
                {s.name} ({s.value})
              </span>
            ))}
          </div>
        </div>

        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: 16 }}>
          <h3 style={{ fontSize: 12, fontWeight: 500, margin: "0 0 8px", color: "var(--color-text-secondary)" }}>Price architecture</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={priceRanges} barCategoryGap="25%">
              <XAxis dataKey="range" tick={{ fontSize: 10 }} />
              <YAxis hide />
              <Tooltip formatter={v => [v + " SKUs", "Count"]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Bar dataKey="count" fill="#7F77DD" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "0.5px solid var(--color-border-tertiary)" }}>
            <span style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>Replen: <strong>{replenCount}</strong></span>
            <span style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>Drop-in: <strong>{dropInCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Alert panel */}
      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid #fcd34d", borderRadius: 12, padding: 16 }}>
        <h3 style={{ fontSize: 12, fontWeight: 500, margin: "0 0 12px", color: "#92400e", display: "flex", alignItems: "center", gap: 6 }}>
          <i className="ti ti-alert-triangle" style={{ color: "#b45309" }} aria-hidden="true" />
          Action required — items dropping Sept 2026 ({droppingItems.length})
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
          {droppingItems.map(s => (
            <div key={s.sku} style={{ background: "var(--color-background-warning)", border: "0.5px solid #fcd34d", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#92400e", marginBottom: 2, fontFamily: "var(--font-mono)" }}>{s.sku}</div>
              <div style={{ fontSize: 12, color: "#78350f", fontWeight: 500 }}>{s.name}</div>
              <div style={{ fontSize: 10, color: "#b45309", marginTop: 4 }}>
                <span style={{ background: CATEGORY_COLORS[s.category] + "30", color: CATEGORY_COLORS[s.category], padding: "1px 5px", borderRadius: 4, marginRight: 5 }}>{s.category}</span>
                {s.price ? `$${s.price.toFixed(2)}` : "N/A"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Assortment Grid ──────────────────────────────────────────────────────────
function AssortmentGrid({ skus }) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortKey, setSortKey] = useState("category");
  const [sortDir, setSortDir] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const statusGroups = ["All", "Active", "Awarded", "Dropping", "Passed", "50/50"];

  const filtered = useMemo(() => {
    return skus.filter(s => {
      const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCat === "All" || s.category === filterCat;
      const matchStatus = filterStatus === "All" || getStatus(s.status).label === filterStatus;
      return matchSearch && matchCat && matchStatus;
    }).sort((a, b) => {
      let av = a[sortKey] ?? "", bv = b[sortKey] ?? "";
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      return av < bv ? -sortDir : av > bv ? sortDir : 0;
    });
  }, [skus, search, filterCat, filterStatus, sortKey, sortDir]);

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => -d);
    else { setSortKey(key); setSortDir(1); }
  }

  const ColHeader = ({ label, k, width }) => (
    <th onClick={() => toggleSort(k)} style={{ cursor: "pointer", whiteSpace: "nowrap", fontSize: 10, fontWeight: 500, color: "var(--color-text-secondary)", padding: "7px 10px", textAlign: "left", userSelect: "none", background: "var(--color-background-secondary)", position: "sticky", top: 0, zIndex: 1, width }}>
      {label} {sortKey === k ? (sortDir > 0 ? "↑" : "↓") : ""}
    </th>
  );

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <i className="ti ti-search" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "var(--color-text-tertiary)" }} aria-hidden="true" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search SKU or name…" style={{ paddingLeft: 32, width: "100%", boxSizing: "border-box", fontSize: 12 }} />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ fontSize: 12 }}>
          <option>All</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ fontSize: 12 }}>
          {statusGroups.map(s => <option key={s}>{s}</option>)}
        </select>
        <span style={{ fontSize: 11, color: "var(--color-text-secondary)", marginLeft: "auto" }}>
          {filtered.length} / {skus.length} SKUs
          {selected.size > 0 && <span style={{ marginLeft: 8, color: "#7F77DD" }}>· {selected.size} selected</span>}
        </span>
      </div>

      <div style={{ overflowX: "auto", borderRadius: 10, border: "0.5px solid var(--color-border-tertiary)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th style={{ width: 36, padding: "7px 10px", background: "var(--color-background-secondary)", position: "sticky", top: 0, zIndex: 1 }}>
                <input type="checkbox" onChange={e => setSelected(e.target.checked ? new Set(filtered.map(s => s.sku)) : new Set())} checked={selected.size === filtered.length && filtered.length > 0} />
              </th>
              <ColHeader label="SKU" k="sku" width={130} />
              <ColHeader label="Product" k="name" width={190} />
              <ColHeader label="Category" k="category" width={110} />
              <ColHeader label="Color" k="color" width={80} />
              <ColHeader label="Retail" k="price" width={70} />
              <ColHeader label="Promo" k="promo" width={70} />
              <ColHeader label="Marquee" k="marquee" width={75} />
              <ColHeader label="Buy Type" k="buyType" width={90} />
              <ColHeader label="Placement" k="placement" width={105} />
              <ColHeader label="Doors" k="doors" width={65} />
              <ColHeader label="Status" k="status" width={100} />
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.sku} style={{ background: selected.has(s.sku) ? "rgba(127,119,221,0.07)" : i % 2 === 0 ? "var(--color-background-primary)" : "var(--color-background-secondary)" }}>
                <td style={{ padding: "6px 10px", textAlign: "center" }}>
                  <input type="checkbox" checked={selected.has(s.sku)} onChange={() => { const n = new Set(selected); n.has(s.sku) ? n.delete(s.sku) : n.add(s.sku); setSelected(n); }} />
                </td>
                <td style={{ padding: "6px 10px", fontFamily: "var(--font-mono)", fontSize: 10, color: "#7F77DD", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.sku}</td>
                <td style={{ padding: "6px 10px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={s.name}>{s.name}</td>
                <td style={{ padding: "6px 10px" }}>
                  <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 99, background: (CATEGORY_COLORS[s.category] || "#888") + "20", color: CATEGORY_COLORS[s.category] || "#888", fontWeight: 500 }}>{s.category}</span>
                </td>
                <td style={{ padding: "6px 10px", color: "var(--color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 11 }}>{s.color || "—"}</td>
                <td style={{ padding: "6px 10px", fontWeight: 500 }}>{s.price ? `$${s.price.toFixed(2)}` : "—"}</td>
                <td style={{ padding: "6px 10px", color: "#059669" }}>{s.promo ? `$${s.promo.toFixed(2)}` : "—"}</td>
                <td style={{ padding: "6px 10px", color: "#b45309" }}>{s.marquee ? `$${s.marquee.toFixed(2)}` : "—"}</td>
                <td style={{ padding: "6px 10px", color: "var(--color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 11 }}>{s.buyType || "—"}</td>
                <td style={{ padding: "6px 10px", color: "var(--color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 11 }}>{s.placement || "—"}</td>
                <td style={{ padding: "6px 10px", color: "var(--color-text-secondary)", fontSize: 11 }}>{s.doors?.toLocaleString() || "—"}</td>
                <td style={{ padding: "6px 10px" }}><StatusBadge raw={s.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "var(--color-text-secondary)", fontSize: 13 }}>
            <i className="ti ti-search-off" style={{ fontSize: 24, display: "block", marginBottom: 8 }} aria-hidden="true" />
            No SKUs match your filters.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Retailer Planning ────────────────────────────────────────────────────────
function RetailerPlanning({ skus }) {
  const [view, setView] = useState("scorecard");

  const replen = skus.filter(s => s.buyType && s.buyType.includes("REPLEN") && s.status && (s.status.includes("CURRENT") || s.status.includes("AWARDED")) && !s.status.toLowerCase().includes("dropping") && !s.status.includes("DROPPED"));
  const dropIn = skus.filter(s => s.buyType === "DROP IN" && s.status && s.status.includes("AWARDED"));
  const dropping = skus.filter(s => s.status && (s.status.toLowerCase().includes("dropping") || s.status.includes("DROPPED")));

  const placementGroups = {};
  skus.filter(s => s.placement).forEach(s => {
    const p = s.placement;
    if (!placementGroups[p]) placementGroups[p] = [];
    placementGroups[p].push(s);
  });
  const placements = Object.entries(placementGroups).sort((a, b) => b[1].length - a[1].length);

  const timelinePeriods = [
    { label: "Jan – Feb (Q1)", timing: ["Jan 11", "Jan WK", "Feb WK"] },
    { label: "Mar – Jun (Q2)", timing: ["Mar WK", "Mar Wk", "BTS 2026", "Spring"] },
    { label: "Jul – Sep (Q3)", timing: ["9/7", "Summer", "C5"] },
    { label: "Oct – Dec (Q4 / C6)", timing: ["C6", "Q4", "11/9", "Holiday"] },
  ];

  return (
    <div>
      {/* Scorecard header */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <div style={{ background: "#1a1a2e", borderRadius: 10, padding: "14px 18px", color: "white", minWidth: 140 }}>
          <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 4 }}>Retailer</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Target</div>
          <div style={{ fontSize: 10, opacity: 0.5, marginTop: 2 }}>2026 Assortment Plan</div>
        </div>
        {[
          { label: "Replen SKUs", value: replen.length, icon: "ti-repeat", color: "#059669" },
          { label: "Drop-in Events", value: dropIn.length, icon: "ti-calendar-event", color: "#0369a1" },
          { label: "Dropping Items", value: dropping.length, icon: "ti-trending-down", color: "#b45309" },
          { label: "Placement Types", value: Object.keys(placementGroups).length, icon: "ti-layout", color: "#7F77DD" },
        ].map(m => (
          <div key={m.label} style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "14px 18px", flex: 1, minWidth: 100 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <i className={`ti ${m.icon}`} style={{ fontSize: 13, color: m.color }} aria-hidden="true" />
              <span style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>{m.label}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* View tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {["scorecard", "placements", "timeline"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{ fontSize: 12, fontWeight: 500, background: view === v ? "#7F77DD" : "var(--color-background-secondary)", color: view === v ? "white" : "var(--color-text-secondary)", border: `0.5px solid ${view === v ? "#7F77DD" : "var(--color-border-tertiary)"}` }}>
            {v === "scorecard" ? "Scorecard" : v === "placements" ? "Placements" : "Timeline"}
          </button>
        ))}
      </div>

      {view === "scorecard" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { title: "Replenishment items", icon: "ti-refresh", color: "#059669", items: replen },
            { title: "Drop-in events", icon: "ti-calendar-plus", color: "#0369a1", items: dropIn },
          ].map(col => (
            <div key={col.title} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: 14 }}>
              <h3 style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                <i className={`ti ${col.icon}`} style={{ color: col.color }} aria-hidden="true" />{col.title} ({col.items.length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {col.items.slice(0, 8).map(s => (
                  <div key={s.sku} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", background: "var(--color-background-secondary)", borderRadius: 8 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{s.name}</div>
                      <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{s.sku} · {s.timing || s.placement || "—"}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{s.price ? `$${s.price.toFixed(2)}` : "—"}</div>
                      {s.doors && <div style={{ fontSize: 10, color: "#0369a1" }}>{s.doors.toLocaleString()} doors</div>}
                    </div>
                  </div>
                ))}
                {col.items.length > 8 && <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", textAlign: "center" }}>+{col.items.length - 8} more</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "placements" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
          {placements.map(([placement, items]) => (
            <div key={placement} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 500 }}>{placement}</span>
                <span style={{ fontSize: 10, background: "#7F77DD20", color: "#7F77DD", borderRadius: 99, padding: "2px 8px" }}>{items.length}</span>
              </div>
              {items.slice(0, 4).map(s => (
                <div key={s.sku} style={{ fontSize: 11, color: "var(--color-text-secondary)", padding: "3px 0", borderBottom: "0.5px solid var(--color-border-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.name}
                </div>
              ))}
              {items.length > 4 && <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>+{items.length - 4} more</div>}
            </div>
          ))}
        </div>
      )}

      {view === "timeline" && (
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: 16 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)" }}>2026 Calendar</h3>
          {timelinePeriods.map(period => {
            const items = skus.filter(s => s.timing && period.timing.some(t => s.timing.includes(t)));
            return (
              <div key={period.label} style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#7F77DD", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <i className="ti ti-calendar" style={{ fontSize: 12 }} aria-hidden="true" />{period.label}
                  <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", fontWeight: 400 }}>({items.length})</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {items.length > 0 ? items.map(s => (
                    <span key={s.sku} style={{ fontSize: 10, padding: "3px 10px", borderRadius: 99, background: (CATEGORY_COLORS[s.category] || "#888") + "18", color: CATEGORY_COLORS[s.category] || "#888", border: `0.5px solid ${(CATEGORY_COLORS[s.category] || "#888")}40` }}>
                      {s.name}
                    </span>
                  )) : <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>No events mapped</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── SKU Rationalization ──────────────────────────────────────────────────────
function SkuRationalization({ skus }) {
  const dropping = skus.filter(s => s.status && (s.status.toLowerCase().includes("dropping") || s.status.includes("DROPPED")));
  const passed = skus.filter(s => s.status && s.status.toUpperCase().includes("PASSED"));
  const noPromo = skus.filter(s => s.price && s.price >= 30 && !s.promo && s.status && s.status.includes("CURRENT") && !s.status.toLowerCase().includes("dropping"));
  const highPrice = skus.filter(s => s.price && s.price >= 79.99);
  const tbdSku = skus.filter(s => s.sku && s.sku.startsWith("TBD"));

  const groups = [
    { label: "Dropping Sept 2026", items: dropping, severity: "high", icon: "ti-trash", tip: "Identify replacement SKUs and communicate discontinuation timelines to buyers." },
    { label: "Passed — not awarded", items: passed, severity: "medium", icon: "ti-circle-x", tip: "Review for potential resubmission in future line reviews or alternate channels." },
    { label: "No promo price ($30+)", items: noPromo, severity: "low", icon: "ti-percentage", tip: "Consider adding promotional pricing for high-volume Q4 event windows." },
    { label: "Premium SKUs ($80+)", items: highPrice, severity: "info", icon: "ti-star", tip: "Monitor velocity carefully — premium items need strong display and demo support." },
    { label: "TBD SKU numbers", items: tbdSku, severity: "medium", icon: "ti-hash", tip: "Finalize item setup and assign permanent SKU numbers before buyer submissions." },
  ];

  const colors = { high: "#dc2626", medium: "#b45309", low: "#0369a1", info: "#7F77DD" };
  const bgs = { high: "#fee2e2", medium: "#fef3c7", low: "#dbeafe", info: "#ede9fe" };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginBottom: 20 }}>
        {groups.map(g => (
          <div key={g.label} style={{ background: "var(--color-background-primary)", border: `0.5px solid ${colors[g.severity]}40`, borderRadius: 12, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
              <div style={{ background: bgs[g.severity], borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className={`ti ${g.icon}`} style={{ fontSize: 15, color: colors[g.severity] }} aria-hidden="true" />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{g.label}</div>
                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 2 }}>{g.items.length} SKUs</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)", background: "var(--color-background-secondary)", borderRadius: 6, padding: "7px 10px", marginBottom: 10, fontStyle: "italic", lineHeight: 1.4 }}>
              {g.tip}
            </div>
            {g.items.slice(0, 5).map(s => (
              <div key={s.sku} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "0.5px solid var(--color-border-tertiary)", fontSize: 11 }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 150 }}>{s.name}</span>
                <span style={{ color: "var(--color-text-secondary)", flexShrink: 0, marginLeft: 8 }}>{s.price ? `$${s.price.toFixed(2)}` : "—"}</span>
              </div>
            ))}
            {g.items.length > 5 && <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", textAlign: "center", paddingTop: 6 }}>+{g.items.length - 5} more</div>}
          </div>
        ))}
      </div>

      {/* Health by category */}
      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: 16 }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)" }}>
          <i className="ti ti-heart-rate-monitor" style={{ marginRight: 6, color: "#7F77DD" }} aria-hidden="true" />
          Assortment health by category
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CATEGORIES.map(cat => {
            const total = skus.filter(s => s.category === cat).length;
            const activeN = skus.filter(s => s.category === cat && s.status && (s.status.includes("CURRENT") || s.status.includes("AWARDED")) && !s.status.toLowerCase().includes("dropping") && !s.status.includes("DROPPED")).length;
            const droppingN = skus.filter(s => s.category === cat && s.status && (s.status.toLowerCase().includes("dropping") || s.status.includes("DROPPED"))).length;
            const pct = total > 0 ? Math.round((activeN / total) * 100) : 0;
            const score = pct >= 75 ? "Healthy" : pct >= 50 ? "At risk" : "Critical";
            const scoreColor = pct >= 75 ? "#059669" : pct >= 50 ? "#b45309" : "#dc2626";
            return (
              <div key={cat} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, width: 130, color: "var(--color-text-secondary)", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cat}</span>
                <div style={{ flex: 1, background: "var(--color-background-secondary)", borderRadius: 99, height: 7, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, background: CATEGORY_COLORS[cat], height: "100%", borderRadius: 99, transition: "width 0.3s" }} />
                </div>
                <span style={{ fontSize: 10, width: 55, textAlign: "right", color: "var(--color-text-tertiary)" }}>{activeN}/{total}</span>
                <span style={{ fontSize: 10, width: 48, textAlign: "right", color: scoreColor, fontWeight: 500 }}>{score}</span>
                {droppingN > 0 && <span style={{ fontSize: 9, color: "#b45309" }}>-{droppingN} dropping</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── AI Copilot ───────────────────────────────────────────────────────────────
function AICopilot({ skus }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm your assortment planning assistant. Ask me anything about your Target 2026 plan — SKU status, pricing strategy, what's dropping, or what to pitch next." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const systemPrompt = `You are an expert assortment planning assistant for a consumer products company. You have the Target 2026 plan:
Total: ${skus.length} SKUs across categories: ${CATEGORIES.join(", ")}.
Active: ${skus.filter(s => s.status && s.status.includes("CURRENT") && !s.status.toLowerCase().includes("drop")).length}
Dropping Sept 2026: ${skus.filter(s => s.status && (s.status.toLowerCase().includes("dropping") || s.status.includes("DROPPED"))).length}
Awarded: ${skus.filter(s => s.status && s.status.includes("AWARDED")).length}
Passed: ${skus.filter(s => s.status && s.status.toUpperCase().includes("PASSED")).length}
SKUs: ${JSON.stringify(skus.slice(0, 35).map(s => ({ sku: s.sku, name: s.name, category: s.category, price: s.price, status: s.status, buyType: s.buyType, placement: s.placement, doors: s.doors })))}
Be concise and actionable. Use bullet points for lists.`;

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 800,
          system: systemPrompt,
          messages: messages.filter((m, idx) => idx > 0 || m.role !== "assistant").map(m => ({ role: m.role, content: m.text })).concat([{ role: "user", content: userMsg }]),
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", text: data.content?.[0]?.text || "Could not process. Try again." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Connection error. Try again." }]);
    }
    setLoading(false);
  }

  const suggestions = ["Which SKUs are dropping fall 2026?", "What items have no promo price?", "Show C6 drop-in events", "Which categories are healthiest?", "What should I pitch next?"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: 520 }}>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            {msg.role === "assistant" && (
              <div style={{ width: 26, height: 26, borderRadius: 8, background: "#7F77DD", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className="ti ti-robot" style={{ fontSize: 13, color: "white" }} aria-hidden="true" />
              </div>
            )}
            <div style={{ maxWidth: "80%", padding: "9px 13px", borderRadius: msg.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px", background: msg.role === "user" ? "#7F77DD" : "var(--color-background-secondary)", color: msg.role === "user" ? "white" : "var(--color-text-primary)", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: "#7F77DD", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="ti ti-robot" style={{ fontSize: 13, color: "white" }} aria-hidden="true" />
            </div>
            <div style={{ padding: "9px 13px", background: "var(--color-background-secondary)", borderRadius: "12px 12px 12px 3px", fontSize: 12, color: "var(--color-text-secondary)" }}>
              Analyzing your assortment…
            </div>
          </div>
        )}
      </div>
      <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 12 }}>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
          {suggestions.map(s => (
            <button key={s} onClick={() => setInput(s)} style={{ fontSize: 10, padding: "3px 9px", borderRadius: 99, background: "var(--color-background-secondary)", color: "var(--color-text-secondary)", border: "0.5px solid var(--color-border-tertiary)" }}>
              {s}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Ask about your assortment…" style={{ flex: 1, fontSize: 13 }} />
          <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ background: "#7F77DD", color: "white", border: "none", fontWeight: 500, fontSize: 13, opacity: (loading || !input.trim()) ? 0.5 : 1 }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
const MODULES = [
  { id: "dashboard", label: "Dashboard", icon: "ti-layout-dashboard" },
  { id: "grid", label: "Assortment grid", icon: "ti-table" },
  { id: "retailer", label: "Retailer planning", icon: "ti-building-store" },
  { id: "sku", label: "SKU rationalization", icon: "ti-filter" },
  { id: "catalog", label: "Product catalog", icon: "ti-box" },
  { id: "ai", label: "AI copilot", icon: "ti-robot" },
];

export default function App() {
  const [active, setActive] = useState("dashboard");
  const current = MODULES.find(m => m.id === active);

  const moduleContent = {
    dashboard: <Dashboard skus={RAW_SKUS} />,
    grid: <AssortmentGrid skus={RAW_SKUS} />,
    retailer: <RetailerPlanning skus={RAW_SKUS} />,
    sku: <SkuRationalization skus={RAW_SKUS} />,
    catalog: <ProductCatalog skus={RAW_SKUS} />,
    ai: <AICopilot skus={RAW_SKUS} />,
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "var(--font-sans)", background: "var(--color-background-tertiary)", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: 200, background: "#1a1a2e", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "18px 16px 14px", borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, background: "#7F77DD", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="ti ti-chart-treemap" style={{ fontSize: 15, color: "white" }} aria-hidden="true" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "white", letterSpacing: "-0.01em" }}>AssortIQ</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Assortment planning</div>
            </div>
          </div>
        </div>

        <nav style={{ padding: "10px 8px", flex: 1 }}>
          {MODULES.map(m => (
            <button key={m.id} onClick={() => setActive(m.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 11px", borderRadius: 8, marginBottom: 2, background: active === m.id ? "rgba(127,119,221,0.22)" : "transparent", color: active === m.id ? "#b4aef5" : "rgba(255,255,255,0.5)", border: `0.5px solid ${active === m.id ? "rgba(127,119,221,0.35)" : "transparent"}`, cursor: "pointer", textAlign: "left", fontSize: 12, transition: "all 0.12s" }}>
              <i className={`ti ${m.icon}`} style={{ fontSize: 14, flexShrink: 0 }} aria-hidden="true" />
              {m.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "12px 16px", borderTop: "0.5px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.07em" }}>Active plan</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>Target 2026</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{RAW_SKUS.length} SKUs tracked</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ background: "var(--color-background-primary)", borderBottom: "0.5px solid var(--color-border-tertiary)", padding: "10px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <i className={`ti ${current?.icon}`} style={{ fontSize: 15, color: "#7F77DD" }} aria-hidden="true" />
            <h1 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--color-text-primary)" }}>{current?.label}</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", background: "var(--color-background-secondary)", padding: "3px 10px", borderRadius: 99, border: "0.5px solid var(--color-border-tertiary)", display: "flex", alignItems: "center", gap: 5 }}>
              <i className="ti ti-building-store" style={{ fontSize: 11 }} aria-hidden="true" />Target · 2026
            </span>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "#7F77DD20", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="ti ti-user" style={{ fontSize: 14, color: "#7F77DD" }} aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Module area */}
        <div style={{ flex: 1, overflowY: "auto", padding: 22 }}>
          {moduleContent[active]}
        </div>
      </div>
    </div>
  );
}
