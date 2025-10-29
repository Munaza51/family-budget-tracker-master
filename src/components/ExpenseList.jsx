import React, { useState } from "react";

export default function ExpenseList({ items, onDelete, onEdit }) {
  const [editingId, setEditingId] = useState(null);
  const [editedItem, setEditedItem] = useState("");

  const handleEditClick = (id, currentItem) => {
    setEditingId(id);
    setEditedItem(currentItem);
  };

  const handleSaveClick = () => {
    if (editedItem.trim()) {
      onEdit(editingId, editedItem.trim());
      setEditingId(null);
      setEditedItem("");
    }
  };

  if (!items.length)
    return <p className="muted">No expenses yet — add something to start tracking.</p>;

  return (
    <div className="expense-list">
      <style>{`
        :root {
          --radius: 6px;
          --accent: #6366f1;
          --gradient: linear-gradient(to right, #6366f1, #8b5cf6);
          --transition: all 0.2s ease-in-out;
        }

        .expense-list table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          border-radius: var(--radius);
          overflow: hidden;
        }

        .expense-list th, .expense-list td {
          padding: 14px 16px;
          border: 1px solid #e5e7eb;
          text-align: left;
          font-size: 15px;
        }

        .expense-list th {
          background: var(--gradient);
          color: #fff;
          font-weight: 600;
        }

        .button-group {
          display: flex;
          gap: 8px;
        }

        button.small {
          padding: 14px 16px;
          border-radius: var(--radius);
          border: none;
          background: var(--gradient);
          color: #fff;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: var(--transition);
        }

        button.small:hover {
          background-color: red;
          background-image: none;
          color: white;
        }

        .muted {
          color: #888;
          font-style: italic;
          font-size: 15px;
        }

        input.edit-input {
          padding: 10px;
          font-size: 15px;
          border: 1px solid #ccc;
          border-radius: var(--radius);
          width: 100%;
        }
      `}</style>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Item</th>
            <th>Category</th>
            <th>Cost</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id}>
              <td>{it.date}</td>
              <td>
                {editingId === it.id ? (
                  <input
                    className="edit-input"
                    value={editedItem}
                    onChange={(e) => setEditedItem(e.target.value)}
                  />
                ) : (
                  it.item
                )}
              </td>
              <td>{it.category}</td>
              <td>{it.cost}</td>
              <td>
                <div className="button-group">
                  {editingId === it.id ? (
                    <button className="small" onClick={handleSaveClick}>
                      Save
                    </button>
                  ) : (
                    <button className="small" onClick={() => handleEditClick(it.id, it.item)}>
                      Edit
                    </button>
                  )}
                  <button className="small" onClick={() => onDelete(it.id)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
