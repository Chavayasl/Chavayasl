"use client";
import { useEffect, useState } from "react";

interface Booking {
  id: string; contactName: string; institution: string; phone: string;
  email: string; activityId: string; preferredDate: string; alternativeDate?: string;
  participantsCount: string; ageGroup: string; notes?: string;
  status: "new" | "contacted" | "confirmed" | "cancelled"; createdAt: string;
}

const STATUS_OPTS = [
  { v: "new",       l: "חדש",    bg: "#fef2f2", color: "#CC2222" },
  { v: "contacted", l: "טופל",   bg: "#eff6ff", color: "#2563EB" },
  { v: "confirmed", l: "אושר",   bg: "#f0fdf4", color: "#16a34a" },
  { v: "cancelled", l: "בוטל",   bg: "#f8fafc", color: "#94a3b8" },
];

const AGE_LABELS: Record<string, string> = { AGE_3_5: "3–5", AGE_6_8: "6–8", AGE_9_12: "9–12", MIXED: "מעורב" };

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = () => fetch("/api/admin/bookings").then(r => r.json()).then(d => { setBookings(d); setLoading(false); });
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    load();
  };

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A" }}>הזמנות</h1>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>{bookings.filter(b => b.status === "new").length} הזמנות חדשות</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #e5e7eb", marginBottom: "1.5rem" }}>
        {[{ v: "all", l: `הכל (${bookings.length})` }, ...STATUS_OPTS.map(s => ({ v: s.v, l: `${s.l} (${bookings.filter(b => b.status === s.v).length})` }))].map(tab => (
          <button key={tab.v} onClick={() => setFilter(tab.v)} style={{
            padding: "10px 18px", border: "none", borderBottom: `2px solid ${filter === tab.v ? "#CC2222" : "transparent"}`,
            marginBottom: -2, background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600,
            color: filter === tab.v ? "#CC2222" : "#64748b", fontFamily: "Rubik, sans-serif",
          }}>{tab.l}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>טוען...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 4 }}>אין הזמנות</div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 4, overflow: "hidden" }}>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr 1fr auto", gap: 12, padding: "0.75rem 1.25rem", background: "#f8fafc", borderBottom: "1px solid #e5e7eb", fontSize: 11, fontWeight: 700, color: "#64748b" }}>
            <span>שם / מוסד</span><span>טלפון</span><span>תאריך</span><span>משתתפים</span><span>סטטוס</span><span></span>
          </div>

          {filtered.map(b => {
            const st = STATUS_OPTS.find(s => s.v === b.status) || STATUS_OPTS[0];
            const isExp = expanded === b.id;
            return (
              <div key={b.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr 1fr auto", gap: 12, padding: "0.9rem 1.25rem", alignItems: "center", cursor: "pointer" }}
                  onClick={() => setExpanded(isExp ? null : b.id)}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{b.contactName}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{b.institution}</div>
                  </div>
                  <div style={{ fontSize: 13, color: "#334155", direction: "ltr" }}>{b.phone}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{b.preferredDate || "—"}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{b.participantsCount} ילדים<br /><span style={{ fontSize: 11 }}>{AGE_LABELS[b.ageGroup] || b.ageGroup}</span></div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", background: st.bg, color: st.color, borderRadius: 3, whiteSpace: "nowrap" }}>{st.l}</span>
                  <span style={{ fontSize: 16, color: "#94a3b8" }}>{isExp ? "▲" : "▼"}</span>
                </div>

                {isExp && (
                  <div style={{ padding: "1rem 1.25rem 1.5rem", background: "#f8fafc", borderTop: "1px solid #f1f5f9" }}>
                    {b.notes && <p style={{ fontSize: 13, color: "#475569", marginBottom: 12, lineHeight: 1.6 }}><strong>הערות:</strong> {b.notes}</p>}
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>
                      <span>📧 {b.email}</span>
                      {b.alternativeDate && <span style={{ marginRight: 16 }}>📅 חלופי: {b.alternativeDate}</span>}
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {STATUS_OPTS.map(s => (
                        <button key={s.v} onClick={() => updateStatus(b.id, s.v)} style={{
                          padding: "6px 14px", borderRadius: 3, fontSize: 12, fontWeight: 600, cursor: "pointer",
                          fontFamily: "Rubik, sans-serif",
                          border: `1.5px solid ${b.status === s.v ? s.color : "#e2e8f0"}`,
                          background: b.status === s.v ? s.bg : "#fff",
                          color: b.status === s.v ? s.color : "#64748b",
                        }}>{s.l}</button>
                      ))}
                      <a href={`https://wa.me/972${b.phone.replace(/^0/, "").replace(/-/g, "")}`} target="_blank" rel="noopener noreferrer"
                        style={{ padding: "6px 14px", borderRadius: 3, fontSize: 12, fontWeight: 600, background: "#25D366", color: "#fff", textDecoration: "none" }}>
                        💬 וואטסאפ
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
