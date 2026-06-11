"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Activity } from "@/lib/data";

type FormData = Omit<Activity, "id" | "timeline" | "includes"> & { id?: string };

const DEFAULTS: FormData = {
  slug: "", name: "", type: "WORKSHOP",
  description: "", shortDescription: "",
  duration: 50, minAge: 3, maxAge: 12, maxParticipants: 100,
  seasons: [], tags: [], isGafan: false, isFeatured: false,
  grad1: "#CC2222", grad2: "#8B1A1A", grad1h: "#a81b1b", grad2h: "#6b1414",
  icon: "", emoji: "🎯",
};

const LABEL: Record<string, string> = { WORKSHOP: "סדנה", SHOW: "הצגה", GAME: "משחק", FOOD: "בישול" };
const SEASONS = ["rosh_hashana", "hanuka", "pesach", "summer", "all_year"];
const SEASON_LABELS: Record<string, string> = { rosh_hashana: "ראש השנה", hanuka: "חנוכה", pesach: "פסח", summer: "קיץ", all_year: "כל השנה" };

export function ActivityForm({ initial }: { initial?: Partial<Activity> }) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({ ...DEFAULTS, ...initial });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof FormData, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const toggleSeason = (s: string) => {
    set("seasons", form.seasons.includes(s) ? form.seasons.filter(x => x !== s) : [...form.seasons, s]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const isEdit = !!initial?.id;
    const url = isEdit ? `/api/admin/activities/${initial!.id}` : "/api/admin/activities";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin/activities");
    } else {
      setError("שגיאה בשמירה");
    }
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

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: 700 }}>
      {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: "10px 14px", borderRadius: 3, fontSize: 13, color: "#CC2222" }}>{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          {label("שם הפעילות *")}
          <input required style={inputStyle} value={form.name} onChange={e => { set("name", e.target.value); if (!initial?.id) set("slug", e.target.value.replace(/\s+/g, "-").replace(/[^\w-]/g, "")); }} placeholder="שם הפעילות" />
        </div>
        <div>
          {label("Slug (URL)")}
          <input style={inputStyle} value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="slug-name" dir="ltr" />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
        <div>
          {label("סוג")}
          <select style={inputStyle} value={form.type} onChange={e => set("type", e.target.value as Activity["type"])}>
            {Object.entries(LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div>
          {label("אמוג'י")}
          <input style={inputStyle} value={form.emoji} onChange={e => set("emoji", e.target.value)} placeholder="🎯" />
        </div>
        <div>
          {label("משך (דקות)")}
          <input type="number" style={inputStyle} value={form.duration} onChange={e => set("duration", +e.target.value)} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
        <div>{label("גיל מינ'")} <input type="number" style={inputStyle} value={form.minAge} onChange={e => set("minAge", +e.target.value)} /></div>
        <div>{label("גיל מקס'")} <input type="number" style={inputStyle} value={form.maxAge} onChange={e => set("maxAge", +e.target.value)} /></div>
        <div>{label("מקס' משתתפים")} <input type="number" style={inputStyle} value={form.maxParticipants} onChange={e => set("maxParticipants", +e.target.value)} /></div>
      </div>

      <div>
        {label("תיאור קצר *")}
        <input required style={inputStyle} value={form.shortDescription} onChange={e => set("shortDescription", e.target.value)} placeholder="תיאור קצר לכרטיס" />
      </div>

      <div>
        {label("תיאור מלא")}
        <textarea style={{ ...inputStyle, resize: "vertical" }} rows={4} value={form.description} onChange={e => set("description", e.target.value)} placeholder="תיאור מלא של הפעילות" />
      </div>

      {/* Seasons */}
      <div>
        {label("עונות")}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {SEASONS.map(s => (
            <button key={s} type="button" onClick={() => toggleSeason(s)} style={{
              padding: "6px 14px", borderRadius: 3, fontSize: 12, fontWeight: 600, cursor: "pointer",
              fontFamily: "Rubik, sans-serif",
              border: `1.5px solid ${form.seasons.includes(s) ? "#CC2222" : "#e2e8f0"}`,
              background: form.seasons.includes(s) ? "#fef2f2" : "#fff",
              color: form.seasons.includes(s) ? "#CC2222" : "#64748b",
            }}>{SEASON_LABELS[s]}</button>
          ))}
        </div>
      </div>

      {/* Gradient colors */}
      <div>
        {label("צבעי הכרטיס")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          {([["grad1","צבע 1"],["grad2","צבע 2"],["grad1h","Hover 1"],["grad2h","Hover 2"]] as const).map(([k, l]) => (
            <div key={k}>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>{l}</div>
              <input type="color" value={form[k] as string} onChange={e => set(k, e.target.value)}
                style={{ width: "100%", height: 36, borderRadius: 3, border: "1px solid #e2e8f0", cursor: "pointer" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Checkboxes */}
      <div style={{ display: "flex", gap: 24 }}>
        {([["isGafan", 'מאושר גפ"ן'], ["isFeatured", "מומלץ"]] as const).map(([k, l]) => (
          <label key={k} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            <input type="checkbox" checked={form[k] as boolean} onChange={e => set(k, e.target.checked)}
              style={{ width: 16, height: 16, accentColor: "#CC2222" }} />
            {l}
          </label>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, paddingTop: 8 }}>
        <button type="submit" disabled={loading} className="btn-red" style={{ padding: "12px 28px", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer", borderRadius: 3 }}>
          {loading ? "שומר..." : initial?.id ? "עדכן פעילות" : "צור פעילות"}
        </button>
        <button type="button" onClick={() => router.push("/admin/activities")} style={{
          padding: "12px 20px", background: "none", border: "1.5px solid #e2e8f0", borderRadius: 3,
          fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Rubik, sans-serif", color: "#64748b",
        }}>ביטול</button>
      </div>
    </form>
  );
}
