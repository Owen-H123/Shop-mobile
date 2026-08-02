/**
 * Formatea un número como moneda en Soles peruanos.
 * Ej: formatCurrency(25) -> "S/ 25.00"
 */
export function formatCurrency(value: number): string {
  return `S/ ${value.toFixed(2)}`;
}
