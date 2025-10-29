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
