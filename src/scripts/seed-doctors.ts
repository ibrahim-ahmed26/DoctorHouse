import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { getAdminDb } from "../lib/firebase/admin";
import type { Doctor } from "../lib/types";

const doctors: Omit<Doctor, "id">[] = [
  {
    order: 1,
    name: {
      en: "Dr. Sample One",
      ar: "\u062F. \u0627\u0633\u0645 \u062A\u062C\u0631\u064A\u0628\u064A \u0661",
    },
    specialty: {
      en: "Internal Medicine",
      ar: "\u0627\u0644\u0628\u0627\u0637\u0646\u0629",
    },
    experience: {
      en: "MD, 15 years",
      ar: "\u062F\u0643\u062A\u0648\u0631\u0627\u0647\u060C \u0665\u0661 \u0633\u0646\u0629",
    },
    highlights: {
      en: ["Chronic disease care", "Post-hospital follow-up"],
      ar: [
        "\u0631\u0639\u0627\u064A\u0629 \u0627\u0644\u0623\u0645\u0631\u0627\u0636 \u0627\u0644\u0645\u0632\u0645\u0646\u0629",
        "\u0645\u062A\u0627\u0628\u0639\u0629 \u0645\u0627 \u0628\u0639\u062F \u0627\u0644\u0645\u0633\u062A\u0634\u0641\u0649",
      ],
    },
  },
  {
    order: 2,
    name: {
      en: "Dr. Sample Two",
      ar: "\u062F. \u0627\u0633\u0645 \u062A\u062C\u0631\u064A\u0628\u064A \u0662",
    },
    specialty: {
      en: "Geriatrics",
      ar: "\u0637\u0628 \u0627\u0644\u0645\u0633\u0646\u064A\u0646",
    },
    experience: {
      en: "MD, 12 years",
      ar: "\u062F\u0643\u062A\u0648\u0631\u0627\u0647\u060C \u0661\u0662 \u0633\u0646\u0629",
    },
    highlights: {
      en: ["Elder care at home", "Fall prevention"],
      ar: [
        "\u0631\u0639\u0627\u064A\u0629 \u0643\u0628\u0627\u0631 \u0627\u0644\u0633\u0646",
        "\u0627\u0644\u0648\u0642\u0627\u064A\u0629 \u0645\u0646 \u0627\u0644\u0633\u0642\u0648\u0637",
      ],
    },
  },
  {
    order: 3,
    name: {
      en: "Dr. Sample Three",
      ar: "\u062F. \u0627\u0633\u0645 \u062A\u062C\u0631\u064A\u0628\u064A \u0663",
    },
    specialty: { en: "Cardiology", ar: "\u0627\u0644\u0642\u0644\u0628" },
    experience: {
      en: "MD, 18 years",
      ar: "\u062F\u0643\u062A\u0648\u0631\u0627\u0647\u060C \u0661\u0668 \u0633\u0646\u0629",
    },
    highlights: {
      en: ["Heart monitoring", "Recovery plans"],
      ar: [
        "\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0642\u0644\u0628",
        "\u062E\u0637\u0637 \u0627\u0644\u062A\u0639\u0627\u0641\u064A",
      ],
    },
  },
];

async function main() {
  const batch = getAdminDb().batch();
  doctors.forEach((doc) => {
    const ref = getAdminDb().collection("doctors").doc();
    batch.set(ref, doc);
  });
  await batch.commit();
  console.log(`Seeded ${doctors.length} doctors.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
