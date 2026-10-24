// Lists Firebase users that have NO role claim (these currently pass requireAdmin!).
// Run from the project root:  node --env-file=.env.local src/scripts/audit-roles.mjs
// Add --fix to give every listed user role "admin" (only after you've checked the list).
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(
      /\\n/g,
      "\n",
    ),
  }),
});

const auth = getAuth();
const fix = process.argv.includes("--fix");
let token;
do {
  const page = await auth.listUsers(1000, token);
  for (const u of page.users) {
    const role = u.customClaims?.role;
    if (!role) {
      console.log(`NO ROLE  ${u.email}  (created ${u.metadata.creationTime})`);
      if (fix) await auth.setCustomUserClaims(u.uid, { role: "admin" });
    } else console.log(`${role.padEnd(11)}${u.email}`);
  }
  token = page.pageToken;
} while (token);
