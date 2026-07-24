"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SEASON_LABELS, type Activity } from "@/lib/data";
import { ytId, ytThumb } from "@/lib/media";
import { RichText } from "./RichText";
import { IconPicker } from "./IconPicker";

type FormData = Omit<Activity, "id" | "timeline" | "includes"> & { id?: string };

const DEFAULTS: FormData = {
  slug: "", name: "", type: "WORKSHOP",
  description: "", shortDescription: "",
  duration: 50, minAge: 3, maxAge: 12, maxParticipants: 100,
  seasons: [], tags: [], isGafan: false, isFeatured: false,
  grad1: "#CC2222", grad2: "#8B1A1A", grad1h: "#a81b1b", grad2h: "#6b1414",
  icon: "", emoji: "🎯",
  gallery: [], videos: [], videoTestimonials: [], waMessages: [], audioTestimonials: [],
  ageGroups: [], categories: [], languages: ["he"], gives: [], sellingPoints: [], season: "all_year",
};

const SEASON_OPTIONS = [
  { id: "all_year", label: "כל השנה" },
  { id: "winter", label: "חורף" },
  { id: "spring", label: "אביב" },
  { id: "summer", label: "קיץ" },
  { id: "autumn", label: "סתיו" },
];

const LANG_OPTIONS = [
  { id: "he", label: "עברית" },
  { id: "ru", label: "רוסית" },
  { id: "ar", label: "ערבית" },
];

// יצירת slug — שומר אותיות עברית (U+0590–U+05FF), אנגלית, ספרות ומקפים
function slugify(s: string): string {
  return s.trim().replace(/\s+/g, "-").replace(/[^\w֐-׿-]/g, "");
}

const LABEL: Record<string, string> = { WORKSHOP: "סדנה", SHOW: "הצגה", GAME: "משחק", FOOD: "בישול" };
const AGE_OPTIONS = [
  { id: "gan", label: "גנים" },
  { id: "yesodi", label: "יסודי" },
  { id: "hatam", label: "חטיבה" },
  { id: "multi", label: "רב גילאי" },
];
const CATEGORY_OPTIONS = [
  { id: "holidays", label: "חגים ומועדים" },
  { id: "science", label: "מדעים וטבע" },
  { id: "extreme", label: "אקסטרים" },
  { id: "shows", label: "מופעים" },
];

// ─── העלאת קובץ ל-Supabase Storage ───
async function uploadToServer(file: File, folder: string): Promise<string | null> {
  // 1. בקשת signed URL מהשרת (גוף קטן — לא חורג ממגבלת Vercel)
  const res = await fetch("/api/admin/upload", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, folder }),
  });
  if (!res.ok) return null;
  const { uploadUrl, publicUrl } = await res.json();
  // 2. העלאת הקובץ ישירות ל-Supabase (עוקף את מגבלת ה-4.5MB של Vercel)
  const up = await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": file.type || "application/octet-stream" }, body: file });
  if (!up.ok) { console.error("upload PUT failed", up.status); return null; }
  return publicUrl as string;
}

