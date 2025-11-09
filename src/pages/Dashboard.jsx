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

  // Inline CSS styles
  const styles = {
    container: {
      fontFamily: "'Poppins', sans-serif",
      color: "#000",
      maxWidth: "1440px",
      margin: "auto",
      padding: "0 20px",
    },
    hero: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      margin: "50px 0",
      gap: "20px",
    },
    heroText: {
      flex: 1,
      paddingRight: "40px",
    },
    mainTitle: {
      fontSize: "3.5rem",
      color: "#4a2dff", // بنفش
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
      gap: "12px",
    },
    featureItem: {
      display: "flex",
      alignItems: "center",
      fontSize: "1rem",
    },
    featureArrow: {
      color: "#4a2dff",
      fontWeight: "bold",
      marginRight: "10px",
    },
    heroImageContainer: {
      flex: 1,
      display: "flex",
      justifyContent: "flex-end",
    },
    heroImage: {
      width: "350px",
      height: "350px",
      borderRadius: "50%",
      objectFit: "cover",
      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    },
    cardGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "20px",
      marginBottom: "40px",
    },
    card: {
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
      background: "linear-gradient(145deg, #eef2ff, #ffffff)",
    },
    summaryBox: {
      backgroundColor: "#f5f5f5",
      padding: "15px",
      borderRadius: "10px",
      marginBottom: "15px",
      textAlign: "center",
    },
    aiTips: {
      display: "flex",
      alignItems: "flex-start",
      gap: "10px",
      backgroundColor: "#eef2ff",
      padding: "10px",
      borderRadius: "8px",
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.container}>
      {/* 🖼️ Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroText}>
          <h1 style={styles.mainTitle}>
            <Wallet size={36} /> Family Budget Tracker
          </h1>
          <p style={styles.heroDesc}>
            A clean, modern way to understand your money — track smarter, save
            confidently, and plan effortlessly with beautiful visual insights.
          </p>
          <ul style={styles.features}>
            <li style={styles.featureItem}>
              <span style={styles.featureArrow}>➡</span>Real-time expense tracking
            </li>
            <li style={styles.featureItem}>
              <span style={styles.featureArrow}>➡</span>Category & monthly breakdowns
            </li>
            <li style={styles.featureItem}>
              <span style={styles.featureArrow}>➡</span>Smart insights to improve saving
            </li>
            <li style={styles.featureItem}>
              <span style={styles.featureArrow}>➡</span>Fast, simple, organized — made for families
            </li>
          </ul>
        </div>
        <div style={styles.heroImageContainer}>
          <img
            style={styles.heroImage}
            src="https://images.unsplash.com/photo-1604594849809-dfedbc827105?auto=format&fit=crop&w=800&q=60"
            alt="budget-hero"
          />
        </div>
      </div>

      {/* 💸 Add Expense + Summary */}
      <div style={styles.cardGrid}>
        <section style={styles.card}>
          <h2>
            <Sparkles size={20} /> Add Expense
          </h2>
          <ExpenseForm onAdd={addExpense} />
        </section>

        <section style={styles.card}>
          <h2>
            <PieChart size={20} /> Spending Summary
          </h2>
          <div style={styles.summaryBox}>
            <p>Total Spent:</p>
            <h1>{totalSpent.toLocaleString()} AFN</h1>
          </div>
          <button onClick={askAITips} disabled={loadingTips}>
            {loadingTips ? "🤔 Thinking..." : "Get AI Saving Tips"}
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
      <div style={styles.card}>
        <h2>Spending by Category</h2>
        <SpendingPie data={totalsByCategory} />
      </div>

      {/* 📜 Expense List */}
      <div style={styles.card}>
        <h2>All Expenses</h2>
        <ExpenseList
          items={expenses}
          onDelete={removeExpense}
          onEdit={editExpense}
        />
      </div>
    </div>
  );
}
