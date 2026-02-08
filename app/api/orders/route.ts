import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as { id: string; role?: string };
  const isAdmin = user.role === "ADMIN";
  const isVendor = user.role === "VENDOR";

  let whereClause: any = { userId: user.id };

  if (isAdmin) {
    whereClause = {};
  } else if (isVendor) {
    // Vendors only see orders that contain items from their products
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: user.id },
    });
    if (!vendorProfile) {
      return NextResponse.json({ orders: [] });
    }
    whereClause = {
      items: { some: { product: { vendorId: vendorProfile.id } } },
    };
  }

  const orders = await prisma.order.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { images: true, slug: true, vendorId: true } } } },
    },
  });

  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const body = await request.json();

  const order = await prisma.order.create({
    data: {
      orderNumber: `KAL-${Date.now().toString(36).toUpperCase()}`,
      userId,
      subtotal: body.subtotal || 0,
      shippingCost: body.shippingCost || 0,
      tax: body.tax || 0,
      total: body.total || 0,
      paymentMethod: body.paymentMethod || "COD",
      addressId: body.addressId || null,
      items: {
        create: (body.items || []).map((item: { productId: string; title: string; price: number; quantity: number; type: string }) => ({
          productId: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          type: item.type || "PHYSICAL",
        })),
      },
    },
    include: { items: true },
  });

  return NextResponse.json({ message: "Order placed successfully", order }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as { id: string; role?: string };
  const body = await request.json();
  const { orderId, status, paymentStatus } = body;

  if (!orderId) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  }

  // Only admin and vendor can update order status
  if (user.role !== "ADMIN" && user.role !== "VENDOR") {
    // Customers can only cancel their own pending orders
    if (status !== "CANCELLED") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.userId !== user.id || order.status !== "PENDING") {
      return NextResponse.json({ error: "Cannot cancel this order" }, { status: 403 });
    }
  }

  const updateData: Record<string, unknown> = {};
  if (status) updateData.status = status;
  if (paymentStatus) updateData.paymentStatus = paymentStatus;

  const order = await prisma.order.update({
    where: { id: orderId },
    data: updateData,
    include: { items: true },
  });

  return NextResponse.json({ message: "Order updated", order });
}
