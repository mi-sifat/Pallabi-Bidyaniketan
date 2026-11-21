const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const targetUrl = "/uploads/popup/1795245851746-15355717.jpg";
  const [teachers, slides, popups, events, albums, galleryImages, news] = await Promise.all([
    prisma.teacher.count({ where: { photoUrl: targetUrl } }),
    prisma.homepageSlide.count({ where: { imageUrl: targetUrl } }),
    prisma.announcementPopup.count({ where: { imageUrl: targetUrl } }),
    prisma.schoolEvent.count({ where: { coverImageUrl: targetUrl } }),
    prisma.galleryAlbum.count({ where: { coverImageUrl: targetUrl } }),
    prisma.galleryImage.count({ where: { imageUrl: targetUrl } }),
    prisma.news.count({ where: { coverImageUrl: targetUrl } }),
  ]);
  console.log("Usage of popup image:", { teachers, slides, popups, events, albums, galleryImages, news });
}
main().finally(() => prisma.$disconnect());
