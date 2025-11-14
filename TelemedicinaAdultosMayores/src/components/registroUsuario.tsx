import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/registroUsuario.css";
import { Eye, EyeClosed, Check, X } from 'lucide-react';

const RegistroUsuario = () => {
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombreUsuario: '',
        nombre: '',
        apellido: '',
        contraseña: '',
        correo: '',
        pais: '',
        fechaNacimiento: '',
        tipoUsuario: ''
    });

    const [errors, setErrors] = useState({
        nombreUsuario: false,
        nombre: false,
        apellido: false,
        contraseña: false,
        correo: false,
        pais: false,
        fechaNacimiento: false,
        tipoUsuario: false
    });

    const [validaciones, setValidaciones] = useState({
        nombreUsuario: null as boolean | null,
        nombre: null as boolean | null,
        apellido: null as boolean | null,
        contraseña: null as boolean | null,
        correo: null as boolean | null,
        pais: null as boolean | null,
        fechaNacimiento: null as boolean | null,
        tipoUsuario: null as boolean | null
    });

    // Países con banderas
    const paises = [
        { codigo: "", nombre: "Seleccione un país", bandera: "" },
        { codigo: "EC", nombre: "Ecuador", bandera: "🇪🇨" },
        { codigo: "US", nombre: "Estados Unidos", bandera: "🇺🇸" },
        { codigo: "ES", nombre: "España", bandera: "🇪🇸" },
        { codigo: "MX", nombre: "México", bandera: "🇲🇽" },
        { codigo: "CO", nombre: "Colombia", bandera: "🇨🇴" },
        { codigo: "PE", nombre: "Perú", bandera: "🇵🇪" },
        { codigo: "AR", nombre: "Argentina", bandera: "🇦🇷" },
        { codigo: "CL", nombre: "Chile", bandera: "🇨🇱" },
        { codigo: "BR", nombre: "Brasil", bandera: "🇧🇷" },
        { codigo: "VE", nombre: "Venezuela", bandera: "🇻🇪" },
        { codigo: "PA", nombre: "Panamá", bandera: "🇵🇦" },
        { codigo: "CR", nombre: "Costa Rica", bandera: "🇨🇷" },
        { codigo: "GT", nombre: "Guatemala", bandera: "🇬🇹" },
        { codigo: "DO", nombre: "República Dominicana", bandera: "🇩🇴" },
        { codigo: "CU", nombre: "Cuba", bandera: "🇨🇺" },
        { codigo: "BO", nombre: "Bolivia", bandera: "🇧🇴" },
        { codigo: "PY", nombre: "Paraguay", bandera: "🇵🇾" },
        { codigo: "UY", nombre: "Uruguay", bandera: "🇺🇾" },
        { codigo: "SV", nombre: "El Salvador", bandera: "🇸🇻" },
        { codigo: "HN", nombre: "Honduras", bandera: "🇭🇳" },
        { codigo: "NI", nombre: "Nicaragua", bandera: "🇳🇮" }
    ];

    const validarEmail = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Validar NOMBRE DE USUARIO (estricto)
    const validarNombreUsuario = (usuario: string): boolean => {
        // Entre 4 y 15 caracteres
        if (usuario.length < 4 || usuario.length > 15) return false;
        
        // Solo letras y números, sin espacios ni caracteres especiales
        if (!/^[a-zA-Z0-9]+$/.test(usuario)) return false;
        
        // No solo números
        if (/^[0-9]+$/.test(usuario)) return false;
        
        // No repeticiones absurdas (aaa, 1111, etc.)
        if (/(.)\1{2,}/.test(usuario)) return false;
        
        return true;
    };

    // Validar solo letras (nombres y apellidos)
    const validarNombre = (texto: string): boolean => {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        return texto.length >= 3 && regex.test(texto);
    };

    // Validar contraseña: 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
    const validarPassword = (password: string): boolean => {
        if (password.length < 8) return false;
        if (!/[A-Z]/.test(password)) return false;
        if (!/[a-z]/.test(password)) return false;
        if (!/[0-9]/.test(password)) return false;
        return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        setFormData({
            ...formData,
            [name]: value,
        });
        
        if (value) {
            setErrors({
                ...errors,
                [name]: false
            });
        }

        let esValido: boolean | null = null;
        
        if (value.trim() !== '') {
            switch (name) {
                case 'nombreUsuario':
                    esValido = validarNombreUsuario(value);
                    break;
                case 'nombre':
                case 'apellido':
                    esValido = validarNombre(value);
                    break;
                case 'contraseña':
                    esValido = validarPassword(value);
                    break;
                case 'correo':
                    esValido = validarEmail(value);
                    break;
                case 'pais':
                case 'fechaNacimiento':
                case 'tipoUsuario':
                    esValido = value !== '';
                    break;
                default:
                    esValido = null;
            }
        }
        
        setValidaciones({
            ...validaciones,
            [name]: esValido
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors = {
            nombreUsuario: !formData.nombreUsuario || !validarNombreUsuario(formData.nombreUsuario),
            nombre: !formData.nombre || !validarNombre(formData.nombre),
            apellido: !formData.apellido || !validarNombre(formData.apellido),
            contraseña: !formData.contraseña || !validarPassword(formData.contraseña),
            correo: !formData.correo || !validarEmail(formData.correo),
            pais: !formData.pais,
            fechaNacimiento: !formData.fechaNacimiento,
            tipoUsuario: !formData.tipoUsuario
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error)) {
            return;
        }

        console.log('Datos del registro: ', formData);
        alert(`✅ Usuario registrado exitosamente: @${formData.nombreUsuario}`);
        
        setFormData({
            nombreUsuario: '',
            nombre: '',
            apellido: '',
            contraseña: '',
            correo: '',
            pais: '',
            fechaNacimiento: '',
            tipoUsuario: ''
        });
        setErrors({
            nombreUsuario: false,
            nombre: false,
            apellido: false,
            contraseña: false,
            correo: false,
            pais: false,
            fechaNacimiento: false,
            tipoUsuario: false
        });
        setValidaciones({
            nombreUsuario: null,
            nombre: null,
            apellido: null,
            contraseña: null,
            correo: null,
            pais: null,
            fechaNacimiento: null,
            tipoUsuario: null
        });

        setTimeout(() => navigate("/"), 1500);
    };

    return (
        <div className="registro-container">
            <h2 className="registro-title">Registro de Usuario</h2>
            <div className="registro-card">
                <form onSubmit={handleSubmit}>
                    {/* NOMBRE DE USUARIO */}
                    <div className='form-group'>
                        <label>Nombre de usuario*</label>
                        <div className="input-wrapper">
                            <input 
                                type="text" 
                                name="nombreUsuario" 
                                value={formData.nombreUsuario} 
                                onChange={handleChange}  
                                placeholder='4-15 caracteres, sin espacios'
                                className={`${errors.nombreUsuario ? "input-error" : ""} ${validaciones.nombreUsuario === true ? "input-valid" : ""}`}
                            />
                            {validaciones.nombreUsuario === true && <Check className="icon-check" size={20} />}
                            {validaciones.nombreUsuario === false && <X className="icon-error" size={20} />}
                        </div>
                        {errors.nombreUsuario && <p className="error-message">⚠ 4-15 caracteres, sin espacios ni símbolos, no solo números</p>}
                    </div>

                    {/* NOMBRE */}
                    <div className='form-group'>
                        <label>Nombre legal*</label>
                        <div className="input-wrapper">
                            <input 
                                type="text" 
                                name="nombre" 
                                value={formData.nombre} 
                                onChange={handleChange}  
                                placeholder='Solo letras'
                                className={`${errors.nombre ? "input-error" : ""} ${validaciones.nombre === true ? "input-valid" : ""}`}
                            />
                            {validaciones.nombre === true && <Check className="icon-check" size={20} />}
                            {validaciones.nombre === false && <X className="icon-error" size={20} />}
                        </div>
                        {errors.nombre && <p className="error-message">⚠ El nombre debe contener solo letras (mínimo 3)</p>}
                    </div>

                    {/* APELLIDO */}
                    <div className='form-group'>
                        <label>Apellido legal*</label>
                        <div className="input-wrapper">
                            <input 
                                type="text" 
                                name="apellido" 
                                value={formData.apellido} 
                                onChange={handleChange}  
                                placeholder='Solo letras'
                                className={`${errors.apellido ? "input-error" : ""} ${validaciones.apellido === true ? "input-valid" : ""}`}
                            />
                            {validaciones.apellido === true && <Check className="icon-check" size={20} />}
                            {validaciones.apellido === false && <X className="icon-error" size={20} />}
                        </div>
                        {errors.apellido && <p className="error-message">⚠ El apellido debe contener solo letras (mínimo 3)</p>}
                    </div>

                    {/* PAÍS CON BANDERAS */}
                    <div className='form-group'>
                        <label>País*</label>
                        <div className="input-wrapper">
                            <select 
                                name="pais" 
                                value={formData.pais} 
                                onChange={handleChange}
                                className={`${errors.pais ? "input-error" : ""} ${validaciones.pais === true ? "input-valid" : ""}`}
                            >
                                {paises.map(p => (
                                    <option key={p.codigo} value={p.nombre}>
                                        {p.bandera} {p.nombre}
                                    </option>
                                ))}
                            </select>
                            {validaciones.pais === true && <Check className="icon-check-select" size={20} />}
                        </div>
                        {errors.pais && <p className="error-message">⚠ El país es obligatorio</p>}
                    </div>

                    {/* FECHA DE NACIMIENTO */}
                    <div className='form-group'>
                        <label>Fecha de nacimiento*</label>
                        <div className="input-wrapper">
                            <input 
                                type="date" 
                                name="fechaNacimiento" 
                                value={formData.fechaNacimiento} 
                                onChange={handleChange}
                                placeholder="dd/mm/aaaa"
                                className={`${errors.fechaNacimiento ? "input-error" : ""} ${validaciones.fechaNacimiento === true ? "input-valid" : ""}`}
                            />
                            {validaciones.fechaNacimiento === true && <Check className="icon-check" size={20} />}
                        </div>
                        {errors.fechaNacimiento && <p className="error-message">⚠ La fecha de nacimiento es obligatoria</p>}
                    </div>

                    {/* CONTRASEÑA */}
                    <div className='form-group'>
                        <label>Contraseña*</label>
                        <div className="input-wrapper-password">
                            <input 
                                type={mostrarPassword ? "text" : "password"} 
                                name="contraseña" 
                                value={formData.contraseña} 
                                onChange={handleChange}  
                                placeholder='8 caracteres, 1 mayúscula, 1 minúscula, 1 número'
                                className={`${errors.contraseña ? "input-error" : ""} ${validaciones.contraseña === true ? "input-valid" : ""}`}
                            />
                            <button
                                className="Boton-Password"
                                type="button"
                                aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                onClick={() => setMostrarPassword(!mostrarPassword)}
                            >
                                {mostrarPassword ? <Eye size={20}/> : <EyeClosed size={20}/>}
                            </button>
                        </div>
                        {errors.contraseña && <p className="error-message">⚠ 8 caracteres, 1 mayúscula, 1 minúscula, 1 número</p>}
                    </div>

                    {/* EMAIL */}
                    <div className='form-group'>
                        <label>Correo Electrónico*</label>
                        <div className="input-wrapper">
                            <input 
                                type="email" 
                                name="correo" 
                                value={formData.correo} 
                                onChange={handleChange} 
                                placeholder='ejemplo@correo.com'
                                className={`${errors.correo ? "input-error" : ""} ${validaciones.correo === true ? "input-valid" : ""}`}
                            />
                            {validaciones.correo === true && <Check className="icon-check" size={20} />}
                            {validaciones.correo === false && <X className="icon-error" size={20} />}
                        </div>
                        {errors.correo && <p className="error-message">⚠ Ingrese un correo electrónico válido</p>}
                    </div>

                    {/* TIPO DE USUARIO */}
                    <div className='form-group'>
                        <label>Tipo de Usuario*</label>
                        <div className="input-wrapper">
                            <select 
                                name="tipoUsuario" 
                                value={formData.tipoUsuario} 
                                onChange={handleChange}
                                className={`${errors.tipoUsuario ? "input-error" : ""} ${validaciones.tipoUsuario === true ? "input-valid" : ""}`}
                            >
                                <option value="">Seleccione</option>
                                <option value="adultoMayor">Adulto Mayor</option>
                                <option value="cuidador">Cuidador</option>
                                <option value="medico">Médico</option>
                            </select>
                            {validaciones.tipoUsuario === true && <Check className="icon-check-select" size={20} />}
                        </div>
                        {errors.tipoUsuario && <p className="error-message">⚠ Debe seleccionar un tipo de usuario</p>}
                    </div>

                    <button type="submit">Registrar</button>
                </form>

                <div className='login-link'>
                    <p>¿Ya tienes una cuenta?</p>
                    <button type="button" className='btn-login' onClick={() => navigate("/")}>Iniciar Sesión</button>
                </div>
            </div>
        </div>
    );
};

export default RegistroUsuario;