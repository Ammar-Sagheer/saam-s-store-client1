import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/app/_lib/supabase-server";
import AdminSidebar from "@/app/_components/admin/AdminSidebar";
import AdminNavbar from "@/app/_components/admin/AdminNavbar";
import { headers } from "next/headers";

export default async function AdminLayout({ children }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const supabase = await createSupabaseServer();

  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (error || !claims || claims.email !== process.env.ADMIN_EMAIL) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-light flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar session={{ user: { email: claims.email } }} />
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
