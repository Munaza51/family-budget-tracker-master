import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRightCircle,
  Github,
  Instagram,
  Linkedin,
} from "lucide-react";

import { SiBehance } from "react-icons/si";

export default function About() {
  const [activeInfo, setActiveInfo] = useState(null);

  const features = [
    {
      id: "expense",
      title: "Track Expenses",
      img: "https://share.google/images/mzUrIPsYflPw5wcsZ",
      desc: "Log your daily spending with categories, amounts, and smart tracking tools.",
    },
    {
      id: "ai",
      title: "AI Saving Tips",
      img: "https://share.google/images/WwkVx16TjGIJDpVGl",
      desc: "AI-powered insights suggest ways to optimize your expenses and boost savings.",
    },
    {
      id: "charts",
      title: "Visual Reports",
      img: "https://share.google/Nwxzux7s9femA0GOu",
      desc: "Clean visual graphs to help you understand your spending patterns instantly.",
    },
  ];

  return (
    <div className="about-section container dark-theme">
      {/* 🧠 Intro */}
      <header className="about-header tracky-style">
        <h1>💡 About Family Budget Tracker</h1>
        <p>
          <span className="highlight">Family Budget Tracker</span> is an easy,
          modern tool built to help families manage expenses, essentials,
          and savings in one clean interface.
        </p>
        <p className="dev-status">
          🚧 <strong>This application is currently under development.</strong>
        </p>
      </header>

      {/* 🎯 Feature Graph */}
      <section className="feature-graph">
        <div className="graph-center">
          <h2 className="graph-title">What It Offers</h2>
          <ArrowRightCircle className="arrow arrow-1" />
          <ArrowRightCircle className="arrow arrow-2" />
          <ArrowRightCircle className="arrow arrow-3" />
        </div>

        <div className="feature-cards">
          {features.map((f) => (
            <div
              key={f.id}
              className={`feature-card ${activeInfo === f.id ? "active" : ""}`}
              onClick={() => setActiveInfo(f.id)}
            >
              <img src={f.img} alt={f.title} />
              <h4>{f.title}</h4>
              {activeInfo === f.id && <p className="feature-desc">{f.desc}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* 💼 Essentials Info */}
      <section className="about-tech card highlight">
        <h3>🧺 Essentials</h3>
        <img
          src="https://share.google/wQaq4ztUlRPEDDNLz"
          alt="Essentials"
          className="essentials-img"
        />
        <p>
          The Essentials section allows you to quickly add urgent household
          items without needing to calculate prices. Perfect when you’re
          in a rush and simply want to list something before you forget.
        </p>
      </section>

      {/* 🔧 Tech Stack */}
      <section className="about-tech card highlight">
        <h3>🧩 Tech Stack</h3>
        <div className="tech-icons">
          <span>⚛️ React</span>
          <span>🎨 CSS</span>
          <span>📦 LocalStorage</span>
          <span>🤖 OpenAI</span>
        </div>
      </section>

      {/* 📱 Social Contact */}
      <section className="about-contact card gradient">
        <h3>📬 Connect With Us</h3>
        <p>Follow us on our social platforms for updates and new features:</p>

        <div className="contact-social">
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <Instagram size={24} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            <Linkedin size={24} />
          </a>
          <a href="https://behance.net" target="_blank" rel="noreferrer">
            <SiBehance size={24} />
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer">
            <Github size={24} />
          </a>
        </div>

        <Link to="/" className="about-btn">
          Go to Dashboard
        </Link>
      </section>
    </div>
  );
}
