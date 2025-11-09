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
    } finally {
      setLoadingTips(false);
    }
  }

  const totalSpent = expenses.reduce((s, e) => s + Number(e.cost), 0);

  return (
    <div className="dashboard-page container">

      {/* ✅ CSS — اضافه شده داخل فایل */}
      <style>{`
        :root {
          --main-color:#4a2dff;
          --text-color:#000;
          --light-color:#fff;
        }

        .dashboard-hero {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 40px;
          padding: 60px 40px;
          border-radius: 20px;
          background: linear-gradient(135deg, #fff 0%, #f4f3ff 100%);
          box-shadow: 0 4px 18px #00000020;
          margin-bottom: 40px;
        }

        .dashboard-hero .text {
          flex: 1;
        }

        .dashboard-hero h1 {
          font-size: 2.4rem;
          font-weight: 700;
          color: var(--main-color);
          margin-bottom: 10px;
          position: relative;
        }

        .dashboard-hero h1::before {
          content: "";
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 55%;
          height: 12px;
          background-color: #4a2dff33;
          clip-path: polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%);
          z-index: -1;
        }

        .dashboard-hero p {
          color: #444;
          font-size: 15px;
          margin-bottom: 15px;
          line-height: 1.6;
        }

        .dashboard-hero .features {
          font-size: 14px;
          background: #f6f3ff;
          padding: 12px 15px;
          border-left: 4px solid var(--main-color);
          border-radius: 6px;
          color: #333;
        }

        .dashboard-hero .hero-img {
          width: 340px;
          height: 260px;
          object-fit: cover;
          border-radius: 18px;
          box-shadow: 0 4px 12px #00000025;
        }

        /* ✅ Mobile */
        @media(max-width: 900px) {
          .dashboard-hero {
            flex-direction: column;
            text-align: center;
            padding: 30px 20px;
          }
          .dashboard-hero h1::before {
            left: 50%;
            transform: translateX(-50%);
            width: 70%;
          }
          .dashboard-hero .hero-img {
            width: 100%;
            height: auto;
            margin-top: 15px;
          }
        }
      `}</style>

      {/* 🖼️ Hero Section */}
      <div className="dashboard-hero">
        <div className="text">
          <h1>
            <Wallet size={38} /> Family Budget Tracker
          </h1>

          <p>
            A clean, modern way to understand your money — track smarter, 
            save confidently, and plan effortlessly with beautiful visual insights.
          </p>

          <p className="features">
            ✅ Real-time expense tracking <br />
            ✅ Category & monthly breakdowns <br />
            ✅ Smart insights to improve saving <br />
            ✅ Fast, simple, organized — made for families
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
        <ExpenseList items={expenses} onDelete={removeExpense} onEdit={editExpense} />
      </div>
    </div>
  );
      }
