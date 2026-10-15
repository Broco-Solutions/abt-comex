"use client"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { SearchableCombobox } from "@workspace/ui/components/searchable-combobox"
import { PageHeader } from "@/components/navigation/page-header"
import { DEMONSTRATION_DATE } from "@/features/demo/data/scenarios"
import { usePeople } from "../state/use-people"
import { loadPeople, savePeople, type Team } from "../data/people"
export function TeamsList() {
  const { state } = usePeople()
  const [draft, setDraft] = useState<Team | null>(null)
  const [error, setError] = useState("")
  const [feedback, setFeedback] = useState("")
  const options = [
    { value: "", label: "Sin asignación" },
    ...state.members
      .filter(
        (item) => item.access === "Activo" && item.perspective !== "client"
      )
      .map((item) => ({
        value: item.id,
        label: item.name,
        description: item.area,
      })),
  ]
  return (
    <div className="max-w-5xl space-y-5">
      <PageHeader title="Equipos" />
      <div className="flex justify-between gap-3">
        <Link
          href="/configuracion/personas"
          className="text-sm text-primary underline"
        >
          Volver a Personas
        </Link>
        <Button
          variant="outline"
          onClick={() => {
            setDraft({ id: "", name: "", area: "", leadId: "", backupId: "" })
            setError("")
          }}
        >
          Nuevo equipo
        </Button>
      </div>
      {feedback && <p role="status">{feedback}</p>}
      {draft && (
        <form
          aria-label="Datos del equipo"
          className="space-y-4 rounded-lg border border-border bg-card p-4"
          onSubmit={(event) => {
            event.preventDefault()
            const current = loadPeople()
            if (!draft.name.trim()) {
              setError("Completá el nombre del equipo.")
              return
            }
            if (draft.leadId && draft.leadId === draft.backupId) {
              setError("Responsable y suplente deben ser personas distintas.")
              return
            }
            if (
              current.teams.some(
                (item) =>
                  item.id !== draft.id &&
                  item.name.trim().toLowerCase() ===
                    draft.name.trim().toLowerCase()
              )
            ) {
              setError("Ya existe un equipo con ese nombre.")
              return
            }
            const team = {
              ...draft,
              id: draft.id || "team-demo-" + (current.teams.length + 1),
              name: draft.name.trim(),
            }
            savePeople({
              ...current,
              teams: current.teams.some((item) => item.id === team.id)
                ? current.teams.map((item) =>
                    item.id === team.id ? team : item
                  )
                : [...current.teams, team],
              activity: [
                ...current.activity,
                {
                  on: DEMONSTRATION_DATE,
                  description:
                    "Equipo " +
                    team.name +
                    ": responsables revisados; capacidades sin cambios.",
                },
              ],
            })
            setDraft(null)
            setFeedback(
              "Equipo guardado. No se modificaron capacidades de acceso."
            )
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Nombre del equipo
              <Input
                required
                className="mt-1"
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
              />
            </label>
            <label className="text-sm font-medium">
              Área
              <Input
                className="mt-1"
                value={draft.area}
                onChange={(event) =>
                  setDraft({ ...draft, area: event.target.value })
                }
              />
            </label>
            <SearchableCombobox
              label="Responsable del equipo"
              options={options}
              value={draft.leadId}
              onChange={(value) => setDraft({ ...draft, leadId: value })}
            />
            <SearchableCombobox
              label="Suplente"
              options={options}
              value={draft.backupId}
              onChange={(value) => setDraft({ ...draft, backupId: value })}
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDraft(null)}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar equipo</Button>
          </div>
        </form>
      )}
      <ul
        aria-label="Equipos de trabajo"
        className="divide-y divide-border rounded-lg border border-border bg-card px-4"
      >
        {state.teams.map((team) => (
          <li
            key={team.id}
            className="flex flex-wrap items-start justify-between gap-3 py-4 text-sm"
          >
            <div>
              <h2 className="font-semibold">{team.name}</h2>
              <p className="text-muted-foreground">
                {team.area || "Área pendiente"}
              </p>
              {(
                [
                  ["Responsable", team.leadId],
                  ["Suplente", team.backupId],
                ] as const
              ).map(([label, id]) => {
                const person = state.members.find((item) => item.id === id)
                return (
                  <p key={label} className="mt-1">
                    {label}:{" "}
                    {person ? (
                      <Link
                        href={"/configuracion/personas/" + person.id}
                        className="text-primary underline"
                      >
                        {person.name} · {person.access}
                      </Link>
                    ) : (
                      "Sin asignación"
                    )}
                  </p>
                )
              })}
              <p className="mt-1 text-muted-foreground">
                {
                  state.members.filter((item) => item.teamIds.includes(team.id))
                    .length
                }{" "}
                integrantes
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDraft(team)
                setError("")
              }}
            >
              Editar {team.name}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
