import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth/verifyRequest";

export async function GET(req: Request) {
  const check = await requireAdmin(req);
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });

  const snap = await getAdminDb().collection("leads").orderBy("createdAt", "desc").get();
  const leads = snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name,
      phone: data.phone,
      need: data.need,
      locale: data.locale,
      status: data.status ?? "new",
      createdAt: data.createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
    };
  });
  return NextResponse.json({ leads });
}
