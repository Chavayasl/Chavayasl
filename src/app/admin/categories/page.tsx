"use client";
import { useEffect, useState } from "react";
import { newId, type CategoryGroup } from "@/lib/categories";

type Act = { slug: string; name: string; emoji: string };
type Del = { kind: "sub"; gi: number; si: number } | { kind: "group"; gi: number };

export default function CategoriesAdmin() {
  const [tree, setTree] = useState<CategoryGroup[]>([]);
  const [acts, setActs] = useState<Act[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [editSub, setEditSub] = useState<string | null>(null);
  const [del, setDel] = useState<Del | null>(null);
  const [moveTo, setMoveTo] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/categories").then(r => r.json()),
      fetch("/api/admin/activities").then(r => r.json()),
    ]).then(([t, a]) => {
      setTree(t);
      setActs((a as Act[]).map(x => ({ slug: x.slug, name: x.name, emoji: x.emoji })));
      setLoading(false);
    });
  }, []);

  const change = (fn: (t: CategoryGroup[]) => CategoryGroup[]) => { setTree(t => fn(structuredClone(t))); setDirty(true); };
  const actName = (slug: string) => acts.find(a => a.slug === slug)?.name || slug;

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/categories", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(tree) }).then(r => r.json()).catch(() => null);
    setSaving(false);
    if (res?.persisted) setDirty(false);
    else alert("⚠️ הפעולה לא נשמרה בשרת (צריך טבלת categories ב-Supabase).");
  };

  const addGroup = () => change(t => [...t, { id: newId(), label: "קטגוריה חדשה", subs: [] }]);
  const renameGroup = (gi: number, label: string) => change(t => { t[gi].label = label; return t; });
  const addSub = (gi: number) => change(t => { t[gi].subs.push({ id: newId(), label: "תווית חדשה", slugs: [] }); return t; });
  const editSubField = (gi: number, si: number, patch: Partial<{ label: string; emoji: string }>) => change(t => { t[gi].subs[si] = { ...t[gi].subs[si], ...patch }; return t; });
  const toggleSlug = (gi: number, si: number, slug: string) => change(t => { const s = t[gi].subs[si]; s.slugs = s.slugs.includes(slug) ? s.slugs.filter(x => x !== slug) : [...s.slugs, slug]; return t; });

  const confirmDelete = () => {
    if (!del) return;
    change(t => {
      if (del.kind === "sub") {
        const sub = t[del.gi].subs[del.si];
        if (moveTo && moveTo !== "__none__") {
          const target = t[del.gi].subs.find(s => s.id === moveTo);
          if (target) target.slugs = Array.from(new Set([...target.slugs, ...sub.slugs]));
        }
        t[del.gi].subs.splice(del.si, 1);
      } else {
        const grp = t[del.gi];
        if (moveTo && moveTo !== "__none__") {
          const target = t.find(g => g.id === moveTo);
          if (target) target.subs.push(...grp.subs);
        }
        t.splice(del.gi, 1);
      }
      return t;
    });
    setDel(null); setMoveTo("");
  };

  if (loading) return <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>טוען...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A" }}>ניהול קטגוריות</h1>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>קטגוריות (טאבים) ותת-קטגוריות (תוויות) בדף הבית</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={addGroup} style={{ padding: "10px 18px", borderRadius: 3, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Rubik, sans-serif", color: "#334155" }}>+ קטגוריה</button>
          <button onClick={save} disabled={!dirty || saving} className="btn-red" style={{ padding: "10px 24px", borderRadius: 3, opacity: !dirty || saving ? 0.5 : 1, cursor: !dirty || saving ? "not-allowed" : "pointer" }}>
            {saving ? "שומר..." : dirty ? "💾 שמור שינויים" : "נשמר ✓"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {tree.map((g, gi) => (
          <div key={g.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
            {/* כותרת קטגוריה */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#f8fafc", borderBottom: "1px solid #e5e7eb" }}>
              <span style={{ fontSize: 16 }}>🗂️</span>
              <input value={g.label} onChange={e => renameGroup(gi, e.target.value)}
                style={{ flex: 1, fontSize: 15, fontWeight: 800, color: "#0F172A", border: "none", background: "none", outline: "none", fontFamily: "Rubik, sans-serif" }} />
              <span style={{ fontSize: 11, color: "#94a3b8" }}>{g.subs.length} תוויות</span>
              <button onClick={() => { setDel({ kind: "group", gi }); setMoveTo("__none__"); }} title="מחק קטגוריה"
                style={{ border: "none", background: "none", cursor: "pointer", color: "#CC2222", fontSize: 16 }}>🗑️</button>
            </div>

            {/* תת-קטגוריות */}
            <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {g.subs.map((s, si) => (
                <div key={s.id} style={{ border: "1px solid #eef0f3", borderRadius: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px" }}>
                    <input value={s.emoji || ""} onChange={e => editSubField(gi, si, { emoji: e.target.value })} placeholder="🎯"
                      style={{ width: 38, textAlign: "center", fontSize: 16, border: "1.5px solid #e2e8f0", borderRadius: 6, padding: "6px 0", fontFamily: "Rubik, sans-serif" }} />
                    <input value={s.label} onChange={e => editSubField(gi, si, { label: e.target.value })} placeholder="שם התווית"
                      style={{ flex: 1, fontSize: 13, fontWeight: 600, border: "1.5px solid #e2e8f0", borderRadius: 6, padding: "8px 10px", fontFamily: "Rubik, sans-serif", color: "#0F172A" }} />
                    <button onClick={() => setEditSub(editSub === s.id ? null : s.id)}
                      style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", border: "1px solid #bfdbfe", borderRadius: 6, padding: "7px 12px", background: "#eff6ff", cursor: "pointer", fontFamily: "Rubik, sans-serif", whiteSpace: "nowrap" }}>
                      פעילויות ({s.slugs.length})
                    </button>
                    <button onClick={() => { setDel({ kind: "sub", gi, si }); setMoveTo("__none__"); }} title="מחק תווית"
                      style={{ border: "none", background: "none", cursor: "pointer", color: "#CC2222", fontSize: 15 }}>🗑️</button>
                  </div>
                  {/* עריכת פעילויות */}
                  {editSub === s.id && (
                    <div style={{ padding: "4px 10px 12px", borderTop: "1px solid #f1f5f9", display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {acts.map(a => {
                        const on = s.slugs.includes(a.slug);
                        return (
                          <button key={a.slug} onClick={() => toggleSlug(gi, si, a.slug)} style={{
                            padding: "5px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer", fontFamily: "Rubik, sans-serif",
                            border: `1.5px solid ${on ? "#CC2222" : "#e2e8f0"}`, background: on ? "#fef2f2" : "#fff", color: on ? "#CC2222" : "#64748b", fontWeight: on ? 700 : 500,
                          }}>{a.emoji} {a.name}</button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              <button onClick={() => addSub(gi)} style={{ alignSelf: "flex-start", fontSize: 12.5, fontWeight: 700, color: "#16a34a", border: "1.5px dashed #bbf7d0", borderRadius: 6, padding: "7px 14px", background: "#f0fdf4", cursor: "pointer", fontFamily: "Rubik, sans-serif" }}>+ תווית חדשה</button>
            </div>
          </div>
        ))}
      </div>

      {/* מודאל מחיקה + העברה */}
      {del && (() => {
        const isSub = del.kind === "sub";
        const sub = isSub ? tree[del.gi].subs[del.si] : null;
        const grp = tree[del.gi];
        const count = isSub ? sub!.slugs.length : grp.subs.length;
        const options = isSub ? grp.subs.filter((_, i) => i !== del.si) : tree.filter((_, i) => i !== del.gi);
        return (
          <div onClick={() => setDel(null)} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", width: "100%", maxWidth: 440, boxShadow: "0 20px 50px rgba(0,0,0,0.25)" }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
                מחיקת {isSub ? "תווית" : "קטגוריה"}: &quot;{isSub ? sub!.label : grp.label}&quot;
              </h3>
              {count > 0 ? (
                <>
                  <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.7, marginBottom: 14 }}>
                    {isSub
                      ? `התווית מכילה ${count} פעילויות. לאן להעביר אותן?`
                      : `הקטגוריה מכילה ${count} תת-קטגוריות. לאן להעביר אותן?`}
                  </p>
                  <select value={moveTo} onChange={e => setMoveTo(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 13, fontFamily: "Rubik, sans-serif", marginBottom: 8, direction: "rtl" }}>
                    <option value="__none__">{isSub ? "אל תעביר — הסר מהקטגוריה" : "מחק את הכל"}</option>
                    {options.map(o => <option key={o.id} value={o.id}>{("emoji" in o && o.emoji ? o.emoji + " " : "")}{o.label}</option>)}
                  </select>
                  {isSub && sub!.slugs.length > 0 && (
                    <div style={{ fontSize: 11.5, color: "#94a3b8", marginBottom: 14 }}>פעילויות: {sub!.slugs.map(actName).join(", ")}</div>
                  )}
                </>
              ) : (
                <p style={{ fontSize: 13.5, color: "#475569", marginBottom: 14 }}>למחוק את {isSub ? "התווית" : "הקטגוריה"}?</p>
              )}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => setDel(null)} style={{ padding: "9px 18px", borderRadius: 6, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Rubik, sans-serif", color: "#64748b" }}>ביטול</button>
                <button onClick={confirmDelete} className="btn-red" style={{ padding: "9px 20px", borderRadius: 6 }}>מחק</button>
              </div>
            </div>
          </div>
        );
      })()}

      <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 20 }}>💡 שינויים נכנסים לתוקף בדף הבית אחרי שמירה.</p>
    </div>
  );
}
