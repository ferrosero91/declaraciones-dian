export type ColorUrgencia = "vencido" | "urgente" | "proximo" | "vigilar" | "tranquilo";

export function calcularColorUrgenciaPura(
  fechaVencimiento: Date,
  umbrales: { urgente: number; proximo: number; vigilar: number }
): ColorUrgencia {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const vencimiento = new Date(fechaVencimiento);
  vencimiento.setHours(0, 0, 0, 0);

  const diffDias = Math.ceil(
    (vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDias <= 0) return "vencido";
  if (diffDias <= umbrales.urgente) return "urgente";
  if (diffDias <= umbrales.proximo) return "proximo";
  if (diffDias <= umbrales.vigilar) return "vigilar";
  return "tranquilo";
}

export function generarLinkWhatsApp(telefono: string, mensaje: string): string {
  const telefonoLimpio = telefono.replace(/\D/g, "");
  const mensajeEncoded = encodeURIComponent(mensaje);
  return `https://wa.me/57${telefonoLimpio}?text=${mensajeEncoded}`;
}

export function renderizarPlantilla(
  plantilla: string,
  datos: {
    nombre?: string;
    fecha_vencimiento?: string;
    documentos?: string;
  }
): string {
  let resultado = plantilla;
  for (const [key, value] of Object.entries(datos)) {
    resultado = resultado.replace(new RegExp(`{{${key}}}`, "g"), value ?? "");
  }
  return resultado;
}

export function obtenerColorHex(color: string): string {
  const colores: Record<string, string> = {
    vencido: "#DC2626",
    urgente: "#EA580C",
    proximo: "#D97706",
    vigilar: "#2563EB",
    tranquilo: "#16A34A",
    completado: "#9CA3AF",
  };
  return colores[color] || "#9CA3AF";
}

export function obtenerLabelColor(color: string): string {
  const labels: Record<string, string> = {
    vencido: "Vencido",
    urgente: "Urgente",
    proximo: "Próximo",
    vigilar: "Vigilar",
    tranquilo: "Tranquilo",
    completado: "Completado",
  };
  return labels[color] || color;
}
