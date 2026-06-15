import { useState, useMemo, useRef } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ─── Data from Target_Assortment_2026.xlsx ───────────────────────────────────
const RAW_SKUS = [
  { sku: "DMW00111", name: "Mini Waffle Maker", category: "Waffle", color: "Aqua", price: 10.99, promo: null, marquee: null, timing: "Awarded POG Fall 2025", buyType: "REPLEN", placement: "IN LINE", doors: 1800, status: "CURRENT - CF 2027", notes: "" },
  { sku: "DMW00112", name: "Mini Waffle Maker", category: "Waffle", color: "Lilac", price: 10.99, promo: null, marquee: null, timing: "Awarded POG Fall 2025", buyType: "REPLEN", placement: "IN LINE", doors: 1800, status: "CURRENT - CF 2027", notes: "" },
  { sku: "DNMWM40003", name: "No Mess Waffle Maker", category: "Waffle", color: "Graphite", price: 49.99, promo: null, marquee: null, timing: "Awarded POG Fall 2025", buyType: "REPLEN", placement: "IN LINE", doors: 1200, status: "CURRENT - CF 2027", notes: "" },
  { sku: "DIW026GBAQ04", name: "Multimaker", category: "Waffle", color: "Aqua", price: 29.99, promo: null, marquee: null, timing: "Awarded POG Fall 2025", buyType: "REPLEN", placement: "IN LINE", doors: 1200, status: "CURRENT - CF 2027", notes: "" },
  { sku: "DBWM60CGBCM02", name: "Flip Belgian Waffle", category: "Waffle", color: "Cream", price: 49.99, promo: 39.99, marquee: 24.99, timing: "Awarded POG Fall 2025", buyType: "REPLEN", placement: "IN LINE", doors: 1200, status: "CURRENT - CF 2027", notes: "Also awarded C6 Endcap" },
  { sku: "DMW00201", name: "2pk Holiday Mini Makers", category: "Waffle", color: "Cream", price: 19.99, promo: 17.99, marquee: 14.99, timing: "C6 2026", buyType: "DROP IN", placement: "Endcap", doors: null, status: "AWARDED 3/23/26", notes: "" },
  { sku: "DIW024GBRD04", name: "Multimaker Disney Mickey", category: "Waffle Licensed", color: "Red", price: 34.99, promo: 29.99, marquee: 24.99, timing: "Awarded POG Fall 2025", buyType: "REPLEN", placement: "IN LINE", doors: 1800, status: "CURRENT - CF 2027", notes: "" },
  { sku: "DIWD024GBBU4", name: "Multimaker Disney Stitch", category: "Waffle Licensed", color: "Blue", price: 49.99, promo: 39.99, marquee: 29.99, timing: "Awarded POG Fall 2025", buyType: "REPLEN", placement: "IN LINE", doors: null, status: "CURRENT - BEING DROPPED SEPT 2026", notes: "" },
  { sku: "DIWDY22CD06", name: "2pk Mickey Heads", category: "Waffle Licensed", color: null, price: 12.99, promo: null, marquee: null, timing: "Awarded POG Fall 2025", buyType: "REPLEN", placement: "IN LINE", doors: 1800, status: "CURRENT - CF 2027", notes: "" },
  { sku: "DMW00106", name: "Pooh Mini Maker (Ceramic)", category: "Waffle Licensed", color: "Cream", price: 12.99, promo: null, marquee: null, timing: "Jan 11 - Apr 5", buyType: "DROP IN", placement: "POOH CLUBHOUSE", doors: 250, status: "AWARDED", notes: "" },
  { sku: "DMW00110", name: "Sweethearts Mini Waffle I LUV U", category: "Waffle Licensed", color: "Purple", price: 12.99, promo: null, marquee: null, timing: "Jan WK 1 - Feb WK 2", buyType: "DROP IN", placement: "SIDE CAP", doors: null, status: "AWARDED", notes: "" },
  { sku: "DMW00108", name: "Sweethearts Mini Waffle XOXO", category: "Waffle Licensed", color: "Pink", price: 12.99, promo: null, marquee: null, timing: "Jan WK 1 - Feb WK 2", buyType: "DROP IN", placement: "SIDE CAP", doors: null, status: "AWARDED", notes: "" },
  { sku: "DMW00104", name: "Peeps Bunny Mini Waffle Maker", category: "Waffle Licensed", color: "Pink", price: 12.99, promo: null, marquee: null, timing: "Feb WK 3 - Mar WK 4", buyType: "DROP IN", placement: "SIDE CAP", doors: null, status: "AWARDED", notes: "" },
  { sku: "DMW00103", name: "Peeps Chick Mini Waffle Maker", category: "Waffle Licensed", color: "Yellow", price: 12.99, promo: null, marquee: null, timing: "Feb WK 3 - Mar WK 4", buyType: "DROP IN", placement: "SIDE CAP", doors: null, status: "AWARDED", notes: "" },
  { sku: "DMW10007", name: "Moana Mini Waffle Maker", category: "Waffle Licensed", color: "Teal", price: 12.99, promo: null, marquee: null, timing: "Mar WK 5 - Sept WK 2", buyType: "DROP IN", placement: "SIDE CAP", doors: 1300, status: "AWARDED", notes: "" },
  { sku: "DMW10008", name: "Buzz Lightyear Mini Waffle Maker", category: "Waffle Licensed", color: "Blue", price: 12.99, promo: null, marquee: null, timing: "Mar WK 5 - Sept WK 2", buyType: "DROP IN", placement: "SIDE CAP", doors: 1300, status: "AWARDED", notes: "" },
  { sku: "DPNMWV001GR", name: "Peanuts Snoopy Vampire Mini Waffle", category: "Waffle Licensed", color: "Green", price: 14.99, promo: 12.99, marquee: 9.99, timing: "9/7-10/25", buyType: "DROP IN", placement: "SIDE CAP", doors: 1700, status: "AWARDED", notes: "" },
  { sku: "DPNMWP001OR", name: "Peanuts Snoopy Jack-O Mini Waffle", category: "Waffle Licensed", color: "Orange", price: 14.99, promo: 12.99, marquee: 9.99, timing: "9/7-10/25", buyType: "DROP IN", placement: "SIDE CAP", doors: 1700, status: "AWARDED", notes: "" },
  { sku: "DMW10011", name: "Jack Skellington Mini Waffle Maker", category: "Waffle Licensed", color: "Black", price: 14.99, promo: 12.99, marquee: 9.99, timing: "9/7-10/25", buyType: "DROP IN", placement: "SIDE CAP", doors: 1700, status: "AWARDED 3/24/26", notes: "" },
  { sku: "DMW10012", name: "Belle Mini Waffle Maker", category: "Waffle Licensed", color: "Purple", price: 14.99, promo: 12.99, marquee: 9.99, timing: "9/7 - End Dec", buyType: "DROP IN", placement: "SIDE CAP", doors: 1300, status: "AWARDED 3/24/26", notes: "" },
  { sku: "DMW10013", name: "Cinderella Mini Waffle Maker", category: "Waffle Licensed", color: "Pink", price: 14.99, promo: 12.99, marquee: 9.99, timing: "9/7 - End Dec", buyType: "DROP IN", placement: "SIDE CAP", doors: 1300, status: "AWARDED 3/24/26", notes: "" },
  { sku: "DMW10014", name: "Mickey Mini Waffle Maker", category: "Waffle Licensed", color: "Blue", price: 14.99, promo: 12.99, marquee: 9.99, timing: "9/7 - End Dec", buyType: "DROP IN", placement: "SIDE CAP", doors: 1300, status: "AWARDED 3/24/26", notes: "" },
  { sku: "DMW10016", name: "Mickey Holiday Mini Waffle Maker", category: "Waffle Licensed", color: "Printed Lid", price: 14.99, promo: 12.99, marquee: 9.99, timing: "11/9-1/10", buyType: "DROP IN", placement: "STOP N SHOP", doors: 250, status: "AWARDED 3/18/26", notes: "" },
  { sku: "DMW10017", name: "Pooh Mini Maker Holiday (Ceramic)", category: "Waffle Licensed", color: "Printed Lid", price: 14.99, promo: 12.99, marquee: 9.99, timing: "11/9-1/10", buyType: "DROP IN", placement: "STOP N SHOP", doors: 250, status: "AWARDED 3/18/26", notes: "" },
  { sku: "DEC005TB", name: "Everyday Egg Cooker", category: "Egg", color: "Black", price: 19.99, promo: null, marquee: null, timing: "Awarded POG Fall 2025", buyType: "REPLEN", placement: "IN LINE", doors: null, status: "DROPPED SEPT 2026", notes: "" },
  { sku: "DBBM400GBAQ04", name: "Egg Bite Maker", category: "Egg", color: "Aqua", price: 21.99, promo: null, marquee: null, timing: "Awarded POG Fall 2025", buyType: "REPLEN", placement: "IN LINE", doors: null, status: "CURRENT - BEING DROPPED SEPT 2026", notes: "" },
  { sku: "DECB212GBBK01", name: "Deluxe Egg Cooker", category: "Egg", color: "Black", price: 29.99, promo: 24.99, marquee: null, timing: "Awarded POG Fall 2025", buyType: "REPLEN", placement: "IN LINE", doors: 1200, status: "CURRENT - CF 2027", notes: "" },
  { sku: "TBD-EGG-EX", name: "Express Egg Cooker", category: "Egg", color: "Cream", price: 19.99, promo: 17.99, marquee: 14.99, timing: "Fall 26 - Replace DEC005TB", buyType: "REPLEN", placement: "IN LINE", doors: 1800, status: "AWARDED FALL RESET ON 3/23/26", notes: "" },
  { sku: "DMIC100GBLA04", name: "My Mug Ice Cream Maker", category: "Frozen Treats", color: "Lilac", price: 29.99, promo: null, marquee: null, timing: "Awarded POG Fall 2025", buyType: "REPLEN", placement: "IN LINE", doors: 1800, status: "CURRENT", notes: "" },
  { sku: "DSIM200GBCM04", name: "Deluxe Shaved Ice & Slushy", category: "Frozen Treats", color: "Cream", price: 39.99, promo: 29.99, marquee: null, timing: "Awarded POG Fall 2025", buyType: "REPLEN", placement: "IN LINE", doors: 1700, status: "CURRENT - CF 2027", notes: "" },
  { sku: "DMIC700AQ", name: "Everyday Ice Cream Maker", category: "Frozen Treats", color: "White/Aqua", price: 39.99, promo: 29.99, marquee: null, timing: "Summer Treats 2026", buyType: "DROP IN", placement: "Endcap", doors: null, status: "AWARDED", notes: "" },
  { sku: "DPIC10001", name: "My Pint (Cream)", category: "Frozen Treats", color: "Cream", price: 19.99, promo: 17.99, marquee: 14.99, timing: "C6 2026", buyType: "REPLEN/DROP IN", placement: "IN LINE/ENDCAP", doors: null, status: "AWARDED 3/23/26", notes: "" },
  { sku: "DPIC10002", name: "My Pint (Pastel Pink)", category: "Frozen Treats", color: "Pastel Pink", price: 19.99, promo: 17.99, marquee: 14.99, timing: "C6 2026", buyType: "DROP IN", placement: "C6 ENDCAP", doors: null, status: "AWARDED 3/23/26", notes: "" },
  { sku: "DAPP150V2AQ04", name: "Fresh Pop 16 Cup", category: "Treats", color: "Aqua", price: 24.99, promo: null, marquee: null, timing: "Awarded POG Fall 2025", buyType: "REPLEN", placement: "IN LINE", doors: null, status: "CURRENT - BEING DROPPED SEPT 2026", notes: "" },
  { sku: "DSSP30001", name: "6QT Smartstore Popcorn", category: "Treats", color: "Aqua", price: 49.99, promo: null, marquee: null, timing: "Awarded POG Fall 2025", buyType: "REPLEN", placement: "IN LINE", doors: null, status: "DROPPED SEPT 2026", notes: "" },
  { sku: "DIM813GBCM04", name: "Multi Plate Treat Maker", category: "Treats", color: "Cream", price: 49.99, promo: null, marquee: null, timing: "Awarded POG Fall 2025", buyType: "REPLEN", placement: "IN LINE", doors: null, status: "CURRENT - BEING DROPPED SEPT 2026", notes: "" },
  { sku: "DCCM00101", name: "Cotton Candy", category: "Treats", color: "Cream", price: 39.99, promo: 29.99, marquee: 19.99, timing: "POG Fall 2026", buyType: "REPLEN/DROP IN", placement: "IN LINE/ENDCAP", doors: null, status: "CURRENT - CF 2027", notes: "" },
  { sku: "DCFN00101", name: "Sauce Fountain", category: "Treats", color: "Cream", price: 39.99, promo: 29.99, marquee: 19.99, timing: "POG Fall 2026", buyType: "REPLEN/DROP IN", placement: "IN LINE/ENDCAP", doors: null, status: "CURRENT - CF 2027", notes: "" },
  { sku: "DSMR00101", name: "Smores", category: "Treats", color: "Cream", price: 39.99, promo: 29.99, marquee: 19.99, timing: "POG Fall 2026", buyType: "REPLEN/DROP IN", placement: "IN LINE/ENDCAP", doors: null, status: "CURRENT - CF 2027", notes: "" },
  { sku: "DHAP10001", name: "Express Popcorn Maker 10 Cup", category: "Treats", color: "Cream", price: 19.99, promo: null, marquee: null, timing: "Fall 26 Replace Fresh Pop", buyType: "REPLEN/DROP IN", placement: "IN LINE/ENDCAP", doors: 1800, status: "AWARDED FALL RESET ON 3/23/26", notes: "" },
  { sku: "DSSP30003", name: "6QT Stirring Popcorn Ceramic", category: "Treats", color: "Cream", price: 49.99, promo: 39.99, marquee: 24.99, timing: "Fall 26 Replace Current Aqua", buyType: "REPLEN", placement: "IN LINE", doors: 1800, status: "AWARDED FALL RESET ON 3/23/26", notes: "" },
  { sku: "DFM30001", name: "Fondue Maker", category: "Treats", color: "Cream", price: 39.99, promo: null, marquee: 19.99, timing: "Fall 26 replace treat system", buyType: "REPLEN", placement: "IN LINE", doors: 1000, status: "AWARDED FALL RESET ON 3/23/26", notes: "" },
  { sku: "DAPP15002", name: "Disney Pooh Fresh Pop", category: "Treats", color: "Cream", price: 34.99, promo: null, marquee: null, timing: "Jan 11 - Apr 5", buyType: "DROP IN", placement: "POOH CLUBHOUSE", doors: 250, status: "AWARDED", notes: "" },
  { sku: "DPC50002", name: "Mickey Popcano", category: "Treats", color: "Red/Black", price: 49.99, promo: 39.99, marquee: 29.99, timing: "C6", buyType: "DROP IN", placement: "Endcap", doors: null, status: "PASSED 3/4/26", notes: "" },
  { sku: "DPC50001", name: "Jack Popcano", category: "Treats", color: "Black", price: 49.99, promo: 39.99, marquee: 29.99, timing: "C6", buyType: "DROP IN", placement: "Endcap", doors: null, status: "PASSED 3/4/26", notes: "" },
  { sku: "DTSM370GBCC1", name: "3.5QT Stand Mixer", category: "Mixing", color: "Cream", price: 79.99, promo: null, marquee: 39.99, timing: "Awarded POG Fall 2025", buyType: "REPLEN", placement: "IN LINE", doors: 1400, status: "CURRENT - CF 2027", notes: "" },
  { sku: "DRCM20002", name: "Mini Rice Cooker 2 Cup", category: "Cookers", color: "Graphite", price: 24.99, promo: null, marquee: null, timing: null, buyType: null, placement: "IN LINE", doors: null, status: "CURRENT - BEING DROPPED SEPT 2026", notes: "" },
  { sku: "DRCM20007", name: "Mini Rice Cooker 2 Cup (Rose)", category: "Cookers", color: "Rose", price: 24.99, promo: null, marquee: null, timing: "BTS 2026", buyType: "DROP IN", placement: "Endcap", doors: 200, status: "AWARDED", notes: "" },
  { sku: "DRCM20008", name: "Mini Rice Cooker 2 Cup (Blue)", category: "Cookers", color: "Blue (NEW)", price: 24.99, promo: null, marquee: null, timing: "BTS 2026", buyType: "DROP IN", placement: "Endcap", doors: 200, status: "AWARDED", notes: "" },
  { sku: "DRCM20009", name: "Mini Rice Cooker 2 Cup (Taupe)", category: "Cookers", color: "Taupe", price: 24.99, promo: null, marquee: null, timing: "BTS 2026", buyType: "DROP IN", placement: "Endcap", doors: 200, status: "AWARDED", notes: "" },
  { sku: "DMTO100GBAQ04", name: "Mini Toaster Oven", category: "Toast", color: "Aqua", price: 29.99, promo: null, marquee: null, timing: "Awarded POG Fall 2025", buyType: "REPLEN", placement: "IN LINE", doors: null, status: "CURRENT - BEING DROPPED SEPT 2026", notes: "" },
  { sku: "DVTS501CM", name: "Clear View Toaster", category: "Toast", color: "Cream", price: 49.99, promo: 39.99, marquee: 24.99, timing: null, buyType: "REPLEN", placement: "IN LINE", doors: null, status: "50% Probability", notes: "" },
  { sku: "JB065WH", name: "Citrus Juicer", category: "Beverage", color: "White", price: 19.99, promo: 17.99, marquee: 14.99, timing: "Awarded POG Fall 2025", buyType: "REPLEN", placement: "IN LINE", doors: 1000, status: "CURRENT - CF 2027", notes: "" },
  { sku: "DCBM10SGBCM4", name: "Cold Brew", category: "Beverage", color: null, price: null, promo: null, marquee: null, timing: null, buyType: null, placement: null, doors: null, status: "CURRENT - BEING DROPPED SEPT 2026", notes: "" },
  { sku: "DAFG75GBGY01", name: "Flip N Fry 7QT", category: "Air Fry", color: null, price: 99.99, promo: null, marquee: null, timing: "Awarded POG Fall 2025", buyType: "REPLEN", placement: "IN LINE", doors: null, status: "CURRENT - BEING DROPPED SEPT 2026", notes: "" },
  { sku: "DCAF80001", name: "8QT Tasti Crisp Max", category: "Air Fry", color: null, price: 79.99, promo: null, marquee: 39.99, timing: "Awarded POG Fall 2025", buyType: "REPLEN", placement: "IN LINE", doors: null, status: "dropping fall 2026", notes: "" },
  { sku: "DAFR26001GY", name: "2.6QT Digital Infrared", category: "Air Fry", color: null, price: 69.99, promo: 59.99, marquee: 49.99, timing: null, buyType: "REPLEN", placement: "IN LINE", doors: null, status: "PASSED 3/4/26", notes: "" },
  { sku: "DFAFR60001", name: "6QT Digital Infrared", category: "Air Fry", color: null, price: 99.99, promo: 79.99, marquee: 59.99, timing: null, buyType: "Replace Flip N Fry", placement: "IN LINE", doors: null, status: "Passed 3/25", notes: "" },
  { sku: "DEG20CGBCM01", name: "Ceramic Everyday Griddle", category: "Griddle/Skillet", color: "Cream", price: 49.99, promo: 39.99, marquee: 24.99, timing: "Awarded POG Fall 2025", buyType: "REPLEN", placement: "IN LINE", doors: null, status: "CURRENT - BEING DROPPED SEPT 2026", notes: "" },
  { sku: "DIG024GBGY04", name: "Flex Press Grill", category: "Griddle/Skillet", color: "Graphite", price: 49.99, promo: 39.99, marquee: null, timing: "Q4", buyType: "DROP IN", placement: "Endcap", doors: null, status: "PASSED", notes: "" },
];

