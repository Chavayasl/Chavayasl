import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dbList } from "@/lib/storage";
import { ACTIVITIES, type Activity } from "@/lib/data";
import ActivityView from "./ActivityView";

export const dynamic = "force-dynamic";

// התאמת slug עמידה — slug בעברית מגיע לעיתים מקודד (%D7..) ו/או בצורת Unicode שונה.
// בודקים גם את הצורה המקורית, המפוענחת, והמנורמלת (NFC) מול ה-DB וגם מול ברירות המחדל.
function findActivity(all: Activity[], rawSlug: string): Activity | undefined {
  const keys = new Set<string>([rawSlug]);
  try { keys.add(decodeURIComponent(rawSlug)); } catch { /* noop */ }
  try { keys.add(encodeURIComponent(rawSlug)); } catch { /* noop */ }
  const normed = new Set<string>();
  for (const k of keys) normed.add(k.normalize("NFC"));
  const match = (s?: string) => !!s && (keys.has(s) || normed.has(s.normalize("NFC")));
  return all.find(x => match(x.slug)) ?? ACTIVITIES.find(x => match(x.slug));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const all = await dbList<Activity>("activities", ACTIVITIES);
  const a = findActivity(all, slug);
  if (!a) return { title: "פעילות לא נמצאה" };
  const title = `${a.name} — הפעלה לילדים, לבתי ספר וגנים`;
  return {
    title,
    description: a.shortDescription,
    alternates: { canonical: `/activities/${a.slug}` },
    openGraph: { title, description: a.shortDescription, type: "website" },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = await dbList<Activity>("activities", ACTIVITIES);
  const a = findActivity(all, slug);
  if (!a) notFound();
  return <ActivityView a={a} />;
}
