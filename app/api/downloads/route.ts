import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = (session.user as { id?: string }).id!;

    const downloads = await prisma.digitalDownload.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            digitalFileUrl: true,
            digitalFileSize: true,
            digitalFileType: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ downloads });
  } catch (error) {
    console.error("Error fetching downloads:", error);
    return NextResponse.json(
      { error: "Failed to fetch downloads" },
      { status: 500 }
    );
  }
}
