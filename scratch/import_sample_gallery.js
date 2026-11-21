const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const sharp = require('sharp');

const prisma = new PrismaClient();

const SOURCE_DIR = "e:\\mis project\\Pallabi Bidyaniketan\\image\\sampol galary";
const TARGET_DIR = path.join(process.cwd(), "public", "uploads", "gallery");

// Photo classification mapping based on file sets
// We have 37 authentic school Facebook photos
const ALBUM_CATEGORIES = [
  {
    key: "sports",
    slug: "annual-sports-competition",
    titleBn: "বার্ষিক ক্রীড়া প্রতিযোগিতা ও কৃতি শিক্ষার্থী সংবর্ধনা",
    titleEn: "Annual Sports Competition & Student Award Ceremony",
    descriptionBn: "পল্লবী বিদ্যানিকেতনের শিক্ষার্থীদের অংশগ্রহণে প্রাণবন্ত বার্ষিক ক্রীড়া প্রতিযোগিতা, দৌড়, লং জাম্প ও বিজয়ীদের মাঝে পদক বিতরণ।",
    descriptionEn: "Vibrant annual sports competition, races, long jump, and medal distribution among winners at Pallabi Bidyaniketan.",
    category: "Sports",
    files: [
      "622907835_1482204023911330_4085968359533361113_n.jpg",
      "623386697_1482203917244674_8855631261609445030_n.jpg",
      "662644585_1543229637808768_3354893254043817335_n.jpg",
      "663336564_1543229977808734_8625382663725186065_n.jpg",
      "666386897_1543229801142085_7380423549854549479_n.jpg",
      "667839869_1543229447808787_1749557798336785186_n.jpg",
      "667882109_1543229491142116_4407096778055353762_n.jpg",
      "672682839_1554341320030933_3997913443785604068_n.jpg",
      "676216736_1554341226697609_1121611010258737939_n.jpg"
    ]
  },
  {
    key: "cultural",
    slug: "cultural-and-national-days",
    titleBn: "সাংস্কৃতিক উৎসব ও জাতীয় দিবস উদযাপন",
    titleEn: "Cultural Festivals and National Day Observance",
    descriptionBn: "মহান বিজয় দিবস, স্বাধীনতা দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস উপলক্ষে আলোচনা সভা, দেশাত্মবোধক গান ও নাটক পরিবেশনা।",
    descriptionEn: "Observance of National Victory Day, Independence Day, and International Mother Language Day with speeches and patriotic performances.",
    category: "Cultural",
    files: [
      "694647396_1575374597927605_4563259039796506133_n.jpg",
      "696027878_1575374437927621_3137475549908581477_n.jpg",
      "731787815_1620864493378615_5515514092018527857_n.jpg",
      "732026907_1620864410045290_5653285812222818271_n.jpg",
      "733095692_1620864263378638_3567751887375597051_n.jpg",
      "734253384_1620864373378627_6908315452038991885_n.jpg",
      "748026284_1638996061565458_6965863069392510001_n.jpg",
      "748096934_1638996211565443_711591256287444995_n.jpg"
    ]
  },
  {
    key: "campus_assembly",
    slug: "school-campus-and-assembly",
    titleBn: "বিদ্যালয় প্রাঙ্গণ, প্রাত্যহিক সমাবেশ ও শ্রেণিকক্ষ",
    titleEn: "School Campus, Morning Assembly and Classrooms",
    descriptionBn: "পল্লবী বিদ্যানিকেতনের সুশৃঙ্খল প্রাত্যহিক সমাবেশ, জাতীয় সংগীত পরিবেশন এবং মনোরম শ্রেণিকক্ষের শিক্ষণ পরিবেশ।",
    descriptionEn: "Disciplined morning assembly, national anthem, and learning atmosphere at Pallabi Bidyaniketan.",
    category: "Campus",
    files: [
      "763824648_1658433929621671_8378743633830233160_n.jpg",
      "763908107_1658434162954981_5415987940677535050_n.jpg",
      "763925857_1657433773055020_8159142545789752856_n.jpg",
      "764863150_1658433346288396_4715318963967887_n.jpg",
      "764938218_1658433209621743_3894721098682329230_n.jpg",
      "765849308_1658434206288310_704355830458960601_n.jpg",
      "766106998_1658434082954989_7561230470711404020_n.jpg",
      "784618446_1679123460886051_6714908402695594315_n.jpg",
      "786442475_1679123387552725_1527267749557324726_n.jpg",
      "786562258_1679122974219433_62543551424399515_n.jpg"
    ]
  },
  {
    key: "academic_events",
    slug: "academic-events-and-recognition",
    titleBn: "একাডেমিক কার্যক্রম, বিজ্ঞান প্রদর্শনী ও কৃতি সমাবেশ",
    titleEn: "Academic Activities, Science Exhibits & Student Recognition",
    descriptionBn: "শিক্ষার্থীদের সৃজনশীলতা বিকাশ, বিজ্ঞান ও গণিত প্রদর্শনী এবং কৃতি শিক্ষার্থীদের পুরস্কার ও উৎসাহ প্রদান।",
    descriptionEn: "Fostering students' creativity, science & math exhibitions, and student achievements recognition.",
    category: "Academic",
    files: [
      "787341545_1679123117552752_2529065520680302564_n.jpg",
      "828987387_1717109060420824_5125345103217595082_n.jpg",
      "829453087_1717108947087502_4899983146580945822_n.jpg",
      "829811853_1717107627087634_3601640631231394290_n.jpg",
      "830541575_1717108640420866_4124631621989411263_n.jpg",
      "830883143_1717106547087742_3964210783326818546_n.jpg",
      "832131322_1717108997087497_5659553805589112010_n.jpg",
      "890460341_1759506916181038_1865409935238279086_n.jpg",
      "895364048_1759506966181033_5045431064045632268_n.jpg",
      "896982300_1759506879514375_599281895262939526_n.jpg"
    ]
  }
];

