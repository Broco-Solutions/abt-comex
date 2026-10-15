import { test, expect } from "../fixtures"

test("@smoke four administrative work areas retain direct routes and secondary context", async ({
  page,
}) => {
  await page.goto("/administracion")
  await expect(
    page.getByRole("heading", { name: "Bandeja administrativa", exact: true })
  ).toBeVisible()
  const nav = page.getByRole("navigation", {
    name: "Secciones de Administración",
  })
  await expect(nav.getByRole("link")).toHaveCount(4)
  await nav
    .getByRole("link", { name: "Gastos y rendiciones", exact: true })
    .click()
  await expect(page).toHaveURL(/\/administracion\/gastos$/)
  const secondary = page.getByRole("navigation", {
    name: "Vistas del área administrativa",
  })
  await secondary
    .getByRole("link", { name: "Anticipos y rendiciones", exact: true })
    .click()
  await expect(page).toHaveURL(/\/administracion\/rendiciones$/)
  await nav
    .getByRole("link", { name: "Ingresos y egresos", exact: true })
    .click()
  await expect(
    page.getByRole("heading", { name: "Ingresos y egresos", exact: true })
  ).toBeVisible()
  await nav
    .getByRole("link", { name: "Comprobantes y cuentas", exact: true })
    .click()
  await secondary
    .getByRole("link", { name: "Cuentas por pagar", exact: true })
    .click()
  await expect(page).toHaveURL(/\/administracion\/carteras\?cartera=pagar$/)
  await expect(
    secondary.getByRole("link", { name: "Cuentas por pagar", exact: true })
  ).toHaveAttribute("aria-current", "page")
  await page.goto("/configuracion")
  await page
    .getByRole("link", { name: "Categorías y conceptos", exact: true })
    .click()
  await expect(page).toHaveURL(/\/configuracion\/categorias$/)
  await expect(
    page.getByRole("heading", { name: "Categorías y conceptos", exact: true })
  ).toBeVisible()
  await page.goto("/administracion/categorias")
  await expect(
    page.getByRole("heading", { name: "Categorías y conceptos", exact: true })
  ).toBeVisible()
})

test("@smoke mobile administrative area picker keeps primary actions and subsidiary routes reachable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/administracion")
  await page
    .getByLabel("Área administrativa", { exact: true })
    .selectOption("gastos")
  await expect(
    page.getByRole("heading", { name: "Gastos", exact: true })
  ).toBeVisible()
  await page
    .getByRole("link", { name: "Anticipos y rendiciones", exact: true })
    .click()
  await expect(
    page.getByRole("heading", { name: "Anticipos y rendiciones", exact: true })
  ).toBeVisible()
  await page
    .getByLabel("Área administrativa", { exact: true })
    .selectOption("cuentas")
  await page
    .getByRole("link", { name: "Cuentas por cobrar", exact: true })
    .click()
  await expect(page.getByLabel("Cartera", { exact: true })).toHaveValue(
    "Cobrar"
  )
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true)
})
