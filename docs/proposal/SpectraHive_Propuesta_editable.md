NASA SPACE APPS CHALLENGE 2026 • PLANET X AND SPHEREX

# SpectraHive

---

SPHEREx Tracker

Plataforma de ciencia ciudadana que convierte el análisis masivo de datos astronómicos en micro-tareas visuales de exploración colaborativa.

PROPUESTA CORREGIDA • VERSION MVP PARA 48 HORAS

### La idea en una frase

El usuario no explora un mapa infinito: recibe un cuadrante acotado, ve el cielo parpadear entre dos epocas con el scroll de imagenes, detecta lo que se movio o cambio de brillo, lo reporta con un clic y otros votos confirman o descartan el hallazgo.

### Que corrige esta version

- El blink / scroll de imagenes se queda intacto: es el corazon del proyecto.
- Alcance recortado a un MVP demostrable de punta a punta.
- Stack simplificado: Vite + React en el front y FastAPI solo en el back.
- Lenguaje corregido: son los 5 objetos que el reto pide probar, no objetivos exigidos.
- ADN Cosmico simplificado y afirmaciones cientificas suavizadas.

Equipo de 4 integrantes • Hackathon 14-15 de noviembre de 2026 • Nombre corto: SpectraHive • Proyecto: SPHEREx Tracker

## 1. El problema: hay demasiados datos y el cuello de botella es humano

La mision SPHEREx de la NASA mapea todo el cielo cada seis meses en 102 bandas de luz infrarroja, capturando el comportamiento temporal de mas de mil millones de objetos celestes. Esa escala crea un problema doble: el volumen es enorme y cada deteccion automatica necesita revision.

Los algoritmos actuales si procesan estos datos, pero dejan falsos positivos por ruido, rayos cosmicos, artefactos y estrellas que cambian de brillo sin moverse. Revisar todo eso solo con especialistas no escala. A la vez, las interfaces astronomicas tradicionales estan pensadas para expertos que ya saben que coordenada buscar, lo que deja fuera al publico general.

Idea central: el ojo humano es muy bueno detectando patrones visuales. Si la tarea se reduce a un cuadrante pequeno, con dos epocas y una pregunta clara - limpio o anomalia - cualquier persona puede aportar una revision util sin saber astronomia avanzada.

### Que busca el reto Planet X and SPHEREx

- Probar la herramienta sobre objetos conocidos que se mueven o varian en el cielo.
- Mostrar series temporales de un mismo parche del cielo como un pequeno video o parpadeo.
- Abrir la busqueda a objetos debiles, lejanos o no catalogados, incluido el angulo de Planet X: un objeto muy lejano se moveria muy lento entre epocas.
- Aprovechar las 102 bandas infrarrojas de forma comprensible para el usuario.

## 2. La solucion: micro-tareas, blink y validacion cruzada

SpectraHive (SPHEREx Tracker) no compite por ser otro visor astronomico. Es un puente de experiencia de usuario: canaliza la curiosidad colectiva hacia resultados que un equipo cientifico puede revisar despues.

### Pilar 1: Exploracion guiada

El sistema sirve cuadrantes acotados y pre-procesados, en una cola fija y ordenada. El usuario no se pierde en todo el cielo: avanza cuadrante por cuadrante y en cada uno responde una micro-tarea rapida.

### Pilar 2: Validacion cruzada

Un reporte no se da por bueno por un solo clic. Si varios usuarios - o votos simulados en la demo - coinciden en la misma coordenada, el cuadrante se marca como confirmado. Si no coinciden, queda descartado o pendiente.

### El ADN Cosmico, en version viable

Cuando un usuario selecciona un objeto, la plataforma muestra su firma infrarroja como un codigo de barras de colores: el ADN Cosmico. Es una representacion visual e intuitiva de la firma espectral, util para comparar objetos de forma educativa. No se presenta como una huella quimica directa: sin calibracion completa, es una firma visual que ayuda a distinguir patrones, no una identificacion quimica definitiva.

En el MVP el ADN Cosmico se limita a los objetos de prueba, con datos precalculados o con 6 a 8 bandas representativas. No se extraen las 102 bandas en vivo para cualquier clic.

## 3. El flujo que se demuestra: el scroll de imagenes no se quita

