import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { notifyAdminsOfNewLead } from "@/lib/email";
import type { LeadInput } from "@/lib/types";

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<LeadInput>;

  if (!body.name || !body.phone || !body.need) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const lead: LeadInput = {
    name: body.name,
    phone: body.phone,
    need: body.need,
    locale: body.locale ?? "en",
  };

  await getAdminDb()
    .collection("leads")
    .add({ ...lead, status: "new", createdAt: new Date() });

  // Fire the notification but don't let an email failure break the booking.
  notifyAdminsOfNewLead(lead).catch((err) =>
    console.error("Notification error:", err),
  );

  return NextResponse.json({ ok: true });
}
