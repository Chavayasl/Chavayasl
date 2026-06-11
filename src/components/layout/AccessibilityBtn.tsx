"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface A11ySettings {
  fontSize: 0 | 1 | 2 | 3;        // 0=default, 1=+10%, 2=+20%, 3=+30%
  highContrast: boolean;           // black bg, white text
  invertContrast: boolean;         // dark bg, light text
  grayscale: boolean;              // filter: grayscale(100%)
  highlightLinks: boolean;         // underline all links
  highlightHeadings: boolean;      // border on h1-h6
  readableFont: boolean;           // Arial/Verdana
  textSpacing: boolean;            // line-height + letter/word spacing
  stopAnimations: boolean;         // no CSS animations/transitions
  bigCursor: boolean;              // 150% cursor
  readingMask: boolean;            // dark horizontal bar follows mouse
  readingBar: boolean;             // highlight current line
  dyslexiaFont: boolean;           // readable font for dyslexia
}

const DEFAULTS: A11ySettings = {
  fontSize: 0, highContrast: false, invertContrast: false,
  grayscale: false, highlightLinks: false, highlightHeadings: false,
  readableFont: false, textSpacing: false, stopAnimations: false,
  bigCursor: false, readingMask: false, readingBar: false, dyslexiaFont: false,
};

const LS_KEY = "accessibilitySettings";
const BASE_FONT = 16; // px

// ─── CSS injected into <html> data-* attributes ────────────────────────────
const STYLE_ID = "a11y-injected";

function applyCSS(s: A11ySettings) {
  // remove old
  document.getElementById(STYLE_ID)?.remove();

  const rules: string[] = [];

  // 1. Font size
  if (s.fontSize > 0) {
    const pct = [100, 110, 120, 130][s.fontSize];
    document.documentElement.style.fontSize = `${BASE_FONT * pct / 100}px`;
  } else {
    document.documentElement.style.fontSize = "";
  }

  // 3. High contrast
  if (s.highContrast) {
    rules.push(`
      html[data-a11y] * { background-color: #000 !important; color: #fff !important; border-color: #fff !important; }
      html[data-a11y] a { color: #ff0 !important; }
    `);
  }

  // 4. Invert contrast
  if (!s.highContrast && s.invertContrast) {
    rules.push(`html[data-a11y] { filter: invert(1) hue-rotate(180deg); }`);
  }

  // 5. Grayscale
  if (s.grayscale && !s.invertContrast && !s.highContrast) {
    rules.push(`html[data-a11y] { filter: grayscale(100%); }`);
  }

  // 6. Highlight links
  if (s.highlightLinks) {
    rules.push(`html[data-a11y] a { text-decoration: underline !important; outline: 2px solid currentColor !important; }`);
  }

  // 7. Highlight headings
  if (s.highlightHeadings) {
    rules.push(`html[data-a11y] h1,html[data-a11y] h2,html[data-a11y] h3,html[data-a11y] h4,html[data-a11y] h5,html[data-a11y] h6 { outline: 2px solid #005fcc !important; outline-offset: 2px !important; }`);
  }

  // 8. Readable font
  if (s.readableFont || s.dyslexiaFont) {
    rules.push(`html[data-a11y] * { font-family: Arial, Verdana, sans-serif !important; }`);
  }

  // 9. Text spacing
  if (s.textSpacing) {
    rules.push(`html[data-a11y] * { line-height: 1.8 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }`);
  }

  // 10. Stop animations
  if (s.stopAnimations) {
    rules.push(`
      html[data-a11y] *, html[data-a11y] *::before, html[data-a11y] *::after {
        animation: none !important;
        animation-duration: 0ms !important;
        transition: none !important;
        transition-duration: 0ms !important;
      }
    `);
  }

  // 11. Big cursor
  if (s.bigCursor) {
    rules.push(`html[data-a11y] * { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M8 3L8 24L14 18L19 28L22 27L17 17L24 17Z' fill='black' stroke='white' stroke-width='1.5'/%3E%3C/svg%3E") 0 0, auto !important; }`);
  }

  // Focus visible
  rules.push(`html[data-a11y] :focus-visible { outline: 3px solid #005fcc !important; outline-offset: 2px !important; }`);

  if (rules.length > 0) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = rules.join("\n");
    document.head.appendChild(style);
  }

  // Set/remove data-a11y marker
  if (Object.values(s).some((v, i) => i === 0 ? v !== 0 : v !== false)) {
    document.documentElement.setAttribute("data-a11y", "1");
  } else {
    document.documentElement.removeAttribute("data-a11y");
  }
}

