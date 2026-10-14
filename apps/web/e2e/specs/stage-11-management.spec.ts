import { expect, test } from "@playwright/test"

test("@smoke management summary drills into operations, clients and work while keeping economic sources unavailable", async ({
  page,
}) => {
  await page.goto("/gestion")
  await expect(page.getByRole("heading", { name: "Gestión" })).toBeVisible()
  await expect(
    page.getByText("Escenario ficticio", { exact: false })
  ).toBeVisible()
  await expect(
    page.getByText(
      /no representan volumen, productividad ni resultados de ABT/i
    )
  ).toBeVisible()
  await expect(page.getByRole("link", { name: "Abrir desglose" })).toBeVisible()

  await page.getByRole("link", { name: "Operación", exact: true }).click()
  await expect(page).toHaveURL(/\/gestion\?vista=operaciones/)
  await expect(
    page.getByRole("heading", { name: "Situación de operaciones" })
  ).toBeVisible()
  await page.getByRole("link", { name: "Abrir operaciones" }).first().click()
  await expect(page).toHaveURL(
    /\/operaciones\?tipo=(importacion|exportacion)&situacion=/
  )

  await page.goto("/gestion?vista=clientes")
  await page.getByRole("link", { name: "Abrir cliente" }).first().click()
  await expect(page).toHaveURL(/\/clientes\/client-demo-/)
  await page.getByRole("link", { name: "Volver a Clientes" }).click()
  await expect(page).toHaveURL(/\/gestion\?vista=clientes/)

  await page.goto("/gestion?vista=trabajo")
  await page.getByRole("link", { name: "Abrir contexto" }).first().click()
  await expect(page).toHaveURL(/\/mi-trabajo\?q=.*&trabajo=/)

  await page.goto("/gestion?vista=economia")
  await expect(
    page.getByText(/Interbanking · evaluación sólo lectura/)
  ).toBeVisible()
  await expect(
    page.getByText(
      /no se presentan resultados, totales, saldos, costos ni márgenes/i
    )
  ).toBeVisible()
  await expect(page.getByText(/\$\s?\d/)).toHaveCount(0)
  await expect(
    page.getByText(/18 categorías históricas REP-001–REP-018/)
  ).toBeVisible()
})

test("@smoke management adapts to narrow screens and withholds counts on access or source failures", async ({
  page,
}) => {
  await page.goto("/gestion?vista=clientes")
  for (const width of [1440, 1280, 1024, 820, 768, 390]) {
    await page.setViewportSize({ width, height: 844 })
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      ),
      `no page overflow at ${width}px`
    ).toBe(true)
  }
  await expect(
    page.getByText("Deslizá horizontalmente para ver todas las vistas.")
  ).toBeVisible()

  await page.goto("/gestion?error=sin-permiso")
  await expect(
    page.getByText(/no confirma si existen registros o métricas/i)
  ).toBeVisible()
  await expect(page.getByText("Cliente Demo Norte")).toHaveCount(0)
  await expect(page.getByText("Operaciones sintéticas")).toHaveCount(0)

  await page.goto("/gestion?error=lectura")
  await expect(
    page.getByText(/no se muestra un conteo que no pudo confirmarse/i)
  ).toBeVisible()
  await expect(page.getByText("Cliente Demo Norte")).toHaveCount(0)
})
