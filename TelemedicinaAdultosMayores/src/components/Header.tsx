import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css';

const Header = () => {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [searchQuery, setSearchQuery] = useState('');

  // Textos en diferentes idiomas
  const textos = {
    es: {
      buscar: 'Buscar',
      notificaciones: 'Notificaciones',
      idioma: 'Idioma',
      accesibilidad: 'Accesibilidad',
      configuracion: 'Configuración',
      inicio: 'Inicio',
      citas: 'Citas',
      salud: 'Salud',
      mensajes: 'Mensajes',
      ayuda: 'Ayuda',
      marcarLeidas: 'Marcar todas como leídas',
      verTodas: 'Ver todas las notificaciones',
      tamañoTexto: 'Tamaño',
      modoOscuro: 'Modo Oscuro',
      modoClaro: 'Modo Claro',
      altoContraste: 'Alto Contraste',
      lectorPantalla: 'Lector de Pantalla',
      miPerfil: 'Mi Perfil',
      cerrarSesion: 'Cerrar Sesión',
      buscarPlaceholder: 'Buscar en el sistema...',
      busquedasSugeridas: 'Búsquedas sugeridas:',
      misMedicos: 'Mis médicos',
      resultados: 'Resultados de análisis',
      medicamentos: 'Medicamentos recetados'
    },
    en: {
      buscar: 'Search',
      notificaciones: 'Notifications',
      idioma: 'Language',
      accesibilidad: 'Accessibility',
      configuracion: 'Settings',
      inicio: 'Home',
      citas: 'Appointments',
      salud: 'Health',
      mensajes: 'Messages',
      ayuda: 'Help',
      marcarLeidas: 'Mark all as read',
      verTodas: 'View all notifications',
      tamañoTexto: 'Size',
      modoOscuro: 'Dark Mode',
      modoClaro: 'Light Mode',
      altoContraste: 'High Contrast',
      lectorPantalla: 'Screen Reader',
      miPerfil: 'My Profile',
      cerrarSesion: 'Logout',
      buscarPlaceholder: 'Search in the system...',
      busquedasSugeridas: 'Suggested searches:',
      misMedicos: 'My doctors',
      resultados: 'Analysis results',
      medicamentos: 'Prescribed medications'
    },
    pt: {
      buscar: 'Pesquisar',
      notificaciones: 'Notificações',
      idioma: 'Idioma',
      accesibilidad: 'Acessibilidade',
      configuracion: 'Configurações',
      inicio: 'Início',
      citas: 'Consultas',
      salud: 'Saúde',
      mensajes: 'Mensagens',
      ayuda: 'Ajuda',
      marcarLeidas: 'Marcar todas como lidas',
      verTodas: 'Ver todas as notificações',
      tamañoTexto: 'Tamanho',
      modoOscuro: 'Modo Escuro',
      modoClaro: 'Modo Claro',
      altoContraste: 'Alto Contraste',
      lectorPantalla: 'Leitor de Tela',
      miPerfil: 'Meu Perfil',
      cerrarSesion: 'Sair',
      buscarPlaceholder: 'Pesquisar no sistema...',
      busquedasSugeridas: 'Pesquisas sugeridas:',
      misMedicos: 'Meus médicos',
      resultados: 'Resultados de análises',
      medicamentos: 'Medicamentos prescritos'
    },
    fr: {
      buscar: 'Rechercher',
      notificaciones: 'Notifications',
      idioma: 'Langue',
      accesibilidad: 'Accessibilité',
      configuracion: 'Paramètres',
      inicio: 'Accueil',
      citas: 'Rendez-vous',
      salud: 'Santé',
      mensajes: 'Messages',
      ayuda: 'Aide',
      marcarLeidas: 'Marquer tout comme lu',
      verTodas: 'Voir toutes les notifications',
      tamañoTexto: 'Taille',
      modoOscuro: 'Mode Sombre',
      modoClaro: 'Mode Clair',
      altoContraste: 'Contraste Élevé',
      lectorPantalla: 'Lecteur d\'Écran',
      miPerfil: 'Mon Profil',
      cerrarSesion: 'Déconnexion',
      buscarPlaceholder: 'Rechercher dans le système...',
      busquedasSugeridas: 'Recherches suggérées:',
      misMedicos: 'Mes médecins',
      resultados: 'Résultats d\'analyses',
      medicamentos: 'Médicaments prescrits'
    }
  };

  const t = textos[selectedLanguage as keyof typeof textos];

  const notificaciones = [
    { id: 1, tipo: 'cita', mensaje: 'Cita con Dra. María Gómez mañana 10:00 AM', fecha: 'Hace 2 horas' },
    { id: 2, tipo: 'mensaje', mensaje: 'Nuevo mensaje de tu médico', fecha: 'Hace 5 horas' },
    { id: 3, tipo: 'recordatorio', mensaje: 'Recordatorio: Tomar medicamento', fecha: 'Hace 1 día' }
  ];

  const menuItems = [
    { emoji: '🏠', label: t.inicio, path: '/home' },
    { emoji: '📅', label: t.citas, path: '/citas' },
    { emoji: '💓', label: t.salud, path: '/monitoreo' },
    { emoji: '💬', label: t.mensajes, path: '/mensajes' },
    { emoji: '❓', label: t.ayuda, path: '/preguntas-frecuentes' }
  ];

  const idiomas = [
    { codigo: 'es', nombre: 'Español', bandera: '🇪🇸' },
    { codigo: 'en', nombre: 'English', bandera: '🇺🇸' },
    { codigo: 'pt', nombre: 'Português', bandera: '🇧🇷' },
    { codigo: 'fr', nombre: 'Français', bandera: '🇫🇷' }
  ];

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [fontSize, darkMode, highContrast]);

  const handleLanguageChange = (codigo: string) => {
    setSelectedLanguage(codigo);
    setLanguageOpen(false);
    localStorage.setItem('language', codigo);
    console.log(`✅ Idioma cambiado a: ${codigo}`);
  };

  // Cargar idioma guardado
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  const handleFontSize = (action: 'increase' | 'decrease' | 'reset') => {
    if (action === 'increase' && fontSize < 150) {
      setFontSize(fontSize + 10);
    } else if (action === 'decrease' && fontSize > 80) {
      setFontSize(fontSize - 10);
    } else if (action === 'reset') {
      setFontSize(100);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Buscando:', searchQuery);
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('rol');
      navigate("/");
    }
  };

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Logo y Título */}
        <div className="logo-section">
          <div className="logo-container">
            <img 
              src="/logo-telemedicina.png" 
              alt="Teleasistencia"
              className="logo-image"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLElement).parentElement;
                if (parent) {
                  parent.innerHTML = '<span class="logo-emoji">👨‍⚕️👵</span>';
                }
              }}
            />
          </div>
          <div className="brand-info">
            <h1 className="brand-name">TELEASISTENCIA</h1>
            <p className="brand-tagline">Cuidado 24/7 · Siempre Contigo</p>
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="header-nav">
          {menuItems.map((item, index) => (
            <button 
              key={index}
              className="header-menu-button"
              onClick={() => navigate(item.path)}
            >
              <span className="menu-emoji">{item.emoji}</span>
              <span className="menu-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Acciones de Usuario */}
        <div className="header-actions">
          {/* Búsqueda */}
          <div className="action-container">
            <button 
              className="header-icon-button"
              onClick={() => setSearchOpen(!searchOpen)}
              title={t.buscar}
            >
              <span className="emoji-icon">🔍</span>
            </button>
            
            {searchOpen && (
              <div className="search-panel">
                <form onSubmit={handleSearch}>
                  <div className="search-input-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                      type="text"
                      placeholder={t.buscarPlaceholder}
                      className="search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </div>
                </form>
                <div className="search-suggestions">
                  <p className="suggestion-title">{t.busquedasSugeridas}</p>
                  <button className="suggestion-item" onClick={() => navigate('/perfil')}>
                    🏥 {t.misMedicos}
                  </button>
                  <button className="suggestion-item" onClick={() => navigate('/monitoreo')}>
                    📊 {t.resultados}
                  </button>
                  <button className="suggestion-item" onClick={() => navigate('/perfil')}>
                    💊 {t.medicamentos}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notificaciones */}
          <div className="action-container">
            <button 
              className="header-icon-button"
              onClick={() => setNotificationOpen(!notificationOpen)}
              title={t.notificaciones}
            >
              <span className="emoji-icon">🔔</span>
              <span className="notification-badge">3</span>
            </button>
            
            {notificationOpen && (
              <div className="notification-panel">
                <div className="panel-header">
                  <h3 className="panel-title">🔔 {t.notificaciones}</h3>
                  <button className="mark-all-read" onClick={() => setNotificationOpen(false)}>
                    {t.marcarLeidas}
                  </button>
                </div>
                <div className="notification-list">
                  {notificaciones.map(notif => (
                    <div 
                      key={notif.id} 
                      className="notification-item" 
                      onClick={() => {
                        navigate('/citas');
                        setNotificationOpen(false);
                      }}
                    >
                      <div className="notif-icon">
                        {notif.tipo === 'cita' ? '📅' : notif.tipo === 'mensaje' ? '💬' : '⏰'}
                      </div>
                      <div className="notif-content">
                        <p className="notif-message">{notif.mensaje}</p>
                        <span className="notif-time">{notif.fecha}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  className="view-all-btn" 
                  onClick={() => {
                    navigate('/citas');
                    setNotificationOpen(false);
                  }}
                >
                  {t.verTodas}
                </button>
              </div>
            )}
          </div>

          {/* Idiomas */}
          <div className="action-container">
            <button 
              className="header-icon-button"
              onClick={() => setLanguageOpen(!languageOpen)}
              title={t.idioma}
            >
              <span className="emoji-icon">🌍</span>
            </button>
            
            {languageOpen && (
              <div className="language-panel">
                <div className="panel-header">
                  <h3 className="panel-title">🌍 {t.idioma}</h3>
                </div>
                <div className="language-list">
                  {idiomas.map(idioma => (
                    <button 
                      key={idioma.codigo} 
                      className={`language-item ${selectedLanguage === idioma.codigo ? 'active' : ''}`}
                      onClick={() => handleLanguageChange(idioma.codigo)}
                    >
                      <span className="language-flag">{idioma.bandera}</span>
                      <span className="language-name">{idioma.nombre}</span>
                      {selectedLanguage === idioma.codigo && <span className="check-icon">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Accesibilidad */}
          <div className="action-container">
            <button 
              className="header-icon-button"
              onClick={() => setAccessibilityOpen(!accessibilityOpen)}
              title={t.accesibilidad}
            >
              <span className="emoji-icon">👁️</span>
            </button>
            
            {accessibilityOpen && (
              <div className="accessibility-panel">
                <div className="panel-header">
                  <h3 className="panel-title">♿ {t.accesibilidad}</h3>
                </div>
                <div className="accessibility-options">
                  <div className="accessibility-item">
                    <span className="emoji-icon">📏</span>
                    <span>{t.tamañoTexto}: {fontSize}%</span>
                    <div className="text-size-buttons">
                      <button 
                        className="size-btn" 
                        onClick={() => handleFontSize('decrease')}
                        title="Disminuir"
                      >
                        <span className="emoji-icon-small">🔽</span>
                      </button>
                      <button 
                        className="size-btn" 
                        onClick={() => handleFontSize('reset')}
                        title="Restablecer"
                      >
                        A
                      </button>
                      <button 
                        className="size-btn" 
                        onClick={() => handleFontSize('increase')}
                        title="Aumentar"
                      >
                        <span className="emoji-icon-small">🔼</span>
                      </button>
                    </div>
                  </div>
                  
                  <button className="accessibility-item" onClick={() => setDarkMode(!darkMode)}>
                    <span className="emoji-icon">{darkMode ? '☀️' : '🌙'}</span>
                    <span>{darkMode ? t.modoClaro : t.modoOscuro}</span>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={darkMode} 
                        onChange={() => setDarkMode(!darkMode)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </button>
                  
                  <button className="accessibility-item" onClick={() => setHighContrast(!highContrast)}>
                    <span className="emoji-icon">🎨</span>
                    <span>{t.altoContraste}</span>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={highContrast}
                        onChange={() => setHighContrast(!highContrast)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </button>
                  
                  <button className="accessibility-item" onClick={() => setScreenReader(!screenReader)}>
                    <span className="emoji-icon">🔊</span>
                    <span>{t.lectorPantalla}</span>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={screenReader}
                        onChange={() => setScreenReader(!screenReader)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Configuración */}
          <button 
            className="header-icon-button" 
            title={t.configuracion}
            onClick={() => navigate('/perfil')}
          >
            <span className="emoji-icon">⚙️</span>
          </button>

          {/* Perfil de Usuario */}
          <div className="action-container">
            <button 
              className="profile-button"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="profile-avatar">
                <span className="emoji-icon-small">👤</span>
              </div>
              <span className="profile-name">Carlos Pérez</span>
              <span className="emoji-icon-small">▼</span>
            </button>
            
            {profileOpen && (
              <div className="profile-panel">
                <div className="profile-info">
                  <div className="profile-avatar-large">👤</div>
                  <h3 className="profile-info-name">Carlos Pérez</h3>
                  <p className="profile-info-email">carlos.perez@email.com</p>
                  <span className="profile-role">Paciente</span>
                </div>
                <div className="profile-divider"></div>
                <button 
                  onClick={() => {
                    navigate('/perfil');
                    setProfileOpen(false);
                  }} 
                  className="profile-menu-item"
                >
                  <span className="emoji-icon-small">👤</span>
                  <span>{t.miPerfil}</span>
                </button>
                <button 
                  onClick={() => {
                    navigate('/perfil');
                    setProfileOpen(false);
                  }} 
                  className="profile-menu-item"
                >
                  <span className="emoji-icon-small">⚙️</span>
                  <span>{t.configuracion}</span>
                </button>
                <div className="profile-divider"></div>
                <button onClick={handleLogout} className="logout-button">
                  <span className="emoji-icon-small">🚪</span>
                  <span>{t.cerrarSesion}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;