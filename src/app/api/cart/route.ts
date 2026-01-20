import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export const GET = async (_req: NextRequest) => {
    try {
        const user = await getAuthenticatedUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const cartItems = await prisma.cartItem.findMany({
            where: { userId: user.id },
            include: { product: true },
        });

        // Map to format matching legacy (product details + quantity at top level?)
        // Legacy: returns array of { ...product, quantity }.
        const formattedItems = cartItems.map((item) => ({
            ...item.product,
            quantity: item.quantity,
            cartItemId: item.id, // helpful for updates? But legacy used updateQuantity by productId.
            // I'll stick to productId for operations to match legacy frontend requests.
        }));

        return NextResponse.json(formattedItems);
    } catch (error) {
        console.error("Error in GET /cart:", error);
        return NextResponse.json({ message: "Server error", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const user = await getAuthenticatedUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { productId } = await req.json();

        // Check if item exists
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId,
                },
            },
        });

        if (existingItem) {
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + 1 },
            });
        } else {
            await prisma.cartItem.create({
                data: {
                    userId: user.id,
                    productId,
                    quantity: 1,
                },
            });
        }

        // Return updated cart
        const cartItems = await prisma.cartItem.findMany({
            where: { userId: user.id },
            include: { product: true },
        });
        const formattedItems = cartItems.map((item) => ({
            ...item.product,
            quantity: item.quantity,
        }));

        return NextResponse.json(formattedItems);

    } catch (error) {
        console.error("Error in POST /cart:", error);
        return NextResponse.json({ message: "Server error", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}

export const DELETE = async (req: NextRequest) => {
    try {
        const user = await getAuthenticatedUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { productId } = await req.json();

        if (productId) {
            await prisma.cartItem.deleteMany({
                where: { userId: user.id, productId },
            });
        } else {
            await prisma.cartItem.deleteMany({
                where: { userId: user.id },
            });
        }

        const cartItems = await prisma.cartItem.findMany({
            where: { userId: user.id },
            include: { product: true },
        });
        const formattedItems = cartItems.map((item) => ({
            ...item.product,
            quantity: item.quantity,
        }));

        return NextResponse.json(formattedItems);
    } catch (error) {
        console.error("Error in DELETE /cart:", error);
        return NextResponse.json({ message: "Server error", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
