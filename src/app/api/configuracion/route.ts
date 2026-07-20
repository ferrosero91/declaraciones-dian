import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { obtenerConfiguracion, actualizarConfiguracion, actualizarPerfilContador } from "@/services/configuracion.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const [config, contador] = await Promise.all([
    obtenerConfiguracion(session.user.id),
    prisma.contador.findUnique({
      where: { id: session.user.id },
      select: { nombre_completo: true, telefono: true, email: true },
    }),
  ]);

  return NextResponse.json({
    ...config,
    perfil: contador,
  });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { perfil, umbrales } = body;

  if (perfil) {
    await actualizarPerfilContador(session.user.id, perfil);
  }

  if (umbrales) {
    await actualizarConfiguracion(session.user.id, umbrales);
  }

  return NextResponse.json({ success: true });
}