const EMPTY_CATALOG = {
  photo: null,
  keyCallout: "",
  sellingPoint1: "", sellingPoint2: "", sellingPoint3: "",
  perfectFor1: "", perfectFor2: "", perfectFor3: "", perfectFor4: "",
  cost: "",
  casepack: "",
  containerQty40HQ: "",
  moqColor: "",
  moqOrder: "",
  availableDate: "",
  packagingCallout: "",
  addOn: "",
  claimBadge: "",
  detail1: "", detail2: "", detail3: "", detail4: "", detail5: "",
};

const STATUS_CONFIG = {
  "CURRENT - CF 2027": { label: "Active", color: "#059669", bg: "#d1fae5" },
  "CURRENT": { label: "Active", color: "#059669", bg: "#d1fae5" },
  "AWARDED": { label: "Awarded", color: "#0369a1", bg: "#dbeafe" },
  "AWARDED 3/23/26": { label: "Awarded", color: "#0369a1", bg: "#dbeafe" },
  "AWARDED 3/24/26": { label: "Awarded", color: "#0369a1", bg: "#dbeafe" },
  "AWARDED 3/18/26": { label: "Awarded", color: "#0369a1", bg: "#dbeafe" },
  "AWARDED FALL RESET ON 3/23/26": { label: "Awarded", color: "#0369a1", bg: "#dbeafe" },
  "CURRENT - BEING DROPPED SEPT 2026": { label: "Dropping", color: "#b45309", bg: "#fef3c7" },
  "DROPPED SEPT 2026": { label: "Dropped", color: "#9ca3af", bg: "#f3f4f6" },
  "dropping fall 2026": { label: "Dropping", color: "#b45309", bg: "#fef3c7" },
  "PASSED 3/4/26": { label: "Passed", color: "#dc2626", bg: "#fee2e2" },
  "PASSED 3/25": { label: "Passed", color: "#dc2626", bg: "#fee2e2" },
  "PASSED": { label: "Passed", color: "#dc2626", bg: "#fee2e2" },
  "50% Probability": { label: "50/50", color: "#7c3aed", bg: "#ede9fe" },
};

