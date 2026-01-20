import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "dummy_secret")
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Fetch order to get notes (trusted data)
            const order = await razorpay.orders.fetch(razorpay_order_id);
            const { notes, amount } = order;

            interface RazorpayNotes {
                userId: string;
                couponCode?: string;
                products: string;
            }

            interface OrderProductItem {
                id: string;
                quantity: number;
                price: number;
            }

            const typedNotes = notes as unknown as RazorpayNotes;
            const { userId, couponCode, products: productsStr } = typedNotes;

            const products: OrderProductItem[] = JSON.parse(productsStr || "[]");

            // Deactivate Coupon if used
            if (couponCode) {
                await prisma.coupon.updateMany({
                    where: {
                        code: couponCode,
                        userId: userId,
                    },
                    data: { isActive: false },
                });
            }

            // Create Order in DB
            const newOrder = await prisma.order.create({
                data: {
                    userId: userId,
                    products: products.map((p: OrderProductItem) => ({
                        product: p.id,
                        quantity: p.quantity,
                        price: p.price,
                    })),
                    totalAmount: (Number(amount) || 0) / 100, // Converting from paise
                    razorpayOrderId: razorpay_order_id,
                    razorpayPaymentId: razorpay_payment_id,
                },
            });

            // Gift Coupon Logic (moved from Create Session)
            // If total > 200 (20000 cents/paise)
            // Note: The previous logic was >= 200 USD. Here amount is in whatever currency (assuming USD based on create-order).
            if (Number(amount) >= 20000) {
                await createNewCoupon(userId);
            }

            return NextResponse.json({
                success: true,
                message: "Payment verified and order created",
                orderId: newOrder.id,
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "Invalid signature",
            }, { status: 400 });
        }

    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json({ message: "Server error", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}

async function createNewCoupon(userId: string) {
    await prisma.coupon.deleteMany({ where: { userId } });
    const newCoupon = await prisma.coupon.create({
        data: {
            code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
            discountPercentage: 10,
            expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            userId: userId,
        },
    });
    return newCoupon;
}
