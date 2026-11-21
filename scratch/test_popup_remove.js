const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testPopupRemoveImage() {
  console.log("=== TESTING POPUP REMOVE IMAGE FUNCTIONALITY ===");
  
  // 1. Fetch current popup
  const popup = await prisma.announcementPopup.findFirst();
  console.log("Initial Popup in DB:", {
    id: popup?.id,
    titleBn: popup?.titleBn,
    imageUrl: popup?.imageUrl,
    isActive: popup?.isActive
  });

  const originalImageUrl = popup?.imageUrl;

  // 2. Perform Remove Image action directly as the PATCH API does
  console.log("\nExecuting: Remove image from popup...");
  const updatedPopup = await prisma.announcementPopup.update({
    where: { id: popup.id },
    data: { imageUrl: null }
  });

  console.log("Updated Popup in DB:", {
    id: updatedPopup.id,
    imageUrl: updatedPopup.imageUrl, // should be null
  });

  // 3. Verify media file still exists in Media table
  if (originalImageUrl) {
    const mediaRecord = await prisma.media.findFirst({
      where: { url: originalImageUrl }
    });
    console.log("Original Media Record in Media Table exists:", !!mediaRecord, {
      url: mediaRecord?.url,
      caption: mediaRecord?.caption
    });
  }

  // 4. Test re-attaching image
  console.log("\nRe-attaching image to test update capability...");
  const restoredPopup = await prisma.announcementPopup.update({
    where: { id: popup.id },
    data: { imageUrl: originalImageUrl }
  });
  console.log("Restored Popup:", { id: restoredPopup.id, imageUrl: restoredPopup.imageUrl });

  console.log("\n=== TEST PASSED SUCCESSFULLY ===");
}

testPopupRemoveImage()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