function getStatus(raw) {
  if (!raw) return { label: "Unknown", color: "#9ca3af", bg: "#f3f4f6" };
  return STATUS_CONFIG[raw] || { label: raw.split(" ")[0], color: "#9ca3af", bg: "#f3f4f6" };
}

const CATEGORIES = [...new Set(RAW_SKUS.map(s => s.category))];

const CATEGORY_COLORS = {
  "Waffle": "#7F77DD", "Waffle Licensed": "#D85A30", "Egg": "#1D9E75",
  "Frozen Treats": "#378ADD", "Treats": "#EF9F27", "Mixing": "#D4537E",
  "Cookers": "#639922", "Toast": "#888780", "Beverage": "#BA7517",
  "Air Fry": "#E24B4A", "Griddle/Skillet": "#0F6E56"
};

const PERFECT_FOR_ICONS = [
  { label: "Families", icon: "ti-users" },
  { label: "Gifting", icon: "ti-gift" },
  { label: "Beginners", icon: "ti-star" },
  { label: "Small kitchen", icon: "ti-home" },
  { label: "Kids", icon: "ti-mood-happy" },
  { label: "Entertaining", icon: "ti-confetti" },
  { label: "Meal prep", icon: "ti-clock" },
  { label: "Licensed fans", icon: "ti-heart" },
];

// ─── Editable Field ───────────────────────────────────────────────────────────
function EditableField({ label, value, onChange, placeholder, multiline, small }) {
  return (
    <div style={{ marginBottom: small ? 6 : 10 }}>
      {label && <div style={{ fontSize: 10, fontWeight: 500, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>{label}</div>}
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || label}
          rows={2}
          style={{ width: "100%", resize: "vertical", fontSize: 12, padding: "6px 8px",
            background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)",
            borderRadius: 6, color: "var(--color-text-primary)", fontFamily: "var(--font-sans)" }}
        />
      ) : (
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || label}
          style={{ width: "100%", fontSize: 12, padding: "5px 8px",
            background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)",
            borderRadius: 6, color: "var(--color-text-primary)" }}
        />
      )}
    </div>
  );
}

