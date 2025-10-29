// src/App.js
import React, { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
}
  from "react-router-dom";

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
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
};

/* -------------------- default 30 tables -------------------- */
const makeTables = () =>
  Array.from({ length: 30 }, (_, i) => ({
    id: `t${i + 1}`,
    number: i + 1,
    name: null,
    size: [2, 4, 6, 8][i % 4], // Mix up table sizes
    status: "Available",
  }));

export default function App() {
  /* -------------------- app state -------------------- */
  const [menuItems, setMenuItems] = useState(() =>
    load("menuItems", INITIAL_MENU)
  );
  const [tables, setTables] = useState(() => load("tables", makeTables()));
  const [orders, setOrders] = useState(() => load("orders", INITIAL_ORDERS));
  const [chefs, setChefs] = useState(() => load("chefs", INITIAL_CHEFS));
  const [cart, setCart] = useState(() => load("cart", []));
  const [totalClients, setTotalClients] = useState(() =>
    load("totalClients", 0)
  );

  // user details captured on first visit
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  // DERIVE CATEGORIES DYNAMICALLY FROM THE CURRENT menuItems STATE
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
  const addProduct = (p) => {
    // p = { name, price, category, description, imageBase64 }
    const newProduct = {
      id: `p${Date.now()}`,
      name: p.name,
      price: p.price,
      category: p.category,
      // The image is now a Base64 string, which is safe for localStorage
      image: p.imageBase64 || null,
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
        c.id === chefId
          ? { ...c, orders: Math.max(0, (c.orders ?? 0) + delta) }
          : c
      )
    );
  };

  /* -------------------- order status updates -------------------- */
  const updateOrderStatus = (orderId, newStatus) => {
    const target = orders.find((o) => o.id === orderId);

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: newStatus,
              doneAt: newStatus === "done" && !o.doneAt ? Date.now() : o.doneAt,
            }
          : o
      )
    );

    if (!target) return; // Order not found, exit early

    // Free table when a dine-in order is done or cancelled
    if (
      target.type === "Dine In" &&
      (newStatus === "done" || newStatus === "cancelled")
    ) {
      setTables((prevTables) =>
        prevTables.map((t) =>
          t.id === target.tableId ? { ...t, status: "Available" } : t
        )
      );
    }

    // Adjust chef load
    if (target.chefId) {
      if (newStatus === "processing") {
        bumpChefLoad(target.chefId, 1);
      } else if (newStatus === "done" || newStatus === "cancelled") {
        bumpChefLoad(target.chefId, -1);
      }
    }
  };

  /* -------------------- user cart functions -------------------- */
  // ***** THIS IS THE CORRECTED FUNCTION *****
  const addToCart = (itemToAdd) => {
    setCart((prevCart) => {
      const itemExists = prevCart.find((item) => item.id === itemToAdd.id);

      if (itemExists) {
        // Item is in cart, so this is a quantity update
        // The itemToAdd object *might* have a quantity (from stepper)
        // or it might not (from the menu '+' button).
        const newQuantity = itemToAdd.quantity 
          ? itemToAdd.quantity // Use new quantity if provided (from stepper)
          : itemExists.quantity + 1; // Otherwise, increment (from '+' button)

        if (newQuantity <= 0) {
          // Remove item if quantity is 0 or less
          return prevCart.filter((item) => item.id !== itemToAdd.id);
        }
        // Update the quantity for the existing item
        return prevCart.map((item) =>
          item.id === itemToAdd.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Item is NOT in cart, so add it for the first time with quantity 1
        // (The 'itemToAdd' from the menu '+' button won't have a quantity)
        return [...prevCart, { ...itemToAdd, quantity: 1 }];
      }
    });
  };

  const placeOrder = (orderDetails) => {
    const chefId = chooseLeastBusyChefId();
    bumpChefLoad(chefId, 1); // Assign to chef, increase their load

    let tableId = null;
    if (orderDetails.type === "Dine In") {
      const availableTable = tables.find(
        (t) => t.status === "Available" && t.size >= orderDetails.persons
      );
      if (availableTable) {
        tableId = availableTable.id;
        setTables((prevTables) =>
          prevTables.map((t) =>
            t.id === tableId ? { ...t, status: "Occupied" } : t
          )
        );
      } else {
        alert("No suitable table available for dine-in.");
        bumpChefLoad(chefId, -1); // Unassign chef if no table
        return null; // Don't place order
      }
    }

    const newOrderId = (orders[0]?.id || 0) + 1; // Simple incrementing ID
    const newOrder = {
      id: newOrderId,
      type: orderDetails.type,
      items: cart,
      customerName: orderDetails.name,
      guestCount:
        orderDetails.type === "Dine In"
          ? orderDetails.persons
          : orderDetails.takeawayGuests, // Consistent guest count
      contact: orderDetails.contact,
      address: orderDetails.address,
      tableId: tableId,
      chefId: chefId,
      status: "processing", // Initial status
      orderedAt: Date.now(),
      estimatedCompletion: Date.now() + 1000 * 60 * 20, // 20 mins from now
      paymentStatus: "Pending", // Default
      total: orderDetails.total,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]); // Clear cart after order
    setTotalClients((prev) => prev + 1);
    return newOrderId;
  };

  /* -------------------- user details modal -------------------- */
  // Initial load for user details
  useEffect(() => {
    const loadedDetails = load("userDetails", null);
    if (loadedDetails) {
      setUserDetails(loadedDetails);
      
      // ========================================================
      // THIS IS THE FIX:
      // We no longer set the modal to false, so it stays open
      // setIsModalOpen(false); 
      // ========================================================
    }
  }, []);

  const handleDetailsSubmit = (details) => {
    setUserDetails(details);
    save("userDetails", details); // Save details to localStorage
    setIsModalOpen(false);
  };

  return (
    <Router>
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
              categories={categories} // <-- FIX: Pass dynamic categories
            />
          }
        />
        <Route
          path="/checkout"
          element={
            // Redirect if userDetails not set (i.e., didn't go through homepage first)
            userDetails ? (
              <CheckoutPage
                cart={cart}
                userDetails={userDetails}
                addToCart={addToCart} // Pass addToCart to checkout
                placeOrder={placeOrder}
                tables={tables}
                menuItems={menuItems}
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
              categories={categories} // Pass dynamic categories to Admin
            />
          }
        />
      </Routes>
    </Router>
  );
}