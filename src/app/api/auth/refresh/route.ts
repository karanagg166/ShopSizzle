import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateTokens, setCookies } from "@/lib/auth";
import { decode } from "jsonwebtoken";

export const dynamic = 'force-dynamic';

export async function POST(_req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!refreshToken) {
            return NextResponse.json({ message: "No refresh token found" }, { status: 401 });
        }

        const decoded = decode(refreshToken) as { userId: string } | null;
        if (!decoded?.userId) {
            return NextResponse.json({ message: "Invalid refresh token" }, { status: 401 });
        }

        const accessToken = generateTokens(decoded.userId).accessToken;

        setCookies(accessToken, refreshToken);

        return NextResponse.json({ message: "Token refreshed successfully" });
    } catch (error) {
        console.error("Error in refresh:", error);
        return NextResponse.json({ message: "Server error", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
