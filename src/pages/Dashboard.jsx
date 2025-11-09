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
    container: { fontFamily: "'Poppins', sans-serif", color: theme === "light" ? "#000" : "#f8f8f8", maxWidth: "1440px", margin: "auto", padding: "0 20px", backgroundColor: theme === "light" ? "#f8f9fa" : "#1e1e2f", transition: "background 0.3s, color 0.3s" },
    hero: { display: "flex", flexDirection: "column", textAlign: "left", gap: "20px", margin: "60px 0", padding: "40px 20px", borderRadius: "20px", backgroundColor: theme === "light" ? "#fff" : "#2a2a3e", boxShadow: theme === "light" ? "0 10px 30px rgba(0,0,0,0.05)" : "0 10px 30px rgba(0,0,0,0.4)", transition: "background 0.3s, color 0.3s" },
    mainTitle: { fontSize: "3rem", color: PURPLE, marginBottom: "20px", fontWeight: "bold" },
    heroDesc: { fontSize: "1.2rem", lineHeight: "1.6", marginBottom: "20px" },
    features: { listStyle: "none", paddingLeft: 0, display: "flex", flexDirection: "column", gap: "12px" },
    featureItem: { display: "flex", alignItems: "center", fontSize: "1rem" },
    featureArrow: { color: PURPLE, fontWeight: "bold", marginRight: "10px" },
    cardGrid: { display: "grid", gridTemplateColumns: "1fr", gap: "20px", marginBottom: "40px" },
    card: { padding: "25px", borderRadius: "12px", boxShadow: "0 6px 15px rgba(0,0,0,0.08)", background: theme === "light" ? "#fff" : "#2a2a3e", transition: "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s, color 0.3s" },
    addExpenseCard: { background: PURPLE, color: "#fff" },
    quickAddCard: { background: PURPLE, color: "#fff" },
    summaryBox: { backgroundColor: theme === "light" ? "#fff" : "#3b3b52", padding: "15px", borderRadius: "10px", marginBottom: "15px", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
    aiTips: { display: "flex", alignItems: "flex-start", gap: "10px", backgroundColor: PURPLE, color: "#fff", padding: "10px", borderRadius: "8px", marginTop: "10px" },
    aiButton: { backgroundColor: LIGHT_PURPLE, color: "#000", border: "none", padding: "10px 15px", borderRadius: "6px", cursor: "pointer", marginTop: "10px", transition: "background 0.3s ease" },
    sectionMargin: { marginTop: "40px" },
    inputFilter: { padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "10px", width: "auto", fontSize: "0.9rem" },
    badgeAlert: { backgroundColor: "#ff4d4f", color: "#fff", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", marginBottom: "10px" },
    miniList: { display: "flex", gap: "10px", marginTop: "10px" },
    miniItem: { padding: "5px 10px", borderRadius: "6px", background: PURPLE, color: "#fff", fontSize: "0.85rem" },
    progressContainer: { background: theme === "light" ? "#e0e0e0" : "#444", borderRadius: "12px", overflow: "hidden", marginTop: "10px" },
    progressBar: { height: "15px", width: `${progressPercent}%`, background: PURPLE, transition: "width 0.5s ease" },
    toggleButton: { cursor: "pointer", position: "absolute", top: "20px", right: "20px" },
    infoBox: { background: "#f3f0ff", padding: "20px", borderRadius: "12px", margin: "30px 0", display: "flex", flexDirection: "column", gap: "15px" },
    infoItem: { fontSize: "1rem", lineHeight: "1.5" },
    infoTitle: { fontWeight: "bold", color: PURPLE }
  };

  return (
    <div style={styles.container}>
      <div style={styles.toggleButton} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        {theme === "light" ? <Moon size={28} /> : <Sun size={28} />}
      </div>

      {/* هیرو */}
      <div style={styles.hero}>
        <h1 style={styles.mainTitle}><Wallet size={36} /> Family Budget Tracker</h1>
        <p style={styles.heroDesc}>Track your expenses, see trends, and save smarter.</p>
        <ul style={styles.features}>
          <li style={styles.featureItem}><span style={styles.featureArrow}>➡</span>Real-time expense tracking</li>
          <li style={styles.featureItem}><span style={styles.featureArrow}>➡</span>Category & monthly breakdowns</li>
          <li style={styles.featureItem}><span style={styles.featureArrow}>➡</span>Smart AI suggestions</li>
          <li style={styles.featureItem}><span style={styles.featureArrow}>➡</span>Budget alerts & gamification</li>
        </ul>
        {recentlyAdded.length > 0 && (
          <div style={styles.miniList}>
            {recentlyAdded.map((e) => (
              <div key={e.id} style={styles.miniItem}>{e.name} - {e.cost} AFN</div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box توضیحی */}
      <div style={styles.infoBox}>
        <div style={styles.infoItem}><span style={styles.infoTitle}>Add Expense:</span> اضافه کردن هزینه جدید با جزئیات کامل.</div>
        <div style={styles.infoItem}><span style={styles.infoTitle}>Quick Add:</span> اضافه کردن سریع هزینه‌های پر تکرار بدون پر کردن فرم کامل.</div>
        <div style={styles.infoItem}><span style={styles.infoTitle}>Spending Summary:</span> نمایش مجموع هزینه‌ها و درصد پیشرفت پس‌انداز.</div>
        <div style={styles.infoItem}><span style={styles.infoTitle}>AI Tips:</span> دریافت پیشنهادهای هوشمند برای مدیریت بهتر پول.</div>
        <div style={styles.infoItem}><span style={styles.infoTitle}>Monthly Trend:</span> نمودار روند ماهانه هزینه‌ها.</div>
        <div style={styles.infoItem}><span style={styles.infoTitle}>Spending by Category:</span> نمودار درصدی هزینه‌ها بر اساس دسته‌بندی.</div>
        <div style={styles.infoItem}><span style={styles.infoTitle}>All Expenses:</span> لیست همه هزینه‌ها با قابلیت جستجو و فیلتر زمان.</div>
      </div>

      {/* Add Expense + Quick Add */}
      <div style={styles.cardGrid}>
        <section style={{ ...styles.card, ...styles.addExpenseCard }}>
          <h2><Sparkles size={20} /> Add Expense</h2>
          <ExpenseForm onAdd={(e) => { e.preventDefault(); addExpense(e); }} />
        </section>

        <section style={{ ...styles.card, ...styles.quickAddCard }}>
          <h2>Quick Add</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button style={styles.aiButton} onClick={() => quickAdd("Daily Food", 200, "Food")}>Daily Food</button>
            <button style={styles.aiButton} onClick={() => quickAdd("Transport", 150, "Transport")}>Transport</button>
            <button style={styles.aiButton} onClick={() => quickAdd("Rent", 5000, "Rent")}>Rent</button>
            <button style={styles.aiButton} onClick={() => quickAdd("Groceries", 800, "Groceries")}>Groceries</button>
            <button style={styles.aiButton} onClick={() => quickAdd("Electricity", 1200, "Utilities")}>Electricity</button>
            <button style={styles.aiButton} onClick={() => quickAdd("Water", 500, "Utilities")}>Water</button>
            <button style={styles.aiButton} onClick={() => quickAdd("Internet", 1000, "Utilities")}>Internet</button>
            <button style={styles.aiButton} onClick={() => quickAdd("Entertainment", 400, "Fun")}>Entertainment</button>
            <button style={styles.aiButton} onClick={() => quickAdd("Clothes", 600, "Shopping")}>Clothes</button>
            <button style={styles.aiButton} onClick={() => quickAdd("Health", 700, "Health")}>Health</button>
          </div>
        </section>

        {/* Summary */}
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
            {loadingTips ? "🤔 Thinking..." : "🧠 Get AI Saving Tips"}
          </button>
          {aiTips && (
            <div style={styles.aiTips}>
              <Brain size={20} />
              <div><h4>AI Suggestions</h4><p>{aiTips}</p></div>
            </div>
          )}
        </section>
      </div>

      {/* Charts */}
      <div style={{ ...styles.card, ...styles.sectionMargin }}>
        <h2>Monthly Spending Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={trendData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke={PURPLE} strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ ...styles.card, ...styles.sectionMargin }}>
        <h2>Spending by Category</h2>
        <ResponsiveContainer width="100%" height={250}>
          <RePieChart>
            <Pie data={Object.entries(totalsByCategory).map(([name,value])=>({name,value}))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill={PURPLE} label>
              {Object.entries(totalsByCategory).map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Legend />
          </RePieChart>
        </ResponsiveContainer>
      </div>

      {/* Filter + Expense List */}
      <div style={{ ...styles.card, ...styles.sectionMargin }}>
        <h2 style={{ fontSize: "1.5rem" }}>All Expenses</h2>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Search expenses..."
            style={{ ...styles.inputFilter, fontSize: "0.9rem", padding: "6px 10px", width: "200px" }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            style={{ ...styles.inputFilter, fontSize: "0.9rem", padding: "6px 10px", width: "120px" }}
          >
            <option value="all">All time</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
          </select>
        </div>
        <ExpenseList
          items={filteredExpenses}
          onDelete={removeExpense}
          onEdit={editExpense}
          style={{ fontSize: "0.9rem" }}
        />
      </div>
    </div>
  );
                         }
