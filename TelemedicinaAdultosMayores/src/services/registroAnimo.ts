import { supabase } from '../lib/supabase'

export interface RegistroAnimo {
  id: string
  usuario_id: string
  fecha: string
  estado: 'Feliz' | 'Triste' | 'Preocupado' | 'Cansado' | 'Enojado' | 'Neutral'
  motivo?: string
  observaciones?: string
  created_at: string
}

// Obtener registros de animo del usuario
export const obtenerRegistrosAnimo = async (usuarioId: string): Promise<RegistroAnimo[]> => {
  try {
    const { data, error } = await supabase
      .from('registro_animo')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('fecha', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error: any) {
    console.error('Error al obtener registros de animo:', error.message)
    return []
  }
}

// Crear nuevo registro de animo
export const crearRegistroAnimo = async (
  registro: Omit<RegistroAnimo, 'id' | 'created_at'>
): Promise<RegistroAnimo | null> => {
  try {
    const { data, error } = await supabase
      .from('registro_animo')
      .insert([registro])
      .select()

    if (error) throw error
    return data?.[0] || null
  } catch (error: any) {
    console.error('Error al crear registro de animo:', error.message)
    return null
  }
}

// Obtener registros de los últimos N días
export const obtenerRegistrosAnimoUltimosDias = async (
  usuarioId: string,
  dias: number = 30
): Promise<RegistroAnimo[]> => {
  try {
    const fechaLimite = new Date()
    fechaLimite.setDate(fechaLimite.getDate() - dias)

    const { data, error } = await supabase
      .from('registro_animo')
      .select('*')
      .eq('usuario_id', usuarioId)
      .gte('fecha', fechaLimite.toISOString())
      .order('fecha', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error: any) {
    console.error('Error al obtener registros:', error.message)
    return []
  }
}

// Obtener estadísticas de animo
export const obtenerEstadisticasAnimo = async (usuarioId: string) => {
  try {
    const { data, error } = await supabase
      .from('registro_animo')
      .select('estado')
      .eq('usuario_id', usuarioId)

    if (error) throw error

    const estadisticas: Record<string, number> = {}
    data?.forEach(registro => {
      estadisticas[registro.estado] = (estadisticas[registro.estado] || 0) + 1
    })

    return estadisticas
  } catch (error: any) {
    console.error('Error al obtener estadísticas:', error.message)
    return {}
  }
}
