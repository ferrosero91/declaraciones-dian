import { z } from "zod";

export const esquemaPlantilla = z.object({
  nombre: z.string().min(1, "Requerido"),
  nivel_urgencia: z.enum(["vencido", "urgente", "proximo", "vigilar", "tranquilo", "cualquiera"]),
  cuerpo_texto: z.string().min(10, "Mínimo 10 caracteres"),
  usar_ia: z.boolean(),
  activa: z.boolean(),
});

export const esquemaEnvio = z.object({
  cliente_id: z.string(),
  plantilla_id: z.string().optional(),
  mensaje: z.string().min(1, "Requerido"),
});
