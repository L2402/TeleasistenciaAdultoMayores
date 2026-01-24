import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Calendar, Heart, MessageSquare, HelpCircle, Search, Bell, Globe, Settings, User, LogOut, Eye, Clock, Pill, Stethoscope, BarChart3, Minus, Plus, Type, Sun, Moon, Palette, Volume2, ChevronDown, Check } from 'lucide-react';
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
  const [searchResults, setSearchResults] = useState<Array<{label:string,path:string}>>([]);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [shortcutToast, setShortcutToast] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);

  // Refs para los paneles
  const searchPanelRef = useRef<HTMLDivElement | null>(null);
  const notificationPanelRef = useRef<HTMLDivElement | null>(null);
  const languagePanelRef = useRef<HTMLDivElement | null>(null);
  const accessibilityPanelRef = useRef<HTMLDivElement | null>(null);
  const profilePanelRef = useRef<HTMLDivElement | null>(null);

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
    { icon: <Home size={24} />, label: t.inicio, path: '/home' },
    { icon: <Calendar size={24} />, label: t.citas, path: '/citas' },
    { icon: <Heart size={24} />, label: t.salud, path: '/monitoreo' },
    { icon: <MessageSquare size={24} />, label: t.mensajes, path: '/mensajes' },
    { icon: <HelpCircle size={24} />, label: t.ayuda, path: '/preguntas-frecuentes' }
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

  const userRol = localStorage.getItem('rol');

  const SEARCH_INDEX = [
    ...menuItems.map(m => ({ label: m.label, path: m.path })),
    ...(userRol === 'medico' ? [{ label: t.medicamentos, path: '/medicamentos' }] : []),
    { label: 'Incidencias', path: '/incidencias' },
    { label: 'Perfil', path: '/perfil' },
    { label: 'Citas', path: '/citas' }
  ];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && !e.shiftKey && !e.altKey) {
        const key = e.key.toLowerCase();
        if (key === 'm') {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('toggle-sidebar'));
          setShortcutToast('Menú (Ctrl+M)');
          setTimeout(() => setShortcutToast(''), 1500);
        }
        if (key === 'b') {
          e.preventDefault();
          setSearchOpen(true);
          setTimeout(() => searchInputRef.current?.focus(), 50);
          setShortcutToast('Buscar (Ctrl+B)');
          setTimeout(() => setShortcutToast(''), 1500);
        }
        if (key === 'c') {
          e.preventDefault();
          navigate('/perfil');
          setShortcutToast('Configuración (Ctrl+C)');
          setTimeout(() => setShortcutToast(''), 1500);
        }
        if (key === 'x') {
          e.preventDefault();
          navigate(-1);
          setShortcutToast('Retroceder (Ctrl+X)');
          setTimeout(() => setShortcutToast(''), 1500);
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return setSearchResults([]);
    const matches = SEARCH_INDEX.filter(s => s.label.toLowerCase().includes(q)).slice(0,6);
    setSearchResults(matches);
  }, [searchQuery]);

  useEffect(() => {
    const perfilRaw = localStorage.getItem('usuario_perfil');
    if (perfilRaw) {
      try {
        const perfil = JSON.parse(perfilRaw);
        setUserProfile(perfil);
      } catch (error) {
        console.error('Error parsing user profile:', error);
      }
    }
  }, []);

  useEffect(() => {
    const handleProfileChange = () => {
      const perfilRaw = localStorage.getItem('usuario_perfil');
      if (perfilRaw) {
        try {
          const perfil = JSON.parse(perfilRaw);
          setUserProfile(perfil);
        } catch (error) {
          console.error('Error parsing user profile:', error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
    };

    window.addEventListener('userProfileChanged', handleProfileChange);
    return () => {
      window.removeEventListener('userProfileChanged', handleProfileChange);
    };
  }, []);

  // Cerrar paneles al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchPanelRef.current && !searchPanelRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
      if (notificationPanelRef.current && !notificationPanelRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
      if (languagePanelRef.current && !languagePanelRef.current.contains(event.target as Node)) {
        setLanguageOpen(false);
      }
      if (accessibilityPanelRef.current && !accessibilityPanelRef.current.contains(event.target as Node)) {
        setAccessibilityOpen(false);
      }
      if (profilePanelRef.current && !profilePanelRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Buscando:', searchQuery);
      if (searchResults.length > 0) {
        navigate(searchResults[0].path);
        setSearchOpen(false);
        setSearchQuery('');
      } else {
        // Si no hay coincidencias, mostrar mensaje corto
        setShortcutToast('No se encontraron resultados');
        setTimeout(() => setShortcutToast(''), 1600);
      }
    }
  };

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('rol');
      localStorage.removeItem('usuario_perfil');
      setUserProfile(null);
      window.dispatchEvent(new Event('userProfileChanged'));
      navigate("/");
    }
  };

  return (
    <header className="app-header">
      <div className="header-container">
        {shortcutToast && <div className="shortcut-toast">{shortcutToast}</div>}
        {/* Logo y Título */}
        <div className="logo-section">
          <div className="logo-container">
            <img 
              src="/logo-telemedicina.png" 
              alt="Teleasistencia"
              className="logo-image"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
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
              <span className="menu-icon">{item.icon}</span>
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
              🔍
            </button>
            
            {searchOpen && (
              <div className="search-panel" ref={searchPanelRef} onMouseDown={e => e.stopPropagation()}>
                <form onSubmit={handleSearch}>
                  <div className="search-input-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder={t.buscarPlaceholder}
                      className="search-input"
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </div>
                </form>

                {/* Resultados dinámicos */}
                {searchResults.length > 0 ? (
                  <div className="search-results">
                    {searchResults.map((r, i) => (
                      <button key={i} className="result-item" onClick={() => { navigate(r.path); setSearchOpen(false); setSearchQuery(''); }}>
                        {r.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="search-suggestions">
                    <p className="suggestion-title">{t.busquedasSugeridas}</p>
                    <button className="suggestion-item" onClick={() => navigate('/perfil')}>
                      M {t.misMedicos}
                    </button>
                    <button className="suggestion-item" onClick={() => navigate('/monitoreo')}>
                      R {t.resultados}
                    </button>
                    <button className="suggestion-item" onClick={() => navigate('/perfil')}>
                      P {t.medicamentos}
                    </button>
                  </div>
                )}
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
              🔔
              <span className="notification-badge">3</span>
            </button>
            
            {notificationOpen && (
              <div className="notification-panel" ref={notificationPanelRef} onMouseDown={e => e.stopPropagation()}>
                <div className="panel-header">
                  <h3 className="panel-title">N {t.notificaciones}</h3>
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
                        {notif.tipo === 'cita' ? 'C' : notif.tipo === 'mensaje' ? 'M' : 'R'}
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
              🌐
            </button>
            
            {languageOpen && (
              <div className="language-panel" ref={languagePanelRef} onMouseDown={e => e.stopPropagation()}>
                <div className="panel-header">
                  <h3 className="panel-title">I {t.idioma}</h3>
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
              ♿
            </button>
            
            {accessibilityOpen && (
              <div className="accessibility-panel" ref={accessibilityPanelRef} onMouseDown={e => e.stopPropagation()}>
                <div className="panel-header">
                  <h3 className="panel-title">A {t.accesibilidad}</h3>
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

                  <div className="shortcuts-list" style={{ padding: '0.5rem 1rem' }}>
                    <p style={{ margin: 0, fontWeight: 700 }}>Atajos de teclado</p>
                    <ul style={{ margin: '0.4rem 0 0 1rem', padding: 0 }}>
                      <li>Ctrl + M — Menú</li>
                      <li>Ctrl + B — Buscar</li>
                      <li>Ctrl + C — Configuración</li>
                      <li>Ctrl + X — Retroceder</li>
                    </ul>
                  </div>
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
            ⚙️
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
              <span className="profile-name">{userProfile ? `${userProfile.nombre} ${userProfile.apellido}` : 'Usuario'}</span>
              <span className="emoji-icon-small">▼</span>
            </button>
            
            {profileOpen && (
              <div className="profile-panel" ref={profilePanelRef} onMouseDown={e => e.stopPropagation()}>
                <div className="profile-info">
                  <div className="profile-avatar-large">👤</div>
                  <h3 className="profile-info-name">{userProfile ? `${userProfile.nombre} ${userProfile.apellido}` : 'Usuario'}</h3>
                  <p className="profile-info-email">{userProfile?.correo || 'usuario@email.com'}</p>
                  <span className="profile-role">
                    {userProfile?.tipo_usuario === 'adultoMayor' ? 'Paciente' : 
                     userProfile?.tipo_usuario === 'cuidador' ? 'Cuidador' : 
                     userProfile?.tipo_usuario === 'medico' ? 'Médico' : 'Usuario'}
                  </span>
                  {userProfile?.fecha_nacimiento && (
                    <p className="profile-info-detail">Edad: {new Date().getFullYear() - new Date(userProfile.fecha_nacimiento).getFullYear()} años</p>
                  )}
                  {userProfile?.pais && (
                    <p className="profile-info-detail">País: {userProfile.pais}</p>
                  )}
                  {userProfile?.nombre_usuario && (
                    <p className="profile-info-detail">Usuario: {userProfile.nombre_usuario}</p>
                  )}
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