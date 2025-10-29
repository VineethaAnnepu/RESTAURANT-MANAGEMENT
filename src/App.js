// src/App.js
import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminDashboard from "./components/Admin/AdminDashboard";
import HomePage from "./components/User/HomePage";
import CheckoutPage from "./components/User/CheckoutPage";
import ThankYouPage from "./components/User/ThankYouPage";

import { INITIAL_MENU, INITIAL_ORDERS, INITIAL_CHEFS } from "./mockData";
import "./App.css";

/* -------------------- localStorage helpers -------------------- */
const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const save = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

/* -------------------- default 30 tables -------------------- */
const makeTables = () =>
  Array.from({ length: 30 }, (_, i) => ({
    id: `t${i + 1}`,
    number: i + 1,
    name: null,
    size: [2, 4, 6, 8][i % 4],
    status: "Available",
  }));

export default function App() {
  /* -------------------- app state -------------------- */
  const [menuItems, setMenuItems] = useState(() => load("menuItems", INITIAL_MENU));
  const [tables, setTables] = useState(() => load("tables", makeTables()));
  const [orders, setOrders] = useState(() => load("orders", INITIAL_ORDERS));
  const [chefs, setChefs] = useState(() => load("chefs", INITIAL_CHEFS));
  const [cart, setCart] = useState(() => load("cart", []));
  const [totalClients, setTotalClients] = useState(() => load("totalClients", 0));

  // user details captured on first visit
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  // categories derived from menuItems
  const categories = useMemo(
    () => [...new Set(menuItems.map((item) => item.category))],
    [menuItems]
  );

  /* -------------------- persist -------------------- */
  useEffect(() => save("menuItems", menuItems), [menuItems]);
  useEffect(() => save("tables", tables), [tables]);
  useEffect(() => save("orders", orders), [orders]);
  useEffect(() => save("chefs", chefs), [chefs]);
  useEffect(() => save("cart", cart), [cart]);
  useEffect(() => save("totalClients", totalClients), [totalClients]);

  /* -------------------- admin: products & tables -------------------- */
  // store uploads as Base64 in imageBase64; leave image path empty for uploaded items
  const addProduct = (p) => {
    const newProduct = {
      id: `p${Date.now()}`,
      name: p.name,
      price: Number(p.price),
      category: p.category,
      imageBase64: p.imageBase64 || null, // uploads here
      image: "",                           // asset-path items use 'image'
      description: p.description || "No description",
      averagePreparationTime: p.averagePreparationTime || 10,
      stock: p.stock || "In Stock",
    };
    setMenuItems((m) => [...m, newProduct]);
  };

  const addTable = (data) => {
    setTables((prev) => [
      ...prev,
      {
        id: `t${prev.length + 1}`,
        number: prev.length + 1,
        name: data.name || null,
        size: parseInt(data.size, 10) || 4,
        status: "Available",
      },
    ]);
  };

  const deleteTable = (tableId) => {
    setTables((prev) =>
      prev
        .filter((t) => t.id !== tableId)
        .map((t, idx) => ({ ...t, number: idx + 1 }))
    );
  };

  /* -------------------- chefs helpers -------------------- */
  const chooseLeastBusyChefId = () => {
    if (!chefs.length) return null;
    const chosen = chefs.reduce(
      (best, c) => ((c.orders ?? 0) < (best.orders ?? 0) ? c : best),
      chefs[0]
    );
    return chosen.id;
  };
  const bumpChefLoad = (chefId, delta) => {
    if (!chefId) return;
    setChefs((prev) =>
      prev.map((c) =>
        c.id === chefId ? { ...c, orders: Math.max(0, (c.orders ?? 0) + delta) } : c
      )
    );
  };

  /* -------------------- order status updates -------------------- */
  const updateOrderStatus = (orderId, newStatus) => {
    const target = orders.find((o) => o.id === orderId);

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: newStatus, doneAt: newStatus === "done" && !o.doneAt ? Date.now() : o.doneAt }
          : o
      )
    );

    if (!target) return;

    // free table when dine-in order finishes
    if (target.type === "Dine In" && (newStatus === "done" || newStatus === "cancelled")) {
      setTables((prevTables) =>
        prevTables.map((t) =>
          t.id === target.tableId ? { ...t, status: "Available" } : t
        )
      );
    }

    // adjust chef load
    if (target.chefId) {
      if (newStatus === "processing") bumpChefLoad(target.chefId, 1);
      if (newStatus === "done" || newStatus === "cancelled") bumpChefLoad(target.chefId, -1);
    }
  };

  /* -------------------- cart functions -------------------- */
  const addToCart = (itemToAdd) => {
    setCart((prevCart) => {
      const itemExists = prevCart.find((i) => i.id === itemToAdd.id);
      if (itemExists) {
        const newQuantity = itemToAdd.quantity ?? (itemExists.quantity + 1);
        if (newQuantity <= 0) return prevCart.filter((i) => i.id !== itemToAdd.id);
        return prevCart.map((i) => (i.id === itemToAdd.id ? { ...i, quantity: newQuantity } : i));
      }
      return [...prevCart, { ...itemToAdd, quantity: 1 }];
    });
  };

  /* -------------------- place order (normalized for Admin/Kitchen) -------------------- */
  const placeOrder = (orderDetails) => {
    const chefId = chooseLeastBusyChefId();
    bumpChefLoad(chefId, 1);

    // allocate table (smallest suitable)
    let tableId = null;
    let tableNumber = null;
    if (orderDetails.type === "Dine In") {
      const available = tables
        .filter((t) => t.status === "Available" && t.size >= orderDetails.persons)
        .sort((a, b) => a.size - b.size);
      if (!available.length) {
        alert(`No suitable table available for ${orderDetails.persons} guests right now.`);
        bumpChefLoad(chefId, -1);
        return null;
      }
      tableId = available[0].id;
      tableNumber = available[0].number;
      setTables((prev) => prev.map((t) => (t.id === tableId ? { ...t, status: "Occupied" } : t)));
    }

    // fields Admin/Kitchen/Tables expect
    const newOrderId = (orders[0]?.id || 0) + 1;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const itemCount = cart.reduce((n, it) => n + (it.quantity || 1), 0);

    const newOrder = {
      id: newOrderId,
      type: orderDetails.type,                // 'Dine In' | 'Take Away'
      table: tableNumber ? `Table-${tableNumber}` : "Takeaway",
      tableId,
      items: cart.slice(),
      itemCount,
      name: orderDetails.name,
      contact: orderDetails.phone || orderDetails.contact,
      address: orderDetails.type === "Take Away" ? orderDetails.address : null,
      persons: orderDetails.persons,
      status: "processing",
      time: timeStr,
      startedAt: Date.now(),
      durationMinutes: 20,                    // used by Kitchen countdown
      total: orderDetails.total,
      chefId,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setTotalClients((prev) => prev + 1);
    return newOrderId;
  };

  /* -------------------- user details modal -------------------- */
  useEffect(() => {
    const loadedDetails = load("userDetails", null);
    if (loadedDetails) {
      setUserDetails(loadedDetails);
      // keep modal logic as you prefer
    }
  }, []);

  const handleDetailsSubmit = (details) => {
    setUserDetails(details);
    save("userDetails", details);
    setIsModalOpen(false);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            menu={menuItems}
            cart={cart}
            addToCart={addToCart}
            isModalOpen={isModalOpen}
            onDetailsSubmit={handleDetailsSubmit}
            categories={categories}
          />
        }
      />
      <Route
        path="/checkout"
        element={
          userDetails ? (
            <CheckoutPage
              cart={cart}
              userDetails={userDetails}
              updateCart={addToCart}
              placeOrder={placeOrder}
              tables={tables}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="/thankyou" element={<ThankYouPage />} />
      <Route
        path="/admin"
        element={
          <AdminDashboard
            menuItems={menuItems}
            tables={tables}
            orders={orders}
            chefs={chefs}
            setMenuItems={setMenuItems}
            setTables={setTables}
            setOrders={setOrders}
            setChefs={setChefs}
            addProduct={addProduct}
            addTable={addTable}
            deleteTable={deleteTable}
            updateOrderStatus={updateOrderStatus}
            categories={categories}
          />
        }
      />
    </Routes>
  );
}
