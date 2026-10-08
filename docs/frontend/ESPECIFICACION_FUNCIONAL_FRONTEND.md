# ABT Comex — Especificación funcional de Frontend

> Documento vivo · Última actualización: 08/10/2026
>
> Este documento traduce `docs/product/ALCANCE_FUNCIONAL.md` a arquitectura de información, patrones de interacción, pantallas, estados y criterios de experiencia.

## 1. Propósito

Esta especificación define **cómo se materializa el alcance funcional en la aplicación**.

No reemplaza:

- el alcance funcional;
- los requerimientos detallados;
- los flujos AS IS / TO BE;
- el design system y sus estándares visuales.

Su función es evitar que cada pantalla se diseñe de forma aislada y asegurar una experiencia consistente, clara, accesible y operativamente eficiente.

## 2. Documentos obligatorios

Antes de diseñar o implementar una pantalla, leer:

1. `docs/product/ALCANCE_FUNCIONAL.md` — qué producto construimos.
2. `docs/frontend/ESPECIFICACION_FUNCIONAL_FRONTEND.md` — cómo se expresa en la experiencia.
3. `docs/frontend/FRONTEND_STANDARD.md` — reglas visuales, responsive, formularios y tablas.
4. `docs/frontend/DECISIONS.md` — decisiones ya tomadas.
5. `docs/frontend/PLAN_IMPLEMENTACION.md` — orden y gates de ejecución.

La ruta interna `/design-system` es la referencia visual y funcional de patrones reutilizables.

## 3. Visión de experiencia

ABT Comex debe sentirse como una herramienta empresarial de uso diario:

- clara antes que llamativa;
- potente sin trasladar complejidad al usuario;
- densa pero legible;
- orientada a pendientes, excepciones y próximos pasos;
- consistente entre áreas y canales;
- usable por personas nuevas y eficiente para usuarios frecuentes;
- preparada para desktop, notebook, tablet y mobile;
- accesible según WCAG 2.2 AA.

### Pregunta rectora

Toda pantalla debe responder con claridad:

> ¿Qué está pasando, qué requiere atención y qué puede hacer la persona ahora?

## 4. Principios de usabilidad

La experiencia debe aplicar de forma explícita las heurísticas de Nielsen.

### 4.1 Visibilidad del estado del sistema

- Mostrar guardado, sincronización, carga, progreso y resultado.
- Indicar si un dato proviene de ABT, Alpha2000 u otra fuente.
- Mostrar fecha de última actualización cuando sea relevante.
- Diferenciar información completa, parcial, pendiente o desactualizada.

### 4.2 Correspondencia con el mundo real

- Usar terminología real de ABT: Operación, provisorio, oficialización, cumplido, carpeta, lista para facturar, segundo control.
- No exponer términos técnicos de implementación.
- Reflejar el proceso real sin copiar literalmente planillas actuales.

### 4.3 Control y libertad

- Permitir cancelar o volver atrás sin perder datos.
- Guardar borrador cuando corresponda.
- Pedir confirmación sólo para acciones de impacto.
- Facilitar correcciones trazables y deshacer cuando sea viable.
- Evitar dialogs sin salida clara o flujos que atrapen al usuario.

### 4.4 Consistencia y estándares

- Mismas acciones, estados, filtros y componentes se comportan igual en todos los módulos.
- El estado no se comunica sólo con color.
- No crear un patrón nuevo si existe uno equivalente en el design system.

### 4.5 Prevención de errores

- Calcular antes que pedir.
- Reutilizar antes que recargar.
- Seleccionar antes que escribir libremente.
- Validar relaciones entre datos.
- Advertir antes de bloquear.
- Explicar el motivo de cada bloqueo y cómo resolverlo.
- Separar errores del usuario, errores de integración y falta de permisos.

### 4.6 Reconocimiento antes que memoria

El sistema debe mostrar:

- próximos pasos;
- documentos requeridos;
- responsables;
- controles pendientes;
- reglas aplicables;
- antecedentes reutilizables;
- acciones disponibles.

La persona no debería recordar requisitos que el sistema ya conoce.

### 4.7 Flexibilidad y eficiencia

Para usuarios frecuentes:

- búsqueda rápida;
- vistas guardadas;
- filtros persistentes cuando tenga sentido;
- acciones masivas;
- reutilización de antecedentes;
- navegación por teclado;
- accesos a registros recientes.

Para usuarios nuevos:

