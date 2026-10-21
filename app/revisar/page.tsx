"use client";

import { useState } from "react";

type Sugerencia = {
  id: number;
  texto: string;
  area: string | null;
  urgencia: string | null;
  resumen: string | null;
  estado: "pendiente" | "aprobada" | "rechazada";
  motivo: string | null;
  creada_en: string;
  decidida_en: string | null;
};

export default function Revisar() {
  const [clave, setClave] = useState("");
  const [claveAceptada, setClaveAceptada] = useState<string | null>(null);
  const [sugerencias, setSugerencias] = useState<Sugerencia[]>([]);
  const [motivos, setMotivos] = useState<Record<number, string>>({});
  const [ocupada, setOcupada] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  async function cargar(claveUsada: string) {
    const res = await fetch("/api/revisar", { headers: { "x-clave-revisor": claveUsada } });
    const datos = await res.json();
    if (!res.ok) {
      setError(datos.error ?? "No se pudo cargar la lista.");
      return false;
    }
    setSugerencias(datos.sugerencias);
    return true;
  }

  async function entrar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);
    setAviso(null);
    try {
      if (await cargar(clave)) setClaveAceptada(clave);
    } catch {
      setError("No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.");
    }
  }

  async function decidir(id: number, decision: "aprobada" | "rechazada") {
    if (!claveAceptada) return;
    setError(null);
    setAviso(null);
    setOcupada(id);
    try {
      const res = await fetch("/api/decidir", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-clave-revisor": claveAceptada },
        body: JSON.stringify({ id, decision, motivo: motivos[id] ?? "" }),
      });
      const datos = await res.json();
      if (!res.ok) {
        setError(datos.error ?? "No se pudo guardar la decisión.");
      } else {
        setAviso(datos.mensaje);
        await cargar(claveAceptada);
      }
    } catch {
      setError("No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setOcupada(null);
    }
  }

  if (!claveAceptada) {
    return (
      <main>
        <h1>Revisar sugerencias</h1>
        <p className="sub">Escribe la clave del revisor para entrar.</p>
        <form onSubmit={entrar}>
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            placeholder="Clave del revisor"
            autoComplete="off"
          />
          <button type="submit" disabled={!clave}>Entrar</button>
        </form>
        {error && <p style={{ color: "var(--rojo)" }}>{error}</p>}
      </main>
    );
  }

  return (
    <main>
      <h1>Revisar sugerencias</h1>
      <p className="sub">Aprueba o rechaza cada sugerencia pendiente. El motivo es opcional.</p>

      {aviso && <p style={{ color: "var(--verde)" }}>{aviso}</p>}
      {error && <p style={{ color: "var(--rojo)" }}>{error}</p>}
      {sugerencias.length === 0 && <p>No hay sugerencias todavía.</p>}

      {sugerencias.map((s) => (
        <section key={s.id} style={{ border: "1px solid #d9d4c7", borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <p><strong>#{s.id}</strong> · Estado: {s.estado}</p>
          <p>{s.texto}</p>
          <ul>
            <li>Área: {s.area ?? "Sin clasificar"}</li>
            <li>Urgencia: {s.urgencia ?? "Sin clasificar"}</li>
            <li>Resumen: {s.resumen ?? "Sin clasificar"}</li>
            {s.motivo && <li>Motivo: {s.motivo}</li>}
          </ul>

          {s.estado === "pendiente" && (
            <>
              <textarea
                rows={2}
                maxLength={300}
                placeholder="Motivo (opcional, máximo 300 caracteres)"
                value={motivos[s.id] ?? ""}
                onChange={(e) => setMotivos({ ...motivos, [s.id]: e.target.value })}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button className="ok" disabled={ocupada !== null} onClick={() => decidir(s.id, "aprobada")}>
                  Aprobar
                </button>
                <button className="no" disabled={ocupada !== null} onClick={() => decidir(s.id, "rechazada")}>
                  Rechazar
                </button>
              </div>
            </>
          )}
        </section>
      ))}
    </main>
  );
}
