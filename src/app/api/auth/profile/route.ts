import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export const GET = async (_req: NextRequest) => {
    try {
        const user = await getAuthenticatedUser();

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error in profile:", error);
        return NextResponse.json({ message: "Server error", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
