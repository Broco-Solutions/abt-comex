"use client"
import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { SearchableCombobox } from "@workspace/ui/components/searchable-combobox"
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogViewport,
  DialogPopup,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import {
  capabilityIds,
  capabilityLabels,
  presetCapabilities,
} from "@/features/demo/data/capabilities"
import {
  scenarios,
  DEMONSTRATION_DATE,
  type ScenarioId,
} from "@/features/demo/data/scenarios"
import { loadPeople, savePeople, type Member } from "../data/people"
import { usePeople } from "../state/use-people"
import { isFinancialDate } from "@/features/finance/data/financial-records"

export function MemberEditor({
  member,
  onSaved,
}: {
  member?: Member
  onSaved?: (id: string) => void
}) {
  const { state } = usePeople()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")
  const empty: Member = {
    id: "",
    name: "",
    email: "",
    area: "",
    function: "",
    joinedOn: "",
    referentId: "",
    teamIds: [],
    access: "Sin acceso",
    perspective: "import",
    capabilities: [],
  }
  const [draft, setDraft] = useState<Member>(member ?? empty)
  const update = <K extends keyof Member>(key: K, value: Member[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
        if (value) {
          setDraft(member ?? empty)
          setError("")
        }
      }}
    >
      <DialogTrigger
        render={<Button type="button" variant="outline" size="sm" />}
      >
        {member ? "Editar integrante" : "Nuevo integrante"}
      </DialogTrigger>
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport>
          <DialogPopup className="max-w-2xl">
            <DialogTitle>
              {member ? "Editar integrante" : "Nuevo integrante"}
            </DialogTitle>
            <DialogDescription>
              Datos laborales y capacidades de evaluación. Área y función no
              conceden acceso económico.
            </DialogDescription>
            <form
              className="mt-5 space-y-5"
              onSubmit={(event) => {
                event.preventDefault()
                const current = loadPeople()
                if (!draft.name.trim()) {
                  setError("Completá el nombre del integrante.")
                  return
                }
                if (
                  draft.email &&
                  !/^[^\s@]+@(?:abtsisa\.com\.ar|abtcomex\.com\.ar|example\.invalid)$/.test(
                    draft.email.trim().toLowerCase()
                  )
                ) {
                  setError(
                    "Usá un correo laboral de ABT o @example.invalid para una prueba local."
                  )
                  return
                }
                if (
                  !["Sin acceso", "No relevado"].includes(draft.access) &&
                  !draft.email.trim()
                ) {
                  setError(
                    "Para preparar acceso demostrativo, completá un correo individual."
                  )
                  return
                }
                if (
                  draft.email &&
                  current.members.some(
                    (item) =>
                      item.id !== draft.id &&
                      item.email.toLowerCase() ===
                        draft.email.trim().toLowerCase()
                  )
                ) {
                  setError(
                    "Ese correo ya identifica a otro integrante. Abrí su ficha para reutilizarlo."
                  )
                  return
                }
                if (
                  draft.joinedOn &&
                  (!isFinancialDate(draft.joinedOn) ||
                    draft.joinedOn > DEMONSTRATION_DATE)
                ) {
                  setError(
                    "Revisá la fecha de ingreso; puede quedar sin informar."
                  )
                  return
                }
                let index = 1
                while (
                  current.members.some(
                    (item) => item.id === `member-local-${index}`
                  )
                )
                  index++
                const id = draft.id || `member-local-${index}`
                const next = {
                  ...draft,
                  id,
                  name: draft.name.trim(),
                  email: draft.email.trim().toLowerCase(),
                  ...(draft.perspective === "client"
                    ? { clientId: "client-demo-centro" }
                    : { clientId: undefined }),
                  capabilities:
                    draft.perspective === "client"
                      ? draft.capabilities.filter(
                          (cap) => cap === "portal.read"
                        )
                      : draft.capabilities.filter(
                          (cap) => cap !== "portal.read"
                        ),
                }
                savePeople({
                  ...current,
                  members: member
                    ? current.members.map((item) =>
                        item.id === id ? next : item
                      )
                    : [...current.members, next],
                  activity: [
                    ...current.activity,
                    {
                      on: DEMONSTRATION_DATE,
                      memberId: id,
                      description:
                        next.name +
                        ": datos y capacidades revisados; sin mensajes externos.",
                    },
                  ],
                })
                setOpen(false)
                onSaved?.(id)
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {(
                  [
                    ["name", "Nombre"],
                    ["email", "Correo laboral"],
                    ["area", "Área"],
                    ["function", "Función"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="text-sm font-medium">
                    {label}
                    <Input
                      className="mt-1"
                      type={key === "email" ? "email" : "text"}
                      value={draft[key]}
                      required={key === "name"}
                      onChange={(event) => update(key, event.target.value)}
                    />
                  </label>
                ))}
                <label className="text-sm font-medium">
                  Fecha de ingreso
                  <Input
                    className="mt-1"
                    type="date"
                    max={DEMONSTRATION_DATE}
                    value={draft.joinedOn}
                    onChange={(event) => update("joinedOn", event.target.value)}
                  />
                </label>
                <SearchableCombobox
                  label="Referente"
                  value={draft.referentId}
                  options={[
                    { value: "", label: "Sin referente" },
                    ...state.members
                      .filter(
                        (item) =>
                          item.id !== draft.id && item.perspective !== "client"
                      )
                      .map((item) => ({
                        value: item.id,
                        label: item.name,
                        description: item.area,
                      })),
                  ]}
                  onChange={(value) => update("referentId", value)}
                />
              </div>
              <fieldset>
                <legend className="text-sm font-medium">Equipos</legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {state.teams.map((team) => (
                    <label
                      key={team.id}
                      className="flex min-h-10 items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={draft.teamIds.includes(team.id)}
                        onChange={(event) =>
                          update(
                            "teamIds",
                            event.target.checked
                              ? [...draft.teamIds, team.id]
                              : draft.teamIds.filter((id) => id !== team.id)
                          )
                        }
                      />
                      {team.name}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium">
                  Acceso
                  <select
                    aria-label="Acceso"
                    value={draft.access}
                    className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    onChange={(event) =>
                      update("access", event.target.value as Member["access"])
                    }
                  >
                    {[
                      ...(member?.access === "Activo"
                        ? []
                        : [
                            "No relevado",
                            "Sin acceso",
                            "Invitación preparada",
                          ]),
                      "Activo",
                      ...(member?.access === "Suspendido" ||
                      member?.access === "Baja de acceso"
                        ? [member.access]
                        : []),
                    ].map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium">
                  Contexto de evaluación
                  <select
                    aria-label="Contexto de evaluación"
                    className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={draft.perspective}
                    onChange={(event) => {
                      const perspective = event.target.value as ScenarioId
                      setDraft((current) => ({
                        ...current,
                        perspective,
                        capabilities:
                          perspective === "client"
                            ? []
                            : current.capabilities.filter(
                                (cap) => cap !== "portal.read"
                              ),
                      }))
                    }}
                  >
                    {scenarios.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {draft.access === "Invitación preparada" && (
                <p className="text-sm text-muted-foreground">
                  La invitación queda preparada localmente. No se enviará ningún
                  mensaje.
                </p>
              )}
              {draft.perspective === "client" && (
                <p className="text-sm text-muted-foreground">
                  El acceso externo se limita al cliente sintético del Portal;
                  no habilita el espacio interno.
                </p>
              )}
              <fieldset className="space-y-3 border-t border-border pt-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold">Capacidades</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      update(
                        "capabilities",
                        presetCapabilities(draft.perspective)
                      )
                    }
                  >
                    Aplicar preset de evaluación
                  </Button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {capabilityIds
                    .filter((cap) =>
                      draft.perspective === "client"
                        ? cap === "portal.read"
                        : cap !== "portal.read"
                    )
                    .map((cap) => (
                      <label
                        key={cap}
                        className="flex min-h-10 items-start gap-2 text-sm"
                      >
                        <input
                          className="mt-1"
                          type="checkbox"
                          checked={draft.capabilities.includes(cap)}
                          onChange={(event) =>
                            update(
                              "capabilities",
                              event.target.checked
                                ? [...draft.capabilities, cap]
                                : draft.capabilities.filter(
                                    (item) => item !== cap
                                  )
                            )
                          }
                        />
                        {capabilityLabels[cap]}
                      </label>
                    ))}
                </div>
              </fieldset>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Guardar integrante</Button>
              </div>
            </form>
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  )
}
