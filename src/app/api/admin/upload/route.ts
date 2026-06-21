import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { uploadFile } from "@/lib/storage";

export async function POST(req: NextRequest) {
  // הגנה בסיסית — דורש התחברות אדמין
  const session = (await cookies()).get("chavaya_admin");
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const folder = (form.get("folder") as string) || "uploads";
  if (!file) return NextResponse.json({ error: "no file" }, { status: 400 });

  const url = await uploadFile(file, folder);
  if (!url) return NextResponse.json({ error: "upload failed" }, { status: 500 });
  return NextResponse.json({ url });
}
