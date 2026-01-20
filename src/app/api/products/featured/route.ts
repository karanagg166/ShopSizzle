import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const GET = async (_req: NextRequest) => {
    try {
        const featuredProducts = await prisma.product.findMany({
            where: {
                isFeatured: true,
            },
        });

        // if (!featuredProducts) {
        // 	return NextResponse.json({ message: "No featured products found" }, { status: 404 });
        // }

        return NextResponse.json(featuredProducts);
    } catch (error) {
        console.error("Error in featured products:", error);
        return NextResponse.json({ message: "Server error", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
