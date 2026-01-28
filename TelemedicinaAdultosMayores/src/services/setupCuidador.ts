import { supabase } from '../lib/supabase';

/**
 * Ejecutar las funciones SQL necesarias para el cuidador
 * Esto debe ejecutarse UNA sola vez en Supabase
 */
export const setupCuidadorFunctions = async () => {
  try {
    console.log('Creando funciones SQL para cuidador...');

    // Función para buscar adultos mayores
    const { error: errorBuscar } = await supabase.rpc('execute_sql', {
      sql: `
        DROP FUNCTION IF EXISTS buscar_adultos_mayores();

        CREATE OR REPLACE FUNCTION buscar_adultos_mayores()
        RETURNS TABLE (
          id UUID,
          nombre TEXT,
          apellido TEXT,
          correo TEXT,
          fecha_nacimiento DATE
        )
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          RETURN QUERY
          SELECT 
            u.id,
            u.nombre,
            u.apellido,
            u.correo,
            u.fecha_nacimiento
          FROM usuarios u
          WHERE u.tipo_usuario = 'adultoMayor'
          ORDER BY u.nombre, u.apellido;
        END;
        $$;
      `
    });

    if (errorBuscar) {
      console.error('Error creando función buscar_adultos_mayores:', errorBuscar);
    }

    // Función para obtener adultos del cuidador
    const { error: errorObtener } = await supabase.rpc('execute_sql', {
      sql: `
        DROP FUNCTION IF EXISTS obtener_adultos_cuidador(UUID);

        CREATE OR REPLACE FUNCTION obtener_adultos_cuidador(cuidador_id_param UUID)
        RETURNS JSON
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          result JSON;
        BEGIN
          SELECT json_agg(
            json_build_object(
              'id', u.id,
              'nombre', u.nombre,
              'apellido', u.apellido,
              'correo', u.correo,
              'fecha_nacimiento', u.fecha_nacimiento
            )
          )
          INTO result
          FROM usuarios u
          INNER JOIN adulto_cuidador ac ON u.id = ac.adulto_mayor_id
          WHERE ac.cuidador_id = cuidador_id_param
            AND ac.activo = true
            AND u.tipo_usuario = 'adultoMayor';
          
          RETURN COALESCE(result, '[]'::json);
        END;
        $$;
      `
    });

    if (errorObtener) {
      console.error('Error creando función obtener_adultos_cuidador:', errorObtener);
    }

    if (!errorBuscar && !errorObtener) {
      console.log('✅ Funciones SQL creadas exitosamente');
      return true;
    } else {
      console.log('⚠️ Algunas funciones pueden haber fallado. Verifica Supabase SQL Editor.');
      return false;
    }
  } catch (error) {
    console.error('Error en setupCuidadorFunctions:', error);
    return false;
  }
};
