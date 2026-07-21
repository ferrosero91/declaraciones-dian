"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Menu, X } from "lucide-react";

export default function LandingNav() {
  const [abierto, setAbierto] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#0F5C6E]" />
            <span className="font-bold text-gray-900 text-sm">GestionRenta</span>
          </Link>

          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-[#0F5C6E] transition-colors px-3 py-2"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="btn-primary text-sm px-4 py-2"
            >
              Crear cuenta
            </Link>
          </div>

          <button
            onClick={() => setAbierto(!abierto)}
            className="sm:hidden p-2 text-gray-600"
          >
            {abierto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {abierto && (
        <div className="sm:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-2">
          <Link
            href="/login"
            className="block text-sm font-medium text-gray-600 hover:text-[#0F5C6E] py-2"
            onClick={() => setAbierto(false)}
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="block btn-primary text-sm text-center py-2.5"
            onClick={() => setAbierto(false)}
          >
            Crear cuenta
          </Link>
        </div>
      )}
    </nav>
  );
}
