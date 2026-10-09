# ABT Comex — Especificación funcional de Frontend

> Documento vivo · Última actualización: 08/10/2026
>
> Traduce `docs/product/ALCANCE_FUNCIONAL.md` a arquitectura de información, patrones de interacción, pantallas, estados y criterios de experiencia.

## 1. Propósito

Esta especificación define **cómo se materializa el alcance funcional en la experiencia**.

No reemplaza:

- alcance funcional;
- requerimientos detallados;
- flujos AS IS / TO BE;
- Design System;
- especificaciones por pantalla;
- estrategia de pruebas.

Su función es impedir que cada pantalla se diseñe de forma aislada y asegurar una experiencia clara, premium, consistente, accesible y operativamente eficiente.

## 2. Gobierno y documentos obligatorios

Antes de diseñar o implementar:

1. `docs/product/ALCANCE_FUNCIONAL.md` — qué producto construimos.
2. `docs/frontend/ESPECIFICACION_FUNCIONAL_FRONTEND.md` — cómo se expresa en la experiencia.
3. `docs/frontend/FRONTEND_STANDARD.md` — reglas visuales y de interacción.
4. `docs/frontend/TEST_STRATEGY.md` — evidencia de calidad.
5. `docs/frontend/BRAND_USAGE.md` — uso de marcas.
6. `docs/frontend/CODEX_RUNBOOK.md` — proceso de ejecución.
7. `docs/frontend/PLAN_IMPLEMENTACION.md` — orden y gates.
8. `docs/frontend/DECISIONS.md` — decisiones permanentes.
9. La especificación aplicable en `docs/frontend/screens/`.

`/design-system` es la referencia visual y funcional de patrones reutilizables.

### Regla documental

Una decisión funcional o UX importante no puede quedar sólo en código o chat. Debe actualizar la fuente de verdad correspondiente.

Toda pantalla relevante necesita especificación antes de implementarse.

## 3. Visión de experiencia

ABT Comex debe sentirse como una herramienta empresarial de uso diario:

- clara antes que llamativa;
- potente sin trasladar complejidad;
- densa pero legible;
- orientada a pendientes, excepciones y próximos pasos;
- consistente entre áreas y canales;
- simple para personas nuevas y eficiente para usuarios frecuentes;
- accesible según WCAG 2.2 AA;
- premium por su precisión, no por decoración.

### Pregunta rectora

Toda pantalla debe responder:

> ¿Qué está pasando, qué requiere atención y qué puede hacer la persona ahora?

### Criterio de calidad

La interfaz es la carta de presentación del producto. No se aceptan pantallas “funcionales pero provisorias” que luego requieran rehacer jerarquía, responsive, estados, accesibilidad o consistencia.

## 4. Principios de usabilidad

La experiencia aplica explícitamente las heurísticas de Nielsen.

### 4.1 Visibilidad del estado

- Mostrar carga, progreso, guardado, sincronización y resultado.
- Identificar fuente de datos cuando afecte decisiones.
- Mostrar última actualización cuando corresponda.
- Diferenciar completo, parcial, pendiente, desactualizado o bloqueado.

### 4.2 Correspondencia con el mundo real

- Usar terminología real de ABT.
- No exponer lenguaje técnico de implementación.
- Reflejar procesos reales sin copiar planillas literalmente.

### 4.3 Control y libertad

- Volver o cancelar sin perder datos.
- Guardar borrador cuando corresponda.
- Confirmar sólo acciones de impacto.
- Facilitar correcciones trazables.
- Evitar dialogs o recorridos sin salida clara.

### 4.4 Consistencia y estándares

- Misma acción, mismo comportamiento.
- Mismos estados, filtros y patrones entre módulos.
- No crear un patrón si existe uno equivalente.
- No usar color como única señal.

### 4.5 Prevención de errores

- Calcular antes que pedir.
- Reutilizar antes que recargar.
- Seleccionar antes que escribir libremente.
- Validar relaciones entre datos.
- Advertir antes de bloquear.
- Explicar motivo y resolución del bloqueo.
- Separar error de usuario, integración y permisos.

### 4.6 Reconocimiento antes que memoria

El sistema muestra:

