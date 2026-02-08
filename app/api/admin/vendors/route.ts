import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const vendors = await prisma.vendorProfile.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true } },
      _count: { select: { products: true, services: true } },
    },
  });

  return NextResponse.json({ vendors });
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { vendorId, action } = await request.json();

  if (action === "approve") {
    await prisma.vendorProfile.update({
      where: { id: vendorId },
      data: { status: "APPROVED" },
    });
  } else if (action === "reject") {
    await prisma.vendorProfile.update({
      where: { id: vendorId },
      data: { status: "REJECTED" },
    });
  } else if (action === "suspend") {
    await prisma.vendorProfile.update({
      where: { id: vendorId },
      data: { status: "SUSPENDED" },
    });
  }

  return NextResponse.json({ message: `Vendor ${action} successful` });
}
