import { PrismaClient, Role } from "@prisma/client";
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

  const hashedPassword = await bcrypt.hash("12345678", 12);
  const admin = await prisma.user.upsert({
    where: { email: "tranquocbao@mdindustrial.vn" },
    update: {},
    create: {
      email: "tranquocbao@mdindustrial.vn",
      password: hashedPassword,
      name: "Trần Quốc Bảo",
      phone: "0909123456",
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Admin created: ${admin.email} (password: 12345678)`);

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "bang-tai" },
      update: {},
      create: {
        name: "Băng Tải",
        slug: "bang-tai",
        description: "Các loại băng tải công nghiệp chất lượng cao",
      },
    }),
    prisma.category.upsert({
      where: { slug: "bac-dan" },
      update: {},
      create: {
        name: "Bạc Đạn",
        slug: "bac-dan",
        description: "Bạc đạn các loại cho máy móc công nghiệp",
      },
    }),
    prisma.category.upsert({
      where: { slug: "day-curoa" },
      update: {},
      create: {
        name: "Dây Curoa",
        slug: "day-curoa",
        description: "Dây curoa công nghiệp các loại",
      },
    }),
    prisma.category.upsert({
      where: { slug: "phu-tung-may" },
      update: {},
      create: {
        name: "Phụ Tùng Máy",
        slug: "phu-tung-may",
        description: "Phụ tùng thay thế cho máy móc công nghiệp",
      },
    }),
  ]);
  console.log(`✅ Created ${categories.length} categories`);

  const products = [
    {
      name: "Băng Tải Cao Su PVC",
      slug: "bang-tai-cao-su-pvc",
      description:
        "Băng tải cao su PVC chất lượng cao, chịu mài mòn tốt, phù hợp cho các nhà máy sản xuất. Bề mặt PVC chống trượt, dễ vệ sinh.",
      price: 2500000,
      stock: 50,
      featured: true,
      categoryId: categories[0].id,
      createdById: admin.id,
      specifications: { material: "PVC + Cao su", width: "500mm", length: "10m" },
    },
    {
      name: "Băng Tải Lưới Inox",
      slug: "bang-tai-luoi-inox",
      description:
        "Băng tải lưới inox chịu nhiệt, chống oxy hóa, dùng trong thực phẩm và dược phẩm. Thiết kế thoáng khí, phù hợp sấy, nướng.",
      price: 4500000,
      stock: 30,
      featured: true,
      categoryId: categories[0].id,
      createdById: admin.id,
      specifications: { material: "Inox 304", width: "600mm", length: "5m" },
    },
    {
      name: "Bạc Đạn SKF 6205-2Z",
      slug: "bac-dan-skf-6205",
      description:
        "Bạc đạn SKF 6205-2Z chính hãng, đường kính trong 25mm, đường kính ngoài 52mm, dày 15mm. Hai lớp seal chống bụi.",
      price: 185000,
      stock: 200,
      featured: true,
      categoryId: categories[1].id,
      createdById: admin.id,
      specifications: { brand: "SKF", d: "25mm", D: "52mm", B: "15mm" },
    },
    {
      name: "Bạc Đạn NSK 6208",
      slug: "bac-dan-nsk-6208",
      description:
        "Bạc đạn NSK 6208 chất lượng Nhật Bản, đường kính trong 40mm, đường kính ngoài 80mm, dày 18mm. Độ chính xác cao.",
      price: 320000,
      stock: 150,
      featured: false,
      categoryId: categories[1].id,
      createdById: admin.id,
      specifications: { brand: "NSK", d: "40mm", D: "80mm", B: "18mm" },
    },
    {
      name: "Dây Curoa Gates 5M-450",
      slug: "day-curoa-gates-5m-450",
      description:
        "Dây curoa Gates 5M-450, dài 450mm, 5 rãnh, chịu lực tốt, bền bỉ trong môi trường công nghiệp. Công nghệ EPDM chống nứt.",
      price: 450000,
      stock: 100,
      featured: true,
      categoryId: categories[2].id,
      createdById: admin.id,
      specifications: { brand: "Gates", pitch: "5M", length: "450mm", ribs: "5" },
    },
    {
      name: "Dây Curoa Mitsuboshi 3M-300",
      slug: "day-curoa-mitsuboshi-3m-300",
      description:
        "Dây curoa Mitsuboshi 3M-300, dài 300mm, 3 rãnh, chất lượng Nhật Bản. Tuổi thọ cao, ít tiếng ồn.",
      price: 280000,
      stock: 80,
      featured: false,
      categoryId: categories[2].id,
      createdById: admin.id,
      specifications: { brand: "Mitsuboshi", pitch: "3M", length: "300mm", ribs: "3" },
    },
    {
      name: "Con Lăn Băng Tải",
      slug: "con-lan-bang-tai",
      description:
        "Con lăn băng tải đường kính 50mm, chiều dài 500mm, chất liệu thép mạ kẽm. Chịu tải tốt, xoay trơn, dễ thay thế.",
      price: 380000,
      stock: 60,
      featured: false,
      categoryId: categories[3].id,
      createdById: admin.id,
      specifications: { diameter: "50mm", length: "500mm", material: "Thép mạ kẽm" },
    },
    {
      name: "Puli Căng Curoa Điều Chỉnh",
      slug: "puli-cang-curoa",
      description:
        "Puli căng curoa điều chỉnh được, phù hợp với nhiều loại dây curoa. Thiết kế chắc chắn, dễ lắp đặt và điều chỉnh.",
      price: 520000,
      stock: 40,
      featured: false,
      categoryId: categories[3].id,
      createdById: admin.id,
      specifications: { type: "Tensioner", adjustment: "Manual", material: "Thép" },
    },
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    });
  }
  console.log(`✅ Created ${products.length} products`);

  console.log("\n🎉 Seeding completed!");
  console.log("   Admin login: tranquocbao@mdindustrial.vn / 12345678");
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
