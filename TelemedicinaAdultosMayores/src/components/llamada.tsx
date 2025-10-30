import { useState, useEffect } from "react";
import "../styles/llamada.css";

interface LlamadaProps {
  contacto: {
    nombre: string;
    avatar: string;
    rol: string;
  };
  onFinalizar: () => void;
}

const Llamada = ({ contacto, onFinalizar }: LlamadaProps) => {
  const [tiempoLlamada, setTiempoLlamada] = useState(0);
  const [conectada, setConectada] = useState(false);
  const [audioMuteado, setAudioMuteado] = useState(false);

  useEffect(() => {
    // Simular conexión después de 2 segundos
    const conectarTimer = setTimeout(() => {
      setConectada(true);
    }, 2000);

    return () => clearTimeout(conectarTimer);
  }, []);

  useEffect(() => {
    if (!conectada) return;

    const timer = setInterval(() => {
      setTiempoLlamada(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [conectada]);

  const formatearTiempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleAudio = () => {
    setAudioMuteado(!audioMuteado);
  };

  return (
    <div className="llamada-overlay">
      <div className="llamada-container">
        <div className="llamada-avatar">
          {contacto.avatar}
        </div>
        
        <h2 className="llamada-nombre">{contacto.nombre}</h2>
        <p className="llamada-rol">{contacto.rol}</p>
        
        <div className="llamada-estado">
          {conectada ? (
            <>
              <div className="indicador-activo"></div>
              <p className="tiempo">{formatearTiempo(tiempoLlamada)}</p>
            </>
          ) : (
            <p className="conectando">Conectando...</p>
          )}
        </div>

        <div className="controles-llamada">
          <button 
            className={`control-btn-llamada ${audioMuteado ? 'muted' : ''}`}
            onClick={toggleAudio}
            title={audioMuteado ? "Activar micrófono" : "Silenciar micrófono"}
          >
            <span>{audioMuteado ? "🎤❌" : "🎤"}</span>
            <p>{audioMuteado ? "Silenciado" : "Micrófono"}</p>
          </button>

          <button 
            className="control-btn-llamada btn-colgar-llamada"
            onClick={onFinalizar}
            title="Finalizar llamada"
          >
            <span>📞</span>
            <p>Colgar</p>
          </button>

          <button 
            className="control-btn-llamada"
            title="Altavoz"
          >
            <span>🔊</span>
            <p>Altavoz</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Llamada;