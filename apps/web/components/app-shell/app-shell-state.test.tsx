import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"

import { renderComponent } from "@/test/utils/render"
import {
  AppShellStateProvider,
  NAVIGATION_STORAGE_KEY,
  readNavigationMode,
  useAppShellState,
} from "./app-shell-state"

function StateHarness() {
  const { mode, resetMode, toggleMode } = useAppShellState()
  return (
    <div>
      <output aria-label="Modo de navegación">{mode}</output>
      <button type="button" onClick={toggleMode}>
        Alternar
      </button>
      <button type="button" onClick={resetMode}>
        Restablecer
      </button>
    </div>
  )
}

describe("navigation preference", () => {
  beforeEach(() => window.localStorage.clear())

  it("is SSR-safe and rejects invalid persisted values", () => {
    expect(readNavigationMode()).toBe("expanded")
    expect(
      readNavigationMode({
        getItem: () => JSON.stringify({ mode: "invalid" }),
      })
    ).toBe("expanded")
    expect(
      readNavigationMode({
        getItem: () => {
          throw new Error("storage unavailable")
        },
      })
    ).toBe("expanded")
  })

  it("starts expanded, toggles, persists, restores and resets", async () => {
    const user = userEvent.setup()
    const firstRender = renderComponent(
      <AppShellStateProvider>
        <StateHarness />
      </AppShellStateProvider>
    )

    expect(screen.getByLabelText("Modo de navegación")).toHaveTextContent(
      "expanded"
    )
    await user.click(screen.getByRole("button", { name: "Alternar" }))
    expect(screen.getByLabelText("Modo de navegación")).toHaveTextContent(
      "compact"
    )
    expect(localStorage.getItem(NAVIGATION_STORAGE_KEY)).toBe(
      JSON.stringify({ mode: "compact" })
    )

    firstRender.unmount()
    renderComponent(
      <AppShellStateProvider>
        <StateHarness />
      </AppShellStateProvider>
    )
    await waitFor(() =>
      expect(screen.getByLabelText("Modo de navegación")).toHaveTextContent(
        "compact"
      )
    )

    await user.click(screen.getByRole("button", { name: "Restablecer" }))
    expect(screen.getByLabelText("Modo de navegación")).toHaveTextContent(
      "expanded"
    )
    expect(localStorage.getItem(NAVIGATION_STORAGE_KEY)).toBeNull()
  })
})
