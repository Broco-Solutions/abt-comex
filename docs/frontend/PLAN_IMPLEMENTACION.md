# ABT Comex — Plan de implementación de Frontend

> Documento vivo · Última actualización: 10/10/2026
>
> Plan maestro para transformar el alcance y el Design System en un frontend premium, navegable, consistente y validable con ABT.

## 1. Objetivo

Construir el frontend de ABT Comex como producto real y reutilizable, no como prototipo descartable.

Debe servir para:

- validar alcance y procesos con ABT;
- demostrar una experiencia empresarial de alta calidad;
- detectar reglas, estados y excepciones antes del backend;
- definir contratos futuros sin inventar infraestructura;
- conservar consistencia entre pantallas;
- permitir reemplazar fixtures por API sin reescribir la experiencia;
- sostener Portal, integraciones y canales asistidos sobre la misma base.

## 2. Decisión de ejecución

Una ejecución larga de Codex está permitida **sólo para una etapa coherente y verificable**.

La primera ejecución grande recomendada es:

```text
Etapa 0 — Frontend Foundation
```

Puede tomar tiempo porque instala gobierno, pruebas, estructura y branding. No debe incluir Application Shell ni varias pantallas de producto.

No ejecutar todas las etapas del sistema en un único prompt. La duración no define el alcance; la cohesión y posibilidad de revisión sí.

## 3. Orden obligatorio de lectura

Antes de trabajar:

1. `AGENTS.md`
2. `docs/product/ALCANCE_FUNCIONAL.md`
3. `docs/frontend/ESPECIFICACION_FUNCIONAL_FRONTEND.md`
4. `docs/frontend/FRONTEND_STANDARD.md`
5. `docs/frontend/TEST_STRATEGY.md`
6. `docs/frontend/BRAND_USAGE.md`
7. `docs/frontend/CODEX_RUNBOOK.md`
8. `docs/frontend/DECISIONS.md`
9. `docs/architecture/README.md`
10. este plan
11. la especificación aplicable en `docs/frontend/screens/`
12. `/design-system` y componentes de `packages/ui`

No usar como requisito funcional los datos mock del Design System.

## 4. Gobierno de cada incremento

```text
Definir
→ especificar pantalla/flujo
→ planificar
→ implementar
→ probar
→ revisar visual y funcionalmente
→ actualizar documentos
→ aprobar
→ commit/merge
```

### Definition of Ready

Antes de implementar:

- propósito y trabajo principal;
- alcance y fuera de alcance;
- especificación de pantalla;
- información y acciones;
- reglas, estados y permisos conocidos o marcados como pendientes;
- responsive esperado;
- ayuda/onboarding;
- escenarios de prueba;
- gate humano.

### Definition of Done

Antes de cerrar:

- funcionalidad completa del corte;
- consistencia con otras pantallas;
- estados alternativos;
- responsive;
- WCAG 2.2 AA;
- pruebas requeridas;
- checks técnicos;
- documentos sincronizados;
- marca correcta;
- revisión humana.

## 5. Reglas de ejecución

- No hacer commit ni push salvo pedido explícito.
- No crear backend, base de datos, auth real o paquetes de contratos antes de definir arquitectura.
- No inventar roles, campos, estados, fórmulas o reglas.
- No introducir dependencias sin justificar y documentar.
- No rediseñar el Design System durante una feature.
- Un patrón reusable nuevo se incorpora primero al Design System.
- No usar `agent-browser` salvo pedido explícito.
- La revisión visual principal se realiza manualmente en localhost o preview.
- Mantener fixtures realistas y determinísticos, separados de la UI.
- Cada entrega informa impacto documental.
- `main` debe permanecer compilable y navegable.

## 6. Arquitectura frontend objetivo de esta etapa

```text
apps/web/
├── app/
│   ├── design-system/
│   └── (app)/
│
├── components/
│   ├── app-shell/
│   ├── brand/
│   ├── navigation/
│   └── onboarding/
│
├── features/
│   ├── home/
│   ├── work/
│   ├── operations/
│   ├── clients/
│   ├── quotes/
│   ├── administration/
│   └── management/
│
├── test/
│   ├── factories/
│   ├── fixtures/
│   ├── utils/
│   └── setup.ts
│
└── e2e/
    ├── fixtures/
    ├── pages/
    └── specs/

packages/ui/
├── components genéricos
├── hooks genéricos
├── utilidades
└── pruebas del Design System
```

### Frontera de datos durante mocks

```text
pantalla / componente
        ↓
fuente o adapter simple de la feature
        ↓
fixtures determinísticos
```

No hardcodear datasets extensos dentro de páginas.

