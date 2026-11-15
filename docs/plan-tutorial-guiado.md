<!-- Assisted by Codex (SI) — reviewed by pendiente -->

# Plan de implementación: tutorial guiado para nuevos usuarios

## Objetivo

Ayudar a una persona que abre SpectraHive por primera vez a entender y completar el flujo disponible en la interfaz: elegir un objeto/cuadrante, comparar épocas, interpretar la resta, seleccionar una posición, enviar un reporte y consultar el ADN Cósmico.

El tutorial será parte del frontend, no añadirá rutas ni dependencias y presentará toda la interfaz del producto en inglés. Su copy debe respetar `docs/spec/00-contexto-general.md`, especialmente RF-09…RF-15 y RN-02/RN-03/RN-12/RN-14.

## Lo que la interfaz permite hoy

- Atajos para los cinco objetos de prueba, cada uno etiquetado por grupo.
- Cola con navegación anterior/siguiente y selección directa de cuadrante.
- Controles FOV 1°/2° y selector de capa HiPS para el mapa de Aladin.
- Blink A ↔ B con reproducción/pausa y selección de una posición en el cutout.
- Pestaña de resta `|B − A|`, umbral y candidatos explicados.
- Reporte clasificado como movimiento, brillo o limpio, además del modal de ADN Cósmico.
- La URL refleja coordenadas/FOV en acciones explícitas como elegir atajo, cuadrante o blanco.

**Límite que debe quedar claro en el plan:** no hay formulario visible para introducir RA/Dec. El usuario puede abrir una URL con `?ra=...&dec=...&fov=...`, elegir uno de los cinco atajos o seleccionar una posición en el cielo/cutout. No se debe mostrar un paso que prometa un campo de búsqueda que no existe. El zoom con rueda del mapa y el paneo también tienen comportamiento distinto de los controles oficiales FOV/URL, así que el tutorial debe recomendar los botones 1°/2° para fijar el campo compartible.

## Experiencia propuesta

Un tour breve de **8 pasos**, con tooltip contextual, resaltado del control activo y botones **Back**, **Next**, **Skip tutorial** y **Finish**. Mostrar progreso, por ejemplo `Step 3 of 8`. El usuario puede cerrar el tour en cualquier momento y volver a iniciarlo desde un botón persistente `How to use SpectraHive`.

| Paso | Ancla visual | Mensaje que debe comunicar | Interacción / avance |
| --- | --- | --- | --- |
| 1. Welcome | Modal centrado o encabezado | “Explore infrared sky data by comparing two epochs. This short tour shows the main controls.” Aclara que es una guía opcional y ofrece empezar/saltar. | `Start tour` inicia; `Skip tutorial` cierra. |
| 2. Choose a target | `TestObjectShortcuts` | “Start with one of the five objects the challenge asks you to test.” Explica los dos grupos: Barnard, Epsilon Indi B y WISE 0855 prueban movimiento; RW Aurigae y R Draconis prueban brillo. Brillo no es movimiento. | Pedir seleccionar un atajo. Tras el cambio de objeto/cuadrante, habilitar `Next`; incluir una acción `Continue with current target` si el usuario ya eligió uno. |
| 3. Navigate the queue | `QuadrantQueueNav` | La cola recorre cuadrantes disponibles y permite volver al anterior. Diferenciar cola de atajos de objetos. | Usuario puede avanzar/retroceder o seguir con el actual. No depender de que la cola local tenga los diez elementos hasta que RF-05 esté completo. |
| 4. Set field of view | Controles FOV de `HudHeader` y HUD de coordenadas | FOV 1°/2° controla el área. El selector `Layer` cambia el mapa base de Aladin; no cambia época A/B ni el cutout del inspector. La URL contiene coordenadas/FOV para compartir una selección. | Resaltar los botones 1°/2°. No afirmar que el gesto de zoom actualiza FOV de URL. |
| 5. Compare epochs | `BlinkViewer` en pestaña Blink | Las imágenes A y B son dos épocas del mismo cuadrante. Se puede dejar la alternancia automática, pausarla o cambiar manualmente. | Esperar, pausar o alternar; permitir seguir sin bloquear por la carga de imágenes. |
| 6. Inspect the difference | pestaña `RESTA |B − A|` y panel `DiffViewer` | `|B−A|` resalta cambios; el umbral separa candidatos. Una fuente fija se cancela. Los candidatos incluyen valor y motivo; una lista vacía también es un resultado válido. | Avanzar al cambiar a la pestaña o permitir `Next` explícito. Si hay candidato, mostrar que puede seleccionarse; si no, pasar a selección manual. |
| 7. Select and report | candidato, cutout y acciones de reporte en `BlinkViewer` | Seleccionar un candidato o una posición del cutout fija las coordenadas del blanco. Para el grupo de brillo, describir cambio de brillo de una fuente esencialmente estacionaria; no clasificarlo como movimiento. Mostrar “Mark as Clean” como opción válida si no hay anomalía. | Abrir el modal de reporte al hacer clic en la acción correspondiente. Resaltar clasificación válida según `tipo_prueba`, sin enviar un reporte automáticamente. |
| 8. Consensus and Cosmic DNA | resultado de `ReportModal` y botón/modal ADN | Explicar que la validación requiere tres coincidencias para el mismo reporte y que los votos de demo son simulados, claramente etiquetados. Presentar Cosmic DNA como firma visual precalculada para comparación, no identificación química. | Permitir cerrar el modal de ADN y terminar. No exigir que el usuario cree un reporte para ver ADN. |

