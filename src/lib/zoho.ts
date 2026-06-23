// ─── העברת לידים ל-Zoho Forms (→ Zoho CRM של הלקוח) ───
// כתובת הטופס הציבורי (ניתנת לשינוי דרך ZOHO_FORM_URL)
const ZOHO_FORM_URL =
  process.env.ZOHO_FORM_URL ||
  "https://forms.zohopublic.com/experience_around_the_year/form/Lead/formperma/AWMHjU9v_i-Edgybmr_ef4PcnS9T3Y3JxSgnQFe5Oc8";

/**
 * שולח ליד לטופס Zoho (best-effort — לעולם לא חוסם/מפיל את הבקשה).
 * מיפוי שמרני: Name / Email / PhoneNumber + MultiLine עם כל הפרטים.
 */
export async function forwardToZoho(fields: { Name?: string; Email?: string; PhoneNumber?: string; MultiLine?: string }): Promise<boolean> {
  if (!ZOHO_FORM_URL) return false;
  try {
    const fd = new FormData();
    if (fields.Name) fd.append("Name", fields.Name);
    if (fields.Email) fd.append("Email", fields.Email);
    if (fields.PhoneNumber) fd.append("PhoneNumber", fields.PhoneNumber);
    if (fields.MultiLine) fd.append("MultiLine", fields.MultiLine);
    fd.append("zf_referrer_name", "");
    fd.append("zf_redirect_url", "");
    fd.append("zc_gad", "");

    const res = await fetch(`${ZOHO_FORM_URL.replace(/\/$/, "")}/htmlRecords/submit`, { method: "POST", body: fd });
    if (!res.ok) console.error("[zoho] forward לא הצליח:", res.status);
    return res.ok;
  } catch (e) {
    console.error("[zoho] forward נכשל:", e);
    return false;
  }
}
