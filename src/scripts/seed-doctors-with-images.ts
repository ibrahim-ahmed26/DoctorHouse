// Run with: npm run seed:doctors-photos
// Photos must be in a "DoctorsImages" folder in your project root,
// named 1.jpeg, 2.jpeg, 3.jpeg ... in the same order as the list below.

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "fs";
import path from "path";
import { getAdminDb } from "../lib/firebase/admin";

const PHOTOS_DIR = path.join(process.cwd(), "DoctorsImages");

// [Arabic name, English name] pairs, in the same order as your photo numbering.
const doctorNames: [string, string][] = [
  [" د عمر بربري", "Dr. Omar Barbary"],
  ["أحمد شكري ", "Dr. Ahmed Shokry"],
  ["د احمد بصار", "Dr. Ahmed Bassar"],
  ["د محمود وهبة", "Dr. Mahmoud Wahba"],
  ["د محمد عمر", "Dr. Mohamed Omar"],
  ["د حازم عثمان", "Dr. Hazem Othman"],
  ["د عبد الرحمن محمد عبد المعز", "Dr. Abdelrahman Mohamed Abdelmoez"],
  ["د عمرو حسني", "Dr. Amr Hosny"],
  ["د عمرو عباس", "Dr. Amr Abbas"],
  ["د احمد عوض", "Dr. Ahmed Awad"],
  ["د عمر صبحي", "Dr. Omar Sobhy"],
  ["د مصطفى عيسى", "Dr. Mostafa Issa"],
  ["د عبد الرحمن ممدوح", "Dr. Abdelrahman Mamdouh"],
  ["د امين اشرف", "Dr. Amin Ashraf"],
  ["د محمود أبو المجد", "Dr. Mahmoud Abou El Magd"],
  ["د ممدوح حامد", "Dr. Mamdouh Hamed"],
  ["د معتز الحلاج", "Dr. Moataz El Hallag"],
  ["د حسين جلال", "Dr. Hussein Galal"],
  ["د أحمد شيحة", "Dr. Ahmed Sheha"],
];

const nursingNames: [string, string][] = [
  ["ميس نورهان فرغلي", "Ms. Nourhan Farghaly"],
  ["ميس ايمان ابراهيم", "Ms. Eman Ibrahim"],
  ["ميس ملك مظلوم", "Ms. Malak Mazloum"],
  ["مستر محمود ربيع", "Mr. Mahmoud Rabie"],
  ["مستر أحمد محمود فوزي", "Mr. Ahmed Mahmoud Fawzy"],
  ["مستر عطيه محمد", "Mr. Attia Mohamed"],
  ["ميس رؤى مصطفى", "Ms. Roaa Mostafa"],
];

type DraftEntry = {
  file: string;
  order: number;
  name: { en: string; ar: string };
  specialty: { en: string; ar: string };
  experience: { en: string; ar: string };
  highlights: { en: [string, string]; ar: [string, string] };
};

let counter = 1;
const DOCTORS: DraftEntry[] = [];

for (const [ar, en] of doctorNames) {
  DOCTORS.push({
    file: `${counter}.jpeg`,
    order: counter,
    name: { en, ar },
    specialty: {
      en: "Doctor — update specialty",
      ar: "طبيب — يرجى تحديث التخصص",
    },
    experience: {
      en: "Update in dashboard",
      ar: "يرجى التحديث من لوحة التحكم",
    },
    highlights: {
      en: ["Update in dashboard", "Update in dashboard"],
      ar: ["يرجى التحديث", "يرجى التحديث"],
    },
  });
  counter++;
}

for (const [ar, en] of nursingNames) {
  DOCTORS.push({
    file: `${counter}.jpeg`,
    order: counter,
    name: { en, ar },
    specialty: { en: "Nursing", ar: "تمريض" },
    experience: {
      en: "Update in dashboard",
      ar: "يرجى التحديث من لوحة التحكم",
    },
    highlights: {
      en: ["Update in dashboard", "Update in dashboard"],
      ar: ["يرجى التحديث", "يرجى التحديث"],
    },
  });
  counter++;
}

async function uploadToCloudinary(filePath: string): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !preset) {
    throw new Error(
      "Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local",
    );
  }

  const buffer = fs.readFileSync(filePath);
  const blob = new Blob([buffer]);
  const formData = new FormData();
  formData.append("file", blob, path.basename(filePath));
  formData.append("upload_preset", preset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.error?.message ?? "Cloudinary upload failed");
  return data.secure_url as string;
}

async function main() {
  if (!fs.existsSync(PHOTOS_DIR)) {
    console.error(`Folder not found: ${PHOTOS_DIR}`);
    process.exit(1);
  }

  for (const doc of DOCTORS) {
    const filePath = path.join(PHOTOS_DIR, doc.file);
    if (!fs.existsSync(filePath)) {
      console.error(`Skipping "${doc.name.en}" — file not found: ${filePath}`);
      continue;
    }

    console.log(`Uploading photo for ${doc.name.en} (${doc.file})...`);
    const imageUrl = await uploadToCloudinary(filePath);

    const { file, ...docData } = doc;
    await getAdminDb()
      .collection("doctors")
      .add({ ...docData, imageUrl });

    console.log(`Added ${doc.name.en}.`);
  }

  console.log(
    `Done. Added ${DOCTORS.length} entries (if all photo files were found).`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
