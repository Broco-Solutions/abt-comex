# ABT Comex — Codex Runbook

> Documento vivo · Última actualización: 08/10/2026

## 1. Propósito

Este runbook define cómo debe trabajar Codex en ABT Comex para mantener alcance, consistencia, calidad visual, pruebas y documentación.

No reemplaza el plan de implementación. Establece el procedimiento obligatorio para ejecutar cada etapa o tarea.

## 2. Principio operativo

```text
Leer → entender → especificar → planificar → implementar → probar → informar → revisar
```

No comenzar a modificar código mientras existan contradicciones importantes o una definición funcional imprescindible esté ausente.

## 3. Inicio de cada ejecución

### 3.1 Estado del repositorio

Comprobar:

```bash
git status --short --branch
git log -3 --oneline
```

No sobrescribir cambios ajenos o no comprendidos.

### 3.2 Lectura obligatoria

Leer en el orden indicado por `AGENTS.md`.

Luego leer únicamente la especificación de pantalla o flujo aplicable en `docs/frontend/screens/`.

No repetir auditorías profundas de todo el repositorio para tareas rutinarias. La revisión debe ser proporcional al riesgo.

### 3.3 Resumen previo

Antes de modificar, resumir internamente:

- etapa solicitada;
- objetivo de producto;
- archivos o features afectadas;
- patrones existentes a reutilizar;
- reglas confirmadas;
- decisiones pendientes;
- pruebas requeridas;
- documentación que podría cambiar.

Si existe una duda bloqueante, formular una pregunta concreta antes de implementar.

## 4. Definition of Ready

Una tarea está lista cuando tiene:

- etapa identificada;
- objetivo y trabajo principal;
- especificación de pantalla o flujo;
- alcance;
- fuera de alcance;
- datos mock necesarios;
- reglas y estados conocidos o marcados como pendientes;
- permisos/sensibilidad considerados;
- comportamiento responsive esperado;
- criterios de aceptación;
- escenarios de prueba;
- gate de revisión humana.

Si falta algo no bloqueante, registrarlo como pendiente. Si cambia la naturaleza de la solución, detenerse y preguntar.

## 5. Plan antes de construir

Para tareas medianas o grandes, producir un plan corto y ejecutable:

1. estructura y archivos;
2. componentes reutilizados;
3. datos y fixtures;
4. estados e interacciones;
5. responsive y accesibilidad;
6. pruebas;
7. documentación;
8. checks.

No producir planes enormes que repitan la documentación existente.

## 6. Reglas de implementación

### Producto

- No inventar alcance.
- No convertir mocks del Design System en requisitos.
- No crear módulos principales no aprobados.
- No simplificar estados multidimensionales en un único estado si contradice el alcance.
- No exponer información sensible por comodidad del mock.
- No esconder decisiones funcionales dentro de código.

### UI y UX

- Reutilizar Design System.
- Mantener el mismo patrón para la misma tarea.
- Toda pantalla tiene propósito, siguiente paso y acciones jerarquizadas.
- Estados alternativos se implementan junto con el caso ideal.
- Responsive y accesibilidad se trabajan desde el primer commit.
- No usar decoración para compensar falta de jerarquía.
- Onboarding y ayuda no deben ocultar una interfaz confusa.

### Código

- Lógica de producto en `apps/web/features`.
- Componentes genéricos en `packages/ui`.
- Fixtures y tipos cerca de la feature.
- No hardcodear datasets grandes en páginas.
- No crear backend, DB, auth real ni contratos compartidos ficticios.
- No introducir dependencias sin justificar y documentar.
- No usar `any` para evitar modelar correctamente un caso.
- Mantener componentes con responsabilidad clara.
- Preferir composición sobre props excesivas y variantes ambiguas.

### Marca

- Aplicar `BRAND_USAGE.md`.
- Usar assets oficiales.
- ABT es marca principal.
- `Powered by Broco Solutions` usa componente reusable y enlace oficial.

## 7. Datos mock y frontera futura

Cada feature debe separar:

```text
UI
↓
fuente/adaptador de datos simple
↓
fixtures determinísticos
```

Esto permite sustituir fixtures por API sin reescribir pantallas.

No simular latencias o errores de manera aleatoria. Los estados se activan mediante fixtures o parámetros controlados.

No usar información real sensible.

## 8. Documentación obligatoria

### Matriz de impacto

