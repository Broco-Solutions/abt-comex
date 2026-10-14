import { expect, test } from "@playwright/test"

test("@smoke guided operation queries cite their source and abstain on missing facts", async ({
  page,
}) => {
  await page.goto("/operaciones/op-demo-2054")
  await expect(
    page.getByRole("heading", { name: "Consultas guiadas" })
  ).toBeVisible()
  await expect(page.getByText(/Demostración · sin IA/)).toBeVisible()

  for (const width of [1440, 1280, 1024, 768, 390]) {
    await page.setViewportSize({ width, height: 844 })
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      ),
      `no page overflow at ${width}px`
    ).toBe(true)
  }

  const documentsQuestion = page.getByRole("button", {
    name: "¿Qué documento falta?",
  })
  await documentsQuestion.focus()
  await expect(documentsQuestion).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(
    page.getByText(/no identifica qué documento falta/i)
  ).toBeVisible()
  await expect(
    page.getByText(/se abstiene de inferir documentos/i)
  ).toBeVisible()
  await expect(
    page.getByText(/Situación de la operación en el fixture/)
  ).toBeVisible()

  await page
    .getByRole("button", { name: "¿Se confirmó el estado aduanero?" })
    .click()
  await expect(
    page.getByText(/Alpha2000 y ARCA\/MOA no están conectados/)
  ).toBeVisible()
  await expect(page.getByText(/Sin consulta a fuente externa/)).toBeVisible()
})

test("@smoke assisted queries remain inside an authorized operation context", async ({
  page,
}) => {
  await page.goto("/operaciones/op-demo-2054?error=sin-permiso")
  await expect(
    page.getByRole("heading", { name: "Operación no disponible" })
  ).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Consultas guiadas" })
  ).toHaveCount(0)
  await expect(page.getByText("OP-DEM-2054")).toHaveCount(0)
})
