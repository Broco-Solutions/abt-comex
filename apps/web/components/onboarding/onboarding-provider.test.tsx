import { act, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { renderComponent } from "@/test/utils/render"
import { ContextualHelp } from "./contextual-help"
import {
  calculateOnboardingProgress,
  ONBOARDING_STORAGE_KEY,
  OnboardingProvider,
} from "./onboarding-provider"
import { WelcomePanel } from "./welcome-panel"

let pathname = "/inicio"

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useSearchParams: () => new URLSearchParams(),
}))

describe("onboarding progress", () => {
  it("calculates deterministic progress from completed steps", () => {
    expect(calculateOnboardingProgress([])).toBe(0)
    expect(calculateOnboardingProgress(["navigation", "home"])).toBe(40)
  })
})

describe("onboarding experience", () => {
  beforeEach(() => {
    pathname = "/inicio"
    window.localStorage.clear()
  })

  it("can be completed, omitted, resumed and reset", async () => {
    const user = userEvent.setup()
    renderComponent(
      <OnboardingProvider>
        <WelcomePanel />
        <ContextualHelp />
      </OnboardingProvider>
    )

    expect(
      await screen.findByRole("heading", { name: "Bienvenido a ABT Comex" })
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole("checkbox", {
        name: "Conocer la sección Mi trabajo",
      })
    ).not.toHaveLength(0)
    expect(
      screen.queryByRole("checkbox", {
        name: "Ubicar el futuro espacio Mi trabajo",
      })
    ).not.toBeInTheDocument()

    await user.click(
      screen
        .getAllByRole("checkbox", {
          name: "Conocer la navegación principal",
        })
        .at(0)!
    )
    expect(screen.getAllByText("20%")[0]).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Omitir por ahora" }))
    expect(
      screen.queryByRole("heading", { name: "Bienvenido a ABT Comex" })
    ).not.toBeInTheDocument()
    expect(
      JSON.parse(localStorage.getItem(ONBOARDING_STORAGE_KEY) ?? "{}")
    ).toEqual({
      completed: ["navigation"],
      dismissed: true,
    })

    const resumeLink = screen.getByRole("link", {
      name: "Retomar orientación",
    })
    resumeLink.addEventListener("click", (event) => event.preventDefault(), {
      once: true,
    })
    await user.click(resumeLink)
    expect(
      await screen.findByRole("heading", { name: "Bienvenido a ABT Comex" })
    ).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Reiniciar progreso" }))
    await waitFor(() =>
      expect(screen.getAllByText("0%")[0]).toBeInTheDocument()
    )
  })

  it("falls back to in-memory state when localStorage is unavailable", async () => {
    const getItem = window.localStorage.getItem
    Object.defineProperty(window.localStorage, "getItem", {
      configurable: true,
      value: () => {
        throw new Error("storage unavailable")
      },
    })

    renderComponent(
      <OnboardingProvider>
        <WelcomePanel />
      </OnboardingProvider>
    )

    expect(
      await screen.findByRole("heading", { name: "Bienvenido a ABT Comex" })
    ).toBeInTheDocument()

    act(() => {
      Object.defineProperty(window.localStorage, "getItem", {
        configurable: true,
        value: getItem,
      })
    })
  })

  it("rejects malformed persisted progress deterministically", async () => {
    localStorage.setItem(
      ONBOARDING_STORAGE_KEY,
      JSON.stringify({
        completed: ["navigation", "navigation"],
        dismissed: false,
      })
    )

    renderComponent(
      <OnboardingProvider>
        <WelcomePanel />
      </OnboardingProvider>
    )

    const section = await screen.findByRole("region", {
      name: "Bienvenido a ABT Comex",
    })
    expect(within(section).getByText("0%")).toBeVisible()
    expect(within(section).getByText("0 de 5 completados")).toBeVisible()
  })

  it("removes the onboarding section after completing every step", async () => {
    const user = userEvent.setup()
    renderComponent(
      <OnboardingProvider>
        <WelcomePanel />
      </OnboardingProvider>
    )

    const section = await screen.findByRole("region", {
      name: "Bienvenido a ABT Comex",
    })
    const checklist = within(section).getByRole("group", {
      name: "Primeros pasos",
    })
    for (const checkbox of within(checklist).getAllByRole("checkbox")) {
      await user.click(checkbox)
    }

    expect(
      screen.queryByRole("region", { name: "Bienvenido a ABT Comex" })
    ).not.toBeInTheDocument()
    expect(
      JSON.parse(localStorage.getItem(ONBOARDING_STORAGE_KEY) ?? "{}")
    ).toMatchObject({ dismissed: true })
  })

  it.each(["/operaciones", "/clientes", "/configuracion"])(
    "keeps global progress available without rendering the full panel on %s",
    async (route) => {
      pathname = route
      renderComponent(
        <OnboardingProvider>
          <WelcomePanel />
          <ContextualHelp />
        </OnboardingProvider>
      )

      expect(await screen.findByText("0 de 5 completados")).toBeVisible()
      expect(
        screen.queryByRole("region", { name: "Bienvenido a ABT Comex" })
      ).not.toBeInTheDocument()
      expect(
        screen.getByRole("link", { name: "Retomar orientación" })
      ).toHaveAttribute("href", "/inicio")
    }
  )
})
