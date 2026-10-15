import {
  DEMONSTRATION_DATE,
  getScenario,
  scenarioKind,
  type ScenarioId,
} from "@/features/demo/data/scenarios"
import {
  capabilityIds,
  hasCapability,
  presetCapabilities,
  type Capability,
} from "@/features/demo/data/capabilities"
import { workItems, projectWorkItems } from "@/features/work/data/work-items"
import { loadImportationScenarios } from "@/features/importation/data/importation-scenarios"
import { loadDemoQuotes } from "@/features/quotes/data/quotes"
import { demonstrationOperations } from "@/features/operations/data/operations"
import { teamRoster } from "./team-roster"

export type Member = {
  id: string
  name: string
  email: string
  area: string
  function: string
  joinedOn: string
  referentId: string
  teamIds: string[]
  access:
    | "No relevado"
    | "Sin acceso"
    | "Invitación preparada"
    | "Activo"
    | "Suspendido"
    | "Baja de acceso"
  perspective: ScenarioId
  capabilities: Capability[]
  clientId?: string
  sourceRow?: number
  sourceNote?: string
}
export type Team = {
  id: string
  name: string
  area: string
  leadId: string
  backupId: string
}
export type PeopleState = {
  members: Member[]
  teams: Team[]
  assignments: Record<string, string>
  activity: { on: string; description: string; memberId?: string }[]
}
const member = (
  id: string,
  name: string,
  email: string,
  area: string,
  perspective: ScenarioId,
  teamIds: string[],
  access: Member["access"] = "Activo"
): Member => ({
  id,
  name,
  email,
  area,
  function: "Función de evaluación",
  joinedOn: "",
  referentId: "",
  teamIds,
  access,
  perspective,
  capabilities: presetCapabilities(perspective),
  ...(perspective === "client" ? { clientId: "client-demo-centro" } : {}),
})
/** Explicit evaluation accounts are separate from ABT's employee roster. */
export const evaluationUsers: Member[] = [
  member(
    "member-demo-01",
    "Operador de prueba Importación",
    "importacion@example.invalid",
    "Importación",
    "import",
    ["team-impo-a"]
  ),
  member(
    "member-demo-02",
    "Operador de prueba Exportación",
    "exportacion@example.invalid",
    "Exportación",
    "export",
    ["team-expo-a"]
  ),
  member(
    "member-demo-03",
    "Responsable operativo de prueba",
    "operaciones@example.invalid",
    "Operaciones",
    "operations",
    ["team-impo-a", "team-expo-a"]
  ),
  member(
    "member-demo-04",
    "Administración de prueba",
    "administracion@example.invalid",
    "Administración",
    "administration",
    ["team-admin"]
  ),
  member(
    "member-demo-05",
    "Dirección de prueba",
    "direccion@example.invalid",
    "Dirección",
    "direction",
    ["team-direction"]
  ),
  member(
    "member-demo-06",
    "Cliente externo de prueba",
    "cliente@example.invalid",
    "Externo",
    "client",
    []
  ),
]
export const initialPeople: PeopleState = {
  members: teamRoster.map((person) => ({
    id: person.id,
    name: person.name,
    email: person.email,
    area: person.area,
    function: person.function,
    joinedOn: "",
    referentId: "",
    teamIds: [
      person.area === "Importación"
        ? "team-impo"
        : person.area === "Exportación"
          ? "team-expo"
          : person.area === "Administración"
            ? "team-admin"
            : "team-direction",
    ],
    access: "No relevado",
    perspective: "operations",
    capabilities: [],
    sourceRow: person.row,
    sourceNote: person.note,
  })),
  teams: [
    {
      id: "team-impo",
      name: "Importación · área relevada",
      area: "Importación",
      leadId: "person-abt-002",
      backupId: "",
    },
    {
      id: "team-expo",
      name: "Exportación · área relevada",
      area: "Exportación",
      leadId: "person-abt-003",
      backupId: "",
    },
    {
      id: "team-admin",
      name: "Administración",
      area: "Administración",
      leadId: "person-abt-001",
      backupId: "",
    },
    {
      id: "team-direction",
      name: "Dirección",
      area: "Dirección",
      leadId: "",
      backupId: "",
    },
  ],
  assignments: {},
  activity: [],
}
const key = "abt-comex:demo:people:v2"
export const selectedMemberKey = "abt-comex:demo:member:v1"
let memory = initialPeople
const accessStates = new Set([
  "No relevado",
  "Sin acceso",
  "Invitación preparada",
  "Activo",
  "Suspendido",
  "Baja de acceso",
])
export function parsePeople(raw: string | null): PeopleState {
  if (!raw) return initialPeople
  try {
    const value: unknown = JSON.parse(raw)
    if (!value || typeof value !== "object") return initialPeople
    const state = value as PeopleState
    if (
      !Array.isArray(state.members) ||
      !state.members.length ||
      !state.members.every(
        (item) =>
          item &&
          typeof item.id === "string" &&
          /^(?:person-abt|member-local|member-demo)-\d+$/.test(item.id) &&
          [
            item.name,
            item.email,
            item.area,
            item.function,
            item.joinedOn,
            item.referentId,
          ].every((field) => typeof field === "string") &&
          Array.isArray(item.teamIds) &&
          item.teamIds.every((id) => typeof id === "string") &&
          accessStates.has(item.access) &&
          [
            "import",
            "export",
            "operations",
            "administration",
            "direction",
            "client",
          ].includes(item.perspective) &&
          Array.isArray(item.capabilities) &&
          item.capabilities.every((cap) => capabilityIds.includes(cap)) &&
          (item.perspective !== "client" ||
            item.clientId === "client-demo-centro")
      )
    )
      return initialPeople
    if (
      new Set(state.members.map((item) => item.id)).size !==
        state.members.length ||
      !Array.isArray(state.teams) ||
      !state.teams.every(
        (team) =>
          team &&
          [team.id, team.name, team.area, team.leadId, team.backupId].every(
            (field) => typeof field === "string"
          )
      ) ||
      !state.assignments ||
      typeof state.assignments !== "object" ||
      !Object.values(state.assignments).every((id) => typeof id === "string") ||
      !Array.isArray(state.activity) ||
      !state.activity.every(
        (item) =>
          item &&
          typeof item.on === "string" &&
          typeof item.description === "string"
      )
    )
      return initialPeople
    return state
  } catch {
    return initialPeople
  }
}
export function loadPeople() {
  if (typeof window === "undefined") return initialPeople
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? parsePeople(raw) : memory
  } catch {
    return memory
  }
}
export function savePeople(state: PeopleState) {
  memory = state
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(key, JSON.stringify(state))
  } catch {
    /* Memory fallback. */
  }
  window.dispatchEvent(new Event("abt:demo-change"))
}
export function memberForPerspective(
  perspective: ScenarioId,
  state = loadPeople()
) {
  void state
  return evaluationUsers.find(
    (item) => item.perspective === perspective && item.access === "Activo"
  )
}
export function pendingAssignments(memberId: string, state = loadPeople()) {
  const currentTasks = new Set(
    projectWorkItems(loadImportationScenarios(), loadDemoQuotes()).map(
      (item) => item.id
    )
  )
  return Object.entries(state.assignments)
    .filter(([id, owner]) => owner === memberId && currentTasks.has(id))
    .map(([id]) => id)
}
/** Visibility safeguard, not a definitive ABT assignment/approval policy. */
export function canReceiveAssignments(member: Member, tasks: string[]) {
  if (member.access !== "Activo" || member.perspective === "client")
    return false
  const scope = {
    ...getScenario(member.perspective),
    capabilities: member.capabilities,
  }
  const kind = scenarioKind(scope)
  return tasks.every((id) => {
    const task = workItems.find((item) => item.id === id)
    if (!task) return false
    if (task.relatedQuoteId && !hasCapability(scope, "commercial.read"))
      return false
    if (
      task.id === "wrk-admin-no-operation-05" &&
      ![
        "finance.billing",
        "finance.collections",
        "finance.treasury",
        "finance.expenses",
        "finance.prepare",
      ].some((cap) => member.capabilities.includes(cap as Capability))
    )
      return false
    if (task.relatedOperationId) {
      if (!hasCapability(scope, "operations.read")) return false
      const operation = demonstrationOperations.find(
        (item) => item.id === task.relatedOperationId
      )
      if (kind && operation?.kind !== kind) return false
    }
    return true
  })
}
export function suspendAccess(
  state: PeopleState,
  memberId: string,
  nextOwner: string,
  status: "Suspendido" | "Baja de acceso" = "Suspendido"
): PeopleState {
  const current = state.members.find((item) => item.id === memberId)
  const pending = new Set(pendingAssignments(memberId, state))
  if (!current) throw new Error("Integrante no disponible")
  if (
    nextOwner &&
    (!state.members.some(
      (item) =>
        item.id === nextOwner &&
        canReceiveAssignments(item, pendingAssignments(memberId, state))
    ) ||
      nextOwner === memberId)
  )
    throw new Error(
      "Elegí una persona interna activa que pueda consultar los pendientes, o dejalos sin asignación individual"
    )
  return {
    ...state,
    members: state.members.map((item) =>
      item.id === memberId ? { ...item, access: status } : item
    ),
    assignments: Object.fromEntries(
      Object.entries(state.assignments).map(([id, owner]) => [
        id,
        owner === memberId && pending.has(id) ? nextOwner : owner,
      ])
    ),
    activity: [
      ...state.activity,
      {
        on: DEMONSTRATION_DATE,
        memberId,
        description: `${current.name}: ${status}; ${pendingAssignments(memberId, state).length} pendientes transferidos a ${nextOwner ? state.members.find((item) => item.id === nextOwner)?.name : "bandeja del equipo"}. Historial preservado.`,
      },
    ],
  }
}
export function selectedMemberId() {
  if (typeof window === "undefined") return ""
  try {
    return sessionStorage.getItem(selectedMemberKey) ?? ""
  } catch {
    return ""
  }
}
