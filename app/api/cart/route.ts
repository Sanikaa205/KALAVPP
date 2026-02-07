import { NextRequest, NextResponse } from "next/server";

// In-memory cart for demo (per session via cookie-based mock)
// In production, this would use Prisma + auth session
let cartItems: Array<{
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}> = [];

export async function GET() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 200;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return NextResponse.json({
    items: cartItems,
    summary: { subtotal, shipping, tax, total, itemCount: cartItems.length },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { productId, title, price, quantity = 1, image } = body;

  const existing = cartItems.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cartItems.push({
      id: `cart-${Date.now()}`,
      productId,
      title,
      price,
      quantity,
      image,
    });
  }

  return NextResponse.json({ message: "Added to cart", items: cartItems }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { productId, quantity } = body;

  const item = cartItems.find((i) => i.productId === productId);
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  if (quantity <= 0) {
    cartItems = cartItems.filter((i) => i.productId !== productId);
  } else {
    item.quantity = quantity;
  }

  return NextResponse.json({ message: "Cart updated", items: cartItems });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (productId) {
    cartItems = cartItems.filter((i) => i.productId !== productId);
  } else {
    cartItems = [];
  }

  return NextResponse.json({ message: "Cart cleared", items: cartItems });
}