- próximos pasos;
- documentos requeridos;
- responsables;
- controles pendientes;
- reglas aplicables;
- antecedentes reutilizables;
- acciones disponibles.

### 4.7 Flexibilidad y eficiencia

Usuarios frecuentes:

- búsqueda rápida;
- vistas guardadas;
- filtros persistentes;
- acciones masivas;
- navegación por teclado;
- registros recientes;
- reutilización de antecedentes.

Usuarios nuevos:

- creación guiada;
- ayuda contextual;
- defaults seguros;
- mensajes claros;
- revelado progresivo.

### 4.8 Diseño minimalista

Minimalista no significa vacío.

Evitar:

- cards decorativas;
- iconos sin función;
- dashboards artificialmente simétricos;
- datos repetidos;
- secciones sin prioridad;
- todos los campos visibles al mismo tiempo;
- copy de landing dentro del producto.

### 4.9 Recuperación frente a errores

Todo error relevante indica:

1. qué ocurrió;
2. dónde;
3. qué se preservó;
4. cómo continuar;
5. si depende de otra persona, permiso o sistema.

### 4.10 Ayuda y documentación

- Ayuda contextual en la acción correspondiente.
- Guías breves para tareas críticas.
- Conceptos comprensibles sin manual externo.
- Ayuda accesible desde cualquier módulo.
- No usar tours para compensar una interfaz confusa.

## 5. Arquitectura de información

### 5.1 Aplicación interna

```text
Inicio
Operaciones
  Todas
  Importaciones
  Exportaciones
Clientes
Cotizaciones
Mi trabajo
Administración y Finanzas
Gestión
Configuración
```

La navegación es conceptual y se valida con pantallas reales. No agregar módulos principales sin necesidad demostrada.

### 5.2 Experiencias externas

- Portal de clientes: experiencia, identidad y navegación separadas.
- Canales asistidos: consumen servicios autorizados; no son módulo del menú.
- Integraciones: se administran en contextos técnicos o configuración.

### 5.3 Capacidades contextuales

No requieren inicialmente navegación principal:

- Documentos.
- Alertas.
- Aprobaciones.
- Auditoría.
- DJVE.
- Proveedores.
- Reportes.

Aparecen dentro del contexto que les da sentido.

## 6. Application Shell

El shell debe ser estable, reusable y sobrio.

### Desktop y notebook

- sidebar con navegación principal;
- logo ABT;
- estado activo inequívoco;
- header compacto;
- breadcrumb;
- usuario y ayuda;
- contenido con ancho y padding consistentes;
- atribución Broco secundaria.

### Tablet

- navegación adaptada sin comprimir controles críticos;
- acciones principales visibles;
- acciones secundarias agrupadas.

### Mobile

- drawer accesible;
- targets táctiles;
- foco administrado;
- densidad adecuada;
- registros complejos resumidos y expandibles.

### Componentes base

- `AppShell`;
- `AppSidebar`;
- `AppHeader`;
- `Breadcrumbs`;
- `PageHeader`;
- `GlobalSearch` acotada;
- `UserMenu`;
- `HelpEntryPoint`;
- `BrandAttribution`;
- `NotificationEntryPoint` cuando exista alcance.

`/design-system` permanece fuera del shell.

## 7. Patrones de pantalla

### 7.1 Inicio — cockpit personal

Responde: **¿qué necesita atención ahora?**

Contenido potencial según permisos:

- operaciones que requieren atención;
- vencimientos;
- controles y aprobaciones;
- elementos de Mi trabajo;
- actividad relevante;
- alertas críticas;
- indicadores accionables.

Reglas:

- no es dashboard decorativo;
- cada indicador lleva a registros concretos;
- no expone información económica sin permiso;
- prioriza excepción y acción.

### 7.2 Mi trabajo — bandeja de ejecución

Responde: **¿qué debo hacer, revisar o aprobar?**

Vistas:

- asignado a mí;
- mi equipo;
- próximo a vencer;
- vencido;
- aprobaciones;
- controles;
- excepciones;
- trabajo interno sin Operación.

Cada elemento muestra:

- acción;
- contexto;
- responsable;
- prioridad;
- vencimiento;
- estado;
- origen;
- acción principal.

### 7.3 Listado operativo

Aplica a Operaciones, Clientes, Cotizaciones y colas administrativas.

