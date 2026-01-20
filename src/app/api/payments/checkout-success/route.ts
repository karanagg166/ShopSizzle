import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { sessionId } = await req.json();
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
            if (session.metadata?.couponCode && session.metadata?.userId) {
                await prisma.coupon.updateMany({
                    where: {
                        code: session.metadata.couponCode,
                        userId: session.metadata.userId,
                    },
                    data: { isActive: false },
                });
            }

            // Create Order
            const products = JSON.parse(session.metadata?.products || "[]");

            // Map products to appropriate JSON structure for Prisma Order model
            // Our Schema defines products as Json type.
            // We can store exactly what we have, or clean it.
            interface OrderProduct {
                id: string;
                quantity: number;
                price: number;
            }

            const orderProducts = products.map((product: OrderProduct) => ({
                product: product.id,
                quantity: product.quantity,
                price: product.price,
            }));

            const newOrder = await prisma.order.create({
                data: {
                    userId: session.metadata!.userId,
                    products: orderProducts,
                    totalAmount: (session.amount_total || 0) / 100,
                    razorpayOrderId: sessionId, // Legacy Stripe compatibility
                },
            });

            return NextResponse.json({
                success: true,
                message: "Payment successful, order created.",
                orderId: newOrder.id,
            });
        }

        return NextResponse.json({ message: "Payment not confirmed" }, { status: 400 });

    } catch (error) {
        console.error("Error in checkout success:", error);
        return NextResponse.json({ message: "Server error", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
