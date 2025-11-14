import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { Eye, EyeClosed, AlertTriangle } from "lucide-react";
import "../styles/login.css"

const Login = () => {
    const [nombre, setNombre] = useState("");
    const [password, setPassword] = useState("");
    const [errorNombre, setErrorNombre] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [recordarme, setRecordarme] = useState(false);
    
    // YA NO MOSTRAMOS VALIDACIÓN VERDE EN LOGIN
    const [intentosFallidos, setIntentosFallidos] = useState(0);
    const [bloqueado, setBloqueado] = useState(false);
    const [tiempoRestante, setTiempoRestante] = useState(0);
    const [mostrarMensajeError, setMostrarMensajeError] = useState(false);

    const navigate = useNavigate();

    // Validar contraseña: 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
    const validarPassword = (pass: string): boolean => {
        if (pass.length < 8) return false;
        if (!/[A-Z]/.test(pass)) return false;
        if (!/[a-z]/.test(pass)) return false;
        if (!/[0-9]/.test(pass)) return false;
        return true;
    };

    useEffect(() => {
        const usuarioGuardado = localStorage.getItem('usuarioRecordado');
        if (usuarioGuardado) {
            setNombre(usuarioGuardado);
            setRecordarme(true);
        }

        const bloqueoHasta = localStorage.getItem('bloqueoHasta');
        if (bloqueoHasta) {
            const tiempoBloqueo = parseInt(bloqueoHasta);
            const ahora = Date.now();
            
            if (ahora < tiempoBloqueo) {
                setBloqueado(true);
                setTiempoRestante(Math.ceil((tiempoBloqueo - ahora) / 1000));
            } else {
                localStorage.removeItem('bloqueoHasta');
                localStorage.removeItem('intentosFallidos');
            }
        }

        const intentos = localStorage.getItem('intentosFallidos');
        if (intentos) {
            setIntentosFallidos(parseInt(intentos));
        }
    }, []);

    useEffect(() => {
        if (bloqueado && tiempoRestante > 0) {
            const timer = setInterval(() => {
                setTiempoRestante(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setBloqueado(false);
                        setIntentosFallidos(0);
                        setMostrarMensajeError(false);
                        setErrorNombre(false);
                        setErrorPassword(false);
                        localStorage.removeItem('bloqueoHasta');
                        localStorage.removeItem('intentosFallidos');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [bloqueado, tiempoRestante]);

    const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setNombre(valor);
        setErrorNombre(false);
        setMostrarMensajeError(false);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setPassword(valor);
        setErrorPassword(false);
        setMostrarMensajeError(false);
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (bloqueado) {
            return;
        }
        
        setErrorNombre(false);
        setErrorPassword(false);
        setMostrarMensajeError(false);
        
        let hayError = false;
        
        if (nombre === "" || nombre.length < 3) {
            setErrorNombre(true);
            hayError = true;
        }
        
        if (password === "" || !validarPassword(password)) {
            setErrorPassword(true);
            hayError = true;
        }
        
        if (hayError) return;

        // Credenciales correctas de ejemplo
        const usuarioCorrecto = "admin";
        const passwordCorrecto = "Admin123";

        if (nombre === usuarioCorrecto && password === passwordCorrecto) {
            // LOGIN EXITOSO
            console.log("Login exitoso:", { nombre, password });
            
            if (recordarme) {
                localStorage.setItem('usuarioRecordado', nombre);
            } else {
                localStorage.removeItem('usuarioRecordado');
            }

            setIntentosFallidos(0);
            localStorage.removeItem('intentosFallidos');
            localStorage.removeItem('bloqueoHasta');

            localStorage.setItem('token', 'fake-token-123');
            localStorage.setItem('rol', 'adultoMayor');
            navigate("/home");
        } else {
            // LOGIN FALLIDO
            const nuevosIntentos = intentosFallidos + 1;
            setIntentosFallidos(nuevosIntentos);
            localStorage.setItem('intentosFallidos', nuevosIntentos.toString());

            // Marcar campos como error (borde rojo)
            setErrorNombre(true);
            setErrorPassword(true);
            setMostrarMensajeError(true);

            if (nuevosIntentos >= 3) {
                // Bloquear por 35 segundos
                const tiempoBloqueo = Date.now() + 35000;
                localStorage.setItem('bloqueoHasta', tiempoBloqueo.toString());
                setBloqueado(true);
                setTiempoRestante(35);
            }
        }
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
                        <div className="input-wrapper">
                            <input 
                                type="text" 
                                value={nombre} 
                                onChange={handleNombreChange} 
                                placeholder="Ingrese su usuario"
                                className={errorNombre ? "input-error" : ""}
                                disabled={bloqueado}
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Contraseña:</label>
                        <div className="input-wrapper-password">
                            <input 
                                type={mostrarPassword ? "text" : "password"} 
                                value={password} 
                                onChange={handlePasswordChange} 
                                placeholder="Ingrese su contraseña"
                                className={errorPassword ? "input-error" : ""}
                                disabled={bloqueado}
                            />
                            <button
                                className="Boton-Password"
                                type="button"
                                aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                onClick={() => setMostrarPassword(!mostrarPassword)}
                                disabled={bloqueado}
                            >
                                {mostrarPassword ? <Eye size={20}/> : <EyeClosed size={20}/>}
                            </button>
                        </div>
                    </div>

                    {/* MENSAJE DE ERROR MEJORADO */}
                    {mostrarMensajeError && !bloqueado && (
                        <div className="mensaje-error-login">
                            <AlertTriangle size={20} />
                            <div>
                                <p className="error-titulo">Error de nombre de usuario o contraseña</p>
                                <p className="error-subtitulo">El nombre de usuario o la contraseña son incorrectos. Intente nuevamente.</p>
                            </div>
                        </div>
                    )}

                    {/* MENSAJE DE BLOQUEO MEJORADO */}
                    {bloqueado && (
                        <div className="mensaje-bloqueo-login">
                            <AlertTriangle size={22} />
                            <div className="mensaje-bloqueo-texto">
                                <p className="bloqueo-titulo">⚠️ Acceso temporalmente bloqueado</p>
                                <p className="bloqueo-descripcion">Por seguridad, el acceso se ha bloqueado temporalmente.</p>
                                <p className="bloqueo-instruccion">Por favor, verifica tus datos o recupera tu contraseña antes de continuar.</p>
                                <p className="contador-bloqueo">Puedes volver a intentarlo en <strong>{tiempoRestante}</strong> segundos</p>
                            </div>
                        </div>
                    )}

                    <div className="recordarme-container">
                        <label className="recordarme-label">
                            <input 
                                type="checkbox" 
                                checked={recordarme}
                                onChange={(e) => setRecordarme(e.target.checked)}
                                disabled={bloqueado}
                            />
                            <span>Recordar mis datos</span>
                        </label>
                    </div>
                    
                    <button type="submit" disabled={bloqueado}>
                        {bloqueado ? `Bloqueado (${tiempoRestante}s)` : "Iniciar Sesión"}
                    </button>
                </form>

                <div className="recuperar-password">
                    <p>¿Ha olvidado su <button 
                        type="button" 
                        className="link-recuperar"
                        onClick={() => navigate("/recuperar-usuario")}
                    >
                        nombre de usuario
                    </button> o <button 
                        type="button" 
                        className="link-recuperar"
                        onClick={() => navigate("/recuperar-password")}
                    >
                        contraseña
                    </button>?</p>
                </div>

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