import { useState, useEffect } from "react";
import "../../styles/citas.css";
import { obtenerCitasUsuario, actualizarCita, Cita } from "../../services/citas";

const Citas = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [filtro, setFiltro] = useState<string>("todas");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarCitas = async () => {
    try {
      setCargando(true);
      setError(null);
      
      // Obtener ID del usuario desde localStorage
      const perfilJson = localStorage.getItem('usuario_perfil');
      if (!perfilJson) {
        setError('No se encontró el usuario');
        return;
      }
      
      const perfil = JSON.parse(perfilJson);
      const citasData = await obtenerCitasUsuario(perfil.id);
      setCitas(citasData);
    } catch (err: any) {
      setError('Error al cargar las citas');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const citasFiltradas = citas.filter(cita => {
    if (filtro === "todas") return true;
    return cita.estado === filtro;
  });

  const handleConfirmarCita = async (citaId: string) => {
    await actualizarCita(citaId, { estado: 'confirmada' });
    setCitas(citas.map(c => c.id === citaId ? { ...c, estado: 'confirmada' } : c));
  };

  const handleCancelarCita = async (citaId: string) => {
    await actualizarCita(citaId, { estado: 'cancelada' });
    setCitas(citas.map(c => c.id === citaId ? { ...c, estado: 'cancelada' } : c));
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return "estado-confirmada";
      case "pendiente":
        return "estado-pendiente";
      case "completada":
        return "estado-completada";
      case "cancelada":
        return "estado-cancelada";
      default:
        return "";
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return "Confirmada";
      case "pendiente":
        return "Pendiente";
      case "completada":
        return "Completada";
      case "cancelada":
        return "Cancelada";
      default:
        return estado;
    }
  };

  if (cargando) return <div className="citas-container"><p>Cargando citas...</p></div>;
  if (error) return <div className="citas-container"><p style={{color: '#b91c1c'}}>{error}</p></div>;

  return (
    <div className="citas-container">
      <div className="citas-header">
        <h2>Mis Citas Médicas</h2>
        <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Tu médico agendará las citas para ti
        </p>
      </div>

      <div className="filtros">
        <button 
          className={filtro === "todas" ? "filtro-btn active" : "filtro-btn"}
          onClick={() => setFiltro("todas")}
        >
          Todas
        </button>
        <button 
          className={filtro === "pendiente" ? "filtro-btn active" : "filtro-btn"}
          onClick={() => setFiltro("pendiente")}
        >
          Pendientes
        </button>
        <button 
          className={filtro === "confirmada" ? "filtro-btn active" : "filtro-btn"}
          onClick={() => setFiltro("confirmada")}
        >
          Confirmadas
        </button>
        <button 
          className={filtro === "completada" ? "filtro-btn active" : "filtro-btn"}
          onClick={() => setFiltro("completada")}
        >
          Completadas
        </button>
      </div>

      <div className="citas-grid">
        {citasFiltradas.length === 0 ? (
          <div className="no-citas">
            <p>No hay citas {filtro !== "todas" ? filtro + "s" : ""} para mostrar</p>
          </div>
        ) : (
          citasFiltradas.map(cita => (
            <div key={cita.id} className="cita-card">
              <div className="cita-header-card">
                <span className={`estado-badge ${getEstadoColor(cita.estado)}`}>
                  {getEstadoTexto(cita.estado)}
                </span>
                <span className="especialidad">{cita.especialidad}</span>
              </div>

              <div className="cita-info">
                <div className="info-row">
                  <span className="icon">📅</span>
                  <div>
                    <p className="label">Fecha</p>
                    <p className="value">{new Date(cita.fecha).toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                </div>

                <div className="info-row">
                  <span className="icon">🕐</span>
                  <div>
                    <p className="label">Hora</p>
                    <p className="value">{cita.hora}</p>
                  </div>
                </div>

                <div className="info-row">
                  <span className="icon">👨‍⚕️</span>
                  <div>
                    <p className="label">Doctor</p>
                    <p className="value">{cita.medico ? `${cita.medico.nombre} ${cita.medico.apellido}` : 'No asignado'}</p>
                  </div>
                </div>

                <div className="info-row">
                  <span className="icon">📋</span>
                  <div>
                    <p className="label">Motivo</p>
                    <p className="value">{cita.motivo}</p>
                  </div>
                </div>
              </div>

              <div className="cita-actions">
                {cita.estado === "pendiente" && (
                  <>
                    <button className="btn-confirmar" onClick={() => handleConfirmarCita(cita.id)}>Confirmar</button>
                    <button className="btn-cancelar" onClick={() => handleCancelarCita(cita.id)}>Cancelar</button>
                  </>
                )}
                {cita.estado === "confirmada" && (
                  <>
                    <button className="btn-recordatorio">Recordatorio</button>
                    <button className="btn-cancelar" onClick={() => handleCancelarCita(cita.id)}>Cancelar</button>
                  </>
                )}
                {cita.estado === "completada" && (
                  <button className="btn-ver-detalle">Ver detalle</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Citas;