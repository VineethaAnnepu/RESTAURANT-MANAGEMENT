// src/components/User/HeaderSearch.js (REPLACED ENTIRE CONTENT)

import React from 'react';

// Keep the search icon small and consistent
function SearchIcon() {
  return (
    <svg
      className="search-icon"
      width="20"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
}

// MODIFIED: Accepts searchTerm, onSearchChange, and page context
export default function HeaderSearch({ searchTerm = '', onSearchChange, isCheckout = false }) {
  
  if (isCheckout) {
    return (
      <div className="header-search-wrapper">
        {/* Checkout page requires only the search bar to filter the cart */}
        
        <div className="search-bar">
          <SearchIcon />
          <input 
            type="text" 
            placeholder="Search cart items..." 
            value={searchTerm}
            onChange={onSearchChange}
            // Input is fully active
            disabled={false}
          />
        </div>
      </div>
    );
  }

  // Original Home Page header/search logic
  return (
    <div className="header-search-wrapper">
      <header className="home-header">
        <h1>Good evening</h1>
        <p>Place you order here</p>
      </header>
      <div className="search-bar">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search for food..."
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
    </div>
  );
}