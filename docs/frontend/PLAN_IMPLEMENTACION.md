# ABT Comex — Plan de implementación de Frontend

> Roadmap vivo · Última actualización: 14/10/2026

## Objetivo y siguiente corte

Construir todas las Etapas 2 a 13 como primera versión integral, demostrativa y navegable del frontend para validar procesos con ABT. Las Etapas 0 y 1 están cerradas y fusionadas. **Etapa 2 — Inicio y Mi trabajo** se integró a `main` mediante PR #7 (squash `9359921d3cd3fb568e9ce923d3790c63d8a30a2d`); permanece `Under review`, pendiente de revisión humana integral. La rama histórica del PR #6 había sido fusionada contra una rama de prueba y no incorporó el contenido a `main`; no se reimplementó. Ver [especificación](screens/02-inicio-mi-trabajo.md). **Etapa 3 — Listado de Operaciones** se integró mediante PR #8 (squash `a83de1577ab1962d6e66fc862b81ee82bce383d8`), checks verdes y deployment `dpl_ENeTwNJcYZSh7eT3RoSz6EfBWWPi` READY. **Etapa 4 — Detalle común** se integró por [PR #9](https://github.com/Broco-Solutions/abt-comex/pull/9) (squash `80d77148de31eb0dfc388f31ab7bfd1e0b2bef0f`), checks verdes y deployment `dpl_AqoCyjYC3CYEnwNwz86kA1VZi2P7` READY. **Etapa 6 — Clientes** se integró por [PR #10](https://github.com/Broco-Solutions/abt-comex/pull/10), squash `26f19d9963e5669b4e251216ce9f4674ab6dac5e`, checks `quality`, `e2e-smoke` y Vercel Preview verdes; deployment de `main` `dpl_8vmJ5fUR8bPm3qb4ymGrPVZsjr2S` READY y rutas HTTP 200. **Etapa 9 — Cotizaciones** se integró por PR #11 (`1645bfc1094451447803c2f12af0f3ed7306a6af`). **Etapa 5 — Creación guiada** se integró después por [PR #12](https://github.com/Broco-Solutions/abt-comex/pull/12), squash `fce2db4ab9f0877cfd23de48bf2ae1c2fb55499a`, checks verdes y producción READY (`dpl_4swVdkXeUzdYsGES5miqqaQro87u`); alta, ficha, cotización y cliente respondieron HTTP 200. Las Etapas 2–12 permanecen `Under review`, sujetas a revisión humana integral.

**Checkpoint vigente 14/10/2026:** Etapa 11 (Gestión/Dirección) se integró mediante PR #16, squash `90d57e5435c9bc33ae7a68987b9ae22d4ab9a924`, checks requeridos verdes y producción READY (`dpl_6LEHNRCpwjXNCFbbsxZKYGLrRHss`). Etapa 12 (Portal) se integró por [PR #17](https://github.com/Broco-Solutions/abt-comex/pull/17), squash `ca34079e1fd785123a449abb09395bc999ab5343`, checks y Preview verdes; producción READY (`dpl_3Yzg3jawp7e3NK2Hi2CtqwUMso3E`) y rutas HTTP 200. Etapa 13 (Canales asistidos) se integró por [PR #18](https://github.com/Broco-Solutions/abt-comex/pull/18), squash `5cc7babbcc5c7f338c3631232676522fc59fff0b`, checks requeridos verdes y producción READY (`dpl_1ejhgDTEXbAidpiVyn7fLpN3FJVd`); `/operaciones/op-demo-2054` y `/portal/acceso` respondieron HTTP 200. Las Etapas 2–13 permanecen `Under review`, sujetas a revisión humana integral. Los previews requieren SSO; el dominio personalizado continúa públicamente accesible y no debe considerarse privado.

## Gobierno y dependencias

Este plan es autoridad de orden, dependencias, entregables, gates, estado y cierre. Procedimiento, lectura proporcional y Ready/Done: [runbook](CODEX_RUNBOOK.md). UX/UI: [estándar](FRONTEND_STANDARD.md). Checks y evidencia: [estrategia de pruebas](TEST_STRATEGY.md). Código/fixtures: [arquitectura](../architecture/README.md).

La [matriz](MATRIZ_COBERTURA_FUNCIONAL.md) conserva necesidades, evidencia y certeza; el [mapa](MAPA_PANTALLAS_Y_RECORRIDOS.md) relaciona experiencias y recorridos. No agregan alcance ni reordenan este plan.

| Etapa | Dependencia de entrega / especificación                                                                                                                                                                                                                |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0–1   | Base completada; [Shell](screens/01-foundation-application-shell.md), decisiones y evidencia de cierre al final de este plan.                                                                                                                          |
| 2     | Shell existente y gate G0; implementación integrada a `main`, Under review. Cuando existe destino profundo útil, Mi trabajo lo abre y conserva su contexto; acciones de proceso no disponibles se describen sin simularlas.                            |
| 3     | Fuente/criterios de búsqueda y G1; implementación integrada mediante PR #8 a `main`, checks requeridos verdes, Under review. El listado abre el detalle común y preserva retorno.                                                                      |
| 4     | Listado y núcleo común G1; detalle común integrado a `main` por PR #9, Under review; [especificación](screens/04-operacion-detalle.md). Reutiliza fixture de Operaciones; no inventa datos de trámites, hitos, controles, estados ni datos económicos. |
| 5     | Núcleo común y maestros/cotización de Etapas 6/9, G2; especificación e implementación integradas a `main`, Under review. Reutiliza sus fixtures y relaciones para alta directa o desde versión aceptada.                                               |
| 6     | Núcleo y decisiones de maestros G2; implementación y especificación integradas a `main`, Under review.                                                                                                                                                 |
| 7     | Listado/detalle/alta común, maestros y G3; workspace integrado a `main` por PR #13, Under review; ver evidencia al final del plan y [especificación](screens/07-importacion.md).                                                                       |
| 8     | Núcleo común, maestros y G3; [especificación Exportación/DJVE](screens/08-exportacion-djve.md), implementación integrada a `main` por PR #14, checks verdes y producción READY; Under review.                                                          |
| 9     | Maestros y G2; circuito comercial conectado al alta de Etapa 5; implementación integrada a `main` por PR #11, checks verdes, Under review; [especificación](screens/09-cotizaciones.md).                                                               |
| 10    | Handoff de verticales, G4 y fuentes administrativas; [especificación](screens/10-administracion-finanzas.md), integrado a `main` mediante PR #15, checks/deployment READY; Under review.                                                               |
| 11    | Datos operativos y administrativos, definiciones de métricas y G4; [especificación](screens/11-gestion-direccion.md), PR #16 integrado a `main`, checks/deployment READY; Under review.                                                                |
| 12    | Núcleo, identidad y visibilidad compartidas, G5; [especificación](screens/12-portal-clientes.md), PR #17 integrado a `main`; identidad y permisos sólo demostrativos, Under review.                                                                    |
| 13    | Canales asistidos y G5; [especificación](screens/13-canales-asistidos.md), PR #18 integrado a `main`; consultas locales determinísticas, sin proveedor IA, canal, backend ni acciones reales; Under review.                                            |

