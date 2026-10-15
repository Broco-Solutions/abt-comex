# Inicio + Mi trabajo

> Estado: Under review
>
> Etapa: 2 — Inicio y Mi trabajo
>
> Última actualización: 14/10/2026
>
> Owner funcional: pendiente de validación con ABT
>
> Rutas aprobadas: `/inicio` y `/mi-trabajo`

## 1. Objetivo

Definir dos experiencias conectadas sobre la misma fuente conceptual de trabajo:

- **Inicio** permite comprender qué está pasando, qué requiere atención y cuál es la situación operativa autorizada.
- **Mi trabajo** permite encontrar y ejecutar acciones, tareas, revisiones, aprobaciones, controles, excepciones y vencimientos, incluso cuando todavía no existe una operación.

Inicio resume y deriva. Mi trabajo permite operar. Ninguna experiencia debe duplicar estados, reglas, conteos ni acciones que pertenezcan al objeto de origen.

## 2. Trabajo principal de la persona

### Inicio

> Cuando entro a ABT Comex necesito reconocer rápidamente qué merece mi atención y abrir el registro concreto que lo explica.

### Mi trabajo

> Cuando entro a Mi trabajo necesito priorizar pendientes y actuar sobre cada caso con contexto, motivo, responsabilidad, vencimiento y próxima acción.

## 3. Evidencia y alcance de origen

