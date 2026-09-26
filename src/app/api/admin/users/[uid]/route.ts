import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import { requireSuperAdmin } from "@/lib/auth/verifyRequest";

export async function DELETE(
  req: Request,
  { params }: { params: { uid: string } },
) {
  const check = await requireSuperAdmin(req);
  if (!check.ok)
    return NextResponse.json({ error: check.error }, { status: check.status });

  if (check.uid === params.uid) {
    return NextResponse.json(
      { error: "You can't delete your own account" },
      { status: 400 },
    );
  }

  await getAdminAuth().deleteUser(params.uid);
  return NextResponse.json({ ok: true });
}

export async function PATCH(
  req: Request,
  { params }: { params: { uid: string } },
) {
  const check = await requireSuperAdmin(req);
  if (!check.ok)
    return NextResponse.json({ error: check.error }, { status: check.status });

  const body = (await req.json()) as { role?: string };
  const role = body.role === "super_admin" ? "super_admin" : "admin";
  await getAdminAuth().setCustomUserClaims(params.uid, { role });
  return NextResponse.json({ ok: true });
}
