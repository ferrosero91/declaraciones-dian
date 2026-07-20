import { prisma } from "@/lib/prisma";

export async function obtenerPlantillas(contadorId: string) {
  return prisma.plantillaMensaje.findMany({
    where: { contador_id: contadorId },
    orderBy: { created_at: "desc" },
  });
}

export async function obtenerPlantillaPorId(id: string, contadorId: string) {
  return prisma.plantillaMensaje.findFirst({
    where: { id, contador_id: contadorId },
  });
}

export async function obtenerPlantillaActiva(contadorId: string, nivelUrgencia?: string) {
  if (nivelUrgencia && nivelUrgencia !== "cualquiera") {
    const especifica = await prisma.plantillaMensaje.findFirst({
      where: {
        contador_id: contadorId,
        nivel_urgencia: nivelUrgencia,
        activa: true,
      },
    });
    if (especifica) return especifica;
  }

  return prisma.plantillaMensaje.findFirst({
    where: {
      contador_id: contadorId,
      nivel_urgencia: "cualquiera",
      activa: true,
    },
  });
}

export async function crearPlantilla(data: {
  contador_id: string;
  nombre: string;
  nivel_urgencia?: string;
  cuerpo_texto: string;
  usar_ia?: boolean;
}) {
  return prisma.plantillaMensaje.create({
    data: {
      contador_id: data.contador_id,
      nombre: data.nombre,
      nivel_urgencia: data.nivel_urgencia ?? "cualquiera",
      cuerpo_texto: data.cuerpo_texto,
      usar_ia: data.usar_ia ?? false,
    },
  });
}

export async function actualizarPlantilla(
  id: string,
  contadorId: string,
  data: {
    nombre?: string;
    nivel_urgencia?: string;
    cuerpo_texto?: string;
    usar_ia?: boolean;
    activa?: boolean;
  }
) {
  return prisma.plantillaMensaje.updateMany({
    where: { id, contador_id: contadorId },
    data,
  });
}

export async function eliminarPlantilla(id: string, contadorId: string) {
  return prisma.plantillaMensaje.deleteMany({
    where: { id, contador_id: contadorId },
  });
}
