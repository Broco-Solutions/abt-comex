# Importación — workspace por Operación

> Estado: Under review
>
> Etapa: 7 — Importación
>
> Owner funcional: pendiente de validación ABT
>
> Experiencias / recorridos: IMP-01, OPS-05; J2, J6, J7, J10
>
> Ruta propuesta en el mapa: `/operaciones/[operationId]/importacion`

## Propósito y alcance

Dar contexto operativo para una Importación concreta: reconocer lo disponible,
ver qué falta definir o verificar, representar el doble control bloqueante y
entender las dependencias externas. El workspace usa los datos comunes de la
Operación. Esta pasada no prepara ni oficializa destinaciones, no recibe datos
externos, no registra documentos reales ni entrega una carpeta efectiva a
Administración.

## Evidencia y trazabilidad

| Necesidad | Fuente / certeza                                                                                 | Tratamiento en este corte                                                                                                   | Pendiente                                                       |
| --------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| IMP-001   | Alcance §4.3; matriz; proceso de Importación E1/E4; base documentada                             | Cliente, tipo y modalidad reutilizados; mercancía, origen, destinos y requisitos no se inventan                             | Campos y validaciones por modalidad, cliente y caso             |
| IMP-002   | Matriz; seis archivos localizados en E15 e inspeccionados parcialmente; encabezados no son regla | Se explica que la documentación es condicional y no existe checklist aplicable configurado                                  | Requisitos por cliente/mercadería/régimen y estados de custodia |
| IMP-003   | Matriz; guía Alpha E5; dependencia externa                                                       | Alpha2000/MARÍA se identifica como sistema especializado, no conectado                                                      | Datos, permisos, API, campos y sincronización                   |
| IMP-004   | Reglas transversales confirmadas en matriz y alcance                                             | Bloqueo previo a la oficialización requiere dos personas diferentes; la demostración sólo prueba dos identidades sintéticas | Evidencia, reemplazos, auditoría y capacidades reales           |
| IMP-005   | Matriz; procesos E1/E4; dependencia externa                                                      | Arribo, canal, liberación y fechas figuran sin dato conectado                                                               | Eventos, fuente, frescura y cobertura por régimen               |
| IMP-006   | Matriz; hipótesis pendiente                                                                      | Pase a Administración se mantiene bloqueado por criterio de carpeta completa no definido                                    | Criterios, campos, aceptación y retorno del handoff             |

Los seis originales de Importación están localizados; cuatro XLSX fueron
inspeccionados parcialmente y dos XLS requieren interpretación. No hay archivo
completamente inspeccionado en el relevamiento vigente. No se copian datos
originales. La evidencia observada no equivale a aprobación formal de ABT.

## Información, controles y navegación

- Cabecera con referencia, Cliente, modalidad, responsable de referencia y
  enlace de retorno a la ficha común de Operación.
- Clasificación y pre-embarque distinguen datos reutilizados, información no
  modelada y requisitos que no pueden inferirse.
- Alpha2000/MARÍA aparece como fuente externa no conectada. Preparación,
  oficialización, canal, arribo, liberación e intervenciones no se representan
  como consultados o completados.
- El control local permite asignar dos personas ficticias distintas y marcar
  únicamente el estado de la demostración. No hay evidencia de revisión real,
  identidad, permiso productivo ni efecto aduanero.
- Con el control local completo tampoco aparece una acción de oficialización;
  ésta permanece fuera de ABT Comex y a cargo del sistema especializado.
- El handoff a Administración permanece indisponible hasta validar el criterio
  de carpeta completa; el mensaje explica el motivo.
- Mi trabajo enlaza la tarea de doble control y la verificación desactualizada
  al workspace específico; ficha común conserva un destino de retorno.

## Reglas, sensibilidad y estados

| Regla / fuente                                       | Respuesta                                                                  | Bloqueo                                                                   | Pendiente                         |
| ---------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------- |
| IMP-004: dos personas distintas antes de oficializar | No se puede marcar completo con una sola persona o dos identidades iguales | Sí, por regla funcional documentada; el prototipo no autoriza oficializar | Evidencia y capacidades reales    |
| Documentación condicional, IMP-002                   | No existe checklist universal; mostrar definición pendiente, no “completo” | No se inventa bloqueo documental adicional                                | Requisitos por contexto           |
| Alpha2000/MARÍA, IMP-003/005                         | Fuente “No conectada”; los datos externos no se muestran como actuales     | No confirmar estados o ausencia de eventos                                | Disponibilidad/contrato           |
| Handoff, IMP-006                                     | Acción no disponible con razón visible                                     | No afirmar carpeta completa                                               | Regla y responsable de aceptación |

La comprobación de dos identidades es sólo un escenario local; no autentica ni
demuestra dos personas reales. Los estados de carga, sin permiso o ID no
disponible no confirman la existencia de registros. No se exponen datos
económicos ni valores aduaneros sin necesidad/autorización definida.

## Responsive, fixtures y pruebas

Secciones apiladas y control de dos columnas en escritorio que se convierte en
flujo vertical en móvil; sin tabla ancha. Controles etiquetados, teclado,
errores junto al control y estado completado anunciado. Fixtures usan IDs
`OP-DEM-*`, identidades de demostración y fechas determinísticas, no registros
reales. La sesión del navegador conserva sólo el estado demostrativo del doble
control; no hay backend ni persistencia operativa.

Escenarios: entrada/retorno desde Operación y Mi trabajo; operación inexistente
o no Importación; permiso no disponible; persona repetida; doble control local
completado; Alpha2000 no conectada; handoff no habilitado; viewport móvil y
confidencialidad económica.

## Decisiones pendientes

- Definir con ABT datos y etapas mínimas por régimen, modalidad, mercadería y
  cliente; archivos originales aún no se interpretaron completamente.
- Confirmar evidencia, reemplazos y auditoría del doble control sin debilitar
  su carácter bloqueante.
- Definir cuándo una carpeta está completa y quién acepta el pase.
- Acordar con Alpha2000/MARÍA contrato, alcance y datos externos; ningún
  conector forma parte de esta implementación.

## Implementación y revisión

- Código y rutas: `apps/web/features/importation/`;
  `/operaciones/[operationId]/importacion`.
- Pruebas: 3 unitarias de control/fixture, 1 axe, 4 E2E smoke específicos más
  regresión completa (el resultado final se registra en el plan y PR).
- Capturas de Chromium revisadas a 1440×1000 y 390×844; pruebas E2E comprueban
  anchos 390, 768, 820, 900, 960, 1024, 1280 y 1440 px sin overflow.
- CI, PR y despliegue: pendientes. Revisión funcional/visual integral y
  validación ABT: pendientes.