- creación guiada;
- ayuda contextual;
- defaults seguros;
- mensajes claros;
- revelado progresivo.

### 4.8 Diseño minimalista

Minimalista no significa vacío. Mostrar la información necesaria para decidir y actuar, evitando:

- cards decorativas;
- iconos sin función;
- simetría artificial de dashboard;
- datos repetidos;
- secciones sin prioridad;
- formularios con todos los campos posibles visibles al mismo tiempo.

### 4.9 Recuperación frente a errores

Todo error debe indicar:

1. qué ocurrió;
2. dónde ocurrió;
3. qué se preservó;
4. cómo continuar o corregirlo;
5. si requiere intervención de otra persona o sistema.

### 4.10 Ayuda y documentación

- Ayuda contextual en la pantalla y acción correspondiente.
- Guías breves para tareas críticas.
- Estados y conceptos explicables sin abrir un manual externo.
- Ayuda buscable y accesible desde cualquier módulo.

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

Esta navegación es conceptual y se validará con pantallas reales. No agregar módulos principales sin necesidad demostrada.

### 5.2 Experiencias externas

- **Portal de clientes:** experiencia y autenticación separadas.
- **Canales asistidos:** no son un módulo del menú; consumen servicios autorizados.
- **Integraciones:** se administran desde configuración o herramientas técnicas específicas.

### 5.3 Capacidades contextuales

No requieren inicialmente una sección principal:

- Documentos.
- Alertas.
- Aprobaciones.
- Auditoría.
- DJVE.
- Proveedores.
- Reportes.

Aparecen dentro del contexto que les da sentido y pueden elevarse posteriormente sin cambiar el modelo.

## 6. Application Shell

El shell debe ser reusable, sobrio y estable.

### Desktop y notebook

- Sidebar con navegación principal.
- Logo oficial ABT.
- Estado activo inequívoco.
- Posibilidad de colapsar sólo si aporta espacio real.
- Header compacto con breadcrumb, contexto y usuario.
- Área de contenido con ancho y padding consistentes.

### Tablet

- Navegación adaptada sin comprimir controles críticos.
- Sidebar reducido o drawer según ancho.
- Acciones importantes visibles y secundarias agrupadas.

### Mobile

- Drawer accesible.
- Navegación simple y targets táctiles adecuados.
- Sin intentar reproducir la densidad desktop.
- Registros complejos resumidos con detalle expandible.

### Componentes del shell

- `AppShell`
- `AppSidebar`
- `AppHeader`
- `Breadcrumbs`
- `PageHeader`
- `GlobalSearch` — inicialmente acotada y ampliable.
- `UserMenu`
- `HelpEntryPoint`
- `NotificationEntryPoint` — cuando tenga alcance definido.

`/design-system` permanece fuera del shell de producto.

## 7. Patrones de pantalla

### 7.1 Inicio — cockpit personal

Objetivo: responder **qué necesita atención ahora**.

Contenido potencial, según permisos:

- operaciones que requieren atención;
- próximos vencimientos;
- controles y aprobaciones pendientes;
- elementos de Mi trabajo;
- operaciones recientes;
- alertas críticas;
- indicadores breves y accionables.

Reglas:

- No es un dashboard decorativo.
- Cada indicador lleva a los registros concretos.
- No mostrar información económica sin permiso.
- Priorizar excepción y acción sobre volumen general.

### 7.2 Mi trabajo — bandeja de ejecución

Objetivo: reunir acciones concretas asignadas a una persona o equipo.

Vistas iniciales:

- asignado a mí;
- asignado a mi equipo;
- próximo a vencer;
- vencido;
- aprobaciones;
- controles;
- excepciones;
- trabajo interno sin Operación.

Cada elemento muestra como mínimo:

- qué hay que hacer;
- contexto;
- responsable;
- prioridad;
- vencimiento;
- estado;
- origen;
- acción principal.

### 7.3 Listado operativo

Aplicable a Operaciones, Clientes, Cotizaciones y colas administrativas.

Incluye cuando corresponda:

- búsqueda;
- filtros combinables;
- período y rango personalizado;
- indicadores clickeables;
- ordenamiento desde headers;
- selección y acciones masivas;
- agrupación;
- columnas visibles;
- vistas guardadas;
- paginación;
- totales y subtotales por moneda;
- estados loading, empty, filtered-empty y error.

Usar `DataTable` y su política de anchos. No usar scroll horizontal como solución principal.

### 7.4 Detalle de objeto

