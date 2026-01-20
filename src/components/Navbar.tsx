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
                    <Link href="/" className="text-3xl font-bold font-heading text-primary tracking-tight">
                        Shop Sizzle
                    </Link>

                    <nav className="flex flex-wrap items-center gap-6">
                        <Link
                            href="/"
                            className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium tracking-wide uppercase text-sm"
                        >
                            Home
                        </Link>
                        {user && (
                            <Link
                                href="/cart"
                                className="relative group text-muted-foreground hover:text-primary transition-colors duration-300 font-medium flex items-center"
                            >
                                <ShoppingCart className="mr-1 transition-transform group-hover:scale-105" size={20} />
                                <span className="hidden sm:inline uppercase text-sm tracking-wide">Cart</span>
                                {cart.length > 0 && (
                                    <span className="absolute -top-2 -left-2 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-bold">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                        )}
                        {isAdmin && (
                            <Link
                                className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-1 uppercase text-sm tracking-wide"
                                href="/secret-dashboard"
                            >
                                <Lock size={16} />
                                <span className="hidden sm:inline">Admin</span>
                            </Link>
                        )}

                        <ThemeToggle />

                        {user ? (
                            <button
                                className="text-muted-foreground hover:text-destructive transition-colors duration-300 flex items-center gap-2 uppercase text-sm tracking-wide ml-2"
                                onClick={logout}
                            >
                                <LogOut size={18} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        ) : (
                            <div className="flex items-center gap-4 ml-2">
                                <Link
                                    href="/signup"
                                    className="btn-primary text-xs py-2 px-6"
                                >
                                    Sign Up
                                </Link>
                                <Link
                                    href="/login"
                                    className="text-muted-foreground hover:text-primary transition-colors duration-300 uppercase text-xs tracking-wide font-semibold"
                                >
                                    Login
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
