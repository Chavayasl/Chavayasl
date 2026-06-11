"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const NAV = [
  { href: "/admin", label: "דשבורד", icon: "📊", exact: true },
  { href: "/admin/activities", label: "פעילויות", icon: "🎯" },
  { href: "/admin/bookings", label: "הזמנות", icon: "📋" },
  { href: "/admin/contacts", label: "פניות", icon: "📬" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (pathname === "/admin/login") return <>{children}</>;

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", direction: "rtl" }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, background: "#0F172A", display: "flex", flexDirection: "column",
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 50,
        transform: sidebarOpen || isDesktop ? "none" : "translateX(100%)",
        transition: "transform 0.25s",
      }} className="admin-sidebar">
        {/* Logo */}
        <div style={{ padding: "1.5rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
          <Image src="/logo.png" alt="לוגו" width={36} height={36} style={{ borderRadius: 4 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>פאנל ניהול</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>חוויה סביב השנה</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "1rem 0.75rem", flex: 1 }}>
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 4, marginBottom: 2,
                textDecoration: "none", fontSize: 14, fontWeight: 600,
                background: isActive(item.href, item.exact) ? "rgba(204,34,34,0.15)" : "transparent",
                color: isActive(item.href, item.exact) ? "#ff6b6b" : "rgba(255,255,255,0.65)",
                borderRight: isActive(item.href, item.exact) ? "3px solid #CC2222" : "3px solid transparent",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: "1rem 0.75rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <Link href="/" target="_blank" style={{
            display: "flex", alignItems: "center", gap: 8, padding: "9px 12px",
            fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none", marginBottom: 4,
          }}>
            🌐 צפה באתר
          </Link>
          <button onClick={handleLogout} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "9px 12px",
            width: "100%", background: "none", border: "none", cursor: "pointer",
            fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "Rubik, sans-serif", textAlign: "right",
          }}>
            🚪 יציאה
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, marginRight: 240, minWidth: 0 }} className="admin-main">
        {/* Top bar */}
        <div style={{
          height: 56, background: "#fff", borderBottom: "1px solid #e5e7eb",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 1.5rem", position: "sticky", top: 0, zIndex: 40,
        }}>
          <button className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20 }}>
            ☰
          </button>
          <div style={{ fontSize: 13, color: "#64748b" }}>
            {new Date().toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}
          </div>
        </div>

        {/* Content */}
        <main style={{ padding: "2rem 1.5rem", maxWidth: 1100, margin: "0 auto" }}>
          {children}
        </main>
      </div>

      <style>{`
        @media(max-width:768px){
          .admin-sidebar{ transform: translateX(${sidebarOpen ? "0" : "100%"}) !important; }
          .admin-main{ margin-right: 0 !important; }
        }
      `}</style>
    </div>
  );
}
