import { test, expect } from "../fixtures"

test("@smoke contextual Inicio and direct work navigation preserve task context", async ({
  page,
}) => {
  await page.goto("/inicio")
  await expect(
    page.getByRole("navigation", { name: "Acciones rápidas" })
  ).toBeVisible()
  await expect(
    page.getByRole("link", { name: "Ver análisis", exact: true })
  ).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Próximos vencimientos" })
  ).toBeVisible()
  await page.goto("/mi-trabajo?q=control&vista=controls")
  await page.getByRole("link", { name: "Abrir operación", exact: true }).click()
  await expect(
    page.getByRole("heading", { name: "OP-DEM-2048", exact: true })
  ).toBeVisible()
  await page.getByRole("link", { name: "Volver a Mi trabajo" }).click()
  await expect(page).toHaveURL(/q=control.*vista=controls.*trabajo=/)
})

test("@smoke local approval removes the same review from Inicio and Mi trabajo", async ({
  page,
}) => {
  await page.goto("/cotizaciones/quote-demo-001")
  await page.getByRole("button", { name: "Simular aprobación interna" }).click()
  await page.goto("/mi-trabajo")
  await expect(
    page.getByText("Revisar versión antes del envío al cliente", {
      exact: true,
    })
  ).toHaveCount(0)
  await page.goto("/inicio")
  await expect(
    page.getByText("Revisar versión antes del envío al cliente", {
      exact: true,
    })
  ).toHaveCount(0)
})
