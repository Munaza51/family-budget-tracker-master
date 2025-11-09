import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend } from "recharts";
import { Sparkles, Wallet, PieChart, Brain, Sun, Moon } from "lucide-react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import { getBudgetTips } from "../ai/aiService";

const LOCAL_KEY = "cw_expenses_v1";
const PURPLE = "#8b5cf6";
const LIGHT_PURPLE = "#d8b3ff";
const COLORS = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#d8b3ff"];

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [aiTips, setAiTips] = useState("");
  const [loadingTips, setLoadingTips] = useState(false);
  const [filter, setFilter] = useState("");
  const [budgetAlert, setBudgetAlert] = useState(false);
  const [theme, setTheme] = useState("light");
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [timeFilter, setTimeFilter] = useState("all");

  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    setExpenses(raw ? JSON.parse(raw) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(expenses));
    const total = expenses.reduce((s, e) => s + Number(e.cost), 0);
    setBudgetAlert(total > 100000);
  }, [expenses]);

  function addExpense(exp) {
    setExpenses((s) => [exp, ...s]);
    setRecentlyAdded((s) => [exp, ...s].slice(0, 3));
  }

  function quickAdd(name, cost, category) {
    const exp = { id: Date.now(), name, cost, category, date: new Date().toISOString() };
    addExpense(exp);
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

  const monthlyTrend = expenses.reduce((acc, e) => {
    const month = new Date(e.date).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + Number(e.cost);
    return acc;
  }, {});

  const trendData = Object.entries(monthlyTrend).map(([month, total]) => ({ month, total }));

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

  const totalSpent = expenses.reduce((s, e) => s + Number(e.cost), 0);
  const savingGoal = 200000;
  const progressPercent = Math.min((savingGoal - totalSpent) / savingGoal * 100, 100);

  const filteredExpenses = expenses.filter((e) => {
    const matchesFilter = e.name.toLowerCase().includes(filter.toLowerCase()) || e.category.toLowerCase().includes(filter.toLowerCase());
    if (timeFilter === "month") {
      const now = new Date();
      return matchesFilter && new Date(e.date).getMonth() === now.getMonth();
    } else if (timeFilter === "week") {
      const now = new Date();
      const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
      return matchesFilter && new Date(e.date) >= weekAgo;
    }
    return matchesFilter;
  });

  const styles = {
    container: { fontFamily: "'Inter', sans-serif", color: theme === "light" ? "#000" : "#f8f8f8", maxWidth: "1440px", margin: "auto", padding: "0 20px", backgroundColor: theme === "light" ? "#f8f9fa" : "#1e1e2f", transition: "background 0.3s, color 0.3s" },
    hero: { display: "flex", flexDirection: "row", alignItems: "center", gap: "40px", margin: "60px 0", padding: "40px 20px", borderRadius: "20px", backgroundColor: theme === "light" ? "#fff" : "#2a2a3e", boxShadow: theme === "light" ? "0 10px 30px rgba(0,0,0,0.05)" : "0 10px 30px rgba(0,0,0,0.4)" },
    heroText: { flex: 1 },
    heroImage: { flex: 1, width: "200px", height: "200px", objectFit: "cover", borderRadius: "12px" },
    mainTitle: { fontSize: "2.2rem", color: PURPLE, fontWeight: "600", marginBottom: "10px" },
    heroDesc: { fontSize: "1rem", lineHeight: "1.4" },
    cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "40px" },
    card: { padding: "20px", borderRadius: "12px", boxShadow: "0 6px 15px rgba(0,0,0,0.08)", background: theme === "light" ? "#fff" : "#2a2a3e", transition: "all 0.3s ease" },
    addExpenseCard: { backgroundColor: "#fff", color: PURPLE },
    quickAddCard: { backgroundColor: "#fff", color: "#000" },
    quickAddButton: { backgroundColor: LIGHT_PURPLE, color: "#000", border: "none", padding: "10px 15px", borderRadius: "6px", cursor: "pointer", marginBottom: "8px", textAlign: "left", width: "100%" },
    summaryBox: { backgroundColor: theme === "light" ? "#fff" : "#3b3b52", padding: "15px", borderRadius: "10px", marginBottom: "15px", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
    aiTips: { display: "flex", alignItems: "flex-start", gap: "10px", backgroundColor: PURPLE, color: "#fff", padding: "10px", borderRadius: "8px", marginTop: "10px" },
    aiButton: { backgroundColor: PURPLE, color: "#fff", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", marginTop: "10px", width: "100%", fontSize: "0.9rem" },
    sectionMargin: { marginTop: "30px" },
    inputFilter: { padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "10px", fontSize: "0.85rem", width: "150px" },
    badgeAlert: { backgroundColor: "#ff4d4f", color: "#fff", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", marginBottom: "10px", textAlign: "center" },
    infoTable: { width: "100%", maxWidth: "800px", margin: "20px auto", borderCollapse: "collapse", textAlign: "left" },
    infoTableTh: { borderBottom: "2px solid #ccc", padding: "10px", fontWeight: "600", color: PURPLE },
    infoTableTd: { borderBottom: "1px solid #eee", padding: "8px" },
    progressContainer: { background: theme === "light" ? "#e0e0e0" : "#444", borderRadius: "12px", overflow: "hidden", marginTop: "10px" },
    progressBar: { height: "15px", width: `${progressPercent}%`, background: PURPLE, transition: "width 0.5s ease" }
  };

  return (
    <div style={styles.container}>
      <div style={{ position: "absolute", top: 20, right: 20, cursor: "pointer" }} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        {theme === "light" ? <Moon size={28} /> : <Sun size={28} />}
      </div>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroText}>
          <h1 style={styles.mainTitle}><Wallet size={28} /> Family Budget Tracker</h1>
          <p style={styles.heroDesc}>Track your expenses, see trends, and save smarter.</p>
        </div>
        <img src="/hero-image.jpg" alt="Dashboard Illustration" style={styles.heroImage} />
      </div>

      {/* Info Table */}
      <table style={styles.infoTable}>
        <thead>
          <tr>
            <th style={styles.infoTableTh}>Feature</th>
            <th style={styles.infoTableTh}>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Add Expense</td><td>Add a new expense with details.</td></tr>
          <tr><td>Quick Add</td><td>Add recurring expenses quickly.</td></tr>
          <tr><td>Spending Summary</td><td>View total spent and saving progress.</td></tr>
          <tr><td>AI Tips</td><td>Get smart suggestions to save money.</td></tr>
          <tr><td>Monthly Trend</td><td>Visualize spending trends month by month.</td></tr>
          <tr><td>Spending by Category</td><td>See percentage spent per category.</td></tr>
          <tr><td>All Expenses</td><td>List all expenses with search and filters.</td></tr>
        </tbody>
      </table>

      {/* Add Expense + Quick Add */}
      <div style={styles.cardGrid}>
        <section style={{ ...styles.card, ...styles.addExpenseCard }}>
          <h2><Sparkles size={18} /> Add Expense</h2>
          <ExpenseForm onAdd={(e) => { e.preventDefault(); addExpense(e); }} />
        </section>

        <section style={{ ...styles.card, ...styles.quickAddCard }}>
          <h2>Quick Add</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button style={styles.quickAddButton} onClick={() => quickAdd("Food", 200, "Food")}>Food</button>
            <button style={styles.quickAddButton} onClick={() => quickAdd("Transport", 150, "Transport")}>Transport</button>
            <button style={styles.quickAddButton} onClick={() => quickAdd("Rent", 5000, "Rent")}>Rent</button>
            <button style={styles.quickAddButton} onClick={() => quickAdd("Groceries", 800, "Groceries")}>Groceries</button>
            <button style={styles.quickAddButton} onClick={() => quickAdd("Electricity", 1200, "Utilities")}>Electricity</button>
            <button style={styles.quickAddButton} onClick={() => quickAdd("Internet", 1000, "Utilities")}>Internet</button>
            <button style={styles.quickAddButton} onClick={() => quickAdd("Entertainment", 400, "Fun")}>Entertainment</button>
            <button style={styles.quickAddButton} onClick={() => quickAdd("Health", 700, "Health")}>Health</button>
          </div>
        </section>
      </div>

      {/* Summary */}
      <div style={styles.cardGrid}>
        <section style={styles.card}>
          {budgetAlert && <div style={styles.badgeAlert}>⚠️ Budget exceeded!</div>}
          <h2><PieChart size={18} /> Spending Summary</h2>
          <div style={styles.summaryBox}>
            <p>Total Spent:</p>
            <h1>{totalSpent.toLocaleString()} AFN</h1>
            <div style={styles.progressContainer}>
              <div style={styles.progressBar}></div>
            </div>
            <small>Goal: {savingGoal.toLocaleString()} AFN</small>
          </div>
          <button style={styles.aiButton} onClick={askAITips} disabled={loadingTips}>
            {loadingTips ? "🤔 Thinking..." : "Get AI Saving Tips"}
          </button>
          {aiTips && (
            <div style={styles.aiTips}>
              <Brain size={18} />
              <div><h4>AI Suggestions</h4><p>{aiTips}</p></div>
            </div>
          )}
        </section>
      </div>

      {/* Charts */}
      <div style={styles.cardGrid}>
        <section style={styles.card}>
          <h2>Monthly Spending Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke={PURPLE} strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section style={styles.card}>
          <h2>Spending by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <RePieChart>
              <Pie data={Object.entries(totalsByCategory).map(([name,value])=>({name,value}))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill={PURPLE} label>
                {Object.entries(totalsByCategory).map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Legend />
            </RePieChart>
          </ResponsiveContainer>
        </section>
      </div>

      {/* Filter + Expense List */}
      <div style={styles.cardGrid}>
        <section style={styles.card}>
          <h2>All Expenses</h2>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Search expenses..."
              style={styles.inputFilter}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} style={styles.inputFilter}>
              <option value="all">All time</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
            </select>
          </div>
          <ExpenseList items={filteredExpenses} onDelete={removeExpense} onEdit={editExpense} />
        </section>
      </div>
    </div>
  );
              }
