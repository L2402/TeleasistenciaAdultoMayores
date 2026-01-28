import { useState, useEffect } from 'react';
import '../../styles/citas.css';
import { supabase } from '../../lib/supabase';
import { obtenerAdultosCuidador, obtenerCitasAdultosACargo } from '../../services/adultosCuidador';

const CitasCuidador: React.FC = () => {
  const [adultos, setAdultos] = useState<any[]>([]);
  const [adultoSeleccionado, setAdultoSeleccionado] = useState<string>('todos');
  const [citas, setCitas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<'todas' | 'pendiente' | 'confirmada' | 'cancelada'>('todas');

  useEffect(() => {
    cargarAdultos();
  }, []);

  useEffect(() => {
    if (adultos.length > 0) {
      cargarCitas();
    }
  }, [adultos, adultoSeleccionado]);

  const cargarAdultos = async () => {
    try {
      const perfilJson = localStorage.getItem('usuario_perfil');
      if (!perfilJson) {
        alert('Usuario no encontrado');
        return;
      }

      const perfil = JSON.parse(perfilJson);
      const data = await obtenerAdultosCuidador(perfil.id);
      
      setAdultos(data);
      if (data.length > 0) {
        setAdultoSeleccionado(data[0].id);
      }
    } catch (err) {
      console.error('Error al cargar adultos:', err);
    }
  };

  const cargarCitas = async () => {
    setCargando(true);
    try {
      const perfilJson = localStorage.getItem('usuario_perfil');
      if (!perfilJson) return;

      const perfil = JSON.parse(perfilJson);
      const { supabase } = await import('../../lib/supabase');

      let query = supabase
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
          usuarios!citas_medico_id_fkey(nombre, apellido)
        `);

      // Si seleccionó un adulto específico, filtrar por ése
      if (adultoSeleccionado !== 'todos') {
        query = query.eq('adulto_mayor_id', adultoSeleccionado);
      } else {
        // Si es "todos", obtener de todos los adultos a cargo
        const { data: acData } = await supabase
          .from('adulto_cuidador')
          .select('adulto_id')
          .eq('cuidador_id', perfil.id)
          .eq('activo', true);

        if (acData && acData.length > 0) {
          const adultoIds = acData.map(a => a.adulto_id);
          query = query.in('adulto_mayor_id', adultoIds);
        }
      }

      const { data, error } = await query.order('fecha', { ascending: true }).order('hora', { ascending: true });

      if (error) throw error;

      // Filtrar por estado si es necesario
      let citasFiltradas = data || [];
      if (filtroEstado !== 'todas') {
        citasFiltradas = citasFiltradas.filter(c => c.estado === filtroEstado);
      }

      setCitas(citasFiltradas);
    } catch (err) {
      console.error('Error al cargar citas:', err);
    } finally {
      setCargando(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'confirmada': return '#4CAF50';
      case 'pendiente': return '#FF9800';
      case 'cancelada': return '#f44336';
      default: return '#999';
    }
  };

  if (cargando && adultos.length === 0) {
    return (
      <div className="citas-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Cargando citas...</p>
        </div>
      </div>
    );
  }

  if (adultos.length === 0) {
    return (
      <div className="citas-container">
        <h2 className="citas-title">Citas de Adultos a Cargo</h2>
        <div className="citas-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>No tienes adultos mayores asignados aún.</p>
          <p>Ve a "Adultos a Cargo" para agregar personas a tu lista.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="citas-container">
      <h2 className="citas-title">Citas de Adultos a Cargo</h2>

      <div className="citas-filters">
        {/* Selector de Adulto */}
        <select
          value={adultoSeleccionado}
          onChange={(e) => setAdultoSeleccionado(e.target.value)}
          className="filter-select"
        >
          <option value="todos">Ver citas de todos</option>
          {adultos.map((adulto) => (
            <option key={adulto.id} value={adulto.id}>
              {adulto.nombre} {adulto.apellido}
            </option>
          ))}
        </select>

        {/* Filtro por Estado */}
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value as any)}
          className="filter-select"
        >
          <option value="todas">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="confirmada">Confirmadas</option>
          <option value="cancelada">Canceladas</option>
        </select>
      </div>

      {cargando ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Cargando citas...</p>
        </div>
      ) : citas.length === 0 ? (
        <div className="citas-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>No hay citas disponibles con los filtros seleccionados.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {citas.map((cita) => {
            const adulto = adultos.find(a => a.id === cita.adulto_mayor_id);
            const medico = cita.usuarios;
            
            return (
              <div key={cita.id} className="citas-card">
                <div className="cita-header">
                  <div>
                    <h3 className="cita-patient-name">
                      📋 {adulto?.nombre} {adulto?.apellido}
                    </h3>
                    <p className="cita-info" style={{ marginTop: '0.5rem' }}>
                      👨‍⚕️ Doctor: {medico?.nombre} {medico?.apellido}
                    </p>
                  </div>
                  <span
                    className="estado-badge"
                    style={{ backgroundColor: getEstadoColor(cita.estado) }}
                  >
                    {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                  </span>
                </div>

                <div className="cita-details">
                  <div className="cita-detail">
                    <span className="label">📅 Fecha:</span>
                    <span>{new Date(cita.fecha).toLocaleDateString('es-CO')}</span>
                  </div>
                  <div className="cita-detail">
                    <span className="label">⏰ Hora:</span>
                    <span>{cita.hora}</span>
                  </div>
                  <div className="cita-detail">
                    <span className="label">🏥 Especialidad:</span>
                    <span>{cita.especialidad || 'General'}</span>
                  </div>
                  <div className="cita-detail">
                    <span className="label">📝 Motivo:</span>
                    <span>{cita.motivo || 'No especificado'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CitasCuidador;
