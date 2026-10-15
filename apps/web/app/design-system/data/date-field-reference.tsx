"use client"
import { useState } from "react"
import { DateField } from "@workspace/ui/components/date-field"
import { AnalysisPeriodPicker } from "@workspace/ui/components/analysis-period-picker"
import { presetPeriod } from "@workspace/ui/lib/analysis-period"

export function DateFieldReference() {
  const [value, setValue] = useState("2026-10-14")
  const [period, setPeriod] = useState(presetPeriod("this-month", "2026-10-14"))
  return (
    <div className="space-y-4">
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
      <AnalysisPeriodPicker
        value={period}
        reference="2026-10-14"
        onChange={setPeriod}
      />
    </div>
  )
}
