import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }],
  });

  return NextResponse.json({ addresses });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const body = await request.json();

  // If this is marked as default, unset other defaults
  if (body.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  // If this is the first address, make it default
  const count = await prisma.address.count({ where: { userId } });

  const address = await prisma.address.create({
    data: {
      userId,
      label: body.label || "Home",
      fullName: body.fullName,
      line1: body.line1,
      line2: body.line2 || null,
      city: body.city,
      state: body.state,
      postalCode: body.postalCode,
      country: body.country || "India",
      phone: body.phone || null,
      isDefault: body.isDefault || count === 0,
    },
  });

  return NextResponse.json({ message: "Address added", address }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const body = await request.json();

  if (!body.id) {
    return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
  }

  const address = await prisma.address.findUnique({ where: { id: body.id } });
  if (!address || address.userId !== userId) {
    return NextResponse.json({ error: "Address not found" }, { status: 404 });
  }

  if (body.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  const { id, ...updateFields } = body;
  const updated = await prisma.address.update({
    where: { id },
    data: updateFields,
  });

  return NextResponse.json({ message: "Address updated", address: updated });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
  }

  const address = await prisma.address.findUnique({ where: { id } });
  if (!address || address.userId !== userId) {
    return NextResponse.json({ error: "Address not found" }, { status: 404 });
  }

  await prisma.address.delete({ where: { id } });

  return NextResponse.json({ message: "Address deleted" });
}