async function main() {
  console.log("=== PALLABI BIDYANIKETAN SAMPLE GALLERY PHOTO PROCESSOR ===");

  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  const user = await prisma.user.findFirst();
  const userId = user ? user.id : undefined;

  const allFiles = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  console.log(`Found ${allFiles.length} original photos in sample gallery folder.`);

  // 1. Copy files and gather metadata
  const processedPhotos = [];
  for (const fileName of allFiles) {
    const srcPath = path.join(SOURCE_DIR, fileName);
    const destPath = path.join(TARGET_DIR, fileName);

    fs.copyFileSync(srcPath, destPath);

    const stats = fs.statSync(destPath);
    let meta = { width: 1200, height: 800 };
    try {
      meta = await sharp(destPath).metadata();
    } catch (e) {
      // ignore
    }

    const publicUrl = `/uploads/gallery/${fileName}`;
    processedPhotos.push({
      fileName,
      publicUrl,
      size: stats.size,
      width: meta.width || 1200,
      height: meta.height || 800,
    });
  }
  console.log(`Successfully copied ${processedPhotos.length} photos to public/uploads/gallery.`);

  // 2. Add or update Media records
  console.log("Upserting Media records into database...");
  for (const photo of processedPhotos) {
    const existing = await prisma.media.findFirst({
      where: { url: photo.publicUrl }
    });

    if (!existing) {
      await prisma.media.create({
        data: {
          filename: photo.fileName,
          originalName: photo.fileName,
          mimeType: "image/jpeg",
          size: photo.size,
          url: photo.publicUrl,
          folder: "gallery",
          category: "School Activity",
          caption: "পল্লবী বিদ্যানিকেতন আলোকচিত্র",
          altText: "Pallabi Bidyaniketan Official Photo",
          verificationStatus: "VERIFIED",
          isPublished: true,
          uploadedById: userId,
        }
      });
    }
  }

  // 3. Create or update Albums and connect Photos
  console.log("Creating/updating Photo Gallery Albums...");
  for (let i = 0; i < ALBUM_CATEGORIES.length; i++) {
    const alb = ALBUM_CATEGORIES[i];
    const albumCover = `/uploads/gallery/${alb.files[0]}`;

    let album = await prisma.galleryAlbum.findUnique({
      where: { slug: alb.slug },
      include: { images: true }
    });

    if (!album) {
      album = await prisma.galleryAlbum.create({
        data: {
          slug: alb.slug,
          titleBn: alb.titleBn,
          titleEn: alb.titleEn,
          descriptionBn: alb.descriptionBn,
          descriptionEn: alb.descriptionEn,
          coverImageUrl: albumCover,
          category: alb.category,
          sortOrder: i + 1,
          status: "PUBLISHED",
          isPublished: true,
          albumDate: new Date("2024-03-01"),
        },
        include: { images: true }
      });
      console.log(`Created Album: ${alb.titleBn}`);
    } else {
      album = await prisma.galleryAlbum.update({
        where: { id: album.id },
        data: {
          titleBn: alb.titleBn,
          titleEn: alb.titleEn,
          descriptionBn: alb.descriptionBn,
          descriptionEn: alb.descriptionEn,
          coverImageUrl: albumCover,
          category: alb.category,
          status: "PUBLISHED",
          isPublished: true,
        },
        include: { images: true }
      });
      console.log(`Updated Album: ${alb.titleBn}`);
    }

    // Attach images to the album
    for (let sortIdx = 0; sortIdx < alb.files.length; sortIdx++) {
      const fName = alb.files[sortIdx];
      const imgUrl = `/uploads/gallery/${fName}`;

      const existsInAlbum = album.images.some(img => img.imageUrl === imgUrl);
      if (!existsInAlbum) {
        await prisma.galleryImage.create({
          data: {
            albumId: album.id,
            imageUrl: imgUrl,
            captionBn: `${alb.titleBn} - আলোকচিত্র ${sortIdx + 1}`,
            captionEn: `${alb.titleEn} - Photo ${sortIdx + 1}`,
            altText: alb.titleBn,
            sortOrder: sortIdx + 1,
            status: "PUBLISHED",
            isPublished: true,
          }
        });
      }
    }
  }

  // 4. Update Homepage Slides with real authentic school photos
  console.log("Updating Homepage Slides with high-res authentic photos...");
  // Clear existing slides and add 3 great ones
  await prisma.homepageSlide.deleteMany({});
  
  const slides = [
    {
      titleBn: "পল্লবী বিদ্যানিকেতন — শিক্ষার আলোয় আলোকিত ভবিষ্যৎ",
      titleEn: "Pallabi Bidyaniketan — Empowering Future with Quality Education",
      subtitleBn: "মিরপুর-৭, ঢাকা | সুশৃঙ্খল পরিবেশ, আধুনিক ক্লাসরুম ও দক্ষ শিক্ষকবৃন্দ (EIIN: 108325)",
      subtitleEn: "Mirpur-7, Dhaka | Disciplined Environment, Modern Classrooms & Dedicated Faculty",
      buttonTextBn: "আমাদের সম্পর্কে জানুন",
      buttonTextEn: "Learn More About Us",
      buttonUrl: "/about",
      imageUrl: "/uploads/gallery/662644585_1543229637808768_3354893254043817335_n.jpg",
      sortOrder: 1,
      isActive: true,
    },
    {
      titleBn: "বার্ষিক ক্রীড়া প্রতিযোগিতা ও সহশিক্ষা কার্যক্রম",
      titleEn: "Annual Sports Competition & Co-curricular Activities",
      subtitleBn: "শিক্ষার্থীদের শারীরিক ও মানসিক বিকাশে নিয়মিত খেলাধুলা ও সাংস্কৃতিক কর্মকাণ্ড",
      subtitleEn: "Regular sports and cultural events for physical & cognitive student growth",
      buttonTextBn: "ফটো গ্যালারি দেখুন",
      buttonTextEn: "View Photo Gallery",
      buttonUrl: "/gallery",
      imageUrl: "/uploads/gallery/623386697_1482203917244674_8855631261609445030_n.jpg",
      sortOrder: 2,
      isActive: true,
    },
    {
      titleBn: "সুশৃঙ্খল ক্যাম্পাস ও প্রাত্যহিক সমাবেশ",
      titleEn: "Disciplined Campus & Morning Assembly",
      subtitleBn: "দেশপ্রেম, নৈতিকতা ও দায়িত্বশীল নাগরিক গড়ার প্রত্যয়ে আমাদের পথচলা",
      subtitleEn: "Committed to fostering patriotism, ethics, and responsible citizenship",
      buttonTextBn: "ভর্তি ও তথ্য",
      buttonTextEn: "Admission & Info",
      buttonUrl: "/academics",
      imageUrl: "/uploads/gallery/763824648_1658433929621671_8378743633830233160_n.jpg",
      sortOrder: 3,
      isActive: true,
    }
  ];

  for (const s of slides) {
    await prisma.homepageSlide.create({ data: s });
  }
  console.log("Created 3 active homepage slides.");

  // 5. Create or update bilingual News/Blog articles with real photos
  console.log("Publishing bilingual news & blog posts with real photographs...");
  
  const newsPosts = [
    {
      slug: "annual-sports-competition-2024",
      category: "Sports",
      coverImageUrl: "/uploads/gallery/622907835_1482204023911330_4085968359533361113_n.jpg",
      publishDate: new Date("2024-02-20"),
      status: "PUBLISHED",
      isPublished: true,
      isFeatured: true,
      translations: {
        bn: {
          title: "পল্লবী বিদ্যানিকেতনের বার্ষিক ক্রীড়া প্রতিযোগিতা ও কৃতি শিক্ষার্থী পুরস্কার বিতরণী অনুষ্ঠিত",
          excerpt: "উৎসবমুখর পরিবেশে অনুষ্ঠিত হলো পল্লবী বিদ্যানিকেতনের বার্ষিক ক্রীড়া প্রতিযোগিতা ও কৃতি শিক্ষার্থীদের সংবর্ধনা।",
          content: `পল্লবী বিদ্যানিকেতন (মিরপুর-৭, ঢাকা) প্রাঙ্গণে অত্যন্ত জাঁকজমকপূর্ণ ও আনন্দঘন পরিবেশে বিদ্যালয়ের বার্ষিক ক্রীড়া প্রতিযোগিতা ও পুরস্কার বিতরণী অনুষ্ঠান সম্পন্ন হয়েছে।

অনুষ্ঠানে শিক্ষার্থীদের বিভিন্ন বয়সভিত্তিক দৌড় প্রতিযোগিতা, লং জাম্প, হাই জাম্প, রিলে রেস ও ঐতিহ্যবাহী যেমন-খুশি-তেমন-সাজো প্রতিযোগিতা অনুষ্ঠিত হয়। শিক্ষার্থীদের শারীরিক সক্ষমতা ও প্রতিযোগিতামূলক মনোভাব বিকাশে শিক্ষক-অভিভাবক ও আমন্ত্রিত অতিথিবৃন্দ উপস্থিত থেকে তাদের উৎসাহিত করেন।

প্রতিযোগিতা শেষে বিজয়ী শিক্ষার্থীদের মাঝে ট্রফি, পদক ও সনদপত্র প্রদান করা হয়। বিদ্যালয় কর্তৃপক্ষ জানান, নিয়মিত খেলাধুলা ও শারীরিক শিক্ষা শিক্ষার্থীদের ভবিষ্যৎ মানসিক একাগ্রতা বৃদ্ধি ও শৃঙ্খলা রক্ষায় গুরুত্বপূর্ণ অবদান রাখে।`,
          metaTitle: "বার্ষিক ক্রীড়া প্রতিযোগিতা | পল্লবী বিদ্যানিকেতন",
          metaDesc: "পল্লবী বিদ্যানিকেতনে অনুষ্ঠিত হলো বার্ষিক ক্রীড়া প্রতিযোগিতা ও কৃতি শিক্ষার্থী সংবর্ধনা।"
        },
        en: {
          title: "Annual Sports Competition & Student Award Ceremony Held at Pallabi Bidyaniketan",
          excerpt: "Pallabi Bidyaniketan celebrated its Annual Sports Competition and Student Recognition with vibrant sportsmanship.",
          content: `The Annual Sports Competition and Prize Giving Ceremony of Pallabi Bidyaniketan (Mirpur-7, Dhaka) was organized with immense enthusiasm, zeal, and festive fervor.

Students from all classes actively participated in track and field events including sprints, long jumps, obstacle courses, and dress-as-you-like competitions. Teachers, guardians, and local dignitaries attended to inspire the participants.

At the concluding session, medals, trophies, and merit certificates were distributed among the winners. The school administration emphasized that sports and co-curricular programs form a vital pillar of balanced institutional development.`,
          metaTitle: "Annual Sports Competition | Pallabi Bidyaniketan",
          metaDesc: "Annual Sports Day and Award Giving Ceremony at Pallabi Bidyaniketan, Mirpur-7, Dhaka."
        }
      }
    },
    {
      slug: "national-days-and-cultural-festival",
      category: "Cultural",
      coverImageUrl: "/uploads/gallery/694647396_1575374597927605_4563259039796506133_n.jpg",
      publishDate: new Date("2024-03-26"),
      status: "PUBLISHED",
      isPublished: true,
      isFeatured: true,
      translations: {
        bn: {
          title: "জাতীয় দিবস উদযাপন ও পল্লবী বিদ্যানিকেতনের শিক্ষার্থীদের সাংস্কৃতিক পরিবেশনা",
          excerpt: "যথাযোগ্য মর্যাদা ও ভাবগাম্ভীর্যের সাথে পালিত হলো জাতীয় দিবস। অনুষ্ঠানে শিক্ষার্থীরা দেশাত্মবোধক গান ও নাটক পরিবেশন করে।",
          content: `পল্লবী বিদ্যানিকেতনে যথাযোগ্য মর্যাদায় জাতীয় দিবস এবং সাংস্কৃতিক উৎসব উদযাপন করা হয়েছে। সূর্যোদয়ের সাথে সাথে জাতীয় পতাকা উত্তোলনের মাধ্যমে দিবসের শুভ সূচনা হয়।

পরবর্তীতে বিদ্যালয়ের অডিটোরিয়ামে মুক্তিযুদ্ধ, ভাষা আন্দোলন এবং দেশপ্রেমের মূল চেতনার ওপর বিশেষ আলোচনা সভা অনুষ্ঠিত হয়। এতে শিক্ষকবৃন্দ মুক্তিযুদ্ধের সঠিক ইতিহাস শিক্ষার্থীদের সামনে উপস্থাপন করেন।

শিক্ষার্থীদের পরিবেশনায় দেশাত্মবোধক গান, আবৃত্তি এবং নাটিকা দর্শকদের মুগ্ধ করে। পল্লবী বিদ্যানিকেতন সবসময় শিক্ষাদানের পাশাপাশি কোমলমতি শিক্ষার্থীদের মাঝে জাতীয় মূল্যবোধ ও সংস্কৃতির চর্চায় অগ্রণী ভূমিকা পালন করে আসছে।`,
          metaTitle: "জাতীয় দিবস উদযাপন | পল্লবী বিদ্যানিকেতন",
          metaDesc: "পল্লবী বিদ্যানিকেতনে জাতীয় দিবস উদযাপন ও মনোজ্ঞ সাংস্কৃতিক অনুষ্ঠান অনুষ্ঠিত।"
        },
        en: {
          title: "Observance of National Day and Cultural Festivities at Pallabi Bidyaniketan",
          excerpt: "National Day was celebrated with solemn dignity and patriotism, followed by cultural recitals by students.",
          content: `Pallabi Bidyaniketan observed the National Day and Cultural Ceremony with reverence and patriotic spirit. The day commenced with the hoisting of the national flag in the morning.

A commemorative discussion session was organized where respected educators highlighted the historic significance of our Liberation War, value of integrity, and civic duty.

Students presented stirring renditions of patriotic songs, poetry recitations, and short dramas reflecting national identity. Pallabi Bidyaniketan remains dedicated to instilling deep cultural awareness and ethical values alongside academic excellence.`,
          metaTitle: "National Day Observance | Pallabi Bidyaniketan",
          metaDesc: "National Day celebrations and student cultural recitals at Pallabi Bidyaniketan, Dhaka."
        }
      }
    }
  ];

  for (const p of newsPosts) {
    const existing = await prisma.news.findUnique({
      where: { slug: p.slug },
      include: { translations: true }
    });

    if (!existing) {
      await prisma.news.create({
        data: {
          slug: p.slug,
          category: p.category,
          coverImageUrl: p.coverImageUrl,
          publishDate: p.publishDate,
          status: "PUBLISHED",
          isPublished: true,
          isFeatured: true,
          createdById: userId,
          translations: {
            create: [
              {
                locale: "bn",
                title: p.translations.bn.title,
                excerpt: p.translations.bn.excerpt,
                content: p.translations.bn.content,
                metaTitle: p.translations.bn.metaTitle,
                metaDesc: p.translations.bn.metaDesc,
              },
              {
                locale: "en",
                title: p.translations.en.title,
                excerpt: p.translations.en.excerpt,
                content: p.translations.en.content,
                metaTitle: p.translations.en.metaTitle,
                metaDesc: p.translations.en.metaDesc,
              }
            ]
          }
        }
      });
      console.log(`Created News Article: ${p.slug}`);
    } else {
      await prisma.news.update({
        where: { id: existing.id },
        data: {
          coverImageUrl: p.coverImageUrl,
          category: p.category,
          status: "PUBLISHED",
          isPublished: true,
          isFeatured: true,
        }
      });
      console.log(`Updated News Article: ${p.slug}`);
    }
  }

  console.log("\n=== PROCESS COMPLETED SUCCESSFULLY ===");
}

main()
  .catch(e => {
    console.error("Error executing script:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
