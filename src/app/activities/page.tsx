"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ACTIVITIES, TYPE_LABELS, SEASON_LABELS, ActivityType } from "@/lib/data";

const SEASON_FILTERS = [
  { id: "all", label: "הכל" },
  { id: "rosh_hashana", label: "ראש השנה" },
  { id: "hanuka", label: "חנוכה" },
  { id: "pesach", label: "פסח" },
  { id: "summer", label: "קיץ" },
  { id: "all_year", label: "כל השנה" },
];
const TYPE_FILTERS: { id: "" | ActivityType; label: string }[] = [
  { id: "", label: "כל הסוגים" },
  { id: "WORKSHOP", label: "סדנה" },
  { id: "SHOW", label: "הצגה" },
  { id: "GAME", label: "משחק" },
  { id: "FOOD", label: "בישול" },
];

export default function ActivitiesPage() {
  const [search, setSearch] = useState("");
  const [season, setSeason] = useState("all");
  const [type, setType] = useState<"" | ActivityType>("");
  const [gafan, setGafan] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const filtered = useMemo(() => ACTIVITIES.filter(a => {
    if (search && !a.name.includes(search) && !a.shortDescription.includes(search)) return false;
    if (season !== "all" && !a.seasons.includes(season)) return false;
    if (type && a.type !== type) return false;
    if (gafan && !a.isGafan) return false;
    return true;
  }), [search, season, type, gafan]);

  const pill = (active: boolean, color = "#CC2222") => ({
    border: `1.5px solid ${active ? color : "#d1d5db"}`,
    background: active ? color : "#fff",
    color: active ? "#fff" : "#374151",
    borderRadius: 3, padding: "5px 14px",
    fontSize: 12, fontWeight: active ? 600 : 400,
    cursor: "pointer" as const,
    fontFamily: "Rubik, sans-serif",
    transition: "all 0.15s",
  });

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #1a2340 0%, #8B1A1A 100%)",
        padding: "6rem 2rem 3rem",
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(204,34,34,0.25)", color: "#fca5a5", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 4, marginBottom: 12, border: "1px solid rgba(204,34,34,0.3)" }}>
            קטלוג פעילויות
          </div>
          <h1 style={{ color: "#fff", fontSize: "clamp(26px,4vw,42px)", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: 10 }}>
            כל הפעילויות
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: "1.75rem" }}>
            סדנאות, הצגות, משחקים ובישול – לכל גיל, עונה וחג
          </p>
          <div style={{ position: "relative", maxWidth: 420 }}>
            <input type="text" placeholder="🔍 חפש פעילות..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "11px 18px", borderRadius: 3, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 13, fontFamily: "Rubik, sans-serif", outline: "none", direction: "rtl" }} />
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0.85rem 2rem", position: "sticky", top: 72, zIndex: 30, boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ color: "#9ca3af", fontSize: 11, fontWeight: 600 }}>עונה:</span>
          {SEASON_FILTERS.map(f => (
            <button key={f.id} onClick={() => setSeason(f.id)} style={pill(season === f.id)}>{f.label}</button>
          ))}
          <div style={{ width: 1, height: 18, background: "#e5e7eb", margin: "0 4px" }} />
          <span style={{ color: "#9ca3af", fontSize: 11, fontWeight: 600 }}>סוג:</span>
          {TYPE_FILTERS.map(f => (
            <button key={f.id} onClick={() => setType(f.id)} style={pill(type === f.id, "#1a2340")}>{f.label}</button>
          ))}
          <button onClick={() => setGafan(!gafan)} style={pill(gafan, "#15803d")}>🌿 גפ&quot;ן</button>
          <span style={{ marginRight: "auto", color: "#9ca3af", fontSize: 11 }}>{filtered.length} פעילויות</span>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "2.5rem 2rem" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 0", color: "#9ca3af" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#374151" }}>לא נמצאו פעילויות</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>נסה לשנות את הסינון</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
            {filtered.map((a, i) => (
              <div key={a.id} className="act-card"
                style={{ animation: `fadeUp 0.5s ease ${i * 0.07}s both` }}
                onMouseEnter={() => setHovered(a.id)} onMouseLeave={() => setHovered(null)}>
                {/* Visual */}
                <div style={{ height: 180, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${a.grad1} 0%, ${a.grad2} 100%)`, opacity: hovered === a.id ? 0 : 1, transition: "opacity 0.55s", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 72, opacity: 0.25 }}>{a.emoji}</span>
                  </div>
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${a.grad1h} 0%, ${a.grad2h} 100%)`, opacity: hovered === a.id ? 1 : 0, transition: "opacity 0.55s", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 72, opacity: 0.3 }}>{a.emoji}</span>
                  </div>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.4) 0%,transparent 60%)" }} />
                  <div style={{ position: "absolute", top: 10, right: 10, left: 10, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ background: "rgba(255,255,255,0.92)", color: "#374151", fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4 }}>{TYPE_LABELS[a.type]}</span>
                    {a.isGafan && <span style={{ background: "#CC2222", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 2 }}>גפ&quot;ן</span>}
                  </div>
                  <div style={{ position: "absolute", bottom: 10, right: 12, fontSize: 26 }}>{a.emoji}</div>
                </div>
                {/* Body */}
                <div style={{ padding: "14px 16px 16px" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 5, letterSpacing: "-0.3px" }}>{a.name}</h3>
                  <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.55, marginBottom: 12 }}>{a.shortDescription}</p>
                  <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                    {[{ t: "⏱", v: `${a.duration} דק'` }, { t: "👥", v: `עד ${a.maxParticipants}` }, { t: "🎂", v: `${a.minAge}–${a.maxAge}` }].map((m, j) => (
                      <span key={j} style={{ fontSize: 11, color: "#9ca3af" }}>{m.t} {m.v}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link href={`/book?activity=${a.slug}`} className="btn-red" style={{ flex: 1, textAlign: "center", fontSize: 12, padding: "8px 0" }}>להזמנה</Link>
                    <Link href={`/activities/${a.slug}`} style={{ flex: 0.8, textAlign: "center", fontSize: 12, fontWeight: 600, padding: "8px 0", background: "#f5f6f8", color: "#374151", borderRadius: 3, textDecoration: "none", border: "1px solid #e5e7eb" }}>פרטים ←</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
