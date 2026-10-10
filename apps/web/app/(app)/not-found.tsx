import Link from "next/link"

import { buttonVariants } from "@workspace/ui/components/button"
import { ApplicationState } from "@/components/states/application-state"

export default function NotFound() {
  return (
    <ApplicationState
      kind="not-found"
      title="No encontramos esta sección"
      description="La dirección no corresponde a una sección disponible de ABT Comex. La navegación principal sigue disponible."
      action={
        <Link href="/inicio" className={buttonVariants()}>
          Ir a Inicio
        </Link>
      }
    />
  )
}
