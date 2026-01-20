import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest) => {
    try {
        const isAdmin = req.nextUrl.searchParams.get("isAdmin") === "true";

        if (isAdmin) {
            const user = await getAuthenticatedUser();
            if (!user || user.role !== "admin") {
                return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
            }
        }

        const products = await prisma.product.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error("Error in get products:", error);
        return NextResponse.json({ message: "Server error", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const user = await getAuthenticatedUser();

        if (!user || user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { name, description, price, image, category } = await req.json();

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                image,
                category,
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Error in create product:", error);
        return NextResponse.json({ message: "Server error", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
