import { expect, it } from "vitest"
import { renderComponent } from "@/test/utils/render"

import { QuotesList } from "./quotes-list"

it("lists synthetic quotes with return context and no real source implication", () => {
  const { getByRole, getByText } = renderComponent(
    <QuotesList searchParams={{ q: "norte" }} />
  )
  expect(getByRole("heading", { name: "Cotizaciones" })).toBeTruthy()
  expect(getByText(/valores de este escenario son ficticios/i)).toBeTruthy()
  const detailLink = getByRole("link", { name: "COT-DEM-001" })
  expect(detailLink.getAttribute("href")).toContain(
    "returnTo=%2Fcotizaciones%3Fq%3Dnorte"
  )
})

it("does not reveal rows, counts, or commercial values when capability is absent", () => {
  const { getByRole, queryByText } = renderComponent(
    <QuotesList searchParams={{ error: "sin-permiso" }} />
  )
  expect(getByRole("status")).toHaveTextContent(
    "No se confirma si existen registros"
  )
  expect(queryByText("COT-DEM-001")).toBeNull()
  expect(queryByText(/ARS|USD|24\.000|de 4 cotizaciones/)).toBeNull()
})

it("preserves filters and hides totals on source error", () => {
  const { getByRole, queryByText } = renderComponent(
    <QuotesList
      searchParams={{ q: "norte", estado: "borrador", error: "lectura" }}
    />
  )
  expect(getByRole("alert")).toHaveTextContent("no se confirma un total")
  expect(getByRole("link", { name: "Reintentar" }).getAttribute("href")).toBe(
    "/cotizaciones?q=norte&estado=borrador"
  )
  expect(queryByText("COT-DEM-001")).toBeNull()
})
