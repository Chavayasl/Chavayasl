import { NextRequest, NextResponse } from "next/server";
import { dbList, dbInsert, dbUpdate } from "@/lib/storage";
import { sendEmail, leadEmailHtml } from "@/lib/notify";
import { forwardToZoho } from "@/lib/zoho";
import { ACTIVITIES } from "@/lib/data";

const AGE_LABELS: Record<string, string> = {
  AGE_3_5: "גיל 3–5 (גן)", AGE_6_8: "גיל 6–8", AGE_9_12: "גיל 9–12", MIXED: "מעורב",
};

export interface Booking {
  id: string;
  contactName: string;
  institution: string;
  phone: string;
  email: string;
  activityId: string;
  preferredDate: string;
  alternativeDate?: string;
  participantsCount: string;
  ageGroup: string;
  notes?: string;
  status: "new" | "contacted" | "confirmed" | "cancelled";
  createdAt: string;
}

export async function GET() {
  const bookings = await dbList<Booking>("bookings");
  return NextResponse.json(bookings.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newBooking: Booking = {
    ...body,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  await dbInsert("bookings", newBooking);

  // התראת אימייל
  const act = ACTIVITIES.find(a => a.slug === body.activityId || a.id === body.activityId);
  await sendEmail("🎉 הזמנה חדשה מהאתר", leadEmailHtml("🎉 הזמנה חדשה", [
    ["פעילות", act ? act.name : body.activityId],
    ["איש קשר", body.contactName],
    ["מוסד", body.institution],
    ["טלפון", body.phone],
    ["אימייל", body.email],
    ["תאריך מועדף", `${body.preferredDate || ""}${body.alternativeDate ? ` (חלופי: ${body.alternativeDate})` : ""}`],
    ["משתתפים", body.participantsCount],
    ["גיל", AGE_LABELS[body.ageGroup] || body.ageGroup],
    ["הערות", body.notes],
  ]));

  // העברת הליד ל-Zoho CRM
  await forwardToZoho({
    Name: body.contactName,
    Email: body.email,
    PhoneNumber: body.phone,
    MultiLine: [
      `פעילות: ${act ? act.name : body.activityId}`,
      `מוסד: ${body.institution}`,
      `תאריך מועדף: ${body.preferredDate}${body.alternativeDate ? ` (חלופי: ${body.alternativeDate})` : ""}`,
      `משתתפים: ${body.participantsCount}`,
      `גיל: ${AGE_LABELS[body.ageGroup] || body.ageGroup || ""}`,
      body.notes ? `הערות: ${body.notes}` : "",
    ].filter(Boolean).join("\n"),
  });

  return NextResponse.json(newBooking, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  const ok = await dbUpdate<Booking>("bookings", id, { status });
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