Flujo: 1. Elegir cuadrante → 2. Blink A / B → 3. Ver resta |B-A| → 4. Clic en la anomalia → 5. Ver ADN Cosmico → 6. Validar

1. Busqueda y acceso directo. Buscador por Ascension Recta (RA) y Declinacion (Dec), con control de Campo de Vision (FOV) y URL dinamica que se actualiza al moverse: /?ra=08h55m&dec=-7d14m&fov=2. Esa URL debe cargar directamente ese parche del cielo.
2. Blink con scroll de imagenes. Reproductor con scroll, slider y play que alterna solo dos epocas, A y B, del mismo parche. Las estrellas fijas no cambian; lo que se desplaza o cambia de brillo llama la atencion de inmediato.
3. Resta de imagenes. El backend calcula Imagen_Diff = |Matriz_B - Matriz_A|, con normalizacion por percentiles 1-99 y un umbral simple. El fondo estatico tiende a negro y el candidato queda brillando aislado. El umbral y el enmascarado se explican en la interfaz: no todo punto brillante es un descubrimiento.
4. Reporte en un clic. El usuario marca la anomalia o confirma que el sector esta limpio. El reporte guarda cuadrante, coordenada RA/Dec y tipo: movimiento o cambio de brillo.
5. ADN Cosmico del objeto seleccionado. Para los objetos de prueba, se muestra la firma visual precalculada junto al reporte.
6. Validacion cruzada demostrable. Con 3 votos coincidentes en la misma coordenada, el estado pasa a confirmado. En la demo esos votos pueden ser simulados, y se indica como simulacion.

## 4. Alcance MVP: lo que se queda y lo que se recorta

### Se queda si o si

- Blink / scroll entre Epoca A y Epoca B
- Buscador RA/Dec + FOV + URL dinamica
- Resta |B-A| con umbral explicado
- Reporte con un clic y validacion cruzada
- Atajos de los objetos de prueba
- ADN Cosmico solo para objetos de prueba
- Cutouts precalculados + modo demo sin internet

### Se recorta o queda como concepto

- Sin panorama HiPS propio de todo el cielo: se usa Aladin Lite centrado en el cuadrante
- Sin motor infinito de cuadrillas aleatorias: cola fija de 10 cuadrantes
- Sin red social, perfiles, feed ni leaderboard
- Sin TAP generico para cualquier coordenada en vivo
- Sin reproyeccion WCS general: pares ya alineados o desplazamiento entero de pixeles
- Blink de solo 2 epocas y un solo falso color (percentiles 1-99)
- FOV con solo 2 valores: 1 y 2

Criterio de exito del MVP: si el flujo completo - buscar, blink, resta, reportar, ver ADN y validar - funciona de punta a punta en la demo, el proyecto esta completo. Todo lo recortado se puede mencionar como trabajo futuro, no como codigo entregado.

## 5. Los 5 objetos que el reto pide probar

La pagina oficial del reto, en Objectives, dice: "Test your tool on Barnard's Star, Epsilon Indi B (a pair of brown dwarfs orbiting a star), WISE 0855 (a fast-moving brown dwarf Right Ascension 08h55m10.831s, declination -7d14m42.53s), and variable stars RW Aurigae and R Draconis."

La lista de 5 es correcta. Lo que se corrige es el lenguaje: el reto no dice que sean exigidos ni obligatorios. En todo el proyecto se usa la formula los 5 objetos que el reto pide probar.

### Grupo 1: se prueban por movimiento

| Objeto | RA / Dec (J2000) | Que debe verse | Atajo |
| --- | --- | --- | --- |
| Barnard's Star<br>Enana roja M4, 5.96 anos luz, Ofiuco | 17h57m48.50s<br>+04d41m36.1s | Movimiento propio ~10.39"/ano: ~5.2" en 6 meses. Desplazamiento claro en el blink. | /?ra=17h57m&dec=+4d41m&fov=2 |
| Epsilon Indi B<br>Par de enanas marrones Ba+Bb | 22h04m10.595s<br>-56d46m58.24s | Movimiento propio ~4.68"/ano: ~2.34" en 6 meses. Segundo caso de desplazamiento. | /?ra=22h04m&dec=-56d47m&fov=2 |
| WISE 0855-0714<br>Enana marron Y4, ~250-285 K, 7.43 anos luz, Hidra | 08h55m10.83s<br>-07d14m42.5s | Movimiento propio ~8.15"/ano: ~4.1" en 6 meses. Objeto muy tenue: prueba el falso color y la resta. | /?ra=08h55m&dec=-7d14m&fov=2 |