Una dependencia de definición puede resolverse antes de implementar su módulo. Se conservan los IDs históricos 0–13; el orden de ejecución no tiene que coincidir con la numeración.

## Primera pasada integral del frontend

**Decisión interna del responsable del proyecto, 14/10/2026:** construir las Etapas 2 a 13 en sesiones extensas sucesivas. Secuencia recomendada evaluada: **2 → 3 → 4 → 6 → 9 → 5 → 7 → 8 → 10 → 11 → 12 → 13**. Adelantar Clientes y Cotizaciones al alta permite reutilizar datos y probar los dos caminos de apertura. No cambia alcance, IDs ni rutas aprobadas del Shell.

| Bloque / orden | Resultado y dependencia principal                                | Verificación antes de continuar                                                                  |
| -------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 2              | Resumen y bandeja con contexto temporal; Shell existente.        | Conteos/visibilidad coherentes, retorno, estados y escenarios de su especificación.              |
| 3 → 4          | Encontrar y comprender una operación; núcleo G1.                 | Lista → objeto → retorno; sustituir contexto temporal sólo con destino útil.                     |
| 6 → 9 → 5      | Cliente → cotización/versiones → alta, más creación directa; G2. | Reutilización sin doble carga y sin exigir cotización; separar aprobación interna de aceptación. |
| 7 → 8          | Verticales Impo/Expo y DJVE autónoma; G3.                        | Controles segregados, relaciones, documentos y cierres sin simular oficialización real.          |
| 10 → 11        | Handoff administrativo y Dirección; G4.                          | Situaciones independientes, permisos económicos y métricas pendientes identificadas.             |
| 12 → 13        | Portal y asistencia demostrativos; G5.                           | Visibilidad por canal, navegación y consultas de fixtures; sin identidad/integraciones reales.   |

