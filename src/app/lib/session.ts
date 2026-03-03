import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/app/lib/firebase-admin";

export async function getSessionUidFromCookie() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) return null;

    try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        return decodedClaims.uid;
    } catch (error) {
        return null; // Invalid signature or expired
    }
}

export async function getCurrentUserProfile() {
    const uid = await getSessionUidFromCookie();
    if (!uid) return null;

    try {
        const userDocRef = adminDb.collection("users").doc(uid);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) return null;

        return {
            uid,
            ...(userDoc.data() as {
                email: string;
                role: "admin" | "user";
                displayName?: string;
                photoURL?: string;
                createdAt?: any;
                updatedAt?: any;
            }),
        };
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}

export async function requireSession() {
    const uid = await getSessionUidFromCookie();
    if (!uid) {
        return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }
    return { uid };
}

export async function requireAdmin() {
    const profile = await getCurrentUserProfile();
    if (!profile) {
        return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }
    if (profile.role !== "admin") {
        return { error: NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 }) };
    }
    return { uid: profile.uid, profile };
}
