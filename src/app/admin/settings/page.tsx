"use client";
import { useEffect, useState } from "react";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/settings";

export default function SettingsAdmin() {
  const [s, setS] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetch("/api/settings").then(r => r.json()).then(d => { setS(d); setLoading(false); }); }, []);

  const setBooking = (patch: Partial<SiteSettings["booking"]>) => { setS(p => ({ ...p, booking: { ...p.booking, ...patch } })); setSaved(false); };

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) }).then(r => r.json()).catch(() => null);
    setSaving(false);
    if (res?.persisted) setSaved(true);
    else alert("⚠️ ההגדרה לא נשמרה (צריך טבלת categories ב-Supabase).");
  };

  if (loading) return <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>טוען...</div>;

  const input: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 13, fontFamily: "Rubik, sans-serif", color: "#0F172A", outline: "none", direction: "ltr", textAlign: "left" };
  const b = s.booking;

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", marginBottom: 4 }}>הגדרות</h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: "1.5rem" }}>שליטה בכפתור הזמנת הפעילות בכל האתר</p>

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "1.5rem" }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", marginBottom: 16 }}>🎟️ כפתור "הזמנת פעילות"</h2>

        {/* מצב */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8 }}>מה קורה בלחיצה?</div>
          {([
            ["iframe", "פתיחת קישור חיצוני בחלון (טופס Zoho / CRM)"],
            ["internal", "טופס ההזמנה של האתר (פנימי)"],
          ] as const).map(([val, label]) => (
            <label key={val} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginBottom: 8, borderRadius: 8, cursor: "pointer", border: `1.5px solid ${b.mode === val ? "#CC2222" : "#e5e7eb"}`, background: b.mode === val ? "#fef2f2" : "#fff" }}>
              <input type="radio" name="mode" checked={b.mode === val} onChange={() => setBooking({ mode: val })} style={{ accentColor: "#CC2222" }} />
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "#0F172A" }}>{label}</span>
            </label>
          ))}
        </div>

        {/* קישור (רק ל-iframe) */}
        {b.mode === "iframe" && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>קישור הטופס (Zoho / CRM)</div>
            <input style={input} value={b.url} onChange={e => setBooking({ url: e.target.value })} placeholder="https://forms.zohopublic.com/..." />
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>הקישור ייפתח בחלון מעל האתר. הליד נכנס ישירות למערכת שלכם.</div>
          </div>
        )}

        {/* טקסט הכפתור */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>טקסט הכפתור</div>
          <input style={{ ...input, direction: "rtl", textAlign: "right" }} value={b.buttonText} onChange={e => setBooking({ buttonText: e.target.value })} placeholder="להזמנת פעילות" />
        </div>

        <button onClick={save} disabled={saving} className="btn-red" style={{ padding: "11px 28px", borderRadius: 6, opacity: saving ? 0.6 : 1 }}>
          {saving ? "שומר..." : saved ? "נשמר ✓" : "💾 שמור"}
        </button>
      </div>
    </div>
  );
}
