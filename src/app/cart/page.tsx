"use client";

import Link from "next/link";
import { useCartStore } from "@/stores/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ArrowLeft, Sparkles } from "lucide-react";
import CartItem from "@/components/CartItem";
import PeopleAlsoBought from "@/components/PeopleAlsoBought";
import OrderSummary from "@/components/OrderSummary";
import GiftCouponCard from "@/components/GiftCouponCard";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const CartPage = () => {
    const { cart } = useCartStore();

    return (
        <div className="min-h-screen py-8 md:py-16 relative">
            {/* Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="bg-orb bg-orb-1" />
                <div className="bg-orb bg-orb-2" />
            </div>

            <div className="relative z-10 mx-auto max-w-screen-xl px-4 2xl:px-0">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Continue Shopping</span>
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold">
                        Shopping <span className="text-gradient">Cart</span>
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
                    </p>
                </motion.div>

                <div className="lg:flex lg:items-start lg:gap-8">
                    {/* Cart Items */}
                    <motion.div
                        className="w-full flex-1 lg:max-w-2xl xl:max-w-4xl"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <AnimatePresence mode="wait">
                            {cart.length === 0 ? (
                                <EmptyCartUI />
                            ) : (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="space-y-4"
                                >
                                    {cart.map((item) => (
                                        <motion.div key={item.id || item._id} variants={itemVariants}>
                                            <CartItem item={item} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {cart.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <PeopleAlsoBought />
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Order Summary & Coupon */}
                    <AnimatePresence>
                        {cart.length > 0 && (
                            <motion.div
                                className="mt-8 lg:mt-0 lg:w-full lg:max-w-md space-y-6"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <div className="glass-card rounded-2xl p-6">
                                    <OrderSummary />
                                </div>
                                <div className="glass-card rounded-2xl overflow-hidden">
                                    <GiftCouponCard />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CartPage;

const EmptyCartUI = () => (
    <motion.div
        className="flex flex-col items-center justify-center py-20 glass-card rounded-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
    >
        <motion.div
            className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6"
            animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
            }}
        >
            <ShoppingCart className="h-12 w-12 text-primary" />
        </motion.div>
        <h3 className="text-2xl font-semibold mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground mb-6 text-center max-w-sm">
            Looks like you haven&apos;t added anything to your cart yet. Start exploring our collection!
        </p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Start Shopping
        </Link>
    </motion.div>
);
