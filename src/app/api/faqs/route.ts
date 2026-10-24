import { NextResponse } from "next/server";
import { adminDb } from "@/lib/docs/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snap = await adminDb().collection("faqs").orderBy("order").get();
    const faqs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as object) }));
    return NextResponse.json({ faqs });
  } catch {
    return NextResponse.json({ faqs: [] });
  }
}
