"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Clock,
  Download,
  Users,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";

export interface AcademicClassData {
  id: string;
  level: number | null;
  nameBn?: string | null;
  nameEn: string;
  sortOrder: number;
  isActive: boolean;
}

// Preset details, subjects, and routine for each grade level
const classDetailsMap: Record<
  number,
  {
    banner: string;
    shift: string;
    descriptionBn: string;
    subjects: Array<{ code: string; nameBn: string; nameEn: string; type: string; marks: number }>;
    groups?: Array<{
      nameBn: string;
      nameEn: string;
      subjects: Array<{ code: string; nameBn: string; nameEn: string; type: string; marks: number }>;
    }>;
    routine: Array<{ period: string; time: string; subjectBn: string }>;
  }
> = {
  0: {
    banner: "/uploads/gallery/663336564_1543229977808734_8625382663725186065_n.jpg",
    shift: "প্রভাতি শাখা (সকাল ৮:৩০ - ১১:৩০)",
    descriptionBn: "খেলার ছলে আনন্দদায়ক পরিবেশে প্রাক-প্রাথমিক শিশুদের বর্ণমালা, সংখ্যা পরিচিতি ও ছড়া গান শেখানো হয়।",
    subjects: [
      { code: "PP-101", nameBn: "আমার বাংলা বই ও ছড়া", nameEn: "Bangla & Rhymes", type: "আবশ্যিক", marks: 100 },
      { code: "PP-102", nameBn: "মজার ইংরেজি ও বর্ণমালা", nameEn: "Fun English", type: "আবশ্যিক", marks: 100 },
      { code: "PP-103", nameBn: "গণিত ও সংখ্যা গণনা", nameEn: "Early Math & Counting", type: "আবশ্যিক", marks: 100 },
      { code: "PP-104", nameBn: "চিত্রাঙ্কন ও চারুকারু", nameEn: "Drawing & Art", type: "সহশিক্ষা", marks: 50 },
    ],
    routine: [
      { period: "১ম পিরিয়ড", time: "০৮:৩০ - ০৯:১০", subjectBn: "বাংলা ও বর্ণমালা চর্চা" },
      { period: "২য় পিরিয়ড", time: "০৯:১০ - ০৯:৫০", subjectBn: "ইংরেজি ও ছড়া গান" },
      { period: "টিফিন বিরতি", time: "০৯:৫০ - ১০:১০", subjectBn: "পুষ্টিকর টিফিন ও বিনোদন" },
      { period: "৩য় পিরিয়ড", time: "১০:১০ - ১০:৫০", subjectBn: "মজার গণিত ও গণনা" },
      { period: "৪র্থ পিরিয়ড", time: "১০:৫০ - ১১:৩০", subjectBn: "চিত্রাঙ্কন ও হাতের কাজ" },
    ],
  },
  1: {
    banner: "/uploads/gallery/667839869_1543229447808787_1749557798336785186_n.jpg",
    shift: "প্রভাতি শাখা (সকাল ৮:০০ - ১২:০০)",
    descriptionBn: "জাতীয় শিক্ষাক্রমের আলোকে ১ম শ্রেণির শিক্ষার্থীদের পঠন, লিখন ও গাণিতিক বুনিয়াদি দক্ষতা গঠন।",
    subjects: [
      { code: "101", nameBn: "আমার বাংলা বই", nameEn: "Bangla", type: "আবশ্যিক", marks: 100 },
      { code: "102", nameBn: "English for Today", nameEn: "English", type: "আবশ্যিক", marks: 100 },
      { code: "103", nameBn: "প্রাথমিক গণিত", nameEn: "Elementary Mathematics", type: "আবশ্যিক", marks: 100 },
      { code: "104", nameBn: "চারু ও কারুকলা", nameEn: "Art & Crafts", type: "মূল্যায়ন", marks: 50 },
    ],
    routine: [
      { period: "১ম পিরিয়ড", time: "০৮:০০ - ০৮:৪৫", subjectBn: "বাংলা" },
      { period: "২য় পিরিয়ড", time: "০৮:৪৫ - ০৯:৩০", subjectBn: "ইংরেজি" },
      { period: "৩য় পিরিয়ড", time: "০৯:৩০ - ১০:১৫", subjectBn: "গণিত" },
      { period: "টিফিন", time: "১০:১৫ - ১০:৪০", subjectBn: "টিফিন ও খেলাধুলা" },
      { period: "৪র্থ পিরিয়ড", time: "১০:৪০ - ১১:২০", subjectBn: "চারু ও কারুকলা" },
      { period: "৫ম পিরিয়ড", time: "১১:২০ - ১২:০০", subjectBn: "নৈতিক শিক্ষা ও স্বাস্থ্য সুরক্ষা" },
    ],
  },
  2: {
    banner: "/uploads/gallery/667882109_1543229491142116_4407096778055353762_n.jpg",
    shift: "প্রভাতি শাখা (সকাল ৮:০০ - ১২:০০)",
    descriptionBn: "২য় শ্রেণির শিক্ষার্থীদের ভাষা দক্ষতা বৃদ্ধি, সাধারণ জ্ঞান ও প্রাথমিক বিজ্ঞান সচেতনতা সৃষ্টি।",
    subjects: [
      { code: "201", nameBn: "আমার বাংলা বই", nameEn: "Bangla", type: "আবশ্যিক", marks: 100 },
      { code: "202", nameBn: "English for Today", nameEn: "English", type: "আবশ্যিক", marks: 100 },
      { code: "203", nameBn: "প্রাথমিক গণিত", nameEn: "Elementary Mathematics", type: "আবশ্যিক", marks: 100 },
      { code: "204", nameBn: "চারু ও কারুকলা ও সঙ্গীত", nameEn: "Arts & Music", type: "মূল্যায়ন", marks: 50 },
    ],
    routine: [
      { period: "১ম পিরিয়ড", time: "০৮:০০ - ০৮:৪৫", subjectBn: "বাংলা" },
      { period: "২য় পিরিয়ড", time: "০৮:৪৫ - ০৯:৩০", subjectBn: "গণিত" },
      { period: "৩য় পিরিয়ড", time: "০৯:৩০ - ১০:১৫", subjectBn: "ইংরেজি" },
      { period: "টিফিন", time: "১০:১৫ - ১০:৪০", subjectBn: "টিফিন বিরতি" },
      { period: "৪র্থ পিরিয়ড", time: "১০:৪০ - ১১:২০", subjectBn: "পরিবেশ ও স্বাস্থ্য সুরক্ষা" },
      { period: "৫ম পিরিয়ড", time: "১১:২০ - ১২:০০", subjectBn: "চারু ও কারুকলা" },
    ],
  },
  3: {
    banner: "/uploads/gallery/672682839_1554341320030933_3997913443785604068_n.jpg",
    shift: "দিবা শাখা (সকাল ১১:৩০ - ০৪:০০)",
    descriptionBn: "৩য় শ্রেণিতে প্রাথমিক বিজ্ঞান এবং বাংলাদেশ ও বিশ্বপরিচয়ের মতো গুরুত্বপূর্ণ বিষয়াবলি অন্তর্ভুক্ত।",
    subjects: [
      { code: "301", nameBn: "বাংলা", nameEn: "Bangla", type: "আবশ্যিক", marks: 100 },
      { code: "302", nameBn: "ইংরেজি", nameEn: "English", type: "আবশ্যিক", marks: 100 },
      { code: "303", nameBn: "প্রাথমিক গণিত", nameEn: "Mathematics", type: "আবশ্যিক", marks: 100 },
      { code: "304", nameBn: "প্রাথমিক বিজ্ঞান", nameEn: "Elementary Science", type: "আবশ্যিক", marks: 100 },
      { code: "305", nameBn: "বাংলাদেশ ও বিশ্বপরিচয়", nameEn: "Bangladesh & Global Studies", type: "আবশ্যিক", marks: 100 },
      { code: "306", nameBn: "ধর্ম ও নৈতিক শিক্ষা", nameEn: "Religion & Moral Education", type: "আবশ্যিক", marks: 100 },
    ],
    routine: [
      { period: "১ম পিরিয়ড", time: "১১:৩০ - ১২:১৫", subjectBn: "বাংলা" },
      { period: "২য় পিরিয়ড", time: "১২:১৫ - ০১:০০", subjectBn: "গণিত" },
      { period: "৩য় পিরিয়ড", time: "০১:০০ - ০১:৪৫", subjectBn: "ইংরেজি" },
      { period: "টিফিন ও নামাজ", time: "০১:৪৫ - ০২:১৫", subjectBn: "নামাজ ও টিফিন বিরতি" },
      { period: "৪র্থ পিরিয়ড", time: "০২:১৫ - ০৩:০০", subjectBn: "প্রাথমিক বিজ্ঞান" },
      { period: "৫ম পিরিয়ড", time: "০৩:০০ - ০৩:৪৫", subjectBn: "বাংলাদেশ ও বিশ্বপরিচয়" },
    ],
  },
  4: {
    banner: "/uploads/gallery/676216736_1554341226697609_1121611010258737939_n.jpg",
    shift: "দিবা শাখা (সকাল ১১:৩০ - ০৪:১৫)",
    descriptionBn: "৪র্থ শ্রেণির শিক্ষার্থীদের বিষয়ভিত্তিক গভীরতা তৈরি ও নিয়মিত ধারাবাহিক মূল্যায়ন অনুশীলন।",
    subjects: [
      { code: "401", nameBn: "বাংলা", nameEn: "Bangla", type: "আবশ্যিক", marks: 100 },
      { code: "402", nameBn: "ইংরেজি", nameEn: "English", type: "আবশ্যিক", marks: 100 },
      { code: "403", nameBn: "গণিত", nameEn: "Mathematics", type: "আবশ্যিক", marks: 100 },
      { code: "404", nameBn: "বিজ্ঞান", nameEn: "Science", type: "আবশ্যিক", marks: 100 },
      { code: "405", nameBn: "বাংলাদেশ ও বিশ্বপরিচয়", nameEn: "BGS", type: "আবশ্যিক", marks: 100 },
      { code: "406", nameBn: "ধর্ম ও নৈতিক শিক্ষা", nameEn: "Moral Education", type: "আবশ্যিক", marks: 100 },
    ],
    routine: [
      { period: "১ম পিরিয়ড", time: "১১:৩০ - ১২:১৫", subjectBn: "ইংরেজি" },
      { period: "২য় পিরিয়ড", time: "১২:১৫ - ০১:০০", subjectBn: "গণিত" },
      { period: "৩য় পিরিয়ড", time: "০১:০০ - ০১:৪৫", subjectBn: "বাংলা" },
      { period: "টিফিন", time: "০১:৪৫ - ০২:১৫", subjectBn: "যোহরের নামাজ ও টিফিন" },
      { period: "৪র্থ পিরিয়ড", time: "০২:১৫ - ০৩:০০", subjectBn: "বিজ্ঞান" },
      { period: "৫ম পিরিয়ড", time: "০৩:০০ - ০৩:৪৫", subjectBn: "ধর্ম ও নৈতিক শিক্ষা" },
    ],
  },
  5: {
    banner: "/uploads/gallery/694647396_1575374597927605_4563259039796506133_n.jpg",
    shift: "দিবা শাখা (সকাল ১১:৩০ - ০৪:৩০)",
    descriptionBn: "প্রাথমিক সমাপনী পর্যায়ের প্রস্তুতি, গাণিতিক যুক্তি ও সৃজনশীল মেধার পূর্ণ বিকাশ সাধন।",
    subjects: [
      { code: "501", nameBn: "বাংলা", nameEn: "Bangla", type: "আবশ্যিক", marks: 100 },
      { code: "502", nameBn: "ইংরেজি", nameEn: "English", type: "আবশ্যিক", marks: 100 },
      { code: "503", nameBn: "প্রাথমিক গণিত", nameEn: "Mathematics", type: "আবশ্যিক", marks: 100 },
      { code: "504", nameBn: "প্রাথমিক বিজ্ঞান", nameEn: "Science", type: "আবশ্যিক", marks: 100 },
      { code: "505", nameBn: "বাংলাদেশ ও বিশ্বপরিচয়", nameEn: "BGS", type: "আবশ্যিক", marks: 100 },
      { code: "506", nameBn: "ধর্ম ও নৈতিক শিক্ষা", nameEn: "Moral Studies", type: "আবশ্যিক", marks: 100 },
    ],
    routine: [
      { period: "১ম পিরিয়ড", time: "১১:৩০ - ১২:১৫", subjectBn: "গণিত স্পেশাল" },
      { period: "২য় পিরিয়ড", time: "১২:১৫ - ০১:০০", subjectBn: "ইংরেজি গ্রামার ও রাইটিং" },
      { period: "৩য় পিরিয়ড", time: "০১:০০ - ০১:৪৫", subjectBn: "বাংলা" },
      { period: "টিফিন", time: "০১:৪৫ - ০২:২০", subjectBn: "বিরতি ও নামাজ" },
      { period: "৪র্থ পিরিয়ড", time: "০২:২০ - ০৩:১০", subjectBn: "বিজ্ঞান ল্যাব ও থিওরি" },
      { period: "৫ম পিরিয়ড", time: "০৩:১০ - ০৪:০০", subjectBn: "বাংলাদেশ ও বিশ্বপরিচয়" },
    ],
  },
  6: {
    banner: "/uploads/gallery/731787815_1620864493378615_5515514092018527857_n.jpg",
    shift: "মাধ্যমিক শাখা (সকাল ১০:০০ - ০৪:০০)",
    descriptionBn: "নতুন জাতীয় শিক্ষাক্রম অনুসারে ষষ্ঠ শ্রেণির সেশনভিত্তিক ও অভিজ্ঞতাধর্মী পাঠদান কার্যক্রম।",
    subjects: [
      { code: "601", nameBn: "বাংলা", nameEn: "Bangla", type: "আবশ্যিক", marks: 100 },
      { code: "602", nameBn: "ইংরেজি", nameEn: "English", type: "আবশ্যিক", marks: 100 },
      { code: "603", nameBn: "গণিত", nameEn: "Mathematics", type: "আবশ্যিক", marks: 100 },
      { code: "604", nameBn: "বিজ্ঞান", nameEn: "Science", type: "অনুসন্ধানী ও অনুশীলন", marks: 100 },
      { code: "605", nameBn: "ইতিহাস ও সামাজিক বিজ্ঞান", nameEn: "History & Social Science", type: "আবশ্যিক", marks: 100 },
      { code: "606", nameBn: "ডিজিটাল প্রযুক্তি", nameEn: "Digital Technology", type: "ব্যবহারিক", marks: 100 },
      { code: "607", nameBn: "জীবন ও জীবিকা", nameEn: "Life & Livelihood", type: "কর্মমুখী", marks: 100 },
      { code: "608", nameBn: "স্বাস্থ্য সুরক্ষা", nameEn: "Health Protection", type: "শারীরিক", marks: 100 },
    ],
    routine: [
      { period: "১ম পিরিয়ড", time: "১০:০০ - ১০:৫০", subjectBn: "বাংলা" },
      { period: "২য় পিরিয়ড", time: "১০:৫০ - ১১:৪০", subjectBn: "ইংরেজি" },
      { period: "৩য় পিরিয়ড", time: "১১:৪০ - ১২:৩০", subjectBn: "গণিত" },
      { period: "৪র্থ পিরিয়ড", time: "১২:৩০ - ০১:১৫", subjectBn: "ডিজিটাল প্রযুক্তি" },
      { period: "টিফিন ও নামাজ", time: "০১:১৫ - ০২:০০", subjectBn: "যোহরের নামাজ ও টিফিন" },
      { period: "৫ম পিরিয়ড", time: "০২:০০ - ০২:৪৫", subjectBn: "বিজ্ঞান (ব্যবহারিক)" },
      { period: "৬ষ্ঠ পিরিয়ড", time: "০২:৪৫ - ০৩:৩০", subjectBn: "ইতিহাস ও সামাজিক বিজ্ঞান" },
    ],
  },
  7: {
    banner: "/uploads/gallery/732026907_1620864410045290_5653285812222818271_n.jpg",
    shift: "মাধ্যমিক শাখা (সকাল ১০:০০ - ০৪:০০)",
    descriptionBn: "সপ্তম শ্রেণির শিক্ষার্থীদের প্রকল্পভিত্তিক শিখন, সমস্যা সমাধান ও বিজ্ঞান অনুসন্ধিৎসা জোরদারকরণ।",
    subjects: [
      { code: "701", nameBn: "বাংলা", nameEn: "Bangla", type: "আবশ্যিক", marks: 100 },
      { code: "702", nameBn: "ইংরেজি", nameEn: "English", type: "আবশ্যিক", marks: 100 },
      { code: "703", nameBn: "গণিত", nameEn: "Mathematics", type: "আবশ্যিক", marks: 100 },
      { code: "704", nameBn: "বিজ্ঞান", nameEn: "Science", type: "আবশ্যিক", marks: 100 },
      { code: "705", nameBn: "ডিজিটাল প্রযুক্তি", nameEn: "Digital Technology", type: "ব্যবহারিক", marks: 100 },
      { code: "706", nameBn: "জীবন ও জীবিকা", nameEn: "Life & Livelihood", type: "কর্মমুখী", marks: 100 },
      { code: "707", nameBn: "ধর্ম ও নৈতিক শিক্ষা", nameEn: "Religious Studies", type: "আবশ্যিক", marks: 100 },
    ],
    routine: [
      { period: "১ম পিরিয়ড", time: "১০:০০ - ১০:৫০", subjectBn: "গণিত" },
      { period: "২য় পিরিয়ড", time: "১০:৫০ - ১১:৪০", subjectBn: "ইংরেজি" },
      { period: "৩য় পিরিয়ড", time: "১১:৪০ - ১২:৩০", subjectBn: "বিজ্ঞান" },
      { period: "৪র্থ পিরিয়ড", time: "১২:৩০ - ০১:১৫", subjectBn: "বাংলা" },
      { period: "টিফিন", time: "০১:১৫ - ০২:০০", subjectBn: "নামাজ ও টিফিন বিরতি" },
      { period: "৫ম পিরিয়ড", time: "০২:০০ - ০২:৪৫", subjectBn: "ডিজিটাল প্রযুক্তি" },
      { period: "৬ষ্ঠ পিরিয়ড", time: "০২:৪৫ - ০৩:৩০", subjectBn: "শিল্প ও সংস্কৃতি" },
    ],
  },
  8: {
    banner: "/uploads/gallery/733095692_1620864263378638_3567751887375597051_n.jpg",
    shift: "মাধ্যমিক শাখা (সকাল ১০:০০ - ০৪:০০)",
    descriptionBn: "৮ম শ্রেণির শিক্ষার্থীদের একাডেমিক ভিত্তি সুদৃঢ়করণ ও মাধ্যমিক উচ্চতর স্তরের উপযোগী তৈরি।",
    subjects: [
      { code: "801", nameBn: "বাংলা", nameEn: "Bangla", type: "আবশ্যিক", marks: 100 },
      { code: "802", nameBn: "ইংরেজি", nameEn: "English", type: "আবশ্যিক", marks: 100 },
      { code: "803", nameBn: "গণিত", nameEn: "Mathematics", type: "আবশ্যিক", marks: 100 },
      { code: "804", nameBn: "বিজ্ঞান", nameEn: "Science", type: "আবশ্যিক", marks: 100 },
      { code: "805", nameBn: "ইতিহাস ও সামাজিক বিজ্ঞান", nameEn: "Social Sciences", type: "আবশ্যিক", marks: 100 },
      { code: "806", nameBn: "তথ্য ও যোগাযোগ প্রযুক্তি", nameEn: "ICT", type: "কম্পিউটার ল্যাব", marks: 100 },
      { code: "807", nameBn: "ধর্ম ও নৈতিক শিক্ষা", nameEn: "Moral Education", type: "আবশ্যিক", marks: 100 },
    ],
    routine: [
      { period: "১ম পিরিয়ড", time: "১০:০০ - ১০:৫০", subjectBn: "ইংরেজি" },
      { period: "২য় পিরিয়ড", time: "১০:৫০ - ১১:৪০", subjectBn: "গণিত" },
      { period: "৩য় পিরিয়ড", time: "১১:৪০ - ১২:৩০", subjectBn: "বিজ্ঞান" },
      { period: "৪র্থ পিরিয়ড", time: "১২:৩০ - ০১:১৫", subjectBn: "বাংলা" },
      { period: "টিফিন", time: "০১:১৫ - ০২:০০", subjectBn: "নামাজ ও টিফিন বিরতি" },
      { period: "৫ম পিরিয়ড", time: "০২:০০ - ০২:৪৫", subjectBn: "তথ্য ও যোগাযোগ প্রযুক্তি" },
      { period: "৬ষ্ঠ পিরিয়ড", time: "০২:৪৫ - ০৩:৩০", subjectBn: "ধর্ম ও নৈতিক শিক্ষা" },
    ],
  },
  9: {
    banner: "/uploads/gallery/623386697_1482203917244674_8855631261609445030_n.jpg",
    shift: "মাধ্যমিক শাখা (সকাল ১০:০০ - ০৪:৩০)",
    descriptionBn: "৯ম শ্রেণিতে বিজ্ঞান, ব্যবসায় শিক্ষা ও মানবিক বিভাগে আলাদা পাঠ্যসূচি ও প্র্যাকটিক্যাল ল্যাব ক্লাস পরিচালিত হয়।",
    subjects: [
      { code: "101-102", nameBn: "বাংলা ১ম ও ২য় পত্র", nameEn: "Bangla 1st & 2nd", type: "আবশ্যিক", marks: 200 },
      { code: "107-108", nameBn: "ইংরেজি ১ম ও ২য় পত্র", nameEn: "English 1st & 2nd", type: "আবশ্যিক", marks: 200 },
      { code: "109", nameBn: "সাধারণ গণিত", nameEn: "General Mathematics", type: "আবশ্যিক", marks: 100 },
      { code: "154", nameBn: "তথ্য ও যোগাযোগ প্রযুক্তি", nameEn: "ICT", type: "আবশ্যিক", marks: 50 },
    ],
    groups: [
      {
        nameBn: "বিজ্ঞান বিভাগ (Science)",
        nameEn: "Science Group",
        subjects: [
          { code: "136", nameBn: "পদার্থবিজ্ঞান", nameEn: "Physics", type: "তত্ত্বীয় + ব্যবহারিক", marks: 100 },
          { code: "137", nameBn: "রসায়ন", nameEn: "Chemistry", type: "তত্ত্বীয় + ব্যবহারিক", marks: 100 },
          { code: "138", nameBn: "জীববিজ্ঞান", nameEn: "Biology", type: "তত্ত্বীয় + ব্যবহারিক", marks: 100 },
          { code: "126", nameBn: "উচ্চতর গণিত / কৃষি শিক্ষা", nameEn: "Higher Math / Agriculture", type: "ঐচ্ছিক বিষয়", marks: 100 },
        ],
      },
      {
        nameBn: "ব্যবসায় শিক্ষা বিভাগ (Business Studies)",
        nameEn: "Business Studies Group",
        subjects: [
          { code: "146", nameBn: "হিসাববিজ্ঞান", nameEn: "Accounting", type: "বিভাগীয় আবশ্যিক", marks: 100 },
          { code: "152", nameBn: "ব্যবসায় উদ্যোগ", nameEn: "Business Entrepreneurship", type: "বিভাগীয় আবশ্যিক", marks: 100 },
          { code: "153", nameBn: "ফিন্যান্স ও ব্যাংকিং", nameEn: "Finance & Banking", type: "বিভাগীয় আবশ্যিক", marks: 100 },
          { code: "134", nameBn: "কৃষি শিক্ষা / অর্থনীতি", nameEn: "Agriculture / Economics", type: "ঐচ্ছিক বিষয়", marks: 100 },
        ],
      },
      {
        nameBn: "মানবিক বিভাগ (Humanities / Arts)",
        nameEn: "Humanities Group",
        subjects: [
          { code: "150", nameBn: "বাংলাদেশের ইতিহাস ও বিশ্বসভ্যতা", nameEn: "History of Bangladesh", type: "বিভাগীয় আবশ্যিক", marks: 100 },
          { code: "110", nameBn: "ভূগোল ও পরিবেশ", nameEn: "Geography & Environment", type: "বিভাগীয় আবশ্যিক", marks: 100 },
          { code: "140", nameBn: "পৌরনীতি ও নাগরিকতা", nameEn: "Civics & Citizenship", type: "বিভাগীয় আবশ্যিক", marks: 100 },
          { code: "134", nameBn: "কৃষি শিক্ষা / অর্থনীতি", nameEn: "Agriculture / Economics", type: "ঐচ্ছিক বিষয়", marks: 100 },
        ],
      },
    ],
    routine: [
      { period: "১ম পিরিয়ড", time: "১০:০০ - ১০:৫০", subjectBn: "ইংরেজি ১ম/২য়" },
      { period: "২য় পিরিয়ড", time: "১০:৫০ - ১১:৪০", subjectBn: "সাধারণ গণিত" },
      { period: "৩য় পিরিয়ড", time: "১১:৪০ - ১২:৩০", subjectBn: "পদার্থবিজ্ঞান / হিসাববিজ্ঞান / ইতিহাস" },
      { period: "৪র্থ পিরিয়ড", time: "১২:৩০ - ০১:১৫", subjectBn: "রসায়ন / ব্যবসায় উদ্যোগ / ভূগোল" },
      { period: "টিফিন ও নামাজ", time: "০১:১৫ - ০২:০০", subjectBn: "যোহরের নামাজ ও টিফিন" },
      { period: "৫ম পিরিয়ড", time: "০২:০০ - ০২:৪৫", subjectBn: "বাংলা ১ম/২য় পত্র" },
      { period: "৬ষ্ঠ পিরিয়ড", time: "০২:৪৫ - ০৩:৩০", subjectBn: "জীববিজ্ঞান / ফিন্যান্স / পৌরনীতি" },
      { period: "৭ম পিরিয়ড", time: "০৩:৩০ - ০৪:১৫", subjectBn: "উচ্চতর গণিত / কৃষি / বিজ্ঞান ল্যাব" },
    ],
  },
  10: {
    banner: "/uploads/gallery/662644585_1543229637808768_3354893254043817335_n.jpg",
    shift: "এসএসসি স্পেশাল শাখা (সকাল ১০:০০ - ০৪:৪৫)",
    descriptionBn: "১০ম শ্রেণির শিক্ষার্থীদের বোর্ড পরীক্ষার নিবিড় প্রস্তুতি, মডেল টেস্ট ও বিশেষ কোচিং কার্যক্রম।",
    subjects: [
      { code: "101-102", nameBn: "বাংলা ১ম ও ২য় পত্র", nameEn: "Bangla 1st & 2nd", type: "আবশ্যিক", marks: 200 },
      { code: "107-108", nameBn: "ইংরেজি ১ম ও ২য় পত্র", nameEn: "English 1st & 2nd", type: "আবশ্যিক", marks: 200 },
      { code: "109", nameBn: "সাধারণ গণিত", nameEn: "General Mathematics", type: "আবশ্যিক", marks: 100 },
      { code: "154", nameBn: "তথ্য ও যোগাযোগ প্রযুক্তি", nameEn: "ICT", type: "আবশ্যিক", marks: 50 },
    ],
    groups: [
      {
        nameBn: "বিজ্ঞান বিভাগ (Science)",
        nameEn: "Science Group",
        subjects: [
          { code: "136", nameBn: "পদার্থবিজ্ঞান", nameEn: "Physics", type: "তত্ত্বীয় + ল্যাব", marks: 100 },
          { code: "137", nameBn: "রসায়ন", nameEn: "Chemistry", type: "তত্ত্বীয় + ল্যাব", marks: 100 },
          { code: "138", nameBn: "জীববিজ্ঞান", nameEn: "Biology", type: "তত্ত্বীয় + ল্যাব", marks: 100 },
          { code: "126", nameBn: "উচ্চতর গণিত", nameEn: "Higher Mathematics", type: "ঐচ্ছিক বিষয়", marks: 100 },
        ],
      },
      {
        nameBn: "ব্যবসায় শিক্ষা বিভাগ (Business Studies)",
        nameEn: "Business Studies Group",
        subjects: [
          { code: "146", nameBn: "হিসাববিজ্ঞান", nameEn: "Accounting", type: "বিভাগীয় আবশ্যিক", marks: 100 },
          { code: "152", nameBn: "ব্যবসায় উদ্যোগ", nameEn: "Business Entrepreneurship", type: "বিভাগীয় আবশ্যিক", marks: 100 },
          { code: "153", nameBn: "ফিন্যান্স ও ব্যাংকিং", nameEn: "Finance & Banking", type: "বিভাগীয় আবশ্যিক", marks: 100 },
          { code: "134", nameBn: "কৃষি শিক্ষা", nameEn: "Agriculture Studies", type: "ঐচ্ছিক বিষয়", marks: 100 },
        ],
      },
      {
        nameBn: "মানবিক বিভাগ (Humanities / Arts)",
        nameEn: "Humanities Group",
        subjects: [
          { code: "150", nameBn: "বাংলাদেশের ইতিহাস ও বিশ্বসভ্যতা", nameEn: "History", type: "বিভাগীয় আবশ্যিক", marks: 100 },
          { code: "110", nameBn: "ভূগোল ও পরিবেশ", nameEn: "Geography & Environment", type: "বিভাগীয় আবশ্যিক", marks: 100 },
          { code: "140", nameBn: "পৌরনীতি ও নাগরিকতা", nameEn: "Civics & Citizenship", type: "বিভাগীয় আবশ্যিক", marks: 100 },
          { code: "134", nameBn: "কৃষি শিক্ষা", nameEn: "Agriculture Studies", type: "ঐচ্ছিক বিষয়", marks: 100 },
        ],
      },
    ],
    routine: [
      { period: "১ম পিরিয়ড", time: "১০:০০ - ১০:৫০", subjectBn: "সাধারণ গণিত (বোর্ড টেস্ট পেপার সলভ)" },
      { period: "২য় পিরিয়ড", time: "১০:৫০ - ১১:৪০", subjectBn: "ইংরেজি ১ম/২য় পত্র" },
      { period: "৩য় পিরিয়ড", time: "১১:৪০ - ১২:৩০", subjectBn: "পদার্থ / হিসাববিজ্ঞান / ইতিহাস" },
      { period: "৪র্থ পিরিয়ড", time: "১২:৩০ - ০১:১৫", subjectBn: "রসায়ন / ব্যবসায় উদ্যোগ / ভূগোল" },
      { period: "টিফিন ও নামাজ", time: "০১:১৫ - ০২:০০", subjectBn: "যোহরের নামাজ ও টিফিন" },
      { period: "৫ম পিরিয়ড", time: "০২:০০ - ০২:৪৫", subjectBn: "বাংলা ১ম/২য় পত্র" },
      { period: "৬ষ্ঠ পিরিয়ড", time: "০২:৪৫ - ০৩:৩০", subjectBn: "উচ্চতর গণিত / ফিন্যান্স / পৌরনীতি" },
      { period: "৭ম পিরিয়ড", time: "০৩:৩০ - ০৪:৩০", subjectBn: "বিজ্ঞান ল্যাব / বিশেষ সমাধান ক্লাস" },
    ],
  },
};

