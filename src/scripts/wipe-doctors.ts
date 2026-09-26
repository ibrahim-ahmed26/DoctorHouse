// Run with: npm run wipe:doctors
// Deletes EVERY document in the doctors collection. No undo.
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { getAdminDb } from "../lib/firebase/admin";

async function main() {
  const snap = await getAdminDb().collection("doctors").get();
  if (snap.empty) {
    console.log("Nothing to delete — doctors collection is already empty.");
    return;
  }

  const batch = getAdminDb().batch();
  snap.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  console.log(`Deleted ${snap.size} doctor document(s).`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
