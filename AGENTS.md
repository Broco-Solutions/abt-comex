# ABT COMEX

Sistema de gestión empresarial de ABT Comex.

## Propósito del repositorio

Este repositorio contiene el producto ABT Comex y su sistema de diseño. Durante la etapa actual el foco es construir un frontend real, navegable y validable con ABT, sin anticipar backend, persistencia o autenticación antes de definir su arquitectura.

- `apps/web`: aplicación web Next.js.
- `packages/ui`: Design System y componentes visuales compartidos.
- `docs/product`: alcance y decisiones funcionales.
- `docs/frontend`: especificación, estándares, pruebas, marca y plan de frontend/UX.
- `docs/frontend/screens`: especificaciones de pantallas y flujos.
- `docs/architecture`: decisiones de arquitectura técnica.
- `assets/brand`: fuentes maestras de marca.

No crear `apps/api`, `packages/db`, `packages/contracts`, SDKs ni capas equivalentes hasta que exista una necesidad real y se defina su tecnología.

## Orden obligatorio de lectura

Antes de cualquier cambio de producto o frontend, leer en este orden:

1. `docs/product/ALCANCE_FUNCIONAL.md`
2. `docs/frontend/ESPECIFICACION_FUNCIONAL_FRONTEND.md`
3. `docs/frontend/FRONTEND_STANDARD.md`
4. `docs/frontend/TEST_STRATEGY.md`
5. `docs/frontend/BRAND_USAGE.md`
6. `docs/frontend/CODEX_RUNBOOK.md`
7. `docs/frontend/PLAN_IMPLEMENTACION.md`
8. `docs/frontend/DECISIONS.md`
9. `docs/architecture/README.md`
10. La especificación de pantalla aplicable en `docs/frontend/screens/`, si existe.

También revisar `/design-system` y los componentes existentes de `packages/ui`.

## Fuentes de verdad

- El alcance funcional define **qué producto se construye**.
- La especificación de frontend define **cómo se materializa en navegación, pantallas, acciones y estados**.
- Las especificaciones de pantalla definen **el objetivo y comportamiento de cada vista o flujo**.
- El Design System define **patrones visuales e interactivos reutilizables**.
- El plan de implementación define **orden, entregables y gates**.
- La estrategia de pruebas define **qué evidencia de calidad necesita cada cambio**.
- Los datos mock del Design System son demostrativos y no son requerimientos funcionales.

No iniciar una implementación si estas fuentes se contradicen. Informar la contradicción y formular una pregunta concreta.

## Reglas de producto

- Operación es el núcleo funcional del sistema.
- Cliente, Cotización, Mi trabajo, Administración/Finanzas y Gestión se relacionan con ese núcleo según el alcance.
- Portal, integraciones y canales asistidos usan los mismos permisos, reglas, servicios y auditoría; no crean lógica paralela.
- No inventar roles, permisos, estados, campos, reglas, fórmulas, indicadores ni relaciones no validadas.
- Cuando falte una definición, dejarla explícita, usar un supuesto reversible sólo si es indispensable y reportarlo.
- No convertir cada capacidad transversal en una opción principal de navegación.
- No copiar planillas actuales como pantallas. Reconstruir el trabajo con datos y procesos estructurados.
- No mezclar información externa con información local sin identificar fuente y frescura cuando afecte decisiones.

## Gobierno documental

Una decisión funcional o de experiencia no se considera cerrada si existe sólo en código, chat o prompt.

Actualizar según corresponda:

- cambio de alcance: `ALCANCE_FUNCIONAL.md`;
- cambio de experiencia transversal: `ESPECIFICACION_FUNCIONAL_FRONTEND.md`;
- pantalla o flujo nuevo: `docs/frontend/screens/`;
- patrón reusable: `/design-system`, `FRONTEND_STANDARD.md` y, si corresponde, `DECISIONS.md`;
- cambio en orden o entregables: `PLAN_IMPLEMENTACION.md`;
- cambio de estrategia o infraestructura de pruebas: `TEST_STRATEGY.md`;
- cambio de uso de marca: `BRAND_USAGE.md`.

Todo informe final debe incluir `Impacto documental: sin impacto` o la lista de documentos actualizados.

## Frontend

