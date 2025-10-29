// src/components/Admin/Tables.js
import React, { useState } from 'react';
import './Tables.css';

// Component for a single table tile
function TableTile({ table, onDelete, checkFilter, filterBlur, activeDineInTables }) {
  // Logic: Only mark as 'reserved' if there is an active Dine In order for this table
  const isReserved = activeDineInTables.has(table.number);
  
  const handleDelete = () => {
    if (isReserved) {
      alert("Cannot delete a table with an active dine-in order.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete Table ${table.number}?`)) {
      onDelete(table.id);
    }
  }

  return (
    <div 
      // isReserved determines the class (reserved or available)
      className={`table-box ${isReserved ? 'reserved' : 'available'}`}
      style={{ filter: checkFilter(`Table ${table.number}`) ? 'none' : filterBlur }}
    >
      <button className="delete-btn" onClick={handleDelete} aria-label="Delete table">
        &#x1F5D1; {/* Trash can icon */}
      </button>
      <div className="table-box-number">
        {String(table.number).padStart(2, '0')}
      </div>
      <div className="table-box-label">Table</div>
      <div className="table-box-size">{table.size} Chairs</div>
    </div>
  );
}

// Main Tables component
export default function Tables({ tables = [], deleteTable, addTable, checkFilter, filterBlur, orders = [] }) {
  const [name, setName] = useState('');
  const [size, setSize] = useState('4'); // Default to 4 chairs

  // Get all table numbers from active (not 'done') "Dine In" orders
  const activeDineInTables = new Set(
    orders
      .filter(o => o.type === 'Dine In' && o.status !== 'done')
      // FIX: Use .replace() to safely parse the table number from the string 'Table-N'
      .map(o => parseInt(o.table.replace('Table-', ''), 10))
  );

  const handleCreateTable = (e) => {
    e.preventDefault();
    if (tables.length >= 30) { // Limit table creation to 30
      alert("Cannot create more than 30 tables.");
      return;
    }
    addTable({ name, size });
    setName('');
    setSize('4');
  };

  return (
    <div className="tables-container">
      <div className="tables-grid-full">
        {tables.map(table => (
          <TableTile 
            key={table.id} 
            table={table} 
            onDelete={deleteTable}
            checkFilter={checkFilter}
            filterBlur={filterBlur}
            activeDineInTables={activeDineInTables}
          />
        ))}
        
        {/* Add Table Form is hidden if 30 tables exist */}
        {tables.length < 30 && (
          <form className="add-table-form" onSubmit={handleCreateTable}>
            <div className="add-table-icon">+</div>
            <div className="form-group-table">
              <label>Table name (optional)</label>
              <input 
                type="text"
                placeholder={`Table ${tables.length + 1}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group-table">
              <label>Chair *</label>
              <select value={size} onChange={(e) => setSize(e.target.value)}>
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="6">6</option>
                <option value="8">8</option>
              </select>
            </div>
            <button type="submit" className="create-table-btn">Create</button>
          </form>
        )}
      </div>
    </div>
  );
}