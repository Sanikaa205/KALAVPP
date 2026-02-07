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
      user: { select: { name: true, email: true, avatar: true } },
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

  const status = action === "approve" ? "APPROVED" : action === "reject" ? "REJECTED" : "SUSPENDED";

  await prisma.vendorProfile.update({
    where: { id: vendorId },
    data: { status },
  });

  return NextResponse.json({ message: `Vendor ${action}d successfully` });
}
