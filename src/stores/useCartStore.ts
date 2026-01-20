import { create } from "zustand";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface CartItem {
    id: string;
    _id: string; // compatibility
    name: string;
    price: number;
    image: string;
    quantity: number;
    description?: string;
}

interface Coupon {
    code: string;
    discountPercentage: number;
}

interface CartStore {
    cart: CartItem[];
    coupon: Coupon | null;
    total: number;
    subtotal: number;
    isCouponApplied: boolean;
    getMyCoupon: () => Promise<void>;
    applyCoupon: (code: string) => Promise<void>;
    removeCoupon: () => Promise<void>;
    getCartItems: () => Promise<void>;
    clearCart: () => Promise<void>;
    addToCart: (product: CartItem | (Omit<CartItem, "quantity" | "_id"> & { quantity?: number; _id?: string })) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    calculateTotals: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0,
    isCouponApplied: false,

    getMyCoupon: async () => {
        try {
            const response = await axios.get("/coupons");
            set({ coupon: response.data });
        } catch (error) {
            console.error("Error fetching coupon:", error);
        }
    },
    applyCoupon: async (code: string) => {
        try {
            const response = await axios.post("/coupons/validate", { code });
            set({ coupon: response.data, isCouponApplied: true });
            get().calculateTotals();
            toast.success("Coupon applied successfully");
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Failed to apply coupon");
            } else {
                toast.error("Failed to apply coupon");
            }
        }
    },
    removeCoupon: async () => {
        set({ coupon: null, isCouponApplied: false });
        get().calculateTotals();
        toast.success("Coupon removed");
    },

    getCartItems: async () => {
        try {
            const res = await axios.get("/cart");
            set({ cart: res.data });
            get().calculateTotals();
        } catch (error) {
            set({ cart: [] });
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "An error occurred");
            } else {
                toast.error("An error occurred");
            }
        }
    },
    clearCart: async () => {
        set({ cart: [], coupon: null, total: 0, subtotal: 0 });
    },
    addToCart: async (product) => {
        try {
            // Using product.id instead of _id as we moved to Prisma logic which returns id.
            // But legacy components pass object with _id maybe?
            // If fetching from product list (which comes from API), it has id.
            // If legacy component logic passes _id, undefined will be sent.
            // I should handle both in product object? `product.id || product._id`
            const productId = product.id || product._id;
            await axios.post("/cart", { productId });
            toast.success("Product added to cart");

            set((prevState: CartStore) => {
                const existingItem = prevState.cart.find((item) => item.id === productId || item._id === productId);
                const newCart = existingItem
                    ? prevState.cart.map((item) =>
                        item.id === productId || item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
                    )
                    : [...prevState.cart, { ...product, id: productId, _id: productId, quantity: 1 } as CartItem];
                return { cart: newCart };
            });
            get().calculateTotals();
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "An error occurred");
            } else {
                toast.error("An error occurred");
            }
        }
    },
    removeFromCart: async (productId: string) => {
        await axios.delete(`/cart`, { data: { productId } });
        set((prevState: CartStore) => ({ cart: prevState.cart.filter((item) => item.id !== productId && item._id !== productId) }));
        get().calculateTotals();
    },
    updateQuantity: async (productId: string, quantity: number) => {
        if (quantity === 0) {
            get().removeFromCart(productId);
            return;
        }

        await axios.put(`/cart/${productId}`, { quantity });
        set((prevState: CartStore) => ({
            cart: prevState.cart.map((item) => (item.id === productId || item._id === productId ? { ...item, quantity } : item)),
        }));
        get().calculateTotals();
    },
    calculateTotals: () => {
        const { cart, coupon } = get();
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let total = subtotal;

        if (coupon) {
            const discount = subtotal * (coupon.discountPercentage / 100);
            total = subtotal - discount;
        }

        set({ subtotal, total });
    },
}));
