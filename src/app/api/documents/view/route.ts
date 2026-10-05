import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import cloudinary from "@/lib/cloudinaryAdmin";
import type { PdfDoc } from "@/lib/types";

// Public, no password required — returns short-lived signed URLs for
// inline viewing only. Downloading still goes through /api/documents/verify,
// which requires the password.
export async function GET() {
  const snap = await getAdminDb()
    .collection("pdfDocuments")
    .orderBy("order")
    .get();
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 15; // 15-minute view link

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
