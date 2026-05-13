import { PrismaClient, UserRole, ContentStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log("🌱 Seeding database...");

  const adminUsername = process.env.ADMIN_USERNAME ?? "tranquocbao";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "12345678";
  const adminName = process.env.ADMIN_NAME ?? "Trần Quốc Bảo";
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@mdindustrial.local";

  console.log(`   Admin: ${adminUsername} / ${adminEmail}`);

  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.user.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: UserRole.ADMIN,
      status: "ACTIVE",
    },
  });
  console.log(`✅ Admin created: ${admin.username} (password from env)`);

  // Sample categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "bang-tai" },
      update: {},
      create: {
        name: "Băng Tải",
        slug: "bang-tai",
        description: "Các loại băng tải công nghiệp chất lượng cao",
        status: ContentStatus.ACTIVE,
      },
    }),
    prisma.category.upsert({
      where: { slug: "bac-dan" },
      update: {},
      create: {
        name: "Bạc Đạn",
        slug: "bac-dan",
        description: "Bạc đạn các loại cho máy móc công nghiệp",
        status: ContentStatus.ACTIVE,
      },
    }),
    prisma.category.upsert({
      where: { slug: "day-curoa" },
      update: {},
      create: {
        name: "Dây Curoa",
        slug: "day-curoa",
        description: "Dây curoa công nghiệp các loại",
        status: ContentStatus.ACTIVE,
      },
    }),
    prisma.category.upsert({
      where: { slug: "phu-tung-may" },
      update: {},
      create: {
        name: "Phụ Tùng Máy",
        slug: "phu-tung-may",
        description: "Phụ tùng thay thế cho máy móc công nghiệp",
        status: ContentStatus.ACTIVE,
      },
    }),
  ]);
  console.log(`✅ Created ${categories.length} categories`);

  // Sample products
  const products = [
    {
      name: "Băng Tải Cao Su PVC",
      slug: "bang-tai-cao-su-pvc",
      description: "Băng tải cao su PVC chất lượng cao, chịu mài mòn tốt.",
      price: 2500000,
      stock: 50,
      featured: true,
      status: ContentStatus.ACTIVE,
      categoryId: categories[0].id,
      createdById: admin.id,
      specifications: { material: "PVC + Cao su", width: "500mm", length: "10m" },
    },
    {
      name: "Băng Tải Lưới Inox",
      slug: "bang-tai-luoi-inox",
      description: "Băng tải lưới inox chịu nhiệt, chống oxy hóa.",
      price: 4500000,
      stock: 30,
      featured: true,
      status: ContentStatus.ACTIVE,
      categoryId: categories[0].id,
      createdById: admin.id,
      specifications: { material: "Inox 304", width: "600mm" },
    },
    {
      name: "Bạc Đạn SKF 6205-2Z",
      slug: "bac-dan-skf-6205",
      description: "Bạc đạn SKF 6205-2Z chính hãng, d=25mm, D=52mm.",
      price: 185000,
      stock: 200,
      featured: true,
      status: ContentStatus.ACTIVE,
      categoryId: categories[1].id,
      createdById: admin.id,
      specifications: { brand: "SKF", d: "25mm", D: "52mm", B: "15mm" },
    },
    {
      name: "Bạc Đạn NSK 6208",
      slug: "bac-dan-nsk-6208",
      description: "Bạc đạn NSK 6208, d=40mm, D=80mm. Chất lượng Nhật Bản.",
      price: 320000,
      stock: 150,
      featured: false,
      status: ContentStatus.ACTIVE,
      categoryId: categories[1].id,
      createdById: admin.id,
      specifications: { brand: "NSK", d: "40mm", D: "80mm", B: "18mm" },
    },
    {
      name: "Dây Curoa Gates 5M-450",
      slug: "day-curoa-gates-5m-450",
      description: "Dây curoa Gates 5M-450, dài 450mm, 5 rãnh.",
      price: 450000,
      stock: 100,
      featured: true,
      status: ContentStatus.ACTIVE,
      categoryId: categories[2].id,
      createdById: admin.id,
      specifications: { brand: "Gates", pitch: "5M", length: "450mm", ribs: "5" },
    },
    {
      name: "Dây Curoa Mitsuboshi 3M-300",
      slug: "day-curoa-mitsuboshi-3m-300",
      description: "Dây curoa Mitsuboshi 3M-300, dài 300mm, 3 rãnh.",
      price: 280000,
      stock: 80,
      featured: false,
      status: ContentStatus.ACTIVE,
      categoryId: categories[2].id,
      createdById: admin.id,
      specifications: { brand: "Mitsuboshi", pitch: "3M", length: "300mm", ribs: "3" },
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }
  console.log(`✅ Created ${products.length} products`);

  // Sample post
  await prisma.post.upsert({
    where: { slug: "gioi-thieu-md-industrial" },
    update: {},
    create: {
      title: "Giới thiệu MD Industrial",
      slug: "gioi-thieu-md-industrial",
      excerpt: "Với hơn 10 năm kinh nghiệm, MD Industrial là đối tác tin cậy trong ngành công nghiệp cơ khí.",
      content: "<p>MD Industrial tự hào là đơn vị cung cấp các sản phẩm băng tải, bạc đạn và dây curoa hàng đầu tại Việt Nam.</p>",
      status: ContentStatus.ACTIVE,
    },
  });
  console.log("✅ Created sample post");

  console.log("\n🎉 Seeding completed!");
  console.log(`   Admin: ${adminUsername} / [password from ADMIN_PASSWORD env]`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
