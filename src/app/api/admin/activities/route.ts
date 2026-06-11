import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, genId } from "@/lib/storage";
import { ACTIVITIES } from "@/lib/data";
import type { Activity } from "@/lib/data";

export async function GET() {
  const activities = readDb<Activity>("activities", ACTIVITIES);
  return NextResponse.json(activities);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const activities = readDb<Activity>("activities", ACTIVITIES);
  const newActivity: Activity = {
    ...body,
    id: genId(),
    slug: body.slug || body.name.replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
  };
  activities.push(newActivity);
  writeDb("activities", activities);
  return NextResponse.json(newActivity, { status: 201 });
}
