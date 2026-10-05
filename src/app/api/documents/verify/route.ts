import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { hashPassword } from "@/lib/password";
import cloudinary from "@/lib/cloudinaryAdmin";
import type { PdfDoc } from "@/lib/types";

export async function POST(req: Request) {
  const body = (await req.json()) as { password?: string };
  if (!body.password) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  const passDoc = await getAdminDb()
    .collection("settings")
    .doc("documentsPassword")
    .get();
  if (!passDoc.exists || passDoc.data()?.hash !== hashPassword(body.password)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const snap = await getAdminDb()
    .collection("pdfDocuments")
    .orderBy("order")
    .get();
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 10; // 10-minute signed link

  const docs = snap.docs.map((d) => {
    const data = d.data() as Omit<PdfDoc, "id">;
    const url = cloudinary.url(data.publicId, {
      resource_type: "raw",
      type: "authenticated",
      sign_url: true,
      secure: true,
      expires_at: expiresAt,
    });
    return { id: d.id, title: data.title, url };
  });

  return NextResponse.json({ docs });
}
