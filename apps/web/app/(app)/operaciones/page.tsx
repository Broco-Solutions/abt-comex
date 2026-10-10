import { ModulePlaceholder } from "@/components/states/module-placeholder"

export default async function OperacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string | string[] }>
}) {
  const params = await searchParams
  const type = Array.isArray(params.tipo) ? params.tipo[0] : params.tipo
  const title =
    type === "importacion"
      ? "Importaciones"
      : type === "exportacion"
        ? "Exportaciones"
        : "Operaciones"

  return (
    <ModulePlaceholder
      title={title}
      description="Este módulo será el núcleo de seguimiento de las operaciones completas de importación y exportación."
    />
  )
}
