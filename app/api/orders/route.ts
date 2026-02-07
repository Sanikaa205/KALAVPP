import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as { id: string; role?: string };
  const isAdmin = user.role === "ADMIN";
  const isVendor = user.role === "VENDOR";

  const orders = await prisma.order.findMany({
    where: isAdmin || isVendor ? {} : { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { images: true, slug: true } } } },
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