Aplicar [gates técnicos y documentales](TEST_STRATEGY.md#19-gate-de-etapa) por etapa dentro de cada bloque. No exigir revisión visual humana después de cada una; los cortes técnicamente terminados quedan `Under review` y se puede continuar. Registrar pruebas, limitaciones, supuestos y punto de reanudación en plan/especificación. La revisión humana integral es obligatoria antes de declarar aprobada la primera pasada. No aprobar reglas de negocio por completar un mock ni eludir bloqueos funcionales; procedimiento en el [runbook](CODEX_RUNBOOK.md#preparación-y-cierre).

### Contrato de demostración integral

- Fixtures sintéticos y anonimizados a partir de estructuras/relaciones observadas, no copias de datos reales. Su coherencia entre dominios se gobierna en [arquitectura](../architecture/README.md#frontend-y-frontera-de-datos).
- Navegación de punta a punta: al habilitar detalles, actualizar enlaces desde Inicio/Mi trabajo, clientes, cotizaciones, operaciones y Administración y probar retorno. Contexto temporal sólo mientras el destino no exista; no dejarlo como sustituto permanente al finalizar el recorrido correspondiente.
- Acciones locales del prototipo con efecto verificable, feedback y carácter demostrativo explícito. No representar como reales aprobaciones, oficializaciones, facturación, pagos, transferencias o integraciones. Sin enlaces rotos ni botones decorativos. Una acción real fuera del corte se explica como no disponible, no se finge ejecutada.
- Mantener Design System, Shell y marca; densidad útil, acciones contextuales, prevención de errores, responsive, WCAG 2.2 AA y referentes ya evaluados en el estándar.
- Aplicar [confidencialidad económica del alcance §7.2](../product/ALCANCE_FUNCIONAL.md#72-permisos-y-visibilidad) desde los fixtures y todas las vistas, no sólo Administración. Ninguna responsabilidad operativa concede acceso económico por inferencia.
- Portal y canales asistidos validan experiencias dentro del prototipo: no incluyen invitaciones reales, envío de mensajes, proveedor de IA ni servicios reales. Las segundas fases y escrituras futuras conservan sus condiciones de aprobación; no se vuelven obligaciones de esta primera pasada.

## Frontend demostrativo y producto operativo real

| Línea                              | Entrega verificable                                                                                                                                                                                                  | Qué no acredita                                                                          |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| A — Frontend integral demostrativo | Pantallas, acciones locales identificadas como prototipo, recorridos conectados, fixtures y pruebas de Etapas 2–13. Revisión humana integral al cierre.                                                              | Persistencia, autorización efectiva, datos externos disponibles o aptitud de producción. |
| B — Implementación operativa real  | Arquitectura aprobada, backend/persistencia, identidad, permisos efectivos, contratos e integraciones, carga inicial desde fuentes aprobadas cuando corresponda, seguridad y pruebas con fuentes reales autorizadas. | No queda implementada ni autorizada por terminar A.                                      |

La línea B no debe esperar necesariamente a terminar todo A: el relevamiento con ABT, contratos, identificadores, fuentes maestras, sensibilidad y decisiones de arquitectura pueden avanzar en paralelo a los bloques consumidores. Una implementación real posterior sólo se inicia con alcance/arquitectura/autorización definidos y pruebas correspondientes; las fronteras mock simples permiten sustituir fuentes sin anticipar capas o tecnología.

Dependencias operativas: validar capacidades antes de exponer datos reales; confirmar contratos antes de conectar; si se aprueba una carga inicial desde fuentes incluidas, validar mapeos y reconciliación antes de ejecutarla; verificar seguridad, recuperación, auditoría y aceptación de procesos antes de habilitar producción. No sumar una etapa frontend numerada para resolver estas líneas técnicas. Commit, push, merge y despliegue requieren autorización separada.

## Línea transversal de integraciones

Esta sección es autoridad de **seguimiento técnico**, no una etapa UI, componente, API confirmada ni nuevo alcance. La [matriz](MATRIZ_COBERTURA_FUNCIONAL.md#integraciones-y-transición) conserva necesidades INT/ALP y su evidencia; el [alcance §8](../product/ALCANCE_FUNCIONAL.md#8-sistemas-externos-y-fuentes-de-verdad) define inclusión y límites.

Referencia: [relevamiento original Alpha2000](https://docs.google.com/spreadsheets/d/1Q3jlt7kN1s5C_Hh6ALygyQmCIMkfvJT0968TIKratn8/edit), E5 de la matriz. Consulta de texto en sólo lectura el 14/10/2026: guía y encabezados de `Relevamiento`, sin filas de consultas/acciones. Debe completarse con ABT; los ejemplos de la guía no acreditan contratos ni habilitan emisión de facturas. No reproducir aquí el formulario ni los nueve registros ALP.

### Necesidad y alcance por frente

Alpha2000 es la integración prioritaria por decisión interna del responsable del proyecto. La prioridad fina de consultas y datos debe completarse con ABT. Fuente de verdad significa autoridad prevista por dato, no disponibilidad de API.

| Sistema / trazabilidad                                  | Capacidad, proceso e información requerida                                                                                                                                                                                                                                                                                                    | Operación deseada y fuente de verdad                                                                                                                                                                                                                         | Etapas consumidoras / prioridad de relevamiento                                                    |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Alpha2000 / MARÍA — INT-001, ALP-001 a ALP-004, ALP-009 | Preparación y seguimiento Impo/Expo: destinaciones y regímenes Impo/Expo, referencias/números y fechas de oficialización, canal/estados, arribo/liberación, documentos/intervenciones, transporte, valores aduaneros, permisos de embarque, cumplidos cuando estén disponibles y novedades pertinentes; alcance por tipo/régimen a confirmar. | Lectura prioritaria externo → ABT; escritura no definida ni autorizada. Alpha2000/MARÍA para registros aduaneros; autoridad por campo y maestros a confirmar.                                                                                                | 3–8; contexto 2 y consumidores 10–13. Alta por dependencia operativa.                              |
| Alpha2000 administrativo — INT-001, ALP-005 a ALP-009   | Facturación/facturas por cliente, cobranzas, cuentas corrientes, compras/proveedores, órdenes de pago/retenciones, gastos/rendiciones e información contable y referencias para Dirección, vinculadas a clientes, operaciones y documentos.                                                                                                   | Lectura propuesta externo → ABT; cualquier preparación/emisión/escritura requiere definición aparte. Alpha2000 conserva contabilidad/cuentas corrientes; gastos e imputaciones por dato pendientes.                                                          | 10–11, referencias autorizadas en 4/6/9. Alta por handoff y fuentes económicas.                    |
| Interbanking — INT-005, REP-007, REP-008, REP-018       | Evaluar consulta bancaria/tesorería: potenciales saldos, movimientos y otros datos sólo si se confirma disponibilidad.                                                                                                                                                                                                                        | Exclusivamente lectura propuesta externo → ABT. Autoridad bancaria por institución y dato por confirmar; sin transferencias, emisión/ejecución de pagos, operaciones con ECheqs, conciliación automática, escritura bancaria ni autorización de movimientos. | 10–11. Factibilidad previa; no compromiso de disponibilidad.                                       |
| ARCA / MOA — INT-003                                    | Evaluar cumplidos y otros datos aduaneros necesarios. Caso inicial: Exportación.                                                                                                                                                                                                                                                              | Primero ARCA/MOA → Alpha2000 → ABT mediante API autorizada; directo ARCA → ABT sólo si la vía prioritaria no alcanza o existe justificación suficiente. Sin escritura ni dos conectores obligatorios. Fuente original identificada.                          | 7–8, referencias en 10–11. Evaluación subordinada a cobertura Alpha2000; no bloqueo del prototipo. |
| Microsoft 365 — INT-004                                 | Correo y documentos vinculados a operaciones, origen e historial; alcance de integración pendiente.                                                                                                                                                                                                                                           | Consulta/vinculación a evaluar; envío, carga o archivado automático no autorizados. M365 conserva contenido de origen; relación con operación en ABT, autoridad/retención por definir.                                                                       | 4, 7–10 y eventualmente 12. Complementaria; confirmar necesidad y alcance antes de conectar.       |

### Seguimiento técnico por frente

Estado al 14/10/2026: los cinco frentes de seguimiento siguen **Pendiente de relevamiento**: hay necesidades documentadas, sin relevamiento completo con ABT. La documentación pública ARCA fue contrastada, pero la disponibilidad efectiva para ABT y los contratos de integración siguen pendientes en todos. La factibilidad preliminar Alpha2000 informada por el responsable no equivale a API disponible. Las direcciones anteriores son deseadas, no sincronizaciones implementadas. Frecuencia/SLA y responsable técnico/validador están pendientes en cada frente.

| Sistema                        | Identificadores a relacionar (definición pendiente)                                                                   | Permisos/sensibilidad                                                                                                        | Errores, fallback y pruebas requeridas                                                                                                                                        | Bloqueo o próxima decisión                                                                                                      | Estado                    |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| Alpha2000 / MARÍA              | Clave externa de destinación/despacho/permiso, operación y maestros ABT; distinguir referencia visible de ID estable. | Acceso aduanero por proceso; valores/tributos separados de honorarios según alcance §7.2.                                    | Dato ausente, parcial, stale, error o sin permiso; mantener origen/fecha sin inferir oficialización. Probar mapeo, unidades/monedas, estados, duplicados y vínculo Impo/Expo. | Completar E5 con ABT/proveedor; confirmar consultas, muestras autorizadas, frecuencia e IDs.                                    | Pendiente de relevamiento |
| Alpha2000 administrativo       | Comprobantes, cliente/proveedor, operación, imputación, cobranza, pago/rendición.                                     | Separar las categorías económicas de §7.2; no distribuir información contable a perfiles operativos.                         | No inferir facturada/cobrada por ausencia de respuesta. Probar vínculos, moneda/período, consistencia, repetición de lecturas y pruebas negativas de acceso.                  | Completar E5; acordar fuente por dato, fechas de corte, dirección y eventual escritura por caso.                                | Pendiente de relevamiento |
| Interbanking                   | Institución, cuenta e ID de movimiento; vínculo contable sólo al definirse.                                           | Consulta bancaria específica, credenciales y consentimiento por definir; sin exposición en logs/fixtures.                    | No mostrar saldo cero si falta conexión. Probar no conectada, datos parciales/stale, permisos y moneda/fecha; demostrar ausencia de comandos de pago.                         | Factibilidad, disponibilidad de cada dato, acceso/contrato, frecuencia y límites; conciliación no asumida.                      | Pendiente de relevamiento |
| ARCA / MOA (vías alternativas) | Permiso/destinación, cumplido y operación; validar correspondencia con IDs Alpha2000.                                 | Acceso mediado según contrato Alpha2000; directo sujeto a certificado, WSAA, CUIT/relaciones, carácter y permisos efectivos. | Cumplido desconocido no equivale a incumplido. Probar correspondencia, origen/intermediario, frescura, errores, diferencias y acceso en la vía elegida.                       | Primero confirmar cobertura/costos Alpha2000; justificar alternativa directa y validar dependencias siguientes si es necesaria. | Pendiente de relevamiento |
| Microsoft 365                  | IDs de mensaje/archivo/versión y operación; asociación inequívoca.                                                    | Acceso a buzón/archivo no concede acceso económico; definir consentimiento, herencia, retención y revocación.                | Referencia eliminada, revocada o inaccesible sin filtrar contenido. Probar vínculo, versiones, revocación, duplicados y recuperación sin envío real.                          | Definir lectura/escritura, archivo vs enlace, acceso/contrato y frecuencia; no asumir integración de correo.                    | Pendiente de relevamiento |

Al relevar cada consulta/acción, actualizar su frente con disponibilidad técnica, enlace a contrato/API confirmado, IDs, dirección y frecuencia, fuente maestra, capacidades, errores/fallback, pruebas, responsable, estado, bloqueo y evidencia/fecha. El detalle campo a campo permanece en el relevamiento/contrato autorizado enlazado, no duplicado en Markdown. Mientras no exista evidencia nueva, los pendientes comunes anteriores aplican a cada fila.

### Evidencia Alpha2000 y vías para MOA

E17 de la matriz registra **información aportada por el responsable del proyecto en esta sesión**: hubo reunión inicial con predisposición y viabilidad preliminar para estudiar la integración; el proveedor explicó complejidad por régimen/tipo y posibilidad de desarrollar endpoints específicos con datos procesados. Fecha de reunión y acta no aportadas; no se atribuye a una reunión presenciada ni a una prueba de Codex. Necesidad funcional de integrar confirmada internamente; alcance de datos, API documentada/habilitada/contratada, condiciones comerciales y pruebas técnicas siguen pendientes.

| Alternativa                   | Evaluación y ventajas potenciales                                                                                                                                                                                                                                      | Condiciones / decisión pendiente                                                                                                                            |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A — Alpha2000 primero         | API autorizada del proveedor, posiblemente con datos MOA procesados. Podría reducir mecanismos de autenticación, consultas y transformaciones duplicadas, aprovechar conocimiento aduanero y simplificar correspondencias de IDs/estados. Son hipótesis, no garantías. | Confirmar datos/origen, actualidad, costo, latencia, frecuencia, regímenes cubiertos, disponibilidad, redistribución y responsabilidad ante errores.        |
| B — ARCA directo condicionado | Web Services oficiales autorizados sólo si A no cubre la necesidad o existe justificación técnica/funcional suficiente.                                                                                                                                                | Definir acceso, seguridad, mantenimiento y alcance por consulta. No crear por defecto un segundo conector para el mismo dato ni una dependencia simultánea. |

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

| Estado                    | Evidencia mínima para usarlo                                                                                                                                                        |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pendiente de relevamiento | Necesidad identificada; faltan consultas/acciones o actores/datos.                                                                                                                  |
| Relevada                  | Casos, datos, uso, fuente y responsable documentados con ABT; no implica factibilidad.                                                                                              |
| En análisis técnico       | Revisión efectiva de acceso, disponibilidad, seguridad e identificadores registrada.                                                                                                |
| Contrato definido         | Contrato enlazado con campos, operaciones, dirección/frecuencia, permisos y errores acordados.                                                                                      |
| Lista para implementar    | Contrato, arquitectura, accesos de prueba, autorización y criterios de aceptación resueltos.                                                                                        |
| En implementación         | Trabajo real iniciado con alcance y evidencia registrados.                                                                                                                          |
| En pruebas                | Conector disponible en entorno autorizado, ejecutando pruebas del contrato y seguridad.                                                                                             |
| Validada                  | Resultados con fuentes reales autorizadas y aceptación técnica/funcional registradas: responsable, fecha, entorno y alcance. No equivale automáticamente a habilitación productiva. |
| Bloqueada                 | Impedimento concreto, responsable de resolución y condición de salida; conservar último avance.                                                                                     |

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

### Estado de esta pasada

Prototipo local en revisión técnica: asistente de seis pasos para alta directa o
desde una versión explícitamente aceptada. Reutiliza el cliente, conserva origen
cotización/versión y refleja la operación en listado, ficha y relaciones del
cliente. Requisitos condicionales se identifican como no configurados; no se
inventan reglas ni roles. IDs y datos son sintéticos; estado inicial propuesto,
almacenamiento sólo en sesión. Participantes, responsabilidades individuales,
capacidades, campos y cardinalidad siguen pendientes de ABT.

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

### Implementación y gate técnico de Etapa 8

Implementada en `feat/stage-08-export-main`: workspace Exportación enlazado
desde ficha y Mi trabajo; registro/lista/detalle DJVE; fixtures autónomos,
múltiples permisos y permiso sin DJVE; doble control local; instrucción/provisorio
como datos no disponibles sin inferir faltantes; custodia física/digital
separada y estados administrativos/operativos independientes. No hay
alta/edición de DJVE, archivos, integraciones ni acciones externas; campos
mínimos y reglas quedan pendientes. Gate local: lint, typecheck, build; 71
unitarias, 21 axe, 34 E2E smoke Chromium; validador documental (117 IDs, 32
experiencias, 10 recorridos), `git diff --check`; capturas revisadas a
1440×1000 y 390×844, E2E mide 390–1440 px. PR #14 integrado en `main`
(squash `6ebc174394ad9b011a9f895ef54e76f58e0943cd`), checks requeridos verdes y
deployment `dpl_F9bW7anLmQUhAUAmVZTJiKjjbTAE` READY; rutas de Exportación,
DJVE, operación y Mi trabajo respondieron HTTP 200. Under review; revisión
humana pendiente.

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
envía ni aprueba realmente. La versión aceptada abre el asistente de Etapa 5;
el vínculo se conserva sin limitar cardinalidad ni alterar la cotización.
Campos, fórmulas adicionales, permisos efectivos, canal/evidencia y cardinalidad
siguen pendientes de validación con ABT.

### Gate

- cantidad × unitario produce total;
- no se envía sin aprobación;
- aprobación interna y aceptación del cliente no se confunden;
- versiones se entienden;
- nueva versión conserva el historial anterior y comienza con hitos pendientes;
- desde la versión aceptada se abre el alta guiada y conserva origen; no se
  declara conversión productiva y la cardinalidad cotización→operaciones queda
  pendiente.

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

### Implementación y gate técnico de Etapa 10

La implementación demostrativa presenta cola con búsqueda/estado en URL,
detalle relacionado y vista de fuentes; reutiliza el ciclo sintético de
Exportación y una tarea sintética de rendición sin operación. Las operaciones sin
referencia administrativa no generan filas. Lista para facturar, facturada,
cobranza, cumplido, post-embarque y cierre documental aparecen como dimensiones
separadas; no se inventan comprobantes ni montos. No hay escritura o conexión
con Alpha2000 ni Interbanking. Las rutas y pruebas se describen en
[especificación Etapa 10](screens/10-administracion-finanzas.md). Estado
`Under review`; PR #15 integrado en `main` (`5df29305616a9e212bc9107f12251e33a7c44d99`),
checks `quality`, `e2e-smoke`, Vercel y Preview Comments verdes. El deployment
`dpl_3eN8u6f7ybhNje2Ako6rauRaXQKf` está READY; `/administracion`, detalle
`op-demo-3107` y `/administracion/finanzas` respondieron HTTP 200. Revisión
humana integral pendiente. La visibilidad mock no representa permisos productivos.

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

### Implementación de esta pasada (Under review)

`/gestion` presenta cinco vistas sobre fixtures compartidos: panorama
operativo, situaciones por operación, clientes relacionados, carga de trabajo
y dependencias económicas sin cifras. Los drill-down abren el listado/ficha de
Operaciones, ficha de Cliente o Mi trabajo, conservando el retorno cuando
corresponde. No calcula indicadores financieros ni incorpora exportaciones,
fuentes conectadas o reglas de productividad. La especificación proporcional,
limitaciones y pruebas están en
[Etapa 11 — Gestión y Dirección](screens/11-gestion-direccion.md). Validación
humana integral pendiente.

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

| Gate                                   | Debe estar validado antes de                                           | Motivo                                                                                                                                                                                                                                                |
| -------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G0 — Inicio y Mi trabajo               | Compromiso funcional de Etapa 2                                        | Revisar `screens/02-inicio-mi-trabajo.md`, validar que los fixtures no atribuyan perfiles o información sensible reales y registrar preguntas abiertas. Las fuentes externas no accesibles no bloquean el prototipo documental ni un mock reversible. |
| G1 — núcleo de operación               | Contratos, rutas definitivas y reglas irreversibles de Etapas 3, 4 y 5 | Cerrar ID, cardinalidades, estados, transiciones, responsables, permisos y auditoría comunes. Los prototipos pueden usar identificadores y estados explícitamente ficticios.                                                                          |
| G2 — datos maestros y cotización       | Persistencia o automatización de Etapas 5, 6 y 9                       | Definir reutilización de clientes, versionado, cálculo, aprobación interna, respuesta del cliente y cardinalidad versión aceptada→operaciones.                                                                                                        |
| G3 — Importación, Exportación y DJVE   | Automatización o bloqueo de Etapas 7 y 8                               | Validar requisitos variables, evidencia del doble control, custodia, cardinalidades DJVE/permiso/operación, fórmula observada de granos y criterios de cierre. La regla confirmada de dos personas antes de oficializar se conserva.                  |
| G4 — Administración y fuentes externas | Cálculos, sincronización o escritura de Etapas 10 y 11                 | Completar Alpha2000 campo a campo y evaluar cobertura de cumplidos/MOA, criterios de pase y fórmulas/fuentes de los 18 bloques de Dirección. Las maquetas pueden representar estados sin simular disponibilidad externa.                              |
| G5 — canales externos                  | Publicación o acciones de Etapas 12 y 13                               | Definir identidad, visibilidad, servicios compartidos, casos asistidos y auditoría de acciones.                                                                                                                                                       |

La secuencia integral adelanta Clientes y Cotizaciones al alta; las definiciones de negocio aún pendientes no se dan por cerradas con esos mocks. Etapa 2 no habilita acciones de negocio reales ni resuelve las decisiones abiertas del gate G0.

## Estado de etapas

| Etapa                        | Estado                               |
| ---------------------------- | ------------------------------------ |
| 0 — Frontend Foundation      | Complete with environment limitation |
| 1 — Application Shell        | Complete with environment limitation |
| 2 — Inicio y Mi trabajo      | Under review                         |
| 3 — Operaciones listado      | Under review                         |
| 4 — Operación detalle        | Under review                         |
| 5 — Crear Operación          | Under review                         |
| 6 — Clientes                 | Under review                         |
| 7 — Importación              | Under review                         |
| 8 — Exportación/DJVE         | Under review                         |
| 9 — Cotizaciones             | Under review                         |
| 10 — Administración/Finanzas | Under review                         |
| 11 — Gestión/Dirección       | Under review                         |
| 12 — Portal                  | Under review                         |
| 13 — Canales asistidos       | Under review                         |

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

### Implementación y gate técnico de Etapa 5

`/operaciones/nueva` ofrece alta directa o desde cotización aceptada y seis
pasos: origen, cliente/tipo/modalidad, contexto, equipo responsable, requisitos
pendientes y revisión. Revalida ID y versión aceptada; no marca consumida ni
asume cardinalidad uno-a-uno. El registro local alimenta Operaciones, detalle y
ficha Cliente mediante IDs estables. No configura reglas condicionales, usuarios
ni permisos. PR #12 integrado a `main` (`fce2db4ab9f0877cfd23de48bf2ae1c2fb55499a`), checks `quality`, `e2e-smoke` y Vercel Preview verdes; producción `dpl_4swVdkXeUzdYsGES5miqqaQro87u` READY. `/operaciones/nueva`, `/operaciones/op-demo-3142`, cotización y cliente respondieron HTTP 200. Gate local: lint, typecheck, build; 64 pruebas unitarias, 17 axe,
25 E2E smoke Chromium; validador documental (117 IDs, 32 experiencias, 10
recorridos) y `git diff --check` pasan. Capturas revisadas en Chromium a
1440×1000 y 390×844; las pruebas de Operaciones y Clientes verifican la relación
local. Datos, equipos, campos y cambios son sólo de demostración; revisión humana integral pendiente.

### Implementación y gate técnico de Etapa 7

El [workspace de Importación](screens/07-importacion.md) se abre desde Operación
o las tareas relacionadas de Mi trabajo; vuelve a la operación y conserva el
retorno. El doble control bloqueante por personas distintas se demuestra sólo
en estado local. Alpha2000/MARÍA sigue no conectada; no se simulan preparación,
oficialización, canal ni liberación. Documentación condicional y pase a
Administración mantienen definiciones pendientes. Gate local: lint, typecheck,
build; 67 unitarias, 18 axe, 29 E2E smoke Chromium; validador documental (117
IDs, 32 experiencias, 10 recorridos) y `git diff --check` pasan. Capturas
revisadas en Chromium a 1440×1000 y 390×844; E2E mide 390–1440 px. PR #13
integrado a `main`, checks verdes y deployment `dpl_B4cuKdScKTggMHQq92BxrP2X6Za8`
READY; `/operaciones/op-demo-2048/importacion` respondió HTTP 200. Revisión
humana integral pendiente.

### Implementación y gate técnico de Etapa 9

Lista, ficha versionada y editor en `apps/web/features/quotes`; rutas bajo
`/cotizaciones`. Datos enteramente sintéticos, cambios de workflow en sesión
local y retorno Cliente↔Cotización preservado. PR #11 integrado en `main`
(`1645bfc1094451447803c2f12af0f3ed7306a6af`), checks verdes, deployment
`dpl_ASHbuHcgy7rjXkZsc7vAUSiEHJnc` READY; rutas list, detail, create y edit
HTTP 200. Gate local: lint/typecheck/build;
63 unitarias/componentes; 16 axe; 22 E2E smoke Chromium; validador documental
(117 IDs, 32 experiencias, 10 recorridos); `git diff --check`. Capturas
revisadas manualmente en Chromium a 1440×1000 y 390×844; E2E midió ausencia de
overflow entre 390 y 1440 px. Etapa 5 habilita ahora sólo el alta demostrativa
desde la versión aceptada. Datos comerciales, capacidades y acciones son
demostrativos, no autorización o auditoría reales. Revisión humana integral
pendiente.

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

## Iteración UX/UI V2

Autorización interna del responsable (14/10/2026): siete bloques frontend por PR a main, con gates técnicos y revisión humana integral al final. Etapas 2–13 siguen Under review; no constituye aprobación ABT.

| Bloque | Alcance / dependencia | Estado |
|---|---|---|
| UX-01 | Coherencia funcional, retorno, URL, fechas e interactividad | Under review — PR #20 integrado, CI verde |
| UX-02 | Listados selectivos, DataTable y responsive; UX-01 | Under review — PR #21 integrado |
| UX-03 | Acceso y escenarios, ayuda secundaria; UX-02 | Under review — PR #22 integrado |
| UX-04 | Inicio contextual y preparación Dirección; UX-03 | Under review — PR #23 integrado |
| UX-05 | G1–G5 y registros; completa Dirección junto a UX-04 | Under review — PR #24 integrado |
| UX-06 | Fichas, procesos, documentos, Portal y limpieza transversal | Under review — PR #25 integrado |
| UX-07 | Regresión 32 experiencias/J1–J10, capacidades y responsive | Under review — cierre técnico, revisión humana pendiente; PR #26 |

Gates por bloque: lint, tipos, pruebas proporcionales, build, E2E, inspección visual, validador y diff; CI verde antes de squash, contenido comprobado en main y deployment existente. Comandos en [estrategia de pruebas](TEST_STRATEGY.md).

### Seguimiento V01–V21

| ID | Hallazgo | Bloque | Estado |
|---|---|---|---|
| V01 | Control completado sigue bloqueante | UX-01 | Corregido técnicamente; revisión pendiente |
| V02 | Tarea comercial sin destino útil | UX-01 | Corregido técnicamente; revisión pendiente |
| V03 | Relación DJVE/permiso contradictoria | UX-01 | Corregido técnicamente; revisión pendiente |
| V04 | Compresión a 1024 px | UX-02 | Corregido técnicamente; revisión pendiente |
| V05 | Resultados demasiado bajos en móvil | UX-02 | Corregido técnicamente; revisión pendiente |
| V06 | Apertura administrativa fuera del ancho | UX-02 | Corregido técnicamente; revisión pendiente |
| V07 | Comparación Clientes/Cotizaciones | UX-02 | Corregido técnicamente; revisión pendiente |
| V08 | Filtros rápidos poco reconocibles | UX-01/02 | Corregido técnicamente; revisión pendiente |
| V09 | Agrupación pierde orden | UX-01/02 | Corregido técnicamente; revisión pendiente |
| V10 | Retornos inconsistentes | UX-01/04 | Corregido técnicamente; revisión pendiente |
| V11 | Fichas demasiado extensas | UX-04/06 | Jerarquía y secciones secundarias refinadas; revisión pendiente |
| V12 | Pasos y errores de formularios | UX-06 | Requisitos en revisión y errores asociados/foco; revisión pendiente |
| V13 | Fechas y referencias inconsistentes | UX-01/02 | Corregido técnicamente; revisión pendiente |
| V14 | Iconografía ambigua | UX-01 | Corregido técnicamente; revisión pendiente |
| V15 | Ayuda y textos reiterativos | UX-03/06 | Header, descripciones y avisos redundantes retirados; avisos sensibles conservados |
| V16 | Ausencia de analítica financiera | UX-05 | G1–G4 implementados; revisión pendiente |
| V17 | Inicio poco contextual | UX-04/05 | Acciones, vencimientos y G5 implementados; revisión pendiente |
| V18 | Gestión sin propósito diferencial | UX-04/05 | Dirección con G1/G4 y registros; revisión pendiente |
| V19 | Evaluación por capacidades | UX-03 | Implementada; Under review |
| V20 | Documentación/Portal limitados | UX-06 | Requisitos/copias compartidos; consulta de referencias, no archivos reales |
| V21 | Semántica riesgosa en gráficos DS | UX-05 | Ejemplos limitados a cantidades; sin suma de monedas |

### Evidencia UX-01

85 unitarias web + 3 UI, 26 axe, lint/tipos/build y regresiones Chromium de control, cotización, cliente y agrupación. Capturas locales a 1440 y 390 px inspeccionadas; geometría de tablas se corrige en UX-02. Se ajustan selectores de tests al texto de retorno correcto sin reducir aserciones del destino. Validador conserva cobertura. CI/merge/deployment se registran tras verificación.

UX-01 integrado por PR #20 en main 75beaea; quality/e2e-smoke/Vercel verdes, deployment de producción dpl_3KV1ZWtBTiZuTtbJ8bjeTo4fQ1at READY. Confirmado estado compartido presente en main.

### Evidencia UX-02

Clientes/Cotizaciones usan DataTable proporcionado; Operaciones protege identidad, elimina selección sin acción, conserva URL y tiene filtro móvil plegable; Administración ofrece lista compacta con apertura visible. Resize acotado y por teclado en desktop; calendario en español y referencia de escenario 14/10/2026. Unitarias, axe de consumidores, tipos/lint/build y E2E de geometría/retorno/resize; capturas desktop y móvil inspeccionadas. Primer registro móvil de Importaciones a y=663 frente a 1219 previo; no es una cuota de diseño. Preferencias sólo temporales; restauración explícita. PR/CI/deployment por registrar al cerrar.

UX-02 integrado por PR #21 en main 1f17814; checks quality/e2e-smoke/Vercel verdes y producción dpl_2FgTZWsJbnSyC95ntwedrhCB35ib READY. UX-03 añade selección explícita de perspectiva; sin selección no se presentan datos internos. E2E inicia explícitamente una perspectiva de revisión, no altera el comportamiento del producto.

### Evidencia UX-03 / UX-04

UX-03 integrado por PR #22 en main 151e9c5; quality, e2e-smoke y Vercel verdes. Producción dpl_zJfFsF3n3Spy3zoWfAotRSgBtdpf READY. Acceso desktop/móvil inspeccionado, cambio/cancelación de escenario, aislamiento por tipo/capacidades, salida e inducción probados. No se modifica ni presume protección de infraestructura.

UX-04: acciones rápidas contextuales, resumen y próximos vencimientos; apertura directa desde la bandeja con retorno explícito. La revisión comercial vigente y el doble control alimentan Inicio/Mi trabajo/Gestión sin duplicar pendientes. Capturas 1440/390 inspeccionadas; unitarias, axe, lint/tipos/build y smoke de navegación. G5 y la nueva identidad de Dirección se completan en UX-05, no se publica una vista analítica vacía.

UX-04 integrado por PR #23 en main 59b89c8; quality/e2e-smoke/Vercel verdes y producción dpl_3phMf5yLbVwKTPWW3NzoJPTuePps READY.

### Evidencia UX-05

G1/G4 diferencian Dirección en /gestion; G2/G3 en Finanzas; G5 en Inicio. Registros sintéticos de facturas, cobros, gastos y saldos informados, ligados a clientes y operaciones compatibles, moneda aislada, corte 14/10/2026. Selección gráfica o enlaces accesibles abren exactamente los registros con filtros URL y retorno. No hay resultados, márgenes, pagos ni fuentes conectadas.

DS conserva Recharts/ChartContainer y limita sus ejemplos a cantidades; elimina el selector monetario global que sólo afectaba un gráfico y sumaba monedas. Capturas desktop/móvil inspeccionadas, animación innecesaria retirada. Unitarias de integridad/agregaciones, axe y E2E de gráfico→registros→operación→retorno y mobile. Estado Under review, sin validación financiera ABT.

La regresión del escenario externo corrige su colección de operaciones: sólo registros del cliente permitido, no una colección vacía. Se comprueban presencia de registro propio y ausencia de referencias ajenas; no constituye autenticación real.

UX-05 integrado por PR #24 en main a70ebfa; quality/e2e-smoke/Vercel verdes, producción dpl_8NJWV18A5Po8JCVTXkCfiXuTaYmS READY. La regresión incluyó las operaciones propias del escenario externo y ausencia de referencias ajenas.

### Evidencia UX-06

Documentos: modelo local compartido por ficha, workspaces, consultas y proyección externa. Registrar referencia de copia produce feedback y actualiza consumidores, sin completar original/control/cierre. Cliente recibe sólo campos compartidos; salida/cambio reinicia temporales y conserva inducción. Diálogo de metadatos, no visualizador de archivos reales.

Fichas priorizan identidad/acción/control; fuentes e historial bajo demanda, Chevron consistente. Cotización consulta versión exacta e impide mutar su secuencia histórica; formulario no convierte precio vacío en cero y conserva cliente de contexto explícito. Alta consolida requisitos en revisión, conserva datos y asocia errores/foco; perspectiva operativa no ofrece una elección comercial inservible.

DJVE: lista compacta con búsqueda/página/retorno URL, validada con colecciones de diseño 2/20/100; no son volúmenes de ABT. Documentos usa búsqueda y revelado progresivo, no DataTable indiscriminado. Se conserva retorno DJVE→Exportación→DJVE→lista filtrada. Se retiran botones de edición sin función; Configuración sólo ofrece preferencias reales del navegador y declara parámetros de negocio pendientes.

Pruebas nuevas: documentos (integridad/proyección/volumen/axe/foco), DJVE volumen, ux-processes.spec.ts (recepción, controles, versiones, formularios, Portal y retorno). Se preservan dobles controles y separación facturada/cobrada/cumplida/cerrada; no hay transiciones nuevas ni reglas regulatorias. Capturas locales de ficha, Importación móvil e histórico de Cotización inspeccionadas; revisión humana integral pendiente.

UX-06 integrado por PR #25 en main 4c752d7, quality/e2e-smoke/Vercel verdes. Deployment dpl_Aa8SXJkyNVYCv48qwv5DYbykqf7i READY; documentos y versiones comprobados en main. Regresión local contra producción: 64 E2E Chromium pasaron. La prueba de fuente local conserva la ausencia de timestamp con etiqueta actualizada; el fallo inicial no se omitió.

### Regresión transversal UX-07

No es una nueva etapa de producto ni aprobación ABT. Corrige extremos de V2: fechas de análisis imposibles/invertidas sin confirmar gráficos/totales, búsqueda documental recuperable, navegación compatible con Next instalado, definiciones secundarias de Importación bajo demanda y copy sin avisos redundantes. Se conservan advertencias sensibles.

#### Contraste de las 32 experiencias

Cada ID conserva su alcance: no equivale a una pantalla independiente ni a una funcionalidad aprobada. Evidencia en suites existentes y nuevas, sin inventar reglas para cerrar pendientes.

| Experiencias | Superficie / suites de evidencia | Frontera o pendiente |
|---|---|---|
| DS-01, SHELL-01 | DS, Shell, menú; design-system/application-shell/ux-access | Marca y navegación base preservadas |
| HOME-01, WORK-01 | Inicio/G5/bandeja; stage-02/ux-workspace/coherence | No oficialización implícita |
| OPS-01, OPS-02 | Lista/variantes; stage-03/ux-lists/regression | Identidad no ocultable, sin totales económicos |
| OPS-03, OPS-05 | Ficha/controles; stage-07/08/ux-processes | Control local, no evento externo |
| OPS-04 | Alta directa/desde versión; stage-05/ux-processes | Requisitos específicos/cardinalidad pendientes |
| CLI-01, CLI-02 | Tabla/ficha y relaciones; stage-06/ux-processes | Sin CRM ni edición maestra ficticia |
| CLI-03 | Necesidad conservada, límite explícito en ficha | Configurador por cliente no implementado |
| COT-01, COT-02, COT-03, COT-04 | Tabla/ficha/editor/conversión; stage-09/05/ux-processes | Eventos separados; sin ampliar reglas comerciales |
| IMP-01, EXP-01 | Workspaces; stage-07/08 | Preparación/oficialización externas |
| DJV-01 | Lista/ficha/relaciones; stage-08/ux-processes | Sin tolerancias ni alta regulatoria inventada |
| DOC-01 | Requisitos/copias/originales; documentos/ux-processes | Referencias, no archivos reales ni custodia productiva |
| ADM-01, ADM-02, ADM-03 | Bandeja/detalle/G2/G3; stage-10/ux-analytics | Sin emitir/pagar; tarea sin operación conservada |
| MGT-01, MGT-02 | Dirección/G1/G4/registros; stage-11/ux-analytics | 18 bloques conservados, no fórmulas definitivas |
| CFG-01 | Preferencias del navegador; ux-regression | Parámetros de negocio pendientes |
| ALT-01 | Alertas en Inicio/trabajo/objeto; stage-02/ux-coherence | Centro global y notificaciones no implementados |
| INT-01 | Fuente/frescura/error en consumidores; stage-02/07/08/10 | Panel global propuesto, sin conectores |
| POR-01, POR-02, POR-03 | Acceso/Shell/objetos propios; stage-12/ux-access/processes | Sin identidad real, cargas ni envíos |
| AST-01 | Consulta sobre proyección común; stage-13/ux-processes | Sin IA ni escrituras |

#### Recorridos J1–J10: parte frontend y límites

| Recorrido | Suites / continuidad comprobable | No se declara ejecutado |
|---|---|---|
| J1 | stage-05/06/09/10, ux-coherence/analytics: cliente→versión→alta→objeto y navegación entre áreas | Pase automático, contabilidad o autorización definitiva |
| J2 | stage-07, ux-coherence/processes: tarea→Importación→control/copia→proyección/retorno | Oficialización, canal o liberación reales |
| J3 | stage-08/10: Exportación→permisos/documentos→Administración y continuidad facturada/no cumplida | Cumplido/post-embarque/cierre externo ejecutado |
| J4 | stage-08/ux-processes: DJVE autónoma, permisos múltiples/sin DJVE y retorno | Tolerancias y aceptación definitiva de Facturación |
| J5 | stage-06/05/09/ux-processes: contexto Cliente→cotización/alta | Configurador versionado por cliente |
| J6 | ux-coherence/processes, stage-02: bloqueo→control/copia→consumidores y error recuperable | Solicitud/aprobación de excepción no definida |
| J7 | stage-10/ux-analytics: bandeja→detalle→finanzas→gráfico→registros | Pagos, impuestos, conciliación y emisión |
| J8 | stage-12/ux-access/processes: acceso→objetos propios→documentos→salida | Invitaciones, credenciales y transferencias documentales |
| J9 | stage-13/ux-processes: consulta→fuente/fecha/límite/abstención, copia compartida | Modelo de IA, canal externo o acción sensible |
| J10 | stage-02/03/07/08/10/11: fuentes no conectadas/parciales/desactualizadas/error/sin permiso | Sincronización, migración o datos reales |

Perspectivas: operadores comparten componentes con contexto de tipo; responsable operativo sin capacidades económicas implícitas; Administración con bandeja y lectura financiera; Dirección con análisis; Portal separado. El recorrido comercial se evalúa con la perspectiva integral, no un rol Comercial aprobado inexistente. Se comprueban objetos propios y ausencia de referencias/importes ajenos, no sólo menú oculto.

Nuevo ux-regression: identidad/apertura dentro del ancho útil a 320/430/768/1024/1280/1440 px, primer resultado móvil tras filtros compactos, consola, fechas inválidas y ayuda/preferencias. Viewport comprueba reflow, no certifica zoom de cada motor. Las referencias visuales se inspeccionan antes de incorporarlas y quedan Under review. Firefox no inicia por perfil del host; WebKit informa bibliotecas faltantes: no se declaran validados ni se alteran sus pruebas para ocultarlo.

#### Evidencia final y revisión humana

Lint, tipos, build, 101 unitarias/componentes web + 3 de UI, 32 axe y 72 E2E Chromium pasaron; CI quality/e2e-smoke/Vercel verde. La primera ejecución unitaria local saturó la concurrencia y tuvo tres timeouts: se repitió con dos workers, sin aumentar tiempos ni cambiar aserciones; CI ejecutó sus comandos originales. Validador y self-test mantienen 117 IDs, 32 experiencias y J1–J10.

Comparación visual inicial: DS coincide con su referencia; tres referencias del Shell/Inicio fundacionales quedan obsoletas por contenido real, menú de usuario y nombre Dirección. Se inspeccionaron imágenes reales y diferencias antes de actualizar sólo esas tres bases técnicas, sin declarar aprobación humana. Capturas adicionales inspeccionadas: /acceso 1440, Inicio 430, Importaciones 1024, Administración 320, Dirección 1366, Cotización y Portal 390. Sin overflow global ni errores de navegador en esa pasada. Controles de fecha nativos respetan la configuración del navegador; registros y período explicativo usan DD/MM/AAAA. No se afirma localización forzada de controles del sistema operativo ni prueba de zoom nativo.

No se detectaron P0/P1 en los escenarios Chromium ejecutados. Persisten límites, no funcionalidades ficticiamente terminadas: parametrización por cliente, centro global de alertas/integraciones, excepciones que necesitan reglas ABT, archivos documentales reales, fórmulas financieras e identidad reales. Cobertura frontend por tramos no equivale a ejecutar procesos externos. La protección del dominio personalizado no está acreditada; no se modifica infraestructura ni se presenta la selección de perspectiva como seguridad real.

Revisión sugerida desde /acceso: Importación→Inicio→Mi trabajo→control/copia→retorno; Exportación→permiso/DJVE→documentos→continuidad administrativa; Administración→bandeja/finanzas→G2/G3→registros; Dirección→G1/G4→registros→operación→retorno; recorrido comercial con perspectiva integral→cliente/cotización/versiones/alta; Cliente externo→Portal→documentos→salida. Comprobar comprensión, densidad, zoom/teclado/contraste y criterios pendientes con ABT antes de cualquier aprobación.

## V3 — Evolución integral autorizada internamente (15/10/2026)

Fuente: aprobación explícita del responsable sobre la auditoría integral y sus tres precisiones. Autoriza ejecución frontend, PR independientes y squash con checks verdes; no constituye validación formal ABT ni autoriza backend/integraciones. No reiniciar UX V2 ni renumerar Etapas 0–13. Estados técnicos separados de aceptación humana.

| Incremento | Estado | Entregable y dependencia |
|---|---|---|
| V3-01 | Under review | PR #27 contra main; cierre técnico local, CI y revisión humana separados |
| V3-02 | In implementation | Organizaciones multirrol, Clientes/Proveedores ABM y creación contextual; depende de V3-01 |
| V3-03 | Pendiente | Personas, acceso/capacidades, equipos/reasignación, login y recuperación exclusivamente demostrativos |
| V3-04 | Pendiente | Categorías, gastos generales/operativos, anticipos/rendiciones y movimientos sintéticos compartidos; depende de maestros |
| V3-05 | Pendiente | Comprobantes, aplicaciones, obligaciones y carteras al corte; sin contabilidad paralela |
| V3-06 | Pendiente | Continuidad Importación/Exportación/DJVE/documentos/Administración/Portal e información externa contextual |
| V3-07 | Pendiente | Dirección: períodos equivalentes, rankings precisos, carteras, indicadores explicables y regresión integral |

Gates por incremento: lint, typecheck, unitarias/componentes, a11y, build, E2E proporcional, revisión visual desktop/tablet/móvil, validador documental y diff limpio. PR contra main actualizado; confirmar integración y deployment. Mantener Under review hasta revisión humana. Detener sólo reglas críticas no definidas.

### Checkpoint V3

Base verificada: ca01e7fe8e8dd417a518ac8c4fae936cf14404b8. Worktree separado del directorio histórico, rama feat/v3-01-continuidad, [PR #27](https://github.com/Broco-Solutions/abt-comex/pull/27) contra main. V3-01: 103 unitarias web + 3 UI, 32 axe previas + 1 nueva de combobox expandido, lint/typecheck/build y validación documental pasaron localmente. Primera corrida smoke: 70/74; se corrigieron stacking del flyout compacto y dos localizadores ambiguos/asíncronos de Portal; una prueba larga pasó aislada sin modificar timeouts. Reejecución focalizada: 15/15, incluyendo Shell completo, Portal y nueva continuidad. Revisión visual 390/768/1024/1440; primer registro a 449px en 1024, sin overflow global ni errores de página observados. Cuatro referencias visuales ejecutadas; sólo las dos de Shell desktop/compacto cambiaron y fueron inspeccionadas. CI quality/e2e-smoke y preview Vercel READY para 6cbe1b2; confirmar checks sobre el commit documental/visual final antes de fusionar. No hay API ni fuente externa conectada. Los otros seis incrementos no se consideran implementados. La protección SSO all_except_custom_domains no acredita privacidad del dominio personalizado.

La autoridad funcional V3 está en [alcance](../product/ALCANCE_FUNCIONAL.md#evolución-v3--aprobación-interna-15102026). Microsoft 365 queda fuera de esta ejecución; sus filas anteriores conservan historia, no trabajo autorizado.

### Continuidad después de V3-01

PR #27 integrado por squash a main 1c5c4f40415fb14eaa9653d86173328492af7498; todos los checks verdes en HEAD f7eacb8. Deployment dpl_6NegdYFZ3yYFhE6Yh8kLo1QMMykK READY desde main; dominio verificado con navegador a 1024: Más filtros y primer registro a 449px. No se considera privado.

V3-02 se ejecuta desde ese main en worktree separado, sin ramas apiladas. Organizaciones comparten identidad, no obligaciones. Estado local integrado con Clientes, Cotizaciones y apertura de Operaciones; las relaciones administrativas se completan en V3-04/V3-05. Pruebas y PR de V3-02 aún en curso.
