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
            <div className="relative mx-3 mt-3 flex h-64 overflow-hidden rounded-sm bg-muted/20">
                <Image
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full transition-transform duration-700 ease-in-out group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center">
                    <motion.button
                        className="bg-primary text-primary-foreground font-semibold py-2 px-6 rounded-sm uppercase text-xs tracking-wider hover:bg-white hover:text-black transition-colors"
                        onClick={handleAddToCart}
                        whileTap={{ scale: 0.95 }}
                    >
                        Quick Add
                    </motion.button>
                </div>
            </div>

            <div className="p-5 text-center">
                <h5 className="text-xl font-heading text-foreground tracking-tight line-clamp-1">{product.name}</h5>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2 uppercase tracking-wide opacity-70">{product.description}</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                    <span className="text-lg font-bold text-primary">${product.price}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
