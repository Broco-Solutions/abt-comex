# ABT Comex — Codex Runbook

> Procedimiento de trabajo y mantenimiento documental · 14/10/2026

## Autoridad y responsabilidades

Una fuente autorizada por tipo de conocimiento. Una decisión no queda cerrada sólo por existir en código, chat o una entrevista. Las citas y resúmenes no reemplazan al documento responsable.

| Documento | Autoridad / información exclusiva | Cuándo actualizar | Referencias que consume → quién lo usa |
|---|---|---|---|
| [Alcance](../product/ALCANCE_FUNCIONAL.md) | Producto, capacidades incluidas/condicionadas/excluidas, reglas y pendientes de negocio | Cambio funcional aprobado | Evidencia original → matriz, mapa, pantallas |
| [Matriz](MATRIZ_COBERTURA_FUNCIONAL.md) | Necesidades e IDs, origen, certeza, validación pendiente, cobertura e integración requerida | Nueva evidencia, corrección semántica o cambio de cobertura | Alcance y originales → mapa, pantallas, plan |
| [Mapa](MAPA_PANTALLAS_Y_RECORRIDOS.md) | Experiencias UI, objetos, rutas aprobadas/propuestas, recorridos y enlaces de cobertura | Cambio de navegación o recorrido | Alcance y matriz → pantallas, plan |
| [Estándar](FRONTEND_STANDARD.md) | Patrones y criterios transversales UX/UI, responsive, accesibilidad, referentes investigados | Cambio reusable de experiencia | Alcance, DS y referentes → pantallas |
| [Pantallas](screens/README.md) | Comportamiento, reglas citadas, escenarios y aceptación de cada corte | Cambio de experiencia particular | Matriz, mapa, estándar → implementación y pruebas |
| [Plan](PLAN_IMPLEMENTACION.md) | Orden, dependencias, entregables, gates, estados de etapas e integraciones y evidencia de cierre | Avance real, cambio de secuencia, contrato externo o aprobación | Matriz y pantallas → ejecución |
| [Pruebas](TEST_STRATEGY.md) | Estrategia por riesgo, comandos, infraestructura y límites de evidencia | Cambio de pruebas o infraestructura | Riesgo de pantalla → verificación y gates |
| [Marca](BRAND_USAGE.md) | Assets oficiales, jerarquía, atribución y uso por superficie | Cambio de marca autorizado | Assets → DS, Shell y superficies |
| [Decisiones](DECISIONS.md) | Historia, motivo, fecha y alcance de decisiones; referencias al vigente | Decisión interna o aprobación identificable | Fuentes afectadas → contexto histórico |
| [Arquitectura](../architecture/README.md) | Fronteras técnicas, organización de código y evolución diferida | Decisión técnica real | Decisiones y stack → implementación |
| [AGENTS](../../AGENTS.md) | Entrada, límites esenciales y ruta al procedimiento | Cambio de reglas fundamentales | Este runbook → sesiones |
| Este runbook | Lectura proporcional, mantenimiento, preparación/cierre e informe | Cambio de procedimiento | Autoridades anteriores → ejecución y PR |
| [Índice frontend](ESPECIFICACION_FUNCIONAL_FRONTEND.md) | Navegación y compatibilidad con la antigua especificación general | Movimiento de responsabilidades o enlaces | Autoridades → lectores y referencias históricas |
| [README raíz](../../README.md), [README pantallas](screens/README.md), [plantilla](screens/SCREEN_TEMPLATE.md) | Orientación; estados de especificación; estructura proporcional | Cambio de entradas, ciclo de especificación o plantilla | Autoridades → lectores/autores |

El [Design System](../../apps/web/app/design-system/page.tsx) y [packages/ui](../../packages/ui/src/components) son autoridad visual ejecutable. Sus datasets son demostrativos, no requisitos.

## Inicio y lectura proporcional

1. Verificar ruta, rama, `git status --short --branch`, archivos nuevos y diff; si importa la base, `git merge-base HEAD main`. Preservar cambios existentes y comprender los solapamientos.
2. Identificar capacidad/proceso, etapa solicitada y documento responsable.
3. Elegir el contexto necesario en la tabla siguiente. Releer sólo secciones afectadas en iteraciones menores; no auditar todo el repositorio para una corrección rutinaria.
4. Revisar evidencia nueva, reglas confirmadas, hipótesis y decisiones pendientes antes de cambiar.

