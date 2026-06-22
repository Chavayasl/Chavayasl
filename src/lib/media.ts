// ─── עזרי יוטיוב (תמיכה בקישור יוטיוב או קובץ וידאו מועלה) ───
export function ytId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export function ytEmbed(id: string, opts: { autoplay?: boolean; mute?: boolean; loop?: boolean; controls?: boolean } = {}): string {
  const p = new URLSearchParams();
  if (opts.autoplay) p.set("autoplay", "1");
  if (opts.mute) p.set("mute", "1");
  if (opts.loop) { p.set("loop", "1"); p.set("playlist", id); }
  if (opts.controls === false) p.set("controls", "0");
  p.set("rel", "0");
  p.set("playsinline", "1");
  return `https://www.youtube.com/embed/${id}?${p.toString()}`;
}

export function ytThumb(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
