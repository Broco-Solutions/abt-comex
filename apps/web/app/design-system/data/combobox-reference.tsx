"use client"

import { useState } from "react"
import { SearchableCombobox } from "@workspace/ui/components/searchable-combobox"

export function ComboboxReference() {
  const [value, setValue] = useState("norte")
  return (
    <div className="max-w-sm">
      <SearchableCombobox
        label="Organización · selección buscable"
        value={value}
        onChange={setValue}
        options={[
          {
            value: "norte",
            label: "Organización Norte",
            description: "Cliente · referencia sintética A",
          },
          {
            value: "sur",
            label: "Organización Sur",
            description: "Proveedor de ABT · referencia sintética B",
          },
          {
            value: "exterior",
            label: "Contraparte Exterior",
            description: "Vendedor de mercadería · sin obligación de ABT",
          },
        ]}
      />
    </div>
  )
}
