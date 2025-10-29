import React, { useMemo } from "react";
import "./CategoryButton.css";

// exact labels -> file stems (match your /public/assest/icons/*.svg)
const ICON_STEMS = {
  "Appetizers": "appetizers", // Changed to springrolls to match files
  "Soups": "soup",
  "Salads": "saladdish",
  "Veggies": "saladdish", // <-- FIX: Added Veggies to use the salad icon
  "Burgers": "burger",
  "Sandwiches": "sandwich",
  "Wraps": "springrolls",
  "Sides": "frenchfries",
  "Beverages": "drinks",
  "Desserts": "desserts",
  "Pizza": "pizza",
};

function buildCandidates(stem) {
  const base = (process.env.PUBLIC_URL || "").replace(/\/+$/, "");
  // FIX: Updated paths to point to your /public/assest/icons/ folder
  return [
    `${base}/assest/icons/${stem}.svg`,
    `/assest/icons/${stem}.svg`,
    `assest/icons/${stem}.svg`,
  ];
}

export default function CategoryButton({ category, isActive, onClick }) {
  const stem = ICON_STEMS[category] || "saladdish";
  const candidates = useMemo(() => buildCandidates(stem), [stem]);

  // rotate through candidates on error
  const onError = (e) => {
    const cur = e.currentTarget.getAttribute("data-idx") || "0";
    const next = Number(cur) + 1;
    if (next < candidates.length) {
      e.currentTarget.src = candidates[next];
      e.currentTarget.setAttribute("data-idx", String(next));
    } else {
      // ultimate fallback: a tiny inline salad icon
      e.currentTarget.src =
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" stroke-width="1.5"/><path d="M5 14h14M7 10h10" stroke-width="1.5"/></svg>'
        );
    }
  };

  return (
    <button
      type="button"
      className={`category-btn ${isActive ? "active" : ""}`}
      onClick={() => onClick(category)}
    >
      <div className="category-icon-wrap">
        <img
          src={candidates[0]}
          data-idx="0"
          alt={category}
          width={28}
          height={28}
          loading="eager"
          decoding="async"
          onError={onError}
        />
      </div>
      <span className="category-label">{category}</span>
    </button>
  );
}