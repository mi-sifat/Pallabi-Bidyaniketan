import { prisma } from "@/lib/prisma";
import TeacherManager from "./TeacherManager";

export default async function AdminTeachersPage() {
  const teachers = await prisma.teacher.findMany({
    where: { isArchived: false },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
            শিক্ষক ও কর্মকর্তা ব্যবস্থাপনা ({teachers.length})
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            নতুন শিক্ষক যোগ করুন, ছবি যুক্ত করুন এবং ওয়েবসাইটে দৃশ্যমানতা নিয়ন্ত্রণ করুন
          </p>
        </div>
      </div>

      <TeacherManager initialTeachers={teachers} />
    </div>
  );
}
