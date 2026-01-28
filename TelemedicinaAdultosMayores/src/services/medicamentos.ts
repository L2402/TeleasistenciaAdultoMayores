import { supabase } from '../lib/supabase'

export interface Medicamento {
  id: string
  usuario_id: string
  nombre: string
  dosis: string
  frecuencia: string
  horarios?: string
  duracion: number
  unidad_duracion: 'días' | 'semanas' | 'meses'
  indicaciones?: string
  prescrito_por?: string
  fecha_inicio?: string
  activo: boolean
  created_at: string
  updated_at: string
}

// Obtener medicamentos del usuario
export const obtenerMedicamentos = async (usuarioId: string): Promise<Medicamento[]> => {
  try {
    const { data, error } = await supabase
      .from('medicamentos')
      .select('*')
      .eq('usuario_id', usuarioId)
      .eq('activo', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error: any) {
    console.error('Error al obtener medicamentos:', error.message)
    return []
  }
}

// Crear nuevo medicamento
export const crearMedicamento = async (
  medicamento: Omit<Medicamento, 'id' | 'created_at' | 'updated_at' | 'activo'>
): Promise<Medicamento | null> => {
  try {
    const { data, error } = await supabase
      .from('medicamentos')
      .insert([{
        ...medicamento,
        activo: true
      }])
      .select()

    if (error) throw error
    return data?.[0] || null
  } catch (error: any) {
    console.error('Error al crear medicamento:', error.message)
    return null
  }
}

// Actualizar medicamento
export const actualizarMedicamento = async (
  medicamentoId: string,
  actualizaciones: Partial<Medicamento>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('medicamentos')
      .update({
        ...actualizaciones,
        updated_at: new Date().toISOString()
      })
      .eq('id', medicamentoId)

    if (error) throw error
    return true
  } catch (error: any) {
    console.error('Error al actualizar medicamento:', error.message)
    return false
  }
}

// Desactivar medicamento (soft delete)
export const desactivarMedicamento = async (medicamentoId: string): Promise<boolean> => {
  return actualizarMedicamento(medicamentoId, { activo: false })
}
