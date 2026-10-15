"use client"
import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { loadPeople } from "@/features/people/data/people"
import { useScenario } from "../state/scenario-provider"
import { AccessFrame } from "./access-frame"
export function PasswordField({
  label,
  name = "password",
}: {
  label: string
  name?: string
}) {
  const [visible, setVisible] = useState(false)
  return (
    <label className="block text-sm font-medium">
      {label}
      <span className="relative mt-2 block">
        <Input
          name={name}
          type={visible ? "text" : "password"}
          required
          autoComplete="off"
          className="pr-12"
        />
        <button
          type="button"
          aria-label={
            visible
              ? "Ocultar " + label.toLowerCase()
              : "Mostrar " + label.toLowerCase()
          }
          aria-pressed={visible}
          onClick={() => setVisible(!visible)}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-md text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="size-4" />
          ) : (
            <Eye aria-hidden="true" className="size-4" />
          )}
        </button>
      </span>
    </label>
  )
}
export function AccessPage() {
  const { login, dirty, reset } = useScenario()
  const [error, setError] = useState("")
  return (
    <AccessFrame>
      <h2 className="text-2xl font-semibold tracking-tight">
        Ingresar a ABT Comex
      </h2>
      <p id="access-limit" className="mt-3 text-sm text-muted-foreground">
        Probá con direccion@example.invalid y una contraseña de prueba. No
        ingreses credenciales reales; no se guardan ni se verifican.
      </p>
      <form
        aria-label="Acceso de evaluación"
        aria-describedby="access-limit"
        className="mt-8 space-y-5"
        onSubmit={(event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          const email = String(data.get("email") ?? "")
            .trim()
            .toLowerCase()
          const member = email.endsWith("@example.invalid")
            ? loadPeople().members.find(
                (item) =>
                  item.email.toLowerCase() === email && item.access === "Activo"
              )
            : undefined
          if (!member) {
            setError(
              "No se pudo ingresar. Usá una identidad de prueba con acceso activo o revisá su acceso en Personas."
            )
            return
          }
          if (login(member.id)) event.currentTarget.reset()
        }}
      >
        <label className="block text-sm font-medium">
          Correo laboral
          <Input
            name="email"
            type="email"
            required
            autoComplete="off"
            defaultValue="direccion@example.invalid"
            className="mt-2"
          />
        </label>
        <PasswordField label="Contraseña" />
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <div className="flex items-center justify-between gap-4">
          <Button type="submit">Ingresar</Button>
          <Link
            href="/acceso/recuperar"
            className="text-sm font-medium text-primary underline underline-offset-4"
          >
            Olvidé mi contraseña
          </Link>
        </div>
      </form>
      <div className="mt-8 border-t border-border pt-5">
        <Link
          href="/acceso/escenarios"
          className="text-sm text-primary underline underline-offset-4"
        >
          Explorar escenarios de evaluación
        </Link>
        {dirty && (
          <button
            type="button"
            onClick={reset}
            className="mt-4 block text-sm text-primary underline underline-offset-4"
          >
            Reiniciar datos de evaluación
          </button>
        )}
      </div>
    </AccessFrame>
  )
}
