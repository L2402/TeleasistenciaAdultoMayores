import { useState } from 'react';
import '../../styles/registroUsuario.css';
import { obtenerTodosMedicos, asignarMedicoAPaciente } from '../../services/medicoPaciente';

interface BuscarPacienteProps {
  onPacienteAgregado?: () => void;
}

const BuscarPaciente: React.FC<BuscarPacienteProps> = ({ onPacienteAgregado }) => {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [especialidad, setEspecialidad] = useState('');

  const buscarPaciente = async () => {
    if (!busqueda.trim()) {
      setMensaje('Ingresa un nombre para buscar');
      return;
    }

    setCargando(true);
    setMensaje(null);

    try {
      const { supabase } = await import('../../lib/supabase');
      
      // Dividir la búsqueda en palabras
      const palabras = busqueda.trim().split(/\s+/);
      
      // Usar la función segura para obtener adultos mayores
      const { data, error } = await supabase
        .rpc('buscar_adultos_mayores');

      if (error) throw error;

      // Filtrar por coincidencias en nombre o apellido
      const resultadosFiltrados = data?.filter((usuario) => {
        const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`.toLowerCase();
        const busquedaLower = busqueda.toLowerCase();
        
        // Buscar si la búsqueda completa está contenida en el nombre completo
        if (nombreCompleto.includes(busquedaLower)) return true;
        
        // O si cada palabra de la búsqueda está en el nombre o apellido
        return palabras.every(palabra => 
          nombreCompleto.includes(palabra.toLowerCase())
        );
      }) || [];

      if (resultadosFiltrados.length === 0) {
        setMensaje(`No se encontraron pacientes con "${busqueda}"`);
        setResultados([]);
      } else {
        setResultados(resultadosFiltrados.slice(0, 10)); // Limitar a 10 resultados
      }
    } catch (err: any) {
      setMensaje('Error al buscar pacientes');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const agregarPaciente = async (pacienteId: string) => {
    if (!especialidad.trim()) {
      alert('Por favor ingresa tu especialidad primero');
      return;
    }

    try {
      const perfilJson = localStorage.getItem('usuario_perfil');
      if (!perfilJson) {
        alert('Usuario no encontrado');
        return;
      }

      const perfil = JSON.parse(perfilJson);
      
      const exito = await asignarMedicoAPaciente(perfil.id, pacienteId, especialidad);

      if (exito) {
        alert('✅ Paciente agregado exitosamente');
        setResultados(resultados.filter(r => r.id !== pacienteId));
        if (onPacienteAgregado) onPacienteAgregado();
      } else {
        alert('Error al agregar paciente');
      }
    } catch (err: any) {
      alert(err.message || 'Error al agregar paciente');
    }
  };

  return (
    <div className="registro-container">
      <h2 className="registro-title">Buscar y Agregar Pacientes</h2>
      
      <div className="registro-card">
        <div className="form-group">
          <label>Tu Especialidad*</label>
          <input
            type="text"
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
            placeholder="Ej: Cardiología"
          />
          <small>Esta especialidad se asociará a los pacientes que agregues</small>
        </div>

        <div className="form-group">
          <label>Buscar Paciente por Nombre</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && buscarPaciente()}
              placeholder="Nombre o apellido del paciente"
              style={{ flex: 1 }}
            />
            <button 
              className="btn-primary" 
              onClick={buscarPaciente}
              disabled={cargando}
            >
              {cargando ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>

        {mensaje && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#f0f0f0',
            borderRadius: '8px',
            marginTop: '1rem'
          }}>
            {mensaje}
          </div>
        )}

        {resultados.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <h3>Resultados ({resultados.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {resultados.map((paciente) => (
                <div
                  key={paciente.id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>
                      {paciente.nombre} {paciente.apellido}
                    </h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                      {paciente.correo}
                    </p>
                    {paciente.fecha_nacimiento && (
                      <p style={{ margin: '0.25rem 0 0 0', color: '#888', fontSize: '0.85rem' }}>
                        Nacimiento: {new Date(paciente.fecha_nacimiento).toLocaleDateString('es-ES')}
                      </p>
                    )}
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => agregarPaciente(paciente.id)}
                    disabled={!especialidad.trim()}
                  >
                    Agregar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuscarPaciente;
