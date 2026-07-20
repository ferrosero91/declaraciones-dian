"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { LayoutDashboard, Users, Calendar, FileText, History, Settings, LogOut, Menu, X } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/calendario", label: "Calendario", icon: Calendar },
  { href: "/plantillas", label: "Plantillas", icon: FileText },
  { href: "/historial", label: "Historial", icon: History },
  { href: "/configuracion", label: "Config", icon: Settings },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link href="/dashboard" className="text-lg sm:text-xl font-bold" style={{ color: "#0F5C6E" }}>
            GestionRenta
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? "text-[#0F5C6E] font-medium bg-[#0F5C6E]/5"
                      : "text-gray-600 hover:text-[#0F5C6E] hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-1.5" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center px-3 py-2 rounded-md text-sm text-gray-600 hover:text-red-500 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-[#0F5C6E] hover:bg-gray-50"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-3 py-2.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? "text-[#0F5C6E] font-medium bg-[#0F5C6E]/5"
                      : "text-gray-600 hover:text-[#0F5C6E] hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/login" }); }}
              className="flex items-center w-full px-3 py-2.5 rounded-md text-sm text-gray-600 hover:text-red-500 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
