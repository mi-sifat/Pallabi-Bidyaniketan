import { prisma } from "@/lib/prisma";
import AdmissionManager from "./AdmissionManager";

export const dynamic = "force-dynamic";

export default async function AdminAdmissionsPage() {
  let applications: any[] = [];
  let total = 0;
  let submitted = 0;
  let underReview = 0;
  let contacted = 0;
  let accepted = 0;
  let rejected = 0;

  try {
    if (prisma) {
      [applications, total, submitted, underReview, contacted, accepted, rejected] = await Promise.all([
        prisma.admissionApplication.findMany({
          orderBy: { createdAt: "desc" },
          take: 100,
        }).catch(() => []),
        prisma.admissionApplication.count().catch(() => 0),
        prisma.admissionApplication.count({ where: { status: "SUBMITTED" } }).catch(() => 0),
        prisma.admissionApplication.count({ where: { status: "UNDER_REVIEW" } }).catch(() => 0),
        prisma.admissionApplication.count({ where: { status: "CONTACTED" } }).catch(() => 0),
        prisma.admissionApplication.count({ where: { status: "ACCEPTED" } }).catch(() => 0),
        prisma.admissionApplication.count({ where: { status: "REJECTED" } }).catch(() => 0),
      ]);
    }
  } catch (err) {
    console.error("AdminAdmissionsPage error:", err);
  }

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
