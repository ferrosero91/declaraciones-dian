import { Clock, Search, CheckCircle, AlertTriangle } from "lucide-react";

const recomendaciones = [
  {
    icon: Clock,
    titulo: "No dejes todo para último momento",
    descripcion: "Recolecta tus soportes de forma progresiva durante el año. La organización anticipada evita errores y inconsistencias con la DIAN.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Search,
    titulo: "Valida tu RUT antes de declarar",
    descripcion: "Un error en tu RUT puede generar inconsistencias en toda la declaración. Verifica actividad económica, dirección y responsabilidades.",
    color: "text-[#0F5C6E]",
    bg: "bg-[#0F5C6E]/5",
  },
  {
    icon: CheckCircle,
    titulo: "Cada valor debe tener soporte",
    descripcion: "No asumas beneficios sin documentación. Mantén facturas, certificados y extractos que sustenten los valores en tu declaración.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: AlertTriangle,
    titulo: "Revisa topes y condiciones",
    descripcion: "Antes de presentar, verifica que la información corresponda al año gravable 2025 y revisa los límites de cada deducción y beneficio.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

export default function Recomendaciones() {
  return (
    <section className="py-14 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
            Recomendaciones clave
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Sigue estos consejos para preparar tu declaración de renta de forma correcta y sin contratiempos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {recomendaciones.map((rec) => {
            const Icon = rec.icon;
            return (
              <div
                key={rec.titulo}
                className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 ${rec.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${rec.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{rec.titulo}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{rec.descripcion}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
