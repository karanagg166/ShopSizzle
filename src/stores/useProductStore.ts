import { create } from "zustand";
import { toast } from "sonner";
import axios from "../lib/axios";
import { AxiosError } from "axios";

export interface Product {
    _id?: string;
    id: string; // for compatibility
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    isFeatured: boolean;
}

interface ProductStore {
    products: Product[];
    loading: boolean;
    setProducts: (products: Product[]) => void;
    createProduct: (productData: Omit<Product, "id" | "_id" | "isFeatured"> & { isFeatured?: boolean }) => Promise<void>;
    fetchAllProducts: () => Promise<void>;
    fetchProductsByCategory: (category: string) => Promise<void>;
    deleteProduct: (productId: string) => Promise<void>;
    toggleFeaturedProduct: (productId: string) => Promise<void>;
    fetchFeaturedProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
    products: [],
    loading: false,

    setProducts: (products: Product[]) => set({ products }),
    createProduct: async (productData) => {
        set({ loading: true });
        try {
            const res = await axios.post("/products", productData);
            set((prevState: ProductStore) => ({
                products: [...prevState.products, res.data],
                loading: false,
            }));
            toast.success("Product created successfully");
        } catch (error) {
            set({ loading: false });
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.error || "Error creating product");
            } else {
                toast.error("Error creating product");
            }
        }
    },
    fetchAllProducts: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("/products");
            set({ products: Array.isArray(response.data) ? response.data : (response.data.products || []), loading: false });
        } catch (error) {
            set({ loading: false });
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.error || "Failed to fetch products");
            } else {
                toast.error("Failed to fetch products");
            }
        }
    },
    fetchProductsByCategory: async (category: string) => {
        set({ loading: true });
        try {
            const response = await axios.get(`/products/category/${category}`);
            set({ products: Array.isArray(response.data) ? response.data : (response.data.products || []), loading: false });
        } catch (error) {
            set({ loading: false });
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.error || "Failed to fetch products");
            } else {
                toast.error("Failed to fetch products");
            }
        }
    },
    deleteProduct: async (productId: string) => {
        set({ loading: true });
        try {
            await axios.delete(`/products/${productId}`);
            set((prevProducts: ProductStore) => ({
                products: prevProducts.products.filter((product) => product.id !== productId && product._id !== productId),
                loading: false,
            }));
            toast.success("Product deleted successfully");
        } catch (error) {
            set({ loading: false });
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.error || "Failed to delete product");
            } else {
                toast.error("Failed to delete product");
            }
        }
    },
    toggleFeaturedProduct: async (productId: string) => {
        set({ loading: true });
        try {
            const response = await axios.patch(`/products/${productId}`);
            // this will update the isFeatured prop of the product
            set((prevProducts: ProductStore) => ({
                products: prevProducts.products.map((product) =>
                    product.id === productId || product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
                ),
                loading: false,
            }));
            toast.success("Product updated successfully");
        } catch (error) {
            set({ loading: false });
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.error || "Failed to update product");
            } else {
                toast.error("Failed to update product");
            }
        }
    },
    fetchFeaturedProducts: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("/products/featured");
            set({ products: Array.isArray(response.data) ? response.data : [], loading: false });
        } catch (error) {
            set({ loading: false });
            console.log("Error fetching featured products:", error);
        }
    },
}));
