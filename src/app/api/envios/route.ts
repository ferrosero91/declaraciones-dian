import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { registrarEnvio, obtenerHistorialEnvios, yaSeEnvioHoy } from "@/services/envios.service";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const clienteId = searchParams.get("clienteId") || undefined;

  const resultado = await obtenerHistorialEnvios(session.user.id, {
    page,
    clienteId,
  });

  return NextResponse.json(resultado);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { cliente_id, plantilla_id, mensaje_enviado, notas } = body;

  // Verificar si ya se envió hoy
  const yaEnvio = await yaSeEnvioHoy(session.user.id, cliente_id);
  if (yaEnvio) {
    return NextResponse.json(
      { warning: "Ya se envió un recordatorio a este cliente hoy", permitido: true },
      { status: 200 }
    );
  }

  const envio = await registrarEnvio({
    contador_id: session.user.id,
    cliente_id,
    plantilla_id,
    mensaje_enviado,
    notas,
  });

  return NextResponse.json(envio);
}
