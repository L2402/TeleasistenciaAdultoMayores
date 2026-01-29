import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { obtenerContactos, obtenerMensajes, enviarMensaje, marcarComoLeidos } from '../services/mensajes';
import '../styles/mensajes.css';

const Mensajes: React.FC = () => {
  const [perfil, setPerfil] = useState<any>(null);
  const [contactos, setContactos] = useState<any[]>([]);
  const [contactoSeleccionado, setContactoSeleccionado] = useState<any>(null);
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const mensajesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cargarPerfil();
  }, []);

  useEffect(() => {
    if (perfil) {
      cargarContactos();
    }
  }, [perfil]);

  useEffect(() => {
    if (contactoSeleccionado) {
      cargarMensajes();
      marcarComoLeidos(perfil.id, contactoSeleccionado.id);
      suscribirseAMensajes();
    }

    return () => {
      supabase.channel('mensajes').unsubscribe();
    };
  }, [contactoSeleccionado]);

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  const cargarPerfil = () => {
    const perfilJson = localStorage.getItem('usuario_perfil');
    if (perfilJson) {
      setPerfil(JSON.parse(perfilJson));
    }
  };

  const cargarContactos = async () => {
    try {
      const data = await obtenerContactos(perfil.id, perfil.tipo_usuario);
      setContactos(data);
      
      // Auto-seleccionar primer contacto
      if (data.length > 0 && !contactoSeleccionado) {
        setContactoSeleccionado(data[0]);
      }
      setCargando(false);
    } catch (err) {
      console.error('Error cargando contactos:', err);
      setCargando(false);
    }
  };

  const cargarMensajes = async () => {
    if (!perfil || !contactoSeleccionado) return;

    try {
      const data = await obtenerMensajes(perfil.id, contactoSeleccionado.id);
      setMensajes(data);
    } catch (err) {
      console.error('Error cargando mensajes:', err);
    }
  };

  const suscribirseAMensajes = () => {
    const channel = supabase
      .channel('mensajes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'mensajes',
          filter: `destinatario_id=eq.${perfil.id}`
        },
        (payload: any) => {
          // Solo agregar si es del contacto actual
          if (payload.new.remitente_id === contactoSeleccionado.id) {
            setMensajes(prev => [...prev, payload.new]);
            marcarComoLeidos(perfil.id, contactoSeleccionado.id);
          }
        }
      )
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'mensajes',
          filter: `remitente_id=eq.${perfil.id}`
        },
        (payload: any) => {
          // Agregar mensaje propio si es al contacto actual
          if (payload.new.destinatario_id === contactoSeleccionado.id) {
            setMensajes(prev => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };

  const handleEnviarMensaje = async () => {
    if (!nuevoMensaje.trim() || !contactoSeleccionado) return;

    try {
      await enviarMensaje(perfil.id, contactoSeleccionado.id, nuevoMensaje);
      setNuevoMensaje('');
    } catch (err) {
      alert('Error al enviar mensaje');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensaje();
    }
  };

  const scrollToBottom = () => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getRolLabel = (tipo: string) => {
    const roles: any = {
      'medico': '👨‍⚕️ Doctor',
      'cuidador': '👤 Cuidador',
      'adultoMayor': '👴 Adulto Mayor'
    };
    return roles[tipo] || tipo;
  };

  if (cargando) {
    return (
      <div className="mensajes-container">
        <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando mensajes...</p>
      </div>
    );
  }

  if (contactos.length === 0) {
    return (
      <div className="mensajes-container">
        <h2 className="mensajes-title">Mensajes</h2>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>No tienes contactos disponibles para mensajear.</p>
          {perfil?.tipo_usuario !== 'adultoMayor' && (
            <p style={{ marginTop: '1rem', color: '#666' }}>
              {perfil?.tipo_usuario === 'medico' 
                ? 'Agrega pacientes para poder enviarles mensajes.'
                : 'Agrega adultos a cargo para poder enviarles mensajes.'}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mensajes-container">
      <h2 className="mensajes-title">Mensajes</h2>

      <div className="chat-wrapper">
        {/* Lista de contactos */}
        <div className="contactos-lista">
          <h3>Conversaciones</h3>
          {contactos.map((contacto) => (
            <div
              key={contacto.id}
              className={`contacto-item ${contactoSeleccionado?.id === contacto.id ? 'active' : ''}`}
              onClick={() => setContactoSeleccionado(contacto)}
            >
              <div className="contacto-avatar">
                {contacto.nombre?.charAt(0).toUpperCase()}
              </div>
              <div className="contacto-info">
                <div className="contacto-nombre">
                  {contacto.nombre} {contacto.apellido}
                </div>
                <div className="contacto-rol">
                  {getRolLabel(contacto.tipo_usuario)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Área de chat */}
        <div className="chat-area">
          {contactoSeleccionado ? (
            <>
              {/* Header del chat */}
              <div className="chat-header">
                <div className="contacto-avatar-grande">
                  {contactoSeleccionado.nombre?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3>{contactoSeleccionado.nombre} {contactoSeleccionado.apellido}</h3>
                  <p>{getRolLabel(contactoSeleccionado.tipo_usuario)}</p>
                </div>
              </div>

              {/* Mensajes */}
              <div className="mensajes-lista">
                {mensajes.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                    <p>No hay mensajes. ¡Inicia la conversación!</p>
                  </div>
                ) : (
                  <>
                    {mensajes.map((mensaje) => (
                      <div
                        key={mensaje.id}
                        className={`mensaje ${mensaje.remitente_id === perfil.id ? 'propio' : 'ajeno'}`}
                      >
                        <div className="mensaje-contenido">
                          {mensaje.contenido}
                        </div>
                        <div className="mensaje-hora">
                          {new Date(mensaje.created_at).toLocaleTimeString('es-CO', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    ))}
                    <div ref={mensajesEndRef} />
                  </>
                )}
              </div>

              {/* Input de mensaje */}
              <div className="chat-input">
                <textarea
                  value={nuevoMensaje}
                  onChange={(e) => setNuevoMensaje(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe un mensaje..."
                  rows={2}
                />
                <button onClick={handleEnviarMensaje} disabled={!nuevoMensaje.trim()}>
                  ➤ Enviar
                </button>
              </div>
            </>
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              color: '#999'
            }}>
              Selecciona un contacto para comenzar
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mensajes;
