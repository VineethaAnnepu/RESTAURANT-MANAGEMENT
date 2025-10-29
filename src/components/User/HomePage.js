import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// FIX: REMOVED the static import of categories from mockData
import HeaderSearch from './HeaderSearch';
import CategoryButton from './CategoryButton';
import './HomePage.css';

function InitialDetailsModal({ isOpen, onDetailsSubmit }) {
  const [name, setName] = useState('');
  const [persons, setPersons] = useState('2');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !contact) {
      alert('Please enter your Name and Contact.');
      return;
    }
    onDetailsSubmit({ name, persons, address, contact });
  };

  return (
    <div className="initial-modal-overlay">
      <form className="initial-modal-content" onSubmit={handleSubmit}>
        <h3>Enter Your Details</h3>

        <div className="form-group-modal">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group-modal">
          <label htmlFor="persons">Number of Person</label>
          <input
            id="persons"
            type="number"
            placeholder="2"
            value={persons}
            onChange={(e) => setPersons(e.target.value)}
          />
        </div>

        <div className="form-group-modal">
          <label htmlFor="address">Address (for Takeout)</label>
          <input
            id="address"
            type="text"
            placeholder="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="form-group-modal">
          <label htmlFor="contact">Contact</label>
          <input
            id="contact"
            type="tel"
            placeholder="phone"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="modal-order-btn">Order Now</button>
      </form>
    </div>
  );
}

// A Base64 SVG placeholder for broken or missing images
const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbD0iI2YxZjVmOSI+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiLz4KICA8cGF0aCBkPSJNNjIgNjJINThWNTRINDZWNjhINDJWMzRINDZWNDZINTBWNDJINTRONTBINTZWNDZINThWNTBINjJWNTRIODJWNzBINDZaTTUwIDMwQTEwIDEwIDAgMSAwIDUwIDUwQTEwIDEwIDAgMCAwIDUwIDMwWiIgZmlsbD0iI2E1YWZhZiIvPgo8L3N2Zz4=";

/* ------------------------------ HomePage ------------------------------ */
// FIX: Receive the dynamic 'categories' list from App.js
function HomePage({ menu = [], cart = [], addToCart, isModalOpen, onDetailsSubmit, categories = [] }) {
  const navigate = useNavigate();
  
  // FIX: Default to the first category from the prop, or an empty string
  const [activeCategory, setActiveCategory] = useState(categories[0] || '');
  const [searchTerm, setSearchTerm] = useState('');

  // FIX: When categories update from App.js, set the active one if it's not set
  useEffect(() => {
    if (!activeCategory && categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const getItemQuantity = (itemId) => {
    const itemInCart = cart.find((i) => i.id === itemId);
    return itemInCart ? itemInCart.quantity : 0;
  };

  const searchedMenu = menu.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // FIX: Use the dynamic 'categories' prop to build the menu
  const menuByCategories = categories.map((category) => ({
    categoryName: category,
    items: searchedMenu.filter((item) => item.category === category),
  }));

  return (
    <div className="mobile-container homepage">
      {/* Modal */}
      <InitialDetailsModal isOpen={isModalOpen} onDetailsSubmit={onDetailsSubmit} />

      {/* Header + Search */}
      <HeaderSearch
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Category Nav with Icons */}
      <nav className="category-nav">
        {/* FIX: Map over the dynamic 'categories' prop */}
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <CategoryButton
              key={category}
              category={category}
              isActive={isActive}
              onClick={() => setActiveCategory(category)}
            />
          );
        })}
      </nav>

      {/* Menu List */}
      <section className="menu-list">
        {menuByCategories.map(({ categoryName, items }) => {
          // Only show the active category
          if (categoryName !== activeCategory) return null;

          return (
            <div key={categoryName} id={categoryName} className="category-section-wrapper">
              <h2>{categoryName}</h2>

              {items.length > 0 ? (
                <div className="category-grid">
                  {items.map((item) => {
                    const quantity = getItemQuantity(item.id);

                    return (
                      <div key={item.id} className="menu-item">
                        <img
                          src={item.image || PLACEHOLDER_IMAGE}
                          alt={item.name}
                          className="item-image"
                          onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE; }}
                        />
                        <div className="item-details">
                          <div className="item-info-wrapper">
                            <h3>{item.name}</h3>
                            <p>₹{item.price}</p>
                          </div>

                          {quantity > 0 ? (
                            <div className="quantity-control-card">
                              <button onClick={() => addToCart({ ...item, quantity: quantity - 1 })}>−</button>
                              <span>{quantity}</span>
                              <button onClick={() => addToCart({ ...item, quantity: quantity + 1 })}>+</button>
                            </div>
                          ) : (
                            // FIX: Pass the full 'item' object to addToCart
                            <button className="add-btn" onClick={() => addToCart(item)}>+</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p>No items found in this category.</p>
              )}
            </div>
          );
        })}
      </section>

      {/* Next button at bottom-right → always goes to Checkout */}
      <div className="next-button-container right">
        <button
          className="next-btn"
          onClick={() => navigate('/checkout')}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default HomePage;