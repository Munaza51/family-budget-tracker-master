import React, { useEffect, useState } from "react";
import { CheckCircle2, Trash2, PlusCircle, Lightbulb } from "lucide-react";

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

  return (
    <div className="essentials-page container dark-theme">
      {/* 🧺 Header */}
      <header className="essentials-header tracky-style">
        <h1>🧺 Essentials Checklist</h1>
        <p>
          This section helps you manage your family's essential needs — from groceries and cleaning supplies to household tools and seasonal items. Stay organized and never forget what matters most.
        </p>
      </header>

      {/* 🧭 Grid Layout */}
      <div className="row dashboard-grid">
        {/* ✅ Add + List */}
        <section className="card gradient">
          <h2>
            <PlusCircle size={20} /> Add Essential Item
          </h2>
          <div className="essentials-add">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., Cooking Oil, Batteries, Shampoo"
            />
            <button onClick={addItem}>
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
              <li className="muted">
                No items here — add something to get started 🌱
              </li>
            )}
            {filtered.map((it) => (
              <li key={it.id} className={it.done ? "done" : ""}>
                <label>
                  <input
                    type="checkbox"
                    checked={it.done}
                    onChange={() => toggle(it.id)}
                  />
                  <span>{it.label}</span>
                </label>
                <div className="actions boxed">
                  {it.done && <CheckCircle2 size={18} color="#22c55e" />}
                  <button onClick={() => remove(it.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 💡 Info Panel */}
        <section className="card highlight">
          <h2>
            <Lightbulb size={20} /> How It Works
          </h2>
          <div className="info-box">
            <h4>✅ Completed</h4>
            <p>
              Items you've already bought or handled. You can uncheck them if needed.
            </p>
            <h4>⏳ Pending</h4>
            <p>
              Items still on your to-do list. Keep track and check them off when done.
            </p>
            <h4>🧠 Suggestions</h4>
            <ul>
              <li>🧼 Cleaning supplies</li>
              <li>🍼 Baby care items</li>
              <li>🧃 Weekly groceries</li>
              <li>🔋 Emergency batteries</li>
              <li>🧯 Safety gear</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