Incluye cuando corresponde:

- búsqueda;
- filtros;
- período y rango;
- KPI clickeables;
- ordenamiento en headers;
- selección;
- agrupación;
- columnas;
- vistas guardadas;
- paginación;
- totales por moneda;
- estados alternativos;
- URL state.

Usar `DataTable`. El scroll horizontal no es solución principal.

### 7.4 Página de objeto

Aplica a Operación, Cliente, Cotización y Trámite.

```text
Cabecera estable
  identidad · estados · situaciones · responsable · acciones

Resumen y próximo paso

Secciones
  información general
  seguimiento
  documentación
  controles
  administración
  actividad
  bloques específicos
```

Reglas:

- explica rápidamente qué objeto es;
- muestra siguiente paso y bloqueos;
- evita una sucesión infinita de cards;
- revela según contexto y permisos;
- edición y lectura mantienen estructura reconocible.

### 7.5 Creación guiada

Usar cuando existen decisiones condicionales.

Creación de Operación:

1. origen;
2. Cliente y tipo;
3. contexto inicial;
4. responsabilidad;
5. requisitos derivados;
6. revisión.

Reglas:

- sólo pasos necesarios;
- volver sin perder;
- borrador si se valida;
- resumen antes de confirmar;
- mostrar origen de datos reutilizados.

### 7.6 Cola administrativa

Responde: **¿qué debo revisar o procesar?**

- por revisar;
- con pendientes;
- lista para facturar;
- facturada;
- con diferencias.

Debe distinguir facturación, cobranza y cierre documental.

### 7.7 Gestión y Dirección

Responde: **¿qué ocurre en el negocio y qué datos lo explican?**

- resumen ejecutivo;
- KPI accionables;
- comparación de períodos;
- filtros coherentes;
- gráficos con registros explicativos;
- drill-down;
- exportación controlada;
- permisos sensibles.

No construir un generador universal de reportes en esta etapa.

### 7.8 Configuración

Distinguir:

- general;
- catálogos;
- reglas;
- documentos requeridos;
- permisos;
- integraciones;
- parámetros por cliente.

No mezclar configuración técnica con operación diaria.

## 8. Onboarding, inducción y ayuda continua

Forma parte de la arquitectura desde el inicio.

### Principios

- Derivar capacidades desde permisos.
- No bloquear con tours largos.
- Permitir omitir, retomar y reiniciar.
- Ayuda en momento y lugar relevantes.
- No explicar lo que la interfaz debe hacer evidente.

### Primer acceso

- bienvenida breve;
- capacidades disponibles;
- orientación a Inicio y Mi trabajo;
- preferencias de notificación cuando existan;
- checklist inicial.

### Checklists por capacidad

Operaciones:

1. revisar asignadas;
2. abrir Operación;
3. identificar etapa, pendientes e hito;
4. completar tarea/control;
5. revisar documentación.

Administración:

1. revisar listas para facturar;
2. detectar pendientes;
3. consultar gastos/rendiciones;
4. ver referencias Alpha2000.

Dirección:

1. revisar alertas;
2. abrir resumen;
3. bajar de KPI a registros;
4. resolver aprobación.

### Guías críticas futuras

- crear Operación directa;
- crear desde Cotización;
- segundo control;
- documentación faltante;
- reasignar responsable;
- lista para facturar;
- aprobar Cotización;
- excepción autorizada.

Las guías se implementan cuando el flujo está estable.

## 9. Estados transversales

Diseñar cuando correspondan:

- loading;
- loaded;
- empty;
- filtered-empty;
- error recuperable;
- error no recuperable;
- sin permiso;
- información parcial;
- integración desactualizada;
- sólo lectura;
- disabled;
- acción bloqueada;
- borrador;
- guardando;
- guardado;
- conflicto;
- conectividad degradada.

## 10. Permisos y sensibilidad

El frontend representa autorización; no la decide.

Debe:

- ocultar o deshabilitar según criterio;
- explicar indisponibilidad;
- no revelar datos sensibles en KPI, búsqueda, exportación, tooltip, actividad o error;
- aplicar misma política en aplicación interna, Portal y canales asistidos;
- no inferir perfiles definitivos.

## 11. Integraciones y frescura

