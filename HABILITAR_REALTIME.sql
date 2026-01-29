-- HABILITAR REALTIME PARA MENSAJES EN TIEMPO REAL
-- Ejecuta esto en Supabase SQL Editor

-- Habilitar Realtime en la tabla mensajes
ALTER PUBLICATION supabase_realtime ADD TABLE mensajes;

-- Verificar que se agregó correctamente
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
