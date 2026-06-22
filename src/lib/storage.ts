import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ─── חיבור ל-Supabase (צד שרת בלבד, עם service role) ───
const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase: SupabaseClient | null = null;
if (url && serviceKey) {
  supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
} else {
  console.warn("[storage] חסרים SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY — הנתונים לא יישמרו");
}

export const dbReady = () => supabase !== null;

interface HasId { id: string }

// כל טבלה: (id text primary key, data jsonb, created_at timestamptz default now())

/** מחזיר את כל השורות. אם הטבלה ריקה ויש seed — מאתחל אותה פעם אחת. */
export async function dbList<T extends HasId>(table: string, seed?: T[]): Promise<T[]> {
  if (!supabase) return seed ?? [];
  const { data, error } = await supabase.from(table).select("data, created_at").order("created_at", { ascending: true });
  if (error) { console.error(`[storage] dbList(${table}):`, error.message); return seed ?? []; }
  if ((!data || data.length === 0) && seed && seed.length) {
    const { error: seedErr } = await supabase.from(table).insert(seed.map(s => ({ id: s.id, data: s })));
    if (seedErr) console.error(`[storage] seed(${table}):`, seedErr.message);
    return seed;
  }
  return (data ?? []).map(r => r.data as T);
}

/** מוסיף שורה אחת (insert בטוח, ללא race). */
export async function dbInsert<T extends HasId>(table: string, obj: T): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from(table).insert({ id: obj.id, data: obj });
  if (error) { console.error(`[storage] dbInsert(${table}):`, error.message); return false; }
  return true;
}

/** ממזג patch לתוך שורה קיימת לפי id. */
export async function dbUpdate<T extends HasId>(table: string, id: string, patch: Partial<T>): Promise<boolean> {
  if (!supabase) return false;
  const { data: existing, error: readErr } = await supabase.from(table).select("data").eq("id", id).maybeSingle();
  if (readErr) { console.error(`[storage] dbUpdate read(${table}):`, readErr.message); return false; }
  if (!existing) return false;
  const merged = { ...(existing.data as T), ...patch, id };
  const { error } = await supabase.from(table).update({ data: merged }).eq("id", id);
  if (error) { console.error(`[storage] dbUpdate(${table}):`, error.message); return false; }
  return true;
}

/** מוחק שורה אחת או כמה לפי id. */
export async function dbDelete(table: string, ids: string[]): Promise<boolean> {
  if (!supabase || ids.length === 0) return false;
  const { error } = await supabase.from(table).delete().in("id", ids);
  if (error) { console.error(`[storage] dbDelete(${table}):`, error.message); return false; }
  return true;
}

export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ─── מסמך יחיד (singleton) — לעץ הקטגוריות ───
export async function dbGetDoc<T>(table: string, def: T): Promise<T> {
  if (!supabase) return def;
  const { data, error } = await supabase.from(table).select("data").eq("id", "tree").maybeSingle();
  if (error) { console.error(`[storage] dbGetDoc(${table}):`, error.message); return def; }
  if (!data) {
    const { error: seedErr } = await supabase.from(table).insert({ id: "tree", data: def });
    if (seedErr) console.error(`[storage] seed(${table}):`, seedErr.message);
    return def;
  }
  return data.data as T;
}

export async function dbSetDoc<T>(table: string, value: T): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from(table).upsert({ id: "tree", data: value });
  if (error) { console.error(`[storage] dbSetDoc(${table}):`, error.message); return false; }
  return true;
}

/** מעלה קובץ ל-Supabase Storage (bucket "media") ומחזיר URL ציבורי. */
export async function uploadFile(file: File, folder = "uploads"): Promise<string | null> {
  if (!supabase) return null;
  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from("media").upload(path, bytes, {
    contentType: file.type || "application/octet-stream", upsert: false,
  });
  if (error) { console.error("[storage] uploadFile:", error.message); return null; }
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}
