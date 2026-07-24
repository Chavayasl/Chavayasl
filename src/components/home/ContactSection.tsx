"use client";
import { useState } from "react";
import Link from "next/link";
import { ACTIVITIES } from "@/lib/data";

export function ContactSection() {
  const [form, setForm] = useState({ name: "", institution: "", phone: "", activity: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    await fetch("/api/admin/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, id }),
    }).catch(() => null);
    setLoading(false);
    setSubmitted(true);
  };

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

        {/* Right — form */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", padding: "2rem", borderRadius: 4 }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontSize: 22, fontWeight: 900, color: "#0F172A", marginBottom: 8 }}>קיבלנו!</h3>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>
                נחזור אליכם תוך 24 שעות<br />עם הצעה מותאמת אישית
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", marginBottom: 4 }}>השאירו פרטים</h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.9rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 5 }}>שם *</label>
                  <input required className="field" value={form.name} onChange={e => set("name", e.target.value)} placeholder="שם מלא" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 5 }}>מוסד *</label>
                  <input required className="field" value={form.institution} onChange={e => set("institution", e.target.value)} placeholder="בית ספר / גן" />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 5 }}>טלפון *</label>
                <input required className="field" type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="05X-XXXXXXX" style={{ direction: "ltr" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 5 }}>פעילות מעניינת</label>
                <select className="field" value={form.activity} onChange={e => set("activity", e.target.value)}>
                  <option value="">כל הפעילויות / לא בטוח עדיין</option>
                  {ACTIVITIES.map(a => <option key={a.slug} value={a.slug}>{a.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 5 }}>הערות</label>
                <textarea className="field" rows={3} value={form.notes} onChange={e => set("notes", e.target.value)}
                  placeholder="מספר ילדים, תאריך מועדף, שאלות..." style={{ resize: "none" }} />
              </div>

              <button type="submit" disabled={loading} className="btn-red" style={{
                width: "100%", fontSize: 15, padding: "14px 0",
                opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer",
                borderRadius: 3,
              }}>
                {loading ? "שולח..." : "שלחו פרטים →"}
              </button>

              <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center" }}>
                לטופס הזמנה מפורט —{" "}
                <Link href="/book" style={{ color: "#CC2222", textDecoration: "none" }}>לחצו כאן</Link>
              </p>
            </form>
          )}
        </div>
      </div>
      <style>{`@media(max-width:768px){.contact-grid{grid-template-columns:1fr !important; gap:2rem !important;}}`}</style>
    </section>
  );
}