### Grupo 2: se prueban por variabilidad de brillo

| Objeto | RA / Dec (J2000) | Que debe verse | Atajo / estado |
| --- | --- | --- | --- |
| RW Aurigae<br>Variable T Tauri | 05h07m49.456s<br>+30d24m04.77s | Movimiento despreciable (~27.5 mas/ano). Cambia de brillo, no de posicion. En blink y en la resta aparece como cambio de brillo y el tutorial debe explicarlo asi. | /?ra=05h07m&dec=+30d24m&fov=2 |
| R Draconis<br>Variable Mira | 16h32m40.23s<br>+66d45m17.9s | Resuelto. Variable Mira, periodo ~8 meses, magnitud ~7.6 en maximo / ~12.4 en minimo. Cambia de brillo, no de posicion: aparece como cambio de brillo en blink y en la resta. Fuente: AAVSO Variable Star Plotter, secuencia X42732UG, J2000. | /?ra=16h32m&dec=+66d45m&fov=2 |

Advertencia de coordenadas: las coordenadas son J2000. Propagadas a finales de 2026, Barnard's Star se ha movido ~4.7' y WISE 0855 ~3.7'. Con FOV 2 los atajos siguen centrando el objeto, pero para cruces con catalogos hay que propagar la posicion o resolver por nombre en SIMBAD / Aladin.

## 6. Stack corregido: pensado para 48 horas, no para produccion

| Capa | Decision corregida | Por que |
| --- | --- | --- |
| Frontend | Vite + React + Tailwind CSS + Aladin Lite por CDN | Next.js sobra para este proyecto: no se necesita SSR ni SEO y suma configuracion. Vite arranca en minutos, usa el mismo React que el equipo ya conoce y despliega facil en Vercel. Aladin Lite ya resuelve navegacion, zoom y HiPS: no se construye un visor propio. |
| Backend | FastAPI (Python) solo, monolitico, 3 endpoints: /cutout, /diff, /report | NestJS queda fuera. Todo el procesamiento astronomico es Python - Astropy, NumPy, SciPy - y con NestJS habria que llamar a Python de todas formas: dos lenguajes, dos despliegues y el doble de errores. |
| Base de datos | PostgreSQL en Supabase, uso directo para el CRUD de reportes | El modelo es relacional y contar votos para la validacion cruzada es directo en SQL. FastAPI queda solo para lo pesado: FITS y resta. Sin duplicar logica. |
| Datos | Cutouts FITS de IRSA precalculados para los objetos de prueba + fallback sintetico | La demo no puede depender de una descarga en vivo. Los cutouts de Barnard y WISE se preparan antes; si IRSA o la red fallan, el modo demo usa datos sinteticos con la misma logica de blink y resta. |
| Despliegue | Vercel para el front, Render para FastAPI | Despliegue simple, sin infraestructura propia que mantener durante el hackathon. |

Alternativa descartada: Streamlit seria mas rapido en Python puro, pero la experiencia de usuario quedaria debil para ciencia ciudadana y se perderia control sobre el blink y el mapa.

### Modelo de datos minimo

| Tabla | Contenido minimo |
| --- | --- |
| cuadrantes | id, RA, Dec, FOV, epoca A, epoca B, estado (pendiente / confirmado / descartado), es_objeto_prueba |
| reportes | id, cuadrante_id, RA, Dec, tipo (movimiento / brillo / limpio), creado_en |
| validaciones | id, reporte_id, coincide (si / no), es_simulado, creado_en. Confirmado = 3 coincidencias en la misma coordenada. |

### Pipeline de datos infrarrojos

