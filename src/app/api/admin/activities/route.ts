import { NextRequest, NextResponse } from "next/server";
import { dbList, dbInsert, dbUpdate, dbDelete, genId } from "@/lib/storage";
import { ACTIVITIES } from "@/lib/data";
import type { Activity } from "@/lib/data";

export async function GET() {
  const activities = await dbList<Activity>("activities", ACTIVITIES);
  return NextResponse.json(activities);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newActivity: Activity = {
    ...body,
    id: genId(),
    slug: body.slug || body.name.trim().replace(/\s+/g, "-").replace(/[^\w֐-׿-]/g, ""),
  };
  const ok = await dbInsert("activities", newActivity);
  return NextResponse.json({ ...newActivity, persisted: ok }, { status: 201 });
}

// פעולות מרובות (bulk): מחיקה, סימון מומלץ, שיוך לעונה/חג
export async function PATCH(req: NextRequest) {
  const { ids, action, value } = await req.json() as {
    ids: string[]; action: "delete" | "feature" | "unfeature" | "addSeason" | "removeSeason"; value?: string;
  };

  if (action === "delete") {
    const persisted = await dbDelete("activities", ids);
    return NextResponse.json({ ok: true, count: ids.length, persisted });
  }

  const idset = new Set(ids || []);
  const all = await dbList<Activity>("activities", ACTIVITIES);
  let persisted = true;
  for (const a of all) {
    if (!idset.has(a.id)) continue;
    let patch: Partial<Activity> | null = null;
    if (action === "feature") patch = { isFeatured: true };
    else if (action === "unfeature") patch = { isFeatured: false };
    else if (action === "addSeason" && value) patch = a.seasons.includes(value) ? null : { seasons: [...a.seasons, value] };
    else if (action === "removeSeason" && value) patch = { seasons: a.seasons.filter(s => s !== value) };
    if (patch) {
      const ok = await dbUpdate<Activity>("activities", a.id, patch);
      if (!ok) persisted = false;
    }
  }
  return NextResponse.json({ ok: true, count: idset.size, persisted });
}
