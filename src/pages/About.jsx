import React, { useState } from "react";
import { ArrowRightCircle, Mail, Phone, DollarSign, CheckCircle2, Lightbulb } from "lucide-react";

export default function AboutDashboard() {
  const [activeFeature, setActiveFeature] = useState(null);

  const features = [
    {
      id: "expense",
      title: "Track Expenses",
      img: "https://images.unsplash.com/photo-1556155092-490a1ba16284",
      desc: "Log every expense easily with category, date, and item tracking. Stay organized and never miss a payment.",
    },
    {
      id: "ai",
      title: "AI Saving Tips",
      img: "https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/publication/logo/8bc7d876-e4c5-4710-854a-a23c0f231652/thumb_AI_Insights800_800_px__1b.gif",
      desc: "Use AI to get personalized recommendations to save more efficiently. Smart suggestions help you spend wisely.",
    },
    {
      id: "reports",
      title: "Visual Reports",
      img: "https://images.unsplash.com/photo-1581093588401-69d9f20224f0",
      desc: "Beautiful charts and summaries make your spending clear at a glance. Understand where your money goes.",
    },
    {
      id: "essentials",
      title: "Essentials Tracker",
      img: "https://images.unsplash.com/photo-1586201375761-83865001e0e4",
      desc: "Track household essentials, mark items as bought, or quickly add new necessities. Keep your family organized.",
    },
    {
      id: "quickAdd",
      title: "Quick Add Suggestions",
      img: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
      desc: "Pre-made essential items for quick adding. Click and add instantly to your checklist without typing.",
    },
    {
      id: "incomeSavings",
      title: "Income & Savings",
      img: "https://images.unsplash.com/photo-1601597113937-4b1c2e89a004",
      desc: "Track your monthly income and savings. Set goals and see progress directly on your dashboard.",
    },
  ];

  const styles = {
    container: {
      fontFamily: "'Poppins', sans-serif",
      maxWidth: "1200px",
      margin: "auto",
      padding: "24px",
    },
    header: { marginBottom: "32px" },
    title: { fontSize: "2rem", fontWeight: 700, color: "#7c3aed", marginBottom: "12px" },
    subtitle: { color: "#444", lineHeight: 1.6, fontSize: "1rem" },
    grid: {
      display: "grid",
      gap: "24px",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      marginTop: "24px",
    },
    card: {
      background: "#fff",
      borderRadius: "16px",
      padding: "20px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
      cursor: "pointer",
      transition: "0.2s",
    },
    cardImg: { width: "100%", height: "160px", objectFit: "cover", borderRadius: "12px", marginBottom: "12px" },
    cardTitle: { fontSize: "1.1rem", fontWeight: 600, color: "#7c3aed", marginBottom: "8px" },
    cardDesc: { fontSize: "0.95rem", color: "#555", lineHeight: 1.5 },
    contactCard: { background: "#7c3aed", color: "#fff", padding: "20px", borderRadius: "16px", textAlign: "center" },
    contactBtn: {
      background: "#fff",
      color: "#7c3aed",
      border: "none",
      padding: "10px 18px",
      borderRadius: "8px",
      cursor: "pointer",
      marginTop: "12px",
      fontWeight: 600,
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>💡 About Family Budget Tracker</h1>
        <p style={styles.subtitle}>
          Family Budget Tracker is a modern web app to help families manage daily expenses, track essentials, and set smart saving goals.
          Everything is visual, simple, and interactive—designed to make financial management stress-free.
        </p>
      </header>

      {/* Features */}
      <section style={styles.grid}>
        {features.map((f) => (
          <div
            key={f.id}
            style={styles.card}
            onClick={() => setActiveFeature(f.id)}
          >
            <img src={f.img} alt={f.title} style={styles.cardImg} />
            <h3 style={styles.cardTitle}>{f.title}</h3>
            {activeFeature === f.id && <p style={styles.cardDesc}>{f.desc}</p>}
          </div>
        ))}
      </section>

      {/* Tech Stack */}
      <section style={{ ...styles.grid, marginTop: "40px" }}>
        <div style={{ ...styles.card, textAlign: "center" }}>
          <h3 style={styles.cardTitle}>🧩 Tech Stack</h3>
          <p style={styles.cardDesc}>
            React, CSS, LocalStorage, OpenAI API
          </p>
        </div>
      </section>

      {/* Contact */}
      <section style={{ marginTop: "40px" }}>
        <div style={styles.contactCard}>
          <h3>📬 Contact Us</h3>
          <p>If you have questions, feedback, or want to collaborate, reach out:</p>
          <p><Mail size={18} /> support@familybudget.app</p>
          <p><Phone size={18} /> +93 700 000 000</p>
          <button style={styles.contactBtn}>Go to Dashboard</button>
        </div>
      </section>
    </div>
  );
}
