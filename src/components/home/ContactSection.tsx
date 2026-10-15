"use client";
import { BookButton } from "@/components/BookButton";

export function ContactSection() {
  return (
    <section id="contact" style={{ background: "#f8fafc", padding: "5rem 2rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }} className="contact-grid">

        {/* Left — info */}
        <div>
          <div className="sec-label">הזמנת פעילות</div>
          <h2 className="sec-title" style={{ marginBottom: 16 }}>
            בואו נדבר<br />
            <span style={{ color: "#CC2222" }}>על הפעילות הבאה שלכם</span>
          </h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 32 }}>
            ממלאים פרטים ואנחנו חוזרים אליכם תוך 24 שעות עם הצעה מותאמת אישית. ללא התחייבות.
          </p>

          {/* Contact options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
            <a href="tel:0556671997" style={{
              display: "flex", alignItems: "center", gap: 12,
              textDecoration: "none", color: "#0F172A",
              fontSize: 15, fontWeight: 600,
            }}>
              <span style={{ width: 42, height: 42, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, fontSize: 18, flexShrink: 0 }}>📞</span>
              055-667-1997
            </a>
            <a href="tel:0586001236" style={{
              display: "flex", alignItems: "center", gap: 12,
              textDecoration: "none", color: "#0F172A",
              fontSize: 15, fontWeight: 600,
            }}>
              <span style={{ width: 42, height: 42, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, fontSize: 18, flexShrink: 0 }}>🏢</span>
              058-600-1236 <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>· משרד</span>
            </a>
            <a href="https://wa.me/972556671997" target="_blank" rel="noopener noreferrer" style={{
              display: "flex", alignItems: "center", gap: 12,
              textDecoration: "none", color: "#0F172A",
              fontSize: 15, fontWeight: 600,
            }}>
              <span style={{ width: 42, height: 42, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, fontSize: 18, flexShrink: 0 }}>💬</span>
              שלחו הודעת וואטסאפ
            </a>
          </div>

          {/* Trust */}
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              'מאושר גפ"ן — תכניות לימודיות מוכרות',
              "מגיעים אליכם — לכל רחבי הארץ",
              "500+ מוסדות חינוך כבר הזמינו",
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#475569" }}>
                <span style={{ width: 6, height: 6, background: "#CC2222", borderRadius: "50%", flexShrink: 0 }} />
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Right — CTA (פותח את קישור ההזמנה שהוגדר ע"י המנהל) */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", padding: "2.75rem 2rem", borderRadius: 4, textAlign: "center" }}>
          <div style={{ fontSize: 50, marginBottom: 14 }}>🎉</div>
          <h3 style={{ fontSize: 23, fontWeight: 900, color: "#0F172A", marginBottom: 12 }}>מוכנים להזמין?</h3>
          <p style={{ color: "#64748b", fontSize: 14.5, lineHeight: 1.75, marginBottom: 26 }}>
            לחצו על הכפתור, מלאו את הפרטים, ונחזור אליכם תוך 24 שעות
            <br />עם הצעה מותאמת אישית. ללא התחייבות.
          </p>
          <BookButton className="btn-red" style={{
            display: "inline-flex", width: "100%", justifyContent: "center",
            fontSize: 16, fontWeight: 700, padding: "15px 0", borderRadius: 3,
          }} />
        </div>
      </div>
      <style>{`@media(max-width:768px){.contact-grid{grid-template-columns:1fr !important; gap:2rem !important;}}`}</style>
    </section>
  );
}
