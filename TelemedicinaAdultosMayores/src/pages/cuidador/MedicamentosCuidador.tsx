import { useState, useEffect } from 'react';
import '../../styles/medicamentos.css';
import { obtenerAdultosCuidador, obtenerMedicamentosAdulto } from '../../services/adultosCuidador';

const MedicamentosCuidador: React.FC = () => {
  const [adultos, setAdultos] = useState<any[]>([]);
  const [adultoSeleccionado, setAdultoSeleccionado] = useState<string>('');
  const [medicamentos, setMedicamentos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroCuidado, setFiltroCuidado] = useState<'todos' | 'activos' | 'pausados'>('todos');

  useEffect(() => {
    cargarAdultos();
  }, []);

  useEffect(() => {
    if (adultoSeleccionado) {
      cargarMedicamentos(adultoSeleccionado);
    }
  }, [adultoSeleccionado]);

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
      setCargando(false);
    } catch (err) {
      console.error('Error al cargar adultos:', err);
      setCargando(false);
    }
  };

  const cargarMedicamentos = async (adultoId: string) => {
    try {
      setCargando(true);
      const data = await obtenerMedicamentosAdulto(adultoId);
      setMedicamentos(data);
    } catch (err) {
      console.error('Error al cargar medicamentos:', err);
      setMedicamentos([]);
    } finally {
      setCargando(false);
    }
  };

  const medicamentosFiltrados = medicamentos.filter(med => {
    if (filtroCuidado === 'activos') return med.activo === true;
    if (filtroCuidado === 'pausados') return med.activo === false;
    return true;
  });

  const getFrequencyLabel = (frecuencia: string) => {
    const frecuencias: { [key: string]: string } = {
      'cada_8_horas': '3 veces al día (cada 8 horas)',
      'cada_12_horas': '2 veces al día (cada 12 horas)',
      'una_vez_diaria': '1 vez al día',
      'dos_veces_diaria': '2 veces al día',
      'cada_6_horas': '4 veces al día (cada 6 horas)',
      'segun_sea_necesario': 'Según sea necesario'
    };
    return frecuencias[frecuencia] || frecuencia;
  };

  const adultoActual = adultos.find(a => a.id === adultoSeleccionado);

  if (adultos.length === 0) {
    return (
      <div className="medicamentos-container">
        <h2 className="medicamentos-title">Medicamentos de Adultos a Cargo</h2>
        <div className="medicamentos-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>No tienes adultos mayores asignados aún.</p>
          <p>Ve a "Adultos a Cargo" para agregar personas a tu lista.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="medicamentos-container">
      <h2 className="medicamentos-title">Medicamentos de Adultos a Cargo</h2>

      {/* Selector de Adulto */}
      <div className="medicamentos-card" style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Seleccionar Adulto Mayor:
        </label>
        <select
          value={adultoSeleccionado}
          onChange={(e) => setAdultoSeleccionado(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '1rem',
            fontFamily: 'inherit'
          }}
        >
          {adultos.map((adulto) => (
            <option key={adulto.id} value={adulto.id}>
              {adulto.nombre} {adulto.apellido}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro por Estado */}
      {medicamentos.length > 0 && (
        <div className="medicamentos-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              className={`filter-btn ${filtroCuidado === 'todos' ? 'active' : ''}`}
              onClick={() => setFiltroCuidado('todos')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: filtroCuidado === 'todos' ? '#3498db' : '#f0f0f0',
                color: filtroCuidado === 'todos' ? 'white' : 'black',
                cursor: 'pointer'
              }}
            >
              Todos ({medicamentos.length})
            </button>
            <button
              className={`filter-btn ${filtroCuidado === 'activos' ? 'active' : ''}`}
              onClick={() => setFiltroCuidado('activos')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: filtroCuidado === 'activos' ? '#4CAF50' : '#f0f0f0',
                color: filtroCuidado === 'activos' ? 'white' : 'black',
                cursor: 'pointer'
              }}
            >
              Activos ({medicamentos.filter(m => m.activo === true).length})
            </button>
            <button
              className={`filter-btn ${filtroCuidado === 'pausados' ? 'active' : ''}`}
              onClick={() => setFiltroCuidado('pausados')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: filtroCuidado === 'pausados' ? '#f44336' : '#f0f0f0',
                color: filtroCuidado === 'pausados' ? 'white' : 'black',
                cursor: 'pointer'
              }}
            >
              Pausados ({medicamentos.filter(m => m.activo === false).length})
            </button>
          </div>
        </div>
      )}

      {cargando ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Cargando medicamentos...</p>
        </div>
      ) : medicamentosFiltrados.length === 0 ? (
        <div className="medicamentos-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>
            {medicamentos.length === 0
              ? `${adultoActual?.nombre || 'Este adulto'} no tiene medicamentos registrados.`
              : 'No hay medicamentos con el filtro seleccionado.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {medicamentosFiltrados.map((medicamento) => (
            <div key={medicamento.id} className="medicamentos-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>💊 {medicamento.nombre}</h3>
                  <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.95rem' }}>
                    <strong>Dosis:</strong> {medicamento.dosis} {medicamento.unidad}
                  </p>
                </div>
                <span
                  style={{
                    backgroundColor: medicamento.activo === true ? '#4CAF50' : '#f44336',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold'
                  }}
                >
                  {medicamento.activo === true ? '✓ Activo' : '⊘ Pausado'}
                </span>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.95rem' }}>
                    <strong>Frecuencia:</strong>
                  </p>
                  <p style={{ margin: '0', fontSize: '0.9rem' }}>
                    {getFrequencyLabel(medicamento.frecuencia)}
                  </p>
                </div>

                <div>
                  <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.95rem' }}>
                    <strong>Prescrito por:</strong>
                  </p>
                  <p style={{ margin: '0', fontSize: '0.9rem' }}>
                    Dr. {medicamento.prescrito_por || 'No especificado'}
                  </p>
                </div>

                {medicamento.indicaciones && (
                  <div>
                    <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.95rem' }}>
                      <strong>Indicaciones:</strong>
                    </p>
                    <p style={{ margin: '0', fontSize: '0.9rem' }}>
                      {medicamento.indicaciones}
                    </p>
                  </div>
                )}
              </div>

              {medicamento.efectos_secundarios && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#fff3cd',
                  borderLeft: '4px solid #ff9800',
                  borderRadius: '4px',
                  marginTop: '1rem'
                }}>
                  <p style={{ margin: '0', color: '#856404', fontSize: '0.9rem' }}>
                    <strong>⚠️ Efectos secundarios posibles:</strong> {medicamento.efectos_secundarios}
                  </p>
                </div>
              )}

              {medicamento.notas && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#e3f2fd',
                  borderLeft: '4px solid #2196F3',
                  borderRadius: '4px',
                  marginTop: '1rem'
                }}>
                  <p style={{ margin: '0', color: '#1565c0', fontSize: '0.9rem' }}>
                    <strong>📌 Notas:</strong> {medicamento.notas}
                  </p>
                </div>
              )}

              <p style={{ margin: '1rem 0 0 0', color: '#999', fontSize: '0.85rem' }}>
                📅 Registrado: {new Date(medicamento.fecha_registro).toLocaleDateString('es-CO')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicamentosCuidador;
