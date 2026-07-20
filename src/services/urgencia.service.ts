import { prisma } from "@/lib/prisma";
import { calcularColorUrgenciaPura } from "@/lib/urgencia";
export { calcularColorUrgenciaPura, generarLinkWhatsApp, renderizarPlantilla, obtenerColorHex, obtenerLabelColor } from "@/lib/urgencia";

export async function calcularColorUrgencia(
  contadorId: string,
  fechaVencimiento: Date
) {
  const config = await prisma.configuracionContador.findUnique({
    where: { contador_id: contadorId },
  });

  const umbrales = {
    urgente: config?.umbral_urgente_dias ?? 5,
    proximo: config?.umbral_proximo_dias ?? 15,
    vigilar: config?.umbral_vigilar_dias ?? 30,
  };

  return calcularColorUrgenciaPura(fechaVencimiento, umbrales);
}
