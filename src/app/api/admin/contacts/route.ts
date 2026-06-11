import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/storage";
import { sendEmail, leadEmailHtml } from "@/lib/notify";

export interface Contact {
  id: string;
  name: string;
  institution: string;
  phone: string;
  activity?: string;
  notes?: string;
  status: "new" | "contacted" | "done";
  createdAt: string;
}

export async function GET() {
  const contacts = readDb<Contact>("contacts", []);
  return NextResponse.json(contacts.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const contacts = readDb<Contact>("contacts", []);
  const newContact: Contact = {
    ...body,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  contacts.push(newContact);
  writeDb("contacts", contacts);

  // התראת אימייל
  await sendEmail("📩 פנייה חדשה מהאתר", leadEmailHtml("📩 פנייה חדשה", [
    ["שם", body.name],
    ["מוסד", body.institution],
    ["טלפון", body.phone],
    ["פעילות", body.activity],
    ["הערות", body.notes],
  ]));

  return NextResponse.json(newContact, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  const contacts = readDb<Contact>("contacts", []);
  const idx = contacts.findIndex(c => c.id === id);
  if (idx === -1) return NextResponse.json({ error: "not found" }, { status: 404 });
  contacts[idx].status = status;
  writeDb("contacts", contacts);
  return NextResponse.json(contacts[idx]);
}
