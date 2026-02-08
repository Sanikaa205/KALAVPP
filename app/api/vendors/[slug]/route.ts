import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const vendor = await prisma.vendorProfile.findFirst({
    where: { storeSlug: slug, status: "APPROVED" },
    include: {
      user: { select: { name: true, avatar: true, createdAt: true } },
    },
  });

  if (!vendor) {
    return NextResponse.json({ error: "Artist not found" }, { status: 404 });
  }

  const products = await prisma.product.findMany({
    where: { vendorId: vendor.id, isActive: true, status: "ACTIVE" },
    include: {
      category: { select: { name: true, slug: true } },
      vendor: { select: { storeName: true, storeSlug: true } },
    },
    take: 12,
    orderBy: { createdAt: "desc" },
  });

  const services = await prisma.service.findMany({
    where: { vendorId: vendor.id, isActive: true },
    include: {
      vendor: { select: { storeName: true, storeSlug: true } },
    },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  const reviews = await prisma.review.findMany({
    where: { product: { vendorId: vendor.id } },
    include: {
      user: { select: { name: true, avatar: true } },
      product: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json({ vendor, products, services, reviews });
}
