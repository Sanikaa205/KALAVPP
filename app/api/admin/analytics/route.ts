import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalOrders,
    totalProducts,
    totalVendors,
    totalServices,
    totalCommissions,
    totalRevenue,
    revenueLastMonth,
    revenuePrevMonth,
    newUsersThisMonth,
    newUsersPrevMonth,
    ordersThisMonth,
    ordersPrevMonth,
    ordersByStatus,
    usersByRole,
    topVendors,
    vendorsByStatus,
    commissionsByStatus,
    recentOrders,
    recentUsers,
    productsByType,
    servicesByType,
    paymentBreakdown,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.vendorProfile.count({ where: { status: "APPROVED" } }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.commission.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID", createdAt: { gte: thirtyDaysAgo } } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID", createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.order.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    prisma.order.groupBy({ by: ["status"], _count: true }),
    prisma.user.groupBy({ by: ["role"], _count: true }),
    prisma.vendorProfile.findMany({
      take: 10,
      where: { status: "APPROVED" },
      orderBy: { totalSales: "desc" },
      include: {
        user: { select: { name: true, avatar: true } },
        _count: { select: { products: true, services: true } },
      },
    }),
    prisma.vendorProfile.groupBy({ by: ["status"], _count: true }),
    prisma.commission.groupBy({ by: ["status"], _count: true }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: { select: { title: true, quantity: true, price: true } },
      },
    }),
    prisma.user.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    }),
    prisma.product.groupBy({ by: ["type"], _count: true }),
    prisma.service.groupBy({ by: ["type"], _count: true }),
    prisma.order.groupBy({ by: ["paymentStatus"], _count: true, _sum: { total: true } }),
  ]);

  // Monthly revenue for the last 6 months
  const monthlyRevenue: { month: string; revenue: number; orders: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const rev = await prisma.order.aggregate({
      _sum: { total: true },
      _count: true,
      where: { paymentStatus: "PAID", createdAt: { gte: start, lt: end } },
    });
    monthlyRevenue.push({
      month: start.toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      revenue: rev._sum.total || 0,
      orders: rev._count || 0,
    });
  }

  // Commission revenue
  const commissionRevenue = await prisma.commission.aggregate({
    _sum: { budget: true },
    where: { status: { in: ["COMPLETED", "DELIVERED"] } },
  });

  const calcGrowth = (current: number, prev: number) =>
    prev > 0 ? ((current - prev) / prev) * 100 : current > 0 ? 100 : 0;

  return NextResponse.json({
    overview: {
      totalUsers,
      totalOrders,
      totalProducts,
      totalVendors,
      totalServices,
      totalCommissions,
      totalRevenue: totalRevenue._sum.total || 0,
      commissionRevenue: commissionRevenue._sum.budget || 0,
    },
    growth: {
      revenueGrowth: calcGrowth(revenueLastMonth._sum.total || 0, revenuePrevMonth._sum.total || 0),
      userGrowth: calcGrowth(newUsersThisMonth, newUsersPrevMonth),
      orderGrowth: calcGrowth(ordersThisMonth, ordersPrevMonth),
      revenueThisMonth: revenueLastMonth._sum.total || 0,
      revenuePrevMonth: revenuePrevMonth._sum.total || 0,
      newUsersThisMonth,
      ordersThisMonth,
    },
    ordersByStatus: Object.fromEntries(
      ordersByStatus.map((o: { status: string; _count: number }) => [o.status, o._count])
    ),
    usersByRole: Object.fromEntries(
      usersByRole.map((u: { role: string; _count: number }) => [u.role, u._count])
    ),
    vendorsByStatus: Object.fromEntries(
      vendorsByStatus.map((v: { status: string; _count: number }) => [v.status, v._count])
    ),
    commissionsByStatus: Object.fromEntries(
      commissionsByStatus.map((c: { status: string; _count: number }) => [c.status, c._count])
    ),
    productsByType: Object.fromEntries(
      productsByType.map((p: { type: string; _count: number }) => [p.type, p._count])
    ),
    servicesByType: Object.fromEntries(
      servicesByType.map((s: { type: string; _count: number }) => [s.type, s._count])
    ),
    paymentBreakdown: Object.fromEntries(
      paymentBreakdown.map((p: { paymentStatus: string; _count: number; _sum: { total: number | null } }) => [
        p.paymentStatus,
        { count: p._count, total: p._sum.total || 0 },
      ])
    ),
    monthlyRevenue,
    topVendors,
    recentOrders,
    recentUsers,
  });
}
