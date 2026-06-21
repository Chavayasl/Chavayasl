"use client";
import Link from "next/link";
import { useState } from "react";

export function WhatsAppFloat() {
  const phone = "972556671997";
  const msg = encodeURIComponent("שלום, אני מתעניין בהפעלה של 'חוויה סביב השנה'. אשמח לפרטים 😊");
  const [hover, setHover] = useState(false);

  return (
    <Link
      href={`https://wa.me/${phone}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="דברו איתנו בוואטסאפ"
      className="pulse-wa"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "fixed", bottom: 24, left: 24, zIndex: 50,
        display: "inline-flex", alignItems: "center",
        height: 56, borderRadius: 28,
        background: hover ? "#1db954" : "#25D366", color: "#fff",
        paddingInlineStart: 14,
        paddingInlineEnd: hover ? 20 : 14,
        textDecoration: "none", overflow: "hidden", whiteSpace: "nowrap",
        boxShadow: "0 4px 16px rgba(37,211,102,0.4)",
        transition: "padding 0.3s ease, background 0.2s",
      }}
    >
      <svg viewBox="0 0 24 24" width={28} height={28} fill="currentColor" aria-hidden style={{ flexShrink: 0 }}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.528 5.855L0 24l6.335-1.505A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.002-1.369l-.36-.214-3.727.977.996-3.634-.234-.374A9.818 9.818 0 1 1 12 21.818z"/>
      </svg>
      <span style={{
        fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: 14,
        maxWidth: hover ? 200 : 0,
        marginInlineStart: hover ? 10 : 0,
        opacity: hover ? 1 : 0,
        transition: "max-width 0.3s ease, opacity 0.25s ease, margin 0.3s ease",
      }}>
        דברו איתנו
      </span>
    </Link>
  );
}
