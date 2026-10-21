-- Tabla de sugerencias.
-- Pégalo completo en Supabase → SQL Editor → Run. Claude Code no lo ejecuta.

create table if not exists sugerencias (
  id bigint generated always as identity primary key,
  texto text not null check (char_length(texto) between 10 and 1000),
  area text check (area in ('Procesos', 'Tecnología', 'Personas', 'Clientes', 'Finanzas', 'Otro')),
  urgencia text check (urgencia in ('baja', 'media', 'alta')),
  resumen text check (char_length(resumen) <= 120),
  estado text not null default 'pendiente' check (estado in ('pendiente', 'aprobada', 'rechazada')),
  creada_en timestamptz not null default now()
);

-- Sin políticas: solo el servidor (con SUPABASE_SECRET_KEY) puede leer y escribir.
alter table sugerencias enable row level security;
