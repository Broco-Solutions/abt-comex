# ABT Comex — Plan de implementación de Frontend

> Roadmap vivo · Última actualización: 14/10/2026

## Objetivo y siguiente corte

Construir todas las Etapas 2 a 13 como primera versión integral, demostrativa y navegable del frontend para validar procesos con ABT. Las Etapas 0 y 1 están cerradas y fusionadas. **Etapa 2 — Inicio y Mi trabajo** se integró a `main` mediante PR #7 (squash `9359921d3cd3fb568e9ce923d3790c63d8a30a2d`); permanece `Under review`, pendiente de revisión humana integral. La rama histórica del PR #6 había sido fusionada contra una rama de prueba y no incorporó el contenido a `main`; no se reimplementó. Ver [especificación](screens/02-inicio-mi-trabajo.md). **Etapa 3 — Listado de Operaciones** se integró mediante PR #8 (squash `a83de1577ab1962d6e66fc862b81ee82bce383d8`), checks verdes y deployment `dpl_ENeTwNJcYZSh7eT3RoSz6EfBWWPi` READY. **Etapa 4 — Detalle común** se integró por [PR #9](https://github.com/Broco-Solutions/abt-comex/pull/9) (squash `80d77148de31eb0dfc388f31ab7bfd1e0b2bef0f`), checks verdes y deployment `dpl_AqoCyjYC3CYEnwNwz86kA1VZi2P7` READY. **Etapa 6 — Clientes** se integró por [PR #10](https://github.com/Broco-Solutions/abt-comex/pull/10), squash `26f19d9963e5669b4e251216ce9f4674ab6dac5e`, checks `quality`, `e2e-smoke` y Vercel Preview verdes; deployment de `main` `dpl_8vmJ5fUR8bPm3qb4ymGrPVZsjr2S` READY y rutas HTTP 200. Las Etapas 2–4 y 6 permanecen `Under review`, sujetas a revisión humana integral.

## Gobierno y dependencias

Este plan es autoridad de orden, dependencias, entregables, gates, estado y cierre. Procedimiento, lectura proporcional y Ready/Done: [runbook](CODEX_RUNBOOK.md). UX/UI: [estándar](FRONTEND_STANDARD.md). Checks y evidencia: [estrategia de pruebas](TEST_STRATEGY.md). Código/fixtures: [arquitectura](../architecture/README.md).

La [matriz](MATRIZ_COBERTURA_FUNCIONAL.md) conserva necesidades, evidencia y certeza; el [mapa](MAPA_PANTALLAS_Y_RECORRIDOS.md) relaciona experiencias y recorridos. No agregan alcance ni reordenan este plan.

| Etapa | Dependencia de entrega / especificación |
|---|---|
| 0–1 | Base completada; [Shell](screens/01-foundation-application-shell.md), decisiones y evidencia de cierre al final de este plan. |
| 2 | Shell existente y gate G0; implementación integrada a `main`, Under review. Cuando existe destino profundo útil, Mi trabajo lo abre y conserva su contexto; acciones de proceso no disponibles se describen sin simularlas. |
| 3 | Fuente/criterios de búsqueda y G1; implementación integrada mediante PR #8 a `main`, checks requeridos verdes, Under review. El listado abre el detalle común y preserva retorno. |
| 4 | Listado y núcleo común G1; detalle común en implementación, [especificación](screens/04-operacion-detalle.md), Under review. Reutiliza fixture de Operaciones; no inventa datos de trámites, hitos, controles, estados ni datos económicos. |
| 5 | Núcleo común y maestros/cotización de Etapas 6/9, G2; especificación pendiente. Reutiliza sus fixtures y relaciones para alta directa o desde versión aceptada. |
| 6 | Núcleo y decisiones de maestros G2; especificación pendiente. |
| 7 | Listado/detalle/alta común, maestros y G3; especificación pendiente. |
| 8 | Núcleo común, maestros y G3; especificaciones Exportación/DJVE pendientes. |
| 9 | Maestros y G2; completa circuito comercial y conexión con Etapa 5; especificación pendiente. |
| 10 | Handoff de verticales, G4 y fuentes administrativas; especificación pendiente. |
| 11 | Datos operativos y administrativos, definiciones de métricas y G4; especificación pendiente. |
| 12–13 | Núcleo, identidad y visibilidad compartidas, G5; especificaciones pendientes. No implica backend autorizado hoy. |

Una dependencia de definición puede resolverse antes de implementar su módulo. Se conservan los IDs históricos 0–13; el orden de ejecución no tiene que coincidir con la numeración.

## Primera pasada integral del frontend

**Decisión interna del responsable del proyecto, 14/10/2026:** construir las Etapas 2 a 13 en sesiones extensas sucesivas. Secuencia recomendada evaluada: **2 → 3 → 4 → 6 → 9 → 5 → 7 → 8 → 10 → 11 → 12 → 13**. Adelantar Clientes y Cotizaciones al alta permite reutilizar datos y probar los dos caminos de apertura. No cambia alcance, IDs ni rutas aprobadas del Shell.

