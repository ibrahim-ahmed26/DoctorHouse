// Run with: npm run make:super-admin -- your@email.com
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { getAdminAuth } from "../lib/firebase/admin";

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npm run make:super-admin -- your@email.com");
    process.exit(1);
  }

  const user = await getAdminAuth().getUserByEmail(email);
  await getAdminAuth().setCustomUserClaims(user.uid, { role: "super_admin" });
  console.log(`${email} is now a Super Administrator.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
