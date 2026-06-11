"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ACTIVITIES } from "@/lib/data";

function BookForm() {
  const searchParams = useSearchParams();
  const preSelected = searchParams.get("activity") || "";
  const [form, setForm] = useState({
    contactName: "", institution: "", phone: "", email: "",
    activityId: preSelected, preferredDate: "", alternativeDate: "",
    participantsCount: "", ageGroup: "", notes: "",
    consentSms: false, consentEmail: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consentSms) { alert("יש לאשר קבלת SMS לאישור ההזמנה"); return; }
    setLoading(true);
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    await fetch("/api/admin/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, id }),
    }).catch(() => null);
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) return (
    <div style={{ textAlign: "center", padding: "3rem 0" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontSize: 28, fontWeight: 900, color: "#111827", marginBottom: 10 }}>ההזמנה התקבלה!</h2>
      <p style={{ color: "#6b7280", fontSize: 15, marginBottom: 6 }}>נחזור אליכם תוך 24 שעות</p>
      <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 24 }}>SMS אישור נשלח למספר {form.phone}</p>
      <Link href="/activities" className="btn-red">חזרה לפעילויות</Link>
    </div>
  );

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: 3,
    border: "1.5px solid #d1d5db", fontSize: 13,
    fontFamily: "Rubik, sans-serif", color: "#111827",
    outline: "none", direction: "rtl" as const,
    transition: "border-color 0.2s",
  };

  const labelStyle = { display: "block" as const, fontWeight: 600, fontSize: 13, color: "#374151", marginBottom: 6 };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Activity */}
      <div>
        <label style={labelStyle}>פעילות מבוקשת *</label>
        <select required value={form.activityId} onChange={e => set("activityId", e.target.value)} style={inputStyle}>
          <option value="">בחר פעילות...</option>
          {ACTIVITIES.map(a => <option key={a.slug} value={a.slug}>{a.emoji} {a.name}</option>)}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={labelStyle}>שם איש הקשר *</label>
          <input required value={form.contactName} onChange={e => set("contactName", e.target.value)} placeholder="שם מלא" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>שם המוסד *</label>
          <input required value={form.institution} onChange={e => set("institution", e.target.value)} placeholder="בית ספר / גן..." style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>טלפון *</label>
          <input required type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="05X-XXXXXXX" style={{ ...inputStyle, direction: "ltr" }} />
        </div>
        <div>
          <label style={labelStyle}>אימייל *</label>
          <input required type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="your@email.com" style={{ ...inputStyle, direction: "ltr" }} />
        </div>
        <div>
          <label style={labelStyle}>תאריך מועדף *</label>
          <input required type="date" value={form.preferredDate} onChange={e => set("preferredDate", e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>תאריך חלופי</label>
          <input type="date" value={form.alternativeDate} onChange={e => set("alternativeDate", e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>מספר משתתפים *</label>
          <input required type="number" min={1} value={form.participantsCount} onChange={e => set("participantsCount", e.target.value)} placeholder="כמות ילדים" style={inputStyle} />
        </div>
      </div>

      {/* Age group */}
      <div>
        <label style={labelStyle}>קבוצת גיל *</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[{ v: "AGE_3_5", l: "גיל 3–5 (גן)" }, { v: "AGE_6_8", l: "גיל 6–8" }, { v: "AGE_9_12", l: "גיל 9–12" }, { v: "MIXED", l: "מעורב" }].map(opt => (
            <button key={opt.v} type="button" onClick={() => set("ageGroup", opt.v)} style={{
              padding: "8px 16px", borderRadius: 3, fontSize: 13, fontWeight: 600,
              border: `1.5px solid ${form.ageGroup === opt.v ? "#CC2222" : "#d1d5db"}`,
              background: form.ageGroup === opt.v ? "#CC2222" : "#fff",
              color: form.ageGroup === opt.v ? "#fff" : "#374151",
              cursor: "pointer", fontFamily: "Rubik, sans-serif", transition: "all 0.18s",
            }}>{opt.l}</button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label style={labelStyle}>הערות</label>
        <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={3}
          placeholder="כל מידע שחשוב לנו לדעת – מיקום, דרישות מיוחדות..." style={{ ...inputStyle, resize: "none" }} />
      </div>

      {/* Consent */}
      <div style={{ background: "#fff7ed", borderRadius: 3, padding: "1rem 1.25rem", border: "1px solid #fed7aa" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#9a3412", marginBottom: 10 }}>📋 אישורים נדרשים</p>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 8 }}>
          <input type="checkbox" required checked={form.consentSms} onChange={e => set("consentSms", e.target.checked)} style={{ width: 16, height: 16, marginTop: 1, accentColor: "#CC2222", flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>
            אני מאשר קבלת SMS לאישור ההזמנה ועדכונים שוטפים. *{" "}
            <Link href="/privacy" style={{ color: "#CC2222" }}>מדיניות פרטיות</Link>
          </span>
        </label>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
          <input type="checkbox" checked={form.consentEmail} onChange={e => set("consentEmail", e.target.checked)} style={{ width: 16, height: 16, marginTop: 1, accentColor: "#CC2222", flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: "#374151" }}>אני מאשר קבלת עדכונים ומבצעים למייל (אופציונלי)</span>
        </label>
      </div>

      <button type="submit" disabled={loading} className="btn-red" style={{ fontSize: 15, padding: "14px 0", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
        {loading ? "שולח..." : "📋 שלח הזמנה"}
      </button>
    </form>
  );
}

export default function BookPage() {
  return (
    <div style={{ background: "#f5f6f8", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#1a2340 0%,#8B1A1A 100%)", padding: "5.5rem 2rem 3rem" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "rgba(204,34,34,0.25)", color: "#fca5a5", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 4, marginBottom: 12, border: "1px solid rgba(204,34,34,0.3)" }}>
            הזמנת פעילות
          </div>
          <h1 style={{ color: "#fff", fontSize: "clamp(24px,4vw,38px)", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: 10 }}>הזמינו פעילות עכשיו</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>מלאו את הפרטים ונחזור אליכם תוך 24 שעות</p>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "2.5rem 2rem" }}>
        {/* Contact bar */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: "2rem" }}>
          <a href="tel:0556671997" style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 3, padding: "8px 16px", fontSize: 13, fontWeight: 600, color: "#374151", textDecoration: "none" }}>
            📞 055-667-1997
          </a>
          <a href="https://wa.me/972556671997" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, background: "#25D366", borderRadius: 3, padding: "8px 16px", fontSize: 13, fontWeight: 600, color: "#fff", textDecoration: "none" }}>
            💬 שלחו וואטסאפ
          </a>
        </div>

        {/* Form card */}
        <div style={{ background: "#fff", borderRadius: 4, padding: "2rem", border: "1px solid #e5e7eb" }}>
          <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center", color: "#9ca3af" }}>טוען...</div>}>
            <BookForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
