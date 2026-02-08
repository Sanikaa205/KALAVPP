import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, role } = parsed.data;
    const { phone, storeName, bio, specializations } = body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone: phone || null,
        bio: bio || null,
        role: role || "CUSTOMER",
        status: role === "VENDOR" ? "PENDING_APPROVAL" : "ACTIVE",
      },
    });

    // Auto-create vendor profile if registering as vendor
    if (role === "VENDOR") {
      const vendorName = storeName || `${name}'s Studio`;
      const storeSlug = slugify(vendorName);
      await prisma.vendorProfile.create({
        data: {
          userId: user.id,
          storeName: vendorName,
          storeSlug,
          description: bio || null,
          specializations: Array.isArray(specializations) ? specializations : [],
          status: "PENDING",
        },
      });
    }

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