Aplicable a Operación, Cliente, Cotización y Trámite.

Estructura:

```text
Cabecera estable
  identidad · estado · situaciones · responsable · acciones

Resumen / siguiente paso

Navegación por secciones
  información general
  seguimiento
  documentación
  controles
  administración
  actividad
  bloques específicos del objeto
```

Reglas:

- La cabecera debe explicar rápidamente de qué objeto se trata.
- El próximo paso y bloqueos deben ser visibles.
- Evitar una sucesión extensa de cards equivalentes.
- Revelar información según contexto y permisos.
- Visualización y edición deben mantener estructura reconocible.

### 7.5 Creación guiada

Usar cuando la tarea tenga decisiones condicionales o múltiples caminos.

Creación inicial de Operación:

1. Origen: directa o desde Cotización.
2. Cliente y tipo: Importación o Exportación.
3. Contexto inicial: modalidad, mercadería, origen/destino y datos disponibles.
4. Responsabilidad: responsable principal y participantes.
5. Requisitos derivados: documentos, campos y controles.
6. Revisión: inconsistencias, faltantes y confirmación.

Reglas:

- Mostrar sólo pasos necesarios.
- Permitir volver sin perder datos.
- Permitir guardar borrador si el proceso lo requiere.
- Resumir qué se creará antes de confirmar.
- Si nace de una Cotización, reutilizar datos y mostrar su origen.

### 7.6 Gestión y Dirección

Objetivo: convertir información operativa y administrativa en decisiones.

Patrones:

- resumen ejecutivo;
- indicadores accionables;
- comparación de períodos;
- filtros globales coherentes;
- gráficos con tabla o registros explicativos;
- drill-down hasta el dato de origen;
- exportación controlada;
- permisos sensibles aplicados en todos los niveles.

No construir un generador universal de reportes en esta etapa.

### 7.7 Configuración

Debe distinguir:

- configuración general;
- catálogos;
- reglas;
- documentos requeridos;
- permisos;
- integraciones;
- parámetros por cliente.

Evitar mezclar configuración técnica con tareas operativas diarias.

## 8. Onboarding, inducción y ayuda continua

La inducción forma parte de la arquitectura de experiencia desde el inicio. No se agrega al final como un tour superficial.

### 8.1 Principios

- Derivar capacidades desde permisos; no pedir a la persona que elija su rol.
- No bloquear el acceso con un recorrido largo.
- Permitir omitir, retomar y reiniciar guías.
- Mostrar ayuda en el momento y lugar donde se necesita.
- No explicar con un tour lo que la interfaz debería hacer evidente.

### 8.2 Primer acceso

- Bienvenida breve.
- Qué puede hacer la persona según sus permisos.
- Orientación a Inicio y Mi trabajo.
- Preferencias iniciales de notificación cuando existan.
- Checklist de primeras acciones.

### 8.3 Checklists por capacidad

Ejemplo Operaciones:

1. Revisar operaciones asignadas.
2. Abrir una Operación.
3. Identificar etapa, pendientes y próximo hito.
4. Completar una tarea o control.
5. Revisar documentación.

Ejemplo Administración:

1. Revisar operaciones listas para facturar.
2. Detectar carpetas con pendientes.
3. Consultar gastos y rendiciones.
4. Ver referencias integradas de Alpha2000.

Ejemplo Dirección:

1. Revisar alertas críticas.
2. Abrir el resumen ejecutivo.
3. Bajar de un indicador a los registros.
4. Resolver una aprobación pendiente.

### 8.4 Guías de tareas críticas

Preparar soporte para guías sobre:

- crear Operación directa;
- crear desde Cotización;
- hacer segundo control;
- resolver documentación pendiente;
- reasignar responsable;
- marcar lista para facturar;
- aprobar Cotización;
- registrar excepción autorizada.

Las guías se implementan cuando el flujo está estable.

### 8.5 Portal

El onboarding externo incluye:

- invitación y verificación;
- explicación del alcance del acceso;
- operaciones habilitadas;
- documentos compartidos;
- carga documental;
- notificaciones;
- soporte y contacto.

## 9. Estados transversales

Diseñar explícitamente cuando correspondan:

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
- conflicto de actualización;
- offline o conectividad degradada cuando sea relevante.

## 10. Permisos y visibilidad

El frontend no decide autorización; representa lo autorizado por los servicios.

Debe:

