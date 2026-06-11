"use client";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { n: 500, suf: "+", label: "מוסדות חינוך", icon: "🏫", color: "#2563EB" },
  { n: 14,  suf: "+", label: "פעילויות שונות", icon: "🎯", color: "#CC2222" },
  { n: 8,   suf: "+", label: "שנות ניסיון",   icon: "⭐", color: "#b45309" },
  { n: 98,  suf: "%", label: "שביעות רצון",   icon: "🏆", color: "#16a34a" },
];

function Counter({ target, suf }: { target: number; suf: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || done.current) return;
      done.current = true;
      const steps = 40; const dur = 1400; let cur = 0;
      const t = setInterval(() => { cur = Math.min(cur + target/steps, target); setN(Math.round(cur)); if (cur >= target) clearInterval(t); }, dur/steps);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <div ref={ref}>{n}{suf}</div>;
}

export function StatsSection() {
  return (
    <section style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", padding: "2.5rem 2rem" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }} className="stats-grid">
        {STATS.map((s, i) => (
          <div key={i} style={{ textAlign: "center", padding: "1.5rem 1rem" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: "clamp(30px,3.5vw,42px)", fontWeight: 900, color: s.color, letterSpacing: "-1px", lineHeight: 1 }}>
              <Counter target={s.n} suf={s.suf} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <style>{`@media(max-width:640px){.stats-grid{grid-template-columns:repeat(2,1fr) !important}}`}</style>
    </section>
  );
}
