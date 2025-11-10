import React, { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Sparkles,
  Wallet,
  PieChart,
  Brain,
  Sun,
  Moon,
  TrendingUp,
} from "lucide-react";
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

  const addExpenseRef = useRef(null);

  // Load expenses
  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    setExpenses(raw ? JSON.parse(raw) : []);
  }, []);

  // Save + budget check
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(expenses));
    const total = expenses.reduce((s, e) => s + Number(e.cost || 0), 0);
    setBudgetAlert(total > 100000);
  }, [expenses]);

  // Add expense
  function addExpense(exp) {
    const withDate = { ...exp, date: exp.date || new Date().toISOString() };
    setExpenses((s) => [withDate, ...s]);
    setRecentlyAdded((s) => [withDate, ...s].slice(0, 3));
  }

  // Quick Add
  function quickAdd(name, cost, category) {
    const exp = {
      id: Date.now(),
      item: name,
      cost,
      category,
      date: new Date().toISOString(),
    };
    addExpense(exp);
  }

  // Remove
  function removeExpense(id) {
    setExpenses((s) => s.filter((e) => e.id !== id));
  }

  // Full edit: receives updated object {item, category, cost}
  function editExpense(id, updated) {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updated } : e))
    );
  }

  // Totals by category
  const totalsByCategory = expenses.reduce((acc, e) => {
    const cat = e.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + Number(e.cost || 0);
    return acc;
  }, {});

  // Monthly trend
  const monthlyTrend = expenses.reduce((acc, e) => {
    const month = new Date(e.date).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + Number(e.cost || 0);
    return acc;
  }, {});
  const trendData = Object.entries(monthlyTrend).map(([month, total]) => ({
    month,
    total,
  }));

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

  // Spending summary values
  const totalSpent = expenses.reduce((s, e) => s + Number(e.cost || 0), 0);
  const savingGoal = 200000;
  const progressPercent = Math.max(
    0,
    Math.min(100, Math.round(((savingGoal - totalSpent) / savingGoal) * 100))
  );

  // Filtered expenses
  const filteredExpenses = expenses.filter((e) => {
    const matchesFilter =
      (e.item || "").toString().toLowerCase().includes(filter.toLowerCase()) ||
      (e.category || "").toString().toLowerCase().includes(filter.toLowerCase());
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
    container: {
      fontFamily: "'Poppins', sans-serif",
      color: "#000",
      maxWidth: "1200px",
      margin: "auto",
      padding: "24px",
      background: "#fff",
      transition: "background 0.3s, color 0.3s",
    },
    toggleButton: { cursor: "pointer", position: "absolute", top: 20, right: 20 },
    // HERO with purple -> white gradient (chosen)
    hero: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "20px",
      margin: "28px 0",
      padding: "28px 24px",
      borderRadius: "16px",
      background: "PURPLE",
      boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
      flexWrap: "wrap",
    },
    heroText: { flex: "1 1 420px", minWidth: "240px", color: "#111" },
    heroImg: { width: "200px", height: "200px", borderRadius: "12px", objectFit: "cover" },
    mainTitle: { fontSize: "2rem", color: "#111", marginBottom: "8px", fontWeight: 700 },
    heroDesc: { fontSize: "1rem", lineHeight: 1.4, color: "#222", marginBottom: "12px" },
    features: { listStyle: "none", paddingLeft: 0, display: "flex", flexDirection: "column", gap: "8px", color: "#111", margin: 0 },
    featureItem: { display: "flex", alignItems: "center", fontSize: "0.95rem" },
    featureArrow: { marginRight: "8px", color: "#111", fontWeight: 700 },

    // Top grid (3 columns)
    topGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "20px",
      marginTop: "20px",
    },
    card: {
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 6px 15px rgba(0,0,0,0.06)",
      background: "#fff",
    },
    addExpenseCard: { background: PURPLE, color: "#fff" },
    quickAddCard: { display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", justifyContent: "center" },
    quickAddButton: {
      padding: "8px 12px",
      borderRadius: "8px",
      background: PURPLE,
      color: "#fff",
      border: "none",
      cursor: "pointer",
      minWidth: "110px",
    },

    // Summary row (2 columns)
    summaryGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "20px",
      marginTop: "24px",
    },
    spendingSummaryCard: {
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 6px 15px rgba(0,0,0,0.06)",
      background: "#fff",
    },
    summaryBox: {
      backgroundColor: "#fafafa",
      padding: "14px",
      borderRadius: "10px",
      marginBottom: "12px",
      textAlign: "center",
      boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
    },
    aiTips: {
      display: "flex",
      alignItems: "flex-start",
      gap: "10px",
      backgroundColor: PURPLE,
      color: "#fff",
      padding: "10px",
      borderRadius: "8px",
      marginTop: "10px",
    },
    aiButton: {
      backgroundColor: PURPLE,
      color: "#fff",
      border: "none",
      padding: "10px 14px",
      borderRadius: "8px",
      cursor: "pointer",
    },

    sectionMargin: { marginTop: "28px" },
    inputFilter: { padding: "8px 10px", borderRadius: "8px", border: "1px solid #e5e7eb", width: "170px", fontSize: "0.95rem" },

    miniList: { display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" },
    miniItem: { padding: "6px 10px", borderRadius: "8px", background: PURPLE, color: "#fff", fontSize: "0.85rem" },

    progressContainer: { background: "#eee", borderRadius: "12px", overflow: "hidden", marginTop: "10px" },
    progressBar: (pct) => ({ height: "14px", width: `${pct}%`, background: PURPLE, transition: "width 0.4s ease" }),
  };

  return (
    <div style={styles.container}>
      {/* Theme toggle */}
      <div style={styles.toggleButton} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        {theme === "light" ? <Moon size={22} /> : <Sun size={22} />}
      </div>

      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroText}>
          <h1 style={styles.mainTitle}><Wallet size={22} /> Family Budget Tracker</h1>
          <p style={styles.heroDesc}>Track your expenses, see trends, and save smarter.</p>

          <ul style={styles.features}>
            <li style={styles.featureItem}><span style={styles.featureArrow}>➡</span>Real-time expense tracking</li>
            <li style={styles.featureItem}><span style={styles.featureArrow}>➡</span>Category & monthly breakdowns</li>
            <li style={styles.featureItem}><span style={styles.featureArrow}>➡</span>Smart AI suggestions</li>
            <li style={styles.featureItem}><span style={styles.featureArrow}>➡</span>Budget alerts & gamification</li>
          </ul>

          {/* Recently Added */}
          {recentlyAdded.length > 0 && (
            <div style={styles.miniList}>
              {recentlyAdded.map((e) => (
                <div key={e.id} style={styles.miniItem}>
                  {e.item} — {e.cost} AFN
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 14 }}>
            <button
              onClick={() => addExpenseRef.current?.scrollIntoView({ behavior: "smooth" })}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                background: "#111",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                marginTop: 12,
              }}
            >
              Start Tracking
            </button>
          </div>
        </div>

        <img
          style={styles.heroImg}
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPwQe_UEirO7xN3DfMTEd3SIG9hL8bTKAt5Q&s"
          alt="Budget illustration"
        />
      </div>

      {/* Top row: Add Expense | Quick Add | Monthly Trend */}
      <div style={{ ...styles.topGrid }} ref={addExpenseRef}>
        <section style={{ ...styles.card, ...styles.addExpenseCard }}>
          <h3 style={{ margin: 0, color: "#fff" }}><Sparkles /> Add Expense</h3>
          <div style={{ marginTop: 12 }}>
            <ExpenseForm onAdd={addExpense} />
          </div>
        </section>

        <section style={{ ...styles.card, ...styles.quickAddCard }}>
          <h3 style={{ margin: 0 }}><Sparkles /> Quick Add</h3>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {["Food", "Transport", "Rent", "Groceries", "Electricity", "Water", "Internet", "Entertainment"].map((item, i) => (
              <button
                key={i}
                style={styles.quickAddButton}
                onClick={() => quickAdd(item, 100 * (i + 1), "General")}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section style={{ ...styles.card }}>
          <h3 style={{ margin: 0 }}><TrendingUp /> Monthly Trend</h3>
          <div style={{ marginTop: 12 }}>
            {trendData.length === 0 ? (
              <p style={{ color: "#666" }}>Add expenses to see your monthly spending trend.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trendData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke={PURPLE} strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      </div>

      {/* Summary row: Spending Summary (with AI tips) | Spending by Category */}
      <div style={styles.summaryGrid}>
        <section style={styles.spendingSummaryCard}>
          {budgetAlert && (
            <div style={{ background: "#fff", color: PURPLE, padding: "6px 12px", borderRadius: 8, display: "inline-block", fontWeight: 700 }}>
              ⚠️ Budget exceeded!
            </div>
          )}

          <h3 style={{ marginTop: 12 }}><PieChart /> Spending Summary</h3>

          <div style={styles.summaryBox}>
            <div style={{ textAlign: "center" }}>
              <p style={{ margin: 0, color: "#666" }}>Total Spent</p>
              <h2 style={{ margin: "8px 0" }}>{totalSpent.toLocaleString()} AFN</h2>
            </div>

            <div style={styles.progressContainer}>
              <div style={styles.progressBar(progressPercent)} />
            </div>

            <div style={{ marginTop: 8, color: "#666" }}>Goal: {savingGoal.toLocaleString()} AFN</div>
          </div>

          <div>
            <button style={styles.aiButton} onClick={askAITips} disabled={loadingTips}>
              {loadingTips ? "🤔 Thinking..." : "Get AI Saving Tips"}
            </button>

            {aiTips && (
              <div style={styles.aiTips}>
                <Brain size={18} />
                <div>
                  <strong>AI Suggestions</strong>
                  <div style={{ fontSize: 13, marginTop: 6 }}>{aiTips}</div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section style={styles.card}>
          <h3 style={{ marginTop: 0 }}><PieChart /> Spending by Category</h3>

          {Object.keys(totalsByCategory).length === 0 ? (
            <p style={{ color: "#666" }}>Add expenses to start tracking categories.</p>
          ) : (
            <div style={{ marginTop: 12 }}>
              <ResponsiveContainer width="100%" height={220}>
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
            </div>
          )}
        </section>
      </div>

      {/* Filter + Expense List (bottom) */}
      <div style={{ ...styles.card, ...styles.sectionMargin }}>
        <h3 style={{ marginTop: 0 }}><Sparkles /> All Expenses</h3>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
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
    </div>
  );
    }
