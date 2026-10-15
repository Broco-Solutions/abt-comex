/** Only existing internal route families; query and anchor remain intact. */
export function isApplicationReturn(value: string) {
  return (
    !value.includes("\\") &&
    /^\/(?:inicio|mi-trabajo|operaciones(?:\/[a-z0-9-]+(?:\/(?:importacion|exportacion))?)?|clientes(?:\/[a-z0-9-]+)?|proveedores(?:\/[a-z0-9-]+)?|cotizaciones(?:\/[a-z0-9-]+(?:\/editar)?)?|administracion(?:\/[a-z0-9-]+(?:\/[a-z0-9-]+)?)?|gestion|configuracion(?:\/[a-z0-9-]+(?:\/[a-z0-9-]+)?)?|tramites\/djve(?:\/[a-z0-9-]+)?)(?:\?[^#]*)?(?:#.*)?$/.test(
      value
    )
  )
}
