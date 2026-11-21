const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const media = await prisma.media.findFirst({
    where: { url: "/uploads/popup/1795245851746-15355717.jpg" }
  });
  console.log("Media in DB:", media);
}
main().finally(() => prisma.$disconnect());
