"use client"

import { useEffect, useId, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "cn"

export type ComboboxOption = {
  value: string
  label: string
  description?: string
}

/** A single authorized selection. Filtering never adds permissions or creates records. */
export function SearchableCombobox({
  label,
  options,
  value,
  onChange,
  name,
  id: suppliedId,
  invalid,
  describedBy,
  disabled = false,
}: {
  label: string
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  name?: string
  id?: string
  invalid?: boolean
  describedBy?: string
  disabled?: boolean
}) {
  const generatedId = useId()
  const id = suppliedId ?? generatedId
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  useEffect(() => {
    if (open)
      document
        .getElementById(`${id}-option-${active}`)
        ?.scrollIntoView?.({ block: "nearest" })
  }, [active, id, open])
  const matches = options.filter((option) =>
    `${option.label} ${option.description ?? ""}`
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("es-AR")
      .includes(
        query
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLocaleLowerCase("es-AR")
      )
  )
  const selected = options.find((option) => option.value === value)
  const choose = (option: ComboboxOption) => {
    onChange(option.value)
    setOpen(false)
    setQuery("")
    setActive(0)
  }
  return (
    <div
      className="relative min-w-0"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false)
          setQuery("")
        }
      }}
    >
      <label htmlFor={id} className="mb-1 block text-xs font-medium">
        {label}
      </label>
      {name && <input type="hidden" name={name} value={value} />}
      <div className="relative">
        <input
          id={id}
          role="combobox"
          autoComplete="off"
          disabled={disabled}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          aria-expanded={open}
          aria-controls={open ? `${id}-options` : undefined}
          aria-autocomplete="list"
          aria-activedescendant={
            open && matches[active] ? `${id}-option-${active}` : undefined
          }
          value={open ? query : (selected?.label ?? "")}
          placeholder="Escribí para buscar"
          className="h-10 w-full rounded-md border border-input bg-background pr-9 pl-3 text-sm focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50"
          onFocus={() => {
            setOpen(true)
            setActive(0)
          }}
          onClick={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
            setOpen(true)
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault()
              setOpen(false)
              setQuery("")
            }
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault()
              setOpen(true)
              setActive((current) =>
                !open
                  ? 0
                  : Math.max(
                      0,
                      Math.min(
                        matches.length - 1,
                        current + (event.key === "ArrowDown" ? 1 : -1)
                      )
                    )
              )
            }
            if (event.key === "Home" && open) {
              event.preventDefault()
              setActive(0)
            }
            if (event.key === "End" && open) {
              event.preventDefault()
              setActive(Math.max(0, matches.length - 1))
            }
            if (event.key === "Enter" && open) {
              event.preventDefault()
              const option = matches[active]
              if (option) choose(option)
            }
            if (event.key === "Tab") {
              setOpen(false)
              setQuery("")
            }
          }}
        />
        <ChevronsUpDown
          aria-hidden="true"
          className="pointer-events-none absolute top-3 right-3 size-4 text-muted-foreground"
        />
      </div>
      {open && (
        <div className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-lg">
          <ul id={`${id}-options`} role="listbox" aria-label={label}>
            {matches.map((option, index) => (
              <li
                key={option.value}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={option.value === value}
                onMouseDown={(event) => event.preventDefault()}
                onMouseMove={() => setActive(index)}
                onClick={() => choose(option)}
                className={cn(
                  "flex min-h-10 cursor-pointer items-center justify-between gap-2 rounded-sm px-2 py-2 text-sm",
                  active === index && "bg-accent text-accent-foreground"
                )}
              >
                <span>
                  {option.label}
                  {option.description && (
                    <span className="block text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  )}
                </span>
                {option.value === value && (
                  <Check aria-hidden="true" className="size-4 shrink-0" />
                )}
              </li>
            ))}
          </ul>
          {!matches.length && (
            <p role="status" className="p-3 text-sm text-muted-foreground">
              Sin coincidencias. Conservamos la selección anterior.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
