import { useState, useEffect, useRef } from "react";
import "../styles/videollamada.css";

interface VideollamadaProps {
  contacto: {
    nombre: string;
    avatar: string;
  };
  onFinalizar: () => void;
}

const Videollamada = ({ contacto, onFinalizar }: VideollamadaProps) => {
  const [tiempoLlamada, setTiempoLlamada] = useState(0);
  const [audioMuteado, setAudioMuteado] = useState(false);
  const [videoDesactivado, setVideoDesactivado] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Iniciar stream de video (cámara local)
    const iniciarVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);
        alert("No se pudo acceder a la cámara. Verifica los permisos.");
      }
    };

    iniciarVideo();

    // Timer de duración
    const timer = setInterval(() => {
      setTiempoLlamada(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      // Detener stream al desmontar
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const formatearTiempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleAudio = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setAudioMuteado(!audioMuteado);
    }
  };

  const toggleVideo = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setVideoDesactivado(!videoDesactivado);
    }
  };

  const finalizarLlamada = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    onFinalizar();
  };

  return (
    <div className="videollamada-overlay">
      <div className="videollamada-container">
        {/* Video remoto (simulado) */}
        <div className="video-remoto">
          <div className="avatar-remoto">{contacto.avatar}</div>
          <p className="nombre-contacto">{contacto.nombre}</p>
        </div>

        {/* Video local */}
        <div className="video-local">
          {videoDesactivado ? (
            <div className="video-desactivado">
              <span>📷</span>
              <p>Cámara desactivada</p>
            </div>
          ) : (
            <video ref={videoRef} autoPlay muted playsInline />
          )}
        </div>

        {/* Información de llamada */}
        <div className="info-llamada">
          <p className="estado-llamada">En videollamada</p>
          <p className="tiempo-llamada">{formatearTiempo(tiempoLlamada)}</p>
        </div>

        {/* Controles */}
        <div className="controles-videollamada">
          <button 
            className={`control-btn ${audioMuteado ? 'muted' : ''}`}
            onClick={toggleAudio}
            title={audioMuteado ? "Activar micrófono" : "Silenciar micrófono"}
          >
            {audioMuteado ? "🎤❌" : "🎤"}
          </button>

          <button 
            className="control-btn btn-colgar"
            onClick={finalizarLlamada}
            title="Finalizar llamada"
          >
            📞
          </button>

          <button 
            className={`control-btn ${videoDesactivado ? 'muted' : ''}`}
            onClick={toggleVideo}
            title={videoDesactivado ? "Activar cámara" : "Desactivar cámara"}
          >
            {videoDesactivado ? "📹❌" : "📹"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Videollamada;