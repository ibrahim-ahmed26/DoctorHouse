import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth/verifyRequest";
import type { Doctor } from "@/lib/types";

// GET: list all doctors (admin view — same data as the public site, just
// reached through the verified admin path so the dashboard can also see
// unpublished / freshly-added ones instantly without waiting on public rules).
export async function GET(req: Request) {
  const check = await requireAdmin(req);
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });

  const snap = await getAdminDb().collection("doctors").orderBy("order").get();
  const doctors = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Doctor, "id">) }));
  return NextResponse.json({ doctors });
}

// POST: create a new doctor.
export async function POST(req: Request) {
  const check = await requireAdmin(req);
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });

  const body = (await req.json()) as Omit<Doctor, "id">;
  const ref = await getAdminDb().collection("doctors").add(body);
  return NextResponse.json({ id: ref.id });
}
