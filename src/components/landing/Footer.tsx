import { FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm sm:text-base">GestionRenta</span>
          </div>

          <div className="text-xs sm:text-sm text-gray-400">
            Gestión de declaraciones de renta
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-800 text-center text-xs sm:text-sm text-gray-500">
          © 2026 GestionRenta. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
