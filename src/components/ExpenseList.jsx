import React, { useState } from "react";

export default function ExpenseList({ items, onDelete, onEdit }) {
  const [clickedId, setClickedId] = useState(null);

  if (!items.length)
    return <p className="muted">No expenses yet — add something to start tracking.</p>;

  const handleDeleteClick = (id) => {
    setClickedId(id);
    onDelete(id);
  };

  return (
    <div className="expense-list">
      <style>{`
        .expense-list table {
          width: 100%;
          border-collapse: collapse;
        }
        .expense-list th, .expense-list td {
          padding: 8px;
          border: 1px solid #fff;
          text-align: left;
        }
        button.small {
          padding: 4px 8px;
          background-color: #eee;
          border: 1px solid #fff;
          cursor: pointer;
        }
        button.small.clicked {
          background-color: red;
          color: white;
        }
        .muted {
          color: #888;
          font-style: italic;
        }
      `}</style>

      <table>
        <thead>
          <tr>
            <th>Date</th><th>Item</th><th>Category</th><th>Cost</th><th></th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id}>
              <td>{it.date}</td>
              <td>{it.item}</td>
              <td>{it.category}</td>
              <td>{it.cost}</td>
              <td>
                <button
                  className={`small ${clickedId === it.id ? "clicked" : ""}`}
                  onClick={() => handleDeleteClick(it.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
