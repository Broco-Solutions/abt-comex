"use client"

import { Button } from "@workspace/ui/components/button"
import { ApplicationState } from "@/components/states/application-state"

export default function InternalAppError({ reset }: { reset: () => void }) {
  return (
    <ApplicationState
      kind="error"
      title="No se pudo mostrar este módulo"
      description="La carga del contenido se interrumpió. La navegación y la dirección actual se conservaron."
      preserved="Podés volver a intentarlo sin perder tu ubicación."
      action={<Button onClick={reset}>Reintentar</Button>}
    />
  )
}
