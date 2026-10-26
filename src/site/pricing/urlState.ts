import type { EstimateInput, NormalizedInput } from './calculate';

/** Standardwerte, wenn die URL keine Rechnung enthält. */
export const DEFAULT_EMPLOYEES = 12;

/** Liest ?ma=18&zahlweise=jahr&einrichtung=1&brutto=1 – ungültige Werte korrigiert calculateEstimate. */
export function readEstimateParams(search: string): EstimateInput {
  const params = new URLSearchParams(search);
  return {
    employees: params.get('ma') ?? DEFAULT_EMPLOYEES,
    billing: params.get('zahlweise'),
    setup: params.get('einrichtung'),
    gross: params.get('brutto'),
  };
}

/** Schreibt die Rechnung in bestehende Query-Parameter (andere Parameter bleiben erhalten). */
export function writeEstimateParams(search: string, input: NormalizedInput): string {
  const params = new URLSearchParams(search);
  params.set('ma', String(input.employees));
  params.set('zahlweise', input.billing);
  if (input.setup) params.set('einrichtung', '1');
  else params.delete('einrichtung');
  if (input.gross) params.set('brutto', '1');
  else params.delete('brutto');
  const result = params.toString();
  return result ? `?${result}` : '';
}
