import React, { useEffect, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import SpendingPie from "../components/SpendingPie";
import { getBudgetTips } from "../ai/aiService";
import { Sparkles, Wallet, PieChart, Brain } from "lucide-react";

const LOCAL_KEY = "cw_expenses_v1";
const PURPLE = "#8b5cf6"; // رنگ بنفش
const LIGHT_PURPLE = "#d8b3ff"; // بنفش روشن

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

  // استایل‌ها
  const styles = {
    container: {
      fontFamily: "'Poppins', sans-serif",
      color: "#000",
      maxWidth: "1440px",
      margin: "auto",
      padding: "0 20px",
      backgroundColor: "#f8f9fa", // رنگ مایل به سفید برای همه بخش‌ها
    },
    hero: {
      display: "flex",
      flexDirection: "column",
      textAlign: "left", // متن از سمت چپ
      alignItems: "flex-start",
      gap: "20px",
      margin: "60px 0",
      padding: "40px 20px",
      borderRadius: "20px",
      backgroundColor: "#ffffff", // هیرو هم روشن، بدون گرادینت
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
    },
    heroText: {
      flex: "1 1 400px",
      minWidth: "280px",
      marginLeft: "20px", // فاصله از لبه چپ
    },
    mainTitle: {
      fontSize: "3rem",
      color: PURPLE,
      marginBottom: "20px",
      fontWeight: "bold",
      letterSpacing: "-0.5px",
    },
    heroDesc: {
      fontSize: "1.2rem",
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
      color: PURPLE,
      fontWeight: "bold",
      marginRight: "10px",
    },
    cardGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "20px",
      marginBottom: "40px",
    },
    card: {
      padding: "25px",
      borderRadius: "12px",
      boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
      background: "#ffffff",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    addExpenseCard: {
      background: PURPLE,
      color: "#fff",
      transition: "background 0.3s ease",
    },
    summaryBox: {
      backgroundColor: "#fff",
      padding: "15px",
      borderRadius: "10px",
      marginBottom: "15px",
      textAlign: "center",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
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
      padding: "10px 15px",
      borderRadius: "6px",
      cursor: "pointer",
      marginTop: "10px",
      transition: "background 0.3s ease",
    },
    sectionMargin: {
      marginTop: "40px",
    },
    // ریسپانسیو
    "@media (max-width: 768px)": {
      hero: {
        textAlign: "center",
        alignItems: "center",
      },
      heroText: {
        marginLeft: 0,
      },
      mainTitle: {
        fontSize: "2rem",
      },
      heroDesc: {
        fontSize: "1rem",
      },
    },
  };

  return (
    <div style={styles.container}>
      {/* هیرو */}
      <div style={styles.hero}>
        <div style={styles.heroText}>
          <h1 style={styles.mainTitle}>
            <Wallet size={36} /> Family Budget Tracker
          </h1>
          <p style={styles.heroDesc}>
            A clean, modern way to understand your money. track smarter, save
            confidently, and plan effortlessly with beautiful visual insights.
          </p>
          <ul style={styles.features}>
            <li style={styles.featureItem}>
              <span style={styles.featureArrow}>➡</span>Real time expense tracking
            </li>
            <li style={styles.featureItem}>
              <span style={styles.featureArrow}>➡</span>Category & monthly breakdowns
            </li>
            <li style={styles.featureItem}>
              <span style={styles.featureArrow}>➡</span>Smart insights to improve saving
            </li>
            <li style={styles.featureItem}>
              <span style={styles.featureArrow}>➡</span>Fast, simple, organized; made for families
            </li>
          </ul>
        </div>
      </div>

      {/* Add Expense + Summary */}
      <div style={styles.cardGrid}>
        <section style={{ ...styles.card, ...styles.addExpenseCard }}>
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
          <button
            style={styles.aiButton}
            onClick={askAITips}
            disabled={loadingTips}
            onMouseEnter={(e) => (e.target.style.backgroundColor = LIGHT_PURPLE)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = PURPLE)}
          >
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

      {/* Pie Chart */}
      <div style={{ ...styles.card, ...styles.sectionMargin }}>
        <h2>Spending by Category</h2>
        <SpendingPie data={totalsByCategory} />
      </div>

      {/* Expense List */}
      <div style={{ ...styles.card, ...styles.sectionMargin }}>
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
