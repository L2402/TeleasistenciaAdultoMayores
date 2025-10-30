import { useState } from "react";
import "../../styles/perfil.css";

interface UsuarioInfo {
  nombre: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  direccion: string;
  tipoSangre: string;
  alergias: string;
  condicionesMedicas: string;
  medicamentos: string;
  contactoEmergencia: string;
  telefonoEmergencia: string;
}

const Perfil = () => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState<"personal" | "medica" | "seguridad">("personal");
  
  const [usuario, setUsuario] = useState<UsuarioInfo>({
    nombre: "Carlos Pérez",
    email: "carlos.perez@email.com",
    telefono: "+593 98 765 4321",
    fechaNacimiento: "1950-05-15",
    direccion: "Av. Principal 123, Quito, Ecuador",
    tipoSangre: "O+",
    alergias: "Penicilina, Polen",
    condicionesMedicas: "Hipertensión, Diabetes tipo 2",
    medicamentos: "Metformina 850mg (2 veces al día), Enalapril 10mg (1 vez al día)",
    contactoEmergencia: "María Pérez (Hija)",
    telefonoEmergencia: "+593 99 123 4567"
  });

  const [usuarioTemp, setUsuarioTemp] = useState<UsuarioInfo>(usuario);

  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const handleGuardar = () => {
    setUsuario(usuarioTemp);
    setModoEdicion(false);
    alert("Perfil actualizado correctamente");
  };

  const handleCancelar = () => {
    setUsuarioTemp(usuario);
    setModoEdicion(false);
  };

  const handleChange = (field: keyof UsuarioInfo, value: string) => {
    setUsuarioTemp({ ...usuarioTemp, [field]: value });
  };

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <div className="perfil-header-content">
          <div className="avatar-section">
            <div className="avatar-grande">👤</div>
            <button className="btn-cambiar-foto">📷 Cambiar foto</button>
          </div>
          <div className="info-basica">
            <h2>{usuario.nombre}</h2>
            <p className="edad">{calcularEdad(usuario.fechaNacimiento)} años</p>
            <p className="email">{usuario.email}</p>
            <div className="badges">
              <span className="badge badge-primary">Paciente</span>
              <span className="badge badge-success">Cuenta Verificada</span>
            </div>
          </div>
        </div>
        {!modoEdicion ? (
          <button className="btn-editar" onClick={() => setModoEdicion(true)}>
            ✏️ Editar Perfil
          </button>
        ) : (
          <div className="botones-edicion">
            <button className="btn-guardar" onClick={handleGuardar}>
              ✓ Guardar
            </button>
            <button className="btn-cancelar" onClick={handleCancelar}>
              ✕ Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Tabs de navegación */}
      <div className="perfil-tabs">
        <button
          className={seccionActiva === "personal" ? "tab active" : "tab"}
          onClick={() => setSeccionActiva("personal")}
        >
          👤 Información Personal
        </button>
        <button
          className={seccionActiva === "medica" ? "tab active" : "tab"}
          onClick={() => setSeccionActiva("medica")}
        >
          🏥 Información Médica
        </button>
        <button
          className={seccionActiva === "seguridad" ? "tab active" : "tab"}
          onClick={() => setSeccionActiva("seguridad")}
        >
          🔒 Seguridad
        </button>
      </div>

      {/* Contenido según la sección activa */}
      <div className="perfil-contenido">
        {seccionActiva === "personal" && (
          <div className="seccion-personal">
            <div className="info-card">
              <h3>Datos Personales</h3>
              <div className="info-grid">
                <div className="info-field">
                  <label>Nombre Completo</label>
                  {modoEdicion ? (
                    <input
                      type="text"
                      value={usuarioTemp.nombre}
                      onChange={(e) => handleChange("nombre", e.target.value)}
                    />
                  ) : (
                    <p>{usuario.nombre}</p>
                  )}
                </div>

                <div className="info-field">
                  <label>Correo Electrónico</label>
                  {modoEdicion ? (
                    <input
                      type="email"
                      value={usuarioTemp.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  ) : (
                    <p>{usuario.email}</p>
                  )}
                </div>

                <div className="info-field">
                  <label>Teléfono</label>
                  {modoEdicion ? (
                    <input
                      type="tel"
                      value={usuarioTemp.telefono}
                      onChange={(e) => handleChange("telefono", e.target.value)}
                    />
                  ) : (
                    <p>{usuario.telefono}</p>
                  )}
                </div>

                <div className="info-field">
                  <label>Fecha de Nacimiento</label>
                  {modoEdicion ? (
                    <input
                      type="date"
                      value={usuarioTemp.fechaNacimiento}
                      onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
                    />
                  ) : (
                    <p>{new Date(usuario.fechaNacimiento).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  )}
                </div>

                <div className="info-field full-width">
                  <label>Dirección</label>
                  {modoEdicion ? (
                    <input
                      type="text"
                      value={usuarioTemp.direccion}
                      onChange={(e) => handleChange("direccion", e.target.value)}
                    />
                  ) : (
                    <p>{usuario.direccion}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>Contacto de Emergencia</h3>
              <div className="info-grid">
                <div className="info-field">
                  <label>Nombre del Contacto</label>
                  {modoEdicion ? (
                    <input
                      type="text"
                      value={usuarioTemp.contactoEmergencia}
                      onChange={(e) => handleChange("contactoEmergencia", e.target.value)}
                    />
                  ) : (
                    <p>{usuario.contactoEmergencia}</p>
                  )}
                </div>

                <div className="info-field">
                  <label>Teléfono de Emergencia</label>
                  {modoEdicion ? (
                    <input
                      type="tel"
                      value={usuarioTemp.telefonoEmergencia}
                      onChange={(e) => handleChange("telefonoEmergencia", e.target.value)}
                    />
                  ) : (
                    <p>{usuario.telefonoEmergencia}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {seccionActiva === "medica" && (
          <div className="seccion-medica">
            <div className="info-card">
              <h3>Información Médica</h3>
              <div className="info-grid">
                <div className="info-field">
                  <label>Tipo de Sangre</label>
                  {modoEdicion ? (
                    <select
                      value={usuarioTemp.tipoSangre}
                      onChange={(e) => handleChange("tipoSangre", e.target.value)}
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    <p className="tipo-sangre">{usuario.tipoSangre}</p>
                  )}
                </div>

                <div className="info-field full-width">
                  <label>Alergias</label>
                  {modoEdicion ? (
                    <textarea
                      value={usuarioTemp.alergias}
                      onChange={(e) => handleChange("alergias", e.target.value)}
                      rows={2}
                    />
                  ) : (
                    <p>{usuario.alergias || "Ninguna"}</p>
                  )}
                </div>

                <div className="info-field full-width">
                  <label>Condiciones Médicas</label>
                  {modoEdicion ? (
                    <textarea
                      value={usuarioTemp.condicionesMedicas}
                      onChange={(e) => handleChange("condicionesMedicas", e.target.value)}
                      rows={2}
                    />
                  ) : (
                    <p>{usuario.condicionesMedicas || "Ninguna"}</p>
                  )}
                </div>

                <div className="info-field full-width">
                  <label>Medicamentos Actuales</label>
                  {modoEdicion ? (
                    <textarea
                      value={usuarioTemp.medicamentos}
                      onChange={(e) => handleChange("medicamentos", e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <p>{usuario.medicamentos || "Ninguno"}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="alerta-medica">
              <div className="alerta-icon">⚠️</div>
              <div>
                <h4>Información Importante</h4>
                <p>Esta información será compartida con tu equipo médico en caso de emergencia. Mantén tus datos actualizados.</p>
              </div>
            </div>
          </div>
        )}

        {seccionActiva === "seguridad" && (
          <div className="seccion-seguridad">
            <div className="info-card">
              <h3>Cambiar Contraseña</h3>
              <div className="info-grid">
                <div className="info-field full-width">
                  <label>Contraseña Actual</label>
                  <input type="password" placeholder="Ingresa tu contraseña actual" />
                </div>

                <div className="info-field full-width">
                  <label>Nueva Contraseña</label>
                  <input type="password" placeholder="Ingresa tu nueva contraseña" />
                </div>

                <div className="info-field full-width">
                  <label>Confirmar Nueva Contraseña</label>
                  <input type="password" placeholder="Confirma tu nueva contraseña" />
                </div>
              </div>
              <button className="btn-cambiar-password">Cambiar Contraseña</button>
            </div>

            <div className="info-card">
              <h3>Autenticación de Dos Factores</h3>
              <div className="opcion-seguridad">
                <div>
                  <h4>Activar 2FA</h4>
                  <p>Añade una capa extra de seguridad a tu cuenta</p>
                </div>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="info-card">
              <h3>Preferencias de Notificaciones</h3>
              <div className="opcion-seguridad">
                <div>
                  <h4>Notificaciones por Email</h4>
                  <p>Recibe actualizaciones por correo electrónico</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="opcion-seguridad">
                <div>
                  <h4>Notificaciones Push</h4>
                  <p>Recibe notificaciones en tiempo real</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="opcion-seguridad">
                <div>
                  <h4>Recordatorios de Medicamentos</h4>
                  <p>Alertas para tomar tus medicamentos</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="zona-peligro">
              <h3>Zona de Peligro</h3>
              <p>Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten cuidado.</p>
              <button className="btn-eliminar-cuenta">Eliminar Cuenta</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Perfil;