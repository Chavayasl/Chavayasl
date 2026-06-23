import type { MetadataRoute } from "next";
import { dbList } from "@/lib/storage";
import { ACTIVITIES, type Activity } from "@/lib/data";

const BASE = "https://chavayasl.co.il";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/accessibility`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  let activities: Activity[] = ACTIVITIES;
  try { activities = await dbList<Activity>("activities", ACTIVITIES); } catch { /* fallback */ }

  const activityPages: MetadataRoute.Sitemap = activities.map(a => ({
    url: `${BASE}/activities/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...activityPages];
}
