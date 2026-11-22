import { prisma } from "@/lib/prisma";
import AdmissionManager from "./AdmissionManager";

export const dynamic = "force-dynamic";

export default async function AdminAdmissionsPage() {
  const [applications, total, submitted, underReview, contacted, accepted, rejected] = await Promise.all([
    prisma.admissionApplication.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.admissionApplication.count(),
    prisma.admissionApplication.count({ where: { status: "SUBMITTED" } }),
    prisma.admissionApplication.count({ where: { status: "UNDER_REVIEW" } }),
    prisma.admissionApplication.count({ where: { status: "CONTACTED" } }),
    prisma.admissionApplication.count({ where: { status: "ACCEPTED" } }),
    prisma.admissionApplication.count({ where: { status: "REJECTED" } }),
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <AdmissionManager
        initialApplications={JSON.parse(JSON.stringify(applications))}
        initialStats={{
          total,
          submitted,
          underReview,
          contacted,
          accepted,
          rejected,
        }}
      />
    </div>
  );
}
