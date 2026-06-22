import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", textAlign: "center",
      padding: "120px 1.5rem 4rem", background: "#fafafb",
    }}>
      <Image src="/logo-hero.png" alt="חוויה סביב השנה" width={130} height={130}
        style={{ objectFit: "contain", marginBottom: 22, filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.12))" }} priority />

      <div style={{ fontSize: 68, fontWeight: 900, color: "#CC2222", letterSpacing: "-3px", lineHeight: 1 }}>404</div>

      <h1 style={{ fontSize: "clamp(24px,4vw,38px)", fontWeight: 900, color: "#0F172A", marginTop: 14, letterSpacing: "-0.5px", lineHeight: 1.15 }}>
        עמוד הפעילות לא נמצא..
      </h1>

      <p style={{ fontSize: 18, color: "#475569", marginTop: 14, maxWidth: 480, lineHeight: 1.7 }}>
        אבל.. היי.. יש לנו <strong style={{ color: "#CC2222" }}>המון דברים מדהימים</strong> להציע! 🎉
      </p>

      <Link href="/#activities" className="btn-red" style={{ marginTop: 30, fontSize: 16, padding: "15px 38px", boxShadow: "0 10px 28px rgba(204,34,34,0.35)" }}>
        לפעילויות שלנו ←
      </Link>

      <Link href="/" style={{ marginTop: 18, color: "#94a3b8", fontSize: 14, textDecoration: "none" }}>
        חזרה לדף הבית
      </Link>
    </div>
  );
}