export function ActivityForm({ initial }: { initial?: Partial<Activity> }) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({ ...DEFAULTS, ...initial });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof FormData, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const toggleSeason = (s: string) =>
    set("seasons", form.seasons.includes(s) ? form.seasons.filter(x => x !== s) : [...form.seasons, s]);
  const toggleCategory = (id: string) => {
    const cur = form.categories || [];
    set("categories", cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]);
  };
  const toggleAge = (id: string) => {
    const cur = form.ageGroups || [];
    const LAYERS = ["gan", "yesodi", "hatam"];
    if (id === "multi") {
      // רב גילאי — בוחר/מבטל את כל שכבות הגיל
      set("ageGroups", cur.includes("multi") ? [] : ["gan", "yesodi", "hatam", "multi"]);
      return;
    }
    let next = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id];
    // אם כל השכבות מסומנות → מסמן גם "רב גילאי", אחרת מסיר אותו
    next = LAYERS.every(l => next.includes(l)) ? Array.from(new Set([...next, "multi"])) : next.filter(x => x !== "multi");
    set("ageGroups", next);
  };

  // עזרי מערכים — שימוש בעדכון פונקציונלי (קורא את הרשימה העדכנית, תומך בהעלאה מרובה)
  const arr = <T,>(k: keyof FormData): T[] => (form[k] as T[] | undefined) || [];
  const addTo = <T,>(k: keyof FormData, item: T) => setForm(f => ({ ...f, [k]: [...((f[k] as T[] | undefined) || []), item] }));
  const removeAt = (k: keyof FormData, i: number) => setForm(f => ({ ...f, [k]: ((f[k] as unknown[] | undefined) || []).filter((_, j) => j !== i) }));
  const updateAt = <T,>(k: keyof FormData, i: number, patch: Partial<T>) =>
    setForm(f => ({ ...f, [k]: ((f[k] as T[] | undefined) || []).map((it, j) => (j === i ? { ...it, ...patch } : it)) }));
  // גלריה — התמונה הראשונה הופכת אוטומטית לראשית; מחיקת הראשית מנקה אותה
  const addGalleryImage = (url: string) => setForm(f => { const imgs = (f.gallery as string[] | undefined) || []; return { ...f, gallery: [...imgs, url], mainImage: f.mainImage || url }; });
  const removeGalleryImage = (i: number) => setForm(f => { const imgs = (f.gallery as string[] | undefined) || []; const removed = imgs[i]; return { ...f, gallery: imgs.filter((_, j) => j !== i), mainImage: removed === f.mainImage ? undefined : f.mainImage, secondImage: removed === f.secondImage ? undefined : f.secondImage }; });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const isEdit = !!initial?.id;
    const url = isEdit ? `/api/admin/activities/${initial!.id}` : "/api/admin/activities";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      if (isEdit) {
        router.push("/admin/activities");
      } else {
        // אחרי יצירה — עוברים לעמוד העריכה של הפעילות החדשה (משם אפשר גם לצפות בדף הפעילות)
        const created = await res.json().catch(() => null);
        router.push(created?.id ? `/admin/activities/${created.id}` : "/admin/activities");
      }
    } else setError("שגיאה בשמירה");
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px", borderRadius: 3,
    border: "1.5px solid #e2e8f0", fontSize: 13, fontFamily: "Rubik, sans-serif",
    color: "#0F172A", outline: "none", direction: "rtl",
  };
  const label = (text: string) => (
    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 5 }}>{text}</label>
  );
  const sectionTitle = (text: string) => (
    <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", margin: "8px 0 2px", paddingBottom: 6, borderBottom: "2px solid #f1f5f9" }}>{text}</h3>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.4rem", maxWidth: 720 }}>
      {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: "10px 14px", borderRadius: 3, fontSize: 13, color: "#CC2222" }}>{error}</div>}

      {initial?.id && form.slug && (
        <a href={`/activities/${form.slug}`} target="_blank" rel="noopener noreferrer"
          style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 18px", background: "#0F4C2A", color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
          ↗ צפייה בדף הפעילות
        </a>
      )}

      {/* ── פרטים בסיסיים ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>{label("שם הפעילות *")}<input required style={inputStyle} value={form.name} onChange={e => { set("name", e.target.value); if (!initial?.id) set("slug", slugify(e.target.value)); }} placeholder="שם הפעילות" /></div>
        <div>{label("Slug (סיומת לינק — ניתן בעברית)")}<input style={inputStyle} value={form.slug} onChange={e => set("slug", slugify(e.target.value))} placeholder="לדוגמה: שופרתון" dir="auto" /></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
        <div>{label("סוג")}<select style={inputStyle} value={form.type} onChange={e => set("type", e.target.value as Activity["type"])}>{Object.entries(LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
        <div>{label("אמוג'י")}<input style={inputStyle} value={form.emoji} onChange={e => set("emoji", e.target.value)} placeholder="🎯" /></div>
        <div>{label("משך (דקות)")}<input type="number" style={inputStyle} value={form.duration} onChange={e => set("duration", +e.target.value)} /></div>
      </div>

      <div>
        {label("מקס' משתתפים")}
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <input type="number" min={0} disabled={form.maxParticipants === 0}
            style={{ ...inputStyle, maxWidth: 200, opacity: form.maxParticipants === 0 ? 0.45 : 1 }}
            value={form.maxParticipants === 0 ? "" : form.maxParticipants}
            onChange={e => set("maxParticipants", +e.target.value)} placeholder="מספר משתתפים" />
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, color: "#334155", cursor: "pointer", whiteSpace: "nowrap" }}>
            <input type="checkbox" checked={form.maxParticipants === 0}
              onChange={e => set("maxParticipants", e.target.checked ? 0 : 100)} />
            ללא הגבלה
          </label>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>{label("גיל מינימלי")}<input type="number" min={0} style={inputStyle} value={form.minAge ?? ""} onChange={e => set("minAge", e.target.value === "" ? undefined : +e.target.value)} placeholder="3" /></div>
        <div>{label("גיל מקסימלי (ריק = ללא עליון → יוצג 3+)")}<input type="number" min={0} style={inputStyle} value={form.maxAge ?? ""} onChange={e => set("maxAge", e.target.value === "" ? undefined : +e.target.value)} placeholder="12" /></div>
      </div>

      <div>
        {label("עונה עיקרית (לפיה הפעילות ממוינת לפי תאריך הכניסה לאתר)")}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {SEASON_OPTIONS.map(o => {
            const on = (form.season || "all_year") === o.id;
            return (
              <button key={o.id} type="button" onClick={() => set("season", o.id)} style={{
                padding: "8px 18px", borderRadius: 3, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Rubik, sans-serif",
                border: `1.5px solid ${on ? "#CC2222" : "#e2e8f0"}`,
                background: on ? "#fef2f2" : "#fff",
                color: on ? "#CC2222" : "#64748b",
              }}>{o.label}</button>
            );
          })}
        </div>
      </div>

      <div>
        {label("שפות הפעילות (בחירה מרובה)")}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {LANG_OPTIONS.map(o => {
            const cur = form.languages?.length ? form.languages : ["he"];
            const on = cur.includes(o.id);
            return (
              <button key={o.id} type="button" onClick={() => {
                const c = form.languages?.length ? form.languages : ["he"];
                const next = c.includes(o.id) ? c.filter(x => x !== o.id) : [...c, o.id];
                set("languages", next.length ? next : ["he"]);
              }} style={{
                padding: "8px 18px", borderRadius: 3, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Rubik, sans-serif",
                border: `1.5px solid ${on ? "#16a34a" : "#e2e8f0"}`,
                background: on ? "#f0fdf4" : "#fff",
                color: on ? "#16a34a" : "#64748b",
              }}>{o.label}</button>
            );
          })}
        </div>
      </div>

      <div>
        {label("קהל יעד / גילאים")}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {AGE_OPTIONS.map(o => {
            const on = (form.ageGroups || []).includes(o.id);
            return (
              <button key={o.id} type="button" onClick={() => toggleAge(o.id)} style={{
                padding: "8px 18px", borderRadius: 3, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Rubik, sans-serif",
                border: `1.5px solid ${on ? "#2563EB" : "#e2e8f0"}`,
                background: on ? "#eff6ff" : "#fff",
                color: on ? "#2563EB" : "#64748b",
              }}>{o.label}</button>
            );
          })}
        </div>
      </div>

      <div>{label("תיאור קצר *")}<input required style={inputStyle} value={form.shortDescription} onChange={e => set("shortDescription", e.target.value)} placeholder="תיאור קצר לכרטיס" /></div>
      <div>{label("תיאור מלא — ניתן לעצב (הדגשות, צבעים, רשימות)")}<RichText value={form.description} onChange={html => set("description", html)} placeholder="כתבו כאן את תיאור הפעילות המלא..." /></div>
      <div>{label("סלוגן לפוסטר")}<input style={inputStyle} value={form.tagline || ""} onChange={e => set("tagline", e.target.value)} placeholder="חווים · יוצרים · נהנים!" /></div>

      {/* ── מדיה ── */}
      {sectionTitle("🖼️ מדיה")}

      <div>
        {label("גלריית תמונות — ★ ראשית (כרטיס+עמוד) · ② שנייה (מתחלפת ב-hover)")}
        <Gallery images={arr<string>("gallery")} main={form.mainImage} second={form.secondImage} onAdd={addGalleryImage} onRemove={removeGalleryImage} onSetMain={url => set("mainImage", url)} onSetSecond={url => set("secondImage", url)} />
      </div>

      <div>
        {label("מודעה מעוצבת (פוסטר בצד)")}
        <SingleImage src={form.poster} folder="poster" onChange={url => set("poster", url)} />
      </div>

      <div>
        {label("וידאו ראשי (בראש העמוד)")}
        <SingleVideo src={form.heroVideo} folder="hero-video" onChange={url => set("heroVideo", url)} />
      </div>

      <div>
        {label("גלריית סרטונים")}
        <VideoList items={arr("videos")} onAdd={src => addTo("videos", { title: "סרטון", src })} onRemove={i => removeAt("videos", i)}
          onTitle={(i, title) => updateAt<{ title: string; src: string }>("videos", i, { title })} />
      </div>

      {/* ── מה מקבלים בפעילות ── */}
      {sectionTitle("🎁 מה מקבלים בפעילות (בחרו אייקון לכל פריט)")}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {arr<{ text: string; icon: string }>("gives").map((g, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <IconPicker value={g.icon} onChange={icon => updateAt<{ text: string; icon: string }>("gives", i, { icon })} />
            <input style={inputStyle} value={g.text} onChange={e => updateAt<{ text: string; icon: string }>("gives", i, { text: e.target.value })} placeholder="לדוגמה: צנצנת דבש אישית לכל ילד" />
            <button type="button" onClick={() => removeAt("gives", i)} title="הסרה"
              style={{ width: 40, height: 40, border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", borderRadius: 8, cursor: "pointer", flexShrink: 0 }}>✕</button>
          </div>
        ))}
        <button type="button" onClick={() => addTo("gives", { text: "", icon: "🎁" })}
          style={{ alignSelf: "flex-start", padding: "8px 16px", border: "1.5px dashed #cbd5e1", background: "#fff", color: "#334155", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "Rubik, sans-serif" }}>＋ הוספת פריט</button>
      </div>

      {/* ── נקודות מכירה (3 התגים מתחת לכפתורים בעמוד הפעילות) ── */}
      {sectionTitle("⭐ נקודות מכירה (התגים מתחת לכפתורים)")}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {arr<{ title: string; icon: string }>("sellingPoints").map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <IconPicker value={p.icon} onChange={icon => updateAt<{ title: string; icon: string }>("sellingPoints", i, { icon })} />
            <input style={inputStyle} value={p.title} onChange={e => updateAt<{ title: string; icon: string }>("sellingPoints", i, { title: e.target.value })} placeholder="לדוגמה: זירה בכל שטח" />
            <button type="button" onClick={() => removeAt("sellingPoints", i)} title="הסרה"
              style={{ width: 40, height: 40, border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", borderRadius: 8, cursor: "pointer", flexShrink: 0 }}>✕</button>
          </div>
        ))}
        <button type="button" onClick={() => addTo("sellingPoints", { title: "", icon: "⭐" })}
          style={{ alignSelf: "flex-start", padding: "8px 16px", border: "1.5px dashed #cbd5e1", background: "#fff", color: "#334155", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "Rubik, sans-serif" }}>＋ הוספת נקודת מכירה</button>
      </div>

      {/* ── קטגוריות ראשיות ── */}
      {sectionTitle("🗂️ קטגוריות ראשיות (בחר אחת או יותר)")}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {CATEGORY_OPTIONS.map(c => {
          const on = (form.categories || []).includes(c.id);
          return (
            <button key={c.id} type="button" onClick={() => toggleCategory(c.id)} style={{
              padding: "8px 18px", borderRadius: 3, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Rubik, sans-serif",
              border: `1.5px solid ${on ? "#CC2222" : "#e2e8f0"}`,
              background: on ? "#CC2222" : "#fff",
              color: on ? "#fff" : "#64748b",
            }}>{c.label}</button>
          );
        })}
      </div>

      {/* ── חגים / עונות (תוויות) ── */}
      {sectionTitle("📅 חגים / עונות (תוויות — בחר אחת או יותר)")}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {Object.entries(SEASON_LABELS).map(([s, l]) => (
          <button key={s} type="button" onClick={() => toggleSeason(s)} style={{
            padding: "6px 14px", borderRadius: 3, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Rubik, sans-serif",
            border: `1.5px solid ${form.seasons.includes(s) ? "#CC2222" : "#e2e8f0"}`,
            background: form.seasons.includes(s) ? "#fef2f2" : "#fff",
            color: form.seasons.includes(s) ? "#CC2222" : "#64748b",
          }}>{l}</button>
        ))}
      </div>

      {/* ── תגובות ── */}
      {sectionTitle("💬 תגובות מהשטח")}

      <div>
        {label("🎬 סרטוני המלצה")}
        <TestimonialVideos items={arr("videoTestimonials")}
          onAdd={src => addTo("videoTestimonials", { name: "שם", role: "תפקיד", src })}
          onRemove={i => removeAt("videoTestimonials", i)}
          onField={(i, patch) => updateAt<{ name: string; role: string; src: string }>("videoTestimonials", i, patch)} />
      </div>

      <div>
        {label("📱 הודעות וואטסאפ (טקסט)")}
        <WaMessages items={arr("waMessages")}
          onAdd={() => addTo("waMessages", { text: "", time: "" })}
          onRemove={i => removeAt("waMessages", i)}
          onField={(i, patch) => updateAt<{ text: string; time: string }>("waMessages", i, patch)}
          inputStyle={inputStyle} />
      </div>

      <div>
        {label("🎤 הקלטות קול")}
        <AudioList items={arr("audioTestimonials")}
          onAdd={src => addTo("audioTestimonials", { name: "שם", role: "תפקיד", src })}
          onRemove={i => removeAt("audioTestimonials", i)}
          onField={(i, patch) => updateAt<{ name: string; role: string; src: string }>("audioTestimonials", i, patch)} />
      </div>

      {/* ── עיצוב ── */}
      {sectionTitle("🎨 עיצוב")}
      <div>
        {label("צבעי הכרטיס")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          {([["grad1", "צבע 1"], ["grad2", "צבע 2"], ["grad1h", "Hover 1"], ["grad2h", "Hover 2"]] as const).map(([k, l]) => (
            <div key={k}>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>{l}</div>
              <input type="color" value={form[k] as string} onChange={e => set(k, e.target.value)} style={{ width: "100%", height: 36, borderRadius: 3, border: "1px solid #e2e8f0", cursor: "pointer" }} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 24 }}>
        {([["isGafan", 'מאושר גפ"ן'], ["isFeatured", "מומלץ"]] as const).map(([k, l]) => (
          <label key={k} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            <input type="checkbox" checked={form[k] as boolean} onChange={e => set(k, e.target.checked)} style={{ width: 16, height: 16, accentColor: "#CC2222" }} />
            {l}
          </label>
        ))}
      </div>

      {/* ── פעולות ── */}
      <div style={{ display: "flex", gap: 10, paddingTop: 8 }}>
        <button type="submit" disabled={loading} className="btn-red" style={{ padding: "12px 28px", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer", borderRadius: 3 }}>
          {loading ? "שומר..." : initial?.id ? "עדכן פעילות" : "צור פעילות"}
        </button>
        <button type="button" onClick={() => router.push("/admin/activities")} style={{ padding: "12px 20px", background: "none", border: "1.5px solid #e2e8f0", borderRadius: 3, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Rubik, sans-serif", color: "#64748b" }}>ביטול</button>
      </div>
    </form>
  );
}

/* ─────────── רכיבי העלאה ─────────── */

const upBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px",
  background: "#eff6ff", color: "#2563EB", border: "1.5px dashed #93c5fd", borderRadius: 6,
  fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "Rubik, sans-serif",
};
const removeBtn: React.CSSProperties = {
  position: "absolute", top: 4, insetInlineEnd: 4, width: 22, height: 22, borderRadius: "50%",
  background: "rgba(204,34,34,0.92)", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, lineHeight: 1,
};

function UploadButton({ accept, folder, label, multiple, onUrl }: { accept: string; folder: string; label: string; multiple?: boolean; onUrl: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <label style={{ ...upBtn, opacity: busy ? 0.6 : 1 }}>
      {busy ? "⏳ מעלה..." : label}
      <input type="file" accept={accept} multiple={multiple} hidden disabled={busy}
        onChange={async e => {
          const files = Array.from(e.target.files || []);
          if (!files.length) return;
          setBusy(true);
          const urls = await Promise.all(files.map(f => uploadToServer(f, folder)));
          let failed = 0;
          for (const u of urls) { if (u) onUrl(u); else failed++; }
          if (failed) alert(`${failed} קבצים נכשלו בהעלאה`);
          setBusy(false);
          e.target.value = "";
        }} />
    </label>
  );
}

function SingleImage({ src, folder, onChange }: { src?: string; folder: string; onChange: (url: string | undefined) => void }) {
  return src ? (
    <div style={{ position: "relative", width: 140, height: 100, borderRadius: 8, overflow: "hidden", border: "1px solid #e2e8f0" }}>
      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <button type="button" onClick={() => onChange(undefined)} style={removeBtn}>✕</button>
    </div>
  ) : <UploadButton accept="image/*" folder={folder} label="📤 העלה תמונה" onUrl={onChange} />;
}

const ytBadge: React.CSSProperties = { position: "absolute", top: 4, insetInlineStart: 4, background: "rgba(204,34,34,0.92)", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4 };

function YtLink({ onAdd }: { onAdd: (url: string) => void }) {
  const [link, setLink] = useState("");
  const valid = !!ytId(link);
  return (
    <div style={{ display: "flex", gap: 6 }}>
      <input value={link} onChange={e => setLink(e.target.value)} placeholder="או הדבק קישור יוטיוב"
        style={{ flex: 1, minWidth: 150, padding: "8px 10px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 12.5, fontFamily: "Rubik, sans-serif", direction: "ltr" }} />
      <button type="button" disabled={!valid} onClick={() => { onAdd(link.trim()); setLink(""); }}
        style={{ padding: "8px 14px", borderRadius: 6, border: "none", background: valid ? "#CC2222" : "#e2e8f0", color: valid ? "#fff" : "#94a3b8", fontSize: 12.5, fontWeight: 700, cursor: valid ? "pointer" : "not-allowed", fontFamily: "Rubik, sans-serif", whiteSpace: "nowrap" }}>+ הוסף</button>
    </div>
  );
}

function SingleVideo({ src, folder, onChange }: { src?: string; folder: string; onChange: (url: string | undefined) => void }) {
  const yt = ytId(src);
  if (src) return (
    <div style={{ position: "relative", width: 220, borderRadius: 8, overflow: "hidden", border: "1px solid #e2e8f0" }}>
      {yt ? <img src={ytThumb(yt)} alt="" style={{ width: "100%", display: "block" }} /> : <video src={src} controls style={{ width: "100%", display: "block", background: "#000" }} />}
      {yt && <span style={ytBadge}>▶ YouTube</span>}
      <button type="button" onClick={() => onChange(undefined)} style={removeBtn}>✕</button>
    </div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 380 }}>
      <UploadButton accept="video/*" folder={folder} label="🎬 העלה וידאו" onUrl={onChange} />
      <YtLink onAdd={url => onChange(url)} />
    </div>
  );
}

function galBadge(active: boolean, color: string): React.CSSProperties {
  return { background: active ? color : "rgba(0,0,0,0.5)", color: "#fff", border: "none", borderRadius: 4, fontSize: 9.5, fontWeight: 700, padding: "2px 6px", cursor: "pointer", fontFamily: "Rubik, sans-serif", whiteSpace: "nowrap" };
}

function Gallery({ images, main, second, onAdd, onRemove, onSetMain, onSetSecond }: { images: string[]; main?: string; second?: string; onAdd: (url: string) => void; onRemove: (i: number) => void; onSetMain: (url: string) => void; onSetSecond: (url: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
      {images.map((src, i) => {
        const isMain = src === main, isSecond = src === second;
        const border = isMain ? "#CC2222" : isSecond ? "#2563EB" : "#e2e8f0";
        return (
          <div key={i} style={{ position: "relative", width: 124, height: 96, borderRadius: 8, overflow: "hidden", border: `2px solid ${border}` }}>
            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", bottom: 3, insetInlineStart: 3, insetInlineEnd: 3, display: "flex", gap: 4 }}>
              <button type="button" onClick={() => onSetMain(src)} title="תמונה ראשית" style={galBadge(isMain, "#CC2222")}>{isMain ? "★" : "☆"} ראשית</button>
              <button type="button" onClick={() => onSetSecond(src)} title="תמונה שנייה (hover)" style={galBadge(isSecond, "#2563EB")}>② שנייה</button>
            </div>
            <button type="button" onClick={() => onRemove(i)} style={removeBtn}>✕</button>
          </div>
        );
      })}
      <UploadButton accept="image/*" folder="gallery" label="📤 הוסף תמונות" multiple onUrl={onAdd} />
    </div>
  );
}

function VideoList({ items, onAdd, onRemove, onTitle }: { items: { title: string; src: string }[]; onAdd: (src: string) => void; onRemove: (i: number) => void; onTitle: (i: number, t: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((v, i) => {
        const yt = ytId(v.src);
        return (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", background: "#f8fafc", padding: 8, borderRadius: 8 }}>
            <div style={{ position: "relative", width: 80, height: 56, flexShrink: 0 }}>
              {yt ? <img src={ytThumb(yt)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }} /> : <video src={v.src} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6, background: "#000" }} />}
              {yt && <span style={ytBadge}>▶</span>}
            </div>
            <input value={v.title} onChange={e => onTitle(i, e.target.value)} placeholder="כותרת הסרטון"
              style={{ flex: 1, padding: "8px 10px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 13, fontFamily: "Rubik, sans-serif" }} />
            <button type="button" onClick={() => onRemove(i)} style={{ ...removeBtn, position: "static", flexShrink: 0 }}>✕</button>
          </div>
        );
      })}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <UploadButton accept="video/*" folder="videos" label="🎬 העלה סרטונים" multiple onUrl={onAdd} />
        <YtLink onAdd={onAdd} />
      </div>
    </div>
  );
}

function TestimonialVideos({ items, onAdd, onRemove, onField }: { items: { name: string; role: string; src: string }[]; onAdd: (src: string) => void; onRemove: (i: number) => void; onField: (i: number, patch: Partial<{ name: string; role: string }>) => void }) {
  const ist: React.CSSProperties = { flex: 1, padding: "8px 10px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 13, fontFamily: "Rubik, sans-serif" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((t, i) => {
        const yt = ytId(t.src);
        return (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", background: "#f8fafc", padding: 8, borderRadius: 8 }}>
            <div style={{ position: "relative", width: 80, height: 56, flexShrink: 0 }}>
              {yt ? <img src={ytThumb(yt)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }} /> : <video src={t.src} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6, background: "#000" }} />}
              {yt && <span style={ytBadge}>▶</span>}
            </div>
            <input value={t.name} onChange={e => onField(i, { name: e.target.value })} placeholder="שם" style={ist} />
            <input value={t.role} onChange={e => onField(i, { role: e.target.value })} placeholder="תפקיד" style={ist} />
            <button type="button" onClick={() => onRemove(i)} style={{ ...removeBtn, position: "static", flexShrink: 0 }}>✕</button>
          </div>
        );
      })}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <UploadButton accept="video/*" folder="testimonials" label="🎬 העלה סרטון המלצה" onUrl={onAdd} />
        <YtLink onAdd={onAdd} />
      </div>
    </div>
  );
}

