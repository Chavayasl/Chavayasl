"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/settings";

// מטמון משותף — כל הכפתורים מושכים את ההגדרות פעם אחת
let cache: SiteSettings | null = null;
let promise: Promise<SiteSettings> | null = null;
function loadSettings(): Promise<SiteSettings> {
  if (cache) return Promise.resolve(cache);
  if (!promise) promise = fetch("/api/settings").then(r => r.json()).then((s: SiteSettings) => { cache = s; return s; }).catch(() => DEFAULT_SETTINGS);
  return promise;
}

export function BookButton({ activity, className, style, children }: { activity?: string; className?: string; style?: React.CSSProperties; children?: React.ReactNode }) {
  const [s, setS] = useState<SiteSettings>(cache || DEFAULT_SETTINGS);
  const [open, setOpen] = useState(false);
  useEffect(() => { loadSettings().then(setS); }, []);

  const b = s.booking;
  const label = children ?? b.buttonText;

  if (b.mode === "internal") {
    return <Link href={activity ? `/book?activity=${activity}` : "/book"} className={className} style={style}>{label}</Link>;
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className} style={style}>{label}</button>
      {open && (
        <div onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(15,23,42,0.7)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, animation: "fadeIn 0.2s ease" }}>
          <div onClick={e => e.stopPropagation()}
            style={{ position: "relative", width: "100%", maxWidth: 720, height: "min(92vh, 920px)", background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.35)" }}>
            <button onClick={() => setOpen(false)} aria-label="סגור"
              style={{ position: "absolute", top: 10, insetInlineEnd: 10, zIndex: 2, width: 36, height: 36, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 19, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            <iframe src={b.url} title="הזמנת פעילות" style={{ width: "100%", height: "100%", border: "none", display: "block" }} />
          </div>
        </div>
      )}
    </>
  );
}
