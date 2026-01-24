import { useNavigate } from "react-router-dom";
import { Mail, Twitter, Linkedin } from "lucide-react";
import "../styles/footer.css";
import { useLang } from '../contexts/LanguageContext';

const Footer = () => {
  const navigate = useNavigate();
  const añoActual = new Date().getFullYear();
  const { t } = useLang();

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Columna 1: Productos/Servicios */}
        <div className="footer-section">
          <h4 className="footer-subtitle">{t.productos}</h4>
          <ul className="footer-links">
            <li>
              <button onClick={() => navigate("/citas")} className="footer-link">
                {"Consultas Médicas"}
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/monitoreo")} className="footer-link">
                {"Monitoreo de Salud"}
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/mensajes")} className="footer-link">
                {"Videollamadas"}
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/home")} className="footer-link">
                {"Asistencia 24/7"}
              </button>
            </li>
          </ul>
        </div>

        {/* Columna 2: Compañía */}
        <div className="footer-section">
          <h4 className="footer-subtitle">{t.compania}</h4>
          <ul className="footer-links">
            <li>
              <button onClick={() => navigate("/contacto")} className="footer-link">
                {t.contacto}
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/preguntas-frecuentes")} className="footer-link">
                {"Preguntas Frecuentes"}
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/home")} className="footer-link">
                {"Nuestro Equipo"}
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/home")} className="footer-link">
                {"Centro de Asistencia"}
              </button>
            </li>
          </ul>
        </div>

        {/* Columna 3: Contacto */}
        <div className="footer-section">
          <h4 className="footer-subtitle">{t.contacto}</h4>
          <ul className="footer-contact">
            <li className="contact-item">
              <span className="contact-label">Estados Unidos:</span>
              <span className="contact-value">+888 440 0808</span>
            </li>
            <li className="contact-item">
              <span className="contact-label">Ecuador:</span>
              <span className="contact-value">+593 98 765 4321</span>
            </li>
            <li className="contact-item">
              <span className="contact-label">España:</span>
              <span className="contact-value">+34 914 26 17 98</span>
            </li>
            <li className="contact-item">
              <Mail size={16} />
              <span>soporte@teleasistencia.ec</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Parte inferior: Redes sociales y Política de privacidad */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href="#" className="social-link" aria-label="YouTube">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>

          <button 
            onClick={() => navigate("/politica-privacidad")} 
            className="footer-privacy-link"
          >
            {t.politicaPrivacidad}
          </button>
        </div>
        
        <p className="footer-copyright">
          © {añoActual} Teleasistencia Adultos Mayores. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;