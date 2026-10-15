import type { DemonstrationOperation } from "../types/operation"
import type { Organization } from "@/features/organizations/data/organizations"
import { DEMONSTRATION_DATE } from "@/features/demo/data/scenarios"

export function linkOperationParticipant(
  operation: DemonstrationOperation,
  organization: Organization
) {
  if (
    !organization.roles.some(
      (entry) => entry.role === "operation-party" && entry.active
    )
  )
    throw new Error(
      "La organización requiere un rol de contraparte operativa activo."
    )
  return {
    ...operation,
    participantIds: [
      ...new Set([...(operation.participantIds ?? []), organization.id]),
    ],
  }
}

export function recordHandoff(
  operation: DemonstrationOperation,
  status: NonNullable<DemonstrationOperation["handoff"]>["status"],
  note: string,
  context: string
): DemonstrationOperation {
  if (!note.trim())
    throw new Error("Indicá la próxima acción o la observación.")
  if (
    note.trim().length > 500 ||
    (operation.handoff?.history.length ?? 0) >= 200
  )
    throw new Error("La referencia supera el límite del escenario local.")
  if (
    status === "En revisión administrativa" &&
    operation.handoff?.status === status
  )
    throw new Error("El envío ya está pendiente de revisión.")
  if (
    status !== "En revisión administrativa" &&
    operation.handoff?.status !== "En revisión administrativa"
  )
    throw new Error("Primero debe enviarse a revisión administrativa.")
  return {
    ...operation,
    handoff: {
      status,
      note: note.trim(),
      history: [
        ...(operation.handoff?.history ?? []),
        { status, note: note.trim(), on: DEMONSTRATION_DATE, context },
      ],
    },
  }
}

export function validHandoff(value: unknown) {
  if (value === undefined) return true
  if (!value || typeof value !== "object") return false
  const handoff = value as Record<string, unknown>
  return (
    [
      "En revisión administrativa",
      "Recibida para revisión",
      "Devuelta con observaciones",
    ].includes(String(handoff.status)) &&
    typeof handoff.note === "string" &&
    Array.isArray(handoff.history) &&
    handoff.history.length <= 200 &&
    handoff.history.every((event: unknown) => {
      if (!event || typeof event !== "object") return false
      const row = event as Record<string, unknown>
      return ["status", "note", "on", "context"].every(
        (key) => typeof row[key] === "string"
      )
    })
  )
}
