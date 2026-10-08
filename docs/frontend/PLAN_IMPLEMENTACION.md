# ABT Comex — Plan de implementación de Frontend

> Documento vivo · Última actualización: 08/10/2026
>
> Plan maestro para trabajar con Codex y revisión humana, construyendo el producto de forma incremental sin perder alcance, consistencia ni calidad.

## 1. Objetivo

Transformar el alcance funcional y el Design System aprobado en un frontend real, navegable y validable con ABT, manteniendo:

- foco en la gestión de Operaciones;
- simplicidad para el usuario;
- arquitectura preparada para backend, Portal, integraciones y canales asistidos;
- mínima complejidad implementada antes de necesitarla;
- trazabilidad entre requerimiento, pantalla y decisión;
- revisión humana después de cada incremento coherente.

## 2. Orden obligatorio de lectura para Codex

Antes de cualquier cambio de producto o frontend:

1. `AGENTS.md`
2. `docs/product/ALCANCE_FUNCIONAL.md`
3. `docs/frontend/ESPECIFICACION_FUNCIONAL_FRONTEND.md`
4. `docs/frontend/FRONTEND_STANDARD.md`
5. `docs/frontend/DECISIONS.md`
6. `docs/architecture/README.md`
7. este plan
8. `/design-system` y componentes de `packages/ui`

No usar como requisito funcional los datos mock del Design System.

## 3. Forma de trabajo

### 3.1 Incrementos pequeños y coherentes

Cada etapa debe producir algo que pueda revisarse de punta a punta. Evitar implementar muchas rutas incompletas en paralelo.

### 3.2 Gate humano

Al final de cada etapa:

1. Codex ejecuta checks técnicos.
2. Informa decisiones y pendientes.
3. El usuario revisa visual y funcionalmente.
4. Se ajusta.
5. Recién después se hace commit/merge y se avanza.

### 3.3 Reglas de ejecución

- No hacer commit ni push salvo pedido explícito.
- No crear backend, base de datos, auth real o paquetes de contratos hasta definir su arquitectura.
- No inventar roles, campos, estados o reglas no validadas.
- No introducir dependencias sin justificar su necesidad.
- No rediseñar el Design System durante una feature; un patrón reusable nuevo se incorpora primero allí.
- No usar `agent-browser` salvo pedido explícito o riesgo concreto que lo justifique.
- La revisión visual principal la realiza el usuario en localhost.
- Mantener datos mock realistas y claramente separados de la UI.

### 3.4 Checks mínimos

```bash
pnpm lint
pnpm typecheck
pnpm build
git diff --check
```

Además:

- sin errores evitables de consola;
- navegación por teclado;
- focus visible;
- desktop, notebook, tablet y mobile;
- estados alternativos relevantes.

## 4. Arquitectura frontend provisional

Mientras no exista backend:

```text
apps/web
├── app
│   ├── design-system
│   └── (app)
│       ├── layout.tsx
│       ├── inicio
│       ├── operaciones
│       ├── clientes
│       ├── cotizaciones
│       ├── mi-trabajo
│       ├── administracion
│       ├── gestion
│       └── configuracion
│
├── components
│   ├── app-shell
│   ├── navigation
│   └── onboarding
│
├── features
│   ├── operations
│   ├── clients
│   ├── quotes
│   ├── work
│   ├── administration
│   └── management
│
└── lib
    ├── mock-data
    ├── permissions
    └── navigation
```

Criterios:

- componentes visuales genéricos viven en `packages/ui`;
- composición y lógica de producto viven en `apps/web`;
- tipos y datos mock permanecen cerca de la feature;
- crear una interfaz simple de lectura de datos sólo cuando evite acoplar la UI a mocks;
- no anticipar un repositorio genérico, SDK o capa de contratos compartidos sin necesidad real.

## 5. Plan por etapas

---

## Etapa 0 — Contexto y preparación

### Objetivo

Dejar el repositorio preparado para que Codex trabaje con el mismo contexto funcional y UX.

### Entregables

- `docs/product/ALCANCE_FUNCIONAL.md`
- `docs/frontend/ESPECIFICACION_FUNCIONAL_FRONTEND.md`
- `docs/frontend/PLAN_IMPLEMENTACION.md`
- `AGENTS.md` actualizado con orden de lectura y reglas de producto.

### Gate

- Documentos consistentes entre sí.
- Ninguna contradicción con el Design System.
- Decisiones pendientes explícitas.

