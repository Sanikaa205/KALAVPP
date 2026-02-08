import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/vendor/products — returns only the logged-in vendor's products
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as { id: string; role?: string };

  if (user.role !== "VENDOR" && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId: user.id },
  });

  if (!vendorProfile) {
    return NextResponse.json({ products: [], pagination: { page: 1, limit: 100, total: 0, totalPages: 0 } });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "100");
  const search = searchParams.get("q");

  const where: Record<string, unknown> = { vendorId: vendorProfile.id };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: true,
        _count: { select: { reviews: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    products,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
