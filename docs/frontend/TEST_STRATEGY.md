# ABT Comex — Estrategia de Pruebas de Frontend

V3-07: `reporting.test.ts` contrasta población y USD entre indicador, tabla,
gráficos y registros, cambios compartidos, conversión de evento frente a corte,
historia parcial, proveedores/operaciones y capacidades negativas.
`direction-queries.test.ts` cubre siete intenciones y variantes, ambigüedad de
ingresos/cliente, rango, ausencia de FX, saldo incompleto, vacío, lectura y acceso.
`v3-direction*.spec.ts` verifica filtros/comparaciones, consulta activa, fuentes
exactas, original/USD/referencia, foco, retorno con contexto y móvil. Axe incluye
respuestas/abstenciones y calendario/período DS. No basta HTTP/build ni se
certifica WCAG por una herramienta; inspeccionar capturas y contraste efectivo.

`DateField` se prueba con escritura DD/MM/AAAA, fechas imposibles/bisiestas,
borrador incompleto, estados de error y calendario español con mes/año.
La referencia DS tiene axe con el popover abierto; el recorrido móvil verifica
selección de mes/año, flechas/Enter, cierre y devolución de foco. La apariencia
nativa del sistema operativo no se usa como evidencia de formato español.

Moneda V3: `management-rates.test.ts` cubre conversión histórica, corte, USD/ARS,
revisión/invalidación, ausencia de referencia/importe, precisión y entradas
inválidas. `v3-management-rates.spec.ts` recorre edición → gasto sin cambiar su
original → conversión pendiente, consulta al corte, restricción de capacidades,
duplicados y diálogo móvil con retorno de foco. Axe cubre catálogo, disclosure y
editor. La regresión de Dirección debe comprobar además tabla/gráfico/indicador
con la misma población y valoración; estos casos no acreditan aún ese cierre.

Continuidad V3-06: `operational-continuity.test.ts` verifica roles activos,
deduplicación, reenvío/devolución, conservación de dimensiones y filtros por ID.
`v3-continuity.spec.ts` recorre asignación explícita → ficha de persona/listado,
contraparte → participaciones → operación, envío → bandeja → devolución →
recepción para revisión y aislamiento documental del Portal. La regresión previa
de Importación/Exportación/DJVE/documentos conserva control de dos identidades,
autonomía del trámite, permisos múltiples y separación de originales/copias.

> Documento vivo · Última actualización: 14/10/2026

## 1. Objetivo

Buscador global: `v3-global-search.spec.ts` cubre apertura clic/Ctrl/Meta+K, foco,
grupos, operación/cotización/cliente/pantalla, cero resultados, flechas/Enter,
Escape/exterior/Tab, retorno al formulario, capacidades negativas, cambio de
escenario, aislamiento Portal y altas reales del escenario compartido. Reflow
320–1440. Proyección y validación de retorno tienen unitarias; diálogo abierto y
sin resultados se revisan con axe y contraste efectivo en navegador. Meta+K se
comprueba como evento en Chromium Linux, sin atribuir prueba nativa macOS.

Regresión del refinamiento de navegación V3 en `e2e/specs/v3-sidebar.spec.ts`:
grupos independientes y persistentes, padre/hijos, selección sin flechas,
contador reactivo al doble control, perfil consultivo con retorno de foco,
cambio de escenario y drawer en altura reducida. Complementa la suite del Shell,
axe, snapshots inspeccionados y revisión efectiva desktop/rail/tablet/móvil.

El scroll se verifica también en 1280×480: ruta activa revelada, rueda, foco de
teclado y pie alcanzable. El contrato WebKit usa 5 px y track transparente;
Firefox conserva el fallback estándar `thin`/`scrollbar-color`. No confundir
inspección Chromium con una ejecución Firefox/WebKit cuando el host no permite
iniciarlos. El refinamiento de superficies recorre las 13 vistas solicitadas en
390/768/1024/1280/1440 y revisa capturas reales antes de actualizar snapshots.

