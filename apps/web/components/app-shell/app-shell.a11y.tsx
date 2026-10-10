import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "vitest-axe"
import { beforeEach, expect, it, vi } from "vitest"

import { renderComponent } from "@/test/utils/render"
import { AppShell } from "./app-shell"
import { NAVIGATION_STORAGE_KEY } from "./app-shell-state"

vi.mock("next/navigation", () => ({
  usePathname: () => "/inicio",
  useSearchParams: () => new URLSearchParams(),
}))

async function expectNoAxeViolations(container: HTMLElement) {
  const canvasContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  try {
    expect(
      (
        await axe(container, {
          rules: { "color-contrast": { enabled: false } },
        })
      ).violations
    ).toEqual([])
  } finally {
    canvasContext.mockRestore()
  }
}

beforeEach(() => window.localStorage.clear())

it("has no known automated violations in the shell and onboarding", async () => {
  renderComponent(
    <AppShell>
      <h1>Inicio</h1>
      <p>Contenido de prueba.</p>
    </AppShell>
  )
  await screen.findByRole("heading", { name: "Bienvenido a ABT Comex" })
  await expectNoAxeViolations(document.body)
})

it("has no known automated violations in contextual help", async () => {
  const user = userEvent.setup()
  renderComponent(
    <AppShell>
      <h1>Inicio</h1>
    </AppShell>
  )
  await user.click(screen.getByRole("button", { name: "Abrir ayuda" }))
  await screen.findByRole("dialog", { name: "Ayuda de ABT Comex" })
  await expectNoAxeViolations(document.body)
})

it("has no known automated violations in mobile navigation", async () => {
  const user = userEvent.setup()
  renderComponent(
    <AppShell>
      <h1>Inicio</h1>
    </AppShell>
  )
  await user.click(
    screen.getByRole("button", { name: "Abrir navegación principal" })
  )
  await screen.findByRole("dialog", { name: "Navegación principal" })
  await expectNoAxeViolations(document.body)
})

it("has no known automated violations in compact navigation and its flyout", async () => {
  localStorage.setItem(
    NAVIGATION_STORAGE_KEY,
    JSON.stringify({ mode: "compact" })
  )
  renderComponent(
    <AppShell>
      <h1>Inicio</h1>
    </AppShell>
  )

  await screen.findByRole("button", { name: "Expandir navegación" })
  const operationsLink = screen.getByRole("link", { name: "Operaciones" })
  operationsLink.focus()
  expect(
    await screen.findByRole("link", { name: "Importaciones" })
  ).toBeVisible()
  await expectNoAxeViolations(document.body)
})
