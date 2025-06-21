"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  ImageIcon,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  Box,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  {
    href: "/admin",
    label: "Dasbor",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    href: "/admin/content",
    label: "Konten",
    icon: FileText,
    badge: null,
  },
  {
    href: "/admin/downloadable-files",
    label: "Berkas Unduhan",
    icon: Box,
    badge: null,
  },
  {
    href: "/admin/hero-buttons",
    label: "Tombol Hero",
    icon: Box,
    badge: null,
  },
  {
    href: "/admin/messages",
    label: "Pesan",
    icon: MessageSquare,
    badge: "New",
  },
  {
    href: "/admin/gallery",
    label: "Galeri",
    icon: ImageIcon,
    badge: null,
  },
  {
    href: "/admin/users",
    label: "Pengguna",
    icon: Users,
    badge: null,
  },
  {
    href: "/admin/settings",
    label: "Pengaturan",
    icon: Settings,
    badge: null,
  },
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "bg-white shadow-xl border-r border-gray-200 transition-all duration-300 flex flex-col relative z-10",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Admin Panel</h2>
                <p className="text-xs text-gray-500">Sistem Manajemen</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive && "text-white"
                )}
              />
              {!isCollapsed && (
                <>
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant={isActive ? "secondary" : "outline"}
                      className="ml-auto text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Footer */}
      <div className="p-4">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
        >
          <Home className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className="font-medium">Kembali ke Website</span>
          )}
        </Link>
      </div>
    </aside>
  );
}
