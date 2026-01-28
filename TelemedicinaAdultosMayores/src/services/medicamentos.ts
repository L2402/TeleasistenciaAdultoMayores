import { supabase } from '../lib/supabase'

export interface Medicamento {
  id: string
  usuario_id: string
  medico_id?: string
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
  medico?: {
    nombre: string
    apellido: string
  }
}

// Obtener medicamentos del usuario con información del médico
export const obtenerMedicamentos = async (usuarioId: string): Promise<Medicamento[]> => {
  try {
    const { data, error } = await supabase
      .rpc('obtener_medicamentos_paciente', { paciente_id_param: usuarioId })

    if (error) throw error
    
    const medicamentosArray = Array.isArray(data) ? data : []
    
    // Transformar datos para incluir info del médico
    return medicamentosArray.map((med: any) => ({
      ...med,
      medico: med.medico_id ? {
        nombre: med.medico_nombre,
        apellido: med.medico_apellido
      } : undefined
    }))
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