---

## Etapa 1 — Application Shell e infraestructura de experiencia

### Objetivo

Crear la estructura real de la aplicación interna sin inventar funcionalidades de los módulos.

### Entregables

- route group `(app)`;
- `AppShell`;
- sidebar desktop/notebook;
- drawer mobile;
- header compacto;
- breadcrumbs;
- `PageHeader`;
- menú de usuario mock;
- entrada de ayuda;
- estructura de búsqueda global inicial sin lógica profunda;
- rutas placeholder reales:
  - `/inicio`
  - `/operaciones`
  - `/clientes`
  - `/cotizaciones`
  - `/mi-trabajo`
  - `/administracion`
  - `/gestion`
  - `/configuracion`
- `/` redirige a `/inicio`;
- `/design-system` queda fuera del shell.

### Onboarding base

- estado mock de primer acceso;
- componente de bienvenida no bloqueante;
- estructura de checklist;
- posibilidad de omitir y retomar;
- ayuda contextual reusable.

### No hacer

- dashboards inventados;
- lógica real de permisos;
- notificaciones reales;
- backend o auth;
- Portal.

### Gate humano

- navegación clara;
- estado activo correcto;
- densidad empresarial;
- mobile usable;
- ayuda no invasiva;
- sin apariencia genérica de template.

---

## Etapa 2 — Inicio y Mi trabajo

### Objetivo

Validar el modelo mental principal: “qué requiere mi atención” y “qué tengo que hacer”.

### Inicio

- operaciones que requieren atención;
- próximos vencimientos;
- controles y aprobaciones;
- actividad reciente relevante;
- indicadores accionables;
- contenido condicionado por capacidades mock.

### Mi trabajo

- asignado a mí;
- mi equipo;
- próximo a vencer;
- vencido;
- aprobaciones;
- controles;
- excepciones;
- trabajo interno sin Operación.

### Reglas

- Inicio resume; Mi trabajo permite operar.
- Un indicador filtra o navega al conjunto que explica su valor.
- Evitar duplicar la misma información sin propósito.

### Gate humano

- en menos de 10 segundos se entiende qué requiere atención;
- cada elemento tiene contexto, responsable, vencimiento y acción;
- no se necesita recordar dónde ir para resolverlo.

---

## Etapa 3 — Listado real de Operaciones

### Objetivo

Construir la primera pantalla operativa principal reutilizando el patrón aprobado de datos.

### Entregables

- `/operaciones`;
- tabs o vistas Todas / Importaciones / Exportaciones;
- búsqueda;
- filtros por tipo, estado/situación, responsable, cliente, período;
- rango personalizado;
- indicadores clickeables;
- sorting desde headers;
- selección;
- agrupación;
- columnas visibles;
- paginación;
- totales sin mezclar monedas cuando correspondan;
- vistas loading, empty, filtered-empty y error;
- mobile resumido/expandible;
- navegación al detalle.

### Datos

Mocks realistas basados en el dominio, no en el Design System demo.

### Gate humano

- encontrar una Operación es rápido;
- se distinguen etapa, situaciones y responsable;
- filtros e indicadores tienen una única fuente de verdad;
- no hay columnas cortadas ni scroll horizontal como solución normal.

---

## Etapa 4 — Detalle común de Operación

### Objetivo

Definir el objeto central del producto antes de especializar Impo y Expo.

### Estructura inicial

- cabecera: referencia, cliente, tipo, estado general, etapa, responsable, situaciones;
- bloque “qué sigue”;
- resumen;
- seguimiento / hitos;
- documentación;
- controles;
- Administración relacionada;
- actividad;
- acciones contextuales.

### Reglas

- El próximo paso y los bloqueos son visibles.
- Estados multidimensionales no se reducen a un único badge.
- Información sensible se representa mediante capacidades mock.
- Evitar una página infinita de cards.

### Gate humano

La pantalla responde:

- qué Operación es;
- de qué Cliente;
- dónde está;
- quién la tiene;
- qué falta;
- qué bloquea;
- qué se puede hacer ahora.

---

## Etapa 5 — Creación guiada de Operación

### Objetivo

Validar el inicio del proceso y la prevención de errores.

### Flujo

1. creación directa o desde Cotización;
2. Cliente y tipo;
3. contexto inicial;
4. responsables;
5. requisitos derivados;
6. revisión.

### Comportamientos

