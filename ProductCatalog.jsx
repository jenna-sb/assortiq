import { useState, useRef, useCallback } from "react";
import { CATEGORIES, CATEGORY_COLORS, RETAILERS_LIST, getStatus } from "./data.js";

const FIELD_SECTIONS = [
  {
    title: "Core Identity",
    fields: [
      { key: "sku", label: "SKU", type: "text" },
      { key: "name", label: "Product Name", type: "text" },
      { key: "category", label: "Category", type: "select", options: CATEGORIES },
      { key: "color", label: "Color", type: "text" },
      { key: "status", label: "Status", type: "text" },
      { key: "keyCallout", label: "Key Callout", type: "text" },
    ],
  },
  {
    title: "Selling Points",
    fields: [
      { key: "sp1", label: "Top Selling Point 1", type: "text" },
      { key: "sp2", label: "Top Selling Point 2", type: "text" },
      { key: "sp3", label: "Top Selling Point 3", type: "text" },
    ],
  },
  {
    title: "Perfect For",
    fields: [
      { key: "pf1", label: "Perfect For 1", type: "text" },
      { key: "pf2", label: "Perfect For 2", type: "text" },
      { key: "pf3", label: "Perfect For 3", type: "text" },
      { key: "pf4", label: "Perfect For 4", type: "text" },
    ],
  },
  {
    title: "Pricing & Costs",
    fields: [
      { key: "price", label: "Retail Price", type: "number" },
      { key: "cost", label: "Cost (landed)", type: "number" },
      { key: "promo", label: "Promo Price", type: "number" },
      { key: "marquee", label: "Marquee Price", type: "number" },
    ],
  },
  {
    title: "Supply Chain",
    fields: [
      { key: "casepack", label: "Casepack", type: "number" },
      { key: "containerQty", label: "40' HQ Container Qty", type: "number" },
      { key: "moqColor", label: "MOQ / Color", type: "number" },
      { key: "moqOrder", label: "MOQ / Order", type: "number" },
      { key: "availDate", label: "Available Date", type: "text" },
    ],
  },
  {
    title: "Marketing",
    fields: [
      { key: "packagingCallout", label: "Packaging Callout", type: "text" },
      { key: "addOn", label: "Add On", type: "text" },
      { key: "claimBadge", label: "Claim Badge", type: "text" },
    ],
  },
  {
    title: "Product Details",
    fields: [
      { key: "pd1", label: "Product Detail 1", type: "text" },
      { key: "pd2", label: "Product Detail 2", type: "text" },
      { key: "pd3", label: "Product Detail 3", type: "text" },
      { key: "pd4", label: "Product Detail 4", type: "text" },
      { key: "pd5", label: "Product Detail 5", type: "text" },
    ],
  },
];

function MarginCalculator({ sku }) {
  const retail = parseFloat(sku.price) || 0;
  const cost = parseFloat(sku.cost) || 0;
  if (!retail) return null;
  const margin = cost > 0 ? ((retail - cost) / retail) * 100 : null;
  const markup = cost > 0 ? ((retail - cost) / cost) * 100 : null;
  return (
    <div style={{ background: "rgba(127,119,221,0.08)", border: "0.5px solid rgba(127,119,221,0.3)", borderRadius: 10, padding: "12px 14px", marginTop: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#7F77DD", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
        <i className="ti ti-chart-line" aria-hidden="true" /> Live Margin Calculator
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: "var(--color-text-primary)" }}>${retail.toFixed(2)}</div>
          <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Retail</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: cost > 0 ? "var(--color-text-primary)" : "var(--color-text-tertiary)" }}>
            {cost > 0 ? `$${cost.toFixed(2)}` : "—"}
          </div>
          <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Cost</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: margin !== null ? (margin >= 40 ? "#059669" : margin >= 25 ? "#b45309" : "#dc2626") : "var(--color-text-tertiary)" }}>
            {margin !== null ? `${margin.toFixed(1)}%` : "—"}
          </div>
          <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Margin</div>
        </div>
      </div>
      {markup !== null && (
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: "0.5px solid rgba(127,119,221,0.2)", fontSize: 11, color: "var(--color-text-secondary)", textAlign: "center" }}>
          Markup: {markup.toFixed(1)}% · Gross profit: ${(retail - cost).toFixed(2)}
        </div>
      )}
    </div>
  );
}

