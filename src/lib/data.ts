export type ActivityType = "WORKSHOP" | "SHOW" | "GAME" | "FOOD";

export interface Activity {
  id: string;
  slug: string;
  name: string;
  type: ActivityType;
  description: string;
  shortDescription: string;
  duration?: number;
  minAge?: number;
  maxAge?: number;
  maxParticipants?: number;
  seasons: string[];
  tags: string[];
  isGafan: boolean;
  isFeatured: boolean;
  grad1: string;
  grad2: string;
  grad1h: string;
  grad2h: string;
  icon: string;
  emoji: string;
  timeline: { timeRange: string; title: string; description: string }[];
  includes: string[];
  ageGroups?: string[]; // gan | yesodi | hatam | multi (רב גילאי)
  /** קטגוריות ראשיות אליהן שייכת הפעילות (holidays/science/extreme/shows) */
  categories?: string[];

  // ─── מדיה לדף המכירה (אופציונלי — אם ריק, נטענות ברירות מחדל) ───
  /** תמונה ראשית (כרטיס + ראש העמוד) */
  mainImage?: string;
  /** תמונה שנייה — מתחלפת ב-hover על הכרטיס */
  secondImage?: string;
  /** וידאו בראש העמוד */
  heroVideo?: string;
  /** תמונת פוסטר מעוצב (אם ריק — נבנה כרטיס גרדיאנט אוטומטי) */
  poster?: string;
  /** סלוגן קצר לפוסטר */
  tagline?: string;
  /** תיאור הסדנה */
  experienceText?: string;
  /** כרטיסי פרטים (משך / משתתפים / גילאים / מתאים ל / דרישות) */
  features?: { icon: string; label: string; value: string }[];
  /** 3 נקודות מכירה מתחת לכפתורים */
  sellingPoints?: { icon: string; title: string }[];
  /** גלריית תמונות (שורה נעה + Lightbox) */
  gallery?: string[];
  /** גלריית סרטונים מהפעילות */
  videos?: { title: string; src: string; poster?: string }[];
  /** הודעות וואטסאפ (בועות צ'אט) */
  waMessages?: { text: string; time: string }[];
  /** הקלטות קול */
  audioTestimonials?: { name: string; role: string; src: string; duration?: string }[];
  /** סרטוני המלצה */
  videoTestimonials?: { name: string; role: string; src: string; poster?: string; duration?: string }[];
}

