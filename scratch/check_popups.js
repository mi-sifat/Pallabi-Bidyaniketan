const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const popups = await prisma.announcementPopup.findMany();
  console.log("Announcement Popups in DB:", JSON.stringify(popups, null, 2));
}
main().finally(() => prisma.$disconnect());
