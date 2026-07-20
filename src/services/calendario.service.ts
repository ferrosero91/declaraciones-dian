import { prisma } from "@/lib/prisma";

export async function obtenerCalendarioPorTerminacion(
  anioGravable: number,
  terminacionCedula: number
) {
  return prisma.calendarioVencimiento.findFirst({
    where: {
      anio_gravable: anioGravable,
      terminacion_inicio: { lte: terminacionCedula },
      terminacion_fin: { gte: terminacionCedula },
    },
  });
}

export async function obtenerTodosVencimientos(anioGravable: number) {
  return prisma.calendarioVencimiento.findMany({
    where: { anio_gravable: anioGravable },
    orderBy: { terminacion_inicio: "asc" },
  });
}

export async function cargarCalendario(
  contadorId: string | null,
  archivoNombre: string,
  data: {
    anio_gravable: number;
    terminacion_inicio: number;
    terminacion_fin: number;
    fecha_vencimiento: Date;
  }[]
) {
  if (data.length === 0) return { total: 0, importadas: 0, conError: 0 };

  const anioGravable = data[0].anio_gravable;

  return prisma.$transaction(async (tx) => {
    // Eliminar registros existentes para ese año gravable
    const eliminados = await tx.calendarioVencimiento.deleteMany({
      where: { anio_gravable: anioGravable },
    });

    // Insertar nuevos registros
    const creados = await tx.calendarioVencimiento.createMany({
      data: data.map((d) => ({
        anio_gravable: d.anio_gravable,
        terminacion_inicio: d.terminacion_inicio,
        terminacion_fin: d.terminacion_fin,
        fecha_vencimiento: d.fecha_vencimiento,
        origen: "excel",
        created_by: contadorId,
      })),
    });

    // Registrar carga en auditoría
    await tx.cargaCalendario.create({
      data: {
        contador_id: contadorId,
        anio_gravable: anioGravable,
        nombre_archivo: archivoNombre,
        filas_importadas: creados.count,
        filas_con_error: 0,
        estado: "procesado",
      },
    });

    return {
      total: data.length,
      importadas: creados.count,
      conError: 0,
    };
  });
}

export async function obtenerHistorialCargas(contadorId: string) {
  return prisma.cargaCalendario.findMany({
    where: {
      OR: [
        { contador_id: contadorId },
        { contador_id: null },
      ],
    },
    orderBy: { importado_en: "desc" },
    take: 20,
  });
}
