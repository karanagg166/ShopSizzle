"use client";

import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useCartStore } from "@/stores/useCartStore";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
    const { user, logout } = useAuth();
    const isAdmin = user?.role === "admin";
    const { cart } = useCartStore();

    return (
        <header className="fixed top-0 left-0 w-full bg-background/80 backdrop-blur-md shadow-sm z-50 transition-all duration-300 border-b border-border">
            <div className="container mx-auto px-4 py-3">
                <div className="flex flex-wrap justify-between items-center">
                    <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent flex items-center space-x-2">
                        Shop Sizzle
                    </Link>

                    <nav className="flex flex-wrap items-center gap-4">
                        <Link
                            href="/"
                            className="text-muted-foreground hover:text-emerald-500 transition-colors duration-200 font-medium"
                        >
                            Home
                        </Link>
                        {user && (
                            <Link
                                href="/cart"
                                className="relative group text-muted-foreground hover:text-emerald-500 transition-colors duration-200 font-medium flex items-center"
                            >
                                <ShoppingCart className="mr-1 transition-transform group-hover:scale-110" size={20} />
                                <span className="hidden sm:inline">Cart</span>
                                {cart.length > 0 && (
                                    <span className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-1.5 py-0.5 text-xs group-hover:bg-emerald-400 transition-colors duration-200">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                        )}
                        {isAdmin && (
                            <Link
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-full font-medium transition-all duration-200 flex items-center shadow-md hover:shadow-lg"
                                href="/secret-dashboard"
                            >
                                <Lock className="inline-block mr-1" size={18} />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>
                        )}

                        <ThemeToggle />

                        {user ? (
                            <button
                                className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-foreground py-2 px-4 rounded-full flex items-center transition-all duration-200 shadow-sm"
                                onClick={logout}
                            >
                                <LogOut size={18} />
                                <span className="hidden sm:inline ml-2">Log Out</span>
                            </button>
                        ) : (
                            <>
                                <Link
                                    href="/signup"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-full flex items-center transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    <UserPlus className="mr-2" size={18} />
                                    Sign Up
                                </Link>
                                <Link
                                    href="/login"
                                    className="bg-secondary hover:bg-secondary/80 text-secondary-foreground py-2 px-4 rounded-full flex items-center transition-all duration-200 shadow-sm"
                                >
                                    <LogIn className="mr-2" size={18} />
                                    Login
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
