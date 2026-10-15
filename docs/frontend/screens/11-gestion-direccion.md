# Etapa 11 — Gestión y Dirección

> Estado: Under review
>
> Etapa: 11 — Gestión y Dirección
>
> Experiencias: MGT-01/MGT-02; continuidad J4/J7/J10. Sin nueva navegación principal.
>
> Ruta: `/gestion?vista=resumen|clientes|proveedores|evolucion|obligaciones|consultas`.
> Compatibilidad: `vista=operaciones|trabajo|economia`, enlaces y filtros históricos conservados.

## Propósito y trazabilidad

Comprender actividad y situación económica sintética y llegar a sus registros explicativos. No replicar el workbook ni sus cifras reales. Respaldo: [requerimientos de Dirección](https://docs.google.com/document/d/1lRmFWdOacUtX_XfhM6mYGjjbk25j3cSnoAlM8_AmZgA/edit), pestaña Dirección (Pablo 15/09/2026; Enrique 21/09/2026), IDs externos E1:DIR-001/005/006/007/008/010; [respuestas originales](https://docs.google.com/spreadsheets/d/1erYi1OkekCDCw5QD55Ch8H_MHiiHKlhFU0JbyhI97Sk/edit) y [2025ABT](https://docs.google.com/spreadsheets/d/1tFTDGBhGubjrUnJVlq2mXjSXDip_8h0F/edit). E1/E3/E6 y los 18 bloques REP de la matriz conservan las necesidades y pendientes históricos. El canal futuro de asistencia sigue sin decidirse.

## Alcance de esta pasada

- Panorama: facturación, cobros, gastos registrados, pagos y saldos por cobrar/pagar al corte; vencidos y compromisos desde hoy hasta 30 días. Variaciones sólo con historia y cortes comparables. G1/G4 evolucionan sobre sus componentes existentes.
- Clientes: toda la cartera autorizada, búsqueda, orden ascendente/descendente por métricas completas, saldo/vencido, operaciones por alta y variación válida. Tabla desktop y registros compactos en móvil. Más indicadores: importaciones/exportaciones, actividad, concentración de facturación y comprobantes. No limitar la consulta a cinco clientes; sólo el gráfico ejecutivo resume cinco.
- Proveedores ABT: compras referenciadas, gastos, pagos, obligaciones y comprobantes distinguibles. Excluir contrapartes operativas sin rol ABT; varios roles de una organización no fusionan poblaciones.
- Evolución: indicador, meses, categorías de gastos y fuentes. Obligaciones: cobrar/pagar y bandas de vencimiento, con corte independiente de la fecha de emisión.
- Fichas de Cliente/Proveedor: misma situación económica y mismos registros compartidos, reutilizando período/corte del origen. Dirección → ficha → comprobante → operación → retorno conserva contexto.
- Consultas operativas históricas: situación, carga/vencimientos y fuentes no conectadas conservan sus rutas. No hay disponibilidad bancaria, márgenes, impuestos ni resultados inventados.

## Filtros y modelo compartido

`features/finance/data/reporting.ts` es el selector puro compartido por Dirección, consultas y análisis administrativo G2/G3. Consume estado de gastos/movimientos, comprobantes/aplicaciones, organizaciones, operaciones y el único libro de referencias de gestión del PR #39. No hay un dataset financiero del buscador ni otro motor USD.

Inicio: **Este mes**, 01–14/10/2026 según corte sintético fijo 14/10/2026. Atajos: mes anterior, trimestre, año y personalizado DD/MM/AAAA; extremos inclusivos. Calendario español, mes/año, escritura, teclado y validación coordinada. Un borrador incompleto/imposible/invertido/futuro no se aplica. Rango efectivo y referencia siempre visibles. No usar reloj del dispositivo para “este mes”. Historia disponible desde 01/05/2026: los períodos anteriores se señalan parciales, sin fabricar comparación.

Comparación anterior de mes/trimestre parcial usa igual cantidad de días; interanual traslada extremos y señala si difiere la duración. Sin historia suficiente, base cero o valoración completa no hay porcentaje. Filtros de cliente/tipo con relaciones verificadas; un registro compartido entre operaciones no se prorratea. Moneda histórica de URL filtra **moneda original**; el reporte siempre expresa USD. Cambios locales conservan scroll y no recargan documento. Búsqueda, orden, pregunta y filtros quedan en URL compartible; escenarios aislados y sin persistencia productiva de preguntas.

## Indicadores y consultas locales

Catálogo explícito en `direction-queries.ts`, funciones puras y reconocimiento acotado de variantes. Sólo Dirección (`management.read`, nunca Portal), además del permiso indicado por indicador. El reconocimiento se evalúa después de verificar acceso. Sugerencias, conteos, títulos, importes y enlaces no aparecen sin permiso. Son controles frontend demostrativos, no autorización productiva.

| Consulta / indicador | Definición y agregación | Filtros / fecha | Fuente y permiso adicional | Drill-down y abstención |
|---|---|---|---|---|
| Principales clientes por facturación | Suma de facturas de venta registradas convertidas a USD, por cliente único verificable; orden descendente, sin truncar ranking de respuesta | Período inclusivo, cliente/tipo/moneda original; emisión | Comprobantes de evaluación compartidos; finance.billing | Exactamente las facturas sumadas. Abstenerse ante relación no única, importe o conversión incompletos |
| Cuánto facturamos entre fechas | Suma de esas mismas facturas, excluye preparados y cobros | Fecha del comprobante; Desde/Hasta o rango escrito DD/MM/AAAA | Mismo selector, finance.billing | Comprobantes y operaciones explícitas. Sin historia suficiente, total no confirmado |
| Facturación de cliente | Misma suma, cliente identificado por nombre completo o filtro | Período, cliente y dimensiones activas | Mismos comprobantes; finance.billing | Sólo comprobantes de ese cliente; cliente ambiguo requiere selección; desconocido/incompleto no confirma total |
| Cobros de cliente | Suma sólo movimientos Cobro; ninguna aplicación a factura se infiere | Fecha propia del cobro, cliente y período | Movimientos compartidos; finance.collections | Movimientos exactos y vínculos existentes, nunca facturas deducidas del importe |
| Cantidad de operaciones de cliente | Cuenta población actual del escenario; consulta de existencia, sin período | Cliente y tipo autorizado; **no usa fecha de actualización** | Operaciones compartidas; operations.read | Exactamente las operaciones contadas. No afirmar cantidad de altas del período con esta intención |
| Saldo abierto de facturas de cliente | Saldos explícitos con historia completa y aplicaciones al corte. Nunca facturación menos cobros | Cliente y Hasta; incluye facturas anteriores al período | Portfolio compartido de facturas de venta; finance.collections | Facturas abiertas exactas. Saldo faltante impide total completo; convertir saldo ARS al corte |
| Gastos registrados por categoría | Suma sólo registros Gasto por categoría, orden USD descendente; no pagos ni costo total | Fecha del gasto y período; demás filtros visibles | Gastos/categorías compartidos; finance.expenses + costs.internal | Gastos exactos, denominación vigente y referencia original conservadas; conversión incompleta impide total |

Los indicadores adicionales de Dirección usan el mismo criterio: pagos son movimientos Pago; compras son facturas de compra referenciadas; saldos por pagar provienen de portfolio explícito. No hay respuestas asistidas de proveedores/cuentas por pagar hasta cerrar su semántica. Los demás ingresos/egresos y anticipos conservan su naturaleza; nunca se agregan como resultado neto.

## Pantalla Consultas de Dirección

Entrada secundaria **Consultas (demo)**, URL `/gestion?vista=consultas`. Una pregunta y una respuesta activa; sin chat global, historial conversacional, proveedor IA ni acciones de negocio. Aviso: “Demostración local con datos sintéticos. No consulta sistemas externos ni utiliza un proveedor de IA”. Cuatro ejemplos principales visibles y tres adicionales desplegables.

Consultar resuelve expresiones temporales al corte y fija rango/cliente en URL (`pregunta`, `consultaAplicada`, filtros). Después, los filtros visibles son autoridad para recalcular la respuesta; consultar nuevamente interpreta el texto nuevo. No registrar consultas como auditoría. “Ingresos” o “principales clientes” sin criterio ofrecen opciones accionables de facturación, cobros de cliente o cantidad de operaciones. No interpretar texto libre fuera del catálogo; ofrecer ejemplos. Fecha inválida no elimina el campo de pregunta.

Respuesta: frase natural primero; ranking compacto cuando corresponde; definición, fecha aplicable, cantidad de fuentes, fuente sintética, corte/actualización y **Ver registros**. El desglose contiene la misma población, importe original, USD y acceso a ficha. Método desplegable muestra ID/revisión/vigencia/fuente/fecha de valoración; cada ficha monetaria conserva el disclosure de PR #39. Foco en respuesta sin salto de scroll y anuncio polite, labels y teclado nativos, retorno desde registros a pregunta y filtros. Móvil usa selector de vistas y controles táctiles; sin conversación decorativa.

Aclarar “ingresos” conserva el período y el cliente identificado por nombre
completo antes de elegir la métrica; no vuelve silenciosamente al mes inicial
ni a toda la cartera. Más de un nombre completo exige elegir cliente primero.

Estados diferenciados: no admitida, aclaración, cliente ambiguo, fecha inválida, período sin registros, dato incompleto, referencia de cambio faltante/inválida, error de lectura y sin permiso. Ninguno se transforma en cero válido. No publicar total USD parcial en consultas. La analítica puede mostrar subtotal **explícitamente parcial**; gráficos omiten grupos incompletos o muestran serie pendiente, sin barra de cero inventada.

## Moneda y privacidad

USD de gestión aprobado internamente como referencia de reportes. Originales intactos. ARS se convierte con referencia sintética válida vigente al evento; saldos con referencia vigente al corte. USD original conserva valor. Precisión compartida micro-USD y presentación a centavos. Revisar referencia propaga donde corresponde, sin recalcular pasado con tipo actual. Falta/invalidación de referencia o saldo no implica cero; no sumar monedas originales incompatibles.

Permisos económicos distintos de acceso operativo; filtrar antes de agregar, buscar, contar o graficar. No hay API ni fuente externa conectada. Fuente real del dólar, criterio contable de valoración, relaciones Alpha2000, matriz definitiva de capacidades, resultados/rentabilidad y canal asistido pendientes de validación formal ABT. No atribuir aprobación funcional ni declarar producción.

## Criterios de aceptación y pruebas

`reporting.test.ts`: población idéntica indicador/tabla/gráfico, gasto nuevo compartido, histórico/saldos al corte, proveedores, altas, revisión FX, negativos y ausencia de historia. `direction-queries.test.ts`: siete intenciones, variantes, fechas/cliente, ambigüedad, saldo incompleto, FX faltante, permisos antes de sugerencias y error de lectura. `v3-direction.spec.ts` y `v3-direction-queries.spec.ts`: períodos, filtros dinámicos, consulta/drill-down/retorno, teclado/foco y móvil; regresión anterior conservada/adaptada a USD. Axe de pantallas y período DS, contraste en navegador, inspección visual efectiva desktop/tablet/móvil. Gates y resultados efectivos se registran en el plan, sin anticipar aprobación humana.
