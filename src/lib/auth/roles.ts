import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/docs/server";

export type Role = "super_admin" | "admin" | "viewer";

export type Caller = { uid: string; email?: string; role: Role };

/** Verifies the Bearer token and REQUIRES an explicit role claim (no default). */
export async function getCaller(req: Request): Promise<Caller | null> {
  const h = req.headers.get("authorization") || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : "";
  if (!token) return null;
  try {
    const d = await adminAuth().verifyIdToken(token);
    const role = d.role as Role | undefined;
    if (role !== "super_admin" && role !== "admin" && role !== "viewer") return null;
    return { uid: d.uid, email: d.email, role };
  } catch {
    return null;
  }
}

/** Returns the caller, or a ready-made error Response. */
export async function requireRole(
  req: Request,
  allowed: Role[]
): Promise<{ caller: Caller } | { error: NextResponse }> {
  const caller = await getCaller(req);
  if (!caller) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (!allowed.includes(caller.role))
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { caller };
}

export const ADMINS: Role[] = ["super_admin", "admin"];
