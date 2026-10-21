import { createClient } from "@supabase/supabase-js";

// Solo para código de servidor (rutas de app/api). Nunca importar desde una pantalla.
// Devuelve null si faltan las variables, para que la ruta responda un error claro.
export function crearClienteSupabase() {
  const url = process.env.SUPABASE_URL;
  const claveSecreta = process.env.SUPABASE_SECRET_KEY;
  if (!url || !claveSecreta) return null;

  return createClient(url, claveSecreta, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
