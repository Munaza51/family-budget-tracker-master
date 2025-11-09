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
        <img
          src="https://images.unsplash.com/photo-1604594849809-dfedbc827105?auto=format&fit=crop&w=1200&q=60"
          alt="budget"
          className="hero-img"
        />
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
          --main-color: #4a2dff;
          --text-color: #000;
          --light-color: #fff;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }

        a {
          text-decoration: none;
        }

        .hero {
          position: relative;
          max-width: 1440px;
          margin: auto;
          padding: 75px 75px 75px 0px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .hero-img {
          width: 625px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          z-index: -1;
        }

        .main-title {
          max-width: 600px;
        }

        .h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: var(--main-color);
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 20px;
          font-size: 1.1rem;
          color: var(--main-color);
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
          .hero-img {
            width: 500px;
          }
        }

        @media (max-width: 900px) {
          .hero {
            flex-direction: column;
            padding: 2rem;
          }
          .hero-img {
            width: 100%;
          }
          .main-title {
            max-width: 100%;
          }
          .h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
