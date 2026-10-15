# Creación guiada de Operación

> Estado: Under review
>
> Etapa: 5 — Creación guiada de Operación
>
> Experiencias / recorridos: OPS-04, COT-04; J1 y J5
>
> Ruta: `/operaciones/nueva`

## Propósito y alcance

Abrir una operación con dos caminos visibles: alta directa o reutilización de
una versión cuya aceptación del cliente está registrada en el escenario. La
creación sólo modifica fixtures locales de demostración y conserva el origen;
no crea una operación en ABT ni marca una cotización como consumida.

## Trazabilidad y decisiones pendientes

| Necesidades | Comportamiento en esta pasada                                                              | Pendiente                                                          |
| ----------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| OPE-001     | Cliente, tipo y modalidad elegidos explícitamente                                          | Campos mínimos por Importación/Exportación y clasificación inicial |
| OPE-002     | Alta directa no exige cotización                                                           | Acuerdos previos, instrucción y escenarios del cliente             |
| COT-006     | El camino comercial valida una versión aceptada y conserva ID/referencia/versión de origen | Cardinalidad versión→operaciones; no hay límite uno-a-uno          |
| COV-002     | Reutiliza cliente desde la cotización o catálogo sintético                                 | Fuente maestra y atributos que se heredan                          |
| OPE-003     | Equipo responsable requerido en el prototipo                                               | Usuarios, participantes, asignaciones y capacidades efectivas      |
| CFG-001     | Expone que no hay requisitos automáticos configurados                                      | Reglas por cliente, tipo, mercadería, régimen y organismo          |

Fuentes: [matriz funcional](../MATRIZ_COBERTURA_FUNCIONAL.md), [recorrido
J1](../MAPA_PANTALLAS_Y_RECORRIDOS.md#j1-apertura-directa-o-desde-cotización--operación--control--administración--dirección)
y [alcance funcional](../../product/ALCANCE_FUNCIONAL.md). La evidencia no
equivale a aprobación formal de ABT. Los equipos y registros son sintéticos.

## Pasos y comportamiento

1. Origen: directa o desde versión aceptada. Un origen de cotización inválido,
   inexistente o no aceptado no se convierte; se ofrece volver o elegir alta
   directa.
2. Cliente, tipo de operación y modalidad. El cliente se reutiliza y queda
   fijo desde la versión; tipo y modalidad se eligen, no se infieren del
   servicio.
3. Contexto opcional. La procedencia comercial aparece como referencia; no se
   confunde con instrucción aprobada ni crea tarea.
4. Equipo responsable requerido. Las etiquetas existentes no son usuarios ni
   roles de acceso.
5. Revisión, requisitos y creación local. La ausencia de reglas configuradas se informa en la revisión, sin un paso pasivo adicional; no representa cumplimiento ni introduce bloqueos inventados. El registro se refleja en Operaciones, detalle y
   relaciones del Cliente, y conserva el origen.

La cardinalidad de cotizaciones se mantiene abierta: no se impide abrir más de
una operación desde la misma versión aceptada. La apertura directa y comercial
comparten el núcleo, sin eludir controles de las etapas operativas posteriores.

## Estados, fuente y límites

Tipo, modalidad, equipo y situación inicial son valores de referencia ya usados
por el prototipo, no catálogos aprobados. “Pre-embarque”, “Sin alerta” y “Revisar
datos de apertura” son valores demostrativos. No se crean requisitos, controles,
permisos, participantes, hitos ni estados regulatorios. No hay backend,
persistencia productiva, API, notificación, oficialización o integración.

Las operaciones nuevas usan IDs sintéticos estables y se guardan en la sesión
local del navegador; Operaciones y Cliente leen esa misma fuente. El retorno
entre pasos conserva campos mientras la ruta está montada. Una recarga reinicia
el borrador no guardado; el registro creado permanece en la sesión.

## Responsive y accesibilidad

La progresión se apila en móvil; radios y selects tienen etiquetas, avance y
retroceso son operables por teclado, errores explican qué completar y no se usa
color como señal única. Axe es apoyo, no certificación WCAG 2.2 AA.

## Pruebas

- Directa: completar cliente/tipo/modalidad/equipo y ver el objeto en listados.
- Desde cotización: abrir versión aceptada y conservar su origen en la ficha.
- Rechazo: versión pendiente no habilita ese origen; alta directa continúa.
- Relaciones: operación nueva visible en Operaciones y Cliente sin publicar
  honorarios en la ficha común.
- Anchos: 390–1440 px sin overflow y acciones utilizables.

Etapa 5 integrada por [PR #12](https://github.com/Broco-Solutions/abt-comex/pull/12),
squash `fce2db4ab9f0877cfd23de48bf2ae1c2fb55499a`; `quality`, `e2e-smoke`,
Vercel Preview y producción READY. Rutas de alta, operación, cliente y
cotización respondieron HTTP 200. Gate local: lint, typecheck, build, 64
unitarias, 17 axe, 25 E2E smoke Chromium, validador documental y
`git diff --check`; capturas revisadas a 1440×1000 y 390×844. Revisión
funcional/visual integral pendiente.

## UX-06 — refinamiento

Cinco pasos comunes; las perspectivas sin capacidad comercial comienzan en Cliente/tipo y mantienen alta directa, sin una elección comercial inservible. El tipo contextual no habilita otro dominio por accidente. La revisión incorpora el límite de requisitos no configurados; no se pierde un control de negocio. Los campos se conservan al retroceder; validación propia enlaza error, aria-invalid y foco al campo.
