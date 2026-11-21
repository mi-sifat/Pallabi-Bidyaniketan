import { prisma } from "@/lib/prisma";
import { Settings, Save, CheckCircle2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminSettingsPage() {
  const profile = await prisma.schoolProfile.findFirst();

  async function updateProfile(formData: FormData) {
    "use server";
    const nameEn = formData.get("nameEn") as string;
    const nameBn = formData.get("nameBn") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const addressBn = formData.get("addressBn") as string;
    const facebookUrl = formData.get("facebookUrl") as string;

    await prisma.schoolProfile.update({
      where: { id: profile?.id || "pbn-main-profile" },
      data: {
        nameEn,
        nameBn,
        phone,
        email,
        addressBn,
        facebookUrl,
      },
    });

    revalidatePath("/admin/settings");
    revalidatePath("/bn");
    revalidatePath("/en");
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
          প্রতিষ্ঠান তথ্য ও ব্র্যান্ডিং সেটিংস
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          স্কুলের নাম, যোগাযোগের তথ্য ও অন্যান্য প্রাথমিক সেটিংস হালনাগাদ করুন
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
        <form action={updateProfile} className="space-y-5 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label font-semibold">প্রতিষ্ঠানের নাম (বাংলা)</label>
              <input
                type="text"
                name="nameBn"
                defaultValue={profile?.nameBn || "পল্লবী বিদ্যানিকেতন"}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label font-semibold">Institution Name (English)</label>
              <input
                type="text"
                name="nameEn"
                defaultValue={profile?.nameEn || "Pallabi Bidyaniketan"}
                className="form-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label font-semibold">ফোন নম্বর</label>
              <input
                type="text"
                name="phone"
                defaultValue={profile?.phone || "+8801309108325"}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label font-semibold">অফিসিয়াল ইমেইল</label>
              <input
                type="email"
                name="email"
                defaultValue={profile?.email || "info@pbn.edu.bd"}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="form-label font-semibold">বিদ্যালয়ের ঠিকানা (বাংলা)</label>
            <input
              type="text"
              name="addressBn"
              defaultValue={profile?.addressBn || "মিল্কভিটা রোড, মিরপুর-৭, পল্লবী, ঢাকা-১২১৬"}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label font-semibold">ফেসবুক পেজ লিংক (Facebook URL)</label>
            <input
              type="url"
              name="facebookUrl"
              placeholder="https://facebook.com/..."
              defaultValue={profile?.facebookUrl || ""}
              className="form-input"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              * যাচাইকৃত ফেসবুক পেজ লিংক প্রাপ্তির পর এখানে যুক্ত করুন।
            </p>
          </div>

          <div className="pt-2">
            <button type="submit" className="btn-primary !text-xs !py-2.5">
              <Save size={16} /> সেটিংস সংরক্ষণ করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
