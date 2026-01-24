import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { Eye, EyeClosed, AlertTriangle } from "lucide-react";
import "../styles/login.css"
import { login } from "../services/auth";

const Login = () => {
    const [nombre, setNombre] = useState("");
    const [password, setPassword] = useState("");
    const [errorNombre, setErrorNombre] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'light');
    const [recordarme, setRecordarme] = useState(false);
    const [cargando, setCargando] = useState(false);
    // Por defecto mostrar el formulario como Adulto Mayor (no mostrar selector al cargar)
    type UserType = "adultoMayor" | "cuidador" | "medico";
    const initialUserType = (localStorage.getItem('rol') as UserType) || 'adultoMayor';
    const [userType, setUserType] = useState<UserType>(initialUserType as UserType);
    const [showSelector, setShowSelector] = useState<boolean>(false);
    const [mensajeRol, setMensajeRol] = useState<string | null>(null as string | null);

    // Cerrar selector con ESC
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowSelector(false);
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // Aplicar tema guardado
    useEffect(() => {
        try {
            if (theme === 'dark') {
                document.documentElement.classList.add('dark-theme');
            } else {
                document.documentElement.classList.remove('dark-theme');
            }
            localStorage.setItem('theme', theme);
        } catch (e) {
            // ignore
        }
    }, [theme]);
    
    //  ELIMINADO: validaciones visuales de color verde
    const [intentosFallidos, setIntentosFallidos] = useState(0);
    const [bloqueado, setBloqueado] = useState(false);
    const [tiempoRestante, setTiempoRestante] = useState(0);
    const [mostrarMensajeError, setMostrarMensajeError] = useState(false);

    const navigate = useNavigate();
    const formRef = useRef<HTMLDivElement | null>(null);

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
                setTiempoRestante((prev: number) => {
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
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (bloqueado) {
            return;
        }
        
        setErrorNombre(false);
        setErrorPassword(false);
        setMostrarMensajeError(false);
        setCargando(true);
        
        let hayError = false;
        
        if (nombre === "" || nombre.length < 3) {
            setErrorNombre(true);
            hayError = true;
        }
        
        if (password === "" || !validarPassword(password)) {
            setErrorPassword(true);
            hayError = true;
        }
        
        if (hayError) {
            setCargando(false);
            return;
        }

        try {
            // Usar el servicio de autenticación
            const resultado = await login(nombre, password);

            if (resultado.success && resultado.user) {
                // LOGIN EXITOSO
                console.log("Login exitoso:", resultado.user);
                
                if (recordarme) {
                    localStorage.setItem('usuarioRecordado', nombre);
                } else {
                    localStorage.removeItem('usuarioRecordado');
                }

                setIntentosFallidos(0);
                localStorage.removeItem('intentosFallidos');
                localStorage.removeItem('bloqueoHasta');

                // El token y rol ya se guardaron en el servicio auth
                if (resultado.rol && userType && resultado.rol !== userType) {
                    setMensajeRol(`Atención: el usuario autenticado pertenece al rol '${resultado.rol}'. Se le dirigirá a su panel correspondiente.`);
                } else {
                    setMensajeRol(null);
                }

                // Redirigir y recargar para que el layout lea el rol actualizado
                window.location.href = "/home";
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
        } catch (error) {
            console.error('Error inesperado en login:', error);
            setErrorNombre(true);
            setErrorPassword(true);
            setMostrarMensajeError(true);
        } finally {
            setCargando(false);
        }
    };
    
    return (
        <div className="login-page-hero">
            <div className="hero">
                <div className="hero-left">
                    <div className="hero-top">
                        <div className="brand">
                            <h1>Bienvenido a <span className="brand-name">Teleasistencia</span></h1>
                            <p className="hero-sub">Cuidado médico a distancia, seguro y humano.</p>
                        </div>

                        <div className="top-actions">
                                    <button className="top-btn" type="button" onClick={() => formRef.current?.scrollIntoView({behavior:'smooth'})}>Iniciar sesión</button>
                                    <button className="top-btn top-btn-secondary" type="button" onClick={() => navigate('/registro')}>Crear cuenta</button>
                                    <button className="theme-toggle" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Cambiar tema">
                                        {theme === 'dark' ? '☀️ Claro' : '🌙 Oscuro'}
                                    </button>
                        </div>
                    </div>

                    <div className="hero-cta-row">
                        <div className="hero-actions">
                            <button type="button" className="cta-primary" onClick={() => formRef.current?.scrollIntoView({behavior:'smooth'})}>Iniciar sesión</button>
                            <button type="button" className="cta-secondary" onClick={() => navigate("/registro")}>Crear cuenta</button>
                        </div>
                        <p className="hero-help">Tu bienestar es nuestra prioridad.</p>
                    </div>
                </div>

                <div className="hero-right">
                    <div className="hero-image-wrapper" aria-hidden="true">
                        <img src="/hero-doctor.svg" alt="Doctor" className="hero-image" onError={(e: React.SyntheticEvent<HTMLImageElement>) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                        <div className="hero-image-decor" aria-hidden="true" />
                    </div>

                    <div className="login-card adjusted-login-card floating-card" ref={formRef} role="form" aria-label="Formulario de inicio de sesión">
                        <>
                            <h2>Iniciar sesión</h2>
                            <p className="lead">Accede a tu cuenta de Teleasistencia - {userType === 'adultoMayor' ? 'Adulto Mayor' : userType === 'cuidador' ? 'Cuidador' : 'Médico'}</p>
                            <div style={{display:'flex', justifyContent:'flex-end'}}>
                                <button type="button" className="btn-cambiar-tipo" onClick={() => { setShowSelector(true); setMensajeRol(null); }} aria-label="Cambiar tipo de usuario">Cambiar tipo</button>
                            </div>

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

                                {mostrarMensajeError && !bloqueado && (
                                    <div className="mensaje-error-login" role="alert" aria-live="assertive">
                                        <AlertTriangle size={20} />
                                        <div>
                                            <p className="error-titulo">No hemos podido iniciar sesión</p>
                                            <p className="error-subtitulo">El usuario o la contraseña no coinciden. Verifica tus datos o recupera tu contraseña.</p>
                                        </div>
                                    </div>
                                )}

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
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecordarme(e.target.checked)}
                                            disabled={bloqueado}
                                            aria-checked={recordarme}
                                        />
                                        <span>Recordar mis datos (opcional)</span>
                                    </label>
                                </div>

                                <button type="submit" disabled={bloqueado || cargando}>
                                    {bloqueado ? `Bloqueado (${tiempoRestante}s)` : cargando ? "Iniciando sesión..." : "Iniciar Sesión"}
                                </button>
                            </form>

                            {/* Se eliminó el botón demo; usar el selector de rol y credenciales reales */}

                            <div className="recuperar-password">
                                <p>¿Olvidaste tus datos? <button 
                                    type="button" 
                                    className="link-recuperar"
                                    onClick={() => navigate("/recuperar-usuario")}
                                    aria-label="Recuperar nombre de usuario"
                                >
                                    Recuperar nombre de usuario
                                </button> o <button 
                                    type="button" 
                                    className="link-recuperar"
                                    onClick={() => navigate("/recuperar-password")}
                                    aria-label="Recuperar contraseña"
                                >
                                    Recuperar contraseña
                                </button></p>
                                <p style={{marginTop:'8px'}}><button type="button" className="link-recuperar" onClick={() => navigate('/contacto')}>Accesibilidad / Ayuda</button></p>
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

                            {mensajeRol && (
                                <div className="mensaje-rol">
                                    {mensajeRol}
                                </div>
                            )}
                        </>
                    </div>
                </div>
            </div>

            {showSelector && (
                <div className="selector-overlay" onClick={() => setShowSelector(false)}>
                    <div className="selector-panel" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <h2 style={{marginTop:0}}>¿Cómo desea ingresar?</h2>
                        <div className="role-selection">
                            <button type="button" className="role-card" onClick={() => { setUserType('adultoMayor'); setShowSelector(false); setNombre(''); setPassword(''); }}>Adulto Mayor</button>
                            <button type="button" className="role-card" onClick={() => { setUserType('cuidador'); setShowSelector(false); setNombre(''); setPassword(''); }}>Cuidador</button>
                            <button type="button" className="role-card" onClick={() => { setUserType('medico'); setShowSelector(false); setNombre(''); setPassword(''); }}>Médico</button>
                        </div>
                        <div style={{textAlign:'center', marginTop:'12px'}}>
                            <button type="button" className="btn-cerrar-selector" onClick={() => setShowSelector(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Login;