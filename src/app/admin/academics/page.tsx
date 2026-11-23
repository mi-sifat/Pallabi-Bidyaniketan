import { prisma } from "@/lib/prisma";
import { ensureDatabaseSchema } from "@/lib/auto-db-sync";
import AcademicManager, {
  AcademicClassItem,
  RoutineItem,
  SyllabusItem,
} from "./AcademicManager";

export const dynamic = "force-dynamic";

export default async function AdminAcademicsPage() {
  let classes: any[] = [];
  let routines: any[] = [];
  let syllabi: any[] = [];

  try {
    if (prisma) {
      [classes, routines, syllabi] = await Promise.all([
        prisma.academicClass.findMany({
          include: {
            subjects: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
            routines: true,
          },
          orderBy: { sortOrder: "asc" },
        }).catch(() => []),
        prisma.routine.findMany({
          include: { class: true },
          orderBy: { createdAt: "desc" },
        }).catch(() => []),
        prisma.syllabus.findMany({
          orderBy: { createdAt: "desc" },
        }).catch(() => []),
      ]);

      // If routines are 0 in production DB, run ensureDatabaseSchema to auto-seed them
      if (routines.length === 0 || classes.length === 0) {
        await ensureDatabaseSchema().catch(() => {});
        [classes, routines] = await Promise.all([
          prisma.academicClass.findMany({
            include: {
              subjects: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
              routines: true,
            },
            orderBy: { sortOrder: "asc" },
          }).catch(() => classes),
          prisma.routine.findMany({
            include: { class: true },
            orderBy: { createdAt: "desc" },
          }).catch(() => routines),
        ]);
      }
    }
  } catch (err) {
    console.error("AdminAcademicsPage load error:", err);
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <AcademicManager
          initialClasses={classes as unknown as AcademicClassItem[]}
          initialRoutines={routines as unknown as RoutineItem[]}
          initialSyllabi={syllabi as unknown as SyllabusItem[]}
        />
      </div>
    </div>
  );
}
