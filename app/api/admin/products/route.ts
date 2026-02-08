import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/products — returns ALL products (including drafts, archived)
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("q");
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "100");

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status && status !== "all") {
    where.status = status;
  }

  if (type && type !== "all") {
    where.type = type;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: true,
        vendor: { include: { user: { select: { name: true, avatar: true } } } },
        _count: { select: { reviews: true, orderItems: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    products,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, action } = await request.json();

  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  const updateData: Record<string, unknown> = {};

  switch (action) {
    case "approve":
      updateData.status = "ACTIVE";
      break;
    case "archive":
      updateData.status = "ARCHIVED";
      break;
    case "feature":
      updateData.featured = true;
      break;
    case "unfeature":
      updateData.featured = false;
      break;
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data: updateData,
  });

  return NextResponse.json({ message: `Product ${action}d successfully`, product });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ message: "Product deleted successfully" });
}
