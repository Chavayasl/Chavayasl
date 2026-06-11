"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SearchButton } from "./SearchButton";

const NAV_RIGHT = [
  { href: "/", label: "בית" },
  { href: "/activities", label: "פעילויות" },
];
const NAV_LEFT = [
  { href: "/about", label: "אודותינו" },
];
const ALL_LINKS = [...NAV_RIGHT, ...NAV_LEFT];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 20);
      setPastHero(window.scrollY > window.innerHeight * 0.6);
    };
    fn();
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // הדר מלא בכל עמוד שאינו דף הבית, או אחרי גלילה בדף הבית
  const solid = !isHome || scrolled;
  // הלוגו תמיד גלוי חוץ מראש דף הבית (שם ה-Hero מציג לוגו משלו)
  const showLogo = !isHome || pastHero;
  const linkColor = solid ? "#334155" : "rgba(255,255,255,0.9)";

  const navLink = (l: { href: string; label: string }) => (
    <Link key={l.href} href={l.href} style={{
      fontSize: 14, fontWeight: 600, color: linkColor,
      textDecoration: "none", transition: "color 0.2s", whiteSpace: "nowrap",
    }}
      onMouseEnter={e => e.currentTarget.style.color = "#CC2222"}
      onMouseLeave={e => e.currentTarget.style.color = linkColor}
    >{l.label}</Link>
  );

  return (
    <header style={{
      position: "fixed", top: 0, right: 0, left: 0, zIndex: 100, height: 72,
      background: solid ? "rgba(255,255,255,0.97)" : "transparent",
      backdropFilter: solid ? "blur(12px)" : "none",
      boxShadow: solid ? "0 2px 16px rgba(0,0,0,0.07)" : "none",
      transition: "background 0.35s, box-shadow 0.35s",
      display: "flex", alignItems: "center", padding: "0 2rem",
    }}>
      <div style={{ maxWidth: 1200, width: "100%", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "1rem" }}>

        {/* צד ימין (RTL): קישורים + המבורגר במובייל */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.75rem", justifyContent: "flex-start" }}>
          <nav className="hidden md:flex" style={{ alignItems: "center", gap: "1.75rem" }}>
            {NAV_RIGHT.map(navLink)}
          </nav>
          <SearchButton color={linkColor} />
          <button className="md:hidden" onClick={() => setMenu(!menu)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }} aria-label="תפריט">
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: "block", width: 22, height: 2, background: solid ? "#334155" : "#fff",
                  transform: menu ? (i === 0 ? "rotate(45deg) translate(5px,5px)" : i === 2 ? "rotate(-45deg) translate(5px,-5px)" : "scaleX(0)") : "none",
                  transition: "all 0.25s",
                }} />
              ))}
            </div>
          </button>
        </div>

        {/* מרכז: לוגו */}
        <Link href="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
          <div style={{
            opacity: showLogo ? 1 : 0,
            transform: showLogo ? "scale(1)" : "scale(0.7)",
            transition: "opacity 0.35s ease, transform 0.35s ease",
          }}>
            <Image src="/logo-hero.png" alt="חוויה סביב השנה" width={54} height={54} style={{ objectFit: "contain" }} priority />
          </div>
        </Link>

        {/* צד שמאל (RTL): קישורים + כפתור הזמנה */}
        <nav className="hidden md:flex" style={{ alignItems: "center", gap: "1.75rem", justifyContent: "flex-end" }}>
          {NAV_LEFT.map(navLink)}
          <Link href="/book" className="btn-red" style={{ fontSize: 13, padding: "9px 22px", borderRadius: 3 }}>
            להזמנת פעילות
          </Link>
        </nav>
      </div>

      {/* תפריט מובייל */}
      {menu && (
        <div style={{
          position: "absolute", top: 72, right: 0, left: 0,
          background: "#fff", borderBottom: "1px solid #f1f5f9",
          padding: "1.25rem 2rem", display: "flex", flexDirection: "column", gap: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}>
          {ALL_LINKS.map(l => <Link key={l.href} href={l.href} onClick={() => setMenu(false)}
            style={{ fontSize: 16, fontWeight: 500, color: "#334155", textDecoration: "none" }}>{l.label}</Link>)}
          <Link href="/book" onClick={() => setMenu(false)} className="btn-red" style={{ textAlign: "center" }}>להזמנת פעילות</Link>
        </div>
      )}
    </header>
  );
}
