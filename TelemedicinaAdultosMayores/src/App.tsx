import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/login";
import RegistroUsuario from "./components/registroUsuario";
import Sidebar from "./components/sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Páginas de recuperación
import RecuperarUsuario from "./pages/RecuperarUsuario/RecuperarUsuario";
import RecuperarPassword from "./pages/RecuperarPassword/RecuperarPassword";

// páginas del adulto mayor
import HomeAdulto from "./pages/adultoMayor/HomeAdulto";
import Citas from "./pages/adultoMayor/Citas";
import Monitoreo from "./pages/adultoMayor/Monitoreo";
import Mensajes from "./pages/adultoMayor/Mensajes";
import Perfil from "./pages/adultoMayor/Perfil";

// páginas del médico
import PanelMedico from "./pages/medico/PanelMedico";
import Pacientes from "./pages/medico/Pacientes";
import Reportes from "./pages/medico/Reportes";

// páginas del cuidador
import InicioCuidador from "./pages/cuidador/InicioCuidador";
import Adultos from "./pages/cuidador/Adultos";

//  Páginas legales
import PoliticaPrivacidad from "./pages/legal/PoliticaPrivacidad";
import TerminosCondiciones from "./pages/legal/TerminosCondiciones";
import PreguntasFrecuentes from "./pages/legal/PreguntasFrecuentes";
import Contacto from "./pages/legal/Contacto";

const App: React.FC = () => {
  const rol = localStorage.getItem("rol") || "adultoMayor";

  // Layout base con header, sidebar y footer
  const Layout = () => (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header superior fijo */}
      <Header />
      
      <div style={{ display: "flex", flex: 1, paddingTop: "70px" }}>
        {/* Sidebar lateral */}
        <Sidebar rol={rol as "adultoMayor" | "medico" | "cuidador"} />
        
        {/* Contenido principal */}
        <div style={{ 
          flex: 1, 
          marginLeft: "80px",
          padding: "1rem", 
          display: "flex", 
          flexDirection: "column" 
        }}>
          <div style={{ flex: 1 }}>
            <Routes>
              {rol === "adultoMayor" && (
                <>
                  <Route path="/home" element={<HomeAdulto />} />
                  <Route path="/citas" element={<Citas />} />
                  <Route path="/monitoreo" element={<Monitoreo />} />
                  <Route path="/mensajes" element={<Mensajes />} />
                  <Route path="/perfil" element={<Perfil />} />
                </>
              )}

              {rol === "medico" && (
                <>
                  <Route path="/home" element={<PanelMedico />} />
                  <Route path="/usuarios" element={<Pacientes />} />
                  <Route path="/reportes" element={<Reportes />} />
                </>
              )}

              {rol === "cuidador" && (
                <>
                  <Route path="/home" element={<InicioCuidador />} />
                  <Route path="/usuarios" element={<Adultos />} />
                </>
              )}

              {/* Rutas de páginas legales */}
              <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
              <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
              <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />
              <Route path="/contacto" element={<Contacto />} />
            </Routes>
          </div>
          {/* Footer agregado */}
          <Footer />
        </div>
      </div>
    </div>
  );

  return (
    <Routes>
      {/*  Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/registro" element={<RegistroUsuario />} />
      <Route path="/recuperar-usuario" element={<RecuperarUsuario />} />
      <Route path="/recuperar-password" element={<RecuperarPassword />} />

      {/* Rutas privadas con header, sidebar y footer */}
      <Route path="/*" element={<Layout />} />
    </Routes>
  );
};

export default App;