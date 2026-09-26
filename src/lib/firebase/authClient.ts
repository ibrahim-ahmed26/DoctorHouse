// Client-side Firebase Auth — for the admin login page and dashboard.
import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/lib/firebase/client";

export const auth = getAuth(firebaseApp);
