import { NextRequest, NextResponse } from "next/server";
import { dbList, dbInsert, dbUpdate } from "@/lib/storage";
import { sendEmail, leadEmailHtml } from "@/lib/notify";
import { forwardToZoho } from "@/lib/zoho";

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
  const contacts = await dbList<Contact>("contacts");
  return NextResponse.json(contacts.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newContact: Contact = {
    ...body,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  await dbInsert("contacts", newContact);

  // התראת אימייל
  await sendEmail("📩 פנייה חדשה מהאתר", leadEmailHtml("📩 פנייה חדשה", [
    ["שם", body.name],
    ["מוסד", body.institution],
    ["טלפון", body.phone],
    ["פעילות", body.activity],
    ["הערות", body.notes],
  ]));

  // העברת הליד ל-Zoho CRM
  await forwardToZoho({
    Name: body.name,
    PhoneNumber: body.phone,
    MultiLine: [
      `מוסד: ${body.institution}`,
      body.activity ? `פעילות: ${body.activity}` : "",
      body.notes ? `הערות: ${body.notes}` : "",
      "(מקור: טופס יצירת קשר באתר)",
    ].filter(Boolean).join("\n"),
  });

  return NextResponse.json(newContact, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  const ok = await dbUpdate<Contact>("contacts", id, { status });
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
