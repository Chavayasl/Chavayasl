// ─── התראות אימייל דרך Resend (חינמי) ───
// דורש משתני סביבה:
//   RESEND_API_KEY   — מפתח API מ-resend.com
//   NOTIFY_EMAIL_TO  — כתובת היעד שתקבל את הלידים
//   NOTIFY_EMAIL_FROM — (אופציונלי) כתובת השולח, ברירת מחדל onboarding@resend.dev

export function escapeHtml(s: string | undefined | null = ""): string {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function sendEmail(subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  const from = process.env.NOTIFY_EMAIL_FROM || "חוויה סביב השנה <onboarding@resend.dev>";
  if (!apiKey || !to) {
    console.warn("[notify] חסרים RESEND_API_KEY / NOTIFY_EMAIL_TO — דילוג על שליחת אימייל");
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) console.error("[notify] Resend החזיר שגיאה:", res.status, await res.text());
    return res.ok;
  } catch (e) {
    console.error("[notify] שליחת אימייל נכשלה:", e);
    return false;
  }
}

// בונה גוף אימייל מעוצב מתוך שורות [תווית, ערך]
export function leadEmailHtml(title: string, rows: [string, string | undefined][]): string {
  const items = rows
    .filter(([, v]) => v)
    .map(([label, value]) =>
      `<tr>
        <td style="padding:8px 12px;color:#64748b;font-weight:600;white-space:nowrap;border-bottom:1px solid #f1f5f9">${escapeHtml(label)}</td>
        <td style="padding:8px 12px;color:#0f172a;border-bottom:1px solid #f1f5f9">${escapeHtml(value)}</td>
      </tr>`
    )
    .join("");
  return `<div dir="rtl" style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:8px">
    <div style="background:#CC2222;color:#fff;padding:16px 20px;border-radius:10px 10px 0 0;font-size:18px;font-weight:bold">${escapeHtml(title)}</div>
    <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px">${items}</table>
    <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:14px">נשלח אוטומטית מאתר חוויה סביב השנה</p>
  </div>`;
}
