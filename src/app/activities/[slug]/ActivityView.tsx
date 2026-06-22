"use client";
import Link from "next/link";
import { SEASON_LABELS, TYPE_LABELS, type Activity } from "@/lib/data";
import { ytId, ytEmbed, ytThumb } from "@/lib/media";
import { useState, useEffect, useCallback } from "react";

const WA_PHONE = "972556671997";

export default function ActivityView({ a }: { a: Activity }) {
  // ─── ברירות מחדל חכמות (אם אין מדיה אמיתית עדיין) ───
  const heroVideo = a.heroVideo || "/hero-video.mp4";
  const tagline = a.tagline || "חווים · יוצרים · נהנים!";
  const description = a.experienceText || a.description;
  const gallery = a.gallery?.length ? a.gallery : ["/hero1.png", "/hero2.png", "/hero3.png", "/hero4.png", "/bg1.png", "/bg2.png"];

  const features = a.features?.length ? a.features : [
    { icon: "⏱", label: "משך הפעילות", value: `${a.duration} דקות` },
    { icon: "👥", label: "מספר משתתפים", value: `עד ${a.maxParticipants}` },
    { icon: "🧒", label: "גילאים", value: `${a.minAge}–${a.maxAge}` },
    { icon: "🏫", label: "מתאים ל", value: "בתי ספר, גנים, קייטנות" },
    { icon: "🚚", label: "הגעה", value: "מגיע עד אליכם" },
  ];

  const sellingPoints = a.sellingPoints?.length ? a.sellingPoints : [
    { icon: "⚙️", title: "התאמה אישית מלאה" },
    { icon: "👥", title: `עד ${a.maxParticipants} משתתפים` },
    { icon: "⭐", title: "מדריכים מקצועיים" },
  ];

  const videoTestimonials = a.videoTestimonials || [];
  const waMessages = a.waMessages || [];
  const audioTestimonials = a.audioTestimonials || [];
  const hasTestimonials = videoTestimonials.length > 0 || waMessages.length > 0 || audioTestimonials.length > 0;

  const gives = a.includes;
  const giveIcons = ["🎁", "🎨", "📦", "🧑‍🏫", "👥", "🛡️", "✨", "🎯"];

  const waLink = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(`שלום, מתעניין/ת בפעילות "${a.name}"`)}`;
  const grad = `linear-gradient(120deg, ${a.grad1} 0%, ${a.grad2} 100%)`;

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {/* ═══════════════ HERO ═══════════════ */}
      <section style={{ paddingTop: 92, paddingBottom: 40, background: "#fafafb", borderBottom: "1px solid #eef0f3" }}>
        {/* כותרת + קטגוריות */}
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 1.5rem 24px" }}>
          <div style={{ fontSize: 12.5, color: "#94a3b8", marginBottom: 12 }}>
            <Link href="/#activities" style={{ color: "#94a3b8", textDecoration: "none" }}>פעילויות</Link>
            {"  ›  "}<span style={{ color: "#64748b", fontWeight: 600 }}>{a.name}</span>
          </div>
          <h1 style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "clamp(28px,4vw,40px)", fontWeight: 900, color: "#0F172A", letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 14 }}>
            <span style={{ fontSize: "1.05em" }}>{a.emoji}</span>{a.name}
          </h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <Tag bg={a.grad1} solid>{TYPE_LABELS[a.type]}</Tag>
            {a.isFeatured && <Tag bg="#CC2222" solid>⭐ מומלץ</Tag>}
            {a.isGafan && <Tag bg="#16a34a">🌿 מאושר גפ&quot;ן</Tag>}
            {a.seasons.filter(s => s !== "all_year").map(s => <Tag key={s}>{SEASON_LABELS[s]}</Tag>)}
            {a.seasons.includes("all_year") && <Tag>כל השנה</Tag>}
          </div>
        </div>

        <div className="hero-grid" style={{ maxWidth: 1180, margin: "0 auto", padding: "0 1.5rem", display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: "2rem" }}>

          {/* עמודה ימנית (RTL ראשונה): וידאו + תיאור + פרטים */}
          <div>
            <HeroVideo src={heroVideo} />
            <h2 className="sec-title" style={{ fontSize: 26, marginBottom: 12 }}>תיאור הפעילות</h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.8, color: "#475569", marginBottom: 22 }}>{description}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 12 }}>
              {features.map((f, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #eef0f3", borderRadius: 12, padding: "14px 10px", textAlign: "center", boxShadow: "0 3px 10px rgba(15,23,42,0.04)" }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{f.icon}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>{f.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", lineHeight: 1.3 }}>{f.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* עמודה שמאלית (RTL שנייה): פוסטר + כפתורים + נקודות מכירה */}
          <div>
            {/* פוסטר מעוצב */}
            {a.poster ? (
              <img src={a.poster} alt={a.name} style={{ width: "100%", borderRadius: 16, display: "block", boxShadow: "0 16px 44px rgba(15,23,42,0.16)", marginBottom: 16 }} />
            ) : (
              <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: grad, padding: "34px 24px", textAlign: "center", boxShadow: "0 16px 44px rgba(15,23,42,0.16)", marginBottom: 16, aspectRatio: "4/5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 15%, rgba(255,255,255,0.16), transparent 60%)" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <span style={{ display: "inline-block", background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "5px 16px", borderRadius: 20, marginBottom: 18 }}>חוויה סביב השנה</span>
                  <div style={{ fontSize: 72, marginBottom: 14, lineHeight: 1 }}>{a.emoji}</div>
                  <h1 style={{ color: "#fff", fontSize: "clamp(28px,4vw,40px)", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.05, marginBottom: 16, textShadow: "0 2px 12px rgba(0,0,0,0.25)" }}>{a.name}</h1>
                  <span style={{ display: "inline-block", background: "#fff", color: a.grad1, fontSize: 14, fontWeight: 800, padding: "8px 22px", borderRadius: 30 }}>{tagline}</span>
                </div>
              </div>
            )}

            {/* כפתורים */}
            <Link href={`/book?activity=${a.slug}`} className="btn-red" style={{ display: "flex", width: "100%", fontSize: 16, padding: "15px 0", marginBottom: 10, gap: 8 }}>
              📅 הזמנת פעילות
            </Link>
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 15, fontWeight: 700, padding: "14px 0", background: "#fff", color: "#16a34a", border: "1.5px solid #25D366", borderRadius: 3, textDecoration: "none", marginBottom: 10 }}>
              <span style={{ color: "#25D366" }}>💬</span> שלחו הודעה בוואטסאפ
            </a>
            <ShareButton title={a.name} text={a.shortDescription} />

            {/* נקודות מכירה */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {sellingPoints.map((p, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #eef0f3", borderRadius: 12, padding: "14px 8px", textAlign: "center", boxShadow: "0 3px 10px rgba(15,23,42,0.04)" }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{p.icon}</div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: "#334155", lineHeight: 1.35 }}>{p.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ גלריה ═══════════════ */}
      <Gallery images={gallery} accent={a.grad1} />

      {/* ═══════════════ סרטונים מהפעילות ═══════════════ */}
      {(a.videos?.length ?? 0) > 0 && (
        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "1rem 1.5rem 3rem" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <span className="sec-label" style={{ borderColor: a.grad1, color: a.grad1 }}>וידאו</span>
            <h2 className="sec-title" style={{ marginTop: 6, fontSize: 30 }}>סרטונים מהפעילות</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
            {a.videos!.map((v, i) => <VideoCard key={i} title={v.title} src={v.src} poster={v.poster} accent={a.grad1} />)}
          </div>
        </section>
      )}

      {/* ═══════════════ מה אומרים עלינו — רק עמודות עם תוכן ═══════════════ */}
      {hasTestimonials && (() => {
        const cols: React.ReactNode[] = [];
        if (videoTestimonials.length > 0) cols.push(
          <ReviewCol key="video" title="סרטוני המלצה" icon="🎬">
            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: videoTestimonials.length > 1 ? 420 : undefined, overflowY: videoTestimonials.length > 1 ? "auto" : "visible", paddingInlineEnd: videoTestimonials.length > 1 ? 4 : 0 }}>
              {videoTestimonials.map((t, i) => <VideoCard key={i} title={t.name} subtitle={t.role} src={t.src} poster={t.poster} accent={a.grad1} />)}
            </div>
          </ReviewCol>
        );
        if (waMessages.length > 0) cols.push(
          <ReviewCol key="wa" title="הודעות וואטסאפ" icon="💬">
            {waMessages.map((m, i) => (
              <div key={i} style={{ background: "#e7f8ec", border: "1px solid #c9efd5", borderRadius: "14px 14px 14px 4px", padding: "11px 13px" }}>
                <p style={{ fontSize: 13.5, color: "#1f2937", lineHeight: 1.6 }}>{m.text}</p>
                <div style={{ fontSize: 10.5, color: "#94a3b8", textAlign: "start", marginTop: 4 }}>{m.time} ✓✓</div>
              </div>
            ))}
          </ReviewCol>
        );
        if (audioTestimonials.length > 0) cols.push(
          <ReviewCol key="audio" title="הקלטות שמע" icon="🎤">
            {audioTestimonials.map((t, i) => <AudioRow key={i} {...t} />)}
          </ReviewCol>
        );
        return (
          <section style={{ background: "#fafafb", borderTop: "1px solid #eef0f3", borderBottom: "1px solid #eef0f3" }}>
            <div style={{ maxWidth: 1180, margin: "0 auto", padding: "3rem 1.5rem" }}>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <span className="sec-label" style={{ borderColor: "#CC2222", color: "#CC2222" }}>תגובות מהשטח</span>
                <h2 className="sec-title" style={{ marginTop: 6, fontSize: 30 }}>מה אומרים עלינו?</h2>
              </div>
              <div className="reviews-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${cols.length},1fr)`, gap: 18, alignItems: "start", maxWidth: cols.length < 3 ? 820 : undefined, margin: cols.length < 3 ? "0 auto" : undefined }}>
                {cols}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ═══════════════ מה מקבלים ═══════════════ */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "3.2rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <span className="sec-label" style={{ borderColor: "#16a34a", color: "#16a34a" }}>הכל כלול</span>
          <h2 className="sec-title" style={{ marginTop: 6, fontSize: 30 }}>מה מקבלים בפעילות?</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit,minmax(140px,1fr))`, gap: 22, justifyItems: "center", maxWidth: gives.length <= 4 ? 760 : "none", margin: "0 auto" }}>
          {gives.map((item, i) => (
            <div key={i} style={{ textAlign: "center", maxWidth: 150 }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", border: `2px solid ${a.grad1}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto 12px", background: "#fff" }}>{giveIcons[i % giveIcons.length]}</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#334155", lineHeight: 1.45 }}>{item}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ CTA סיום ═══════════════ */}
      <section style={{ position: "relative", background: grad, padding: "3.6rem 1.5rem", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.14), transparent 55%)" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 620, margin: "0 auto" }}>
          <h2 style={{ color: "#fff", fontSize: "clamp(26px,4.5vw,40px)", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.12, marginBottom: 12 }}>
            מוכנים לחוויה בלתי נשכחת?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 16, lineHeight: 1.6, marginBottom: 26 }}>
            השאירו פרטים ונחזור אליכם בהקדם!
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 16, fontWeight: 700, padding: "15px 32px", background: "#25D366", color: "#fff", borderRadius: 3, textDecoration: "none", boxShadow: "0 10px 28px rgba(37,211,102,0.4)" }}>
              💬 שלחו הודעה בוואטסאפ
            </a>
            <Link href={`/book?activity=${a.slug}`}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 16, fontWeight: 700, padding: "15px 32px", background: "#fff", color: a.grad1, borderRadius: 3, textDecoration: "none", boxShadow: "0 10px 28px rgba(0,0,0,0.18)" }}>
              📅 הזמנת פעילות
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:860px){
          .hero-grid{ grid-template-columns:1fr !important; }
          .reviews-grid{ grid-template-columns:1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────── רכיבי עזר ─────────────── */

function Tag({ children, bg, solid }: { children: React.ReactNode; bg?: string; solid?: boolean }) {
  const color = bg || "#64748b";
  return (
    <span style={{
      fontSize: 12, fontWeight: 700, padding: "5px 13px", borderRadius: 20,
      background: solid ? color : "#fff",
      color: solid ? "#fff" : color,
      border: solid ? "none" : `1.5px solid ${bg ? color : "#e2e8f0"}`,
    }}>{children}</span>
  );
}

function ReviewCol({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #eef0f3", borderRadius: 16, padding: 16, boxShadow: "0 4px 16px rgba(15,23,42,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 15, fontWeight: 800, color: "#0F172A", paddingBottom: 14, marginBottom: 14, borderBottom: "1px solid #f1f5f9" }}>
        <span>{icon}</span> {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </div>
  );
}

function ShareButton({ title, text }: { title: string; text: string }) {
  const [done, setDone] = useState(false);
  const share = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = typeof window !== "undefined" ? window.location.href : "";
    const nav = typeof navigator !== "undefined" ? navigator : undefined;
    if (nav?.share) {
      try { await nav.share({ title, text, url }); return; } catch { /* בוטל/לא נתמך — נופלים להעתקה */ }
    }
    try { await nav?.clipboard?.writeText(url); setDone(true); setTimeout(() => setDone(false), 2000); } catch { /* */ }
  };
  return (
    <button type="button" onClick={share}
      style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 14, fontWeight: 700, padding: "13px 0", background: "#fff", color: "#334155", border: "1.5px solid #e2e8f0", borderRadius: 3, cursor: "pointer", fontFamily: "Rubik, sans-serif", marginBottom: 18, transition: "border-color 0.15s, color 0.15s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#94a3b8"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; }}>
      {done ? "✓ הקישור הועתק!" : "🔗 שיתוף העמוד"}
    </button>
  );
}

