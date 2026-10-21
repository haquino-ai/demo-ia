import { NextResponse } from "next/server";
import { comprobarClaveRevisor, MENSAJE_ACCESO } from "@/lib/acceso";
import { crearClienteSupabase } from "@/lib/supabase";

// Lista las sugerencias para el revisor. Requiere la clave en la cabecera x-clave-revisor.
// La IA no llama a esta ruta.
export async function GET(request: Request) {
  const acceso = comprobarClaveRevisor(request.headers.get("x-clave-revisor"));
  if (acceso !== "ok") {
    const { error, status } = MENSAJE_ACCESO[acceso];
    return NextResponse.json({ error }, { status });
  }

  const supabase = crearClienteSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Falta configurar la base de datos. Avisa a la persona que administra el buzón." },
      { status: 500 },
    );
  }

  const { data, error } = await supabase
    .from("sugerencias")
    .select("id, texto, area, urgencia, resumen, estado, motivo, creada_en, decidida_en")
    .order("creada_en", { ascending: false })
    .limit(100);
  if (error) {
    console.error("Lectura fallida:", error.message);
    return NextResponse.json({ error: "No se pudieron leer las sugerencias." }, { status: 500 });
  }

  return NextResponse.json({ sugerencias: data });
}
