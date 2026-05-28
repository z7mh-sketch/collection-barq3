/**
 * بيانات الموقع — هذا الملف هو الوحيد اللي تحتاج تعدله لما تضيف ليدر جديد
 * أو تغيّر رابط أو تحدّث معلومات تواصل.
 * لإضافة ترجمة انجليزية لأي حقل أضف نفس الاسم مع _en (مثال: name_en)
 */

// ===================== الليدرز =====================
const leaders = [

  // ── السوبر فايزر ──────────────────────────────────────────
  {
    id: "sv-alruways",
    name: "عايض شاري الرويس",        name_en: "Ayidh Shari Alruways",
    title: "سوبر فايزر",             title_en: "Supervisor",
    department: "خدمة العملاء",      department_en: "Customer Service",
    photo: null,
    contacts: { email: "", phone: "", teams: "" },
    escalationLinks: [],
    reportsTo: null
  },
  {
    id: "sv-almuqati",
    name: "منصور علیان المقاطي",     name_en: "Mansour Olayan Almuqati",
    title: "سوبر فايزر",             title_en: "Supervisor",
    department: "خدمة العملاء",      department_en: "Customer Service",
    photo: null,
    contacts: { email: "", phone: "", teams: "" },
    escalationLinks: [],
    reportsTo: null
  },

  // ── Team Leaders ──────────────────────────────────────────
  {
    id: "tl-afsurayyi",
    name: "العنود فهد السريع",        name_en: "Alanoud Fahad Surayyi",
    title: "قائد فريق",              title_en: "Team Leader",
    department: "خدمة العملاء",      department_en: "Customer Service",
    photo: null,
    contacts: {
      email: "Afsurayyi.c@barq.com",
      phone: "",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=Afsurayyi.c@barq.com"
    },
    escalationLinks: [],
    reportsTo: null
  },
  {
    id: "tl-smalhleel",
    name: "شيكة ملفي الهليل",        name_en: "Shikah Melfy Alhileel",
    title: "قائد فريق",              title_en: "Team Leader",
    department: "خدمة العملاء",      department_en: "Customer Service",
    photo: null,
    contacts: {
      email: "smalhleel.c@barq.com",
      phone: "",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=smalhleel.c@barq.com"
    },
    escalationLinks: [],
    reportsTo: null
  },
  {
    id: "tl-maalajmi",
    name: "منيرة عبدالله العجمي",    name_en: "Munirah Abdullah Alajmi",
    title: "قائد فريق",              title_en: "Team Leader",
    department: "خدمة العملاء",      department_en: "Customer Service",
    photo: null,
    contacts: {
      email: "maalajmi.c@barq.com",
      phone: "",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=maalajmi.c@barq.com"
    },
    escalationLinks: [],
    reportsTo: null
  },
  {
    id: "tl-imabahussain",
    name: "ابتهال منصور أبا حسين",   name_en: "Ibtehal Mansour Abahussain",
    title: "قائد فريق",              title_en: "Team Leader",
    department: "خدمة العملاء",      department_en: "Customer Service",
    photo: null,
    contacts: {
      email: "imabahussain.c@barq.com",
      phone: "",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=imabahussain.c@barq.com"
    },
    escalationLinks: [],
    reportsTo: null
  },
  {
    id: "tl-wahazazi",
    name: "وجدان أحمد الحازمي",      name_en: "Wejdan Ahmed Hazazi",
    title: "قائد فريق",              title_en: "Team Leader",
    department: "خدمة العملاء",      department_en: "Customer Service",
    photo: null,
    contacts: {
      email: "wahazazi.c@barq.com",
      phone: "",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=wahazazi.c@barq.com"
    },
    escalationLinks: [],
    reportsTo: null
  },
  {
    id: "tl-fabintamim",
    name: "فهد عبدالله تميم",        name_en: "Fahad Abdullah Tamim",
    title: "قائد فريق",              title_en: "Team Leader",
    department: "خدمة العملاء",      department_en: "Customer Service",
    photo: null,
    contacts: {
      email: "fabintamim.c@barq.com",
      phone: "",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=fabintamim.c@barq.com"
    },
    escalationLinks: [],
    reportsTo: null
  },
  {
    id: "tl-mgalotaibi",
    name: "محمد غلاب العتيبي",       name_en: "Mohammed Ghallab Alotaibi",
    title: "قائد فريق",              title_en: "Team Leader",
    department: "خدمة العملاء",      department_en: "Customer Service",
    photo: null,
    contacts: {
      email: "Mgalotaibi.c@barq.com",
      phone: "",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=Mgalotaibi.c@barq.com"
    },
    escalationLinks: [],
    reportsTo: null
  },
  {
    id: "tl-amrayyani",
    name: "عاصم محمد الريان",        name_en: "Asim Mohammed Rayyani",
    title: "قائد فريق",              title_en: "Team Leader",
    department: "خدمة العملاء",      department_en: "Customer Service",
    photo: null,
    contacts: {
      email: "amrayyani.c@barq.com",
      phone: "",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=amrayyani.c@barq.com"
    },
    escalationLinks: [],
    reportsTo: null
  },
  {
    id: "tl-nfalmutairi",
    name: "نواف فالح المطيري",       name_en: "Nawaf Faleh AlMutairi",
    title: "قائد فريق",              title_en: "Team Leader",
    department: "خدمة العملاء",      department_en: "Customer Service",
    photo: null,
    contacts: {
      email: "nfalmutairi.c@barq.com",
      phone: "",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=nfalmutairi.c@barq.com"
    },
    escalationLinks: [],
    reportsTo: null
  },
  {
    id: "tl-falmeshari",
    name: "فيصل فهد المشاري",        name_en: "Faisal Fahied Almeshari",
    title: "قائد فريق",              title_en: "Team Leader",
    department: "خدمة العملاء",      department_en: "Customer Service",
    photo: null,
    contacts: {
      email: "falmeshari.c@barq.com",
      phone: "",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=falmeshari.c@barq.com"
    },
    escalationLinks: [],
    reportsTo: null
  },
  {
    id: "tl-salghamdi",
    name: "سعود خالد الغامدي",       name_en: "Saud Khalid Alghamdi",
    title: "قائد فريق",              title_en: "Team Leader",
    department: "خدمة العملاء",      department_en: "Customer Service",
    photo: null,
    contacts: {
      email: "salghamdi.c@barq.com",
      phone: "",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=salghamdi.c@barq.com"
    },
    escalationLinks: [],
    reportsTo: null
  },
  {
    id: "tl-ihjabr",
    name: "عيسى حمد جابر",          name_en: "Issa Hamad Japr",
    title: "قائد فريق",              title_en: "Team Leader",
    department: "خدمة العملاء",      department_en: "Customer Service",
    photo: null,
    contacts: {
      email: "IHJapr.c@barq.com",
      phone: "",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=IHJapr.c@barq.com"
    },
    escalationLinks: [],
    reportsTo: null
  },
  {
    id: "tl-nbindawood",
    name: "نواف عبدالإله داوود",     name_en: "Nawaf Abdulelah Dawood",
    title: "قائد فريق",              title_en: "Team Leader",
    department: "خدمة العملاء",      department_en: "Customer Service",
    photo: null,
    contacts: {
      email: "nbindawood.c@barq.com",
      phone: "",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=nbindawood.c@barq.com"
    },
    escalationLinks: [],
    reportsTo: null
  },
  {
    id: "tl-akalshammari",
    name: "عبدالله خالد الشمري",     name_en: "Abdullah Khalid Alshammari",
    title: "قائد فريق",              title_en: "Team Leader",
    department: "خدمة العملاء",      department_en: "Customer Service",
    photo: null,
    contacts: {
      email: "Akalshammari.c@barq.com",
      phone: "",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=Akalshammari.c@barq.com"
    },
    escalationLinks: [],
    reportsTo: null
  },
  {
    id: "tl-hahumadi",
    name: "حسين عبدو حمادي",         name_en: "Hussain Abdu Humadi",
    title: "قائد فريق",              title_en: "Team Leader",
    department: "خدمة العملاء",      department_en: "Customer Service",
    photo: null,
    contacts: {
      email: "Hahumadi.c@barq.com",
      phone: "",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=Hahumadi.c@barq.com"
    },
    escalationLinks: [],
    reportsTo: null
  },
  {
    id: "tl-fmalmutairi",
    name: "فارس مجحز المطيري",       name_en: "Faris Majhaz Almutairi",
    title: "قائد فريق",              title_en: "Team Leader",
    department: "خدمة العملاء",      department_en: "Customer Service",
    photo: null,
    contacts: {
      email: "fmalmutairi.c@barq.com",
      phone: "",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=fmalmutairi.c@barq.com"
    },
    escalationLinks: [],
    reportsTo: null
  },
  {
    id: "tl-hrashid",
    name: "حسن محمد رشيد",           name_en: "Hassan Muhammad Rashid",
    title: "قائد فريق",              title_en: "Team Leader",
    department: "خدمة العملاء",      department_en: "Customer Service",
    photo: null,
    contacts: {
      email: "hrashid.c@barq.com",
      phone: "",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=hrashid.c@barq.com"
    },
    escalationLinks: [],
    reportsTo: null
  },
  {
    id: "tl-malanzi",
    name: "محمد سالم العنزي",        name_en: "Mohammed Salem Alanzi",
    title: "قائد فريق",              title_en: "Team Leader",
    department: "خدمة العملاء",      department_en: "Customer Service",
    photo: null,
    contacts: {
      email: "malanzi.c@barq.com",
      phone: "",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=malanzi.c@barq.com"
    },
    escalationLinks: [],
    reportsTo: null
  },
  {
    id: "tl-maalramli",
    name: "محمد عبدالله الرملي",     name_en: "Mohammed Abdullah Alramli",
    title: "قائد فريق",              title_en: "Team Leader",
    department: "خدمة العملاء",      department_en: "Customer Service",
    photo: null,
    contacts: {
      email: "maalramli.c@barq.com",
      phone: "",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=maalramli.c@barq.com"
    },
    escalationLinks: [],
    reportsTo: null
  },
  {
    id: "tl-akaljeraisy",
    name: "عبدالعزيز خالد الجريسي",  name_en: "Abdulaziz Khaled Aljeraisy",
    title: "قائد فريق",              title_en: "Team Leader",
    department: "خدمة العملاء",      department_en: "Customer Service",
    photo: null,
    contacts: {
      email: "AKAljeraisy.c@barq.com",
      phone: "",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=AKAljeraisy.c@barq.com"
    },
    escalationLinks: [],
    reportsTo: null
  },
  {
    id: "tl-naalrusayyis",
    name: "نواف عبدالعزيز الرسيس",   name_en: "Nawaf Abdulaziz Alrusayyis",
    title: "قائد فريق",              title_en: "Team Leader",
    department: "خدمة العملاء",      department_en: "Customer Service",
    photo: null,
    contacts: {
      email: "naalrusayyis.c@barq.com",
      phone: "",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=naalrusayyis.c@barq.com"
    },
    escalationLinks: [],
    reportsTo: null
  },
];

