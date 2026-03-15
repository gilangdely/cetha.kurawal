const admin = require("firebase-admin");
const serviceAccount = require("../cetha-1232-firebase-adminsdk-fbsvc-db5727d91b.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function updateTiers() {
  const tiers = [
    {
      id: "starter",
      name: "Starter",
      slug: "starter",
      price: 15000,
      quota_amount: 150,
      is_active: true,
      is_recommended: false,
      display_order: 1,
      features: ["3x CV Review", "2x Job Match", "1x Improve LinkedIn"]
    },
    {
      id: "career-pro",
      name: "Career Pro",
      slug: "career-pro",
      price: 35000,
      quota_amount: 400,
      is_active: true,
      is_recommended: true,
      display_order: 2,
      features: ["8x CV Review", "5x Job Match", "3x Improve LinkedIn", "Bonus 50 Token"]
    },
    {
      id: "ultimate-mentorship",
      name: "Ultimate Mentorship",
      slug: "ultimate-mentorship",
      price: 75000,
      quota_amount: 1000,
      is_active: true,
      is_recommended: false,
      display_order: 3,
      features: ["CV & LinkedIn All-in", "Konsultasi Interview AI Unlimited", "Priority Support", "Bonus 250 Token"]
    }
  ];

  for (const tier of tiers) {
    const { id, ...data } = tier;
    await db.collection("subscription_tiers").doc(id).set(data, { merge: true });
    console.log(`Updated tier: ${id}`);
  }
}

updateTiers().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
