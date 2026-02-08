import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await prisma.siteSetting.findMany();

  return NextResponse.json({ settings });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const settingsArray = body.settings || [];

  // Upsert each setting from array format [{key, value}]
  const updates = settingsArray.map((s: { key: string; value: string }) =>
    prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    })
  );

  await Promise.all(updates);

  return NextResponse.json({ message: "Settings saved successfully" });
}
