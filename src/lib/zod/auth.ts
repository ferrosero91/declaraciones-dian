import { z } from "zod";

export const esquemaLogin = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export const esquemaRegistro = z.object({
  nombre_completo: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  telefono: z.string().optional().or(z.literal("")),
});