- revelado progresivo;
- reutilización de datos conocidos;
- validación contextual;
- resumen antes de confirmar;
- volver sin perder información;
- borrador si se valida como necesidad;
- mensajes accionables.

### Gate humano

- no hay campos innecesarios;
- se entiende qué información falta y por qué;
- no se puede generar una inconsistencia obvia;
- la creación desde Cotización muestra el origen de los datos.

---

## Etapa 6 — Clientes

### Objetivo

Definir el contexto persistente que se reutiliza en Operaciones y Cotizaciones.

### Pantallas

- listado;
- detalle;
- datos básicos y contactos;
- Operaciones relacionadas;
- Cotizaciones relacionadas;
- actividad;
- configuraciones/requisitos sólo cuando estén validados.

### Gate humano

- Cliente es importante sin convertirse en un CRM genérico;
- se puede entender la relación completa con ABT;
- la información económica respeta capacidades sensibles.

---

## Etapa 7 — Primera vertical completa: Importación

### Objetivo

Validar el modelo común con el proceso operativo más relevado.

### Cobertura

- inicio y clasificación;
- pre-embarque;
- documentación condicional;
- preparación/provisorio;
- doble control bloqueante;
- arribo, ETA e hitos;
- oficialización;
- canal/liberación;
- demoras internas/externas;
- cierre documental;
- pase a Administración.

### Gate humano

- la UI acompaña el proceso sin rigidizarlo;
- reglas y checklists dependen del contexto;
- el doble control es claro y trazable;
- Alpha2000/MARÍA se representa como fuente externa, no se duplica.

---

## Etapa 8 — Exportación y DJVE

### Objetivo

Validar la especialización del modelo y relaciones no triviales.

### Cobertura

- instrucción;
- provisorio y doble control;
- oficialización y legajo;
- carga;
- certificados;
- DJVE con ciclo propio;
- relación DJVE ↔ permisos/operaciones;
- pase a Facturación;
- cumplido;
- post-embarque;
- documentación original y archivo.

### Gate humano

- una Operación puede estar facturada y seguir activa;
- DJVE no se fuerza como Operación;
- la documentación física/digital tiene estado y custodia.

---

## Etapa 9 — Cotizaciones

### Objetivo

Construir el circuito comercial previo a la Operación.

### Cobertura

- listado;
- creación y edición;
- líneas y servicios;
- cálculos automáticos;
- condiciones;
- versiones;
- aprobación;
- envío/aceptación;
- conversión explícita a Operación.

### Gate humano

- cantidad × unitario siempre produce el total;
- no puede enviarse sin aprobación;
- se distingue borrador, versión aprobada y versión aceptada;
- no se recargan datos al crear la Operación.

---

## Etapa 10 — Administración y Finanzas

### Objetivo

Diseñar el pase operativo-administrativo sin duplicar Alpha2000.

### Cobertura

- por revisar;
- con pendientes;
- listas para facturar;
- facturadas;
- diferencias;
- servicios/honorarios;
- gastos, anticipos y rendiciones;
- referencias de factura/cobranza;
- necesidades de fondos y aprobaciones.

### Gate humano

- “lista para facturar” tiene condiciones explícitas;
- facturar, cobrar y cerrar documentación son estados separados;
- datos sensibles están protegidos;
- la fuente Alpha2000 es visible.

---

## Etapa 11 — Gestión y Dirección

### Objetivo

Convertir información estructurada en decisiones.

### Cobertura

- resumen ejecutivo;
- operación y productividad;
- clientes y concentración;
- carga de trabajo;
- demoras y vencimientos;
- facturación/cobranzas;
- costos/márgenes;
- comparaciones de períodos;
- reportes definidos.

### Gate humano

- cada indicador permite drill-down;
- no se copian pantallas de `2025ABT.xlsx`;
- fórmulas y fuentes son explícitas;
- permisos se aplican en KPI, tabla, gráfico y exportación.

---

## Etapa 12 — Portal de clientes

### Objetivo

Construir una experiencia externa separada sobre el mismo núcleo.

### Primera etapa

- invitación y acceso;
- Inicio del Cliente;
- Operaciones habilitadas;
- detalle externo limitado;
- hitos compartidos;
- documentos compartidos;
- pendientes del Cliente;
- ayuda y notificaciones básicas.

### Segunda etapa

- carga documental;
- acciones simples;
- comunicaciones estructuradas;
- preferencias de notificación.

### Gate humano