| Tarea | Lectura mínima pertinente |
|---|---|
| Corrección técnica o visual pequeña | AGENTS, archivo/componente y pruebas cercanas; sección afectada del estándar o arquitectura; pantalla si cambia comportamiento. |
| Pantalla o flujo nuevo | Alcance relacionado → filas de matriz → experiencia/recorrido del mapa → estándar → especificación → etapa/gate del plan → estrategia de pruebas. Revisar DS y componentes; marca si cambia superficie. |
| Cambio transversal | Autoridades, pantallas consumidoras y decisiones afectadas; estrategia de pruebas y alcance según impacto. |
| Cambio de producto | Relevamiento original y registro de fuentes → alcance y decisiones de negocio → cobertura, mapa, pantallas y plan afectados. Una entrevista no equivale a aprobación formal. |
| Sólo documentación | Autoridades y referencias entrantes/salientes afectadas; validación documental de la estrategia. Sin suites frontend si la aplicación no cambia. |

Antes de escribir código Next.js, leer la guía relevante en `node_modules/next/dist/docs/` de la versión instalada.

## Preparación y cierre

### Definition of Ready

La pantalla/flujo tiene propósito, trabajo principal, alcance/exclusiones, evidencia trazable, información/acciones, reglas/estados, sensibilidad/capacidades, datos mock, responsive, ayuda, aceptación y escenarios de prueba proporcionados al riesgo. Los pendientes no bloqueantes se identifican con tratamiento reversible; los que cambian la solución requieren definición.

`Ready` registra la verificación de preparación y su responsable/fecha/evidencia. En la primera pasada integral autorizada en el plan, puede ser una revisión técnica/documental de Codex sin aprobación visual humana por pantalla: sólo con alcance suficiente, supuestos reversibles y sin decisiones funcionales bloqueantes. Fuera de ese modo requiere revisión humana de especificación. No cambiar a `Ready` por existir un archivo ni atribuir aprobación ABT. Preparación, implementación y aprobación funcional son estados diferentes; lo no validado sigue pendiente.

### Definition of Done

El cierre técnico del bloque cumple alcance y especificación, reutiliza DS, contempla estados, responsive, WCAG 2.2 AA, errores recuperables, consola, marca y pruebas exigidas por la estrategia, con documentación sincronizada. En modo integral deja la etapa/especificación `Under review` y permite continuar al siguiente bloque técnicamente habilitado. La aprobación final exige revisión humana visual/funcional integral registrada; sólo entonces corresponde `Complete`/`Approved` para los cortes efectivamente aprobados. Registrar limitaciones y correcciones; una prueba faltante no se presenta como pasada.

Una aprobación del Shell no aprueba módulos futuros. Commit, push y merge son acciones separadas que necesitan autorización; no forman parte automática del cierre técnico. El estado de etapa y la evidencia se mantienen sólo en el plan.

## Ejecución de un incremento

Para tareas medianas/grandes, preparar un plan breve: archivos, patrones, datos, interacciones, responsive/accesibilidad, pruebas y documentos. No pedir confirmar cada paso.

Ejecutar bloques coherentes según la secuencia del plan. La primera pasada integral permite varias etapas en sesiones extensas sucesivas, con checks técnicos/documentales por bloque y sin exigir revisión visual humana entre etapas. Mantener evidencia separada por etapa, pendientes y punto de reanudación; no mezclar refactors ajenos. Detener la parte que necesite una decisión funcional importante, no el resto seguro. Los nuevos patrones reusables pasan primero por DS según el estándar. Reglas técnicas: arquitectura; marca: BRAND_USAGE; criterios de UX: estándar; comandos y matriz de riesgo: estrategia de pruebas.

Para bugs: reproducir, corregir, incorporar regresión cuando sea razonable y verificar el área afectada. No informar checks que no se ejecutaron ni confundir build con revisión visual.

La revisión visual principal es humana en localhost/preview. No usar `agent-browser` salvo pedido explícito o riesgo concreto justificado. Indicar rutas, escenarios y viewports de la estrategia/estándar. Capturas no sustituyen interacción manual.

## Contrato de documentación viva

### Antes de cambiar

- Identificar necesidad/capacidad, proceso, experiencias e IDs afectados.
- Leer las autoridades correspondientes y comprobar evidencia nueva.
- Revisar reglas, decisiones internas, validaciones ABT y pendientes por separado.
- Resolver contradicciones funcionales antes de implementar la parte dependiente. Continuar trabajo independiente seguro.

### Durante

- Editar la autoridad, enlazar desde consumidores; no copiar reglas o listas de comandos.
- Conservar IDs y su namespace. Una necesidad retirada se conserva con motivo/estado, no se borra ni reutiliza su ID.
- Distinguir evidencia observada, propuesta UX, decisión Broco, validación formal ABT, dependencia externa y fuera de alcance según la matriz.
- Registrar decisiones nuevas en DECISIONS y actualizar su fuente vigente; conservar historia sin presentarla como instrucción actual.
- Antes de retirar texto, comprobar que su contenido exclusivo esté en el destino. Reparar enlaces y citas de sección. Eliminar un documento completo requiere propuesta previa si rompe compatibilidad.
- No copiar datos personales, comerciales o financieros sensibles de Drive a Markdown, fixtures, screenshots o logs del repositorio.

