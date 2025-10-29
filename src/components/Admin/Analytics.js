import React, { useMemo, useState } from "react";
import "./Analytics.css";

/* ---------------- Utilities (robust counts + date ranges) ---------------- */
const p2 = (n) => String(n).padStart(2, "0");

// The utility must allow 0 to be a valid, returned number.
const toInt = (v) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

// NEW ROBUST HELPER: Finds the first valid client count in the order object.
function findClientCount(order, fields) {
    for (const field of fields) {
        // Check if the property exists and is not null/undefined
        if (order.hasOwnProperty(field) && order[field] !== null && order[field] !== undefined) {
            const count = toInt(order[field]);
            // If we find a valid number (even 0), return it immediately.
            return count;
        }
    }
    // If no field is found or all fields are invalid/missing, return 0.
    return 0;
}

// Read clients even if order fields vary
function extractClients(order) {
    // Define the list of fields to check for Dine In and Take Away
    const DINE_FIELDS = ['guests', 'noOfPeople', 'people', 'members', 'dineInMembers'];
    const TAKE_FIELDS = ['takeawayGuests', 'takeawayMem', 'takeawayMembers', 'members', 'people']; // Overlaps with dine-in

    let dine = 0;
    let take = 0;

    if (order.type === "Dine In") {
        dine = findClientCount(order, DINE_FIELDS);
    } else if (order.type === "Take Away") {
        take = findClientCount(order, TAKE_FIELDS);
    } else {
        // For orders without a clear type, try to find both.
        dine = findClientCount(order, DINE_FIELDS);
        take = findClientCount(order, TAKE_FIELDS);
    }
    
    // Fallback: If no client count is found but an order exists, assume 1 client.
    if (dine === 0 && take === 0) {
         if (order.type === "Dine In") {
             dine = 1;
         } else if (order.type === "Take Away") {
             take = 1;
         }
    }

    return { dine, take };
}

// Helper to calculate total revenue for a single order
const calculateOrderRevenue = (order) => {
    return (order.items || []).reduce(
        (s, it) => s + toInt(it.price) * (toInt(it.quantity) || 1),
        0
    );
}

const ts = (o) => Number(o.placedAt ?? o.createdAt ?? o.time ?? Date.now());

function startOfToday() { const d = new Date(); d.setHours(0,0,0,0); return d.getTime(); }
function startOfWeek() { const d = new Date(); const g = d.getDay(); const diff = (g + 6) % 7; d.setDate(d.getDate() - diff); d.setHours(0,0,0,0); return d.getTime(); }
function startOfMonth() { const d = new Date(); d.setDate(1); d.setHours(0,0,0,0); return d.getTime(); }

function filterByRange(list, range) {
  if (!range) return list;
  let s = 0;
  if (range === "Daily") s = startOfToday();
  else if (range === "Weekly") s = startOfWeek();
  else if (range === "Monthly") s = startOfMonth();
  return s ? list.filter((o) => ts(o) >= s) : list;
}

/* ---------------- Small presentational bits ---------------- */
const WEEK = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

// Define an absolute ceiling for the Y-axis scale (Adjust this value based on your typical max daily/weekly revenue)
const MAX_REVENUE_CEILING = 5000; 

// Ensures the width is always formatted correctly as a CSS string
const barWidth = (n) => {
  if (n <= 0) return "0%";
  if (n >= 100) return "calc(100% - 8px)";
  return `calc(${n}% - 4px)`;
};

