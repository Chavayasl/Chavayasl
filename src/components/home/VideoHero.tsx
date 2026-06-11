"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoExists, setVideoExists] = useState(false);
  const [phase, setPhase] = useState<"logo" | "text">("logo");

  useEffect(() => {
    fetch("/hero-video.mp4", { method: "HEAD" })
      .then(r => { if (r.ok) setVideoExists(true); })
      .catch(() => {});
    // לוגו מופיע → אחרי 1.4 שניות הטקסט נכנס
    const t = setTimeout(() => setPhase("text"), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <section style={{ position: "relative", height: "100vh", minHeight: 600, overflow: "hidden" }}>

      {/* Video / fallback */}
      {videoExists ? (
        <video ref={videoRef} autoPlay muted loop playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}>
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      ) : (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#0f1729 0%,#1a2340 40%,#3d0808 100%)", zIndex: 0 }} />
      )}

      {/* Overlay */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "rgba(0,0,0,0.58)" }} />

      {/* Content */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "68px 2rem 0",
        textAlign: "center",
        gap: 0,
      }}>

        {/* Logo — נכנס ראשון */}
        <div style={{ animation: "logoPop 0.9s cubic-bezier(0.34,1.56,0.64,1) both" }}>
          <Image
            src="/logo-hero.png"
            alt="חוויה סביב השנה"
            width={200}
            height={200}
            style={{ objectFit: "contain", filter: "drop-shadow(0 6px 28px rgba(0,0,0,0.6))" }}
            priority
          />
        </div>

        {/* Headline — נכנס אחרי הלוגו */}
        <h1 style={{
          fontSize: "clamp(28px, 4.2vw, 56px)",
          fontWeight: 900,
          color: "#fff",
          lineHeight: 1.2,
          letterSpacing: "-0.5px",
          marginTop: 16,
          marginBottom: 14,
          textShadow: "0 2px 16px rgba(0,0,0,0.5)",
          opacity: phase === "text" ? 1 : 0,
          transform: phase === "text" ? "translateY(0)" : "translateY(22px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}>
          פעילויות חינוכיות<br />
          <span style={{ color: "#FF6B6B" }}>בלתי נשכחות</span><br />
          לבתי ספר וגנים
        </h1>

        {/* Sub */}
        <p style={{
          fontSize: "clamp(13px, 1.4vw, 15px)",
          color: "rgba(255,255,255,0.78)",
          lineHeight: 1.65,
          maxWidth: 460,
          marginBottom: 28,
          opacity: phase === "text" ? 1 : 0,
          transform: phase === "text" ? "translateY(0)" : "translateY(18px)",
          transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
        }}>
          סדנאות, הצגות והפעלות מקצועיות שמגיעות עד אליכם —<br />
          חוויית למידה שמתחברת לחגים ולשנה היהודית
        </p>

        {/* CTA */}
        <div style={{
          display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center",
          opacity: phase === "text" ? 1 : 0,
          transform: phase === "text" ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s",
        }}>
          <Link href="/activities" style={{
            background: "#CC2222", color: "#fff",
            padding: "13px 30px", borderRadius: 3,
            fontWeight: 700, fontSize: 15,
            textDecoration: "none", fontFamily: "Rubik, sans-serif",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#a81b1b"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#CC2222"; }}
          >
            לכל הפעילויות שלנו
          </Link>
          <Link href="/#contact" style={{
            background: "rgba(255,255,255,0.12)", color: "#fff",
            padding: "13px 26px", borderRadius: 3,
            fontWeight: 600, fontSize: 14,
            textDecoration: "none", fontFamily: "Rubik, sans-serif",
            border: "1.5px solid rgba(255,255,255,0.3)",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.22)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
          >
            להזמנת פעילות
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes logoPop {
          0%   { opacity: 0; transform: scale(0.4) rotate(-8deg); }
          60%  { transform: scale(1.1) rotate(3deg); }
          80%  { transform: scale(0.95) rotate(-1deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @media(max-width:640px){
          section img[alt="חוויה סביב השנה"] { width: 140px !important; height: 140px !important; }
        }
      `}</style>
    </section>
  );
}
