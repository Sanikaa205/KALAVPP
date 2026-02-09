import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? "set (" + process.env.DATABASE_URL.replace(/\/\/.*@/, "//***@") + ")" : "NOT SET",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "set" : "NOT SET",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
    },
  };

  try {
    // Test raw query via Prisma
    const result = await prisma.$queryRawUnsafe("SELECT 1 as ok");
    checks.database = { status: "connected", result };
  } catch (error: any) {
    checks.database = {
      status: "error",
      message: error?.message || String(error),
      code: error?.code,
      name: error?.name,
    };
  }

  const allOk = (checks.database as any)?.status === "connected";

  return NextResponse.json(checks, { status: allOk ? 200 : 500 });
}
