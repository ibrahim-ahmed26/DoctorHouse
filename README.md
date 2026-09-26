# Doctor House Care — Next.js + Firestore

See the setup steps provided in chat. Quick reference:

1. `npm install`
2. Create a Firebase project, enable Firestore, copy `.env.local.example` to `.env.local` and fill in both the public app config and the Admin SDK service-account fields.
3. `npm run seed:doctors` — populates the `doctors` collection with sample data.
4. `npm run dev` — http://localhost:3000
5. Deploy `firestore.rules` via the Firebase Console (Firestore > Rules) or `firebase deploy --only firestore:rules` if you install the Firebase CLI.
6. Push to your own repo, import into Vercel, add the same env vars there, attach your custom domain.
