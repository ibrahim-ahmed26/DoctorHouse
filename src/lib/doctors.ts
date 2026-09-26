import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Doctor } from "@/lib/types";

// Called from a Server Component — runs on the server on every request
// (add caching later with unstable_cache / fetch revalidate if needed).
export async function getDoctors(): Promise<Doctor[]> {
  const snap = await getDocs(query(collection(db, "doctors"), orderBy("order")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Doctor, "id">) }));
}
