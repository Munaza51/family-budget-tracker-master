import React from "react";

export default function About() {
  return (
    <div className="about-section">
      <div className="about-content">
        <div className="about-text">
          <h2>💡 About Family Budget Tracker</h2>
          <p>
            <span className="highlight">Family Budget Tracker</span> is a modern web app designed
            to help families manage daily expenses, track essentials, and set smarter
            saving goals. all from one clean, visual dashboard.
          </p>
          <p>
            Built for the <strong>CodeWeekend Capstone</strong>, this project combines
            simplicity, data visualization, and AI assistance to bring clarity to your
            financial life.
          </p>

          <div className="app-highlights">
            <div className="highlight-card">
              <img
                src="https://www.freshbooks.com/wp-content/uploads/2022/02/expense-tracking.jpg"
                alt="Expense Tracking"
              />
              <h4>Track Expenses</h4>
              <p>Log every expense easily with category, date, and item tracking.</p>
            </div>

            <div className="highlight-card">
              <img
                src="https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/publication/logo/8bc7d876-e4c5-4710-854a-a23c0f231652/thumb_AI_Insights__800___800_px__1b.gif"
                alt="AI Insights"
              />
              <h4>AI Saving Tips</h4>
              <p>Use AI to get personalized recommendations to save more efficiently.</p>
            </div>

            <div className="highlight-card">
              <img
                src="https://images.unsplash.com/photo-1556155092-490a1ba16284"
                alt="Charts and Analytics"
              />
              <h4>Visual Reports</h4>
              <p>Beautiful pie charts and summaries make your spending clear at a glance.</p>
            </div>
          </div>

          <a href="/dashboard" className="about-btn">Go to Dashboard</a>
        </div>

        <div className="about-images">
          <img
            src="https://static.vecteezy.com/system/resources/previews/041/172/859/original/family-planning-two-hands-intertwined-people-holding-hands-newborn-vector.jpg"
            alt="Family Planning"
          />
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            alt="Financial Teamwork"
          />
          <img
            src="https://tse2.mm.bing.net/th/id/OIP.8O84QMk41JpKTUBFnaXxPAHaE8?pid=Api&P=0&h=220"
            alt="Savings Plan"
          />
          <img
            src="https://images.unsplash.com/photo-1587614382346-4ec70e388b28"
            alt="Budget Growth"
          />
        </div>
      </div>

      <div className="about-tech">
        <h3>🧩 Tech Stack</h3>
        <ul>
          <li>⚛️ React + Vite</li>
          <li>🎨 Modern CSS (custom properties, gradients, glassmorphism)</li>
          <li>📦 LocalStorage for data persistence</li>
          <li>🤖 AI API for savings tips</li>
        </ul>
      </div>
    </div>
  );
}
