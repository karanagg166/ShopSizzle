import { getAuthenticatedUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function SellerDashboardPage() {
    const user = await getAuthenticatedUser();

    if (!user) {
        redirect("/login");
    }

    if (user.role !== "seller" && user.role !== "admin") {
        return (
            <div className="min-h-screen pt-32 text-center text-foreground">
                <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
                <p>You must be a verified seller to view this page.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 px-4 md:px-8 text-foreground">
            <h1 className="text-4xl font-bold mb-8">Seller Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <h2 className="text-xl font-semibold mb-2">My Products</h2>
                    <p className="text-gray-400">Manage your product listings.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <h2 className="text-xl font-semibold mb-2">Orders</h2>
                    <p className="text-gray-400">View and fulfill orders.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <h2 className="text-xl font-semibold mb-2">Analytics</h2>
                    <p className="text-gray-400">Track your performance.</p>
                </div>
            </div>
        </div>
    );
}
