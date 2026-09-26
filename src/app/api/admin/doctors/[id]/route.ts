import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth/verifyRequest";
import type { Doctor } from "@/lib/types";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const check = await requireAdmin(req);
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });

  const body = (await req.json()) as Omit<Doctor, "id">;
  await getAdminDb().collection("doctors").doc(params.id).set(body, { merge: true });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const check = await requireAdmin(req);
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });

  await getAdminDb().collection("doctors").doc(params.id).delete();
  return NextResponse.json({ ok: true });
}
