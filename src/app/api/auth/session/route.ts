import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/app/lib/firebase-admin";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: Request) {
    try {
        const { idToken } = await request.json();

        if (!idToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Set expiration time (e.g., 7 days)
        const expiresIn = 60 * 60 * 24 * 7 * 1000;

        // Verify token and create session cookie
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const { uid, email = "", name = "", picture = "" } = decodedToken;

        const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
        const cookieStore = await cookies();

        // Check and Setup User Roles in Firestore
        const userRef = adminDb.collection("users").doc(uid);
        const userDoc = await userRef.get();
        const userEmail = email.trim().toLowerCase();
        const isAdmin = env.ADMIN_EMAILS.includes(userEmail);
        const finalRole = isAdmin ? "admin" : "user";

        if (!userDoc.exists) {
            await userRef.set({
                email: userEmail,
                displayName: name,
                photoURL: picture,
                role: finalRole,
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp()
            });
        } else {
            // Only update role if it's admin or explicitly missing, and updatedAt
            await userRef.update({
                email: userEmail,
                displayName: name,
                photoURL: picture,
                role: finalRole,
                updatedAt: FieldValue.serverTimestamp()
            });
        }

        // Set cookie
        cookieStore.set("session", sessionCookie, {
            maxAge: expiresIn / 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Session creation error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
