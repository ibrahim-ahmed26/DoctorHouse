import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import type { PdfDoc } from "@/lib/types";

export async function GET() {
  const snap = await getAdminDb()
    .collection("pdfDocuments")
    .orderBy("order")
    .get();
  const docs = snap.docs.map((d) => {
    const data = d.data() as Omit<PdfDoc, "id">;
    return { id: d.id, title: data.title };
  });
  return NextResponse.json({ docs });
}
