"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error || "שגיאה");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#f8fafc", direction: "rtl",
    }}>
      <div style={{ width: "100%", maxWidth: 400, padding: "0 1.5rem" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Image src="/logo-hero.png" alt="לוגו" width={64} height={64} style={{ borderRadius: 8, marginBottom: 12 }} />
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#0F172A" }}>פאנל ניהול</h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>חוויה סביב השנה</p>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 4, padding: "2rem" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                סיסמת כניסה
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="field"
                placeholder="הזן סיסמה..."
                autoFocus
              />
            </div>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 4, padding: "10px 14px", fontSize: 13, color: "#CC2222" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-red" style={{
              width: "100%", fontSize: 15, padding: "13px 0",
              opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer", borderRadius: 3,
            }}>
              {loading ? "נכנס..." : "כניסה לפאנל"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#94a3b8" }}>
          גישה מורשית בלבד
        </p>
      </div>
    </div>
  );
}
