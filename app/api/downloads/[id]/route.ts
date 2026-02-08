import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const download = await prisma.digitalDownload.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            digitalFileUrl: true,
          },
        },
      },
    });

    if (!download) {
      return NextResponse.json({ error: "Download not found" }, { status: 404 });
    }

    if (download.userId !== token.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Check if expired
    if (download.expiresAt && new Date(download.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Download link has expired" }, { status: 403 });
    }

    // Check if max downloads reached
    if (download.downloadCount >= download.maxDownloads) {
      return NextResponse.json({ error: "Maximum downloads reached" }, { status: 403 });
    }

    // Increment download count
    await prisma.digitalDownload.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    });

    return NextResponse.json({ url: download.product.digitalFileUrl });
  } catch (error) {
    console.error("Error processing download:", error);
    return NextResponse.json(
      { error: "Failed to process download" },
      { status: 500 }
    );
  }
}
