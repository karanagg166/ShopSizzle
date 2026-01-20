import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export const POST = async (req: NextRequest) => {
    try {
        const user = await getAuthenticatedUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { code } = await req.json();
        const coupon = await prisma.coupon.findFirst({
            where: { code, userId: user.id, isActive: true },
        });

        if (!coupon) {
            return NextResponse.json({ message: "Coupon not found" }, { status: 404 });
        }

        if (coupon.expirationDate < new Date()) {
            await prisma.coupon.update({
                where: { id: coupon.id },
                data: { isActive: false },
            });
            return NextResponse.json({ message: "Coupon expired" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Coupon is valid",
            code: coupon.code,
            discountPercentage: coupon.discountPercentage,
        });
    } catch (error) {
        console.error("Error in coupon validate:", error);
        return NextResponse.json({ message: "Server error", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
