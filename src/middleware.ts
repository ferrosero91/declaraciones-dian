import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rutasPublicas = ["/login", "/register", "/api/auth"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir rutas públicas
  if (rutasPublicas.some((ruta) => pathname.startsWith(ruta))) {
    return NextResponse.next();
  }

  // Permitir archivos estáticos
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Por ahora, permitir todo (la validación de sesión se hace en Server Components)
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
