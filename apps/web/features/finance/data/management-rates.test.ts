import { expect, it } from "vitest"
import {
  initialRateBook,
  valueInUsd,
  valuationTotal,
  reviseManagementRate,
  parseRateBook,
} from "./management-rates"

it("rejects duplicate effective dates, moved revisions and unsafe values, while an empty book stays empty", () => {
  const first = initialRateBook.rates[0]!
  expect(() =>
    reviseManagementRate(initialRateBook, { ...first, id: "different" })
  ).toThrow(/Ya existe/)
  expect(() =>
    reviseManagementRate(initialRateBook, {
      ...first,
      effectiveOn: "2026-05-02",
    })
  ).toThrow(/Conservá/)
  for (const arsPerUsd of [0, -1, Infinity, NaN, 1.0000001])
    expect(() =>
      reviseManagementRate(initialRateBook, { ...first, arsPerUsd })
    ).toThrow(/positivo/)
  const empty = { rates: [], history: [] }
  expect(parseRateBook(JSON.stringify(empty))).toEqual(empty)
  expect(valueInUsd(10, "ARS", "2026-10-14", empty)).toBeUndefined()
  expect(
    valueInUsd(0.001, "USD", "2026-10-14", initialRateBook)
  ).toBeUndefined()
  expect(
    valueInUsd(Number.MAX_SAFE_INTEGER, "USD", "2026-10-14", initialRateBook)
  ).toBeUndefined()
})
it("converts original ARS at the event and pending balances at their cut, while USD stays unchanged", () => {
  expect(valueInUsd(1325, "ARS", "2026-10-05", initialRateBook)?.usd).toBe(1)
  expect(valueInUsd(1300, "ARS", "2026-09-25", initialRateBook)?.usd).toBe(1)
  expect(valueInUsd(1300, "ARS", "2026-10-14", initialRateBook)?.usd).not.toBe(
    1
  )
  expect(valueInUsd(12.34, "USD", "2026-09-25", initialRateBook)?.usd).toBe(
    12.34
  )
  expect(
    valueInUsd(undefined, "USD", "2026-10-14", initialRateBook)
  ).toBeUndefined()
  expect(valueInUsd(15, "EUR", "2026-10-14", initialRateBook)).toBeUndefined()
})
it("does not confirm a total with missing rates, invalid dates or unknown amounts", () => {
  const pending = valueInUsd(100, "ARS", "2026-04-01", initialRateBook)
  expect(pending).toBeUndefined()
  const result = valuationTotal([
    { valuation: pending },
    { valuation: valueInUsd(1, "USD", "2026-10-14", initialRateBook) },
  ])
  expect(result).toEqual({ usd: 1, pending: 1, complete: false })
  expect(valueInUsd(0, "USD", "2026-02-30", initialRateBook)).toBeUndefined()
})
it("revises only the applicable interval and preserves the prior reference in history", () => {
  const old = initialRateBook.rates.at(-1)!
  const revised = reviseManagementRate(initialRateBook, {
    ...old,
    arsPerUsd: 2650,
  })
  expect(revised.history).toEqual([old])
  expect(valueInUsd(1325, "ARS", "2026-10-05", revised)?.usd).toBe(0.5)
  expect(valueInUsd(1300, "ARS", "2026-09-25", revised)?.usd).toBe(1)
  const invalid = reviseManagementRate(revised, { ...old, valid: false })
  expect(valueInUsd(1325, "ARS", "2026-10-05", invalid)).toBeUndefined()
  expect(initialRateBook.rates.at(-1)?.arsPerUsd).toBe(1325)
  expect(parseRateBook(JSON.stringify(revised))).toEqual(revised)
})
it("adds mixed original currencies using integer micro-USD and rounds only presentation cents", () => {
  const values = Array.from({ length: 1000 }, () => ({
    valuation: valueInUsd(0.01, "USD", "2026-10-14", initialRateBook),
  }))
  expect(valuationTotal(values).usd).toBe(10)
  values.push({
    valuation: valueInUsd(1325, "ARS", "2026-10-14", initialRateBook),
  })
  expect(valuationTotal(values).usd).toBe(11)
})
