import { dbGetDoc, dbSetDoc } from "./storage";

// כתובת ברירת מחדל לטופס ההזמנה (Zoho)
export const ZOHO_BOOKING_URL =
  "https://forms.zohopublic.com/experience_around_the_year/form/Lead/formperma/AWMHjU9v_i-Edgybmr_ef4PcnS9T3Y3JxSgnQFe5Oc8";

export interface SiteSettings {
  booking: {
    mode: "iframe" | "internal"; // iframe = קישור חיצוני בחלון; internal = טופס באתר
    url: string;
    buttonText: string;
  };
}

export const DEFAULT_SETTINGS: SiteSettings = {
  booking: {
    mode: "iframe",
    url: ZOHO_BOOKING_URL,
    buttonText: "להזמנת פעילות",
  },
};

// נשמר ב-jsonb בטבלת categories תחת id="settings"
export async function getSettings(): Promise<SiteSettings> {
  const s = await dbGetDoc<SiteSettings>("categories", DEFAULT_SETTINGS, "settings");
  return { booking: { ...DEFAULT_SETTINGS.booking, ...s?.booking } };
}
export async function setSettings(s: SiteSettings): Promise<boolean> {
  return dbSetDoc<SiteSettings>("categories", s, "settings");
}
