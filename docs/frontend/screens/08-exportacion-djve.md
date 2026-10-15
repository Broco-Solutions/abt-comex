# Exportación y DJVE — workspace y trámites relacionados

> Estado: Under review
>
> Etapa: 8 — Exportación y DJVE
>
> Owner funcional: pendiente de validación ABT
>
> Experiencias / recorridos: EXP-01, DJV-01, OPS-05; J3, J4, J6, J7, J10
>
> Rutas: `/operaciones/[operationId]/exportacion`, `/tramites/djve` y `/tramites/djve/[djveId]`

## Propósito y alcance

Relacionar el seguimiento propio de una Exportación con permisos, una DJVE
eventual, documentos y la continuidad administrativa. La DJVE aparece como
trámite autónomo, puede relacionar varios permisos y no se exige para todos.
El prototipo usa escenarios sintéticos, control local de doble revisión,
consulta/retorno entre objetos y estados informativos; no prepara ni oficializa
destinaciones, transmite trámites, registra archivos, emite facturas ni consulta
sistemas externos.

## Evidencia y trazabilidad

| Necesidad | Fuente / certeza | Tratamiento en este corte | Pendiente |
|---|---|---|---|
| EXP-001/002 | Alcance §4.3–4.4; matriz; evidencia E1/E4/E13; originales E16 localizados y con lectura integral pendiente | Reutiliza cliente, modalidad y operación; muestra permisos sintéticos con y sin DJVE | Datos, secuencia y requisitos por modalidad, mercadería y régimen |
| EXP-003/004 | Alcance §7.1 y matriz; regla de doble control documentada | Doble control local por dos personas distintas; no existe acción de oficialización | Evidencia, capacidades, reemplazos y criterios del sistema especializado |
| EXP-005 | Alcance §4.3/4.6; matriz; E16 localizado, no interpretado por completo | Separa legajo aduanero y originales para exterior; custodia física/digital explícitamente no registrada | Documentos, certificados, ubicación y responsables por caso |
| EXP-006/007; FIN-009 | Alcance §4.3/4.7 y matriz | Muestra facturación, cumplido, post-embarque y cierre como dimensiones separadas; no ejecuta el pase | Criterio de “lista para facturar”, aceptación, retornos y transiciones |
| DJV-001/002 | Alcance §4.4; matriz; síntesis E1 y evidencia E11/E12; originales E16 con inspección pendiente | Fixture autónomo sin Operación, DJVE con múltiples permisos y permiso sin DJVE | Datos mínimos, cardinalidad exacta, estados, alta y desvinculación |
| DJV-003/004 | Alcance y matriz; rango 90%–104% registrado como observación de un caso de granos | Cantidades sintéticas visibles, sin porcentaje, saldo calculado ni bloqueo | Fórmula, unidad, período, vigencia, redondeo, excepciones y aplicación |
| DOC-001/002; COV-002 | Alcance §4.6 y matriz | Diferencia contexto de documento/custodia del archivo real; comparte relaciones por IDs de fixture | Versionado, tipos, retención y fuente de verdad |

La evidencia original se conserva en la matriz. Archivos localizados o notas
de entrevista no significan validación formal de la solución por ABT. Los datos
de pantalla son ilustrativos, ficticios y no derivados de declaraciones reales.

## Información, capacidades y acciones

- La ficha toma cliente, modalidad, responsable y situación del fixture de
  Operación compartido. La entrada no expone honorarios, costos, cobranzas ni
  márgenes.
- Las personas del control son identidades de demostración. Registrar o
  reiniciar sólo cambia el estado en `sessionStorage`; no prueba segregación
  real, autenticación, auditoría o permiso.
- La oficialización continúa fuera de ABT Comex, en Alpha2000/MARÍA. No hay
  preparación aduanera ni acción que la simule.
- Las referencias de permiso, vencimientos y cantidades son sintéticas. Se
  conservan como atributos informativos; no se calcula porcentaje/saldo ni se
  deriva tolerancia o bloqueo.
- La instrucción y el provisorio no se muestran como ausentes del negocio: sólo
  se aclara que este fixture no trae sus datos y que la preparación permanece
  en Alpha2000/MARÍA.
- El registro usa una sola relación DJVE–permisos para la vista operativa y la
  eventual salida de Administración; no se duplican registros.
- No se habilita alta ni edición de DJVE en esta pasada: faltan datos mínimos,
  estados, responsables y reglas de vínculo validados. La DJVE autónoma
  existente en el fixture demuestra que no requiere una Operación previa; no
  equivale a un trámite iniciado ante un organismo.

## Navegación y contexto

- La ficha común de una Exportación, su bloque documental y el trabajo
  relacionado abren el workspace específico; se conserva el retorno a la ficha,
  lista filtrada o Mi trabajo.
- El workspace enlaza al registro de DJVE y permisos. Cada detalle relaciona
  permisos con la Exportación correspondiente y conserva retorno.
- Un ID desconocido, tipo incorrecto o `error=sin-permiso` no muestra datos del
  objeto; no confirma si existe.
- La pantalla DJVE no es una opción de navegación principal adicional.

## Reglas, estados y recuperación