export const ACTIVITIES: Activity[] = [
  {
    id: "1", slug: "kaveret-hazahav",
    name: "כוורת הזהב", type: "WORKSHOP",
    description: "מסע מרתק בעקבות הדבש – נחקור, נצחק, נשתתף במשימות מאתגרות ונלמד איך כל תהליך ייצור הדבש קורה באופן טבעי לגמרי. כל ילד לוקח הביתה צנצנת דבש אישית!",
    shortDescription: "מסע מרתק בעקבות הדבש – צנצנת לכל ילד!",
    duration: 50, minAge: 3, maxAge: 12, maxParticipants: 100,
    seasons: ["rosh_hashana", "shavuot", "all_year"], tags: ["featured"], isGafan: true, isFeatured: true,
    grad1: "#b37200", grad2: "#7a4a00", grad1h: "#4a8c2a", grad2h: "#1e3d10",
    icon: "ti-bee", emoji: "🍯",
    ageGroups: ["gan", "yesodi", "hatam", "afternoon"],
    timeline: [
      { timeRange: "0–10 דקות", title: "כניסה ופתיחה", description: "הצוות מקבל את הילדים עם תפאורת כוורת מרהיבה" },
      { timeRange: "10–35 דקות", title: "מסע הדבורים", description: "הרצאה אינטראקטיבית עם מיצגים חיים" },
      { timeRange: "35–45 דקות", title: "מילוי הצנצנת", description: "כל ילד ממלא צנצנת דבש אישית" },
      { timeRange: "45–50 דקות", title: "ברכות וסיום", description: "ברכות וצילום קבוצתי" },
    ],
    includes: ["צנצנת דבש אישית לכל ילד", "מיצגים ויזואליים ייחודיים", "הפעילות מגיעה עד אליכם", "מותאמת לגיל ולגודל הקבוצה"],
  },
  {
    id: "2", slug: "circus",
    name: "קרקס", type: "SHOW",
    description: "הצגה אינטראקטיבית מרהיבה המשלבת אקרובטיקה, ליצנות ומופעי אור בסגנון קרקס. הילדים עולים לבמה ומשתתפים בסצנות מרגשות.",
    shortDescription: "מופע קרקס אינטראקטיבי – הילדים על הבמה!",
    duration: 50, minAge: 3, maxAge: 12, maxParticipants: 200,
    seasons: ["sukkot", "purim", "lag_baomer", "all_year"], tags: ["featured"], isGafan: false, isFeatured: true,
    grad1: "#1a0533", grad2: "#3d0f7a", grad1h: "#0d1a3a", grad2h: "#1a3a8a",
    icon: "ti-confetti", emoji: "🎪",
    ageGroups: ["gan", "yesodi", "hatam", "afternoon"],
    timeline: [
      { timeRange: "0–5 דקות", title: "כניסת הקרקסאים", description: "כניסה חגיגית עם מוזיקה ואפקטים" },
      { timeRange: "5–35 דקות", title: "מופע אקרובטיקה", description: "מופעי אקרובטיקה עם נושאים חגיגיים" },
      { timeRange: "35–45 דקות", title: "חלק אינטראקטיבי", description: "הילדים עולים לבמה ומשתתפים" },
      { timeRange: "45–50 דקות", title: "סיום חגיגי", description: "טקס סיום ביחד" },
    ],
    includes: ["מופע אקרובטיקה מקצועי", "השתתפות פעילה של הילדים", "אפקטי אור מיוחדים", "מגיע עם כל הציוד"],
  },
  {
    id: "3", slug: "hakol-letova",
    name: "הצגה הכל לטובה", type: "SHOW",
    description: "הצגה חינוכית על האדם, הטבע והקשר שביניהם. מותאמת לכל הגילאים ועומדת בתקני גפ\"ן.",
    shortDescription: "הצגה חינוכית על האדם, הטבע והקשר שביניהם",
    duration: 50, minAge: 6, maxAge: 12, maxParticipants: 200,
    seasons: ["all_year"], tags: ["gafan"], isGafan: true, isFeatured: false,
    grad1: "#2d5a1b", grad2: "#0f2008", grad1h: "#5a3a10", grad2h: "#2a1a05",
    icon: "ti-masks-theater", emoji: "🎭",
    ageGroups: ["yesodi", "hatam", "afternoon"],
    timeline: [
      { timeRange: "0–10 דקות", title: "פתיחה", description: "הצגת הדמויות ועולם הסיפור" },
      { timeRange: "10–40 דקות", title: "עלילה", description: "מסע חינוכי עם מסרים ערכיים" },
      { timeRange: "40–50 דקות", title: "שיח ושאלות", description: "דיון קבוצתי עם הילדים" },
    ],
    includes: ["הצגה מקצועית מלאה", "שיח פדגוגי מובנה", "חוברת פעילות לכיתה", "מותאמת לתכנית הלימודים"],
  },
  {
    id: "4", slug: "beit-habad",
    name: "בית הבד", type: "WORKSHOP",
    description: "ייצור שמן זית כמו בתקופה הקדומה עם מיצגי ענק. חווית ייצור אותנטית שמחברת את הילדים למסורת ולתרבות.",
    shortDescription: "ייצור שמן זית כמו בתקופה הקדומה עם מיצגי ענק",
    duration: 50, minAge: 3, maxAge: 12, maxParticipants: 100,
    seasons: ["hanuka", "tu_bishvat", "shavuot", "ben_hametzarim", "all_year"], tags: ["gafan", "featured"], isGafan: true, isFeatured: false,
    grad1: "#5a0a0a", grad2: "#2a0505", grad1h: "#8a6a00", grad2h: "#3a2a00",
    icon: "ti-building-factory", emoji: "🫒",
    ageGroups: ["gan", "yesodi", "hatam", "afternoon"],
    timeline: [
      { timeRange: "0–15 דקות", title: "היסטוריה", description: "על ייצור שמן זית בתקופת המקרא" },
      { timeRange: "15–40 דקות", title: "ייצור", description: "כל קבוצה מייצרת שמן זית בכלים עתיקים" },
      { timeRange: "40–50 דקות", title: "טעימה", description: "טעימת שמן זית טרי עם לחם" },
    ],
    includes: ["ציוד ייצור אותנטי", "שמן זית לטעימה", "הפעילות מגיעה אליכם", "מיצגי ענק מרהיבים"],
  },
  {
    id: "5", slug: "afiyat-matzot",
    name: "אפיית מצות", type: "WORKSHOP",
    description: "מסע ייחודי בעקבות המצה – מהקציר ועד לאפייה. הילדים לומדים על יציאת מצרים תוך כדי אפיית מצות אמיתיות.",
    shortDescription: "מסע ייחודי בעקבות המצה – מהקציר ועד לאפייה",
    duration: 60, minAge: 3, maxAge: 12, maxParticipants: 100,
    seasons: ["pesach"], tags: ["featured"], isGafan: false, isFeatured: true,
    grad1: "#7a5000", grad2: "#3a2500", grad1h: "#8b1a1a", grad2h: "#3d0808",
    icon: "ti-bread", emoji: "🫓",
    ageGroups: ["gan", "yesodi", "hatam"],
    timeline: [
      { timeRange: "0–15 דקות", title: "יציאת מצרים", description: "סיפור יציאת מצרים בצורה חוויתית" },
      { timeRange: "15–45 דקות", title: "אפיית מצות", description: "כל ילד לש ואופה מצה בעצמו" },
      { timeRange: "45–60 דקות", title: "טעימה", description: "אכילת מצות חמות מהתנור" },
    ],
    includes: ["אפיית מצות אמיתיות", "ציוד אפייה מקצועי", "סיפור חווייתי", "מצות לקחת הביתה"],
  },
  {
    id: "6", slug: "totat-ketzef",
    name: "תותח קצף", type: "GAME",
    description: "הפסקת התרעננות כיפית ומלאת אדרנלין ביום לוהט. תותח קצף ענקי שיוצר עשרות דקות של כיף מטורף לכל הגילאים.",
    shortDescription: "מסיבת קצף ענקית עם תותח תעשייתי",
    duration: 45, minAge: 3, maxAge: 99, maxParticipants: 50,
    seasons: ["summer"], tags: ["new"], isGafan: false, isFeatured: false,
    grad1: "#003d5a", grad2: "#001a27", grad1h: "#0a3a5a", grad2h: "#001520",
    icon: "ti-droplets", emoji: "🫧",
    ageGroups: ["gan", "yesodi", "hatam", "afternoon"],
    timeline: [
      { timeRange: "0–5 דקות", title: "הכנה", description: "לבישת בגדי הגנה ותדריך בטיחות" },
      { timeRange: "5–40 דקות", title: "מסיבת קצף", description: "תותח קצף ענקי עם מוזיקה" },
      { timeRange: "40–45 דקות", title: "יבוש וסיום", description: "אוויר חופשי ותמונות" },
    ],
    includes: ["תותח קצף תעשייתי", "מוזיקה מותאמת", "בגדי הגנה", "מתאים לכל גיל"],
  },
  {
    id: "7", slug: "masah-hashofar",
    name: "המסע בעקבות השופר", type: "SHOW",
    description: "מסע חווייתי ואינטראקטיבי בעקבות השופר וסמלי ראש השנה. הצגה מרתקת עם מרכיבים פדגוגיים עמוקים.",
    shortDescription: "מסע חווייתי ואינטראקטיבי בעקבות השופר",
    duration: 50, minAge: 3, maxAge: 12, maxParticipants: 200,
    seasons: ["rosh_hashana"], tags: [], isGafan: true, isFeatured: false,
    grad1: "#1a3a5a", grad2: "#0a1a30", grad1h: "#2a5a8a", grad2h: "#1a3a5a",
    icon: "ti-music", emoji: "🎺",
    ageGroups: ["gan", "yesodi", "hatam"],
    timeline: [
      { timeRange: "0–10 דקות", title: "פתיחה", description: "היכרות עם עולם השופר" },
      { timeRange: "10–40 דקות", title: "המסע", description: "מסע אינטראקטיבי עם תחנות" },
      { timeRange: "40–50 דקות", title: "סיום", description: "תקיעת שופר קבוצתית" },
    ],
    includes: ["שופרות אמיתיים", "תפאורה מרשימה", "מגיע עד אליכם", "מותאם לגיל"],
  },
  {
    id: "8", slug: "shofarton",
    name: "שופרתון", type: "GAME",
    description: "תחרות שופרות אינטראקטיבית וכיפית לכל הגילאים. כל ילד לומד לתקוע שופר ומשתתף בתחרות מהנה.",
    shortDescription: "תחרות שופרות כיפית – כל ילד תוקע!",
    duration: 45, minAge: 3, maxAge: 12, maxParticipants: 150,
    seasons: ["rosh_hashana"], tags: [], isGafan: false, isFeatured: false,
    grad1: "#7a3a00", grad2: "#3a1a00", grad1h: "#9a5a00", grad2h: "#5a2a00",
    icon: "ti-music", emoji: "📯",
    ageGroups: ["gan", "yesodi"],
    timeline: [
      { timeRange: "0–10 דקות", title: "הכרות עם השופר", description: "סיפור השופר ומשמעותו" },
      { timeRange: "10–35 דקות", title: "לימוד תקיעה", description: "כל ילד מנסה לתקוע שופר" },
      { timeRange: "35–45 דקות", title: "תחרות", description: "תחרות שופרות כיפית עם פרסים" },
    ],
    includes: ["שופרות אמיתיים", "מדריך מקצועי", "פרסים לכל המשתתפים"],
  },
  {
    id: "9", slug: "laser-tag",
    name: "לייזר טאג", type: "GAME",
    description: "משחק לייזר טאג מרגש עם ציוד מקצועי. צוותים מתחרים, אסטרטגיה ואדרנלין – הפעילות שכולם מדברים עליה.",
    shortDescription: "קרב לייזר קבוצתי מטורף עם ציוד מקצועי",
    duration: 50, minAge: 6, maxAge: 99, maxParticipants: 60,
    seasons: ["sukkot", "purim", "lag_baomer", "all_year"], tags: ["featured"], isGafan: false, isFeatured: true,
    grad1: "#0a0a2a", grad2: "#1a0a3a", grad1h: "#0a1a4a", grad2h: "#1a0a5a",
    icon: "ti-bolt", emoji: "🔫",
    ageGroups: ["yesodi", "hatam", "afternoon"],
    timeline: [
      { timeRange: "0–10 דקות", title: "חלוקת ציוד", description: "חלוקת אפודות ואקדחי לייזר" },
      { timeRange: "10–40 דקות", title: "קרב לייזר", description: "משחקי לייזר בצוותים" },
      { timeRange: "40–50 דקות", title: "תוצאות", description: "הכרזת הניצחון ופרסים" },
    ],
    includes: ["ציוד לייזר מקצועי", "אפודות ואקדחים", "מערכת ניקוד ממוחשבת", "מגיע עם הכל"],
  },
  {
    id: "10", slug: "otzarot-hateva",
    name: "אוצרות הטבע", type: "WORKSHOP",
    description: "חוויה חינוכית בעולם הטבע – צמחים, עשבי תיבול, ריחות וטעמים. הילדים מגלים את עולם הצמחים בדרך חוויתית ומרתקת.",
    shortDescription: "גילוי עולם הצמחים – ריחות, טעמים וסודות הטבע",
    duration: 50, minAge: 3, maxAge: 12, maxParticipants: 80,
    seasons: ["tu_bishvat", "all_year"], tags: ["gafan"], isGafan: true, isFeatured: false,
    grad1: "#1a4a1a", grad2: "#0a2a0a", grad1h: "#2a6a2a", grad2h: "#1a4a1a",
    icon: "ti-leaf", emoji: "🌿",
    ageGroups: ["gan", "yesodi", "hatam"],
    timeline: [
      { timeRange: "0–15 דקות", title: "עולם הצמחים", description: "הכרת צמחים וסגולותיהם" },
      { timeRange: "15–40 דקות", title: "חקר ויצירה", description: "הילדים מזהים, ריחות, טועמים" },
      { timeRange: "40–50 דקות", title: "סיכום", description: "מפגש עם תוצרת הטבע" },
    ],
    includes: ["חומרי טבע אמיתיים", "ערכת חקר לכל ילד", "מגיע עד אליכם"],
  },
  {
    id: "11", slug: "sodot-hayekev",
    name: "סודות היקב", type: "WORKSHOP",
    description: "מסע לעולם הגפן והיין – דריכת ענבים, ייצור מיץ ענבים ולימוד על מסורת היקב. חוויה חושית עשירה לכל גיל.",
    shortDescription: "דריכת ענבים וסודות ייצור המיץ",
    duration: 50, minAge: 3, maxAge: 12, maxParticipants: 100,
    seasons: ["tu_bishvat", "purim", "pesach", "shavuot", "all_year"], tags: [], isGafan: true, isFeatured: false,
    grad1: "#3a0a5a", grad2: "#1a0530", grad1h: "#5a1a7a", grad2h: "#2a0a4a",
    icon: "ti-grapes", emoji: "🍇",
    ageGroups: ["gan", "yesodi", "hatam", "afternoon"],
    timeline: [
      { timeRange: "0–15 דקות", title: "עולם הגפן", description: "על גפן, ענבים ומסורת היקב" },
      { timeRange: "15–40 דקות", title: "דריכת ענבים", description: "כל ילד דורך ענבים ומייצר מיץ" },
      { timeRange: "40–50 דקות", title: "טעימה", description: "טעימת מיץ ענבים טרי" },
    ],
    includes: ["ענבים טריים", "חביות דריכה", "מיץ ענבים לטעימה", "מגיע עם כל הציוד"],
  },
  {
    id: "12", slug: "lechem-vegvina",
    name: "לחם וגבינה", type: "FOOD",
    description: "אפיית לחם ביתי מאפס עם גבינות מיוחדות. הילדים לשים, אופים וטועמים – חוויה חושית מלאה המחברת למסורת ולמזון.",
    shortDescription: "אפיית לחם ביתי + גבינות – טעים ומחנך!",
    duration: 60, minAge: 3, maxAge: 12, maxParticipants: 80,
    seasons: ["shavuot", "ben_hametzarim", "all_year"], tags: [], isGafan: true, isFeatured: false,
    grad1: "#5a3a10", grad2: "#2a1a05", grad1h: "#7a5a20", grad2h: "#3a2a0a",
    icon: "ti-cheese", emoji: "🧀",
    ageGroups: ["gan", "yesodi", "hatam", "afternoon"],
    timeline: [
      { timeRange: "0–20 דקות", title: "לישת הלחם", description: "כל ילד לש בצק אישי" },
      { timeRange: "20–45 דקות", title: "אפייה וגבינות", description: "אפייה + הכרת גבינות מיוחדות" },
      { timeRange: "45–60 דקות", title: "טעימה", description: "לחם טרי עם גבינות" },
    ],
    includes: ["חומרי גלם איכותיים", "גבינות מיוחדות", "ציוד אפייה מקצועי", "מגיע עד אליכם"],
  },
  {
    id: "13", slug: "water-tag",
    name: "ווטר טאג", type: "GAME",
    description: "גרסת הקיץ של לייזר טאג – ירי מים עם ציוד מקצועי! מרגש, מרטיב ומהנה. הפעילות הכי שווה לחודשי הקיץ.",
    shortDescription: "לייזר טאג עם מים – הפעילות הכי חמה לקיץ!",
    duration: 45, minAge: 6, maxAge: 99, maxParticipants: 60,
    seasons: ["summer"], tags: ["new"], isGafan: false, isFeatured: false,
    grad1: "#003d7a", grad2: "#001a3a", grad1h: "#0055a0", grad2h: "#002a5a",
    icon: "ti-droplet", emoji: "💧",
    ageGroups: ["yesodi", "hatam", "afternoon"],
    timeline: [
      { timeRange: "0–10 דקות", title: "חלוקת ציוד", description: "ציוד מים מקצועי לכל ילד" },
      { timeRange: "10–40 דקות", title: "קרב מים", description: "משחקי מים בצוותים" },
      { timeRange: "40–45 דקות", title: "סיום", description: "מי הכי רטוב? פרסים!" },
    ],
    includes: ["ציוד מים מקצועי", "אפודות מגן", "מגיע עם הכל", "מתאים לקיץ"],
  },
];

