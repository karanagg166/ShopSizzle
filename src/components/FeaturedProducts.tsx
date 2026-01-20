"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { Product } from "@/stores/useProductStore";
import { toast } from "sonner";

const FeaturedProducts = ({ featuredProducts }: { featuredProducts: Product[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const { addToCart } = useCartStore();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setItemsPerPage(1);
            else if (window.innerWidth < 1024) setItemsPerPage(2);
            else if (window.innerWidth < 1280) setItemsPerPage(3);
            else setItemsPerPage(4);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => Math.min(prev + itemsPerPage, featuredProducts.length - itemsPerPage));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => Math.max(prev - itemsPerPage, 0));
    };

    const isStartDisabled = currentIndex === 0;
    const isEndDisabled = currentIndex + itemsPerPage >= featuredProducts.length;

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        toast.success(`${product.name} added to cart`);
    };

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Featured Collection</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl font-bold text-gradient mb-4"
                    >
                        Trending Now
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground max-w-lg mx-auto"
                    >
                        Discover our most popular items handpicked for you
                    </motion.p>
                </div>

                {/* Carousel */}
                <div className="relative">
                    <div className="overflow-hidden rounded-2xl">
                        <motion.div
                            className="flex"
                            animate={{ x: `-${currentIndex * (100 / itemsPerPage)}%` }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {featuredProducts?.map((product, index) => (
                                <motion.div
                                    key={product.id || product._id}
                                    className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-3"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="glass-card rounded-2xl overflow-hidden h-full group card-hover">
                                        {/* Image Container */}
                                        <div className="relative h-56 overflow-hidden">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            />

                                            {/* Quick Add Overlay */}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <motion.button
                                                    onClick={() => handleAddToCart(product)}
                                                    className="bg-white text-black font-semibold py-3 px-6 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <ShoppingCart className="w-4 h-4" />
                                                    Quick Add
                                                </motion.button>
                                            </div>

                                            {/* Featured Badge */}
                                            {product.isFeatured && (
                                                <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                                                    Featured
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                {product.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xl font-bold text-primary">
                                                    ${product.price.toFixed(2)}
                                                </span>
                                                <motion.button
                                                    onClick={() => handleAddToCart(product)}
                                                    className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <ShoppingCart className="w-5 h-5" />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Navigation Buttons */}
                    <AnimatePresence>
                        {!isStartDisabled && (
                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onClick={prevSlide}
                                className="absolute top-1/2 -left-4 -translate-y-1/2 p-3 rounded-full bg-card border border-border shadow-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {!isEndDisabled && (
                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onClick={nextSlide}
                                className="absolute top-1/2 -right-4 -translate-y-1/2 p-3 rounded-full bg-card border border-border shadow-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: Math.ceil(featuredProducts.length / itemsPerPage) }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i * itemsPerPage)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${Math.floor(currentIndex / itemsPerPage) === i
                                    ? "w-8 bg-primary"
                                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
