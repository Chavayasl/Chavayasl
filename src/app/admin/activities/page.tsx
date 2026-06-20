"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SEASON_LABELS, type Activity } from "@/lib/data";

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  const load = () => fetch("/api/admin/activities").then(r => r.json()).then(d => { setActivities(d); setLoading(false); });
  useEffect(() => { load(); }, []);

  const allSelected = activities.length > 0 && selected.size === activities.length;
  const toggleOne = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(activities.map(a => a.id)));
  const clearSel = () => setSelected(new Set());

  const warnIfNotPersisted = (persisted: boolean) => {
    if (!persisted) alert("⚠️ הפעולה בוצעה בתצוגה אך לא נשמרה בשרת (באתר החי צריך מסד נתונים). בריענון השינוי יחזור.");
  };

  // פעולה מרובה
  const bulk = async (action: string, value?: string) => {
    if (selected.size === 0) return;
    if (action === "delete" && !confirm(`למחוק ${selected.size} פעילויות?`)) return;
    setBusy(true);
    const res = await fetch("/api/admin/activities", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [...selected], action, value }),
    }).then(r => r.json()).catch(() => null);
    setBusy(false);
    clearSel();
    await load();
    if (res) warnIfNotPersisted(res.persisted);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`למחוק את "${name}"?`)) return;
    await fetch(`/api/admin/activities/${id}`, { method: "DELETE" });
    load();
  };

  const toggleFeatured = async (a: Activity) => {
    await fetch(`/api/admin/activities/${a.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: !a.isFeatured }),
    });
    load();
  };

  const COLS = "auto 2fr 1fr 1fr 1fr auto";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A" }}>פעילויות</h1>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>{activities.length} פעילויות במערכת</p>
        </div>
        <Link href="/admin/activities/new" className="btn-red" style={{ fontSize: 13, padding: "10px 20px", borderRadius: 3 }}>
          + פעילות חדשה
        </Link>
      </div>

      {/* סרגל פעולות מרובות */}
      {selected.size > 0 && (
        <div style={{
          position: "sticky", top: 12, zIndex: 20, marginBottom: 14,
          background: "#0F172A", color: "#fff", borderRadius: 10, padding: "12px 16px",
          display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
          boxShadow: "0 8px 24px rgba(15,23,42,0.25)",
        }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>{selected.size} נבחרו</span>
          <div style={{ width: 1, height: 22, background: "rgba(255,255,255,0.2)" }} />

          <button onClick={() => bulk("feature")} disabled={busy} style={barBtn}>⭐ סמן מומלץ</button>
          <button onClick={() => bulk("unfeature")} disabled={busy} style={barBtn}>בטל מומלץ</button>

          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            שייך לחג/עונה:
            <select disabled={busy} defaultValue="" onChange={e => { if (e.target.value) { bulk("addSeason", e.target.value); e.target.value = ""; } }}
              style={{ background: "#1e293b", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, padding: "6px 10px", fontSize: 13, fontFamily: "Rubik, sans-serif", cursor: "pointer" }}>
              <option value="">בחר…</option>
              {Object.entries(SEASON_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
          </label>

          <button onClick={() => bulk("delete")} disabled={busy} style={{ ...barBtn, background: "#CC2222", borderColor: "#CC2222" }}>🗑️ מחק נבחרים</button>

          <button onClick={clearSel} style={{ ...barBtn, marginInlineStart: "auto", background: "transparent", border: "1px solid rgba(255,255,255,0.25)" }}>נקה בחירה</button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>טוען...</div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 4, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: COLS, gap: 16, padding: "0.75rem 1.25rem", background: "#f8fafc", borderBottom: "1px solid #e5e7eb", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", alignItems: "center" }}>
            <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="בחר הכל" style={{ width: 16, height: 16, accentColor: "#CC2222", cursor: "pointer" }} />
            <span>פעילות</span><span>סוג</span><span>גיל</span><span>מומלץ</span><span></span>
          </div>

          {activities.map(a => {
            const isSel = selected.has(a.id);
            return (
              <div key={a.id} style={{ display: "grid", gridTemplateColumns: COLS, gap: 16, padding: "0.9rem 1.25rem", borderBottom: "1px solid #f8fafc", alignItems: "center", background: isSel ? "#fef2f2" : "#fff" }}>
                <input type="checkbox" checked={isSel} onChange={() => toggleOne(a.id)} aria-label={`בחר ${a.name}`} style={{ width: 16, height: 16, accentColor: "#CC2222", cursor: "pointer" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 4, background: `linear-gradient(135deg,${a.grad1},${a.grad2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    {a.emoji}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{a.slug}</div>
                  </div>
                </div>
                <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
                  {a.type === "WORKSHOP" ? "סדנה" : a.type === "SHOW" ? "הצגה" : a.type === "GAME" ? "משחק" : "בישול"}
                </span>
                <span style={{ fontSize: 12, color: "#64748b" }}>{a.minAge}–{a.maxAge}</span>
                <button onClick={() => toggleFeatured(a)} style={{
                  padding: "4px 12px", borderRadius: 3, fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer",
                  background: a.isFeatured ? "#fef2f2" : "#f8fafc", color: a.isFeatured ? "#CC2222" : "#94a3b8", fontFamily: "Rubik, sans-serif",
                }}>
                  {a.isFeatured ? "⭐ מומלץ" : "לא מומלץ"}
                </button>
                <div style={{ display: "flex", gap: 6 }}>
                  <Link href={`/admin/activities/${a.id}`} style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", textDecoration: "none", padding: "5px 10px", border: "1px solid #bfdbfe", borderRadius: 3 }}>
                    עריכה
                  </Link>
                  <button onClick={() => handleDelete(a.id, a.name)} style={{
                    fontSize: 12, fontWeight: 600, color: "#CC2222", background: "none", padding: "5px 10px",
                    border: "1px solid #fecaca", borderRadius: 3, cursor: "pointer", fontFamily: "Rubik, sans-serif",
                  }}>
                    מחיקה
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const barBtn: React.CSSProperties = {
  background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 6, padding: "7px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
  fontFamily: "Rubik, sans-serif", whiteSpace: "nowrap",
};
