import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/docs/server";
import { requireRole, ADMINS } from "@/lib/auth/roles";

// Only ever touches accounts whose role is "viewer" — never other admins.
async function viewerOnly(uid: string) {
  const u = await adminAuth().getUser(uid).catch(() => null);
  return u && (u.customClaims as any)?.role === "viewer" ? u : null;
}

export async function PATCH(req: Request, { params }: { params: { uid: string } }) {
  const r = await requireRole(req, ADMINS);
  if ("error" in r) return r.error;
  const u = await viewerOnly(params.uid);
  if (!u) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { action } = await req.json().catch(() => ({}));
  if (action === "approve") await adminAuth().updateUser(u.uid, { disabled: false });
  else if (action === "suspend") await adminAuth().updateUser(u.uid, { disabled: true });
  else return NextResponse.json({ error: "Bad action" }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: { uid: string } }) {
  const r = await requireRole(req, ADMINS);
  if ("error" in r) return r.error;
  const u = await viewerOnly(params.uid);
  if (!u) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await adminAuth().deleteUser(u.uid);
  return NextResponse.json({ ok: true });
}
