"use client";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer style={{ background: "#0F172A", color: "#fff", padding: "4rem 2rem 1.5rem", position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: "2.5rem", marginBottom: "3rem" }} className="footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <Image src="/logo-hero.png" alt="לוגו" width={42} height={42} style={{ borderRadius: "50%" }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 800 }}>חוויה סביב השנה</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>פעילויות לבתי ספר וגנים</div>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12.5, lineHeight: 1.7, maxWidth: 220 }}>
              סדנאות, הצגות והפעלות חינוכיות מקצועיות לבתי ספר וגנים ברחבי הארץ.
            </p>
          </div>
          {[
            { title: "ניווט", links: [{h:"/",l:"דף הבית"},{h:"/#activities",l:"פעילויות"},{h:"/about",l:"אודותינו"},{h:"/book",l:"הזמנה"}] },
            { title: "מידע", links: [{h:"/accessibility",l:"הצהרת נגישות"},{h:"/privacy",l:"מדיניות פרטיות"}] },
          ].map((col, ci) => (
            <div key={ci}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: 14 }}>{col.title}</div>
              {col.links.map(l => (
                <Link key={l.h} href={l.h} style={{ display:"block", color:"rgba(255,255,255,0.5)", fontSize:13, textDecoration:"none", marginBottom:10 }}
                  onMouseEnter={e => e.currentTarget.style.color = "#CC2222"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                >{l.l}</Link>
              ))}
            </div>
          ))}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: 14 }}>צור קשר</div>
            <a href="tel:0556671997" style={{ display:"block", color:"rgba(255,255,255,0.5)", fontSize:13, textDecoration:"none", marginBottom:10 }}>📞 055-667-1997</a>
            <a href="mailto:office.chavayasl@gmail.com" style={{ display:"block", color:"rgba(255,255,255,0.5)", fontSize:13, textDecoration:"none", marginBottom:10 }}>✉️ office.chavayasl@gmail.com</a>
            <a href="https://wa.me/972556671997" target="_blank" rel="noopener noreferrer" style={{ display:"block", color:"#4ade80", fontSize:13, textDecoration:"none", fontWeight:600 }}>💬 וואטסאפ</a>
          </div>
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:"1.25rem", display:"flex", justifyContent:"space-between", flexWrap:"wrap", alignItems:"center", gap:8 }}>
          <span style={{ color:"rgba(255,255,255,0.2)", fontSize:12 }}>© {new Date().getFullYear()} חוויה סביב השנה · כל הזכויות שמורות</span>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <span style={{ color:"rgba(255,255,255,0.2)", fontSize:12 }}>מאושר גפ&quot;ן · WCAG 2.1 AA</span>
            <Link href="/admin" aria-label="כניסת ניהול" title="ניהול האתר"
              style={{ display:"flex", alignItems:"center", color:"rgba(255,255,255,0.25)", transition:"color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#CC2222"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.25)"}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.footer-grid{grid-template-columns:1fr 1fr !important}} @media(max-width:480px){.footer-grid{grid-template-columns:1fr !important}}`}</style>
    </footer>
  );
}
