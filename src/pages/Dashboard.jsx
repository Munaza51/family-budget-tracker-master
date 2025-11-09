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
    <div className="dashboard-page container">
      {/* 🖼️ Hero Section */}
      <div className="dashboard-hero hero">
        <div className="main-title text">
          <h1 className="h1">
            <Wallet size={38} /> Family Budget Tracker
          </h1>
          <p>
            A clean, modern way to understand your money — track smarter, save
            confidently, and plan effortlessly with beautiful visual insights.
          </p>

          <p className="features">
            <span className="feature-item">Real-time expense tracking</span>
            <span className="feature-item">Category & monthly breakdowns</span>
            <span className="feature-item">Smart insights to improve saving</span>
            <span className="feature-item">
              Fast, simple, organized — made for families
            </span>
          </p>
        </div>
      </div>

      {/* 💸 Add Expense + Summary */}
      <div className="row dashboard-grid">
        <section className="card gradient">
          <h2>
            <Sparkles size={20} /> Add Expense
          </h2>
          <ExpenseForm onAdd={addExpense} />
        </section>

        <section className="card highlight">
          <h2>
            <PieChart size={20} /> Spending Summary
          </h2>
          <div className="summary-box">
            <p>Total Spent:</p>
            <h1>{totalSpent.toLocaleString()} AFN</h1>
          </div>
          <button onClick={askAITips} disabled={loadingTips}>
            {loadingTips ? "🤔 Thinking..." : "🧠 Get AI Saving Tips"}
          </button>

          {aiTips && (
            <div className="ai-tips">
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
      <div className="card full chart-card">
        <h2>Spending by Category</h2>
        <SpendingPie data={totalsByCategory} />
      </div>

      {/* 📜 Expense List */}
      <div className="card full expense-list-card">
        <h2>All Expenses</h2>
        <ExpenseList
          items={expenses}
          onDelete={removeExpense}
          onEdit={editExpense}
        />
      </div>

      {/* ===== CSS ===== */}
      <style jsx>{`
        :root {
          --main-color: #4a2dff; /* بنفش */
          --text-color: #000; /* مشکی */
          --light-color: #fff;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }

        .hero {
          position: relative;
          max-width: 1440px;
          margin: auto;
          padding: 75px 2rem;
          display: flex;
          justify-content: flex-start; /* چپ چین */
          flex-direction: column;
          background: linear-gradient(135deg, #f7f7ff 0%, #ffffff 100%);
          border-radius: 12px;
          animation: gradientShift 10s ease infinite alternate;
        }

        @keyframes gradientShift {
          0% {
            background: linear-gradient(135deg, #f7f7ff 0%, #ffffff 100%);
          }
          50% {
            background: linear-gradient(135deg, #e6e6ff 0%, #ffffff 100%);
          }
          100% {
            background: linear-gradient(135deg, #f7f7ff 0%, #ffffff 100%);
          }
        }

        .main-title {
          max-width: 600px;
          color: var(--text-color);
          padding-left: 1rem;
        }

        .h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: var(--main-color); /* تیتر اصلی بنفش */
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 20px;
          font-size: 1.1rem;
          color: var(--text-color); /* بقیه متن مشکی */
        }

        .feature-item {
          position: relative;
          padding-left: 25px;
          line-height: 1.5;
        }

        .feature-item::before {
          content: "➤";
          position: absolute;
          left: 0;
          color: var(--main-color);
          font-weight: bold;
        }

        /* Responsive */
        @media (max-width: 1080px) {
          .h1 {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 900px) {
          .hero {
            padding: 2rem 1rem;
          }
          .h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
