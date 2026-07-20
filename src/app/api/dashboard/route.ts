import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calcularColorUrgenciaPura } from "@/lib/urgencia";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const contadorId = session.user.id;

  const [clientes, config, enviosHoy, enviosTotal] = await Promise.all([
    prisma.cliente.findMany({
      where: { contador_id: contadorId, activo: true },
      include: {
        envios: {
          where: {
            fecha_marcado: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
          select: { id: true },
        },
      },
    }),
    prisma.configuracionContador.findUnique({
      where: { contador_id: contadorId },
    }),
    prisma.envioLog.count({
      where: {
        contador_id: contadorId,
        fecha_marcado: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    prisma.envioLog.count({
      where: { contador_id: contadorId },
    }),
  ]);

  const umbrales = {
    urgente: config?.umbral_urgente_dias ?? 5,
    proximo: config?.umbral_proximo_dias ?? 15,
    vigilar: config?.umbral_vigilar_dias ?? 30,
  };

  // Calcular vencimientos y colores para cada cliente
  const ultimoAnio = await prisma.calendarioVencimiento.findFirst({
    orderBy: { anio_gravable: "desc" },
    select: { anio_gravable: true },
  });
  const anioGravable = ultimoAnio?.anio_gravable ?? new Date().getFullYear();
  let clientesConColor = await Promise.all(
    clientes.map(async (cliente) => {
      const ultimosDosDigitos = parseInt(cliente.cedula.slice(-2)) || 0;

      const vencimiento = await prisma.calendarioVencimiento.findFirst({
        where: {
          anio_gravable: anioGravable,
          terminacion_inicio: { lte: ultimosDosDigitos },
          terminacion_fin: { gte: ultimosDosDigitos },
        },
      });

      let color = "tranquilo";
      if (cliente.estado_declaracion === "elaborada") {
        color = "completado";
      } else if (vencimiento) {
        color = calcularColorUrgenciaPura(vencimiento.fecha_vencimiento, umbrales);
      }

      return {
        id: cliente.id,
        nombre_completo: cliente.nombre_completo,
        cedula: cliente.cedula,
        tipo_ingresos: cliente.tipo_ingresos,
        estado_declaracion: cliente.estado_declaracion,
        color,
        fecha_vencimiento: vencimiento?.fecha_vencimiento?.toISOString() || null,
        envios_hoy: cliente.envios.length > 0,
      };
    })
  );

  // Ordenar por urgencia
  const ordenColor: Record<string, number> = {
    vencido: 0,
    urgente: 1,
    proximo: 2,
    vigilar: 3,
    tranquilo: 4,
    completado: 5,
  };
  clientesConColor.sort((a, b) => (ordenColor[a.color] ?? 5) - (ordenColor[b.color] ?? 5));

  const stats = {
    total: clientes.length,
    vencidos: clientesConColor.filter((c) => c.color === "vencido").length,
    urgentes: clientesConColor.filter((c) => c.color === "urgente").length,
    proximos: clientesConColor.filter((c) => c.color === "proximo").length,
    vigilar: clientesConColor.filter((c) => c.color === "vigilar").length,
    tranquilos: clientesConColor.filter((c) => c.color === "tranquilo").length,
    pendientes: clientesConColor.filter((c) => c.estado_declaracion === "pendiente").length,
    enProceso: clientesConColor.filter((c) => c.estado_declaracion === "en_proceso").length,
    elaboradas: clientesConColor.filter((c) => c.estado_declaracion === "elaborada").length,
    pendientesContactarHoy: clientesConColor.filter(
      (c) => !c.envios_hoy && ["vencido", "urgente", "proximo"].includes(c.color)
    ).length,
    enviosHoy,
    enviosTotal,
  };

  return NextResponse.json({ stats, clientes: clientesConColor });
}
