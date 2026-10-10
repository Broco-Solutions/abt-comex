"use client"

import { Check } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import {
  onboardingSteps,
  useOnboarding,
  type OnboardingStepId,
} from "./onboarding-provider"

export function GettingStartedChecklist({
  id = "getting-started",
}: {
  id?: string
}) {
  const { completed, progress, toggleStep } = useOnboarding()

  return (
    <div role="group" aria-labelledby={`${id}-title`}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h3 id={`${id}-title`} className="text-sm font-semibold">
            Primeros pasos
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {completed.length} de {onboardingSteps.length} completados
          </p>
        </div>
        <span className="text-xs font-medium tabular-nums">{progress}%</span>
      </div>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="Progreso de la inducción"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div
          className="h-full bg-primary transition-[width] motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>
      <ul className="mt-4 space-y-1">
        {onboardingSteps.map((step) => (
          <ChecklistItem
            key={step.id}
            id={step.id}
            label={step.label}
            checked={completed.includes(step.id)}
            onChange={() => toggleStep(step.id)}
          />
        ))}
      </ul>
    </div>
  )
}

function ChecklistItem({
  id,
  label,
  checked,
  onChange,
}: {
  id: OnboardingStepId
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <li>
      <label
        className={cn(
          "flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted",
          checked && "text-muted-foreground"
        )}
      >
        <input
          type="checkbox"
          name={`onboarding-${id}`}
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-sm border border-input peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary",
            checked && "border-primary bg-primary text-primary-foreground"
          )}
        >
          {checked ? <Check className="size-3.5" /> : null}
        </span>
        <span className={cn(checked && "line-through")}>{label}</span>
      </label>
    </li>
  )
}
