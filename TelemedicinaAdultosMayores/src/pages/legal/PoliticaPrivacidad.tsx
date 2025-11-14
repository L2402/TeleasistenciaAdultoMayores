import "../../styles/paginas-legales.css";

const PoliticaPrivacidad = () => {
  return (
    <div className="pagina-legal-container">
      <div className="pagina-legal-content">
        <h1 className="pagina-legal-titulo">Política de Privacidad</h1>
        <p className="pagina-legal-fecha">Última actualización: Noviembre 2025</p>

        <section className="seccion-legal">
          <h2>1. Información que Recopilamos</h2>
          <p>
            En Teleasistencia Adultos Mayores, recopilamos información personal necesaria 
            para brindar nuestros servicios de atención médica a distancia:
          </p>
          <ul>
            <li><strong>Datos personales:</strong> Nombre, fecha de nacimiento, dirección, teléfono, correo electrónico</li>
            <li><strong>Datos médicos:</strong> Historial clínico, mediciones de salud, medicamentos, alergias</li>
            <li><strong>Datos de uso:</strong> Registros de acceso, interacciones con el sistema</li>
            <li><strong>Datos de comunicación:</strong> Mensajes con profesionales de salud, videollamadas</li>
          </ul>
        </section>

        <section className="seccion-legal">
          <h2>2. Uso de la Información</h2>
          <p>Utilizamos su información para:</p>
          <ul>
            <li>Proporcionar servicios de telemedicina y seguimiento de salud</li>
            <li>Coordinar citas médicas y comunicación con profesionales</li>
            <li>Monitorear su estado de salud y generar alertas cuando sea necesario</li>
            <li>Mejorar nuestros servicios y la experiencia del usuario</li>
            <li>Cumplir con requisitos legales y regulatorios del sector salud</li>
          </ul>
        </section>

        <section className="seccion-legal">
          <h2>3. Protección de Datos Médicos</h2>
          <p>
            Nos comprometemos a proteger su información médica confidencial mediante:
          </p>
          <ul>
            <li>Cifrado de datos en tránsito y en reposo</li>
            <li>Acceso restringido solo a personal autorizado</li>
            <li>Auditorías de seguridad regulares</li>
            <li>Cumplimiento con normativas de salud vigentes en Ecuador</li>
          </ul>
        </section>

        <section className="seccion-legal">
          <h2>4. Sus Derechos</h2>
          <p>Usted tiene derecho a:</p>
          <ul>
            <li>Acceder a su información personal y médica</li>
            <li>Corregir información inexacta</li>
            <li>Solicitar la eliminación de sus datos</li>
            <li>Revocar consentimientos otorgados</li>
            <li>Descargar sus datos en formato portátil</li>
          </ul>
        </section>

        <section className="seccion-legal contacto-legal">
          <h2>5. Contacto</h2>
          <p>Para consultas sobre privacidad, contáctenos en:</p>
          <ul className="lista-contacto">
            <li>📧 Email: privacidad@teleasistencia.ec</li>
            <li>📞 Teléfono: +593 98 765 4321</li>
            <li>📍 Dirección: Manta, Manabí, Ecuador</li>
          </ul>
        </section>

        <div className="footer-legal">
          <button onClick={() => window.history.back()} className="btn-volver">
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoliticaPrivacidad;