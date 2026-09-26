import { getAdminAuth } from "@/lib/firebase/admin";

export type Role = "super_admin" | "admin";

async function verify(req: Request) {
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token)
    return {
      ok: false as const,
      status: 401,
      error: "Missing Authorization header",
    };

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    const role: Role = (decoded.role as Role) ?? "admin"; // default: least privilege
    return { ok: true as const, uid: decoded.uid, role };
  } catch {
    return {
      ok: false as const,
      status: 401,
      error: "Invalid or expired token",
    };
  }
}

// Any signed-in dashboard user — used by doctors/leads routes.
export async function requireAdmin(req: Request) {
  return verify(req);
}

// Only super admins — used by the users management routes.
export async function requireSuperAdmin(req: Request) {
  const check = await verify(req);
  if (!check.ok) return check;
  if (check.role !== "super_admin") {
    return {
      ok: false as const,
      status: 403,
      error: "Super admin access required",
    };
  }
  return check;
}
