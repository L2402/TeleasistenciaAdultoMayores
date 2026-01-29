-- PERMITIR MÚLTIPLES ESPECIALIDADES PARA MÉDICO-PACIENTE
-- Ejecuta esto en Supabase SQL Editor

-- 1. Primero verificamos los constraints existentes
SELECT conname, contype, pg_get_constraintdef(c.oid)
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
WHERE conrelid = 'medico_paciente'::regclass;

-- 2. Eliminar el constraint UNIQUE actual
-- Vimos que se llama "medico_paciente_medico_id_paciente_id_key"
ALTER TABLE medico_paciente DROP CONSTRAINT medico_paciente_medico_id_paciente_id_key;

-- 3. Crear nuevo constraint UNIQUE que incluya especialidad
-- Esto permite que el mismo médico atienda al mismo paciente en diferentes especialidades
ALTER TABLE medico_paciente ADD CONSTRAINT medico_paciente_unique_especialidad 
UNIQUE (medico_id, paciente_id, especialidad);

-- 4. Verificar que el nuevo constraint se creó correctamente
SELECT conname, contype, pg_get_constraintdef(c.oid)
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
WHERE conrelid = 'medico_paciente'::regclass;

-- NOTA: Si especialidad puede ser NULL y quieres permitir un registro sin especialidad,
-- necesitarás una estrategia diferente. Dime si ese es el caso.
