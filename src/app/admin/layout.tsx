import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="h-screen w-screen flex bg-gray-50 overflow-hidden">
      {/* Static Left Sidebar - Never scrolls with main page */}
      <AdminSidebar />

      {/* Right Column: Sticky Header + Independently Scrollable Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AdminHeader
          userName={session?.user?.name}
          userEmail={session?.user?.email}
          userRole={(session?.user as { role?: string })?.role}
        />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-gray-50/70">
          {children}
        </main>
      </div>
    </div>
  );
}