| Cambio | Documento mínimo |
|---|---|
| Alcance o dominio | `ALCANCE_FUNCIONAL.md` |
| Patrón transversal de experiencia | `ESPECIFICACION_FUNCIONAL_FRONTEND.md` |
| Nueva pantalla o flujo | `screens/<archivo>.md` |
| Nuevo patrón visual reusable | `/design-system` + `FRONTEND_STANDARD.md` |
| Nueva decisión permanente | `DECISIONS.md` |
| Cambio de etapas o gate | `PLAN_IMPLEMENTACION.md` |
| Cambio de pruebas | `TEST_STRATEGY.md` |
| Cambio de marca | `BRAND_USAGE.md` |
| Cambio de operación de Codex | `CODEX_RUNBOOK.md` o `AGENTS.md` |

### Regla

No actualizar documentos por inercia. Actualizarlos cuando cambie una decisión, especificación, patrón o proceso.

El informe final siempre incluye:

```text
Impacto documental:
- Sin impacto
```

o la lista de archivos modificados.

## 9. Pruebas por tipo de tarea

### Cambio de lógica pura

- unitarias;
- typecheck;
- lint.

### Componente interactivo

- pruebas de componente;
- teclado y foco;
- axe cuando corresponda;
- revisión responsive.

### Pantalla

- integración de pantalla;
- estados alternativos;
- responsive manual;
- accesibilidad;
- E2E si pertenece a recorrido crítico.

### Flujo crítico

- unitarias de reglas;
- integración;
- E2E;
- regresión visual selectiva;
- revisión humana.

### Corrección de bug

- reproducir;
- corregir;
- agregar prueba de regresión cuando sea razonable;
- verificar no regresiones relacionadas.

## 10. Checks obligatorios

Según la etapa y `TEST_STRATEGY.md`:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test
git diff --check
```

Agregar Playwright y otras suites cuando apliquen.

No informar “todo OK” sin listar comandos y resultados reales.

## 11. Revisión visual

- No usar `agent-browser` salvo pedido explícito.
- La revisión principal la realiza el usuario en localhost o preview.
- Codex debe señalar exactamente qué rutas y escenarios revisar.
- No afirmar que algo fue validado visualmente si sólo se ejecutó build.
- Capturas o snapshots no reemplazan interacción manual.

Viewports mínimos:

```text
1440 · 1280 · 1024 · 768 · 390
```

## 12. Condiciones de detención

Codex debe detenerse si:

- la tarea requiere una decisión funcional no disponible;
- existe riesgo de exponer información sensible;
- se necesita inventar un rol o permiso;
- la solución exige backend o persistencia no aprobados;
- aparece una contradicción entre alcance y especificación;
- una nueva dependencia cambia significativamente la arquitectura;
- los tests revelan un defecto de base que debe resolverse antes;
- el cambio excede la etapa solicitada.

La pregunta debe ser concreta e incluir opciones y recomendación cuando sea posible.

## 13. Control de alcance

Una ejecución grande puede cubrir toda una etapa coherente.

No debe cubrir varias etapas de producto de una sola vez.

Ejemplo permitido:

```text
Etapa 0 completa:
configuración de pruebas + estructura de features + documentación + assets
```

Ejemplo no permitido:

```text
Shell + Operaciones + Clientes + Cotizaciones + Portal
```

La duración no define el alcance. La cohesión y posibilidad de revisión sí.

## 14. Eficiencia de tokens y tiempo

- Leer completos los documentos base una vez por sesión relevante.
- Para iteraciones menores, releer sólo secciones afectadas.
- No repetir en cada informe todo el contexto del proyecto.
- No ejecutar auditorías profundas sin riesgo que las justifique.
- Preferir cambios acotados y comprobables.
- No usar agentes/subagentes si no agregan valor real.

## 15. Formato obligatorio del informe final

```text
1. Resultado
2. Archivos modificados
3. Patrones reutilizados o creados
4. Estados contemplados
5. Responsive
6. Accesibilidad
7. Pruebas agregadas
8. Checks ejecutados
9. Impacto documental
10. Revisión humana necesaria
11. Dudas, riesgos o desviaciones
```

## 16. Commit y push

- No hacer commit ni push salvo pedido explícito.
- No cambiar de branch sin indicación o necesidad claramente comunicada.
- No mezclar refactors no relacionados.
- Antes de entregar, ejecutar `git diff --check` y mostrar `git status --short`.

## 17. Cierre de etapa

Una etapa finaliza sólo cuando:

- entregables completos;
- pruebas aprobadas;
- documentación sincronizada;
- revisión humana realizada;
- correcciones incorporadas;
- usuario autoriza commit/merge;
- `main` vuelve a quedar limpio y navegable.