## 7. Checks y scripts esperados

Controles base:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test
git diff --check
```

La Etapa 0 debe dejar comandos claros para:

```text
test unitario
watch
E2E
E2E UI
accesibilidad
verificación completa
```

Ver `TEST_STRATEGY.md`.

# Plan por etapas

---

## Etapa 0 — Frontend Foundation

### Objetivo

Instalar una base operativa que obligue a mantener calidad, pruebas, documentación, consistencia y marca antes de producir pantallas.

### Esta etapa puede ejecutarse completa en una única corrida larga de Codex

Debe detenerse al terminar y esperar revisión humana.

### Entregables documentales

- verificar consistencia de los documentos base;
- actualizar `DECISIONS.md` con decisiones de gobierno, testing y marca;
- crear la especificación `screens/01-foundation-application-shell.md` usando la plantilla;
- registrar cualquier contradicción sin resolverla silenciosamente.

### Entregables de testing

- instalar Vitest y Testing Library;
- configurar matchers y setup;
- incorporar axe;
- instalar y configurar Playwright;
- crear scripts coherentes en workspaces y raíz;
- crear una prueba unitaria de referencia;
- crear una prueba de componente accesible de referencia;
- crear un E2E smoke de referencia;
- configurar datos y reloj determinísticos;
- agregar documentación de comandos;
- incorporar workflow CI para lint, typecheck, tests y build si no existe uno equivalente.

### Entregables de estructura

- crear sólo directorios y utilidades base que se utilicen en la propia etapa;
- establecer convención de `features` y tests sin generar módulos vacíos innecesarios;
- crear helpers de render para pruebas;
- establecer frontera simple de fixtures;
- no crear repositorios o contratos genéricos.

### Entregables de marca

- verificar assets ABT;
- incorporar asset oficial Broco Solutions;
- documentar fuente maestra y copia servida;
- crear `BrandAttribution` reusable;
- enlazar a `https://brocosolutions.com`;
- agregar pruebas de accesibilidad del componente;
- no insertar aún el componente en un shell inexistente.

### Entregables de calidad

- agregar comando de verificación integral;
- revisar configuración de TypeScript y ESLint sólo si existe un hueco real;
- no actualizar dependencias no relacionadas;
- documentar cualquier limitación del entorno.

### Fuera de alcance

- Application Shell;
- rutas de producto;
- onboarding visual;
- dashboards;
- lógica de Operaciones;
- backend;
- auth;
- Portal;
- integración real.

### Gate humano

- comandos comprensibles;
- suite rápida y estable;
- CI razonable;
- estructura no sobrediseñada;
- documentación consistente;
- logo Broco correcto;
- `BrandAttribution` sutil y reusable;
- sin regresiones del Design System.

---

## Etapa 1 — Application Shell e infraestructura de experiencia

### Objetivo

Crear la estructura real de la aplicación interna sin inventar funcionalidades profundas.

### Entregables

- route group `(app)`;
- `AppShell`;
- sidebar desktop/notebook expandida por defecto y rail compacto opcional con
  preferencia local temporal;
- drawer completo para tablet/mobile por debajo de 1024 px;
- header compacto;
- breadcrumbs;
- `PageHeader`;
- menú de usuario mock;
- entrada de ayuda;
- búsqueda global inicial sin lógica profunda;
- rutas placeholder:
  - `/inicio`;
  - `/operaciones`;
  - `/clientes`;
  - `/cotizaciones`;
  - `/mi-trabajo`;
  - `/administracion`;
  - `/gestion`;
  - `/configuracion`;
- `/` redirige a `/inicio`;
- `/design-system` queda fuera del shell;
- logo ABT completo e isotipo oficial derivado lossless según el modo;
- `BrandAttribution` al pie de sidebar/drawer;
- 404, error boundary, loading y acceso denegado base.

### Onboarding base

- estado mock de primer acceso;
- bienvenida breve y no bloqueante;
- checklist reusable;
- omitir y retomar;
- ayuda contextual base;
- panel completo limitado a `/inicio`, con estado global y reanudación desde
  Ayuda en cualquier módulo sin reservar espacio fuera de Inicio.

### Pruebas mínimas

- navegación activa;
- breadcrumbs;
- drawer y foco;
- toggle, persistencia, tooltips y flyout accesible del rail compacto;
- teclado;
- onboarding omitir/retomar;
- branding;
- E2E smoke de navegación;
- snapshots selectivos desktop/mobile.

### Gate humano

- navegación clara;
- jerarquía premium;
- densidad empresarial;
- responsive real;
- ayuda no invasiva;
- ABT protagonista y Broco secundario;
- sin apariencia genérica de template.

