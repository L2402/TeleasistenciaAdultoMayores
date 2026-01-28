import { useState, useEffect } from 'react';
import '../../styles/registroUsuario.css';
import { supabase } from '../../lib/supabase';
import { obtenerTodosAdultosMayores, asignarAdultoACuidador } from '../../services/adultosCuidador';

interface BuscarAdultosProps {
  onAdultoAgregado?: () => void;
}

const BuscarAdultos: React.FC<BuscarAdultosProps> = ({ onAdultoAgregado }) => {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const buscarAdulto = async () => {
    if (!busqueda.trim()) {
      setMensaje('Ingresa un nombre para buscar');
      return;
    }

    setCargando(true);
    setMensaje(null);

    try {
      
      // Dividir la búsqueda en palabras
      const palabras = busqueda.trim().split(/\s+/);
      
      // Usar la función segura para obtener adultos mayores
      const { data, error } = await supabase
        .rpc('buscar_adultos_mayores');

      if (error) throw error;

      // Filtrar por coincidencias en nombre o apellido
      const resultadosFiltrados = data?.filter((usuario: any) => {
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
        setMensaje(`No se encontraron adultos mayores con "${busqueda}"`);
        setResultados([]);
      } else {
        setResultados(resultadosFiltrados.slice(0, 10)); // Limitar a 10 resultados
      }
    } catch (err: any) {
      setMensaje('Error al buscar adultos mayores');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const agregarAdulto = async (adultoId: string) => {
    try {
      const perfilJson = localStorage.getItem('usuario_perfil');
      if (!perfilJson) {
        alert('Usuario no encontrado');
        return;
      }

      const perfil = JSON.parse(perfilJson);
      
      const exito = await asignarAdultoACuidador(perfil.id, adultoId);

      if (exito) {
        alert('✅ Adulto agregado exitosamente');
        setResultados(resultados.filter(r => r.id !== adultoId));
        if (onAdultoAgregado) onAdultoAgregado();
      } else {
        alert('Error al agregar adulto');
      }
    } catch (err: any) {
      alert(err.message || 'Error al agregar adulto');
    }
  };

  return (
    <div className="registro-container">
      <h2 className="registro-title">Buscar y Agregar Adultos a Cargo</h2>
      
      <div className="registro-card">
        <div className="form-group">
          <label>Buscar Adulto Mayor por Nombre</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && buscarAdulto()}
              placeholder="Nombre o apellido del adulto mayor"
              style={{ flex: 1 }}
            />
            <button 
              className="btn-primary" 
              onClick={buscarAdulto}
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
              {resultados.map((adulto) => (
                <div
                  key={adulto.id}
                  style={{
                    padding: '1rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0 }}>{adulto.nombre} {adulto.apellido}</h4>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                      📧 {adulto.correo}
                    </p>
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => agregarAdulto(adulto.id)}
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

export default BuscarAdultos;
