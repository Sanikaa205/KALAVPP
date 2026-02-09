import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET });
    
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    // Build where clause
    const where: any = {};
    if (type === "orders") {
      // Export orders
      const orders = await prisma.order.findMany({
        include: {
          user: { select: { name: true, email: true } },
          items: {
            include: {
              product: { select: { title: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 1000,
      });

      // Convert to CSV
      const csvHeaders = "Order ID,Customer Name,Customer Email,Status,Payment Status,Total Amount,Items Count,Created At\n";
      const csvRows = orders.map(order => {
        return `${order.id},${order.user.name},"${order.user.email}",${order.status},${order.paymentStatus},${order.total},${order.items.length},${new Date(order.createdAt).toISOString()}`;
      }).join("\n");

      return new NextResponse(csvHeaders + csvRows, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="orders_${Date.now()}.csv"`,
        },
      });
    } else if (type === "commissions") {
      // Export commissions
      const commissions = await prisma.commission.findMany({
        include: {
          customer: { select: { name: true, email: true } },
          vendor: { select: { storeName: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 1000,
      });

      const csvHeaders = "Commission ID,Customer Name,Customer Email,Vendor,Title,Budget,Status,Deadline,Created At\n";
      const csvRows = commissions.map(comm => {
        return `${comm.id},${comm.customer.name},"${comm.customer.email}",${comm.vendor.storeName},"${comm.title}",${comm.budget},${comm.status},${comm.deadline ? new Date(comm.deadline).toISOString() : "N/A"},${new Date(comm.createdAt).toISOString()}`;
      }).join("\n");

      return new NextResponse(csvHeaders + csvRows, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="commissions_${Date.now()}.csv"`,
        },
      });
    } else if (type === "vendors") {
      // Export vendors
      const vendors = await prisma.vendorProfile.findMany({
        include: {
          user: { select: { name: true, email: true, status: true } },
          _count: {
            select: {
              products: true,
              services: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const csvHeaders = "Vendor ID,Store Name,Contact Name,Email,Status,Products Count,Services Count,Created At\n";
      const csvRows = vendors.map(vendor => {
        return `${vendor.id},${vendor.storeName},${vendor.user.name},"${vendor.user.email}",${vendor.user.status},${vendor._count.products},${vendor._count.services},${new Date(vendor.createdAt).toISOString()}`;
      }).join("\n");

      return new NextResponse(csvHeaders + csvRows, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="vendors_${Date.now()}.csv"`,
        },
      });
    } else if (type === "products") {
      // Export products
      const products = await prisma.product.findMany({
        include: {
          vendor: { select: { storeName: true } },
          category: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 1000,
      });

      const csvHeaders = "Product ID,Title,Vendor,Category,Type,Status,Price,Stock,Created At\n";
      const csvRows = products.map(product => {
        return `${product.id},"${product.title}",${product.vendor.storeName},${product.category?.name || "N/A"},${product.type},${product.status},${product.price},${product.stockQuantity || "N/A"},${new Date(product.createdAt).toISOString()}`;
      }).join("\n");

      return new NextResponse(csvHeaders + csvRows, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="products_${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
  } catch (error) {
    console.error("Error exporting data:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