function HeroVideo({ src }: { src: string }) {
  const [big, setBig] = useState(false);
  const yt = ytId(src);
  return (
    <>
      <div style={{ position: "relative", aspectRatio: "16/10", borderRadius: 16, overflow: "hidden", background: "#000", boxShadow: "0 16px 44px rgba(15,23,42,0.16)", marginBottom: 22 }}>
        {yt
          ? <iframe src={ytEmbed(yt, { autoplay: true, mute: true, loop: true, controls: false })} title="וידאו" allow="autoplay; encrypted-media" allowFullScreen style={{ width: "100%", height: "100%", border: "none", display: "block" }} />
          : <video src={src} controls autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", background: "#000" }} />}
        <button onClick={() => setBig(true)} aria-label="הגדל וידאו"
          style={{ position: "absolute", top: 10, insetInlineEnd: 10, width: 38, height: 38, borderRadius: 8, border: "none", background: "rgba(0,0,0,0.55)", color: "#fff", cursor: "pointer", fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>⛶</button>
      </div>
      {big && (
        <Lightbox onClose={() => setBig(false)}>
          {yt
            ? <iframe src={ytEmbed(yt, { autoplay: true })} title="וידאו" allow="autoplay; encrypted-media" allowFullScreen style={{ width: "min(94vw, 1100px)", aspectRatio: "16/9", maxHeight: "90vh", border: "none", borderRadius: 12, background: "#000" }} />
            : <video src={src} controls autoPlay playsInline style={{ maxWidth: "94vw", maxHeight: "90vh", borderRadius: 12, background: "#000" }} />}
        </Lightbox>
      )}
    </>
  );
}

function VideoCard({ title, subtitle, src, poster, accent }: { title: string; subtitle?: string; src: string; poster?: string; accent: string }) {
  const [play, setPlay] = useState(false);
  const yt = ytId(src);
  const thumb = poster || (yt ? ytThumb(yt) : null);
  return (
    <>
      <button onClick={() => setPlay(true)} style={{ position: "relative", padding: 0, border: "none", borderRadius: 14, overflow: "hidden", cursor: "pointer", aspectRatio: "16/10", background: "#0F172A", width: "100%" }}>
        {thumb
          ? <img src={thumb} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
          : <video src={src} muted playsInline preload="metadata" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ width: 54, height: 54, borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: accent, paddingInlineStart: 3 }}>▶</span>
        </div>
        <div style={{ position: "absolute", bottom: 0, insetInlineStart: 0, insetInlineEnd: 0, padding: "26px 12px 10px", background: "linear-gradient(to top,rgba(0,0,0,0.75),transparent)", color: "#fff", textAlign: "start" }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, opacity: 0.8 }}>{subtitle}</div>}
        </div>
      </button>
      {play && (
        <Lightbox onClose={() => setPlay(false)}>
          {yt
            ? <iframe src={ytEmbed(yt, { autoplay: true })} title={title} allow="autoplay; encrypted-media" allowFullScreen style={{ width: "min(92vw, 900px)", aspectRatio: "16/9", maxHeight: "88vh", border: "none", borderRadius: 12, background: "#000" }} />
            : <video src={src} controls autoPlay playsInline style={{ maxWidth: "92vw", maxHeight: "88vh", borderRadius: 12, background: "#000" }} />}
        </Lightbox>
      )}
    </>
  );
}

