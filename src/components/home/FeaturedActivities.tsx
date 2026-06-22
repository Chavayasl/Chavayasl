"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ACTIVITIES, TYPE_LABELS, type Activity } from "@/lib/data";
import { DEFAULT_CATEGORY_TREE, AGE_FILTERS, currentHolidayIndex, type CategoryGroup } from "@/lib/categories";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, v };
}

function Card({ a, i }: { a: typeof ACTIVITIES[0]; i: number }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="card" style={{ overflow: "hidden", animation: `fadeUp 0.5s ease ${Math.min(i, 8) * 0.06}s both` }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {/* Visual */}
      <div style={{ height: 190, position: "relative", overflow: "hidden", background: `linear-gradient(135deg,${a.grad1},${a.grad2})` }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,${a.grad1h},${a.grad2h})`, opacity: hov ? 1 : 0, transition: "opacity 0.4s" }} />
        {a.mainImage ? (
          <img src={a.mainImage} alt={a.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 72, opacity: 0.18 }}>{a.emoji}</span>
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.3) 0%,transparent 55%)" }} />
        <div style={{ position: "absolute", top: 12, right: 12, left: 12, display: "flex", justifyContent: "space-between" }}>
          <span style={{ background: "rgba(255,255,255,0.95)", color: "#374151", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 2 }}>{TYPE_LABELS[a.type]}</span>
          {a.isGafan && <span style={{ background: "#16a34a", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 2 }}>גפ&quot;ן</span>}
        </div>
        {a.isFeatured && (
          <div style={{ position: "absolute", bottom: 10, right: 12, background: "#FFD93D", color: "#0F172A", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 2 }}>מומלץ</div>
        )}
      </div>
      {/* Body */}
      <div style={{ padding: "16px 18px 18px" }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", marginBottom: 5 }}>{a.name}</h3>
        <p style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.55, marginBottom: 12 }}>{a.shortDescription}</p>
        <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
          {[{ t: "⏱", v: `${a.duration} דק'` }, { t: "👥", v: `עד ${a.maxParticipants}` }, { t: "🎂", v: `${a.minAge}–${a.maxAge}` }].map((m, j) => (
            <span key={j} style={{ fontSize: 11, color: "#94a3b8" }}>{m.t} {m.v}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href={`/book?activity=${a.slug}`} className="btn-red" style={{ flex: 1, fontSize: 12, padding: "9px 0", justifyContent: "center", borderRadius: 3 }}>להרשמה</Link>
          <Link href={`/activities/${a.slug}`} style={{ flex: 0.75, textAlign: "center", fontSize: 12, fontWeight: 600, padding: "9px 0", background: "#f5f6f8", color: "#374151", borderRadius: 3, textDecoration: "none" }}>פרטים ←</Link>
        </div>
      </div>
    </div>
  );
}

