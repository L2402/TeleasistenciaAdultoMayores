import { supabase } from '../lib/supabase'

export interface Incidencia {
  id: string
  usuario_id: string
  tipo: string
  descripcion: string
  estado: 'abierta' | 'en_progreso' | 'resuelta' | 'cerrada'
  prioridad: 'baja' | 'media' | 'alta' | 'urgente'
  asignado_a?: string
  created_at: string
  updated_at: string
}

// Obtener incidencias del usuario
export const obtenerIncidencias = async (usuarioId: string): Promise<Incidencia[]> => {
  try {
    const { data, error } = await supabase
      .from('incidencias')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error: any) {
    console.error('Error al obtener incidencias:', error.message)
    return []
  }
}

// Crear nueva incidencia
export const crearIncidencia = async (
  incidencia: Omit<Incidencia, 'id' | 'created_at' | 'updated_at' | 'estado' | 'prioridad'>
): Promise<Incidencia | null> => {
  try {
    const { data, error } = await supabase
      .from('incidencias')
      .insert([{
        ...incidencia,
        estado: 'abierta',
        prioridad: 'media'
      }])
      .select()

    if (error) throw error
    return data?.[0] || null
  } catch (error: any) {
    console.error('Error al crear incidencia:', error.message)
    return null
  }
}

// Actualizar incidencia
export const actualizarIncidencia = async (
  incidenciaId: string,
  actualizaciones: Partial<Incidencia>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('incidencias')
      .update({
        ...actualizaciones,
        updated_at: new Date().toISOString()
      })
      .eq('id', incidenciaId)

    if (error) throw error
    return true
  } catch (error: any) {
    console.error('Error al actualizar incidencia:', error.message)
    return false
  }
}
