"use client"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useScenario } from "../state/scenario-provider"
import { scenarios } from "../data/scenarios"
import { BrandAttribution } from "@/components/brand/brand-attribution"

export function AccessPage() {
  const { choose } = useScenario()
  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-2">
      <section className="flex flex-col justify-between bg-primary px-6 py-8 text-primary-foreground sm:px-12 lg:px-16 lg:py-16">
        <div>
          <Image
            src="/brand/ABT_COMEX_isotype_white_transparent.png"
            alt="ABT Comex"
            width={80}
            height={72}
            className="h-auto w-20"
            priority
          />
        </div>
        <div className="my-6 max-w-lg lg:my-12">
          <p className="text-sm font-medium tracking-wider uppercase">
            Comercio exterior
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Tu trabajo, conectado.
          </h1>
          <p className="mt-6 text-lg leading-relaxed opacity-90">
            Operaciones, documentación y decisiones en un mismo espacio.
          </p>
        </div>
        <p className="text-xs opacity-80">
          Entorno de evaluación · sin operaciones reales
        </p>
      </section>
      <section className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-lg">
          <Image
            src="/brand/ABT_COMEX_logo_green_transparent.png"
            alt="ABT Comex"
            width={160}
            height={64}
            className="mb-8 h-auto w-40"
          />
          <h2 className="text-2xl font-semibold tracking-tight">
            Elegí una perspectiva
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Escenarios de evaluación, sin credenciales.
          </p>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {scenarios.map((item) => (
              <button
                key={item.id}
                onClick={() => choose(item.id)}
                className="group flex min-h-16 w-full items-center justify-between gap-4 px-2 py-4 text-left hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span>
                  <span className="block font-medium">{item.label}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {item.description}
                  </span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 shrink-0 text-primary"
                />
              </button>
            ))}
          </div>
          <div className="mt-8">
            <BrandAttribution />
          </div>
        </div>
      </section>
    </main>
  )
}
