import "../../styles/home.css";
import { CalendarDays, HeartPulse, MessageSquare, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomeAdulto = () => {
  const usuario = "Carlos Pérez";
  const proximaCita = {
    fecha: "25 de octubre, 10:00 AM",
    medico: "Dra. María Gómez",
  };
  const estadoSalud = "Estable";

  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* ✅ Logo añadido */}
      <div className="logo-header">
        <img 
          src="logo-telemedicina.png" 
          alt="Teleasistencia - Cuidado 24/7" 
          className="logo-sistema"
        />
      </div>

      <div className="home-content">
        <h1 className="home-title">👋 Bienvenido, {usuario}</h1>
        <p className="home-subtitle">
          Desde aquí puedes acceder rápidamente a tus citas, monitoreo y más.
        </p>

        <div className="cards-container">
          <div className="card" onClick={() => navigate("/citas")}>
            <CalendarDays size={32} color="#1d4ed8" />
            <h3>Próxima cita</h3>
            <p>{proximaCita.fecha}</p>
            <small>con {proximaCita.medico}</small>
          </div>

          <div className="card" onClick={() => navigate("/monitoreo")}>
            <HeartPulse size={32} color="#ef4444" />
            <h3>Estado de salud</h3>
            <p>{estadoSalud}</p>
            <small>Última actualización: hace 2 horas</small>
          </div>

          <div className="card" onClick={() => navigate("/mensajes")}>
            <MessageSquare size={32} color="#16a34a" />
            <h3>Mensajes</h3>
            <p>Tienes 2 nuevos mensajes</p>
            <small>Revisa tus conversaciones</small>
          </div>

          <div className="card" onClick={() => navigate("/perfil")}>
            <User size={32} color="#6d28d9" />
            <h3>Perfil</h3>
            <p>Actualiza tus datos personales</p>
            <small>Mantén tu información al día</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAdulto;