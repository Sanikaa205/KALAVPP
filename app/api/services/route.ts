import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const sort = searchParams.get("sort");
  const search = searchParams.get("q");

  const where: Record<string, unknown> = { isActive: true };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (type) {
    where.type = type;
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  switch (sort) {
    case "price-asc": orderBy = { basePrice: "asc" }; break;
    case "price-desc": orderBy = { basePrice: "desc" }; break;
  }

  const services = await prisma.service.findMany({
    where,
    orderBy,
    include: {
      vendor: { include: { user: { select: { name: true, avatar: true } } } },
    },
  });

  return NextResponse.json({ services });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as { id: string; role?: string };
  if (user.role !== "VENDOR" && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Only vendors can create services" }, { status: 403 });
  }

  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId: user.id },
  });

  if (!vendor) {
    return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
  }

  const body = await request.json();

  const baseSlug = slugify(body.title);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.service.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const service = await prisma.service.create({
    data: {
      vendorId: vendor.id,
      title: body.title,
      slug,
      description: body.description,
      type: body.type || "CUSTOM",
      basePrice: body.basePrice,
      deliveryDays: body.deliveryDays || null,
      maxRevisions: body.maxRevisions || 3,
      includes: body.includes || [],
      images: body.images || [],
    },
  });

  return NextResponse.json({ message: "Service created", service }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as { id: string; role?: string };
  const body = await request.json();

  if (!body.id) {
    return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
  }

  const service = await prisma.service.findUnique({
    where: { id: body.id },
    include: { vendor: true },
  });

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  if (user.role !== "ADMIN" && service.vendor.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, ...updateFields } = body;
  const updated = await prisma.service.update({
    where: { id },
    data: updateFields,
  });

  return NextResponse.json({ message: "Service updated", service: updated });
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
    return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
  }

  const service = await prisma.service.findUnique({
    where: { id },
    include: { vendor: true },
  });

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  if (user.role !== "ADMIN" && service.vendor.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.service.delete({ where: { id } });

  return NextResponse.json({ message: "Service deleted" });
}
