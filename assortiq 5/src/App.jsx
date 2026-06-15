import { useState, useMemo, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ─── SKU Data ────────────────────────────────────────────────────────────────
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

const CATEGORIES = [...new Set(RAW_SKUS.map(s => s.category))];
const RETAILERS = ["Target", "Walmart", "Costco", "Amazon", "Macy's"];

const CATEGORY_COLORS = {
  "Waffle": "#7F77DD", "Waffle Licensed": "#D85A30", "Egg": "#1D9E75",
  "Frozen Treats": "#378ADD", "Treats": "#EF9F27", "Mixing": "#D4537E",
  "Cookers": "#639922", "Toast": "#888780", "Beverage": "#BA7517",
  "Air Fry": "#E24B4A", "Griddle/Skillet": "#0F6E56"
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

const PERFECT_FOR_OPTIONS = [
  { label: "Families", icon: "ti-users" },
  { label: "Gifting", icon: "ti-gift" },
  { label: "Beginners", icon: "ti-star" },
  { label: "Small kitchens", icon: "ti-home" },
  { label: "Kids", icon: "ti-mood-happy" },
  { label: "Entertaining", icon: "ti-confetti" },
  { label: "Meal prep", icon: "ti-clock" },
  { label: "Licensed fans", icon: "ti-heart" },
  { label: "College/dorm", icon: "ti-school" },
  { label: "Holiday gifting", icon: "ti-snowflake" },
];

const EMPTY_CARD = {
  photo: null,
  keyCallout: "",
  sellingPoint1: "", sellingPoint2: "", sellingPoint3: "",
  perfectFor1: "", perfectFor2: "", perfectFor3: "", perfectFor4: "",
  retailPricing: "", cost: "",
  casepack: "", containerQty: "", moqColor: "", moqOrder: "",
  availableDate: "",
  packagingCallout: "", addOn: "", claimBadge: "",
  detail1: "", detail2: "", detail3: "", detail4: "", detail5: "",
  retailers: [], status: "",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function StatusBadge({ raw }) {
  const s = getStatus(raw);
  return <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 99, background: s.bg, color: s.color, whiteSpace: "nowrap" }}>{s.label}</span>;
}

function Field({ label, value, onChange, placeholder, type = "text", hint }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 500, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>
        {label}{hint && <span style={{ fontWeight: 400, textTransform: "none", marginLeft: 4 }}>— {hint}</span>}
      </div>
      <input type={type} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder || label}
        style={{ width: "100%", fontSize: 12, padding: "6px 9px", borderRadius: 6,
          background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)",
          color: "var(--color-text-primary)", boxSizing: "border-box" }} />
    </div>
  );
}