function VideoRow({ name, role, src, poster, duration, accent }: { name: string; role: string; src: string; poster?: string; duration?: string; accent: string }) {
  const [play, setPlay] = useState(false);
  const yt = ytId(src);
  const thumb = poster || (yt ? ytThumb(yt) : null);
  return (
    <>
      <button onClick={() => setPlay(true)} style={{ display: "flex", alignItems: "center", gap: 11, padding: 0, border: "none", background: "none", cursor: "pointer", width: "100%", textAlign: "start" }}>
        <div style={{ position: "relative", width: 64, height: 48, borderRadius: 9, overflow: "hidden", flexShrink: 0, background: "#0F172A" }}>
          {thumb
            ? <img src={thumb} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
            : <video src={src} muted playsInline preload="metadata" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: accent, paddingInlineStart: 2 }}>▶</span>
          </div>
          {duration && <span style={{ position: "absolute", bottom: 3, insetInlineStart: 4, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 9, padding: "1px 4px", borderRadius: 4 }}>{duration}</span>}
        </div>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0F172A" }}>{name}</div>
          <div style={{ fontSize: 11.5, color: "#94a3b8" }}>{role}</div>
        </div>
      </button>
      {play && (
        <Lightbox onClose={() => setPlay(false)}>
          {yt
            ? <iframe src={ytEmbed(yt, { autoplay: true })} title={name} allow="autoplay; encrypted-media" allowFullScreen style={{ width: "min(92vw, 900px)", aspectRatio: "16/9", maxHeight: "88vh", border: "none", borderRadius: 12, background: "#000" }} />
            : <video src={src} controls autoPlay playsInline style={{ maxWidth: "92vw", maxHeight: "88vh", borderRadius: 12, background: "#000" }} />}
        </Lightbox>
      )}
    </>
  );
}

