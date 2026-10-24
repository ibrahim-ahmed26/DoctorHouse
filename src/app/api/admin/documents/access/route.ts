import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/docs/server";

// Public: a visitor asks for access. Creates a DISABLED account (they chose the
// password) and emails the admin. They can sign in only after the admin approves.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = String(body?.name || "")
    .trim()
    .slice(0, 80);
  const email = String(body?.email || "")
    .trim()
    .toLowerCase()
    .slice(0, 120);
  const password = String(body?.password || "");

  if (
    !name ||
    !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ||
    password.length < 8 ||
    password.length > 100
  )
    return NextResponse.json(
      {
        error:
          "Enter your name, a valid email and a password of 8+ characters.",
      },
      { status: 400 },
    );

  try {
    const user = await adminAuth().createUser({
      email,
      password,
      displayName: name,
      disabled: true,
    });
    await adminAuth().setCustomUserClaims(user.uid, { role: "viewer" });
  } catch (e: any) {
    if (e?.code === "auth/email-already-exists")
      return NextResponse.json(
        {
          error: "This email already has a request or account. Try signing in.",
        },
        { status: 409 },
      );
    return NextResponse.json(
      { error: "Could not submit the request." },
      { status: 500 },
    );
  }

  // Notify the admin (best effort — request is saved either way).
  const to = process.env.ADMIN_NOTIFY_EMAIL;
  const key = process.env.RESEND_API_KEY;
  if (to && key) {
    const site = process.env.NEXT_PUBLIC_SITE_URL || "";
    const esc = (s: string) =>
      s.replace(
        /[<>&"]/g,
        (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c]!,
      );
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.RESEND_FROM ||
          "Doctor House Care <onboarding@resend.dev>",
        to,
        subject: "New access request — Doctor's Guides",
        html: `<p><b>${esc(name)}</b> (${esc(email)}) requested access to the documents.</p><p><a href="${site}/admin/access">Review in the dashboard</a></p>`,
      }),
    }).catch(() => {});
  }
  return NextResponse.json({ ok: true });
}
