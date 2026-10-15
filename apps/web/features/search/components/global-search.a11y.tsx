import { fireEvent, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import { renderComponent } from "@/test/utils/render"
import { GlobalSearch } from "./global-search"

vi.mock("next/navigation", () => ({
  usePathname: () => "/clientes",
  useSearchParams: () => new URLSearchParams("q=Norte"),
}))

it("keeps keyboard search, empty results, grouping and focus accessible", async () => {
  const canvas = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  try {
    const user = userEvent.setup()
    renderComponent(<GlobalSearch />)
    await user.click(screen.getByRole("button", { name: "Buscar o ir a…" }))
    const input = await screen.findByRole("combobox", {
      name: "Buscar en ABT Comex",
    })
    expect(input).toHaveFocus()
    await user.type(input, "Norte")
    await screen.findByRole("group", { name: "Clientes" })
    await user.keyboard("{ArrowDown}{ArrowUp}")
    expect(
      document.getElementById(input.getAttribute("aria-activedescendant")!)
    ).toHaveAttribute("aria-selected", "true")
    expect(
      (
        await axe(document.body, {
          rules: { "color-contrast": { enabled: false } },
        })
      ).violations
    ).toEqual([])
    await user.clear(input)
    await user.type(input, "sin-coincidencias-zzz")
    expect(screen.queryAllByRole("option")).toHaveLength(0)
    await user.keyboard("{ArrowDown}{ArrowUp}{Enter}{Escape}")
    expect(screen.getByRole("button", { name: "Buscar o ir a…" })).toHaveFocus()
    fireEvent.keyDown(window, { key: "k", metaKey: true })
    expect(
      await screen.findByRole("combobox", { name: "Buscar en ABT Comex" })
    ).toHaveFocus()
    await user.keyboard("{Escape}")
  } finally {
    canvas.mockRestore()
  }
}, 15000)
