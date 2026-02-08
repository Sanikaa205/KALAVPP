import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId },
    include: { user: { select: { name: true, email: true, avatar: true, phone: true } } },
  });

  if (!vendor) {
    return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
  }

  return NextResponse.json({ vendor });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const body = await request.json();

  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId },
  });

  if (!vendor) {
    return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
  }

  const updateData: Record<string, unknown> = {};
  if (body.storeName) updateData.storeName = body.storeName;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.logo !== undefined) updateData.logo = body.logo;
  if (body.banner !== undefined) updateData.banner = body.banner;
  if (body.website !== undefined) updateData.website = body.website;
  if (body.socialLinks !== undefined) updateData.socialLinks = body.socialLinks;
  if (body.specializations !== undefined) updateData.specializations = body.specializations;

  const updated = await prisma.vendorProfile.update({
    where: { id: vendor.id },
    data: updateData,
  });

  return NextResponse.json({ message: "Store settings updated", vendor: updated });
}
