import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function filePath(name: string) {
  return path.join(DATA_DIR, `${name}.json`);
}

export function readDb<T>(name: string, defaults: T[]): T[] {
  try {
    ensureDir();
    const fp = filePath(name);
    if (!fs.existsSync(fp)) {
      try { fs.writeFileSync(fp, JSON.stringify(defaults, null, 2)); } catch { /* read-only FS (Vercel) */ }
      return defaults;
    }
    return JSON.parse(fs.readFileSync(fp, "utf8")) as T[];
  } catch {
    return defaults;
  }
}

// כתיבה best-effort — ב-Vercel מערכת הקבצים לקריאה בלבד, אז לא מפילים את הבקשה.
export function writeDb<T>(name: string, data: T[]): boolean {
  try {
    ensureDir();
    fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.warn(`[storage] writeDb(${name}) נכשל (מערכת קבצים לקריאה בלבד?):`, (e as Error).message);
    return false;
  }
}

export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