// ===================== الروابط السريعة =====================
const quickLinks = [
  { label: "Sprinklr",         url: "https://space-prod17.sprinklr.com/app/home",                              icon: "share-nodes", img: "assets/sprinklr.png" },
  { label: "ITSM",             url: "https://newbank2.atlassian.net/servicedesk/customer/portals",             icon: "headset",     img: "assets/atlassian.png", phone: "0547562927" },
  { label: "Microsoft Teams",  url: "msteams://",                                                              icon: "comments" },
  { label: "Outlook",          url: "mailto:",                                                                  icon: "envelope" },
  { label: "Intranet",         url: "https://intranet.prod.barraq.com.sa/workflow-status/?page=gravityflow-inbox&view=entry&id=23&lid=10902", icon: "globe" },
];

// ===================== روابط إضافية =====================
const additionalLinks = [
  { label: "ilovepdf",  label_en: "ilovepdf",  url: "https://www.ilovepdf.com/ar", icon: "file-pdf" },
];

// ===================== ملفات PDF =====================
const pdfLinks = [
  { label: "نموذج المخالفة",  label_en: "Violation Form",     url: "/pdfs/violation.pdf",     icon: "file-pdf", img: "assets/quickfix.png" },
  { label: "نموذج الاستقالة", label_en: "Resignation Form",   url: "/pdfs/resignation.pdf",   icon: "file-pdf", img: "assets/quickfix.png" },
  { label: "نموذج إجازة",     label_en: "Leave Request Form", url: "/pdfs/leave-request.pdf", icon: "file-pdf", img: "assets/quickfix.png" },
];

