import {
  FileCheck,
  Home,
  Briefcase,
  TrendingDown,
  Calculator,
  Users,
  Gift,
  Shield,
} from "lucide-react";

const categorias = [
  {
    icon: FileCheck,
    titulo: "RUT",
    documentos: [
      "RUT actualizado",
      "Actividad económica vigente",
      "Dirección y responsabilidades",
    ],
  },
  {
    icon: Home,
    titulo: "Patrimonio",
    documentos: [
      "Escrituras y libertad de tradición",
      "Certificado de propiedad",
      "Factura de vehículos",
      "Saldos de billeteras digitales",
    ],
  },
  {
    icon: Briefcase,
    titulo: "Ingresos",
    documentos: [
      "Formato 220 (trabajo dependiente)",
      "Certificado de ingresos y retenciones",
      "Extractos bancarios del año",
      "Certificados de arrendamientos",
    ],
  },
  {
    icon: TrendingDown,
    titulo: "Deducciones",
    documentos: [
      "Planillas PILA (salud y pensión)",
      "Certificado de intereses de vivienda",
      "Pólizas de medicina prepagada",
      "Certificado de ahorro a largo plazo",
    ],
  },
  {
    icon: Calculator,
    titulo: "Pasivos",
    documentos: [
      "Certificados de créditos financieros",
      "Saldos de tarjetas de crédito",
      "Contratos de préstamos",
      "Impuestos no pagados al cierre",
    ],
  },
  {
    icon: Users,
    titulo: "Familia",
    documentos: [
      "Registro civil de nacimiento",
      "Certificados de estudio",
      "Soporte de dependencia económica",
    ],
  },
  {
    icon: Gift,
    titulo: "Ingresos Extraordinarios",
    documentos: [
      "Escrituras de venta de activos",
      "Documentos de herencias y legados",
      "Certificados de loterías y premios",
    ],
  },
  {
    icon: Shield,
    titulo: "Beneficios Tributarios",
    documentos: [
      "Certificado de donaciones",
      "Certificado GMF (4x1000)",
      "Facturas electrónicas de compras",
      "Certificado de ICA y predial",
    ],
  },
];

export default function Checklist() {
  return (
    <section className="py-14 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
            Lista de chequeo de documentos
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Organiza tu información por categorías para preparar tu declaración de renta del año gravable 2025.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {categorias.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.titulo}
                className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#0F5C6E]/10 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#0F5C6E]" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">{cat.titulo}</h3>
                </div>
                <ul className="space-y-1.5">
                  {cat.documentos.map((doc) => (
                    <li key={doc} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0F5C6E] mt-1.5 shrink-0" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
