import { NextRequest, NextResponse } from "next/server";

const vendors = [
  { id: "v1", storeName: "Priya's Canvas", status: "Active", products: 24, revenue: 156800 },
  { id: "v2", storeName: "Arjun Digital Studio", status: "Active", products: 18, revenue: 89500 },
  { id: "v3", storeName: "Kavya Handicrafts", status: "Active", products: 32, revenue: 234000 },
];

export async function GET() {
  return NextResponse.json({ vendors });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { vendorId, action } = body;

  return NextResponse.json({
    message: `Vendor ${vendorId} ${action === "approve" ? "approved" : "updated"} successfully`,
  });
}