Cuando existe información externa mostrar, si aporta valor:

- sistema de origen;
- última actualización;
- sincronización;
- dato parcial;
- error;
- acción: reintentar, ver detalle o informar.

No mezclar silenciosamente datos locales y externos.

## 12. Responsive y accesibilidad

Aplican `FRONTEND_STANDARD.md` y WCAG 2.2 AA.

Viewports mínimos:

- 1440;
- 1280;
- 1024;
- 768;
- 390.

La revisión visual humana es obligatoria. `agent-browser` sólo por pedido explícito.

## 13. Branding

Aplicar `BRAND_USAGE.md`.

- ABT es marca principal.
- Broco es atribución secundaria.
- `BrandAttribution` vive en sidebar/drawer/footer según superficie.
- No repetir logos dentro de contenido.
- No usar assets no oficiales.

## 14. Arquitectura de features y datos mock

```text
apps/web/features/<feature>
├── components
├── data
├── types
├── tests
└── index.ts cuando aporte valor
```

```text
UI
↓
source/adapter simple
↓
fixtures determinísticos
```

No crear API ficticia, repositorios genéricos ni contratos compartidos prematuros.

## 15. Inventario inicial de pantallas

Fundamentos:

- Application Shell;
- Inicio;
- Mi trabajo;
- búsqueda inicial;
- onboarding/ayuda.

Operaciones:

- listado;
- Impo/Expo filtradas;
- detalle común;
- creación;
- bloques Impo;
- bloques Expo;
- controles/documentos/actividad/Administración.

Clientes:

- listado;
- detalle;
- contactos;
- Operaciones/Cotizaciones;
- configuraciones validadas.

Cotizaciones:

- listado;
- detalle/versiones;
- creación/edición;
- aprobación;
- conversión.

Administración y Finanzas:

- cola;
- pendientes/diferencias;
- lista para facturar;
- referencias externas;
- gastos/anticipos/rendiciones.

Gestión:

- resumen;
- operación/productividad;
- clientes;
- carga;
- información económica autorizada;
- reportes definidos.

Portal:

- invitación/acceso;
- Inicio Cliente;
- Operaciones habilitadas;
- detalle externo;
- documentos/pendientes;
- notificaciones/ayuda.

## 16. Especificación por pantalla

Toda pantalla usa `docs/frontend/screens/SCREEN_TEMPLATE.md`.

Debe definir:

- objetivo;
- trabajo principal;
- capacidades;
- información primaria/secundaria;
- acciones;
- reglas;
- estados;
- permisos;
- errores;
- ayuda;
- responsive;
- fuentes;
- pruebas;
- fuera de alcance;
- pendientes.

## 17. Calidad y pruebas

Aplicar `TEST_STRATEGY.md`.

Cada pantalla debe tener el nivel de evidencia correspondiente a su riesgo:

- lógica unitaria;
- interacción de componentes;
- integración de pantalla;
- E2E crítico;
- accesibilidad;
- responsive;
- revisión visual.

No considerar terminada una feature crítica sin pruebas porque use fixtures.

## 18. Criterios de aceptación UX

Una pantalla no está lista si no cumple:

- propósito entendible;
- próximo paso visible;
- terminología ABT;
- jerarquía clara;
- consistencia;
- prevención de errores;
- estados alternativos;
- permisos;
- responsive;
- teclado/foco;
- mensajes accionables;
- Design System;
- marca correcta;
- pruebas requeridas;
- sin apariencia genérica.

## 19. Decisiones pendientes

- identificador visible de Operación;
- etapas y condiciones de avance;
- datos mínimos de creación;
- información reutilizable del Cliente;
- cardinalidad Cotización → Operación;
- perfiles/permisos;
- campos/documentos visibles al Cliente;
- contenido inicial de onboarding;
- búsqueda global;
- notificaciones;
- casos iniciales de canales asistidos.

## 20. Próximo corte de diseño

El primer corte funcional de producto, después de Frontend Foundation, incluye:

1. Application Shell.
2. Base de onboarding/ayuda.
3. Inicio.
4. Mi trabajo.
5. Listado de Operaciones.
6. Detalle común.
7. Creación guiada.
8. Primera vertical de Importación.

Cada punto se implementa y aprueba por etapa; no en un único lote.