- ninguna información interna se filtra;
- la visibilidad se define explícitamente;
- el Cliente entiende el estado sin conocer la complejidad interna;
- aplicación interna y Portal no comparten navegación por accidente.

---

## Etapa 13 — Canales asistidos

### Objetivo

Preparar y validar casos de interacción mediante modelos de lenguaje o mensajería, sin depender de un proveedor.

### Primera etapa

- consultas de sólo lectura;
- operaciones que requieren atención;
- estado de una Operación;
- documentos faltantes;
- vencimientos;
- indicadores autorizados.

### Requisitos

- misma identidad y permisos;
- servicios del producto como única vía;
- fuente y fecha del dato;
- abstención ante falta de información;
- auditoría;
- límites de uso.

### Futuro

- acciones simples;
- confirmación;
- idempotencia;
- escrituras sensibles aprobadas por caso de uso.

## 6. Infraestructura de onboarding

Implementar progresivamente:

1. primer acceso no bloqueante;
2. checklist por capacidades;
3. ayuda contextual reusable;
4. guías de tareas críticas cuando el flujo esté estable;
5. registro local/mock de avance en frontend;
6. persistencia real cuando exista arquitectura de usuario.

No construir un tour completo antes de que existan pantallas estables.

## 7. Estrategia de revisión

### Revisión funcional

- ¿representa el trabajo real?
- ¿respeta el alcance?
- ¿introduce una regla no validada?
- ¿la acción pertenece a este objeto?

### Revisión UX

- ¿el propósito es claro?
- ¿el próximo paso es visible?
- ¿previene errores?
- ¿reduce memoria?
- ¿ofrece recuperación?
- ¿es eficiente para usuarios frecuentes?

### Revisión visual

- jerarquía;
- densidad;
- alineación;
- responsive;
- consistencia;
- ausencia de “AI look”.

### Revisión técnica

- componentes reutilizados;
- límites entre `packages/ui` y `apps/web`;
- TypeScript;
- lint;
- build;
- consola;
- accesibilidad.

## 8. Protocolo de trabajo para Codex

Para cada etapa, Codex debe:

1. leer los documentos obligatorios;
2. inspeccionar código y componentes existentes;
3. resumir el entendimiento y señalar decisiones pendientes;
4. proponer un plan pequeño antes de modificar;
5. implementar sólo la etapa solicitada;
6. reutilizar el Design System;
7. contemplar estados, errores, permisos mock, responsive y onboarding contextual;
8. ejecutar checks;
9. no hacer commit ni push;
10. informar:
   - arquitectura;
   - archivos modificados;
   - decisiones;
   - estados contemplados;
   - responsive;
   - accesibilidad;
   - checks;
   - revisión visual humana necesaria;
   - pendientes.

## 9. Prompt maestro para iniciar una etapa

```text
Continuamos con ABT Comex.

Antes de trabajar leé obligatoriamente:
- AGENTS.md
- docs/product/ALCANCE_FUNCIONAL.md
- docs/frontend/ESPECIFICACION_FUNCIONAL_FRONTEND.md
- docs/frontend/FRONTEND_STANDARD.md
- docs/frontend/DECISIONS.md
- docs/frontend/PLAN_IMPLEMENTACION.md
- docs/architecture/README.md

Revisá también /design-system y reutilizá los componentes y patrones existentes.

ETAPA
<nombre exacto de la etapa>

OBJETIVO
<objetivo de producto>

ALCANCE
<entregables concretos>

FUERA DE ALCANCE
<qué no debe implementarse>

REGLAS
- No inventar roles, reglas, estados o campos no validados.
- No agregar dependencias sin necesidad real.
- No crear backend, DB o auth real.
- Mantener responsive, WCAG 2.2 AA y estados alternativos.
- Incorporar ayuda contextual sólo donde aporte valor.
- No usar agent-browser salvo pedido explícito.
- No hacer commit ni push.

VALIDACIÓN
pnpm lint
pnpm typecheck
pnpm build
git diff --check

Al finalizar informar:
- qué se implementó;
- decisiones tomadas;
- archivos modificados;
- comportamiento responsive;
- accesibilidad;
- estados contemplados;
- checks;
- puntos para revisión humana;
- pendientes o dudas concretas.
```

## 10. Próximo paso

El siguiente incremento recomendado es **Etapa 1 — Application Shell e infraestructura de experiencia**.

No avanzar a Operaciones hasta que el shell y la base de onboarding hayan sido revisados y aprobados visualmente.