- Reutilizar componentes y patrones existentes.
- No introducir colores, spacing, radios, tipografías, sombras, alturas o breakpoints arbitrarios.
- Responsive es parte de la feature desde el primer cambio.
- Accesibilidad, loading, empty, filtered-empty, error, disabled, read-only, sin permiso y acciones bloqueadas forman parte de la feature cuando apliquen.
- Los mensajes de error deben explicar qué ocurrió, qué se preservó y cómo continuar.
- No usar color como única señal.
- Mantener apariencia Enterprise B2B: sobria, premium, clara, consistente, densa pero legible y orientada a uso operativo.
- Evitar apariencia genérica de dashboard, landing o interfaz generada por IA.
- No agregar dependencias sin una necesidad concreta y justificada.
- Preferir decisiones simples y reutilizables sobre abstracciones prematuras.
- La inducción y ayuda contextual se diseñan junto con los flujos; no se agregan al final como un tour superficial.

## Arquitectura de código durante la etapa frontend

- Componentes visuales genéricos viven en `packages/ui`.
- Composición, lenguaje y lógica de producto viven en `apps/web`.
- Organizar lógica de producto por feature en `apps/web/features`.
- Mantener tipos, fixtures, adapters mock y pruebas cerca de la feature.
- No hardcodear datasets grandes dentro de páginas o componentes.
- Usar fronteras simples de lectura de datos cuando permitan sustituir fixtures por API sin reescribir la UI.
- No crear repositorios genéricos, SDKs o contratos compartidos antes de necesitarlos.
- Filtros, búsqueda, agrupación, ordenamiento y paginación relevantes deben reflejarse en URL cuando aporte navegación, retorno o enlaces compartibles.

## Trabajo incremental

- Seguir `docs/frontend/PLAN_IMPLEMENTACION.md`.
- Una ejecución puede cubrir una etapa completa sólo si es coherente, acotada y verificable.
- No ejecutar varias etapas de producto en un único lote.
- Al finalizar cada etapa, detenerse para revisión humana.
- No hacer commit ni push salvo pedido explícito.
- No usar `agent-browser` salvo pedido explícito o riesgo concreto que justifique su costo.
- La revisión visual principal se realiza manualmente en localhost o preview.
- Un patrón reusable nuevo se incorpora primero al Design System y luego a pantallas reales.
- No implementar backend, persistencia, autenticación real o una API ficticia dentro del frontend.

## Calidad y pruebas

Antes de considerar terminado un cambio relevante:

- TypeScript debe pasar.
- ESLint debe pasar.
- Build debe pasar.
- `git diff --check` debe pasar.
- Las pruebas exigidas por `TEST_STRATEGY.md` deben pasar.
- No debe haber errores evitables de consola.
- La UI debe funcionar en desktop, notebook, tablet y mobile según corresponda.
- Debe respetar navegación por teclado, focus visible y WCAG 2.2 AA.
- Deben probarse estados alternativos y datos extremos relevantes.
- Las acciones bloqueadas deben explicar el motivo y la forma de resolverlo.
- La feature debe respetar permisos y sensibilidad mock sin asumir perfiles definitivos.
- La pantalla o flujo debe tener especificación y criterios de aceptación actualizados.
- La revisión visual humana es obligatoria antes de aprobar cambios significativos.

## Next.js

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Branding

Los assets oficiales están en `assets/brand/`.

ABT Comex es siempre la marca principal del producto. Broco Solutions aparece sólo como atribución secundaria mediante el patrón documentado en `docs/frontend/BRAND_USAGE.md`.

Reglas:

- usar exclusivamente assets oficiales;
- no recrear ni redibujar logos;
- no deformar proporciones;
- mantener área de seguridad y contraste;
- elegir la variante correcta según fondo;
- no cargar logos desde URLs externas;
- no competir visualmente con la marca ABT;
- el enlace de atribución debe ser accesible y seguro.

## Formato obligatorio del informe final

1. Resultado.
2. Archivos modificados.
3. Patrones reutilizados o creados.
4. Estados contemplados.
5. Responsive.
6. Accesibilidad.
7. Pruebas agregadas y ejecutadas.
8. Checks.
9. Impacto documental.
10. Revisión humana necesaria.
11. Dudas concretas o desviaciones.

Usar skills, agentes o revisores especializados sólo cuando la complejidad o el riesgo lo justifiquen.