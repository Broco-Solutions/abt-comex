import { expect, test } from "../fixtures"

test("@smoke direct operation creation is guided, reversible, and appears in its client and operation lists", async ({
  page,
}) => {
  await page.goto("/operaciones/nueva")
  await expect(
    page.getByRole("heading", { name: "Crear operación" })
  ).toBeVisible()
  await page.getByRole("button", { name: /Continuar/ }).click()
  await page
    .getByRole("region", { name: "Cliente y tipo" })
    .getByRole("combobox")
    .first()
    .selectOption("client-demo-norte")
  await page.getByLabel("Importación", { exact: true }).check()
  await page.getByLabel("Modalidad de referencia").selectOption("Marítima")
  await page.getByRole("button", { name: /Continuar/ }).click()
  await page
    .getByLabel("Contexto para esta apertura (opcional)")
    .fill("Contexto ficticio ingresado durante la demo")
  await page.getByRole("button", { name: /Continuar/ }).click()
  await page
    .getByLabel("Equipo responsable de referencia")
    .selectOption("Equipo Impo A")
  await page.getByRole("button", { name: /Continuar/ }).click()
  await expect(
    page.getByText("No hay requisitos automáticos configurados")
  ).toBeVisible()
  await expect(page.getByText("Alta directa")).toBeVisible()
  await expect(
    page.getByText("Contexto ficticio ingresado durante la demo")
  ).toBeVisible()
  await page.getByRole("button", { name: "Crear operación local" }).click()

  await expect(page).toHaveURL(/operaciones\/op-demo-3142\?returnTo=/)
  await expect(page.getByRole("heading", { name: "OP-DEM-3142" })).toBeVisible()
  await expect(
    page.getByText(
      "Alta directa desde escenario local, sin cotización de origen."
    )
  ).toBeVisible()
  await page.getByRole("link", { name: "Volver a resultados" }).click()
  await expect(
    page.getByRole("link", { name: "OP-DEM-3142", exact: true })
  ).toBeVisible()
  await page.getByRole("link", { name: "Nueva operación" }).click()
  await expect(
    page.getByRole("heading", { name: "Crear operación" })
  ).toBeVisible()
  await page.goto("/clientes/client-demo-norte")
  await expect(page.getByText("OP-DEM-3142 · Importación")).toBeVisible()
  await expect(
    page
      .getByRole("region", { name: "Operaciones relacionadas" })
      .getByRole("link", { name: "Abrir operación" })
      .last()
  ).toHaveAttribute("href", /op-demo-3142/)
})

test("@smoke accepted quote opens the guided creation with source version preserved", async ({
  page,
}) => {
  await page.goto("/cotizaciones/quote-demo-003")
  await page
    .getByRole("link", { name: /Crear operación desde esta versión/ })
    .click()
  await expect(page).toHaveURL(
    /operaciones\/nueva\?cotizacion=quote-demo-003&version=1/
  )
  await page.getByRole("button", { name: /Continuar/ }).click()
  await page.getByLabel("Exportación", { exact: true }).check()
  await page.getByLabel("Modalidad de referencia").selectOption("Aérea")
  await page.getByRole("button", { name: /Continuar/ }).click()
  await page
    .getByLabel("Contexto para esta apertura (opcional)")
    .fill("Referencia logística ficticia")
  await page.getByRole("button", { name: /Continuar/ }).click()
  await page
    .getByLabel("Equipo responsable de referencia")
    .selectOption("Equipo Expo A")
  await page.getByRole("button", { name: /Continuar/ }).click()
  await expect(
    page.getByText(/COT-DEM-003 · versión 1 \(aceptación simulada\)/)
  ).toBeVisible()
  await page.getByRole("button", { name: "Crear operación local" }).click()

  await expect(page).toHaveURL(/operaciones\/op-demo-3142\?returnTo=/)
  await expect(
    page.getByRole("link", { name: "COT-DEM-003 · versión 1" })
  ).toBeVisible()
  await expect(
    page.getByText(
      "Referencia logística ficticia Servicio de cotización de referencia: Servicio de exportación ficticio."
    )
  ).toBeVisible()
  await page.getByRole("link", { name: "COT-DEM-003 · versión 1" }).click()
  await expect(page).toHaveURL(/cotizaciones\/quote-demo-003/)
})

test("@smoke a pending quote cannot open the quote-origin path; direct creation remains available", async ({
  page,
}) => {
  await page.goto("/operaciones/nueva?cotizacion=quote-demo-001&version=1")
  await page.getByRole("button", { name: /Continuar/ }).click()
  await expect(
    page.getByText(
      "Elegí una versión aceptada de cliente o continuá por el camino directo."
    )
  ).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Crear operación local" })
  ).toHaveCount(0)
  await page.getByLabel(/Alta directa/).check()
  await page.getByRole("button", { name: /Continuar/ }).click()
  await expect(
    page.getByRole("heading", { name: "Cliente y tipo" })
  ).toBeVisible()
})
