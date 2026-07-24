"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ACTIVITIES, TYPE_LABELS, type Activity } from "@/lib/data";
import { DEFAULT_CATEGORY_TREE, AGE_FILTERS, currentHolidayIndex, type CategoryGroup } from "@/lib/categories";
import { ytId, ytEmbed } from "@/lib/media";

// עונה נוכחית לפי חודש הכניסה (ישראל / חצי כדור צפוני)
function currentSeason(): string {
  const m = new Date().getMonth(); // 0 = ינואר
  if (m <= 1 || m === 11) return "winter";  // דצמבר–פברואר
  if (m <= 4) return "spring";              // מרץ–מאי
  if (m <= 7) return "summer";              // יוני–אוגוסט
  return "autumn";                          // ספטמבר–נובמבר
}

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
  const hoverImg = a.secondImage ?? a.gallery?.find(g => g !== a.mainImage) ?? a.gallery?.[0];
  const cardVideo = a.heroVideo;               // הסרטון שהמנהל הגדיר — מתנגן ללא שמע
  const yt = cardVideo ? ytId(cardVideo) : null;
  return (
    <Link href={`/activities/${a.slug}`} className="card" style={{ overflow: "hidden", textDecoration: "none", color: "inherit", cursor: "pointer", animation: `fadeUp 0.5s ease ${Math.min(i, 8) * 0.06}s both`, transition: "transform 0.25s ease, box-shadow 0.25s", transform: hov ? "translateY(-5px) scale(1.02)" : "none" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {/* Visual — סרטון מתנגן כברירת מחדל, בריחוף מוצגת התמונה הראשית */}
      <div style={{ height: 190, position: "relative", overflow: "hidden", background: `linear-gradient(135deg,${a.grad1},${a.grad2})` }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,${a.grad1h},${a.grad2h})`, opacity: hov ? 1 : 0, transition: "opacity 0.4s" }} />
        {cardVideo ? (
          <>
            {yt
              ? <iframe src={ytEmbed(yt, { autoplay: true, mute: true, loop: true, controls: false })} title={a.name} allow="autoplay; encrypted-media" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", pointerEvents: "none" }} />
              : <video src={cardVideo} autoPlay muted loop playsInline preload="metadata" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />}
            {a.mainImage && (
              <img src={a.mainImage} alt={a.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: hov ? 1 : 0, transition: "opacity 0.4s ease", pointerEvents: "none" }} />
            )}
          </>
        ) : a.mainImage ? (
          <>
            <img src={a.mainImage} alt={a.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            {hoverImg && hoverImg !== a.mainImage && (
              <img src={hoverImg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: hov ? 1 : 0, transition: "opacity 0.45s ease" }} />
            )}
          </>
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 72, opacity: 0.18 }}>{a.emoji}</span>
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.3) 0%,transparent 55%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 12, right: 12, left: 12, display: "flex", justifyContent: "flex-start", pointerEvents: "none" }}>
          <span style={{ background: "rgba(255,255,255,0.95)", color: "#374151", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 6 }}>{TYPE_LABELS[a.type]}</span>
        </div>
      </div>
      {/* Body */}
      <div className="card-body" style={{ padding: "16px 18px 18px" }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", marginBottom: 5 }}>{a.name}</h3>
        <p style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.55, marginBottom: 12 }}>{a.shortDescription}</p>
        <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
          {[{ t: "⏱", v: `${a.duration} דק'` }, { t: "👥", v: a.maxParticipants ? `עד ${a.maxParticipants}` : "ללא הגבלה" }, { t: "🎂", v: a.maxAge ? `${a.minAge}–${a.maxAge}` : `${a.minAge}+` }].map((m, j) => (
            <span key={j} style={{ fontSize: 11, color: "#94a3b8" }}>{m.t} {m.v}</span>
          ))}
        </div>
        <div className="card-btns" style={{ display: "flex", justifyContent: "flex-end", paddingTop: 4 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 800, color: "#CC2222" }}>
            לצפייה בפעילות ←
          </span>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedActivities({ allActivities = ACTIVITIES, categoryTree = DEFAULT_CATEGORY_TREE }: { allActivities?: Activity[]; categoryTree?: CategoryGroup[] }) {
  const { ref, v } = useReveal();
  const [tabIdx, setTabIdx] = useState(0); // 0 = הכל, 1..n = groups[tabIdx-1]
  const [activeIdx, setActiveIdx] = useState(-1); // -1 = הכל (בתוך קטגוריה)
  const [ageFilter, setAgeFilter] = useState<string | null>(null); // null = כל הגילאים
  const [showAll, setShowAll] = useState(false); // ברירת מחדל: 3 פעילויות + "הצג עוד"
  useEffect(() => { setShowAll(false); }, [tabIdx, activeIdx, ageFilter]);

  // הגיל הוא מסנן רוחבי — מסירים אותו מהקטגוריות הראשיות
  const groups = (categoryTree.length ? categoryTree : DEFAULT_CATEGORY_TREE).filter(g => g.id !== "age");
  const group = tabIdx === 0 ? null : groups[tabIdx - 1];
  const subs = group?.subs || [];

  // הפעילויות המסוננות — לפי שדות הפעילות (categories/seasons), עם תאימות לאחור ל-slugs
  let activities: Activity[];
  if (!group) {
    activities = allActivities; // "הכל"
  } else if (subs.length > 0) {
    // קטגוריה עם תוויות (חגים)
    if (activeIdx >= 0 && subs[activeIdx]) {
      const sub = subs[activeIdx];
      activities = allActivities.filter(a => a.seasons?.includes(sub.id) || sub.slugs.includes(a.slug));
    } else {
      const holidayIds = subs.map(s => s.id);
      const allSlugs = new Set([...group.slugs, ...subs.flatMap(s => s.slugs)]);
      activities = allActivities.filter(a => a.seasons?.some(s => holidayIds.includes(s)) || a.categories?.includes(group.id) || allSlugs.has(a.slug));
    }
  } else {
    // קטגוריה תמטית
    activities = allActivities.filter(a => a.categories?.includes(group.id) || group.slugs.includes(a.slug));
  }
  if (ageFilter) {
    activities = activities.filter(a => a.ageGroups?.includes(ageFilter) || a.ageGroups?.includes("multi"));
  }

  // מיון לפי העונה הנוכחית (לפי תאריך הכניסה): עונה נוכחית קודם → כל השנה → שאר העונות
  const cs = currentSeason();
  const seasonRank = (a: Activity) => (a.season === cs ? 0 : (!a.season || a.season === "all_year") ? 1 : 2);
  activities = [...activities].sort((x, y) => seasonRank(x) - seasonRank(y));

  const shown = showAll ? activities : activities.slice(0, 3);

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
          <h2 className="sec-title" style={{ marginBottom: 10 }}>הפעילויות שלנו</h2>
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
          <div key={`${tabIdx}-${activeIdx}`} className="acts-grid">
            {shown.map((a, i) => <Card key={a.id} a={a} i={i} />)}
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "#94a3b8", fontSize: 14, padding: "2rem 0" }}>אין פעילויות מתאימות כרגע</div>
        )}

        {/* הצג עוד */}
        {!showAll && activities.length > 3 && (
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <button onClick={() => setShowAll(true)}
              style={{ padding: "13px 38px", fontSize: 15, fontWeight: 700, background: "#CC2222", color: "#fff", border: "none", borderRadius: 30, cursor: "pointer", fontFamily: "Rubik, sans-serif", boxShadow: "0 8px 22px rgba(204,34,34,0.28)" }}>
              הצג עוד פעילויות ({activities.length - 3}+)
            </button>
          </div>
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
