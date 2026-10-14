import { demonstrationOperations } from "@/features/operations/data/operations"

import type { DemonstrationClient } from "../types/client"

// Names, contacts and relations are invented for navigation and test scenarios.
export const demonstrationClients: DemonstrationClient[] = [
  {
    id: "client-demo-norte",
    name: "Cliente Demo Norte",
    contacts: [
      { id: "contact-demo-norte-01", label: "Contacto de demostración 01" },
    ],
    source: "Fixture sintético local",
    updatedOn: "2026-10-14",
  },
  {
    id: "client-demo-centro",
    name: "Cliente Demo Centro",
    contacts: [
      { id: "contact-demo-centro-01", label: "Contacto de demostración 02" },
    ],
    source: "Fixture sintético local",
    updatedOn: "2026-10-14",
  },
  {
    id: "client-demo-sur",
    name: "Cliente Demo Sur",
    contacts: [],
    source: "Fixture sintético local",
    updatedOn: "2026-10-14",
  },
  {
    id: "client-demo-este",
    name: "Cliente Demo Este",
    contacts: [],
    source: "Fixture sintético local",
    updatedOn: "2026-10-14",
  },
]

export type ClientSearchParams = Record<string, string | string[] | undefined>

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "")
}

export function parseClientListState(params: ClientSearchParams) {
  const error = first(params.error)
  return {
    query: first(params.q).trim(),
    error: error === "lectura" || error === "sin-permiso" ? error : "",
  }
}

export function getClientOperations(clientId: string) {
  return demonstrationOperations.filter((item) => item.clientId === clientId)
}

export function filterClients(query: string, clients = demonstrationClients) {
  const normalized = query.toLocaleLowerCase("es-AR")
  return clients.filter((client) => {
    const operationReferences = getClientOperations(client.id).map(
      (operation) => operation.reference
    )
    return [client.name, ...operationReferences].some((value) =>
      value.toLocaleLowerCase("es-AR").includes(normalized)
    )
  })
}

export function clientListHref(query: string) {
  const params = new URLSearchParams()
  if (query) params.set("q", query)
  const search = params.toString()
  return `/clientes${search ? `?${search}` : ""}`
}

export function clientDetailHref(clientId: string, returnTo: string) {
  return `/clientes/${encodeURIComponent(clientId)}?returnTo=${encodeURIComponent(returnTo)}`
}
