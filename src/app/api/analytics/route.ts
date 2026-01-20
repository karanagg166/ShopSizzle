import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const user = await getAuthenticatedUser();
        if (!user || user.role !== "admin") {
            return NextResponse.json({ message: "Access denied - Admin only" }, { status: 403 });
        }

        const totalUsers = await prisma.user.count();
        const totalProducts = await prisma.product.count();

        // Total Sales & Revenue
        const salesData = await prisma.order.aggregate({
            _count: {
                id: true, // sales
            },
            _sum: {
                totalAmount: true, // revenue
            },
        });

        const { _count, _sum } = salesData;
        const totalSales = _count.id || 0;
        const totalRevenue = _sum.totalAmount || 0;

        // Daily Sales Data (Last 7 days)
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

        // For PostgreSQL, use groupBy instead of aggregateRaw
        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                createdAt: true,
                totalAmount: true,
            },
        });

        // Group orders by date in JavaScript
        const salesByDate: Record<string, { sales: number; revenue: number }> = {};
        orders.forEach((order) => {
            const date = order.createdAt.toISOString().split("T")[0];
            if (!salesByDate[date]) {
                salesByDate[date] = { sales: 0, revenue: 0 };
            }
            salesByDate[date].sales += 1;
            salesByDate[date].revenue += order.totalAmount;
        });

        const dateArray = getDatesInRange(startDate, endDate);

        return NextResponse.json({
            analyticsData: {
                users: totalUsers,
                products: totalProducts,
                totalSales,
                totalRevenue,
            },
            dailySalesData: dateArray.map((date) => ({
                date,
                sales: salesByDate[date]?.sales || 0,
                revenue: salesByDate[date]?.revenue || 0,
            })),
        });

    } catch (error) {
        console.error("Error in analytics:", error);
        return NextResponse.json({ message: "Server error", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}

function getDatesInRange(startDate: Date, endDate: Date) {
    const dates = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}
