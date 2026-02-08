import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
  const vendors = await prisma.vendorProfile.findMany({
    where: { status: "APPROVED" },
    include: {
      user: { select: { name: true, avatar: true } },
      products: {
        where: { isActive: true },
        take: 3,
        orderBy: { viewCount: "desc" },
        select: { id: true, title: true, slug: true, images: true, price: true },
      },
      services: {
        where: { isActive: true },
        take: 2,
        select: { id: true, title: true, slug: true, basePrice: true },
      },
    },
    orderBy: { rating: "desc" },
  });

  return NextResponse.json({ vendors });
}
