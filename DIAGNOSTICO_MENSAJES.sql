-- DIAGNÓSTICO COMPLETO DEL SISTEMA DE MENSAJES
-- Ejecuta cada sección por separado en Supabase SQL Editor

-- 1. Verificar políticas RLS existentes en las tablas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('medico_paciente', 'adulto_cuidador', 'usuarios', 'mensajes')
ORDER BY tablename, policyname;

-- 2. Verificar si hay datos en medico_paciente
SELECT * FROM medico_paciente LIMIT 10;

-- 3. Verificar si hay datos en adulto_cuidador
SELECT * FROM adulto_cuidador LIMIT 10;

-- 4. Verificar usuarios médicos
SELECT id, nombre, email, tipo_usuario FROM usuarios WHERE tipo_usuario = 'medico';

-- 5. Verificar usuarios adultos mayores
SELECT id, nombre, email, tipo_usuario FROM usuarios WHERE tipo_usuario = 'adultoMayor';

-- 6. Verificar usuarios cuidadores
SELECT id, nombre, email, tipo_usuario FROM usuarios WHERE tipo_usuario = 'cuidador';

-- 7. DESHABILITAR COMPLETAMENTE RLS (temporalmente para pruebas)
ALTER TABLE medico_paciente DISABLE ROW LEVEL SECURITY;
ALTER TABLE adulto_cuidador DISABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes DISABLE ROW LEVEL SECURITY;

-- 8. Después de probar, RE-HABILITAR RLS (ejecutar solo después de verificar)
-- ALTER TABLE medico_paciente ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE adulto_cuidador ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE mensajes ENABLE ROW LEVEL SECURITY;
