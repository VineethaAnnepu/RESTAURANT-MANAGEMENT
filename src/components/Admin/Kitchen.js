// src/components/Admin/Kitchen.js
import React, { useEffect, useMemo, useState } from 'react';
import './Kitchen.css';

// ---- helpers for variants & time ----
function getCardVariant(order) {
  if (order.status === 'processing') return 'processing';
  if (order.status === 'done' && order.type === 'Dine In') return 'done-dinein';
  if (order.status === 'done' && order.type !== 'Dine In') return 'done-takeaway';
  return 'processing';
}

function minutesLeft(order) {
  const total = typeof order.durationMinutes === 'number'
    ? order.durationMinutes
    : (() => { const m = /\d+/.exec(order.duration || ''); return m ? parseInt(m[0], 10) : 15; })();

  const start = order.startedAt ? Number(order.startedAt) : Date.now();
  const elapsedMin = Math.floor((Date.now() - start) / 60000);
  return Math.max(0, total - elapsedMin);
}

function StatusPill({ order }) {
  const isProc = order.status === 'processing';
  const isDine = order.type === 'Dine In';
  const sub = isProc ? `Ongoing: ${minutesLeft(order)} Min` : (isDine ? 'Served' : 'Not Picked up');
  const title = isProc ? (isDine ? 'Dine In' : 'Take Away') : (isDine ? 'Done' : 'Take Away');

  return (
    <div className="status-pill">
      <div>{title}</div>
      <div className="small">{sub}</div>
    </div>
  );
}

function OrderCard({ order, onComplete }) {
  const variant = getCardVariant(order);
  const isProcessing = order.status === 'processing';
  const isDine = order.type === 'Dine In';

  return (
    <div className={`order-card ${variant}`}>
      {/* header white capsule */}
      <div className="head-block">
        <div className="card-head">
          <div className="head-left">
            <div className="head-icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M7 2c.55 0 1 .45 1 1v7h1V3a1 1 0 1 1 2 0v7h1V3a1 1 0 1 1 2 0v8a3 3 0 0 1-3 3h-1v7a1 1 0 1 1-2 0v-7H9a3 3 0 0 1-3-3V3c0-.55.45-1 1-1zM17 2h2v20a1 1 0 1 1-2 0V2z"/>
              </svg>
            </div>
            <div>
              <div className="order-id">#{order.id}</div>
              <div className="order-meta">
                <span>{isDine ? order.table : 'Takeaway'}</span>
                <span>{order.time}</span>
                <span>{order.itemCount} Item</span>
              </div>
            </div>
          </div>
          <StatusPill order={order} />
        </div>
      </div>

      {/* items block */}
      <div className="order-card__body">
        <div className="items-block">
          {(order.items || []).map((it, idx) => (
            <div className="item-row" key={idx}>
              <span className="item-qty">{it.quantity} x</span>
              <span className="item-name">{it.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* footer */}
      <div className="card-foot">
        {isProcessing ? (
          <button className="action-btn" onClick={() => onComplete(order.id)}>
            Processing <span className="btn-icon">⏳</span>
          </button>
        ) : (
          <button className="action-btn" type="button">
            Order Done <span className="btn-icon">✅</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function Kitchen({ orders = [], updateOrderStatus }) {
  const [tick, setTick] = useState(0);

  // auto tick every minute
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  // Auto-complete when countdown ends + Auto-hide after 4 hours
  useEffect(() => {
    const now = Date.now();

    orders.forEach(order => {
      // skip archived
      if (order.status === 'archived') return;

      // 1) Auto mark done at 0
      if (order.status === 'processing') {
        const left = minutesLeft(order);
        if (left <= 0) {
          updateOrderStatus(order.id, 'done');
        }
      }

      // 2) Hide 4 hours after done
      if (order.status === 'done') {
        const doneAt = order.doneAt ? Number(order.doneAt) : now;
        const hours = (now - doneAt) / (1000 * 60 * 60);
        // set doneAt once if missing (via updateOrderStatus we already stamp doneAt)
        if (order.doneAt && hours >= 4) {
          updateOrderStatus(order.id, 'archived');
        }
      }
    });
  }, [orders, tick, updateOrderStatus]);

  // Only show non-archived orders; processing first, then done
  const visibleOrders = useMemo(() => {
    const list = orders.filter(o => o.status !== 'archived');
    return list.sort((a, b) => {
      if (a.status === b.status) return b.id - a.id;
      return a.status === 'processing' ? -1 : 1;
    });
  }, [orders]);

  const handleComplete = (id) => updateOrderStatus(id, 'done');

  return (
    <div className="kitchen-container">
      <h1 className="kitchen-title">Order Line</h1>
      <div className="board">
        <div className="orders-grid">
          {visibleOrders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            visibleOrders.map(o => (
              <OrderCard key={o.id} order={o} onComplete={handleComplete} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
