import { HOLIDAY_CATEGORIES, MONTH_CATEGORIES } from "./data";

// ─── מבנה קטגוריות: קבוצה (קטגוריה) → תת-קטגוריות (תוויות) → פעילויות (slugs) ───
export interface SubCategory {
  id: string;
  label: string;
  emoji?: string;
  months?: string;
  slugs: string[]; // אילו פעילויות שייכות לתווית
}
export interface CategoryGroup {
  id: string;
  label: string;
  subs: SubCategory[];
}

// ברירת מחדל — נגזרת מהקטגוריות הסטטיות הקיימות (seed ראשוני ל-DB)
export const DEFAULT_CATEGORY_TREE: CategoryGroup[] = [
  {
    id: "holidays", label: "חגים ומועדים",
    subs: HOLIDAY_CATEGORIES.map(c => ({ id: c.id, label: c.label, emoji: c.emoji, months: c.months, slugs: [...c.slugs] })),
  },
  {
    id: "months", label: "חודשי השנה",
    subs: MONTH_CATEGORIES.map(c => ({ id: c.id, label: c.label, slugs: [...c.slugs] })),
  },
];

// מסנן גיל רוחבי (לא קטגוריה — מסונן לפי שדה ageGroups של הפעילות)
export const AGE_FILTERS: { id: string; label: string }[] = [
  { id: "gan", label: "גנים" },
  { id: "yesodi", label: "יסודי" },
  { id: "hatam", label: "חטיבה" },
];

export function newId() {
  return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}
