// src/components/User/CategoryButton.js
import React, { useMemo } from "react";
import "./CategoryButton.css";

// label -> icon file stem (put svgs under public/asset/icons/)
const ICON_STEMS = {
  Appetizers: "appetizers",
  Soups: "soup",
  Salads: "saladdish",
  Veggies: "saladdish",
  Burgers: "burger",
  Sandwiches: "sandwich",
  Wraps: "springrolls",
  Sides: "frenchfries",
  Beverages: "drinks",
  Desserts: "desserts",
  Pizza: "pizza",
};

function buildCandidates(stem) {
  const base = (process.env.PUBLIC_URL || "").replace(/\/+$/, "");
  return [
    `${base}/assest/icons/${stem}.svg`, // NOTE: 'asset' (no extra s)
    `/assest/icons/${stem}.svg`,
    `assest/icons/${stem}.svg`,
  ];
}

export default function CategoryButton({ category, isActive, onClick }) {
  const stem = ICON_STEMS[category] || "saladdish";
  const candidates = useMemo(() => buildCandidates(stem), [stem]);

  const onError = (e) => {
    const cur = e.currentTarget.getAttribute("data-idx") || "0";
    const next = Number(cur) + 1;
    if (next < candidates.length) {
      e.currentTarget.src = candidates[next];
      e.currentTarget.setAttribute("data-idx", String(next));
    } else {
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
