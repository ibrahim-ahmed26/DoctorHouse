import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth/verifyRequest";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const check = await requireAdmin(req);
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });

  const body = (await req.json()) as { status: "new" | "contacted" | "done" };
  await getAdminDb().collection("leads").doc(params.id).update({ status: body.status });
  return NextResponse.json({ ok: true });
}
