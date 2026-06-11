import Link from "next/link";
import Image from "next/image";

const VALUES = [
  { icon: "🎓", title: "חינוך דרך חוויה", text: "כל פעילות מעוצבת כך שהילד לומד תוך כדי כיף ושמחה" },
  { icon: "🌿", title: 'מאושר גפ"ן', text: 'כל הפעילויות עומדות בתקני גפ"ן המחמירים' },
  { icon: "❤️", title: "אהבה לכל ילד", text: "מתאימים כל פעילות לגיל, לרמה ולצרכים הספציפיים" },
  { icon: "⭐", title: "מקצועיות", text: "8+ שנות ניסיון והכשרה מתמדת של הצוות" },
];

const TEAM = [
  { name: "שרה לוי", role: 'מנכ"לית ומייסדת', emoji: "👩‍💼" },
  { name: "יוסי כהן", role: "מנהל פדגוגי", emoji: "👨‍🏫" },
  { name: "רינה מזרחי", role: "מדריכת סדנאות", emoji: "👩‍🎨" },
  { name: "דוד אברהם", role: "מנהל לוגיסטיקה", emoji: "👨‍🔧" },
];

const STATS = [
  { n: "500+", label: "מוסדות חינוך" },
  { n: "8+", label: "שנות ניסיון" },
  { n: "98%", label: "שביעות רצון" },
  { n: "14+", label: "פעילויות שונות" },
];

export default function AboutPage() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {/* Hero with image */}
      <div style={{ position: "relative", minHeight: 400, overflow: "hidden" }}>
        <Image src="/hero1.png" alt="חוויה סביב השנה" fill style={{ objectFit: "cover", objectPosition: "center top" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, rgba(26,35,64,0.85) 0%, rgba(26,35,64,0.4) 60%, transparent 100%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "flex-start", padding: "80px 4rem 2rem" }}>
          <div style={{ maxWidth: 480 }}>
            <div style={{ display: "inline-block", background: "#CC2222", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 4, marginBottom: 14 }}>
              אודותנו
            </div>
            <h1 style={{ color: "#fff", fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: 12, lineHeight: 1.2 }}>
              חינוך חווייתי<br />מאז 2017
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.7 }}>
              נוסדנו מתוך אמונה שחינוך יכול להיות גם כיף – ושכל ילד ראוי לרגעים שלא יישכחו
            </p>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: "#CC2222", padding: "1.5rem 2rem" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", textAlign: "center" }}>
          {STATS.map((s, i) => (
            <div key={i}>
              <div style={{ color: "#fff", fontSize: 28, fontWeight: 900, letterSpacing: "-0.5px" }}>{s.n}</div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "3.5rem 2rem" }}>
        {/* Story */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center", marginBottom: "3.5rem" }} className="story-grid">
          <div>
            <div style={{ fontSize: 11, color: "#CC2222", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 10 }}>הסיפור שלנו</div>
            <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 900, color: "#111827", letterSpacing: "-0.5px", marginBottom: 16 }}>
              מורה אחת שרצתה<br />לשנות את העולם
            </h2>
            <div style={{ color: "#4b5563", fontSize: 14, lineHeight: 1.85, display: "flex", flexDirection: "column", gap: 12 }}>
              <p>לפני 8 שנים, מורה אחת החליטה שהיא רוצה לשנות את האופן שבו ילדים חווים חינוך. במקום לשבת ולהקשיב, היא האמינה שכל ידע חדש צריך להיכנס דרך הגוף, הלב והדמיון.</p>
              <p>כך נולדה <strong style={{ color: "#CC2222" }}>חוויה סביב השנה</strong> – חברה שמתמחה ביצירת חוויות חינוכיות בלתי נשכחות, המחוברות לחגי ישראל ולתכנית הלימודים.</p>
              <p>היום, עם מעל 500 מוסדות שסמכו עלינו, אנחנו גאים להיות חלק מהזיכרונות היפים ביותר של ילדי ישראל.</p>
            </div>
          </div>
          <div style={{ position: "relative", borderRadius: 4, overflow: "hidden", height: 320 }}>
            <Image src="/hero2.png" alt="הצוות שלנו" fill style={{ objectFit: "cover" }} />
          </div>
        </div>

        {/* Values */}
        <div style={{ marginBottom: "3.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontSize: 11, color: "#CC2222", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>מה מניע אותנו</div>
            <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 900, color: "#111827" }}>הערכים שלנו</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
            {VALUES.map((v, i) => (
              <div key={i} style={{ background: "#f5f6f8", borderRadius: 4, padding: "1.5rem", border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{v.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 6 }}>{v.title}</h3>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65 }}>{v.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={{ marginBottom: "3.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontSize: 11, color: "#CC2222", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>האנשים שעושים את זה</div>
            <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 900, color: "#111827" }}>הצוות שלנו</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 }}>
            {TEAM.map((m, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 4, padding: "1.5rem", border: "1px solid #e5e7eb", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: 48, marginBottom: 10 }}>{m.emoji}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{m.name}</div>
                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>{m.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: "linear-gradient(135deg,#1a2340 0%,#8B1A1A 100%)", borderRadius: 4, padding: "3rem 2rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <h2 style={{ color: "#fff", fontSize: "clamp(22px,3vw,32px)", fontWeight: 900, marginBottom: 12 }}>בואו נתחיל!</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: "1.5rem" }}>מוכנים לפעילות שהילדים לא ישכחו?</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/book" className="btn-red" style={{ fontSize: 14 }}>להזמנת פעילות</Link>
            <a href="tel:0556671997" style={{ display: "inline-block", background: "transparent", color: "rgba(255,255,255,0.8)", padding: "12px 24px", borderRadius: 3, fontSize: 14, fontWeight: 600, border: "1.5px solid rgba(255,255,255,0.25)", textDecoration: "none" }}>055-667-1997</a>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:640px){.story-grid{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}