- ocultar o deshabilitar según el caso;
- explicar por qué una acción no está disponible;
- evitar revelar datos sensibles en KPIs, búsquedas, exportaciones, tooltips, activity feeds o errores;
- distinguir “no existe” de “no tiene permiso” sólo cuando la política de seguridad lo permita;
- aplicar la misma política en aplicación interna y Portal.

No inferir perfiles definitivos hasta que ABT los valide.

## 11. Integraciones y frescura del dato

Cuando una pantalla muestre información externa debe poder expresar:

- sistema de origen;
- última actualización;
- estado de sincronización;
- dato pendiente o parcial;
- error de integración;
- acción disponible: reintentar, consultar detalle o informar a soporte.

No mezclar silenciosamente datos locales y externos sin identificar la fuente cuando pueda afectar decisiones.

## 12. Responsive y accesibilidad

Aplican íntegramente `FRONTEND_STANDARD.md` y WCAG 2.2 AA.

Validar conceptualmente:

- desktop amplio;
- notebook;
- tablet;
- mobile de referencia de 390 px.

La revisión visual humana es obligatoria. `agent-browser` se utiliza sólo cuando se solicite explícitamente o el riesgo justifique su costo.

## 13. Inventario inicial de pantallas

### Fundamentos

- Application Shell.
- Inicio.
- Mi trabajo.
- Búsqueda global inicial.
- Infraestructura de onboarding y ayuda.

### Operaciones

- Listado de todas las operaciones.
- Vistas filtradas de Importaciones y Exportaciones.
- Detalle común de Operación.
- Crear Operación.
- Bloques específicos de Importación.
- Bloques específicos de Exportación.
- Controles, documentos, actividad y Administración dentro de la Operación.

### Clientes

- Listado.
- Detalle.
- Operaciones y Cotizaciones relacionadas.
- Contactos y datos básicos.
- Configuraciones y requisitos habituales cuando sean validados.

### Cotizaciones

- Listado.
- Detalle y versiones.
- Creación/edición.
- Aprobación.
- Conversión a Operación.

### Administración y Finanzas

- Cola de operaciones por revisar.
- Pendientes y diferencias.
- Listas para facturar.
- Referencias de facturación y cobranza.
- Gastos, anticipos y rendiciones.

### Gestión

- Resumen ejecutivo.
- Operación y productividad.
- Clientes.
- Carga de trabajo.
- Información económica autorizada.
- Reportes definidos.

### Portal

- Invitación y acceso.
- Inicio del cliente.
- Operaciones habilitadas.
- Detalle externo de Operación.
- Documentos y pendientes.
- Notificaciones y ayuda.

## 14. Ficha de especificación por pantalla

Toda nueva pantalla debe documentarse con este formato:

```text
Vista
Objetivo
Trabajo principal del usuario
Usuarios/capacidades
Información primaria
Información secundaria
Acciones principales
Acciones secundarias
Reglas y validaciones
Estados
Permisos y sensibilidad
Errores y recuperación
Ayuda / onboarding
Responsive
Relaciones con otras vistas
Fuente de datos e integraciones
Pendientes
```

## 15. Criterios de aceptación UX

Una pantalla no está lista para validación si no cumple:

- propósito entendible;
- próximo paso visible;
- terminología de ABT;
- jerarquía clara;
- prevención de errores relevante;
- estados alternativos;
- permisos contemplados;
- responsive;
- teclado y focus visible;
- mensajes accionables;
- reutilización del design system;
- sin apariencia genérica de dashboard o demo.

## 16. Decisiones pendientes

- Identificador visible de Operación.
- Catálogo de etapas y condiciones de avance.
- Datos mínimos de creación.
- Información básica reutilizable del Cliente.
- Cardinalidad Cotización → Operación.
- Perfiles y permisos definitivos.
- Campos y documentos visibles al cliente.
- Contenido inicial de onboarding por capacidad.
- Alcance inicial de búsqueda global.
- Notificaciones y canales prioritarios.
- Casos de uso iniciales de canales asistidos.

## 17. Próximo corte de diseño

El primer corte coherente de producto debe incluir:

1. Application Shell.
2. Infraestructura básica de onboarding y ayuda.
3. Inicio.
4. Mi trabajo.
5. Listado de Operaciones.
6. Detalle común de Operación.
7. Creación guiada de Operación.
8. Primera vertical de Importación.

Este corte permitirá validar navegación, relación Cliente–Operación, responsables, estados, documentación, reglas, controles, excepciones, accesibilidad y responsive antes de profundizar otros módulos.
