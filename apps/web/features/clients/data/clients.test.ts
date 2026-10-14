import { expect, it } from "vitest"

import {
  demonstrationClients,
  filterClients,
  getClientOperations,
  parseClientListState,
} from "./clients"
import { demonstrationOperations } from "@/features/operations/data/operations"

it("keeps every operation related to an existing synthetic client", () => {
  const clientIds = new Set(demonstrationClients.map((client) => client.id))
  expect(
    demonstrationOperations.every((operation) =>
      clientIds.has(operation.clientId)
    )
  ).toBe(true)
  expect(getClientOperations("client-demo-norte")).toHaveLength(3)
})

it("searches client names and related operation references", () => {
  expect(filterClients("cliente demo sur").map((client) => client.id)).toEqual([
    "client-demo-sur",
  ])
  expect(filterClients("op-dem-3120").map((client) => client.id)).toEqual([
    "client-demo-este",
  ])
  expect(filterClients("sin coincidencia")).toEqual([])
})

it("accepts only known list states and trims the search term", () => {
  expect(parseClientListState({ q: " norte ", error: "lectura" })).toEqual({
    query: "norte",
    error: "lectura",
  })
  expect(parseClientListState({ error: "otro" }).error).toBe("")
})
