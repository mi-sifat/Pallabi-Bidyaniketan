import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database for Pallabi Bidyaniketan...");

  // 1. Create or update Super Admin
  const adminEmail = process.env.SUPER_ADMIN_EMAIL || "admin@pallabibidyaniketan.edu.bd";
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD || "Admin@PBN2024!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
    create: {
      email: adminEmail,
      name: "System Administrator",
      nameBn: "সিস্টেম অ্যাডমিনিস্ট্রেটর",
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });
  console.log(`✅ Super Admin created/verified: ${superAdmin.email}`);

  // 2. School Profile (Initial research seed)
  const profile = await prisma.schoolProfile.upsert({
    where: { id: "pbn-main-profile" },
    update: {},
    create: {
      id: "pbn-main-profile",
      nameEn: "Pallabi Bidyaniketan",
      nameBn: "পল্লবী বিদ্যানিকেতন",
      alternateNameEn: "Bangabandhu Bidyaniketan",
      alternateNameBn: "বঙ্গবন্ধু বিদ্যানিকেতন",
      eiin: "108325",
      institutionType: "Non-Government Secondary School",
      educationBoard: "Board of Intermediate and Secondary Education, Dhaka",
      district: "Dhaka",
      area: "Pallabi, Mirpur-7",
      addressEn: "Milk Vita Road, Mirpur-7, Pallabi, Dhaka-1216, Bangladesh",
      addressBn: "মিল্কভিটা রোড, মিরপুর-৭, পল্লবী, ঢাকা-১২১৬, বাংলাদেশ",
      phone: "+8801309108325",
      email: "info@pbn.edu.bd",
      website: "https://www.pbn.edu.bd/",
      establishedDate: "01 January 1977",
      teachingPermissionDate: "11 January 1978",
      recognitionDate: "01 January 1977",
      firstMpoDate: "01 May 2010",
      datesVerified: false,
      nameVerified: false,
      existingWebsiteUrl: "https://www.pbn.edu.bd/",
      debPortalUrl: "https://deb108325.dhakaeducationboard.gov.bd/",
      facebookUrl: "",
      logoUrl: "/uploads/branding/logo.jpg",
      primaryColor: "#1e3a5f",
      secondaryColor: "#ffffff",
      accentColor: "#c9a84c",
      seoTitle: "পল্লবী বিদ্যানিকেতন | Pallabi Bidyaniketan",
      seoDescription: "Official website of Pallabi Bidyaniketan (EIIN: 108325), Mirpur-7, Pallabi, Dhaka.",
    },
  });
  console.log("✅ School profile initialized");

  // 3. Teachers from Dhaka Education Board Manpower Portal + Web Research
  // All seeded strictly with status: PENDING_VERIFICATION and isPublished: false as requested
  const teachersData = [
    { nameEn: "MD. SHAHE ALAM", designationEn: "Headmaster", designationBn: "প্রধান শিক্ষক", order: 1, isFeatured: true },
    { nameEn: "RAJIA SULTANA", designationEn: "Assistant Headmaster", designationBn: "সহকারী প্রধান শিক্ষক", order: 2, isFeatured: true },
    { nameEn: "MD. JASHIM UDDIN", designationEn: "Assistant Teacher", designationBn: "সহকারী শিক্ষক", order: 3 },
    { nameEn: "BIRENDRA BIKRAM BISWAS", designationEn: "Assistant Teacher", designationBn: "সহকারী শিক্ষক", order: 4 },
    { nameEn: "MD. YOUNUS MIA", designationEn: "Assistant Teacher", designationBn: "সহকারী শিক্ষক", order: 5 },
    { nameEn: "MD. ALI ASHRAF", designationEn: "Assistant Teacher", designationBn: "সহকারী শিক্ষক", order: 6 },
    { nameEn: "RAFIQUL ISLAM", designationEn: "Assistant Teacher", designationBn: "সহকারী শিক্ষক", order: 7 },
    { nameEn: "SHAHADAT HOSSAN", designationEn: "Assistant Teacher", designationBn: "সহকারী শিক্ষক", order: 8 },
    { nameEn: "GOLAM MOSTOFA", designationEn: "Assistant Teacher", designationBn: "সহকারী শিক্ষক", order: 9 },
    { nameEn: "HOSNEARA ROSY", designationEn: "Assistant Teacher", designationBn: "সহকারী শিক্ষক", order: 10 },
    { nameEn: "MD. SHAFIQUL ALAM", designationEn: "Assistant Teacher", designationBn: "সহকারী শিক্ষক", order: 11 },
    { nameEn: "MD. RAFIQUL ISLAM", designationEn: "Assistant Teacher", designationBn: "সহকারী শিক্ষক", order: 12 },
    { nameEn: "SHAMSUN NAHAR", designationEn: "Assistant Teacher", designationBn: "সহকারী শিক্ষক", order: 13 },
    { nameEn: "FARHANA AKTER CHOWDHURY", designationEn: "Assistant Teacher", designationBn: "সহকারী শিক্ষক", order: 14 },
    { nameEn: "NIGAR SULTANA", designationEn: "Assistant Teacher", designationBn: "সহকারী শিক্ষক", order: 15 },
    { nameEn: "MD. FARUK HOSSAIN", designationEn: "Assistant Teacher", designationBn: "সহকারী শিক্ষক", order: 16 },
    { nameEn: "MD. RUHUL AMIN", designationEn: "Assistant Teacher", designationBn: "সহকারী শিক্ষক", order: 17 },
    { nameEn: "ASIA KHATUN", designationEn: "Assistant Teacher", designationBn: "সহকারী শিক্ষক", order: 18 },
    { nameEn: "PARVIN AKTER", designationEn: "Senior Teacher", designationBn: "সিনিয়র শিক্ষক", order: 19 },
    { nameEn: "M.A. AL HABIBUR RAHMAN", designationEn: "Assistant Teacher", designationBn: "সহকারী শিক্ষক", order: 20 },
  ];

  for (const t of teachersData) {
    const existing = await prisma.teacher.findFirst({
      where: { nameEn: t.nameEn },
    });
    if (!existing) {
      await prisma.teacher.create({
        data: {
          nameEn: t.nameEn,
          nameBn: t.nameEn, // Default transliteration
          designationEn: t.designationEn,
          designationBn: t.designationBn,
          displayOrder: t.order,
          isFeatured: t.isFeatured ?? false,
          status: "PENDING_VERIFICATION",
          verificationStatus: "PENDING_VERIFICATION",
          isPublished: false,
          sourceReference: "Dhaka Education Board Manpower Portal (EIIN 108325)",
          createdById: superAdmin.id,
        },
      });
    }
  }
  console.log(`✅ Seeded ${teachersData.length} teacher records (Pending Verification)`);

  // 4. Academic Classes (Play - 10, marked inactive pending confirmation)
  const classesData = [
    { nameEn: "Class 6", nameBn: "ষষ্ঠ শ্রেণি", level: 6, sortOrder: 6 },
    { nameEn: "Class 7", nameBn: "সপ্তম শ্রেণি", level: 7, sortOrder: 7 },
    { nameEn: "Class 8", nameBn: "অষ্টম শ্রেণি", level: 8, sortOrder: 8 },
    { nameEn: "Class 9", nameBn: "নবম শ্রেণি", level: 9, sortOrder: 9 },
    { nameEn: "Class 10", nameBn: "দশম শ্রেণি", level: 10, sortOrder: 10 },
  ];

  for (const c of classesData) {
    const existing = await prisma.academicClass.findFirst({
      where: { nameEn: c.nameEn },
    });
    if (!existing) {
      await prisma.academicClass.create({
        data: {
          nameEn: c.nameEn,
          nameBn: c.nameBn,
          level: c.level,
          sortOrder: c.sortOrder,
          isActive: false, // Pending school confirmation
        },
      });
    }
  }
  console.log("✅ Seeded academic classes (Pending verification)");

  // 5. Initial Verification Records
  const initialMigrations = [
    {
      sourceWebsite: "https://deb108325.dhakaeducationboard.gov.bd/",
      contentType: "manpower_records",
      contentTitle: "Dhaka Education Board Manpower Data (18 Staff)",
      status: "IMPORTED" as const,
      verificationStatus: "PENDING_VERIFICATION" as const,
      adminNotes: "Extracted 18 officially listed teachers from BISE Dhaka portal. Required verification with school administration.",
    },
    {
      sourceWebsite: "https://www.pbn.edu.bd/",
      contentType: "institutional_profile",
      contentTitle: "Legacy School Website Profile",
      status: "IMPORTED" as const,
      verificationStatus: "PENDING_VERIFICATION" as const,
      adminNotes: "Established date 1977, first MPO 2010. Need confirmation from Headmaster.",
    },
  ];

  for (const m of initialMigrations) {
    await prisma.migrationRecord.create({
      data: m,
    });
  }
  console.log("✅ Seeded migration tracking records");

  console.log("🎉 Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
