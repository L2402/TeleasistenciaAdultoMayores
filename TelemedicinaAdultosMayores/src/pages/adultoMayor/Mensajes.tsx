import { useState } from "react";
import "../../styles/mensajes.css";
import Videollamada from "../../components/Videollamada";
import Llamada from "../../components/llamada";

interface Mensaje {
  id: number;
  texto: string;
  enviado: boolean;
  fecha: string;
  hora: string;
  leido: boolean;
}

interface Conversacion {
  id: number;
  nombre: string;
  rol: "doctor" | "cuidador" | "enfermera";
  avatar: string;
  ultimoMensaje: string;
  fecha: string;
  noLeidos: number;
  activo: boolean;
}

const Mensajes = () => {
  const [conversaciones] = useState<Conversacion[]>([
    {
      id: 1,
      nombre: "Dra. María Gómez",
      rol: "doctor",
      avatar: "👩‍⚕️",
      ultimoMensaje: "Recuerda tomar tu medicamento a las 8 AM",
      fecha: "Hoy",
      noLeidos: 2,
      activo: false
    },
    {
      id: 2,
      nombre: "Carlos Ruiz",
      rol: "cuidador",
      avatar: "👨‍⚕️",
      ultimoMensaje: "¿Cómo te sientes hoy?",
      fecha: "Ayer",
      noLeidos: 0,
      activo: false
    },
    {
      id: 3,
      nombre: "Enf. Ana López",
      rol: "enfermera",
      avatar: "👩‍⚕️",
      ultimoMensaje: "Tu cita está confirmada para mañana",
      fecha: "21/10",
      noLeidos: 1,
      activo: false
    }
  ]);

  const [videollamadaActiva, setVideollamadaActiva] = useState(false); // ✅ Corregido nombre
  const [llamadaActiva, setLlamadaActiva] = useState(false);
  const [conversacionSeleccionada, setConversacionSeleccionada] = useState<number | null>(1);
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: 1,
      texto: "Hola, ¿cómo está su presión arterial hoy?",
      enviado: false,
      fecha: "2025-10-22",
      hora: "09:00 AM",
      leido: true
    },
    {
      id: 2,
      texto: "Buenos días doctora, la tomé hace una hora y está en 120/80",
      enviado: true,
      fecha: "2025-10-22",
      hora: "09:15 AM",
      leido: true
    },
    {
      id: 3,
      texto: "Perfecto, está en un rango muy bueno. ¿Ha tomado su medicamento?",
      enviado: false,
      fecha: "2025-10-22",
      hora: "09:20 AM",
      leido: true
    },
    {
      id: 4,
      texto: "Sí, lo tomé con el desayuno como me indicó",
      enviado: true,
      fecha: "2025-10-22",
      hora: "09:25 AM",
      leido: true
    },
    {
      id: 5,
      texto: "Excelente. Recuerda tomar tu medicamento a las 8 AM",
      enviado: false,
      fecha: "2025-10-22",
      hora: "10:30 AM",
      leido: false
    }
  ]);

  const [nuevoMensaje, setNuevoMensaje] = useState("");

  const conversacionActual = conversaciones.find(c => c.id === conversacionSeleccionada);

  const getRolColor = (rol: string) => {
    switch (rol) {
      case "doctor":
        return "#007bff";
      case "cuidador":
        return "#28a745";
      case "enfermera":
        return "#6f42c1";
      default:
        return "#6c757d";
    }
  };

  const getRolTexto = (rol: string) => {
    switch (rol) {
      case "doctor":
        return "Médico";
      case "cuidador":
        return "Cuidador";
      case "enfermera":
        return "Enfermera";
      default:
        return rol;
    }
  };

  const handleEnviarMensaje = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nuevoMensaje.trim()) return;

    const ahora = new Date();
    const mensaje: Mensaje = {
      id: Date.now(),
      texto: nuevoMensaje,
      enviado: true,
      fecha: ahora.toISOString().split('T')[0],
      hora: ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      leido: false
    };

    setMensajes([...mensajes, mensaje]);
    setNuevoMensaje("");
  };

  return (
    <div className="mensajes-container">
      <div className="mensajes-header">
        <h2>Mensajes</h2>
      </div>

      <div className="chat-layout">
        {/* Lista de conversaciones */}
        <div className="conversaciones-sidebar">
          <div className="sidebar-header">
            <h3>Conversaciones</h3>
          </div>
          
          <div className="conversaciones-lista">
            {conversaciones.map(conv => (
              <div
                key={conv.id}
                className={`conversacion-item ${conversacionSeleccionada === conv.id ? 'active' : ''}`}
                onClick={() => setConversacionSeleccionada(conv.id)}
              >
                <div className="conversacion-avatar">{conv.avatar}</div>
                <div className="conversacion-info">
                  <div className="conversacion-header">
                    <h4>{conv.nombre}</h4>
                    <span className="conversacion-fecha">{conv.fecha}</span>
                  </div>
                  <div className="conversacion-preview">
                    <span className="rol-badge" style={{ background: getRolColor(conv.rol) + '20', color: getRolColor(conv.rol) }}>
                      {getRolTexto(conv.rol)}
                    </span>
                    <p>{conv.ultimoMensaje}</p>
                  </div>
                </div>
                {conv.noLeidos > 0 && (
                  <div className="no-leidos-badge">{conv.noLeidos}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Área de chat */}
        <div className="chat-area">
          {conversacionSeleccionada ? (
            <>
              {/* Header del chat */}
              <div className="chat-header">
                <div className="chat-header-info">
                  <div className="chat-avatar">{conversacionActual?.avatar}</div>
                  <div>
                    <h3>{conversacionActual?.nombre}</h3>
                    <span 
                      className="rol-tag" 
                      style={{ color: getRolColor(conversacionActual?.rol || '') }}
                    >
                      {getRolTexto(conversacionActual?.rol || '')}
                    </span>
                  </div>
                </div>
                <div className="chat-actions">
                  <button 
                    className="btn-icon" 
                    title="Videollamada"
                    onClick={() => setVideollamadaActiva(true)} // ✅ Corregido
                  >
                    📹
                  </button>
                  <button 
                    className="btn-icon" 
                    title="Llamada"
                    onClick={() => setLlamadaActiva(true)} // ✅ Corregido "truee" a "true"
                  >
                    📞
                  </button>
                  <button className="btn-icon" title="Más opciones">⋮</button>
                </div>
              </div>

              {/* Mensajes */}
              <div className="mensajes-area">
                {mensajes.map(mensaje => (
                  <div
                    key={mensaje.id}
                    className={`mensaje ${mensaje.enviado ? 'enviado' : 'recibido'}`}
                  >
                    <div className="mensaje-contenido">
                      <p>{mensaje.texto}</p>
                      <span className="mensaje-hora">
                        {mensaje.hora}
                        {mensaje.enviado && (
                          <span className="mensaje-estado">
                            {mensaje.leido ? ' ✓✓' : ' ✓'}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input de mensaje */}
              <form className="mensaje-input-area" onSubmit={handleEnviarMensaje}>
                <button type="button" className="btn-adjuntar" title="Adjuntar archivo">
                  📎
                </button>
                <input
                  type="text"
                  placeholder="Escribe un mensaje..."
                  value={nuevoMensaje}
                  onChange={(e) => setNuevoMensaje(e.target.value)}
                />
                <button type="submit" className="btn-enviar" disabled={!nuevoMensaje.trim()}>
                  ➤
                </button>
              </form>
            </>
          ) : (
            <div className="sin-conversacion">
              <div className="sin-conversacion-icon">💬</div>
              <h3>Selecciona una conversación</h3>
              <p>Elige un contacto para comenzar a chatear</p>
            </div>
          )}
        </div>
      </div>

      {/* ✅ AÑADIR: Componentes de llamadas */}
      {videollamadaActiva && conversacionActual && (
        <Videollamada
          contacto={{
            nombre: conversacionActual.nombre,
            avatar: conversacionActual.avatar
          }}
          onFinalizar={() => setVideollamadaActiva(false)}
        />
      )}

      {llamadaActiva && conversacionActual && (
        <Llamada
          contacto={{
            nombre: conversacionActual.nombre,
            avatar: conversacionActual.avatar,
            rol: getRolTexto(conversacionActual.rol)
          }}
          onFinalizar={() => setLlamadaActiva(false)}
        />
      )}
    </div>
  );
};

export default Mensajes;