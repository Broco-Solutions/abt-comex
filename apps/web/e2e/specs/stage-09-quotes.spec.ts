import { expect, test } from "@playwright/test"

test("@smoke quote workflow keeps approval, sending, and customer response separate", async ({
  page,
}) => {
  await page.goto("/cotizaciones")
  await expect(
    page.getByRole("heading", { name: "Cotizaciones" })
  ).toBeVisible()
  await expect(
    page.getByText(/4 de 4 cotizaciones sintéticas visibles/)
  ).toBeVisible()
  await expect(
    page.getByText(/valores de este escenario son ficticios/i)
  ).toBeVisible()
  await page.getByRole("link", { name: "COT-DEM-001" }).click()
  await expect(page).toHaveURL(/cotizaciones\/quote-demo-001\?returnTo=/)
  await expect(page.getByRole("heading", { name: "COT-DEM-001" })).toBeVisible()
  await expect(page.getByText("Total de la versión · ARS")).toBeVisible()

  const send = page.getByRole("button", { name: "Simular envío local" })
  await expect(send).toBeDisabled()
  await page.getByRole("button", { name: "Simular aprobación interna" }).click()
  await expect(page.getByText("Aprobación simulada").first()).toBeVisible()
  await expect(send).toBeEnabled()
  await send.click()
  await page
    .getByRole("button", { name: "Simular aceptación del cliente" })
    .click()
  await expect(page.getByText("Aceptación simulada").first()).toBeVisible()
  await expect(
    page.getByRole("link", { name: /Crear operación desde esta versión/ })
  ).toHaveAttribute(
    "href",
    /\/operaciones\/nueva\?cotizacion=quote-demo-001&version=1/
  )

  await page.getByRole("link", { name: "Crear versión" }).click()
  await page
    .getByLabel("Servicio (propuesto)")
    .fill("Servicio ajustado de demostración")
  await page
    .getByRole("button", { name: "Guardar nueva versión local" })
    .click()
  await expect(page).toHaveURL(/cotizaciones\/quote-demo-001$/)
  await expect(
    page.getByRole("heading", { name: "Versión 2 · líneas y cálculo" })
  ).toBeVisible()
  await expect(page.getByText("Versión 1").first()).toBeVisible()
  await expect(
    page.getByText(
      "Aprobación simulada · Envío simulado · respuesta: Aceptación simulada"
    )
  ).toBeVisible()
  await expect(
    page.getByText("Pendiente · No enviado · respuesta: Sin respuesta")
  ).toBeVisible()
})

test("@smoke quote capability failure hides all row and count details; client relation returns safely", async ({
  page,
}) => {
  await page.goto("/cotizaciones?error=sin-permiso")
  await expect(page.getByRole("status")).toContainText(
    "No se confirma si existen registros"
  )
  await expect(page.getByText("COT-DEM-001")).toHaveCount(0)
  await expect(page.getByText(/de 4 cotizaciones/)).toHaveCount(0)

  await page.goto("/clientes/client-demo-norte")
  await page
    .getByRole("link", { name: "Abrir Cotizaciones del cliente" })
    .click()
  await expect(page).toHaveURL(/cotizaciones\?cliente=client-demo-norte/)
  await expect(page.getByRole("link", { name: "COT-DEM-001" })).toBeVisible()
  await page.getByRole("link", { name: "COT-DEM-001" }).click()
  await page.getByRole("link", { name: "Cliente Demo Norte" }).click()
  await expect(page).toHaveURL(/clientes\/client-demo-norte\?returnTo=/)
  await expect(
    page.getByRole("link", { name: "Volver al contexto anterior" })
  ).toHaveAttribute("href", /\/cotizaciones\/quote-demo-001\?returnTo=/)
  await page.getByRole("link", { name: "Volver al contexto anterior" }).click()
  await expect(page).toHaveURL(/cotizaciones\/quote-demo-001\?returnTo=/)
  await page.getByRole("link", { name: "Volver a Cotizaciones" }).click()
  await expect(page).toHaveURL(/cotizaciones\?cliente=client-demo-norte/)
})

test("@smoke quote editor and list remain usable on narrow screens", async ({
  page,
}) => {
  for (const width of [1440, 1280, 1024, 900, 768, 390]) {
    await page.setViewportSize({ width, height: 844 })
    await page.goto("/cotizaciones")
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      ),
      `no overflow at ${width}px`
    ).toBe(true)
  }
  await page.getByRole("link", { name: "Nueva cotización" }).click()
  await expect(
    page.getByRole("heading", { name: "Nueva cotización" })
  ).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
})
