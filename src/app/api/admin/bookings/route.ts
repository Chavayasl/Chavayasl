import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/storage";
import { sendEmail, leadEmailHtml } from "@/lib/notify";
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
  const bookings = readDb<Booking>("bookings", []);
  return NextResponse.json(bookings.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const bookings = readDb<Booking>("bookings", []);
  const newBooking: Booking = {
    ...body,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  bookings.push(newBooking);
  writeDb("bookings", bookings);

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

  return NextResponse.json(newBooking, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  const bookings = readDb<Booking>("bookings", []);
  const idx = bookings.findIndex(b => b.id === id);
  if (idx === -1) return NextResponse.json({ error: "not found" }, { status: 404 });
  bookings[idx].status = status;
  writeDb("bookings", bookings);
  return NextResponse.json(bookings[idx]);
}
