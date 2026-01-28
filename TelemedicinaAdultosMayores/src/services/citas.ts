import { supabase } from '../lib/supabase'

export interface Cita {
  id: string
  adulto_mayor_id: string
  medico_id: string
  fecha: string
  hora: string
  especialidad: string
  motivo: string
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada'
  notas?: string
  created_at: string
  medico?: {
    nombre: string
    apellido: string
  }
  paciente?: {
    nombre: string
    apellido: string
    correo: string
  }
}

// Obtener citas del usuario actual (adulto mayor)
export const obtenerCitasUsuario = async (usuarioId: string): Promise<Cita[]> => {
  try {
    const { data, error } = await supabase
      .rpc('obtener_citas_paciente', { paciente_id_param: usuarioId })

    if (error) throw error
    
    const citasArray = Array.isArray(data) ? data : []
    
    // Transformar datos para que coincidan con la interfaz Cita
    return citasArray.map((cita: any) => ({
      ...cita,
      medico: {
        nombre: cita.medico_nombre,
        apellido: cita.medico_apellido
      }
    }))
  } catch (error: any) {
    console.error('Error al obtener citas:', error.message)
    return []
  }
}

// Obtener citas del médico (pacientes asignados)
export const obtenerCitasMedico = async (medicoId: string): Promise<Cita[]> => {
  try {
    const { data, error } = await supabase
      .rpc('obtener_citas_medico', { medico_id_param: medicoId })

    if (error) throw error
    
    const citasArray = Array.isArray(data) ? data : []
    
    // Transformar datos para que coincidan con la interfaz Cita
    return citasArray.map((cita: any) => ({
      ...cita,
      paciente: {
        nombre: cita.paciente_nombre,
        apellido: cita.paciente_apellido,
        correo: cita.paciente_correo
      }
    }))
  } catch (error: any) {
    console.error('Error al obtener citas del médico:', error.message)
    return []
  }
}

// Crear nueva cita
export const crearCita = async (cita: Omit<Cita, 'id' | 'created_at'>): Promise<Cita | null> => {
  try {
    const { data, error } = await supabase
      .from('citas')
      .insert([cita])
      .select()

    if (error) throw error
    return data?.[0] || null
  } catch (error: any) {
    console.error('Error al crear cita:', error.message)
    return null
  }
}

// Actualizar estado de cita
export const actualizarCita = async (
  citaId: string,
  actualizaciones: Partial<Cita>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('citas')
      .update(actualizaciones)
      .eq('id', citaId)

    if (error) throw error
    return true
  } catch (error: any) {
    console.error('Error al actualizar cita:', error.message)
    return false
  }
}

// Cancelar cita
export const cancelarCita = async (citaId: string): Promise<boolean> => {
  return actualizarCita(citaId, { estado: 'cancelada' })
}
