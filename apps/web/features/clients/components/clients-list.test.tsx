import { expect, it } from "vitest"
import { renderComponent } from "@/test/utils/render"

import { ClientsList } from "./clients-list"

it("lists synthetic clients and opens a return-aware detail", () => {
  const { getByRole, queryByText } = renderComponent(
    <ClientsList searchParams={{}} />
  )
  expect(getByRole("heading", { name: "Clientes" })).toBeTruthy()
  expect(
    getByRole("status", { name: "Resultados de clientes" })
  ).toHaveTextContent("4 de 4 clientes")
  expect(
    getByRole("link", { name: "Cliente Demo Norte" }).getAttribute("href")
  ).toContain("/clientes/client-demo-norte?returnTo=%2Fclientes")
  expect(queryByText(/CUIT|ARS|USD|honorarios|margen/i)).toBeNull()
})

it("preserves a query when the filtered list is empty and can recover", () => {
  const { getByRole } = renderComponent(
    <ClientsList searchParams={{ q: "no existe" }} />
  )
  expect(getByRole("status")).toHaveTextContent("No hay coincidencias")
  expect(getByRole("link", { name: "Limpiar" }).getAttribute("href")).toBe(
    "/clientes"
  )
})

it("does not expose client rows or counts in restricted and source-error states", () => {
  const restricted = renderComponent(
    <ClientsList searchParams={{ error: "sin-permiso" }} />
  )
  expect(restricted.getByRole("status")).toHaveTextContent(
    "No se confirma si existen registros"
  )
  expect(restricted.queryByText("Cliente Demo Norte")).toBeNull()

  const failed = renderComponent(
    <ClientsList searchParams={{ q: "norte", error: "lectura" }} />
  )
  expect(failed.getByRole("alert")).toHaveTextContent(
    "Se conservaron los filtros"
  )
  expect(
    failed.getByRole("link", { name: "Reintentar" }).getAttribute("href")
  ).toBe("/clientes?q=norte")
})
