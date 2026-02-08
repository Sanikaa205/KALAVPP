import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  const role = (session.user as { role?: string }).role;

  let vendorProfile: { id: string; status: string; storeName: string } | null = null;
  if (role === "VENDOR" && userId) {
    vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId },
      select: { id: true, status: true, storeName: true },
    });
  }

  return NextResponse.json({
    user: session.user,
    vendorProfile,
  });
}
