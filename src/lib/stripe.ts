import Stripe from "stripe";

// Note: Stripe is no longer used for payments (migrated to Razorpay)
// This file is kept for reference or future use

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_dummy";

export const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2025-12-15.clover",
    typescript: true,
});
