"use client";
import { useEffect, useRef, useState } from "react";

const FEATURES = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/>
      </svg>
    ),
    title: 'מאושר גפ"ן',
    desc: "רכישה ישירה למוסדות חינוך",
    color: "#16a34a", bg: "#f0fdf4",
    from: "bottom",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>
      </svg>
    ),
    title: "מעל עשור בתחום",
    desc: "10 שנים של הפעלות וניסיון מקצועי בשטח",
    color: "#b45309", bg: "#fefce8",
    from: "bottom",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l19-9-9 19-2-8-8-2z"/>
      </svg>
    ),
    title: "פריסה ארצית מלאה",
    desc: "מגיעים עם כל הציוד לכל נקודה בארץ",
    color: "#2563EB", bg: "#eff6ff",
    from: "bottom",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: "מומלץ אנשי חינוך",
    desc: "מאות רכזים ומנהלים כבר חתומים על ההצלחה",
    color: "#CC2222", bg: "#fef2f2",
    from: "bottom",
  },
];

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.25 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const delay = index * 0.13;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Divider */}
      {index > 0 && (
        <div style={{ position: "absolute", right: 0, top: "20%", bottom: "20%", width: 1, background: "#e5e7eb" }} />
      )}

      <div style={{
        display: "flex", alignItems: "flex-start", gap: 14,
        padding: "1.75rem 1.5rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.96)",
        transition: `opacity 0.55s ease ${delay}s, transform 0.55s cubic-bezier(0.34,1.3,0.64,1) ${delay}s`,
      }}>
        {/* Icon box */}
        <div style={{
          width: 50, height: 50, borderRadius: 4, flexShrink: 0,
          background: feature.bg, color: feature.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${feature.color}25`,
          opacity: visible ? 1 : 0,
          transform: visible ? "rotate(0deg) scale(1)" : "rotate(-15deg) scale(0.7)",
          transition: `opacity 0.4s ease ${delay + 0.1}s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay + 0.1}s`,
        }}>
          {feature.icon}
        </div>

        <div>
          <div style={{
            fontSize: 15, fontWeight: 800, color: "#0F172A", marginBottom: 4,
            opacity: visible ? 1 : 0,
            transition: `opacity 0.4s ease ${delay + 0.2}s`,
          }}>
            {feature.title}
          </div>
          <div style={{
            fontSize: 13, color: "#64748b", lineHeight: 1.6,
            opacity: visible ? 1 : 0,
            transition: `opacity 0.4s ease ${delay + 0.3}s`,
          }}>
            {feature.desc}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturesBanner() {
  return (
    <section style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", borderTop: "1px solid #e5e7eb" }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(4,1fr)",
      }} className="features-grid">
        {FEATURES.map((f, i) => <FeatureCard key={i} feature={f} index={i} />)}
      </div>
      <style>{`
        @media(max-width:768px){.features-grid{grid-template-columns:1fr 1fr !important}}
        @media(max-width:480px){.features-grid{grid-template-columns:1fr !important}}
      `}</style>
    </section>
  );
}
