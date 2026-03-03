// scripts/set-admin-claim.js
// Jalankan dengan: node scripts/set-admin-claim.js email@example.com

/* eslint-disable @typescript-eslint/no-var-requires */
const admin = require("firebase-admin");

if (
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !process.env.FIREBASE_PRIVATE_KEY
) {
  console.error(
    "Env FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY belum di-set.",
  );
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

async function setAdminByEmail(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);

    await admin.auth().setCustomUserClaims(user.uid, {
      admin: true,
    });

    console.log(
      `User ${email} (${user.uid}) sekarang memiliki custom claim admin: true`,
    );
  } catch (err) {
    console.error("Gagal set admin claim:", err);
    process.exit(1);
  }
}

const email = process.argv[2] || "gilangdelymukti@gmail.com";

setAdminByEmail(email).then(() => process.exit(0));

