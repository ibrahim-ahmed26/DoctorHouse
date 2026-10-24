import { NextResponse } from "next/server";
import { adminDb } from "@/lib/docs/server";
import { requireRole, ADMINS } from "@/lib/auth/roles";
import { cleanFaq } from "@/lib/faqs";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const r = await requireRole(req, ADMINS);
  if ("error" in r) return r.error;
  const [snap, flag] = await Promise.all([
    adminDb().collection("faqs").orderBy("order").get(),
    adminDb().collection("settings").doc("faqsSeeded").get(),
  ]);
  return NextResponse.json({
    faqs: snap.docs.map((d) => ({ id: d.id, ...(d.data() as object) })),
    seeded: flag.exists,
  });
}

// POST { q, a, order? }  or  POST { bulk: [{q,a}, ...] } to import defaults
export async function POST(req: Request) {
  const r = await requireRole(req, ADMINS);
  if ("error" in r) return r.error;
  const body = await req.json().catch(() => null);
  const col = adminDb().collection("faqs");

  if (Array.isArray(body?.bulk)) {
    const existing = await col.count().get();
    let order = existing.data().count;
    const batch = adminDb().batch();
    for (const item of body.bulk.slice(0, 50)) {
      const c = cleanFaq({ ...item, order: order++ });
      if (c) batch.set(col.doc(), c);
    }
    batch.set(adminDb().collection("settings").doc("faqsSeeded"), {
      at: Date.now(),
    });
    await batch.commit();
    return NextResponse.json({ ok: true });
  }

  const c = cleanFaq(body);
  if (!c)
    return NextResponse.json(
      { error: "All four fields (EN/AR question and answer) are required" },
      { status: 400 },
    );
  if (!Number.isFinite(body?.order))
    c.order = (await col.count().get()).data().count;
  const ref = await col.add(c);
  return NextResponse.json({ id: ref.id });
}
