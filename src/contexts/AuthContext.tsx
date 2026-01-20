"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";

// Types
interface User {
    _id: string;
    id?: string;
    name: string;
    email: string;
    role: "customer" | "admin";
}

interface SignupData {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    checkingAuth: boolean;
    signup: (data: SignupData) => Promise<boolean>;
    login: (data: LoginData) => Promise<boolean>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

// Auth pages that don't need auth check
const authPages = ["/login", "/signup"];

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    const isAuthPage = authPages.includes(pathname);

    const signup = useCallback(async ({ name, email, password, confirmPassword }: SignupData): Promise<boolean> => {
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }

        setLoading(true);
        try {
            const res = await axios.post("/auth/signup", { name, email, password });
            setUser(res.data);
            toast.success("Account created successfully!");
            router.push("/");
            return true;
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Signup failed");
            } else {
                toast.error("An error occurred");
            }
            return false;
        } finally {
            setLoading(false);
        }
    }, [router]);

    const login = useCallback(async ({ email, password }: LoginData): Promise<boolean> => {
        setLoading(true);
        try {
            const res = await axios.post("/auth/login", { email, password });
            setUser(res.data);
            toast.success("Welcome back!");
            router.push("/");
            return true;
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Login failed");
            } else {
                toast.error("An error occurred");
            }
            return false;
        } finally {
            setLoading(false);
        }
    }, [router]);

    const logout = useCallback(async () => {
        try {
            await axios.post("/auth/logout");
            setUser(null);
            toast.success("Logged out successfully");
            router.push("/login");
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Logout failed");
            }
        }
    }, [router]);

    const checkAuth = useCallback(async () => {
        try {
            const response = await axios.get("/auth/profile");
            setUser(response.data);
        } catch {
            setUser(null);
        } finally {
            setCheckingAuth(false);
        }
    }, []);

    // Check auth on mount (except auth pages)
    useEffect(() => {
        if (!isAuthPage) {
            checkAuth();
        } else {
            setCheckingAuth(false);
        }
    }, [isAuthPage, checkAuth]);

    return (
        <AuthContext.Provider value={{ user, loading, checkingAuth, signup, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