export const TYPE_LABELS: Record<ActivityType, string> = {
  WORKSHOP: "סדנה", SHOW: "הצגה", GAME: "משחק", FOOD: "בישול",
};

export const SEASON_LABELS: Record<string, string> = {
  rosh_hashana: "ראש השנה", pesach: "פסח", hanuka: "חנוכה", summer: "קיץ",
  all_year: "כל השנה", sukkot: "סוכות", tu_bishvat: "טו בשבט",
  purim: "פורים", lag_baomer: "לג בעומר", shavuot: "שבועות",
  ben_hametzarim: "בין המצרים",
};

// ─── קטגוריות חגים ───
export const HOLIDAY_CATEGORIES: { id: string; label: string; emoji: string; months?: string; slugs: string[] }[] = [
  {
    id: "rosh_hashana", label: "אלול – יום כיפור", emoji: "🍎",
    months: "ספטמבר–אוקטובר",
    slugs: ["kaveret-hazahav", "masah-hashofar", "shofarton", "laser-tag", "circus", "hakol-letova"],
  },
  {
    id: "sukkot", label: "חוה\"מ סוכות", emoji: "🌿",
    months: "אוקטובר",
    slugs: ["laser-tag", "circus", "kaveret-hazahav", "hakol-letova"],
  },
  {
    id: "hanuka", label: "חנוכה", emoji: "🕎",
    months: "נובמבר–דצמבר",
    slugs: ["beit-habad", "laser-tag", "circus", "hakol-letova"],
  },
  {
    id: "tu_bishvat", label: "טו בשבט", emoji: "🌳",
    months: "ינואר–פברואר",
    slugs: ["otzarot-hateva", "beit-habad", "sodot-hayekev", "hakol-letova"],
  },
  {
    id: "purim", label: "פורים", emoji: "🎭",
    months: "פברואר–מרץ",
    slugs: ["circus", "sodot-hayekev", "laser-tag", "hakol-letova"],
  },
  {
    id: "pesach", label: "פסח", emoji: "🫓",
    months: "מרץ–אפריל",
    slugs: ["afiyat-matzot", "sodot-hayekev"],
  },
  {
    id: "lag_baomer", label: "לג בעומר", emoji: "🔥",
    months: "מאי",
    slugs: ["circus", "laser-tag", "hakol-letova"],
  },
  {
    id: "shavuot", label: "שבועות", emoji: "🌾",
    months: "מאי–יוני",
    slugs: ["lechem-vegvina", "beit-habad", "sodot-hayekev", "kaveret-hazahav"],
  },
  {
    id: "ben_hametzarim", label: "בין המצרים", emoji: "✡️",
    months: "יולי",
    slugs: ["lechem-vegvina", "beit-habad", "hakol-letova"],
  },
];

