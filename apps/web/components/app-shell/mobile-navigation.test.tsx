import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, expect, it, vi } from "vitest"

import { renderComponent } from "@/test/utils/render"
import {
  AppShellStateProvider,
  NAVIGATION_STORAGE_KEY,
} from "./app-shell-state"
import { MobileNavigation } from "./mobile-navigation"
import { OnboardingProvider } from "../onboarding/onboarding-provider"

vi.mock("next/navigation", () => ({
  usePathname: () => "/inicio",
  useSearchParams: () => new URLSearchParams(),
}))

beforeEach(() => {
  window.localStorage.clear()
  sessionStorage.clear()
})

function renderMobileNavigation() {
  return renderComponent(
    <OnboardingProvider>
      <AppShellStateProvider>
        <MobileNavigation />
      </AppShellStateProvider>
    </OnboardingProvider>
  )
}

it("opens, focuses navigation, closes after selection and restores focus", async () => {
  const user = userEvent.setup()
  renderMobileNavigation()

  const trigger = screen.getByRole("button", {
    name: "Abrir navegación principal",
  })
  await user.click(trigger)

  const dialog = await screen.findByRole("dialog", {
    name: "Navegación principal",
  })
  expect(dialog).toBeVisible()
  expect(screen.getByRole("link", { name: "Inicio" })).toHaveFocus()
  const navigation = within(dialog).getByRole("navigation", {
    name: "Navegación principal",
  })
  expect(
    within(navigation)
      .getAllByRole("link")
      .slice(0, 5)
      .map((link) => link.getAttribute("aria-label"))
  ).toEqual([
    "Inicio",
    "Mi trabajo",
    "Operaciones",
    "Importaciones",
    "Exportaciones",
  ])
  expect(
    within(navigation).queryByRole("link", { name: "Todas" })
  ).not.toBeInTheDocument()
  await user.tab()
  expect(
    within(navigation).getByRole("link", { name: "Mi trabajo" })
  ).toHaveFocus()
  await user.tab()
  expect(
    within(navigation).getByRole("link", { name: "Operaciones" })
  ).toHaveFocus()

  const clientsLink = screen.getByRole("link", { name: "Clientes" })
  clientsLink.addEventListener("click", (event) => event.preventDefault())
  await user.click(clientsLink)
  expect(dialog).not.toBeInTheDocument()
  expect(trigger).toHaveFocus()
})

it("closes with Escape", async () => {
  const user = userEvent.setup()
  renderMobileNavigation()
  const trigger = screen.getByRole("button", {
    name: "Abrir navegación principal",
  })

  await user.click(trigger)
  await screen.findByRole("dialog", { name: "Navegación principal" })
  await user.keyboard("{Escape}")

  expect(
    screen.queryByRole("dialog", { name: "Navegación principal" })
  ).not.toBeInTheDocument()
  expect(trigger).toHaveFocus()
})

it("keeps the complete drawer when the desktop preference is compact", async () => {
  localStorage.setItem(
    NAVIGATION_STORAGE_KEY,
    JSON.stringify({ mode: "compact" })
  )
  const user = userEvent.setup()
  renderMobileNavigation()

  await user.click(
    screen.getByRole("button", { name: "Abrir navegación principal" })
  )
  const dialog = await screen.findByRole("dialog", {
    name: "Navegación principal",
  })
  expect(
    within(dialog)
      .getByRole("navigation", { name: "Navegación principal" })
      .closest("[data-sidebar-mode]")
  ).toHaveAttribute("data-sidebar-mode", "expanded")
  expect(
    within(dialog).getByRole("link", { name: "ABT Comex — Ir a Inicio" })
  ).toHaveAttribute("data-brand-variant", "wordmark")
  expect(
    within(dialog).getByRole("link", {
      name: "Powered by Broco Solutions, enlace externo",
    })
  ).toHaveAttribute("data-brand-attribution", "full")
  const attribution = within(dialog).getByRole("link", {
    name: "Powered by Broco Solutions, enlace externo",
  })
  expect(attribution).toHaveTextContent("Powered by")
  expect(attribution).not.toHaveTextContent("Broco Solutions")
  expect(attribution.querySelector("img")).toHaveAttribute(
    "src",
    "/brand/BROCO_SOLUTIONS_logo_white.svg"
  )
})

it("can expose its trigger inside the Design System reference", () => {
  renderComponent(
    <OnboardingProvider>
      <AppShellStateProvider>
        <MobileNavigation forceVisible />
      </AppShellStateProvider>
    </OnboardingProvider>
  )

  expect(
    screen.getByRole("button", { name: "Abrir navegación principal" })
  ).not.toHaveClass("lg:hidden")
})
