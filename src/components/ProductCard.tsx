"use client";

import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCartStore } from "@/stores/useCartStore";
import { motion } from "framer-motion";
import Image from "next/image";

interface Product {
    id: string;
    _id?: string;
    name: string;
    price: number;
    image: string;
    description: string;
}

const ProductCard = ({ product }: { product: Product }) => {
    const { user } = useAuth();
    const { addToCart } = useCartStore();

    const handleAddToCart = () => {
        if (!user) {
            toast.error("Please login to add to cart");
            return;
        }
        addToCart(product);
        toast.success("Added to cart");
    };

    return (
        <motion.div
            className="flex w-full relative group flex-col overflow-hidden rounded-xl bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
        >
            <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-lg bg-muted">
                <Image
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full transition-transform duration-500 group-hover:scale-110"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <motion.button
                        className="bg-white text-black font-semibold py-2 px-4 rounded-full flex items-center gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100 hover:bg-gray-100"
                        onClick={handleAddToCart}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ShoppingCart size={18} />
                        Quick Add
                    </motion.button>
                </div>
            </div>

            <div className="p-5">
                <h5 className="text-lg font-semibold tracking-tight text-foreground line-clamp-1">{product.name}</h5>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2 min-h-[2.5rem]">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                    <p>
                        <span className="text-xl font-bold text-primary">${product.price}</span>
                    </p>
                    <motion.button
                        className="flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-colors duration-200 shadow-md"
                        onClick={handleAddToCart}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
