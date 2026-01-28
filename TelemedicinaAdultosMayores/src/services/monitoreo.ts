import { supabase } from '../lib/supabase'

export interface Monitoreo {
  id: string
  usuario_id: string
  fecha_medicion: string
  presion_arterial?: string
  frecuencia_cardiaca?: number
  temperatura?: number
  saturacion_oxigeno?: number
  glucosa?: number
  peso?: number
  notas?: string
  created_at: string
}

// Obtener monitoreos del usuario
export const obtenerMonitoreos = async (usuarioId: string): Promise<Monitoreo[]> => {
  try {
    const { data, error } = await supabase
      .from('monitoreo')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('fecha_medicion', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error: any) {
    console.error('Error al obtener monitoreos:', error.message)
    return []
  }
}

// Crear nueva medición
export const crearMonitoreo = async (
  monitoreo: Omit<Monitoreo, 'id' | 'created_at'>
): Promise<Monitoreo | null> => {
  try {
    const { data, error } = await supabase
      .from('monitoreo')
      .insert([monitoreo])
      .select()

    if (error) throw error
    return data?.[0] || null
  } catch (error: any) {
    console.error('Error al crear monitoreo:', error.message)
    return null
  }
}

// Obtener últimas mediciones (para gráficos)
export const obtenerUltimasMonitoreos = async (
  usuarioId: string,
  limite: number = 10
): Promise<Monitoreo[]> => {
  try {
    const { data, error } = await supabase
      .from('monitoreo')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('fecha_medicion', { ascending: false })
      .limit(limite)

    if (error) throw error
    return data || []
  } catch (error: any) {
    console.error('Error al obtener últimas mediciones:', error.message)
    return []
  }
}
