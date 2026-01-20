import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export const PUT = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const user = await getAuthenticatedUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { id: productId } = await params; // Legacy route was /:id where id is productId
        const { quantity } = await req.json();

        if (quantity === 0) {
            await prisma.cartItem.deleteMany({
                where: { userId: user.id, productId },
            });
        } else {
            await prisma.cartItem.updateMany({ // Use updateMany because primary key is id, but we are querying by composite unique
                where: { userId: user.id, productId },
                data: { quantity },
            });
        }

        const cartItems = await prisma.cartItem.findMany({
            where: { userId: user.id },
            include: { product: true },
        });
        const formattedItems = cartItems.map((item: { product: any; quantity: number }) => ({
            ...item.product,
            quantity: item.quantity,
        }));

        return NextResponse.json(formattedItems);
    } catch (error) {
        console.error("Error in cart update:", error);
        return NextResponse.json({ message: "Server error", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
