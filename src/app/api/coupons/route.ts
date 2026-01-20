import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(_req: NextRequest) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const coupon = await prisma.coupon.findFirst({
            where: { userId: user.id, isActive: true },
        });

        return NextResponse.json(coupon || null);
    } catch (error) {
        console.error("Error in GET /coupons:", error);
        return NextResponse.json({ message: "Server error", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
