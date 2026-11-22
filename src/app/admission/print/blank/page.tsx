import Image from "next/image";
import PrintTrigger from "../[id]/PrintTrigger";

export const dynamic = "force-dynamic";

export default function BlankAdmissionFormPage() {
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
          .page-container {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            max-height: 284mm !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Top Action Bar (hidden in print) */}
      <div className="max-w-[210mm] mx-auto mb-4 px-4 flex items-center justify-between print:hidden">
        <div>
          <h2 className="font-bold text-[#1e3a5f] text-sm sm:text-base">অফিসিয়াল খালি ভর্তি ফরম (Blank A4 Form)</h2>
          <p className="text-xs text-gray-500">
            হাত দিয়ে পূরণ করার জন্য প্রিন্ট করে সংগ্রহ করুন
          </p>
        </div>
        <PrintTrigger />
      </div>

      {/* A4 Sheet Container - Strictly 1 Page */}
      <div className="page-container max-w-[210mm] mx-auto bg-white p-6 shadow-xl print:shadow-none print:p-0 border border-gray-200 text-gray-900 font-bengali text-[10px] print:text-[8.5px] leading-tight select-none">
        {/* School Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1e3a5f] pb-2 mb-2">
          <div className="w-14 h-14 relative shrink-0">
            <Image
              src="/uploads/branding/logo.jpg"
              alt="Pallabi Bidyaniketan Logo"
              width={56}
              height={56}
              className="object-contain"
            />
          </div>

          <div className="text-center flex-1 px-2 space-y-0.5">
            <h1 className="text-xl print:text-lg font-black text-[#1e3a5f] tracking-tight">
              পল্লবী বিদ্যানিকেতন
            </h1>
            <p className="text-[10px] print:text-[8.5px] text-gray-700 font-medium">
              মিরপুর-৭, পল্লবী, ঢাকা-১২১৬ • EIIN: ১০৮৩২৫ • ফোন: ০১৩MD-১০৮৩২৫
            </p>
            <div>
              <span className="inline-block bg-[#1e3a5f] text-white font-extrabold text-[10px] print:text-[8px] px-3 py-0.5 rounded-full uppercase tracking-wider">
                ভর্তি আবেদন ফরম (শিক্ষাবর্ষ: ২০২৬-২০২৭)
              </span>
            </div>
          </div>

          {/* Student Photo Box */}
          <div className="w-18 h-22 border border-dashed border-gray-400 rounded p-0.5 flex flex-col items-center justify-center relative bg-gray-50 shrink-0">
            <span className="text-[8px] text-gray-400 text-center leading-tight">
              পাসপোর্ট ছবি সংযুক্ত করুন
            </span>
          </div>
        </div>

        {/* Application Reference Bar */}
        <div className="bg-gray-50 border border-gray-300 rounded px-2.5 py-1 mb-2 flex items-center justify-between font-medium text-[10.5px] print:text-[9px]">
          <div>
            <span className="text-gray-500">ফরম নং: </span>
            <span className="font-mono font-bold text-gray-400">..................................</span>
          </div>
          <div>
            <span className="text-gray-500">ভর্তির শ্রেণি: </span>
            <span className="font-bold text-gray-400">..................................</span>
          </div>
          <div>
            <span className="text-gray-500">তারিখ: </span>
            <span className="font-bold text-gray-400">....../....../২০২৬</span>
          </div>
        </div>

        {/* SECTION 1: Student Information Table */}
        <div className="mb-2">
          <h3 className="font-bold text-[#1e3a5f] text-[10.5px] print:text-[9px] uppercase border-b border-gray-300 pb-0.5 mb-1">
            ১. শিক্ষার্থীর তথ্যাবলী (Student Information)
          </h3>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <tr>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold w-1/4">শিক্ষার্থীর নাম (বাংলা):</td>
                <td className="border border-gray-300 py-1 px-1.5 w-1/4"></td>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold w-1/4">Name (English, Block):</td>
                <td className="border border-gray-300 py-1 px-1.5 w-1/4"></td>
              </tr>
              <tr>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold">জন্ম তারিখ (DOB):</td>
                <td className="border border-gray-300 py-1 px-1.5"></td>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold">লিঙ্গ / জেন্ডার:</td>
                <td className="border border-gray-300 py-1 px-1.5">ছাত্র [  ]  ছাত্রী [  ]</td>
              </tr>
              <tr>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold">জন্ম নিবন্ধন নম্বর (BRN):</td>
                <td className="border border-gray-300 py-1 px-1.5"></td>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold">জাতীয়তা ও ধর্ম:</td>
                <td className="border border-gray-300 py-1 px-1.5">বাংলাদেশী • ধর্ম: .................</td>
              </tr>
              <tr>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold">বর্তমান ঠিকানা:</td>
                <td colSpan={3} className="border border-gray-300 py-1.5 px-1.5"></td>
              </tr>
              <tr>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold">স্থায়ী ঠিকানা:</td>
                <td colSpan={3} className="border border-gray-300 py-1.5 px-1.5"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SECTION 2: Academic History */}
        <div className="mb-2">
          <h3 className="font-bold text-[#1e3a5f] text-[10.5px] print:text-[9px] uppercase border-b border-gray-300 pb-0.5 mb-1">
            ২. পূর্ববর্তী শিক্ষাগত তথ্যাবলী (Previous Academic Record)
          </h3>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <tr>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold w-1/4">পূর্ববর্তী বিদ্যালয়ের নাম:</td>
                <td className="border border-gray-300 py-1 px-1.5 w-1/4"></td>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold w-1/4">পূর্ববর্তী শ্রেণি ও ফলাফল:</td>
                <td className="border border-gray-300 py-1 px-1.5 w-1/4">শ্রেণি: ......... রোল: ......... জিপিএ: .........</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SECTION 3: Parent / Guardian Information */}
        <div className="mb-2">
          <h3 className="font-bold text-[#1e3a5f] text-[10.5px] print:text-[9px] uppercase border-b border-gray-300 pb-0.5 mb-1">
            ৩. পিতা, মাতা ও অভিভাবকের তথ্যাবলী (Parent & Guardian Information)
          </h3>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <tr>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold w-1/4">পিতার নাম:</td>
                <td className="border border-gray-300 py-1 px-1.5 w-1/4"></td>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold w-1/4">পিতার মোবাইল:</td>
                <td className="border border-gray-300 py-1 px-1.5 w-1/4"></td>
              </tr>
              <tr>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold">পিতার পেশা ও এনআইডি:</td>
                <td className="border border-gray-300 py-1 px-1.5">পেশা: ............... NID: ...................</td>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold">মাতার নাম:</td>
                <td className="border border-gray-300 py-1 px-1.5"></td>
              </tr>
              <tr>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold">মাতার মোবাইল ও পেশা:</td>
                <td className="border border-gray-300 py-1 px-1.5">মোবাইল: ................... পেশা: ................</td>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold">জরুরি যোগাযোগ নম্বর:</td>
                <td className="border border-gray-300 py-1 px-1.5"></td>
              </tr>
              <tr>
                <td className="border border-gray-300 bg-gray-50 py-1 px-1.5 font-bold">অভিভাবকের নাম (যদি থাকে):</td>
                <td colSpan={3} className="border border-gray-300 py-1 px-1.5">নাম: ....................................... সম্পর্ক: ................... মোবাইল: ............................</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SECTION 4: Uploaded Document Checklist */}
        <div className="mb-2">
          <h3 className="font-bold text-[#1e3a5f] text-[10.5px] print:text-[9px] uppercase border-b border-gray-300 pb-0.5 mb-1">
            ৪. সংযুক্ত নথিপত্র টিক দিন (Document Checklist)
          </h3>
          <div className="grid grid-cols-4 gap-1 text-[9px] print:text-[8px] bg-gray-50 px-2 py-1 rounded border border-gray-200">
            <div>[  ] পাসপোর্ট ছবি (২ কপি)</div>
            <div>[  ] জন্ম সনদের সত্যায়িত কপি</div>
            <div>[  ] মার্কশিট / ফলাফল কপি</div>
            <div>[  ] ছাড়পত্র / টিসি (প্রযোজ্য ক্ষেত্রে)</div>
          </div>
        </div>

        {/* SECTION 5: Declaration & Signatures */}
        <div className="border border-gray-200 px-2 py-1 rounded mb-2 text-[9px] print:text-[8px] leading-tight text-gray-700 bg-gray-50/50">
          <p className="font-bold text-gray-900 inline">অঙ্গীকারনামা: </p>
          <span>
            আমি অঙ্গীকার করছি যে, উপরে প্রদত্ত সকল তথ্য সত্য ও সঠিক। কোনো তথ্য অসত্য প্রমাণিত হলে আবেদন বা ভর্তি বাতিল হবে। আমরা বিদ্যালয়ের নির্ধারিত সকল নিয়ম ও শৃঙ্খলা মেনে চলতে বাধ্য থাকিব।
          </span>
        </div>

        <div className="flex justify-between items-end pt-3 mb-2 text-[10px] print:text-[8.5px]">
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
        <div className="border border-dashed border-[#1e3a5f]/50 p-2 rounded bg-gray-50/50 text-[9px] print:text-[8px]">
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
    </div>
  );
}