Asegurar que el frontend de ABT Comex sea confiable, consistente, accesible y navegable antes de incorporar backend real.

Los datos mock no reducen la exigencia de calidad: navegación, reglas de presentación, formularios, filtros, cálculos, estados, permisos simulados y recorridos completos deben probarse desde el comienzo.

La estrategia es **basada en riesgo**, no en perseguir un porcentaje artificial de cobertura.

## 2. Principios

1. Probar comportamiento observable, no detalles de implementación.
2. Dar mayor profundidad a flujos críticos y reglas que previenen errores.
3. Mantener pruebas rápidas en la base y pocas pruebas E2E, pero valiosas.
4. Cada defecto corregido debe incorporar una prueba de regresión cuando sea razonable.
5. Accesibilidad y responsive forman parte de la funcionalidad.
6. Ninguna auditoría automática reemplaza la revisión humana.
7. Las pruebas deben ser determinísticas y no depender de red, fecha real o servicios externos.
8. Fixtures y factories deben usar lenguaje y casos realistas de ABT.
9. No mockear tanto que la prueba deje de representar el comportamiento real.
10. Las pruebas deben ayudar a refactorizar, no bloquear cambios visuales legítimos por fragilidad.

## 3. Pirámide de pruebas

```text
        Revisión humana y regresión visual
                    E2E
            Integración de pantalla
          Componentes y accesibilidad
             Lógica unitaria
             Controles estáticos
```

## 4. Stack objetivo

La Etapa 0 incorporó versiones compatibles con el stack real; comandos y configuración efectiva en §20:

- Vitest;
- Testing Library React;
- `@testing-library/user-event`;
- `@testing-library/jest-dom`;
- `axe-core` o integración equivalente para auditorías automáticas;
- Playwright para E2E y regresión visual controlada.

No agregar Jest en paralelo si Vitest cubre la necesidad.

## 5. Convenciones de ubicación

```text
apps/web/
├── features/
│   └── operations/
│       ├── components/
│       ├── data/
│       ├── types/
│       └── tests/
│
├── test/
│   ├── setup.ts
│   ├── factories/
│   ├── fixtures/
│   └── utils/
│
└── e2e/
    ├── fixtures/
    ├── pages/
    └── specs/
```

Los componentes genéricos de `packages/ui` mantienen sus pruebas dentro del paquete.

Evitar carpetas globales gigantes de mocks sin ownership claro.

## 6. Capa 0 — Controles estáticos

Obligatorios para cambios relevantes de aplicación. Para cambios exclusivamente documentales, usar §21 sin ejecutar suites frontend:

```bash
pnpm lint
pnpm typecheck
pnpm build
git diff --check
```

Los scripts raíz instalados se describen en §20:

```text
pnpm test
pnpm test:unit
pnpm test:watch
pnpm test:e2e
pnpm test:e2e:ui
pnpm test:a11y
pnpm test:all
```

Los nombres finales pueden ajustarse si se documenta el motivo, pero no deben existir comandos ambiguos o duplicados.

## 7. Capa 1 — Pruebas unitarias

Aplicar a lógica pura:

- cálculos de cotizaciones;
- totales y subtotales por moneda;
- transformaciones de datos;
- filtros y agrupaciones;
- formato de fechas;
- reglas de visibilidad mock;
- reducers y máquinas de estado simples;
- onboarding y progreso;
- helpers de URL state;
- interpretación de estados multidimensionales;
- selección de próximo paso;
- normalización de datos externos.

### Reglas

- Sin renderizar React cuando no sea necesario.
- Casos límite explícitos.
- Incluir moneda, cero, valores negativos cuando sean válidos, grandes cantidades y redondeo.
- No usar la fecha actual sin reloj controlado.
- No depender del orden incidental de objetos.

## 8. Capa 2 — Pruebas de componentes

Aplicar a componentes interactivos:

- formularios;
- campos con error, read-only y disabled;
- dialogs y confirmaciones;
- drawers;
- dropdowns y popovers;
- calendarios y rangos;
- tablas;
- selección múltiple;
- ordenamiento;
- paginación;
- navegación por teclado;
- onboarding;
- ayuda contextual;
- componentes de estado;
- atribución de marca.