function AudioRow({ name, role, src, duration }: { name: string; role: string; src: string; duration?: string }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: "#0F172A" }}>{name}</span>
        <span style={{ fontSize: 11, color: "#94a3b8" }}>{role}{duration ? ` · ${duration}` : ""}</span>
      </div>
      <audio controls src={src} style={{ width: "100%", height: 36 }} />
    </div>
  );
}

function Gallery({ images, accent }: { images: string[]; accent: string }) {
  const [idx, setIdx] = useState<number | null>(null);
  const loop = [...images, ...images];
  const close = useCallback(() => setIdx(null), []);
  const next = useCallback(() => setIdx(i => (i === null ? null : (i + 1) % images.length)), [images.length]);
  const prev = useCallback(() => setIdx(i => (i === null ? null : (i - 1 + images.length) % images.length)), [images.length]);

  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") prev();
      if (e.key === "ArrowLeft") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, close, next, prev]);

  return (
    <section style={{ padding: "3rem 0 2.6rem" }}>
      <div style={{ textAlign: "center", marginBottom: 22, padding: "0 1.5rem" }}>
        <span className="sec-label" style={{ borderColor: accent, color: accent }}>גלריה</span>
        <h2 className="sec-title" style={{ marginTop: 6, fontSize: 30 }}>רגעים מהפעילות</h2>
      </div>
      <div className="gal-track-wrap" style={{ overflow: "hidden", maskImage: "linear-gradient(to left, transparent, #000 5%, #000 95%, transparent)" }}>
        <div className="gal-track" style={{ display: "flex", gap: 14, width: "max-content", animation: "galScroll 38s linear infinite" }}>
          {loop.map((src, i) => (
            <button key={i} onClick={() => setIdx(i % images.length)}
              style={{ padding: 0, border: "none", borderRadius: 14, overflow: "hidden", cursor: "pointer", flexShrink: 0, width: 280, height: 200, background: "#e5e7eb" }}>
              <img src={src} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </button>
          ))}
        </div>
      </div>
      <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", marginTop: 16 }}>🖐 לחצו על תמונה כדי להגדיל</p>

      {idx !== null && (
        <Lightbox onClose={close}>
          <button onClick={(e) => { e.stopPropagation(); next(); }} style={navBtn("start")} aria-label="הבא">‹</button>
          <img src={images[idx]} alt="" style={{ maxWidth: "86vw", maxHeight: "86vh", borderRadius: 12, objectFit: "contain" }} />
          <button onClick={(e) => { e.stopPropagation(); prev(); }} style={navBtn("end")} aria-label="הקודם">›</button>
        </Lightbox>
      )}

      <style>{`
        @keyframes galScroll { from{transform:translateX(0)} to{transform:translateX(50%)} }
        .gal-track-wrap:hover .gal-track{ animation-play-state:paused; }
      `}</style>
    </section>
  );
}

function navBtn(side: "start" | "end"): React.CSSProperties {
  return {
    position: "absolute", top: "50%", transform: "translateY(-50%)",
    [side === "start" ? "insetInlineStart" : "insetInlineEnd"]: 20,
    width: 52, height: 52, borderRadius: "50%", border: "none", cursor: "pointer",
    background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 30, lineHeight: 1,
    display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)",
  };
}

function Lightbox({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease", padding: 20 }}>
      <button onClick={onClose} aria-label="סגור"
        style={{ position: "absolute", top: 18, insetInlineEnd: 18, width: 44, height: 44, borderRadius: "50%", border: "none", cursor: "pointer", background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 24 }}>✕</button>
      <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
  );
}
