"use client";
import { useEffect, useState } from "react";

interface Contact {
  id: string; name: string; institution: string; phone: string;
  activity?: string; notes?: string; status: "new" | "contacted" | "done"; createdAt: string;
}

const STATUS_OPTS = [
  { v: "new",       l: "חדש",  bg: "#fef2f2", color: "#CC2222" },
  { v: "contacted", l: "טופל", bg: "#eff6ff", color: "#2563EB" },
  { v: "done",      l: "סגור", bg: "#f0fdf4", color: "#16a34a" },
];

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = () => fetch("/api/admin/contacts").then(r => r.json()).then(d => { setContacts(d); setLoading(false); });
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/contacts", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    load();
  };

  const filtered = filter === "all" ? contacts : contacts.filter(c => c.status === filter);

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A" }}>פניות</h1>
        <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>{contacts.filter(c => c.status === "new").length} פניות חדשות</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #e5e7eb", marginBottom: "1.5rem" }}>
        {[{ v: "all", l: `הכל (${contacts.length})` }, ...STATUS_OPTS.map(s => ({ v: s.v, l: `${s.l} (${contacts.filter(c => c.status === s.v).length})` }))].map(tab => (
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
        <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 4 }}>אין פניות</div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr auto", gap: 12, padding: "0.75rem 1.25rem", background: "#f8fafc", borderBottom: "1px solid #e5e7eb", fontSize: 11, fontWeight: 700, color: "#64748b" }}>
            <span>שם</span><span>מוסד</span><span>טלפון</span><span>סטטוס</span><span></span>
          </div>

          {filtered.map(c => {
            const st = STATUS_OPTS.find(s => s.v === c.status) || STATUS_OPTS[0];
            const isExp = expanded === c.id;
            return (
              <div key={c.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr auto", gap: 12, padding: "0.9rem 1.25rem", alignItems: "center", cursor: "pointer" }}
                  onClick={() => setExpanded(isExp ? null : c.id)}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>{c.institution}</div>
                  <div style={{ fontSize: 13, direction: "ltr", color: "#334155" }}>{c.phone}</div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", background: st.bg, color: st.color, borderRadius: 3 }}>{st.l}</span>
                  <span style={{ fontSize: 16, color: "#94a3b8" }}>{isExp ? "▲" : "▼"}</span>
                </div>

                {isExp && (
                  <div style={{ padding: "1rem 1.25rem 1.5rem", background: "#f8fafc", borderTop: "1px solid #f1f5f9" }}>
                    {c.activity && <p style={{ fontSize: 13, color: "#475569", marginBottom: 8 }}><strong>פעילות:</strong> {c.activity}</p>}
                    {c.notes && <p style={{ fontSize: 13, color: "#475569", marginBottom: 12, lineHeight: 1.6 }}><strong>הערות:</strong> {c.notes}</p>}
                    <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 12 }}>
                      {new Date(c.createdAt).toLocaleDateString("he-IL", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {STATUS_OPTS.map(s => (
                        <button key={s.v} onClick={() => updateStatus(c.id, s.v)} style={{
                          padding: "6px 14px", borderRadius: 3, fontSize: 12, fontWeight: 600, cursor: "pointer",
                          fontFamily: "Rubik, sans-serif",
                          border: `1.5px solid ${c.status === s.v ? s.color : "#e2e8f0"}`,
                          background: c.status === s.v ? s.bg : "#fff",
                          color: c.status === s.v ? s.color : "#64748b",
                        }}>{s.l}</button>
                      ))}
                      <a href={`https://wa.me/972${c.phone.replace(/^0/, "").replace(/-/g, "")}`} target="_blank" rel="noopener noreferrer"
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
