import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css"; 

const RecuperarUsuario = () => {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Recuperar usuario para:", email);
    setEnviado(true);
    
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="sistema-header">
          <h2 className="sistema-nombre">Recuperar Usuario</h2>
          <p className="sistema-subtitulo">Te enviaremos tu nombre de usuario por correo</p>
        </div>

        {!enviado ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Correo Electrónico:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <button type="submit">Enviar</button>
          </form>
        ) : (
          <div className="mensaje-exito-recuperar">
            <p>✅ Hemos enviado tu nombre de usuario a <strong>{email}</strong></p>
            <p>Revisa tu bandeja de entrada.</p>
          </div>
        )}

        <div className="registro-link">
          <button 
            type="button" 
            className="btn-registro" 
            onClick={() => navigate("/")}
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecuperarUsuario;