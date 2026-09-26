// Server-only Firebase Admin SDK. Import this ONLY from server code
// (Server Components, Route Handlers, Server Actions) — never from
// a "use client" file, or your service account key would leak to the browser.
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

let cachedDb: Firestore | null = null;
let cachedAuth: Auth | null = null;

function getAdminApp(): App {
  if (getApps().length) return getApps()[0];

  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

// Lazy getters — only build the credential the first time they're actually
// called, which guarantees env vars are already loaded by then.
export function getAdminDb(): Firestore {
  if (!cachedDb) cachedDb = getFirestore(getAdminApp());
  return cachedDb;
}

export function getAdminAuth(): Auth {
  if (!cachedAuth) cachedAuth = getAuth(getAdminApp());
  return cachedAuth;
}
