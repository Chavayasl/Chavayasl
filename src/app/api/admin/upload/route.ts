import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSignedUpload } from "@/lib/storage";

export async function POST(req: NextRequest) {
  // הגנה בסיסית — דורש התחברות אדמין
  const session = (await cookies()).get("chavaya_admin");
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { filename, folder } = await req.json();
  const result = await createSignedUpload(filename || "file.bin", folder || "uploads");
  if (!result) return NextResponse.json({ error: "upload init failed" }, { status: 500 });
  return NextResponse.json(result); // { uploadUrl, publicUrl }
}
