import { NextResponse } from "next/server";
import { obtenerDocumentosPorPerfil, obtenerTodosDocumentos } from "@/services/documentos.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get("tipo");

  if (tipo) {
    const documentos = await obtenerDocumentosPorPerfil(tipo);
    return NextResponse.json(documentos);
  }

  const todos = await obtenerTodosDocumentos();
  return NextResponse.json(todos);
}
