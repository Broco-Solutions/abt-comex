import { expect, test } from "../fixtures"

test("@smoke Inicio resume Mi trabajo and opens its local context safely", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("/inicio")

  await expect(
    page.getByRole("heading", { name: "Requiere atención" })
  ).toBeVisible()
  await expect(page.getByText("Entorno de evaluación")).toBeVisible()
  await expect(page.getByText("Información comercial restringida")).toHaveCount(
    0
  )

  await page.getByRole("link", { name: "Ver contexto" }).first().click()
  await expect(page).toHaveURL(/\/mi-trabajo\?trabajo=wrk-imp-control-01/)
  await expect(
    page.getByText("No se habilita oficialización en este prototipo.")
  ).toBeVisible()
  await expect(
    page.getByRole("link", { name: "Cerrar contexto" })
  ).toBeVisible()
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
  await page.getByRole("link", { name: "Volver a Mi trabajo" }).click()
  await expect(page).toHaveURL(/mi-trabajo/)
  await expect(page.getByRole("heading", { name: /Mi trabajo/ })).toBeVisible()
  await expect(
    page.getByText("No se habilita oficialización en este prototipo.")
  ).toBeVisible()
  await page.getByRole("link", { name: "Cerrar contexto" }).click()
  await expect(page).toHaveURL("/mi-trabajo")
  await page.goto("/mi-trabajo?trabajo=wrk-imp-control-01")

  await page.getByRole("link", { name: "Cerrar contexto" }).click()
  await expect(page).toHaveURL("/mi-trabajo")
  await page.getByLabel("Tipo").selectOption("tarea")
  await page
    .getByLabel("Buscar en título, origen o referencia")
    .fill("sin operación")
  await page.getByRole("button", { name: "Aplicar filtros" }).click()
  await expect(page).toHaveURL(/tipo=tarea/)
  await expect(
    page.getByText("Completar referencia de una rendición")
  ).toBeVisible()
  await expect(page.getByText(/no tiene una operación vinculada/)).toBeVisible()
  await expect(page.getByText("Información comercial restringida")).toHaveCount(
    0
  )
})

test("@smoke worklist remains usable on mobile and keeps the source state explicit", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/mi-trabajo?vista=upcoming")

  await expect(
    page.getByRole("heading", { level: 1, name: "Mi trabajo" })
  ).toBeVisible()
  await expect(page.getByText(/dato desactualizado/i).first()).toBeVisible()
  await expect(page.getByText(/no está conectada/i).first()).toBeVisible()
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

test("@smoke recoverable reading error preserves filters and restores the list", async ({
  page,
}) => {
  await page.goto(
    "/mi-trabajo?q=post-embarque&tipo=tarea&vista=mine&error=lectura"
  )

  await expect(
    page.getByRole("alert", { name: "No pudimos cargar tus pendientes" })
  ).toContainText("Conservamos la búsqueda, el tipo y la vista")
  await expect(page.getByText(/no confirma conteos/)).toBeVisible()
  await page.getByRole("link", { name: "Reintentar lectura" }).click()

  await expect(page).toHaveURL(/q=post-embarque.*tipo=tarea.*vista=mine/)
  await expect(
    page.getByText("Completar documentación de post-embarque")
  ).toBeVisible()
})

test("@smoke restricted work shows no rows or counts", async ({ page }) => {
  await page.goto("/mi-trabajo?error=sin-permiso")

  await expect(
    page.getByRole("heading", {
      name: "No hay información disponible en esta vista",
    })
  ).toBeVisible()
  await expect(page.getByText(/no confirma conteos/)).toBeVisible()
  await expect(
    page.getByRole("list", { name: "Pendientes visibles" })
  ).toHaveCount(0)
  await expect(page.getByText("Información comercial restringida")).toHaveCount(
    0
  )
})
