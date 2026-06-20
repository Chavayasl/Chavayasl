import Link from "next/link";

const ITEMS = [
  { title: "רמת הנגישות", text: "אתר זה עומד בדרישות תקן WCAG 2.1 ברמה AA וחוק שוויון זכויות לאנשים עם מוגבלות (תיקון 2005)." },
  { title: "התאמות שבוצעו", text: "הגדלת טקסט (3 רמות), ניגוד גבוה/נמוך, עצירת אנימציות, הדגשת קישורים, ניווט מקלדת מלא, תיאורי alt לכל תמונה, קישור דלג לתוכן." },
  { title: "פנייה בנושא נגישות", text: "לדיווח על בעיה או לקבלת תוכן בפורמט נגיש אחר, צרו קשר:" },
];

export default function AccessibilityPage() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <div style={{ background: "linear-gradient(135deg,#1a2340 0%,#8B1A1A 100%)", padding: "5.5rem 2rem 3rem" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "rgba(204,34,34,0.25)", color: "#fca5a5", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 4, marginBottom: 12, border: "1px solid rgba(204,34,34,0.3)" }}>
            ♿ נגישות
          </div>
          <h1 style={{ color: "#fff", fontSize: "clamp(24px,4vw,38px)", fontWeight: 900, marginBottom: 10 }}>הצהרת נגישות</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>חוויה סביב השנה מחויבת לנגישות מלאה לכל המשתמשים</p>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "3rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {ITEMS.map((item, i) => (
          <div key={i} style={{ background: "#f5f6f8", borderRadius: 12, padding: "1.5rem", border: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 4, height: 20, background: "#CC2222", borderRadius: 2 }} />
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{item.title}</h2>
            </div>
            <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.7 }}>{item.text}</p>
            {i === 2 && (
              <ul style={{ listStyle: "none", marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                <li><a href="mailto:office.chavayasl@gmail.com" style={{ color: "#CC2222", fontSize: 13 }}>📧 office.chavayasl@gmail.com</a></li>
                <li><a href="tel:0556671997" style={{ color: "#CC2222", fontSize: 13 }}>📞 055-667-1997</a></li>
              </ul>
            )}
          </div>
        ))}
        <div style={{ textAlign: "center", paddingTop: "1rem" }}>
          <Link href="/" style={{ color: "#CC2222", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>← חזרה לדף הבית</Link>
        </div>
      </div>
    </div>
  );
}
