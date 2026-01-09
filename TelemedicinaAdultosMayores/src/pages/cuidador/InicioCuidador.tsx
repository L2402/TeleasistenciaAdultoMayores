import "../../styles/home.css";
import { Users, CalendarDays, MessageSquare, HeartPulse, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InicioCuidador = () => {
  const cuidador = "María López";
  const adultosACargo = 3;
  const proximaCita = {
    fecha: "18 de enero, 09:00 AM",
    paciente: "Carlos Pérez"
  };
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="logo-header">
        <img src="logo-telemedicina.png" alt="Teleasistencia - Cuidado 24/7" className="logo-sistema" />
      </div>

      <div className="home-content">
        <h1 className="home-title">👋 Bienvenida, {cuidador}</h1>
        <p className="home-subtitle">Desde aquí puedes gestionar a los adultos a tu cargo, sus citas y comunicaciones.</p>

        <div className="cards-container">
          <div className="card" onClick={() => navigate("/usuarios")}>
            <Users size={32} color="#1d4ed8" />
            <h3>Adultos a cargo</h3>
            <p>{adultosACargo} personas</p>
            <small>Ver y gestionar información</small>
          </div>

          <div className="card" onClick={() => navigate("/citas")}>
            <CalendarDays size={32} color="#ef4444" />
            <h3>Próxima cita</h3>
            <p>{proximaCita.fecha}</p>
            <small>Paciente: {proximaCita.paciente}</small>
          </div>

          <div className="card" onClick={() => navigate("/mensajes")}>
            <MessageSquare size={32} color="#16a34a" />
            <h3>Mensajes</h3>
            <p>Tienes 1 mensaje nuevo</p>
            <small>Comunícate con el equipo médico</small>
          </div>

          <div className="card" onClick={() => navigate("/monitoreo")}>
            <HeartPulse size={32} color="#6d28d9" />
            <h3>Monitoreo</h3>
            <p>Revisar estado de salud</p>
            <small>Última actualización: hace 3 horas</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InicioCuidador;
