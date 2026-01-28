import { useState, useEffect } from "react";
import "../../styles/citas.css";
import { obtenerCitasMedico, crearCita, Cita } from "../../services/citas";
import { obtenerPacientesDelMedico } from "../../services/medicoPaciente";

const CitasMedico = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [filtro, setFiltro] = useState<string>("todas");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Datos del formulario
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [especialidad, setEspecialidad] = useState("");

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);
      
      const perfilJson = localStorage.getItem('usuario_perfil');
      if (!perfilJson) {
        setError('No se encontró el usuario');
        return;
      }
      
      const perfil = JSON.parse(perfilJson);
      
      // Cargar citas del médico (usando obtenerCitasMedico)
      const citasData = await obtenerCitasMedico(perfil.id);
      setCitas(citasData);
      
      // Cargar pacientes del médico
      const pacientesData = await obtenerPacientesDelMedico(perfil.id);
      setPacientes(pacientesData);
      
      // Establecer especialidad del médico si existe
      if (perfil.especialidad) {
        setEspecialidad(perfil.especialidad);
      }
    } catch (err: any) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const citasFiltradas = citas.filter(cita => {
    if (filtro === "todas") return true;
    return cita.estado === filtro;
  });

  const handleCrearCita = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!pacienteSeleccionado || !fecha || !hora || !motivo) {
      alert('Por favor completa todos los campos');
      return;
    }

    const fechaHora = new Date(`${fecha}T${hora}`);
    if (fechaHora < new Date()) {
      alert('No puedes agendar una cita en el pasado');
      return;
    }

    try {
      const perfilJson = localStorage.getItem('usuario_perfil');
      if (!perfilJson) {
        alert('Error: No se encontró el usuario');
        return;
      }
      
      const perfil = JSON.parse(perfilJson);
      
      const nuevaCita = {
        adulto_mayor_id: pacienteSeleccionado,
        medico_id: perfil.id,
        fecha,
        hora,
        motivo,
        especialidad: especialidad || 'General',
        estado: 'pendiente' as const
      };

      const citaCreada = await crearCita(nuevaCita);
      
      if (citaCreada) {
        alert('✅ Cita creada exitosamente');
        setMostrarFormulario(false);
        // Limpiar formulario
        setPacienteSeleccionado("");
        setFecha("");
        setHora("");
        setMotivo("");
        // Recargar citas
        cargarDatos();
      }
    } catch (err: any) {
      alert('Error al crear la cita: ' + err.message);
      console.error(err);
    }
  };

  if (cargando) {
    return <div className="page-container"><p>Cargando...</p></div>;
  }

  if (error) {
    return <div className="page-container"><p className="error">{error}</p></div>;
  }

  return (
    <div className="page-container citas-container">
      <div className="citas-header">
        <h2>Mis Citas Médicas</h2>
        <button 
          className="btn-agendar"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? '✕ Cerrar' : '+ Agendar Cita'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="formulario-cita">
          <h3>Agendar Nueva Cita</h3>
          <form onSubmit={handleCrearCita}>
            <div className="form-group">
              <label>Paciente *</label>
              <select
                value={pacienteSeleccionado}
                onChange={(e) => setPacienteSeleccionado(e.target.value)}
                required
              >
                <option value="">Selecciona un paciente</option>
                {pacientes.map((paciente) => (
                  <option key={paciente.id} value={paciente.id}>
                    {paciente.nombre} {paciente.apellido}
                  </option>
                ))}
              </select>
              {pacientes.length === 0 && (
                <small style={{ color: '#666' }}>
                  No tienes pacientes asignados. Agrega pacientes primero.
                </small>
              )}
            </div>

            <div className="form-group">
              <label>Especialidad</label>
              <input
                type="text"
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value)}
                placeholder="Ej: Cardiología"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha *</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hora *</label>
                <input
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Motivo de la consulta *</label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Describe el motivo de la cita..."
                rows={3}
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setMostrarFormulario(false)} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Crear Cita
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="filtros-citas">
        <button 
          className={filtro === "todas" ? "filtro-activo" : ""}
          onClick={() => setFiltro("todas")}
        >
          Todas ({citas.length})
        </button>
        <button 
          className={filtro === "pendiente" ? "filtro-activo" : ""}
          onClick={() => setFiltro("pendiente")}
        >
          Pendientes ({citas.filter(c => c.estado === 'pendiente').length})
        </button>
        <button 
          className={filtro === "confirmada" ? "filtro-activo" : ""}
          onClick={() => setFiltro("confirmada")}
        >
          Confirmadas ({citas.filter(c => c.estado === 'confirmada').length})
        </button>
        <button 
          className={filtro === "completada" ? "filtro-activo" : ""}
          onClick={() => setFiltro("completada")}
        >
          Completadas ({citas.filter(c => c.estado === 'completada').length})
        </button>
        <button 
          className={filtro === "cancelada" ? "filtro-activo" : ""}
          onClick={() => setFiltro("cancelada")}
        >
          Canceladas ({citas.filter(c => c.estado === 'cancelada').length})
        </button>
      </div>

      <div className="citas-lista">
        {citasFiltradas.length === 0 ? (
          <p className="sin-citas">No tienes citas {filtro !== "todas" ? filtro + "s" : ""}</p>
        ) : (
          citasFiltradas.map((cita) => (
            <div key={cita.id} className={`cita-card estado-${cita.estado}`}>
              <div className="cita-badge">{cita.estado.toUpperCase()}</div>
              <div className="cita-fecha">
                <span className="dia">
                  {new Date(cita.fecha).toLocaleDateString('es-ES', { day: '2-digit' })}
                </span>
                <span className="mes">
                  {new Date(cita.fecha).toLocaleDateString('es-ES', { month: 'short' })}
                </span>
              </div>
              <div className="cita-info">
                <h3>{cita.especialidad}</h3>
                <p className="paciente-nombre">
                  Paciente: {cita.paciente?.nombre} {cita.paciente?.apellido}
                </p>
                <p className="cita-hora">
                  🕐 {cita.hora}
                </p>
                <p className="cita-motivo">{cita.motivo}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CitasMedico;