### Después

- Contrastar cobertura e IDs antes/después, recorridos y referencias entrantes/salientes; comprobar semántica manualmente.
- Actualizar especificación y escenarios si cambia comportamiento. Enlazar pruebas existentes al implementarlas; un escenario documentado no es prueba ejecutada.
- Actualizar el estado real de etapa en el plan, sin atribuir aprobaciones.
- Si cambia una dependencia externa, actualizar su ficha de seguimiento en el plan y enlazar contrato/evidencia; un mock o una pantalla terminada no cambia una integración a `Validada`.
- Ejecutar la validación proporcional definida en TEST_STRATEGY; declarar pendientes, fuentes no revisadas y limitaciones.
- Informar `Impacto documental: sin impacto` o los documentos actualizados.

### En cada PR

Informar evidencia utilizada (origen, sección, fecha y alcance de consulta), IDs/capacidades afectadas, impacto documental, supuestos reversibles, pruebas y resultados, validación humana pendiente y dependencias. Separar avance del frontend demostrativo de avance operativo/integraciones; comprobar confidencialidad según alcance §7.2 y coherencia de fixtures entre procesos. Aplicar cuando se autorice un PR; este procedimiento no autoriza publicarlo.

### Cuando cambia el alcance

La decisión funcional requiere aprobación identificable. Actualizar alcance local y vínculos afectados; registrar la necesidad de sincronizar el Google Doc funcional, qué sección cambia y quién lo valida. No declarar Drive actualizado por cambiar Markdown. La escritura externa debe estar autorizada. Una corrección de citas o gobierno no cambia por sí misma el alcance ni la fecha de última sincronización.

### Ramas y PR de la primera pasada integral

- Partir de `main` actualizado después de consolidar el Plan Maestro. Usar una rama de feature por etapa o bloque coherente del [orden integral](PLAN_IMPLEMENTACION.md#primera-pasada-integral-del-frontend), conservando sus IDs históricos; por ejemplo, `feat/stage-02-inicio-mi-trabajo`.
- Preferir PR independientes y pequeños. Si un bloque necesita trabajo aún no fusionado, declarar la dependencia y base del PR; no presentar como independiente una comparación que incluya otra etapa. Evitar una rama única de larga vida para las doce etapas.
- Cada PR identifica etapas/experiencias, supuestos, fixtures relacionados, pruebas, impacto documental y preview protegido. Completar los checks técnicos/documentales por etapa aunque varias se construyan en una misma sesión.
- Fusionar por squash sólo con autorización vigente, checks verdes sobre el último SHA y diff revisado sin cambios ajenos. No hacer force push ni omitir fallos. La integración técnica en `main` no cambia `Under review` a aprobación humana.
- Los PR generan previews; `main` alimenta la demostración protegida, no producción operativa ABT. La revisión humana integral y las condiciones del producto real permanecen separadas. Configuración y límites del entorno: [arquitectura](../architecture/README.md#entorno-de-demostración).

## Límites y detención

No inventar campos, estados, roles, fórmulas o reglas; no convertir capacidades contextuales en módulos por comodidad. Ante una decisión funcional imprescindible, contradicción de producto, necesidad de arquitectura no definida o exposición de datos, detener sólo el trabajo dependiente, explicar el bloqueo y pedir la decisión concreta.

No eludir restricciones técnicas. Agotar alternativas seguras, completar el resto e informar. Producción, datos reales, borrados y mensajes reales requieren autorización; commit/push/merge también. No sobrescribir trabajo ajeno, ni usar reset/clean/restore/rebase para resolverlo.

Skills, agentes y revisores sólo si complejidad o riesgo lo justifican; no repetir auditorías por inercia. Las tareas de monitoreo no se dan por bloqueadas sólo por falta de cambios.

## Informe final

1. Resultado.
2. Archivos modificados.
3. Patrones reutilizados o creados.
4. Estados contemplados.
5. Responsive.
6. Accesibilidad.
7. Pruebas agregadas y ejecutadas, resultados y no ejecutadas con motivo.
8. Checks.
9. Impacto documental.
10. Revisión humana necesaria.
11. Dudas concretas, riesgos o desviaciones.

Adaptar extensión a la tarea; un informe especial solicitado por el usuario puede ampliar este formato. Antes de entregar: `git diff --check` y `git status --short`. No ejecutar commit o push salvo pedido explícito.
