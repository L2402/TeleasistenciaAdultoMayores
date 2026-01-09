import { useEffect, useState } from 'react';

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
    medicamentos: 'Medicamentos recetados',
    productos: 'Productos',
    compania: 'Compañía',
    contacto: 'Contacto',
    politicaPrivacidad: 'Política de Privacidad'
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
    medicamentos: 'Prescribed medications',
    productos: 'Products',
    compania: 'Company',
    contacto: 'Contact',
    politicaPrivacidad: 'Privacy Policy'
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
    medicamentos: 'Medicamentos prescritos',
    productos: 'Produtos',
    compania: 'Empresa',
    contacto: 'Contato',
    politicaPrivacidad: 'Política de Privacidade'
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
    lectorPantalla: "Lecteur d'\u00c9cran",
    miPerfil: 'Mon Profil',
    cerrarSesion: 'Déconnexion',
    buscarPlaceholder: 'Rechercher dans le système...',
    busquedasSugeridas: 'Recherches suggérées:',
    misMedicos: 'Mes médecins',
    resultados: 'Résultats d\'analyses',
    medicamentos: 'Médicaments prescrits',
    productos: 'Produits',
    compania: 'Société',
    contacto: 'Contact',
    politicaPrivacidad: 'Politique de Confidentialité'
  }
};

export function useLang() {
  const [lang, setLang] = useState<string>('es');

  useEffect(() => {
    const saved = localStorage.getItem('language');
    if (saved) setLang(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('language', lang);
  }, [lang]);

  const t = (textos as any)[lang] ?? textos.es;

  return { t, lang, setLang };
}
