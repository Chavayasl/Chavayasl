"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const SLIDES = [
  { img: "/bg1.png" },
  { img: "/bg2.png" },
];

export function HeroSection() {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setActive(a => (a + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{
      position: "relative",
      height: "100vh",
      minHeight: 600,
      overflow: "hidden",
    }}>
      {/* Background images — inactive stays visible (z:0), active fades in on top (z:1) */}
      {SLIDES.map((s, i) => (
        <div key={s.img} style={{
          position: "absolute", inset: 0,
          zIndex: i === active ? 1 : 0,
          animation: i === active ? "fadeIn 1.2s ease both" : "none",
        }}>
          <Image
            src={s.img}
            alt="חוויה סביב השנה"
            fill
            style={{ objectFit: "cover", objectPosition: "center top" }}
            priority={i === 0}
          />
        </div>
      ))}

      {/* Right-side gradient overlay for text readability */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: "linear-gradient(to left, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.85) 35%, rgba(255,255,255,0.3) 60%, transparent 100%)",
      }} />

      {/* Text panel — right side */}
      <div style={{
        position: "absolute",
        top: 0, right: 0, bottom: 0,
        zIndex: 3,
        width: "50%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px 8vw 0 4rem",
      }}>
        {/* Brand name */}
        <div style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#2563EB",
          marginBottom: 14,
          letterSpacing: "-0.2px",
        }}>
          חוויה סביב השנה
        </div>

        {/* Main headline */}
        <h1 style={{
          fontSize: "clamp(28px, 3.6vw, 50px)",
          fontWeight: 900,
          color: "#CC2222",
          lineHeight: 1.18,
          letterSpacing: "-0.5px",
          marginBottom: 18,
        }}>
          במגוון פעילויות הכי<br />
          טובות לבתי הספר<br />
          והגנים
        </h1>

        {/* Sub */}
        <p style={{
          fontSize: 15,
          color: "#334155",
          lineHeight: 1.75,
          marginBottom: 32,
          maxWidth: 380,
        }}>
          סדנאות, הצגות והפעלות מקצועיות שמגיעות עד אליכם – חוויית למידה בלתי נשכחת לכל גיל
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 40, flexWrap: "wrap" }}>
          <Link href="/book" style={{
            background: "#CC2222",
            color: "#fff",
            padding: "13px 30px",
            borderRadius: 3,
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
            fontFamily: "Rubik, sans-serif",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#a81b1b"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#CC2222"; }}
          >
            להזמנת פעילות
          </Link>
          <Link href="/activities" style={{
            color: "#334155",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "12px 22px",
            borderRadius: 3,
            border: "1.5px solid rgba(51,65,85,0.35)",
            background: "rgba(255,255,255,0.7)",
            transition: "border-color 0.15s, color 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#CC2222"; e.currentTarget.style.color = "#CC2222"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(51,65,85,0.35)"; e.currentTarget.style.color = "#334155"; }}
          >
            לקטלוג &lt;
          </Link>
        </div>

        {/* Trust row */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[
            { icon: "🌿", text: 'מאושר גפ"ן' },
            { icon: "⭐", text: "500+ מוסדות" },
            { icon: "🏆", text: "98% שביעות רצון" },
          ].map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#475569", fontWeight: 600 }}>
              <span>{b.icon}</span>{b.text}
            </div>
          ))}
        </div>

        {/* Slide dots */}
        <div style={{ display: "flex", gap: 6, marginTop: 32 }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`סליידר ${i + 1}`}
              style={{
                width: i === active ? 28 : 8,
                height: 4,
                borderRadius: 2,
                border: "none",
                background: i === active ? "#CC2222" : "#d1d5db",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Mobile */}
      <style>{`
        @media (max-width: 768px) {
          section > div:last-child {
            width: 100% !important;
            padding: 7rem 1.5rem 3rem !important;
            background: linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.92) 30%, rgba(255,255,255,0.97) 60%) !important;
            justify-content: flex-end !important;
          }
        }
      `}</style>
    </section>
  );
}
