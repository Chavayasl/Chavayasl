"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  activities: number;
  bookings: number;
  contacts: number;
  newBookings: number;
  newContacts: number;
}

interface Booking {
  id: string; contactName: string; institution: string;
  activityId: string; preferredDate: string; status: string; createdAt: string;
}

interface Contact {
  id: string; name: string; institution: string;
  phone: string; status: string; createdAt: string;
}

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  new:       { bg: "#fef2f2", color: "#CC2222", label: "חדש" },
  contacted: { bg: "#eff6ff", color: "#2563EB", label: "טופל" },
  confirmed: { bg: "#f0fdf4", color: "#16a34a", label: "אושר" },
  cancelled: { bg: "#f8fafc", color: "#94a3b8", label: "בוטל" },
  done:      { bg: "#f0fdf4", color: "#16a34a", label: "סגור" },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/activities").then(r => r.json()),
      fetch("/api/admin/bookings").then(r => r.json()),
      fetch("/api/admin/contacts").then(r => r.json()),
    ]).then(([acts, bks, ctcs]) => {
      setStats({
        activities: acts.length,
        bookings: bks.length,
        contacts: ctcs.length,
        newBookings: bks.filter((b: Booking) => b.status === "new").length,
        newContacts: ctcs.filter((c: Contact) => c.status === "new").length,
      });
      setBookings(bks.slice(0, 5));
      setContacts(ctcs.slice(0, 5));
    });
  }, []);

  const STAT_CARDS = [
    { label: "פעילויות", value: stats?.activities ?? "–", icon: "🎯", color: "#CC2222", link: "/admin/activities" },
    { label: "הזמנות", value: stats?.bookings ?? "–", icon: "📋", color: "#2563EB", link: "/admin/bookings", badge: stats?.newBookings },
    { label: "פניות", value: stats?.contacts ?? "–", icon: "📬", color: "#16a34a", link: "/admin/contacts", badge: stats?.newContacts },
  ];

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A" }}>דשבורד</h1>
        <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>סקירה כללית של המערכת</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: "2.5rem" }} className="stat-grid">
        {STAT_CARDS.map(card => (
          <Link key={card.label} href={card.link} style={{ textDecoration: "none" }}>
            <div style={{
              background: "#fff", border: "1px solid #e5e7eb", borderRadius: 4,
              padding: "1.25rem 1.5rem", display: "flex", alignItems: "center",
              justifyContent: "space-between", cursor: "pointer",
              transition: "box-shadow 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
            >
              <div>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, marginBottom: 6 }}>{card.label}</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: card.color, lineHeight: 1 }}>{card.value}</div>
                {card.badge && card.badge > 0 ? (
                  <div style={{ fontSize: 11, color: "#CC2222", marginTop: 6, fontWeight: 600 }}>
                    {card.badge} חדש{card.badge > 1 ? "ים" : ""}
                  </div>
                ) : null}
              </div>
              <div style={{ fontSize: 36, opacity: 0.15 }}>{card.icon}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Tables row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="tables-grid">
        {/* Recent bookings */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 4 }}>
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>הזמנות אחרונות</h2>
            <Link href="/admin/bookings" style={{ fontSize: 12, color: "#CC2222", textDecoration: "none", fontWeight: 600 }}>הכל ←</Link>
          </div>
          {bookings.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>אין הזמנות עדיין</div>
          ) : (
            bookings.map(b => {
              const st = STATUS_COLORS[b.status] || STATUS_COLORS.new;
              return (
                <div key={b.id} style={{ padding: "0.75rem 1.25rem", borderBottom: "1px solid #f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{b.contactName}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{b.institution}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", background: st.bg, color: st.color, borderRadius: 3 }}>{st.label}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Recent contacts */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 4 }}>
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>פניות אחרונות</h2>
            <Link href="/admin/contacts" style={{ fontSize: 12, color: "#CC2222", textDecoration: "none", fontWeight: 600 }}>הכל ←</Link>
          </div>
          {contacts.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>אין פניות עדיין</div>
          ) : (
            contacts.map(c => {
              const st = STATUS_COLORS[c.status] || STATUS_COLORS.new;
              return (
                <div key={c.id} style={{ padding: "0.75rem 1.25rem", borderBottom: "1px solid #f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{c.phone}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", background: st.bg, color: st.color, borderRadius: 3 }}>{st.label}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/admin/activities/new" className="btn-red" style={{ fontSize: 13, padding: "10px 20px", borderRadius: 3 }}>
          + הוסף פעילות
        </Link>
      </div>

      <style>{`
        @media(max-width:640px){
          .stat-grid{grid-template-columns:1fr !important}
          .tables-grid{grid-template-columns:1fr !important}
        }
      `}</style>
    </div>
  );
}
