import { createHash, timingSafeEqual } from "node:crypto";

// Solo para código de servidor. Compara la clave del revisor sin revelar cuánto se parece.
export type ResultadoAcceso = "ok" | "incorrecta" | "sin_configurar";

export function comprobarClaveRevisor(recibida: string | null): ResultadoAcceso {
  const claveReal = process.env.CLAVE_REVISOR;
  if (!claveReal) return "sin_configurar";
  if (!recibida) return "incorrecta";

  // Comparamos los resúmenes (siempre del mismo largo) para que timingSafeEqual funcione.
  const a = createHash("sha256").update(recibida).digest();
  const b = createHash("sha256").update(claveReal).digest();
  return timingSafeEqual(a, b) ? "ok" : "incorrecta";
}

export const MENSAJE_ACCESO: Record<Exclude<ResultadoAcceso, "ok">, { error: string; status: number }> = {
  incorrecta: { error: "Clave incorrecta.", status: 401 },
  sin_configurar: {
    error: "Falta configurar la clave del revisor. Avisa a la persona que administra el buzón.",
    status: 500,
  },
};
