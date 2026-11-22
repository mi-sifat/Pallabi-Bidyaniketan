import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PrintTrigger from "./PrintTrigger";

export const dynamic = "force-dynamic";

async function loadDocumentData(urlStr: string | null | undefined): Promise<{ url: string; isPdf: boolean } | null> {
  if (!urlStr) return null;
  if (
    urlStr.startsWith("data:") ||
    urlStr.startsWith("http://") ||
    urlStr.startsWith("https://") ||
    urlStr.startsWith("/uploads/")
  ) {
    return { url: urlStr, isPdf: urlStr.toLowerCase().endsWith(".pdf") };
  }
  try {
    const { readFile } = await import("fs/promises");
    const { join, extname } = await import("path");
    const safeToken = urlStr.replace(/\.\./g, "").replace(/\\/g, "/");
    const filePath = join(process.cwd(), "private", "admissions", safeToken);
    const buffer = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();
    const isPdf = ext === ".pdf";
    const mime = isPdf ? "application/pdf" : ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
    return { url: `data:${mime};base64,${buffer.toString("base64")}`, isPdf };
  } catch (err) {
    console.warn("Could not read private document for print:", err);
    return null;
  }
}

export default async function AdmissionPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const app = await prisma.admissionApplication.findFirst({
    where: {
      OR: [{ id }, { applicationNo: id }],
    },
  });

  if (!app) {
    notFound();
  }

  // Load all attached documents in parallel
  const [photoData, birthCertData, marksheetData, tcData] = await Promise.all([
    loadDocumentData(app.photoUrl),
    loadDocumentData(app.birthCertificateUrl),
    loadDocumentData(app.marksheetUrl),
    loadDocumentData(app.transferCertificateUrl),
  ]);

  const appDate = new Date(app.createdAt).toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-8 print:bg-white print:py-0 print:m-0">
      <style>{`
        @page {
          size: A4 portrait;
          margin: 6mm 8mm;
        }
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .a4-sheet {
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: 194mm !important;
            min-height: 275mm !important;
            max-height: 282mm !important;
            margin: 0 auto !important;
            padding: 0 !important;
            overflow: hidden !important;
            page-break-inside: avoid !important;
          }
          .a4-sheet:not(:last-child) {
            page-break-after: always !important;
          }
          .a4-sheet:last-child {
            page-break-after: avoid !important;
          }
        }
      `}</style>

      {/* Top Action Bar (hidden in print) */}
      <div className="max-w-[210mm] mx-auto mb-4 px-4 flex items-center justify-between print:hidden">
        <div>
          <h2 className="font-bold text-[#1e3a5f] text-sm sm:text-base">
            ভর্তি আবেদনপত্র প্রিন্ট ও সংরক্ষণ (A4 সাইজ)
          </h2>
          <p className="text-xs text-gray-500">
            আবেদন নম্বর: <span className="font-mono font-bold text-gray-800">{app.applicationNo}</span>
            {birthCertData ? " • সংযুক্ত নথিসহ" : ""}
          </p>
        </div>
        <PrintTrigger />
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          PAGE 1: MAIN ADMISSION FORM (EXACTLY 1 A4 SHEET)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="a4-sheet max-w-[210mm] mx-auto bg-white p-6 shadow-xl print:shadow-none print:p-0 border border-gray-200 text-gray-900 font-bengali text-[10.5px] print:text-[9.5px] leading-tight select-none">
        {/* School Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1e3a5f] pb-2 mb-2">
          <div className="w-16 h-16 relative shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/uploads/branding/logo.jpg"
              alt="Logo"
              className="w-16 h-16 object-contain"
            />
          </div>

          <div className="text-center flex-1 px-3 space-y-0.5">
            <h1 className="text-2xl print:text-xl font-black text-[#1e3a5f] tracking-tight">
              পল্লবী বিদ্যানিকেতন
            </h1>
            <p className="text-[11px] print:text-[9px] text-gray-700 font-medium">
              মিরপুর-৭, পল্লবী, ঢাকা-১২১৬ • EIIN: ১০৮৩২৫ • ফোন: ০১৩MD-১০৮৩২৫
            </p>
            <div>
              <span className="inline-block bg-[#1e3a5f] text-white font-extrabold text-[11px] print:text-[8.5px] px-3.5 py-0.5 rounded-full uppercase tracking-wider">
                ভর্তি আবেদন ফরম (শিক্ষাবর্ষ: {app.academicYear})
              </span>
            </div>
          </div>

          {/* Student Photo Box */}
          <div className="w-20 h-24 border border-dashed border-gray-400 rounded p-0.5 flex flex-col items-center justify-center relative overflow-hidden bg-gray-50 shrink-0">
            {photoData ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoData.url}
                alt="Student Photo"
                className="w-full h-full object-cover rounded-xs"
              />
            ) : (
              <div className="text-[8px] text-gray-400 text-center leading-tight">
                পাসপোর্ট সাইজ ছবি
              </div>
            )}
          </div>
        </div>

        {/* Application Reference Bar */}
        <div className="bg-gray-50 border border-gray-300 rounded px-3 py-1.5 mb-2 flex items-center justify-between font-medium text-[11px] print:text-[9.5px]">
          <div>
            <span className="text-gray-500">আবেদন নম্বর: </span>
            <span className="font-mono font-black text-[#1e3a5f]">{app.applicationNo}</span>
          </div>
          <div>
            <span className="text-gray-500">ভর্তির শ্রেণি: </span>
            <span className="font-extrabold text-gray-900 bg-amber-100 px-2 py-0.5 rounded">
              {app.applyingClass}
            </span>
          </div>
          <div>
            <span className="text-gray-500">তারিখ: </span>
            <span className="font-bold text-gray-800">{appDate}</span>
          </div>
        </div>

        {/* SECTION 1: Student Information Table */}
        <div className="mb-2">
          <h3 className="font-bold text-[#1e3a5f] text-[11px] print:text-[9.5px] uppercase border-b border-gray-300 pb-0.5 mb-1">
            ১. শিক্ষার্থীর তথ্যাবলী (Student Information)
          </h3>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <tr>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold w-1/4">শিক্ষার্থীর নাম (বাংলা):</td>
                <td className="border border-gray-300 py-1 px-1.5 font-bold text-gray-900 w-1/4">{app.studentNameBn}</td>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold w-1/4">Name (English):</td>
                <td className="border border-gray-300 py-1 px-1.5 font-bold uppercase w-1/4">{app.studentNameEn}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold">জন্ম তারিখ (DOB):</td>
                <td className="border border-gray-300 py-1 px-1.5">{app.dob}</td>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold">লিঙ্গ / জেন্ডার:</td>
                <td className="border border-gray-300 py-1 px-1.5">{app.gender}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold">জন্ম নিবন্ধন নম্বর (BRN):</td>
                <td className="border border-gray-300 py-1 px-1.5 font-mono font-bold text-gray-900">{app.birthRegNo}</td>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold">জাতীয়তা ও ধর্ম:</td>
                <td className="border border-gray-300 py-1 px-1.5">
                  {app.nationality} {app.religion ? `• ${app.religion}` : ""} {app.bloodGroup ? `• রক্ত: ${app.bloodGroup}` : ""}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold">বর্তমান ঠিকানা:</td>
                <td colSpan={3} className="border border-gray-300 py-1 px-1.5">{app.presentAddress}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold">স্থায়ী ঠিকানা:</td>
                <td colSpan={3} className="border border-gray-300 py-1 px-1.5">{app.permanentAddress}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SECTION 2: Academic History */}
        <div className="mb-2">
          <h3 className="font-bold text-[#1e3a5f] text-[11px] print:text-[9.5px] uppercase border-b border-gray-300 pb-0.5 mb-1">
            ২. পূর্ববর্তী শিক্ষাগত তথ্যাবলী (Previous Academic Record)
          </h3>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <tr>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold w-1/4">পূর্ববর্তী বিদ্যালয়ের নাম:</td>
                <td className="border border-gray-300 py-1 px-1.5 w-1/4">{app.previousSchool || "প্রযোজ্য নয় / নতুন শিক্ষার্থী"}</td>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold w-1/4">পূর্ববর্তী শ্রেণি ও ফলাফল:</td>
                <td className="border border-gray-300 py-1 px-1.5 w-1/4">
                  {app.previousClass ? `${app.previousClass} • ` : ""}
                  {app.previousResult ? `জিপিএ/নম্বর: ${app.previousResult}` : "উল্লেখ নেই"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SECTION 3: Parent / Guardian Information */}
        <div className="mb-2">
          <h3 className="font-bold text-[#1e3a5f] text-[11px] print:text-[9.5px] uppercase border-b border-gray-300 pb-0.5 mb-1">
            ৩. পিতা, মাতা ও অভিভাবকের তথ্যাবলী (Parent & Guardian Information)
          </h3>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <tr>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold w-1/4">পিতার নাম:</td>
                <td className="border border-gray-300 py-1 px-1.5 font-bold w-1/4">{app.fatherName}</td>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold w-1/4">পিতার মোবাইল:</td>
                <td className="border border-gray-300 py-1 px-1.5 font-mono font-bold w-1/4">{app.fatherPhone}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold">পিতার পেশা / এনআইডি:</td>
                <td className="border border-gray-300 py-1 px-1.5">
                  {app.fatherOccupation || "—"} {app.fatherNid ? `(NID: ${app.fatherNid})` : ""}
                </td>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold">মাতার নাম:</td>
                <td className="border border-gray-300 py-1 px-1.5 font-bold">{app.motherName}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold">মাতার মোবাইল / পেশা:</td>
                <td className="border border-gray-300 py-1 px-1.5">
                  {app.motherPhone || "—"} {app.motherOccupation ? `(${app.motherOccupation})` : ""}
                </td>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold">জরুরি যোগাযোগ:</td>
                <td className="border border-gray-300 py-1 px-1.5 font-mono font-bold text-[#1e3a5f]">{app.emergencyPhone}</td>
              </tr>
              {app.guardianName && (
                <tr>
                  <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold">অভিভাবক:</td>
                  <td colSpan={3} className="border border-gray-300 py-1 px-1.5">
                    {app.guardianName} {app.guardianRelation ? `(${app.guardianRelation})` : ""} • ফোন: {app.guardianPhone}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* SECTION 4: Uploaded Document Checklist */}
        <div className="mb-2">
          <h3 className="font-bold text-[#1e3a5f] text-[11px] print:text-[9.5px] uppercase border-b border-gray-300 pb-0.5 mb-1">
            ৪. সংযুক্ত নথিপত্র (Document Checklist)
          </h3>
          <div className="grid grid-cols-4 gap-1 text-[9.5px] print:text-[8.5px] bg-gray-50 px-2.5 py-1.5 rounded border border-gray-200">
            <div>{app.photoUrl ? "☑" : "☐"} পাসপোর্ট ছবি</div>
            <div>{app.birthCertificateUrl ? "☑" : "☐"} জন্ম সনদ</div>
            <div>{app.marksheetUrl ? "☑" : "☐"} মার্কশিট / ফলাফল</div>
            <div>{app.transferCertificateUrl ? "☑" : "☐"} টিসি / ছাড়পত্র</div>
          </div>
        </div>

        {/* SECTION 5: Declaration & Signatures */}
        <div className="border border-gray-200 px-2.5 py-1.5 rounded mb-2 text-[9.5px] print:text-[8.5px] leading-tight text-gray-700 bg-gray-50/50">
          <p className="font-bold text-gray-900 inline">অঙ্গীকারনামা: </p>
          <span>
            আমি অঙ্গীকার করছি যে, উপরে প্রদত্ত সকল তথ্য সত্য ও সঠিক। কোনো তথ্য অসত্য প্রমাণিত হলে আবেদন বা ভর্তি বাতিল হবে। আমরা বিদ্যালয়ের নিয়ম ও শৃঙ্খলা মেনে চলতে বাধ্য থাকিব।
          </span>
        </div>

        <div className="flex justify-between items-end pt-3 mb-2 text-[10.5px] print:text-[9px]">
          <div className="text-center w-40">
            <div className="border-t border-gray-400 pt-0.5">
              <p className="font-bold">শিক্ষার্থীর স্বাক্ষর</p>
              <p className="text-[8.5px] text-gray-500">তারিখ: .............................</p>
            </div>
          </div>
          <div className="text-center w-40">
            <div className="border-t border-gray-400 pt-0.5">
              <p className="font-bold">পিতা / অভিভাবকের স্বাক্ষর</p>
              <p className="text-[8.5px] text-gray-500">তারিখ: .............................</p>
            </div>
          </div>
        </div>

        {/* SECTION 6: Office Use Only */}
        <div className="border border-dashed border-[#1e3a5f]/50 p-2.5 rounded bg-gray-50/50 text-[9.5px] print:text-[8.5px]">
          <div className="flex items-center justify-between border-b border-gray-300 pb-0.5 mb-1 font-bold text-[#1e3a5f]">
            <span>অফিস ব্যবহারের জন্য (FOR OFFICIAL USE ONLY)</span>
            <span>পল্লবী বিদ্যানিকেতন ভর্তি শাখা</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-2">
            <div>
              <p className="text-gray-600">ভর্তির রোল নং: ........................</p>
              <p className="text-gray-600 mt-0.5">শাখা / সেকশন: ........................</p>
            </div>
            <div>
              <p className="text-gray-600">রশিদ নং: ........................</p>
              <p className="text-gray-600 mt-0.5">জমার তারিখ: ........................</p>
            </div>
            <div>
              <p className="text-gray-600">ভর্তির অনুমোদন: গৃহীত / স্থগিত / বাতিল</p>
              <p className="text-gray-600 mt-0.5">মন্তব্য: .......................................</p>
            </div>
          </div>

          <div className="flex justify-between items-end pt-2">
            <div className="text-center w-32">
              <div className="border-t border-gray-400 pt-0.5">
                <p className="font-bold">যাচাইকারীর স্বাক্ষর</p>
              </div>
            </div>
            <div className="w-16 h-8 border border-gray-300 rounded flex items-center justify-center text-gray-300 text-[7px] uppercase">
              বিদ্যালয়ের সিল
            </div>
            <div className="text-center w-36">
              <div className="border-t border-gray-400 pt-0.5">
                <p className="font-bold">প্রধান শিক্ষকের স্বাক্ষর ও সিল</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          PAGE 2: ATTACHED BIRTH CERTIFICATE (IF UPLOADED)
      ══════════════════════════════════════════════════════════════════════ */}
      {birthCertData && (
        <div className="a4-sheet max-w-[210mm] mx-auto bg-white p-6 shadow-xl print:shadow-none print:p-0 border border-gray-200 mt-6 print:mt-0 print:border-none flex flex-col justify-between">
          <div>
            <div className="border-b-2 border-[#1e3a5f] pb-2 mb-3 flex items-center justify-between text-xs">
              <div>
                <h3 className="font-black text-[#1e3a5f] text-sm">
                  সংযুক্ত নথি: জন্ম নিবন্ধন সনদ (Birth Certificate)
                </h3>
                <p className="text-[10px] text-gray-600 mt-0.5">
                  শিক্ষার্থী: <span className="font-bold text-gray-900">{app.studentNameBn}</span> ({app.studentNameEn}) • 
                  আবেদন নম্বর: <span className="font-mono font-bold text-[#1e3a5f]">{app.applicationNo}</span> • 
                  শ্রেণি: {app.applyingClass}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block bg-blue-100 text-[#1e3a5f] font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                  নথি পাতা
                </span>
              </div>
            </div>

            <div className="w-full h-[240mm] flex items-center justify-center bg-gray-50/50 rounded-xl overflow-hidden border border-gray-200 p-2">
              {birthCertData.isPdf ? (
                <iframe
                  src={birthCertData.url}
                  className="w-full h-full border-0 rounded-lg"
                  title="Birth Certificate"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={birthCertData.url}
                  alt="Birth Certificate"
                  className="max-w-full max-h-[235mm] object-contain rounded-md shadow-xs"
                />
              )}
            </div>
          </div>

          <div className="text-center text-[9px] text-gray-400 pt-2 border-t border-gray-200 print:block">
            পল্লবী বিদ্যানিকেতন • ভর্তি আবেদন নং: {app.applicationNo} • সংযুক্ত জন্ম নিবন্ধন কপি
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          PAGE 3: ATTACHED MARKSHEET / RESULT (IF UPLOADED)
      ══════════════════════════════════════════════════════════════════════ */}
      {marksheetData && (
        <div className="a4-sheet max-w-[210mm] mx-auto bg-white p-6 shadow-xl print:shadow-none print:p-0 border border-gray-200 mt-6 print:mt-0 print:border-none flex flex-col justify-between">
          <div>
            <div className="border-b-2 border-[#1e3a5f] pb-2 mb-3 flex items-center justify-between text-xs">
              <div>
                <h3 className="font-black text-[#1e3a5f] text-sm">
                  সংযুক্ত নথি: মার্কশিট / ফলাফল সনদ (Academic Transcript)
                </h3>
                <p className="text-[10px] text-gray-600 mt-0.5">
                  শিক্ষার্থী: <span className="font-bold text-gray-900">{app.studentNameBn}</span> ({app.studentNameEn}) • 
                  আবেদন নম্বর: <span className="font-mono font-bold text-[#1e3a5f]">{app.applicationNo}</span>
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block bg-blue-100 text-[#1e3a5f] font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                  নথি পাতা
                </span>
              </div>
            </div>

            <div className="w-full h-[240mm] flex items-center justify-center bg-gray-50/50 rounded-xl overflow-hidden border border-gray-200 p-2">
              {marksheetData.isPdf ? (
                <iframe
                  src={marksheetData.url}
                  className="w-full h-full border-0 rounded-lg"
                  title="Marksheet"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={marksheetData.url}
                  alt="Marksheet"
                  className="max-w-full max-h-[235mm] object-contain rounded-md shadow-xs"
                />
              )}
            </div>
          </div>

          <div className="text-center text-[9px] text-gray-400 pt-2 border-t border-gray-200 print:block">
            পল্লবী বিদ্যানিকেতন • ভর্তি আবেদন নং: {app.applicationNo} • সংযুক্ত মার্কশিট কপি
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          PAGE 4: ATTACHED TRANSFER CERTIFICATE (IF UPLOADED)
      ══════════════════════════════════════════════════════════════════════ */}
      {tcData && (
        <div className="a4-sheet max-w-[210mm] mx-auto bg-white p-6 shadow-xl print:shadow-none print:p-0 border border-gray-200 mt-6 print:mt-0 print:border-none flex flex-col justify-between">
          <div>
            <div className="border-b-2 border-[#1e3a5f] pb-2 mb-3 flex items-center justify-between text-xs">
              <div>
                <h3 className="font-black text-[#1e3a5f] text-sm">
                  সংযুক্ত নথি: ছাড়পত্র / টিসি (Transfer Certificate)
                </h3>
                <p className="text-[10px] text-gray-600 mt-0.5">
                  শিক্ষার্থী: <span className="font-bold text-gray-900">{app.studentNameBn}</span> ({app.studentNameEn}) • 
                  আবেদন নম্বর: <span className="font-mono font-bold text-[#1e3a5f]">{app.applicationNo}</span>
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block bg-blue-100 text-[#1e3a5f] font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                  নথি পাতা
                </span>
              </div>
            </div>

            <div className="w-full h-[240mm] flex items-center justify-center bg-gray-50/50 rounded-xl overflow-hidden border border-gray-200 p-2">
              {tcData.isPdf ? (
                <iframe
                  src={tcData.url}
                  className="w-full h-full border-0 rounded-lg"
                  title="Transfer Certificate"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={tcData.url}
                  alt="Transfer Certificate"
                  className="max-w-full max-h-[235mm] object-contain rounded-md shadow-xs"
                />
              )}
            </div>
          </div>

          <div className="text-center text-[9px] text-gray-400 pt-2 border-t border-gray-200 print:block">
            পল্লবী বিদ্যানিকেতন • ভর্তি আবেদন নং: {app.applicationNo} • সংযুক্ত ছাড়পত্র কপি
          </div>
        </div>
      )}
    </div>
  );
}
