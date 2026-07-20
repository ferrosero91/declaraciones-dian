import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { pulirMensaje } from "@/services/groq.service";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { mensaje } = body;

  if (!mensaje) {
    return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 });
  }

  const mensajeMejorado = await pulirMensaje(mensaje);
  return NextResponse.json({ mensaje: mensajeMejorado });
}
