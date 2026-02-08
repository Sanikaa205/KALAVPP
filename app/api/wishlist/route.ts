import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  const wishlistItems = await prisma.wishlistItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          category: { select: { name: true, slug: true } },
          vendor: { include: { user: { select: { name: true, avatar: true } } } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ wishlistItems });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Please login to add items to wishlist" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { productId } = await request.json();

  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  // Check if already in wishlist
  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    // Toggle: remove if already exists
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    return NextResponse.json({ message: "Removed from wishlist", added: false });
  }

  const wishlistItem = await prisma.wishlistItem.create({
    data: { userId, productId },
  });

  return NextResponse.json({ message: "Added to wishlist", added: true, wishlistItem }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  await prisma.wishlistItem.deleteMany({
    where: { userId, productId },
  });

  return NextResponse.json({ message: "Removed from wishlist" });
}
