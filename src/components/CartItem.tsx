"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "sonner";

interface CartItemProps {
    item: {
        id: string;
        _id?: string;
        name: string;
        price: number;
        image: string;
        quantity: number;
        description?: string;
    };
}

const CartItem = ({ item }: CartItemProps) => {
    const { removeFromCart, updateQuantity } = useCartStore();

    const handleRemove = () => {
        removeFromCart(item._id || item.id);
        toast.success(`${item.name} removed from cart`);
    };

    return (
        <motion.div
            className="glass-card rounded-xl p-4 md:p-6"
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                {/* Image */}
                <motion.div
                    className="relative h-24 w-24 md:h-32 md:w-32 rounded-lg overflow-hidden flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                >
                    <Image
                        className="object-cover"
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 96px, 128px"
                    />
                </motion.div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground line-clamp-1 mb-1">
                        {item.name}
                    </h3>
                    {item.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {item.description}
                        </p>
                    )}
                    <p className="text-primary font-bold text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                    </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-secondary rounded-full p-1">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="w-8 h-8 rounded-full bg-card flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                        >
                            <Minus className="w-4 h-4" />
                        </motion.button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="w-8 h-8 rounded-full bg-card flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                        >
                            <Plus className="w-4 h-4" />
                        </motion.button>
                    </div>

                    {/* Remove Button */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.1 }}
                        className="p-2 rounded-full text-destructive hover:bg-destructive/10 transition-colors"
                        onClick={handleRemove}
                    >
                        <Trash2 className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default CartItem;
