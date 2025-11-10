import React, { useEffect, useState, useRef } from "react";
import { CheckCircle2, Trash2, PlusCircle, Lightbulb, Wallet, PiggyBank } from "lucide-react";

const KEY = "cw_essentials_v2";
const PURPLE = "#8b5cf6";
const GREEN = "#22c55e";
const COLORS = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#d8b3ff"];

export default function EssentialsDashboard() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [savings, setSavings] = useState(0);
  const addRef = useRef(null);

  // Load items
  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    setItems(raw ? JSON.parse(raw) : []);
  }, []);

  // Save items
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  function addItem(label) {
    if (!label.trim()) return;
    const newItem = { id: Date.now(), label: label.trim(), done: false };
    setItems((s) => [newItem, ...s]);
    setText("");
  }

  function toggleItem(id) {
    setItems((s) => s.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  }

  function removeItem(id) {
    setItems((s) => s.filter((i) => i.id !== id));
  }

  const filtered =
    filter === "done"
      ? items.filter((i) => i.done)
      : filter === "pending"
      ? items.filter((i) => !i.done)
      : items;

  const mustBuyCount = items.filter((i) => !i.done).length;
  const boughtCount = items.filter((i) => i.done).length;

  const quickAddList = [
    "Cooking Oil", "Rice", "Bread", "Milk", "Soap", "Shampoo", "Batteries", "Clothes"
  ];

  // Styles
  const styles = {
    container: { fontFamily: "'Poppins', sans-serif", color: "#000", maxWidth: "1200px", margin: "auto", padding: "24px" },
    header: { marginBottom: "20px" },
    title: { fontSize: "2rem", fontWeight: 700, marginBottom: "6px", color: PURPLE },
    subtitle: { fontSize: "1rem", color: "#444", lineHeight: 1.5 },
    topGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginTop: "20px" },
    card: { padding: "20px", borderRadius: "12px", boxShadow: "0 6px 15px rgba(0,0,0,0.06)", background: "#fff" },
    addCard: { background: PURPLE, color: "#fff" },
    quickAddButton: { padding: "8px 12px", borderRadius: "8px", background: PURPLE, color: "#fff", border: "none", cursor: "pointer", minWidth: "120px" },
    listItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid #eee", borderRadius: "8px", marginBottom: "6px", background: "#fafafa" },
    doneLabel: { textDecoration: "line-through", color: "#666" },
    filterBtn: (active) => ({ padding: "6px 12px", borderRadius: "6px", border: "none", cursor: "pointer", background: active ? PURPLE : "#eee", color: active ? "#fff" : "#444", marginRight: "6px" }),
    sectionTitle: { fontSize: "1.2rem", fontWeight: 600, marginBottom: "12px", color: PURPLE },
    quickAddCard: { display: "flex", flexWrap: "wrap", gap: "10px" },
    summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginTop: "24px" },
    summaryBox: { padding: "16px", borderRadius: "12px", background: "#f9f9f9", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" },
    inputNumber: { width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #ccc", marginTop: "6px" },
    infoBox: { padding: "12px", background: "#f0f0f0", borderRadius: "10px" },
  };

  return (
    <div style={styles.container}>
      {/* Header / Info */}
      <header style={styles.header}>
        <h1 style={styles.title}><Wallet size={24} /> Essentials Dashboard</h1>
        <p style={styles.subtitle}>
          Manage your household essentials — track what you need, what you've bought, and stay organized. Quick add common items and monitor your income & savings.
        </p>
      </header>

      {/* Quick Stats */}
      <div style={styles.topGrid}>
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Essentials Summary</div>
          <div style={styles.infoBox}>
            <p>🛒 Must Buy: {mustBuyCount}</p>
            <p>✅ Bought: {boughtCount}</p>
          </div>
        </div>

        <div style={styles.card} ref={addRef}>
          <div style={styles.sectionTitle}>Add Essential Item</div>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g., Cooking Oil" style={styles.inputNumber} />
          <button onClick={() => addItem(text)} style={{ ...styles.quickAddButton, marginTop: "10px" }}><PlusCircle size={18} /> Add</button>
        </div>

        <div style={styles.card}>
          <div style={styles.sectionTitle}>Quick Add</div>
          <div style={styles.quickAddCard}>
            {quickAddList.map((q, i) => (
              <button key={i} style={styles.quickAddButton} onClick={() => addItem(q)}>{q}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Essentials List */}
      <div style={{ ...styles.card, marginTop: "24px" }}>
        <div style={styles.sectionTitle}>Your Essentials</div>
        <div style={{ marginBottom: "10px" }}>
          <button style={styles.filterBtn(filter === "all")} onClick={() => setFilter("all")}>All</button>
          <button style={styles.filterBtn(filter === "pending")} onClick={() => setFilter("pending")}>باید بخریم</button>
          <button style={styles.filterBtn(filter === "done")} onClick={() => setFilter("done")}>خریدیم</button>
        </div>

        {filtered.length === 0 ? <p style={{ color: "#666" }}>لیستی وجود ندارد — آیتم اضافه کنید 🌱</p> : null}
        {filtered.map((it) => (
          <div key={it.id} style={styles.listItem}>
            <label style={it.done ? styles.doneLabel : {}}>
              <input type="checkbox" checked={it.done} onChange={() => toggleItem(it.id)} /> {it.label}
            </label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {it.done && <CheckCircle2 size={18} color={GREEN} />}
              <button onClick={() => removeItem(it.id)}><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Income & Savings */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryBox}>
          <Wallet size={20} /> <h3>Monthly Income</h3>
          <input type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(Number(e.target.value))} style={styles.inputNumber} />
        </div>
        <div style={styles.summaryBox}>
          <PiggyBank size={20} /> <h3>Savings</h3>
          <input type="number" value={savings} onChange={(e) => setSavings(Number(e.target.value))} style={styles.inputNumber} />
        </div>
      </div>
    </div>
  );
            }
