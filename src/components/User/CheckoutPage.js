import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderSearch from "./HeaderSearch";
import "./CheckoutPage.css";

/* ---------- same image helper as HomePage ---------- */
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="140" height="100" viewBox="0 0 140 100"><rect width="140" height="100" fill="#f1f5f9"/><path d="M84 68H78V60H60v8h-6V50h6v8h18v-8h6zM70 30a10 10 0 110 20a10 10 0 010-20z" fill="#94a3b8"/></svg>');

function makeCandidates(src) {
  const PUB = (process.env.PUBLIC_URL || '').replace(/\/+$/, '');
  const base = String(src || '').replace(/^\/+/, '');
  const name = base.split('/').slice(-1)[0];
  const list = [
    `${PUB}/${base}`, `/${base}`, base,
    `${PUB}/asset/${name}`, `/asset/${name}`, `asset/${name}`,
    `${PUB}/assest/${name}`, `/assest/${name}`, `assest/${name}`,
  ];
  return [...new Set(list)];
}

function Img({ item, className, alt }) {
  const base64 = item?.imageBase64 || null;
  const [idx, setIdx] = useState(0);
  const candidates = makeCandidates(item?.image || '');
  const current = base64 || candidates[idx] || PLACEHOLDER_IMAGE;
  return (
    <img
      src={current}
      alt={alt || item?.name || 'image'}
      className={className}
      onError={() => {
        if (base64) setIdx(0);
        else if (idx < candidates.length - 1) setIdx(idx + 1);
      }}
    />
  );
}
/* --------------------------------------------------- */

function useSwipe({ onSwipe, sensitivity = 20 }) {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [swiping, setSwiping] = useState(false);

  const onStart = (e) => { setStart(e.targetTouches[0].clientX); setEnd(null); setSwiping(false); };
  const onMove = (e) => { e.preventDefault(); const x = e.targetTouches[0].clientX; setEnd(x); if (Math.abs((start ?? x) - x) > 5) setSwiping(true); };
  const onEnd = () => {
    if (start == null || end == null) { setStart(null); setSwiping(false); return; }
    const distance = start - end;
    if (distance < -sensitivity) onSwipe();
    setStart(null); setEnd(null);
  };
  return { onStart, onMove, onEnd, swiping };
}

