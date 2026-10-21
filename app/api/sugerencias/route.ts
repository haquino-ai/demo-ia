import { NextResponse } from "next/server";
import { clasificar } from "@/lib/clasificar";

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

  const clasificacion = await clasificar(limpio);

  return NextResponse.json({
    mensaje: "recibido",
    clasificacion: clasificacion ?? "Sin clasificar",
  });
}
