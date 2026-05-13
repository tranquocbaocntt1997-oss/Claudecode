import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAccessToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("access_token")?.value;
    const payload = token ? await verifyAccessToken(token) : null;

    if (!payload || (payload.role !== "ADMIN" && payload.role !== "STAFF")) {
      return NextResponse.json(
        { success: false, error: "Không có quyền" },
        { status: 403 }
      );
    }

    const [totalProducts, totalOrders, totalCustomers, pendingOrders, recentOrders, totalRevenue] =
      await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.order.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { name: true, email: true } },
          },
        }),
        prisma.order.aggregate({
          _sum: { totalAmount: true },
          where: { status: { not: "CANCELLED" } },
        }),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalCustomers,
        pendingOrders,
        totalRevenue: totalRevenue._sum.totalAmount ?? 0,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi server" },
      { status: 500 }
    );
  }
}
