import "dotenv/config";
import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log("🌱 Seeding database...");

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Paintings",
        slug: "paintings",
        description: "Original artwork and paintings",
        image: "/images/categories/paintings.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Sculptures",
        slug: "sculptures",
        description: "Handcrafted sculptures and 3D art",
        image: "/images/categories/sculptures.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Digital Art",
        slug: "digital-art",
        description: "Digital illustrations and designs",
        image: "/images/categories/digital-art.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Photography",
        slug: "photography",
        description: "Professional photography prints",
        image: "/images/categories/photography.jpg",
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@kalavpp.com",
      password: await hash("admin123", 10),
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
  });

  console.log(`✅ Created admin user: ${admin.email}`);

  // Create vendor users
  const vendor1 = await prisma.user.create({
    data: {
      name: "Priya Sharma",
      email: "priya@kalavpp.com",
      password: await hash("vendor123", 10),
      role: UserRole.VENDOR,
      emailVerified: new Date(),
      vendorProfile: {
        create: {
          businessName: "Priya's Art Studio",
          description: "Contemporary Indian art and traditional paintings",
          taxId: "GST123456789",
          bankAccount: "HDFC0001234",
          ifscCode: "HDFC0001234",
          panCard: "ABCDE1234F",
          isVerified: true,
        },
      },
    },
  });

  const vendor2 = await prisma.user.create({
    data: {
      name: "Rajesh Kumar",
      email: "rajesh@kalavpp.com",
      password: await hash("vendor123", 10),
      role: UserRole.VENDOR,
      emailVerified: new Date(),
      vendorProfile: {
        create: {
          businessName: "Rajesh Digital Creations",
          description: "Digital art and custom illustrations",
          taxId: "GST987654321",
          bankAccount: "ICICI0005678",
          ifscCode: "ICICI0005678",
          panCard: "XYZAB9876C",
          isVerified: true,
        },
      },
    },
  });

  console.log(`✅ Created 2 vendor users`);

  // Create customer users
  const customer1 = await prisma.user.create({
    data: {
      name: "Aarti Deshmukh",
      email: "aarti@example.com",
      password: await hash("customer123", 10),
      role: UserRole.CUSTOMER,
      emailVerified: new Date(),
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: "Vikram Singh",
      email: "vikram@example.com",
      password: await hash("customer123", 10),
      role: UserRole.CUSTOMER,
      emailVerified: new Date(),
    },
  });

  console.log(`✅ Created 2 customer users`);

  // Create products
  const product1 = await prisma.product.create({
    data: {
      name: "Sunset Over Mumbai",
      slug: "sunset-over-mumbai",
      description: "Beautiful oil painting capturing the golden hour over Mumbai skyline. Original artwork on canvas.",
      shortDescription: "Oil painting of Mumbai sunset",
      price: 15000,
      compareAtPrice: 20000,
      vendorId: vendor1.id,
      categoryId: categories[0].id,
      stock: 1,
      sku: "PAINT-001",
      featured: true,
      published: true,
      images: ["/images/products/sunset-mumbai.jpg"],
      tags: ["oil painting", "mumbai", "sunset", "original"],
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Abstract Emotions",
      slug: "abstract-emotions",
      description: "Modern abstract painting with vibrant colors expressing human emotions. Acrylic on canvas.",
      shortDescription: "Abstract acrylic painting",
      price: 12000,
      vendorId: vendor1.id,
      categoryId: categories[0].id,
      stock: 1,
      sku: "PAINT-002",
      featured: true,
      published: true,
      images: ["/images/products/abstract-emotions.jpg"],
      tags: ["abstract", "modern", "acrylic"],
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: "Digital Portrait Pack",
      slug: "digital-portrait-pack",
      description: "Collection of 5 high-resolution digital portraits. Instant download after purchase.",
      shortDescription: "5 digital portraits",
      price: 2500,
      compareAtPrice: 3500,
      vendorId: vendor2.id,
      categoryId: categories[2].id,
      stock: 999,
      sku: "DIG-001",
      featured: true,
      published: true,
      images: ["/images/products/digital-portraits.jpg"],
      tags: ["digital", "portraits", "download"],
      digitalDownload: {
        create: {
          fileName: "digital-portraits-pack.zip",
          fileUrl: "/downloads/digital-portraits-pack.zip",
          fileSize: 125000000, // 125 MB
          downloadLimit: 5,
        },
      },
    },
  });

  console.log(`✅ Created ${3} products`);

  // Create services
  const service1 = await prisma.service.create({
    data: {
      name: "Custom Portrait Painting",
      slug: "custom-portrait-painting",
      description: "Get a personalized oil painting portrait from your photo. Available in multiple sizes.",
      shortDescription: "Custom portrait from photo",
      basePrice: 8000,
      vendorId: vendor1.id,
      categoryId: categories[0].id,
      featured: true,
      published: true,
      images: ["/images/services/custom-portrait.jpg"],
      tags: ["custom", "portrait", "painting", "commission"],
      deliveryTime: 14,
    },
  });

  const service2 = await prisma.service.create({
    data: {
      name: "Logo Design",
      slug: "logo-design",
      description: "Professional logo design for your business. Includes 3 concepts and unlimited revisions.",
      shortDescription: "Custom logo design",
      basePrice: 5000,
      vendorId: vendor2.id,
      categoryId: categories[2].id,
      featured: true,
      published: true,
      images: ["/images/services/logo-design.jpg"],
      tags: ["logo", "branding", "design", "business"],
      deliveryTime: 7,
    },
  });

  console.log(`✅ Created ${2} services`);

  // Add reviews
  await prisma.review.create({
    data: {
      rating: 5,
      comment: "Absolutely beautiful painting! The colors are stunning and it arrived perfectly packaged.",
      productId: product1.id,
      userId: customer1.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: "Amazing work! The portrait exceeded my expectations. Highly recommended!",
      serviceId: service1.id,
      userId: customer2.id,
    },
  });

  console.log(`✅ Created 2 reviews`);

  console.log("✨ Seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
