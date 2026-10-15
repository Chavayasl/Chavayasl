import Image from "next/image";
import { BookButton } from "@/components/BookButton";

const STATS = [
  { n: "500+", label: "מוסדות חינוך" },
  { n: "8+", label: "שנות ניסיון" },
  { n: "98%", label: "שביעות רצון" },
  { n: "14+", label: "פעילויות שונות" },
];

const VALUES = [
  { icon: "🎓", color: "#CC2222", bg: "#fef2f2", title: "חינוך דרך חוויה", text: "כל פעילות מעוצבת כך שהילד לומד תוך כדי כיף ושמחה" },
  { icon: "🌿", color: "#16a34a", bg: "#f0fdf4", title: 'מאושר גפ"ן', text: 'כל הפעילויות עומדות בתקני גפ"ן המחמירים של משרד החינוך' },
  { icon: "❤️", color: "#db2777", bg: "#fdf2f8", title: "אהבה לכל ילד", text: "מתאימים כל פעילות לגיל, לרמה ולצרכים הספציפיים" },
  { icon: "⭐", color: "#d97706", bg: "#fffbeb", title: "מקצועיות", text: "8+ שנות ניסיון והכשרה מתמדת של הצוות" },
];

const PROMISES = [
  "מגיעים עד אליכם — לכל רחבי הארץ",
  "צוות מדריכים מקצועי ומנוסה",
  "התאמה מלאה לגיל, למגזר ולאירוע",
  "כל הציוד והתפאורה כלולים",
];

