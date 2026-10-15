import { NextRequest, NextResponse } from "next/server";
import { dbUpdate, dbDelete } from "@/lib/storage";
import { toSlug, type Activity } from "@/lib/data";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  // הבטחת slug תקין בעריכה — אם ריק/שבור, נגזר מהשם; לא דורסים slug קיים בריק
  if (body && typeof body === "object" && "slug" in body) {
    const cleaned = toSlug(body.slug) || toSlug(body.name || "");
    if (cleaned) body.slug = cleaned;
    else delete body.slug;
  }
  const ok = await dbUpdate<Activity>("activities", id, body);
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = await dbDelete("activities", [id]);
  return NextResponse.json({ ok });
}
