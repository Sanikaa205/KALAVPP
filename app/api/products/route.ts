import { NextRequest, NextResponse } from "next/server";
import { mockProducts } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const type = searchParams.get("type");
  const sort = searchParams.get("sort");
  const search = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  let products = [...mockProducts];

  if (search) {
    const q = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (category) {
    products = products.filter((p) => p.category?.slug === category);
  }

  if (type) {
    products = products.filter((p) => p.type === type);
  }

  switch (sort) {
    case "price-asc":
      products.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      products.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      products.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "rating":
      products.sort((a, b) => b.rating - a.rating);
      break;
  }

  const total = products.length;
  const start = (page - 1) * limit;
  const paginated = products.slice(start, start + limit);

  return NextResponse.json({
    products: paginated,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