### Estados de cierre

- **Finish:** cerrar, guardar la versión vista del tutorial y dejar la interfaz usable.
- **Skip:** cerrar sin forzar pasos ni seleccionar objetos.
- **Replay:** desde un control persistente se reinicia el paso 1.
- **Re-open:** si se cierra un modal del producto o se interrumpe el tour, reabrir sin perder el contexto válido; si el ancla ya no existe (por ejemplo, inspector cerrado), volver a abrirlo o saltar a un aviso de ubicación.
- **Deep link:** si la página abre con coordenadas en URL, empezar con ese contexto y no reemplazar silenciosamente la selección por Barnard.

## Plan de trabajo

### Fase 1 — Definir contenido y anclas

1. Confirmar el copy en inglés usando términos ya visibles en la UI.
2. Añadir atributos estables `data-tutorial="..."` a cada ancla; no seleccionar elementos por clases Tailwind ni texto traducible.
3. Identificar anclas responsivas: header/FOV, cola, atajos, tabs, candidato, acciones de reporte y control de ADN.
4. Definir el comportamiento de los pasos que requieren una acción y permitir continuar con el estado actual.

**Resultado:** contenido revisable y lista de anclas, sin lógica de tour todavía.

### Fase 2 — Modelo y controlador del tutorial

Agregar:

- `src/types/tutorial.ts`: tipo estricto de paso (`id`, `target`, `title`, `body`, posición preferida, acción requerida opcional y condición de disponibilidad).
- `src/data/tutorial-steps.ts`: contenido de los ocho pasos y orden.
- `src/hooks/useGuidedTutorial.ts`: estado `idle | active | completed`, índice actual, `start`, `next`, `back`, `skip`, `finish` y manejo de avance condicionado a acciones observables.

Guardar finalización en `localStorage` con clave versionada, por ejemplo `spectrahive:tutorial:v1`; no guardar coordenadas, reportes ni otros datos de usuario. Si se cambia el flujo o copy sustancialmente, subir la versión para que el nuevo tour pueda presentarse de nuevo.

### Fase 3 — Capa visual accesible

Agregar `src/components/tutorial/GuidedTutorial.tsx` para overlay, spotlight, tooltip, progreso y navegación. Montarlo desde `App.tsx`.

- Fondo oscurecido con el elemento activo visible; el foco y los clics se mantienen dentro de los controles de la guía.
- En desktop posicionar tooltip junto al ancla; en móvil usar panel inferior/centrado sin tapar el control resaltado.
- Al cambiar de paso, desplazar el ancla a la vista si hace falta y enfocar el título/botón adecuado.
- Soportar teclado: foco visible, `Tab`, `Enter`, `Escape` para cerrar y atributos `role="dialog"`, `aria-modal`, `aria-labelledby` y estado de progreso accesible.
- Evitar que el fondo `pointer-events-none` de la composición actual bloquee la interacción del tour o de los controles resaltados; verificar la interacción con los modales de reporte y ADN.

### Fase 4 — Conexión con la interfaz

