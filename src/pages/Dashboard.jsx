
import React, { useEffect, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import SpendingPie from "../components/SpendingPie";
import { Wallet, PieChart, Sparkles } from "lucide-react";

const LOCAL_KEY = "cw_expenses_v1";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);

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
    acc[e.category] = (acc[e.category] || 0) + Number(e.cost || 0);
    return acc;
  }, {});

  const totalSpent = expenses.reduce((s, e) => s + Number(e.cost || 0), 0);

  return (
    <div className="dashboard-page container">
      {/* HERO */}
      <header className="hero-visual" role="banner" aria-label="Hero: Family Budget Tracker">
        <div className="hero-left">
          <h1 className="hero-title">
            <Wallet size={32} /> Family Budget Tracker
          </h1>
          <p className="hero-lead">
            Keep family finances clear — quick entries, smart visuals, and meaningful insights.
          </p>

          <ul className="hero-badges" aria-hidden>
            <li className="badge">
              <Sparkles size={16} /> Fast entry
            </li>
            <li className="badge">
              <PieChart size={16} /> Clear charts
            </li>
            <li className="badge">
              💾 Local-first
            </li>
          </ul>

          <div className="hero-actions">
            <a href="#add-expense" className="btn primary">Add Expense</a>
            <a href="#all-expenses" className="btn ghost">View All</a>
          </div>
        </div>

        <div className="hero-art">
          {/* decorative graphic — pure CSS + svg for crisp designer look */}
          <svg viewBox="0 0 600 360" className="hero-svg" preserveAspectRatio="xMidYMid meet" aria-hidden>
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0" stopColor="#6366f1" />
                <stop offset="1" stopColor="#60a5fa" />
              </linearGradient>
            </defs>

            <rect x="20" y="20" rx="20" ry="20" width="560" height="320" fill="url(#g1)" opacity="0.12" />
            <g transform="translate(40,40)">
              <rect x="0" y="0" width="220" height="120" rx="12" fill="#fff" opacity="0.95" />
              <rect x="240" y="0" width="220" height="190" rx="12" fill="#fff" opacity="0.95" />
              <rect x="0" y="140" width="460" height="100" rx="12" fill="#fff" opacity="0.95" />
              {/* simple bars to suggest chart */}
              <g transform="translate(8,160)">
                <rect x="8" y="-40" width="20" height="40" rx="3" fill="#6366f1" />
                <rect x="40" y="-60" width="20" height="60" rx="3" fill="#4f46e5" />
                <rect x="72" y="-30" width="20" height="30" rx="3" fill="#60a5fa" />
                <rect x="104" y="-80" width="20" height="80" rx="3" fill="#22c55e" />
              </g>
            </g>
          </svg>
        </div>
      </header>

      {/* MAIN GRID */}
      <div className="row dashboard-grid">
        <section id="add-expense" className="card">
          <h2>
            <Sparkles size={18} /> Add Expense
          </h2>
          {/* keep the form component you already made — the visual CSS will match */}
          <ExpenseForm onAdd={addExpense} />
        </section>

        <section className="card highlight">
          <h2>
            <PieChart size={18} /> Spending Summary
          </h2>

          <div className="summary-box">
            <p className="muted">Total Spent</p>
            <h3>{totalSpent.toLocaleString()} AFN</h3>
          </div>

          <div className="summary-cats">
            {Object.keys(totalsByCategory).length === 0 ? (
              <p className="muted">No spending yet — add an expense to begin.</p>
            ) : (
              <ul>
                {Object.entries(totalsByCategory).map(([cat, val]) => (
                  <li key={cat}>
                    <strong>{cat}</strong> — {Number(val).toLocaleString()} AFN
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      {/* PIE CHART */}
      <div className="card full chart-card">
        <h2>Spending by Category</h2>
        <SpendingPie data={totalsByCategory} />
      </div>

      {/* EXPENSE LIST */}
      <div id="all-expenses" className="card full expense-list-card">
        <h2>All Expenses</h2>
        <ExpenseList items={expenses} onDelete={removeExpense} onEdit={editExpense} />
      </div>
    </div>
  );
}
