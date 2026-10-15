"use client"
import { SearchableCombobox } from "@workspace/ui/components/searchable-combobox"
import { Button } from "@workspace/ui/components/button"
import { useDemoOperations } from "@/features/operations/state/use-demo-operations"
export function OperationLinksField({
  value,
  onChange,
}: {
  value: string[]
  onChange: (ids: string[]) => void
}) {
  const { operations } = useDemoOperations()
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">
        Operaciones relacionadas · opcional
      </legend>
      <SearchableCombobox
        label="Agregar operación"
        value=""
        options={[
          { value: "", label: "Sin agregar operación" },
          ...operations
            .filter((item) => !value.includes(item.id))
            .map((item) => ({
              value: item.id,
              label: item.reference,
              description: item.client + " · " + item.kind,
            })),
        ]}
        onChange={(id) => {
          if (id) onChange([...value, id])
        }}
      />
      {value.length ? (
        <ul className="space-y-1">
          {value.map((id) => (
            <li
              key={id}
              className="flex items-center justify-between gap-2 rounded-md bg-muted px-3 py-1 text-sm"
            >
              <span>
                {operations.find((item) => item.id === id)?.reference ??
                  "Referencia no disponible"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                aria-label={
                  "Quitar relación " +
                  (operations.find((item) => item.id === id)?.reference ?? id)
                }
                onClick={() => onChange(value.filter((item) => item !== id))}
              >
                Quitar
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </fieldset>
  )
}
