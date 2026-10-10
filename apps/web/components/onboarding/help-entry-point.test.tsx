import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, expect, it, vi } from "vitest"

import { renderComponent } from "@/test/utils/render"
import { HelpEntryPoint } from "./help-entry-point"
import { OnboardingProvider } from "./onboarding-provider"

vi.mock("next/navigation", () => ({
  usePathname: () => "/clientes",
  useSearchParams: () => new URLSearchParams(),
}))

beforeEach(() => window.localStorage.clear())

it("opens contextual help, closes with Escape and restores focus", async () => {
  const user = userEvent.setup()
  renderComponent(
    <OnboardingProvider>
      <HelpEntryPoint />
    </OnboardingProvider>
  )

  const trigger = screen.getByRole("button", { name: "Abrir ayuda" })
  await user.click(trigger)

  expect(
    await screen.findByRole("dialog", { name: "Ayuda de ABT Comex" })
  ).toBeVisible()
  expect(screen.getByText("Contexto persistente de clientes.")).toBeVisible()
  expect(screen.getByText("0 de 5 completados")).toBeVisible()
  expect(
    screen.getByRole("link", { name: "Retomar orientación" })
  ).toHaveAttribute("href", "/inicio")

  const ids = [...document.querySelectorAll<HTMLElement>("[id]")].map(
    (element) => element.id
  )
  expect(new Set(ids).size).toBe(ids.length)

  await user.keyboard("{Escape}")
  expect(
    screen.queryByRole("dialog", { name: "Ayuda de ABT Comex" })
  ).not.toBeInTheDocument()
  expect(trigger).toHaveFocus()
})

it("closes help when resuming orientation from another module", async () => {
  const user = userEvent.setup()
  renderComponent(
    <OnboardingProvider>
      <HelpEntryPoint />
    </OnboardingProvider>
  )

  await user.click(screen.getByRole("button", { name: "Abrir ayuda" }))
  const resumeLink = await screen.findByRole("link", {
    name: "Retomar orientación",
  })
  resumeLink.addEventListener("click", (event) => event.preventDefault(), {
    once: true,
  })
  await user.click(resumeLink)

  expect(
    screen.queryByRole("dialog", { name: "Ayuda de ABT Comex" })
  ).not.toBeInTheDocument()
})