// ─── קטגוריות חודשים לועזיים ───
export const MONTH_CATEGORIES: { id: string; label: string; slugs: string[] }[] = [
  { id: "09-10", label: "ספטמבר – אוקטובר", slugs: ["kaveret-hazahav", "masah-hashofar", "shofarton", "laser-tag", "circus", "hakol-letova"] },
  { id: "11-12", label: "נובמבר – דצמבר", slugs: ["laser-tag", "circus", "hakol-letova", "beit-habad"] },
  { id: "01-02", label: "ינואר – פברואר", slugs: ["laser-tag", "circus", "hakol-letova", "otzarot-hateva", "beit-habad", "sodot-hayekev"] },
  { id: "03-04", label: "מרץ – אפריל", slugs: ["laser-tag", "circus", "hakol-letova", "water-tag", "totat-ketzef", "afiyat-matzot", "sodot-hayekev"] },
  { id: "05-06", label: "מאי – יוני", slugs: ["laser-tag", "circus", "hakol-letova", "water-tag", "totat-ketzef", "lechem-vegvina", "beit-habad", "sodot-hayekev", "kaveret-hazahav"] },
  { id: "07-08", label: "יולי – אוגוסט", slugs: ["laser-tag", "circus", "hakol-letova", "water-tag", "totat-ketzef", "lechem-vegvina", "beit-habad"] },
];

// ─── קטגוריות גיל ───
export const AGE_CATEGORIES: { id: "gan" | "yesodi" | "hatam" | "afternoon"; label: string; desc: string; emoji: string }[] = [
  { id: "gan", label: "גנים", desc: "גיל 3–6", emoji: "🧸" },
  { id: "yesodi", label: "יסודי", desc: "כיתות א'–ו'", emoji: "📚" },
  { id: "hatam", label: "חט\"ב", desc: "כיתות ז'–ט'", emoji: "🎒" },
  { id: "afternoon", label: "פעילות אחה\"צ", desc: "כל הגילאים", emoji: "🌅" },
];
