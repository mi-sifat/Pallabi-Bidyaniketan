import { prisma } from "@/lib/prisma";
import { Mail, Clock, CheckCircle2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminContactMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  async function markAsRead(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
    revalidatePath("/admin/contact");
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
          যোগাযোগ বার্তা ও ইনবক্স ({messages.length})
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          ওয়েবসাইট ভিজিটর ও অভিভাবকদের পাঠানো সরাসরি অনুসন্ধান ও বার্তাসমূহ
        </p>
      </div>

      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 rounded-2xl border transition-all text-xs space-y-2 ${
                msg.isRead ? "bg-white border-gray-200" : "bg-blue-50/50 border-blue-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900 text-sm">{msg.name}</span>
                  <span className="text-gray-500 ml-2">({msg.phone})</span>
                  {msg.email && <span className="text-gray-400 ml-1">| {msg.email}</span>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-gray-400">
                    {new Date(msg.createdAt).toLocaleString("bn-BD")}
                  </span>
                  {!msg.isRead && (
                    <form action={markAsRead}>
                      <input type="hidden" name="id" value={msg.id} />
                      <button
                        type="submit"
                        className="bg-white border border-gray-300 text-gray-700 px-2 py-0.5 rounded text-[10px] font-semibold hover:bg-gray-50"
                      >
                        পঠিত মার্ক করুন
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {msg.subject && (
                <div className="font-semibold text-[#1e3a5f]">
                  বিষয়: {msg.subject}
                </div>
              )}

              <p className="text-gray-700 leading-relaxed bg-white/70 p-3 rounded-lg border border-gray-100">
                {msg.message}
              </p>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500 space-y-2">
            <Mail size={36} className="mx-auto text-gray-400" />
            <h3 className="font-bold text-gray-700">কোনো নতুন বার্তা নেই</h3>
            <p className="text-xs">
              ভিজিটররা ওয়েবসাইটের যোগাযোগ ফর্ম পূরণ করলে বার্তাগুলো এখানে জমা হবে।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
