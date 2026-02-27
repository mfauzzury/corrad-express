import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin12345";
  const adminName = process.env.ADMIN_NAME ?? "Administrator";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: adminName, passwordHash },
    create: { email: adminEmail, name: adminName, passwordHash },
  });

  const defaultSettings: Array<{ key: string; value: string }> = [
    { key: "siteTitle", value: "CORRAD+ UI" },
    { key: "tagline", value: "Design system and admin standards." },
    { key: "titleFormat", value: "%page% | %site%" },
    { key: "metaDescription", value: "Internal UI standard and admin toolkit." },
    { key: "siteIconUrl", value: "" },
    { key: "faviconUrl", value: "" },
    { key: "language", value: "en" },
    { key: "timezone", value: "UTC" },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log(`Seeded admin user: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
