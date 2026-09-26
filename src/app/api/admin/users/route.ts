import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import { requireSuperAdmin } from "@/lib/auth/verifyRequest";

export async function GET(req: Request) {
  const check = await requireSuperAdmin(req);
  if (!check.ok)
    return NextResponse.json({ error: check.error }, { status: check.status });

  const list = await getAdminAuth().listUsers(1000);
  const users = list.users.map((u) => ({
    uid: u.uid,
    email: u.email,
    createdAt: u.metadata.creationTime,
    role: (u.customClaims?.role as string) ?? "admin",
  }));
  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const check = await requireSuperAdmin(req);
  if (!check.ok)
    return NextResponse.json({ error: check.error }, { status: check.status });

  const body = (await req.json()) as {
    email?: string;
    password?: string;
    role?: string;
  };
  if (!body.email || !body.password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }
  if (body.password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 },
    );
  }
  const role = body.role === "super_admin" ? "super_admin" : "admin";

  try {
    const user = await getAdminAuth().createUser({
      email: body.email,
      password: body.password,
    });
    await getAdminAuth().setCustomUserClaims(user.uid, { role });
    return NextResponse.json({ uid: user.uid });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Could not create user" },
      { status: 400 },
    );
  }
}
