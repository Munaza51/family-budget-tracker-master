import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend } from "recharts";
import { Sparkles, Wallet, PieChart, Brain, Sun, Moon } from "lucide-react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import { getBudgetTips } from "../ai/aiService";

const LOCAL_KEY = "cw_expenses_v1";
const PURPLE = "#8b5cf6";
const WHITE = "#ffffff";
const COLORS = [PURPLE, WHITE];

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
    container: { fontFamily: "'Inter', sans-serif", color: PURPLE, maxWidth: "1440px", margin: "auto", padding: "20px", backgroundColor: WHITE },
    hero: { display: "flex", flexDirection: "row", alignItems: "center", gap: "40px", margin: "40px 0", padding: "30px", borderRadius: "12px", backgroundColor: PURPLE, color: WHITE },
    heroText: { flex: 1 },
    heroImage: { flex: 1, width: "200px", height: "200px", objectFit: "cover", borderRadius: "12px", backgroundColor: WHITE },
    mainTitle: { fontSize: "2rem", fontWeight: "600", marginBottom: "10px" },
    heroDesc: { fontSize: "1rem", lineHeight: "1.4" },
    heroList: { listStyle: "none", paddingLeft: 0, marginTop: "15px", display: "flex", flexDirection: "column", gap: "8px" },
    heroListItem: { display: "flex", alignItems: "center", gap: "8px" },
    cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "40px" },
    card: { padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", backgroundColor: PURPLE, color: WHITE },
    addExpenseCard: { backgroundColor: WHITE, color: PURPLE },
    quickAddCard: { backgroundColor: WHITE, color: PURPLE },
    quickAddButton: { backgroundColor: PURPLE, color: WHITE, border: "none", padding: "10px 12px", borderRadius: "6px", cursor: "pointer", marginBottom: "6px", textAlign: "left", width: "100%" },
    summaryBox: { backgroundColor: WHITE, color: PURPLE, padding: "15px", borderRadius: "8px", marginBottom: "15px", textAlign: "center" },
    aiTips: { display: "flex", alignItems: "flex-start", gap: "10px", backgroundColor: WHITE, color: PURPLE, padding: "10px", borderRadius: "8px", marginTop: "10px" },
    aiButton: { backgroundColor: PURPLE, color: WHITE, border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", marginTop: "10px", width: "100%", fontSize: "0.9rem" },
    sectionMargin: { marginTop: "30px" },
    inputFilter: { padding: "6px 10px", borderRadius: "6px", border: `1px solid ${PURPLE}`, marginBottom: "10px", fontSize: "0.85rem", width: "120px" },
    badgeAlert: { backgroundColor: PURPLE, color: WHITE, padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", marginBottom: "10px", textAlign: "center" },
    infoTable: { width: "100%", maxWidth: "800px", margin: "20px auto", borderCollapse: "collapse", textAlign: "left" },
    infoTableTh: { borderBottom: `2px solid ${PURPLE}`, padding: "10px", fontWeight: "600", color: PURPLE },
    infoTableTd: { borderBottom: `1px solid ${PURPLE}`, padding: "8px" },
    progressContainer: { background: WHITE, borderRadius: "12px", overflow: "hidden", marginTop: "10px" },
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
          <ul style={styles.heroList}>
            <li style={styles.heroListItem}>➡ Real-time expense tracking</li>
            <li style={styles.heroListItem}>➡ Category & monthly breakdowns</li>
            <li style={styles.heroListItem}>➡ Smart AI suggestions</li>
            <li style={styles.heroListItem}>➡ Budget alerts & gamification</li>
          </ul>
        </div>
        <div style={styles.heroImage}></div>
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
          <tr><td>Add Expense</td><td>Add a new expense with details</td></tr>
          <tr><td>Quick Add</td><td>Add recurring expenses quickly</td></tr>
          <tr><td>Spending Summary</td><td>View total spent and saving progress</td></tr>
          <tr><td>AI Tips</td><td>Get smart suggestions to save money</td></tr>
          <tr><td>Monthly Trend</td><td>Visualize spending trends month by month</td></tr>
          <tr><td>Spending by Category</td><td>See percentage spent per category</td></tr>
          <tr><td>All Expenses</td><td>List all expenses with search and filters</td></tr>
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
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {["Food","Transport","Rent","Groceries","Electricity","Internet","Entertainment","Health"].map(item => (
              <button key={item} style={styles.quickAddButton} onClick={() => quickAdd(item, 200, item)}>{item}</button>
            ))}
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
        <section style={{ ...styles.card, backgroundColor: WHITE, color: PURPLE }}>
          <h2>Monthly Spending Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <XAxis dataKey="month" stroke={PURPLE} />
              <YAxis stroke={PURPLE} />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke={PURPLE} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section style={{ ...styles.card, backgroundColor: WHITE, color: PURPLE }}>
          <h2>Spending by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie data={Object.entries(totalsByCategory).map(([name,value])=>({name,value}))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {Object.entries(totalsByCategory).map((_, index) => <Cell key={index} fill={PURPLE} />)}
              </Pie>
              <Legend />
            </RePieChart>
          </ResponsiveContainer>
        </section>
      </div>

      {/* All Expenses */}
      <div style={{ ...styles.card, ...styles.sectionMargin, backgroundColor: WHITE, color: PURPLE }}>
        <h2>All Expenses</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Search expenses..."
            style={{ ...styles.inputFilter, flex: "1" }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} style={{ ...styles.inputFilter }}>
            <option value="all">All time</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
          </select>
        </div>
        <ExpenseList items={filteredExpenses} onDelete={removeExpense} onEdit={editExpense} />
      </div>
    </div>
  );
    }
