import { prisma } from "@/lib/prisma";

export async function obtenerDocumentosPorPerfil(tipoIngresos: string) {
  return prisma.documentoPorPerfil.findMany({
    where: { tipo_ingresos: tipoIngresos },
    orderBy: { obligatorio: "desc" },
  });
}

export async function obtenerTodosDocumentos() {
  return prisma.documentoPorPerfil.findMany({
    orderBy: [{ tipo_ingresos: "asc" }, { obligatorio: "desc" }],
  });
}

export async function crearDocumento(data: {
  tipo_ingresos: string;
  documento: string;
  obligatorio?: boolean;
}) {
  return prisma.documentoPorPerfil.create({ data });
}

export async function eliminarDocumento(id: string) {
  return prisma.documentoPorPerfil.delete({ where: { id } });
}

export function armarChecklistDocumentos(documentos: { documento: string; obligatorio: boolean }[]): string {
  return documentos
    .filter((d) => d.obligatorio)
    .map((d) => `- ${d.documento}`)
    .join("\n");
}