---

## Etapa 2 — Inicio y Mi trabajo

### Objetivo

Validar el modelo mental principal:

- Inicio: qué requiere atención.
- Mi trabajo: qué debe hacer la persona.

### Entregables

Inicio:

- operaciones que requieren atención;
- próximos vencimientos;
- controles/aprobaciones;
- actividad relevante;
- indicadores accionables;
- contenido condicionado por capacidades mock.
- acceso “Ver todo en Mi trabajo” desde el resumen de trabajo accionable.

Mi trabajo:

- asignado a mí;
- mi equipo;
- próximo a vencer;
- vencido;
- aprobaciones;
- controles;
- excepciones;
- trabajo interno sin Operación.

### Gate

- en menos de 10 segundos se entiende qué requiere atención;
- cada elemento tiene contexto, responsable, vencimiento y acción;
- Inicio resume; Mi trabajo permite operar;
- Inicio y Mi trabajo son destinos principales separados y consecutivos;
- KPI y filtros comparten una fuente de verdad.

---

## Etapa 3 — Listado de Operaciones

### Objetivo

Construir la primera pantalla operativa principal.

### Entregables

- vista completa de Operaciones / Importaciones / Exportaciones filtradas;
- búsqueda;
- filtros combinables;
- período y rango personalizado;
- indicadores clickeables;
- URL state;
- sorting desde headers;
- selección;
- agrupación;
- columnas visibles;
- vistas guardadas cuando se valide;
- paginación;
- totales por moneda;
- estados alternativos;
- mobile resumido/expandible;
- navegación al detalle.

### Gate

- encontrar una Operación es rápido;
- etapa, situaciones y responsable se distinguen;
- no hay columnas cortadas;
- no hay scroll horizontal normal;
- filtros sobreviven recarga y retorno cuando corresponde.

---

## Etapa 4 — Detalle común de Operación

### Objetivo

Definir el objeto central antes de especializar Impo y Expo.

### Entregables

- cabecera estable;
- cliente, tipo, estado general, etapa, responsable y situaciones;
- bloque “qué sigue”;
- resumen;
- seguimiento/hitos;
- documentación;
- controles;
- Administración relacionada;
- actividad;
- acciones contextuales.

### Gate

La pantalla responde rápidamente:

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

Validar inicio de proceso y prevención de errores.

### Flujo

1. origen: directa o desde Cotización;
2. Cliente y tipo;
3. contexto inicial;
4. responsables;
5. requisitos derivados;
6. revisión.

### Gate

- no hay campos innecesarios;
- reutiliza información conocida;
- muestra origen de datos;
- permite volver sin perder;
- detecta inconsistencias obvias;
- mensajes claros y accionables.

---

## Etapa 6 — Clientes

### Objetivo

Definir contexto persistente reutilizable.

### Entregables

- listado;
- detalle;
- datos y contactos;
- Operaciones;
- Cotizaciones;
- actividad;
- configuraciones/requisitos sólo validados.

### Gate

- Cliente es importante sin convertirse en CRM genérico;
- relación completa con ABT comprensible;
- datos económicos respetan sensibilidad.

---

## Etapa 7 — Importación

### Objetivo

Primera vertical operativa completa.

### Cobertura

- inicio y clasificación;
- pre-embarque;
- documentación condicional;
- provisorio;
- doble control;
- arribo/ETA;
- oficialización;
- canal/liberación;
- demoras;
- cierre documental;
- pase a Administración.

### Gate

- acompaña sin rigidizar;
- reglas dependen del contexto;
- doble control es bloqueante y trazable;
- Alpha2000/MARÍA aparece como fuente externa.

---

## Etapa 8 — Exportación y DJVE

### Objetivo

Validar especialización y relaciones complejas.

### Cobertura

- instrucción;
- provisorio/doble control;
- oficialización/legajo;
- carga;
- certificados;
- DJVE;
- permisos/operaciones;
- pase a Facturación;
- cumplido;
- post-embarque;
- custodia documental.

### Gate

- Operación puede estar facturada y seguir activa;
- DJVE no se fuerza como Operación;
- documentación física/digital tiene estado.

---

## Etapa 9 — Cotizaciones

### Objetivo

Construir circuito comercial previo.

### Cobertura

- listado;
- líneas y servicios;
- cálculos;
- condiciones;
- versiones;
- aprobación;
- envío/aceptación;
- conversión a Operación.

### Gate

- cantidad × unitario produce total;
- no se envía sin aprobación;
- versiones se entienden;
- conversión no recarga datos.

---

