import { NextRequest, NextResponse } from "next/server";
import { dbGetDoc, dbSetDoc } from "@/lib/storage";
import { DEFAULT_CATEGORY_TREE, type CategoryGroup } from "@/lib/categories";

export async function GET() {
  const tree = await dbGetDoc<CategoryGroup[]>("categories", DEFAULT_CATEGORY_TREE);
  return NextResponse.json(tree);
}

export async function PUT(req: NextRequest) {
  const tree = (await req.json()) as CategoryGroup[];
  const persisted = await dbSetDoc("categories", tree);
  return NextResponse.json({ ok: true, persisted });
}
