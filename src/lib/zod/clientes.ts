import { z } from "zod";

export const esquemaCliente = z.object({
  nombre_completo: z.string().min(2, "Mínimo 2 caracteres"),
  cedula: z.string().min(5, "Mínimo 5 caracteres").max(20),
  celular_whatsapp: z.string().min(10, "Mínimo 10 caracteres").optional().or(z.literal("")),
  tipo_ingresos: z.enum(["empleado", "independiente", "pensionado", "mixto", "otro"]),
  notas: z.string().optional().or(z.literal("")),
});

export const esquemaBusquedaCliente = z.object({
  q: z.string().optional(),
  tipo_ingresos: z.enum(["empleado", "independiente", "pensionado", "mixto", "otro", "todos"]).optional(),
  color: z.enum(["vencido", "urgente", "proximo", "vigilar", "tranquilo", "completado", "todos"]).optional(),
});
