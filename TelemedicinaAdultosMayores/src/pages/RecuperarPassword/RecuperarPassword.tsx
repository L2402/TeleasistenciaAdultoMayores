import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css"; 

const RecuperarPassword = () => {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Recuperar contraseña para:", email);
    setEnviado(true);
    
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="sistema-header">
          <h2 className="sistema-nombre">Recuperar Contraseña</h2>
          <p className="sistema-subtitulo">Te enviaremos un enlace para restablecer tu contraseña</p>
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

            <button type="submit">Enviar enlace</button>
          </form>
        ) : (
          <div className="mensaje-exito-recuperar">
            <p>✅ Hemos enviado un enlace de recuperación a <strong>{email}</strong></p>
            <p>Revisa tu bandeja de entrada y sigue las instrucciones.</p>
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

export default RecuperarPassword;