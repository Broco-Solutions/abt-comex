"use client"

import { useId, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogViewport,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@workspace/ui/components/dialog"
import { DEMONSTRATION_DATE } from "@/features/demo/data/scenarios"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { hasCapability } from "@/features/demo/data/capabilities"
import {
  loadOrganizations,
  nextOrganizationId,
  possibleDuplicates,
  roleLabels,
  saveOrganizations,
  type Organization,
  type OrganizationRole,
} from "../data/organizations"

export function OrganizationEditor({
  organization,
  role = "client",
  onSaved,
  primary = false,
}: {
  organization?: Organization
  role?: OrganizationRole
  onSaved?: (organization: Organization) => void
  primary?: boolean
}) {
  const { scenario } = useScenario()
  const formId = useId()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(organization?.name ?? "")
  const [country, setCountry] = useState(organization?.country ?? "")
  const [taxReference, setTaxReference] = useState(
    organization?.taxReference ?? ""
  )
  const [address, setAddress] = useState(organization?.address ?? "")
  const [contacts, setContacts] = useState(
    organization?.contacts.map((contact) => ({
      ...contact,
      email: contact.email ?? "",
      phone: contact.phone ?? "",
    })) ?? []
  )
  const nextContact = useRef(1)
  const updateContact = (
    index: number,
    field: "label" | "email" | "phone",
    value: string
  ) =>
    setContacts((current) =>
      current.map((contact, row) =>
        row === index ? { ...contact, [field]: value } : contact
      )
    )
  const [selectedRoles, setSelectedRoles] = useState<OrganizationRole[]>(
    organization?.roles.map((entry) => entry.role) ?? [role]
  )
  const [error, setError] = useState("")
  const [duplicates, setDuplicates] = useState<Organization[]>([])
  const [distinct, setDistinct] = useState(false)
  if (scenario.id === "client" || !hasCapability(scenario, "catalogs.manage"))
    return null
  function finish(record: Organization, records: Organization[]) {
    saveOrganizations(
      records.some((item) => item.id === record.id)
        ? records.map((item) => (item.id === record.id ? record : item))
        : [...records, record]
    )
    onSaved?.(record)
    setOpen(false)
    if (!organization) {
      setName("")
      setCountry("")
      setTaxReference("")
      setAddress("")
      setContacts([])
      setSelectedRoles([role])
    }
    setError("")
    setDuplicates([])
    setDistinct(false)
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) {
          setError("")
          setDuplicates([])
          setDistinct(false)
          if (organization) {
            setName(organization.name)
            setCountry(organization.country)
            setTaxReference(organization.taxReference)
            setAddress(organization.address)
            setSelectedRoles(organization.roles.map((entry) => entry.role))
            setContacts(
              organization.contacts.map((contact) => ({
                ...contact,
                email: contact.email ?? "",
                phone: contact.phone ?? "",
              }))
            )
          }
        }
      }}
    >
      <DialogTrigger
        render={
          <Button
            type="button"
            variant={primary ? "default" : "outline"}
            size="sm"
          />
        }
      >
        {organization
          ? "Editar organización"
          : role === "client"
            ? "Nuevo cliente"
            : role === "abt-supplier"
              ? "Nuevo proveedor de ABT"
              : "Nueva contraparte"}
      </DialogTrigger>
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport>
          <DialogPopup className="max-w-2xl">
            <DialogTitle>
              {organization ? "Editar organización" : "Crear organización"}
            </DialogTitle>
            <DialogDescription>
              Preparación local. No modifica el maestro de Alpha2000.
            </DialogDescription>
            <form
              className="mt-4 grid gap-4 sm:grid-cols-2"
              noValidate
              onSubmit={(event) => {
                event.preventDefault()
                event.stopPropagation()
                const invalidContact = contacts.findIndex(
                  (contact) =>
                    !contact.label.trim() ||
                    (contact.email &&
                      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))
                )
                if (
                  !name.trim() ||
                  !selectedRoles.length ||
                  (taxReference.trim() && !country.trim()) ||
                  contacts.some(
                    (contact) =>
                      !contact.label.trim() ||
                      (contact.email &&
                        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))
                  )
                ) {
                  setError(
                    "Completá nombre y al menos un rol. Si indicás identificación, completá país. Revisá el correo de contacto."
                  )
                  document
                    .getElementById(
                      !name.trim()
                        ? `${formId}-name`
                        : taxReference.trim() && !country.trim()
                          ? `${formId}-country`
                          : invalidContact >= 0
                            ? `${formId}-contact-${invalidContact}-${contacts[invalidContact]?.label.trim() ? "email" : "name"}`
                            : `${formId}-roles`
                    )
                    ?.focus()
                  return
                }
                const records = loadOrganizations()
                const id = organization?.id ?? nextOrganizationId(records)
                const record: Organization = {
                  id,
                  name: name.trim(),
                  country: country.trim(),
                  taxReference: taxReference.trim(),
                  address: address.trim(),
                  contacts: contacts.map((contact, index) => ({
                    ...contact,
                    id: contact.id.startsWith("draft-contact-")
                      ? `contact-${id}-${index + 1}`
                      : contact.id,
                    label: contact.label.trim(),
                    email: contact.email.trim(),
                    phone: contact.phone.trim(),
                  })),
                  roles: selectedRoles.map((entry) => ({
                    role: entry,
                    active:
                      organization?.roles.find(
                        (previous) => previous.role === entry
                      )?.active ?? true,
                  })),
                  updatedOn: DEMONSTRATION_DATE,
                  externalLink: "Pendiente de vinculación",
                  activity: [
                    ...(organization?.activity ?? []),
                    {
                      on: DEMONSTRATION_DATE,
                      description: organization
                        ? "Datos actualizados localmente"
                        : "Organización creada localmente",
                    },
                  ],
                }
                const matches = possibleDuplicates(record, records)
                if (matches.length && !distinct) {
                  setDuplicates(matches)
                  setError(
                    "Encontramos posibles coincidencias. Reutilizá una organización o confirmá que es diferente."
                  )
                  return
                }
                finish(record, records)
              }}
            >
              <label className="grid gap-1 text-xs font-medium sm:col-span-2">
                Nombre o razón social *
                <Input
                  id={`${formId}-name`}
                  required
                  aria-describedby={error ? `${formId}-error` : undefined}
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value)
                    setDistinct(false)
                  }}
                  aria-invalid={Boolean(error && !name.trim())}
                />
              </label>
              <label className="grid gap-1 text-xs font-medium">
                País
                <Input
                  id={`${formId}-country`}
                  required={Boolean(taxReference.trim())}
                  aria-invalid={Boolean(
                    error && taxReference.trim() && !country.trim()
                  )}
                  aria-describedby={error ? `${formId}-error` : undefined}
                  value={country}
                  onChange={(event) => {
                    setCountry(event.target.value)
                    setDistinct(false)
                  }}
                />
              </label>
              <label className="grid gap-1 text-xs font-medium">
                Identificación fiscal o referencia
                <Input
                  value={taxReference}
                  onChange={(event) => {
                    setTaxReference(event.target.value)
                    setDistinct(false)
                  }}
                  placeholder="Sólo datos de prueba"
                />
              </label>
              <label className="grid gap-1 text-xs font-medium sm:col-span-2">
                Dirección
                <Input
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                />
              </label>
              <fieldset
                id={`${formId}-roles`}
                tabIndex={-1}
                aria-describedby={error ? `${formId}-error` : undefined}
                className="space-y-2 sm:col-span-2"
              >
                <legend className="mb-2 text-xs font-medium">
                  Roles de la organización *
                </legend>
                {(Object.keys(roleLabels) as OrganizationRole[]).map(
                  (entry) => (
                    <label
                      key={entry}
                      className="flex min-h-9 items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(entry)}
                        disabled={
                          organization?.roles.some(
                            (existing) => existing.role === entry
                          ) ||
                          (!organization && entry === role)
                        }
                        onChange={(event) =>
                          setSelectedRoles((current) =>
                            event.target.checked
                              ? [...current, entry]
                              : current.filter((value) => value !== entry)
                          )
                        }
                      />
                      {roleLabels[entry]}
                    </label>
                  )
                )}
                <p className="text-xs text-muted-foreground">
                  Una contraparte de mercadería no genera una cuenta por pagar
                  de ABT. Los roles existentes se inactivan desde la ficha sin
                  borrar historial.
                </p>
              </fieldset>
              <fieldset className="space-y-3 sm:col-span-2">
                <legend className="text-sm font-medium">Contactos</legend>
                {contacts.map((contact, index) => (
                  <div
                    key={contact.id}
                    className="grid gap-3 rounded-md border border-border p-3 sm:grid-cols-2"
                  >
                    <label className="grid gap-1 text-xs font-medium sm:col-span-2">
                      Nombre del contacto {index + 1}
                      <Input
                        id={`${formId}-contact-${index}-name`}
                        required
                        aria-invalid={Boolean(error && !contact.label.trim())}
                        aria-describedby={error ? `${formId}-error` : undefined}
                        value={contact.label}
                        onChange={(event) =>
                          updateContact(index, "label", event.target.value)
                        }
                      />
                    </label>
                    <label className="grid gap-1 text-xs font-medium">
                      Correo del contacto {index + 1}
                      <Input
                        type="email"
                        id={`${formId}-contact-${index}-email`}
                        aria-invalid={Boolean(
                          error &&
                          contact.email &&
                          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
                        )}
                        aria-describedby={error ? `${formId}-error` : undefined}
                        value={contact.email}
                        onChange={(event) =>
                          updateContact(index, "email", event.target.value)
                        }
                      />
                    </label>
                    <label className="grid gap-1 text-xs font-medium">
                      Teléfono del contacto {index + 1}
                      <Input
                        type="tel"
                        value={contact.phone}
                        onChange={(event) =>
                          updateContact(index, "phone", event.target.value)
                        }
                      />
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-fit"
                      onClick={() =>
                        setContacts((current) =>
                          current.filter((entry) => entry.id !== contact.id)
                        )
                      }
                    >
                      Quitar contacto {index + 1}
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const id = `draft-contact-${nextContact.current++}`
                    setContacts((current) => [
                      ...current,
                      {
                        id,
                        label: "",
                        email: "",
                        phone: "",
                      },
                    ])
                  }}
                >
                  Agregar contacto
                </Button>
              </fieldset>
              {error && (
                <div
                  id={`${formId}-error`}
                  role="alert"
                  className="space-y-2 rounded-md border border-destructive p-3 text-sm sm:col-span-2"
                >
                  <p>{error} No se guardó ningún cambio.</p>
                  {duplicates.map((match) => (
                    <Button
                      type="button"
                      key={match.id}
                      variant="outline"
                      onClick={() => {
                        const next = {
                          ...match,
                          roles: match.roles.some(
                            (entry) => entry.role === role
                          )
                            ? match.roles.map((entry) =>
                                entry.role === role
                                  ? { ...entry, active: true }
                                  : entry
                              )
                            : [...match.roles, { role, active: true }],
                          updatedOn: DEMONSTRATION_DATE,
                          activity: [
                            ...match.activity,
                            {
                              on: DEMONSTRATION_DATE,
                              description: `Registro reutilizado como ${roleLabels[role]}`,
                            },
                          ],
                        }
                        finish(next, loadOrganizations())
                      }}
                    >
                      Reutilizar {match.name} como {roleLabels[role]}
                    </Button>
                  ))}
                  {duplicates.length > 0 && (
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={distinct}
                        onChange={(event) => setDistinct(event.target.checked)}
                      />
                      Revisé las coincidencias; es otra organización
                    </label>
                  )}
                </div>
              )}
              <div className="flex flex-wrap justify-end gap-2 sm:col-span-2">
                <DialogClose render={<Button type="button" variant="ghost" />}>
                  Cancelar
                </DialogClose>
                <Button type="submit">Guardar localmente</Button>
              </div>
            </form>
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  )
}
