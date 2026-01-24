import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

const PanelMedico = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h2>Panel del Médico</h2>
      <p>Accesos rápidos para tu trabajo diario.</p>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <div className="card" onClick={() => navigate('/usuarios')} style={{cursor:'pointer'}}>
          <h3>Pacientes</h3>
          <p>Ver y gestionar tus pacientes</p>
        </div>

        <div className="card" onClick={() => navigate('/citas')} style={{cursor:'pointer'}}>
          <h3>Citas</h3>
          <p>Ver agenda y próximas consultas</p>
        </div>

        <div className="card" onClick={() => navigate('/reportes')} style={{cursor:'pointer'}}>
          <h3>Reportes</h3>
          <p>Generar reportes y exportar datos</p>
        </div>
      </div>
    </div>
  );
};

export default PanelMedico;
