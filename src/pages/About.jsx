import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="about-section">
      <div className="about-content">
        <div className="about-text">
          <h2>💡 About Family Budget Tracker</h2>

          <h3>چی هست؟</h3>
          <p>
            <strong>Family Budget Tracker</strong> یک وب‌اپ ساده و مینیمال است برای ثبت مخارج روزمره،
            نمایش گزارشات بصری و دریافت نکات صرفه‌جویی با کمک هوش مصنوعی — مناسب خانواده‌ها و افراد.
          </p>

          <h3>چی ارائه می‌دهد؟</h3>
          <ul className="what-list">
            <li><strong>ثبت سریع هزینه:</strong> ورود آیتم، مبلغ، تاریخ و دسته‌بندی.</li>
            <li><strong>تحلیل بصری:</strong> چارت‌ها و خلاصه‌های قابل فهم برای صرفه‌جویی فوری.</li>
            <li><strong>پیشنهادات AI:</strong> نکات عملی برای کاهش هزینه‌ها و بودجه‌بندی بهتر.</li>
          </ul>

          <h3>چطور کار می‌کند؟</h3>
          <p>
            اطلاعات روی مرورگر ذخیره می‌شود (localStorage)؛ چارت‌ها از روی دیتا تولید می‌شوند و
            بخش AI بر اساس جمع‌بندی هزینه‌ها پیشنهاد می‌دهد.
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
                src="https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto/uploads/publication/logo/8bc7d876-e4c5-4710-854a-a23c0f231652/thumb_AI_Insights__800___800_px__1b.gif"
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

          <Link to="/" className="about-btn">Go to Dashboard</Link>

          <div className="contact-row">
            <h4>Contact</h4>
            <p>برای سوال یا نشان دادن بازخورد: </p>
            <div className="contact-links">
              <a href="https://instagram.com/your_username" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="mailto:youremail@example.com">Email</a>
            </div>
          </div>
        </div>

        <div className="about-images">
          <div className="image-card">
            <img
              src="https://static.vecteezy.com/system/resources/previews/041/172/859/original/family-planning-two-hands-intertwined-people-holding-hands-newborn-vector.jpg"
              alt="Family Planning"
            />
            <p>Family Planning</p>
          </div>
          <div className="image-card">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
              alt="Financial Teamwork"
            />
            <p>Financial Teamwork</p>
          </div>
          <div className="image-card">
            <img
              src="https://images.unsplash.com/photo-1587614382346-4ec70e388b28"
              alt="Budget Growth"
            />
            <p>Savings Plan</p>
          </div>
          <div className="image-card">
            <img
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0"
              alt="Smart Budgeting"
            />
            <p>Budget Growth</p>
          </div>
        </div>
      </div>

      <div className="about-tech">
        <h3>🧩 Tech Stack</h3>
        <div className="tech-icons">
          <span>⚛️ React</span>
          <span>🎨 Tailwind / CSS</span>
          <span>📦 localStorage</span>
          <span>🤖 AI</span>
        </div>
      </div>
    </div>
  );
}
