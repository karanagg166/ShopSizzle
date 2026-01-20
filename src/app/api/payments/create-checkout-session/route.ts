import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
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
        const lineItems = products.map((product: ProductInput) => {
            const amount = Math.round(product.price * 100);
            totalAmount += amount * (product.quantity || 1);

            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount: amount,
                },
                quantity: product.quantity || 1,
            };
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

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
            discounts: coupon
                ? [{ coupon: await createStripeCoupon(coupon.discountPercentage) }]
                : [],
            metadata: {
                userId: user.id,
                couponCode: couponCode || "",
                products: JSON.stringify(
                    products.map((p: ProductInput) => ({
                        id: p._id || p.id, // Handle both id formats
                        quantity: p.quantity,
                        price: p.price,
                    }))
                ),
            },
        });

        if (totalAmount >= 20000) {
            await createNewCoupon(user.id);
        }

        return NextResponse.json({ id: session.id, totalAmount: totalAmount / 100 });
    } catch (error) {
        console.error("Error in checkout session:", error);
        return NextResponse.json({ message: "Error processing checkout", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}

async function createStripeCoupon(discountPercentage: number) {
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: "once",
    });
    return coupon.id;
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
