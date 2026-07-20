import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { obtenerClientesConVencimiento, crearCliente, actualizarCliente, eliminarCliente } from "@/services/clientes.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const clientes = await obtenerClientesConVencimiento(session.user.id);
  return NextResponse.json(clientes);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const cliente = await crearCliente({
    contador_id: session.user.id,
    ...body,
  });

  return NextResponse.json(cliente);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...data } = body;

  await actualizarCliente(id, session.user.id, data);
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

  await eliminarCliente(id, session.user.id);
  return NextResponse.json({ success: true });
}
