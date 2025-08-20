export type Language = 'en' | 'es' | 'ru' | 'fr';

export const LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸', nativeName: 'English' },
  es: { name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  ru: { name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
  fr: { name: 'French', flag: '🇫🇷', nativeName: 'Français' }
};

export const TRANSLATIONS = {
  en: {
    // Header
    title: 'Reputation Desk',
    subtitle: 'Brand & Personality Controversy Tracker',
    
    // Sidebar panels
    dossiers: 'Dossiers',
    pressByLanguage: 'Press by Language',
    investigationTools: 'Investigation Tools',
    
    // Dossier categories
    advertising: 'Advertising & Campaigns',
    finance: 'Finance & Donations',
    labor: 'Labor & Supply Chain',
    privacy: 'Privacy & Security',
    social: 'Social & Speech',
    
    // Language descriptions
    spanishPress: 'Spanish language press coverage',
    russianPress: 'Russian language press coverage',
    frenchPress: 'French language press coverage',
    
    // Tool descriptions
    multiSourceVerification: 'Multi-Source Verification',
    multiSourceDescription: 'Cross-reference at least two sources per event for credibility.',
    perspectiveAnalysis: 'Perspective Analysis',
    perspectiveDescription: 'Adjust scoring based on ideological alignment.',
    
    // Search interface
    searchLabel: 'Search a brand or person',
    searchPlaceholder: 'e.g. Brand A or Public Figure B',
    perspectiveLabel: 'Perspective: Liberal ⟷ Conservative',
    languageLabel: 'Search Language',
    
    // Results
    topResults: 'Top results (prioritizes 2+ sources)',
    searchingIn: 'Searching in',
    loading: 'Loading…',
    noResults: 'No results found.',
    errorLoading: 'Error loading results',
    
    // Score labels
    scandal: 'Scandal',
    lowRisk: 'Low Risk',
    highRisk: 'High Risk'
  },
  
  es: {
    // Header
    title: 'Escritorio de Reputación',
    subtitle: 'Rastreador de Controversias de Marca y Personalidad',
    
    // Sidebar panels
    dossiers: 'Dossiers',
    pressByLanguage: 'Prensa por Idioma',
    investigationTools: 'Herramientas de Investigación',
    
    // Dossier categories
    advertising: 'Publicidad y Campañas',
    finance: 'Finanzas y Donaciones',
    labor: 'Trabajo y Cadena de Suministro',
    privacy: 'Privacidad y Seguridad',
    social: 'Social y Discurso',
    
    // Language descriptions
    spanishPress: 'Cobertura de prensa en español',
    russianPress: 'Cobertura de prensa en ruso',
    frenchPress: 'Cobertura de prensa en francés',
    
    // Tool descriptions
    multiSourceVerification: 'Verificación Multi-Fuente',
    multiSourceDescription: 'Cruzar al menos dos fuentes por evento para credibilidad.',
    perspectiveAnalysis: 'Análisis de Perspectiva',
    perspectiveDescription: 'Ajustar puntuación basada en alineación ideológica.',
    
    // Search interface
    searchLabel: 'Buscar una marca o persona',
    searchPlaceholder: 'ej. Marca A o Figura Pública B',
    perspectiveLabel: 'Perspectiva: Liberal ⟷ Conservador',
    languageLabel: 'Idioma de Búsqueda',
    
    // Results
    topResults: 'Mejores resultados (prioriza 2+ fuentes)',
    searchingIn: 'Buscando en',
    loading: 'Cargando…',
    noResults: 'No se encontraron resultados.',
    errorLoading: 'Error al cargar resultados',
    
    // Score labels
    scandal: 'Escándalo',
    lowRisk: 'Riesgo Bajo',
    highRisk: 'Riesgo Alto'
  },
  
  ru: {
    // Header
    title: 'Стол Репутации',
    subtitle: 'Трекер Скандалов Брендов и Личностей',
    
    // Sidebar panels
    dossiers: 'Досье',
    pressByLanguage: 'Пресса по Языку',
    investigationTools: 'Инструменты Расследования',
    
    // Dossier categories
    advertising: 'Реклама и Кампании',
    finance: 'Финансы и Пожертвования',
    labor: 'Труд и Цепочка Поставок',
    privacy: 'Приватность и Безопасность',
    social: 'Социальное и Речь',
    
    // Language descriptions
    spanishPress: 'Испаноязычное пресс-покрытие',
    russianPress: 'Русскоязычное пресс-покрытие',
    frenchPress: 'Франкоязычное пресс-покрытие',
    
    // Tool descriptions
    multiSourceVerification: 'Многоисточниковая Проверка',
    multiSourceDescription: 'Перекрестная проверка минимум двух источников для достоверности.',
    perspectiveAnalysis: 'Анализ Перспективы',
    perspectiveDescription: 'Корректировка оценки на основе идеологического выравнивания.',
    
    // Search interface
    searchLabel: 'Поиск бренда или человека',
    searchPlaceholder: 'напр. Бренд А или Публичная Фигура Б',
    perspectiveLabel: 'Перспектива: Либерал ⟷ Консерватор',
    languageLabel: 'Язык Поиска',
    
    // Results
    topResults: 'Лучшие результаты (приоритет 2+ источников)',
    searchingIn: 'Поиск на',
    loading: 'Загрузка…',
    noResults: 'Результаты не найдены.',
    errorLoading: 'Ошибка загрузки результатов',
    
    // Score labels
    scandal: 'Скандал',
    lowRisk: 'Низкий Риск',
    highRisk: 'Высокий Риск'
  },
  
  fr: {
    // Header
    title: 'Bureau de Réputation',
    subtitle: 'Traqueur de Controverses de Marque et de Personnalité',
    
    // Sidebar panels
    dossiers: 'Dossiers',
    pressByLanguage: 'Presse par Langue',
    investigationTools: 'Outils d\'Investigation',
    
    // Dossier categories
    advertising: 'Publicité et Campagnes',
    finance: 'Finance et Dons',
    labor: 'Travail et Chaîne d\'Approvisionnement',
    privacy: 'Confidentialité et Sécurité',
    social: 'Social et Discours',
    
    // Language descriptions
    spanishPress: 'Couverture de presse en espagnol',
    russianPress: 'Couverture de presse en russe',
    frenchPress: 'Couverture de presse en français',
    
    // Tool descriptions
    multiSourceVerification: 'Vérification Multi-Sources',
    multiSourceDescription: 'Recouper au moins deux sources par événement pour la crédibilité.',
    perspectiveAnalysis: 'Analyse de Perspective',
    perspectiveDescription: 'Ajuster le score basé sur l\'alignement idéologique.',
    
    // Search interface
    searchLabel: 'Rechercher une marque ou une personne',
    searchPlaceholder: 'ex. Marque A ou Figure Publique B',
    perspectiveLabel: 'Perspective: Libéral ⟷ Conservateur',
    languageLabel: 'Langue de Recherche',
    
    // Results
    topResults: 'Meilleurs résultats (priorise 2+ sources)',
    searchingIn: 'Recherche en',
    loading: 'Chargement…',
    noResults: 'Aucun résultat trouvé.',
    errorLoading: 'Erreur de chargement des résultats',
    
    // Score labels
    scandal: 'Scandale',
    lowRisk: 'Risque Faible',
    highRisk: 'Risque Élevé'
  }
};

export function getTranslation(lang: Language, key: keyof typeof TRANSLATIONS.en): string {
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
}
