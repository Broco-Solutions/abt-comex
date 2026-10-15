import { expect, test } from "../fixtures"
test("@smoke V3 payables include older obligations and retain cut/context without document navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(
    "/administracion/carteras?cartera=pagar&corte=2026-10-14&moneda=ARS"
  )
  await expect(
    page.getByRole("list", { name: "Obligaciones de cartera" })
  ).toContainText("COMP-EVAL-001")
  await expect(
    page.getByRole("region", { name: "Resumen de cartera" })
  ).toContainText("30.000,00")
  let documents = 0
  page.on("request", (request) => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame())
      documents++
  })
  await page.getByRole("link", { name: "COMP-EVAL-001", exact: true }).click()
  await expect(
    page.getByRole("list", { name: "Aplicaciones del comprobante" })
  ).toContainText("PAG-EVAL-001")
  await page
    .getByRole("link", { name: "Volver a la cartera", exact: true })
    .click()
  await expect(page).toHaveURL(
    /carteras\?cartera=pagar&corte=2026-10-14&moneda=ARS$/
  )
  await expect(
    page.getByRole("link", { name: "COMP-EVAL-001", exact: true })
  ).toBeFocused()
  await page.getByLabel("Fecha de corte").fill("2026-08-31")
  await expect(
    page.getByRole("region", { name: "Resumen de cartera" })
  ).toContainText("50.000,00")
  expect(documents).toBe(0)
})
test("@smoke V3 credit application changes only scenario balance and is linked bidirectionally", async ({
  page,
}) => {
  await page.goto("/administracion/comprobantes/invoice-operation-3107")
  await page.getByText("Preparar aplicación", { exact: true }).click()
  const origin = page.getByRole("combobox", {
    name: "Cobro, pago o crédito disponible",
  })
  await origin.fill("NC-EVAL-001")
  await page.getByRole("option", { name: /NC-EVAL-001/ }).click()
  await page.getByLabel("Importe a aplicar").fill("1000.25")
  await page.getByRole("button", { name: "Guardar aplicación local" }).click()
  await expect(page.getByRole("status")).toContainText(
    "no se registró en Alpha2000"
  )
  await expect(
    page.getByRole("region", { name: "Identidad del comprobante" })
  ).toContainText("273.999,75")
  await expect(page.getByText(/275.000,00 al/)).toBeVisible()
  await page.getByRole("link", { name: "NC-EVAL-001", exact: true }).click()
  await expect(
    page.getByRole("list", { name: "Destino del crédito" })
  ).toContainText("FAC-EVAL-3107")
  await page.getByRole("link", { name: "FAC-EVAL-3107", exact: true }).click()
  await expect(
    page.getByRole("list", { name: "Aplicaciones del comprobante" })
  ).toContainText("1.000,25")
})
test("@smoke V3 draft is reusable but enters billing only as an explicit evaluation reference", async ({
  page,
}) => {
  await page.goto("/administracion/comprobantes")
  await page
    .getByRole("button", { name: "Nuevo comprobante", exact: true })
    .click()
  const dialog = page.getByRole("dialog", { name: "Preparar comprobante" })
  await dialog.getByLabel("Referencia", { exact: true }).fill("FAC-LOCAL-TEST")
  await dialog.getByLabel("Importe original").fill("123.45")
  await dialog
    .getByLabel("Concepto", { exact: true })
    .fill("Servicio sintético")
  await dialog
    .getByRole("combobox", { name: "Cliente del comprobante" })
    .fill("Norte")
  await dialog.getByRole("option", { name: /Norte/ }).click()
  await dialog.getByRole("button", { name: "Guardar comprobante" }).click()
  await page
    .getByRole("link", { name: "Abrir comprobante", exact: true })
    .click()
  await expect(
    page.getByRole("region", { name: "Identidad del comprobante" })
  ).toContainText("Preparado")
  await page
    .getByRole("button", { name: "Editar comprobante", exact: true })
    .click()
  const edit = page.getByRole("dialog", { name: "Editar comprobante" })
  await edit.getByRole("checkbox", { name: /Usar como referencia/ }).check()
  await edit.getByRole("button", { name: "Guardar comprobante" }).click()
  await page.goto(
    "/administracion/finanzas?desde=2026-10-01&hasta=2026-10-14&moneda=ARS&serie=invoice&dimension=all#registros"
  )
  await expect(
    page.getByRole("list", { name: "Registros financieros seleccionados" })
  ).toContainText("FAC-LOCAL-TEST")
  await page.getByRole("link", { name: "FAC-LOCAL-TEST", exact: true }).click()
  await expect(
    page.getByRole("region", { name: "Identidad del comprobante" })
  ).toContainText("123,45")
})
