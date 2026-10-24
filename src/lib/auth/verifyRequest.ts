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
    const role = decoded.role;

    // Must have an explicit admin role. No role (or "viewer") = no access.
    if (role !== "admin" && role !== "super_admin") {
      return {
        ok: false as const,
        status: 403,
        error: "Admin access required",
      };
    }

    return { ok: true as const, uid: decoded.uid, role: role as Role };
  } catch {
    return {
      ok: false as const,
      status: 401,
      error: "Invalid or expired token",
    };
  }
}

// Any admin or super admin — used by doctors/leads/faqs routes.
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
