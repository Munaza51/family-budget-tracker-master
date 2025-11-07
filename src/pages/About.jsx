
import React, { useState } from "react";
import { Link } from "react-router-dom";

const gallery = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    title: "Smart Budgeting",
    text: "Use simple entries and clear charts to spot saving opportunities."
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1556155092-490a1ba16284",
    title: "Track Every Expense",
    text: "Log items with category, date and amount — fast and mobile-friendly."
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28",
    title: "Plan Together",
    text: "Share takeaways and plan the family budget with confidence."
  }
];

export default function About() {
  const [active, setActive] = useState(null);

  return (
    <div className="about-section">
      <div className="about-content">
        <div className="about-text">
          <h2>About Family Budget Tracker</h2>

          <h3>What is it?</h3>
          <p>
            Family Budget Tracker is a lightweight web app that helps families track daily expenses,
            view visual reports, and keep finances organized — designed to be fast, local-first,
            and easy to use.
          </p>

          <h3>What it offers</h3>
          <ul>
            <li>Quick expense entry (category, amount, date)</li>
            <li>Visual summaries and charts</li>
            <li>Simple local storage — you control your data</li>
          </ul>

          <Link to="/" className="about-btn">Back to Dashboard</Link>

          <div className="contact-row">
            <h4>Contact</h4>
            <p>Questions or feedback? Reach out:</p>
            <div className="contact-links">
              <a href="https://instagram.com/your_username" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="mailto:youremail@example.com">Email</a>
            </div>
          </div>
        </div>

        <div className="about-gallery">
          {gallery.map((g) => (
            <div
              key={g.id}
              className={`gallery-card ${active === g.id ? "active" : ""}`}
              onClick={() => setActive(active === g.id ? null : g.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter") setActive(active === g.id ? null : g.id); }}
              aria-pressed={active === g.id}
            >
              <img src={g.src + "?auto=format&fit=crop&w=800&q=60"} alt={g.title} />
              <div className="overlay">
                <h4>{g.title}</h4>
                <p>{g.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="about-tech">
        <h3>Tech</h3>
        <div className="tech-icons">
          <span>React</span>
          <span>localStorage</span>
          <span>SVG & CSS</span>
        </div>
      </div>
    </div>
  );
}
