import React, { useEffect, useState } from "react";
import { Wallet, Sparkles, PieChart, Brain, Sun, Moon } from "lucide-react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import SpendingPie from "../components/SpendingPie";
import { getBudgetTips } from "../ai/aiService";

const LOCAL_KEY = "cw_expenses_v1";
const PURPLE = "#8b5cf6";
const LIGHT_PURPLE = "#d8b3ff";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [aiTips, setAiTips] = useState("");
  const [loadingTips, setLoadingTips] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    setExpenses(raw ? JSON.parse(raw) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(expenses));
  }, [expenses]);

  function addExpense(exp) {
    setExpenses((s) => [exp, ...s]);
    setRecentlyAdded((s) => [exp, ...s].slice(0, 3));
  }

  function removeExpense(id) {
    setExpenses((s) => s.filter((e) => e.id !== id));
  }

  function editExpense(updated) {
    setExpenses((s) => s.map((e) => (e.id === updated.id ? updated : e)));
  }

  const totalsByCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.cost);
    return acc;
  }, {});

  const totalSpent = expenses.reduce((s, e) => s + Number(e.cost), 0);

  async function askAITips() {
    setLoadingTips(true);
    const summary =
      Object.entries(totalsByCategory)
        .map(([cat, val]) => `${cat}: ${val}`)
        .join(", ") || "No expenses recorded yet";
    try {
      const tips = await getBudgetTips(summary);
      setAiTips(tips);
    } catch (err) {
      setAiTips("⚠️ AI tip error — check API key or network.");
      console.error(err);
    } finally {
      setLoadingTips(false);
    }
  }

  const styles = {
    container: {
      fontFamily: "'Poppins', sans-serif",
      color: theme === "light" ? "#000" : "#f8f8f8",
      maxWidth: "1200px",
      margin: "auto",
      padding: "0 20px",
      backgroundColor: theme === "light" ? "#f8f9fa" : "#1e1e2f",
      transition: "background 0.3s, color 0.3s",
    },
    hero: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "60px 20px",
      borderRadius: "20px",
      background: "linear-gradient(135deg, #8b5cf6, #d8b3ff)",
      color: "#fff",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
      animation: "gradientMove 10s ease infinite",
    },
    mainTitle: {
      fontSize: "3rem",
      fontWeight: "bold",
      marginBottom: "20px",
      lineHeight: "1.2",
      textShadow: "0 4px 15px rgba(0,0,0,0.2)",
    },
    heroDesc: { fontSize: "1.2rem", lineHeight: "1.6", marginBottom: "30px", maxWidth: "600px", margin: "0 auto" },
    cardGrid: { display: "grid", gridTemplateColumns: "1fr", gap: "20px", marginBottom: "40px" },
    card: {
      padding: "25px",
      borderRadius: "12px",
      boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
      background: theme === "light" ? "#fff" : "#2a2a3e",
      transition: "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s, color 0.3s",
      textAlign: "center",
    },
    addExpenseCard: { background: PURPLE, color: "#fff" },
    quickAddCard: { background: PURPLE, color: "#fff" },
    summaryBox: { backgroundColor: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "15px", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
    aiTips: { display: "flex", alignItems: "flex-start", gap: "10px", backgroundColor: PURPLE, color: "#fff", padding: "10px", borderRadius: "8px", marginTop: "10px", justifyContent: "center" },
    aiButton: { backgroundColor: LIGHT_PURPLE, color: "#000", border: "none", padding: "10px 15px", borderRadius: "6px", cursor: "pointer", marginTop: "10px", transition: "background 0.3s ease" },
    sectionMargin: { marginTop: "40px" },
    inputFilter: { padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "10px", width: "auto", fontSize: "0.9rem" },
    infoBox: { background: "#fff", padding: "20px", borderRadius: "12px", margin: "30px 0", display: "flex", flexDirection: "column", gap: "15px" },
    infoItem: { fontSize: "1rem", lineHeight: "1.5", textAlign: "left" },
    infoTitle: { fontWeight: "bold", color: PURPLE, marginRight: "8px" },
    startButton: {
      background: "#fff",
      color: PURPLE,
      fontWeight: "bold",
      padding: "12px 25px",
      borderRadius: "10px",
      fontSize: "1rem",
      cursor: "pointer",
      boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease",
      margin: "0 auto",
      display: "block"
    }
  };

  return (
    <div style={styles.container}>
      {/* Theme toggle */}
      <div style={{ position: "absolute", top: "20px", right: "20px", cursor: "pointer" }} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        {theme === "light" ? <Moon size={28} /> : <Sun size={28} />}
      </div>

      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.mainTitle}><Wallet size={36} /> Family Budget Tracker</h1>
        <p style={styles.heroDesc}>
          Track your expenses, see trends, and save smarter. Everything you need to manage your family budget effectively.
        </p>
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
          <li style={styles.infoItem}>➡ Real-time expense tracking</li>
          <li style={styles.infoItem}>➡ Category & monthly breakdowns</li>
          <li style={styles.infoItem}>➡ Smart AI suggestions</li>
          <li style={styles.infoItem}>➡ Budget alerts & gamification</li>
        </ul>
        <button
          style={styles.startButton}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          onClick={() => document.getElementById("addExpenseSection").scrollIntoView({ behavior: "smooth" })}
        >
          Start Tracking
        </button>
        {recentlyAdded.length > 0 && (
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "10px" }}>
            {recentlyAdded.map((e) => (
              <div key={e.id} style={{ padding: "5px 10px", borderRadius: "6px", background: PURPLE, color: "#fff", fontSize: "0.85rem" }}>
                {e.name} - {e.cost} AFN
              </div>
            ))}
          </div>
        )}
        <style>{`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          div[style*="gradientMove"] { background-size: 200% 200%; }
        `}</style>
      </div>

      {/* Info Box */}
      <div style={styles.infoBox}>
        <div style={styles.infoItem}><span style={styles.infoTitle}>➡ Add Expense:</span> Add new expenses with full details.</div>
        <div style={styles.infoItem}><span style={styles.infoTitle}>➡ Quick Add:</span> Quickly add repeated expenses without filling the full form.</div>
        <div style={styles.infoItem}><span style={styles.infoTitle}>➡ Spending Summary:</span> View total expenses and saving progress.</div>
        <div style={styles.infoItem}><span style={styles.infoTitle}>➡ AI Tips:</span> Receive smart suggestions to manage money better.</div>
        <div style={styles.infoItem}><span style={styles.infoTitle}>➡ Monthly Trend:</span> View monthly expense trends with chart.</div>
        <div style={styles.infoItem}><span style={styles.infoTitle}>➡ Spending by Category:</span> Percentage of expenses by category.</div>
        <div style={styles.infoItem}><span style={styles.infoTitle}>➡ All Expenses:</span> List all expenses with search and time filter.</div>
      </div>

      {/* Add Expense Card */}
      <section id="addExpenseSection" style={{ ...styles.card, ...styles.addExpenseCard }}>
        <h2><Sparkles size={20} /> Add Expense</h2>
        <ExpenseForm onAdd={addExpense} />
      </section>

      {/* Quick Add Card */}
      <section style={{ ...styles.card, ...styles.quickAddCard }}>
        <h2><Sparkles size={20} /> Quick Add</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {["Daily Shopping","Rent","Transport","Food","Utilities","Subscriptions","Groceries","Health","Entertainment","Misc"].map((name) => (
            <button key={name} onClick={() => addExpense({id:Date.now(), name, cost:0, category:"Quick Add", date:new Date().toISOString()})} style={{padding:"10px", borderRadius:"8px", border:"none", cursor:"pointer", background:"#fff", color:PURPLE}}>{name}</button>
          ))}
        </div>
      </section>

      {/* Spending Summary */}
      <section style={styles.card}>
        <h2><PieChart size={20} /> Spending Summary</h2>
        <div style={styles.summaryBox}>
          <p>Total Spent:</p>
          <h1>{totalSpent.toLocaleString()} AFN</h1>
        </div>
        <button style={styles.aiButton} onClick={askAITips} disabled={loadingTips}>
          {loadingTips ? "🤔 Thinking..." : "🧠 Get AI Saving Tips"}
        </button>
        {aiTips && (
          <div style={styles.aiTips}>
            <Brain size={20} />
            <div>
              <h4>AI Suggestions</h4>
              <p>{aiTips}</p>
            </div>
          </div>
        )}
      </section>

      {/* Spending by Category */}
      <section style={styles.card}>
        <h2>Spending by Category</h2>
        <SpendingPie data={totalsByCategory} />
      </section>

      {/* All Expenses */}
      <section style={styles.card}>
        <h2>All Expenses</h2>
        <ExpenseList items={expenses} onDelete={removeExpense} onEdit={editExpense} />
      </section>
    </div>
  );
}
