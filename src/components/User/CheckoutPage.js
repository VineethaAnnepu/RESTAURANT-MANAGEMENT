// src/components/User/CheckoutPage.js
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderSearch from "./HeaderSearch";
import "./CheckoutPage.css";

/* --- Right-swipe helper for the bottom bar --- */
function useSwipe({ onSwipe, sensitivity = 20 }) {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [swiping, setSwiping] = useState(false);

  const onStart = (e) => {
    setStart(e.targetTouches[0].clientX);
    setEnd(null);
    setSwiping(false);
  };
  const onMove = (e) => {
    e.preventDefault();
    const x = e.targetTouches[0].clientX;
    setEnd(x);
    if (Math.abs((start ?? x) - x) > 5) setSwiping(true);
  };
  const onEnd = () => {
    if (start == null || end == null) {
      setStart(null);
      setSwiping(false);
      return;
    }
    const distance = start - end;
    const isRight = distance < -sensitivity;
    if (isRight) onSwipe();
    setStart(null);
    setEnd(null);
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

  // Page state
  const [orderType, setOrderType] = useState("Take Away");
  const [instructions, setInstructions] = useState("");
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  // Details via props (from Home)
  const name = userDetails?.name || "";
  const phone = userDetails?.contact || "";
  const address = userDetails?.address || "";
  const members = userDetails?.persons ? parseInt(userDetails.persons, 10) : 2;

  // Bill
  const subtotal = cart.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const deliveryCharge = orderType === "Take Away" ? 50 : 0;
  const taxes = subtotal * 0.05;
  const grandTotal = subtotal + deliveryCharge + taxes;

  // Place order -> Thank You
  const handlePlaceOrder = () => {
    if (!name || !phone) {
      alert("Please fill in your Name and Contact on the home screen.");
      return;
    }
    if (orderType === "Take Away" && !address) {
      alert("Please fill in your delivery address on the home screen.");
      return;
    }

    // Simple table allocation for dine-in
    let tableToReserve = "N/A";
    if (orderType === "Dine In") {
      const available = tables
        .filter((t) => t.status === "Available" && t.size >= members)
        .sort((a, b) => a.size - b.size);
      if (available.length) tableToReserve = available[0].number;
      else {
        alert(
          `No available tables for ${members} members right now. Please try again later.`
        );
        return;
      }
    }

    placeOrder({
      type: orderType,
      name,
      phone,
      address: orderType === "Take Away" ? address : null,
      members: orderType === "Dine In" ? members : null,
      tableNum: orderType === "Dine In" ? tableToReserve : null,
      instructions,
    });

    navigate("/thankyou");
  };

  // Swipe-to-order wiring
  const { onStart, onMove, onEnd, swiping } = useSwipe({
    onSwipe: handlePlaceOrder,
  });
  useEffect(() => {
    const el = swipeRef.current;
    if (!el) return;
    el.addEventListener("touchstart", onStart, { passive: false });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
    };
  }, [onStart, onMove, onEnd]);

  const handleClickSwipe = (e) => {
    if (swiping) {
      e.preventDefault();
      return;
    }
    handlePlaceOrder();
  };

  return (
    <div className="mobile-container checkout-page">
      {/* Header + search */}
      <HeaderSearch isCheckout={false} />

      {/* ===== Cart item cards (image left, title+X, price+stepper) ===== */}
      <section className="cart-cards">
        {cart.length === 0 ? (
          <p className="empty-cart-note">No items yet.</p>
        ) : (
          cart.map((item) => (
            <article key={item.id} className="cc2-card">
              <img src={item.image} alt={item.name} className="cc2-img" />

              <div className="cc2-body">
                <div className="cc2-top">
                  <h3 className="cc2-title">{item.name}</h3>
                  <button
                    className="cc2-remove"
                    onClick={() => updateCart(item.id, 0)}
                    aria-label="Remove item"
                    title="Remove item"
                  >
                    ×
                  </button>
                </div>

                <div className="cc2-bottom">
                  <div className="cc2-price">₹{item.price}</div>

                  <div className="cc2-stepper" role="group" aria-label="Quantity">
                    <button
                      className="cc2-step"
                      onClick={() =>
                        updateCart(item.id, Math.max(0, item.quantity - 1))
                      }
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <span className="cc2-qty">{item.quantity}</span>
                    <button
                      className="cc2-step"
                      onClick={() => updateCart(item.id, item.quantity + 1)}
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      {/* Cooking instructions */}
      <button
        className="instructions-pill"
        onClick={() => setShowInstructionsModal(true)}
      >
        Add cooking instructions (optional)
      </button>

      {/* Dine In / Take Away pill */}
      <div className="order-type-toggle pill">
        <button
          className={orderType === "Dine In" ? "active" : ""}
          onClick={() => setOrderType("Dine In")}
        >
          Dine In
        </button>
        <button
          className={orderType === "Take Away" ? "active" : ""}
          onClick={() => setOrderType("Take Away")}
        >
          Take Away
        </button>
      </div>

      {/* Compact bill */}
      <section className="bill-panel">
        <div className="row">
          <span>Item Total</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        {orderType === "Take Away" && (
          <div className="row dashed">
            <span>Delivery Charge</span>
            <span>₹{deliveryCharge.toFixed(2)}</span>
          </div>
        )}
        <div className="row">
          <span>Taxes</span>
          <span>₹{taxes.toFixed(2)}</span>
        </div>
        <div className="row total">
          <span>Grand Total</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>
      </section>

      {/* Your details */}
      <section className="details-card">
        <h3>Your details</h3>
        <div className="details-name">
          <span className="dn-text">
            {name || "Guest"}
            {phone ? `, ${phone}` : ""}
          </span>
        </div>

        {orderType === "Dine In" ? (
          <>
            <div className="details-row">
              <span className="dot" />
              <span className="details-text">
                Dining at Restaurant — guests: {members}
              </span>
            </div>
            <div className="details-row">
              <span className="dot" />
              <span className="details-text">Table will be assigned</span>
            </div>
          </>
        ) : (
          <>
            <div className="details-row">
              <span className="dot" />
              <span
                className="details-text"
                title={address ? `Delivery at Home — ${address}` : "Delivery at Home"}
              >
                Delivery at Home — {address || "—"}
              </span>
            </div>
            <div className="details-row">
              <span className="dot" />
              <span className="details-text">Delivery in 42 mins</span>
            </div>
          </>
        )}
      </section>

      {/* Spacer so content never hides behind swipe bar */}
      <div className="swipe-spacer" aria-hidden="true" />

      {/* Swipe to Order */}
      <div
        className="swipe-to-order outlined"
        ref={swipeRef}
        onClick={handleClickSwipe}
      >
        <div className="swipe-arrow solid">→</div>
        <span>Swipe to Order</span>
      </div>

      {/* Centered cooking instructions modal */}
      {showInstructionsModal && (
        <div
          className="bs-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowInstructionsModal(false)}
        >
          <div
            className="bs-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="bs-close"
              aria-label="Close"
              onClick={() => setShowInstructionsModal(false)}
            >
              ×
            </button>

            <h3 className="bs-title">Add Cooking instructions</h3>

            <div className="bs-field">
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="bs-textarea"
                placeholder="Enter instructions..."
              />
              <p className="bs-help">
                The restaurant will try its best to follow your request. However,
                refunds or cancellations in this regard won't be possible
              </p>
            </div>

            <div className="bs-actions">
              <button
                className="bs-btn bs-btn--ghost"
                onClick={() => setShowInstructionsModal(false)}
              >
                Cancel
              </button>
              <button
                className="bs-btn bs-btn--primary"
                onClick={() => setShowInstructionsModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
