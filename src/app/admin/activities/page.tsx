"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Activity } from "@/lib/data";

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => fetch("/api/admin/activities").then(r => r.json()).then(d => { setActivities(d); setLoading(false); });
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`למחוק את "${name}"?`)) return;
    await fetch(`/api/admin/activities/${id}`, { method: "DELETE" });
    load();
  };

  const toggleFeatured = async (a: Activity) => {
    await fetch(`/api/admin/activities/${a.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: !a.isFeatured }),
    });
    load();
  };

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

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>טוען...</div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 4, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 16, padding: "0.75rem 1.25rem", background: "#f8fafc", borderBottom: "1px solid #e5e7eb", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em" }}>
            <span>פעילות</span><span>סוג</span><span>גיל</span><span>מומלץ</span><span></span>
          </div>

          {activities.map(a => (
            <div key={a.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 16, padding: "0.9rem 1.25rem", borderBottom: "1px solid #f8fafc", alignItems: "center" }}>
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
                background: a.isFeatured ? "#fef2f2" : "#f8fafc",
                color: a.isFeatured ? "#CC2222" : "#94a3b8",
                fontFamily: "Rubik, sans-serif",
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
          ))}
        </div>
      )}
    </div>
  );
}