// ===================== روابط التصعيد السريعة =====================
const escalationQuickLinks = [
  { label: "CC Technical Ticket",  label_en: "CC Technical Ticket",  url: "https://globalfinancingsolutions-my.sharepoint.com/personal/hrashid_c_barq_com/_layouts/15/listforms.aspx?cid=NmYyNDNiNzgtZmY3NC00NTM2LWI2NWQtMjEzZjQyMjEzYTlk&ct=1778373203795&or=Teams-HL&nav=NDIyNjlmOTYtYjEyNC00NjJmLWFjZGQtMDQyZjE1Y2UyZDI1", icon: "ticket",
    children: [
      { label: "CC Technical Tracker", label_en: "CC Technical Tracker", url: "https://globalfinancingsolutions-my.sharepoint.com/personal/hrashid_c_barq_com/Lists/CC%20Technical%20Ticket%20Tracker/AllItems.aspx?isSPOFile=1&xsdata=MDV8MDJ8fGZjN2NmZDhmMTI3MTRmZTkyNmRmMDhkZThlNjNkMDI1fDEzODI2MDUyMzhhMTQwNDQ4NTZmZjZiNmMxZWRmMDgxfDB8MHw2MzkxMDQ3NTY0NzgxOTEzMjd8VW5rbm93bnxWR1ZoYlhOVFpXTjFjbWwwZVZObGNuWnBZMlY4ZXlKRFFTSTZJbFJsWVcxelgwRlVVRk5sY25acFkyVmZVMUJQVEU5R0lpd2lWaUk2SWpBdU1DNHdNREF3SWl3aVVDSTZJbGRwYmpNeUlpd2lRVTRpT2lKUGRHaGxjaUlzSWxkVUlqb3hNWDA5fDF8TDJOb1lYUnpMekU1T2pFNU5EWmlPVE0wTWpnMU5qUmlZakk0WW1VMU9XUmxPR1UyTnpReFpERTBRSFJvY21WaFpDNTJNaTl0WlhOellXZGxjeTh4TnpjME9EYzROelU1T1RRNHxiNmQ2MzNkMjc4NmE0YjYzMjZkZjA4ZGU4ZTYzZDAyNXw4MmJlNmFiYTc2YmU0ZjdiOWFkNzM3YjA0ODJmY2JiZA%3D%3D&sdata=ckllSW10VkxhVVFGNnJFWkcrZS84eWo4THJCNDQxTHVpa1pxMDRFRGF4WT0%3D&ovuser=13826052-38a1-4044-856f-f6b6c1edf081%2Csalghamdi.c%40barq.com&OR=Teams-HL&CT=1778385785321&clickparams=eyJBcHBOYW1lIjoiVGVhbXMtRGVza3RvcCIsIkFwcFZlcnNpb24iOiI0OS8yNjA0MDQwMTcyMyJ9&linkOpenTime=1778385785325", icon: "list-check" }
    ]
  },
  { label: "HR-FLOW",              url: "https://globalfinancingsolutions.sharepoint.com/sites/test/_layouts/15/listforms.aspx?cid=M2JjMjdiZWUtMjAxOC00OTgwLThmNTItOTcyZjY2YjAwZmI5&nav=M2Q3MGI2YjUtOWE3ZC00NTM2LTkyM2ItOTZmMTZiODFkMWFi&LOF=1", icon: "users",
    children: [
      { label: "سجل HR-FLOW", label_en: "HR-FLOW Tracker", url: "https://globalfinancingsolutions.sharepoint.com/sites/test/Lists/HRFLOW/AllItems.aspx?sortField=StartDate&isAscending=false&viewid=0dbe5ca5%2D4cbb%2D4502%2Dbf06%2D88f78ffbda51&ovuser=13826052%2D38a1%2D4044%2D856f%2Df6b6c1edf081%2Csalghamdi%2Ec%40barq%2Ecom&OR=Teams%2DHL&CT=1772016582838&clickparams=eyJBcHBOYW1lIjoiVGVhbXMtRGVza3RvcCIsIkFwcFZlcnNpb24iOiI0OS8yNjAyMDEwMTExNyIsIkhhc0ZlZGVyYXRlZFVzZXIiOmZhbHNlfQ%3D%3D", icon: "list-ul" }
    ]
  },
  { label: "تصعيد الموظفين", label_en: "Agent Escalation", url: "https://globalfinancingsolutions-my.sharepoint.com/personal/hrashid_c_barq_com/_layouts/15/listforms.aspx?cid=OTU0NTk5NWUtMjViNC00ZjliLWFjMTItMWJmZGEwYjVmZjgw&ct=1779145693110&or=Teams-HL&cid=92de48ed-0e77-455f-909a-edd476810ff4&nav=NGJkZjc4N2UtN2ExYi00ZDM3LTkwYzctNzQ5YzkxNGRmOWRl&LOF=1", icon: "headset",
    children: [
      { label: "TL Escalations", label_en: "TL Escalations", url: "https://globalfinancingsolutions-my.sharepoint.com/personal/hrashid_c_barq_com/Lists/CC%20Operations%20Escalations/AllItems.aspx?FilterField1=Team%5Fx0020%5FLeaderr%5Fx0020%5F%5Fx0020%5F&FilterValue1=fabintamim%2Ec%40barq%2Ecom&FilterType1=Choice&FilterField2=Is%5Fx0020%5Fit%5Fx0020%5Frequire%5Fx0020%5F&FilterValue2=Yes&FilterType2=Choice&sortField=Date%5Fx0020%5F%5Fx062a%5F%5Fx0627%5F%5Fx0631%5F&isAscending=true&viewid=b8abfc70%2Da74c%2D4142%2D93b8%2D3eaa90a66370&OR=Teams%2DHL&CT=1774881462955&FocusModeOff=1&isSPOFile=1&ovuser=13826052%2D38a1%2D4044%2D856f%2Df6b6c1edf081%2Csalghamdi%2Ec%40barq%2Ecom&CID=af868185%2D350f%2D4bc8%2D8273%2D5fe323836f15&clickparams=eyJBcHBOYW1lIjoiVGVhbXMtRGVza3RvcCIsIkFwcFZlcnNpb24iOiI0OS8yNjA0MTYxNzIxNSJ9&linkOpenTime=1779145701557", icon: "list-check" }
    ]
  },
  { label: "CC Agent Tracker", label_en: "CC Agent Tracker", url: "https://globalfinancingsolutions-my.sharepoint.com/personal/hrashid_c_barq_com/_layouts/15/listforms.aspx?cid=OTFmZWVlZDQtM2FmMy00N2I4LWI5MjYtNTgxODBmMmE1MTBi&nav=NGNkYWI5MmYtOWZjYy00MWQyLTkwNmEtODc3YTYxNjc2MzM3&xsdata=MDV8MDJ8fDE1OTZkMTcxMzA3NTQ0ZTdjZGNiMDhkZWI4MjNhNjQ1fDEzODI2MDUyMzhhMTQwNDQ4NTZmZjZiNmMxZWRmMDgxfDB8MHw2MzkxNTA2NjAzODYxNTczNTJ8VW5rbm93bnxWR1ZoYlhOVFpXTjFjbWwwZVZObGNuWnBZMlY4ZXlKRFFTSTZJbFJsWVcxelgwRlVVRk5sY25acFkyVmZVMUJQVEU5R0lpd2lWaUk2SWpBdU1DNHdNREF3SWl3aVVDSTZJbGRwYmpNeUlpd2lRVTRpT2lKUGRHaGxjaUlzSWxkVUlqb3hNWDA5fDF8TDJOb1lYUnpMekU1T2pWbE5UZGlOV0ZpTFRjeU1UVXROR1ppWWkwNU1tVmtMVE5oTm1Wa1ltWmxaREl3T1Y5bVpERm1Oemt5TVMwMFpqQmlMVFExTlRFdE9HTXhNUzB3TmpkbFl6RmhabUppWTJSQWRXNXhMbWRpYkM1emNHRmpaWE12YldWemMyRm5aWE12TVRjM09UUTJPVEl6TnpJd01nPT18YzBjMGU0MjRmMTViNGUzNTMxMTcwOGRlYjgyM2E2NDV8ZTk5NTZmNTViYzA3NGViNjk4NjZlNDVjNGU5NWIyOTE%3D&sdata=d2V5V0Rxc1pJWXVWMFRuZ1o5OUZSNnRoOFMwemMzRU1FUlpGekltVzlzdz0%3D&ovuser=13826052-38a1-4044-856f-f6b6c1edf081%2Csalghamdi.c%40barq.com&TeamsCID=8c7d0c33-fec5-4a69-9f26-ad8646c771ab&OR=Teams-HL&CT=1779469245270&clickparams=eyJBcHBOYW1lIjoiVGVhbXMtRGVza3RvcCIsIkFwcFZlcnNpb24iOiI0OS8yNjA0MzAxOTIxNiIsIkhhc0ZlZGVyYXRlZFVzZXIiOmZhbHNlfQ%3D%3D", icon: "chart-bar" },
];

