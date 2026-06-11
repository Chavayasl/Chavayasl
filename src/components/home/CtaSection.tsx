"use client";
import Link from "next/link";
import Image from "next/image";

export function CtaSection() {
  return (
    <section style={{ background: "#fff", padding: "2rem 2rem 5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          borderRadius: 4, overflow: "hidden",
          background: "linear-gradient(135deg, #0F172A 0%, #1e3a5f 100%)",
          display: "grid", gridTemplateColumns: "1fr auto",
          minHeight: 300, position: "relative",
        }} className="cta-grid">
          <div style={{ padding: "3.5rem 3rem", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#66C5FF", letterSpacing: "0.08em", marginBottom: 14 }}>✦ מוכנים להתחיל?</div>
            <h2 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 900, color: "#fff", marginBottom: 12, letterSpacing: "-0.5px", lineHeight: 1.25 }}>
              מוכנים לחווית למידה<br />
              <span style={{ color: "#66C5FF" }}>בלתי נשכחת?</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.7, marginBottom: 28, maxWidth: 380 }}>
              השאירו פרטים ונחזור אליכם תוך 24 שעות עם הצעה מותאמת אישית
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/book" className="btn-red">🎯 הזמינו פעילות</Link>
              <a href="tel:0556671997" style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.1)",color:"#fff",fontSize:14,fontWeight:600,padding:"13px 22px",borderRadius:3,border:"1.5px solid rgba(255,255,255,0.25)",textDecoration:"none" }}>
                📞 055-667-1997
              </a>
            </div>
          </div>
          <div style={{ width: 280, position: "relative", overflow: "hidden" }} className="cta-char">
            <Image src="/hero1.png" alt="" fill style={{ objectFit:"cover", objectPosition:"center top", opacity:0.8 }} />
            <div style={{ position:"absolute",inset:0,background:"linear-gradient(to right,rgba(15,23,42,0.6) 0%,transparent 50%)" }} />
          </div>
        </div>
      </div>
      <style>{`@media(max-width:640px){.cta-grid{grid-template-columns:1fr !important} .cta-char{display:none !important}}`}</style>
    </section>
  );
}
