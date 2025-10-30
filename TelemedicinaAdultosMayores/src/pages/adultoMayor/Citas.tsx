import { useState } from "react";
import "../../styles/citas.css";

interface Cita {
  id: number;
  fecha: string;
  hora: string;
  doctor: string;
  especialidad: string;
  estado: "pendiente" | "confirmada" | "completada";
  motivo: string;
}

const Citas = () => {
  const [citas] = useState<Cita[]>([
    {
      id: 1,
      fecha: "2025-10-25",
      hora: "10:00 AM",
      doctor: "Dra. María Gómez",
      especialidad: "Cardiología",
      estado: "confirmada",
      motivo: "Control de presión arterial"
    },
    {
      id: 2,
      fecha: "2025-11-02",
      hora: "3:00 PM",
      doctor: "Dr. Juan Martínez",
      especialidad: "Medicina General",
      estado: "pendiente",
      motivo: "Chequeo general"
    },
    {
      id: 3,
      fecha: "2025-10-20",
      hora: "11:30 AM",
      doctor: "Dra. Ana López",
      especialidad: "Neurología",
      estado: "completada",
      motivo: "Revisión de resultados"
    }
  ]);

  const [filtro, setFiltro] = useState<string>("todas");

  const citasFiltradas = citas.filter(cita => {
    if (filtro === "todas") return true;
    return cita.estado === filtro;
  });

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return "estado-confirmada";
      case "pendiente":
        return "estado-pendiente";
      case "completada":
        return "estado-completada";
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
      default:
        return estado;
    }
  };

  return (
    <div className="citas-container">
      <div className="citas-header">
        <h2>Mis Citas</h2>
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
                    <p className="value">{cita.doctor}</p>
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
                    <button className="btn-confirmar">Confirmar</button>
                    <button className="btn-cancelar">Cancelar</button>
                  </>
                )}
                {cita.estado === "confirmada" && (
                  <>
                    <button className="btn-recordatorio">Recordatorio</button>
                    <button className="btn-cancelar">Cancelar</button>
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

      <button className="btn-nueva-cita">
        <span>+</span> Agendar Nueva Cita
      </button>
    </div>
  );
};

export default Citas;