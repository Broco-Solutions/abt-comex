"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { AccessFrame } from "./access-frame"
import { PasswordField } from "./access-page"
export function RecoverAccess({ reset = false }: { reset?: boolean }) {
  const [done, setDone] = useState(false)
  const [expired, setExpired] = useState(false)
  const [error, setError] = useState("")
  return (
    <AccessFrame>
      <h2 className="text-2xl font-semibold">
        {reset ? "Restablecer contraseña" : "Recuperar acceso"}
      </h2>
      {done ? (
        <div role="status" className="mt-6 space-y-4">
          <p>
            {reset
              ? "Recorrido completado. No se modificó ninguna contraseña."
              : "Solicitud de prueba preparada. No se envió ningún correo."}
          </p>
          {!reset && (
            <Link
              href="/acceso/restablecer"
              className="inline-block text-primary underline"
            >
              Continuar con enlace de prueba
            </Link>
          )}
        </div>
      ) : expired ? (
        <div role="alert" className="mt-6 space-y-4">
          <p>El enlace de prueba venció. No se modificó el acceso.</p>
          <Link href="/acceso/recuperar" className="text-primary underline">
            Preparar otro enlace
          </Link>
        </div>
      ) : (
        <form
          aria-label={
            reset ? "Nueva contraseña de prueba" : "Recuperación de prueba"
          }
          className="mt-6 space-y-5"
          onSubmit={(event) => {
            event.preventDefault()
            const data = new FormData(event.currentTarget)
            if (
              !reset &&
              !String(data.get("email")).endsWith("@example.invalid")
            ) {
              setError(
                "Usá un correo @example.invalid. No ingreses un correo real."
              )
              return
            }
            if (reset && data.get("password") !== data.get("confirmation")) {
              setError(
                "Las contraseñas de prueba no coinciden. Revisá ambos campos."
              )
              return
            }
            event.currentTarget.reset()
            setError("")
            setDone(true)
          }}
        >
          <p className="text-sm text-muted-foreground">
            Sólo para comprobar este recorrido. No ingreses una contraseña ni un
            correo real.
          </p>
          {reset ? (
            <>
              <PasswordField label="Nueva contraseña" />
              <PasswordField label="Repetir contraseña" name="confirmation" />
            </>
          ) : (
            <label className="block text-sm font-medium">
              Correo laboral
              <Input
                name="email"
                required
                type="email"
                autoComplete="off"
                className="mt-2"
                placeholder="persona@example.invalid"
              />
            </label>
          )}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit">
            {reset ? "Confirmar prueba" : "Preparar recuperación"}
          </Button>
          {reset && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setExpired(true)}
            >
              Ver estado de enlace vencido
            </Button>
          )}
        </form>
      )}
      <Link
        href="/acceso"
        className="mt-8 inline-block text-sm text-primary underline"
      >
        Volver al acceso
      </Link>
    </AccessFrame>
  )
}
