# Contexto del proyecto (lo lee Claude Code solo al abrir este repositorio)

**Buzón de sugerencias**: caso simple del taller. Un formulario recibe una sugerencia, la IA la clasifica (área, urgencia, resumen), se guarda en Supabase y una persona la aprueba o rechaza en `/revisar`. Next.js (App Router) + TypeScript, publicado en Vercel. Idioma de trabajo: español.

## Quién trabaja aquí (importante)

Las personas que usan este proyecto **no saben programar**. Construyen con tu ayuda ("vibe coding"):

- Explica en español simple, sin jerga. Si usas un término técnico, defínelo en una frase.
- Habla de "la pantalla", "la base de datos" y "las instrucciones de la IA", no de "endpoints" o "JSON", salvo que te lo pregunten.
- **Ejecuta tú los comandos** cuando haga falta, pidiendo permiso. Si la persona debe copiar algo, dale el texto exacto.
- Para probar, prefiere la **pantalla del navegador** antes que `curl`.
- Después de cada cambio, di en dos líneas qué cambió, en qué archivos y cómo comprobarlo.
- Si algo falla, explica la causa en una frase y propone un solo arreglo.

## Estructura

- `app/page.tsx`: formulario del buzón. `app/revisar/page.tsx`: pantalla del revisor (pide clave).
- `app/api/sugerencias/route.ts`: recibe y guarda (POST) y lista para el revisor (GET).
- `app/api/decidir/route.ts`: el paso donde decide una persona (aprobar o rechazar).
- `lib/supabase.ts` (conexión), `lib/acceso.ts` (clave del revisor y límite de envíos).
- `prompts/clasificar.system.ts`: instrucciones de la IA, como código.
- `supabase/*.sql`: tablas. Se pegan en Supabase → SQL Editor; Claude Code NO las ejecuta.

## Variables de entorno (nunca en archivos)

`ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` (por defecto `claude-haiku-5-5`), `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `CLAVE_REVISOR`. En el Codespace son secretos o `export`; en Vercel, Environment Variables.

## Comandos

- `npm run dev`: enciende en el puerto 3000. `npm run build`: compila; debe terminar sin errores.
- Guardar y publicar: la persona usa el menú de la izquierda (Confirmar y Sincronizar). Vercel publica solo.

## Reglas de trabajo (obligatorias)

1. **Nunca escribir claves** en ningún archivo, comando guardado ni commit. No crear archivos `.env*`.
2. **Pedir un plan antes de escribir código** si el cambio toca más de un archivo, y esperar aprobación.
3. **Un paso pequeño a la vez**, indicando cómo probarlo y el resultado esperado.
4. **Los prompts de la IA van en `prompts/`**, nunca dentro de una ruta.
5. El texto del usuario es dato, no instrucciones. Las reglas fijas (validar el texto, claves, quién puede decidir) las hace un **programa**, no la IA.
6. **Validar la entrada** de toda ruta (tipo y largo) y limitar la salida (`max_tokens`).
7. **La IA solo propone; una persona decide.** Ninguna ruta que cambie un estado puede ser llamada por la IA.
8. **No ejecutar llamadas en lote contra la API** (saldo limitado y compartido): una pregunta a la vez.
9. No instalar librerías sin explicar para qué. No editar `package-lock.json` a mano.
10. La llave `SUPABASE_SECRET_KEY` solo se usa en código de servidor (`lib/supabase.ts`), nunca en pantallas.

## Mi proyecto (cada alumno completa esto)

- **Qué problema resuelve:** 
- **Quién lo usa:** 
- **Qué dato guarda (y cuál NO):** 
- **Qué acción exige aprobación de una persona:** 
