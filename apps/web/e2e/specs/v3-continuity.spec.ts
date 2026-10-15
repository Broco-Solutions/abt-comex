import { expect, test } from "../fixtures"

test("@smoke V3 explicit people and counterparties persist across workspaces without granting access", async ({
  page,
}) => {
  await page.goto("/operaciones/op-demo-2048/importacion")
  const relations = page.getByRole("region", {
    name: "Responsable y contrapartes operativas",
  })
  await expect(
    relations.getByText("Pendiente de asignación", { exact: true })
  ).toBeVisible()
  await relations
    .getByRole("combobox", { name: "Asignar integrante relevado" })
    .fill("Sergio")
  await relations.getByRole("option", { name: /Sergio Mentini/ }).click()
  await relations
    .getByRole("button", { name: "Asignar responsable", exact: true })
    .click()
  await expect(
    relations.getByText("Sergio Mentini", { exact: true })
  ).toBeVisible()
  await relations
    .getByRole("combobox", { name: "Contraparte operativa", exact: true })
    .click()
  await expect(
    relations.getByRole("option", { name: /Servicios Portuarios/ })
  ).toHaveCount(0)
  await relations
    .getByRole("option", { name: /Vendedor Exterior de Ejemplo/ })
    .click()
  await relations.getByRole("button", { name: "Vincular contraparte" }).click()
  await relations
    .getByRole("link", { name: "Vendedor Exterior de Ejemplo", exact: true })
    .click()
  await expect(
    page.getByRole("heading", {
      name: "Participaciones como contraparte operativa",
    })
  ).toBeVisible()
  await page
    .getByRole("link", {
      name: "OP-DEM-2048 · Cliente Demo Norte",
      exact: true,
    })
    .click()
  await expect(
    page.getByText("Sergio Mentini", { exact: true }).first()
  ).toBeVisible()
  await page.goto("/operaciones?responsable=person-abt-002")
  await expect(
    page.getByRole("link", { name: "OP-DEM-2048", exact: true })
  ).toBeVisible()
  await expect(
    page.getByRole("link", { name: "OP-DEM-2054", exact: true })
  ).toHaveCount(0)
  await page.goto("/configuracion/personas/person-abt-002")
  await expect(
    page.getByRole("link", {
      name: "OP-DEM-2048 · Cliente Demo Norte",
      exact: true,
    })
  ).toBeVisible()
  await expect(
    page.getByText("Sin capacidades asignadas.", { exact: true })
  ).toBeVisible()
  await page
    .getByRole("link", {
      name: "OP-DEM-2048 · Cliente Demo Norte",
      exact: true,
    })
    .click()
  await page.getByRole("link", { name: "Volver al integrante" }).click()
  await expect(
    page.getByRole("heading", { name: "Sergio Mentini", exact: true })
  ).toBeVisible()
})

test("@smoke V3 operational handoff returns and resubmits through the same administrative queue", async ({
  page,
}) => {
  const origin =
    "/operaciones/op-demo-2048/importacion?returnTo=%2Foperaciones%3Ftipo%3Dimportacion"
  await page.goto(origin)
  const handoff = page.getByRole("region", {
    name: "Continuidad administrativa",
  })
  await handoff
    .getByRole("button", { name: "Preparar envío a Administración" })
    .click()
  await expect(handoff.getByRole("alert")).toContainText("Indicá")
  await handoff
    .getByLabel("Próxima acción u observación")
    .fill("Revisar documentación sintética")
  await handoff
    .getByRole("button", { name: "Preparar envío a Administración" })
    .click()
  await handoff
    .getByRole("link", { name: "Abrir contexto administrativo" })
    .click()
  await expect(page).toHaveURL(/administracion\/op-demo-2048\?returnTo=/)
  await expect(
    handoff
      .getByText("Revisar documentación sintética", { exact: true })
      .first()
  ).toBeVisible()
  await handoff
    .getByLabel("Próxima acción u observación")
    .fill("Falta referencia de evidencia")
  await handoff
    .getByRole("button", { name: "Devolver con observaciones" })
    .click()
  await page.goto("/administracion?q=2048")
  await expect(
    page
      .getByRole("table")
      .getByText(/Devuelta con observaciones: Falta referencia de evidencia/)
  ).toBeVisible()
  await page.goto(origin)
  await handoff
    .getByLabel("Próxima acción u observación")
    .fill("Referencia incorporada para revisión")
  await handoff
    .getByRole("button", { name: "Preparar envío a Administración" })
    .click()
  await handoff
    .getByRole("link", { name: "Abrir contexto administrativo" })
    .click()
  await handoff
    .getByLabel("Próxima acción u observación")
    .fill("Recibida; control administrativo pendiente")
  await handoff
    .getByRole("button", { name: "Registrar recepción para revisión" })
    .click()
  await expect(
    handoff.getByText("Recibida para revisión", { exact: true }).first()
  ).toBeVisible()
  await handoff.getByText("Historial de coordinación", { exact: true }).click()
  await expect(handoff.getByRole("listitem")).toHaveCount(4)
  await expect(
    page.getByText("Sin referencia", { exact: true }).first()
  ).toBeVisible()
})

test("@smoke V3 filters update in place and browser history restores the view", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 768 })
  await page.goto("/operaciones?tipo=importacion&orden=reference&direccion=asc")
  const first = page
    .getByRole("link", { name: "OP-DEM-2048", exact: true })
    .first()
  await expect(first).toBeVisible()
  expect((await first.boundingBox())!.y).toBeLessThan(768)
  let documents = 0
  page.on("request", (request) => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame())
      documents++
  })
  await page.locator('select[name="agrupar"]').focus()
  await page.locator('select[name="agrupar"]').selectOption("responsible")
  await expect(page).toHaveURL(/agrupar=responsible/)
  await expect(page).toHaveURL(/orden=reference&direccion=asc/)
  await expect(page.locator('select[name="agrupar"]')).toBeFocused()
  expect(documents).toBe(0)
  await page.goBack()
  await expect(page.locator('select[name="agrupar"]')).toHaveValue("")
  await page.goForward()
  await expect(page.locator('select[name="agrupar"]')).toHaveValue(
    "responsible"
  )
  await first.scrollIntoViewIfNeeded()
  const before = await page.evaluate(() => window.scrollY)
  await first.click()
  await page.getByRole("link", { name: "Volver a resultados" }).click()
  await expect(first).toBeFocused()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(before)
})

test("@smoke V3 Portal summary and detail share documentary availability", async ({
  page,
}) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("abt-comex:demo:scenario:v1", "client")
  )
  await page.goto("/portal?cliente=client-demo-centro")
  await page
    .getByRole("link", { name: "Factura comercial · OP-DEM-2054" })
    .click()
  await expect(page).toHaveURL(/portal\/operaciones\/op-demo-2054/)
  await expect(
    page.getByRole("heading", { name: "OP-DEM-2054", exact: true })
  ).toBeVisible()
  await expect(
    page.getByText("Copia disponible", { exact: false })
  ).toBeVisible()
  await expect(page.getByText("PE-DEM-1401")).toHaveCount(0)
})
