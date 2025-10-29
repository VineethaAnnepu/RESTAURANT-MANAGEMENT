import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderSearch from './HeaderSearch';
import CategoryButton from './CategoryButton';
import './HomePage.css';

/* ---------- tiny image helper with multi-path fallback ---------- */
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="140" height="100" viewBox="0 0 140 100"><rect width="140" height="100" fill="#f1f5f9"/><path d="M84 68H78V60H60v8h-6V50h6v8h18v-8h6zM70 30a10 10 0 110 20a10 10 0 010-20z" fill="#94a3b8"/></svg>');

function makeCandidates(src) {
  const PUB = (process.env.PUBLIC_URL || '').replace(/\/+$/, '');
  const base = String(src || '').replace(/^\/+/, '');     // "chickentikka.jpeg" or "asset/icons/x.svg"
  const name = base.split('/').slice(-1)[0];              // file name only

  // Try: explicit path as given, public root, asset/, assest/ — with and without PUBLIC_URL
  const list = [
    // if caller passed an absolute beginning (e.g. "/chickentikka.jpeg")
    `${PUB}/${base}`,
    `/${base}`,
    base,

    // try asset folders
    `${PUB}/asset/${name}`,
    `/asset/${name}`,
    `asset/${name}`,

    `${PUB}/assest/${name}`,
    `/assest/${name}`,
    `assest/${name}`,
  ];

  // De-dup
  return [...new Set(list)];
}

function Img({ item, className, alt }) {
  // Prefer Base64 first
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
        if (base64) {
          // if base64 failed, jump to first candidate
          setIdx(0);
        } else if (idx < candidates.length - 1) {
          setIdx(idx + 1);
        } else {
          // last resort: placeholder
          const el = new Image();
          el.src = PLACEHOLDER_IMAGE;
          setIdx(candidates.length - 1); // stop cycling
        }
      }}
    />
  );
}
/* --------------------------------------------------------------- */

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
          <input id="name" type="text" placeholder="full name"
            value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="form-group-modal">
          <label htmlFor="persons">Number of Person</label>
          <input id="persons" type="number" placeholder="2"
            value={persons} onChange={(e) => setPersons(e.target.value)} />
        </div>

        <div className="form-group-modal">
          <label htmlFor="address">Address (for Takeout)</label>
          <input id="address" type="text" placeholder="address"
            value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>

        <div className="form-group-modal">
          <label htmlFor="contact">Contact</label>
          <input id="contact" type="tel" placeholder="phone"
            value={contact} onChange={(e) => setContact(e.target.value)} required />
        </div>

        <button type="submit" className="modal-order-btn">Order Now</button>
      </form>
    </div>
  );
}

function HomePage({ menu = [], cart = [], addToCart, isModalOpen, onDetailsSubmit, categories = [] }) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(categories[0] || '');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!activeCategory && categories.length > 0) setActiveCategory(categories[0]);
  }, [categories, activeCategory]);

  const getItemQuantity = (id) => cart.find((i) => i.id === id)?.quantity || 0;

  const searchedMenu = menu.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const menuByCategories = categories.map((category) => ({
    categoryName: category,
    items: searchedMenu.filter((item) => item.category === category),
  }));

  return (
    <div className="mobile-container homepage">
      <InitialDetailsModal isOpen={isModalOpen} onDetailsSubmit={onDetailsSubmit} />

      <HeaderSearch
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
      />

      <nav className="category-nav">
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

      <section className="menu-list">
        {menuByCategories.map(({ categoryName, items }) => {
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
                        <Img item={item} className="item-image" alt={item.name} />
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

      <div className="next-button-container right">
        <button className="next-btn" onClick={() => navigate('/checkout')}>Next</button>
      </div>
    </div>
  );
}

export default HomePage;
