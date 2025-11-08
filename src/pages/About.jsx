import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRightCircle, Mail, Phone } from "lucide-react";
import "./index.css"; // مطمئن شو استایل‌ها در این فایل تعریف شده‌اند

export default function About() {
  const [activeInfo, setActiveInfo] = useState(null);

  const features = [
    {
      id: "expense",
      title: "Track Expenses",
      img: "https://www.freshbooks.com/wp-content/uploads/2022/02/expense-tracking.jpg",
      desc: "Log every expense easily with category, date, and item tracking.",
    },
    {
      id: "ai",
      title: "AI Saving Tips",
      img: "https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/publication/logo/8bc7d876-e4c5-4710-854a-a23c0f231652/thumb_AI_Insights800_800_px__1b.gif",
      desc: "Use AI to get personalized recommendations to save more efficiently.",
    },
    {
      id: "charts",
      title: "Visual Reports",
      img: "https://images.unsplash.com/photo-1556155092-490a1ba16284",
      desc: "Beautiful pie charts and summaries make your spending clear at a glance.",
    },
  ];

  return (
    <div className="about-section container dark-theme">
      {/* 🧠 Intro */}
      <header className="about-header tracky-style">
        <h1>💡 About Family Budget Tracker</h1>
        <p>
          <span className="highlight">Family Budget Tracker</span> is a modern web app designed to help families manage daily expenses, track essentials, and set smarter saving goals — all from one clean, visual dashboard.
        </p>
        <p>
          Built for the <strong>CodeWeekend Capstone</strong>, this project combines simplicity, data visualization, and AI assistance to bring clarity to your financial life.
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

      {/* 📞 Contact */}
      <section className="about-contact card gradient">
        <h3>📬 Contact Us</h3>
        <p>If you have questions, feedback, or want to collaborate, feel free to reach out:</p>
        <div className="contact-info">
          <p><Mail size={18} /> Email: support@familybudget.app</p>
          <p><Phone size={18} /> Phone: +93 700 000 000</p>
        </div>
        <Link to="/" className="about-btn">Go to Dashboard</Link>
      </section>
    </div>
  );
}
