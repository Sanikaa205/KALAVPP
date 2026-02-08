import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      status: true,
      emailVerified: true,
      createdAt: true,
      _count: { select: { orders: true, reviews: true } },
    },
  });

  return NextResponse.json({ users });
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { userId, action, role } = body;

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const updateData: Record<string, unknown> = {};

  switch (action) {
    case "suspend":
      updateData.status = "SUSPENDED";
      break;
    case "activate":
      updateData.status = "ACTIVE";
      break;
    case "deactivate":
      updateData.status = "DEACTIVATED";
      break;
    case "change-role":
      if (role) updateData.role = role;
      break;
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: { id: true, name: true, email: true, role: true, status: true },
  });

  return NextResponse.json({ message: `User ${action}d successfully`, user });
}
