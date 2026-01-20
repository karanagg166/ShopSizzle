import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ category: string }> }) => {
    try {
        const { category } = await params;
        const products = await prisma.product.findMany({
            where: {
                category,
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error("Error in category:", error);
        return NextResponse.json({ message: "Server error", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
