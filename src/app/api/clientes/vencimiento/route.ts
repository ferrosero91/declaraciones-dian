import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const cedula = searchParams.get("cedula");
  if (!cedula) {
    return NextResponse.json({ error: "Cédula requerida" }, { status: 400 });
  }

  const ultimoAnio = await prisma.calendarioVencimiento.findFirst({
    orderBy: { anio_gravable: "desc" },
    select: { anio_gravable: true },
  });
  const anioBusqueda = ultimoAnio?.anio_gravable ?? new Date().getFullYear();

  const ultimosDosDigitos = parseInt(cedula.slice(-2), 10);
  if (isNaN(ultimosDosDigitos)) {
    return NextResponse.json({ fecha_vencimiento: null });
  }

  const vencimiento = await prisma.calendarioVencimiento.findFirst({
    where: {
      anio_gravable: anioBusqueda,
      terminacion_inicio: { lte: ultimosDosDigitos },
      terminacion_fin: { gte: ultimosDosDigitos },
    },
  });

  if (!vencimiento) {
    return NextResponse.json({ fecha_vencimiento: null });
  }

  const fechaStr = vencimiento.fecha_vencimiento.toISOString().split("T")[0];
  return NextResponse.json({ fecha_vencimiento: fechaStr });
}