7. Extraccion: el backend obtiene solo el recorte (cutout) del RA/Dec y FOV pedido, en formato FITS, en vez de descargar mosaicos completos.
8. Lectura: Astropy lee la matriz de intensidad y los metadatos del encabezado.
9. Alineacion acotada: solo pares ya alineados o correccion por desplazamiento entero de pixeles. Sin reproyeccion WCS general en el MVP.
10. Falso color unico: normalizacion por percentiles 1-99 y mapeo a RGB perceptible. Una sola paleta.
11. Resta: |B-A| con umbral y mascara basica para separar candidatos de ruido.

## 7. Datos de la NASA, Planet X y limites honestos

### Uso de datos y recursos

- Fuente principal: archivo IRSA de NASA / IPAC - Caltech, con archivos FITS de SPHEREx (incluidos formatos de multiples extensiones cuando aplique) y recortes por coordenadas.
- Consulta acotada: TAP (Table Access Protocol) solo para localizar los cutouts de los objetos de prueba, no como buscador generico en vivo para cualquier coordenada durante la demo.
- Visualizacion: Aladin Lite consume las vistas del cielo ya publicadas; el proyecto no construye su propio sistema HiPS.
- Recursos del reto: la pestana Resources de la pagina del reto muestra 8 recursos (4 de NASA y 4 de CSA). La guia Quick Start y el tutorial de Data Release 1 deben buscarse en la pagina de IRSA SPHEREx, no solo en la pagina del reto.

### El angulo de Planet X

El reto se llama Planet X and SPHEREx. Un candidato a Planet X no se distinguiria por moverse rapido, sino por todo lo contrario: ser un objeto muy lejano, debil en infrarrojo y con un movimiento muy lento entre epocas, en una zona del cielo compatible con las posiciones esperadas. Por eso la herramienta separa el tipo de reporte - movimiento rapido, movimiento lento o cambio de brillo - y deja constancia de la velocidad aparente. Como referencia de posiciones esperadas puede consultarse la herramienta MOST mencionada en los recursos del reto. En el MVP esto se explica y se clasifica; no se afirma haber descubierto Planet X.

### Limites que se dicen en voz alta

- Si las dos epocas no estan alineadas a menos de un pixel, la resta no cancela las estrellas fijas y aparecen falsos positivos. Por eso el MVP trabaja con pares controlados.
- Una estrella variable brilla en la resta sin haberse movido. Movimiento y brillo son reportes distintos.
- La validacion cruzada necesita usuarios reales para escalar. En la demo se demuestra el mecanismo con votos simulados, identificados como tales.
- R Draconis ya esta resuelto con fuente AAVSO (RA 16h32m40.23s, Dec +66d45m17.9s, J2000): como RW Aurigae, se prueba por variabilidad de brillo, no por desplazamiento.

## 8. Plan de 48 horas para un equipo de 4

| Rol | Entregable |
| --- | --- |
| Frontend + blink | Vite + React, buscador RA/Dec, FOV 1/2, URL dinamica, reproductor con scroll entre A y B, Aladin Lite centrado. |
| Backend + resta | FastAPI con /cutout, /diff y /report; lectura FITS con Astropy; resta \|B-A\| con umbral; fallback sintetico. |
| Datos + base de datos | Supabase con cuadrantes, reportes y validaciones; cola fija de 10 cuadrantes; cutouts precalculados; atajos de los objetos de prueba. |
| ADN Cosmico + pitch | Firma visual precalculada para objetos de prueba, tutorial de Barnard y de variabilidad de brillo, pagina del proyecto y ensayo de demo de 3 minutos. |

### Orden de construccion

12. Blink real con Barnard's Star funcionando sobre un cutout de IRSA.
13. Resta |B-A| funcionando, con el umbral explicado.
14. Reporte y validacion cruzada, con votos simulados si hace falta.
15. ADN Cosmico simplificado para el objeto seleccionado.
16. Solo si sobra tiempo: ampliar la cola de cuadrantes y pulir la presentacion.

Checklist de demo: buscar por RA/Dec - abrir la URL dinamica - blink A/B con scroll - mostrar la resta - reportar con un clic - mostrar el ADN Cosmico - confirmar con 3 votos - explicar en una frase el candidato lento tipo Planet X y el caso de brillo variable.

Trabajo futuro, fuera del MVP: panorama HiPS propio, cuadrillas aleatorias con cobertura global, extraccion espectral completa de 102 bandas en vivo, reproyeccion WCS general y cuentas de usuario completas.

