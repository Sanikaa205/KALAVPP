import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "VENDOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id!;

  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId },
    select: { id: true, commissionRate: true, totalSales: true },
  });

  if (!vendor) {
    return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
  }

  // Get all order items for this vendor's products
  const orderItems = await prisma.orderItem.findMany({
    where: {
      product: { vendorId: vendor.id },
      order: { paymentStatus: "PAID" },
    },
    include: {
      order: {
        select: { id: true, orderNumber: true, createdAt: true, status: true, paymentStatus: true },
      },
    },
    orderBy: { order: { createdAt: "desc" } },
  });

  const totalRevenue = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const platformFee = totalRevenue * (vendor.commissionRate / 100);
  const netEarnings = totalRevenue - platformFee;

  // Group by month for chart
  const monthlyEarnings: Record<string, number> = {};
  orderItems.forEach((item) => {
    const month = new Date(item.order.createdAt).toISOString().slice(0, 7); // YYYY-MM
    monthlyEarnings[month] = (monthlyEarnings[month] || 0) + item.price * item.quantity;
  });

  const monthlyData = Object.entries(monthlyEarnings)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({
      month,
      revenue: amount,
      fee: amount * (vendor.commissionRate / 100),
      net: amount - amount * (vendor.commissionRate / 100),
    }));

  // Recent transactions
  const recentTransactions = orderItems.slice(0, 20).map((item) => ({
    id: item.id,
    orderNumber: item.order.orderNumber,
    title: item.title,
    quantity: item.quantity,
    amount: item.price * item.quantity,
    fee: item.price * item.quantity * (vendor.commissionRate / 100),
    net: item.price * item.quantity * (1 - vendor.commissionRate / 100),
    status: item.order.paymentStatus,
    date: item.order.createdAt,
  }));

  return NextResponse.json({
    summary: {
      totalRevenue,
      platformFee,
      netEarnings,
      commissionRate: vendor.commissionRate,
      totalOrders: orderItems.length,
    },
    monthlyData,
    recentTransactions,
  });
}
