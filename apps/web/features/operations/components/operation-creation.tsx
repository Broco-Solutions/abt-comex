"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { scenarioKind } from "@/features/demo/data/scenarios"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"

import { PageHeader } from "@/components/navigation/page-header"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { useOrganizations } from "@/features/organizations/state/use-organizations"
import { projectClients } from "@/features/organizations/data/organizations"
import { OrganizationEditor } from "@/features/organizations/components/organization-editor"
import { SearchableCombobox } from "@workspace/ui/components/searchable-combobox"
import { useDemoQuotes } from "@/features/quotes/state/use-demo-quotes"

import { nextDemoOperationIdentity } from "../data/operations"
import type { DemonstrationOperation, OperationKind } from "../types/operation"
import { useDemoOperations } from "../state/use-demo-operations"

type SearchParams = Record<string, string | string[] | undefined>

const responsibleTeams = [
  "Equipo Impo A",
  "Equipo Impo B",
  "Equipo Expo A",
  "Equipo Expo B",
]
const modalities = ["Marítima", "Aérea", "Terrestre"] as const
const steps = [
  "Origen",
  "Cliente y tipo",
  "Contexto",
  "Responsable",
  "Revisión",
]

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "")
}

function safeReturnTo(value: string) {
  if (/^\/operaciones(?:\?[^#]*)?$/.test(value)) return value
  if (/^\/cotizaciones(?:\/quote-demo-\d{3})?(?:\?[^#]*)?$/.test(value))
    return value
  return "/operaciones"
}

export function OperationCreation({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const router = useRouter()
  const { organizations, ready: organizationsReady } = useOrganizations()
  const demonstrationClients = projectClients(organizations, true)
  const { scenario } = useScenario()
  const { quotes, ready: quotesReady } = useDemoQuotes()
  const {
    operations,
    ready: operationsReady,
    updateOperations,
  } = useDemoOperations()
  const quoteId = scenario.commercial ? first(searchParams.cotizacion) : ""
  const versionNumber = Number(first(searchParams.version))
  const requestedQuote = quoteId
    ? quotes.find((quote) => quote.id === quoteId)
    : undefined
  const requestedVersion = requestedQuote?.versions.find(
    (version) => version.number === versionNumber
  )
  const quoteAccepted =
    requestedVersion?.workflow.clientResponse === "Aceptación simulada"
  const firstStep = scenario.commercial ? 1 : 2
  const [step, setStep] = useState(firstStep)
  const [origin, setOrigin] = useState<"direct" | "quote">(
    quoteId ? "quote" : "direct"
  )
  const [clientId, setClientId] = useState(first(searchParams.cliente))
  const [kind, setKind] = useState<OperationKind | "">(
    scenarioKind(scenario) ?? ""
  )
  const [modality, setModality] = useState<(typeof modalities)[number] | "">("")
  const [context, setContext] = useState("")
  const [responsible, setResponsible] = useState("")
  const [message, setMessage] = useState("")
  const returnTo = safeReturnTo(first(searchParams.returnTo))

  if (!quotesReady || !operationsReady || !organizationsReady) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Cargando escenario local…
      </p>
    )
  }

  const activeQuote =
    origin === "quote" && quoteAccepted ? requestedQuote : undefined
  const activeVersion = activeQuote ? requestedVersion : undefined
  const selectedClient = demonstrationClients.find(
    (client) => client.id === (activeQuote?.clientId ?? clientId)
  )
  const canContinue = () => {
    if (step === 1 && origin === "quote" && !quoteAccepted)
      return "Elegí una versión aceptada de cliente o continuá por el camino directo."
    if (step === 2 && (!selectedClient || !kind || !modality))
      return "Seleccioná cliente, tipo de operación y modalidad para continuar."
    if (step === 4 && !responsible)
      return "Seleccioná un equipo responsable de referencia."
    return ""
  }

  function next() {
    const validation = canContinue()
    if (validation) {
      setMessage(validation)
      const target =
        step === 2
          ? !selectedClient
            ? "creation-client"
            : !kind
              ? "creation-kind"
              : "creation-modality"
          : step === 4
            ? "operation-responsible"
            : "creation-origin-quote"
      document.getElementById(target)?.focus()
      return
    }
    setMessage("")
    setStep((current) => Math.min(steps.length, current + 1))
  }

  function save() {
    const validation = canContinue()
    if (
      validation ||
      !selectedClient ||
      !kind ||
      !modality ||
      !responsible ||
      (origin === "quote" && !activeQuote)
    ) {
      setMessage(
        validation ||
          "Revisá el origen aceptado antes de guardar; no se creó ninguna operación."
      )
      return
    }
    const identity = nextDemoOperationIdentity(operations)
    const newOperation: DemonstrationOperation = {
      ...identity,
      kind,
      clientId: selectedClient.id,
      client: selectedClient.name,
      responsible,
      modality,
      situation: "Pre-embarque",
      updatedOn: "2026-10-14",
      alert: "Sin alerta",
      nextAction: "Revisar datos de apertura del escenario",
      initialContext: [
        context.trim(),
        activeVersion
          ? `Servicio de cotización de referencia: ${activeVersion.service}.`
          : "",
      ]
        .filter(Boolean)
        .join(" "),
      origin:
        activeQuote && activeVersion
          ? {
              type: "accepted-quote",
              quoteId: activeQuote.id,
              quoteReference: activeQuote.reference,
              quoteVersion: activeVersion.number,
            }
          : { type: "direct" },
    }
    updateOperations((current) => [...current, newOperation])
    router.push(
      `/operaciones/${newOperation.id}?returnTo=${encodeURIComponent("/operaciones")}`
    )
  }

  return (
    <div className="space-y-6">
      <Link
        href={returnTo}
        className="inline-flex min-h-9 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> Cancelar y volver al
        contexto
      </Link>
      <PageHeader title="Crear operación" />

      <nav
        aria-label="Pasos de creación"
        className="max-w-5xl border-y border-border py-3"
      >
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {steps.slice(firstStep - 1).map((label, index) => {
            const number = index + firstStep
            return (
              <li
                key={label}
                aria-current={step === number ? "step" : undefined}
                className={cn(
                  "flex min-h-9 items-center gap-2 text-sm",
                  step === number
                    ? "font-semibold text-primary"
                    : number < step
                      ? "text-foreground"
                      : "text-muted-foreground"
                )}
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full border border-current text-xs">
                  {number < step ? (
                    <Check aria-hidden="true" className="size-3.5" />
                  ) : (
                    number - firstStep + 1
                  )}
                </span>
                {label}
              </li>
            )
          })}
        </ol>
      </nav>

      <form
        noValidate
        className="max-w-5xl space-y-5"
        onSubmit={(event) => {
          event.preventDefault()
          if (step === steps.length) save()
          else next()
        }}
      >
        {step === 1 ? (
          <section
            aria-labelledby="creation-origin-title"
            className="space-y-3"
          >
            <h2 id="creation-origin-title" className="font-semibold">
              ¿Cómo se inicia?
            </h2>
            <label className="flex min-h-12 items-start gap-3 border border-border p-3">
              <input
                type="radio"
                name="origin"
                value="direct"
                checked={origin === "direct"}
                onChange={() => {
                  setOrigin("direct")
                  setMessage("")
                }}
              />
              <span>
                <span className="block font-medium">Alta directa</span>
                <span className="text-sm text-muted-foreground">
                  No exige una cotización nueva; aplica a solicitudes o acuerdos
                  existentes.
                </span>
              </span>
            </label>
            {scenario.commercial ? (
              <label className="flex min-h-12 items-start gap-3 border border-border p-3">
                <input
                  type="radio"
                  name="origin"
                  id="creation-origin-quote"
                  value="quote"
                  checked={origin === "quote"}
                  onChange={() => {
                    setOrigin("quote")
                    setMessage("")
                  }}
                />
                <span>
                  <span className="block font-medium">
                    Desde una versión aceptada
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Sólo reutiliza la versión específica cuya respuesta de
                    cliente está aceptada en el escenario.
                  </span>
                </span>
              </label>
            ) : null}
            {origin === "quote" ? (
              quoteId && quoteAccepted && requestedQuote && requestedVersion ? (
                <p
                  role="status"
                  className="border-l-2 border-primary pl-3 text-sm"
                >
                  Origen: {requestedQuote.reference} · versión{" "}
                  {requestedVersion.number} · aceptación simulada. No se marca
                  como consumida y no se limita la cardinalidad.
                </p>
              ) : (
                <div
                  role="alert"
                  className="border-l-2 border-destructive pl-3 text-sm"
                >
                  No hay una versión aceptada disponible en este contexto. Podés
                  volver a Cotizaciones o continuar por alta directa; no se crea
                  nada.
                </div>
              )
            ) : null}
          </section>
        ) : null}

        {step === 2 ? (
          <section
            aria-labelledby="creation-client-title"
            className="grid gap-4 sm:grid-cols-2"
          >
            <h2
              id="creation-client-title"
              className="font-semibold sm:col-span-2"
            >
              Cliente y tipo
            </h2>
            <div>
              <SearchableCombobox
                id="creation-client"
                label="Cliente"
                invalid={Boolean(message && !selectedClient)}
                describedBy={message ? "creation-error" : undefined}
                value={activeQuote?.clientId ?? clientId}
                disabled={Boolean(activeQuote)}
                onChange={setClientId}
                options={demonstrationClients.map((client) => ({
                  value: client.id,
                  label: client.name,
                }))}
              />
              {!activeQuote && (
                <div className="mt-2">
                  <OrganizationEditor
                    onSaved={(organization) => setClientId(organization.id)}
                  />
                </div>
              )}
            </div>
            <fieldset className="space-y-2">
              <legend className="text-xs font-medium">Tipo de operación</legend>
              {(["Importación", "Exportación"] as const)
                .filter(
                  (option) =>
                    !scenarioKind(scenario) || option === scenarioKind(scenario)
                )
                .map((option) => (
                  <label
                    key={option}
                    className="flex min-h-9 items-center gap-2 text-sm"
                  >
                    <input
                      id={
                        option === "Importación" ? "creation-kind" : undefined
                      }
                      aria-invalid={Boolean(message && !kind)}
                      aria-describedby={message ? "creation-error" : undefined}
                      type="radio"
                      name="kind"
                      checked={kind === option}
                      onChange={() => setKind(option)}
                    />
                    {option}
                  </label>
                ))}
            </fieldset>
            <label className="grid gap-1 text-xs font-medium sm:col-span-2">
              Modalidad de referencia
              <select
                id="creation-modality"
                aria-invalid={Boolean(message && !modality)}
                aria-describedby={message ? "creation-error" : undefined}
                value={modality}
                onChange={(event) =>
                  setModality(event.target.value as typeof modality)
                }
                className="h-9 max-w-md rounded-md border border-input bg-background px-2 text-sm"
              >
                <option value="">Seleccionar modalidad</option>
                {modalities.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            {activeQuote ? (
              <p className="text-xs text-muted-foreground sm:col-span-2">
                Cliente reutilizado de la cotización aceptada. El tipo y la
                modalidad se seleccionan explícitamente; no se infieren del
                servicio.
              </p>
            ) : null}
          </section>
        ) : null}

        {step === 3 ? (
          <section
            aria-labelledby="creation-context-title"
            className="space-y-3"
          >
            <h2 id="creation-context-title" className="font-semibold">
              Contexto inicial
            </h2>
            {activeVersion ? (
              <p className="text-sm text-muted-foreground">
                Referencia reutilizable de la cotización:{" "}
                {activeVersion.service}. {activeVersion.context}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay contexto comercial para reutilizar; ingresá una
                referencia inicial si resulta útil.
              </p>
            )}
            <label
              htmlFor="operation-initial-context"
              className="block text-xs font-medium"
            >
              Contexto para esta apertura (opcional)
            </label>
            <textarea
              id="operation-initial-context"
              value={context}
              onChange={(event) => setContext(event.target.value)}
              rows={4}
              maxLength={500}
              className="w-full rounded-md border border-input bg-background px-2.5 py-2 text-sm focus-visible:outline-2 focus-visible:outline-ring"
            />
            <p className="text-xs text-muted-foreground">
              Este texto queda como referencia sintética. No representa una
              instrucción aprobada ni crea una tarea.
            </p>
          </section>
        ) : null}

        {step === 4 ? (
          <section
            aria-labelledby="creation-responsible-title"
            className="space-y-3"
          >
            <h2 id="creation-responsible-title" className="font-semibold">
              Responsabilidad inicial
            </h2>
            <label
              htmlFor="operation-responsible"
              className="block text-xs font-medium"
            >
              Equipo responsable de referencia
            </label>
            <select
              id="operation-responsible"
              required
              aria-invalid={Boolean(message && !responsible)}
              aria-describedby={message ? "creation-error" : undefined}
              value={responsible}
              onChange={(event) => setResponsible(event.target.value)}
              className="h-9 w-full max-w-md rounded-md border border-input bg-background px-2 text-sm"
            >
              <option value="">Seleccionar equipo</option>
              {responsibleTeams.map((team) => (
                <option key={team}>{team}</option>
              ))}
            </select>
          </section>
        ) : null}

        {step === 5 ? (
          <section
            aria-labelledby="creation-requirements-title"
            className="space-y-3"
          >
            <h2 id="creation-requirements-title" className="font-semibold">
              Requisitos derivados
            </h2>
            <div className="border-l-2 border-warning bg-muted/30 px-4 py-3">
              <p className="font-medium">
                No hay requisitos automáticos configurados
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                La lista depende del cliente, tipo, mercadería, régimen y
                organismos. Las reglas y catálogos no están validados; esta demo
                no los inventa ni bloquea la apertura por ausencia de una
                configuración.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Pendiente de parametrización y validación con ABT. No se simula
              una revisión aduanera.
            </p>
          </section>
        ) : null}

        {step === 5 ? (
          <section
            aria-labelledby="creation-review-title"
            className="space-y-4"
          >
            <h2 id="creation-review-title" className="font-semibold">
              Revisá antes de crear
            </h2>
            <dl className="grid gap-x-8 gap-y-3 border-y border-border py-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Origen</dt>
                <dd className="mt-1 font-medium">
                  {activeQuote
                    ? `${activeQuote.reference} · versión ${activeVersion?.number} (aceptación simulada)`
                    : "Alta directa"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Cliente</dt>
                <dd className="mt-1 font-medium">
                  {selectedClient?.name ?? "Pendiente"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">
                  Tipo y modalidad
                </dt>
                <dd className="mt-1 font-medium">
                  {kind || "Pendiente"} · {modality || "Pendiente"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">
                  Equipo responsable
                </dt>
                <dd className="mt-1 font-medium">
                  {responsible || "Pendiente"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted-foreground">Contexto</dt>
                <dd className="mt-1">
                  {context ||
                    activeVersion?.context ||
                    "Sin contexto adicional en este escenario."}
                </dd>
              </div>
            </dl>
            <p className="text-sm text-muted-foreground">
              Creación sintética local; no oficializa, asigna permisos, crea
              requisitos ni actualiza sistemas externos.
            </p>
          </section>
        ) : null}

        {message ? (
          <p
            id="creation-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {message}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          <Button
            type="button"
            variant="outline"
            disabled={step === firstStep}
            onClick={() => {
              setMessage("")
              setStep((current) => Math.max(firstStep, current - 1))
            }}
          >
            Anterior
          </Button>
          {step < steps.length ? (
            <Button type="submit">
              Continuar <ArrowRight aria-hidden="true" />
            </Button>
          ) : (
            <Button type="submit">Crear operación local</Button>
          )}
          <Link
            href={returnTo}
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Cancelar
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          El borrador del asistente vive sólo mientras permanezca en esta ruta.
          Volver a los pasos anteriores conserva lo ingresado; actualizar la
          página reinicia el borrador.
        </p>
      </form>
    </div>
  )
}
