import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend } from "recharts";
import { Sparkles, Wallet, PieChart, Brain, Sun, Moon, TrendingUp } from "lucide-react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import { getBudgetTips } from "../ai/aiService";

const LOCAL_KEY = "cw_expenses_v1";
const PURPLE = "#8b5cf6";
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

  // Load expenses from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    setExpenses(raw ? JSON.parse(raw) : []);
  }, []);

  // Save expenses and check budget alert
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(expenses));
    const total = expenses.reduce((s, e) => s + Number(e.cost), 0);
    setBudgetAlert(total > 100000);
  }, [expenses]);

  // Add, remove, edit expenses
  function addExpense(exp) {
    setExpenses((s) => [exp, ...s]);
    setRecentlyAdded((s) => [exp, ...s].slice(0, 3));
  }
  function quickAdd(name, cost, category) {
  const exp = { id: Date.now(), item: name, cost, category, date: new Date().toISOString() };
  addExpense(exp);
  }
  function removeExpense(id) {
    setExpenses((s) => s.filter((e) => e.id !== id));
  }
  function editExpense(id, newItem) {
  setExpenses((s) =>
    s.map((e) => (e.id === id ? { ...e, item: newItem } : e))
  );
  } 

  // Compute totals
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

  // AI tips
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

  // Spending summary
  const totalSpent = expenses.reduce((s, e) => s + Number(e.cost), 0);
  const savingGoal = 200000;
  const progressPercent = Math.min((savingGoal - totalSpent) / savingGoal * 100, 100);

  // Filtered expenses
  const filteredExpenses = expenses.filter((e) => {
    const matchesFilter =
  e.item.toLowerCase().includes(filter.toLowerCase()) ||
  e.category.toLowerCase().includes(filter.toLowerCase());
    if (timeFilter === "month") {
      const now = new Date();
      return matchesFilter && new Date(e.date).getMonth() === now.getMonth();
    } else if (timeFilter === "week") {
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return matchesFilter && new Date(e.date) >= weekAgo;
    }
    return matchesFilter;
  });

  // Styles
  const styles = {
    container: { fontFamily: "'Poppins', sans-serif", color: "#000", maxWidth: "1440px", margin: "auto", padding: "0 20px", background: "#fff", transition: "background 0.3s, color 0.3s" },
    hero: { display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: "20px", margin: "60px 0", padding: "40px 20px", borderRadius: "20px", background: PURPLE, boxShadow: "0 10px 30px rgba(0,0,0,0.05)", transition: "all 0.5s", flexWrap: "wrap" },
    heroText: { flex: "1", minWidth: "250px" },
    heroImg: { width: "200px", height: "200px", borderRadius: "20px", objectFit: "cover" },
    mainTitle: { fontSize: "2.5rem", color: "#fff", marginBottom: "15px", fontWeight: "bold" },
    heroDesc: { fontSize: "1.1rem", lineHeight: "1.5", color: "#fff", marginBottom: "15px" },
    features: { listStyle: "none", paddingLeft: 0, display: "flex", flexDirection: "column", gap: "10px", color: "#fff" },
    featureItem: { display: "flex", alignItems: "center", fontSize: "0.95rem" },
    featureArrow: { color: "#fff", fontWeight: "bold", marginRight: "8px" },
    cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "40px" },
    card: { padding: "25px", borderRadius: "12px", boxShadow: "0 6px 15px rgba(0,0,0,0.08)", background: "#fff", transition: "all 0.3s ease" },
    addExpenseCard: { background: PURPLE, color: "#fff" },
    quickAddCard: { background: "#fff", color: "#000", display: "flex", flexDirection: "column", gap: "10px", padding: "20px" },
    summaryBox: { backgroundColor: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "15px", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
    aiTips: { display: "flex", alignItems: "flex-start", gap: "10px", backgroundColor: PURPLE, color: "#fff", padding: "10px", borderRadius: "8px", marginTop: "10px" },
    aiButton: { backgroundColor: PURPLE, color: "#fff", border: "none", padding: "10px 15px", borderRadius: "6px", cursor: "pointer", marginTop: "10px", transition: "all 0.3s ease" },
    sectionMargin: { marginTop: "40px" },
    inputFilter: { padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc", width: "150px", fontSize: "0.9rem" },
    badgeAlert: { backgroundColor: "#fff", color: PURPLE, padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", marginBottom: "10px", textAlign: "center" },
    miniList: { display: "flex", gap: "10px", marginTop: "10px" },
    miniItem: { padding: "5px 10px", borderRadius: "6px", background: PURPLE, color: "#fff", fontSize: "0.85rem" },
    progressContainer: { background: "#eee", borderRadius: "12px", overflow: "hidden", marginTop: "10px" },
    progressBar: { height: "15px", width: `${progressPercent}%`, background: PURPLE, transition: "width 0.5s ease" },
    toggleButton: { cursor: "pointer", position: "absolute", top: "20px", right: "20px" },
    quickAddButton: { padding: "8px 10px", borderRadius: "6px", background: PURPLE, color: "#fff", border: "none", cursor: "pointer", transition: "all 0.3s ease", textAlign: "center" }
  };

  return (
    <div style={styles.container}>
      <div style={styles.toggleButton} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        {theme === "light" ? <Moon size={28} /> : <Sun size={28} />}
      </div>

      {/* هیرو */}
<div style={styles.hero}>
  <div style={styles.heroText}>
    <h1 style={styles.mainTitle}><Wallet size={28} /> Family Budget Tracker</h1>
    <p style={styles.heroDesc}>Track your expenses, see trends, and save smarter.</p>
    <ul style={styles.features}>
      <li style={styles.featureItem}><span style={styles.featureArrow}>➡</span>Real-time expense tracking</li>
      <li style={styles.featureItem}><span style={styles.featureArrow}>➡</span>Category & monthly breakdowns</li>
      <li style={styles.featureItem}><span style={styles.featureArrow}>➡</span>Smart AI suggestions</li>
      <li style={styles.featureItem}><span style={styles.featureArrow}>➡</span>Budget alerts & gamification</li>
    </ul>

    {/* Recently Added Expenses */}
    {recentlyAdded.length > 0 && (
      <div style={styles.miniList}>
        {recentlyAdded.map((e) => (
          <div key={e.id} style={styles.miniItem}>
            {e.item} - {e.cost} AFN
          </div>
        ))}
      </div>
    )}
  </div>

  <img
    style={styles.heroImg}
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPwQe_UEirO7xN3DfMTEd3SIG9hL8bTKAt5Q&s"
    alt="Budget illustration"
  />
</div>

      {/* Add Expense + Quick Add + Summary */}
      <div style={styles.cardGrid}>
        <section style={{ ...styles.card, ...styles.addExpenseCard }}>
          <h2><Sparkles size={20} /> Add Expense</h2>
          <ExpenseForm onAdd={addExpense} />
        </section>

        <section style={{ ...styles.card, ...styles.quickAddCard }}>
          <h2>Quick Add</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {["Food", "Transport", "Rent", "Groceries", "Electricity", "Water", "Internet", "Entertainment"].map((item, i) => (
              <button key={i} style={styles.quickAddButton} onClick={() => quickAdd(item, 100 * (i+1), "General")}>{item}</button>
            ))}
          </div>
        </section>

        <section style={styles.card}>
          {budgetAlert && <div style={styles.badgeAlert}>⚠️ Budget exceeded!</div>}
          <h2><PieChart size={20} /> Spending Summary</h2>
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
              <Brain size={20} />
              <div><h4>AI Suggestions</h4><p>{aiTips}</p></div>
            </div>
          )}
        </section>
      </div>

      {/* Filter + Expense List */}
      <div style={{ ...styles.card, ...styles.sectionMargin }}>
        <h2>All Expenses</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px", justifyContent: "center" }}>
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
      </div>

      {/* Charts آخر صفحه */}
      <div style={{ ...styles.card, ...styles.sectionMargin }}>
        <h2><TrendingUp size={20} /> Monthly Spending Trend</h2>
        {trendData.length === 0 ? (
          <p style={{ textAlign: "center", padding: "20px", color: "black" }}>
            Add expenses to see your monthly spending trend.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke={PURPLE} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ ...styles.card, ...styles.sectionMargin }}>
        <h2><PieChart size={20} /> Spending by Category</h2>
        {Object.keys(totalsByCategory).length === 0 ? (
          <p style={{ textAlign: "center", padding: "20px", color: "black" }}>
            Add expenses to start tracking categories.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie
                data={Object.entries(totalsByCategory).map(([name, value]) => ({ name, value }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {Object.entries(totalsByCategory).map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </RePieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
        }
