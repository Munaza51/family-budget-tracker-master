import React from "react"; import { Routes, Route, Link } from "react-router-dom"; import Dashboard from "./pages/Dashboard"; import Essentials from "./pages/Essentials"; import About from "./pages/About";

export default function App() { return ( <div className="app"> {/* ✅ CSS مستقیم داخل App.js */} <style>{` :root { --main-color: #4a2dff; --text-color: #000; --light-color: #fff; }

.nav {
      width: 100%;
      background: var(--light-color);
      padding: 20px 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 8px #00000015;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav h1 {
      font-size: 22px;
      color: var(--main-color);
      font-weight: 700;
    }

    .nav nav {
      display: flex;
      gap: 30px;
    }

    .nav a {
      color: var(--text-color);
      font-size: 15px;
      text-decoration: none;
      font-weight: 500;
      padding-bottom: 4px;
      transition: 0.3s ease;
    }

    .nav a:hover {
      color: var(--main-color);
    }

    .active {
      color: var(--main-color) !important;
      border-bottom: 2px solid var(--main-color);
    }

    @media (max-width: 700px) {
      .nav {
        padding: 15px 25px;
      }

      .nav h1 {
        font-size: 18px;
      }

      .nav nav {
        gap: 15px;
      }

      .nav a {
        font-size: 14px;
      }
    }
  `}</style>

  <header className="nav">
    <h1>Family Budget & Essentials</h1>
    <nav>
      <Link to="/" className={({ isActive }) => (isActive ? "active" : "")}>Dashboard</Link>
      <Link to="/essentials" className={({ isActive }) => (isActive ? "active" : "")}>Essentials</Link>
      <Link to="/about" className={({ isActive }) => (isActive ? "active" : "")}>About</Link>
    </nav>
  </header>

  <main>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/essentials" element={<Essentials />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </main>

  <footer className="footer">
    <small>Built for CodeWeekend Capstone — keep it simple, finish strong</small>
  </footer>
</div>

); }
