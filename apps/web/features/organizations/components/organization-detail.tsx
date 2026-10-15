"use client"

import Link from "next/link"
import { PageHeader } from "@/components/navigation/page-header"
import { Button } from "@workspace/ui/components/button"
import { formatDate } from "@workspace/ui/lib/date"
import { useOrganizations } from "../state/use-organizations"
import { useDemoOperations } from "@/features/operations/state/use-demo-operations"
import {
  loadOrganizations,
  roleLabels,
  saveOrganizations,
  setOrganizationRoleActive,
  type Organization,
} from "../data/organizations"
import { OrganizationEditor } from "./organization-editor"
import { useState } from "react"

export function OrganizationIdentity({
  organization,
}: {
  organization: Organization
}) {
  const [feedback, setFeedback] = useState("")
  return (
    <section
      className="space-y-4 rounded-lg border border-border bg-card p-4"
      aria-label="Datos de organización"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold">Datos de organización</h2>
        <OrganizationEditor
          organization={organization}
          onSaved={() =>
            setFeedback("Datos actualizados en las vistas relacionadas.")
          }
        />
      </div>
      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-muted-foreground">País</dt>
          <dd>{organization.country || "Sin informar"}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">
            Identificación fiscal o referencia
          </dt>
          <dd>{organization.taxReference || "Sin informar"}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Dirección</dt>
          <dd>{organization.address || "Sin informar"}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">
            Fuente / actualización
          </dt>
          <dd>Registro local · {formatDate(organization.updatedOn)}</dd>
          <dd>{organization.externalLink}</dd>
        </div>
      </dl>
      <ul className="divide-y divide-border">
        {organization.roles.map((entry) => (
          <li
            key={entry.role}
            className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
          >
            <span>
              {roleLabels[entry.role]} · {entry.active ? "Activo" : "Inactivo"}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (
                  !window.confirm(
                    `${entry.active ? "Inactivar" : "Reactivar"} ${roleLabels[entry.role]} para ${organization.name}. Se conservan historial y relaciones; no se cancelan operaciones ni obligaciones. ¿Continuar?`
                  )
                )
                  return
                saveOrganizations(
                  loadOrganizations().map((item) =>
                    item.id === organization.id
                      ? setOrganizationRoleActive(
                          item,
                          entry.role,
                          !entry.active
                        )
                      : item
                  )
                )
                setFeedback(
                  "Estado del rol actualizado. Los demás roles y el historial se conservan."
                )
              }}
            >
              {entry.active ? "Inactivar" : "Reactivar"}{" "}
              {roleLabels[entry.role]}
            </Button>
          </li>
        ))}
      </ul>
      {feedback && (
        <p role="status" className="text-sm">
          {feedback}
        </p>
      )}
    </section>
  )
}

export function OrganizationDetail({
  organizationId,
  returnTo,
}: {
  organizationId: string
  returnTo: string
}) {
  const { organizations, ready } = useOrganizations()
  const { operations } = useDemoOperations()
  const organization = organizations.find((item) => item.id === organizationId)
  const back = /^\/(?:proveedores|clientes)(?:\?[^#]*)?$/.test(returnTo)
    ? returnTo
    : "/proveedores"
  if (!ready) return <p role="status">Cargando organización…</p>
  if (!organization)
    return (
      <div className="space-y-3">
        <PageHeader title="Organización no disponible" />
        <Link href={back} className="text-primary underline">
          Volver al listado
        </Link>
      </div>
    )
  return (
    <div className="space-y-5">
      <Link
        href={back}
        className="inline-flex min-h-9 items-center text-sm font-medium text-primary"
      >
        Volver al listado
      </Link>
      <PageHeader title={organization.name} />
      <OrganizationIdentity organization={organization} />
      <section className="space-y-3">
        <h2 className="font-semibold">Contactos</h2>
        {organization.contacts.length ? (
          <ul className="divide-y divide-border">
            {organization.contacts.map((contact) => (
              <li key={contact.id} className="py-3 text-sm">
                <p className="font-medium">{contact.label}</p>
                {contact.email && <p>{contact.email}</p>}
                {contact.phone && <p>{contact.phone}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Sin contactos registrados.
          </p>
        )}
      </section>
      {organization.roles.some((entry) => entry.role === "client") && (
        <section className="space-y-3">
          <h2 className="font-semibold">Operaciones como cliente de ABT</h2>
          <ul className="divide-y divide-border">
            {operations
              .filter((item) => item.clientId === organization.id)
              .map((item) => (
                <li key={item.id} className="py-3">
                  <Link
                    className="text-sm font-medium text-primary"
                    href={`/operaciones/${item.id}?returnTo=${encodeURIComponent(`/proveedores/${organization.id}`)}`}
                  >
                    {item.reference}
                  </Link>
                </li>
              ))}
          </ul>
          <Link
            href={`/clientes/${organization.id}`}
            className="text-sm text-primary underline"
          >
            Abrir ficha de cliente
          </Link>
        </section>
      )}
      <section className="space-y-3">
        <h2 className="font-semibold">Relaciones administrativas</h2>
        <p className="text-sm text-muted-foreground">
          Sin registros administrativos vinculados en este escenario. Un rol no
          crea una deuda ni acredita una registración externa.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="font-semibold">Actividad</h2>
        <ul className="divide-y divide-border">
          {organization.activity.map((event, index) => (
            <li key={index} className="py-2 text-sm">
              {formatDate(event.on)} · {event.description}
            </li>
          ))}
        </ul>
        {!organization.activity.length && (
          <p className="text-sm text-muted-foreground">Sin cambios locales.</p>
        )}
      </section>
    </div>
  )
}
