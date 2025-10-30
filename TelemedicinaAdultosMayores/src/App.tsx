import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/login";
import RegistroUsuario from "./components/registroUsuario";
import Sidebar from "./components/sidebar";

// páginas del adulto mayor
import HomeAdulto from "./pages/adultoMayor/HomeAdulto";
import Citas from "./pages/adultoMayor/Citas";
import Monitoreo from "./pages/adultoMayor/Monitoreo";
import Mensajes from "./pages/adultoMayor/Mensajes";
import Perfil from "./pages/adultoMayor/Perfil";

// páginas del médico (ejemplo)
import PanelMedico from "./pages/medico/PanelMedico";
import Pacientes from "./pages/medico/Pacientes";
import Reportes from "./pages/medico/Reportes";

// páginas del cuidador (ejemplo)
import InicioCuidador from "./pages/cuidador/InicioCuidador";
import Adultos from "./pages/cuidador/Adultos";

const App: React.FC = () => {
  // 👇 esto será dinámico (por ahora puedes simularlo)
  const rol = localStorage.getItem("rol") || "adultoMayor";

  // --- layout base con sidebar dinámico ---
  const Layout = () => (
    <div style={{ display: "flex" }}>
      <Sidebar rol={rol as "adultoMayor" | "medico" | "cuidador"} />
      <div style={{ flex: 1, padding: "1rem" }}>
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
        </Routes>
      </div>
    </div>
  );

  return (
    <Routes>
      {/* rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/registro" element={<RegistroUsuario />} />

      {/* rutas privadas con sidebar */}
      <Route path="/*" element={<Layout />} />
    </Routes>
  );
};

export default App;