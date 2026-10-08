# ABT COMEX

Sistema de gestión empresarial de ABT Comex.

## Arquitectura

Este repositorio es un monorepo de producto.

- `apps/web`: aplicación web Next.js.
- `packages/ui`: design system y componentes compartidos.
- `docs/product`: alcance y decisiones funcionales.
- `docs/frontend`: especificación, estándares y plan de frontend/UX.
- `docs/architecture`: decisiones de arquitectura.

No crear `apps/api`, `packages/db`, `packages/contracts` ni otras capas hasta que exista una necesidad real y se defina su tecnología.

## Fuente funcional y orden de lectura

Antes de cualquier cambio de producto o frontend, leer en este orden:

1. `docs/product/ALCANCE_FUNCIONAL.md`
2. `docs/frontend/ESPECIFICACION_FUNCIONAL_FRONTEND.md`
3. `docs/frontend/FRONTEND_STANDARD.md`
4. `docs/frontend/DECISIONS.md`
5. `docs/frontend/PLAN_IMPLEMENTACION.md`
6. `docs/architecture/README.md`

También revisar `/design-system` y los componentes de `packages/ui`.

Reglas de producto:

- El alcance funcional define qué producto se construye.
- La especificación de frontend define cómo se materializa en navegación, pantallas, acciones y estados.
- El Design System define patrones visuales e interactivos reutilizables.
- Los datos mock del Design System no son requerimientos funcionales.
- No inventar roles, permisos, estados, campos, reglas o fórmulas no validadas.
- Cuando falte una definición, dejar el punto explícito y formular una pregunta concreta.
- Operación es el núcleo funcional; Cliente, Cotización, Mi trabajo, Administración/Finanzas y Gestión se relacionan con ese núcleo según el alcance.
- Portal, integraciones y canales asistidos utilizan los mismos permisos, reglas, servicios y auditoría; no crean lógica paralela.

## Frontend

Antes de introducir nuevos patrones de UI, revisar:

`docs/frontend/FRONTEND_STANDARD.md`

Reglas generales:

- Reutilizar componentes y patrones existentes.
- No introducir colores, spacing, radios, tipografías o breakpoints arbitrarios.
- Responsive es obligatorio desde la primera implementación.
- Accesibilidad, estados de error, loading, empty, disabled, read-only y sin permiso forman parte de la feature.
- Los mensajes de error deben explicar qué ocurrió y, cuando sea posible, cómo corregirlo.
- No usar el color como única señal.
- Mantener apariencia Enterprise B2B: sobria, clara, consistente y orientada a uso operativo.
- No agregar dependencias sin una necesidad concreta.
- Preferir decisiones simples y reutilizables sobre abstracciones prematuras.
- No convertir cada capacidad transversal en una opción principal de navegación.
- No duplicar información externa sin identificar fuente y frescura cuando afecte decisiones.
- La inducción y ayuda contextual se diseñan junto con los flujos; no se agregan al final como un tour superficial.

## Implementación incremental

- Trabajar una etapa coherente por vez según `docs/frontend/PLAN_IMPLEMENTACION.md`.
- Al finalizar cada etapa, detenerse para revisión humana.
- No hacer commit ni push salvo pedido explícito.
- No usar `agent-browser` salvo pedido explícito o riesgo concreto que justifique su costo.
- La revisión visual principal se realiza manualmente en localhost.
- Un patrón nuevo reusable se incorpora primero al Design System y luego a las pantallas reales.
- No implementar backend, persistencia, auth real o una API ficticia dentro del frontend.
- Mientras no exista backend, mantener mocks y tipos cerca de cada feature y evitar arquitecturas genéricas prematuras.

## Next.js

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Calidad

Antes de considerar terminado un cambio relevante:

- TypeScript debe pasar.
- ESLint debe pasar.
- Build debe pasar.
- `git diff --check` debe pasar.
- No debe haber errores de consola evitables.
- La UI debe funcionar en desktop, notebook, tablet y mobile según corresponda.
- Deben contemplarse estados alternativos relevantes.
- Debe respetarse navegación por teclado y focus visible.
- Debe existir una explicación clara de acciones bloqueadas y errores.
- La feature debe respetar permisos y sensibilidad mock cuando correspondan, sin asumir perfiles definitivos.

Usar skills, agentes o revisores especializados solamente cuando la complejidad o el riesgo lo justifiquen.

## Brand assets

Los assets oficiales de ABT COMEX están en:

`assets/brand/`

Archivos disponibles:

- `ABT_COMEX_logo_green_transparent.png`
  - Logo principal.
  - Usar sobre fondos blancos, claros o neutros.

- `ABT_COMEX_logo_white_transparent.png`
  - Versión negativa.
  - Usar sobre fondos verdes, oscuros o imágenes con suficiente contraste.

Reglas:

- Usar siempre los logos oficiales existentes.
- No recrear ni redibujar el logo.
- No deformar proporciones.
- Mantener margen libre alrededor del logo.
- Elegir la variante adecuada según contraste.
