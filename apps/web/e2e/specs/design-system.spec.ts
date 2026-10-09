import { expect, test } from "@playwright/test"

test("@smoke design system loads and its navigation works", async ({
  page,
}) => {
  const consoleErrors: string[] = []
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text())
  })
  page.on("pageerror", (error) => consoleErrors.push(error.message))

  const response = await page.goto("/design-system")
  expect(response?.ok()).toBe(true)
  await expect(
    page.getByRole("heading", { level: 1, name: "Design System ABT" })
  ).toBeVisible()

  const navigation = page.getByRole("navigation", {
    name: "Secciones del design system",
  })
  const firstSection = navigation.getByRole("link", { name: "Fundamentos" })
  await firstSection.click()
  await expect(page).toHaveURL(/#fundamentos$/)
  await expect(
    page.getByRole("heading", { name: "Fundamentos y branding" })
  ).toBeVisible()
  expect(consoleErrors).toEqual([])
})

test("@visual design system header matches the approved baseline", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto("/design-system")
  await expect(
    page.getByRole("heading", { level: 1, name: "Design System ABT" })
  ).toBeVisible()
  await expect(page.locator("main > div > header")).toHaveScreenshot(
    "design-system-header.png",
    {
      animations: "disabled",
    }
  )
})
