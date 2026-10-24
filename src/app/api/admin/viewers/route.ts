import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/docs/server";
import { requireRole, ADMINS } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const r = await requireRole(req, ADMINS);
  if ("error" in r) return r.error;
  const out: { uid: string; name: string; email: string; approved: boolean; created: string }[] = [];
  let token: string | undefined;
  do {
    const page = await adminAuth().listUsers(1000, token);
    for (const u of page.users)
      if ((u.customClaims as any)?.role === "viewer")
        out.push({ uid: u.uid, name: u.displayName || "", email: u.email || "", approved: !u.disabled, created: u.metadata.creationTime });
    token = page.pageToken;
  } while (token);
  out.sort((a, b) => Number(a.approved) - Number(b.approved) || b.created.localeCompare(a.created));
  return NextResponse.json({ viewers: out });
}
