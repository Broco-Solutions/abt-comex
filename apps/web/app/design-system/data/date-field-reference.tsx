"use client"
import { useState } from "react"
import { DateField } from "@workspace/ui/components/date-field"

export function DateFieldReference() {
  const [value, setValue] = useState("2026-10-14")
  return (
    <div className="max-w-sm space-y-2">
      <DateField
        label="Fecha de referencia · DD/MM/AAAA"
        value={value}
        onChange={setValue}
      />
      <p className="text-xs text-muted-foreground">
        Escritura y calendario en español; cambiar de mes/año conserva el
        contexto.
      </p>
    </div>
  )
}
