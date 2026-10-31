export const MAX_VALUE = 100_000_000;
export function parseHomeValue(text) {
  const cleaned = String(text).trim().replace(/[$,\s]/g, '');
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) && value > 0 && value <= MAX_VALUE ? value : null;
}
export function estimate(value, outcome) {
  if (!Number.isFinite(value) || value <= 0 || value > MAX_VALUE) throw new RangeError('Invalid home value');
  const rates = { both: 0.00025, q1: 0, neither: -0.000625 };
  if (!Object.hasOwn(rates, outcome)) throw new RangeError('Invalid outcome');
  const todayAnnual = value * rates[outcome];
  const noBondAnnual = outcome === 'neither' ? 0 : todayAnnual + value * 0.000625;
  return { todayAnnual, todayMonthly: todayAnnual / 12, noBondAnnual, noBondMonthly: noBondAnnual / 12 };
}
