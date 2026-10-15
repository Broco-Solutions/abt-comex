import { expect, test } from "../fixtures"
test("@smoke Direction defaults to fixture month, compares equal cuts and keeps filters without document reload", async ({
  page,
}) => {
  await page.goto("/gestion")
  await expect(page.getByLabel("Período", { exact: true })).toHaveValue(
    "this-month"
  )
  await expect(
    page.getByText(/Comparación: 01\/09\/2026–14\/09\/2026/)
  ).toBeVisible()
  await expect(
    page.getByRole("region", { name: "Situación económico-financiera" })
  ).toContainText("USD 2.059,91")
  let documents = 0
  page.on("request", (r) => {
    if (r.isNavigationRequest() && r.frame() === page.mainFrame()) documents++
  })
  await page.getByLabel("Comparar con", { exact: true }).selectOption("year")
  await expect(page.getByText(/sin historia suficiente/)).toBeVisible()
  await page
    .getByLabel("Período", { exact: true })
    .selectOption("previous-month")
  await expect(
    page.getByText(/01\/09\/2026–30\/09\/2026 · extremos inclusivos/)
  ).toBeVisible()
  await page.getByLabel("Período", { exact: true }).selectOption("custom")
  await page.getByLabel("Desde", { exact: true }).fill("01/10/2026")
  await page.getByLabel("Hasta", { exact: true }).fill("")
  await page.getByRole("button", { name: "Aplicar período" }).click()
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Completá Desde y Hasta"
  )
  await page.getByLabel("Hasta", { exact: true }).fill("14/10/2026")
  await page.getByRole("button", { name: "Aplicar período" }).click()
  await expect(
    page.getByRole("region", { name: "Situación económico-financiera" })
  ).toContainText("USD 2.059,91")
  expect(documents).toBe(0)
})
test("@smoke complete client analysis preserves period search order and the client voucher operation return chain", async ({
  page,
}) => {
  await page.goto(
    "/gestion?vista=clientes&desde=2026-10-01&hasta=2026-10-14&orden=invoice&sentido=asc&buscar=Norte"
  )
  const origin = page.url()
  await expect(
    page
      .getByRole("table", {
        name: "Comparación económica y operativa de clientes",
      })
      .getByRole("row")
  ).toHaveCount(2)
  await page
    .getByRole("link", {
      name: "Abrir cliente Cliente Demo Norte",
      exact: true,
    })
    .filter({ visible: true })
    .click()
  const situation = page.getByRole("region", {
    name: "Situación económica y operativa",
  })
  await expect(situation).toContainText("USD 207,55")
  await situation
    .getByText("Comprobantes, movimientos y obligaciones explicativos")
    .click()
  await situation
    .getByRole("list", { name: "Registros financieros seleccionados" })
    .getByRole("link", { name: "FAC-EVAL-3107", exact: true })
    .click()
  await page.getByRole("link", { name: "OP-DEM-3107", exact: true }).click()
  await page
    .getByRole("link", { name: "Volver a Administración", exact: true })
    .click()
  await page
    .getByRole("link", { name: "Volver a la organización", exact: true })
    .click()
  await page
    .getByRole("link", { name: "Volver al contexto anterior", exact: true })
    .click()
  await expect(page).toHaveURL(origin)
  await expect(page.getByLabel("Ordenar por", { exact: true })).toHaveValue(
    "invoice"
  )
  await expect(page.getByLabel("Sentido", { exact: true })).toHaveValue("asc")
  await expect(page.getByLabel("Buscar cliente", { exact: true })).toHaveValue(
    "Norte"
  )
})
test("@smoke supplier analysis keeps purchases expenses payments and obligations distinguishable on tablet and mobile", async ({
  page,
}) => {
  await page.goto("/gestion?vista=proveedores")
  await expect(
    page.getByRole("table", { name: "Comparación económica de proveedores" })
  ).toContainText("Compras referenciadas")
  await page.getByLabel("Ordenar por", { exact: true }).selectOption("payment")
  await page.getByLabel("Sentido", { exact: true }).selectOption("asc")
  for (const width of [1024, 768, 390]) {
    await page.setViewportSize({ width, height: 844 })
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true)
    await expect(
      page
        .getByRole("link", { name: /Abrir proveedor/ })
        .filter({ visible: true })
        .first()
    ).toBeVisible()
  }
  await page.getByLabel("Vista de Dirección").selectOption("obligaciones")
  await expect(
    page.getByText(/Los saldos incluyen comprobantes anteriores al período/)
  ).toBeVisible()
})