function AudioList({ items, onAdd, onRemove, onField }: { items: { name: string; role: string; src: string }[]; onAdd: (src: string) => void; onRemove: (i: number) => void; onField: (i: number, patch: Partial<{ name: string; role: string }>) => void }) {
  const ist: React.CSSProperties = { flex: 1, padding: "8px 10px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 13, fontFamily: "Rubik, sans-serif" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((t, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", background: "#f8fafc", padding: 8, borderRadius: 8, flexWrap: "wrap" }}>
          <input value={t.name} onChange={e => onField(i, { name: e.target.value })} placeholder="שם" style={ist} />
          <input value={t.role} onChange={e => onField(i, { role: e.target.value })} placeholder="תפקיד" style={ist} />
          <audio src={t.src} controls style={{ height: 34 }} />
          <button type="button" onClick={() => onRemove(i)} style={{ ...removeBtn, position: "static", flexShrink: 0 }}>✕</button>
        </div>
      ))}
      <UploadButton accept="audio/*" folder="audio" label="🎤 הוסף הקלטה" onUrl={onAdd} />
    </div>
  );
}

function WaMessages({ items, onAdd, onRemove, onField, inputStyle }: { items: { text: string; time: string }[]; onAdd: () => void; onRemove: (i: number) => void; onField: (i: number, patch: Partial<{ text: string; time: string }>) => void; inputStyle: React.CSSProperties }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((m, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "#f8fafc", padding: 8, borderRadius: 8 }}>
          <textarea value={m.text} onChange={e => onField(i, { text: e.target.value })} placeholder="תוכן ההודעה" rows={2} style={{ ...inputStyle, flex: 1, resize: "vertical" }} />
          <input value={m.time} onChange={e => onField(i, { time: e.target.value })} placeholder="11:32" style={{ ...inputStyle, width: 80 }} />
          <button type="button" onClick={() => onRemove(i)} style={{ ...removeBtn, position: "static", flexShrink: 0 }}>✕</button>
        </div>
      ))}
      <button type="button" onClick={onAdd} style={upBtn}>➕ הוסף הודעה</button>
    </div>
  );
}