### Deben verificar

- interacción equivalente a una persona mediante `user-event`;
- nombre accesible;
- foco inicial y devolución de foco;
- Escape, click fuera y cierre explícito cuando correspondan;
- errores asociados a controles;
- estados indeterminados;
- ausencia de información sensible cuando no corresponde;
- comportamiento con texto largo;
- no depender sólo de clases CSS internas.

## 9. Capa 3 — Pruebas de integración de pantalla

Prueban componentes coordinados dentro de una ruta o feature.

Ejemplos prioritarios:

- un KPI activa el filtro correcto y actualiza contador, tabla y totales;
- cambiar manualmente un filtro sincroniza el KPI activo;
- búsqueda, período, ordenamiento y paginación conviven sin estados contradictorios;
- URL conserva filtros relevantes;
- selección muestra acciones masivas y se limpia correctamente;
- abrir una Operación mantiene contexto de retorno;
- una acción bloqueada explica el motivo;
- información sensible desaparece de KPI, tabla, tooltip y exportación mock;
- datos externos muestran fuente y frescura;
- onboarding se puede omitir y retomar;
- cambiar viewport activa el patrón responsive previsto, no un layout roto.

## 10. Capa 4 — Pruebas E2E

Playwright cubrirá pocos recorridos, pero críticos.

### Recorridos iniciales

1. Primer acceso y checklist inicial.
2. Navegación completa del shell.
3. Abrir y cerrar navegación mobile.
4. Buscar y filtrar Operaciones.
5. Abrir una Operación y volver conservando contexto.
6. Crear una Operación directa.
7. Crear una Operación desde Cotización.
8. Completar un control.
9. Gestionar documentación pendiente.
10. Reasignar responsable.
11. Marcar una Operación lista para facturar.
12. Acceder a un indicador de Gestión y llegar a registros explicativos.
13. Acceso externo al Portal sin exposición de datos internos, cuando exista.

### Navegadores

Los flujos críticos deben ejecutarse al menos en:

- Chromium;
- Firefox;
- WebKit.

Durante desarrollo puede usarse Chromium para rapidez, pero el gate de una etapa crítica debe ejecutar la matriz completa o documentar por qué no aplica.

## 11. Accesibilidad

### Automatizada

- Ejecutar axe sobre shell, formularios, dialogs, tablas y pantallas clave.
- Tratar violaciones como errores, no como advertencias decorativas.
- Documentar falsos positivos reales.

### Manual

Verificar:

- navegación sólo con teclado;
- foco visible;
- foco no oculto por overlays;
- orden de foco;
- apertura/cierre de drawer, dialogs y popovers;
- nombres accesibles;
- lectura comprensible de estados;
- zoom de navegador;
- contraste;
- reducción de movimiento;
- mensajes de error y bloqueo.

Cero violaciones automáticas no equivale a WCAG cumplida.

## 12. Responsive

### Viewports mínimos

- 1440 × 900;
- 1280 × 800;
- 1024 × 768;
- 768 × 1024;
- 390 × 844.

### Casos manuales

- menú y drawer;
- encabezados y acciones;
- dialogs y popovers dentro del viewport;
- tablas y registros expandibles;
- gráficos y leyendas;
- formularios;
- textos largos;
- zoom al 200% cuando sea relevante;
- ausencia de overflow horizontal accidental.

No aceptar “responsive” basado únicamente en que `scrollWidth` no excede el viewport.

## 13. Regresión visual

Usar snapshots de Playwright de forma selectiva para:

- Application Shell;
- navegación desktop y mobile;
- Design System;
- DataTable;
- detalle de Operación;
- formularios críticos;
- estados de error y sin permiso;
- atribución de marca;
- Portal cuando exista.

Reglas:

- snapshots estables y con datos determinísticos;
- no aprobar cambios visuales automáticamente;
- evitar snapshots de páginas enormes cuando una región específica sea suficiente;
- cada actualización de snapshot debe revisarse visualmente.

## 14. Datos de prueba

- Fixtures realistas y legibles.
- Factories para variaciones, no duplicación manual.
- IDs determinísticos.
- Fechas congeladas.
- Monedas separadas.
- Casos con información incompleta, demorada, bloqueada y sin permisos.
- Textos largos y valores extremos.
- No incluir datos personales o comerciales reales de ABT salvo autorización explícita y sanitización.

Conjuntos mínimos:

- Operación de Importación normal;
- Importación con faltantes;
- Importación bloqueada por control;
- Exportación facturada pero aún activa;
- Operación sin responsable;
- Cotización con varias versiones;
- Cliente con Impo y Expo;
- trabajo interno sin Operación;
- dato externo desactualizado;
- usuario sin acceso económico;
- contacto externo del Portal.

## 15. Matriz de riesgo

| Riesgo | Profundidad mínima |
|---|---|
| Cálculo o regla bloqueante | Unitarias + integración + E2E si participa de flujo crítico |
| Navegación y shell | Componentes + E2E + revisión visual |
| Formulario complejo | Unitarias + componentes + integración |
| Tabla operativa | Componentes + integración + responsive manual |
| Permisos/sensibilidad | Unitarias + integración + E2E negativo |
| Onboarding | Componentes + integración + E2E básico |
| Cambio puramente visual menor | Revisión visual + tests existentes |
| Integración externa mock | Unitarias + integración de estados y frescura |

## 16. Cobertura

No se establece un porcentaje global como objetivo principal.

Se exige cobertura explícita de:

- reglas de negocio;
- cálculos;
- caminos de error;
- permisos;
- estados alternativos;
- flujos críticos.

Los reportes de cobertura sirven para detectar huecos, no para premiar líneas irrelevantes.

## 17. Política de flakiness

- Una prueba inestable no se ignora indefinidamente.
- No usar esperas fijas salvo justificación excepcional.
- Esperar estados visibles o eventos reales.
- Mantener datos y reloj determinísticos.
- Aislar causa antes de aumentar timeouts.
- Una prueba marcada temporalmente debe tener seguimiento y plazo de resolución.

## 18. Evidencia de cada entrega

El informe de Codex debe incluir:

- pruebas agregadas;
- comandos ejecutados;
- resultado;
- navegadores E2E ejecutados;
- auditoría de accesibilidad;
- casos no probados y motivo;
- puntos para revisión manual.

## 19. Gate de etapa

La primera pasada integral permite continuar entre etapas tras verificación técnica/documental, sin aprobación visual humana por etapa. Ese cierre deja `Under review`, no `Complete`/`Approved`; los estados y secuencia viven en el plan. Cada bloque conserva evidencia de los siguientes checks y distingue revisión técnica realizada de revisión humana pendiente.

Una etapa no puede aprobarse hasta que:

- controles estáticos pasan;
- pruebas requeridas pasan;
- flujos críticos definidos para esa etapa están cubiertos;
- no hay fallos de accesibilidad conocidos sin registrar;
- responsive fue revisado;
- regresión visual fue revisada cuando corresponde;
- documentación de pantalla y decisiones está actualizada;
- existe aprobación humana, que puede registrarse en la revisión integral de la primera pasada.

La revisión integral incluye recorridos completos entre etapas, retorno, enlaces y acciones efectivas del prototipo, integridad referencial de fixtures y ausencia de exposición económica indirecta. Probar negativamente que responsable/jefe no hereda honorarios y que permiso aduanero no habilita costos/márgenes; en UI, búsquedas, conteos, documentos, exportaciones y canales. Probar estados externos no conectada, desactualizada, parcial, error y sin permiso. Los escenarios mock no validan conectores ni seguridad productiva; éstos requieren evidencia real según la línea de integraciones del plan.

## 20. Implementación inicial

### Comandos y convenciones de la Etapa 0

`pnpm test` ejecuta unitarias/componentes y luego accesibilidad. `pnpm test:unit` ejecuta la suite de ambos workspaces sin auditorías axe; `pnpm test:watch` observa las pruebas de `web`. `pnpm test:a11y` ejecuta la auditoría de componente con axe. `pnpm test:e2e` ejecuta Chromium, Firefox y WebKit; para el smoke rápido, `pnpm test:e2e --project=chromium`. `pnpm test:e2e:ui` abre la interfaz local de Playwright. `pnpm test:all` recorre lint, tipos, pruebas rápidas, build y E2E. Antes de E2E local: `pnpm exec playwright install` y `pnpm build` (Playwright inicia `next start` en el puerto 3100). Para actualizar la única referencia visual, ejecutar `pnpm test:e2e --project=chromium --update-snapshots` y revisar el diff de imagen.

Vitest usa jsdom en `apps/web` y Node en `packages/ui`; las pruebas de feature se ubican junto a su feature. `apps/web/test/setup.ts` registra jest-dom y limpieza. El helper de render sólo centraliza la entrada a Testing Library. Fechas de prueba: literales fijos o `vi.setSystemTime`; IDs fijos y fixtures por feature cuando haya consumidor. No se crearon factories ni fixtures globales vacíos. La frontera futura es componente → fuente simple de la feature → fixture determinístico, sin API simulada.

La auditoría axe de componente desactiva `color-contrast` únicamente en jsdom porque no hay canvas real. Contraste, foco visible, zoom y responsive requieren revisión humana. Playwright captura el encabezado de `/design-system` en Chromium con una referencia selectiva. CI instala sólo Chromium y ejecuta `@smoke`; el snapshot `@visual` queda para el entorno local de referencia, ya que diferencias de fuentes del runner pueden producir falsos cambios. La matriz completa queda disponible localmente. En Linux, las bibliotecas faltantes se instalan mediante `pnpm exec playwright install-deps firefox webkit` con privilegios del sistema. Los reportes HTML y `test-results` son generados e ignorados por Git.