| Bloque / orden | Resultado y dependencia principal | Verificación antes de continuar |
|---|---|---|
| 2 | Resumen y bandeja con contexto temporal; Shell existente. | Conteos/visibilidad coherentes, retorno, estados y escenarios de su especificación. |
| 3 → 4 | Encontrar y comprender una operación; núcleo G1. | Lista → objeto → retorno; sustituir contexto temporal sólo con destino útil. |
| 6 → 9 → 5 | Cliente → cotización/versiones → alta, más creación directa; G2. | Reutilización sin doble carga y sin exigir cotización; separar aprobación interna de aceptación. |
| 7 → 8 | Verticales Impo/Expo y DJVE autónoma; G3. | Controles segregados, relaciones, documentos y cierres sin simular oficialización real. |
| 10 → 11 | Handoff administrativo y Dirección; G4. | Situaciones independientes, permisos económicos y métricas pendientes identificadas. |
| 12 → 13 | Portal y asistencia demostrativos; G5. | Visibilidad por canal, navegación y consultas de fixtures; sin identidad/integraciones reales. |

Aplicar [gates técnicos y documentales](TEST_STRATEGY.md#19-gate-de-etapa) por etapa dentro de cada bloque. No exigir revisión visual humana después de cada una; los cortes técnicamente terminados quedan `Under review` y se puede continuar. Registrar pruebas, limitaciones, supuestos y punto de reanudación en plan/especificación. La revisión humana integral es obligatoria antes de declarar aprobada la primera pasada. No aprobar reglas de negocio por completar un mock ni eludir bloqueos funcionales; procedimiento en el [runbook](CODEX_RUNBOOK.md#preparación-y-cierre).

### Contrato de demostración integral

- Fixtures sintéticos y anonimizados a partir de estructuras/relaciones observadas, no copias de datos reales. Su coherencia entre dominios se gobierna en [arquitectura](../architecture/README.md#frontend-y-frontera-de-datos).
- Navegación de punta a punta: al habilitar detalles, actualizar enlaces desde Inicio/Mi trabajo, clientes, cotizaciones, operaciones y Administración y probar retorno. Contexto temporal sólo mientras el destino no exista; no dejarlo como sustituto permanente al finalizar el recorrido correspondiente.
- Acciones locales del prototipo con efecto verificable, feedback y carácter demostrativo explícito. No representar como reales aprobaciones, oficializaciones, facturación, pagos, transferencias o integraciones. Sin enlaces rotos ni botones decorativos. Una acción real fuera del corte se explica como no disponible, no se finge ejecutada.
- Mantener Design System, Shell y marca; densidad útil, acciones contextuales, prevención de errores, responsive, WCAG 2.2 AA y referentes ya evaluados en el estándar.
- Aplicar [confidencialidad económica del alcance §7.2](../product/ALCANCE_FUNCIONAL.md#72-permisos-y-visibilidad) desde los fixtures y todas las vistas, no sólo Administración. Ninguna responsabilidad operativa concede acceso económico por inferencia.
- Portal y canales asistidos validan experiencias dentro del prototipo: no incluyen invitaciones reales, envío de mensajes, proveedor de IA ni servicios reales. Las segundas fases y escrituras futuras conservan sus condiciones de aprobación; no se vuelven obligaciones de esta primera pasada.

## Frontend demostrativo y producto operativo real

| Línea | Entrega verificable | Qué no acredita |
|---|---|---|
| A — Frontend integral demostrativo | Pantallas, acciones locales identificadas como prototipo, recorridos conectados, fixtures y pruebas de Etapas 2–13. Revisión humana integral al cierre. | Persistencia, autorización efectiva, datos externos disponibles o aptitud de producción. |
| B — Implementación operativa real | Arquitectura aprobada, backend/persistencia, identidad, permisos efectivos, contratos e integraciones, carga inicial desde fuentes aprobadas cuando corresponda, seguridad y pruebas con fuentes reales autorizadas. | No queda implementada ni autorizada por terminar A. |

La línea B no debe esperar necesariamente a terminar todo A: el relevamiento con ABT, contratos, identificadores, fuentes maestras, sensibilidad y decisiones de arquitectura pueden avanzar en paralelo a los bloques consumidores. Una implementación real posterior sólo se inicia con alcance/arquitectura/autorización definidos y pruebas correspondientes; las fronteras mock simples permiten sustituir fuentes sin anticipar capas o tecnología.

Dependencias operativas: validar capacidades antes de exponer datos reales; confirmar contratos antes de conectar; si se aprueba una carga inicial desde fuentes incluidas, validar mapeos y reconciliación antes de ejecutarla; verificar seguridad, recuperación, auditoría y aceptación de procesos antes de habilitar producción. No sumar una etapa frontend numerada para resolver estas líneas técnicas. Commit, push, merge y despliegue requieren autorización separada.

## Línea transversal de integraciones

Esta sección es autoridad de **seguimiento técnico**, no una etapa UI, componente, API confirmada ni nuevo alcance. La [matriz](MATRIZ_COBERTURA_FUNCIONAL.md#integraciones-y-transición) conserva necesidades INT/ALP y su evidencia; el [alcance §8](../product/ALCANCE_FUNCIONAL.md#8-sistemas-externos-y-fuentes-de-verdad) define inclusión y límites.

Referencia: [relevamiento original Alpha2000](https://docs.google.com/spreadsheets/d/1Q3jlt7kN1s5C_Hh6ALygyQmCIMkfvJT0968TIKratn8/edit), E5 de la matriz. Consulta de texto en sólo lectura el 14/10/2026: guía y encabezados de `Relevamiento`, sin filas de consultas/acciones. Debe completarse con ABT; los ejemplos de la guía no acreditan contratos ni habilitan emisión de facturas. No reproducir aquí el formulario ni los nueve registros ALP.

### Necesidad y alcance por frente

Alpha2000 es la integración prioritaria por decisión interna del responsable del proyecto. La prioridad fina de consultas y datos debe completarse con ABT. Fuente de verdad significa autoridad prevista por dato, no disponibilidad de API.

| Sistema / trazabilidad | Capacidad, proceso e información requerida | Operación deseada y fuente de verdad | Etapas consumidoras / prioridad de relevamiento |
|---|---|---|---|
| Alpha2000 / MARÍA — INT-001, ALP-001 a ALP-004, ALP-009 | Preparación y seguimiento Impo/Expo: destinaciones y regímenes Impo/Expo, referencias/números y fechas de oficialización, canal/estados, arribo/liberación, documentos/intervenciones, transporte, valores aduaneros, permisos de embarque, cumplidos cuando estén disponibles y novedades pertinentes; alcance por tipo/régimen a confirmar. | Lectura prioritaria externo → ABT; escritura no definida ni autorizada. Alpha2000/MARÍA para registros aduaneros; autoridad por campo y maestros a confirmar. | 3–8; contexto 2 y consumidores 10–13. Alta por dependencia operativa. |
| Alpha2000 administrativo — INT-001, ALP-005 a ALP-009 | Facturación/facturas por cliente, cobranzas, cuentas corrientes, compras/proveedores, órdenes de pago/retenciones, gastos/rendiciones e información contable y referencias para Dirección, vinculadas a clientes, operaciones y documentos. | Lectura propuesta externo → ABT; cualquier preparación/emisión/escritura requiere definición aparte. Alpha2000 conserva contabilidad/cuentas corrientes; gastos e imputaciones por dato pendientes. | 10–11, referencias autorizadas en 4/6/9. Alta por handoff y fuentes económicas. |
| Interbanking — INT-005, REP-007, REP-008, REP-018 | Evaluar consulta bancaria/tesorería: potenciales saldos, movimientos y otros datos sólo si se confirma disponibilidad. | Exclusivamente lectura propuesta externo → ABT. Autoridad bancaria por institución y dato por confirmar; sin transferencias, emisión/ejecución de pagos, operaciones con ECheqs, conciliación automática, escritura bancaria ni autorización de movimientos. | 10–11. Factibilidad previa; no compromiso de disponibilidad. |
| ARCA / MOA — INT-003 | Evaluar cumplidos y otros datos aduaneros necesarios. Caso inicial: Exportación. | Primero ARCA/MOA → Alpha2000 → ABT mediante API autorizada; directo ARCA → ABT sólo si la vía prioritaria no alcanza o existe justificación suficiente. Sin escritura ni dos conectores obligatorios. Fuente original identificada. | 7–8, referencias en 10–11. Evaluación subordinada a cobertura Alpha2000; no bloqueo del prototipo. |
| Microsoft 365 — INT-004 | Correo y documentos vinculados a operaciones, origen e historial; alcance de integración pendiente. | Consulta/vinculación a evaluar; envío, carga o archivado automático no autorizados. M365 conserva contenido de origen; relación con operación en ABT, autoridad/retención por definir. | 4, 7–10 y eventualmente 12. Complementaria; confirmar necesidad y alcance antes de conectar. |

### Seguimiento técnico por frente

Estado al 14/10/2026: los cinco frentes de seguimiento siguen **Pendiente de relevamiento**: hay necesidades documentadas, sin relevamiento completo con ABT. La documentación pública ARCA fue contrastada, pero la disponibilidad efectiva para ABT y los contratos de integración siguen pendientes en todos. La factibilidad preliminar Alpha2000 informada por el responsable no equivale a API disponible. Las direcciones anteriores son deseadas, no sincronizaciones implementadas. Frecuencia/SLA y responsable técnico/validador están pendientes en cada frente.

| Sistema | Identificadores a relacionar (definición pendiente) | Permisos/sensibilidad | Errores, fallback y pruebas requeridas | Bloqueo o próxima decisión | Estado |
|---|---|---|---|---|---|
| Alpha2000 / MARÍA | Clave externa de destinación/despacho/permiso, operación y maestros ABT; distinguir referencia visible de ID estable. | Acceso aduanero por proceso; valores/tributos separados de honorarios según alcance §7.2. | Dato ausente, parcial, stale, error o sin permiso; mantener origen/fecha sin inferir oficialización. Probar mapeo, unidades/monedas, estados, duplicados y vínculo Impo/Expo. | Completar E5 con ABT/proveedor; confirmar consultas, muestras autorizadas, frecuencia e IDs. | Pendiente de relevamiento |
| Alpha2000 administrativo | Comprobantes, cliente/proveedor, operación, imputación, cobranza, pago/rendición. | Separar las categorías económicas de §7.2; no distribuir información contable a perfiles operativos. | No inferir facturada/cobrada por ausencia de respuesta. Probar vínculos, moneda/período, consistencia, repetición de lecturas y pruebas negativas de acceso. | Completar E5; acordar fuente por dato, fechas de corte, dirección y eventual escritura por caso. | Pendiente de relevamiento |
| Interbanking | Institución, cuenta e ID de movimiento; vínculo contable sólo al definirse. | Consulta bancaria específica, credenciales y consentimiento por definir; sin exposición en logs/fixtures. | No mostrar saldo cero si falta conexión. Probar no conectada, datos parciales/stale, permisos y moneda/fecha; demostrar ausencia de comandos de pago. | Factibilidad, disponibilidad de cada dato, acceso/contrato, frecuencia y límites; conciliación no asumida. | Pendiente de relevamiento |
| ARCA / MOA (vías alternativas) | Permiso/destinación, cumplido y operación; validar correspondencia con IDs Alpha2000. | Acceso mediado según contrato Alpha2000; directo sujeto a certificado, WSAA, CUIT/relaciones, carácter y permisos efectivos. | Cumplido desconocido no equivale a incumplido. Probar correspondencia, origen/intermediario, frescura, errores, diferencias y acceso en la vía elegida. | Primero confirmar cobertura/costos Alpha2000; justificar alternativa directa y validar dependencias siguientes si es necesaria. | Pendiente de relevamiento |
| Microsoft 365 | IDs de mensaje/archivo/versión y operación; asociación inequívoca. | Acceso a buzón/archivo no concede acceso económico; definir consentimiento, herencia, retención y revocación. | Referencia eliminada, revocada o inaccesible sin filtrar contenido. Probar vínculo, versiones, revocación, duplicados y recuperación sin envío real. | Definir lectura/escritura, archivo vs enlace, acceso/contrato y frecuencia; no asumir integración de correo. | Pendiente de relevamiento |

Al relevar cada consulta/acción, actualizar su frente con disponibilidad técnica, enlace a contrato/API confirmado, IDs, dirección y frecuencia, fuente maestra, capacidades, errores/fallback, pruebas, responsable, estado, bloqueo y evidencia/fecha. El detalle campo a campo permanece en el relevamiento/contrato autorizado enlazado, no duplicado en Markdown. Mientras no exista evidencia nueva, los pendientes comunes anteriores aplican a cada fila.

### Evidencia Alpha2000 y vías para MOA

E17 de la matriz registra **información aportada por el responsable del proyecto en esta sesión**: hubo reunión inicial con predisposición y viabilidad preliminar para estudiar la integración; el proveedor explicó complejidad por régimen/tipo y posibilidad de desarrollar endpoints específicos con datos procesados. Fecha de reunión y acta no aportadas; no se atribuye a una reunión presenciada ni a una prueba de Codex. Necesidad funcional de integrar confirmada internamente; alcance de datos, API documentada/habilitada/contratada, condiciones comerciales y pruebas técnicas siguen pendientes.

| Alternativa | Evaluación y ventajas potenciales | Condiciones / decisión pendiente |
|---|---|---|
| A — Alpha2000 primero | API autorizada del proveedor, posiblemente con datos MOA procesados. Podría reducir mecanismos de autenticación, consultas y transformaciones duplicadas, aprovechar conocimiento aduanero y simplificar correspondencias de IDs/estados. Son hipótesis, no garantías. | Confirmar datos/origen, actualidad, costo, latencia, frecuencia, regímenes cubiertos, disponibilidad, redistribución y responsabilidad ante errores. |
| B — ARCA directo condicionado | Web Services oficiales autorizados sólo si A no cubre la necesidad o existe justificación técnica/funcional suficiente. | Definir acceso, seguridad, mantenimiento y alcance por consulta. No crear por defecto un segundo conector para el mismo dato ni una dependencia simultánea. |

La [ficha pública de Alpha Comex Movil](https://play.google.com/store/apps/details?hl=es_MX&id=alphacomexmovil.alphacomexmovil), consultada el 14/10/2026 (E19), atribuye sus datos a MOA Reingeniería; muestra actualización 18/06/2025. Esto sugiere experiencia del proveedor con esa fuente, **no** demuestra Web Service utilizado, API para terceros, permiso de redistribución, acceso ABT ni frescura garantizada. La URL original sin parámetro de idioma falló; se verificó la misma ficha en español de México.

### Verificación documental ARCA y límites

Consulta focalizada del 14/10/2026, E18: el [índice oficial MOA](https://www.arca.gob.ar/moa/ayuda/manuales.asp) enlaza ambos manuales de `wconsdeclaracion`. No se consultó ningún servicio de negocio.

- [Manual del desarrollador](https://www.arca.gob.ar/moa/documentos/nuevos/ManualDesarrolladorWconsdeclaracion.pdf): documenta `DetalladaEstado`, `DetalladaDocumentos`, `BloqueosLista`, `BloqueosIntervenciones`, `DestinacionesExpoCumplidasLista`, `Intervenciones3OrgLista` e `Intervencion3OrgDetalle`. Incluye ambientes Testing/Producción, autenticación, parámetros y errores. Su historial llega a 2.6.0, pero presenta fechas no cronológicas y portada 24/10/2022: publicación accesible no acredita vigencia operativa actual.
- [Manual del usuario externo](https://www.arca.gob.ar/moa/documentos/nuevos/ManualAFIPUsuariosExternoswconsDeclaracion.pdf): historial hasta 1.7 del 03/10/2023; describe homologación, WSAA/ticket/certificado, delegación por Administrador de Relaciones y tipos de agente habilitados. No atribuir esas condiciones de homologación como permiso productivo de ABT.
- Evidencia basada en secciones textuales relevantes, no auditoría integral de los manuales. La captura del manual desarrollador falló; revisar contrato/WSDL y discrepancias con el organismo antes de implementar. No se comprobó disponibilidad, SLA, límites de uso ni autorización efectiva.

**Dependencias a resolver si se elige B:** certificado digital y mecanismo WSAA; CUIT autorizado; relaciones/delegaciones; rol/carácter y destinaciones consultables por método; separación de homologación/producción; condiciones técnicas/operativas, límites y disponibilidad; permisos efectivos; responsable de custodia, renovación/revocación de credenciales, seguridad y auditoría sin secretos en logs. Esto es checklist de evaluación, no habilitación. No generar certificados, pedir/guardar secretos, probar destinaciones reales ni crear cliente SOAP en esta etapa documental.

**Caso prioritario — cumplido de Exportación:** relevar con ABT referencia de destinación, estado/fecha de cumplido, conformidad y diferencias necesarias, origen, última actualización y errores; vincular con permiso de embarque y post-embarque sin equipararlos a factura, cobranza o cierre documental. El manual desarrollador documenta fecha, indicador de conformidad y cantidades declaradas/cumplidas en la respuesta del método de cumplidos; menciona un máximo de 30 días cuando se consulta por fechas. Debe verificarse contrato vigente y cobertura por régimen; no transformar ejemplos/códigos en estados o reglas ABT. Separar fecha del evento de fecha de consulta y actualización. Ausencia, error o falta de permiso no prueban ausencia de cumplido.

### Preguntas priorizadas para Leandro / Alpha2000

No enviadas en esta sesión. Registrar respuestas, fecha, interlocutor y evidencia en E5/contrato autorizado; no completar con hipótesis. Orden: primero resolver cobertura y condiciones, luego detalle técnico y eventual prueba.

**Negocio, cobertura y condiciones**

1. ¿Qué datos de MOA consultan hoy y cuáles pueden exponer para ABT Comex?
2. ¿Pueden entregar estado, fecha y conformidad/diferencias del cumplido de Exportación? ¿Qué otros eventos, fechas y documentos?
3. ¿Cuál es la fuente de cada dato — ARCA/MOA o registro propio — y qué cambia por tipo/régimen?
4. ¿Qué costos, condiciones comerciales y restricciones de redistribución de información ARCA/MOA se aplicarían?
5. ¿Qué información administrativa/contable pueden exponer, separando lectura y eventual escritura?

**Técnicas y prueba condicionada**

6. ¿Pueden preparar endpoints específicos con información procesada? ¿Qué contrato/documentación y cobertura tendrían?
7. ¿Qué identificadores permiten vincular destinación, permiso, cliente, comprobante y operación ABT?
8. ¿Qué autenticación, permisos, restricciones y responsabilidades de custodia aplican?
9. ¿Qué frecuencia, latencia, fecha de actualización, disponibilidad y manejo de errores ofrecen?
10. ¿Podemos acordar una prueba con una destinación real expresamente autorizada por ABT, con entorno, datos mínimos y criterios de aceptación definidos previamente? Esta pregunta no autoriza ejecutarla ahora.

COMEX360 queda fuera de este seguimiento objetivo por la [exclusión del alcance](../product/ALCANCE_FUNCIONAL.md#exclusión-de-comex360). Su evidencia histórica se conserva en INT-002; no tiene conector, migración programada ni gate técnico. Esta estrategia no bloquea el frontend demostrativo con fixtures coherentes y estados explícitos.

### Estados de integración y evidencia

| Estado | Evidencia mínima para usarlo |
|---|---|
| Pendiente de relevamiento | Necesidad identificada; faltan consultas/acciones o actores/datos. |
| Relevada | Casos, datos, uso, fuente y responsable documentados con ABT; no implica factibilidad. |
| En análisis técnico | Revisión efectiva de acceso, disponibilidad, seguridad e identificadores registrada. |
| Contrato definido | Contrato enlazado con campos, operaciones, dirección/frecuencia, permisos y errores acordados. |
| Lista para implementar | Contrato, arquitectura, accesos de prueba, autorización y criterios de aceptación resueltos. |
| En implementación | Trabajo real iniciado con alcance y evidencia registrados. |
| En pruebas | Conector disponible en entorno autorizado, ejecutando pruebas del contrato y seguridad. |
| Validada | Resultados con fuentes reales autorizadas y aceptación técnica/funcional registradas: responsable, fecha, entorno y alcance. No equivale automáticamente a habilitación productiva. |
| Bloqueada | Impedimento concreto, responsable de resolución y condición de salida; conservar último avance. |

Estos estados no son estados UI ni de etapa. Las fuentes externas en el frontend admiten **no conectada, desactualizada, parcial, error y sin permiso**, según el estándar. Un fixture, pantalla o prueba de mock no valida una integración. Ningún frente está conectado o validado por esta planificación.

## Etapa 0 — Frontend Foundation

Objetivo cumplido: base de pruebas, CI, documentación, estructura mínima y atribución de marca. No incluyó rutas de producto ni Shell.

Entregables históricos: Vitest/Testing Library/axe/Playwright, scripts y pruebas de referencia, helper de render, frontera mock sin módulos vacíos, assets y BrandAttribution. Convenciones y limitaciones: [TEST_STRATEGY §20](TEST_STRATEGY.md#20-implementación-inicial), [marca](BRAND_USAGE.md) y [decisión del 09/10](DECISIONS.md#2026-10-09--infraestructura-de-pruebas-de-frontend). No volver a ejecutar el setup como próximo trabajo.

## Etapa 1 — Application Shell e infraestructura de experiencia

Objetivo cumplido: navegación interna, contexto y ayuda base sin reglas profundas de módulos. Entregables efectivos, rutas aprobadas, responsive, onboarding, pruebas y revisión: [especificación Shell](screens/01-foundation-application-shell.md). Estado y evidencia de cierre: al final de este plan.

Búsqueda global e identidad de usuario quedaron diferidas explícitamente; no son entregables completados. La revisión de Etapa 2 preserva Shell, rutas y marca.

---

## Etapa 2 — Inicio y Mi trabajo

### Objetivo

Validar el modelo mental principal:

- Inicio: qué requiere atención.
- Mi trabajo: qué debe hacer la persona.

### Entregables

Inicio:

- situación operativa y casos que requieren atención;
- próximos vencimientos;
- controles, revisiones y aprobaciones;
- actividad relevante;
- resúmenes accionables con acceso al registro o conjunto filtrado;
- fuente, origen y frescura cuando afecten una decisión;
- contenido condicionado por capacidades mock, sin información sensible por defecto;
- acceso “Ver todo en Mi trabajo” desde el resumen de trabajo accionable.

Mi trabajo:

- acciones asignadas y tareas;
- revisiones y aprobaciones;
- controles bloqueantes y no bloqueantes diferenciados;
- excepciones y motivos;
- próximos a vencer y vencidos;
- trabajo administrativo o preliminar sin Operación;
- filtros coherentes con Inicio y retorno al objeto de origen.

### Gate

- en menos de 10 segundos se entiende qué requiere atención;
- cada elemento tiene contexto, responsabilidad y vencimiento conocidos o ausencia explícita, y una acción útil disponible;
- Inicio resume; Mi trabajo contextualiza y habilita sólo las acciones del corte;
- Inicio y Mi trabajo son destinos principales separados y consecutivos;
- resúmenes, conteos y filtros comparten una fuente conceptual;
- se prueban vacío, filtered-empty, sin permiso, dato desactualizado y error recuperable;
- la implementación respeta `screens/02-inicio-mi-trabajo.md` y no inventa perfiles definitivos.

### Cierre técnico y estado

Integrada a `main` por PR #7 (squash `9359921d3cd3fb568e9ce923d3790c63d8a30a2d`); CI pasó, al igual que validaciones locales de lint, typecheck, unitarias (42), accesibilidad (8), build y E2E smoke Chromium (15). Deployment de `main` READY. Etapa `Under review`; revisión humana pendiente. El dominio de demostración está excluido de Vercel SSO y no debe considerarse privado.

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
- sin totales económicos genéricos; valores aduaneros sólo cuando sean necesarios y autorizados según alcance §7.2;
- estados alternativos;
- mobile resumido/expandible;
- navegación al detalle.

### Gate

- encontrar una Operación es rápido;
- etapa, situaciones y responsable se distinguen;
- no hay columnas cortadas;
- no hay scroll horizontal normal;
- filtros sobreviven recarga y retorno cuando corresponde.

### Implementación y gate local

La primera pasada usa fixtures determinísticos y sintéticos, filtros/orden/grupo/página en URL, selección y columnas visibles temporales de sesión, rango de fechas, DataTable compartido en escritorio y registros compactos en mobile. La referencia abre `/operaciones/[operationId]` y preserva retorno; `views` guardadas quedan fuera hasta validación. PR #8 y PR #9 están integrados; lint/typecheck, 49 unitarias, 12 axe, build, validador documental y 17 E2E smoke Chromium seriales pasan. Se verificó visualmente esta ficha a 1440×1000 y 390×844, sin overflow horizontal. La revisión visual humana integral sigue pendiente.

---

## Etapa 4 — Detalle común de Operación

### Objetivo

Definir el contexto común de la operación antes de especializar Impo y Expo. Reutilizar IDs sintéticos estables; el resumen no implica un catálogo de estados aprobado ni sistemas externos conectados.

### Entregables

- cabecera estable;
- cliente, tipo, estado general, etapa, responsable y situaciones;
- bloque “qué sigue”;
- resumen;
- seguimiento/hitos;
- documentación;
- controles;
- Administración relacionada, separada por capacidades económicas según alcance §7.2, sin acceso implícito por ser responsable o jefe;
- actividad (no disponible mientras no exista una fuente de eventos);
- acciones contextuales sólo con destino existente; acciones de negocio aún no habilitadas se explican y deshabilitan.

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

1. origen: directa o desde una versión de Cotización aceptada por el cliente;
2. Cliente y tipo;
3. contexto inicial;
4. responsables;
5. requisitos derivados;
6. revisión.

### Gate

- no hay campos innecesarios;
- reutiliza información conocida;
- sólo convierte una versión aceptada, sin asumir cardinalidad uno a uno;
- muestra origen de datos;
- permite volver sin perder;
- detecta inconsistencias obvias;
- mensajes claros y accionables.

---

## Etapa 6 — Clientes

### Objetivo

Definir contexto maestro reutilizable mediante relaciones explícitas entre los
fixtures de Cliente y Operación; esta pasada no crea ni modifica registros.

### Entregables

- listado;
- detalle;
- datos y contactos;
- Operaciones;
- Cotizaciones;
- actividad;
- configuraciones/requisitos sólo validados.

La primera pasada técnica cubre consulta sintética de clientes, búsqueda por
nombre/referencia, ficha read-only y operaciones relacionadas por `clientId`.
Los contactos son etiquetas ficticias sin datos personales. Cotizaciones,
documentos, actividad y configuración no se simulan mientras sus datos,
campos y reglas no estén definidos; la ficha explicita esos límites. La
actualización de maestros y los participantes de operación se completan en
sus etapas consumidoras y sólo con definiciones validadas.

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
- DJVE como trámite que puede existir antes de una Operación;
- múltiples permisos/operaciones relacionados y permisos sin DJVE;
- pase a Facturación;
- cumplido;
- post-embarque;
- custodia documental.

### Gate

- Operación puede estar facturada y seguir activa;
- DJVE no se fuerza como Operación;
- el doble control bloquea la oficialización y requiere dos personas diferentes;
- el pase a Facturación no espera cumplido ni post-embarque;
- el rango 90%-104% observado para DJVE de granos no se codifica hasta validar fórmula, contexto, vigencia y efecto bloqueante;
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
- aprobación interna;
- envío al cliente;
- aceptación o rechazo del cliente;
- creación de Operación desde la versión aceptada.

### Estado de esta pasada

Implementación demostrativa en revisión técnica: lista y ficha con filtros en
URL, formulario de borrador/versiones, cálculo explícito cantidad × unitario e
hitos locales separados. Los eventos se conservan por versión en sesión; no se
envía ni aprueba realmente. La conversión está deshabilitada hasta Etapa 5.
Campos, fórmulas adicionales, permisos efectivos, canal/evidencia y cardinalidad
siguen pendientes de validación con ABT.

### Gate

- cantidad × unitario produce total;
- no se envía sin aprobación;
- aprobación interna y aceptación del cliente no se confunden;
- versiones se entienden;
- nueva versión conserva el historial anterior y comienza con hitos pendientes;
- aceptación de la versión no simula conversión hasta completar Etapa 5; la
  cardinalidad cotización→operaciones queda pendiente.

---

## Etapa 10 — Administración y Finanzas

### Objetivo

Diseñar pase operativo-administrativo sin duplicar Alpha2000.

### Cobertura

- por revisar;
- con pendientes;
- listas para facturar;
- facturadas;
- cobradas;
- diferencias;
- honorarios;
- gastos/anticipos/rendiciones;
- referencias externas;
- necesidades de fondos.

### Gate

- “lista para facturar” es explícita;
- lista para facturar, facturada, cobrada, cumplida, post-embarque y cerrada documentalmente son situaciones distintas;
- el pase a Facturación puede preceder al cumplido y al post-embarque;
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
- impuestos, compras y proveedores;
- bancos, movimientos financieros y ECheqs;
- cuentas corrientes, pagos, vencimientos y flujo de caja;
- períodos;
- reportes definidos.

### Gate

- cada indicador validado permite drill-down;
- no replica `2025ABT.xlsx`;
- los 18 bloques observados en `2025ABT.xlsx` tienen cobertura, fuente y validación pendiente explícitas;
- fórmulas/fuentes explícitas y no declaradas definitivas antes de validación;
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

## Gates de planificación

### Dependencias de planificación integral

Se conservan los IDs de Etapas 0 a 13 y el estado aprobado de Etapas 0 y 1. La secuencia integral anterior cambia el orden de ejecución, no la identidad de las etapas. Los gates bloquean decisiones difíciles de revertir; no impiden prototipos con fixtures cuando los supuestos estén identificados, sean reemplazables y no se presenten como reglas aprobadas.

| Gate | Debe estar validado antes de | Motivo |
|---|---|---|
| G0 — Inicio y Mi trabajo | Compromiso funcional de Etapa 2 | Revisar `screens/02-inicio-mi-trabajo.md`, validar que los fixtures no atribuyan perfiles o información sensible reales y registrar preguntas abiertas. Las fuentes externas no accesibles no bloquean el prototipo documental ni un mock reversible. |
| G1 — núcleo de operación | Contratos, rutas definitivas y reglas irreversibles de Etapas 3, 4 y 5 | Cerrar ID, cardinalidades, estados, transiciones, responsables, permisos y auditoría comunes. Los prototipos pueden usar identificadores y estados explícitamente ficticios. |
| G2 — datos maestros y cotización | Persistencia o automatización de Etapas 5, 6 y 9 | Definir reutilización de clientes, versionado, cálculo, aprobación interna, respuesta del cliente y cardinalidad versión aceptada→operaciones. |
| G3 — Importación, Exportación y DJVE | Automatización o bloqueo de Etapas 7 y 8 | Validar requisitos variables, evidencia del doble control, custodia, cardinalidades DJVE/permiso/operación, fórmula observada de granos y criterios de cierre. La regla confirmada de dos personas antes de oficializar se conserva. |
| G4 — Administración y fuentes externas | Cálculos, sincronización o escritura de Etapas 10 y 11 | Completar Alpha2000 campo a campo y evaluar cobertura de cumplidos/MOA, criterios de pase y fórmulas/fuentes de los 18 bloques de Dirección. Las maquetas pueden representar estados sin simular disponibilidad externa. |
| G5 — canales externos | Publicación o acciones de Etapas 12 y 13 | Definir identidad, visibilidad, servicios compartidos, casos asistidos y auditoría de acciones. |

La secuencia integral adelanta Clientes y Cotizaciones al alta; las definiciones de negocio aún pendientes no se dan por cerradas con esos mocks. Etapa 2 no habilita acciones de negocio reales ni resuelve las decisiones abiertas del gate G0.

## Estado de etapas

| Etapa | Estado |
|---|---|
| 0 — Frontend Foundation | Complete with environment limitation |
| 1 — Application Shell | Complete with environment limitation |
| 2 — Inicio y Mi trabajo | Under review |
| 3 — Operaciones listado | Under review |
| 4 — Operación detalle | Under review |
| 5 — Crear Operación | Pendiente |
| 6 — Clientes | Under review |
| 7 — Importación | Pendiente |
| 8 — Exportación/DJVE | Pendiente |
| 9 — Cotizaciones | Under review |
| 10 — Administración/Finanzas | Pendiente |
| 11 — Gestión/Dirección | Pendiente |
| 12 — Portal | Pendiente |
| 13 — Canales asistidos | Pendiente |

### Implementación y gate técnico de Etapa 6

Ficha y listado en `apps/web/features/clients`, rutas `/clientes` y
`/clientes/[clientId]`. PR #10 integrado en `main`; checks requeridos verdes,
deployment de producción `dpl_8vmJ5fUR8bPm3qb4ymGrPVZsjr2S` READY y ambas rutas
respondieron HTTP 200. Los registros y contactos son sintéticos; las
operaciones comparten `clientId` estable. La búsqueda y el retorno de ficha
quedan en URL. No hay alta/edición, documentos, actividad, configuración de
requisitos ni seguridad productiva. Etapa 9 añade un enlace filtrado a
Cotizaciones, sin revelar valores en la ficha de Cliente. Revisión humana
funcional y visual integral pendiente.

### Implementación y gate técnico de Etapa 9

Lista, ficha versionada y editor en `apps/web/features/quotes`; rutas bajo
`/cotizaciones`. Datos enteramente sintéticos, cambios de workflow en sesión
local y retorno Cliente↔Cotización preservado. Gate local: lint/typecheck/build;
63 unitarias/componentes; 16 axe; 22 E2E smoke Chromium; validador documental
(117 IDs, 32 experiencias, 10 recorridos); `git diff --check`. Capturas
revisadas manualmente en Chromium a 1440×1000 y 390×844; E2E midió ausencia de
overflow entre 390 y 1440 px. Etapa 5 aún no implementada: conversión
deliberadamente deshabilitada. Datos comerciales, capacidades y acciones son
demostrativos, no autorización o auditoría reales. PR/despliegue de Etapa 9
pendientes; revisión humana integral pendiente.

## Evidencia de cierre

La revisión visual humana de **Etapa 1 — Application Shell e infraestructura de
experiencia** fue aprobada el 10/10/2026 y su Pull Request fue fusionado en
`main`. Esta aprobación corresponde a la experiencia del Shell y no resuelve
las decisiones funcionales pendientes de ABT para los módulos futuros.

Chromium cubre localmente los recorridos E2E y snapshots selectivos del Shell.
Firefox y WebKit siguen sin una ejecución local concluyente por dependencias
del host; esta limitación del entorno no constituye un fallo comprobado del
producto. La matriz de esos navegadores queda pendiente de un entorno apto.

### Evidencia de cierre de Etapa 0

Chromium pasó localmente y en CI. Firefox y WebKit continúan limitados por
dependencias disponibles en el host; no existe una falla conocida del código
asociada a esos navegadores.