export default function CheckoutPage({
  cart = [],
  updateCart,
  placeOrder,
  tables = [],
  userDetails,
}) {
  const navigate = useNavigate();
  const swipeRef = useRef(null);

  const [orderType, setOrderType] = useState("Take Away");
  const [instructions, setInstructions] = useState("");
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  const name = userDetails?.name || "";
  const phone = userDetails?.contact || "";
  const address = userDetails?.address || "";
  const members = userDetails?.persons ? parseInt(userDetails.persons, 10) : 2;

  const subtotal = cart.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const deliveryCharge = orderType === "Take Away" ? 50 : 0;
  const taxes = subtotal * 0.05;
  const grandTotal = subtotal + deliveryCharge + taxes;

  const handlePlaceOrder = () => {
    if (!name || !phone) { alert("Please fill in your Name and Contact on the home screen."); return; }
    if (orderType === "Take Away" && !address) { alert("Please fill in your delivery address on the home screen."); return; }

    const newOrderId = placeOrder({
      type: orderType,
      name, phone,
      address: orderType === "Take Away" ? address : null,
      persons: members,
      instructions,
      total: grandTotal,
    });
    if (newOrderId) navigate("/thankyou");
  };

  const { onStart, onMove, onEnd, swiping } = useSwipe({ onSwipe: handlePlaceOrder, sensitivity: 40 });

  useEffect(() => {
    const el = swipeRef.current; if (!el) return;
    el.addEventListener("touchstart", onStart, { passive: false });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
    };
  }, [onStart, onMove, onEnd]);

  const handleClickSwipe = (e) => { if (swiping) { e.preventDefault(); return; } handlePlaceOrder(); };
  const updateQuantity = (id, q) => updateCart({ id, quantity: q });

  return (
    <div className="mobile-container checkout-page">
      <HeaderSearch isCheckout={true} />

      <section className="cart-cards">
        {cart.length === 0 ? (
          <p className="empty-cart-note">No items yet.</p>
        ) : (
          cart.map((item) => (
            <article key={item.id} className="cc2-card">
              <Img item={item} className="cc2-img" alt={item.name} />
              <div className="cc2-body">
                <div className="cc2-top">
                  <h3 className="cc2-title">{item.name}</h3>
                  <button className="cc2-remove" onClick={() => updateQuantity(item.id, 0)} aria-label="Remove item">×</button>
                </div>
                <div className="cc2-bottom">
                  <div className="cc2-price">₹{item.price}</div>
                  <div className="cc2-stepper" role="group" aria-label="Quantity">
                    <button className="cc2-step" onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))} aria-label="Decrease">−</button>
                    <span className="cc2-qty">{item.quantity}</span>
                    <button className="cc2-step" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase">+</button>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      <button className="instructions-pill" onClick={() => setShowInstructionsModal(true)}>Add cooking instructions (optional)</button>

      <div className="order-type-toggle pill">
        <button className={orderType === "Dine In" ? "active" : ""} onClick={() => setOrderType("Dine In")}>Dine In</button>
        <button className={orderType === "Take Away" ? "active" : ""} onClick={() => setOrderType("Take Away")}>Take Away</button>
      </div>

      <section className="bill-panel">
        <div className="row"><span>Item Total</span><span>₹{subtotal.toFixed(2)}</span></div>
        {orderType === "Take Away" && (<div className="row dashed"><span>Delivery Charge</span><span>₹{deliveryCharge.toFixed(2)}</span></div>)}
        <div className="row"><span>Taxes</span><span>₹{taxes.toFixed(2)}</span></div>
        <div className="row total"><span>Grand Total</span><span>₹{grandTotal.toFixed(2)}</span></div>
      </section>

      <section className="details-card">
        <h3>Your details</h3>
        <div className="details-name"><span className="dn-text">{name || "Guest"}{phone ? `, ${phone}` : ""}</span></div>
        {orderType === "Dine In" ? (
          <>
            <div className="details-row"><span className="dot" /><span className="details-text">Dining at Restaurant — guests: {members}</span></div>
            <div className="details-row"><span className="dot" /><span className="details-text">Table will be assigned</span></div>
          </>
        ) : (
          <>
            <div className="details-row"><span className="dot" /><span className="details-text" title={address ? `Delivery at Home — ${address}` : "Delivery at Home"}>Delivery at Home — {address || "—"}</span></div>
            <div className="details-row"><span className="dot" /><span className="details-text">Delivery in 42 mins</span></div>
          </>
        )}
      </section>

      <div className="swipe-spacer" aria-hidden="true" />
      <div className="swipe-to-order outlined" ref={swipeRef} onClick={handleClickSwipe}>
        <div className="swipe-arrow solid">→</div><span>Swipe to Order</span>
      </div>

      {showInstructionsModal && (
        <div className="bs-overlay" role="dialog" aria-modal="true" onClick={() => setShowInstructionsModal(false)}>
          <div className="bs-sheet" onClick={(e) => e.stopPropagation()}>
            <button className="bs-close" aria-label="Close" onClick={() => setShowInstructionsModal(false)}>×</button>
            <h3 className="bs-title">Add Cooking instructions</h3>
            <div className="bs-field">
              <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} className="bs-textarea" placeholder="Enter instructions..." />
              <p className="bs-help">We’ll try our best to follow your request.</p>
            </div>
            <div className="bs-actions">
              <button className="bs-btn bs-btn--ghost" onClick={() => setShowInstructionsModal(false)}>Cancel</button>
              <button className="bs-btn bs-btn--primary" onClick={() => setShowInstructionsModal(false)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
