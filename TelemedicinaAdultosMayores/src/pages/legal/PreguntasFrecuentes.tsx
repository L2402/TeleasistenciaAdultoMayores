import { useState } from "react";
import "../../styles/paginas-legales.css";

const PreguntasFrecuentes = () => {
  const [preguntaAbierta, setPreguntaAbierta] = useState<number | null>(null);

  const preguntas = [
    {
      pregunta: "¿Qué es Teleasistencia Adultos Mayores?",
      respuesta: "Es una plataforma de telemedicina para el cuidado de adultos mayores desde casa."
    },
    {
      pregunta: "¿Cómo agendo una cita?",
      respuesta: "Ve a 'Mis Citas' y haz clic en 'Agendar Nueva Cita'."
    },
    {
      pregunta: "¿Qué necesito para una videollamada?",
      respuesta: "Dispositivo con cámara, micrófono, internet estable y navegador actualizado."
    },
    {
      pregunta: "¿Mis datos están seguros?",
      respuesta: "Sí, usamos cifrado médico y cumplimos con todas las regulaciones de privacidad."
    }
  ];

  return (
    <div className="pagina-legal-container">
      <div className="pagina-legal-content">
        <h1 className="pagina-legal-titulo">Preguntas Frecuentes</h1>
        <p className="pagina-legal-fecha">Actualizado: Noviembre 2025</p>

        <div className="faq-lista">
          {preguntas.map((item, index) => (
            <div key={index} className="faq-item">
              <button 
                className={`faq-pregunta ${preguntaAbierta === index ? 'activa' : ''}`}
                onClick={() => setPreguntaAbierta(preguntaAbierta === index ? null : index)}
              >
                <span className="faq-numero">{index + 1}.</span>
                <span className="faq-texto">{item.pregunta}</span>
                <span className="faq-icono">{preguntaAbierta === index ? '−' : '+'}</span>
              </button>
              {preguntaAbierta === index && (
                <div className="faq-respuesta">
                  <p>{item.respuesta}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="footer-legal">
          <button onClick={() => window.history.back()} className="btn-volver">
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreguntasFrecuentes;