import Sidebar from "./sidebar";
import "../styles/home.css";

const Home = () => {
  const rolUsuario = "adultoMayor"; //se cambiara dinamicamente segun el rol

  return (
    <div className="home-container">
      <Sidebar rol={rolUsuario} />
      <div className="home-content">
        <h1>Bienvenido al panel de {rolUsuario}</h1>
        <p>Selecciona una opción del menú lateral.</p>
      </div>
    </div>
  );
};

export default Home;
