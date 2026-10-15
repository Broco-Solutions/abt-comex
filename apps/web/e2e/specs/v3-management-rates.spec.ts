import { expect, test } from "../fixtures"

test("@smoke management rates revise the applicable interval, preserve originals and expose missing conversion", async ({
  page,
}) => {
  const expense = "/administracion/gastos/expense-demo-general-01"
  await page.goto(expense)
  const original = page.getByText(/ARS\s+5\.000,00/).first()
  await expect(original).toBeVisible()
  await expect(
    page.getByText(/Equivalente de gestión: USD\s+3,77/)
  ).toBeVisible()
  await page.goto("/configuracion/cotizaciones-gestion")
  await page
    .getByRole("button", { name: "Editar referencia del 01/10/2026" })
    .click()
  let dialog = page.getByRole("dialog")
  await dialog.getByLabel("ARS por USD").fill("2650")
  await dialog.getByRole("button", { name: "Guardar referencia local" }).click()
  await expect(dialog).toHaveCount(0)
  await page.getByText("Histórico de revisiones (1)", { exact: true }).click()
  await expect(
    page.locator("details").getByText(/revisión 1 · Válida/)
  ).toBeVisible()
  await page.goto(expense)
  await expect(original).toBeVisible()
  await expect(
    page.getByText(/Equivalente de gestión: USD\s+1,89/)
  ).toBeVisible()
  await page.goto("/configuracion/cotizaciones-gestion")
  await page
    .getByRole("button", { name: "Editar referencia del 01/10/2026" })
    .click()
  dialog = page.getByRole("dialog")
  await dialog.getByLabel("Referencia válida").uncheck()
  await dialog.getByRole("button", { name: "Guardar referencia local" }).click()
  await page.goto(expense)
  await expect(
    page.getByText("Equivalente de gestión: Pendiente de conversión", {
      exact: true,
    })
  ).toBeVisible()
  await expect(original).toBeVisible()
})

test("@smoke historical balance uses its cut and rate administration stays capability scoped", async ({
  page,
}) => {
  const source = "/administracion/carteras?cartera=pagar&corte=2026-08-25"
  await page.goto(
    `/administracion/comprobantes/purchase-demo-01?returnTo=${encodeURIComponent(source)}`
  )
  await expect(
    page.getByText(/Valoración del saldo: USD\s+39,22/)
  ).toBeVisible()
  await page.getByText(/Valoración del saldo:/).click()
  await expect(
    page.getByText(/Valoración a fecha de corte: 25\/08\/2026/)
  ).toBeVisible()
  await page.getByRole("link", { name: "Volver a la cartera" }).click()
  await expect(page).toHaveURL(/corte=2026-08-25/)
  await page.evaluate(() => {
    sessionStorage.setItem("abt-comex:demo:scenario:v1", "operations")
  })
  await page.goto("/configuracion/cotizaciones-gestion")
  await expect(
    page.getByRole("button", { name: /Editar referencia/ })
  ).toHaveCount(0)
  await expect(page.getByText("1325", { exact: false })).toHaveCount(0)
})

test("@smoke rate editor is keyboard reachable on mobile and rejects duplicate dates", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/configuracion/cotizaciones-gestion")
  const trigger = page.getByRole("button", {
    name: "Nueva cotización de gestión",
  })
  await trigger.focus()
  await page.keyboard.press("Enter")
  const dialog = page.getByRole("dialog")
  const date = dialog.getByLabel("Vigente desde", { exact: true })
  await date.fill("31/02/2026")
  await dialog.getByLabel("ARS por USD").focus()
  await expect(date).toHaveAttribute("aria-invalid", "true")
  await dialog
    .getByRole("button", { name: "Elegir fecha: Vigente desde" })
    .click()
  const calendar = page.getByRole("dialog", {
    name: "Calendario: Vigente desde",
  })
  await calendar
    .getByRole("combobox", { name: "Año", exact: true })
    .selectOption("2026")
  await calendar
    .getByRole("combobox", { name: "Mes", exact: true })
    .selectOption({ label: "octubre" })
  await calendar
    .getByRole("button", { name: "jueves, 1 de octubre de 2026", exact: true })
    .focus()
  await page.keyboard.press("ArrowRight")
  await page.keyboard.press("Enter")
  await expect(date).toHaveValue("02/10/2026")
  await date.fill("01/10/2026")
  await dialog.getByLabel("ARS por USD").fill("1300")
  await dialog.getByRole("button", { name: "Guardar referencia local" }).click()
  await expect(dialog.getByRole("alert")).toContainText("Ya existe")
  await page.keyboard.press("Escape")
  await expect(trigger).toBeFocused()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true)
})
