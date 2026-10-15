import { screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, expect, it, vi } from "vitest"
import { OnboardingProvider } from "../onboarding/onboarding-provider"

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

import { renderComponent } from "@/test/utils/render"
import { AppShellStateProvider } from "./app-shell-state"
import { AppSidebar } from "./app-sidebar"

vi.mock("next/navigation", () => ({
  usePathname: () => "/operaciones",
  useSearchParams: () => new URLSearchParams("tipo=importacion"),
}))

it("renders the complete navigation, active state and brand attribution", () => {
  renderComponent(
    <OnboardingProvider>
      <AppShellStateProvider>
        <AppSidebar />
      </AppShellStateProvider>
    </OnboardingProvider>
  )

  expect(
    screen.getByRole("navigation", { name: "Navegación principal" })
  ).toBeVisible()
  expect(screen.getByRole("link", { name: "Importaciones" })).toHaveAttribute(
    "aria-current",
    "page"
  )
  expect(screen.getByRole("link", { name: "Operaciones" })).toHaveAttribute(
    "data-navigation-state",
    "section-active"
  )
  expect(screen.getByRole("link", { name: "Operaciones" })).not.toHaveAttribute(
    "aria-current"
  )
  expect(screen.getAllByRole("link", { current: "page" })).toHaveLength(1)
  expect(screen.queryByRole("link", { name: "Todas" })).not.toBeInTheDocument()
  expect(
    screen.getByRole("link", {
      name: "Powered by Broco Solutions, enlace externo",
    })
  ).toBeVisible()
  expect(
    screen.getByRole("link", { name: "ABT Comex — Ir a Inicio" })
  ).toBeVisible()
  expect(
    screen.getByRole("button", { name: "Contraer navegación" })
  ).toBeVisible()

  const navigation = screen.getByRole("navigation", {
    name: "Navegación principal",
  })
  const links = within(navigation).getAllByRole("link")
  expect(
    links.slice(0, 5).map((link) => link.getAttribute("aria-label"))
  ).toEqual([
    "Inicio",
    "Mi trabajo",
    "Operaciones",
    "Importaciones",
    "Exportaciones",
  ])
  expect(
    within(navigation).getByRole("link", { name: "Mi trabajo" })
  ).toHaveAttribute("href", "/mi-trabajo")
  expect(
    within(navigation).getByRole("link", { name: "Operaciones" })
  ).toHaveAttribute("href", "/operaciones")
  expect(
    within(navigation).getByRole("link", { name: "Importaciones" })
  ).toHaveAttribute("href", "/operaciones?tipo=importacion")
  expect(
    within(navigation).getByRole("link", { name: "Exportaciones" })
  ).toHaveAttribute("href", "/operaciones?tipo=exportacion")
  expect(screen.getByRole("region", { name: "Operación diaria" })).toBeVisible()
  expect(screen.getByRole("region", { name: "Registros" })).toBeVisible()
  expect(screen.getByRole("region", { name: "Gestión" })).toBeVisible()
  expect(
    within(navigation).queryByRole("link", { name: "Configuración" })
  ).toBeNull()
  expect(
    screen.getByRole("navigation", { name: "Configuración y cuenta" })
  ).toContainElement(screen.getByRole("link", { name: "Configuración" }))
  expect(
    screen.getByRole("link", { name: "Importaciones" }).querySelector("svg")
  ).toBeNull()
})

it("switches to a fully operable compact rail with tooltips and flyout", async () => {
  const user = userEvent.setup()
  renderComponent(
    <OnboardingProvider>
      <AppShellStateProvider>
        <AppSidebar />
      </AppShellStateProvider>
    </OnboardingProvider>
  )

  const collapseButton = screen.getByRole("button", {
    name: "Contraer navegación",
  })
  await user.click(collapseButton)

  const expandButton = screen.getByRole("button", {
    name: "Expandir navegación",
  })
  expect(expandButton).toHaveFocus()
  expect(
    screen
      .getByRole("navigation", { name: "Navegación principal" })
      .closest("[data-sidebar-mode]")
  ).toHaveAttribute("data-sidebar-mode", "compact")
  expect(
    screen.getByRole("link", { name: "ABT Comex — Ir a Inicio" })
  ).toHaveAttribute("data-brand-variant", "isotype")
  expect(document.querySelector('[data-brand-variant="wordmark"]')).toBeNull()
  expect(
    screen.getByRole("link", { name: "Powered by Broco Solutions" })
  ).toHaveAttribute("data-brand-attribution", "compact")

  const homeLink = screen.getByRole("link", { name: "Inicio" })
  await user.hover(homeLink)
  expect(await screen.findByRole("tooltip")).toHaveTextContent("Inicio")
  await user.unhover(homeLink)

  const operationsLink = screen.getByRole("link", { name: "Operaciones" })
  operationsLink.focus()
  await waitFor(() =>
    expect(operationsLink).toHaveAttribute("aria-expanded", "true")
  )
  expect(screen.getByText("Importaciones")).toBeVisible()
  await user.tab()
  expect(screen.getByRole("link", { name: "Importaciones" })).toHaveFocus()
  await user.keyboard("{Escape}")
  expect(operationsLink).toHaveFocus()
  expect(operationsLink).toHaveAttribute("aria-expanded", "false")
})
