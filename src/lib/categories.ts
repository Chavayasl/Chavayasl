import { HOLIDAY_CATEGORIES, ACTIVITIES } from "./data";

// ─── מבנה קטגוריות ───
export interface SubCategory {
  id: string;
  label: string;
  emoji?: string;
  months?: string;
  start?: string; // YYYY-MM-DD — רק חודש+יום נחשבים (חוזר כל שנה)
  end?: string;
  slugs: string[];
}
export interface CategoryGroup {
  id: string;
  label: string;
  slugs: string[];      // פעילויות ישירות בקטגוריה (לקטגוריות ללא תת-קטגוריות)
  subs: SubCategory[];  // תת-קטגוריות (תוויות), למשל חגים
}

// טווחי תאריכים מקורבים לחגים (גרגוריאני, חוזר מדי שנה — אפשר לערוך באדמין)
const HOLIDAY_DATES: Record<string, [string, string]> = {
  rosh_hashana: ["2024-09-01", "2024-10-15"],
  sukkot: ["2024-10-01", "2024-10-25"],
  hanuka: ["2024-11-25", "2024-12-31"],
  tu_bishvat: ["2024-01-15", "2024-02-15"],
  purim: ["2024-02-20", "2024-03-20"],
  pesach: ["2024-03-20", "2024-04-25"],
  lag_baomer: ["2024-05-01", "2024-05-25"],
  shavuot: ["2024-05-20", "2024-06-15"],
  ben_hametzarim: ["2024-07-01", "2024-07-31"],
};

const byType = (...types: string[]) => ACTIVITIES.filter(a => types.includes(a.type)).map(a => a.slug);

export const DEFAULT_CATEGORY_TREE: CategoryGroup[] = [
  {
    id: "holidays", label: "חגים ומועדים", slugs: [],
    subs: HOLIDAY_CATEGORIES.map(c => ({
      id: c.id, label: c.label, emoji: c.emoji, months: c.months,
      start: HOLIDAY_DATES[c.id]?.[0], end: HOLIDAY_DATES[c.id]?.[1],
      slugs: [...c.slugs],
    })),
  },
  { id: "science", label: "מדעים וטבע", slugs: ["kaveret-hazahav", "otzarot-hateva", "sodot-hayekev", "beit-habad", "lechem-vegvina"], subs: [] },
  { id: "extreme", label: "אקסטרים", slugs: ["laser-tag", "water-tag", "totat-ketzef"], subs: [] },
  { id: "shows", label: "מופעים", slugs: byType("SHOW"), subs: [] },
];

export const AGE_FILTERS: { id: string; label: string }[] = [
  { id: "gan", label: "גנים" },
  { id: "yesodi", label: "יסודי" },
  { id: "hatam", label: "חטיבה" },
];

export function newId() {
  return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

// ─── זיהוי החג הרלוונטי לתאריך הנוכחי ───
function mmdd(s?: string): number {
  if (!s) return -1;
  const p = s.split("-");
  if (p.length < 3) return -1;
  return (+p[1]) * 100 + (+p[2]);
}
/** מחזיר אינדקס התווית שטווח התאריכים שלה כולל את היום, או -1. */
export function currentHolidayIndex(subs: SubCategory[]): number {
  const now = new Date();
  const t = (now.getMonth() + 1) * 100 + now.getDate();
  for (let i = 0; i < subs.length; i++) {
    const a = mmdd(subs[i].start), b = mmdd(subs[i].end);
    if (a < 0 || b < 0) continue;
    if (a <= b ? (t >= a && t <= b) : (t >= a || t <= b)) return i;
  }
  return -1;
}
