import { useState } from "react"
import { useNavigate } from "react-router-dom";
import "../styles/login.css"

const Login = () => {
    const [nombre, setNombre] = useState("");
    const [password, setPassword] = useState("");
    const [errorNombre, setErrorNombre] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);

    const navigate = useNavigate();
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Reset errores
        setErrorNombre(false);
        setErrorPassword(false);
        
        // Validar campos específicos
        let hayError = false;
        
        if (nombre === "") {
            setErrorNombre(true);
            hayError = true;
        }
        
        if (password === "") {
            setErrorPassword(true);
            hayError = true;
        }
        
        if (hayError) return;
        
        console.log("Login exitoso:", { nombre, password });
        navigate("/home");
    };
    
    return (
        <div className="login-container">
            <div className="login-card">
                <div className="sistema-header">
                    <h2 className="sistema-nombre">Teleasistencia Adultos Mayores</h2>
                    <p className="sistema-subtitulo">Sistema de Atención Médica a Distancia</p>
                </div>

                <h1>Iniciar Sesión</h1>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Usuario:</label>
                        <input 
                            type="text" 
                            value={nombre} 
                            onChange={e => setNombre(e.target.value)} 
                            placeholder="Ingrese su usuario"
                            className={errorNombre ? "input-error" : ""}
                        />
                        {errorNombre && <p className="error-message">El campo usuario es obligatorio</p>}
                    </div>
                    
                    <div className="form-group">
                        <label>Contraseña:</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            placeholder="Ingrese su contraseña"
                            className={errorPassword ? "input-error" : ""}
                        />
                        {errorPassword && <p className="error-message">El campo contraseña es obligatorio</p>}
                    </div>
                    
                    <button type="submit">Iniciar Sesión</button>
                </form>

                <div className="registro-link">
                    <p>¿No tienes una cuenta?</p>
                    <button 
                        type="button" 
                        className="btn-registro" 
                        onClick={() => navigate("/registro")}
                    >
                        Registrarse
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login;