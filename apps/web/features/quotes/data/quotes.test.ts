import { describe, expect, it } from "vitest"

import {
  calculateQuoteTotal,
  createDemoQuoteVersion,
  filterDemoQuotes,
  getCurrentQuoteVersion,
  initialDemoQuotes,
  parseDemoQuotes,
  parseQuoteListState,
  quoteStatus,
  transitionDemoQuote,
} from "./quotes"

describe("demonstration quotes", () => {
  it("calculates only quantity times unit price in the selected currency", () => {
    expect(
      calculateQuoteTotal([
        { id: "a", description: "A", quantity: 2, unitPrice: 125 },
        { id: "b", description: "B", quantity: 3, unitPrice: 20 },
      ])
    ).toBe(310)
  })

  it("keeps internal approval separate from sending and customer response", () => {
    const draft = initialDemoQuotes[0]!
    expect(transitionDemoQuote(draft, "send")).toBeNull()
    const approved = transitionDemoQuote(draft, "approve")!
    expect(quoteStatus(approved)).toBe("Pendiente de envío")
    expect(transitionDemoQuote(approved, "accept")).toBeNull()
    const sent = transitionDemoQuote(approved, "send")!
    expect(getCurrentQuoteVersion(sent).workflow.clientResponse).toBe(
      "Sin respuesta"
    )
    const accepted = transitionDemoQuote(sent, "accept")!
    expect(quoteStatus(accepted)).toBe("Aceptada (demo)")
    expect(transitionDemoQuote(accepted, "reject")).toBeNull()
  })

  it("creates a new pending version without rewriting the former event history", () => {
    const accepted = initialDemoQuotes[2]!
    const nextVersion = createDemoQuoteVersion({
      number: 2,
      service: "Servicio ajustado",
      context: "Nueva versión ficticia",
      currency: "ARS",
      lines: [
        { id: "new-line", description: "Trabajo", quantity: 1, unitPrice: 1 },
      ],
      conditions: "",
    })
    const revised = {
      ...accepted,
      versions: [...accepted.versions, nextVersion],
    }
    expect(getCurrentQuoteVersion(revised).number).toBe(2)
    expect(getCurrentQuoteVersion(revised).workflow).toMatchObject({
      internalApproval: "Pendiente",
      send: "No enviado",
      clientResponse: "Sin respuesta",
    })
    expect(accepted.versions[0]?.workflow.clientResponse).toBe(
      "Aceptación simulada"
    )
  })

  it("filters by client, text, and workflow state without changing source records", () => {
    const state = parseQuoteListState({
      cliente: "client-demo-sur",
      estado: "aceptada",
      q: "exportación",
    })
    expect(
      filterDemoQuotes(initialDemoQuotes, state).map((quote) => quote.id)
    ).toEqual(["quote-demo-003"])
    expect(initialDemoQuotes).toHaveLength(4)
    expect(
      filterDemoQuotes(
        initialDemoQuotes,
        parseQuoteListState({ estado: "rechazada" })
      )
    ).toHaveLength(1)
  })

  it("rejects malformed or financially unsafe session data", () => {
    expect(parseDemoQuotes("{broken")).toEqual(initialDemoQuotes)
    const invalid = structuredClone(initialDemoQuotes)
    invalid[0]!.versions[0]!.lines[0]!.unitPrice = -1
    expect(parseDemoQuotes(JSON.stringify(invalid))).toEqual(initialDemoQuotes)
  })
})
