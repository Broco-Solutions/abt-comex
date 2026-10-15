export function isAdministrativeContext(value: string) {
  return /^\/(?:gestion|administracion(?:\/(?:finanzas|gastos|movimientos|rendiciones|categorias|comprobantes|carteras))?(?:\/[a-z0-9-]+)?)(?:\?[^#]*)?(?:#.*)?$/.test(
    value
  )
}
export function administrativeReturn(value: string, fallback: string) {
  const organization =
    /^\/(?:clientes|proveedores)\/[a-z0-9-]+(?:\?[^#]*)?$/.test(value)
  const href = isAdministrativeContext(value) || organization ? value : fallback
  const detail =
    /\/(?:gastos|movimientos|rendiciones|comprobantes)\/[a-z0-9-]+/.test(href)
  const label = organization
    ? "Volver a la organización"
    : href.startsWith("/gestion") || href.startsWith("/administracion/finanzas")
      ? "Volver al análisis"
      : href.startsWith("/administracion/rendiciones")
        ? detail
          ? "Volver a la rendición"
          : "Volver a Rendiciones"
        : href.startsWith("/administracion/gastos")
          ? detail
            ? "Volver al gasto"
            : "Volver a Gastos"
          : href.startsWith("/administracion/movimientos")
            ? detail
              ? "Volver al movimiento"
              : "Volver a Movimientos"
            : href.startsWith("/administracion/carteras")
              ? "Volver a la cartera"
              : "Volver a Administración"
  return { href, label }
}
