import { supabase } from '../lib/supabase'

export interface MedicoPaciente {
  id: string
  medico_id: string
  paciente_id: string
  especialidad?: string
  activo: boolean
  created_at: string
  medico?: {
    nombre: string
    apellido: string
  }
}

// Obtener médicos asignados a un paciente
export const obtenerMedicosDelPaciente = async (pacienteId: string): Promise<MedicoPaciente[]> => {
  try {
    const { data, error } = await supabase
      .from('medico_paciente')
      .select(`
        *,
        medico:medico_id(nombre, apellido)
      `)
      .eq('paciente_id', pacienteId)
      .eq('activo', true)

    if (error) throw error
    return data || []
  } catch (error: any) {
    console.error('Error al obtener médicos:', error.message)
    return []
  }
}

// Obtener pacientes asignados a un médico
export const obtenerPacientesDelMedico = async (medicoId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .rpc('obtener_pacientes_medico', { medico_id_param: medicoId })

    if (error) throw error
    return Array.isArray(data) ? data : []
  } catch (error: any) {
    console.error('Error al obtener pacientes:', error.message)
    return []
  }
}

// Obtener todos los médicos disponibles (para asignar)
export const obtenerTodosMedicos = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, apellido, correo')
      .eq('tipo_usuario', 'medico')

    if (error) throw error
    return data || []
  } catch (error: any) {
    console.error('Error al obtener médicos:', error.message)
    return []
  }
}

// Asignar un médico a un paciente
export const asignarMedicoAPaciente = async (
  medicoId: string,
  pacienteId: string,
  especialidad?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('medico_paciente')
      .insert([{
        medico_id: medicoId,
        paciente_id: pacienteId,
        especialidad: especialidad,
        activo: true
      }])

    if (error) throw error
    return true
  } catch (error: any) {
    console.error('Error al asignar médico:', error.message)
    return false
  }
}
