import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ items: [], summary: { subtotal: 0, shipping: 0, tax: 0, total: 0, itemCount: 0 } });
  }

  const userId = (session.user as { id: string }).id;
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: { select: { title: true, price: true, images: true, slug: true, stockQuantity: true } } },
  });

  const items = cartItems.map((item) => ({
    id: item.id,
    productId: item.productId,
    title: item.product.title,
    price: item.product.price,
    quantity: item.quantity,
    image: item.product.images[0] || "",
    slug: item.product.slug,
  }));

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 200;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return NextResponse.json({
    items,
    summary: { subtotal, shipping, tax, total, itemCount: items.length },
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Please login to add items to cart" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { productId, quantity = 1 } = await request.json();

  const cartItem = await prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: { quantity: { increment: quantity } },
    create: { userId, productId, quantity },
  });

  return NextResponse.json({ message: "Added to cart", cartItem }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { productId, quantity } = await request.json();

  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({ where: { userId, productId } });
  } else {
    await prisma.cartItem.updateMany({ where: { userId, productId }, data: { quantity } });
  }

  return NextResponse.json({ message: "Cart updated" });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (productId) {
    await prisma.cartItem.deleteMany({ where: { userId, productId } });
  } else {
    await prisma.cartItem.deleteMany({ where: { userId } });
  }

  return NextResponse.json({ message: "Cart cleared" });
}
