import { NextResponse } from "next/server";
import { getCurrentUserProfile } from "@/app/lib/session";

export async function GET() {
    try {
        const profile = await getCurrentUserProfile();

        if (!profile) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({
            uid: profile.uid,
            email: profile.email,
            role: profile.role,
            displayName: profile.displayName,
        });
    } catch (err) {
        console.error("GET /api/me error:", err);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
