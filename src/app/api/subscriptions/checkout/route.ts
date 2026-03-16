import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase-admin";
import { requireSession } from "@/app/lib/session";
import { checkoutSchema } from "@/types/checkout-schema";
import { FieldValue } from "firebase-admin/firestore";
import { getTranslations } from "next-intl/server";

function resolveLocale(req: Request): "id" | "en" {
  const explicit =
    req.headers.get("x-next-intl-locale") || req.headers.get("x-locale");
  if (explicit) {
    return explicit.toLowerCase().startsWith("en") ? "en" : "id";
  }

  const acceptLanguage = req.headers.get("accept-language") || "";
  const primaryLocale = acceptLanguage.split(",")[0]?.trim().toLowerCase();
  return primaryLocale.startsWith("en") ? "en" : "id";
}

export async function POST(req: Request) {
  const auth = await requireSession();
  if (auth.error) return auth.error;
  const locale = resolveLocale(req);
  const t = await getTranslations({ locale, namespace: "api.checkout" });

  try {
    const body = await req.json();
    const parsed = checkoutSchema.parse(body);

    // Fetch user data
    const userDocRef = adminDb.collection("users").doc(auth.uid);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { ok: false, message: t("errors.invalidUser") },
        { status: 400 },
      );
    }

    // Fetch Tier details
    const tierDocRef = adminDb
      .collection("subscription_tiers")
      .doc(parsed.tier_id);
    const tierDoc = await tierDocRef.get();

    if (!tierDoc.exists) {
      return NextResponse.json(
        { ok: false, message: t("errors.tierNotFound") },
        { status: 404 },
      );
    }

    const tierData = tierDoc.data();
    if (!tierData?.is_active) {
      return NextResponse.json(
        { ok: false, message: t("errors.tierInactive") },
        { status: 400 },
      );
    }

    // Generate Invoice Number (Format: INV-YYMMDD-RANDOM)
    const date = new Date();
    const yy = date.getFullYear().toString().slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const invoiceNumber = `INV-${yy}${mm}${dd}-${randomStr}`;

    const newSubscription = {
      user_id: auth.uid,
      tier_id: parsed.tier_id,
      invoice_number: invoiceNumber,
      amount: tierData.price,
      status: "pending",
      payment_proof_url: parsed.payment_proof_url,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb
      .collection("subscriptions")
      .add(newSubscription);

    // CREATE NOTIFICATION FOR ADMIN
    await adminDb.collection("notifications").add({
      recipientId: "admin",
      title: t("notifications.newPayment"),
      message: t("notifications.paymentMessage", {
        username: userDoc.data()?.username || t("notifications.someone"),
        tierName: tierData.name,
      }),
      type: "payment",
      isRead: false,
      link: `/${locale}/admin/payments`,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      id: docRef.id,
      invoice: invoiceNumber,
    });
  } catch (error: any) {
    console.error("POST Checkout error:", error);

    let message = error?.message || t("errors.checkoutFailed");
    if (error.issues) {
      message = error.issues.map((i: any) => i.message).join(", ");
    }

    return NextResponse.json(
      { ok: false, message, issues: error.issues },
      { status: 400 },
    );
  }
}
