"use client";

import { useState } from "react";
import type { Clasificacion } from "@/lib/clasificar";

export default function Home() {
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [clasificacion, setClasificacion] = useState<Clasificacion | "Sin clasificar" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setEnviando(true);
    setError(null);
    setRespuesta(null);
    setClasificacion(null);

    try {
      const res = await fetch("/api/sugerencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto }),
      });
      const datos = await res.json();

      if (!res.ok) {
        setError(datos.error ?? "Algo salió mal. Inténtalo de nuevo.");
      } else {
        setRespuesta(datos.mensaje);
        setClasificacion(datos.clasificacion);
      }
    } catch {
      setError("No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main>
      <h1>Buzón de sugerencias</h1>
      <p className="sub">Escribe tu sugerencia y pulsa Enviar.</p>

      <form onSubmit={enviar}>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={6}
          placeholder="Escribe aquí tu sugerencia (entre 10 y 1000 caracteres)"
        />
        <p>{texto.trim().length} / 1000 caracteres</p>
        <button type="submit" disabled={enviando}>
          {enviando ? "Enviando..." : "Enviar"}
        </button>
      </form>

      {respuesta && <p style={{ color: "var(--verde)" }}>{respuesta}</p>}
      {clasificacion === "Sin clasificar" && <p>Clasificación: Sin clasificar</p>}
      {clasificacion && clasificacion !== "Sin clasificar" && (
        <ul>
          <li>Área: {clasificacion.area}</li>
          <li>Urgencia: {clasificacion.urgencia}</li>
          <li>Resumen: {clasificacion.resumen}</li>
        </ul>
      )}
      {error && <p style={{ color: "var(--rojo)" }}>{error}</p>}
    </main>
  );
}
