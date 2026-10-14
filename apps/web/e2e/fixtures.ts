import { test as base } from "@playwright/test"
export * from "@playwright/test"

// Regression tests explicitly use the integral review perspective. The product
// itself requires a scenario choice and does not default to financial access.
export const test = base.extend({
  page: async ({ page }, run) => {
    await page.addInitScript(() => {
      if (!sessionStorage.getItem("abt:test:scenario-initialized")) {
        sessionStorage.setItem("abt-comex:demo:scenario:v1", "direction")
        sessionStorage.setItem("abt:test:scenario-initialized", "true")
      }
    })
    await run(page)
  },
})
