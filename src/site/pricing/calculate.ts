import { pricedTiers, type PricingConfig, type PricingTier } from '../../config/pricing';

export type Billing = 'monat' | 'jahr';

export interface EstimateInput {
  employees: unknown;
  billing?: unknown;
  setup?: unknown;
  gross?: unknown;
}

export interface NormalizedInput {
  employees: number;
  billing: Billing;
  setup: boolean;
  /** Nur wirksam, wenn vatMode = 'net'. */
  gross: boolean;
}

export interface UpgradeHint {
  limit: number;
  nextTier: PricingTier;
}

export interface CustomEstimate {
  kind: 'custom';
  input: NormalizedInput;
  tier: PricingTier;
}

export interface PricedEstimate {
  kind: 'priced';
  input: NormalizedInput;
  tier: PricingTier;
  /** Faktor für Brutto-Anzeige (1 oder 1 + vatRate). */
  vatFactor: number;
  /** Listenpreis bei monatlicher Zahlung. */
  monthlyListPrice: number;
  /** Rechnerische Kosten pro Monat bei der gewählten Zahlweise. */
  perMonth: number;
  perYear: number;
  perEmployeeMonth: number;
  setup: number;
  firstYearTotal: number;
  /** Ersparnis pro Jahr bei jährlicher gegenüber monatlicher Zahlung. */
  yearlySavings: number;
  upgradeHint: UpgradeHint | null;
}

export type Estimate = CustomEstimate | PricedEstimate;

function toNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') return Number(value.replace(',', '.'));
  return Number.NaN;
}

function toBool(value: unknown): boolean {
  return value === true || value === 1 || value === '1' || value === 'true' || value === 'ja';
}

export function normalizeInput(input: EstimateInput, config: PricingConfig): NormalizedInput {
  const { minEmployees, maxEmployees } = config.calculator;
  const raw = Math.round(toNumber(input.employees));
  const employees = Number.isFinite(raw) ? Math.min(maxEmployees, Math.max(minEmployees, raw)) : minEmployees;
  return {
    employees,
    billing: input.billing === 'jahr' ? 'jahr' : 'monat',
    setup: toBool(input.setup),
    gross: config.vatMode === 'net' && toBool(input.gross),
  };
}

/** Kleinster Tarif, dessen Mitarbeitergrenze reicht; sonst der Tarif ohne Grenze. */
export function findTier(employees: number, config: PricingConfig): PricingTier {
  const fitting = pricedTiers(config).find((t) => employees <= (t.maxEmployees ?? 0));
  if (fitting) return fitting;
  const unlimited = config.tiers.find((t) => t.maxEmployees === null);
  if (!unlimited) throw new Error('pricing: Tarif ohne Mitarbeitergrenze fehlt');
  return unlimited;
}

/** Reine Berechnung ohne Formatierung – Rundung erfolgt erst in der Anzeige. */
export function calculateEstimate(input: EstimateInput, config: PricingConfig): Estimate {
  const normalized = normalizeInput(input, config);
  const tier = findTier(normalized.employees, config);
  if (tier.monthlyNet === null || tier.maxEmployees === null) {
    return { kind: 'custom', input: normalized, tier };
  }

  const vatFactor = normalized.gross ? 1 + config.vatRate : 1;
  const monthlyListPrice = tier.monthlyNet * vatFactor;
  const paidMonthsPerYear = normalized.billing === 'jahr' ? 12 - config.yearlyFreeMonths : 12;
  const perYear = monthlyListPrice * paidMonthsPerYear;
  const perMonth = perYear / 12;
  const setup = normalized.setup ? config.setupService.price * vatFactor : 0;

  const tiers = config.tiers;
  const nextTier = tiers[tiers.indexOf(tier) + 1];
  const upgradeHint =
    nextTier && normalized.employees >= tier.maxEmployees - 1 ? { limit: tier.maxEmployees, nextTier } : null;

  return {
    kind: 'priced',
    input: normalized,
    tier,
    vatFactor,
    monthlyListPrice,
    perMonth,
    perYear,
    perEmployeeMonth: perMonth / normalized.employees,
    setup,
    firstYearTotal: perYear + setup,
    yearlySavings: monthlyListPrice * config.yearlyFreeMonths,
    upgradeHint,
  };
}
