import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const DOCUMENTOS_POR_PERFIL = {
  empleado: [
    "RUT actualizado",
    "Formato 220 (Ingresos y Retenciones)",
    "Certificado de ingresos y retenciones del empleador",
    "Extractos bancarios (año completo)",
    "Certificado de aportes a fondos de pensiones",
    "Certificado de aportes a salud (PILA o nómina)",
    "Certificado de ahorro voluntario (si aplica)",
    "Certificado de educación (si aplica)",
    "Certificado de intereses de crédito de vivienda (si aplica)",
    "Certificado de medicina prepagada (si aplica)",
    "Certificado de donaciones a entidades sin ánimo de lucro (si aplica)",
  ],
  independiente: [
    "RUT actualizado",
    "Certificado de ingresos y retenciones en la fuente",
    "Extractos bancarios (año completo)",
    "Factura electrónica de ventas (DIAN)",
    "Libros contables o registro de ingresos y gastos",
    "Certificado de aportes a salud y pensión (PILA)",
    "Certificado de IVA descontable (si aplica)",
    "Certificado de retención en la fuente practicada",
    "Comprobantes de gastos deducibles con factura electrónica",
    "Certificado de intereses de crédito de vivienda (si aplica)",
    "Certificado de medicina prepagada (si aplica)",
    "Certificado de donaciones a entidades sin ánimo de lucro (si aplica)",
  ],
  pensionado: [
    "RUT actualizado",
    "Certificado de ingresos y retenciones por pensiones",
    "Certificado de pensión (jubilación, invalidez o vejez)",
    "Extractos bancarios (año completo)",
    "Certificado de aportes a salud",
    "Certificado de ahorro voluntario (si aplica)",
    "Certificado de intereses de crédito de vivienda (si aplica)",
  ],
  mixto: [
    "RUT actualizado",
    "Formato 220 (Ingresos y Retenciones)",
    "Certificado de ingresos y retenciones del empleador",
    "Certificado de ingresos y retenciones por actividades independientes",
    "Extractos bancarios (año completo)",
    "Factura electrónica de ventas (DIAN)",
    "Libros contables o registro de ingresos y gastos",
    "Certificado de aportes a salud y pensión (PILA y/o nómina)",
    "Certificado de ahorro voluntario (si aplica)",
    "Certificado de IVA descontable (si aplica)",
    "Certificado de intereses de crédito de vivienda (si aplica)",
    "Certificado de medicina prepagada (si aplica)",
    "Certificado de donaciones a entidades sin ánimo de lucro (si aplica)",
  ],
  otro: [
    "RUT actualizado",
    "Extractos bancarios (año completo)",
    "Certificados de ingresos recibidos",
    "Comprobantes de gastos deducibles",
    "Certificado de aportes a salud y pensión",
  ],
};

async function main() {
  console.log("Seeding documentos_por_perfil...");
  for (const [tipo, documentos] of Object.entries(DOCUMENTOS_POR_PERFIL)) {
    // Eliminar documentos existentes para este tipo
    await prisma.documentoPorPerfil.deleteMany({
      where: { tipo_ingresos: tipo },
    });

    for (const doc of documentos) {
      await prisma.documentoPorPerfil.create({
        data: {
          tipo_ingresos: tipo,
          documento: doc,
          obligatorio: true,
        },
      });
    }
    console.log(`  ${tipo}: ${documentos.length} documentos`);
  }

  const totalDocs = Object.values(DOCUMENTOS_POR_PERFIL).flat().length;
  console.log(`Total: ${totalDocs} documentos creados`);

  console.log("Seed completado!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
