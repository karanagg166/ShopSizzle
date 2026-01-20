"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import CategoryItem from "@/components/CategoryItem";
import { useProductStore } from "@/stores/useProductStore";
import FeaturedProducts from "@/components/FeaturedProducts";

const categories = [
  { href: "/category/men", name: "Men", imageUrl: "https://images.unsplash.com/photo-1516257984881-1d546a5851b2?w=800&q=80" },
  { href: "/category/women", name: "Women", imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" },
  { href: "/category/kids", name: "Kids", imageUrl: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&q=80" },
  { href: "/category/accessories", name: "Accessories", imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80" },
  { href: "/category/shoes", name: "Shoes", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

const HomePage = () => {
  const { fetchFeaturedProducts, products, loading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            ✨ New Collection Available
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="text-gradient">Shop Sizzle</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Discover premium fashion curated for the modern you.
            Elevate your style with our exclusive collection.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4 justify-center"
          >
            <button className="btn-primary">
              Shop Now
            </button>
            <button className="px-6 py-3 rounded-full border border-border bg-card/50 backdrop-blur-sm text-foreground font-medium hover:bg-card transition-all duration-300">
              View Collection
            </button>
          </motion.div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-2">
            Browse Categories
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            Find what you&apos;re looking for
          </p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {categories.map((category) => (
              <motion.div key={category.name} variants={itemVariants}>
                <CategoryItem category={category} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Featured Products */}
        {!loading && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <FeaturedProducts featuredProducts={products} />
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
