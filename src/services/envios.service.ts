import { prisma } from "@/lib/prisma";

export async function registrarEnvio(data: {
  contador_id: string;
  cliente_id: string;
  plantilla_id?: string;
  mensaje_enviado: string;
  notas?: string;
}) {
  return prisma.envioLog.create({ data });
}

export async function obtenerHistorialEnvios(
  contadorId: string,
  options?: {
    page?: number;
    limit?: number;
    clienteId?: string;
  }
) {
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { contador_id: contadorId };

  if (options?.clienteId) {
    where.cliente_id = options.clienteId;
  }

  const [envios, total] = await Promise.all([
    prisma.envioLog.findMany({
      where,
      orderBy: { fecha_marcado: "desc" },
      skip,
      take: limit,
      include: { cliente: true },
    }),
    prisma.envioLog.count({ where }),
  ]);

  return {
    envios,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function yaSeEnvioHoy(contadorId: string, clienteId: string): Promise<boolean> {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const existe = await prisma.envioLog.findFirst({
    where: {
      contador_id: contadorId,
      cliente_id: clienteId,
      fecha_marcado: { gte: hoy },
    },
  });

  return !!existe;
}
