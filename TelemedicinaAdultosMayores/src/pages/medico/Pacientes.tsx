import { useState, useEffect } from 'react';
import '../../styles/registroUsuario.css';
import BuscarPaciente from './BuscarPaciente';

interface Paciente {
  id: string;
  medico_id: string;
  paciente_id: string;
  especialidad?: string;
  activo: boolean;
  created_at: string;
  paciente?: {
    nombre: string;
    apellido: string;
    correo: string;
  };
}

const Pacientes = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarBuscar, setMostrarBuscar] = useState(false);

  const cargarPacientes = async () => {
    try {
      setCargando(true);
      const perfilJson = localStorage.getItem('usuario_perfil');
      if (!perfilJson) return;

      const perfil = JSON.parse(perfilJson);
      const { supabase } = await import('../../lib/supabase');

      const { data, error } = await supabase
        .from('medico_paciente')
        .select(`
          *,
          paciente:paciente_id(nombre, apellido, correo)
        `)
        .eq('medico_id', perfil.id)
        .eq('activo', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPacientes(data || []);
    } catch (err) {
      console.error('Error al cargar pacientes:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  return (
    <div className="page-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Mis Pacientes</h2>
        <button 
          className="btn-primary"
          onClick={() => setMostrarBuscar(!mostrarBuscar)}
        >
          {mostrarBuscar ? '✕ Cerrar' : '+ Agregar Paciente'}
        </button>
      </div>

      {mostrarBuscar && (
        <div style={{ marginBottom: '2rem' }}>
          <BuscarPaciente 
            onPacienteAgregado={() => {
              setMostrarBuscar(false);
              cargarPacientes();
            }}
          />
        </div>
      )}

      {cargando && <p>Cargando pacientes...</p>}
      
      {!cargando && pacientes.length === 0 && !mostrarBuscar && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px'
        }}>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>
            Aún no tienes pacientes asignados
          </p>
          <button 
            className="btn-primary"
            onClick={() => setMostrarBuscar(true)}
            style={{ marginTop: '1rem' }}
          >
            Agregar tu primer paciente
          </button>
        </div>
      )}

      {!cargando && pacientes.length > 0 && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {pacientes.map((p) => (
            <div
              key={p.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '12px',
                padding: '1.5rem',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                    {p.paciente?.nombre} {p.paciente?.apellido}
                  </h3>
                  <p style={{ margin: '0.25rem 0', color: '#666' }}>
                    📧 {p.paciente?.correo}
                  </p>
                  {p.especialidad && (
                    <p style={{ margin: '0.25rem 0', color: '#007bff', fontWeight: '500' }}>
                      🩺 {p.especialidad}
                    </p>
                  )}
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#888' }}>
                    Agregado: {new Date(p.created_at).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn-secondary"
                    style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                  >
                    Ver Historial
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pacientes;
