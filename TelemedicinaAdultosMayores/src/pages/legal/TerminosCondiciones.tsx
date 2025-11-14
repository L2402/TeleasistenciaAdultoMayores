import "../../styles/paginas-legales.css";

const TerminosCondiciones = () => {
  return (
    <div className="pagina-legal-container">
      <div className="pagina-legal-content">
        <h1 className="pagina-legal-titulo">Términos y Condiciones</h1>
        <p className="pagina-legal-fecha">Última actualización: Noviembre 2025</p>

        <section className="seccion-legal">
          <h2>1. Aceptación de los Términos</h2>
          <p>
            Al usar la plataforma Teleasistencia Adultos Mayores, acepta estos términos.
          </p>
        </section>

        <section className="seccion-legal">
          <h2>2. Servicios Ofrecidos</h2>
          <ul>
            <li>Consultas médicas por videollamada</li>
            <li>Monitoreo de signos vitales</li>
            <li>Gestión de citas y recordatorios</li>
            <li>Comunicación segura con profesionales</li>
          </ul>
        </section>

        <section className="seccion-legal">
          <h2>3. Responsabilidades del Usuario</h2>
          <ul>
            <li>Proporcionar información médica completa</li>
            <li>Seguir las indicaciones médicas</li>
            <li>Mantener confidencialidad de su cuenta</li>
            <li>Respetar al personal médico</li>
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

export default TerminosCondiciones;