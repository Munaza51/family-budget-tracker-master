import React, { useEffect, useRef, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell, Legend
} from "recharts";
import {
  Sparkles, Wallet, PieChart, Brain, Sun, Moon, TrendingUp
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
    const total = expenses.reduce((s, e) => s + Number(e.cost), 0);
    setBudgetAlert(total > 100000);
  }, [expenses]);

  // Add expense
  function addExpense(exp) {
    setExpenses((s) => [exp, ...s]);
    setRecentlyAdded((s) => [exp, ...s].slice(0, 3));
  }

  // Quick Add + show total spent
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

  function removeExpense(id) {
    setExpenses((s) => s.filter((e) => e.id !== id));
  }

  // ✅ FULL EDIT (item + cost + category)
  function editExpense(id, updated) {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updated } : e))
    );
  }

  // Spending Summary
  const totalSpent = expenses.reduce((s, e) => s + Number(e.cost), 0);
  const savingGoal = 200000;
  const progressPercent = Math.min(
    ((savingGoal - totalSpent) / savingGoal) * 100,
    100
  );

  // Category totals
  const totalsByCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.cost);
    return acc;
  }, {});

  // Monthly trend
  const monthlyTrend = expenses.reduce((acc, e) => {
    const month = new Date(e.date).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + Number(e.cost);
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
    } catch {
      setAiTips("⚠️ AI error — check API key or network.");
    }
    setLoadingTips(false);
  }

  // Filters
  const filteredExpenses = expenses.filter((e) => {
    const matches =
      e.item.toLowerCase().includes(filter.toLowerCase()) ||
      e.category.toLowerCase().includes(filter.toLowerCase());

    if (timeFilter === "month") {
      const now = new Date();
      return matches && new Date(e.date).getMonth() === now.getMonth();
    }
    if (timeFilter === "week") {
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return matches && new Date(e.date) >= weekAgo;
    }
    return matches;
  });

  // Styles
  const styles = {
    container: {
      maxWidth: "1440px",
      margin: "auto",
      padding: "0 20px",
      fontFamily: "'Poppins', sans-serif",
    },
    // ✅ HERO CENTERED
    hero: {
      margin: "50px auto",
      background: PURPLE,
      borderRadius: "22px",
      padding: "40px 20px",
      textAlign: "center",
      color: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px",
    },
    heroInner: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "30px",
      flexWrap: "wrap",
      maxWidth: "900px",
    },
    heroImg: {
      width: "200px",
      height: "200px",
      borderRadius: "18px",
      objectFit: "cover",
    },
    startButton: {
      background: "#fff",
      color: PURPLE,
      padding: "12px 24px",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      marginTop: "10px",
      fontWeight: "bold",
    },

    cardGrid3: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "22px",
      marginTop: "40px",
    },
    cardGrid2: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "22px",
      marginTop: "35px",
    },

    card: {
      background: "#fff",
      padding: "25px",
      borderRadius: "14px",
      boxShadow: "0 6px 18px rgba(0,0,0,0.07)",
    },
    addExpenseCard: { background: PURPLE, color: "white" },
    quickAddBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
    },
    quickButton: {
      background: PURPLE,
      color: "white",
      padding: "8px 18px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      width: "120px",
    },
  };

  return (
    <div style={styles.container}>
      {/* Theme Toggle */}
      <div
        style={{ cursor: "pointer", position: "absolute", top: 20, right: 20 }}
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? <Moon size={28} /> : <Sun size={28} />}
      </div>

      {/* ✅ HERO (Centered) */}
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <div>
            <h1><Wallet /> Family Budget Tracker</h1>
            <p>Track smarter. Save easier.</p>

            {recentlyAdded.length > 0 && (
              <p style={{ fontSize: "1.1rem", marginTop: "10px" }}>
                ✅ آخرین مصرف:{" "}
                <b>{recentlyAdded[0].item} — {recentlyAdded[0].cost} AFN</b>
              </p>
            )}
          </div>

          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPwQe_UEirO7xN3DfMTEd3SIG9hL8bTKAt5Q&s"
            alt="hero"
            style={styles.heroImg}
          />
        </div>

        {/* Start Tracking Button */}
        <button
          style={styles.startButton}
          onClick={() => addExpenseRef.current?.scrollIntoView({ behavior: "smooth" })}
        >
          Start Tracking
        </button>
      </div>

      {/* ✅ Add Expense + Quick Add + Monthly Trend */}
      <div style={styles.cardGrid3} ref={addExpenseRef}>
        <section style={{ ...styles.card, ...styles.addExpenseCard }}>
          <h2><Sparkles /> Add Expense</h2>
          <ExpenseForm onAdd={addExpense} />
        </section>

        <section style={styles.card}>
          <h2><Sparkles /> Quick Add</h2>
          <div style={styles.quickAddBox}>
            {["Food", "Transport", "Rent", "Electricity"].map((name, i) => (
              <button
                key={i}
                style={styles.quickButton}
                onClick={() => quickAdd(name, (i + 1) * 100, "General")}
              >
                {name}
              </button>
            ))}
          </div>
        </section>

        <section style={styles.card}>
          <h2><TrendingUp /> Monthly Trend</h2>
          {trendData.length === 0 ? (
            <p>No data yet</p>
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
        </section>
      </div>

      {/* ✅ Spending Summary + Categories */}
      <div style={styles.cardGrid2}>
        <section style={styles.card}>
          <h2><PieChart /> Spending Summary</h2>
          <h1>{totalSpent.toLocaleString()} AFN</h1>
        </section>

        <section style={styles.card}>
          <h2><PieChart /> Spending by Category</h2>

          {Object.keys(totalsByCategory).length === 0 ? (
            <p>No categories yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart>
                <Pie
                  data={Object.entries(totalsByCategory).map(([name, value]) => ({
                    name,
                    value,
                  }))}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {Object.keys(totalsByCategory).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          )}
        </section>
      </div>

      {/* ✅ Expense List at the END */}
      <div style={{ ...styles.card, marginTop: "40px" }}>
        <h2><Sparkles /> All Expenses</h2>

        <ExpenseList
          items={filteredExpenses}
          onDelete={removeExpense}
          onEdit={editExpense} // ✅ full edit support
        />
      </div>
    </div>
  );
}
