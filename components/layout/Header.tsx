"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Use next/navigation for pathname to support SSR/CSR
  let pathname = "/";
  try {
    // Try to use next/navigation if available (Next.js 13+)
    // fallback to window.location.pathname if not in app dir
    pathname =
      usePathname?.() ||
      (typeof window !== "undefined" ? window.location.pathname : "/");
  } catch {
    pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  }

  useEffect(() => {
    setIsMenuOpen(false);
    // Re-check login status on every navigation to keep it in sync
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/kontak", label: "Kontak" },
    ...(isLoggedIn
      ? [{ href: "/admin", label: "Admin" }]
      : [{ href: "/admin", label: "Login Admin" }]),
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-lg sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-gray-800">
            SMP N 1 Tulung Selapan
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-gray-600 hover:text-blue-600 transition-colors font-medium pb-1
                  ${
                    item.href === pathname
                      ? "text-blue-600 font-bold after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-1 after:bg-blue-600 after:rounded"
                      : ""
                  }
                `}
                style={{}}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t"
          >
            {navItems.map((item) =>
              item.href === "/admin" ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors ${
                    item.href === pathname
                      ? "relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-1 after:bg-white after:rounded"
                      : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block py-2 text-gray-600 hover:text-blue-600 transition-colors relative ${
                    item.href === pathname
                      ? "text-blue-600 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-1 after:bg-blue-600"
                      : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
}