// ─── Excel Import ─────────────────────────────────────────────────────────────
function parseExcelCSV(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return null;
  const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
  const values = lines[1].split(",").map(v => v.trim().replace(/"/g, ""));
  const row = {};
  headers.forEach((h, i) => { row[h] = values[i] || ""; });
  return {
    keyCallout: row["Key Callout (Under Name)"] || "",
    sellingPoint1: row["Top Selling Point 1"] || "",
    sellingPoint2: row["Top Selling Point 2"] || "",
    sellingPoint3: row["Top Selling Point 3"] || "",
    perfectFor1: row["Perfect For Icon 1"] || "",
    perfectFor2: row["Perfect For Icon 2"] || "",
    perfectFor3: row["Perfect For Icon 3"] || "",
    perfectFor4: row["Perfect For Icon 4"] || "",
    retailPricing: row["Retail Pricing"] || "",
    cost: row["Cost"] || "",
    casepack: row["Casepack"] || "",
    containerQty: row["40' HQ Container Qty"] || "",
    moqColor: row["MOQ / Color"] || "",
    moqOrder: row["MOQ / Order"] || "",
    availableDate: row["Available Date"] || "",
    packagingCallout: row["Packaging Callout 1"] || "",
    addOn: row["Add On 1"] || "",
    claimBadge: row["Claim Badge"] || "",
    detail1: row["Product Detail 1"] || "",
    detail2: row["Product Detail 2"] || "",
    detail3: row["Product Detail 3"] || "",
    detail4: row["Product Detail 4"] || "",
    detail5: row["Product Detail 5"] || "",
  };
}

// ─── Card Edit Modal ──────────────────────────────────────────────────────────
function CardModal({ sku, data, onSave, onClose }) {
  const [d, setD] = useState({ ...EMPTY_CARD, ...data });
  const [tab, setTab] = useState("overview");
  const [importMsg, setImportMsg] = useState("");
  const photoRef = useRef();
  const csvRef = useRef();
  const accent = CATEGORY_COLORS[sku.category] || "#7F77DD";

  const up = (k, v) => setD(prev => ({ ...prev, [k]: v }));

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => up("photo", ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleCSV(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const parsed = parseExcelCSV(ev.target.result);
      if (parsed) {
        setD(prev => ({ ...prev, ...parsed }));
        setImportMsg("✓ Template imported successfully");
        setTimeout(() => setImportMsg(""), 3000);
      } else {
        setImportMsg("Could not parse file — ensure it matches the template format");
      }
    };
    reader.readAsText(file);
  }

  function toggleRetailer(r) {
    const list = d.retailers || [];
    up("retailers", list.includes(r) ? list.filter(x => x !== r) : [...list, r]);
  }

  function togglePerfectFor(label) {
    const slots = [d.perfectFor1, d.perfectFor2, d.perfectFor3, d.perfectFor4];
    const idx = slots.indexOf(label);
    if (idx !== -1) {
      const key = `perfectFor${idx + 1}`;
      up(key, "");
    } else {
      const emptyIdx = slots.findIndex(v => !v);
      if (emptyIdx !== -1) up(`perfectFor${emptyIdx + 1}`, label);
    }
  }

  const selectedPF = [d.perfectFor1, d.perfectFor2, d.perfectFor3, d.perfectFor4].filter(Boolean);
  const tabs = ["overview", "selling points", "logistics", "details"];

  const costNum = parseFloat(d.cost);
  const calcMargin = (price) => {
    const p = parseFloat(price);
    if (!isNaN(costNum) && costNum > 0 && !isNaN(p) && p > 0) {
      const m = ((p - costNum) / p * 100).toFixed(1);
      return { value: m + "%", color: parseFloat(m) > 45 ? "#059669" : parseFloat(m) > 30 ? "#b45309" : "#dc2626" };
    }
    return { value: "—", color: "var(--color-text-tertiary)" };
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
      <div style={{ background: "var(--color-background-primary)", borderRadius: 16, width: "100%", maxWidth: 800, maxHeight: "92vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ background: accent, padding: "16px 20px", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginBottom: 3, letterSpacing: "0.05em", textTransform: "uppercase" }}>{sku.category} · {sku.sku}</div>
              <div style={{ fontSize: 17, fontWeight: 500, color: "white", marginBottom: 2 }}>{sku.name}</div>
              {sku.color && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{sku.color}</div>}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
              <button onClick={() => csvRef.current.click()}
                style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "0.5px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "6px 12px", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                <i className="ti ti-file-import" style={{ fontSize: 13 }} aria-hidden="true" />Import template
              </button>
              <button onClick={() => { onSave(d); onClose(); }}
                style={{ background: "white", color: accent, border: "none", borderRadius: 8, padding: "6px 16px", fontSize: 12, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                <i className="ti ti-check" style={{ fontSize: 13 }} aria-hidden="true" />Save card
              </button>
              <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}>
                <i className="ti ti-x" style={{ fontSize: 14 }} aria-hidden="true" />
              </button>
            </div>
          </div>
          {importMsg && <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.9)", background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: "4px 10px", display: "inline-block" }}>{importMsg}</div>}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", flexShrink: 0, paddingLeft: 4 }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "9px 16px", fontSize: 12, fontWeight: tab === t ? 500 : 400, border: "none", borderRadius: 0, background: "transparent", cursor: "pointer", color: tab === t ? accent : "var(--color-text-secondary)", borderBottom: tab === t ? `2px solid ${accent}` : "2px solid transparent", marginBottom: -1 }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>

          {/* ── OVERVIEW TAB ── */}
          {tab === "overview" && (
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20 }}>

              {/* Left: Photo + status + retailers */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Photo */}
                <div onClick={() => photoRef.current.click()} style={{ width: "100%", aspectRatio: "1", borderRadius: 12, border: `2px dashed ${accent}50`, background: d.photo ? "var(--color-background-secondary)" : accent + "08", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", position: "relative" }}>
                  {d.photo
                    ? <img src={d.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} />
                    : <>
                        <i className="ti ti-camera-plus" style={{ fontSize: 26, color: accent, opacity: 0.45 }} aria-hidden="true" />
                        <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 6, textAlign: "center", lineHeight: 1.4 }}>Click to upload<br/>product photo</span>
                      </>
                  }
                  {d.photo && (
                    <div onClick={e => { e.stopPropagation(); up("photo", null); }} style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.55)", borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <i className="ti ti-trash" style={{ fontSize: 11, color: "white" }} aria-hidden="true" />
                    </div>
                  )}
                </div>
                <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
                <input ref={csvRef} type="file" accept=".csv,.xlsx,.txt" onChange={handleCSV} style={{ display: "none" }} />

                {/* Status override */}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 500, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Status</div>
                  <div style={{ marginBottom: 6, padding: "6px 8px", background: "var(--color-background-secondary)", borderRadius: 6, fontSize: 11 }}>
                    <span style={{ color: "var(--color-text-secondary)" }}>From assortment: </span>
                    <StatusBadge raw={sku.status} />
                  </div>
                  <select value={d.status} onChange={e => up("status", e.target.value)}
                    style={{ width: "100%", fontSize: 11, padding: "5px 8px", borderRadius: 6, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)", color: "var(--color-text-primary)" }}>
                    <option value="">Use assortment status</option>
                    <option value="CURRENT - CF 2027">Active</option>
                    <option value="AWARDED">Awarded</option>
                    <option value="CURRENT - BEING DROPPED SEPT 2026">Dropping</option>
                    <option value="PASSED">Passed</option>
                    <option value="50% Probability">50/50</option>
                  </select>
                </div>

                {/* Retailer grid placement */}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 500, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Retailer grids</div>
                  {RETAILERS.map(r => (
                    <label key={r} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5, cursor: "pointer", fontSize: 12 }}>
                      <input type="checkbox" checked={(d.retailers || []).includes(r)} onChange={() => toggleRetailer(r)}
                        style={{ width: 14, height: 14, accentColor: accent, cursor: "pointer" }} />
                      <span style={{ color: "var(--color-text-primary)" }}>{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Right: Core fields */}
              <div>
                <Field label="Key callout" hint="tagline under product name" value={d.keyCallout} onChange={v => up("keyCallout", v)} placeholder="e.g. Makes 4 mini waffles at once" />
                <Field label="Claim badge" value={d.claimBadge} onChange={v => up("claimBadge", v)} placeholder="e.g. #1 Best Seller · Award Winner" />
                <Field label="Packaging callout" value={d.packagingCallout} onChange={v => up("packagingCallout", v)} placeholder="e.g. Dishwasher safe · BPA free" />
                <Field label="Add-on / bundle" value={d.addOn} onChange={v => up("addOn", v)} placeholder="e.g. Includes recipe booklet" />

                {/* Pricing from assortment + cost */}
                <div style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: 12, marginBottom: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 500, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Pricing</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
                    {[
                      { label: "Retail", val: sku.price ? `$${sku.price.toFixed(2)}` : "—" },
                      { label: "Promo", val: sku.promo ? `$${sku.promo.toFixed(2)}` : "—" },
                      { label: "Marquee", val: sku.marquee ? `$${sku.marquee.toFixed(2)}` : "—" },
                    ].map(p => (
                      <div key={p.label} style={{ textAlign: "center", padding: "8px 6px", background: "var(--color-background-primary)", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)" }}>
                        <div style={{ fontSize: 9, color: "var(--color-text-tertiary)", textTransform: "uppercase", marginBottom: 3 }}>{p.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{p.val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginBottom: 3 }}>Cost (USD)</div>
                      <input value={d.cost} onChange={e => up("cost", e.target.value)} placeholder="$0.00"
                        style={{ width: "100%", fontSize: 12, padding: "5px 8px", borderRadius: 6, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)", color: "var(--color-text-primary)", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginBottom: 3 }}>Retail pricing display</div>
                      <input value={d.retailPricing} onChange={e => up("retailPricing", e.target.value)} placeholder="e.g. $10.99–$49.99"
                        style={{ width: "100%", fontSize: 12, padding: "5px 8px", borderRadius: 6, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)", color: "var(--color-text-primary)", boxSizing: "border-box" }} />
                    </div>
                  </div>
                  {d.cost && (
                    <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                      {[
                        { label: "Retail margin", price: sku.price },
                        { label: "Promo margin", price: sku.promo },
                        { label: "Marquee margin", price: sku.marquee },
                      ].map(({ label, price }) => {
                        const m = calcMargin(price);
                        return (
                          <div key={label} style={{ textAlign: "center", padding: "6px", background: "var(--color-background-primary)", borderRadius: 6 }}>
                            <div style={{ fontSize: 9, color: "var(--color-text-tertiary)", marginBottom: 2 }}>{label}</div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: m.color }}>{m.value}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Perfect for icons */}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 500, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Perfect for <span style={{ fontWeight: 400, textTransform: "none" }}>— select up to 4</span></div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
                    {PERFECT_FOR_OPTIONS.map(opt => {
                      const sel = selectedPF.includes(opt.label);
                      return (
                        <button key={opt.label} onClick={() => togglePerfectFor(opt.label)}
                          style={{ padding: "8px 4px", borderRadius: 8, border: `0.5px solid ${sel ? accent : "var(--color-border-tertiary)"}`, background: sel ? accent + "18" : "var(--color-background-secondary)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          <i className={`ti ${opt.icon}`} style={{ fontSize: 16, color: sel ? accent : "var(--color-text-secondary)" }} aria-hidden="true" />
                          <span style={{ fontSize: 9, color: sel ? accent : "var(--color-text-secondary)", textAlign: "center", lineHeight: 1.2 }}>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── SELLING POINTS TAB ── */}
          {tab === "selling points" && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>Top 3 selling points</div>
              {[1, 2, 3].map(n => (
                <div key={n} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 12, color: "white", fontWeight: 500 }}>{n}</span>
                  </div>
                  <input value={d[`sellingPoint${n}`]} onChange={e => up(`sellingPoint${n}`, e.target.value)} placeholder={`Selling point ${n}…`}
                    style={{ flex: 1, fontSize: 13, padding: "9px 12px", borderRadius: 8, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)", color: "var(--color-text-primary)" }} />
                </div>
              ))}
              <div style={{ marginTop: 24, padding: 16, background: "var(--color-background-secondary)", borderRadius: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 12 }}>Preview on card</div>
                {[d.sellingPoint1, d.sellingPoint2, d.sellingPoint3].filter(Boolean).map((sp, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 99, background: accent + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <i className="ti ti-check" style={{ fontSize: 10, color: accent }} aria-hidden="true" />
                    </div>
                    <span style={{ fontSize: 13, color: "var(--color-text-primary)", lineHeight: 1.5 }}>{sp}</span>
                  </div>
                ))}
                {!d.sellingPoint1 && <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Add selling points above to preview</span>}
              </div>
            </div>
          )}

          {/* ── LOGISTICS TAB ── */}
          {tab === "logistics" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>Supply chain</div>
                <Field label="Casepack" value={d.casepack} onChange={v => up("casepack", v)} placeholder="e.g. 6" />
                <Field label="40' HQ Container Qty" value={d.containerQty} onChange={v => up("containerQty", v)} placeholder="e.g. 2,400" />
                <Field label="MOQ / Color" value={d.moqColor} onChange={v => up("moqColor", v)} placeholder="e.g. 500 units" />
                <Field label="MOQ / Order" value={d.moqOrder} onChange={v => up("moqOrder", v)} placeholder="e.g. 1,000 units" />
                <Field label="Available Date" value={d.availableDate} onChange={v => up("availableDate", v)} placeholder="e.g. July 2026" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>Margin summary</div>
                <div style={{ background: "var(--color-background-secondary)", borderRadius: 12, padding: 14 }}>
                  {[
                    { label: "Retail", price: sku.price },
                    { label: "Promo", price: sku.promo },
                    { label: "Marquee", price: sku.marquee },
                  ].map(({ label, price }) => {
                    const m = calcMargin(price);
                    return (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, paddingBottom: 10, borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 500 }}>{label}</div>
                          <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{price ? `$${price.toFixed(2)}` : "—"}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 16, fontWeight: 500, color: m.color }}>{m.value}</div>
                          <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>margin</div>
                        </div>
                      </div>
                    );
                  })}
                  {!d.cost && <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", textAlign: "center", marginTop: 4 }}>Enter cost in Overview to calculate</div>}
                </div>
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Assortment data</div>
                  {[
                    { label: "Placement", val: sku.placement },
                    { label: "Buy type", val: sku.buyType },
                    { label: "Timing", val: sku.timing },
                    { label: "Doors", val: sku.doors?.toLocaleString() },
                  ].map(f => (
                    <div key={f.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "0.5px solid var(--color-border-tertiary)", fontSize: 12 }}>
                      <span style={{ color: "var(--color-text-secondary)" }}>{f.label}</span>
                      <span style={{ fontWeight: 500 }}>{f.val || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── DETAILS TAB ── */}
          {tab === "details" && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Product details</div>
              <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 16 }}>Specs, dimensions, certifications, materials — used on sell sheets and PDPs.</div>
              {[1, 2, 3, 4, 5].map(n => (
                <div key={n} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 99, background: accent, flexShrink: 0 }} />
                  <input value={d[`detail${n}`]} onChange={e => up(`detail${n}`, e.target.value)} placeholder={`Product detail ${n}…`}
                    style={{ flex: 1, fontSize: 13, padding: "8px 12px", borderRadius: 8, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)", color: "var(--color-text-primary)" }} />
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
function CatalogCard({ sku, data, onEdit }) {
  const accent = CATEGORY_COLORS[sku.category] || "#7F77DD";
  const displayStatus = data?.status || sku.status;
  const status = getStatus(displayStatus);
  const retailers = data?.retailers || [];
  const pf = [data?.perfectFor1, data?.perfectFor2, data?.perfectFor3, data?.perfectFor4].filter(Boolean);
  const sps = [data?.sellingPoint1, data?.sellingPoint2, data?.sellingPoint3].filter(Boolean);

  const completeness = (() => {
    if (!data) return 0;
    const fields = ["photo", "keyCallout", "sellingPoint1", "cost", "casepack", "availableDate", "detail1", "retailers"];
    const filled = fields.filter(f => f === "retailers" ? data.retailers?.length > 0 : data[f]).length;
    return Math.round((filled / fields.length) * 100);
  })();

  return (
    <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s", display: "flex", flexDirection: "column" }}
      onClick={onEdit}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>

      {/* Image */}
      <div style={{ height: 168, background: data?.photo ? "var(--color-background-secondary)" : accent + "10", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
        {data?.photo
          ? <img src={data.photo} alt={sku.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 10 }} />
          : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <i className="ti ti-camera-plus" style={{ fontSize: 28, color: accent, opacity: 0.35 }} aria-hidden="true" />
              <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Add photo</span>
            </div>
        }
        {/* Category badge top-left */}
        <div style={{ position: "absolute", top: 8, left: 8 }}>
          <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 99, background: accent + "22", color: accent, fontWeight: 500 }}>{sku.category}</span>
        </div>
        {/* Status badge top-right */}
        <div style={{ position: "absolute", top: 8, right: 8 }}>
          <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 99, background: status.bg, color: status.color, fontWeight: 500 }}>{status.label}</span>
        </div>
        {/* Claim badge bottom */}
        {data?.claimBadge && (
          <div style={{ position: "absolute", bottom: 7, left: 8, right: 8 }}>
            <span style={{ fontSize: 9, padding: "2px 9px", borderRadius: 99, background: accent, color: "white", fontWeight: 500, display: "inline-block" }}>{data.claimBadge}</span>
          </div>
        )}
        {/* Edit overlay */}
        <div className="card-overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = "rgba(0,0,0,0.28)"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = 0; e.currentTarget.style.background = "rgba(0,0,0,0)"; }}>
          <div style={{ background: "white", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 500, color: accent, display: "flex", alignItems: "center", gap: 5 }}>
            <i className="ti ti-edit" style={{ fontSize: 12 }} aria-hidden="true" />Edit card
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "12px 13px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div>
          <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: accent, marginBottom: 2 }}>{sku.sku}</div>
          <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.35 }}>{sku.name}</div>
          {data?.keyCallout
            ? <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2, lineHeight: 1.4 }}>{data.keyCallout}</div>
            : sku.color && <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 2 }}>{sku.color}</div>
          }
        </div>

        {/* Selling points */}
        {sps.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {sps.slice(0, 2).map((sp, i) => (
              <div key={i} style={{ display: "flex", gap: 5, alignItems: "flex-start" }}>
                <i className="ti ti-check" style={{ fontSize: 10, color: "#059669", flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                <span style={{ fontSize: 10, color: "var(--color-text-secondary)", lineHeight: 1.4 }}>{sp}</span>
              </div>
            ))}
          </div>
        )}

        {/* Perfect for icons */}
        {pf.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {pf.map(label => {
              const opt = PERFECT_FOR_OPTIONS.find(o => o.label === label);
              return opt ? (
                <span key={label} title={label} style={{ width: 22, height: 22, borderRadius: 5, background: accent + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className={`ti ${opt.icon}`} style={{ fontSize: 11, color: accent }} aria-hidden="true" />
                </span>
              ) : null;
            })}
          </div>
        )}

        {/* Retailers */}
        {retailers.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {retailers.map(r => (
              <span key={r} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "var(--color-background-secondary)", color: "var(--color-text-secondary)", border: "0.5px solid var(--color-border-tertiary)", fontWeight: 500 }}>{r}</span>
            ))}
          </div>
        )}

        {/* Price row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 8, borderTop: "0.5px solid var(--color-border-tertiary)", marginTop: "auto" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{sku.price ? `$${sku.price.toFixed(2)}` : "—"}</div>
            {sku.promo && <div style={{ fontSize: 10, color: "#059669" }}>Promo: ${sku.promo.toFixed(2)}</div>}
          </div>
          <div style={{ textAlign: "right" }}>
            {data?.casepack && <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Pack: {data.casepack}</div>}
            {data?.availableDate && <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{data.availableDate}</div>}
          </div>
        </div>

        {/* Completeness bar */}
        <div style={{ height: 2, background: "var(--color-background-secondary)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${completeness}%`, background: completeness === 100 ? "#059669" : completeness > 50 ? accent : "#e5e7eb", borderRadius: 99, transition: "width 0.3s" }} />
        </div>
        <div style={{ fontSize: 9, color: "var(--color-text-tertiary)", textAlign: "right", marginTop: -4 }}>{completeness}% complete</div>
      </div>
    </div>
  );
}

// ─── Product Catalog Module ───────────────────────────────────────────────────
function ProductCatalog({ skus }) {
  const [filterCat, setFilterCat] = useState("All");
  const [filterRetailer, setFilterRetailer] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [editingSku, setEditingSku] = useState(null);
  const [store, setStore] = useState({});

  const filtered = useMemo(() => skus.filter(s => {
    const matchCat = filterCat === "All" || s.category === filterCat;
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.sku.toLowerCase().includes(search.toLowerCase());
    const matchRetailer = filterRetailer === "All" || (store[s.sku]?.retailers || []).includes(filterRetailer);
    const matchStatus = filterStatus === "All" || getStatus(store[s.sku]?.status || s.status).label === filterStatus;
    return matchCat && matchSearch && matchRetailer && matchStatus;
  }), [skus, filterCat, filterRetailer, filterStatus, search, store]);

  const filled = Object.keys(store).filter(k => store[k]?.photo || store[k]?.keyCallout).length;

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
          <i className="ti ti-search" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "var(--color-text-tertiary)" }} aria-hidden="true" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search SKU or product…" style={{ paddingLeft: 32, width: "100%", boxSizing: "border-box" }} />
        </div>
        <select value={filterRetailer} onChange={e => setFilterRetailer(e.target.value)} style={{ fontSize: 12 }}>
          <option value="All">All retailers</option>
          {RETAILERS.map(r => <option key={r}>{r}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ fontSize: 12 }}>
          <option value="All">All statuses</option>
          {["Active", "Awarded", "Dropping", "Passed", "50/50"].map(s => <option key={s}>{s}</option>)}
        </select>
        <span style={{ fontSize: 12, color: "var(--color-text-secondary)", background: "var(--color-background-secondary)", padding: "6px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", flexShrink: 0 }}>
          <i className="ti ti-edit" style={{ marginRight: 5, fontSize: 11 }} aria-hidden="true" />{filled}/{skus.length} filled
        </span>
      </div>

      {/* Category pills */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        <button onClick={() => setFilterCat("All")} style={{ fontSize: 11, padding: "4px 12px", borderRadius: 99, background: filterCat === "All" ? "#7F77DD" : "var(--color-background-secondary)", color: filterCat === "All" ? "white" : "var(--color-text-secondary)", border: "0.5px solid " + (filterCat === "All" ? "#7F77DD" : "var(--color-border-tertiary)") }}>
          All ({skus.length})
        </button>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilterCat(c)} style={{ fontSize: 11, padding: "4px 12px", borderRadius: 99, background: filterCat === c ? CATEGORY_COLORS[c] : "var(--color-background-secondary)", color: filterCat === c ? "white" : "var(--color-text-secondary)", border: "0.5px solid " + (filterCat === c ? CATEGORY_COLORS[c] : "var(--color-border-tertiary)") }}>
            {c} ({skus.filter(s => s.category === c).length})
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(215px, 1fr))", gap: 14 }}>
        {filtered.map(s => (
          <CatalogCard key={s.sku} sku={s} data={store[s.sku]} onEdit={() => setEditingSku(s)} />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", padding: 60, textAlign: "center", color: "var(--color-text-secondary)", fontSize: 13 }}>
            <i className="ti ti-search-off" style={{ fontSize: 28, display: "block", marginBottom: 8, color: "var(--color-text-tertiary)" }} aria-hidden="true" />
            No products match your filters.
          </div>
        )}
      </div>

      {/* Modal */}
      {editingSku && (
        <CardModal
          sku={editingSku}
          data={store[editingSku.sku]}
          onSave={d => setStore(prev => ({ ...prev, [editingSku.sku]: d }))}
          onClose={() => setEditingSku(null)}
        />
      )}
    </div>
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
              <XAxis type="number" hide /><YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fill: "var(--color-text-secondary)" }} />
              <Tooltip formatter={v => [v, "SKUs"]} contentStyle={{ fontSize: 12 }} />
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
              <XAxis dataKey="range" tick={{ fontSize: 11 }} /><YAxis hide />
              <Tooltip formatter={v => [v + " SKUs", "Count"]} contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="count" fill="#7F77DD" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: 16 }}>
        <h3 style={{ fontSize: 13, fontWeight: 500, margin: "0 0 12px", color: "var(--color-text-secondary)" }}><i className="ti ti-alert-triangle" style={{ marginRight: 6, color: "#b45309" }} aria-hidden="true" />Action required — items dropping Sept 2026</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
          {skus.filter(s => s.status && (s.status.toLowerCase().includes("dropping") || s.status.includes("DROPPED"))).map(s => (
            <div key={s.sku} style={{ background: "var(--color-background-warning)", border: "0.5px solid #fcd34d", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: "#92400e", marginBottom: 2 }}>{s.sku}</div>
              <div style={{ fontSize: 12, color: "#78350f" }}>{s.name}</div>
              <div style={{ fontSize: 11, color: "#b45309", marginTop: 4 }}>{s.category} · {s.price ? `$${s.price.toFixed(2)}` : "—"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Assortment Grid ──────────────────────────────────────────────────────────
function AssortmentGrid({ skus }) {
  const [search, setSearch] = useState(""); const [filterCat, setFilterCat] = useState("All"); const [filterStatus, setFilterStatus] = useState("All");
  const [sortKey, setSortKey] = useState("category"); const [sortDir, setSortDir] = useState(1); const [selected, setSelected] = useState(new Set());
  const filtered = useMemo(() => skus.filter(s => {
    const ms = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.sku.toLowerCase().includes(search.toLowerCase());
    return ms && (filterCat === "All" || s.category === filterCat) && (filterStatus === "All" || getStatus(s.status).label === filterStatus);
  }).sort((a, b) => { let av = a[sortKey] ?? "", bv = b[sortKey] ?? ""; if (typeof av === "string") av = av.toLowerCase(); if (typeof bv === "string") bv = bv.toLowerCase(); return av < bv ? -sortDir : av > bv ? sortDir : 0; }), [skus, search, filterCat, filterStatus, sortKey, sortDir]);
  function ts(key) { if (sortKey === key) setSortDir(d => -d); else { setSortKey(key); setSortDir(1); } }
  const ColH = ({ label, k, w }) => <th onClick={() => ts(k)} style={{ cursor: "pointer", whiteSpace: "nowrap", fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", padding: "8px 10px", textAlign: "left", userSelect: "none", background: "var(--color-background-secondary)", position: "sticky", top: 0, zIndex: 1, width: w }}>{label} {sortKey === k ? (sortDir > 0 ? "↑" : "↓") : ""}</th>;
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <i className="ti ti-search" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "var(--color-text-tertiary)" }} aria-hidden="true" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search SKU or name…" style={{ paddingLeft: 32, width: "100%", boxSizing: "border-box" }} />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ fontSize: 12 }}><option>All</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ fontSize: 12 }}>{["All","Active","Awarded","Dropping","Passed"].map(s => <option key={s}>{s}</option>)}</select>
        <span style={{ fontSize: 12, color: "var(--color-text-secondary)", marginLeft: "auto" }}>{filtered.length} of {skus.length} SKUs{selected.size > 0 && <span style={{ marginLeft: 8, color: "#7F77DD" }}>· {selected.size} selected</span>}</span>
      </div>
      <div style={{ overflowX: "auto", borderRadius: 10, border: "0.5px solid var(--color-border-tertiary)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "fixed" }}>
          <thead><tr>
            <th style={{ width: 36, padding: "8px 10px", background: "var(--color-background-secondary)", position: "sticky", top: 0 }}><input type="checkbox" onChange={e => setSelected(e.target.checked ? new Set(filtered.map(s => s.sku)) : new Set())} checked={selected.size === filtered.length && filtered.length > 0} /></th>
            <ColH label="SKU" k="sku" w={140} /><ColH label="Product" k="name" w={200} /><ColH label="Category" k="category" w={120} /><ColH label="Color" k="color" w={90} />
            <ColH label="Retail" k="price" w={75} /><ColH label="Promo" k="promo" w={75} /><ColH label="Marquee" k="marquee" w={80} />
            <ColH label="Buy Type" k="buyType" w={90} /><ColH label="Placement" k="placement" w={110} /><ColH label="Doors" k="doors" w={70} /><ColH label="Status" k="status" w={110} />
          </tr></thead>
          <tbody>{filtered.map((s, i) => (
            <tr key={s.sku} style={{ background: selected.has(s.sku) ? "rgba(127,119,221,0.07)" : i % 2 === 0 ? "var(--color-background-primary)" : "var(--color-background-secondary)" }}>
              <td style={{ padding: "7px 10px", textAlign: "center" }}><input type="checkbox" checked={selected.has(s.sku)} onChange={() => { const n = new Set(selected); n.has(s.sku) ? n.delete(s.sku) : n.add(s.sku); setSelected(n); }} /></td>
              <td style={{ padding: "7px 10px", fontFamily: "var(--font-mono)", fontSize: 11, color: "#7F77DD", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.sku}</td>
              <td style={{ padding: "7px 10px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</td>
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
          ))}</tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "var(--color-text-secondary)", fontSize: 13 }}><i className="ti ti-search-off" style={{ fontSize: 24, display: "block", marginBottom: 8 }} />No SKUs match.</div>}
      </div>
    </div>
  );
}

// ─── Retailer Planning ────────────────────────────────────────────────────────
function RetailerPlanning({ skus }) {
  const [view, setView] = useState("scorecard");
  const replen = skus.filter(s => s.buyType?.includes("REPLEN") && s.status && (s.status.includes("CURRENT") || s.status.includes("AWARDED")) && !s.status.toLowerCase().includes("dropping") && !s.status.includes("DROPPED"));
  const dropIn = skus.filter(s => s.buyType === "DROP IN" && s.status?.includes("AWARDED"));
  const dropping = skus.filter(s => s.status && (s.status.toLowerCase().includes("dropping") || s.status.includes("DROPPED")));
  const placementGroups = {};
  skus.filter(s => s.placement).forEach(s => { if (!placementGroups[s.placement]) placementGroups[s.placement] = []; placementGroups[s.placement].push(s); });
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <div style={{ background: "#1a1a2e", borderRadius: 10, padding: "16px 20px", flex: 1, color: "white" }}>
          <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>Retailer</div>
          <div style={{ fontSize: 18, fontWeight: 500 }}>Target</div>
          <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>2026 Assortment Plan</div>
        </div>
        {[{ label: "Replen SKUs", value: replen.length, icon: "ti-repeat", color: "#059669" },{ label: "Drop-in Events", value: dropIn.length, icon: "ti-calendar-event", color: "#0369a1" },{ label: "Dropping Items", value: dropping.length, icon: "ti-trending-down", color: "#b45309" },{ label: "Placement Types", value: Object.keys(placementGroups).length, icon: "ti-layout", color: "#7F77DD" }].map(m => (
          <div key={m.label} style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "16px 20px", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}><i className={`ti ${m.icon}`} style={{ fontSize: 14, color: m.color }} aria-hidden="true" /><span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{m.label}</span></div>
            <div style={{ fontSize: 20, fontWeight: 500 }}>{m.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["scorecard","placements","timeline"].map(v => <button key={v} onClick={() => setView(v)} style={{ background: view === v ? "#7F77DD" : "var(--color-background-secondary)", color: view === v ? "white" : "var(--color-text-secondary)", border: "0.5px solid " + (view === v ? "#7F77DD" : "var(--color-border-tertiary)"), fontSize: 12, fontWeight: 500 }}>{v.charAt(0).toUpperCase() + v.slice(1)}</button>)}
      </div>
      {view === "scorecard" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[{ title: "Replenishment items", items: replen, color: "#059669", icon: "ti-refresh" },{ title: "Drop-in events", items: dropIn, color: "#0369a1", icon: "ti-calendar-plus" }].map(({ title, items, color, icon }) => (
            <div key={title} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: 16 }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)" }}><i className={`ti ${icon}`} style={{ marginRight: 6, color }} aria-hidden="true" />{title} ({items.length})</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {items.slice(0, 7).map(s => (
                  <div key={s.sku} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", background: "var(--color-background-secondary)", borderRadius: 8 }}>
                    <div><div style={{ fontSize: 12, fontWeight: 500 }}>{s.name}</div><div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{s.sku}</div></div>
                    <div style={{ textAlign: "right" }}><div style={{ fontSize: 12, fontWeight: 500 }}>{s.price ? `$${s.price.toFixed(2)}` : "—"}</div>{s.doors && <div style={{ fontSize: 10, color: "#0369a1" }}>{s.doors.toLocaleString()} doors</div>}</div>
                  </div>
                ))}
                {items.length > 7 && <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", textAlign: "center" }}>+{items.length - 7} more</div>}
              </div>
            </div>
          ))}
        </div>
      )}
      {view === "placements" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
          {Object.entries(placementGroups).sort((a,b) => b[1].length - a[1].length).map(([placement, items]) => (
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
          {[{ label: "Jan – Feb (Q1)", timing: ["Jan 11","Jan WK","Feb WK"] },{ label: "Mar – Jun (Q2)", timing: ["Mar Wk","Mar WK","BTS 2026"] },{ label: "Jul – Sep (Q3)", timing: ["9/7","Summer","C5"] },{ label: "Oct – Dec (Q4, C6)", timing: ["C6","Q4","11/9","Holiday"] }].map(period => {
            const items = skus.filter(s => s.timing && period.timing.some(t => s.timing.includes(t)));
            return (
              <div key={period.label} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#7F77DD", marginBottom: 8 }}><i className="ti ti-calendar" style={{ marginRight: 6, fontSize: 13 }} />{period.label} <span style={{ fontWeight: 400, color: "var(--color-text-tertiary)", fontSize: 11 }}>({items.length} items)</span></div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
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

// ─── SKU Rationalization ──────────────────────────────────────────────────────
function SkuRationalization({ skus }) {
  const groups = [
    { label: "Dropping Sept 2026", items: skus.filter(s => s.status && (s.status.toLowerCase().includes("dropping") || s.status.includes("DROPPED"))), severity: "high", icon: "ti-trash", tip: "Identify replacement SKUs and communicate discontinuation timelines." },
    { label: "Passed — not awarded", items: skus.filter(s => s.status && s.status.toUpperCase().includes("PASSED")), severity: "medium", icon: "ti-x", tip: "Review for potential resubmission in future line reviews." },
    { label: "No promo price set", items: skus.filter(s => s.price && s.price >= 30 && !s.promo && s.status?.includes("CURRENT")), severity: "low", icon: "ti-percentage", tip: "Consider adding promotional pricing for high-volume event windows." },
    { label: "Premium SKUs ($80+)", items: skus.filter(s => s.price && s.price >= 79.99), severity: "info", icon: "ti-star", tip: "Monitor velocity carefully — premium items need strong display support." },
  ];
  const colors = { high: "#dc2626", medium: "#b45309", low: "#0369a1", info: "#7F77DD" };
  const bgs = { high: "#fee2e2", medium: "#fef3c7", low: "#dbeafe", info: "#ede9fe" };
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {groups.map(g => (
          <div key={g.label} style={{ background: "var(--color-background-primary)", border: `0.5px solid ${colors[g.severity]}40`, borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
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
        <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)" }}>Assortment health by category</h3>
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

// ─── App Shell ────────────────────────────────────────────────────────────────
const MODULES = [
  { id: "dashboard", label: "Dashboard", icon: "ti-layout-dashboard" },
  { id: "grid", label: "Assortment grid", icon: "ti-table" },
  { id: "retailer", label: "Retailer planning", icon: "ti-building-store" },
  { id: "sku", label: "SKU rationalization", icon: "ti-filter" },
  { id: "catalog", label: "Product catalog", icon: "ti-box" },
];

export default function App() {
  const [active, setActive] = useState("catalog");
  const current = MODULES.find(m => m.id === active);
  const content = { dashboard: <Dashboard skus={RAW_SKUS} />, grid: <AssortmentGrid skus={RAW_SKUS} />, retailer: <RetailerPlanning skus={RAW_SKUS} />, sku: <SkuRationalization skus={RAW_SKUS} />, catalog: <ProductCatalog skus={RAW_SKUS} /> };
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "var(--font-sans)", background: "var(--color-background-tertiary)", overflow: "hidden" }}>
      <div style={{ width: 200, background: "#1a1a2e", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 16px 16px", borderBottom: "0.5px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, background: "#7F77DD", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><i className="ti ti-chart-treemap" style={{ fontSize: 14, color: "white" }} /></div>
            <div><div style={{ fontSize: 12, fontWeight: 500, color: "white" }}>AssortIQ</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Assortment planning</div></div>
          </div>
        </div>
        <div style={{ padding: "12px 8px", flex: 1 }}>
          {MODULES.map(m => (
            <button key={m.id} onClick={() => setActive(m.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, marginBottom: 2, background: active === m.id ? "rgba(127,119,221,0.2)" : "transparent", color: active === m.id ? "#a89fef" : "rgba(255,255,255,0.55)", border: active === m.id ? "0.5px solid rgba(127,119,221,0.3)" : "0.5px solid transparent", cursor: "pointer", textAlign: "left", fontSize: 12 }}>
              <i className={`ti ${m.icon}`} style={{ fontSize: 15, flexShrink: 0 }} />{m.label}
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
            <i className={`ti ${current?.icon}`} style={{ fontSize: 16, color: "#7F77DD" }} />
            <h1 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>{current?.label}</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", background: "var(--color-background-secondary)", padding: "4px 10px", borderRadius: 99, border: "0.5px solid var(--color-border-tertiary)" }}><i className="ti ti-building-store" style={{ marginRight: 4, fontSize: 11 }} />Target · 2026</span>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "#7F77DD20", display: "flex", alignItems: "center", justifyContent: "center" }}><i className="ti ti-user" style={{ fontSize: 14, color: "#7F77DD" }} /></div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>{content[active]}</div>
      </div>
    </div>
  );
}
