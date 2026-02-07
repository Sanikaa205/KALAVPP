import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

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