- Alcance funcional: `ALCANCE_FUNCIONAL.md` §§2, 4, 7, 9 y 10.
- UX transversal: [Frontend Standard](../FRONTEND_STANDARD.md); arquitectura de experiencia: [mapa](../MAPA_PANTALLAS_Y_RECORRIDOS.md).
- Plan: `PLAN_IMPLEMENTACION.md`, Etapa 2.
- Matriz: `MATRIZ_COBERTURA_FUNCIONAL.md`, `COV-003`, `COV-004`, `COV-007`, `COV-008`, `OPE-002`, `OPE-005`, `OPE-006` y `WRK-001` a `WRK-005`.
- Mapa: `MAPA_PANTALLAS_Y_RECORRIDOS.md`, `HOME-01`, `WORK-01`, `ALT-01` y recorridos J1, J6 y J10.
- Requerimientos consolidados: Dirección, Operaciones, Administración, alertas, asignaciones, trabajo sin operación, fuentes y auditoría.
- Relevamiento de áreas: respuestas de Dirección, Importación, Exportación y Administración; consolidación del relevamiento presencial con Sergio, María y Ramiro; diagnóstico de 11 operadores.
- Miro AS IS / TO BE: contraste parcial por Codex el 14/10/2026, con límites y marcos en [E7 de la matriz](../MATRIZ_COBERTURA_FUNCIONAL.md#e7--contraste-de-marcos-originales-de-miro). La lectura previa por otra sesión no se atribuye a Codex; TO BE no equivale a aprobación formal.

La documentación define las necesidades generales, pero no un catálogo definitivo de tareas, prioridades, perfiles o severidades.

## 4. Usuarios y capacidades

### Capacidades necesarias

La especificación usa capacidades mock descriptivas, sin convertirlas en perfiles definitivos:

- ver resumen operativo autorizado;
- ver trabajo propio;
- ver trabajo compartido o de equipo, si se autoriza;
- abrir el objeto de origen;
- ejecutar la acción disponible en el objeto;
- completar una revisión o control;
- aprobar o rechazar cuando la capacidad exista;
- reasignar, sólo si se autoriza;
- ver información administrativa o económica, sólo cuando corresponda;
- ver fuente, frescura y estado de integración.

### Información sensible

Aplicar las seis categorías de la [política económica del alcance §7.2](../../product/ALCANCE_FUNCIONAL.md#72-permisos-y-visibilidad), decisión interna, no matriz definitiva ABT. Ser responsable de una operación o jefe de área no concede honorarios. Los valores aduaneros/tributos necesarios sólo se presentan con capacidad específica; no se confunden con precios comerciales.

- honorarios, precios, facturación, cobranzas, costos, márgenes, bancos y datos personales no se muestran por defecto;
- si la capacidad no permite conocer ni siquiera la existencia del elemento, omitirlo junto con sus conteos; sólo mostrar una explicación genérica de acceso donde esté permitida, sin confirmar trabajo restringido;
- los conteos tampoco deben permitir inferir información no autorizada;
- tooltips, estados vacíos, errores y exportaciones respetan las mismas capacidades;
- los fixtures no usan importes, clientes, personas ni identificadores reales;
- los fixtures y ejemplos visibles sólo usan fuentes previstas por [alcance §8](../../product/ALCANCE_FUNCIONAL.md#8-sistemas-externos-y-fuentes-de-verdad); las herramientas excluidas no son fuentes, destinos ni indicadores de conexión.

## 5. Contexto de navegación

### Inicio

- Entrada: redirección de `/`, navegación principal, ayuda retomada y enlaces internos.
- Salidas: `/mi-trabajo` con filtros coherentes; operación, cliente, cotización, trámite u objeto de origen; módulo correspondiente.
- Breadcrumb: no agrega jerarquía artificial; `Inicio` es destino raíz.
- Estado en URL: período o filtros sólo si cambian el conjunto mostrado y permiten retorno compartible.
- Contexto al volver: período, filtro aplicado, posición razonable y foco en el disparador.

### Mi trabajo

- Entrada: navegación principal, “Ver todo” o resumen de Inicio, enlaces de alertas y retorno desde un objeto.
- Salidas: objeto de origen o acción contextual; Inicio conserva un acceso separado.
- Breadcrumb: `Mi trabajo` como destino principal, no hijo de Inicio.
- Estado en URL: búsqueda, vista, agrupación, filtros, orden y página cuando aporten retorno o enlace.
- Contexto al volver: filtros, orden, agrupación, página, elemento contextual y foco del disparador.

Las rutas `/inicio` y `/mi-trabajo` fueron aprobadas en Etapa 1. Esta especificación no crea rutas nuevas. Las salidas profundas anteriores describen el objetivo del producto; el primer corte usa este contrato temporal.

### Navegación temporal del corte (propuesta para revisión)

| Origen/destino                                                                | Comportamiento en Etapa 2                                                                                                                                                                                                 | Evolución                                                                                        |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Resumen de Inicio                                                             | Abrir Mi trabajo con filtro equivalente; un caso concreto selecciona/expande su contexto en la bandeja.                                                                                                                   | Mantener coherencia de conteos y retorno.                                                        |
| Operación con destino útil existente                                          | Abre `/operaciones/[operationId]` y conserva búsqueda/vista/contexto. La tarea de doble control de Importación abre directamente el workspace específico, que permite volver primero a la operación y luego al pendiente. | Acciones de otros procesos sólo al existir un destino útil; la oficialización permanece externa. |
| Cliente, cotización, DJVE/permiso o Administración sin detalle útil existente | Acción “Ver contexto”: expansión del elemento en Mi trabajo con referencia ficticia, motivo, responsable conocido, fecha/fuente, bloqueo y próxima acción descrita.                                                       | “Abrir objeto” sólo cuando exista una ruta útil que resuelva ese objeto.                         |
| Tarea sin operación                                                           | Mismo contexto local, con origen explícito; no exige referencia operativa ni crea operación artificial.                                                                                                                   | Vinculación posterior sólo con regla validada.                                                   |
| Acción profunda futura                                                        | Texto visible “Disponible en una etapa posterior” y límite concreto; no mostrar botón que aparente aprobar, oficializar, resolver, reasignar o guardar.                                                                   | Sustituir por acción real en la etapa del objeto, tras definir capacidad/regla.                  |
| Destino existente pero sólo placeholder del Shell                             | Puede servir como acceso al módulo, claramente rotulado; no satisface “Abrir objeto” ni se presenta como ficha del registro.                                                                                              | Reemplazar al existir contenido útil.                                                            |
| Referencia ausente, eliminada o restringida                                   | Conservar bandeja/filtros; explicar contexto no disponible sin filtrar datos protegidos.                                                                                                                                  | No fabricar URL, ID o detalles.                                                                  |

En la primera pasada integral, al existir detalles útiles en Etapas 4, 5, 6, 7 y 9, actualizar las salidas y probar navegación de punta a punta; no conservar el fallback temporal como sustituto del objeto ya implementado. La tarea IMP-004 abre el workspace `/operaciones/[operationId]/importacion`; completar el control sólo cambia el escenario local y no habilita oficialización. La activación depende del destino real y autorizado, no sólo de marcar una etapa terminada.

La expansión reutiliza el patrón de registro expandible de DataTable; no incorpora una ficha completa ni un panel permanente. Justificación: permite comprender qué origina el pendiente sin anticipar las Etapas 4, 8 o 9. Enlaces/botones visibles deben producir navegación o feedback útil; nunca href vacío, 404 o acción inerte.

Búsqueda, filtros, orden y página relevantes viven en URL. La selección contextual usa un identificador **ficticio de trabajo** (parámetro `trabajo`); recargar o volver conserva el elemento si existe. Abrir una operación relacionada navega al detalle existente con retorno a Mi trabajo; otros objetos sin destino útil mantienen su contexto local. Si la referencia no existe, conserva filtros y muestra recuperación. La selección masiva no forma parte de este corte.

## 6. Información primaria

### Inicio: resumen y atención

1. **Requiere atención:** conjunto breve de casos accionables ordenado por impacto temporal u operativo, sin afirmar una fórmula de prioridad definitiva.
2. **Situación operativa:** contexto de los casos presentes en la colección de trabajo autorizada, con acceso al conjunto filtrado. No rotular sus conteos como total de operaciones de ABT; esa fuente completa corresponde a etapas posteriores.
3. **Próximos vencimientos:** fechas cercanas, objeto, responsable conocido y próxima acción.
4. **Controles, revisiones y aprobaciones:** cantidad y casos relevantes, distinguiendo controles bloqueantes de otras revisiones.
5. **Actividad relevante:** cambios recientes que modifican responsabilidad, vencimiento, bloqueo o siguiente paso.
6. **Fuente y frescura:** visibles cuando un resumen depende de Alpha2000 u otra fuente prevista y autorizada; si hay intermediario, distinguirlo del origen del dato. No mostrar conexión real en fixtures.

Los resúmenes se presentan como información accionable. No se agregan KPI, cards o gráficos sin una decisión o recorrido asociado.

Prioridad visible del mock: orden explícito y determinístico de escenarios, acompañado del motivo de atención (vencimiento, control pendiente, excepción). No calcular puntajes, SLA ni severidad ABT. La condición “próximo” se configura explícitamente en fixtures, sin inventar una ventana temporal de negocio. Ausencia de responsable o fecha se muestra como tal; nunca se completa por inferencia.

### Mi trabajo: ejecución

Cada elemento muestra, cuando exista:

- tipo: acción, tarea, revisión, aprobación, control, excepción o vencimiento;
- título en lenguaje de trabajo;
- objeto de origen y referencia contextual; enlace al objeto sólo si existe destino útil;
- cliente u organización sólo si aporta contexto y está autorizado;
- situación y motivo de atención;
- responsable y participantes conocidos;
- vencimiento, antigüedad o ausencia explícita de fecha;
- prioridad de fixture claramente mock, sin presentarla como regla ABT;
- fuente/origen y frescura;
- próxima acción disponible;
- indicador de operación ausente cuando sea trabajo administrativo o preliminar.

## 7. Información secundaria

- detalles adicionales del objeto bajo expansión o navegación, no en todas las filas;
- evidencia, historial, auditoría y documentos en el objeto de origen;
- explicación de una regla o bloqueo cerca de la acción;
- datos de integración y última sincronización bajo demanda, salvo que la frescura afecte la decisión;
- acciones menos frecuentes en menú contextual con nombre accesible;
- progreso de onboarding sólo en Inicio, conforme a Etapa 1.

## 8. Acciones

### Inicio

- abrir contexto del caso que requiere atención; abrir el objeto sólo si existe destino útil según §5;
- abrir `/mi-trabajo` con un filtro equivalente;
- cambiar período o alcance permitido;
- retomar onboarding o ayuda contextual;
- reintentar una lectura recuperable.

### Mi trabajo

En el primer corte: ver/cerrar contexto, navegar sólo a destinos útiles, filtrar, buscar, ordenar, agrupar, limpiar filtros y reintentar lectura. La bandeja explica la siguiente acción sin ejecutarla si pertenece a un módulo futuro.

Objetivo posterior del producto, fuera de Etapa 2: completar tareas/controles, aprobar/rechazar, resolver excepciones y reasignar. Requiere reglas, evidencia, capacidades y auditoría propias; una capacidad mock declarada no habilita esas escrituras en este corte.

### Acciones masivas

No se incluyen en el primer corte. Pueden evaluarse cuando exista una acción segura, homogénea, reversible o confirmable sobre varios elementos.

### Acciones destructivas o sensibles

- aprobación, rechazo, excepción y reasignación requieren contexto, confirmación proporcional y auditoría;
- el doble control de Importación y Exportación no puede completarse dos veces por la misma persona;
- los fixtures sólo representan el bloqueo y no inventan un mecanismo de autorización;
- una acción no disponible explica motivo y resolución posible sin revelar datos restringidos.

## 9. Reglas y validaciones

| ID / fuente                                                                       | Regla                                                                                              | Respuesta de la interfaz                                                         |                Bloquea | Excepción                                                     |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------: | ------------------------------------------------------------- |
| Alcance §7.3; `COV-007`                                                           | Toda alerta accionable identifica objeto, motivo y próxima acción cuando exista                    | Resumen y fila enlazables; mensaje cercano                                       |         No por sí sola | Depende de la regla origen                                    |
| E1:Operación/Reglas transversales confirmadas; Alcance §7.1; `IMP-004`; `EXP-003` | Importación y Exportación requieren doble control por dos personas diferentes antes de oficializar | Estado bloqueado, personas/evidencia ficticias permitidas y contexto del control |     Sí, oficialización | Tratamiento excepcional pendiente de validación; no se simula |
| `WRK-003`; `OPE-006`                                                              | Puede existir trabajo sin operación                                                                | Tipo y origen explícitos; no exige `operationId`                                 |                     No | Puede vincularse después si se valida                         |
| `COV-008`                                                                         | Un dato externo que afecta una decisión informa fuente y frescura                                  | Etiqueta textual, fecha y recuperación                                           | Según regla de negocio | Umbral pendiente                                              |
| `COV-006`                                                                         | La interfaz representa capacidades, no concede autorización                                        | Contenido omitido o estado sin permiso con explicación segura                    |   Sí, acción protegida | Política definitiva pendiente                                 |
| `WRK-005`                                                                         | Inicio y Mi trabajo comparten la misma fuente conceptual                                           | Conteo y filtro equivalentes; enlace conserva contexto                           |                     No | Diferencias sólo por resumen o permiso explícito              |
| `COV-003`                                                                         | Bloqueo, vencimiento, excepción, error y dato desactualizado son dimensiones distintas             | Texto, iconografía y jerarquía; no sólo color                                    |        Según dimensión | Catálogo pendiente                                            |

## 10. Estados del objeto de trabajo

No se define un único estado global. Se representan dimensiones separadas:

- **situación de trabajo:** pendiente, en curso, completada, cancelada o desconocida; nombres definitivos pendientes;
- **tiempo:** sin fecha, próxima, vencida o completada en fecha;
- **responsabilidad:** asignada, compartida, sin responsable o restringida;
- **regla:** informativa, requiere revisión, bloqueada o con excepción;
- **origen:** operación, cotización, cliente, DJVE/permiso, Administración, documento, integración u otro trabajo sin operación;
- **dato:** vigente, parcial, desactualizado o no disponible;
- **acceso:** habilitado, sólo lectura o sin permiso.

Los nombres son vocabulario de interfaz propuesto para fixtures. No constituyen el catálogo definitivo de estados de ABT.

## 11. Estados de pantalla

### Inicio

- **loading:** estructura estable y texto de carga; no mostrar ceros como si fueran datos confirmados;
- **loaded:** resúmenes accionables y origen visible cuando corresponde;
- **empty:** explicar que no hay atención pendiente en el alcance actual y ofrecer accesos útiles;
- **información parcial:** identificar qué fuente o bloque falta;
- **stale:** indicar última actualización y evitar decisiones sensibles si la regla futura lo exige;
- **error recuperable:** conservar navegación y período; ofrecer reintento;
- **error no recuperable:** explicar el límite y ofrecer Mi trabajo o soporte definido;
- **sin permiso:** omitir información sensible y mostrar sólo una explicación segura;
- **onboarding:** panel completo únicamente en Inicio según la especificación de Etapa 1.

`filtered-empty` no aplica si Inicio no expone filtros complejos en el primer corte; si se incorpora período o alcance, se trata como filtered-empty y ofrece restablecerlo.

### Mi trabajo

- **loading:** encabezado y filtros estables; filas de carga sin anunciar conteos falsos;
- **loaded:** lista o tabla con jerarquía clara;
- **empty:** no hay elementos en el alcance autorizado;
- **filtered-empty:** no hay resultados para los filtros; mantenerlos visibles y permitir limpiarlos;
- **error recuperable:** conservar filtros y contexto; reintentar;
- **error no recuperable:** ofrecer salida segura sin borrar el estado de URL;
- **sin permiso:** no revelar filas ni conteos protegidos;
- **sólo lectura:** permitir abrir y comprender, deshabilitar acciones con motivo;
- **información parcial o desactualizada:** marcar por elemento y a nivel de conjunto;
- **acción bloqueada:** mostrar regla, evidencia conocida y siguiente paso;
- **guardando/guardado y conflicto de escritura:** no aplican al corte de lectura/contexto; quedan definidos para acciones futuras, preservando la fila y evitando duplicación;
- **funcionalidad futura:** explicación junto al contexto, sin botón de ejecución ficticia.

## 12. Errores y recuperación

| Caso                                       | Qué ocurrió                                            | Qué se preserva                            | Recuperación                                         | Mensaje propuesto                                                                        |
| ------------------------------------------ | ------------------------------------------------------ | ------------------------------------------ | ---------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Resumen no disponible                      | Falló la lectura de uno o más bloques de Inicio        | Navegación, período y bloques cargados     | Reintentar bloque o abrir Mi trabajo                 | “No pudimos actualizar este resumen. El resto de la información sigue disponible.”       |
| Lista no disponible                        | Falló la lectura de Mi trabajo                         | URL, filtros, orden y contexto local       | Reintentar                                           | “No pudimos cargar tus pendientes. Conservamos los filtros para que vuelvas a intentar.” |
| Fuente desactualizada                      | La fuente externa no confirmó datos recientes          | Último dato y su fecha, si está autorizado | Actualizar o consultar fuente                        | “Este dato fue actualizado por última vez el {fecha}. Revisá la fuente antes de actuar.” |
| Acción rechazada (futura, fuera del corte) | Permiso, conflicto o regla impidió completar la acción | Datos ingresados y contexto                | Corregir, recargar o solicitar capacidad según causa | Mensaje específico con causa y próximo paso                                              |
| Objeto ya cambió (futuro, fuera del corte) | Otra persona o fuente actualizó el caso                | Filtros y contenido no conflictivo         | Recargar objeto y comparar                           | “El caso cambió desde que lo abriste. Revisá la versión actual antes de continuar.”      |

Los textos finales deben validar el vocabulario de ABT. Nunca se atribuye a un fallo del producto una indisponibilidad externa no comprobada.

## 13. Modelo visual propuesto

### Jerarquía y composición de Inicio

1. `PageHeader` con título, ayuda breve y alcance temporal si se justifica.
2. Bloque “Requiere atención” con pocos casos prioritarios y acceso a Mi trabajo.
3. Situación operativa en resumen denso, navegable y sin gráficos decorativos.
4. Vencimientos, controles/revisiones y actividad relevante en secciones claramente tituladas.
5. Onboarding existente, cuando corresponda, sin duplicarse fuera de Inicio.

Se prefieren listas compactas, contadores con significado y pequeños resúmenes tabulares. Cada total abre el conjunto que lo compone.

### Jerarquía y composición de Mi trabajo

1. `PageHeader` con cantidad accesible y explicación corta.
2. Barra de búsqueda y filtros con estado en URL cuando corresponda.
3. Presets propuestos: todo autorizado, asignado a mí, próximo a vencer, vencido, revisiones/aprobaciones, controles y excepciones. “Mi equipo” se muestra sólo si existe una capacidad validada.
4. Tabla o lista densa con objeto, situación, responsabilidad, vencimiento, fuente y acción.
5. Expansión o navegación al objeto para detalles; no crear un panel permanente si reduce el ancho útil.

### Componentes reutilizables

- `PageHeader`, controles de período, filtros, búsqueda y estados del Design System;
- tabla responsive, fila expandible, badges con texto e icono y menús contextuales;
- mensajes de vacío, error, permiso, stale y bloqueo;
- `Dialog` sólo para confirmaciones o acciones sensibles;
- patrón de fuente/frescura;
- onboarding y ayuda existentes del Application Shell.

Un patrón reusable ausente debe documentarse primero en el Design System antes de usarse en las pantallas.

## 14. Responsive

### Desktop amplio — 1440 px

- Inicio usa una grilla controlada con “Requiere atención” como bloque principal y resúmenes secundarios alineados.
- Mi trabajo presenta tabla densa, filtros visibles y columnas esenciales; detalles secundarios se revelan bajo demanda.

### Notebook — 1280/1024 px

- reducir columnas secundarias antes de comprimir textos;
- permitir que filtros menos frecuentes pasen a popover o drawer accesible;
- mantener objeto, situación, vencimiento y próxima acción visibles.

### Tablet — 960/900/820/768 px

- Application Shell usa drawer conforme a Etapa 1;
- Inicio apila secciones en orden de decisión;
- Mi trabajo usa lista densa o tabla con preset compacto y filas expandibles;
- no depender de hover ni de scroll horizontal habitual.

### Mobile — 390 px

- Inicio prioriza atención, vencimientos y acceso a Mi trabajo antes de resúmenes secundarios;
- cada work item muestra título, objeto, situación, vencimiento y acción principal; responsable/fuente se revelan si no afectan una decisión inmediata;
- filtros se abren en un drawer o diálogo con foco administrado y resumen de filtros activos;
- targets táctiles de al menos 44 px y texto sin truncar información crítica.

## 15. Accesibilidad

- un `h1` por ruta y jerarquía de encabezados estable;
- landmarks y enlace de salto provistos por el Shell;
- orden de foco: encabezado, alcance/filtros, resumen o lista, acciones contextuales;
- todos los filtros y acciones operables con teclado;
- foco visible, no oculto por elementos sticky;
- tabla con encabezados semánticos; en mobile, relación etiqueta-valor preservada;
- actualizaciones de conteos, guardado y errores anunciadas sin interrumpir lectura;
- bloqueo, vencimiento, prioridad y stale distinguidos por texto/icono además de color;
- botones iconográficos con nombre accesible;
- dialogs/drawers contienen foco, cierran con Escape cuando sea seguro y devuelven foco;
- contraste WCAG 2.2 AA, zoom 200 %, reducción de movimiento y targets táctiles;
- los enlaces nombran el objeto o resultado, evitando cadenas repetidas de “Ver”.

## 16. Ayuda e inducción

- conservar en `/inicio` el onboarding aprobado de Etapa 1;
- agregar ayuda contextual breve sobre la diferencia entre resumen y trabajo ejecutable;
- explicar fuente y frescura donde aparezcan por primera vez;
- no enseñar perfiles, prioridades o procesos todavía no validados;
- permitir omitir y retomar la inducción existente;
- Mi trabajo no repite el panel completo de onboarding.

## 17. Branding

Las dos rutas usan el Application Shell aprobado:

- ABT mantiene la marca principal en navegación;
- Broco aparece sólo en `BrandAttribution` del Shell;
- no se repiten logos dentro de los resúmenes o la bandeja;
- no se crean assets ni variantes nuevas.

## 18. Fuente de datos y fixtures

### Frontera propuesta

```text
Inicio / Mi trabajo
        ↓
fuente simple de work items y resúmenes
        ↓
fixtures determinísticos compartidos
```

Esta frontera permite que Inicio resuma los mismos elementos que Mi trabajo presenta en detalle. No define API ni contrato compartido definitivo.

### Modelo mock propuesto

| Campo conceptual             | Uso                                                                            | Límite                                                             |
| ---------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `id`                         | Estabilidad de pruebas y navegación                                            | Identificador ficticio, sin formato contractual                    |
| `type`                       | Acción, tarea, revisión, aprobación, control, excepción o vencimiento          | Taxonomía provisional                                              |
| `title` / `reason`           | Lenguaje de trabajo y motivo de atención                                       | Sin datos reales                                                   |
| `origin`                     | Operación, cotización, cliente, DJVE/permiso, Administración, documento u otro | Puede no tener operación                                           |
| `subjectRef`                 | Referencia del origen y disponibilidad del destino                             | No generar href si no existe destino útil; contexto local según §5 |
| `assignee` / `participants`  | Responsabilidad mock                                                           | Personas ficticias; no perfiles definitivos                        |
| `dueAt` / `age`              | Vencimiento o antigüedad, ambos opcionales                                     | Reloj fijo; “próximo” explícito, sin umbral ABT                    |
| `priority`                   | Orden de escenarios                                                            | Valor demostrativo, no fórmula ABT                                 |
| `situation`                  | Contexto operativo o administrativo                                            | No reemplaza estados del objeto                                    |
| `nextAction`                 | Acción de lectura disponible o descripción de acción futura/bloqueo            | Capacidad mock explícita; no habilita escrituras de negocio        |
| `source` / `freshness`       | Origen, última actualización y error                                           | No promete disponibilidad de Alpha2000                             |
| `sensitivity` / `capability` | Ocultar o restringir dato/acción                                               | Capacidades ficticias y documentadas                               |

### Conjunto mínimo de casos

- operación con vencimiento próximo;
- control bloqueante de Importación pendiente de segunda persona;
- control bloqueante de Exportación pendiente de segunda persona;
- revisión documental condicional no bloqueante;
- aprobación interna de cotización pendiente;
- cotización enviada pendiente de respuesta del cliente;
- excepción con motivo y evidencia;
- tarea administrativa sin operación;
- operación lista para facturar que todavía no está cumplida;
- caso facturado que continúa activo por post-embarque;
- DJVE previa a una operación y relacionada con más de un permiso;
- dato externo desactualizado;
- elemento restringido por capacidad;
- conjunto vacío y conjunto sin resultados por filtro.

No usar importes reales de `2025ABT.xlsx`, nombres reales de clientes/personas ni ejemplos de documentos como fixtures.

## 19. Métricas de experiencia

No se instrumentan métricas de producto en Etapa 2. Para evaluación manual se observa:

- si se reconoce qué requiere atención en menos de 10 segundos;
- si cada elemento permite identificar contexto y siguiente acción;
- si el retorno conserva filtros y foco;
- si se diferencia bloqueo, vencimiento, excepción y dato stale;
- si una persona puede completar el recorrido sólo con teclado.

## 20. Escenarios de prueba

### Unitarios

- derivación de resúmenes desde la misma colección conceptual de work items;
- filtros, orden y conteos coherentes;
- reloj determinístico para próximo/vencido;
- capacidades mock ocultan dato y acción sin filtrar conteos;
- trabajo sin operación conserva navegación válida;
- fuente desactualizada no se presenta como vigente.

### Componentes

- persona con pendientes diversos;
- persona sin pendientes;
- control bloqueante con explicación y acción no disponible;
- vencimientos próximos y vencidos sin depender sólo del color;
- estado filtered-empty con filtros visibles y botón para limpiar;
- sin permiso y sólo lectura;
- dato desactualizado y error recuperable;
- textos largos, referencias ausentes y fechas incompletas;
- axe sin violaciones conocidas.

### Integración de pantalla

- Inicio abre Mi trabajo con filtro equivalente y conteos coherentes;
- Mi trabajo abre contexto local del origen; sólo navega si el destino existe y es útil; retorno conserva URL/foco;
- tarea administrativa sin operación no intenta navegar a una operación;
- onboarding completo aparece sólo en Inicio;
- permiso restringido no expone datos sensibles en resumen, fila, tooltip ni error;
- reintento preserva filtros y contenido cargado.

### E2E

- navegar Inicio → Mi trabajo filtrado → contexto de origen → cerrar/volver; probar destino profundo sólo cuando esté disponible;
- operar con teclado en búsqueda, filtros, fila y acción;
- representar control bloqueante sin permitir oficialización;
- abrir una tarea sin operación;
- recuperar un error de lectura;
- verificar drawer y filtros en tablet/mobile.

### Manuales

- 1440, 1280, 1024, 960, 900, 820, 768 y 390 px;
- zoom 200 %, contraste, foco, reducción de movimiento y lector de pantalla básico;
- persona con muchos pendientes y textos extremos;
- vacío, filtered-empty, sin permiso, stale, parcial y error;
- contextualización de operación, cotización, cliente, DJVE/permiso y tarea administrativa sin 404 ni botones inertes;
- revisión de densidad, jerarquía y ausencia de indicadores decorativos.

### Enlace de necesidades a escenarios (todavía sin implementar)

| Escenario | Necesidades / reglas                        | Comprobación prevista                                                                                                                                                                                                                                          |
| --------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T02-01    | WRK-001, WRK-002, WRK-005, COV-010          | Inicio → conjunto equivalente de Mi trabajo; mismos permisos y conteos. Integración/E2E.                                                                                                                                                                       |
| T02-02    | WRK-002, OPE-002, OPE-005, COV-004          | Contexto de origen, responsable conocido o ausente, retorno/recarga y referencia inválida. Componentes/integración/E2E.                                                                                                                                        |
| T02-03    | WRK-003, OPE-006                            | Tarea sin operación con contexto útil y sin URL operativa inventada. Integración/E2E.                                                                                                                                                                          |
| T02-04    | WRK-004, IMP-004, EXP-003, COV-003, COV-007 | Control segregado representado como bloqueado, revisión condicional diferenciada; sin ejecución/oficialización. Componentes/E2E.                                                                                                                               |
| T02-05    | COV-006, COV-008                            | Datos/conteos restringidos omitidos; ser responsable/jefe o poder ver valores aduaneros no habilita honorarios/costos/márgenes. Origen, no conectada, stale, parcial, error y sin permiso; reintento sólo cuando aplica. Unitarias/integración y E2E negativo. |
| T02-06    | WRK-002, COV-004                            | Orden explícito, vencimientos determinísticos, fecha/responsable ausentes y prioridad sin fórmula ABT. Unitarias/componentes.                                                                                                                                  |
| T02-07    | COV-011                                     | Estados alternativos, teclado, foco, textos extremos y anchos de §14. Componentes/axe y revisión manual.                                                                                                                                                       |

Al implementar, enlazar cada escenario con el archivo/test y su resultado real. Estos IDs son locales a esta especificación; no son requisitos nuevos.

## 21. Criterios de aceptación

- [ ] Inicio explica qué está pasando y qué requiere atención sin intentar operar todo desde el resumen.
- [ ] Mi trabajo reúne acciones, tareas, revisiones, aprobaciones, controles, excepciones y vencimientos autorizados.
- [ ] El trabajo administrativo o preliminar puede existir sin operación.
- [ ] Cada elemento identifica objeto/origen, situación, responsabilidad conocida, tiempo, fuente y próxima acción cuando existan.
- [ ] Inicio y Mi trabajo comparten conteos, permisos, filtros conceptuales y fuente de fixtures.
- [ ] Cada resumen o alerta abre contexto o conjunto explicativo; no presenta un placeholder como ficha de objeto.
- [ ] No existen enlaces profundos inexistentes ni aprobaciones, oficializaciones o escrituras simuladas.
- [ ] Recarga/retorno conserva filtros y contexto; referencia inválida o restringida tiene recuperación segura.
- [ ] No se muestran datos sensibles por defecto ni se inventan perfiles definitivos.
- [ ] Doble control bloqueante y validaciones documentales condicionales se distinguen.
- [ ] Los estados loading, empty, filtered-empty, error, permiso, read-only, parcial, stale y blocked están resueltos.
- [ ] Desktop, notebook, tablet y mobile conservan acción y contexto sin scroll horizontal habitual.
- [ ] Teclado, foco, contraste y anuncios cumplen el criterio WCAG 2.2 AA.
- [ ] Los fixtures son ficticios, determinísticos y no convierten hipótesis en reglas.
- [ ] No se crean rutas, backend, auth, APIs ni contratos ficticios.

## 22. Fuera de alcance

- lista y detalle completos de Operaciones;
- acciones profundas de Importación, Exportación, DJVE, cotización o Administración;
- reglas definitivas de prioridad, SLA, asignación, suplencia o escalamiento;
- perfiles y permisos definitivos;
- notificaciones reales, correo, push o WhatsApp;
- integración real Alpha2000, bancaria u organismos;
- indicadores financieros o fórmulas de Dirección;
- Portal de Clientes;
- persistencia, backend, autenticación y API.

## 23. Decisiones pendientes

### Bloquean un compromiso funcional o una automatización

| Pregunta                                                                 | Impacto                                  | Tratamiento para fixtures                                 | Responsable / instancia        |
| ------------------------------------------------------------------------ | ---------------------------------------- | --------------------------------------------------------- | ------------------------------ |
| ¿Qué catálogo de work items, estados y transiciones usa ABT?             | Lenguaje, filtros y acciones             | Taxonomía provisional documentada                         | ABT / revisión funcional       |
| ¿Cómo se asigna, reasigna, delega o cubre una ausencia?                  | Responsabilidad, auditoría y “Mi equipo” | Sólo casos ficticios; ocultar “Mi equipo” si no se valida | ABT / permisos                 |
| ¿Qué capacidades habilitan cada dato y acción?                           | Sensibilidad y seguridad                 | Capacidades mock mínimas y no sensibles                   | ABT / arquitectura de permisos |
| ¿Qué reglas determinan prioridad, severidad, vencimiento y escalamiento? | Orden y alertas                          | Orden fijo de fixtures, rotulado como demostrativo        | ABT por proceso                |
| ¿Qué evento y fuente crean o completan cada work item?                   | Coherencia, duplicación y auditoría      | Fuente conceptual local, sin automatización               | ABT / arquitectura futura      |

### Pueden esperar a la validación funcional posterior

| Pregunta                                              | Impacto                           | Recomendación provisional                              | Responsable / instancia |
| ----------------------------------------------------- | --------------------------------- | ------------------------------------------------------ | ----------------------- |
| ¿Qué bloques y orden prefiere cada persona en Inicio? | Jerarquía y personalización       | Un orden común, sin personalización                    | Revisión visual ABT     |
| ¿Se habilitan vistas guardadas?                       | Eficiencia de usuarios frecuentes | Diferir hasta Etapa 3 o necesidad comprobada           | ABT / UX                |
| ¿Qué filtros merecen presets visibles?                | Densidad de Mi trabajo            | Empezar con tipos, tiempo y responsabilidad autorizada | Revisión funcional      |
| ¿Qué nivel de actividad reciente aparece en Inicio?   | Ruido y contexto                  | Mostrar sólo cambios accionables del fixture           | Revisión visual ABT     |
| ¿Qué umbral define un dato stale?                     | Mensaje y posible bloqueo         | Mostrar fecha sin inventar umbral                      | Dueño de integración    |

## 24. Definition of Ready y resultado técnico de Etapa 2

La implementación técnica de Etapa 2 se completó en `feat/stage-02-inicio-mi-trabajo` dentro de estos límites; esto no constituye aprobación funcional/humana ni seguridad productiva:

- usar sólo las rutas aprobadas `/inicio` y `/mi-trabajo`;
- compartir una fuente conceptual de work items y resúmenes;
- usar personas, clientes, importes, referencias y prioridades ficticios;
- representar capacidades sin definir perfiles;
- no automatizar asignaciones, prioridades, SLA, notificaciones ni reglas externas;
- no simular disponibilidad de Alpha2000 ni de los demás frentes previstos en el alcance;
- usar el contrato temporal de navegación de §5; contextualizar localmente lo que todavía no tenga destino útil, sin presentar placeholders como fichas;
- documentar cualquier supuesto nuevo como reemplazable.

Las preguntas de catálogo, asignación, capacidades y origen de eventos continúan abiertas y bloquean decisiones definitivas, pero no impidieron este corte navegable con fixtures bajo límites explícitos. La etapa queda `Under review` hasta la revisión humana integral; no se atribuye aprobación de negocio.

## 25. Implementación y evidencia técnica

- Features: `apps/web/features/home` y `apps/web/features/work`, con un conjunto común de fixtures determinísticos, sintéticos y sin importes.
- Rutas: `/inicio` y `/mi-trabajo`; parámetros URL preservan filtros/vistas y permiten abrir contexto local sin enlazar a detalles aún inexistentes.
- Componentes: patrones existentes de `packages/ui`; no se modificaron Design System, marca ni Application Shell.
- Estados probados: bandeja normal, lectura recuperable, acceso restringido sin revelar filas/conteos sensibles, datos externos parciales/desactualizados y tarea sin operación.
- Pruebas implementadas: unitarias de datos y Worklist, pruebas automatizadas de accesibilidad en estados principales y E2E para navegación, filtros, estado de fuente, recuperación, restricción y anchos responsive. En la incorporación a `main` se ejecutaron lint, typecheck, build, unitarias (42), accesibilidad (8) y smoke E2E Chromium (15); CI de PR #7 verde. No equivale a revisión visual humana ni a certificación WCAG.
- Integración: PR #7 integrado en `main` mediante squash `9359921d3cd3fb568e9ce923d3790c63d8a30a2d`; despliegue principal READY. El dominio personalizado responde, pero Vercel SSO está configurado `all_except_custom_domains`; no afirmar privacidad. Revisión visual humana pendiente.

## 26. Resultado de revisión humana

> Completar después de revisar esta especificación y, en otra sesión, la implementación.

- Viewports revisados:
- Escenarios revisados:
- Observaciones:
- Ajustes requeridos:
- Estado final: Under review — aprobación humana pendiente

## UX-01 — coherencia de proyecciones

Inicio y Mi trabajo proyectan el mismo estado local de doble control. Al completarlo desaparece ese pendiente, sin inferir oficialización. La tarea comercial referencia la cotización sintética existente 001 (versión 1) existente, con retorno al trabajo. Referencias operativas OP-DEM consistentes, fechas DD/MM/AAAA y Chevron para expansión. Pruebas: work-projection.test.ts y ux-coherence.spec.ts; revisión humana pendiente.

## UX-04 — workspace contextual

Inicio conserva atención y acceso al contexto; incorpora tres acciones según capacidades, síntesis de pendientes y próximos vencimientos con fechas explícitas. No duplica la bandeja ni añade una fórmula de prioridad. Mi trabajo ofrece apertura del objeto sin exigir expansión; el retorno conserva búsqueda, vista y pendiente.

Las revisiones comerciales se proyectan de la versión vigente: la aprobación local retira ese pendiente, no implica envío, aceptación ni alta de operación. Inicio, Mi trabajo y la vista histórica de gestión leen esa misma proyección. G5 se incorpora en UX-05; la identidad visible de Dirección se completa junto con su analítica, sin publicar un módulo vacío.

Pruebas: work-projection.test.ts, ux-workspace.spec.ts y regresión de Etapa 2. Las perspectivas son presets de evaluación, no perfiles ABT aprobados.

### G5 — operaciones por situación

Un único gráfico operativo lee la colección autorizada del estado compartido de Operaciones; agrupa por situación existente, no productividad ni etapa inferida. Barra y enlace textual muestran el mismo conteo y abren el listado con situación y tipo contextual en URL. Identidad/acciones se conservan en el listado. Sin cifras financieras; carga, vacío y alternativa por enlaces explícitos.
