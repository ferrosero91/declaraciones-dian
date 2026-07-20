import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registrarContador(data: {
  nombre_completo: string;
  email: string;
  password: string;
  telefono?: string;
}) {
  const existe = await prisma.contador.findUnique({
    where: { email: data.email },
  });
  if (existe) {
    throw new Error("Ya existe un contador con ese email");
  }

  const password_hash = await bcrypt.hash(data.password, 12);

  const contador = await prisma.contador.create({
    data: {
      nombre_completo: data.nombre_completo,
      email: data.email,
      password_hash,
      telefono: data.telefono,
    },
  });

  // Crear configuración por defecto
  await prisma.configuracionContador.create({
    data: { contador_id: contador.id },
  });

  // Crear plantilla por defecto
  await prisma.plantillaMensaje.create({
    data: {
      contador_id: contador.id,
      nombre: "Recordatorio de Declaración",
      nivel_urgencia: "cualquiera",
      cuerpo_texto: `Estimado(a) {{nombre}}:

Le escribo de parte del contador Elier Fernando Rosero Bravo para recordarle que la fecha límite para presentar su Declaración de Renta del Año Gravable 2025 es el {{fecha_vencimiento}}.

Para elaborar su declaración de manera correcta, necesitamos los siguientes documentos:

{{documentos}}

Le solicito amablemente enviar los soportes a la mayor brevedad posible para evitar contratiempos con la DIAN. Si tiene alguna consulta, no dude en comunicarse con nosotros.

Atentamente,
Contador Elier Fernando Rosero Bravo
Cédula Profesional`,
      usar_ia: false,
      activa: true,
    },
  });

  return contador;
}

export async function obtenerContadorPorEmail(email: string) {
  return prisma.contador.findUnique({ where: { email } });
}
