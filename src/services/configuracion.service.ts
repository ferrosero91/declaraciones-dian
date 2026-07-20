import { prisma } from "@/lib/prisma";

export async function obtenerConfiguracion(contadorId: string) {
  let config = await prisma.configuracionContador.findUnique({
    where: { contador_id: contadorId },
  });

  if (!config) {
    config = await prisma.configuracionContador.create({
      data: { contador_id: contadorId },
    });
  }

  return config;
}

export async function actualizarConfiguracion(
  contadorId: string,
  data: {
    umbral_urgente_dias?: number;
    umbral_proximo_dias?: number;
    umbral_vigilar_dias?: number;
  }
) {
  await obtenerConfiguracion(contadorId);

  return prisma.configuracionContador.update({
    where: { contador_id: contadorId },
    data,
  });
}

export async function actualizarPerfilContador(
  contadorId: string,
  data: {
    nombre_completo?: string;
    telefono?: string;
  }
) {
  return prisma.contador.update({
    where: { id: contadorId },
    data,
  });
}
