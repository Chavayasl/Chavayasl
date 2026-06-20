import { NextRequest, NextResponse } from "next/server";
import { dbUpdate, dbDelete } from "@/lib/storage";
import type { Activity } from "@/lib/data";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const ok = await dbUpdate<Activity>("activities", id, body);
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = await dbDelete("activities", [id]);
  return NextResponse.json({ ok });
}
