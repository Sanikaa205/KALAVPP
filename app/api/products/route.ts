import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const type = searchParams.get("type");
  const sort = searchParams.get("sort");
  const search = searchParams.get("q");
  const featured = searchParams.get("featured");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  const where: Record<string, unknown> = { status: "ACTIVE" };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { tags: { has: search.toLowerCase() } },
    ];
  }

  if (category) {
    where.category = { slug: category };
  }

  if (type) {
    where.type = type;
  }

  if (featured === "true") {
    where.featured = true;
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  switch (sort) {
    case "price-asc": orderBy = { price: "asc" }; break;
    case "price-desc": orderBy = { price: "desc" }; break;
    case "newest": orderBy = { createdAt: "desc" }; break;
    case "rating": orderBy = { rating: "desc" }; break;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: true,
        vendor: { include: { user: { select: { name: true, avatar: true } } } },
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

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as { id: string; role?: string };
  if (user.role !== "VENDOR" && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Only vendors can create products" }, { status: 403 });
  }

  const body = await request.json();

  // Get vendor profile
  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId: user.id },
  });

  if (!vendor) {
    return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
  }

  const baseSlug = slugify(body.title);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const product = await prisma.product.create({
    data: {
      vendorId: vendor.id,
      categoryId: body.categoryId || null,
      title: body.title,
      slug,
      description: body.description,
      shortDescription: body.shortDescription || null,
      type: body.type || "PHYSICAL",
      status: body.status || "DRAFT",
      price: body.price,
      compareAtPrice: body.compareAtPrice || null,
      images: body.images || [],
      tags: body.tags || [],
      stockQuantity: body.stockQuantity ?? null,
      weight: body.weight || null,
      dimensions: body.dimensions || null,
      sku: body.sku || null,
      shippingRequired: body.type !== "DIGITAL",
      digitalFileUrl: body.digitalFileUrl || null,
      digitalFileSize: body.digitalFileSize || null,
      digitalFileType: body.digitalFileType || null,
      medium: body.medium || null,
      style: body.style || null,
      artDimensions: body.artDimensions || null,
      yearCreated: body.yearCreated || null,
      isOriginal: body.isOriginal || false,
    },
    include: { category: true },
  });

  return NextResponse.json({ message: "Product created", product }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as { id: string; role?: string };
  const body = await request.json();

  if (!body.id) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id: body.id },
    include: { vendor: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Only the owner vendor or admin can edit
  if (user.role !== "ADMIN" && product.vendor.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, ...updateFields } = body;
  const updated = await prisma.product.update({
    where: { id },
    data: updateFields,
  });

  return NextResponse.json({ message: "Product updated", product: updated });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as { id: string; role?: string };
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: { vendor: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  if (user.role !== "ADMIN" && product.vendor.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ message: "Product deleted" });
}
