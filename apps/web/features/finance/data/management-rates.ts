import { isFinancialDate, type Currency } from "./financial-records"

export type ManagementRate = {
  id: string
  effectiveOn: string
  arsPerUsd: number
  source: string
  valid: boolean
  revision: number
}
export type RateBook = { rates: ManagementRate[]; history: ManagementRate[] }
/** Evaluation references, not market quotes or an approved accounting policy. */
export const initialRateBook: RateBook = {
  rates: [
    ["2026-05-01", 1200],
    ["2026-06-01", 1225],
    ["2026-07-01", 1250],
    ["2026-08-01", 1275],
    ["2026-09-01", 1300],
    ["2026-10-01", 1325],
  ].map(([date, value], index) => ({
    id: `fx-eval-${index + 1}`,
    effectiveOn: String(date),
    arsPerUsd: Number(value),
    source: "Referencia sintética de gestión · sin proveedor externo",
    valid: true,
    revision: 1,
  })),
  history: [],
}
const storageKey = "abt-comex:demo:management-rates:v1"
let memory = initialRateBook
export function validManagementRate(rate: ManagementRate) {
  const scaled = Math.round(rate.arsPerUsd * 1_000_000)
  return (
    !!rate.id &&
    isFinancialDate(rate.effectiveOn) &&
    Number.isFinite(rate.arsPerUsd) &&
    rate.arsPerUsd > 0 &&
    Number.isSafeInteger(scaled) &&
    scaled > 0 &&
    Math.abs(rate.arsPerUsd * 1_000_000 - scaled) < 0.00001 &&
    !!rate.source?.trim() &&
    typeof rate.valid === "boolean" &&
    Number.isSafeInteger(rate.revision) &&
    rate.revision > 0
  )
}
export function reviseManagementRate(
  book: RateBook,
  draft: Omit<ManagementRate, "revision">
): RateBook {
  const previous = book.rates.find((rate) => rate.id === draft.id)
  if (previous && previous.effectiveOn !== draft.effectiveOn)
    throw new Error(
      "Conservá la fecha de la referencia existente; creá otra vigencia para una fecha diferente."
    )
  const next = { ...draft, revision: (previous?.revision ?? 0) + 1 }
  if (!validManagementRate(next))
    throw new Error(
      "Completá fecha válida, referencia e importe ARS por USD positivo, con hasta seis decimales."
    )
  if (
    book.rates.some(
      (rate) => rate.id !== next.id && rate.effectiveOn === next.effectiveOn
    )
  )
    throw new Error(
      "Ya existe una referencia para esa fecha. Revisá la existente."
    )
  return {
    rates: [...book.rates.filter((rate) => rate.id !== next.id), next].sort(
      (a, b) => a.effectiveOn.localeCompare(b.effectiveOn)
    ),
    history: previous ? [...book.history, previous] : book.history,
  }
}
export function parseRateBook(raw: string | null): RateBook {
  if (!raw) return initialRateBook
  try {
    const value = JSON.parse(raw) as RateBook
    if (
      !Array.isArray(value.rates) ||
      !Array.isArray(value.history) ||
      ![...value.rates, ...value.history].every(
        (rate) => rate && validManagementRate(rate)
      ) ||
      new Set(value.rates.map((rate) => rate.id)).size !== value.rates.length ||
      new Set(value.rates.map((rate) => rate.effectiveOn)).size !==
        value.rates.length
    )
      return initialRateBook
    return value
  } catch {
    return initialRateBook
  }
}
export function loadRateBook(): RateBook {
  if (typeof window === "undefined") return initialRateBook
  try {
    const raw = sessionStorage.getItem(storageKey)
    return raw ? parseRateBook(raw) : memory
  } catch {
    return memory
  }
}
export function saveRateBook(book: RateBook) {
  memory = book
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(book))
  } catch {
    /* Session memory remains usable. */
  }
  window.dispatchEvent(new Event("abt:demo-change"))
}
export function applicableRate(date: string, book: RateBook) {
  if (!isFinancialDate(date)) return undefined
  const latest = [...book.rates]
    .filter((rate) => rate.effectiveOn <= date)
    .sort((a, b) => b.effectiveOn.localeCompare(a.effectiveOn))[0]
  // An invalid reference explicitly leaves a gap; never silently reuse an older rate.
  return latest?.valid && validManagementRate(latest) ? latest : undefined
}
export type UsdValuation = {
  usdMicros: number
  usd: number
  rate?: ManagementRate
  valuedOn: string
}
/** Integer micro-USD precision (1e-6 USD). Original cents are never mutated.
 * Conversion rounds half up once at calculation precision; display rounds to cents.
 */
export function valueInUsd(
  amount: number | undefined,
  currency: Currency | string,
  date: string,
  book: RateBook
): UsdValuation | undefined {
  if (
    amount === undefined ||
    !Number.isFinite(amount) ||
    amount < 0 ||
    !isFinancialDate(date)
  )
    return undefined
  const cents = Math.round(amount * 100)
  if (!Number.isSafeInteger(cents) || Math.abs(amount * 100 - cents) > 0.00001)
    return undefined
  const rate = currency === "ARS" ? applicableRate(date, book) : undefined
  if (currency !== "USD" && (currency !== "ARS" || !rate)) return undefined
  const micro =
    currency === "USD"
      ? BigInt(cents) * BigInt(10000)
      : (BigInt(cents) * BigInt(10000000000) +
          BigInt(Math.round(rate!.arsPerUsd * 1000000)) / BigInt(2)) /
        BigInt(Math.round(rate!.arsPerUsd * 1000000))
  const usdMicros = Number(micro)
  if (!Number.isSafeInteger(usdMicros)) return undefined
  return { usdMicros, usd: usdMicros / 1_000_000, rate, valuedOn: date }
}
export function valuationTotal(rows: Array<{ valuation?: UsdValuation }>) {
  const micros = rows.reduce(
    (total, row) => total + (row.valuation?.usdMicros ?? 0),
    0
  )
  const pending = rows.filter((row) => !row.valuation).length
  const valid = Number.isSafeInteger(micros)
  return {
    usd: valid ? micros / 1_000_000 : undefined,
    pending: valid ? pending : rows.length,
    complete: valid && pending === 0,
  }
}
