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
    return <p style={{ textAlign: "center", padding: "20px", background: "#f3f4f6", borderRadius: "8px" }}>No expenses yet — add something to start tracking.</p>;

  return (
    <div className="expense-list" style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "8px", boxShadow: "0 6px 15px rgba(0,0,0,0.1)" }}>
        <thead style={{ background: "linear-gradient(to right, #6366f1, #8b5cf6)", color: "#fff" }}>
          <tr>
            <th style={{ padding: "12px" }}>Date</th>
            <th style={{ padding: "12px" }}>Item</th>
            <th style={{ padding: "12px" }}>Category</th>
            <th style={{ padding: "12px" }}>Cost</th>
            <th style={{ padding: "12px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id}>
              <td style={{ padding: "12px" }}>{it.date}</td>
              <td style={{ padding: "12px" }}>{editingId === it.id ? <input value={editedItem} onChange={(e) => setEditedItem(e.target.value)} /> : it.item}</td>
              <td style={{ padding: "12px" }}>{it.category}</td>
              <td style={{ padding: "12px" }}>{it.cost}</td>
              <td style={{ padding: "12px", textAlign: "center" }}>
                {editingId === it.id ? (
                  <button onClick={handleSaveClick} style={actionButtonStyle}>Save</button>
                ) : (
                  <>
                    <button onClick={() => handleEditClick(it.id, it.item)} style={actionButtonStyle}>Edit</button>
                    <button onClick={() => onDelete(it.id)} style={actionButtonStyle}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const actionButtonStyle = {
  margin: "0 4px",
  padding: "6px 10px",
  borderRadius: "6px",
  border: "none",
  background: "#8b5cf6",
  color: "#fff",
  cursor: "pointer"
};
