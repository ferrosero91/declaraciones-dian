import { prisma } from "@/lib/prisma";
import { calcularColorUrgenciaPura } from "@/lib/urgencia";
import { CalendarioVencimiento } from "@/generated/prisma";

export async function obtenerClientesPorContador(contadorId: string) {
  return prisma.cliente.findMany({
    where: { contador_id: contadorId },
    orderBy: { created_at: "desc" },
  });
}

export async function obtenerClientePorId(id: string, contadorId: string) {
  return prisma.cliente.findFirst({
    where: { id, contador_id: contadorId },
  });
}

export async function crearCliente(data: {
  contador_id: string;
  cedula: string;
  nombre_completo: string;
  celular_whatsapp?: string;
  tipo_ingresos: string;
  notas?: string;
}) {
  return prisma.cliente.create({ data });
}

export async function actualizarCliente(
  id: string,
  contadorId: string,
  data: {
    cedula?: string;
    nombre_completo?: string;
    celular_whatsapp?: string;
    tipo_ingresos?: string;
    activo?: boolean;
    completado?: boolean;
    notas?: string;
  }
) {
  return prisma.cliente.updateMany({
    where: { id, contador_id: contadorId },
    data,
  });
}

export async function eliminarCliente(id: string, contadorId: string) {
  return prisma.cliente.deleteMany({
    where: { id, contador_id: contadorId },
  });
}

export async function toggleCompletado(id: string, contadorId: string) {
  const cliente = await prisma.cliente.findFirst({
    where: { id, contador_id: contadorId },
  });
  if (!cliente) throw new Error("Cliente no encontrado");

  return prisma.cliente.updateMany({
    where: { id, contador_id: contadorId },
    data: { completado: !cliente.completado },
  });
}

export type ClienteConVencimiento = {
  id: string;
  nombre_completo: string;
  cedula: string;
  celular_whatsapp: string | null;
  tipo_ingresos: string;
  activo: boolean;
  completado: boolean;
  notas: string | null;
  fecha_vencimiento: string | null;
  color_urgencia: string;
  dias_restantes: number | null;
};

export async function obtenerClientesConVencimiento(
  contadorId: string
): Promise<ClienteConVencimiento[]> {
  const clientes = await prisma.cliente.findMany({
    where: { contador_id: contadorId },
    orderBy: { created_at: "desc" },
  });

  const ultimoAnio = await prisma.calendarioVencimiento.findFirst({
    orderBy: { anio_gravable: "desc" },
    select: { anio_gravable: true },
  });
  const anioBusqueda = ultimoAnio?.anio_gravable ?? new Date().getFullYear();
  const config = await prisma.configuracionContador.findUnique({
    where: { contador_id: contadorId },
  });

  const umbrales = {
    urgente: config?.umbral_urgente_dias ?? 5,
    proximo: config?.umbral_proximo_dias ?? 15,
    vigilar: config?.umbral_vigilar_dias ?? 30,
  };

  const vencimientos = await prisma.calendarioVencimiento.findMany({
    where: { anio_gravable: anioBusqueda },
  });

  return Promise.all(
    clientes.map(async (cliente) => {
      if (cliente.completado) {
        return {
          ...cliente,
          fecha_vencimiento: null,
          color_urgencia: "completado",
          dias_restantes: null,
        };
      }

      const ultimosDosDigitos = parseInt(cliente.cedula.slice(-2), 10);
      const vencimiento = vencimientos.find(
        (v) =>
          ultimosDosDigitos >= v.terminacion_inicio &&
          ultimosDosDigitos <= v.terminacion_fin
      );

      if (!vencimiento) {
        return {
          ...cliente,
          fecha_vencimiento: null,
          color_urgencia: "tranquilo",
          dias_restantes: null,
        };
      }

      const fechaVen = new Date(vencimiento.fecha_vencimiento);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      fechaVen.setHours(0, 0, 0, 0);
      const diasRestantes = Math.ceil(
        (fechaVen.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
      );

      const color = calcularColorUrgenciaPura(fechaVen, umbrales);

      return {
        ...cliente,
        fecha_vencimiento: vencimiento.fecha_vencimiento.toISOString().split("T")[0],
        color_urgencia: color,
        dias_restantes: diasRestantes,
      };
    })
  );
}
