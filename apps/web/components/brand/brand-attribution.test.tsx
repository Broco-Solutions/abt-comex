import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, it } from "vitest"
import { BrandAttribution } from "./brand-attribution"
import { renderComponent } from "@/test/utils/render"

it("renders an accessible external attribution link", async () => {
  const user = userEvent.setup()
  const { container } = renderComponent(<BrandAttribution />)
  const link = screen.getByRole("link", {
    name: "Powered by Broco Solutions, enlace externo",
  })

  expect(link).toHaveAttribute("href", "https://brocosolutions.com")
  expect(link).toHaveAttribute("target", "_blank")
  expect(link).toHaveAttribute("rel", "noopener noreferrer")
  expect(link).toHaveTextContent("Powered by")
  expect(link).not.toHaveTextContent("Broco Solutions")
  expect(container.querySelector("img")).toHaveAttribute(
    "src",
    "/brand/BROCO_SOLUTIONS_logo_gradient.svg"
  )

  await user.tab()
  expect(link).toHaveFocus()
  expect(link).toHaveClass("focus-visible:outline-2")
})

it("uses only the official asset and accessible tooltip when compact", async () => {
  const user = userEvent.setup()
  const { container } = renderComponent(<BrandAttribution compact />)
  const link = screen.getByRole("link", {
    name: "Powered by Broco Solutions",
  })

  expect(link).toHaveAttribute("href", "https://brocosolutions.com")
  expect(link).toHaveAttribute("rel", "noopener noreferrer")
  expect(link).not.toHaveTextContent("Powered by Broco Solutions")
  expect(container.querySelector("img")).toHaveAttribute(
    "src",
    "/brand/BROCO_SOLUTIONS_isotype_gradient.svg"
  )

  await user.hover(link)
  expect(await screen.findByRole("tooltip")).toHaveTextContent(
    "Powered by Broco Solutions"
  )
})
