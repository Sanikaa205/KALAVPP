import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as { id: string; role?: string };
  const isAdmin = user.role === "ADMIN";

  const commissions = await prisma.commission.findMany({
    where: isAdmin ? {} : { customerId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      service: { select: { title: true, slug: true } },
      vendor: { include: { user: { select: { name: true, avatar: true } } } },
      customer: { select: { name: true, email: true } },
    },
  });

  return NextResponse.json({ commissions });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const body = await request.json();

  const commission = await prisma.commission.create({
    data: {
      customerId: userId,
      vendorId: body.vendorId,
      serviceId: body.serviceId || null,
      title: body.title,
      description: body.description,
      budget: body.budget,
      deadline: body.deadline ? new Date(body.deadline) : null,
    },
  });

  return NextResponse.json(
    { message: "Commission request submitted", commission },
    { status: 201 }
  );
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as { id: string; role?: string };
  const body = await request.json();
  const { commissionId, status, notes, deliveryFiles } = body;

  if (!commissionId) {
    return NextResponse.json({ error: "Commission ID is required" }, { status: 400 });
  }

  const commission = await prisma.commission.findUnique({
    where: { id: commissionId },
    include: { vendor: true },
  });

  if (!commission) {
    return NextResponse.json({ error: "Commission not found" }, { status: 404 });
  }

  // Vendor can update status (accept, in_progress, completed, delivered)
  // Customer can request revision or cancel
  // Admin can do anything
  if (user.role !== "ADMIN") {
    const isVendor = commission.vendor.userId === user.id;
    const isCustomer = commission.customerId === user.id;

    if (!isVendor && !isCustomer) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (isCustomer && status && !["REVISION_REQUESTED", "CANCELLED"].includes(status)) {
      return NextResponse.json({ error: "Customers can only request revision or cancel" }, { status: 403 });
    }
  }

  const updateData: Record<string, unknown> = {};
  if (status) updateData.status = status;
  if (notes) updateData.notes = notes;
  if (deliveryFiles) updateData.deliveryFiles = deliveryFiles;

  const updated = await prisma.commission.update({
    where: { id: commissionId },
    data: updateData,
    include: {
      service: { select: { title: true } },
      vendor: { include: { user: { select: { name: true } } } },
      customer: { select: { name: true } },
    },
  });

  return NextResponse.json({ message: "Commission updated", commission: updated });
}
