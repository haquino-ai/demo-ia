import { NextResponse } from "next/server";
import { comprobarClaveRevisor, MENSAJE_ACCESO } from "@/lib/acceso";
import { crearClienteSupabase } from "@/lib/supabase";

const DECISIONES = ["aprobada", "rechazada"] as const;
const MAX_MOTIVO = 300;

// Paso donde decide una persona. Solo cambia sugerencias en estado 'pendiente'.
// La IA no llama a esta ruta.
export async function POST(request: Request) {
  const acceso = comprobarClaveRevisor(request.headers.get("x-clave-revisor"));
  if (acceso !== "ok") {
    const { error, status } = MENSAJE_ACCESO[acceso];
    return NextResponse.json({ error }, { status });
  }

  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: "No se pudo leer el envío." }, { status: 400 });
  }
  const { id, decision, motivo } = (cuerpo ?? {}) as Record<string, unknown>;

  if (typeof id !== "number" || !Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Falta el número de la sugerencia." }, { status: 400 });
  }
  if (!DECISIONES.includes(decision as (typeof DECISIONES)[number])) {
    return NextResponse.json({ error: "La decisión debe ser aprobada o rechazada." }, { status: 400 });
  }
  if (motivo !== undefined && motivo !== null && typeof motivo !== "string") {
    return NextResponse.json({ error: "El motivo debe ser texto." }, { status: 400 });
  }
  const motivoLimpio = typeof motivo === "string" ? motivo.trim() : "";
  if (motivoLimpio.length > MAX_MOTIVO) {
    return NextResponse.json(
      { error: `El motivo es muy largo. El máximo es ${MAX_MOTIVO} caracteres.` },
      { status: 400 },
    );
  }

  const supabase = crearClienteSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Falta configurar la base de datos. Avisa a la persona que administra el buzón." },
      { status: 500 },
    );
  }

  // La condición eq("estado", "pendiente") va dentro de la misma consulta:
  // así, dos clics seguidos no pueden cambiar la misma sugerencia dos veces.
  const { data, error } = await supabase
    .from("sugerencias")
    .update({
      estado: decision,
      motivo: motivoLimpio || null,
      decidida_en: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("estado", "pendiente")
    .select("id");
  if (error) {
    console.error("Decisión fallida:", error.message);
    return NextResponse.json({ error: "No se pudo guardar la decisión. Inténtalo de nuevo." }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: "Esta sugerencia ya fue decidida o no existe." },
      { status: 409 },
    );
  }

  return NextResponse.json({ mensaje: "Decisión guardada." });
}
