"use client"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { SearchableCombobox } from "@workspace/ui/components/searchable-combobox"
import { formatDate } from "@workspace/ui/lib/date"
import { PageHeader } from "@/components/navigation/page-header"
import { capabilityLabels } from "@/features/demo/data/capabilities"
import { workItems } from "@/features/work/data/work-items"
import { usePeople } from "../state/use-people"
import {
  loadPeople,
  pendingAssignments,
  savePeople,
  suspendAccess,
} from "../data/people"
import { MemberEditor } from "./member-editor"
export function MemberDetail({
  id,
  returnTo = "/configuracion/personas",
}: {
  id: string
  returnTo?: string
}) {
  const back = /^\/configuracion\/personas(?:\?[^#]*)?$/.test(returnTo)
    ? returnTo
    : "/configuracion/personas"
  const { state, ready } = usePeople()
  const [review, setReview] = useState(false)
  const [target, setTarget] = useState("")
  const [status, setStatus] = useState<"Suspendido" | "Baja de acceso">(
    "Suspendido"
  )
  const [feedback, setFeedback] = useState("")
  const member = state.members.find((item) => item.id === id)
  if (!ready) return <p role="status">Preparando ficha…</p>
  if (!member)
    return (
      <p role="status">
        Integrante no disponible.{" "}
        <Link href={back} className="text-primary underline">
          Volver a Personas
        </Link>
      </p>
    )
  const pending = pendingAssignments(id, state)
  const teams = state.teams.filter(
    (team) =>
      member.teamIds.includes(team.id) ||
      team.leadId === id ||
      team.backupId === id
  )
  return (
    <div className="max-w-5xl space-y-6">
      <Link href={back} className="text-sm text-primary underline">
        Volver a Personas
      </Link>
      <PageHeader title={member.name} />
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-md bg-muted px-3 py-2 text-sm">
          {member.access}
        </span>
        <MemberEditor member={member} />
        {member.access === "Activo" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setReview(!review)}
          >
            Revisar suspensión o baja
          </Button>
        )}
      </div>
      {feedback && (
        <p role="status" className="text-sm">
          {feedback}
        </p>
      )}
      {review && (
        <section
          aria-labelledby="access-transition"
          className="space-y-4 rounded-lg border border-warning bg-card p-4"
        >
          <h2 id="access-transition" className="font-semibold">
            Revisar acceso y pendientes
          </h2>
          <p className="text-sm">
            {pending.length} pendientes asignados. La transición conserva
            registros e historial; no completa controles ni cambia operaciones.
          </p>
          <ul className="space-y-1 text-sm">
            {pending.map((taskId) => (
              <li key={taskId}>
                {workItems.find((item) => item.id === taskId)?.title ?? taskId}
              </li>
            ))}
          </ul>
          <SearchableCombobox
            label="Transferir pendientes a"
            value={target}
            onChange={setTarget}
            options={[
              {
                value: "",
                label: "Bandeja del equipo · sin asignación individual",
              },
              ...state.members
                .filter(
                  (item) =>
                    item.id !== id &&
                    item.access === "Activo" &&
                    item.perspective !== "client"
                )
                .map((item) => ({
                  value: item.id,
                  label: item.name,
                  description: item.area,
                })),
            ]}
          />
          <label className="block text-sm font-medium">
            Transición
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as typeof status)
              }
              className="mt-1 block h-10 rounded-md border border-input bg-background px-3"
            >
              <option>Suspendido</option>
              <option>Baja de acceso</option>
            </select>
          </label>
          <p className="text-sm text-muted-foreground">
            Revisá también responsables y suplencias de equipos; no se
            reemplazan silenciosamente.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setReview(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                try {
                  savePeople(suspendAccess(loadPeople(), id, target, status))
                  setReview(false)
                  setFeedback(
                    "Acceso actualizado y pendientes reasignados. El historial se conserva."
                  )
                } catch (error) {
                  setFeedback(
                    error instanceof Error
                      ? error.message
                      : "No se pudo actualizar el acceso."
                  )
                }
              }}
            >
              Confirmar transición
            </Button>
          </div>
        </section>
      )}
      <section
        className="grid gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-2"
        aria-label="Datos del integrante"
      >
        {[
          ["Correo laboral", member.email || "Sin correo de acceso"],
          ["Área", member.area || "Pendiente"],
          ["Función", member.function || "Pendiente"],
          [
            "Fecha de ingreso",
            member.joinedOn ? formatDate(member.joinedOn) : "Sin informar",
          ],
          [
            "Referente",
            state.members.find((item) => item.id === member.referentId)?.name ??
              "Sin referente",
          ],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-sm font-medium break-words">{value}</p>
          </div>
        ))}
      </section>
      <section className="space-y-3">
        <h2 className="font-semibold">Equipos y responsabilidades</h2>
        <ul className="space-y-2 text-sm">
          {teams.map((team) => (
            <li key={team.id}>
              <Link
                href="/configuracion/equipos"
                className="text-primary underline"
              >
                {team.name}
              </Link>
              {team.leadId === id ? " · Responsable" : ""}
              {team.backupId === id ? " · Suplente" : ""}
            </li>
          ))}
          {!teams.length && <li>Sin equipos asignados.</li>}
        </ul>
      </section>
      <section className="space-y-3">
        <h2 className="font-semibold">Capacidades de evaluación</h2>
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          {member.capabilities.map((cap) => (
            <li key={cap}>{capabilityLabels[cap]}</li>
          ))}
          {!member.capabilities.length && <li>Sin capacidades asignadas.</li>}
        </ul>
      </section>
      <section className="space-y-3">
        <h2 className="font-semibold">Actividad</h2>
        <ul className="space-y-2 text-sm">
          {state.activity
            .filter((item) => item.memberId === member.id)
            .map((item, index) => (
              <li key={index}>
                <span className="text-muted-foreground">
                  {formatDate(item.on)}
                </span>{" "}
                · {item.description}
              </li>
            ))}
          {!state.activity.some((item) => item.memberId === member.id) && (
            <li>Sin cambios locales registrados.</li>
          )}
        </ul>
      </section>
    </div>
  )
}
