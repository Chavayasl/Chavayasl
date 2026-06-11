"use client";
import { useEffect, useRef, useState } from "react";

const REVIEWS = [
  { name: "רחל כהן", inst: "בית ספר אורות, תל אביב", text: "ילדי כיתה ב' פשוט התלהבו! המדריכה הייתה מקסימה והדבש שהביאו הביתה עדיין מדברים עליו.", stars: 5, color: "#66C5FF", emoji: "👩‍🏫" },
  { name: "מיכל לוי", inst: "גן ממלכתי, רחובות", text: "פעילות מקצועית ומרגשת. הצוות הגיע בזמן, מאורגן ועם ציוד מרשים. בהחלט נחזור!", stars: 5, color: "#FF4FB5", emoji: "👩" },
  { name: "יוסי ברקוביץ", inst: "גן ילדים רמות, ירושלים", text: "הילדים דיברו על זה שבועות אחר כך. ממליץ בחום לכל גן ובית ספר!", stars: 5, color: "#8E5CFF", emoji: "👨" },
  { name: "שרה אברהם", inst: "בי\"ס יסודי, חיפה", text: "שנה שנייה שאנחנו מזמינים – תמיד מגיעים בזמן ותמיד מצוינים. שירות אמין ומקצועי.", stars: 5, color: "#57C76F", emoji: "👩‍🎓" },
];

export function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % REVIEWS.length), 4500);
    return () => clearInterval(t);
  }, []);

  const r = REVIEWS[active];

  return (
    <section style={{ background: "#F8FBFF", padding: "5rem 2rem", position: "relative", overflow: "hidden" }}>

      <div ref={ref} style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", opacity: v ? 1 : 0, transition: "opacity 0.7s" }}>
        <div className="sec-label pink">💬 המלצות</div>
        <h2 className="sec-title" style={{ marginBottom: "2.5rem" }}>מה אומרים עלינו</h2>

        {/* Main review */}
        <div key={active} style={{
          background: "#fff", borderRadius: 4,
          padding: "2.5rem",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          border: `1px solid #e5e7eb`,
          borderTop: `3px solid ${r.color}`,
          marginBottom: "1.5rem",
          animation: "scaleIn 0.3s ease both",
          position: "relative",
        }}>
          {/* Quote mark */}
          <div style={{ position: "absolute", top: 20, left: 28, fontSize: 64, color: r.color, opacity: 0.15, lineHeight: 1, fontFamily: "Georgia, serif" }}>&ldquo;</div>

          {/* Stars */}
          <div style={{ color: "#FFD93D", fontSize: 22, letterSpacing: 3, marginBottom: 16 }}>
            {"★".repeat(r.stars)}
          </div>

          <p style={{ fontSize: 17, color: "#334155", lineHeight: 1.75, marginBottom: 24, fontStyle: "italic", position: "relative", zIndex: 1 }}>
            &ldquo;{r.text}&rdquo;
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 4, background: `${r.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
              {r.emoji}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700, color: "#0F172A", fontSize: 14 }}>{r.name}</div>
              <div style={{ color: "#94a3b8", fontSize: 12 }}>{r.inst}</div>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
          {REVIEWS.map((rv, i) => (
            <button key={i} onClick={() => setActive(i)} aria-label={`עדות ${i + 1}`} style={{
              width: i === active ? 28 : 8, height: 4, borderRadius: 2,
              border: "none", cursor: "pointer",
              background: i === active ? rv.color : "#CBD5E1",
              transition: "all 0.3s",
            }} />
          ))}
        </div>
      </div>
    </section>
  );
}
