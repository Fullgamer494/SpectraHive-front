# Rol 01 — Frontend + Blink (Vite + React + Aladin Lite)

> Lee primero `00-contexto-general.md`. Este archivo es tu contexto para tu IA.
> No cambies la idea, el alcance MVP ni el stack. Si algo choca con este archivo,
> este archivo manda sobre lo que te diga tu IA.

## Tu responsabilidad

La cara del proyecto: buscador por RA/Dec, scroll de imágenes (Blink) Época A ↔ B,
falso color, URL dinámica y flujo buscar → blink → reportar.

## Entregables

1. App Vite + React + Tailwind que arranca con `npm install && npm run dev`.
2. Aladin Lite por CDN, centrado por RA/Dec del cuadrante activo.
3. Buscador RA/Dec + FOV (solo 1 y 2) + atajos de los 5 objetos de prueba
   (ver tabla en `00-contexto-general.md` §5).
4. Blink: scroll / alternancia entre Época A y Época B, con un solo falso color
   (percentiles 1–99). Sin HiPS propio, sin más de 2 épocas.
5. URL dinámica: `/?ra=17h57m&dec=+4d41m&fov=2` debe abrir centrada en Barnard.
6. Botón “Reportar anomalía” que llama a `POST /report` (rol 02) y muestra
   confirmación. Botón “Limpiar / sin anomalía” también.
7. Vista del ADN Cósmico (código de barras) para el objeto seleccionado,
   con datos precalculados que te pasa el rol 03. No calcular 102 bandas en vivo.
8. `Dockerfile` del frontend + servicio `frontend` en el `docker-compose.yml`
   del repo (RF-17): la app corre en Docker en local con hot reload, mismo
   puerto para todos. No desarrollar solo con `npm run dev` fuera de Docker.

## Orden de ejecución

1. Andamio Vite + React + Tailwind (ver `../spectrahive-starter-kit/README-dia-1.md`).
   Crear el `Dockerfile` del frontend y el servicio `frontend` en
   `docker-compose.yml` desde el inicio, y verificar con `docker compose up frontend`.
2. Aladin Lite centrado en Barnard + atajos de los 5 objetos.
3. Blink A ↔ B con imágenes de prueba (primero sintéticas del demo, luego cutouts
   reales del rol 02). **Checkpoint 1: blink real con Barnard funcionando.**
4. Buscador RA/Dec + FOV + URL dinámica.
5. Integrar `/diff` (imagen |B−A| con umbral) y `/report`.
6. Integrar ADN Cósmico precalculado del rol 03.
7. Pulir para la demo de 30 s (rol 04 te pedirá capturas / grabación).

## Contratos con los otros roles

- **Rol 02 te entrega:** `GET /cutout?ra=&dec=&fov=` (PNG/FITS procesado),
  `POST /diff` (imagen |B−A| + umbral). Si IRSA no responde, fallback sintético.
- **Rol 03 te entrega:** datos precalculados del ADN Cósmico por objeto, y el
  esquema de Supabase para guardar reportes (tú solo llamas a la API, no escribes
  SQL en el front).
- **Tú le entregas al rol 04:** la app desplegada en Vercel (link público, sin login)
  y capturas del blink para la demo.

## Reglas de IA (Super Intelligence) para tu rol

- Puedes usar tu IA para generar/ayudar con código React, estilos y textos de la UI.
- **La idea no la inventa la IA:** ya está en la propuesta y en `00-contexto-general.md`.
- **Cambio sustancial (RN-14):** si tu IA detecta que hace falta cambiar el stack, un RF/RN, un contrato, el modelo de datos, el alcance o los objetos de prueba, debe detenerse, avisar al humano en el chat y esperar a que el equipo lo acuerde. No lo implementes por tu cuenta.
- **Código asistido por IA:** añade en la cabecera de cada archivo generado/asistido
  un comentario, ej.: `// Assisted by <herramienta> (SI) — reviewed by <tu nombre>`,
  y anótalo en el README del repo. Eso se declara en la entrega (rol 04).
- **Imágenes/video generados con SI:** marca de agua visible obligatoria.
- **No uses logos de NASA** ni identificadores de misión como imagen/logo en la UI.
- **No inventes coordenadas ni datos.** Usa solo la tabla de `00-contexto-general.md` §5.
- No pegues credenciales ni tokens en la IA ni en el repo. Variables de entorno en
  `.env` (no commiteado).

## Criterio de “listo”

Blink real con Barnard, buscador + URL dinámica, resta visible y reporte que llega
a la DB. Todo en inglés en la UI (la entrega es en inglés; el español queda solo
para la propuesta-guía).