// ===================== دليل التصعيد =====================
const escalationGuide = [
  {
    category: "مشاكل تقنية (أجهزة / برامج / شبكة)",
    category_en: "Technical Issues (Hardware / Software / Network)",
    icon: "laptop-code",
    steps: [
      "افتح تذكرة في نظام الدعم الفني واذكر تفاصيل المشكلة وصور إن وجدت",
      "إذا ما تم الرد خلال 4 ساعات عمل، تواصل مع ناصر القحطاني (مدير الدعم الفني)",
      "إذا المشكلة حرجة أو تؤثر على فريق كامل، صعّد لأحمد عبدالله (مدير عام تقنية المعلومات)",
      "للحالات الطارئة خارج أوقات الدوام، استخدم خط الطوارئ التقنية"
    ],
    steps_en: [
      "Open a ticket in the IT support system with full problem details and screenshots if available",
      "If no response within 4 working hours, contact Nasser Al-Qahtani (IT Support Manager)",
      "If the issue is critical or affects an entire team, escalate to Ahmed Abdullah (CTO)",
      "For emergencies outside office hours, use the technical emergency hotline"
    ],
    relatedLeaders: ["it-mgr-001", "cto-001"]
  },
  {
    category: "أمن معلومات (اختراق / تسريب / رسائل مشبوهة)",
    category_en: "Information Security (Breach / Leak / Suspicious Messages)",
    icon: "shield-halved",
    steps: [
      "لا تتعامل مع الرابط أو الملف المشبوه ولا تعيد توجيهه",
      "أبلغ فوراً عبر نموذج 'الإبلاغ عن حادث أمني'",
      "تواصل مباشرة مع سلطان الحربي (مدير أمن المعلومات) — هذي حالات لا تنتظر",
      "وثّق وقت الحادث وأي تفاصيل قبل اتخاذ أي إجراء"
    ],
    steps_en: [
      "Do not interact with the suspicious link or file and do not forward it",
      "Report immediately using the 'Report a Security Incident' form",
      "Contact Sultan Al-Harbi (Information Security Manager) directly — these cases cannot wait",
      "Document the time of the incident and any relevant details before taking further action"
    ],
    relatedLeaders: ["security-mgr-001"]
  },
  {
    category: "موارد بشرية (إجازات / رواتب / تعريفات)",
    category_en: "Human Resources (Leave / Payroll / Letters)",
    icon: "user-tie",
    steps: [
      "ادخل على بوابة الموظفين وقدّم الطلب من القنوات الرسمية",
      "إذا تأخر الرد أكثر من 3 أيام عمل، تواصل مع نورة العتيبي (مديرة شؤون الموظفين)",
      "للمواضيع الحساسة أو الشكاوى، صعّد لسارة المطيري (مدير عام الموارد البشرية)"
    ],
    steps_en: [
      "Log into the employee portal and submit your request through the official channels",
      "If no response within 3 working days, contact Noura Al-Otaibi (Employee Affairs Manager)",
      "For sensitive matters or complaints, escalate to Sara Al-Mutairi (Chief HR Officer)"
    ],
    relatedLeaders: ["hr-mgr-001", "chro-001"]
  },
  {
    category: "أمور مالية (صرف / فواتير / مصاريف)",
    category_en: "Financial Matters (Disbursements / Invoices / Expenses)",
    icon: "money-bill-wave",
    steps: [
      "قدّم الطلب عبر نظام الصرف والمصاريف مع المرفقات المطلوبة",
      "تواصل مع ماجد الدوسري (مدير المحاسبة) للاستفسارات",
      "للموافقات الكبيرة أو حالات التأخر، صعّد لخالد الزهراني (المدير المالي)"
    ],
    steps_en: [
      "Submit your request through the expense & disbursement system with all required attachments",
      "Contact Majid Al-Dosari (Accounting Manager) for any inquiries",
      "For large approvals or delayed cases, escalate to Khalid Al-Zahrani (CFO)"
    ],
    relatedLeaders: ["finance-mgr-001", "cfo-001"]
  },
  {
    category: "طلبات تطوير أو مشاريع جديدة",
    category_en: "Development Requests or New Projects",
    icon: "code",
    steps: [
      "حضّر وثيقة قصيرة فيها الهدف والمتطلبات والقيمة المتوقعة",
      "تواصل مع فيصل الشمري (مدير التطوير) لمناقشة الجدوى",
      "إذا الطلب يحتاج موارد كبيرة، يتم رفعه لأحمد عبدالله للاعتماد"
    ],
    steps_en: [
      "Prepare a brief document outlining the objective, requirements, and expected value",
      "Contact Faisal Al-Shammari (Development Manager) to discuss feasibility",
      "If the request requires significant resources, it will be escalated to Ahmed Abdullah for approval"
    ],
    relatedLeaders: ["dev-mgr-001", "cto-001"]
  },
  {
    category: "طلبات تسويقية (حملات / مواد / تصاميم)",
    category_en: "Marketing Requests (Campaigns / Materials / Designs)",
    icon: "bullhorn",
    steps: [
      "املأ نموذج 'طلب حملة تسويقية' بكل التفاصيل والموعد المطلوب",
      "تواصل مع ريم القرني (مديرة التسويق) لمتابعة الطلب"
    ],
    steps_en: [
      "Fill in the 'Marketing Campaign Request' form with all details and the required deadline",
      "Contact Reem Al-Qarni (Marketing Manager) to follow up on the request"
    ],
    relatedLeaders: ["marketing-mgr-001"]
  }
];
