"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface CategoryProps {
    category: {
        href: string;
        name: string;
        imageUrl: string;
    };
}

const CategoryItem = ({ category }: CategoryProps) => {
    return (
        <Link href={category.href}>
            <motion.div
                className="relative overflow-hidden h-80 w-full rounded-2xl group cursor-pointer glass-card card-hover"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src={category.imageUrl}
                        alt={category.name}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                {/* Shimmer Effect on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 shimmer" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <motion.div
                        initial={{ y: 10, opacity: 0.8 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className="text-white text-2xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                            {category.name}
                        </h3>
                        <div className="flex items-center gap-2 text-white/70 group-hover:text-white transition-colors duration-300">
                            <span className="text-sm font-medium">Shop Now</span>
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                    </motion.div>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/20 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
        </Link>
    );
};

export default CategoryItem;
