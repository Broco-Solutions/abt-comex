"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { SearchableCombobox } from "@workspace/ui/components/searchable-combobox"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { hasCapability } from "@/features/demo/data/capabilities"
import { usePeople } from "@/features/people/state/use-people"
import { useOrganizations } from "@/features/organizations/state/use-organizations"
import { OrganizationEditor } from "@/features/organizations/components/organization-editor"
import { useDemoOperations } from "../state/use-demo-operations"
import { linkOperationParticipant } from "../data/operational-continuity"

export function OperationRelationships({
  operationId,
}: {
  operationId: string
}) {
  const { scenario } = useScenario()
  const { operations, updateOperations, ready } = useDemoOperations()
  const { organizations } = useOrganizations()
  const { state: people } = usePeople()
  const [personId, setPersonId] = useState("")
  const [organizationId, setOrganizationId] = useState("")
  const [feedback, setFeedback] = useState("")
  const pathname = usePathname(),
    params = useSearchParams()
  const origin =
    (pathname ?? `/operaciones/${operationId}`) +
    (params?.size ? `?${params}` : "")
  const operation = operations.find((item) => item.id === operationId)
  if (!ready || !operation || scenario.id === "client") return null
  const canWrite = hasCapability(scenario, "operations.write")
  const participants = organizations.filter((item) =>
    operation.participantIds?.includes(item.id)
  )
  const candidates = organizations.filter(
    (item) =>
      !operation.participantIds?.includes(item.id) &&
      item.roles.some(
        (entry) => entry.role === "operation-party" && entry.active
      )
  )
  return (
    <section
      aria-label="Responsable y contrapartes operativas"
      className="space-y-5 border-t border-border pt-4"
    >
      <div className="space-y-3">
        <h2 className="text-base font-semibold">Responsable individual</h2>
        <p className="text-sm">
          {operation.responsibleId
            ? operation.responsible
            : "Pendiente de asignación"}
        </p>
        {canWrite ? (
          <div className="flex flex-wrap items-end gap-2">
            <div className="w-full min-w-0 sm:max-w-sm">
              <SearchableCombobox
                label="Asignar integrante relevado"
                options={people.members.map((person) => ({
                  value: person.id,
                  label: person.name,
                  description: person.area,
                }))}
                value={personId}
                onChange={setPersonId}
              />
            </div>
            <Button
              variant="outline"
              disabled={!personId}
              onClick={() => {
                if (!people.members.some((person) => person.id === personId))
                  return
                updateOperations((current) =>
                  current.map((item) =>
                    item.id === operationId
                      ? { ...item, responsibleId: personId }
                      : item
                  )
                )
                setPersonId("")
                setFeedback(
                  "Responsable asignado por selección explícita; no cambia acceso ni permisos."
                )
              }}
            >
              Asignar responsable
            </Button>
            {operation.responsibleId ? (
              <Button
                variant="ghost"
                onClick={() => {
                  updateOperations((current) =>
                    current.map((item) =>
                      item.id === operationId
                        ? { ...item, responsibleId: undefined }
                        : item
                    )
                  )
                  setFeedback("La asignación individual queda pendiente.")
                }}
              >
                Quitar asignación
              </Button>
            ) : null}
          </div>
        ) : null}
        <p className="text-xs text-muted-foreground">
          Referencia de equipo del escenario: {operation.responsibleReference}.
          La responsabilidad de una operación no asigna automáticamente sus
          tareas ni acredita acceso al sistema.
        </p>
      </div>
      <div className="space-y-3">
        <h2 className="text-base font-semibold">
          Contrapartes de esta operación
        </h2>
        {participants.length ? (
          <ul className="divide-y divide-border">
            {participants.map((organization) => (
              <li
                key={organization.id}
                className="flex flex-wrap items-center justify-between gap-2 py-2"
              >
                <Link
                  href={`/proveedores/${organization.id}?returnTo=${encodeURIComponent(origin)}`}
                  className="inline-flex min-h-11 items-center text-sm font-medium text-primary hover:underline"
                >
                  {organization.name}
                </Link>
                {canWrite ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Desvincular ${organization.name}`}
                    onClick={() => {
                      updateOperations((current) =>
                        current.map((item) =>
                          item.id === operationId
                            ? {
                                ...item,
                                participantIds: item.participantIds?.filter(
                                  (id) => id !== organization.id
                                ),
                              }
                            : item
                        )
                      )
                      setFeedback(
                        "Contraparte desvinculada de esta operación; la organización se conserva."
                      )
                    }}
                  >
                    Desvincular
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Sin contrapartes vinculadas.
          </p>
        )}
        {canWrite ? (
          <div className="flex flex-wrap items-end gap-2">
            <div className="w-full min-w-0 sm:max-w-sm">
              <SearchableCombobox
                label="Contraparte operativa"
                options={candidates.map((item) => ({
                  value: item.id,
                  label: item.name,
                  description: item.country,
                }))}
                value={organizationId}
                onChange={setOrganizationId}
              />
            </div>
            <Button
              variant="outline"
              disabled={!organizationId}
              onClick={() => {
                const organization = candidates.find(
                  (item) => item.id === organizationId
                )
                if (!organization) return
                updateOperations((current) =>
                  current.map((item) =>
                    item.id === operationId
                      ? linkOperationParticipant(item, organization)
                      : item
                  )
                )
                setOrganizationId("")
                setFeedback(
                  "Contraparte vinculada. No crea una obligación de pago de ABT."
                )
              }}
            >
              Vincular contraparte
            </Button>
            <OrganizationEditor
              role="operation-party"
              onSaved={(item) => setOrganizationId(item.id)}
            />
          </div>
        ) : null}
        <p className="text-xs text-muted-foreground">
          Vendedor, comprador u otra contraparte del cliente; mantiene su rol
          separado de proveedor contratado por ABT.
        </p>
      </div>
      {feedback ? (
        <p role="status" className="text-sm">
          {feedback}
        </p>
      ) : null}
    </section>
  )
}
