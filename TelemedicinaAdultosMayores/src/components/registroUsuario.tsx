import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/registroUsuario.css";

const RegistroUsuario = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: '',
        contraseña: '',
        correo: '',
        tipoUsuario: ''
    });

    const [errors, setErrors] = useState({
        nombre: false,
        contraseña: false,
        correo: false,
        tipoUsuario: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        
        // Limpiar error del campo cuando el usuario escribe
        if (e.target.value) {
            setErrors({
                ...errors,
                [e.target.name]: false
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validar cada campo individualmente
        const newErrors = {
            nombre: !formData.nombre,
            contraseña: !formData.contraseña,
            correo: !formData.correo,
            tipoUsuario: !formData.tipoUsuario
        };

        setErrors(newErrors);

        // Si hay algún error, no continuar
        if (Object.values(newErrors).some(error => error)) {
            return;
        }

        console.log('Datos del registro: ', formData);
        alert(`Usuario registrado: ${formData.nombre} (${formData.tipoUsuario})`);
        
        // Limpiar formulario y errores
        setFormData({
            nombre: '',
            contraseña: '',
            correo: '',
            tipoUsuario: ''
        });
        setErrors({
            nombre: false,
            contraseña: false,
            correo: false,
            tipoUsuario: false
        });
    };

    return (
        <div className="registro-container">
            <h2 className="registro-title">Registro de Usuario</h2>
            <div className="registro-card">
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label>Nombre:</label>
                        <input 
                            type="text" 
                            name="nombre" 
                            value={formData.nombre} 
                            onChange={handleChange}  
                            placeholder='Ingrese su nombre'
                            className={errors.nombre ? "input-error" : ""}
                        />
                        {errors.nombre && <p className="error-message">El nombre es obligatorio</p>}
                    </div>
                    <div className='form-group'>
                        <label>Contraseña:</label>
                        <input 
                            type="password" 
                            name="contraseña" 
                            value={formData.contraseña} 
                            onChange={handleChange}  
                            placeholder='Ingrese su contraseña'
                            className={errors.contraseña ? "input-error" : ""}
                        />
                        {errors.contraseña && <p className="error-message">La contraseña es obligatoria</p>}
                    </div>
                    <div className='form-group'>
                        <label>Correo Electrónico:</label>
                        <input 
                            type="email" 
                            name="correo" 
                            value={formData.correo} 
                            onChange={handleChange} 
                            placeholder='Ingrese su correo electronico'
                            className={errors.correo ? "input-error" : ""}
                        />
                        {errors.correo && <p className="error-message">El correo electrónico es obligatorio</p>}
                    </div>
                    <div className='form-group'>
                        <label>Tipo de Usuario:</label>
                        <select 
                            name="tipoUsuario" 
                            value={formData.tipoUsuario} 
                            onChange={handleChange}
                            className={errors.tipoUsuario ? "input-error" : ""}
                        >
                            <option value="">Seleccione</option>
                            <option value="adultoMayor">Adulto Mayor</option>
                            <option value="cuidador">Cuidador</option>
                            <option value="medico">Médico</option>
                        </select>
                        {errors.tipoUsuario && <p className="error-message">Debe seleccionar un tipo de usuario</p>}
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