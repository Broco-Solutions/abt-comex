# Etapa 11 — Gestión y Dirección

> Estado: Under review
>
> Etapa: 11 — Gestión y Dirección
>
> Experiencias / recorridos: MGT-01, MGT-02; J1, J4, J7 y J10
>
> Rutas: `/gestion` con vistas `?vista=resumen|operaciones|clientes|trabajo|economia`

## Propósito y trazabilidad

Dar contexto de gestión y permitir llegar a los registros que explican el escenario, sin replicar `2025ABT.xlsx` ni convertir solicitudes históricas en métricas aprobadas. Cubre `MGT-001` a `MGT-005` y `REP-001` a `REP-018`; la matriz es autoridad de su evidencia, clasificación y pendiente por bloque. Las cinco vistas son secciones de `/gestion`, no nuevas rutas de producto.

## Alcance de esta pasada

- **Dirección (entrada / panorama)**: G1 facturación y cobranzas por mes; G4 facturación por cliente. Ambas usan los mismos comprobantes sintéticos, con fecha propia de cada evento, período y moneda separados. No es productividad ni volumen real de ABT.
- **Consulta histórica Operación**: tabla agrupada por tipo y situación del fixture, con drill-down al listado existente y filtros conservados en URL.
- **Consulta histórica Clientes**: relaciones sintéticas cliente→operaciones, con drill-down a la ficha de Cliente; no muestra concentración de ventas o resultados comerciales.
- **Consulta histórica Carga y vencimientos**: elementos visibles del fixture, responsable/fecha cuando constan y acceso al contexto de Mi trabajo. No es una medición de capacidad ni SLA.
- **Fuentes económicas**: disponibilidad, fuente/intermediario, estado y responsable de validación pendiente para facturación/cobranzas, costos/impuestos/compras, bancos/ECheqs/fondos y resultados/márgenes. No incluye valores.

Los registros operativos se leen del estado compartido local de Operaciones; Clientes y Mi trabajo usan sus fixtures existentes. No se crea una segunda fuente de datos, no se exportan métricas y no se conecta Alpha2000, ARCA/MOA, Interbanking ni Microsoft 365. COMEX360 no aparece en la arquitectura objetivo.

## Reglas, privacidad y límites

UX-05 autoriza una representación frontend con importes enteramente sintéticos de facturas y cobros. No presenta impuestos, movimientos bancarios, ECheqs, margen, liquidez, resultados ni proyecciones. Las definiciones productivas, fuentes, fórmulas, período, moneda, actualidad, permisos y responsable de validación siguen pendientes. La matriz conserva los 18 bloques del workbook con su evidencia; esta interfaz no los copia como planilla ni incorpora sus datos sensibles.

El responsable operativo no recibe acceso automático a honorarios, costos internos ni márgenes. Las vistas sin permiso o con error de lectura omiten conteos y no confirman existencia. Las fuentes pendientes no se muestran como cero, exitosas o sincronizadas. Un dato sintético visible no prueba autorización efectiva ni sustituye controles de una futura API.

Las cantidades provienen de registros financieros sintéticos compartidos, no de los ejemplos monetarios del DS. El período filtra la fecha del evento de cada registro; ARS y USD nunca se suman ni convierten. No se calculan productividad, demora ni resultados definitivos. La diferencia entre facturación y cobros no se presenta como deuda.

## Criterios de aceptación

- Dirección permite comparar facturación/cobros mensuales y concentración de facturación, y abrir exactamente los registros explicativos con período/moneda conservados.
- Operaciones abre el listado con tipo/situación aplicados; desde clientes abre ficha y retorna a Gestión; desde carga abre el contexto de Mi trabajo.
- Fechas fijas, conteos y relaciones no se describen como fuente externa ni métrica de ABT.
- La vista económica explica por qué no hay un valor, quién/dónde debe validar la dependencia y qué dato no está disponible, sin cifras, ceros ficticios ni fórmulas.
- Sólo la perspectiva con capacidad ejecutiva accede a estos importes; responsables operativos y Portal no reciben gráficos, selectores ni conteos económicos.
- Error y sin permiso no publican filas ni conteos; estados de fuente se distinguen de una conexión real.
- Tablas responsivas con desplazamiento horizontal indicado, región enfocada por teclado, caption y encabezados asociados.
- No hay gráficos decorativos ni acciones de exportación sin política de acceso.

Pruebas: `features/management/data/management.test.ts`, auditoría axe por vista y E2E de drill-down, retorno, restricción económica, igualdad de agregaciones/registros y viewport. La revisión humana funcional/visual integral permanece pendiente.

## Validaciones pendientes de ABT

Propósito y definición de cada métrica; fórmula, período, moneda, fuente/autoridad, actualización, permiso, responsable y evidencia de validación; agregaciones por estado/cliente; definición de demoras/productividad/concentración; alcance de lectura Alpha2000 e Interbanking; futuro reporte/exportación y auditoría. No se atribuye validación formal de Dirección.
