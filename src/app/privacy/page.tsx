import Link from "next/link";

const SECTIONS = [
  { title: "מידע שאנו אוספים", text: "שם, מוסד, טלפון, כתובת אימייל, פרטי הזמנה (תאריך, מספר משתתפים, גיל)." },
  { title: "שימוש ב-SMS", text: "אנו משתמשים בשירות ימות המשיח לשליחת הודעות SMS לאישור הזמנות ועדכונים. מספרכם מועבר אליהם לצורך זה בלבד." },
  { title: "שימוש באימייל", text: "אנו משתמשים ב-Resend לשליחת מיילים. כתובת המייל מועברת אליהם לצורך זה בלבד." },
  { title: "אבטחת מידע", text: 'כל המידע מאוחסן בשרתי Supabase עם הצפנה מלאה. אנו לא מוכרים ולא משתפים מידע אישי עם צדדים שלישיים למעט ספקי השירות הנ"ל.' },
  { title: "זכויותיך", text: "יש לך זכות לעיין, לתקן ולמחוק את המידע שלך. לפנייה: info@chavaya.co.il" },
];

export default function PrivacyPage() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <div style={{ background: "linear-gradient(135deg,#1a2340 0%,#8B1A1A 100%)", padding: "5.5rem 2rem 3rem" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "rgba(204,34,34,0.25)", color: "#fca5a5", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 4, marginBottom: 12, border: "1px solid rgba(204,34,34,0.3)" }}>
            🔒 פרטיות
          </div>
          <h1 style={{ color: "#fff", fontSize: "clamp(24px,4vw,38px)", fontWeight: 900, marginBottom: 10 }}>מדיניות פרטיות</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>עודכן לאחרונה: יוני 2025</p>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "3rem 2rem" }}>
        {/* Important notice */}
        <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 12, padding: "1.25rem 1.5rem", marginBottom: "2rem", borderRight: "4px solid #CC2222" }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#92400e", lineHeight: 1.7 }}>
            בעת ההזמנה אתה מאשר קבלת SMS לאישור הזמנה ועדכונים שוטפים, וקבלת חומרי שיווק ועדכוני פעילויות למייל. ניתן לבטל בכל עת על ידי פנייה אלינו.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2.5rem" }}>
          {SECTIONS.map((s, i) => (
            <div key={i} style={{ background: "#f5f6f8", borderRadius: 12, padding: "1.25rem 1.5rem", border: "1px solid #e5e7eb" }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#CC2222", fontWeight: 900 }}>{i + 1}.</span> {s.title}
              </h2>
              <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.7 }}>{s.text}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/" style={{ color: "#CC2222", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>← חזרה לדף הבית</Link>
        </div>
      </div>
    </div>
  );
}
