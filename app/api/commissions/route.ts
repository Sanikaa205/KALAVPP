import { NextRequest, NextResponse } from "next/server";
import { mockCommissions } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ commissions: mockCommissions });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const commission = {
    id: `commission-${Date.now()}`,
    serviceId: body.serviceId,
    description: body.description,
    budget: body.budget,
    deadline: body.deadline,
    status: "PENDING" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(
    { message: "Commission request submitted", commission },
    { status: 201 }
  );
}
