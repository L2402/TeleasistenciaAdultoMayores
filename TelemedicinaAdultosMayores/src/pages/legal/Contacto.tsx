import { useState } from "react";
import "../../styles/paginas-legales.css";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Mensaje enviado correctamente");
    setFormData({ nombre: "", email: "", mensaje: "" });
  };

  return (
    <div className="pagina-legal-container">
      <div className="pagina-legal-content">
        <h1 className="pagina-legal-titulo">Contacto</h1>

        <section className="seccion-legal">
          <h2>Información de Contacto</h2>
          <ul className="lista-contacto">
            <li>📞 Estados Unidos: +888 440 0808</li>
            <li>📞 Ecuador: +593 98 765 4321</li>
            <li>📞 España: +34 914 26 17 98</li>
            <li>📧 Email: soporte@teleasistencia.ec</li>
          </ul>
        </section>

        <section className="seccion-legal">
          <h2>Envíanos un Mensaje</h2>
          <form onSubmit={handleSubmit} className="formulario-contacto">
            <div className="form-group-contacto">
              <label>Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                required
              />
            </div>
            <div className="form-group-contacto">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group-contacto">
              <label>Mensaje</label>
              <textarea
                value={formData.mensaje}
                onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                rows={5}
                required
              />
            </div>
            <button type="submit" className="btn-enviar-contacto">
              Enviar Mensaje
            </button>
          </form>
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

export default Contacto;