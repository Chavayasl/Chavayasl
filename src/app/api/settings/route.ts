import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSettings, setSettings, type SiteSettings } from "@/lib/settings";

export async function GET() {
  return NextResponse.json(await getSettings());
}

export async function PUT(req: NextRequest) {
  const session = (await cookies()).get("chavaya_admin");
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const s = (await req.json()) as SiteSettings;
  const persisted = await setSettings(s);
  return NextResponse.json({ ok: true, persisted });
}
