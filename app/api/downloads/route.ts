import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  const downloads = await prisma.digitalDownload.findMany({
    where: { userId },
    include: {
      product: {
        select: { title: true, slug: true, images: true, type: true, vendor: { select: { storeName: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ downloads });
}
