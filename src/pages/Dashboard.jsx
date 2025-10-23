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
      <div className="dashboard-hero">
        <div className="text">
          <h1>
            <Wallet size={30} /> Family Budget Tracker
          </h1>
          <p>
            Smart tracking, visual insights, and AI-powered saving tips to keep your
            household budget balanced and stress-free.
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
    </div>
  );
}
