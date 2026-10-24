// SERVER ONLY. Reuses your existing admin helpers.
import "server-only";
import { getAdminDb, getAdminAuth } from "@/lib/firebase/admin";

export const adminDb = () => getAdminDb();
export const adminAuth = () => getAdminAuth();
