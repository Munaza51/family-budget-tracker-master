import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Essentials from "./pages/Essentials";
import About from "./pages/About";

export default function App() {
  return (
    <div className="app">
      <header className="nav">
        <h1>Family Budget & Essentials</h1>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/essentials">Essentials</Link>
          <Link to="/about">About</Link>
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
  );
}