| Regla / fuente | Respuesta de interfaz | ¿Bloquea y por qué? | Pendiente |
|---|---|---|---|
| EXP-003: dos personas distintas antes de oficializar | Impide completar el estado local con una o con identidades repetidas; distingue escenario completo | Sí en el proceso documentado; el prototipo no habilita oficialización | Evidencia, identidad, excepción y auditoría reales |
| EXP-004: oficialización/VEP según corresponda | Fuente externa “No conectada”; no muestra evento vigente | No agrega bloqueo aduanero inventado; proceso externo no ejecutable | Cobertura y condiciones por caso |
| DJV-001/002: trámite autónomo, relaciones múltiples y permisos sin DJVE | Muestra un fixture previo a Operación, dos permisos relacionados y un permiso sin DJVE | Ninguna cardinalidad adicional se impone | Modelo y operaciones permitidas |
| DJV-004: rango observado 90%–104% para granos | Muestra cantidades de fixture, sin porcentaje ni regla automática | No; no codificar como bloqueo ni universalizar observación | Validación funcional/normativa |
| EXP-006/007 y FIN-009 | Lista para facturar/facturada, cumplido, post-embarque y cierre documental permanecen separados | El prototipo no avanza ni infiere una situación a partir de otra | Criterios/transiciones con ABT |
| EXP-005 / DOC-001/002 | Legajo aduanero y sobre de originales para exterior aparecen separados; custodia real no registrada | No afirma documentación completa | Inventario, medios físico/digitales y responsables |

La fuente aduanera está no conectada: no consultar Alpha2000, ARCA/MOA o
Microsoft 365. Un error, ausencia de permiso o de referencia no prueba ausencia
de una destinación o evento real. Una factura de fixture no es factura emitida;
no se representa cobranza.

## Responsive, accesibilidad y ayuda

Los bloques y datos relacionados se apilan en mobile; las relaciones se leen
como filas compactas sin tabla de ancho fijo. El control tiene etiquetas
visibles, teclado nativo y estado anunciado; las acciones preservan retorno. Se
verifica overflow accidental a 390–1440 px y axe automatizado. Esto no equivale
a una auditoría manual WCAG 2.2 AA.

## Fuentes, fixtures y pruebas

Los fixtures `OP-DEM-*`, `DJVE-DEM-*` y `PE-DEM-*` son datos sintéticos
determinísticos. Incluyen Exportación facturada pero activa, un permiso sin
DJVE, una DJVE autónoma y una DJVE enlazada a más de un permiso. Las interacciones locales son el doble control y la recepción de referencias de copia, sin cambios a originales o eventos externos. No hay persistencia productiva, archivos, eventos externos ni reglas
de cantidad. Fuente visible: fixture local; Alpha2000/MARÍA y ARCA/MOA no
conectadas.

Escenarios: operación no exportadora/ID desconocido/sin permiso; doble control
con identidad repetida o distinta; factura y cumplido independientes; DJVE
autónoma; varios permisos; permiso sin DJVE; cantidades sin cálculo; vuelta
DJVE→Exportación; error/ausencia externos; viewports responsive y axe.

## Decisiones pendientes

- Campos mínimos, disparador y ciclo de vida para iniciar una DJVE.
- Catálogo de regímenes, permisos y requerimientos por modalidad/mercadería.
- Vencimientos, cantidades, fórmula, tolerancias y efecto de diferencias.
- Doble control: evidencia aceptada, capacidad, reemplazo y auditoría.
- Documentos por caso, separación/ubicación y custodia física y digital.
- Condición y aceptación del pase a Administración; referencia de factura y
  continuidad tras facturación.
- Cobertura, identificadores y frecuencia de Alpha2000/MARÍA; evaluar primero
  cumplidos a través de Alpha2000 y mantener ARCA/MOA directo condicionado.

## Implementación y revisión

- Features: `apps/web/features/exportation/`; rutas listadas arriba; enlaces
  desde ficha común y Mi trabajo con contexto de retorno preservado.
- Gate local: lint, typecheck, build; 71 unitarias, 21 axe y 34 E2E smoke
  Chromium (incluyen control, DJVE autónoma, relación múltiple, permiso sin
  DJVE, retorno, restricciones y responsive); validador documental (117 IDs,
  32 experiencias, 10 recorridos) y `git diff --check` pasan.
- Capturas Chromium revisadas en 1440×1000 y 390×844; E2E revisa 390–1440 px
  sin overflow horizontal. No equivale a auditoría WCAG manual.
- PR #14 integrado en `main` (`6ebc174394ad9b011a9f895ef54e76f58e0943cd`),
  checks requeridos verdes y deployment `dpl_F9bW7anLmQUhAUAmVZTJiKjjbTAE`
  READY. Las rutas de Exportación, DJVE, operación y Mi trabajo respondieron
  HTTP 200. Revisión funcional/visual integral y validación ABT pendientes.
- Estado de especificación y Etapa 8: `Under review`; no implica aprobación de
  ABT ni aptitud productiva.

## UX-01 — relaciones

PE-DEM-1404 referencia DJVE-DEM-2026-02. Los permisos son la autoridad relacional del fixture; DJVE deriva sus IDs de esa relación. PE-DEM-1403 conserva ausencia de DJVE. Sin tolerancias ni transiciones nuevas. Regresión bidireccional en work-projection.test.ts.

## UX-06 — documentación y colecciones relacionadas

Requisitos/copias se comparten con ficha y Portal cuando están expresamente habilitados; legajo aduanero y originales al exterior siguen separados. La recepción de copia no cambia custodia física, doble control, permiso, cumplido, factura ni cierre. Referencias de copias se consultan en diálogo de metadatos, no archivos aduaneros ficticiamente emitidos.

DJVE mantiene lista compacta, búsqueda/página/retorno en URL y diez registros por página; orden del fixture estable. Permisos relacionados permanecen contextualizados, sin sumar una tabla general innecesaria. Pruebas de diseño con 2/20/100 registros sintéticos, no volúmenes de ABT; documentación usa búsqueda y revelado progresivo para colecciones extensas, sin tabla paralela.
