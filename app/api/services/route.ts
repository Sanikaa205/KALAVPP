import { NextRequest, NextResponse } from "next/server";
import { mockServices } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const sort = searchParams.get("sort");
  const search = searchParams.get("q");

  let services = [...mockServices];

  if (search) {
    const q = search.toLowerCase();
    services = services.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }

  if (type) {
    services = services.filter((s) => s.type === type);
  }

  switch (sort) {
    case "price-asc":
      services.sort((a, b) => a.startingPrice - b.startingPrice);
      break;
    case "price-desc":
      services.sort((a, b) => b.startingPrice - a.startingPrice);
      break;
    case "rating":
      services.sort((a, b) => b.rating - a.rating);
      break;
  }

  return NextResponse.json({ services });
}
