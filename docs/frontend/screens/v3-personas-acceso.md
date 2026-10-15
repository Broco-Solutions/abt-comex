# Personas, equipos y acceso V3

## Ampliación interna — nómina laboral relevada (15/10/2026)

El responsable autorizó expresamente nombres y correos laborales en la
evaluación pública. Se releyó `Equipo y referentes!A1:X28` y `A29:H50` de
[la planilla fuente](https://docs.google.com/spreadsheets/d/1mLz1EsDesvCOeHffMAQyPW2nOI-eLNI7LQRdUxves2U/edit):
16 personas en filas 2–17, 7 de Importación, 4 de Exportación, 2 de
Administración y 3 de Dirección. Se excluyen cuentas sin referente, técnicas y
buzones funcionales. La correspondencia nominal, ID estable y fila están en
`features/people/data/team-roster.ts`; sólo incluye datos laborales necesarios.

Se usa el correo individual **actual**, no el futuro propuesto para una
migración. Magali queda sin correo individual; apellido ausente no se completa
y la discrepancia Malvia/malvina se presenta pendiente. No se copian notas de
infraestructura ni correos personales. Todos los accesos parten **No relevado**,
capacidades vacías, ingreso/referente individual sin informar. El área no
concede capacidades. Los referentes del relevamiento Sergio/Maria/Ramiro se
contrastaron con [minuta de 28/09/2026](https://docs.google.com/document/d/1_ZHi54g_-N8TTRao_MbxX1dwobhBEt66RuzSX3o1EF4/edit)
y respuesta operativa. Su función no equivale a asignación individual a un caso.

Los escenarios y cuentas `@example.invalid` viven fuera de la nómina. Conservan
login de evaluación y Portal aislado. Activar un acceso desde un formulario es
una modificación local explícita, sin autenticación ni invitación real. Los
trabajos anteriores con nombres ficticios quedan sin asignación individual.
Los equipos operativos A/B son contextos sintéticos preexistentes y no se
convierten en los equipos reales ni se asignan a personas por inferencia.

Esta ampliación sustituye las menciones históricas de «personas sintéticas» de
la primera versión de V3-03; las capacidades y tareas siguen siendo sintéticas.

> Estado: Under review
> Incremento: V3-03 · revisión técnica 15/10/2026; aceptación humana pendiente

## Trabajo y autoridad

USR-001, USR-002 y ACC-001, aprobados internamente para evaluar frontend; no matriz de roles validada por ABT. [Alcance V3](../../product/ALCANCE_FUNCIONAL.md#evolución-v3--aprobación-interna-15102026) y [estándar](../FRONTEND_STANDARD.md) gobiernan producto y patrones. No se usan nombres, correos ni datos laborales de integrantes reales.

## Experiencias

- `/configuracion/personas`: buscar nombre/correo/área/función, filtrar acceso, alta y abrir ficha.
- Búsqueda y acceso en URL, actualización local, Atrás/Adelante y retorno explícito desde ficha con foco/posición, sin recarga de documento.
- `/configuracion/personas/[memberId]`: identidad, correo de prueba opcional sin acceso, área, función, fecha de ingreso opcional solicitada por el responsable, referente, equipos, capacidades y actividad. Edición actualiza estado compartido. No incluye remuneraciones ni gestión de correo.
- `/configuracion/equipos`: alta/edición de equipo, responsable y suplente distintos; integrantes desde sus fichas. No otorga capacidades por pertenencia.
- `/acceso`: ingreso convencional visual con correo de prueba y contraseña efímera; mostrar/ocultar sin perder valor. No verifica ni guarda contraseñas ni identifica personas reales.
- `/acceso/escenarios`: acceso secundario a seis perspectivas ficticias; no selector de roles productivos.
- `/acceso/recuperar` y `/acceso/restablecer`: recuperación local, confirmación sin envío, coincidencia de campos, estado de enlace vencido y retorno. No genera tokens ni modifica credenciales.

## Integrante y acceso

Una persona puede existir sin acceso. Correo funcional no se convierte automáticamente en persona. Acceso Sin acceso/Invitación preparada/Activo/Suspendido/Baja de acceso representa únicamente el recorrido de evaluación; invitación no envía mensajes. Correo de acceso único y `@example.invalid`, restricción de privacidad de este entorno, no política productiva de ABT. Nombre necesario para preparar el registro; otros campos laborales opcionales, salvo correo al preparar acceso. Fecha de ingreso no proviene del relevamiento.

Área, función, equipo y perspectiva contextual se editan separadamente de capacidades. El preset requiere acción explícita. Persona externa sólo conserva capacidades de Portal y cliente ficticio autorizado. La capacidad people.manage habilita esta administración, no se infiere del cargo. Restricciones del frontend no son seguridad productiva.

Suspender/bajar acceso presenta pendientes asignados y permite transferirlos a una persona interna activa o bandeja sin asignación individual. No borra persona, modifica actores históricos, completa controles ni cierra operaciones. Responsables y suplentes de equipos se muestran para revisión explícita; no reemplazo automático. Reactivación requiere edición y revisión de capacidades.

La transferencia sólo ofrece personas que puedan consultar el contexto de los pendientes según las capacidades/ámbito actuales; no concede permisos ni define una política de asignación o aprobación ABT. Evita transferir tareas comerciales a un operador sin consulta comercial, o Exportación a una perspectiva sólo de Importación. Dejar sin asignación conserva la tarea para revisión del equipo.

## Estado compartido y sensibilidad

Las asignaciones se proyectan en Inicio/Mi trabajo; escenarios leen capacidades vigentes. Las categorías económicas se filtran antes de gráficos, conteos y registros; selector de columnas no concede acceso. Sin capacidad de personas no se muestra su navegación ni sus fichas. Un usuario suspendido no accede por login ni por preset.

Cambiar identidad reinicia transacciones/organizaciones temporales tras confirmación si hay cambios, pero conserva la configuración de personas para poder comprobar nuevos accesos y suspensiones. Salir o reiniciar explícitamente restaura también personas/equipos. Inducción conserva progreso independiente. No se conserva contraseña ni recuperación, no hay sesión productiva.

## Aceptación y evidencia

Persona nueva visible tras guardar; equipos editables; duplicado de correo bloqueado; suspender transfiere pendientes; historial conservado. Cambiar área a Dirección no habilita datos comerciales/financieros. Capacidad parcial de facturación no revela cobros/gastos ni sus conteos. Portal no abre Shell interno. Recuperación no afirma envío ni cambio efectivo.

Formularios responsivos, diálogo con scroll interno, nombres accesibles, foco y teclado del combobox del DS. Pruebas: [modelo](../../../apps/web/features/people/data/people.test.ts), [a11y](../../../apps/web/features/people/components/people.a11y.tsx), [E2E](../../../apps/web/e2e/specs/v3-people-access.spec.ts). Gates reales en el [plan](../PLAN_IMPLEMENTACION.md#v3--evolución-integral-autorizada-internamente-15102026), sin sustituir revisión humana.

## Pendientes ABT

Catálogo de capacidades y ámbitos definitivos, responsables/suplencias, datos laborales requeridos, acceso externo por cliente/operación/documento y evidencias de aprobación. Identidad, envío de invitaciones y seguridad reales se definen por separado; no se implementan aquí.
