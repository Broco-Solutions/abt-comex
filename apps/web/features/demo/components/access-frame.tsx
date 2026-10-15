import Image from "next/image"
import { BrandAttribution } from "@/components/brand/brand-attribution"
export function AccessFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-primary px-6 py-8 text-primary-foreground sm:px-12 lg:flex lg:px-16 lg:py-16">
        <Image
          src="/brand/ABT_COMEX_isotype_white_transparent.png"
          alt="ABT Comex"
          width={80}
          height={72}
          className="h-auto w-20"
          priority
        />
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
          <p className="mb-4 text-xs text-muted-foreground lg:hidden">
            Entorno de evaluación
          </p>
          {children}
          <div className="mt-8">
            <BrandAttribution />
          </div>
        </div>
      </section>
    </main>
  )
}
