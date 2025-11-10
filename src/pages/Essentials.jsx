import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, Trash2, PlusCircle, Lightbulb, DollarSign } from "lucide-react";

const KEY = "cw_essentials_v2";

export default function EssentialsDashboard() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const [income, setIncome] = useState("");
  const [savings, setSavings] = useState("");

  const addRef = useRef(null);
  const listRef = useRef(null);
  const quickRef = useRef(null);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    setItems(raw ? JSON.parse(raw) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  function addItem(label) {
    if (!label.trim()) return;
    setItems((s) => [{ id: Date.now(), label, done: false }, ...s]);
    setText("");
  }

  function toggle(id) {
    setItems((s) => s.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
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

  const quickList = [
    "Rice",
    "Cooking Oil",
    "Bread",
    "Shampoo",
    "Soap",
    "Dairy",
    "Batteries",
    "Clothes",
  ];

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: "smooth" });

  // COLORS
  const purple = "#7c3aed";

  // STYLES
  const styles = {
    container: {
      fontFamily: "'Poppins', sans-serif",
      maxWidth: "1200px",
      margin: "auto",
      padding: "24px",
    },
    title: { fontSize: "2rem", fontWeight: 700, color: purple, marginBottom: "6px" },
    subtitle: { color: "#444", lineHeight: 1.7, marginBottom: "24px" },
    grid: {
      display: "grid",
      gap: "24px",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    },
    sectionCard: {
      background: "#fff",
      padding: "20px",
      borderRadius: "16px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
    },
    cardTitle: { fontSize: "1.1rem", fontWeight: 600, color: purple, marginBottom: "8px" },
    btn: {
      background: purple,
      color: "#fff",
      border: "none",
      padding: "8px 14px",
      borderRadius: "8px",
      cursor: "pointer",
    },
    listItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 12px",
      background: "#fafafa",
      borderRadius: "10px",
      marginBottom: "8px",
    },
    quickButton: {
      background: purple,
      color: "#fff",
      border: "none",
      padding: "6px 10px",
      borderRadius: "7px",
      cursor: "pointer",
      fontSize: "0.85rem",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "12px",
      border: "1px solid #ccc",
      marginBottom: "10px",
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <h1 style={styles.title}>Essentials Dashboard</h1>
      <p style={styles.subtitle}>
        Quickly track your essentials, income, and savings. Add items, mark them as done, or use quick suggestions to stay organized.
      </p>

      {/* Row 1: Add Item, Essentials List, Quick Add */}
      <div style={{ ...styles.grid, marginBottom: "30px" }}>
        <section ref={addRef} style={styles.sectionCard}>
          <h3 style={styles.cardTitle}>
            <PlusCircle size={20} /> Add Item
          </h3>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., Cooking Oil, Rice..."
            style={styles.input}
          />
          <button style={styles.btn} onClick={() => addItem(text)}>
            <PlusCircle size={18} /> Add
          </button>
        </section>

        <section ref={listRef} style={styles.sectionCard}>
          <h3 style={styles.cardTitle}>📋 Essentials List</h3>
          <div style={{ marginBottom: "10px" }}>
            <button
              style={{ ...styles.btn, background: filter === "all" ? purple : "#ddd", color: filter === "all" ? "#fff" : "#444", marginRight: "6px" }}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              style={{ ...styles.btn, background: filter === "pending" ? purple : "#ddd", color: filter === "pending" ? "#fff" : "#444", marginRight: "6px" }}
              onClick={() => setFilter("pending")}
            >
              To Buy
            </button>
            <button
              style={{ ...styles.btn, background: filter === "done" ? purple : "#ddd", color: filter === "done" ? "#fff" : "#444" }}
              onClick={() => setFilter("done")}
            >
              Bought
            </button>
          </div>

          {filtered.length === 0 && <p style={{ opacity: 0.6 }}>No items yet 🌱</p>}
          {filtered.map((it) => (
            <div key={it.id} style={styles.listItem}>
              <label style={it.done ? { textDecoration: "line-through", color: "#777" } : {}}>
                <input type="checkbox" checked={it.done} onChange={() => toggle(it.id)} /> {it.label}
              </label>
              <div style={{ display: "flex", gap: "10px" }}>
                {it.done && <CheckCircle2 size={18} color="#22c55e" />}
                <button onClick={() => remove(it.id)}><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </section>

        <section ref={quickRef} style={styles.sectionCard}>
          <h3 style={styles.cardTitle}>
            <Lightbulb size={20} /> Quick Add
          </h3>
          <p style={{ marginBottom: "10px", opacity: 0.8 }}>Click an item to add it instantly.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {quickList.map((item, i) => (
              <button key={i} style={styles.quickButton} onClick={() => addItem(item)}>
                {item}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Row 2: Income & Savings */}
      <div style={{ ...styles.grid, marginBottom: "30px" }}>
        <section style={styles.sectionCard}>
          <h3 style={styles.cardTitle}>
            <DollarSign size={20} /> Monthly Income
          </h3>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="Enter amount"
            style={styles.input}
          />
          <p style={{ opacity: 0.7 }}>Track your monthly earnings here.</p>
        </section>

        <section style={styles.sectionCard}>
          <h3 style={styles.cardTitle}>
            <DollarSign size={20} /> Savings
          </h3>
          <input
            type="number"
            value={savings}
            onChange={(e) => setSavings(e.target.value)}
            placeholder="Enter amount"
            style={styles.input}
          />
          <p style={{ opacity: 0.7 }}>Record your savings to keep track of finances.</p>
        </section>
      </div>
    </div>
  );
                       }
