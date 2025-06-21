"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();

  // Get page title based on pathname
  const getPageTitle = () => {
    switch (pathname) {
      case "/admin":
        return "Dashboard";
      case "/admin/content":
        return "Manajemen Konten";
      case "/admin/messages":
        return "Pesan Masuk";
      case "/admin/gallery":
        return "Galeri";
      case "/admin/users":
        return "Pengguna";
      case "/admin/settings":
        return "Pengaturan";
      default:
        return "Admin Panel";
    }
  };

  // Logout handler that calls the API to clear the cookie on the server
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/login", {
        method: "DELETE",
        credentials: "include",
      });
    } catch (e) {
      // ignore error, tetap redirect
    } finally {
      router.push("/admin/login");
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-end gap-3">
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium">Administrator</p>
                <p className="text-xs text-gray-500">admin@sekolah.com</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profil Saya
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