## Etapa 10 — Administración y Finanzas

### Objetivo

Diseñar pase operativo-administrativo sin duplicar Alpha2000.

### Cobertura

- por revisar;
- con pendientes;
- listas para facturar;
- facturadas;
- diferencias;
- honorarios;
- gastos/anticipos/rendiciones;
- referencias externas;
- necesidades de fondos.

### Gate

- “lista para facturar” es explícita;
- facturar, cobrar y cerrar documentación son distintos;
- datos sensibles protegidos;
- fuente Alpha2000 visible.

---

## Etapa 11 — Gestión y Dirección

### Objetivo

Convertir información en decisiones.

### Cobertura

- resumen ejecutivo;
- operación/productividad;
- clientes/concentración;
- carga de trabajo;
- demoras/vencimientos;
- facturación/cobranzas;
- costos/márgenes;
- períodos;
- reportes definidos.

### Gate

- cada KPI permite drill-down;
- no replica `2025ABT.xlsx`;
- fórmulas/fuentes explícitas;
- permisos en KPI, tabla, gráfico y exportación.

---

## Etapa 12 — Portal de clientes

### Objetivo

Experiencia externa separada sobre el mismo núcleo.

### Primera etapa

- invitación/acceso;
- Inicio del Cliente;
- Operaciones habilitadas;
- detalle externo limitado;
- hitos;
- documentos;
- pendientes;
- ayuda/notificaciones básicas.

### Segunda etapa

- carga documental;
- acciones simples;
- comunicaciones estructuradas;
- preferencias.

### Gate

- no filtra información interna;
- visibilidad explícita;
- estado comprensible para Cliente;
- navegación separada de aplicación interna.

---

## Etapa 13 — Canales asistidos

### Objetivo

Validar consultas y futuras acciones sin depender de proveedor.

### Primera etapa

- sólo lectura;
- operaciones que requieren atención;
- estado;
- documentos faltantes;
- vencimientos;
- indicadores autorizados.

### Requisitos

- misma identidad/permisos;
- servicios del producto;
- fuente y fecha;
- abstención;
- auditoría;
- límites de uso.

### Futuro

- acciones simples;
- confirmación;
- idempotencia;
- escrituras sensibles aprobadas por caso.

## 8. Revisión de cada etapa

### Funcional

- representa trabajo real;
- respeta alcance;
- no introduce reglas silenciosas;
- acciones pertenecen al objeto correcto.

### UX

- propósito claro;
- siguiente paso visible;
- prevención de errores;
- reconocimiento sobre memoria;
- recuperación;
- eficiencia para usuarios frecuentes.

### Visual

- jerarquía;
- densidad;
- alineación;
- consistencia;
- responsive;
- marca;
- ausencia de apariencia genérica.

### Técnica

- límites de componentes;
- TypeScript;
- lint;
- build;
- pruebas;
- consola;
- accesibilidad;
- performance razonable.

## 9. Estado de etapas

| Etapa | Estado |
|---|---|
| 0 — Frontend Foundation | Complete with environment limitation |
| 1 — Application Shell | Complete with environment limitation |
| 2 — Inicio y Mi trabajo | Pendiente |
| 3 — Operaciones listado | Pendiente |
| 4 — Operación detalle | Pendiente |
| 5 — Crear Operación | Pendiente |
| 6 — Clientes | Pendiente |
| 7 — Importación | Pendiente |
| 8 — Exportación/DJVE | Pendiente |
| 9 — Cotizaciones | Pendiente |
| 10 — Administración/Finanzas | Pendiente |
| 11 — Gestión/Dirección | Pendiente |
| 12 — Portal | Pendiente |
| 13 — Canales asistidos | Pendiente |

## 10. Cierre de Etapa 1

La revisión visual humana de **Etapa 1 — Application Shell e infraestructura de
experiencia** fue aprobada el 10/10/2026. El cierre se publica para revisión
de código mediante Pull Request hacia `main`; no se inicia Etapa 2 en este
incremento. Esta aprobación corresponde a la experiencia del Shell y no
resuelve las decisiones funcionales pendientes de ABT para los módulos futuros.

Chromium cubre localmente los recorridos E2E y snapshots selectivos del Shell.
Firefox y WebKit siguen sin una ejecución local concluyente por dependencias
del host; esta limitación del entorno no constituye un fallo comprobado del
producto. La matriz de esos navegadores queda pendiente de un entorno apto.

### Evidencia de cierre de Etapa 0

Chromium pasó localmente y en CI. Firefox y WebKit continúan limitados por
dependencias disponibles en el host; no existe una falla conocida del código
asociada a esos navegadores.
