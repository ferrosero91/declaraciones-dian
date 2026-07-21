import { Calculator } from "lucide-react";

export default function UVT() {
  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0F5C6E] to-[#1A7A8E] rounded-2xl p-6 sm:p-10 lg:p-12 text-white">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <div className="shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                <Calculator className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-300" />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                Valor UVT 2025
              </h2>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-emerald-300 mb-3">
                $49.799
              </p>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-lg">
                Resolución DIAN 000193 del 4 de diciembre de 2024. La Unidad de Valor Tributario se utiliza para expresar en pesos los montos de las obligaciones tributarias, sanciones y demás valores en la norma tributaria.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
