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
  const settingsMap: Record<string, unknown> = {};
  settings.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  return NextResponse.json({ settings: settingsMap });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Upsert each setting
  const updates = Object.entries(body).map(([key, value]) =>
    prisma.siteSetting.upsert({
      where: { key },
      update: { value: JSON.parse(JSON.stringify(value)) },
      create: { key, value: JSON.parse(JSON.stringify(value)) },
    })
  );

  await Promise.all(updates);

  return NextResponse.json({ message: "Settings saved successfully" });
}
