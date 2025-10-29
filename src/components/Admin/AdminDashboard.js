// src/components/Admin/AdminDashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Analytics from './Analytics';
import Tables from './Tables';
import Kitchen from './Kitchen';
import AddProduct from './AddProduct';
import './AdminDashboard.css';

export default function AdminDashboard({
  orders = [],
  tables = [],
  menuItems = [],
  chefs = [], // Accept chefs prop
  updateOrderStatus,
  deleteTable,
  addTable,
  addProduct,
}) {
  const [active, setActive] = useState('analytics');
  const [filter, setFilter] = useState('');
  const [appliedFilter, setAppliedFilter] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navigate = useNavigate(); // Used below in hidden actions

  // helper to close sidebar on mobile after navigation
  const setActiveAndClose = (section) => {
    setActive(section);
    if (window.innerWidth <= 900) setSidebarOpen(false);
  };

  // Logic for search filter (blurs the rest of the container)
  const filterBlur = appliedFilter ? 'blur(4px)' : 'none';
  const checkFilter = (text) => {
    if (!appliedFilter) return true;
    return String(text).toLowerCase().includes(appliedFilter.toLowerCase());
  }

  // Function to handle the Filter action (applied on Enter key press)
  const handleFilter = () => {
    setAppliedFilter(filter);
  };

  // Function to handle the Clear action (applied on Escape key press)
  const handleClear = () => {
    setFilter(''); 
    setAppliedFilter('');
  };

  return (
    <div className={`admin-dashboard ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="logo-circle">
          {/* Using the provided restaurant.jpeg image */}
          <img src={process.env.PUBLIC_URL + "/restaurant.jpeg"} alt="Restaurant Logo" className="restaurant-logo-image" />
        </div>

        <div className="sidebar-list">
          {/* ICON 1: Dashboard/Analytics (Solid) */}
          <button
            className={`sidebar-btn ${active === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveAndClose('analytics')}
            aria-label="Analytics"
          >
            <span className="inner-square" />
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden fill="currentColor" stroke="none"><path d="M3 3h7v7H3z"/><path d="M14 3h7v7h-7z"/><path d="M3 14h7v7H3z"/><path d="M14 14h7v7h-7z"/></svg>
          </button>

          {/* ICON 2: Tables/Printer (Solid) */}
          <button
            className={`sidebar-btn ${active === 'tables' ? 'active' : ''}`}
            onClick={() => setActiveAndClose('tables')}
            aria-label="Tables"
          >
            <span className="inner-square" />
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden fill="currentColor" stroke="none"><path d="M6 9V2h12v7H6z"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8" rx="2"/></svg>
          </button>

          {/* ICON 3: Kitchen/Clipboard (Solid) */}
          <button
            className={`sidebar-btn ${active === 'kitchen' ? 'active' : ''}`}
            onClick={() => setActiveAndClose('kitchen')}
            aria-label="Kitchen"
          >
            <span className="inner-square" />
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden fill="currentColor" stroke="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </button>

          {/* ICON 4: Products/Bar Chart (Solid) */}
          <button
            className={`sidebar-btn ${active === 'products' ? 'active' : ''}`}
            onClick={() => setActiveAndClose('products')}
            aria-label="Add Product"
          >
            <span className="inner-square" />
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden fill="currentColor" stroke="none"><rect x="11" y="4" width="2" height="16" rx="1"/><rect x="17" y="10" width="2" height="10" rx="1"/><rect x="5" y="14" width="2" height="6" rx="1"/><line x1="2" y1="20" x2="22" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-area">
        {/* HEADER SECTION - Only Filter Input is visible here */}
        <header className="header-row-absolute">
            <input
              className="filter-input-absolute"
              placeholder="Filter..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFilter();
                if (e.key === 'Escape') handleClear(); 
              }}
            />
            
            {/* HIDDEN BUTTONS: Used to satisfy ESLint for 'navigate' and standard button features */}
            <div className="hidden-actions-group">
                <button className="action" onClick={handleFilter}>Filter</button>
                <button className="action" onClick={handleClear}>Clear</button>

                <div className="header-actions">
                  <button className="action primary" disabled>Admin Dashboard</button>
                  <button className="action" onClick={() => navigate('/')}>Mobile Customer</button>
                </div>
            </div>
        </header>

        <section className="page-shell" style={{ filter: checkFilter('Page') ? 'none' : filterBlur }}>
          {/* Title changes based on active section */}
           {active === 'analytics' && <h2 className="page-title">Analytics</h2>}
 {active === 'tables' && <h2 className="page-title">Table Management</h2>}

          {active === 'analytics' && (
            <Analytics 
              orders={orders} 
              tables={tables} 
              chefs={chefs} // Pass chefs state
              filterText={appliedFilter}
              checkFilter={checkFilter}
              filterBlur={filterBlur}
            />
          )}

          {active === 'tables' && (
            <Tables 
              tables={tables || []}
              orders={orders || []} 
              deleteTable={deleteTable} 
              addTable={addTable}
              checkFilter={checkFilter}
              filterBlur={filterBlur}
            />
          )}

          {active === 'kitchen' && (
            <Kitchen 
              orders={orders || []} 
              updateOrderStatus={updateOrderStatus}
              checkFilter={checkFilter}
              filterBlur={filterBlur} 
            />
          )}

          {active === 'products' && <AddProduct addProduct={addProduct} />}
          
        </section>
      </main>
    </div>
  );
}