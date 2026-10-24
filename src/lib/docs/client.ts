// BROWSER ONLY (used by "use client" components). No firebase-admin here.
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export function clientAuth() {
  const app =
    getApps()[0] ??
    initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
  return getAuth(app);
}

/** fetch with the signed-in user's ID token attached */
export async function authFetch(url: string, init: RequestInit = {}) {
  const user = clientAuth().currentUser;
  const token = user ? await user.getIdToken() : "";
  return fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
}
