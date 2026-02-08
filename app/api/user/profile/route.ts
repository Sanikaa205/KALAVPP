import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { hash, compare } from "bcryptjs";

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      phone: true,
      bio: true,
      role: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ user });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const body = await request.json();

  const updateData: Record<string, unknown> = {};
  if (body.name) updateData.name = body.name;
  if (body.phone !== undefined) updateData.phone = body.phone;
  if (body.bio !== undefined) updateData.bio = body.bio;
  if (body.avatar !== undefined) updateData.avatar = body.avatar;

  // Handle password change
  if (body.currentPassword && body.newPassword) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.passwordHash) {
      return NextResponse.json({ error: "Cannot change password for OAuth accounts" }, { status: 400 });
    }

    const isValid = await compare(body.currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    updateData.passwordHash = await hash(body.newPassword, 12);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      phone: true,
      bio: true,
      role: true,
    },
  });

  return NextResponse.json({ message: "Profile updated", user });
}
