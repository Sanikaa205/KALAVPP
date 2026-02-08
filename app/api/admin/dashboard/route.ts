import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    totalUsers,
    totalOrders,
    totalProducts,
    totalVendors,
    totalRevenue,
    recentOrders,
    topVendors,
    ordersByStatus,
    usersByRole,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.vendorProfile.count({ where: { status: "APPROVED" } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID" },
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true, avatar: true } },
        items: { select: { title: true, quantity: true, price: true } },
      },
    }),
    prisma.vendorProfile.findMany({
      take: 5,
      where: { status: "APPROVED" },
      orderBy: { totalSales: "desc" },
      include: {
        user: { select: { name: true, avatar: true } },
        _count: { select: { products: true, services: true } },
      },
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.user.groupBy({
      by: ["role"],
      _count: true,
    }),
  ]);

  return NextResponse.json({
    stats: {
      totalUsers,
      totalOrders,
      totalProducts,
      totalVendors,
      totalRevenue: totalRevenue._sum.total || 0,
    },
    recentOrders,
    topVendors,
    ordersByStatus: Object.fromEntries(
      ordersByStatus.map((o: { status: string; _count: number }) => [o.status, o._count])
    ),
    usersByRole: Object.fromEntries(
      usersByRole.map((u: { role: string; _count: number }) => [u.role, u._count])
    ),
  });
}
