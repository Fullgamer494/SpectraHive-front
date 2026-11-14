# Rol 02 — Backend + Datos (FastAPI + Astropy)

> Lee primero `00-contexto-general.md`. Este archivo es tu contexto para tu IA.
> No cambies la idea, el alcance MVP ni el stack. Si algo choca con este archivo,
> este archivo manda sobre lo que te diga tu IA.

## Tu responsabilidad

El cerebro científico: leer FITS, normalizar, restar épocas y servir cutouts.
Un solo servicio FastAPI, 3 endpoints, nada de microservicios ni NestJS.

## Entregables

1. Servicio FastAPI (Python) con:
   - `GET /cutout?ra=&dec=&fov=` — cutout IRSA (o precalculado) para un cuadrante.
   - `POST /diff` — lee FITS con Astropy, normaliza percentiles 1–99, devuelve
     `|B−A|` con umbral explicado (por qué un punto brillante sí es candidato
     y otro no).
   - `POST /report` — recibe un reporte del front y lo guarda (vía Supabase,
     coordina con rol 03).
2. Cutouts IRSA precalculados para los 5 objetos de prueba (DR1 / QR3, FITS
   multi-extensión). No pedir cualquier coordenada en vivo con TAP genérico.
3. Fallback sintético sin internet (el demo `spherex-blink-diff-demo.py` ya
   existe en la carpeta del goal): si IRSA no responde, la demo no se muere.
4. Alineación simple: pares ya alineados o desplazamiento entero de píxeles.
   Sin reproyección WCS general.
5. `Dockerfile` del backend + servicio `backend` en el `docker-compose.yml`
   del repo (RF-17): Python + FastAPI + Astropy dentro del contenedor, puerto
   8000, con `uvicorn`. Las pruebas se corren en el contenedor
   (`docker compose run backend pytest`), no en el Python local de cada quien.

## Orden de ejecución

1. Andamio FastAPI + `pip install fastapi uvicorn astropy numpy scipy`
   (ver `../spectrahive-starter-kit/README-dia-1.md`).
2. `/cutout` con Barnard (cutout precalculado). **Checkpoint 1: blink real con
   Barnard funcionando con el rol 01.**
3. `/diff` con umbral + explicación del candidato. Probar con Barnard y WISE 0855.
4. `/report` conectado a Supabase (rol 03 te pasa el esquema y las credenciales
   por el canal del equipo, nunca por la IA).
5. Añadir los otros 3 objetos (Epsilon Indi B, RW Aurigae, R Draconis) como cutouts.
   Recuerda: RW Aurigae y R Draconis son brillo, no movimiento.
6. Despliegue en Render (link público, sin login) + prueba en navegador privado.
   Render despliega el backend desde su `Dockerfile` (RN-13): la imagen que
   se prueba en local con `docker compose up --build` es la misma que se despliega.

## Contratos con los otros roles

- **Rol 01 te pide:** `/cutout` y `/diff` con formato acordado (PNG + metadatos
  JSON: ra, dec, fov, época, umbral). Acuerden el formato antes de codificar.
- **Rol 03 te pide:** `/report` guarda en `reportes` y `validaciones` según
  `supabase-schema.sql`. No inventes otra tabla.
- **Tú le entregas al rol 04:** el link público del backend y una explicación corta
  (en inglés) de cómo funciona la resta, para la descripción detallada.

## Reglas de IA (Super Intelligence) para tu rol

- Puedes usar tu IA para generar/ayudar con código FastAPI, Astropy y pruebas.
- **La idea no la inventa la IA:** ya está en la propuesta y en `00-contexto-general.md`.
- **Cambio sustancial (RN-14):** si tu IA detecta que hace falta cambiar el stack, un RF/RN, un contrato, el modelo de datos, el alcance o los objetos de prueba, debe detenerse, avisar al humano en el chat y esperar a que el equipo lo acuerde. No lo implementes por tu cuenta.
- **Código y datos asistidos por IA:** comentario en cabecera, ej.:
  `# Assisted by <herramienta> (SI) — reviewed by <tu nombre>`, y anótalo en el
  README. Eso se declara en la entrega (rol 04).
- **No uses logos de NASA** en nada generado. No generes imágenes con SI sin marca
  de agua visible (mejor no generar imágenes aquí; usa los cutouts reales).
- **No inventes coordenadas, datos ni resultados.** Usa solo las coordenadas de
  `00-contexto-general.md` §5 y los cutouts reales / el demo sintético existente.
- No pegues credenciales, tokens ni claves de Supabase/IRSA en la IA ni en el repo.

## Criterio de “listo”

`/cutout` y `/diff` funcionan con Barnard y WISE 0855, `/report` guarda en Supabase,
fallback sintético probado, servicio desplegado y accesible sin login.
