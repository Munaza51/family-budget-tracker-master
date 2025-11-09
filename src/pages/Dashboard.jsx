// src/pages/Dashboard.jsx
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
const PURPLE_DARK = "#6a3be0";
const GRADIENT = "linear-gradient(135deg,#8b5cf6 0%, #6a3be0 100%)";
// Pie color variants (all shades of purple / pinkish purples)
const PIE_COLORS = ["#8b5cf6", "#9f7dff", "#c4b5fd", "#e9d5ff", "#7c3aed"];

export default function Dashboard() {
  // state
  const [expenses, setExpenses] = useState([]);
  const [aiTips, setAiTips] = useState("");
  const [loadingTips, setLoadingTips] = useState(false);
  const [filter, setFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [theme, setTheme] = useState("light");
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const containerRef = useRef(null);

  // load / persist
  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    setExpenses(raw ? JSON.parse(raw) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(expenses));
    setRecentlyAdded((s) => expenses.slice(0, 3));
  }, [expenses]);

  // helpers
  function addExpense(exp) {
    // exp expected as object { id, name, cost, category, date }
    setExpenses((s) => [exp, ...s]);
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

  // aggregations
  const totalsByCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.cost || 0);
    return acc;
  }, {});

  const monthlyTrend = expenses.reduce((acc, e) => {
    const month = new Date(e.date).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + Number(e.cost || 0);
    return acc;
  }, {});

  const trendData = Object.entries(monthlyTrend).map(([month, total]) => ({ month, total }));

  const totalSpent = expenses.reduce((s, e) => s + Number(e.cost || 0), 0);
  const savingGoal = 200000;
  const progressPercent = Math.max(0, Math.min(100, Math.round((totalSpent / savingGoal) * 100)));

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
      console.error(err);
      setAiTips("⚠️ AI tip error — check API key or network.");
    } finally {
      setLoadingTips(false);
    }
  }

  // filtering for list
  const filteredExpenses = expenses.filter((e) => {
    const q = filter.trim().toLowerCase();
    const matchesQ = !q || e.name.toLowerCase().includes(q) || (e.category || "").toLowerCase().includes(q);
    if (!matchesQ) return false;
    if (timeFilter === "month") {
      return new Date(e.date).getMonth() === new Date().getMonth();
    } else if (timeFilter === "week") {
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(e.date) >= weekAgo;
    }
    return true;
  });

  // IntersectionObserver for reveal animations (add 'appear' class)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("appear");
            observer.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    const els = containerRef.current?.querySelectorAll(".reveal");
    if (els) els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // scroll to add
  function goToAdd() {
    const el = document.getElementById("addExpenseSection");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // styles (inline + small CSS below)
  const styles = {
    container: { fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial", color: PURPLE, maxWidth: 1200, margin: "0 auto", padding: 20, background: "#fff", minHeight: "100vh" },
    hero: { display: "flex", gap: 24, alignItems: "center", justifyContent: "space-between", padding: "32px", borderRadius: 16, background: GRADIENT, color: "#fff", flexWrap: "wrap" },
    heroText: { flex: "1 1 320px", minWidth: 280 },
    heroImageWrap: { flex: "0 0 220px", display: "flex", justifyContent: "center", alignItems: "center" },
    heroImage: { width: 200, height: 200, borderRadius: 14, objectFit: "cover", boxShadow: "0 8px 30px rgba(0,0,0,0.15)" },
    mainTitle: { margin: 0, fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1.05, textShadow: "0 6px 20px rgba(0,0,0,0.15)" },
    heroDesc: { marginTop: 10, fontSize: 15, color: "rgba(255,255,255,0.95)" },
    features: { marginTop: 16, listStyle: "none", padding: 0, display: "grid", gridTemplateColumns: "1fr", gap: 8 },
    cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginTop: 20 },
    addCard: { padding: 20, borderRadius: 12, background: PURPLE, color: "#fff", minHeight: 180 },
    quickCard: { padding: 20, borderRadius: 12, background: "#fff", color: PURPLE, minHeight: 180, boxShadow: "0 6px 18px rgba(107,43,255,0.06)" },
    summaryCard: { padding: 20, borderRadius: 12, background: "#fff", color: PURPLE, minHeight: 180, boxShadow: "0 6px 18px rgba(107,43,255,0.06)" },
    smallInput: { padding: "8px 10px", borderRadius: 8, border: `1px solid ${PURPLE}`, width: 150 },
    quickBtn: { padding: "10px 12px", borderRadius: 8, border: `1px solid ${PURPLE}`, background: "#fff", color: PURPLE, textAlign: "left", cursor: "pointer" },
    aiBtn: { padding: "10px 12px", borderRadius: 8, border: "none", background: "#fff", color: PURPLE, cursor: "pointer" },
    centerText: { textAlign: "center" },
  };

  return (
    <div ref={containerRef} style={styles.container}>
      {/* small CSS for animations / responsive */}
      <style>{`
        /* reveal animation */
        .reveal { opacity: 0; transform: translateY(12px); transition: opacity 520ms ease, transform 520ms ease; }
        .reveal.appear { opacity: 1; transform: translateY(0); }

        /* hover cards */
        .cardHover:hover { transform: translateY(-6px); box-shadow: 0 18px 40px rgba(99,66,255,0.12); transition: all 320ms ease; }

        /* small responsive: hero stacks on mobile with text first */
        @media (max-width: 800px) {
          .heroFlex { flex-direction: column; align-items: flex-start; }
          .heroImageMobile { order: 2; margin-top: 12px; }
        }

        /* subtle animated gradient shift on hero */
        .animatedGradient {
          background-size: 300% 300%;
          animation: gradientShift 8s ease infinite;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* buttons */
        .btnPrimary { background: #fff; color: ${PURPLE}; border-radius: 10px; padding: 10px 16px; border: none; cursor: pointer; font-weight: 600; }
        .btnPrimary:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(99,66,255,0.08); transition: all 220ms ease; }

        /* compact controls */
        .controlsRow { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; align-items:center; }
      `}</style>

      {/* toggle theme (kept but colors fixed to purple/white visually) */}
      <div style={{ position: "fixed", top: 16, right: 18, zIndex: 40 }}>
        <button
          aria-label="toggle theme"
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          style={{ background: "#fff", borderRadius: 10, padding: 8, border: `1px solid ${PURPLE}` }}
        >
          {theme === "light" ? <Moon size={16} color={PURPLE} /> : <Sun size={16} color={PURPLE} />}
        </button>
      </div>

      {/* HERO */}
      <section className={`heroFlex reveal animatedGradient`} style={{ ...styles.hero }}>
        <div style={styles.heroText}>
          <h1 style={styles.mainTitle}><Wallet size={20} style={{ verticalAlign: "middle", marginRight: 8 }} /> Family Budget Tracker</h1>
          <p style={styles.heroDesc}>Track expenses clearly, see monthly trends, and get AI suggestions to save smarter.</p>

          <ul style={styles.features}>
            <li style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ color: "#fff", fontWeight: 700 }}>➡</span> <span style={{ color: "rgba(255,255,255,0.95)" }}>Real-time expense tracking</span></li>
            <li style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ color: "#fff", fontWeight: 700 }}>➡</span> <span style={{ color: "rgba(255,255,255,0.95)" }}>Category & monthly breakdowns</span></li>
            <li style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ color: "#fff", fontWeight: 700 }}>➡</span> <span style={{ color: "rgba(255,255,255,0.95)" }}>Smart AI suggestions</span></li>
          </ul>

          <div style={{ marginTop: 18 }}>
            <button className="btnPrimary" onClick={goToAdd}>Start Tracking ➤</button>
          </div>

          {recentlyAdded && recentlyAdded.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <small style={{ color: "rgba(255,255,255,0.85)" }}>Recently added:</small>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {recentlyAdded.map((r) => (
                  <div key={r.id} style={{ background: "rgba(255,255,255,0.12)", color: "#fff", padding: "6px 8px", borderRadius: 8, fontSize: 13 }}>{r.name} • {r.cost}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="heroImageMobile" style={styles.heroImageWrap}>
          <img
            className="reveal"
            style={styles.heroImage}
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80"
            alt="finance illustration"
          />
        </div>
      </section>

      {/* Info table (centered) */}
      <section className="reveal" style={{ marginTop: 22, textAlign: "center" }}>
        <table style={{ width: "100%", maxWidth: 900, margin: "8px auto", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 10, color: PURPLE, borderBottom: `2px solid ${PURPLE}` }}>Feature</th>
              <th style={{ textAlign: "left", padding: 10, color: PURPLE, borderBottom: `2px solid ${PURPLE}` }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Add Expense", "Add a new expense with details (title, cost, category, date)."],
              ["Quick Add", "Add frequent expenses fast (preset templates)."],
              ["Spending Summary", "Total spent and progress toward saving goal."],
              ["AI Tips", "Get personalized suggestions from AI."],
              ["Monthly Trend", "Line chart of monthly spending."],
              ["Spending by Category", "Pie chart to visualize categories."],
              ["All Expenses", "Searchable, filterable expense list with edit/delete."]
            ].map(([a, b]) => (
              <tr key={a}>
                <td style={{ padding: 10, borderBottom: `1px dashed ${PURPLE}`, color: PURPLE }}>{a}</td>
                <td style={{ padding: 10, borderBottom: `1px dashed ${PURPLE}`, color: PURPLE }}>{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Add / Quick / Summary row */}
      <section className="reveal cardHover" style={{ ...styles.cardGrid, marginTop: 22 }}>
        {/* Add Expense (purple background) */}
        <div id="addExpenseSection" style={styles.addCard}>
          <h3 style={{ marginTop: 0, marginBottom: 8, color: "#fff" }}><Sparkles size={18} style={{ verticalAlign: "middle", marginRight: 8 }} /> Add Expense</h3>
          <div style={{ color: "#fff" }}>
            <ExpenseForm
              onAdd={(data) => {
                // Expect ExpenseForm to callback with object {id?, name, cost, category, date}
                // If it returns event, caller should adapt; we guard here:
                if (!data || typeof data.preventDefault === "function") return; // ignore raw event
                addExpense({ id: Date.now(), ...data, date: data.date || new Date().toISOString() });
              }}
            />
          </div>
        </div>

        {/* Quick Add (white background, 8 vertical) */}
        <div style={styles.quickCard}>
          <h3 style={{ marginTop: 0, marginBottom: 8, color: PURPLE }}><Sparkles size={18} style={{ verticalAlign: "middle", marginRight: 8 }} /> Quick Add</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {["Food","Transport","Rent","Groceries","Electricity","Internet","Entertainment","Health"].map((item, i) => (
              <button
                key={item}
                style={{ ...styles.quickBtn, display: "block", width: "100%", fontWeight: 600 }}
                onClick={() => quickAdd(item, (i + 1) * 100, item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Summary + AI */}
        <div style={styles.summaryCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, color: PURPLE }}><PieChart size={18} style={{ verticalAlign: "middle", marginRight: 8 }} /> Spending Summary</h3>
            <small style={{ color: PURPLE }}>{totalSpent.toLocaleString()} AFN</small>
          </div>

          <div style={{ marginTop: 12, background: "#fff", borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 12, color: PURPLE, marginBottom: 6 }}>Total Spent</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ height: 10, background: "#f4f2ff", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${progressPercent}%`, background: PURPLE, transition: "width 600ms ease" }} />
                </div>
                <div style={{ marginTop: 8, fontSize: 13, color: PURPLE }}>{progressPercent}% of goal ({savingGoal.toLocaleString()} AFN)</div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <button className="btnPrimary" onClick={askAITips} disabled={loadingTips}>
                {loadingTips ? "Thinking..." : "Get AI Saving Tips"}
              </button>
            </div>

            {aiTips && (
              <div style={{ marginTop: 12, padding: 10, borderRadius: 8, background: "#fff", color: PURPLE }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <Brain size={18} color={PURPLE} />
                  <div style={{ color: PURPLE }}>
                    <strong>AI Suggestions</strong>
                    <div style={{ marginTop: 6 }}>{aiTips}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Charts row */}
      <section className="reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 28 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
          <h4 style={{ margin: 0, color: PURPLE, display: "flex", alignItems: "center", gap: 8 }}><TrendingUp size={16} /> Monthly Spending Trend</h4>
          <div style={{ marginTop: 12, height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="month" stroke={PURPLE} />
                <YAxis stroke={PURPLE} />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke={PURPLE} strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
          <h4 style={{ margin: 0, color: PURPLE, display: "flex", alignItems: "center", gap: 8 }}><PieChart size={16} /> Spending by Category</h4>
          <div style={{ marginTop: 12, height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  isAnimationActive
                  data={Object.entries(totalsByCategory).map(([name, value]) => ({ name, value }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label
                >
                  {Object.entries(totalsByCategory).map((_[, __], idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* All expenses list */}
      <section className="reveal" style={{ marginTop: 28 }}>
        <div style={{ background: "#fff", padding: 16, borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <h3 style={{ margin: 0, color: PURPLE }}>All Expenses</h3>

            <div className="controlsRow" style={{ marginLeft: "auto" }}>
              <input
                placeholder="Search expenses..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ padding: "8px 10px", borderRadius: 8, border: `1px solid ${PURPLE}`, minWidth: 180 }}
              />
              <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} style={{ padding: "8px 10px", borderRadius: 8, border: `1px solid ${PURPLE}` }}>
                <option value="all">All time</option>
                <option value="month">This month</option>
                <option value="week">This week</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            {/* ExpenseList is an external component — ensure it accepts items,onDelete,onEdit props */}
            <ExpenseList items={filteredExpenses} onDelete={removeExpense} onEdit={editExpense} />
          </div>
        </div>
      </section>
    </div>
  );
                           }
