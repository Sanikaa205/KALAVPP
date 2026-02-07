import { NextRequest, NextResponse } from "next/server";
import { mockUsers } from "@/lib/mock-data";

export async function GET() {
  const safeUsers = mockUsers.map(({ password, ...user }) => user);
  return NextResponse.json({ users: safeUsers });
}
