"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ACTIVITIES, TYPE_LABELS, SEASON_LABELS } from "@/lib/data";

type Result = { href: string; title: string; desc: string; icon: string; kind: string };

const PAGES: Result[] = [
  { href: "/", title: "דף הבית", desc: "עמוד הבית", icon: "🏠", kind: "עמוד" },
  { href: "/#activities", title: "כל הפעילויות", desc: "כל הפעילויות בדף הבית", icon: "🎪", kind: "עמוד" },
  { href: "/about", title: "אודותינו", desc: "מי אנחנו", icon: "ℹ️", kind: "עמוד" },
  { href: "/book", title: "הזמנת פעילות", desc: "טופס הזמנה", icon: "📅", kind: "עמוד" },
];

// כל פעילות → תוצאה + מחרוזת חיפוש
const ACTIVITY_RESULTS: (Result & { haystack: string })[] = ACTIVITIES.map(a => ({
  href: `/activities/${a.slug}`,
  title: a.name,
  desc: a.shortDescription,
  icon: a.emoji,
  kind: "פעילות",
  haystack: [
    a.name, a.shortDescription, a.description, TYPE_LABELS[a.type],
    ...a.tags, ...a.seasons.map(s => SEASON_LABELS[s] || s),
  ].join(" ").toLowerCase(),
}));

export function SearchButton({ color = "#334155" }: { color?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => { setOpen(false); setQ(""); setSel(0); }, []);

  // קיצורי מקלדת גלובליים לפתיחה (⌘K / Ctrl+K / "/")
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const typing = ["input", "textarea"].includes((e.target as HTMLElement)?.tagName?.toLowerCase());
      if ((k === "k" && (e.metaKey || e.ctrlKey)) || (k === "/" && !typing && !open)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 40);
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const results = useMemo<Result[]>(() => {
    const query = q.trim().toLowerCase();
    if (!query) return ACTIVITY_RESULTS.filter(r => ACTIVITIES.find(a => a.slug === r.href.split("/").pop())?.isFeatured).slice(0, 5);
    const acts = ACTIVITY_RESULTS.filter(r => r.haystack.includes(query));
    const pages = PAGES.filter(p => (p.title + " " + p.desc).toLowerCase().includes(query));
    return [...acts, ...pages];
  }, [q]);

  useEffect(() => setSel(0), [q]);

  const go = useCallback((r: Result) => { router.push(r.href); close(); }, [router, close]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return close();
    if (e.key === "ArrowDown") { e.preventDefault(); setSel(s => Math.min(s + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSel(s => Math.max(s - 1, 0)); }
    if (e.key === "Enter" && results[sel]) { e.preventDefault(); go(results[sel]); }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="חיפוש חכם"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "50%", border: "none", background: "none", cursor: "pointer", color, transition: "color 0.2s, background 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.color = "#CC2222"; e.currentTarget.style.background = "rgba(204,34,34,0.08)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = color; e.currentTarget.style.background = "none"; }}>
        <SearchIcon />
      </button>

      {open && (
        <div onClick={close} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "12vh 1rem 1rem", animation: "fadeIn 0.18s ease" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 600, background: "#fff", borderRadius: 16, boxShadow: "0 24px 60px rgba(0,0,0,0.3)", overflow: "hidden", animation: "scaleIn 0.18s ease" }}>
            {/* תיבת חיפוש */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ color: "#94a3b8", display: "flex" }}><SearchIcon /></span>
              <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} onKeyDown={onKeyDown}
                placeholder="חיפוש פעילות, חג, גיל או עמוד…"
                style={{ flex: 1, border: "none", outline: "none", fontSize: 16, fontFamily: "inherit", background: "none", color: "#0F172A", direction: "rtl" }} />
              <kbd style={{ fontSize: 11, color: "#94a3b8", background: "#f1f5f9", padding: "3px 8px", borderRadius: 6, fontFamily: "inherit" }}>ESC</kbd>
            </div>

            {/* תוצאות */}
            <div style={{ maxHeight: "52vh", overflowY: "auto", padding: 8 }}>
              {!q.trim() && <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", padding: "8px 12px 4px" }}>פעילויות מומלצות</div>}
              {results.length === 0 ? (
                <div style={{ padding: "32px 16px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>לא נמצאו תוצאות עבור &quot;{q}&quot;</div>
              ) : results.map((r, i) => (
                <button key={r.href} onClick={() => go(r)} onMouseEnter={() => setSel(i)}
                  style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", textAlign: "start", padding: "11px 12px", borderRadius: 10, border: "none", cursor: "pointer", background: i === sel ? "#f8fafc" : "none", transition: "background 0.12s" }}>
                  <span style={{ fontSize: 24, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", borderRadius: 10, flexShrink: 0 }}>{r.icon}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: 14.5, fontWeight: 700, color: "#0F172A" }}>{r.title}</span>
                    <span style={{ display: "block", fontSize: 12.5, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.desc}</span>
                  </span>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", background: "#f1f5f9", padding: "3px 9px", borderRadius: 20, flexShrink: 0 }}>{r.kind}</span>
                </button>
              ))}
            </div>

            {/* פוטר */}
            <div style={{ display: "flex", gap: 16, padding: "10px 20px", borderTop: "1px solid #f1f5f9", fontSize: 11.5, color: "#94a3b8" }}>
              <span>↑↓ ניווט</span><span>↵ פתיחה</span><span>⌘K לפתיחה מהירה</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}
