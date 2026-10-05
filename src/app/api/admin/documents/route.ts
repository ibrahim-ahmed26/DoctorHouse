import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireSuperAdmin } from "@/lib/auth/verifyRequest";
import cloudinary from "@/lib/cloudinaryAdmin";
import { hashPassword } from "@/lib/password";
import type { PdfDoc } from "@/lib/types";

export async function GET(req: Request) {
  const check = await requireSuperAdmin(req);
  if (!check.ok)
    return NextResponse.json({ error: check.error }, { status: check.status });

  const snap = await getAdminDb()
    .collection("pdfDocuments")
    .orderBy("order")
    .get();
  const docs = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<PdfDoc, "id">),
  }));

  const passwordDoc = await getAdminDb()
    .collection("settings")
    .doc("documentsPassword")
    .get();
  const hasPassword = passwordDoc.exists && !!passwordDoc.data()?.hash;

  return NextResponse.json({ docs, hasPassword });
}

// Upload a new PDF (multipart form: file, titleEn, titleAr, order)
export async function POST(req: Request) {
  const check = await requireSuperAdmin(req);
  if (!check.ok)
    return NextResponse.json({ error: check.error }, { status: check.status });

  const existing = await getAdminDb().collection("pdfDocuments").get();
  if (existing.size >= 3) {
    return NextResponse.json(
      { error: "Maximum of 3 documents reached. Delete one first." },
      { status: 400 },
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const titleEn = formData.get("titleEn") as string;
  const titleAr = formData.get("titleAr") as string;
  const order = Number(formData.get("order") ?? existing.size + 1);

  if (!file || !titleEn || !titleAr) {
    return NextResponse.json(
      { error: "Missing file or title" },
      { status: 400 },
    );
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = `data:application/pdf;base64,${buffer.toString("base64")}`;

  const upload = await cloudinary.uploader.upload(base64, {
    resource_type: "raw",
    type: "authenticated",
    folder: "documents",
    format: "pdf",
  });

  const ref = await getAdminDb()
    .collection("pdfDocuments")
    .add({
      title: { en: titleEn, ar: titleAr },
      publicId: upload.public_id,
      order,
    });

  return NextResponse.json({ id: ref.id });
}

// Set or update the shared viewer password
export async function PUT(req: Request) {
  const check = await requireSuperAdmin(req);
  if (!check.ok)
    return NextResponse.json({ error: check.error }, { status: check.status });

  const body = (await req.json()) as { password?: string };
  if (!body.password || body.password.length < 4) {
    return NextResponse.json(
      { error: "Password must be at least 4 characters" },
      { status: 400 },
    );
  }

  await getAdminDb()
    .collection("settings")
    .doc("documentsPassword")
    .set({
      hash: hashPassword(body.password),
    });

  return NextResponse.json({ ok: true });
}
