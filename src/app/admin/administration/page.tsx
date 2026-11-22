import { prisma } from "@/lib/prisma";
import AdministrationManager, { AdminProfileItem } from "./AdministrationManager";

export const dynamic = "force-dynamic";

export default async function AdminAdministrationPage() {
  const profiles = (await prisma.adminProfile.findMany({
    orderBy: { displayOrder: "asc" },
  })) as unknown as AdminProfileItem[];

  return <AdministrationManager initialProfiles={profiles} />;
}
