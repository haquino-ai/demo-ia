import { NextResponse } from "next/server";
import { clasificar } from "@/lib/clasificar";
import { crearClienteSupabase } from "@/lib/supabase";

const MIN_CARACTERES = 10;
const MAX_CARACTERES = 1000;

export async function POST(request: Request) {
  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: "No se pudo leer el envío." }, { status: 400 });
  }

  const texto = (cuerpo as { texto?: unknown } | null)?.texto;
  if (typeof texto !== "string") {
    return NextResponse.json({ error: "Falta el texto de la sugerencia." }, { status: 400 });
  }

  const limpio = texto.trim();
  if (limpio.length < MIN_CARACTERES) {
    return NextResponse.json(
      { error: `La sugerencia es muy corta. Escribe al menos ${MIN_CARACTERES} caracteres.` },
      { status: 400 },
    );
  }
  if (limpio.length > MAX_CARACTERES) {
    return NextResponse.json(
      { error: `La sugerencia es muy larga. El máximo es ${MAX_CARACTERES} caracteres.` },
      { status: 400 },
    );
  }

  // Se comprueba antes de llamar a la IA, para no gastar saldo en algo que no se podría guardar.
  const supabase = crearClienteSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Falta configurar la base de datos. Avisa a la persona que administra el buzón." },
      { status: 500 },
    );
  }

  const clasificacion = await clasificar(limpio);

  const { error } = await supabase.from("sugerencias").insert({
    texto: limpio,
    area: clasificacion?.area ?? null,
    urgencia: clasificacion?.urgencia ?? null,
    resumen: clasificacion?.resumen ?? null,
  });
  if (error) {
    console.error("Guardado fallido:", error.message);
    return NextResponse.json(
      { error: "No se pudo guardar la sugerencia. Inténtalo de nuevo." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    mensaje: "recibido",
    clasificacion: clasificacion ?? "Sin clasificar",
  });
}