function SKUEditModal({ sku, onSave, onClose }) {
  const [form, setForm] = useState({ ...sku });
  const fileRef = useRef();

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function setRetailer(r, checked) {
    setForm(f => ({ ...f, retailers: { ...f.retailers, [r]: checked } }));
  }

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => set("photo", ev.target.result);
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "var(--color-background-primary)", borderRadius: 14, width: "100%", maxWidth: 700, maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden", border: "0.5px solid var(--color-border-secondary)" }}>
        {/* Modal header */}
        <div style={{ padding: "16px 20px", borderBottom: "0.5px solid var(--color-border-tertiary)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Edit SKU</div>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>{sku.sku}</div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", padding: 4, fontSize: 18, color: "var(--color-text-secondary)", cursor: "pointer" }}>
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: "auto", padding: "16px 20px", flex: 1 }}>
          {/* Photo upload */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Product Photo</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: 10, overflow: "hidden", background: CATEGORY_COLORS[form.category] + "15", display: "flex", alignItems: "center", justifyContent: "center", border: "0.5px solid var(--color-border-tertiary)", flexShrink: 0 }}>
                {form.photo
                  ? <img src={form.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <i className="ti ti-photo" style={{ fontSize: 24, color: CATEGORY_COLORS[form.category] || "#7F77DD", opacity: 0.5 }} aria-hidden="true" />
                }
              </div>
              <div>
                <button onClick={() => fileRef.current.click()} style={{ fontSize: 12, marginBottom: 6, display: "block" }}>
                  <i className="ti ti-upload" style={{ marginRight: 6 }} aria-hidden="true" />Upload photo
                </button>
                {form.photo && (
                  <button onClick={() => set("photo", null)} style={{ fontSize: 12, color: "#dc2626", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>Remove</button>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
              </div>
            </div>
          </div>

          {/* Field sections */}
          {FIELD_SECTIONS.map(section => (
            <div key={section.title} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em", paddingBottom: 6, borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                {section.title}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px" }}>
                {section.fields.map(f => (
                  <div key={f.key} style={{ gridColumn: ["keyCallout", "pd1","pd2","pd3","pd4","pd5"].includes(f.key) ? "span 2" : undefined }}>
                    <label style={{ fontSize: 11, color: "var(--color-text-tertiary)", display: "block", marginBottom: 3 }}>{f.label}</label>
                    {f.type === "select" ? (
                      <select value={form[f.key] || ""} onChange={e => set(f.key, e.target.value)} style={{ width: "100%", fontSize: 12 }}>
                        {f.options.map(o => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input
                        type={f.type}
                        step={f.type === "number" ? "0.01" : undefined}
                        value={form[f.key] ?? ""}
                        onChange={e => set(f.key, f.type === "number" ? (e.target.value === "" ? null : parseFloat(e.target.value)) : e.target.value)}
                        style={{ width: "100%", fontSize: 12 }}
                      />
                    )}
                  </div>
                ))}
              </div>
              {section.title === "Pricing & Costs" && <MarginCalculator sku={form} />}
            </div>
          ))}

          {/* Retailer checkboxes */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em", paddingBottom: 6, borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
              Retailer Distribution
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {RETAILERS_LIST.map(r => (
                <label key={r} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: `0.5px solid ${form.retailers?.[r] ? "#7F77DD" : "var(--color-border-secondary)"}`, background: form.retailers?.[r] ? "rgba(127,119,221,0.1)" : "var(--color-background-secondary)", cursor: "pointer", fontSize: 12, fontWeight: 500, userSelect: "none" }}>
                  <input type="checkbox" checked={!!form.retailers?.[r]} onChange={e => setRetailer(r, e.target.checked)} style={{ width: 14, height: 14, accentColor: "#7F77DD" }} />
                  {r}
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em", paddingBottom: 6, borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
              Notes
            </div>
            <textarea value={form.notes || ""} onChange={e => set("notes", e.target.value)} rows={3} style={{ width: "100%", resize: "vertical", fontSize: 12 }} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: "0.5px solid var(--color-border-tertiary)", display: "flex", justifyContent: "flex-end", gap: 8, flexShrink: 0 }}>
          <button onClick={onClose} style={{ fontSize: 12 }}>Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} style={{ background: "#7F77DD", color: "white", border: "none", fontSize: 12, fontWeight: 500 }}>
            <i className="ti ti-check" style={{ marginRight: 6 }} aria-hidden="true" />Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

function CSVImportModal({ onImport, onClose }) {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const TEMPLATE_HEADERS = [
    "sku","name","category","color","price","cost","casepack","containerQty","moqColor","moqOrder","availDate",
    "keyCallout","sp1","sp2","sp3","pf1","pf2","pf3","pf4",
    "packagingCallout","addOn","claimBadge","pd1","pd2","pd3","pd4","pd5",
    "promo","marquee","status","notes","timing","buyType","placement","doors"
  ];

  function downloadTemplate() {
    const csv = TEMPLATE_HEADERS.join(",") + "\n" +
      "DMW00111,Mini Waffle Maker,Waffle,Aqua,10.99,4.50,12,800,500,1000,2026-01-15,No mess design,Compact,Non-stick,Easy clean,Breakfast lovers,Kids,,,,,,,,,,,,,CURRENT - CF 2027,,Awarded POG Fall 2025,REPLEN,IN LINE,1800";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "assortiq_template.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  function parseCSV(text) {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
    return lines.slice(1).map(line => {
      const vals = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
      const obj = {};
      headers.forEach((h, i) => { obj[h] = vals[i] || ""; });
      return obj;
    });
  }

  function handleFile(e) {
    setError("");
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const rows = parseCSV(ev.target.result);
        if (!rows.length || !rows[0].sku) { setError("Invalid CSV — missing 'sku' column."); return; }
        setPreview(rows);
      } catch {
        setError("Could not parse CSV. Please use the template.");
      }
    };
    reader.readAsText(file);
  }

  function applyImport() {
    const skus = preview.map(row => ({
      ...row,
      price: parseFloat(row.price) || null,
      cost: parseFloat(row.cost) || null,
      promo: parseFloat(row.promo) || null,
      marquee: parseFloat(row.marquee) || null,
      casepack: parseInt(row.casepack) || null,
      containerQty: parseInt(row.containerQty) || null,
      moqColor: parseInt(row.moqColor) || null,
      moqOrder: parseInt(row.moqOrder) || null,
      doors: parseInt(row.doors) || null,
      retailers: { Target: true, Walmart: false, Costco: false, Amazon: false, "Macy's": false },
      photo: null,
    }));
    onImport(skus);
    onClose();
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "var(--color-background-primary)", borderRadius: 14, width: "100%", maxWidth: 560, border: "0.5px solid var(--color-border-secondary)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "0.5px solid var(--color-border-tertiary)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Import from CSV</div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", fontSize: 18, color: "var(--color-text-secondary)", cursor: "pointer" }}>
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ background: "rgba(127,119,221,0.08)", border: "0.5px solid rgba(127,119,221,0.2)", borderRadius: 10, padding: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#7F77DD", marginBottom: 6 }}>Step 1 — Download the template</div>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 10 }}>
              Download our Excel-compatible CSV template with all 25 product fields pre-labeled. Fill it in and upload below.
            </div>
            <button onClick={downloadTemplate} style={{ fontSize: 12, background: "#7F77DD", color: "white", border: "none" }}>
              <i className="ti ti-download" style={{ marginRight: 6 }} aria-hidden="true" />Download template (.csv)
            </button>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 8 }}>Step 2 — Upload completed file</div>
            <div
              onClick={() => fileRef.current.click()}
              style={{ border: "1.5px dashed var(--color-border-secondary)", borderRadius: 10, padding: 24, textAlign: "center", cursor: "pointer", background: "var(--color-background-secondary)" }}
            >
              <i className="ti ti-file-upload" style={{ fontSize: 28, color: "var(--color-text-tertiary)", display: "block", marginBottom: 8 }} aria-hidden="true" />
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Click to select a CSV file</div>
              <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>Supports .csv, .txt (comma-delimited)</div>
            </div>
            <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFile} style={{ display: "none" }} />
          </div>

          {error && <div style={{ fontSize: 12, color: "#dc2626", marginBottom: 12, padding: "8px 12px", background: "#fee2e2", borderRadius: 8 }}>{error}</div>}

          {preview && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#059669", marginBottom: 8 }}>
                <i className="ti ti-circle-check" style={{ marginRight: 6 }} aria-hidden="true" />
                {preview.length} SKUs ready to import
              </div>
              <div style={{ maxHeight: 160, overflowY: "auto", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 8 }}>
                {preview.slice(0, 8).map((row, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", borderBottom: "0.5px solid var(--color-border-tertiary)", fontSize: 11 }}>
                    <span style={{ fontFamily: "var(--font-mono)", color: "#7F77DD" }}>{row.sku || "—"}</span>
                    <span style={{ color: "var(--color-text-secondary)" }}>{row.name || "—"}</span>
                    <span style={{ color: "var(--color-text-tertiary)" }}>{row.price ? `$${parseFloat(row.price).toFixed(2)}` : "—"}</span>
                  </div>
                ))}
                {preview.length > 8 && <div style={{ padding: "6px 10px", fontSize: 11, color: "var(--color-text-tertiary)" }}>+{preview.length - 8} more rows</div>}
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button onClick={onClose} style={{ fontSize: 12 }}>Cancel</button>
            <button onClick={applyImport} disabled={!preview} style={{ background: preview ? "#7F77DD" : "var(--color-background-secondary)", color: preview ? "white" : "var(--color-text-tertiary)", border: "none", fontSize: 12, fontWeight: 500 }}>
              <i className="ti ti-file-import" style={{ marginRight: 6 }} aria-hidden="true" />Import {preview?.length || ""} SKUs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AssortmentChip({ icon, label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <i className={`ti ${icon}`} style={{ fontSize: 10, color: "var(--color-text-tertiary)", flexShrink: 0 }} aria-hidden="true" />
      <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{label}:</span>
      <span style={{ fontSize: 10, color: "var(--color-text-secondary)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
    </div>
  );
}

function SKUCard({ sku, retailer, onEdit }) {
  const catColor = CATEGORY_COLORS[sku.category] || "#7F77DD";
  const s = getStatus(sku.status);
  const margin = sku.cost && sku.price ? ((sku.price - sku.cost) / sku.price * 100).toFixed(1) : null;
  const showAssortment = retailer && retailer !== "All";

  return (
    <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Photo */}
      <div style={{ height: 88, background: sku.photo ? "transparent" : catColor + "15", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        {sku.photo
          ? <img src={sku.photo} alt={sku.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <i className="ti ti-photo" style={{ fontSize: 28, color: catColor, opacity: 0.3 }} aria-hidden="true" />
            </div>
        }
      </div>

      <div style={{ padding: "10px 12px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: catColor, marginBottom: 2, fontWeight: 500 }}>{sku.sku}</div>
        <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3, marginBottom: 3 }}>{sku.name}</div>
        {sku.keyCallout && <div style={{ fontSize: 10, color: "var(--color-text-secondary)", marginBottom: 5, fontStyle: "italic", lineHeight: 1.3 }}>{sku.keyCallout}</div>}

        {/* Selling points */}
        {[sku.sp1, sku.sp2, sku.sp3].some(Boolean) && (
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: showAssortment ? 8 : 6 }}>
            {[sku.sp1, sku.sp2, sku.sp3].filter(Boolean).map((sp, i) => (
              <span key={i} style={{ fontSize: 9, padding: "1px 5px", borderRadius: 99, background: catColor + "18", color: catColor, fontWeight: 500 }}>{sp}</span>
            ))}
          </div>
        )}

        {/* Retailer-specific assortment data */}
        {showAssortment && (
          <div style={{ background: "var(--color-background-secondary)", borderRadius: 7, padding: "7px 9px", marginBottom: 8, display: "flex", flexDirection: "column", gap: 3 }}>
            <AssortmentChip icon="ti-layout" label="Placement" value={sku.placement} />
            <AssortmentChip icon="ti-door" label="Doors" value={sku.doors ? sku.doors.toLocaleString() : null} />
            <AssortmentChip icon="ti-calendar" label="Timing" value={sku.timing} />
            <AssortmentChip icon="ti-repeat" label="Buy type" value={sku.buyType} />
          </div>
        )}

        {/* Price + status row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "auto" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{sku.price ? `$${sku.price.toFixed(2)}` : "—"}</div>
            {margin && <div style={{ fontSize: 9, color: parseFloat(margin) >= 40 ? "#059669" : "#b45309" }}>{margin}% margin</div>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 99, background: s.bg, color: s.color, fontWeight: 500 }}>{s.label}</span>
            <button onClick={() => onEdit(sku)} style={{ fontSize: 10, padding: "2px 8px", background: "transparent", border: "0.5px solid var(--color-border-secondary)", color: "var(--color-text-tertiary)", borderRadius: 6, cursor: "pointer" }}>
              <i className="ti ti-edit" style={{ fontSize: 10, marginRight: 3 }} aria-hidden="true" />Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const RETAILER_ICONS = {
  "Target": "ti-target",
  "Walmart": "ti-building-store",
  "Costco": "ti-building-warehouse",
  "Amazon": "ti-brand-amazon",
  "Macy's": "ti-shopping-bag",
};

export default function ProductCatalog({ skus: initialSkus }) {
  const [skus, setSkus] = useState(initialSkus);
  const [retailer, setRetailer] = useState("All");
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [importing, setImporting] = useState(false);

  // When a retailer tab is active, only show SKUs assigned to that retailer
  const retailerFiltered = retailer === "All"
    ? skus
    : skus.filter(s => s.retailers?.[retailer]);

  const filtered = retailerFiltered.filter(s =>
    (cat === "All" || s.category === cat) &&
    (!search || s.name.toLowerCase().includes(search.toLowerCase()) || s.sku.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSave = useCallback((updated) => {
    setSkus(prev => prev.map(s => s.sku === updated.sku ? updated : s));
  }, []);

  const handleImport = useCallback((imported) => {
    setSkus(prev => {
      const existingSkus = new Set(prev.map(s => s.sku));
      const newOnes = imported.filter(s => !existingSkus.has(s.sku));
      const updated = prev.map(s => {
        const match = imported.find(i => i.sku === s.sku);
        return match ? { ...s, ...match } : s;
      });
      return [...updated, ...newOnes];
    });
  }, []);

  // Reset category filter when switching retailers so stale filters don't hide cards
  function selectRetailer(r) {
    setRetailer(r);
    setCat("All");
  }

  const categoriesInView = [...new Set(retailerFiltered.map(s => s.category))];

  return (
    <div>
      {/* ── Retailer tabs ── */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
        {["All", ...RETAILERS_LIST].map(r => {
          const count = r === "All" ? skus.length : skus.filter(s => s.retailers?.[r]).length;
          const isActive = retailer === r;
          return (
            <button
              key={r}
              onClick={() => selectRetailer(r)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px",
                background: "transparent",
                border: "none",
                borderBottom: isActive ? "2px solid #7F77DD" : "2px solid transparent",
                color: isActive ? "#7F77DD" : "var(--color-text-secondary)",
                fontWeight: isActive ? 600 : 400,
                fontSize: 12,
                cursor: "pointer",
                marginBottom: -1,
                whiteSpace: "nowrap",
                transition: "color 0.12s",
              }}
            >
              {r !== "All" && <i className={`ti ${RETAILER_ICONS[r] || "ti-building-store"}`} style={{ fontSize: 13 }} aria-hidden="true" />}
              {r}
              <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 99, background: isActive ? "#7F77DD20" : "var(--color-background-secondary)", color: isActive ? "#7F77DD" : "var(--color-text-tertiary)", fontWeight: 500 }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Toolbar ── */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
          <i className="ti ti-search" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "var(--color-text-tertiary)" }} aria-hidden="true" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search${retailer !== "All" ? ` ${retailer}` : ""} products…`} style={{ paddingLeft: 32, width: "100%", boxSizing: "border-box", fontSize: 12 }} />
        </div>
        <button onClick={() => setImporting(true)} style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <i className="ti ti-file-import" aria-hidden="true" />Import CSV
        </button>
        <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{filtered.length} products</span>
      </div>

      {/* ── Category pills (scoped to current retailer view) ── */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 16 }}>
        <button onClick={() => setCat("All")} style={{ fontSize: 11, padding: "3px 11px", borderRadius: 99, background: cat === "All" ? "#7F77DD" : "var(--color-background-secondary)", color: cat === "All" ? "white" : "var(--color-text-secondary)", border: `0.5px solid ${cat === "All" ? "#7F77DD" : "var(--color-border-tertiary)"}` }}>
          All ({retailerFiltered.length})
        </button>
        {categoriesInView.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{ fontSize: 11, padding: "3px 11px", borderRadius: 99, background: cat === c ? CATEGORY_COLORS[c] : "var(--color-background-secondary)", color: cat === c ? "white" : "var(--color-text-secondary)", border: `0.5px solid ${cat === c ? CATEGORY_COLORS[c] : "var(--color-border-tertiary)"}` }}>
            {c} ({retailerFiltered.filter(s => s.category === c).length})
          </button>
        ))}
      </div>

      {/* ── Cards grid ── */}
      {filtered.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12 }}>
          {filtered.map(sku => (
            <SKUCard key={sku.sku} sku={sku} retailer={retailer} onEdit={setEditing} />
          ))}
        </div>
      ) : (
        <div style={{ padding: "60px 0", textAlign: "center", color: "var(--color-text-tertiary)" }}>
          <i className="ti ti-building-store" style={{ fontSize: 32, display: "block", marginBottom: 10, opacity: 0.4 }} aria-hidden="true" />
          <div style={{ fontSize: 13, marginBottom: 4 }}>No products in {retailer} assortment</div>
          <div style={{ fontSize: 11 }}>Select SKUs in the edit modal to add them to this retailer.</div>
        </div>
      )}

      {editing && <SKUEditModal sku={editing} onSave={handleSave} onClose={() => setEditing(null)} />}
      {importing && <CSVImportModal onImport={handleImport} onClose={() => setImporting(false)} />}
    </div>
  );
}
