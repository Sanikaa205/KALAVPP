import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const sort = searchParams.get("sort");
  const search = searchParams.get("q");

  const where: Record<string, unknown> = { isActive: true };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (type) {
    where.type = type;
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  switch (sort) {
    case "price-asc": orderBy = { basePrice: "asc" }; break;
    case "price-desc": orderBy = { basePrice: "desc" }; break;
  }

  const services = await prisma.service.findMany({
    where,
    orderBy,
    include: {
      vendor: { include: { user: { select: { name: true, avatar: true } } } },
    },
  });

  return NextResponse.json({ services });
}
