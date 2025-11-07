
import React, { useEffect, useState } from "react";
import { CheckCircle2, Trash2, PlusCircle } from "lucide-react";

const KEY = "cw_essentials_v2";

export default function Essentials() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    setItems(raw ? JSON.parse(raw) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  function addItem() {
    if (!text.trim()) return;
    setItems((s) => [
      { id: Date.now(), label: text.trim(), done: false },
      ...s,
    ]);
    setText("");
  }

  function toggle(id) {
    setItems((s) =>
      s.map((i) => (i.id === id ? { ...i, done: !i.done } : i))
    );
  }

  function remove(id) {
    setItems((s) => s.filter((i) => i.id !== id));
  }

  const filtered =
    filter === "done"
      ? items.filter((i) => i.done)
      : filter === "pending"
      ? items.filter((i) => !i.done)
      : items;

  const counts = {
    total: items.length,
    pending: items.filter((i) => !i.done).length,
    done: items.filter((i) => i.done).length,
  };

  return (
    <div className="essentials-page">
      <header className="essentials-header">
        <h2>🧺 Essentials Checklist</h2>
        <p>Keep track of household essentials — سریع اضافه کن، علامت بزن، مدیریت کن.</p>

        <div className="essentials-stats">
          <div className="stat">
            <strong>{counts.total}</strong>
            <span>Total</span>
          </div>
          <div className="stat">
            <strong className="muted">{counts.pending}</strong>
            <span>Pending</span>
          </div>
          <div className="stat">
            <strong className="accent">{counts.done}</strong>
            <span>Completed</span>
          </div>
        </div>

        <div className="essentials-explain">
          <p><strong>Pending:</strong> اقلامی که هنوز باید خریداری یا بررسی شوند.</p>
          <p><strong>Completed:</strong> اقلامی که تهیه شده یا بررسی شده‌اند.</p>
        </div>
      </header>

      <div className="essentials-add">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add an essential (e.g., Cooking Oil)"
          aria-label="Add essential item"
        />
        <button onClick={addItem} className="btn">
          <PlusCircle size={18} /> Add
        </button>
      </div>

      <div className="essentials-filters">
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? "active" : ""}
        >
          All
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={filter === "pending" ? "active" : ""}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("done")}
          className={filter === "done" ? "active" : ""}
        >
          Completed
        </button>
      </div>

      <ul className="essentials-list-modern">
        {filtered.length === 0 && (
          <li className="muted">No items here — add something to get started 🌱</li>
        )}
        {filtered.map((it) => (
          <li key={it.id} className={it.done ? "done" : ""}>
            <label className="essentials-row">
              <input
                type="checkbox"
                checked={it.done}
                onChange={() => toggle(it.id)}
                aria-label={`Mark ${it.label} as ${it.done ? "pending" : "done"}`}
              />
              <span className="item-label">{it.label}</span>
            </label>
            <div className="actions">
              {it.done && <CheckCircle2 size={18} />}
              <button onClick={() => remove(it.id)} className="action-btn" aria-label={`Delete ${it.label}`}>
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
