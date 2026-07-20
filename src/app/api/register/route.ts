import { NextResponse } from "next/server";
import { registrarContador } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre_completo, email, password, telefono } = body;

    if (!nombre_completo || !email || !password) {
      return NextResponse.json(
        { error: "Nombre, email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const contador = await registrarContador({
      nombre_completo,
      email,
      password,
      telefono,
    });

    return NextResponse.json({ success: true, id: contador.id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al registrar";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
