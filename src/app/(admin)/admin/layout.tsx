"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <div className="min-h-screen bg-[#F0EFEB] flex">
      {!isLoginPage && <AdminSidebar />}
      <main className={`flex-1 ${!isLoginPage ? "md:ml-64 p-4 md:p-8 overflow-y-auto" : ""} min-h-screen`}>
        {children}
      </main>
    </div>
  );
}
