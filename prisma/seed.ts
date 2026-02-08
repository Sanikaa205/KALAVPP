import "dotenv/config";
import pg from "pg";
import { hashSync } from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL!;

async function main() {
  const client = new pg.Client({ connectionString: DATABASE_URL });
  await client.connect();
  console.log("🌱 Connected to database, seeding...");

  // Clean existing data in correct order (respect foreign keys)
  await client.query(`
    DELETE FROM "Review";
    DELETE FROM "OrderItem";
    DELETE FROM "Order";
    DELETE FROM "Commission";
    DELETE FROM "CartItem";
    DELETE FROM "WishlistItem";
    DELETE FROM "DigitalDownload";
    DELETE FROM "Notification";
    DELETE FROM "Product";
    DELETE FROM "Service";
    DELETE FROM "VendorProfile";
    DELETE FROM "Address";
    DELETE FROM "Session";
    DELETE FROM "OAuthAccount";
    DELETE FROM "Category";
    DELETE FROM "User";
    DELETE FROM "SiteSetting";
  `);
  console.log("✅ Cleaned existing data");

  // Create Users
  const adminPass = hashSync("Admin@123", 10);
  const vendorPass = hashSync("Vendor@123", 10);
  const customerPass = hashSync("Customer@123", 10);

  await client.query(`
    INSERT INTO "User" (id, email, "passwordHash", name, role, status, "emailVerified", "createdAt", "updatedAt")
    VALUES 
      ('usr_admin1', 'admin@kalavpp.com', $1, 'Kalavpp Admin', 'ADMIN', 'ACTIVE', NOW(), NOW(), NOW()),
      ('usr_vendor1', 'priya@kalavpp.com', $2, 'Priya Sharma', 'VENDOR', 'ACTIVE', NOW(), NOW(), NOW()),
      ('usr_vendor2', 'rajesh@kalavpp.com', $2, 'Rajesh Kumar', 'VENDOR', 'ACTIVE', NOW(), NOW(), NOW()),
      ('usr_vendor3', 'ananya@kalavpp.com', $2, 'Ananya Iyer', 'VENDOR', 'ACTIVE', NOW(), NOW(), NOW()),
      ('usr_cust1', 'aarti@example.com', $3, 'Aarti Deshmukh', 'CUSTOMER', 'ACTIVE', NOW(), NOW(), NOW()),
      ('usr_cust2', 'vikram@example.com', $3, 'Vikram Singh', 'CUSTOMER', 'ACTIVE', NOW(), NOW(), NOW());
  `, [adminPass, vendorPass, customerPass]);
  console.log("✅ Created 6 users");

  // Create Vendor Profiles
  await client.query(`
    INSERT INTO "VendorProfile" (id, "userId", "storeName", "storeSlug", description, specializations, status, "commissionRate", "totalSales", "totalOrders", rating, "createdAt", "updatedAt")
    VALUES 
      ('vp_1', 'usr_vendor1', 'Priya Art Studio', 'priya-art-studio', 
       'Contemporary Indian art blending traditional techniques with modern expression. Specializing in oil paintings, watercolors, and mixed media.',
       ARRAY['Oil Painting', 'Watercolor', 'Mixed Media'], 'APPROVED', 10.0, 245000, 18, 4.8, NOW(), NOW()),
      ('vp_2', 'usr_vendor2', 'Rajesh Digital Creations', 'rajesh-digital',
       'Digital art and custom illustrations for brands, books, and personal collections.',
       ARRAY['Digital Art', 'Illustration', 'Branding'], 'APPROVED', 10.0, 180000, 25, 4.6, NOW(), NOW()),
      ('vp_3', 'usr_vendor3', 'Ananya Fine Arts', 'ananya-fine-arts',
       'Traditional South Indian art forms including Tanjore paintings, Mysore style, and contemporary interpretations.',
       ARRAY['Tanjore Painting', 'Traditional Art', 'Sculpture'], 'APPROVED', 10.0, 320000, 12, 4.9, NOW(), NOW());
  `);
  console.log("✅ Created 3 vendor profiles");

  // Create Categories
  await client.query(`
    INSERT INTO "Category" (id, name, slug, description, image, "sortOrder", "createdAt")
    VALUES 
      ('cat_1', 'Original Artworks', 'original-artworks', 'One-of-a-kind paintings and artworks', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80', 1, NOW()),
      ('cat_2', 'Prints & Reproductions', 'prints-reproductions', 'High-quality prints of popular artworks', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80', 2, NOW()),
      ('cat_3', 'Handcrafted Items', 'handcrafted-items', 'Handmade crafts and artisan products', 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&q=80', 3, NOW()),
      ('cat_4', 'Digital Art', 'digital-art', 'Digital illustrations and downloads', 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&q=80', 4, NOW()),
      ('cat_5', 'Traditional & Tribal', 'traditional-tribal', 'Traditional Indian art forms', 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=600&q=80', 5, NOW()),
      ('cat_6', 'Sculptures & Installations', 'sculptures-installations', '3D art and sculptures', 'https://images.unsplash.com/photo-1544413660-299165566b1d?w=600&q=80', 6, NOW()),
      ('cat_7', 'Art Merchandise', 'art-merchandise', 'Art-inspired products', 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=600&q=80', 7, NOW()),
      ('cat_8', 'Art Books & Stationery', 'art-books-stationery', 'Books, journals, and art supplies', 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600&q=80', 8, NOW());
  `);
  console.log("✅ Created 8 categories");

  // Create Products
  await client.query(`
    INSERT INTO "Product" (id, "vendorId", "categoryId", title, slug, description, "shortDescription", type, status, price, "compareAtPrice", images, tags, featured, rating, "reviewCount", "stockQuantity", sku, medium, style, "artDimensions", "yearCreated", "isOriginal", "createdAt", "updatedAt")
    VALUES 
      ('prod_1', 'vp_1', 'cat_1', 'Sunset Over Mumbai', 'sunset-over-mumbai',
       'A breathtaking oil painting capturing the golden hour over Mumbai''s iconic skyline.', 'Oil painting of Mumbai sunset', 'PHYSICAL', 'ACTIVE', 15000, 20000,
       ARRAY['https://images.unsplash.com/photo-1573455494060-c5595004fb6c?w=800&q=80'], ARRAY['oil painting', 'mumbai', 'sunset'],
       true, 4.8, 3, 1, 'ART-001', 'Oil on Canvas', 'Impressionism', '24x36 inches', 2025, true, NOW(), NOW()),
      ('prod_2', 'vp_1', 'cat_1', 'Abstract Emotions', 'abstract-emotions',
       'A vibrant abstract painting exploring human emotions through bold color combinations.', 'Abstract acrylic painting', 'PHYSICAL', 'ACTIVE', 12000, NULL,
       ARRAY['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80'], ARRAY['abstract', 'modern', 'acrylic'],
       true, 4.5, 2, 1, 'ART-002', 'Acrylic on Canvas', 'Abstract', '30x30 inches', 2025, true, NOW(), NOW()),
      ('prod_3', 'vp_2', 'cat_4', 'Digital Portrait Pack', 'digital-portrait-pack',
       'A stunning collection of 5 high-resolution digital portraits.', '5 digital portraits', 'DIGITAL', 'ACTIVE', 2500, 3500,
       ARRAY['https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?w=800&q=80'], ARRAY['digital', 'portraits', 'download'],
       true, 4.7, 5, 999, 'DIG-001', NULL, 'Digital Art', NULL, 2025, false, NOW(), NOW()),
      ('prod_4', 'vp_3', 'cat_5', 'Tanjore Krishna', 'tanjore-krishna',
       'An exquisite Tanjore painting of Lord Krishna with 22-carat gold foil work.', 'Traditional Tanjore painting', 'PHYSICAL', 'ACTIVE', 35000, 45000,
       ARRAY['https://images.unsplash.com/photo-1604871000636-074fa5117945?w=800&q=80'], ARRAY['tanjore', 'traditional', 'krishna'],
       true, 5.0, 4, 1, 'TRD-001', 'Gold foil, Semi-precious stones', 'Tanjore', '18x24 inches', 2024, true, NOW(), NOW()),
      ('prod_5', 'vp_2', 'cat_2', 'Mumbai Local Series', 'mumbai-local-series',
       'Set of 4 vibrant art prints depicting Mumbai''s local trains.', 'Set of 4 premium art prints', 'PHYSICAL', 'ACTIVE', 3500, 5000,
       ARRAY['https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=800&q=80'], ARRAY['prints', 'mumbai', 'trains'],
       false, 4.3, 6, 50, 'PRT-001', 'Archival Print', 'Pop Art', '12x16 inches each', 2025, false, NOW(), NOW()),
      ('prod_6', 'vp_1', 'cat_3', 'Hand-Painted Ceramic Vase', 'hand-painted-ceramic-vase',
       'Beautifully hand-painted ceramic vase with Madhubani motifs.', 'Handcrafted ceramic vase', 'PHYSICAL', 'ACTIVE', 4500, NULL,
       ARRAY['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80'], ARRAY['ceramic', 'handcrafted', 'madhubani'],
       false, 4.6, 2, 5, 'HND-001', 'Ceramic', 'Madhubani', '10 inches height', 2025, true, NOW(), NOW()),
      ('prod_7', 'vp_3', 'cat_6', 'Dancing Nataraja Bronze', 'dancing-nataraja-bronze',
       'Bronze sculpture of Lord Nataraja using lost wax technique.', 'Bronze Nataraja sculpture', 'PHYSICAL', 'ACTIVE', 28000, 35000,
       ARRAY['https://images.unsplash.com/photo-1588783898900-7a2db9c60837?w=800&q=80'], ARRAY['bronze', 'sculpture', 'nataraja'],
       true, 4.9, 3, 2, 'SCL-001', 'Bronze', 'Traditional', '12 inches height', 2024, true, NOW(), NOW()),
      ('prod_8', 'vp_2', 'cat_7', 'Art Tote Bag - Warli', 'art-tote-bag-warli',
       'Canvas tote bag featuring authentic Warli art design.', 'Canvas tote with Warli art', 'MERCHANDISE', 'ACTIVE', 899, 1200,
       ARRAY['https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80'], ARRAY['tote bag', 'warli', 'merchandise'],
       false, 4.4, 8, 100, 'MRC-001', 'Canvas', 'Warli', NULL, 2025, false, NOW(), NOW());
  `);
  console.log("✅ Created 8 products");

  // Create Services
  await client.query(`
    INSERT INTO "Service" (id, "vendorId", title, slug, description, type, "basePrice", "deliveryDays", images, "isActive", "createdAt", "updatedAt")
    VALUES 
      ('svc_1', 'vp_1', 'Custom Portrait Painting', 'custom-portrait-painting',
       'Get a personalized oil or acrylic painting portrait from your photo.', 'PORTRAIT', 8000, 14, ARRAY['https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80'], true, NOW(), NOW()),
      ('svc_2', 'vp_2', 'Logo & Brand Design', 'logo-brand-design',
       'Professional logo and brand identity design. Includes 3 concepts.', 'BRANDING', 5000, 7, ARRAY['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80'], true, NOW(), NOW()),
      ('svc_3', 'vp_3', 'Custom Tanjore Painting', 'custom-tanjore-painting',
       'Commission a custom Tanjore painting with real gold foil.', 'CUSTOM', 25000, 30, ARRAY['https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&q=80'], true, NOW(), NOW()),
      ('svc_4', 'vp_1', 'Wall Mural Painting', 'wall-mural-painting',
       'Transform your space with a custom wall mural.', 'MURAL', 15000, 21, ARRAY['https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80'], true, NOW(), NOW()),
      ('svc_5', 'vp_2', 'Book Cover Illustration', 'book-cover-illustration',
       'Custom book cover illustration and design.', 'BOOK_COVER', 7000, 10, ARRAY['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80'], true, NOW(), NOW()),
      ('svc_6', 'vp_3', 'Art Consultancy', 'art-consultancy',
       'Professional art consultancy for interior decoration and collections.', 'CONSULTANCY', 3000, 3, ARRAY['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80'], true, NOW(), NOW());
  `);
  console.log("✅ Created 6 services");

  // Create Orders
  await client.query(`
    INSERT INTO "Order" (id, "orderNumber", "userId", subtotal, "shippingCost", tax, total, status, "paymentStatus", "paymentMethod", "createdAt", "updatedAt")
    VALUES 
      ('ord_1', 'KAL-2025-001', 'usr_cust1', 15000, 0, 2700, 17700, 'DELIVERED', 'PAID', 'razorpay', NOW() - interval '10 days', NOW()),
      ('ord_2', 'KAL-2025-002', 'usr_cust2', 3500, 150, 657, 4307, 'SHIPPED', 'PAID', 'razorpay', NOW() - interval '3 days', NOW()),
      ('ord_3', 'KAL-2025-003', 'usr_cust1', 2500, 0, 450, 2950, 'CONFIRMED', 'PAID', 'upi', NOW() - interval '1 day', NOW());
  `);

  await client.query(`
    INSERT INTO "OrderItem" (id, "orderId", "productId", title, price, quantity, type)
    VALUES 
      ('oi_1', 'ord_1', 'prod_1', 'Sunset Over Mumbai', 15000, 1, 'PHYSICAL'),
      ('oi_2', 'ord_2', 'prod_5', 'Mumbai Local Series', 3500, 1, 'PHYSICAL'),
      ('oi_3', 'ord_3', 'prod_3', 'Digital Portrait Pack', 2500, 1, 'DIGITAL');
  `);
  console.log("✅ Created 3 orders with items");

  // Create Commissions
  await client.query(`
    INSERT INTO "Commission" (id, "customerId", "vendorId", "serviceId", title, description, budget, status, deadline, "createdAt", "updatedAt")
    VALUES 
      ('com_1', 'usr_cust1', 'vp_1', 'svc_1', 'Family Portrait', 'Oil painting portrait of our family of 4.', 12000, 'IN_PROGRESS', NOW() + interval '14 days', NOW() - interval '5 days', NOW()),
      ('com_2', 'usr_cust2', 'vp_2', 'svc_2', 'Startup Logo', 'Modern minimalist logo for tech startup.', 5000, 'ACCEPTED', NOW() + interval '7 days', NOW() - interval '2 days', NOW());
  `);
  console.log("✅ Created 2 commissions");

  // Create Reviews
  await client.query(`
    INSERT INTO "Review" (id, "userId", "productId", rating, title, comment, "isVerified", "createdAt", "updatedAt")
    VALUES 
      ('rev_1', 'usr_cust1', 'prod_1', 5, 'Absolutely Stunning!', 'Colors are even more vibrant in person. Remarkable skill.', true, NOW() - interval '5 days', NOW()),
      ('rev_2', 'usr_cust2', 'prod_4', 5, 'Museum Quality', 'The gold foil work is exquisite. Worth every rupee.', true, NOW() - interval '3 days', NOW()),
      ('rev_3', 'usr_cust1', 'prod_3', 4, 'Great Digital Art', 'Beautiful portraits with amazing detail.', true, NOW() - interval '2 days', NOW()),
      ('rev_4', 'usr_cust2', 'prod_7', 5, 'Masterpiece!', 'The Nataraja sculpture is incredible detail.', true, NOW() - interval '1 day', NOW());
  `);
  console.log("✅ Created 4 reviews");

  await client.end();
  console.log("\n✨ Database seeded successfully!");
  console.log("\n📋 Login credentials:");
  console.log("  Admin:    admin@kalavpp.com / Admin@123");
  console.log("  Vendor:   priya@kalavpp.com / Vendor@123");
  console.log("  Customer: aarti@example.com / Customer@123");
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
