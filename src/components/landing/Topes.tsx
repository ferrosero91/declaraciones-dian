import { Wallet, Building, Landmark, CreditCard } from "lucide-react";

const topes = [
  {
    icon: Wallet,
    titulo: "Ingresos Brutos",
    valor: "$69.718.600",
    descripcion: "Si tus ingresos brutos del año 2025 igualan o superan este valor, estás obligado a declarar.",
  },
  {
    icon: Building,
    titulo: "Patrimonio Bruto",
    valor: "$224.095.500",
    descripcion: "Si tu patrimonio bruto al 31 de diciembre de 2025 iguala o supera este valor, debes declarar.",
  },
  {
    icon: Landmark,
    titulo: "Consignaciones",
    valor: "$69.718.600",
    descripcion: "Si tus consignaciones, depósitos o inversiones durante 2025 superan este monto, aplica la obligación.",
  },
  {
    icon: CreditCard,
    titulo: "Compras con Tarjeta",
    valor: "$69.718.600",
    descripcion: "Si tus compras, consumos o pagos con tarjeta de crédito en 2025 superan este tope, declaras.",
  },
];

export default function Topes() {
  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
            ¿Estás obligado a declarar renta?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Para el año gravable 2025, debes declarar si cumples con al menos <strong>uno</strong> de los siguientes topes:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {topes.map((tope) => {
            const Icon = tope.icon;
            return (
              <div
                key={tope.titulo}
                className="bg-gray-50 rounded-xl p-5 sm:p-6 border border-gray-200 hover:border-[#0F5C6E]/30 hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#0F5C6E]/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#0F5C6E]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{tope.titulo}</h3>
                <p className="text-xl sm:text-2xl font-bold text-[#0F5C6E] mb-3">{tope.valor}</p>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{tope.descripcion}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
            <span className="text-amber-600 text-xs sm:text-sm font-medium">
              Si cumples al menos <strong>UNO</strong> de estos topes, estás obligado a presentar tu declaración de renta.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
