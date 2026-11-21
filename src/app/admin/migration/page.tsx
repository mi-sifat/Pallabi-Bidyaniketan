import { prisma } from "@/lib/prisma";
import { Database, ExternalLink, CheckCircle2, Clock } from "lucide-react";

export default async function MigrationReviewPage() {
  const records = await prisma.migrationRecord.findMany({
    orderBy: { retrievedAt: "desc" },
  });

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
          ওয়েবসাইট মাইগ্রেশন ও সোর্স রিভিউ (Migration & Source Review)
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          পূর্ববর্তী ওয়েবসাইট (pbn.edu.bd) ও ঢাকা শিক্ষা বোর্ড থেকে সংগৃহীত তথ্যাবলীর অডিট ট্রেইল
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-base font-bold text-[#1e3a5f] flex items-center gap-2">
            <Database size={18} className="text-[#c9a84c]" />
            সংগৃহীত ডাটা আইটেম তালিকা
          </h2>
          <span className="text-xs text-gray-500 font-semibold">
            মোট রেকর্ড: {records.length}
          </span>
        </div>

        <div className="space-y-4">
          {records.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">
                  {r.contentTitle}
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  {r.verificationStatus}
                </span>
              </div>

              <div className="text-gray-600 flex items-center gap-1.5">
                <span className="font-semibold text-gray-700">উৎস URL:</span>
                <a
                  href={r.sourceWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  {r.sourceWebsite}
                  <ExternalLink size={12} />
                </a>
              </div>

              {r.adminNotes && (
                <div className="text-gray-500 bg-white p-2.5 rounded border border-gray-100">
                  <strong>নোট:</strong> {r.adminNotes}
                </div>
              )}

              <div className="text-[10px] text-gray-400">
                ইমপোর্ট সময়: {new Date(r.retrievedAt).toLocaleString("bn-BD")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
