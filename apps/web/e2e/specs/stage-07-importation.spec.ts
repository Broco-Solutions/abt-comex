import { expect, test } from "../fixtures"

test("@smoke importation keeps the customs source explicit and gates the local double control on distinct people", async ({
  page,
}) => {
  await page.goto(
    "/operaciones/op-demo-2048/importacion?returnTo=%2Foperaciones%2Fop-demo-2048%3FreturnTo%3D%252Fmi-trabajo%253Ftrabajo%253Dwrk-imp-control-01"
  )
  await expect(
    page.getByRole("heading", { name: "Importación · OP-DEM-2048" })
  ).toBeVisible()
  await expect(page.getByText(/Alpha2000 \/ MARÍA/).first()).toBeVisible()
  await expect(
    page
      .getByRole("region", { name: "Contexto de la operación" })
      .getByText("No conectada", { exact: true })
  ).toBeVisible()
  await expect(
    page.getByText(/no hay un checklist universal configurado/i)
  ).toBeVisible()

  await page
    .getByLabel("Primera persona de demostración")
    .selectOption("demo-person-01")
  await expect(
    page.getByLabel("Segunda persona de demostración").locator("option")
  ).toHaveCount(3)
  await expect(
    page
      .getByLabel("Segunda persona de demostración")
      .locator('option[value="demo-person-01"]')
  ).toHaveCount(0)
  await page
    .getByLabel("Segunda persona de demostración")
    .selectOption("demo-person-02")
  await page
    .getByRole("button", { name: "Registrar control de demostración" })
    .click()
  await expect(
    page.getByRole("heading", { name: "Doble control previo a oficialización" })
  ).toBeVisible()
  await expect(
    page.getByText("Doble control completado en el escenario local")
  ).toBeVisible()
  await expect(
    page.getByText(/no registra una revisión real ni habilita oficialización/)
  ).toBeVisible()
  await page.reload()
  await expect(
    page.getByText("Doble control completado en el escenario local")
  ).toBeVisible()
  await page
    .getByRole("button", { name: "Reiniciar escenario de control" })
    .click()
  await expect(page.getByLabel("Primera persona de demostración")).toHaveValue(
    ""
  )
  await page.getByRole("link", { name: "Volver a la operación" }).click()
  await expect(page).toHaveURL(/\/operaciones\/op-demo-2048\?returnTo=/)
  await page.getByRole("link", { name: "Volver a Mi trabajo" }).click()
  await expect(page).toHaveURL(/mi-trabajo/)
})

test("@smoke restricted or non-importation routes do not expose operation details", async ({
  page,
}) => {
  await page.goto("/operaciones/op-demo-2048/importacion?error=sin-permiso")
  await expect(
    page.getByRole("heading", { name: "Importación no disponible" })
  ).toBeVisible()
  await expect(page.getByText("OP-DEM-2048")).toHaveCount(0)
  await expect(page.getByText("Cliente Demo Norte")).toHaveCount(0)

  await page.goto("/operaciones/op-demo-3107/importacion")
  await expect(
    page.getByRole("heading", { name: "Importación no disponible" })
  ).toBeVisible()
  await expect(page.getByText("OP-DEM-3107")).toHaveCount(0)
})

test("@smoke operation detail opens the matching importation workspace and returns", async ({
  page,
}) => {
  await page.goto("/operaciones/op-demo-2048")
  await page.getByRole("link", { name: "Abrir espacio de Importación" }).click()
  await expect(page).toHaveURL(
    /\/operaciones\/op-demo-2048\/importacion\?returnTo=/
  )
  await expect(
    page.getByRole("heading", { name: "Importación · OP-DEM-2048" })
  ).toBeVisible()
  await page.getByRole("link", { name: "Volver a la operación" }).click()
  await expect(page).toHaveURL(/\/operaciones\/op-demo-2048\?returnTo=/)
  await expect(page.getByRole("heading", { name: "OP-DEM-2048" })).toBeVisible()
})

test("@smoke importation workspace remains usable from mobile to desktop widths", async ({
  page,
}) => {
  await page.goto("/operaciones/op-demo-2048/importacion")
  await expect(
    page.getByRole("heading", { name: "Importación · OP-DEM-2048" })
  ).toBeVisible()
  for (const width of [1440, 1280, 1024, 960, 900, 820, 768, 390]) {
    await page.setViewportSize({ width, height: 844 })
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      ),
      `no horizontal page overflow at ${width}px`
    ).toBe(true)
  }
})
