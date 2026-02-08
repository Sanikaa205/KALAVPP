import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/vendor/services — returns only the logged-in vendor's services
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as { id: string; role?: string };

  if (user.role !== "VENDOR" && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId: user.id },
  });

  if (!vendorProfile) {
    return NextResponse.json({ services: [] });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("q");

  const where: Record<string, unknown> = { vendorId: vendorProfile.id };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const services = await prisma.service.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      vendor: { include: { user: { select: { name: true } } } },
    },
  });

  return NextResponse.json({ services });
}
