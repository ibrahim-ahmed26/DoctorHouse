import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireSuperAdmin } from "@/lib/auth/verifyRequest";
import cloudinary from "@/lib/cloudinaryAdmin";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const check = await requireSuperAdmin(req);
  if (!check.ok)
    return NextResponse.json({ error: check.error }, { status: check.status });

  const ref = getAdminDb().collection("pdfDocuments").doc(params.id);
  const doc = await ref.get();
  if (doc.exists) {
    const publicId = doc.data()?.publicId as string | undefined;
    if (publicId) {
      await cloudinary.uploader
        .destroy(publicId, { resource_type: "raw", type: "authenticated" })
        .catch(() => {});
    }
  }
  await ref.delete();
  return NextResponse.json({ ok: true });
}
