import { test, expect } from "../fixtures"

test("@smoke DJVE filters survive detail, related exportation and the explicit return chain", async ({
  page,
}) => {
  await page.goto("/tramites/djve?q=2026-02")
  await page
    .getByRole("link", { name: "DJVE-DEM-2026-02", exact: true })
    .click()
  await page.getByRole("link", { name: "Abrir Exportación vinculada" }).click()
  await expect(
    page.getByRole("heading", { name: "Exportación · OP-DEM-3133" })
  ).toBeVisible()
  await page.getByRole("link", { name: "Volver a DJVE", exact: true }).click()
  await expect(
    page.getByRole("heading", { name: "DJVE-DEM-2026-02", exact: true })
  ).toBeVisible()
  await page
    .getByRole("link", { name: "Volver al contexto anterior", exact: true })
    .click()
  await expect(page).toHaveURL(/tramites\/djve\?.*q=2026-02/)
  await expect(page.getByLabel("Buscar DJVE o permiso")).toHaveValue("2026-02")
})

test("@smoke local document receipt updates workspaces and guided answers without clearing controls", async ({
  page,
}) => {
  await page.goto("/operaciones/op-demo-2048")
  await page
    .getByRole("button", { name: /Registrar copia local.*Lista de empaque/ })
    .click()
  await expect(
    page.getByRole("status").filter({ hasText: /No modifica el original/ })
  ).toBeVisible()
  await page.getByRole("button", { name: "¿Qué documento falta?" }).click()
  await expect(
    page.getByRole("heading", { name: "Copias disponibles" })
  ).toBeVisible()
  await page
    .getByRole("link", { name: "Abrir espacio de Importación", exact: true })
    .click()
  const panel = page.getByRole("region", {
    name: "Documentación por requisito",
  })
  await expect(
    panel.getByText("Copia disponible", { exact: false })
  ).toHaveCount(2)
  await expect(
    panel.getByText("Original físico: Pendiente", { exact: true })
  ).toBeVisible()
  await page.goto("/mi-trabajo?vista=controls")
  await expect(
    page.getByRole("heading", {
      name: "Segundo control previo a oficialización",
    })
  ).toBeVisible()
})

test("@smoke historical quote versions are explicit and do not mutate the current workflow", async ({
  page,
}) => {
  await page.goto("/cotizaciones/quote-demo-001")
  await page.getByRole("link", { name: "Crear versión", exact: true }).click()
  await page.getByLabel("Servicio", { exact: true }).fill("Servicio revisado")
  await page
    .getByRole("button", { name: "Guardar nueva versión local" })
    .click()
  await expect(
    page.getByText("Versión 2 · vigente", { exact: true })
  ).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Simular aprobación interna" })
  ).toBeEnabled()
  await page.getByRole("heading", { name: "Historial de versiones" }).click()
  await page.getByRole("link", { name: "Versión 1", exact: true }).click()
  await expect(page).toHaveURL(/version=1/)
  await expect(
    page.getByText("Versión 1 · histórica, sólo lectura", { exact: true })
  ).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Simular aprobación interna" })
  ).toBeDisabled()
  await page
    .getByRole("link", { name: "Ver versión vigente", exact: true })
    .click()
  await expect(
    page.getByText("Versión 2 · vigente", { exact: true })
  ).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Simular aprobación interna" })
  ).toBeEnabled()
})

test("@smoke form errors focus their field and the operational perspective skips an unavailable commercial choice", async ({
  page,
}) => {
  await page.goto("/acceso")
  await page.getByRole("button", { name: /Operador de Importación/ }).click()
  await page.getByRole("link", { name: "Nueva operación", exact: true }).click()
  await expect(
    page.getByRole("region", { name: "Cliente y tipo" })
  ).toBeVisible()
  await expect(page.getByLabel("Exportación", { exact: true })).toHaveCount(0)
  await page.getByRole("button", { name: /Continuar/ }).click()
  await expect(page.locator("#creation-client")).toBeFocused()
  await expect(page.locator("#creation-client")).toHaveAttribute(
    "aria-invalid",
    "true"
  )
  await expect(page.locator("#creation-error")).toContainText(
    "Seleccioná cliente"
  )
  await page.goto("/acceso")
  await page.getByRole("button", { name: /Dirección/ }).click()
  await page.goto("/cotizaciones/nueva")
  await page.getByRole("button", { name: "Guardar borrador local" }).click()
  await expect(page.locator("#quote-editor-client")).toBeFocused()
  await page.locator("#quote-editor-client").fill("Norte")
  await page.getByRole("option", { name: "Cliente Demo Norte" }).click()
  await page.getByRole("button", { name: "Guardar borrador local" }).click()
  await expect(page.getByLabel("Servicio", { exact: true })).toBeFocused()
  await expect(page.getByLabel("Servicio", { exact: true })).toHaveAttribute(
    "aria-describedby",
    "quote-editor-error"
  )
  await page.getByLabel("Servicio", { exact: true }).fill("Servicio de prueba")
  await page
    .getByLabel("Descripción de línea 1", { exact: true })
    .fill("Línea de prueba")
  await page.getByLabel("Precio unitario (ARS)", { exact: true }).fill("")
  await page.getByRole("button", { name: "Guardar borrador local" }).click()
  await expect(
    page.getByLabel("Precio unitario (ARS)", { exact: true })
  ).toBeFocused()
  await page.goto("/clientes/client-demo-centro")
  await page
    .getByRole("link", { name: "Abrir Cotizaciones del cliente" })
    .click()
  await page
    .getByRole("link", { name: "Nueva cotización", exact: true })
    .click()
  await expect(page.locator("#quote-editor-client")).toHaveValue(
    "Cliente Demo Centro"
  )
})

test("@smoke external documents omit custody, internal actions and other clients, and exit resets the context", async ({
  page,
}) => {
  await page.goto("/acceso")
  await page.getByRole("button", { name: /Cliente externo/ }).click()
  await page.getByRole("link", { name: "Ver estado" }).first().click()
  await expect(
    page.getByRole("heading", { name: "Documentos y pendientes" })
  ).toBeVisible()
  await expect(page.getByText(/Original físico/)).toHaveCount(0)
  await expect(
    page.getByRole("button", { name: /Registrar copia local/ })
  ).toHaveCount(0)
  await page.getByRole("button", { name: /Ver referencia/ }).click()
  await expect(
    page.getByRole("dialog", { name: "Factura comercial" })
  ).toBeVisible()
  await page.keyboard.press("Escape")
  await page.getByRole("button", { name: "Salir", exact: true }).click()
  await expect(page).toHaveURL(/acceso$/)
  await page.goto("/portal?cliente=client-demo-centro")
  await expect(
    page.getByRole("heading", { name: "Elegí una perspectiva" })
  ).toBeVisible()
  await expect(page.getByText("OP-DEM-2054", { exact: true })).toHaveCount(0)
})
