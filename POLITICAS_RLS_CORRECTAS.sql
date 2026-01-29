-- POLÍTICAS RLS CORRECTAS PARA EL SISTEMA DE MENSAJES
-- Ejecuta esto en Supabase SQL Editor

-- Primero, re-habilitar RLS en todas las tablas
ALTER TABLE medico_paciente ENABLE ROW LEVEL SECURITY;
ALTER TABLE adulto_cuidador ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes ENABLE ROW LEVEL SECURITY;

-- Limpiar todas las políticas anteriores
DROP POLICY IF EXISTS medicos_ver_sus_pacientes ON medico_paciente;
DROP POLICY IF EXISTS pacientes_ver_sus_medicos ON medico_paciente;
DROP POLICY IF EXISTS cuidadores_ver_sus_adultos ON adulto_cuidador;
DROP POLICY IF EXISTS adultos_ver_sus_cuidadores ON adulto_cuidador;
DROP POLICY IF EXISTS usuarios_lectura ON usuarios;
DROP POLICY IF EXISTS mensajes_lectura ON mensajes;
DROP POLICY IF EXISTS mensajes_insercion ON mensajes;
DROP POLICY IF EXISTS mensajes_actualizacion ON mensajes;

-- =====================================================
-- POLÍTICAS PARA medico_paciente
-- =====================================================

-- Permitir a los médicos ver sus pacientes
CREATE POLICY "medicos_ver_pacientes" ON medico_paciente
FOR SELECT
USING (
  medico_id IN (SELECT id FROM usuarios WHERE auth_user_id = auth.uid())
);

-- Permitir a los pacientes ver sus médicos
CREATE POLICY "pacientes_ver_medicos" ON medico_paciente
FOR SELECT
USING (
  paciente_id IN (SELECT id FROM usuarios WHERE auth_user_id = auth.uid())
);

-- =====================================================
-- POLÍTICAS PARA adulto_cuidador
-- =====================================================

-- Permitir a los cuidadores ver sus adultos a cargo
CREATE POLICY "cuidadores_ver_adultos" ON adulto_cuidador
FOR SELECT
USING (
  cuidador_id IN (SELECT id FROM usuarios WHERE auth_user_id = auth.uid())
);

-- Permitir a los adultos mayores ver sus cuidadores
CREATE POLICY "adultos_ver_cuidadores" ON adulto_cuidador
FOR SELECT
USING (
  adulto_id IN (SELECT id FROM usuarios WHERE auth_user_id = auth.uid())
);

-- =====================================================
-- POLÍTICAS PARA usuarios
-- =====================================================

-- Todos pueden leer datos básicos de usuarios (necesario para mostrar contactos)
CREATE POLICY "usuarios_lectura_publica" ON usuarios
FOR SELECT
USING (true);

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "usuarios_actualizar_propio" ON usuarios
FOR UPDATE
USING (auth_user_id = auth.uid());

-- =====================================================
-- POLÍTICAS PARA mensajes
-- =====================================================

-- Los usuarios pueden ver mensajes donde son emisor o receptor
CREATE POLICY "mensajes_lectura" ON mensajes
FOR SELECT
USING (
  emisor_id IN (SELECT id FROM usuarios WHERE auth_user_id = auth.uid())
  OR receptor_id IN (SELECT id FROM usuarios WHERE auth_user_id = auth.uid())
);

-- Los usuarios pueden enviar mensajes (insertar)
CREATE POLICY "mensajes_insercion" ON mensajes
FOR INSERT
WITH CHECK (
  emisor_id IN (SELECT id FROM usuarios WHERE auth_user_id = auth.uid())
);

-- Los usuarios pueden actualizar mensajes donde son el receptor (marcar como leído)
CREATE POLICY "mensajes_actualizacion" ON mensajes
FOR UPDATE
USING (
  receptor_id IN (SELECT id FROM usuarios WHERE auth_user_id = auth.uid())
);

-- =====================================================
-- VERIFICAR POLÍTICAS CREADAS
-- =====================================================
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('medico_paciente', 'adulto_cuidador', 'usuarios', 'mensajes')
ORDER BY tablename, policyname;
