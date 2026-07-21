import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  obtenerTodosVencimientos,
  cargarCalendario,
  obtenerHistorialCargas,
  actualizarVencimiento,
  eliminarVencimiento,
} from "@/services/calendario.service";
import { esquemaCalendarioCompleto, validarSolapamientos } from "@/lib/zod/calendario";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const anio = searchParams.get("anio");
  const historial = searchParams.get("historial");

  if (historial === "true") {
    const cargas = await obtenerHistorialCargas(session.user.id);
    return NextResponse.json(cargas);
  }

  const anioGravable = anio ? parseInt(anio) : new Date().getFullYear();
  const vencimientos = await obtenerTodosVencimientos(anioGravable);
  return NextResponse.json(vencimientos);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { filas, nombre_archivo } = body;

  // Validar filas con Zod
  const validacion = esquemaCalendarioCompleto.safeParse(filas);
  if (!validacion.success) {
    return NextResponse.json(
      { error: "Datos inválidos", detalles: validacion.error.format() },
      { status: 400 }
    );
  }

  // Verificar solapamientos
  const filasValidadas = validacion.data;
  const solapamientos = validarSolapamientos(filasValidadas);
  if (solapamientos.length > 0) {
    return NextResponse.json(
      { error: "Solapamientos detectados", detalles: solapamientos },
      { status: 400 }
    );
  }

  // Convertir fechas string a Date
  const filasConFecha = filasValidadas.map((f) => ({
    ...f,
    fecha_vencimiento: new Date(f.fecha_vencimiento),
  }));

  const resultado = await cargarCalendario(
    session.user.id,
    nombre_archivo || "carga_manual.json",
    filasConFecha
  );

  return NextResponse.json(resultado);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { id, fecha_vencimiento } = body;

  if (!id || !fecha_vencimiento) {
    return NextResponse.json({ error: "Faltan campos: id, fecha_vencimiento" }, { status: 400 });
  }

  const actualizado = await actualizarVencimiento(id, new Date(fecha_vencimiento));
  return NextResponse.json(actualizado);
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Falta parámetro id" }, { status: 400 });
  }

  await eliminarVencimiento(id);
  return NextResponse.json({ ok: true });
}