export default function AboutPage() {
  return (
    <div style={{ background: "#FAF7F4", minHeight: "100vh" }}>

      {/* ═══════════ Hero ═══════════ */}
      <section style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#CC2222 0%,#8B1A1A 52%,#1a2340 100%)", padding: "128px 2rem 150px", textAlign: "center" }}>
        {/* זוהרים דקורטיביים */}
        <div style={{ position: "absolute", top: -120, insetInlineStart: -80, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,0.14),transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -140, insetInlineEnd: -60, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,217,61,0.12),transparent 70%)" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto" }}>
          <Image src="/logo-hero.png" alt="חוויה סביב השנה" width={116} height={116} style={{ objectFit: "contain", margin: "0 auto 22px", filter: "drop-shadow(0 8px 28px rgba(0,0,0,0.45))" }} />
          <span style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", fontSize: 12.5, fontWeight: 700, padding: "6px 18px", borderRadius: 30, marginBottom: 20 }}>קצת עלינו</span>
          <h1 style={{ color: "#fff", fontSize: "clamp(32px,5vw,56px)", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.12, marginBottom: 18, textShadow: "0 3px 18px rgba(0,0,0,0.3)" }}>
            חינוך שהופך<br /><span style={{ color: "#FFD93D" }}>לחוויה בלתי נשכחת</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "clamp(15px,1.8vw,18px)", lineHeight: 1.7, maxWidth: 540, margin: "0 auto" }}>
            נוסדנו מתוך אמונה שחינוך יכול להיות גם כיף — ושכל ילד ראוי לרגעים שיזכור לכל החיים.
          </p>
        </div>
      </section>

      {/* ═══════════ Stats — כרטיס צף ═══════════ */}
      <div style={{ maxWidth: 940, margin: "0 auto", padding: "0 2rem", position: "relative", zIndex: 2, marginTop: -80 }}>
        <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 24px 60px rgba(15,23,42,0.14)", padding: "2rem 1.5rem", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", textAlign: "center" }} className="about-stats">
          {STATS.map((s, i) => (
            <div key={i} style={{ borderInlineEnd: i < STATS.length - 1 ? "1px solid #f1f5f9" : "none" }} className="about-stat">
              <div style={{ color: "#CC2222", fontSize: "clamp(26px,3.5vw,38px)", fontWeight: 900, letterSpacing: "-1px" }}>{s.n}</div>
              <div style={{ color: "#64748b", fontSize: 13, marginTop: 4, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════ Story ═══════════ */}
      <section style={{ maxWidth: 1040, margin: "0 auto", padding: "4.5rem 2rem 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3.5rem", alignItems: "center" }} className="about-story">
          <div>
            <div style={{ fontSize: 12, color: "#CC2222", fontWeight: 800, letterSpacing: "0.1em", marginBottom: 12 }}>הסיפור שלנו</div>
            <h2 style={{ fontSize: "clamp(24px,3.2vw,36px)", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px", lineHeight: 1.2, marginBottom: 20 }}>
              מורה אחת שרצתה<br />לשנות את העולם
            </h2>
            <div style={{ color: "#475569", fontSize: 15, lineHeight: 1.9, display: "flex", flexDirection: "column", gap: 14 }}>
              <p>לפני שנים, מורה אחת החליטה שהיא רוצה לשנות את האופן שבו ילדים חווים חינוך. במקום לשבת ולהקשיב, היא האמינה שכל ידע חדש צריך להיכנס דרך הגוף, הלב והדמיון.</p>
              <p>כך נולדה <strong style={{ color: "#CC2222" }}>חוויה סביב השנה</strong> — חברה שמתמחה ביצירת חוויות חינוכיות בלתי נשכחות, המחוברות לחגי ישראל ולתכנית הלימודים.</p>
              <p>היום, עם מעל 500 מוסדות שסמכו עלינו, אנחנו גאים להיות חלק מהזיכרונות היפים ביותר של ילדי ישראל.</p>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: "16px -16px -16px 16px", background: "linear-gradient(135deg,#FFD93D,#CC2222)", borderRadius: 24, opacity: 0.18 }} />
            <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", height: 360, boxShadow: "0 20px 50px rgba(15,23,42,0.16)" }}>
              <Image src="/hero2.png" alt="ילדים בפעילות של חוויה סביב השנה" fill sizes="(max-width:760px) 100vw, 480px" style={{ objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ Values ═══════════ */}
      <section style={{ maxWidth: 1040, margin: "0 auto", padding: "3.5rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: 12, color: "#CC2222", fontWeight: 800, letterSpacing: "0.1em", marginBottom: 10 }}>מה מניע אותנו</div>
          <h2 style={{ fontSize: "clamp(24px,3.2vw,36px)", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px" }}>הערכים שלנו</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 18 }}>
          {VALUES.map((v, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 20, padding: "1.9rem 1.5rem", border: "1px solid #eef0f3", boxShadow: "0 6px 20px rgba(15,23,42,0.05)", textAlign: "center" }}>
              <div style={{ width: 66, height: 66, borderRadius: "50%", background: v.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto 16px" }}>{v.icon}</div>
              <h3 style={{ fontSize: 16.5, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>{v.title}</h3>
              <p style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.7 }}>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ Promises band ═══════════ */}
      <section style={{ maxWidth: 1040, margin: "0 auto", padding: "1rem 2rem 4rem" }}>
        <div style={{ background: "#fff", border: "1px solid #eef0f3", borderRadius: 24, padding: "2.5rem 2rem", boxShadow: "0 6px 20px rgba(15,23,42,0.05)" }}>
          <h3 style={{ textAlign: "center", fontSize: 20, fontWeight: 900, color: "#0F172A", marginBottom: 24 }}>ההבטחה שלנו אליכם</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14, maxWidth: 760, margin: "0 auto" }}>
            {PROMISES.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14.5, color: "#334155", fontWeight: 600 }}>
                <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#16a34a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>✓</span>
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section style={{ maxWidth: 1040, margin: "0 auto", padding: "0 2rem 5rem" }}>
        <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#1a2340 0%,#8B1A1A 100%)", borderRadius: 28, padding: "3.5rem 2rem", textAlign: "center" }}>
          <div style={{ position: "absolute", top: -80, insetInlineStart: "50%", transform: "translateX(-50%)", width: 400, height: 220, background: "radial-gradient(circle,rgba(255,255,255,0.12),transparent 70%)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ color: "#fff", fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: 12 }}>מוכנים לחוויה שלא תישכח?</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15.5, marginBottom: 28 }}>ספרו לנו על האירוע הבא שלכם — ונבנה לכם חוויה מושלמת.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <BookButton className="btn-red" style={{ fontSize: 15, padding: "14px 32px", borderRadius: 30 }} />
              <a href="tel:0556671997" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", color: "#fff", padding: "14px 28px", borderRadius: 30, fontSize: 15, fontWeight: 700, border: "1.5px solid rgba(255,255,255,0.25)", textDecoration: "none" }}>📞 055-667-1997</a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:760px){
          .about-story{ grid-template-columns:1fr !important; gap:2rem !important; }
          .about-stats{ grid-template-columns:1fr 1fr !important; gap:1.5rem 1rem !important; }
          .about-stats .about-stat:nth-child(2){ border-inline-end:none !important; }
        }
      `}</style>
    </div>
  );
}