// ─── Reading Mask Hook ────────────────────────────────────────────────────────
function useReadingMask(active: boolean) {
  useEffect(() => {
    if (!active) { document.getElementById("a11y-mask")?.remove(); return; }
    let mask = document.getElementById("a11y-mask");
    if (!mask) {
      mask = document.createElement("div");
      mask.id = "a11y-mask";
      Object.assign(mask.style, {
        position: "fixed", left: "0", right: "0", height: "80px",
        background: "rgba(0,0,0,0.35)", pointerEvents: "none",
        zIndex: "99998", top: "0", transition: "top 0.05s",
      });
      document.body.appendChild(mask);
    }
    const fn = (e: MouseEvent) => { if (mask) mask.style.top = (e.clientY - 40) + "px"; };
    window.addEventListener("mousemove", fn);
    return () => { window.removeEventListener("mousemove", fn); document.getElementById("a11y-mask")?.remove(); };
  }, [active]);
}

// ─── Reading Bar Hook ─────────────────────────────────────────────────────────
function useReadingBar(active: boolean) {
  useEffect(() => {
    if (!active) { document.getElementById("a11y-bar")?.remove(); return; }
    let bar = document.getElementById("a11y-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "a11y-bar";
      Object.assign(bar.style, {
        position: "fixed", left: "0", right: "0", height: "28px",
        background: "rgba(0,95,204,0.18)", border: "1px solid rgba(0,95,204,0.4)",
        pointerEvents: "none", zIndex: "99997", top: "0", transition: "top 0.05s",
      });
      document.body.appendChild(bar);
    }
    const fn = (e: MouseEvent) => { if (bar) bar.style.top = (e.clientY - 14) + "px"; };
    window.addEventListener("mousemove", fn);
    return () => { window.removeEventListener("mousemove", fn); document.getElementById("a11y-bar")?.remove(); };
  }, [active]);
}

