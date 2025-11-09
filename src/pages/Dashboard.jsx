import React, { useEffect, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import SpendingPie from "../components/SpendingPie";
import { getBudgetTips } from "../ai/aiService";
import { Sparkles, Wallet, PieChart, Brain } from "lucide-react";

const LOCAL_KEY = "cw_expenses_v1";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [aiTips, setAiTips] = useState("");
  const [loadingTips, setLoadingTips] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    setExpenses(raw ? JSON.parse(raw) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(expenses));
  }, [expenses]);

  function addExpense(exp) {
    setExpenses((s) => [exp, ...s]);
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

  return (
    <div style={styles.container}>
      {/* 🖼️ Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroText}>
          <h1 style={styles.heroTitle}>
            <Wallet size={32} /> <span style={styles.mainColor}>Family Budget Tracker</span>
          </h1>
          <p style={styles.heroDesc}>
            Track your family's expenses effortlessly with a clean and modern dashboard. Stay
            informed, save smarter, and plan ahead confidently.
          </p>
          <ul style={styles.features}>
            <li>➡️ Real-time expense tracking</li>
            <li>➡️ Category & monthly breakdowns</li>
            <li>➡️ Smart insights to improve saving</li>
            <li>➡️ Fast, simple, organized — made for families</li>
          </ul>
        </div>
        <div style={styles.heroImageWrapper}>
          <img
            style={styles.heroImage}
            src="https://images.unsplash.com/photo-1604594849809-dfedbc827105?auto=format&fit=crop&w=800&q=60"
            alt="Budget Illustration"
          />
        </div>
      </div>

      {/* 💸 Add Expense + Summary */}
      <div style={styles.dashboardGrid}>
        <section style={{ ...styles.card, ...styles.gradientCard }}>
          <h2>
            <Sparkles size={20} /> Add Expense
          </h2>
          <ExpenseForm onAdd={addExpense} />
        </section>

        <section style={{ ...styles.card, ...styles.highlightCard }}>
          <h2>
            <PieChart size={20} /> Spending Summary
          </h2>
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
      </div>

      {/* 📊 Pie Chart */}
      <div style={{ ...styles.card, ...styles.fullCard }}>
        <h2>Spending by Category</h2>
        <SpendingPie data={totalsByCategory} />
      </div>

      {/* 📜 Expense List */}
      <div style={{ ...styles.card, ...styles.fullCard }}>
        <h2>All Expenses</h2>
        <ExpenseList items={expenses} onDelete={removeExpense} onEdit={editExpense} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    color: "#000",
  },
  mainColor: {
    color: "#4a2dff",
  },
  hero: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "1440px",
    margin: "0 auto",
    padding: "60px 40px",
    background: "linear-gradient(120deg, #ffffff, #f0f0ff)",
    borderRadius: "15px",
    gap: "30px",
    flexWrap: "wrap",
  },
  heroText: {
    flex: "1 1 500px",
    minWidth: "300px",
    textAlign: "left",
  },
  heroTitle: {
    fontSize: "3rem",
    marginBottom: "20px",
  },
  heroDesc: {
    fontSize: "1.1rem",
    lineHeight: "1.6",
    marginBottom: "20px",
  },
  features: {
    listStyle: "none",
    paddingLeft: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  heroImageWrapper: {
    flex: "1 1 400px",
    minWidth: "250px",
    display: "flex",
    justifyContent: "center",
  },
  heroImage: {
    width: "100%",
    maxWidth: "450px",
    height: "auto",
    borderRadius: "50% 40% 60% 50% / 50% 60% 40% 50%",
    objectFit: "cover",
    boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
  },
  dashboardGrid: {
    display: "grid",
    gap: "30px",
    marginTop: "50px",
    padding: "0 40px",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  },
  card: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
  gradientCard: {
    background: "linear-gradient(135deg, #4a2dff33, #ffffff)",
  },
  highlightCard: {
    background: "#f8f8ff",
  },
  summaryBox: {
    margin: "15px 0",
  },
  aiButton: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#4a2dff",
    color: "#fff",
    cursor: "pointer",
  },
  aiTips: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
    alignItems: "flex-start",
  },
  fullCard: {
    gridColumn: "1 / -1",
  },
};
