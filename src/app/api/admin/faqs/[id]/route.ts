import { NextResponse } from "next/server";
import { adminDb } from "@/lib/docs/server";
import { requireRole, ADMINS } from "@/lib/auth/roles";
import { cleanFaq } from "@/lib/faqs";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const r = await requireRole(req, ADMINS);
  if ("error" in r) return r.error;
  const body = await req.json().catch(() => null);
  const c = cleanFaq(body);
  if (!c) return NextResponse.json({ error: "Invalid FAQ" }, { status: 400 });
  await adminDb().collection("faqs").doc(params.id).set(c);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const r = await requireRole(req, ADMINS);
  if ("error" in r) return r.error;
  await adminDb().collection("faqs").doc(params.id).delete();
  return NextResponse.json({ ok: true });
}
