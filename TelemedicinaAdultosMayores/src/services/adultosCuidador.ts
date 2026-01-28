import { supabase } from '../lib/supabase';

// Obtener todos los adultos mayores disponibles
export const obtenerTodosAdultosMayores = async () => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, apellido, correo, fecha_nacimiento')
      .eq('tipo_usuario', 'adultoMayor')
      .order('nombre');

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error al obtener adultos mayores:', err);
    throw err;
  }
};

// Obtener adultos asignados al cuidador actual
export const obtenerAdultosCuidador = async (cuidadorId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('obtener_adultos_cuidador', {
        cuidador_id_param: cuidadorId
      });

    if (error) throw error;

    // Parsear la respuesta JSON
    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    return data || [];
  } catch (err) {
    console.error('Error al obtener adultos del cuidador:', err);
    throw err;
  }
};

// Asignar un adulto mayor al cuidador
export const asignarAdultoACuidador = async (
  cuidadorId: string,
  adultoMayorId: string
) => {
  try {
    // Primero verificar si ya está asignado
    const { data: existente, error: errorVerif } = await supabase
      .from('adulto_cuidador')
      .select('id')
      .eq('cuidador_id', cuidadorId)
      .eq('adulto_id', adultoMayorId)
      .single();

    if (existente) {
      throw new Error('Este adulto mayor ya está asignado a tu lista');
    }

    // Si no existe, crear la asignación
    const { error } = await supabase
      .from('adulto_cuidador')
      .insert({
        cuidador_id: cuidadorId,
        adulto_id: adultoMayorId,
        activo: true
      });

    if (error) throw error;
    return true;
  } catch (err: any) {
    console.error('Error al asignar adulto:', err);
    throw err;
  }
};

// Obtener citas de los adultos a cargo del cuidador
export const obtenerCitasAdultosACargo = async (cuidadorId: string) => {
  try {
    // Primero obtener los adultos mayores a cargo
    const { data: adultos, error: errorAdultos } = await supabase
      .from('adulto_cuidador')
      .select('adulto_id')
      .eq('cuidador_id', cuidadorId)
      .eq('activo', true);

    if (errorAdultos) throw errorAdultos;

    if (!adultos || adultos.length === 0) {
      return [];
    }

    const adultoIds = adultos.map(a => a.adulto_id);

    // Obtener citas de esos adultos
    const { data, error } = await supabase
      .from('citas')
      .select(`
        id,
        adulto_mayor_id,
        medico_id,
        fecha,
        hora,
        especialidad,
        motivo,
        estado,
        usuarios!citas_medico_id_fkey(nombre, apellido, especialidad)
      `)
      .in('adulto_mayor_id', adultoIds)
      .order('fecha', { ascending: true })
      .order('hora', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error al obtener citas:', err);
    throw err;
  }
};

// Obtener medicamentos de un adulto a cargo
export const obtenerMedicamentosAdulto = async (adultoMayorId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('obtener_medicamentos_paciente', {
        paciente_id_param: adultoMayorId
      });

    if (error) throw error;

    // Parsear la respuesta JSON
    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    return data || [];
  } catch (err) {
    console.error('Error al obtener medicamentos:', err);
    throw err;
  }
};
