import { prisma } from "@/lib/prisma";
import AdministrationManager, { AdminProfileItem } from "./AdministrationManager";

export const dynamic = "force-dynamic";

export default async function AdminAdministrationPage() {
  let profiles: AdminProfileItem[] = [];
  try {
    if (prisma) {
      profiles = (await prisma.adminProfile.findMany({
        orderBy: { displayOrder: "asc" },
      }).catch(() => [])) as unknown as AdminProfileItem[];
    }
  } catch (err) {
    console.error("AdminAdministrationPage error:", err);
  }

  return <AdministrationManager initialProfiles={profiles} />;
}
