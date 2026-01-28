import { useNavigate } from "react-router-dom";
import { Home, Calendar, HeartPulse, Users, MessageSquare, LogOut, UserCog, Stethoscope, Pill, AlertCircle, User } from "lucide-react";
import "../styles/sidebar.css";
import React from "react";

interface SidebarProps {
  rol: "adultoMayor" | "medico" | "cuidador";
}

const Sidebar = ({ rol }: SidebarProps) => {
  const navigate = useNavigate();
  const [isExpanded, setItsExpanded] = React.useState(false);

  React.useEffect(() => {
    const handler = () => setItsExpanded((prev: boolean) => !prev);
    window.addEventListener('toggle-sidebar', handler as EventListener);
    return () => window.removeEventListener('toggle-sidebar', handler as EventListener);
  }, []);

  const menus = {
    adultoMayor: [
      { icon: <Home size={20} />, text: "Inicio", path: "/home" },
      { icon: <Calendar size={20} />, text: "Mis citas", path: "/citas" },
      { icon: <HeartPulse size={20} />, text: "Monitoreo", path: "/monitoreo" },
      { icon: <Pill size={20} />, text: "Medicamentos", path: "/medicamentos" },
      { icon: <MessageSquare size={20} />, text: "Mensajes", path: "/mensajes" },
    { icon: <Calendar size={20} />, text: "Historial", path: "/historial-sesiones" },
    { icon: <HeartPulse size={20} />, text: "Registro anímico", path: "/registro-animo" },
    { icon: <User size={20} />, text: "Verificación (KYC)", path: "/kyc" },
      { icon: <AlertCircle size={20} />, text: "Incidencias", path: "/incidencias" },
      { icon: <UserCog size={20} />, text: "Perfil", path: "/perfil" },
    ],
    medico: [
      { icon: <Stethoscope size={20} />, text: "Panel Médico", path: "/home" },
      { icon: <Users size={20} />, text: "Pacientes", path: "/usuarios" },
      { icon: <Calendar size={20} />, text: "Citas", path: "/citas" },
      { icon: <HeartPulse size={20} />, text: "Reportes", path: "/reportes" },
      { icon: <Pill size={20} />, text: "Medicamentos", path: "/medicamentos" },
      { icon: <MessageSquare size={20} />, text: "Mensajes", path: "/mensajes" },
      { icon: <UserCog size={20} />, text: "Perfil", path: "/perfil" },
    ],
    cuidador: [
      { icon: <Home size={20} />, text: "Inicio", path: "/home" },
      { icon: <Users size={20} />, text: "Adultos a cargo", path: "/usuarios" },
      { icon: <Calendar size={20} />, text: "Citas", path: "/citas" },
      { icon: <MessageSquare size={20} />, text: "Mensajes", path: "/mensajes" },
      { icon: <UserCog size={20} />, text: "Perfil", path: "/perfil" },
    ],
  };

  const opciones = menus[rol];

  const handleLogout = () => {
    // Limpiar todo el localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rol');
    navigate("/");
  };

  return (
    <div 
      className={`sidebar ${isExpanded ? "expanded" : ""}`}
      onMouseEnter={() => setItsExpanded(true)}
      onMouseLeave={() => setItsExpanded(false)}
    >
      <h2 className="sidebar-title">Teleasistencia</h2>
      <ul>
        {opciones.map((item, i) => (
          <li key={i} onClick={() => navigate(item.path)}>
            {item.icon}
            <span className="sidebar-text">{item.text}</span>
          </li>
        ))}
        <li onClick={handleLogout}>
          <LogOut /> <span className="sidebar-text">Salir</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;