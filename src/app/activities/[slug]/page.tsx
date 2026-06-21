import { notFound } from "next/navigation";
import { dbList } from "@/lib/storage";
import { ACTIVITIES, type Activity } from "@/lib/data";
import ActivityView from "./ActivityView";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = await dbList<Activity>("activities", ACTIVITIES);
  const a = all.find(x => x.slug === slug) ?? ACTIVITIES.find(x => x.slug === slug);
  if (!a) notFound();
  return <ActivityView a={a} />;
}