export default function AcademicClassExplorer({
  classes,
  locale = "bn",
}: {
  classes: AcademicClassData[];
  locale?: Locale;
}) {
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const [selectedGroupIdx, setSelectedGroupIdx] = useState<number>(0);

  const activeClass =
    classes.find((c) => c.level === selectedLevel) || classes[0];
  const activeDetails =
    classDetailsMap[activeClass?.level ?? 0] || classDetailsMap[6];

  const handleDownloadRoutine = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* 1. Grade Selector Grid */}
      <div>
        <h2 className="text-xl font-bold text-[#1e3a5f] flex items-center gap-2 mb-4">
          <BookOpen size={20} className="text-[#c9a84c]" />
          <span>
            {locale === "bn"
              ? "শ্রেণিভিত্তিক তথ্য দেখতে যেকোনো শ্রেণিতে ক্লিক করুন (শিশু থেকে ১০ম শ্রেণি):"
              : "Select a Class to View Curriculum, Subjects & Routine:"}
          </span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-2.5">
          {classes.map((cls) => {
            const isSelected = cls.level === selectedLevel;
            return (
              <button
                key={cls.id}
                type="button"
                onClick={() => {
                  setSelectedLevel(cls.level ?? 0);
                  setSelectedGroupIdx(0);
                }}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                  isSelected
                    ? "bg-[#1e3a5f] text-white border-[#1e3a5f] ring-2 ring-[#c9a84c] shadow-md scale-102"
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#1e3a5f] hover:bg-blue-50/40"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm mb-1.5 ${
                    isSelected
                      ? "bg-[#c9a84c] text-[#1e3a5f]"
                      : "bg-[#1e3a5f]/10 text-[#1e3a5f]"
                  }`}
                >
                  {cls.level === 0 ? "শ" : cls.level}
                </div>
                <span className="font-extrabold text-xs block leading-tight">
                  {locale === "bn" ? cls.nameBn : cls.nameEn}
                </span>
                <span
                  className={`text-[9px] mt-1 font-bold px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-amber-400/20 text-amber-300"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  সক্রিয়
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Detailed View for Selected Class */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Class Banner Header */}
        <div className="relative h-48 sm:h-56 md:h-64 w-full bg-slate-900 overflow-hidden">
          <Image
            src={activeDetails.banner}
            alt={activeClass?.nameBn || "Class Banner"}
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#1e3a5f] text-xs font-black px-3.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                <GraduationCap size={14} />
                <span>লেভেল: {activeClass?.level === 0 ? "প্রাক-প্রাথমিক" : `${activeClass?.level}ম শ্রেণি`}</span>
                <span>•</span>
                <span>{activeDetails.shift}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
                {locale === "bn"
                  ? `${activeClass?.nameBn} — বিস্তারিত পাঠ্যক্রম ও রুটিন`
                  : `${activeClass?.nameEn} — Curriculum & Schedule`}
              </h2>
              <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 max-w-2xl">
                {activeDetails.descriptionBn}
              </p>
            </div>
          </div>
        </div>

        {/* Content Tabs & Details */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Class 9 & 10 Group Tabs */}
          {activeDetails.groups && activeDetails.groups.length > 0 && (
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-[#1e3a5f] uppercase tracking-wider block">
                শাখা / বিভাগ নির্বাচন করুন:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeDetails.groups.map((grp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedGroupIdx(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      selectedGroupIdx === idx
                        ? "bg-[#1e3a5f] text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {grp.nameBn}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subjects Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-extrabold text-[#1e3a5f] text-base sm:text-lg flex items-center gap-2">
                <BookOpen size={20} className="text-[#c9a84c]" />
                <span>বিষয় ও পাঠ্যসূচি তালিকা</span>
              </h3>
              <span className="text-xs font-semibold text-gray-500">
                এনসিটিবি (NCTB) শিক্ষাক্রম নির্দেশিত
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="p-3.5">বিষয় কোড</th>
                    <th className="p-3.5">বিষয়ের নাম (বাংলা)</th>
                    <th className="p-3.5">Subject Name (English)</th>
                    <th className="p-3.5">শ্রেণি ধরন</th>
                    <th className="p-3.5 text-right">পূর্ণমান</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {/* General / Core subjects */}
                  {activeDetails.subjects.map((sub, i) => (
                    <tr key={`core-${i}`} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-3.5 font-bold text-gray-500">{sub.code}</td>
                      <td className="p-3.5 font-bold text-[#1e3a5f]">{sub.nameBn}</td>
                      <td className="p-3.5 text-gray-600">{sub.nameEn}</td>
                      <td className="p-3.5">
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                          {sub.type}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-black text-gray-800">{sub.marks}</td>
                    </tr>
                  ))}

                  {/* Group Specific Subjects (Class 9 & 10) */}
                  {activeDetails.groups &&
                    activeDetails.groups[selectedGroupIdx]?.subjects.map((sub, i) => (
                      <tr key={`group-${i}`} className="bg-amber-50/40 hover:bg-amber-50/70 transition-colors">
                        <td className="p-3.5 font-bold text-amber-800">{sub.code}</td>
                        <td className="p-3.5 font-bold text-[#1e3a5f]">{sub.nameBn}</td>
                        <td className="p-3.5 text-gray-600">{sub.nameEn}</td>
                        <td className="p-3.5">
                          <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full text-[11px] font-semibold border border-amber-200">
                            {sub.type}
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-black text-gray-800">{sub.marks}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Daily Routine / Timetable */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
              <div>
                <h3 className="font-extrabold text-[#1e3a5f] text-base sm:text-lg flex items-center gap-2">
                  <Clock size={20} className="text-[#c9a84c]" />
                  <span>দৈনিক ক্লাস রুটিন (সময়সূচি)</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  রবিবার থেকে বৃহস্পতিবার পর্যন্ত ক্লাস সময়সূচি
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadRoutine}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1e3a5f] hover:bg-[#2b5182] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Download size={14} />
                <span>রুটিন প্রিন্ট / সেভ করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {activeDetails.routine.map((slot, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mb-1">
                    <span>{slot.period}</span>
                    <span className="text-[#c9a84c]">{slot.time}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">{slot.subjectBn}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-5 bg-gradient-to-r from-blue-50 to-amber-50 rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-[#1e3a5f] text-sm">
                এই শ্রেণিতে ২০২৬ শিক্ষাবর্ষে ভর্তি হতে চান?
              </h4>
              <p className="text-xs text-gray-600 mt-0.5">
                অনলাইন আবেদন ফর্ম পূরণ করুন অথবা বিদ্যালয় অফিস থেকে ফর্ম সংগ্রহ করুন
              </p>
            </div>
            <Link
              href={`/${locale}/admission`}
              className="px-5 py-2.5 bg-[#c9a84c] hover:bg-amber-400 text-[#1e3a5f] text-xs font-extrabold rounded-xl shadow-md transition-all shrink-0 inline-flex items-center gap-1.5"
            >
              <span>ভর্তি তথ্য ও ফরম দেখুন</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
