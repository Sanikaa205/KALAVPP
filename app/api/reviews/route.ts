import { NextResponse } from "next/server";
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

  // For admin, return all reviews
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

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
