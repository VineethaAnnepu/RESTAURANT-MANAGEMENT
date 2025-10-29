import React, { useRef, useState } from "react";
import "./AddProduct.css";

const CATEGORIES = [
  "Appetizers",
  "Soups",
  "Salads",
  "Burgers",
  "Sandwiches",
  "Wraps",
  "Pizza",
  "Sides",
  "Beverages",
  "Desserts",
];

// Helper function to read a file as a Base64 Data URL
const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export default function AddProduct({ addProduct }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [desc, setDesc] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const [queue, setQueue] = useState([]);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  const openPicker = () => fileInputRef.current?.click();

  const onPickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    // Use createObjectURL just for the temporary preview
    setImageUrl(URL.createObjectURL(file));
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const onDragOver = (e) => e.preventDefault();

  const valid = () => {
    if (!name.trim() || !price || !category.trim()) {
      setError("Name, Price, and Category are required.");
      return false;
    }
    setError("");
    return true;
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setCategory("");
    setDesc("");
    setImageFile(null);
    setImageUrl("");
  };

  // This function is now ASYNC to handle file reading
  const buildProductObject = async (p) => {
    let imageBase64 = null;
    if (p.imageFile) {
      try {
        // Wait for the file to be read
        imageBase64 = await readFileAsBase64(p.imageFile);
      } catch (err) {
        console.error("Error reading file:", err);
      }
    }

    return {
      name: p.name.trim(),
      price: Number(p.price),
      category: p.category.trim(),
      description: p.desc ? p.desc.trim() : "No description",
      imageBase64: imageBase64, // Pass the Base64 string
    };
  };

  const addAnother = () => {
    if (!valid()) return;
    const item = {
      id: Date.now(),
      name,
      price,
      category,
      desc,
      imageFile,
    };
    setQueue((q) => [...q, item]);
    resetForm();
    setToast(`Added “${item.name}”.`);
    setTimeout(() => setToast(""), 1600);
  };

  const removeQueued = (id) => {
    setQueue((q) => q.filter((p) => p.id !== id));
  };

  // This function is now ASYNC
  const saveAll = async () => {
    const pending = [...queue];
    if (name || price || category || desc || imageFile) {
      if (!valid()) return;
      pending.push({
        id: Date.now(),
        name,
        price,
        category,
        desc,
        imageFile,
      });
    }
    if (!pending.length) {
      setError("Nothing to save.");
      return;
    }

    try {
      // Loop and wait for each product to be processed
      for (const p of pending) {
        // await is used here
        const productData = await buildProductObject(p);
        addProduct(productData);
      }

      setQueue([]);
      resetForm();
      setToast("Saved successfully.");
      setTimeout(() => setToast(""), 1800);
    } catch (err) {
      setError("Upload failed. Could not save to local state.");
    }
  };

  return (
    <div className="ap-wrap">
      <h2 className="ap-title">Add a Product</h2>
      <p className="ap-sub">Create and add your product to the menu</p>

      {toast && <div className="ap-toast">{toast}</div>}
      {error && <div className="ap-error">{error}</div>}

      <div className="ap-grid">
        <div
          className="ap-image-drop"
          onDragOver={onDragOver}
          onDrop={onDrop}
          onClick={openPicker}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="preview" />
          ) : (
            <div className="ap-drop-inner">
              <div className="ap-plus">+</div>
              <div className="ap-add-text">Add Image</div>
              <div className="ap-hint">Click or drag & drop</div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onPickImage}
            hidden
          />
        </div>

        <div className="ap-fields">
          <div className="ap-row">
            <div className="ap-col">
              <label>Product name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Marinara Pizza"
              />
            </div>
            <div className="ap-col">
              <label>Price</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                min="0"
                placeholder="₹"
              />
            </div>
          </div>

          <div className="ap-row">
            <div className="ap-col ap-col-full">
              <label>Product Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="ap-row">
            <div className="ap-col ap-col-full">
              <label>Product Description</label>
              <textarea
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Optional short description"
              />
            </div>
          </div>

          <div className="ap-actions-row">
            <button type="button" className="ap-link" onClick={addAnother}>
              + Add Another Product
            </button>
          </div>
        </div>
      </div>

      {!!queue.length && (
        <div className="ap-queue">
          <div className="ap-queue-head">
            <strong>Queued Products</strong>
            <span>{queue.length}</span>
          </div>
          <div className="ap-queue-list">
            {queue.map((p) => (
              <div key={p.id} className="ap-queue-item">
                <div className="ap-qi-left">
                  {p.imageFile ? (
                    <img src={URL.createObjectURL(p.imageFile)} alt={p.name} />
                  ) : (
                    <div className="ap-qi-placeholder">IMG</div>
                  )}
                  <div className="ap-qi-info">
                    <div className="ap-qi-name">{p.name}</div>
                    <div className="ap-qi-meta">
                      ₹{p.price} • {p.category}
                    </div>
                  </div>
                </div>
                <button
                  className="ap-qi-del"
                  onClick={() => removeQueued(p.id)}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="ap-footer">
        <button className="ap-btn ghost" onClick={resetForm}>
          Cancel
        </button>
        <button className="ap-btn primary" onClick={saveAll}>
          Save
        </button>
      </div>
    </div>
  );
}