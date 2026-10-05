"use client";
import { auth } from "@/lib/firebase/authClient";

// Wraps fetch() to attach the current user's Firebase ID token, for calling
// the /api/admin/* routes from client components in the dashboard.
export async function authFetch(input: string, init: RequestInit = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  const token = await user.getIdToken();

  // Only force JSON content-type for plain string bodies (our usual
  // JSON.stringify(...) calls). FormData bodies (file uploads) must set
  // their own multipart boundary automatically — overriding it breaks
  // the upload, which is what was happening here.
  const isJsonBody = typeof init.body === "string";

  return fetch(input, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${token}`,
      ...(isJsonBody ? { "Content-Type": "application/json" } : {}),
    },
  });
}