// ─── Catalog Card Modal ───────────────────────────────────────────────────────
function CatalogCardModal({ sku, onClose, catalogData, onSave }) {
  const [data, setData] = useState({ ...EMPTY_CATALOG, ...catalogData });
  const [activeTab, setActiveTab] = useState("overview");
  const fileRef = useRef();
  const accentColor = CATEGORY_COLORS[sku.category] || "#7F77DD";

  function update(key, val) { setData(prev => ({ ...prev, [key]: val })); }

  function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => update("photo", ev.target.result);
    reader.readAsDataURL(file);
  }

  const tabs = ["overview", "selling points", "logistics", "details"];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
      <div style={{ background: "var(--color-background-primary)", borderRadius: 16, width: "100%", maxWidth: 780, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 24px 48px rgba(0,0,0,0.2)" }}>

        {/* Header */}
        <div style={{ background: accentColor, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginBottom: 2 }}>{sku.category} · {sku.sku}</div>
            <div style={{ fontSize: 18, fontWeight: 500, color: "white" }}>{sku.name}</div>
            {sku.color && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{sku.color}</div>}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => { onSave(data); onClose(); }} style={{ background: "white", color: accentColor, border: "none", borderRadius: 8, padding: "6px 16px", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
              <i className="ti ti-check" style={{ marginRight: 4 }} aria-hidden="true" />Save
            </button>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}>
              <i className="ti ti-x" style={{ fontSize: 14 }} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "0.5px solid var(--color-border-tertiary)", padding: "0 20px", background: "var(--color-background-secondary)" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: "10px 14px", fontSize: 12, fontWeight: 500, border: "none", borderRadius: 0,
              background: "transparent", cursor: "pointer",
              color: activeTab === t ? accentColor : "var(--color-text-secondary)",
              borderBottom: activeTab === t ? `2px solid ${accentColor}` : "2px solid transparent",
              marginBottom: -1
            }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>

          {activeTab === "overview" && (
            <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 }}>
              {/* Photo upload */}
              <div>
                <div
                  onClick={() => fileRef.current.click()}
                  style={{ width: "100%", aspectRatio: "1", borderRadius: 12, border: `2px dashed ${accentColor}40`,
                    background: data.photo ? "transparent" : accentColor + "08",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", overflow: "hidden", position: "relative" }}
                >
                  {data.photo ? (
                    <img src={data.photo} alt="Product" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  ) : (
                    <>
                      <i className="ti ti-camera" style={{ fontSize: 28, color: accentColor, opacity: 0.5 }} aria-hidden="true" />
                      <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 8, textAlign: "center" }}>Click to upload<br />product photo</div>
                    </>
                  )}
                  {data.photo && (
                    <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.5)", borderRadius: 6, padding: 4, cursor: "pointer" }}
                      onClick={e => { e.stopPropagation(); update("photo", null); }}>
                      <i className="ti ti-trash" style={{ fontSize: 12, color: "white" }} aria-hidden="true" />
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />

                {/* Pricing from assortment */}
                <div style={{ marginTop: 14, background: "var(--color-background-secondary)", borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 500, color: "var(--color-text-tertiary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Pricing</div>
                  {[
                    { label: "Retail", value: sku.price ? `$${sku.price.toFixed(2)}` : "—", color: "var(--color-text-primary)" },
                    { label: "Promo", value: sku.promo ? `$${sku.promo.toFixed(2)}` : "—", color: "#059669" },
                    { label: "Marquee", value: sku.marquee ? `$${sku.marquee.toFixed(2)}` : "—", color: "#b45309" },
                  ].map(p => (
                    <div key={p.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{p.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: p.color }}>{p.value}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 8, marginTop: 4 }}>
                    <EditableField label="Cost" value={data.cost} onChange={v => update("cost", v)} placeholder="$0.00" small />
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div>
                <EditableField label="Key callout (under product name)" value={data.keyCallout} onChange={v => update("keyCallout", v)} placeholder="e.g. Makes 4 waffles at once" />
                <EditableField label="Claim badge" value={data.claimBadge} onChange={v => update("claimBadge", v)} placeholder="e.g. #1 Best Seller · Award Winner" />
                <EditableField label="Packaging callout" value={data.packagingCallout} onChange={v => update("packagingCallout", v)} placeholder="e.g. Dishwasher Safe · BPA Free" />
                <EditableField label="Add-on / bundle item" value={data.addOn} onChange={v => update("addOn", v)} placeholder="e.g. Includes recipe booklet" />

                <div style={{ marginTop: 4 }}>
                  <div style={{ fontSize: 10, fontWeight: 500, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Perfect for</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {[1, 2, 3, 4].map(n => (
                      <select key={n} value={data[`perfectFor${n}`]} onChange={e => update(`perfectFor${n}`, e.target.value)}
                        style={{ fontSize: 12, padding: "5px 8px", borderRadius: 6, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)", color: "var(--color-text-primary)" }}>
                        <option value="">— Icon {n} —</option>
                        {PERFECT_FOR_ICONS.map(icon => <option key={icon.label} value={icon.label}>{icon.label}</option>)}
                      </select>
                    ))}
                  </div>
                </div>

                {/* Status + timing from assortment */}
                <div style={{ marginTop: 14, background: "var(--color-background-secondary)", borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 500, color: "var(--color-text-tertiary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Assortment info</div>
                  {[
                    { label: "Status", value: getStatus(sku.status).label },
                    { label: "Placement", value: sku.placement || "—" },
                    { label: "Buy type", value: sku.buyType || "—" },
                    { label: "Timing", value: sku.timing || "—" },
                    { label: "Doors", value: sku.doors ? sku.doors.toLocaleString() : "—" },
                  ].map(f => (
                    <div key={f.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 11 }}>
                      <span style={{ color: "var(--color-text-secondary)" }}>{f.label}</span>
                      <span style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "selling points" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Top selling points</div>
                {[1, 2, 3].map(n => (
                  <div key={n} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 8, background: accentColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 4 }}>
                      <span style={{ fontSize: 11, color: "white", fontWeight: 500 }}>{n}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <input
                        value={data[`sellingPoint${n}`]}
                        onChange={e => update(`sellingPoint${n}`, e.target.value)}
                        placeholder={`Selling point ${n}…`}
                        style={{ width: "100%", fontSize: 13, padding: "8px 10px", borderRadius: 8,
                          background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)",
                          color: "var(--color-text-primary)" }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Perfect for</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {PERFECT_FOR_ICONS.map(icon => {
                    const selected = [data.perfectFor1, data.perfectFor2, data.perfectFor3, data.perfectFor4].includes(icon.label);
                    return (
                      <button key={icon.label} onClick={() => {
                        const current = [data.perfectFor1, data.perfectFor2, data.perfectFor3, data.perfectFor4];
                        if (selected) {
                          const idx = current.indexOf(icon.label);
                          update(`perfectFor${idx + 1}`, "");
                        } else {
                          const empty = current.findIndex(v => !v);
                          if (empty !== -1) update(`perfectFor${empty + 1}`, icon.label);
                        }
                      }} style={{
                        padding: "10px 8px", borderRadius: 10, border: `0.5px solid ${selected ? accentColor : "var(--color-border-tertiary)"}`,
                        background: selected ? accentColor + "15" : "var(--color-background-secondary)",
                        color: selected ? accentColor : "var(--color-text-secondary)", cursor: "pointer",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 5
                      }}>
                        <i className={`ti ${icon.icon}`} style={{ fontSize: 18 }} aria-hidden="true" />
                        <span style={{ fontSize: 10, fontWeight: 500 }}>{icon.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "logistics" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Ordering & supply</div>
                <EditableField label="Casepack" value={data.casepack} onChange={v => update("casepack", v)} placeholder="e.g. 6" />
                <EditableField label="40' HQ container qty" value={data.containerQty40HQ} onChange={v => update("containerQty40HQ", v)} placeholder="e.g. 2,400" />
                <EditableField label="MOQ per color" value={data.moqColor} onChange={v => update("moqColor", v)} placeholder="e.g. 500" />
                <EditableField label="MOQ per order" value={data.moqOrder} onChange={v => update("moqOrder", v)} placeholder="e.g. 1,000" />
                <EditableField label="Available date" value={data.availableDate} onChange={v => update("availableDate", v)} placeholder="e.g. July 2026" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Cost & margin</div>
                <EditableField label="Cost (USD)" value={data.cost} onChange={v => update("cost", v)} placeholder="$0.00" />
                <div style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: 12, marginTop: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Margin calculator</div>
                  {[
                    { label: "Retail margin", price: sku.price },
                    { label: "Promo margin", price: sku.promo },
                    { label: "Marquee margin", price: sku.marquee },
                  ].map(({ label, price }) => {
                    const cost = parseFloat(data.cost);
                    const margin = (!isNaN(cost) && cost > 0 && price) ? (((price - cost) / price) * 100).toFixed(1) : null;
                    return (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                        <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{label}</span>
                        <span style={{ fontSize: 12, fontWeight: 500, color: margin ? (parseFloat(margin) > 40 ? "#059669" : parseFloat(margin) > 25 ? "#b45309" : "#dc2626") : "var(--color-text-tertiary)" }}>
                          {margin ? `${margin}%` : "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Product details</div>
              <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 14 }}>Specs, dimensions, features, certifications — anything used on sell sheets or PDPs.</div>
              {[1, 2, 3, 4, 5].map(n => (
                <div key={n} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                  <i className="ti ti-point-filled" style={{ fontSize: 10, color: accentColor, flexShrink: 0 }} aria-hidden="true" />
                  <input
                    value={data[`detail${n}`]}
                    onChange={e => update(`detail${n}`, e.target.value)}
                    placeholder={`Product detail ${n}…`}
                    style={{ flex: 1, fontSize: 13, padding: "7px 10px", borderRadius: 8,
                      background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)",
                      color: "var(--color-text-primary)" }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Catalog Card (display) ───────────────────────────────────────────────────
function CatalogCard({ sku, catalogData, onClick }) {
  const accentColor = CATEGORY_COLORS[sku.category] || "#7F77DD";
  const status = getStatus(sku.status);
  const hasData = catalogData && (catalogData.photo || catalogData.keyCallout || catalogData.sellingPoint1);
  const perfectForItems = [catalogData?.perfectFor1, catalogData?.perfectFor2, catalogData?.perfectFor3, catalogData?.perfectFor4].filter(Boolean);

  return (
    <div onClick={onClick} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>

      {/* Image area */}
      <div style={{ height: 160, background: catalogData?.photo ? "var(--color-background-secondary)" : accentColor + "12", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {catalogData?.photo ? (
          <img src={catalogData.photo} alt={sku.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <i className="ti ti-camera-plus" style={{ fontSize: 28, color: accentColor, opacity: 0.4 }} aria-hidden="true" />
            <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Add photo</span>
          </div>
        )}
        <div style={{ position: "absolute", top: 8, left: 8 }}>
          <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 99, background: accentColor + "20", color: accentColor, fontWeight: 500 }}>{sku.category}</span>
        </div>
        <div style={{ position: "absolute", top: 8, right: 8 }}>
          <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 99, background: status.bg, color: status.color, fontWeight: 500 }}>{status.label}</span>
        </div>
        {catalogData?.claimBadge && (
          <div style={{ position: "absolute", bottom: 6, left: 8, right: 8 }}>
            <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 99, background: accentColor, color: "white", fontWeight: 500 }}>{catalogData.claimBadge}</span>
          </div>
        )}
        {/* Edit overlay */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = "rgba(0,0,0,0.3)"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = 0; e.currentTarget.style.background = "rgba(0,0,0,0)"; }}>
          <div style={{ background: "white", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 500, color: accentColor, display: "flex", alignItems: "center", gap: 5 }}>
            <i className="ti ti-edit" style={{ fontSize: 13 }} aria-hidden="true" />Edit card
          </div>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "12px 14px" }}>
        <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: accentColor, marginBottom: 3 }}>{sku.sku}</div>
        <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.35, marginBottom: 2 }}>{sku.name}</div>
        {catalogData?.keyCallout ? (
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 8 }}>{catalogData.keyCallout}</div>
        ) : (
          sku.color && <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 8 }}>{sku.color}</div>
        )}

        {/* Selling points preview */}
        {catalogData?.sellingPoint1 && (
          <div style={{ marginBottom: 8 }}>
            {[catalogData.sellingPoint1, catalogData.sellingPoint2, catalogData.sellingPoint3].filter(Boolean).slice(0, 2).map((sp, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 5, marginBottom: 3 }}>
                <i className="ti ti-check" style={{ fontSize: 10, color: "#059669", flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                <span style={{ fontSize: 10, color: "var(--color-text-secondary)", lineHeight: 1.4 }}>{sp}</span>
              </div>
            ))}
          </div>
        )}

        {/* Perfect for icons */}
        {perfectForItems.length > 0 && (
          <div style={{ display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap" }}>
            {perfectForItems.map(label => {
              const icon = PERFECT_FOR_ICONS.find(i => i.label === label);
              return icon ? (
                <span key={label} title={label} style={{ width: 24, height: 24, borderRadius: 6, background: accentColor + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className={`ti ${icon.icon}`} style={{ fontSize: 12, color: accentColor }} aria-hidden="true" />
                </span>
              ) : null;
            })}
          </div>
        )}

        {/* Pricing */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "0.5px solid var(--color-border-tertiary)" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{sku.price ? `$${sku.price.toFixed(2)}` : "—"}</div>
            {sku.promo && <div style={{ fontSize: 10, color: "#059669" }}>Promo: ${sku.promo.toFixed(2)}</div>}
          </div>
          <div style={{ textAlign: "right" }}>
            {catalogData?.casepack && <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Pack: {catalogData.casepack}</div>}
            {catalogData?.availableDate && <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{catalogData.availableDate}</div>}
          </div>
        </div>

        {/* Completeness indicator */}
        <div style={{ marginTop: 8, height: 2, background: "var(--color-background-secondary)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", background: accentColor, borderRadius: 99, width: (() => {
            let filled = 0;
            const fields = ['photo','keyCallout','sellingPoint1','sellingPoint2','sellingPoint3','perfectFor1','cost','casepack','availableDate','detail1'];
            fields.forEach(f => { if (catalogData?.[f]) filled++; });
            return `${(filled / fields.length) * 100}%`;
          })() }} />
        </div>
        <div style={{ fontSize: 9, color: "var(--color-text-tertiary)", marginTop: 3, textAlign: "right" }}>
          {(() => {
            let filled = 0;
            const fields = ['photo','keyCallout','sellingPoint1','sellingPoint2','sellingPoint3','perfectFor1','cost','casepack','availableDate','detail1'];
            fields.forEach(f => { if (catalogData?.[f]) filled++; });
            return `${filled}/${fields.length} fields complete`;
          })()}
        </div>
      </div>
    </div>
  );
}

// ─── Product Catalog Module ───────────────────────────────────────────────────
function ProductCatalog({ skus }) {
  const [filterCat, setFilterCat] = useState("All");
  const [search, setSearch] = useState("");
  const [editingSku, setEditingSku] = useState(null);
  const [catalogStore, setCatalogStore] = useState({});

  const filtered = useMemo(() => {
    return skus.filter(s => {
      const matchCat = filterCat === "All" || s.category === filterCat;
      const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.sku.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [skus, filterCat, search]);

  function saveCatalog(sku, data) {
    setCatalogStore(prev => ({ ...prev, [sku]: data }));
  }

  const totalFilled = Object.keys(catalogStore).filter(k => catalogStore[k]?.photo || catalogStore[k]?.keyCallout).length;

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <i className="ti ti-search" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "var(--color-text-tertiary)" }} aria-hidden="true" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search SKU or product…" style={{ paddingLeft: 32, width: "100%", boxSizing: "border-box" }} />
        </div>
        <span style={{ fontSize: 12, color: "var(--color-text-secondary)", background: "var(--color-background-secondary)", padding: "6px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)" }}>
          <i className="ti ti-edit" style={{ marginRight: 5, fontSize: 11 }} aria-hidden="true" />
          {totalFilled} of {skus.length} cards filled
        </span>
      </div>

      {/* Category pills */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        <button onClick={() => setFilterCat("All")} style={{ fontSize: 11, background: filterCat === "All" ? "#7F77DD" : "var(--color-background-secondary)", color: filterCat === "All" ? "white" : "var(--color-text-secondary)", border: "0.5px solid " + (filterCat === "All" ? "#7F77DD" : "var(--color-border-tertiary)"), padding: "4px 12px", borderRadius: 99 }}>
          All ({skus.length})
        </button>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilterCat(c)} style={{ fontSize: 11, background: filterCat === c ? CATEGORY_COLORS[c] : "var(--color-background-secondary)", color: filterCat === c ? "white" : "var(--color-text-secondary)", border: "0.5px solid " + (filterCat === c ? CATEGORY_COLORS[c] : "var(--color-border-tertiary)"), padding: "4px 12px", borderRadius: 99 }}>
            {c} ({skus.filter(s => s.category === c).length})
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
        {filtered.map(s => (
          <CatalogCard key={s.sku} sku={s} catalogData={catalogStore[s.sku]} onClick={() => setEditingSku(s)} />
        ))}
      </div>

      {/* Modal */}
      {editingSku && (
        <CatalogCardModal
          sku={editingSku}
          catalogData={catalogStore[editingSku.sku]}
          onSave={data => saveCatalog(editingSku.sku, data)}
          onClose={() => setEditingSku(null)}
        />
      )}
    </div>
  );
}

// ─── Other modules (Dashboard, AssortmentGrid, RetailerPlanning, SkuRationalization, AICopilot) ─
function StatusBadge({ raw }) {
  const s = getStatus(raw);
  return <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 99, background: s.bg, color: s.color, whiteSpace: "nowrap" }}>{s.label}</span>;
}

function Dashboard({ skus }) {
  const total = skus.length;
  const active = skus.filter(s => s.status && (s.status.includes("CURRENT") || s.status.includes("AWARDED")) && !s.status.toLowerCase().includes("dropping") && !s.status.includes("DROPPED")).length;
  const dropping = skus.filter(s => s.status && (s.status.toLowerCase().includes("dropping") || s.status.includes("DROPPED"))).length;
  const passed = skus.filter(s => s.status && s.status.toUpperCase().includes("PASSED")).length;
  const priced = skus.filter(s => s.price);
  const avgPrice = priced.length ? priced.reduce((a, b) => a + b.price, 0) / priced.length : 0;
  const withPromo = skus.filter(s => s.promo).length;

  const catBreakdown = CATEGORIES.map(cat => ({ name: cat.replace("Waffle Licensed", "Licensed"), count: skus.filter(s => s.category === cat).length, fill: CATEGORY_COLORS[cat] || "#888" })).sort((a, b) => b.count - a.count);
  const statusBreakdown = [
    { name: "Active", value: active, fill: "#059669" },
    { name: "Dropping", value: dropping, fill: "#b45309" },
    { name: "Passed", value: passed, fill: "#dc2626" },
    { name: "Other", value: Math.max(0, total - active - dropping - passed), fill: "#9ca3af" },
  ].filter(d => d.value > 0);
  const priceRanges = [
    { range: "$0–15", count: skus.filter(s => s.price && s.price < 15).length },
    { range: "$15–30", count: skus.filter(s => s.price && s.price >= 15 && s.price < 30).length },
    { range: "$30–50", count: skus.filter(s => s.price && s.price >= 30 && s.price < 50).length },
    { range: "$50+", count: skus.filter(s => s.price && s.price >= 50).length },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total SKUs", value: total, icon: "ti-box", accent: "#7F77DD" },
          { label: "Active / Awarded", value: active, icon: "ti-circle-check", accent: "#059669" },
          { label: "Avg Retail Price", value: `$${avgPrice.toFixed(2)}`, icon: "ti-tag", accent: "#0369a1" },
          { label: "Dropping Sept '26", value: dropping, icon: "ti-trending-down", accent: "#b45309" },
          { label: "With Promo Price", value: withPromo, icon: "ti-percentage", accent: "#D85A30" },
          { label: "Passed", value: passed, icon: "ti-x", accent: "#dc2626" },
        ].map(kpi => (
          <div key={kpi.label} style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <i className={`ti ${kpi.icon}`} style={{ fontSize: 14, color: kpi.accent }} aria-hidden="true" />
              <span style={{ fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 500 }}>{kpi.label}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 500 }}>{kpi.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: 16 }}>
          <h3 style={{ fontSize: 13, fontWeight: 500, margin: "0 0 12px", color: "var(--color-text-secondary)" }}>SKUs by category</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={catBreakdown} layout="vertical" barCategoryGap="20%">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fill: "var(--color-text-secondary)" }} />
              <Tooltip formatter={(v) => [v, "SKUs"]} contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>{catBreakdown.map((e, i) => <Cell key={i} fill={e.fill} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: 16 }}>
          <h3 style={{ fontSize: 13, fontWeight: 500, margin: "0 0 12px", color: "var(--color-text-secondary)" }}>Status breakdown</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={statusBreakdown} dataKey="value" cx="50%" cy="50%" outerRadius={65} innerRadius={35} paddingAngle={2}>
                {statusBreakdown.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v + " SKUs", n]} contentStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px" }}>
            {statusBreakdown.map(s => <span key={s.name} style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4, color: "var(--color-text-secondary)" }}><span style={{ width: 8, height: 8, borderRadius: 2, background: s.fill, display: "inline-block" }} />{s.name} ({s.value})</span>)}
          </div>
        </div>
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: 16 }}>
          <h3 style={{ fontSize: 13, fontWeight: 500, margin: "0 0 12px", color: "var(--color-text-secondary)" }}>Price architecture</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={priceRanges} barCategoryGap="25%">
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis hide />
              <Tooltip formatter={(v) => [v + " SKUs", "Count"]} contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="count" fill="#7F77DD" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: 16 }}>
        <h3 style={{ fontSize: 13, fontWeight: 500, margin: "0 0 12px", color: "var(--color-text-secondary)" }}>
          <i className="ti ti-alert-triangle" style={{ marginRight: 6, color: "#b45309" }} aria-hidden="true" />Action required — items dropping Sept 2026
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
          {skus.filter(s => s.status && (s.status.toLowerCase().includes("dropping") || s.status.includes("DROPPED"))).map(s => (
            <div key={s.sku} style={{ background: "var(--color-background-warning)", border: "0.5px solid #fcd34d", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: "#92400e", marginBottom: 2 }}>{s.sku}</div>
              <div style={{ fontSize: 12, color: "#78350f" }}>{s.name}</div>
              <div style={{ fontSize: 11, color: "#b45309", marginTop: 4 }}>{s.category} · ${s.price?.toFixed(2) || "N/A"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AssortmentGrid({ skus }) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortKey, setSortKey] = useState("category");
  const [sortDir, setSortDir] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const statusGroups = ["All", "Active", "Awarded", "Dropping", "Passed"];
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
  function toggleSort(key) { if (sortKey === key) setSortDir(d => -d); else { setSortKey(key); setSortDir(1); } }
  const toggleSelect = sku => { const n = new Set(selected); n.has(sku) ? n.delete(sku) : n.add(sku); setSelected(n); };
  const ColH = ({ label, k, style }) => (
    <th onClick={() => toggleSort(k)} style={{ cursor: "pointer", whiteSpace: "nowrap", fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", padding: "8px 10px", textAlign: "left", userSelect: "none", background: "var(--color-background-secondary)", position: "sticky", top: 0, zIndex: 1, ...style }}>
      {label} {sortKey === k ? (sortDir > 0 ? "↑" : "↓") : ""}
    </th>
  );
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <i className="ti ti-search" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "var(--color-text-tertiary)" }} aria-hidden="true" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search SKU or name…" style={{ paddingLeft: 32, width: "100%", boxSizing: "border-box" }} />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ fontSize: 12 }}><option>All</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ fontSize: 12 }}>{statusGroups.map(s => <option key={s}>{s}</option>)}</select>
        <span style={{ fontSize: 12, color: "var(--color-text-secondary)", marginLeft: "auto" }}>{filtered.length} of {skus.length} SKUs{selected.size > 0 && <span style={{ marginLeft: 8, color: "#7F77DD" }}>· {selected.size} selected</span>}</span>
      </div>
      <div style={{ overflowX: "auto", borderRadius: 10, border: "0.5px solid var(--color-border-tertiary)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th style={{ width: 36, padding: "8px 10px", background: "var(--color-background-secondary)", position: "sticky", top: 0, zIndex: 1 }}><input type="checkbox" onChange={e => setSelected(e.target.checked ? new Set(filtered.map(s => s.sku)) : new Set())} checked={selected.size === filtered.length && filtered.length > 0} /></th>
              <ColH label="SKU" k="sku" style={{ width: 140 }} />
              <ColH label="Product" k="name" style={{ width: 200 }} />
              <ColH label="Category" k="category" style={{ width: 120 }} />
              <ColH label="Color" k="color" style={{ width: 90 }} />
              <ColH label="Retail" k="price" style={{ width: 75 }} />
              <ColH label="Promo" k="promo" style={{ width: 75 }} />
              <ColH label="Marquee" k="marquee" style={{ width: 80 }} />
              <ColH label="Buy Type" k="buyType" style={{ width: 90 }} />
              <ColH label="Placement" k="placement" style={{ width: 110 }} />
              <ColH label="Doors" k="doors" style={{ width: 70 }} />
              <ColH label="Status" k="status" style={{ width: 110 }} />
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.sku} style={{ background: selected.has(s.sku) ? "rgba(127,119,221,0.07)" : i % 2 === 0 ? "var(--color-background-primary)" : "var(--color-background-secondary)" }}>
                <td style={{ padding: "7px 10px", textAlign: "center" }}><input type="checkbox" checked={selected.has(s.sku)} onChange={() => toggleSelect(s.sku)} /></td>
                <td style={{ padding: "7px 10px", fontFamily: "var(--font-mono)", fontSize: 11, color: "#7F77DD", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.sku}</td>
                <td style={{ padding: "7px 10px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={s.name}>{s.name}</td>
                <td style={{ padding: "7px 10px" }}><span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 99, background: CATEGORY_COLORS[s.category] + "20", color: CATEGORY_COLORS[s.category], fontWeight: 500 }}>{s.category}</span></td>
                <td style={{ padding: "7px 10px", color: "var(--color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.color || "—"}</td>
                <td style={{ padding: "7px 10px", fontWeight: 500 }}>{s.price ? `$${s.price.toFixed(2)}` : "—"}</td>
                <td style={{ padding: "7px 10px", color: "#059669" }}>{s.promo ? `$${s.promo.toFixed(2)}` : "—"}</td>
                <td style={{ padding: "7px 10px", color: "#b45309" }}>{s.marquee ? `$${s.marquee.toFixed(2)}` : "—"}</td>
                <td style={{ padding: "7px 10px", color: "var(--color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.buyType || "—"}</td>
                <td style={{ padding: "7px 10px", color: "var(--color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.placement || "—"}</td>
                <td style={{ padding: "7px 10px", color: "var(--color-text-secondary)" }}>{s.doors?.toLocaleString() || "—"}</td>
                <td style={{ padding: "7px 10px" }}><StatusBadge raw={s.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "var(--color-text-secondary)", fontSize: 13 }}><i className="ti ti-search-off" style={{ fontSize: 24, display: "block", marginBottom: 8 }} aria-hidden="true" />No SKUs match your filters.</div>}
      </div>
    </div>
  );
}

function RetailerPlanning({ skus }) {
  const [view, setView] = useState("scorecard");
  const replen = skus.filter(s => s.buyType && s.buyType.includes("REPLEN") && s.status && (s.status.includes("CURRENT") || s.status.includes("AWARDED")) && !s.status.toLowerCase().includes("dropping") && !s.status.includes("DROPPED"));
  const dropIn = skus.filter(s => s.buyType === "DROP IN" && s.status && s.status.includes("AWARDED"));
  const dropping = skus.filter(s => s.status && (s.status.toLowerCase().includes("dropping") || s.status.includes("DROPPED")));
  const placementGroups = {};
  skus.filter(s => s.placement).forEach(s => { if (!placementGroups[s.placement]) placementGroups[s.placement] = []; placementGroups[s.placement].push(s); });
  const placements = Object.entries(placementGroups).sort((a, b) => b[1].length - a[1].length);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <div style={{ background: "#1a1a2e", borderRadius: 10, padding: "16px 20px", flex: 1, color: "white" }}>
          <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>Retailer</div>
          <div style={{ fontSize: 18, fontWeight: 500 }}>Target</div>
          <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>2026 Assortment Plan</div>
        </div>
        {[
          { label: "Replen SKUs", value: replen.length, icon: "ti-repeat", color: "#059669" },
          { label: "Drop-in Events", value: dropIn.length, icon: "ti-calendar-event", color: "#0369a1" },
          { label: "Dropping Items", value: dropping.length, icon: "ti-trending-down", color: "#b45309" },
          { label: "Placement Types", value: Object.keys(placementGroups).length, icon: "ti-layout", color: "#7F77DD" },
        ].map(m => (
          <div key={m.label} style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "16px 20px", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <i className={`ti ${m.icon}`} style={{ fontSize: 14, color: m.color }} aria-hidden="true" />
              <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{m.label}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 500 }}>{m.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["scorecard", "placements", "timeline"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{ background: view === v ? "#7F77DD" : "var(--color-background-secondary)", color: view === v ? "white" : "var(--color-text-secondary)", border: "0.5px solid " + (view === v ? "#7F77DD" : "var(--color-border-tertiary)"), fontSize: 12, fontWeight: 500 }}>

            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>
      {view === "scorecard" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: 16 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)" }}><i className="ti ti-refresh" style={{ marginRight: 6, color: "#059669" }} aria-hidden="true" />Replenishment items ({replen.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {replen.slice(0, 8).map(s => (
                <div key={s.sku} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", background: "var(--color-background-secondary)", borderRadius: 8 }}>
                  <div><div style={{ fontSize: 12, fontWeight: 500 }}>{s.name}</div><div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{s.sku} · {s.category}</div></div>
                  <div style={{ textAlign: "right" }}><div style={{ fontSize: 12, fontWeight: 500 }}>{s.price ? `$${s.price.toFixed(2)}` : "—"}</div>{s.doors && <div style={{ fontSize: 10, color: "#0369a1" }}>{s.doors.toLocaleString()} doors</div>}</div>
                </div>
              ))}
              {replen.length > 8 && <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", textAlign: "center" }}>+{replen.length - 8} more</div>}
            </div>
          </div>
          <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: 16 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)" }}><i className="ti ti-calendar-plus" style={{ marginRight: 6, color: "#0369a1" }} aria-hidden="true" />Drop-in events ({dropIn.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {dropIn.slice(0, 8).map(s => (
                <div key={s.sku} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", background: "var(--color-background-secondary)", borderRadius: 8 }}>
                  <div><div style={{ fontSize: 12, fontWeight: 500 }}>{s.name}</div><div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{s.timing || "TBD"}</div></div>
                  <div style={{ textAlign: "right" }}><div style={{ fontSize: 12, fontWeight: 500 }}>{s.price ? `$${s.price.toFixed(2)}` : "—"}</div><div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{s.placement}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {view === "placements" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
          {placements.map(([placement, items]) => (
            <div key={placement} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 500 }}>{placement}</span>
                <span style={{ fontSize: 11, background: "#7F77DD20", color: "#7F77DD", borderRadius: 99, padding: "2px 8px" }}>{items.length}</span>
              </div>
              {items.slice(0, 3).map(s => <div key={s.sku} style={{ fontSize: 11, color: "var(--color-text-secondary)", padding: "3px 0", borderBottom: "0.5px solid var(--color-border-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>)}
              {items.length > 3 && <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>+{items.length - 3} more</div>}
            </div>
          ))}
        </div>
      )}
      {view === "timeline" && (
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: 16 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)" }}>Calendar events</h3>
          {[
            { label: "Jan – Feb (Q1)", timing: ["Jan 11", "Jan WK 1", "Feb WK"] },
            { label: "Mar – Jun (Q2)", timing: ["Mar Wk", "Mar WK", "BTS 2026"] },
            { label: "Jul – Sep (Q3)", timing: ["9/7", "Summer", "C5"] },
            { label: "Oct – Dec (Q4, C6)", timing: ["C6", "Q4", "11/9", "Holiday"] },
          ].map(period => {
            const items = skus.filter(s => s.timing && period.timing.some(t => s.timing.includes(t)));
            return (
              <div key={period.label} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#7F77DD", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <i className="ti ti-calendar" style={{ fontSize: 13 }} aria-hidden="true" />{period.label}
                  <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", fontWeight: 400 }}>({items.length} items)</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {items.map(s => <span key={s.sku} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: CATEGORY_COLORS[s.category] + "18", color: CATEGORY_COLORS[s.category], border: `0.5px solid ${CATEGORY_COLORS[s.category]}40` }}>{s.name}</span>)}
                  {items.length === 0 && <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>No events mapped</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SkuRationalization({ skus }) {
  const dropping = skus.filter(s => s.status && (s.status.toLowerCase().includes("dropping") || s.status.includes("DROPPED")));
  const passed = skus.filter(s => s.status && s.status.toUpperCase().includes("PASSED"));
  const noPromo = skus.filter(s => s.price && s.price >= 30 && !s.promo && s.status && s.status.includes("CURRENT"));
  const highPrice = skus.filter(s => s.price && s.price >= 79.99);
  const groups = [
    { label: "Dropping Sept 2026", items: dropping, severity: "high", icon: "ti-trash", tip: "Identify replacement SKUs and communicate discontinuation timelines." },
    { label: "Passed — not awarded", items: passed, severity: "medium", icon: "ti-x", tip: "Review for potential resubmission in future line reviews." },
    { label: "No promo price set", items: noPromo, severity: "low", icon: "ti-percentage", tip: "Consider adding promotional pricing for high-volume event windows." },
    { label: "Premium SKUs ($80+)", items: highPrice, severity: "info", icon: "ti-star", tip: "Monitor velocity carefully — premium items need strong display support." },
  ];
  const colors = { high: "#dc2626", medium: "#b45309", low: "#0369a1", info: "#7F77DD" };
  const bgs = { high: "#fee2e2", medium: "#fef3c7", low: "#dbeafe", info: "#ede9fe" };
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {groups.map(g => (
          <div key={g.label} style={{ background: "var(--color-background-primary)", border: `0.5px solid ${colors[g.severity]}40`, borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
              <div style={{ background: bgs[g.severity], borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className={`ti ${g.icon}`} style={{ fontSize: 15, color: colors[g.severity] }} aria-hidden="true" />
              </div>
              <div><div style={{ fontSize: 12, fontWeight: 500 }}>{g.label}</div><div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 2 }}>{g.items.length} SKUs</div></div>
            </div>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)", background: "var(--color-background-secondary)", borderRadius: 6, padding: "8px 10px", marginBottom: 12, fontStyle: "italic" }}>{g.tip}</div>
            {g.items.slice(0, 5).map(s => (
              <div key={s.sku} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "0.5px solid var(--color-border-tertiary)", fontSize: 11 }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>{s.name}</span>
                <span style={{ color: "var(--color-text-secondary)", flexShrink: 0, marginLeft: 8 }}>{s.price ? `$${s.price.toFixed(2)}` : "—"}</span>
              </div>
            ))}
            {g.items.length > 5 && <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", textAlign: "center", paddingTop: 6 }}>+{g.items.length - 5} more</div>}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: 16 }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)" }}><i className="ti ti-chart-bar" style={{ marginRight: 6, color: "#7F77DD" }} aria-hidden="true" />Assortment health by category</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CATEGORIES.map(cat => {
            const total = skus.filter(s => s.category === cat).length;
            const active = skus.filter(s => s.category === cat && s.status && (s.status.includes("CURRENT") || s.status.includes("AWARDED")) && !s.status.toLowerCase().includes("dropping") && !s.status.includes("DROPPED")).length;
            const pct = total > 0 ? Math.round((active / total) * 100) : 0;
            return (
              <div key={cat} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, width: 130, color: "var(--color-text-secondary)", flexShrink: 0 }}>{cat}</span>
                <div style={{ flex: 1, background: "var(--color-background-secondary)", borderRadius: 99, height: 6, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, background: CATEGORY_COLORS[cat], height: "100%", borderRadius: 99 }} />
                </div>
                <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", width: 50, textAlign: "right" }}>{active}/{total}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AICopilot({ skus }) {
  const [messages, setMessages] = useState([{ role: "assistant", text: "Hi! I'm your assortment planning assistant. Ask me anything about your Target 2026 plan." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const systemPrompt = `You are an expert assortment planning assistant. Target 2026 plan summary: ${skus.length} SKUs, categories: ${CATEGORIES.join(", ")}. Be concise and actionable.`;
  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim(); setInput(""); setMessages(prev => [...prev, { role: "user", text: userMsg }]); setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system: systemPrompt, messages: [...messages.slice(1).map(m => ({ role: m.role, content: m.text })), { role: "user", content: userMsg }] }) });
      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", text: data.content?.[0]?.text || "Sorry, try again." }]);
    } catch { setMessages(prev => [...prev, { role: "assistant", text: "Connection error." }]); }
    setLoading(false);
  }
  const suggestions = ["Which SKUs are dropping?", "What's awarded for C6?", "Items with no promo price?"];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: 520 }}>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, padding: "0 0 12px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            {msg.role === "assistant" && <div style={{ width: 28, height: 28, borderRadius: 8, background: "#7F77DD", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><i className="ti ti-robot" style={{ fontSize: 14, color: "white" }} aria-hidden="true" /></div>}
            <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: msg.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px", background: msg.role === "user" ? "#7F77DD" : "var(--color-background-secondary)", color: msg.role === "user" ? "white" : "var(--color-text-primary)", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{msg.text}</div>
          </div>
        ))}
        {loading && <div style={{ display: "flex", gap: 10 }}><div style={{ width: 28, height: 28, borderRadius: 8, background: "#7F77DD", display: "flex", alignItems: "center", justifyContent: "center" }}><i className="ti ti-robot" style={{ fontSize: 14, color: "white" }} /></div><div style={{ padding: "10px 14px", background: "var(--color-background-secondary)", borderRadius: "12px 12px 12px 4px", fontSize: 13, color: "var(--color-text-secondary)" }}>Analyzing…</div></div>}
      </div>
      <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 12 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>{suggestions.map(s => <button key={s} onClick={() => setInput(s)} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 99, background: "var(--color-background-secondary)", color: "var(--color-text-secondary)", border: "0.5px solid var(--color-border-tertiary)" }}>{s}</button>)}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Ask about your assortment…" style={{ flex: 1 }} />
          <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ background: "#7F77DD", color: "white", border: "none", borderRadius: 8, padding: "0 16px", fontSize: 13 }}>Send</button>
        </div>
      </div>
    </div>
  );
}

const MODULES = [
  { id: "dashboard", label: "Dashboard", icon: "ti-layout-dashboard" },
  { id: "grid", label: "Assortment grid", icon: "ti-table" },
  { id: "retailer", label: "Retailer planning", icon: "ti-building-store" },
  { id: "sku", label: "SKU rationalization", icon: "ti-filter" },
  { id: "catalog", label: "Product catalog", icon: "ti-box" },
  { id: "ai", label: "AI copilot", icon: "ti-robot" },
];

export default function App() {
  const [active, setActive] = useState("catalog");
  const moduleContent = {
    dashboard: <Dashboard skus={RAW_SKUS} />,
    grid: <AssortmentGrid skus={RAW_SKUS} />,
    retailer: <RetailerPlanning skus={RAW_SKUS} />,
    sku: <SkuRationalization skus={RAW_SKUS} />,
    catalog: <ProductCatalog skus={RAW_SKUS} />,
    ai: <AICopilot skus={RAW_SKUS} />,
  };
  const current = MODULES.find(m => m.id === active);
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "var(--font-sans)", background: "var(--color-background-tertiary)", overflow: "hidden" }}>
      <div style={{ width: 200, background: "#1a1a2e", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 16px 16px", borderBottom: "0.5px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, background: "#7F77DD", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><i className="ti ti-chart-treemap" style={{ fontSize: 14, color: "white" }} aria-hidden="true" /></div>
            <div><div style={{ fontSize: 12, fontWeight: 500, color: "white" }}>AssortIQ</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Assortment planning</div></div>
          </div>
        </div>
        <div style={{ padding: "12px 8px", flex: 1 }}>
          {MODULES.map(m => (
            <button key={m.id} onClick={() => setActive(m.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, marginBottom: 2, background: active === m.id ? "rgba(127,119,221,0.2)" : "transparent", color: active === m.id ? "#a89fef" : "rgba(255,255,255,0.55)", border: active === m.id ? "0.5px solid rgba(127,119,221,0.3)" : "0.5px solid transparent", cursor: "pointer", textAlign: "left", fontSize: 12 }}>
              <i className={`ti ${m.icon}`} style={{ fontSize: 15, flexShrink: 0 }} aria-hidden="true" />{m.label}
            </button>
          ))}
        </div>
        <div style={{ padding: "12px 16px", borderTop: "0.5px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>Current plan</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Target 2026</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{RAW_SKUS.length} SKUs tracked</div>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ background: "var(--color-background-primary)", borderBottom: "0.5px solid var(--color-border-tertiary)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <i className={`ti ${current?.icon}`} style={{ fontSize: 16, color: "#7F77DD" }} aria-hidden="true" />
            <h1 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>{current?.label}</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", background: "var(--color-background-secondary)", padding: "4px 10px", borderRadius: 99, border: "0.5px solid var(--color-border-tertiary)" }}>
              <i className="ti ti-building-store" style={{ marginRight: 4, fontSize: 11 }} aria-hidden="true" />Target · 2026
            </span>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "#7F77DD20", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="ti ti-user" style={{ fontSize: 14, color: "#7F77DD" }} aria-hidden="true" />
            </div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {moduleContent[active]}
        </div>
      </div>
    </div>
  );
}
