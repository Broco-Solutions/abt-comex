import { expect, test } from "../fixtures"

test("@smoke grouping preserves selected sort and filters", async ({
  page,
}) => {
  await page.goto("/operaciones?tipo=exportacion&orden=reference&direccion=asc")
  await page.locator('select[name="agrupar"]').selectOption("responsible")
  await page
    .getByRole("button", { name: "Aplicar", exact: true })
    .last()
    .click()
  await expect(page).toHaveURL(/orden=reference/)
  await expect(page).toHaveURL(/direccion=asc/)
  await expect(page).toHaveURL(/tipo=exportacion/)
  await expect(page).toHaveURL(/agrupar=responsible/)
})

test("@smoke completing a control updates work projections without officialization", async ({
  page,
}) => {
  await page.goto("/operaciones/op-demo-2048/importacion")
  await page.getByLabel("Primera persona").selectOption("demo-person-01")
  await page.getByLabel("Segunda persona").selectOption("demo-person-02")
  await page
    .getByRole("button", { name: "Registrar control de demostración" })
    .click()
  await page.goto("/mi-trabajo?vista=controls")
  await expect(
    page.getByRole("heading", {
      name: "Segundo control previo a oficialización",
    })
  ).toHaveCount(0)
  await page.goto("/inicio")
  await expect(
    page.getByText("Segundo control previo a oficialización")
  ).toHaveCount(0)
})

test("@smoke client detail and work quote preserve their origins", async ({
  page,
}) => {
  await page.goto(
    "/clientes/client-demo-norte?returnTo=%2Fclientes%3Fq%3Dnorte"
  )
  await page.getByRole("link", { name: "Abrir operación" }).first().click()
  await page.getByRole("link", { name: "Volver a resultados" }).click()
  await expect(page).toHaveURL(/clientes\/client-demo-norte/)
  await page.goto("/mi-trabajo?trabajo=wrk-quote-review-04")
  await page.getByRole("link", { name: "Abrir cotización" }).click()
  await expect(
    page.getByRole("heading", { name: "COT-DEM-001", exact: true })
  ).toBeVisible()
  await page
    .getByRole("link", { name: /Volver a/ })
    .first()
    .click()
  await expect(page).toHaveURL(/mi-trabajo\?trabajo=wrk-quote-review-04/)
})
