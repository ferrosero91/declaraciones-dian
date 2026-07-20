import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { obtenerPlantillas, crearPlantilla, actualizarPlantilla, eliminarPlantilla } from "@/services/plantillas.service";
import { prisma } from "@/lib/prisma";

const PLANTILLA_DEFAULT = {
  nombre: "Recordatorio de Declaración",
  nivel_urgencia: "cualquiera",
  cuerpo_texto: `Estimado(a)(a) {{nombre}}:

Le escribo de parte del contador Elier Fernando Rosero Bravo para recordarle que la fecha límite para presentar su Declaración de Renta del Año Gravable 2025 es el {{fecha_vencimiento}}.

Para elaborar su declaración de manera correcta, necesitamos los siguientes documentos:

{{documentos}}

Le solicito amablemente enviar los soportes a la mayor brevedad posible para evitar contratiempos con la DIAN. Si tiene alguna consulta, no dude en comunicarse con nosotros.

Atentamente,
Contador Elier Fernando Rosero Bravo
Cédula Profesional`,
  usar_ia: false,
};

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let plantillas = await obtenerPlantillas(session.user.id);

  if (plantillas.length === 0) {
    await crearPlantilla({ contador_id: session.user.id, ...PLANTILLA_DEFAULT });
    plantillas = await obtenerPlantillas(session.user.id);
  }

  return NextResponse.json(plantillas);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const plantilla = await crearPlantilla({
    contador_id: session.user.id,
    ...body,
  });

  return NextResponse.json(plantilla);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...data } = body;

  await actualizarPlantilla(id, session.user.id, data);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  await eliminarPlantilla(id, session.user.id);
  return NextResponse.json({ success: true });
}
