import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const assets = await prisma.product.findMany({
      where: {
        type: "DIGITAL",
        digitalFileUrl: { not: null },
      },
      select: {
        id: true,
        title: true,
        digitalFileUrl: true,
        digitalFileSize: true,
        digitalFileType: true,
        price: true,
        createdAt: true,
        vendor: {
          select: {
            id: true,
            storeName: true,
          },
        },
        _count: {
          select: {
            downloads: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ assets });
  } catch (error) {
    console.error("Error fetching digital assets:", error);
    return NextResponse.json(
      { error: "Failed to fetch digital assets" },
      { status: 500 }
    );
  }
}
