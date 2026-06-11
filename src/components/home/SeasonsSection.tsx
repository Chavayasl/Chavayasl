"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const SEASONS = [
  { id: "rosh_hashana", label: "ראש השנה 🍎", img: "/hero1.png", color: "#FFD93D", bg: "rgba(255,217,61,0.08)", desc: "חוויות מתוקות לשנה החדשה – דבש, נרות ושמחה", count: 3 },
  { id: "hanuka",       label: "חנוכה 🕎",    img: "/hero2.png", color: "#8E5CFF", bg: "rgba(142,92,255,0.08)", desc: "מופעים ואירועים מרהיבים לחג האורים", count: 4 },
  { id: "pesach",       label: "פסח 🫓",      img: "/hero3.png", color: "#FF4FB5", bg: "rgba(255,79,181,0.08)", desc: "מסעות יציאת מצרים ואפיית מצות", count: 5 },
  { id: "summer",       label: "קיץ ☀️",     img: "/hero4.png", color: "#66C5FF", bg: "rgba(102,197,255,0.08)", desc: "פעילויות קיץ מרעננות ומהנות לכל הגילאים", count: 6 },
];

export function SeasonsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const s = SEASONS[active];

  return (
    <section style={{ background: "#fff", padding: "5rem 2rem", position: "relative", overflow: "hidden" }}>

      <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto", opacity: v ? 1 : 0, transform: v ? "none" : "translateY(24px)", transition: "all 0.7s" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div className="sec-label green">🌱 לאורך כל השנה</div>
          <h2 className="sec-title">פעילויות לכל חג ועונה</h2>
        </div>

        {/* Season tabs */}
        <div style={{ display: "flex", gap: 0, justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem", borderBottom: "2px solid #e5e7eb" }}>
          {SEASONS.map((season, i) => (
            <button key={season.id} onClick={() => setActive(i)} style={{
              padding: "11px 26px", fontSize: 13, fontWeight: 700,
              border: "none",
              borderBottom: `2px solid ${active === i ? season.color : "transparent"}`,
              marginBottom: -2,
              background: "transparent",
              color: active === i ? season.color : "#64748b",
              cursor: "pointer", fontFamily: "Rubik, sans-serif",
              transition: "color 0.15s, border-color 0.15s",
            }}>
              {season.label}
            </button>
          ))}
        </div>

        {/* Active card */}
        <div key={active} style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0,
          borderRadius: 4, overflow: "hidden",
          boxShadow: "0 4px 32px rgba(0,0,0,0.07)",
          border: `1px solid #e5e7eb`,
          animation: "scaleIn 0.3s ease both",
        }} className="season-grid">
          {/* Image */}
          <div style={{ position: "relative", minHeight: 320, overflow: "hidden" }}>
            <Image src={s.img} alt={s.label} fill style={{ objectFit: "cover", objectPosition: "center top" }} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, rgba(248,251,255,0.6) 0%, transparent 40%)` }} />
          </div>
          {/* Content */}
          <div style={{ background: s.bg, padding: "3rem 2.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{s.label.split(" ")[1]}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: s.color, letterSpacing: "0.08em", marginBottom: 10 }}>
              {s.count} פעילויות זמינות
            </div>
            <h3 style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: "#0F172A", marginBottom: 12 }}>
              פעילויות {s.label.split(" ")[0]}
            </h3>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 24 }}>{s.desc}</p>
            <Link href={`/activities?season=${s.id}`} style={{
              display: "inline-flex", alignItems: "center",
              background: s.color, color: s.id === "rosh_hashana" || s.id === "summer" ? "#0F172A" : "#fff",
              alignSelf: "flex-start", fontSize: 13, fontWeight: 700, padding: "11px 24px",
              borderRadius: 3, textDecoration: "none",
            }}>
              לפעילויות {s.label.split(" ")[0]} →
            </Link>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:640px){.season-grid{grid-template-columns:1fr !important} .season-grid>div:first-child{min-height:200px !important}}`}</style>
    </section>
  );
}