export function FeaturedActivities({ allActivities = ACTIVITIES, categoryTree = DEFAULT_CATEGORY_TREE }: { allActivities?: Activity[]; categoryTree?: CategoryGroup[] }) {
  const { ref, v } = useReveal();
  const [tabIdx, setTabIdx] = useState(0); // 0 = הכל, 1..n = groups[tabIdx-1]
  const [activeIdx, setActiveIdx] = useState(-1); // -1 = הכל (בתוך קטגוריה)
  const [ageFilter, setAgeFilter] = useState<string | null>(null); // null = כל הגילאים

  // הגיל הוא מסנן רוחבי — מסירים אותו מהקטגוריות הראשיות
  const groups = (categoryTree.length ? categoryTree : DEFAULT_CATEGORY_TREE).filter(g => g.id !== "age");
  const group = tabIdx === 0 ? null : groups[tabIdx - 1];
  const subs = group?.subs || [];

  const bySlugs = (slugs: string[]) => slugs.map(s => allActivities.find(a => a.slug === s)).filter(Boolean) as Activity[];

  // הפעילויות המסוננות — קטגוריה + תווית + גיל
  let activities: Activity[];
  if (!group) {
    activities = allActivities; // "הכל"
  } else if (subs.length > 0) {
    if (activeIdx >= 0 && subs[activeIdx]) {
      activities = bySlugs(subs[activeIdx].slugs);
    } else {
      const set = new Set([...group.slugs, ...subs.flatMap(s => s.slugs)]);
      activities = allActivities.filter(a => set.has(a.slug));
    }
  } else {
    activities = bySlugs(group.slugs);
  }
  if (ageFilter) {
    activities = activities.filter(a => (a.ageGroups as string[] | undefined)?.includes(ageFilter));
  }

  // מעבר טאב — בקטגוריית חגים בוחרים אוטומטית את החג הרלוונטי לתאריך
  const handleTab = (i: number) => {
    setTabIdx(i);
    const g = i === 0 ? null : groups[i - 1];
    setActiveIdx(g && g.id === "holidays" ? currentHolidayIndex(g.subs) : -1);
  };

  return (
    <section id="activities" style={{ background: "#f8fafc", padding: "4.5rem 2rem", scrollMarginTop: 72 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div ref={ref} style={{ textAlign: "center", marginBottom: "2.25rem", opacity: v ? 1 : 0, transform: v ? "none" : "translateY(16px)", transition: "all 0.6s" }}>
          <div className="sec-label">🎨 הפעילויות שלנו</div>
          <h2 className="sec-title" style={{ marginBottom: 10 }}>מצאו את הפעילות המתאימה</h2>
          <p style={{ fontSize: 15, color: "#64748b", maxWidth: 460, margin: "0 auto" }}>סננו לפי קטגוריה, חג או גיל הקהל — וגלו את הפעילות המושלמת עבורכם</p>
        </div>

        {/* Group tabs: הכל + קטגוריות ראשיות */}
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", borderBottom: "2px solid #e5e7eb", marginBottom: "1.5rem" }}>
          {[{ id: "__all__", label: "הכל" }, ...groups].map((g, i) => (
            <button key={g.id} onClick={() => handleTab(i)} style={{
              padding: "11px 22px", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer",
              borderBottom: `2px solid ${tabIdx === i ? "#CC2222" : "transparent"}`, marginBottom: -2,
              background: "transparent", fontFamily: "Rubik, sans-serif",
              color: tabIdx === i ? "#CC2222" : "#64748b", transition: "color 0.15s",
            }}>{g.label}</button>
          ))}
        </div>

        {/* מסנן גיל (רוחבי) */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", alignItems: "center", marginBottom: "1rem" }}>
          <span style={{ fontSize: 12.5, color: "#94a3b8", fontWeight: 600 }}>גיל:</span>
          <Chip active={!ageFilter} color="#2563EB" onClick={() => setAgeFilter(null)}>כל הגילאים</Chip>
          {AGE_FILTERS.map(af => (
            <Chip key={af.id} active={ageFilter === af.id} color="#2563EB" onClick={() => setAgeFilter(af.id)}>{af.label}</Chip>
          ))}
        </div>

        {/* Filter chips: תת-קטגוריות (רק כשיש) */}
        {subs.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: "1.25rem" }}>
            <Chip active={activeIdx === -1} onClick={() => setActiveIdx(-1)}>הכל</Chip>
            {subs.map((item, i) => (
              <Chip key={item.id} active={activeIdx === i} onClick={() => setActiveIdx(i)}>
                {item.emoji && <span style={{ marginLeft: 4 }}>{item.emoji}</span>}
                {item.label}
              </Chip>
            ))}
          </div>
        )}

        {/* Count */}
        <div style={{ textAlign: "center", fontSize: 12.5, color: "#94a3b8", marginBottom: "1.75rem" }}>
          {activities.length} פעילויות
        </div>

        {/* Grid */}
        {activities.length > 0 ? (
          <div key={`${tabIdx}-${activeIdx}`} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 22 }}>
            {activities.map((a, i) => <Card key={a.id} a={a} i={i} />)}
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "#94a3b8", fontSize: 14, padding: "2rem 0" }}>אין פעילויות מתאימות כרגע</div>
        )}

      </div>
    </section>
  );
}

function Chip({ active, onClick, children, color = "#CC2222" }: { active: boolean; onClick: () => void; children: React.ReactNode; color?: string }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 18px", borderRadius: 3, fontSize: 13, fontWeight: 600,
      border: `1.5px solid ${active ? color : "#e2e8f0"}`,
      background: active ? color : "#fff",
      color: active ? "#fff" : "#475569",
      cursor: "pointer", fontFamily: "Rubik, sans-serif", transition: "all 0.15s",
    }}>{children}</button>
  );
}
