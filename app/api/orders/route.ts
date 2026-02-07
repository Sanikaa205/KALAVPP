import { NextRequest, NextResponse } from "next/server";
import { mockOrders } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ orders: mockOrders });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const order = {
    id: `order-${Date.now()}`,
    orderNumber: `KVP-${String(Date.now()).slice(-6)}`,
    status: "PENDING" as const,
    totalAmount: body.totalAmount || 0,
    shippingAddress: body.shippingAddress || {},
    paymentMethod: body.paymentMethod || "COD",
    items: body.items || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({ message: "Order placed successfully", order }, { status: 201 });
}
