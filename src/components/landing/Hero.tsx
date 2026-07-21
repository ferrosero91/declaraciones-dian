import { FileText } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[#0F5C6E] to-[#1A7A8E] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-36">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="text-xs sm:text-sm font-medium">Año gravable 2025</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-tight mb-5">
              Declaración de
              <span className="block text-emerald-300">Renta 2025</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-xl mx-auto lg:mx-0">
              Guía completa para personas naturales. Topes, documentos, deducciones y todo lo que necesitas saber.
            </p>
          </div>

          <div className="flex-shrink-0 hidden lg:block">
            <div className="w-64 h-64 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20">
              <FileText className="w-28 h-28 text-emerald-300" strokeWidth={1.2} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
