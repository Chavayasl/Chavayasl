"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export function LoadingScreen() {
  const [phase, setPhase] = useState<"show" | "fadeout" | "done">("show");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fadeout"), 1600);
    const t2 = setTimeout(() => setPhase("done"), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === "done") return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#0F172A",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column",
      opacity: phase === "fadeout" ? 0 : 1,
      transition: "opacity 0.7s ease",
      pointerEvents: phase === "fadeout" ? "none" : "all",
    }}>
      <div style={{ animation: "splashLogo 0.8s cubic-bezier(0.34,1.56,0.64,1) both" }}>
        <Image
          src="/logo-hero.png"
          alt="חוויה סביב השנה"
          width={200}
          height={200}
          style={{ objectFit: "contain", filter: "drop-shadow(0 0 40px rgba(204,34,34,0.5))" }}
          priority
        />
      </div>
      <div style={{
        marginTop: 24, display: "flex", gap: 6,
        animation: "splashDots 0.6s ease 0.8s both",
      }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%", background: "#CC2222",
            animation: `dotBounce 0.6s ease ${0.9 + i * 0.15}s infinite alternate`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes splashLogo {
          0%   { opacity:0; transform: scale(0.5) rotate(-10deg); }
          70%  { transform: scale(1.08) rotate(2deg); }
          100% { opacity:1; transform: scale(1) rotate(0deg); }
        }
        @keyframes splashDots {
          from { opacity:0; transform: translateY(8px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes dotBounce {
          from { transform: translateY(0); opacity:0.4; }
          to   { transform: translateY(-6px); opacity:1; }
        }
      `}</style>
    </div>
  );
}
