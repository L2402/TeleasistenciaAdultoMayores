import { supabase } from '../lib/supabase';

// Obtener contactos según el rol del usuario
export const obtenerContactos = async (userId: string, tipoUsuario: string) => {
  try {
    if (tipoUsuario === 'medico') {
      // Obtener IDs de pacientes del médico
      const { data: relaciones, error: errorRel } = await supabase
        .from('medico_paciente')
        .select('paciente_id')
        .eq('medico_id', userId)
        .eq('activo', true);

      if (errorRel) throw errorRel;
      if (!relaciones || relaciones.length === 0) return [];

      const pacienteIds = relaciones.map(r => r.paciente_id);

      // Obtener datos de los pacientes
      const { data: pacientes, error: errorPac } = await supabase
        .from('usuarios')
        .select('id, nombre, apellido, tipo_usuario')
        .in('id', pacienteIds);

      if (errorPac) throw errorPac;
      return (pacientes || []).filter(p => p.id !== userId);
    } 
    else if (tipoUsuario === 'cuidador') {
      // Obtener IDs de adultos a cargo
      const { data: relaciones, error: errorRel } = await supabase
        .from('adulto_cuidador')
        .select('adulto_id')
        .eq('cuidador_id', userId)
        .eq('activo', true);

      if (errorRel) throw errorRel;
      if (!relaciones || relaciones.length === 0) return [];

      const adultoIds = relaciones.map(r => r.adulto_id);

      // Obtener datos de los adultos
      const { data: adultos, error: errorAdult } = await supabase
        .from('usuarios')
        .select('id, nombre, apellido, tipo_usuario')
        .in('id', adultoIds);

      if (errorAdult) throw errorAdult;
      return (adultos || []).filter(a => a.id !== userId);
    } 
    else if (tipoUsuario === 'adultoMayor') {
      const contactos: any[] = [];

      // Obtener médicos asignados
      const { data: relMedicos } = await supabase
        .from('medico_paciente')
        .select('medico_id')
        .eq('paciente_id', userId)
        .eq('activo', true);

      if (relMedicos && relMedicos.length > 0) {
        const medicoIds = relMedicos.map(r => r.medico_id);
        const { data: medicos } = await supabase
          .from('usuarios')
          .select('id, nombre, apellido, tipo_usuario')
          .in('id', medicoIds);

        if (medicos) {
          contactos.push(...medicos.filter(m => m.id !== userId));
        }
      }

      // Obtener cuidadores asignados
      const { data: relCuidadores } = await supabase
        .from('adulto_cuidador')
        .select('cuidador_id')
        .eq('adulto_id', userId)
        .eq('activo', true);

      if (relCuidadores && relCuidadores.length > 0) {
        const cuidadorIds = relCuidadores.map(r => r.cuidador_id);
        const { data: cuidadores } = await supabase
          .from('usuarios')
          .select('id, nombre, apellido, tipo_usuario')
          .in('id', cuidadorIds);

        if (cuidadores) {
          contactos.push(...cuidadores.filter(c => c.id !== userId));
        }
      }

      console.log('Contactos para adulto mayor:', contactos);
      return contactos;
    }

    return [];
  } catch (err) {
    console.error('Error al obtener contactos:', err);
    return [];
  }
};

// Obtener mensajes de una conversación
export const obtenerMensajes = async (userId: string, contactoId: string) => {
  try {
    // Obtener mensajes donde yo soy remitente o destinatario
    // AND donde el otro es remitente o destinatario
    const { data, error } = await supabase
      .from('mensajes')
      .select('*')
      .or(`remitente_id.eq.${userId},remitente_id.eq.${contactoId}`)
      .or(`destinatario_id.eq.${userId},destinatario_id.eq.${contactoId}`)
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    // Filtrar en el cliente para asegurar que sean mensajes entre estos dos usuarios
    const mensajesFiltrados = (data || []).filter(m => 
      (m.remitente_id === userId && m.destinatario_id === contactoId) ||
      (m.remitente_id === contactoId && m.destinatario_id === userId)
    );
    
    return mensajesFiltrados;
  } catch (err) {
    console.error('Error al obtener mensajes:', err);
    return [];
  }
};

// Enviar mensaje
export const enviarMensaje = async (
  remitenteId: string,
  destinatarioId: string,
  contenido: string
) => {
  try {
    const { data, error } = await supabase
      .from('mensajes')
      .insert({
        remitente_id: remitenteId,
        destinatario_id: destinatarioId,
        contenido: contenido.trim(),
        leido: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error al enviar mensaje:', err);
    throw err;
  }
};

// Marcar mensajes como leídos
export const marcarComoLeidos = async (userId: string, contactoId: string) => {
  try {
    const { error } = await supabase
      .from('mensajes')
      .update({ leido: true })
      .eq('destinatario_id', userId)
      .eq('remitente_id', contactoId)
      .eq('leido', false);

    if (error) throw error;
  } catch (err) {
    console.error('Error al marcar como leídos:', err);
  }
};

// Contar mensajes no leídos
export const contarMensajesNoLeidos = async (userId: string) => {
  try {
    const { count, error } = await supabase
      .from('mensajes')
      .select('*', { count: 'exact', head: true })
      .eq('destinatario_id', userId)
      .eq('leido', false);

    if (error) throw error;
    return count || 0;
  } catch (err) {
    console.error('Error al contar mensajes no leídos:', err);
    return 0;
  }
};
