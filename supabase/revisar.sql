-- Columnas para la pantalla de revisión.
-- Pégalo completo en Supabase → SQL Editor → Run. Claude Code no lo ejecuta.

alter table sugerencias add column if not exists motivo text check (char_length(motivo) <= 300);
alter table sugerencias add column if not exists decidida_en timestamptz;
