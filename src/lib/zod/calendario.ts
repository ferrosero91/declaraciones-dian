import { z } from "zod";

export const esquemaFilaCalendario = z.object({
  anio_gravable: z.number().int().min(2020).max(2030),
  terminacion_inicio: z.number().int().min(0).max(99),
  terminacion_fin: z.number().int().min(0).max(99),
  fecha_vencimiento: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Fecha inválida",
  }),
});

export const esquemaCalendarioCompleto = z.array(esquemaFilaCalendario);

export function validarSolapamientos(filas: { terminacion_inicio: number; terminacion_fin: number }[]): string[] {
  const errores: string[] = [];
  for (let i = 0; i < filas.length; i++) {
    for (let j = i + 1; j < filas.length; j++) {
      const a = filas[i];
      const b = filas[j];
      // Verificar solapamiento:两个 rangos se solapan si uno empieza antes de que termine el otro
      if (a.terminacion_inicio <= b.terminacion_fin && b.terminacion_inicio <= a.terminacion_fin) {
        errores.push(`Rangos solapados: filas ${i + 1} y ${j + 1} (terminaciones ${a.terminacion_inicio}-${a.terminacion_fin} y ${b.terminacion_inicio}-${b.terminacion_fin})`);
      }
    }
  }
  return errores;
}
