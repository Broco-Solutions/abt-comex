import { afterEach, describe, expect, it } from "vitest"
import {
  initialOrganizations,
  loadOrganizations,
  nextOrganizationId,
  organizationsWithRole,
  parseOrganizations,
  possibleDuplicates,
  projectClients,
  saveOrganizations,
  setOrganizationRoleActive,
} from "./organizations"

afterEach(() => {
  saveOrganizations(initialOrganizations)
  sessionStorage.clear()
})
describe("shared synthetic organizations", () => {
  it("does not turn an operation seller into an ABT supplier or obligation", () => {
    const seller = initialOrganizations.find(
      (item) => item.id === "org-demo-003"
    )!
    expect(
      organizationsWithRole(initialOrganizations, "operation-party")
    ).toContain(seller)
    expect(
      organizationsWithRole(initialOrganizations, "abt-supplier")
    ).not.toContain(seller)
    expect(JSON.stringify(seller)).not.toMatch(
      /amount|balance|payable|obligation/
    )
  })
  it("supports several roles on one identity and inactivates only the selected role", () => {
    const original = {
      ...initialOrganizations[0]!,
      roles: [
        { role: "client" as const, active: true },
        { role: "abt-supplier" as const, active: true },
      ],
    }
    const inactive = setOrganizationRoleActive(original, "client", false)
    expect(inactive.roles).toEqual([
      { role: "client", active: false },
      { role: "abt-supplier", active: true },
    ])
    expect(inactive.id).toBe(original.id)
    expect(projectClients([inactive], true)).toEqual([])
    expect(projectClients([inactive])).toHaveLength(1)
    expect(inactive.activity).toHaveLength(1)
  })
  it("detects normalized names and country-scoped identifiers without automatic merging", () => {
    expect(
      possibleDuplicates(
        {
          id: "",
          name: " servicios PORTUARIOS de ejemplo ",
          country: "",
          taxReference: "",
        },
        initialOrganizations
      )
    ).toHaveLength(1)
    expect(
      possibleDuplicates(
        {
          id: "",
          name: "Otro",
          country: "Argentina",
          taxReference: "REF SINT 001",
        },
        initialOrganizations
      )
    ).toHaveLength(1)
    expect(
      possibleDuplicates(
        {
          id: "",
          name: "Otro",
          country: "Brasil",
          taxReference: "REF SINT 001",
        },
        initialOrganizations
      )
    ).toHaveLength(0)
  })
  it("persists new clients for quote validation and retains the historical identities", () => {
    const item = {
      ...initialOrganizations[0]!,
      id: nextOrganizationId(initialOrganizations),
      name: "Cliente Sintético Nuevo",
      activity: [],
    }
    saveOrganizations([...initialOrganizations, item])
    expect(projectClients().some((client) => client.id === item.id)).toBe(true)
    expect(loadOrganizations()).toHaveLength(initialOrganizations.length + 1)
    expect(parseOrganizations(JSON.stringify([item]))).toEqual(
      initialOrganizations
    )
    expect(parseOrganizations("invalid")).toEqual(initialOrganizations)
    expect(
      parseOrganizations(
        JSON.stringify([...initialOrganizations, initialOrganizations[0]])
      )
    ).toEqual(initialOrganizations)
  })
})