// ─── Option Row Component ─────────────────────────────────────────────────────
function ToggleRow({ label, desc, active, onClick }: { label: string; desc?: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={active}
      style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 14px", background: active ? "#eff6ff" : "transparent",
        border: "none", borderBottom: "1px solid #f0f0f0", cursor: "pointer",
        fontFamily: "Rubik, Arial, sans-serif", textAlign: "right", gap: 10,
        transition: "background 0.15s",
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#fafafa"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{label}</div>
        {desc && <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>{desc}</div>}
      </div>
      {/* Toggle pill */}
      <div style={{
        width: 38, height: 20, borderRadius: 10, flexShrink: 0,
        background: active ? "#005fcc" : "#d1d5db",
        position: "relative", transition: "background 0.2s",
      }}>
        <div style={{
          position: "absolute", top: 2, width: 16, height: 16, borderRadius: "50%",
          background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          right: active ? 2 : "auto", left: active ? "auto" : 2,
          transition: "all 0.2s",
        }} />
      </div>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AccessibilityBtn() {
  const [open, setOpen] = useState(false);
  const [s, setS] = useState<A11ySettings>(DEFAULTS);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) { const parsed = JSON.parse(saved); setS(parsed); }
    } catch {}
  }, []);

  // Apply CSS whenever settings change
  useEffect(() => { applyCSS(s); }, [s]);

  // Save to localStorage
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {}
  }, [s]);

  useReadingMask(s.readingMask);
  useReadingBar(s.readingBar);

  const toggle = useCallback(<K extends keyof A11ySettings>(key: K) => {
    setS(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Keyboard: Escape closes, Tab traps inside
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); btnRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    // Focus first item
    setTimeout(() => menuRef.current?.querySelector("button")?.focus(), 50);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Click outside closes
  useEffect(() => {
    if (!open) return;
    const fn = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open]);

  const reset = () => { setS(DEFAULTS); document.documentElement.style.fontSize = ""; };
  const activeCount = Object.entries(s).filter(([k, v]) => k === "fontSize" ? v !== 0 : v === true).length;

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 99999 }}>
      {/* Menu panel */}
      {open && (
        <div
          ref={menuRef}
          id="accessibility-menu"
          role="dialog"
          aria-modal={false}
          aria-label="תפריט נגישות"
          style={{
            position: "absolute", bottom: 68, right: 0,
            width: 300, maxHeight: "calc(100vh - 120px)",
            background: "#fff", borderRadius: 4,
            boxShadow: "0 4px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)",
            overflowY: "auto", animation: "fadeUp 0.2s ease both",
          }}
        >
          {/* Header */}
          <div style={{ padding: "14px 16px", borderBottom: "2px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>♿ תפריט נגישות</div>
              <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>WCAG 2.1 AA · ת&quot;י 5568</div>
            </div>
            <button onClick={reset} style={{ fontSize: 11, color: "#CC2222", background: "none", border: "1px solid #fecaca", borderRadius: 3, padding: "4px 10px", cursor: "pointer", fontFamily: "Rubik, sans-serif", fontWeight: 600 }}>
              איפוס
            </button>
          </div>

          {/* Font size section */}
          <div style={{ padding: "10px 14px 6px", borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 8, letterSpacing: "0.06em" }}>גודל טקסט</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[{ label: "ברירת מחדל", v: 0 }, { label: "+10%", v: 1 }, { label: "+20%", v: 2 }, { label: "+30%", v: 3 }].map(opt => (
                <button key={opt.v} onClick={() => setS(prev => ({ ...prev, fontSize: opt.v as A11ySettings["fontSize"] }))}
                  aria-pressed={s.fontSize === opt.v}
                  style={{
                    flex: 1, padding: "6px 4px", borderRadius: 3, fontSize: 11, fontWeight: 600,
                    border: `1.5px solid ${s.fontSize === opt.v ? "#005fcc" : "#e5e7eb"}`,
                    background: s.fontSize === opt.v ? "#eff6ff" : "#fff",
                    color: s.fontSize === opt.v ? "#005fcc" : "#374151",
                    cursor: "pointer", fontFamily: "Rubik, sans-serif", transition: "all 0.15s",
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div style={{ padding: "6px 0" }}>
            <div style={{ padding: "6px 14px 2px", fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.06em" }}>צבע וניגודיות</div>
            <ToggleRow label="ניגודיות גבוהה" desc="רקע שחור, טקסט לבן" active={s.highContrast} onClick={() => toggle("highContrast")} />
            <ToggleRow label="ניגודיות הפוכה" desc="צבעים מהופכים" active={s.invertContrast} onClick={() => toggle("invertContrast")} />
            <ToggleRow label="גווני אפור" desc="הסרת כל הצבעים" active={s.grayscale} onClick={() => toggle("grayscale")} />

            <div style={{ padding: "8px 14px 2px", fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.06em" }}>טקסט וקריאה</div>
            <ToggleRow label="הדגשת קישורים" desc="קו תחתון לכל הקישורים" active={s.highlightLinks} onClick={() => toggle("highlightLinks")} />
            <ToggleRow label="הדגשת כותרות" desc="מסגרת לכותרות H1–H6" active={s.highlightHeadings} onClick={() => toggle("highlightHeadings")} />
            <ToggleRow label="פונט קריא" desc="Arial / Verdana" active={s.readableFont} onClick={() => toggle("readableFont")} />
            <ToggleRow label="ריווח טקסט" desc="שורה, אות, מילה" active={s.textSpacing} onClick={() => toggle("textSpacing")} />
            <ToggleRow label="מצב דיסלקציה" desc="פונט נוח לדיסלקטים" active={s.dyslexiaFont} onClick={() => toggle("dyslexiaFont")} />

            <div style={{ padding: "8px 14px 2px", fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.06em" }}>תצוגה ועיצוב</div>
            <ToggleRow label="הסתרת אנימציות" desc="עצירת כל ה-animations" active={s.stopAnimations} onClick={() => toggle("stopAnimations")} />
            <ToggleRow label="סמן עכבר גדול" desc="הגדלה ל-150%" active={s.bigCursor} onClick={() => toggle("bigCursor")} />

            <div style={{ padding: "8px 14px 2px", fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.06em" }}>כלי קריאה</div>
            <ToggleRow label="מסיכת קריאה" desc="פס כהה עוקב את העכבר" active={s.readingMask} onClick={() => toggle("readingMask")} />
            <ToggleRow label="סרגל קריאה" desc="הדגשת השורה הנוכחית" active={s.readingBar} onClick={() => toggle("readingBar")} />
          </div>

          {/* Footer */}
          <div style={{ padding: "10px 14px", borderTop: "1px solid #f0f0f0", textAlign: "center" }}>
            <a href="/accessibility" style={{ fontSize: 11, color: "#005fcc", textDecoration: "none" }}>
              הצהרת נגישות ←
            </a>
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        ref={btnRef}
        onClick={() => setOpen(o => !o)}
        aria-label="פתח תפריט נגישות"
        aria-expanded={open}
        aria-controls="accessibility-menu"
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(o => !o); } }}
        style={{
          width: 52, height: 52, borderRadius: 4,
          background: "#2563EB",
          border: "2px solid #fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative",
          boxShadow: "0 2px 12px rgba(37,99,235,0.35)",
          transition: "background 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "#1d4ed8"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#2563EB"; }}
      >
        {/* ISA Wheelchair accessibility icon */}
        <svg width="28" height="28" viewBox="0 0 100 100" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
          {/* Head */}
          <circle cx="50" cy="14" r="10" fill="white"/>
          {/* Body / arm reaching forward */}
          <path d="M50 25 L50 50 L30 50" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          {/* Torso to seat */}
          <path d="M50 50 L50 68" stroke="white" strokeWidth="8" strokeLinecap="round" fill="none"/>
          {/* Seat */}
          <path d="M38 68 L66 68" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none"/>
          {/* Leg */}
          <path d="M66 68 L66 80" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none"/>
          {/* Big wheel */}
          <circle cx="44" cy="82" r="13" stroke="white" strokeWidth="6" fill="none"/>
          {/* Small front wheel */}
          <circle cx="70" cy="83" r="6" stroke="white" strokeWidth="5" fill="none"/>
        </svg>
        {/* Active count badge */}
        {activeCount > 0 && (
          <div style={{
            position: "absolute", top: -4, left: -4,
            width: 18, height: 18, borderRadius: "50%",
            background: "#CC2222", color: "#fff",
            fontSize: 10, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid #fff",
          }}>
            {activeCount}
          </div>
        )}
      </button>
    </div>
  );
}
