import { prisma } from "@/lib/prisma";
import { Building2, Plus, Users } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminAdministrationPage() {
  const profiles = await prisma.adminProfile.findMany({
    orderBy: { displayOrder: "asc" },
  });

  async function createProfile(formData: FormData) {
    "use server";
    const nameBn = formData.get("nameBn") as string;
    const designationBn = formData.get("designationBn") as string;
    const profileType = formData.get("profileType") as any;

    if (!nameBn || !designationBn) return;

    await prisma.adminProfile.create({
      data: {
        nameBn,
        nameEn: nameBn,
        designationBn,
        designationEn: designationBn,
        profileType: profileType || "COMMITTEE_MEMBER",
        isPublished: true,
        status: "PUBLISHED",
      },
    });

    revalidatePath("/admin/administration");
    revalidatePath("/bn/administration");
    revalidatePath("/en/administration");
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
          প্রশাসন ও পরিচালনা পর্ষদ ব্যবস্থাপনা
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          প্রধান শিক্ষক, সহকারী প্রধান ও ম্যানেজিং কমিটির সদস্য তথ্য
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1e3a5f] border-b border-gray-100 pb-2">
          নতুন প্রশাসনিক সদস্য যুক্ত করুন
        </h2>
        <form action={createProfile} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="form-label">সদস্যের নাম *</label>
              <input
                type="text"
                name="nameBn"
                required
                placeholder="নাম লিখুন"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">পদবী *</label>
              <input
                type="text"
                name="designationBn"
                required
                placeholder="যেমন: সভাপতি / সদস্য"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">ক্যাটাগরি</label>
              <select name="profileType" className="form-input">
                <option value="COMMITTEE_CHAIR">সভাপতি (Committee Chair)</option>
                <option value="COMMITTEE_MEMBER">কমিটি সদস্য (Member)</option>
                <option value="ADMIN_STAFF">প্রশাসনিক স্টাফ</option>
                <option value="FORMER_HEAD">প্রাক্তন প্রধান</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary !text-xs !py-2">
            <Plus size={16} /> সদস্য যুক্ত করুন
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1e3a5f] border-b border-gray-100 pb-2">
          পরিচালনা কমিটি ও প্রশাসনিক তালিকা ({profiles.length})
        </h2>
        {profiles.length > 0 ? (
          <div className="space-y-3">
            {profiles.map((p) => (
              <div key={p.id} className="p-4 border rounded-xl flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{p.nameBn}</h4>
                  <span className="text-gray-500">{p.designationBn}</span>
                </div>
                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  প্রকাশিত
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-4">বর্তমানে কোনো অতিরিক্ত সদস্য যুক্ত নেই।</p>
        )}
      </div>
    </div>
  );
}
