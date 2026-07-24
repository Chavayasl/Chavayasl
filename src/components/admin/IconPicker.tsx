"use client";
import { useState } from "react";

// מאגר אמוג'ים נפוץ לפעילויות חינוך/יצירה/חוויה
const EMOJIS = [
  "🎁", "🎨", "🖌️", "✂️", "🧩", "🎭", "🎪", "🎬", "🎤", "🎶",
  "🎯", "🏆", "⭐", "✨", "🔥", "💡", "🚀", "🎉", "🥳", "👑",
  "🧑‍🏫", "👨‍👩‍👧‍👦", "👥", "🤝", "🙌", "💪", "🧠", "❤️", "😊", "😍",
  "🍯", "🍞", "🧀", "🍪", "🍫", "🍷", "🫒", "🌿", "🐝", "🐐",
  "🔬", "🧪", "🌍", "🌈", "☀️", "💧", "🌊", "🎈", "🎓", "📚",
  "🛡️", "⚙️", "🧰", "📦", "🚚", "🏫", "🕹️", "🎮", "🏅", "💎",
];

export function IconPicker({ value, onChange }: { value: string; onChange: (icon: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button type="button" onClick={() => setOpen(o => !o)} title="בחירת אייקון"
        style={{ width: 46, height: 46, fontSize: 22, borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {value || "＋"}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <div style={{ position: "absolute", top: 52, insetInlineStart: 0, zIndex: 50, width: 280, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, boxShadow: "0 16px 40px rgba(15,23,42,0.18)", padding: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 2, maxHeight: 200, overflowY: "auto" }}>
              {EMOJIS.map(e => (
                <button key={e} type="button" onClick={() => { onChange(e); setOpen(false); }}
                  style={{ fontSize: 20, padding: 4, border: "none", background: value === e ? "#eff6ff" : "transparent", borderRadius: 6, cursor: "pointer" }}>{e}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 8, borderTop: "1px solid #f1f5f9", paddingTop: 8 }}>
              <input value={value} onChange={e => onChange(e.target.value)} placeholder="או הדביקו אמוג'י"
                style={{ flex: 1, padding: "7px 10px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, fontFamily: "Rubik, sans-serif" }} />
              <button type="button" onClick={() => setOpen(false)} style={{ padding: "0 12px", border: "none", background: "#0F4C2A", color: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>אישור</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