function RevenueCurve({ values }) {
  // FIX: Use the fixed ceiling instead of the dynamic maximum
  const max = MAX_REVENUE_CEILING;

  const pts = values.map((v, i) => {
    const x = (i / 6) * 100;
    
    // Ensure value doesn't exceed the ceiling before scaling
    const valueToScale = Math.min(v, max); 
    
    // Scale against the fixed ceiling
    const y = 100 - (valueToScale / max) * 100; 
    return { x, y };
  });

  // Calculate the linear path string (d) using only straight lines (L)
  const d = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    // Use simple LineTo (L) for angular graph style
    return `${acc} L ${p.x},${p.y}`;
  }, "");
  
  // Calculate the shaded area path
  const areaPath = d ? `${d} L 100,100 L 0,100 Z` : '';

  return (
    <div className="rev-card">
      <svg viewBox="0 0 100 100" className="rev-svg" preserveAspectRatio="none">
        <rect x="0" y="0" width="100" height="100" className="rev-bg" />
        
        {/* Draw the shaded area (rev-area) first */}
        {d && <path d={areaPath} className="rev-area" />}
        
        {/* Draw the revenue line (rev-line) on top */}
        {d && <path d={d} className="rev-line" />}
        
      </svg>
      <div className="rev-week">
        {WEEK.map((d) => (
          <div key={d} className="rev-day">
            <span className="rev-label">{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Donut({ served, dineIn, takeAway }) {
  const total = Math.max(1, served + dineIn + takeAway);
  const pct = (n) => Math.round((n / total) * 100);
  const pTake = pct(takeAway);
  const pServ = pct(served);
  const pDine = pct(dineIn);
  const rotServ = pTake;
  const rotDine = pTake + pServ;

  return (
    <svg className="donut" viewBox="0 0 36 36" aria-hidden>
      <path className="donut-ring" d="M18 2a16 16 0 1 1 0 32a16 16 0 1 1 0-32" />
      {!!pTake && (
        <path className="donut-seg seg-take" strokeDasharray={`${pTake},100`}
          d="M18 2a16 16 0 1 1 0 32a16 16 0 1 1 0-32" />
      )}
      {!!pServ && (
        <path className="donut-seg seg-serv" strokeDasharray={`${pServ},100`}
          transform={`rotate(${(360 * rotServ) / 100},18,18)`}
          d="M18 2a16 16 0 1 1 0 32a16 16 0 1 1 0-32" />
      )}
      {!!pDine && (
        <path className="donut-seg seg-dine" strokeDasharray={`${pDine},100`}
          transform={`rotate(${(360 * rotDine) / 100},18,18)`}
          d="M18 2a16 16 0 1 1 0 32a16 16 0 1 1 0-32" />
      )}
      <circle cx="18" cy="18" r="10.5" className="donut-hole" />
    </svg>
  );
}

/* ---------------- Main Analytics ---------------- */
export default function Analytics({
  orders = [],
  tables = [],
  chefs = [],
  checkFilter = () => true,
  filterBlur = "none",
}) {
  const [range, setRange] = useState("Daily");

  const m = useMemo(() => {
    const filtered = filterByRange(orders, range);

    const totalRevenue = filtered.reduce((sum, o) => sum + calculateOrderRevenue(o), 0);

    const totalItems = filtered.reduce(
      (sum, o) => sum + (o.items || []).reduce((s, it) => s + (toInt(it.quantity) || 1), 0),
      0
    );

    const clients = filtered.reduce((sum, o) => {
      const { dine, take } = extractClients(o);
      return sum + dine + take;
    }, 0);

    const served = filtered.filter((o) => o.status === "done").length;
    const dineIn = filtered.filter((o) => o.type === "Dine In").length;
    const takeAway = filtered.filter((o) => o.type === "Take Away").length;

    const forPct = Math.max(1, served + dineIn + takeAway);
    const pct = {
      take: Math.round((takeAway / forPct) * 100),
      serv: Math.round((served / forPct) * 100),
      dine: Math.round((dineIn / forPct) * 100),
    };

    const byDay = Array(7).fill(0);
    filtered.forEach((o) => {
      const d = new Date(ts(o));
      let idx = (d.getDay() + 6) % 7; 
      
      const rev = calculateOrderRevenue(o); 
      byDay[idx] += rev;
    });

    const ordersByChef = chefs.map((c) => ({
      id: c.id,
      name: c.name || "Chef",
      taken: filtered.filter((o) => String(o.chefId) === String(c.id)).length, // FIX: Convert IDs to strings for reliable comparison
    }));

    return {
      totalRevenue,
      totalItems,
      clients,
      served,
      dineIn,
      takeAway,
      pct,
      byDay,
      ordersByChef,
    };
  }, [orders, chefs, range]);

  return (
    <div className="ana-root">
      {/* ===== Top Cards ===== */}
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-icon bubble">👨‍🍳</div>
          <div className="metric-meta">
            <div className="metric-label">TOTAL CHEF</div>
            <div className="metric-value">{p2(chefs.length)}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bubble">₹</div>
          <div className="metric-meta">
            <div className="metric-label">TOTAL REVENUE</div>
            <div className="metric-value">₹{m.totalRevenue}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bubble">📦</div>
          <div className="metric-meta">
            <div className="metric-label">TOTAL ORDERS</div>
            <div className="metric-value">{p2(m.totalItems)}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bubble">👥</div>
          <div className="metric-meta">
            <div className="metric-label">TOTAL CLIENTS</div>
            <div className="metric-value">{p2(m.clients)}</div>
          </div>
        </div>
      </div>

      {/* ===== 3 cols: Summary | Revenue | Tables ===== */}
      <div className="grid-3">
        {/* Order Summary */}
        <section className="panel" style={{ filter: checkFilter("Order Summary") ? "none" : filterBlur }}>
          <header className="panel-head">
            <h3>Order Summary</h3>
            <select className="soft-select" value={range} onChange={(e) => setRange(e.target.value)}>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </header>

          <div className="kpi-3">
            <div className="kpi-tile"><div className="kpi-val">{p2(m.served)}</div><div className="kpi-lbl">Served</div></div>
            <div className="kpi-tile"><div className="kpi-val">{p2(m.dineIn)}</div><div className="kpi-lbl">Dine In</div></div>
            <div className="kpi-tile"><div className="kpi-val">{p2(m.takeAway)}</div><div className="kpi-lbl">Take Away</div></div>
          </div>

          <div className="sum-row">
            <Donut served={m.served} dineIn={m.dineIn} takeAway={m.takeAway} />
            <div className="legend-col">
              <div className="leg-row">
                <span className="leg-text">Take Away ({m.pct.take}%)</span>
                <span className="leg-bar"><i style={{ width: barWidth(m.pct.take) }} /></span>
              </div>
              <div className="leg-row">
                <span className="leg-text">Served ({m.pct.serv}%)</span>
                <span className="leg-bar"><i style={{ width: barWidth(m.pct.serv) }} /></span>
              </div>
              <div className="leg-row">
                <span className="leg-text">Dine In ({m.pct.dine}%)</span>
                <span className="leg-bar"><i style={{ width: barWidth(m.pct.dine) }} /></span>
              </div>
            </div>
          </div>
        </section>

        {/* Revenue */}
        <section className="panel" style={{ filter: checkFilter("Revenue") ? "none" : filterBlur }}>
          <header className="panel-head">
            <h3>Revenue</h3>
            <select className="soft-select" value={range} onChange={(e) => setRange(e.target.value)}>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </header>
          <RevenueCurve values={m.byDay} />
        </section>

        {/* Tables */}
        <section className="panel" style={{ filter: checkFilter("Tables") ? "none" : filterBlur }}>
          <header className="panel-head">
            <h3>Tables</h3>
            <div className="legend-top">
              <span className="dot dot-res" /> Reserved
              <span className="dot dot-av" /> Available
            </div>
          </header>
          <div className="tables-grid tight">
            {tables.map((t) => (
              <div key={t.id} className={`table-cell ${t.status === "Reserved" ? "is-reserved" : "is-open"}`}>
                <div className="tbl-top">Table</div>
                <div className="tbl-num">{p2(t.number)}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ===== Chef list (bottom) ===== */}
      <section className="panel chef-panel">
        <div className="chef-head">
          <h3>Chef Name</h3>
          <h3>Order Taken</h3>
        </div>
        <div className="chef-list">
          {m.ordersByChef.length ? (
            m.ordersByChef.map((c) => (
              <div key={c.id || c.name} className="chef-row">
                <div className="chef-name">{c.name}</div>
                <div className="chef-count">{p2(c.taken)}</div>
              </div>
            ))
          ) : (
            <div className="chef-empty">No chefs added yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}