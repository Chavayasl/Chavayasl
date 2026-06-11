import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/storage";
import { ACTIVITIES } from "@/lib/data";
import type { Activity } from "@/lib/data";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const activities = readDb<Activity>("activities", ACTIVITIES);
  const idx = activities.findIndex(a => a.id === id);
  if (idx === -1) return NextResponse.json({ error: "not found" }, { status: 404 });
  activities[idx] = { ...activities[idx], ...body };
  writeDb("activities", activities);
  return NextResponse.json(activities[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const activities = readDb<Activity>("activities", ACTIVITIES);
  const filtered = activities.filter(a => a.id !== id);
  writeDb("activities", filtered);
  return NextResponse.json({ ok: true });
}
