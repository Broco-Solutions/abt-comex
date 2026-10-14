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

- **Panorama**: cobertura de fixtures operativos de Cliente, Operación y Mi trabajo; conteos claramente identificados como cantidad de filas sintéticas, no productividad ni volumen de ABT.
- **Operación**: tabla agrupada por tipo y situación del fixture, con drill-down al listado existente y filtros conservados en URL.
- **Clientes**: relaciones sintéticas cliente→operaciones, con drill-down a la ficha de Cliente; no muestra concentración de ventas o resultados comerciales.
- **Carga y vencimientos**: elementos visibles del fixture, responsable/fecha cuando constan y acceso al contexto de Mi trabajo. No es una medición de capacidad ni SLA.
- **Fuentes económicas**: disponibilidad, fuente/intermediario, estado y responsable de validación pendiente para facturación/cobranzas, costos/impuestos/compras, bancos/ECheqs/fondos y resultados/márgenes. No incluye valores.

Los registros operativos se leen del estado compartido local de Operaciones; Clientes y Mi trabajo usan sus fixtures existentes. No se crea una segunda fuente de datos, no se exportan métricas y no se conecta Alpha2000, ARCA/MOA, Interbanking ni Microsoft 365. COMEX360 no aparece en la arquitectura objetivo.

## Reglas, privacidad y límites

La vista no presenta totales monetarios, facturación, cobranzas, costos, impuestos, movimientos, ECheqs, margen, liquidez ni proyecciones. Sus fuentes, fórmula, período, moneda, actualidad, permisos y responsable de validación siguen pendientes. La matriz conserva los 18 bloques del workbook con su evidencia; esta interfaz no los copia como planilla ni incorpora sus datos sensibles.

El responsable operativo no recibe acceso automático a honorarios, costos internos ni márgenes. Las vistas sin permiso o con error de lectura omiten conteos y no confirman existencia. Las fuentes pendientes no se muestran como cero, exitosas o sincronizadas. Un dato sintético visible no prueba autorización efectiva ni sustituye controles de una futura API.

Las únicas cantidades mostradas son agregaciones determinísticas de fixtures anonimizados/sintéticos y están marcadas como tales. No se calculan productividad, demora, ventas, concentración económica o resultados definitivos. No se incorpora selector de períodos hasta validar calendario, semántica de fechas y comparabilidad.

## Criterios de aceptación

- Panorama identifica escenario, origen y fecha fija del fixture; separa el resumen de los desgloses.
- Operaciones abre el listado con tipo/situación aplicados; desde clientes abre ficha y retorna a Gestión; desde carga abre el contexto de Mi trabajo.
- Fechas fijas, conteos y relaciones no se describen como fuente externa ni métrica de ABT.
- La vista económica explica por qué no hay un valor, quién/dónde debe validar la dependencia y qué dato no está disponible, sin cifras, ceros ficticios ni fórmulas.
- No aparecen honorarios, costos internos, saldos o márgenes en búsqueda, conteos, detalle ni Portal por esta ruta.
- Error y sin permiso no publican filas ni conteos; estados de fuente se distinguen de una conexión real.
- Tablas responsivas con desplazamiento horizontal indicado, región enfocada por teclado, caption y encabezados asociados.
- No hay gráficos decorativos ni acciones de exportación sin política de acceso.

Pruebas: `features/management/data/management.test.ts`, auditoría axe por vista y E2E de drill-down, retorno, ausencia económica y viewport. La revisión humana funcional/visual integral permanece pendiente.

## Validaciones pendientes de ABT

Propósito y definición de cada métrica; fórmula, período, moneda, fuente/autoridad, actualización, permiso, responsable y evidencia de validación; agregaciones por estado/cliente; definición de demoras/productividad/concentración; alcance de lectura Alpha2000 e Interbanking; futuro reporte/exportación y auditoría. No se atribuye validación formal de Dirección.