1. Añadir botón persistente `How to use SpectraHive` en `HudHeader` o en un lugar visible del HUD.
2. En primer uso, ofrecer la guía sin impedir que se omita. Evitar que la carga del backend o los cutouts bloquee el arranque.
3. Conectar pasos a cambios reales: selección de objeto, cambio de pestaña, selección de candidato/blanco, apertura/cierre de modales.
4. No ejecutar `submitReport`, `validateReport`, ni cambiar cuadrante/FOV por cuenta del tutorial. Las acciones que escriben datos siempre requieren un clic explícito del usuario.
5. Cuando se abra un modal propio, cerrar o pausar la capa del tour para prevenir diálogos superpuestos; reanudar en contexto después de cerrar, o completar el paso con una explicación breve.

### Fase 5 — Revisión funcional y de contenido

Recorrer manualmente estos escenarios antes de integrar:

- Primera visita, completar, saltar, volver a abrir y recargar después de completar.
- Ingreso con URL válida de un objeto y con URL personalizada; conservar el contexto.
- Elegir uno de los tres objetos de movimiento y uno de los dos de brillo; verificar copy y tipo correcto.
- Diferencia con candidatos y sin candidatos; selección tanto por lista como por clic en cutout.
- Reporte de anomalía y “Mark as Clean”; asegurar que no hay envío automático y que votos simulados están etiquetados.
- Abrir ADN antes y después de reportar; comprobar copy RF-15.
- Inspector cerrado, carga lenta/error de API, viewport angosto, navegación solo teclado y cierre por Escape.

## Archivos previstos

| Archivo | Cambio planeado |
| --- | --- |
| `src/App.tsx` | Inicialización, montaje del tour y conexiones de eventos. Mantenerlo como orquestador; evitar acumular la definición de pasos ahí. |
| `src/components/tutorial/GuidedTutorial.tsx` | Overlay, spotlight, tooltip, progreso, botones y accesibilidad. |
| `src/hooks/useGuidedTutorial.ts` | Estado y ciclo de vida del tour, persistencia versionada y transiciones. |
| `src/data/tutorial-steps.ts` | Pasos/copy/configuración declarativa. |
| `src/types/tutorial.ts` | Contratos TypeScript del modelo de pasos. |
| Componentes ancla existentes | Añadir `data-tutorial` y, si hace falta, callbacks/eventos mínimos para que el tour observe acciones. |
| `README.md` | Registrar asistencia de IA conforme a RN-12 al implementar. |

## Criterios de aceptación

- Un usuario nuevo puede iniciar, completar o saltar la guía; un usuario recurrente puede volver a abrirla.
- Cada paso apunta a un control que existe en la UI actual y los pasos accionables responden a interacciones reales.
- La guía diferencia movimiento de brillo y explica el umbral, los votos simulados y el significado visual del ADN Cósmico correctamente.
- No inventa formulario de búsqueda, datos astronómicos, candidatos ni confirmación de votos reales.
- El tour no altera la URL, el cuadrante, el reporte ni la selección del usuario sin una acción suya.
- Es usable con teclado y en móvil; fallos/cargas del backend no dejan al usuario atrapado.
- No añade dependencia ni cambia stack, requisitos, contratos, modelo de datos u objetos de prueba.

## Orden recomendado de implementación

1. Completar los anclajes y validar textos/orden del recorrido.
2. Implementar hook y estado de persistencia.
3. Implementar overlay accesible responsive.
4. Conectar eventos de `App` y los controles, evitando efectos laterales.
5. Ejecutar el recorrido de revisión de la Fase 5 y ajustar copy/layout.

## Decisiones de alcance

- Tutorial de interfaz, breve y reutilizable; no es una explicación astronómica extensa.
- Sin tour de dependencias de terceros. La UI ya usa layout superpuesto y modales; una implementación local evita sumar paquete y facilita controlar foco/interacciones.
- La búsqueda manual RA/Dec queda fuera de este tutorial porque no existe el control en la pantalla. Puede tratarse como trabajo separado para completar RF-01; este plan solo explica el acceso por URL y las formas visibles actuales de seleccionar un objetivo.
- Si durante la implementación se concluye que hay que cambiar un RF/RN, contrato, datos o alcance, detenerse y seguir RN-14.
