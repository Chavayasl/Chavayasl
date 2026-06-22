"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SEASON_LABELS, type Activity } from "@/lib/data";
import { ytId, ytThumb } from "@/lib/media";

type FormData = Omit<Activity, "id" | "timeline" | "includes"> & { id?: string };

const DEFAULTS: FormData = {
  slug: "", name: "", type: "WORKSHOP",
  description: "", shortDescription: "",
  duration: 50, minAge: 3, maxAge: 12, maxParticipants: 100,
  seasons: [], tags: [], isGafan: false, isFeatured: false,
  grad1: "#CC2222", grad2: "#8B1A1A", grad1h: "#a81b1b", grad2h: "#6b1414",
  icon: "", emoji: "🎯",
  gallery: [], videos: [], videoTestimonials: [], waMessages: [], audioTestimonials: [],
  ageGroups: [],
};

const LABEL: Record<string, string> = { WORKSHOP: "סדנה", SHOW: "הצגה", GAME: "משחק", FOOD: "בישול" };
const AGE_OPTIONS = [
  { id: "gan", label: "גנים" },
  { id: "yesodi", label: "יסודי" },
  { id: "hatam", label: "חטיבה" },
  { id: "multi", label: "רב גילאי" },
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
    if (res.ok) router.push("/admin/activities");
    else setError("שגיאה בשמירה");
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

      {/* ── פרטים בסיסיים ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>{label("שם הפעילות *")}<input required style={inputStyle} value={form.name} onChange={e => { set("name", e.target.value); if (!initial?.id) set("slug", e.target.value.replace(/\s+/g, "-").replace(/[^\w-]/g, "")); }} placeholder="שם הפעילות" /></div>
        <div>{label("Slug (URL)")}<input style={inputStyle} value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="slug-name" dir="ltr" /></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
        <div>{label("סוג")}<select style={inputStyle} value={form.type} onChange={e => set("type", e.target.value as Activity["type"])}>{Object.entries(LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
        <div>{label("אמוג'י")}<input style={inputStyle} value={form.emoji} onChange={e => set("emoji", e.target.value)} placeholder="🎯" /></div>
        <div>{label("משך (דקות)")}<input type="number" style={inputStyle} value={form.duration} onChange={e => set("duration", +e.target.value)} /></div>
      </div>

      <div>
        {label("מקס' משתתפים")}
        <input type="number" style={{ ...inputStyle, maxWidth: 200 }} value={form.maxParticipants} onChange={e => set("maxParticipants", +e.target.value)} />
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
      <div>{label("תיאור מלא")}<textarea style={{ ...inputStyle, resize: "vertical" }} rows={4} value={form.description} onChange={e => set("description", e.target.value)} placeholder="תיאור מלא של הפעילות" /></div>
      <div>{label("סלוגן לפוסטר")}<input style={inputStyle} value={form.tagline || ""} onChange={e => set("tagline", e.target.value)} placeholder="חווים · יוצרים · נהנים!" /></div>

      {/* ── מדיה ── */}
      {sectionTitle("🖼️ מדיה")}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          {label("תמונה ראשית (כרטיס + ראש העמוד)")}
          <SingleImage src={form.mainImage} folder="main" onChange={url => set("mainImage", url)} />
        </div>
        <div>
          {label("מודעה מעוצבת (פוסטר בצד)")}
          <SingleImage src={form.poster} folder="poster" onChange={url => set("poster", url)} />
        </div>
      </div>

      <div>
        {label("וידאו ראשי (בראש העמוד)")}
        <SingleVideo src={form.heroVideo} folder="hero-video" onChange={url => set("heroVideo", url)} />
      </div>

      <div>
        {label("גלריית תמונות")}
        <Gallery images={arr<string>("gallery")} onAdd={url => addTo<string>("gallery", url)} onRemove={i => removeAt("gallery", i)} />
      </div>

      <div>
        {label("גלריית סרטונים")}
        <VideoList items={arr("videos")} onAdd={src => addTo("videos", { title: "סרטון", src })} onRemove={i => removeAt("videos", i)}
          onTitle={(i, title) => updateAt<{ title: string; src: string }>("videos", i, { title })} />
      </div>

      {/* ── קטגוריות ── */}
      {sectionTitle("🗂️ קטגוריות (חגים / עונות)")}
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

function Gallery({ images, onAdd, onRemove }: { images: string[]; onAdd: (url: string) => void; onRemove: (i: number) => void }) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
      {images.map((src, i) => (
        <div key={i} style={{ position: "relative", width: 90, height: 70, borderRadius: 8, overflow: "hidden", border: "1px solid #e2e8f0" }}>
          <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <button type="button" onClick={() => onRemove(i)} style={removeBtn}>✕</button>
        </div>
      ))}
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
        <UploadButton accept="video/*" folder="videos" label="🎬 העלה סרטון" onUrl={onAdd} />
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
