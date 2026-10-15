import { demonstrationClients } from "@/features/clients/data/clients"
import { DEMONSTRATION_DATE } from "@/features/demo/data/scenarios"

export type OrganizationRole = "client" | "abt-supplier" | "operation-party"
export const roleLabels: Record<OrganizationRole, string> = {
  client: "Cliente de ABT",
  "abt-supplier": "Proveedor contratado por ABT",
  "operation-party": "Contraparte de una operación del cliente",
}
export type Organization = {
  id: string
  name: string
  country: string
  taxReference: string
  address: string
  contacts: { id: string; label: string; email?: string; phone?: string }[]
  roles: { role: OrganizationRole; active: boolean }[]
  updatedOn: string
  externalLink: "Pendiente de vinculación" | "Sin referencia externa"
  activity: { on: string; description: string }[]
}
export const initialOrganizations: Organization[] = [
  ...demonstrationClients.map((client) => ({
    id: client.id,
    name: client.name,
    country: "Argentina",
    taxReference: "",
    address: "",
    contacts: client.contacts,
    roles: [{ role: "client" as const, active: true }],
    updatedOn: client.updatedOn,
    externalLink: "Sin referencia externa" as const,
    activity: [],
  })),
  {
    id: "org-demo-001",
    name: "Servicios Portuarios de Ejemplo",
    country: "Argentina",
    taxReference: "REF-SINT-001",
    address: "",
    contacts: [
      {
        id: "contact-supplier-01",
        label: "Mesa de coordinación",
        email: "coordinacion@example.invalid",
      },
    ],
    roles: [{ role: "abt-supplier", active: true }],
    updatedOn: DEMONSTRATION_DATE,
    externalLink: "Sin referencia externa",
    activity: [],
  },
  {
    id: "org-demo-002",
    name: "Suministros de Oficina de Ejemplo",
    country: "Argentina",
    taxReference: "",
    address: "",
    contacts: [],
    roles: [{ role: "abt-supplier", active: true }],
    updatedOn: DEMONSTRATION_DATE,
    externalLink: "Sin referencia externa",
    activity: [],
  },
  {
    id: "org-demo-003",
    name: "Vendedor Exterior de Ejemplo",
    country: "Brasil",
    taxReference: "REF-SINT-EXT",
    address: "",
    contacts: [],
    roles: [{ role: "operation-party", active: true }],
    updatedOn: DEMONSTRATION_DATE,
    externalLink: "Sin referencia externa",
    activity: [],
  },
]
const key = "abt-comex:demo:organizations:v1"
let memory = initialOrganizations
const roles = new Set(Object.keys(roleLabels))
export function parseOrganizations(raw: string | null): Organization[] {
  if (!raw) return initialOrganizations
  try {
    const parsed: unknown = JSON.parse(raw)
    if (
      !Array.isArray(parsed) ||
      !parsed.length ||
      !parsed.every(
        (item) =>
          item &&
          typeof item.id === "string" &&
          /^(client-demo-[a-z]+|org-demo-\d+)$/.test(item.id) &&
          typeof item.name === "string" &&
          item.name.trim() &&
          [item.country, item.taxReference, item.address, item.updatedOn].every(
            (value) => typeof value === "string"
          ) &&
          ["Pendiente de vinculación", "Sin referencia externa"].includes(
            item.externalLink
          ) &&
          Array.isArray(item.contacts) &&
          item.contacts.every(
            (contact: Record<string, unknown>) =>
              contact &&
              typeof contact.id === "string" &&
              typeof contact.label === "string" &&
              (contact.email === undefined ||
                typeof contact.email === "string") &&
              (contact.phone === undefined || typeof contact.phone === "string")
          ) &&
          Array.isArray(item.roles) &&
          item.roles.length &&
          new Set(item.roles.map((role: { role: string }) => role.role))
            .size === item.roles.length &&
          item.roles.every(
            (role: { role: string; active: boolean }) =>
              roles.has(role.role) && typeof role.active === "boolean"
          ) &&
          Array.isArray(item.activity) &&
          item.activity.every(
            (event: Record<string, unknown>) =>
              event &&
              typeof event.on === "string" &&
              typeof event.description === "string"
          )
      )
    )
      return initialOrganizations
    if (
      new Set(parsed.map((item) => item.id)).size !== parsed.length ||
      initialOrganizations.some(
        (initial) => !parsed.some((item) => item.id === initial.id)
      )
    )
      return initialOrganizations
    return parsed as Organization[]
  } catch {
    return initialOrganizations
  }
}
export function loadOrganizations() {
  if (typeof window === "undefined") return initialOrganizations
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? parseOrganizations(raw) : memory
  } catch {
    return memory
  }
}
export function saveOrganizations(organizations: Organization[]) {
  memory = organizations
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(key, JSON.stringify(organizations))
  } catch {
    /* Session memory remains available. */
  }
  window.dispatchEvent(new Event("abt:demo-change"))
}
export function organizationsWithRole(
  organizations: Organization[],
  role: OrganizationRole,
  activeOnly = false
) {
  return organizations.filter((item) =>
    item.roles.some(
      (entry) => entry.role === role && (!activeOnly || entry.active)
    )
  )
}
export function projectClients(
  organizations = loadOrganizations(),
  activeOnly = false
) {
  return organizationsWithRole(organizations, "client", activeOnly).map(
    (item) => ({ ...item, source: "Fixture sintético local" as const })
  )
}
const normalized = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-AR")
    .replace(/[^\p{L}\p{N}]/gu, "")
export function possibleDuplicates(
  organization: Pick<Organization, "id" | "name" | "country" | "taxReference">,
  records: Organization[]
) {
  return records.filter(
    (item) =>
      item.id !== organization.id &&
      (normalized(item.name) === normalized(organization.name) ||
        (organization.taxReference.trim() &&
          normalized(item.country) === normalized(organization.country) &&
          normalized(item.taxReference) ===
            normalized(organization.taxReference)))
  )
}
export function nextOrganizationId(records: Organization[]) {
  const next =
    Math.max(
      0,
      ...records.map((item) =>
        Number(/^org-demo-(\d+)$/.exec(item.id)?.[1] ?? 0)
      )
    ) + 1
  return `org-demo-${String(next).padStart(3, "0")}`
}
export function setOrganizationRoleActive(
  organization: Organization,
  role: OrganizationRole,
  active: boolean
): Organization {
  return {
    ...organization,
    roles: organization.roles.map((entry) =>
      entry.role === role ? { ...entry, active } : entry
    ),
    updatedOn: DEMONSTRATION_DATE,
    activity: [
      ...organization.activity,
      {
        on: DEMONSTRATION_DATE,
        description: `${roleLabels[role]}: ${active ? "reactivado" : "inactivado"} localmente; historial preservado`,
      },
    ],
  }
}
