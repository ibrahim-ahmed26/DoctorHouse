"use client";
import { auth } from "@/lib/firebase/authClient";

// Wraps fetch() to attach the current user's Firebase ID token, for calling
// the /api/admin/* routes from client components in the dashboard.
export async function authFetch(input: string, init: RequestInit = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  const token = await user.getIdToken();

  return fetch(input, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${token}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
  });
}