El setup está completado. Su evidencia histórica está en [el plan](PLAN_IMPLEMENTACION.md#evidencia-de-cierre); no constituye la siguiente ejecución.

## 21. Validación documental

Para cambios que no modifican la aplicación:

```bash
node scripts/check-docs.mjs
git diff --check
git status --short
```

El [validador](../../scripts/check-docs.mjs), sin dependencias nuevas, comprueba enlaces Markdown locales y anchors, rutas documentales en código inline, IDs duplicados, referencias locales y fuentes inexistentes, estados de especificación y coherencia básica de etapas. Resume conteos reales; no impone 108/117/32 como cuota.

Opciones:

- `--self-test`: casos determinísticos del parser, referencias, duplicados y estados.
- `--inventory`: referencias entrantes/salientes Markdown del corpus (AGENTS, README y docs); no incluye referencias en código ni URLs externas.
- `--baseline <directorio>`: contrasta los conjuntos de IDs de matriz/mapa/recorridos, conservación de documentos e historia de decisiones contra una copia previa local. El directorio debe contener AGENTS, README y docs; no descargar fuentes privadas al repositorio para construirlo.

En una consolidación, complementar con revisión manual antes/después de necesidades, reglas, relaciones, decisiones y destinos de texto migrado. Un enlace o ID existente **no demuestra** que respalde semánticamente la afirmación. El registro E1 de IDs externos es una lista observada, no una sincronización automática de Drive.

Límites: sintaxis Markdown inline usada por este repositorio (sin parser general de HTML/referencias Markdown), anchors compatibles con sus encabezados, rutas documentales existentes y vocabulario de estados actual. Las rutas web propuestas no se comprueban como archivos. No consulta red, fórmulas, aprobaciones, disponibilidad de API ni calidad UX.

Sólo cambiar documentación no requiere lint/typecheck/build/E2E. Si se modifica el validador, ejecutar su self-test y el corpus; documentar resultados y revisión semántica. No reemplaza pruebas funcionales ni revisión humana.

## Evaluación UX/UI V2 por capacidades

La aplicación requiere seleccionar perspectiva. La fixture E2E común establece explícitamente Dirección como contexto de revisión integral una vez por contexto de navegador; no es un default del producto. Los tests UX de acceso cambian a perfiles operativos/externos y verifican ausencia de registros económicos, navegación propia, filtro por tipo y recuperación de inducción. Reinicio y cambio con modificaciones requieren confirmación; no se usan sleeps ni se deshabilitan escenarios previos. La visibilidad frontend no constituye autorización real.

## Regresión documental y de procesos UX-06

Los escenarios 2/20/100 de documentos y DJVE son pruebas de diseño, no volúmenes ni cuotas de ABT. Comprobar búsqueda, límite de filas/revelado y paginación sin activar capacidades avanzadas innecesarias. Las fechas relativas/cortes de evaluación comparten una referencia determinística; una actualización documental no se rotula como fecha de operación.

Probar recepción de copia en ficha/workspace/consulta sin completar original ni control; proyección externa antes de conteos/campos; salida y reinicio; versión histórica sin mutación de secuencia; errores enlazados y foco; cliente explícito/reutilizado desde contexto; regreso DJVE/Exportación/lista con búsqueda intacta. No se reemplazan aserciones funcionales por avisos genéricos de demo. Axe no certifica WCAG ni sustituye teclado/reflow/revisión visual.

UX-07 agrega ux-regression.spec.ts: identidad/acciones dentro del viewport útil (320–1440), período financiero inválido/invertido sin cifras confirmadas y preferencias/ayuda secundaria. Contraste de experiencias/J1–J10 y límites en el plan. Cada referencia visual actualizada se inspecciona como base técnica Under review, no aprobación humana. No relajar timeouts, desactivar pruebas ni aceptar snapshots fallidos indiscriminadamente.

## Regresión V3

Nómina laboral: contrastar las 16 filas nominales con IDs/fila de fuente, excluir
buzones/cuentas técnicas y no inferir permisos/ingresos/tareas. Comprobar login
de escenarios separado, acceso explícito local, suspensión, equipos,
selectores y Portal aislado. Los tests de transferencia usan asignaciones
sintéticas explícitas, nunca se atribuyen como trabajo efectivo a ABT.

V3-03: people.test.ts valida persona/acceso distintos, suspensión con transferencia e historial y capacidades independientes del contexto. v3-people-access.spec.ts comprueba login sin almacenar contraseña, ojo accesible, recuperación sin envío/cambio real, creación de integrante/equipo, capacidades financieras parciales, suspensión y proyección de asignaciones; filtros URL locales y retorno con foco. people.a11y.tsx incluye diálogo largo, equipos y estados de acceso/recuperación. Las pruebas no acreditan autenticación ni autorización productivas. Escenarios previos pasan a /acceso/escenarios; /acceso queda para ingreso convencional visual. Chromium ejecutado; otros motores y revisión humana WCAG pendientes.

V3-01 incorpora v3-continuity.spec.ts: filtros sin solicitudes de navegación de documento, Atrás/Adelante, orden conservado, retorno con foco/posición y misma disponibilidad documental en Portal. Combobox tiene pruebas de búsqueda/selección/Escape/sin coincidencias y axe expandido. Revisar flyout compacto sobre encabezados de tabla y geometría 390/768/1024/1440; cambiar superficies obliga a inspeccionar referencias visuales antes de actualizar sólo las afectadas. Un test que termina por tiempo se reproduce aislado; no se corrige ampliando timeouts ni forzando clics.

V3-04 amplía regresión con administrative-ledger.test.ts, v3-administration.spec.ts y administrative-ledger.a11y.tsx: crear categoría/proveedor dentro de gasto, reutilizar maestros, general sin operación, moneda/centavos, inactivación con historia, anticipo/rendición/evidencia, proyección de trabajo, mismo registro en gráfico/detalle y negativos económicos. Comprobar capacidades de ingresos frente a egresos, filtros URL sin documento, retorno y scroll/foco; no afirmar pagos/contabilidad reales. Gates actuales en el plan.
