import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export const dynamic = 'force-dynamic';

interface ProductInput {
    name: string;
    price: number;
    image: string;
    quantity?: number;
    id?: string;
    _id?: string;
}

export const POST = async (req: NextRequest) => {
    try {
        const user = await getAuthenticatedUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { products, couponCode } = await req.json();

        if (!Array.isArray(products) || products.length === 0) {
            return NextResponse.json({ error: "Invalid or empty products array" }, { status: 400 });
        }

        let totalAmount = 0;
        products.forEach((product: ProductInput) => {
            const amount = Math.round(product.price * 100); // Assuming currency has 100 subunits
            totalAmount += amount * (product.quantity || 1);
        });

        let coupon = null;
        if (couponCode) {
            coupon = await prisma.coupon.findFirst({
                where: { code: couponCode, userId: user.id, isActive: true },
            });
            if (coupon) {
                totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
            }
        }

        // Create Razorpay Order
        const options = {
            amount: totalAmount,
            currency: "USD", // Or INR, making it USD to match previous logic logic but Razorpay works best with INR usually. Sticking to USD for consistency with existing data/UI currency symbols ($).
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: user.id,
                couponCode: couponCode || "",
                products: JSON.stringify(
                    products.map((p: ProductInput) => ({
                        id: p.id || p._id,
                        quantity: p.quantity,
                        price: p.price,
                    }))
                ),
            },
        };

        const order = await razorpay.orders.create(options);

        // Logic for high value orders to give gift coupon (preserved from legacy)
        // Note: In stripe version this was done AFTER checkout creation. Here we accept order creation.
        // We probably should only grant the coupon after successful PAYMENT verification, 
        // but the original code put it in creaete-checkout-session (which is weird, but I'll stick to preserving logic or moving it to verify).
        // Moving it to verify is safer.

        return NextResponse.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return NextResponse.json({ message: "Error processing checkout", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
