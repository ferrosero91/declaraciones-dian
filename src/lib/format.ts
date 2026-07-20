export function formatFechaLocal(fechaIso: string): string {
  const parts = fechaIso.split("T")[0].split("-");
  return `${parseInt(parts[2])}/${parseInt(parts[1])}/${parts[0]}`;
}
