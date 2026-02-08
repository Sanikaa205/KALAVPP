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

  if (user.role === "VENDOR") {
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: user.id },
    });

    if (!vendorProfile) {
      return NextResponse.json({ reviews: [] });
    }

    const reviews = await prisma.review.findMany({
      where: { product: { vendorId: vendorProfile.id } },
      include: {
        user: { select: { name: true, avatar: true } },
        product: { select: { title: true, slug: true, images: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  }

  if (user.role === "ADMIN") {
    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { name: true, avatar: true } },
        product: { select: { title: true, slug: true, images: true, vendor: { select: { storeName: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  }

  // Customer: return their own reviews
  const reviews = await prisma.review.findMany({
    where: { userId: user.id },
    include: {
      product: { select: { title: true, slug: true, images: true, vendor: { select: { storeName: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ reviews });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as { id: string; role?: string };
  if (user.role !== "CUSTOMER") {
    return NextResponse.json({ error: "Only customers can write reviews" }, { status: 403 });
  }

  const body = await request.json();
  const { productId, rating, title, comment } = body;

  if (!productId || !rating) {
    return NextResponse.json({ error: "Product ID and rating are required" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  }

  // Check if user already reviewed this product
  const existing = await prisma.review.findFirst({
    where: { userId: user.id, productId },
  });

  if (existing) {
    return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      userId: user.id,
      productId,
      rating,
      title: title || "",
      comment: comment || "",
    },
  });

  // Update product average rating
  const productReviews = await prisma.review.findMany({
    where: { productId },
    select: { rating: true },
  });
  const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: productReviews.length,
    },
  });

  return NextResponse.json({ message: "Review submitted", review }, { status: 201 });
}
