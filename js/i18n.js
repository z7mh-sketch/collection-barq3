const translations = {
  ar: {
    navQuickLinks: 'روابط سريعة',
    navLeaders: 'الليدرز',
    navOrgChart: 'الهيكل التنظيمي',
    navEscalation: 'دليل التصعيد',
    searchPlaceholder: 'شبيك لبيك برق بين يديك...',
    heroTitle: 'أهلاً بك في Collection Barq',
    heroDesc: 'المرجع الشامل للقادة في الشركة — يجمع كل ما تحتاجه في مكان واحد، من معلومات التواصل المباشر وروابط التصعيد، إلى الهيكل التنظيمي ودليل حل المشكلات خطوة بخطوة. لأن الوصول السريع للشخص الصح يصنع الفرق.',
    quickLinksLabel: 'روابط مهمة',
    quickLinksSubtitle: 'كل ما تحتاجه في مكان واحد',
    leadersLabel: 'الليدرز',
    orgChartLabel: 'الهيكل التنظيمي',
    escalationQuickLabel: 'روابط التصعيد',
    escalationQuickSubtitle: 'الروابط المباشرة لأهم قنوات التصعيد',
    pdfLabel: 'ملفات PDF',
    escalationLabel: 'دليل التصعيد بالخطوات',
    footerText: 'Collection Barq · مرجع داخلي للاستخدام ضمن الشركة فقط',
    emailBtn: 'بريد',
    phoneBtn: 'اتصال',
    teamsBtn: 'تيمز',
    escalationBtn: 'روابط التصعيد والتواصل',
    contactInfoLabel: 'معلومات التواصل',
    escalationLinksLabel: 'روابط التصعيد المرتبطة',
    reportsToLabel: 'يرفع تقاريره إلى',
    noLinksText: 'لا توجد روابط مسجلة لهذا الليدر بعد.',
    noResultsText: 'لا توجد نتائج مطابقة، جرّب كلمة أخرى.',
    allDepts: 'الكل',
    responsibleLabel: 'المسؤولون',
    teamsChat: 'محادثة على Teams',
    themeLabel: 'تبديل الوضع',
  },
  en: {
    navQuickLinks: 'Quick Links',
    navLeaders: 'Leaders',
    navOrgChart: 'Org Chart',
    navEscalation: 'Escalation',
    searchPlaceholder: 'Search by name, title or department...',
    heroTitle: 'Welcome to Collection Barq',
    heroDesc: 'Collection Barq is your all-in-one reference for company leaders — bringing everything you need into one place: direct contact info, escalation links, org chart, and a step-by-step problem-solving guide. Because reaching the right person at the right time makes all the difference.',
    quickLinksLabel: 'Important Links',
    quickLinksSubtitle: 'Everything you need in one place',
    leadersLabel: 'Leaders',
    orgChartLabel: 'Org Chart',
    escalationQuickLabel: 'Escalation Links',
    escalationQuickSubtitle: 'Direct links to key escalation channels',
    pdfLabel: 'PDF Files',
    escalationLabel: 'Step-by-Step Escalation Guide',
    footerText: 'Collection Barq · For internal use only',
    emailBtn: 'Email',
    phoneBtn: 'Call',
    teamsBtn: 'Teams',
    escalationBtn: 'Escalation & Contact Links',
    contactInfoLabel: 'Contact Info',
    escalationLinksLabel: 'Related Escalation Links',
    reportsToLabel: 'Reports To',
    noLinksText: 'No links registered for this leader yet.',
    noResultsText: 'No matching results. Try a different keyword.',
    allDepts: 'All',
    responsibleLabel: 'Responsible',
    teamsChat: 'Chat on Teams',
    themeLabel: 'Toggle theme',
  }
};

let currentLang = localStorage.getItem('lang') || 'ar';

function t(key) {
  return translations[currentLang]?.[key] ?? translations.ar[key] ?? key;
}

// Returns obj[field+'_en'] when in English, falls back to obj[field]
function td(obj, field) {
  if (currentLang === 'en' && obj[field + '_en'] !== undefined) return obj[field + '_en'];
  return obj[field] || '';
}

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);

  const html = document.documentElement;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  if (typeof renderQuickLinks === 'function') renderQuickLinks();
  if (typeof renderPdfLinks === 'function') renderPdfLinks();
  if (typeof renderEscalationQuickLinks === 'function') renderEscalationQuickLinks();
  if (typeof renderEscalationGuide === 'function') renderEscalationGuide();
  if (typeof renderOrgChart === 'function') renderOrgChart();
  if (typeof setHeroLang === 'function') setHeroLang(lang);
  const lm = document.getElementById('leadersModal');
  if (lm && !lm.classList.contains('hidden')) {
    if (typeof renderDepartmentFilters === 'function') renderDepartmentFilters();
    if (typeof renderLeaders === 'function') renderLeaders();
  }
}
