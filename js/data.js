/**
 * بيانات الموقع — هذا الملف هو الوحيد اللي تحتاج تعدله لما تضيف ليدر جديد
 * أو تغيّر رابط أو تحدّث معلومات تواصل.
 * لإضافة ترجمة انجليزية لأي حقل أضف نفس الاسم مع _en (مثال: name_en)
 */

// ===================== الليدرز =====================
const leaders = [
  {
    id: "ceo-001",
    name: "محمد السالم",          name_en: "Mohammed Al-Salem",
    title: "الرئيس التنفيذي",      title_en: "Chief Executive Officer",
    department: "الإدارة العليا",  department_en: "Executive Management",
    photo: null,
    contacts: {
      email: "ceo@company.com",
      phone: "+966500000001",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=ceo@company.com"
    },
    escalationLinks: [
      { label: "حجز اجتماع مع المكتب التنفيذي", label_en: "Book Executive Office Meeting", url: "https://example.com/exec-booking" }
    ],
    reportsTo: null
  },
  {
    id: "cto-001",
    name: "أحمد عبدالله",               name_en: "Ahmed Abdullah",
    title: "مدير عام تقنية المعلومات",   title_en: "Chief Technology Officer",
    department: "تقنية المعلومات",        department_en: "Information Technology",
    photo: null,
    contacts: {
      email: "ahmed.abdullah@company.com",
      phone: "+966500000002",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=ahmed.abdullah@company.com"
    },
    escalationLinks: [
      { label: "نظام التذاكر التقنية",   label_en: "Technical Ticketing System", url: "https://servicedesk.company.com" },
      { label: "طلب صلاحيات وصول",       label_en: "Request Access Permissions",  url: "https://access.company.com" },
      { label: "حالات الطوارئ التقنية",  label_en: "Technical Emergency Cases",   url: "https://oncall.company.com" }
    ],
    reportsTo: "ceo-001"
  },
  {
    id: "chro-001",
    name: "سارة المطيري",              name_en: "Sara Al-Mutairi",
    title: "مدير عام الموارد البشرية", title_en: "Chief HR Officer",
    department: "الموارد البشرية",     department_en: "Human Resources",
    photo: null,
    contacts: {
      email: "sara.almutairi@company.com",
      phone: "+966500000003",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=sara.almutairi@company.com"
    },
    escalationLinks: [
      { label: "بوابة الموظفين",          label_en: "Employee Portal",              url: "https://hr.company.com" },
      { label: "تقديم شكوى أو ملاحظة",   label_en: "Submit Complaint or Feedback", url: "https://hr.company.com/feedback" }
    ],
    reportsTo: "ceo-001"
  },
  {
    id: "cfo-001",
    name: "خالد الزهراني",  name_en: "Khalid Al-Zahrani",
    title: "المدير المالي",  title_en: "Chief Financial Officer",
    department: "المالية",   department_en: "Finance",
    photo: null,
    contacts: {
      email: "khalid.alzahrani@company.com",
      phone: "+966500000004",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=khalid.alzahrani@company.com"
    },
    escalationLinks: [
      { label: "طلبات الصرف والمصاريف", label_en: "Expense & Disbursement Requests", url: "https://finance.company.com/expenses" },
      { label: "نظام الفواتير",          label_en: "Invoice System",                   url: "https://finance.company.com/invoices" }
    ],
    reportsTo: "ceo-001"
  },
  {
    id: "it-mgr-001",
    name: "ناصر القحطاني",   name_en: "Nasser Al-Qahtani",
    title: "مدير الدعم الفني", title_en: "IT Support Manager",
    department: "تقنية المعلومات", department_en: "Information Technology",
    photo: null,
    contacts: {
      email: "nasser.alqahtani@company.com",
      phone: "+966500000005",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=nasser.alqahtani@company.com"
    },
    escalationLinks: [
      { label: "فتح تذكرة دعم",         label_en: "Open a Support Ticket",    url: "https://servicedesk.company.com/new" },
      { label: "حالة الخدمات الحالية",  label_en: "Current Services Status",  url: "https://status.company.com" }
    ],
    reportsTo: "cto-001"
  },
  {
    id: "dev-mgr-001",
    name: "فيصل الشمري",   name_en: "Faisal Al-Shammari",
    title: "مدير التطوير",  title_en: "Development Manager",
    department: "تقنية المعلومات", department_en: "Information Technology",
    photo: null,
    contacts: {
      email: "faisal.alshammari@company.com",
      phone: "+966500000006",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=faisal.alshammari@company.com"
    },
    escalationLinks: [
      { label: "نظام إدارة المشاريع", label_en: "Project Management System", url: "https://projects.company.com" },
      { label: "مستودعات الكود",       label_en: "Code Repositories",          url: "https://git.company.com" }
    ],
    reportsTo: "cto-001"
  },
  {
    id: "hr-mgr-001",
    name: "نورة العتيبي",          name_en: "Noura Al-Otaibi",
    title: "مديرة شؤون الموظفين",  title_en: "Employee Affairs Manager",
    department: "الموارد البشرية", department_en: "Human Resources",
    photo: null,
    contacts: {
      email: "noura.alotaibi@company.com",
      phone: "+966500000007",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=noura.alotaibi@company.com"
    },
    escalationLinks: [
      { label: "طلب إجازة",        label_en: "Request Leave",           url: "https://hr.company.com/leave" },
      { label: "شهادات وتعريفات",  label_en: "Certificates & Letters",  url: "https://hr.company.com/letters" }
    ],
    reportsTo: "chro-001"
  },
  {
    id: "train-mgr-001",
    name: "عبدالرحمن البلوي",          name_en: "Abdulrahman Al-Balawi",
    title: "مدير التدريب والتطوير",    title_en: "Training & Development Manager",
    department: "الموارد البشرية",     department_en: "Human Resources",
    photo: null,
    contacts: {
      email: "abdulrahman.albalawi@company.com",
      phone: "+966500000008",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=abdulrahman.albalawi@company.com"
    },
    escalationLinks: [
      { label: "كتالوج الدورات",          label_en: "Course Catalogue",              url: "https://learning.company.com" },
      { label: "خطة التطوير الفردية",     label_en: "Individual Development Plan",   url: "https://learning.company.com/idp" }
    ],
    reportsTo: "chro-001"
  },
  {
    id: "finance-mgr-001",
    name: "ماجد الدوسري",    name_en: "Majid Al-Dosari",
    title: "مدير المحاسبة",  title_en: "Accounting Manager",
    department: "المالية",   department_en: "Finance",
    photo: null,
    contacts: {
      email: "majid.aldosari@company.com",
      phone: "+966500000009",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=majid.aldosari@company.com"
    },
    escalationLinks: [
      { label: "كشوف الرواتب", label_en: "Payroll Statements", url: "https://finance.company.com/payroll" }
    ],
    reportsTo: "cfo-001"
  },
  {
    id: "ops-mgr-001",
    name: "هند الغامدي",      name_en: "Hind Al-Ghamdi",
    title: "مديرة العمليات",  title_en: "Operations Manager",
    department: "العمليات",   department_en: "Operations",
    photo: null,
    contacts: {
      email: "hind.alghamdi@company.com",
      phone: "+966500000010",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=hind.alghamdi@company.com"
    },
    escalationLinks: [
      { label: "تقارير العمليات اليومية", label_en: "Daily Operations Reports", url: "https://ops.company.com" }
    ],
    reportsTo: "ceo-001"
  },
  {
    id: "security-mgr-001",
    name: "سلطان الحربي",          name_en: "Sultan Al-Harbi",
    title: "مدير أمن المعلومات",   title_en: "Information Security Manager",
    department: "تقنية المعلومات", department_en: "Information Technology",
    photo: null,
    contacts: {
      email: "sultan.alharbi@company.com",
      phone: "+966500000011",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=sultan.alharbi@company.com"
    },
    escalationLinks: [
      { label: "الإبلاغ عن حادث أمني",  label_en: "Report a Security Incident",    url: "https://security.company.com/report" },
      { label: "سياسات أمن المعلومات",  label_en: "Information Security Policies",  url: "https://security.company.com/policies" }
    ],
    reportsTo: "cto-001"
  },
  {
    id: "marketing-mgr-001",
    name: "ريم القرني",       name_en: "Reem Al-Qarni",
    title: "مديرة التسويق",   title_en: "Marketing Manager",
    department: "التسويق",    department_en: "Marketing",
    photo: null,
    contacts: {
      email: "reem.alqarni@company.com",
      phone: "+966500000012",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=reem.alqarni@company.com"
    },
    escalationLinks: [
      { label: "طلب حملة تسويقية", label_en: "Request a Marketing Campaign", url: "https://marketing.company.com/request" }
    ],
    reportsTo: "ceo-001"
  }
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
  { label: "تصديد الايجنتس", label_en: "Agent Escalation", url: "https://globalfinancingsolutions-my.sharepoint.com/personal/hrashid_c_barq_com/_layouts/15/listforms.aspx?cid=OTU0NTk5NWUtMjViNC00ZjliLWFjMTItMWJmZGEwYjVmZjgw&ct=1779145693110&or=Teams-HL&cid=92de48ed-0e77-455f-909a-edd476810ff4&nav=NGJkZjc4N2UtN2ExYi00ZDM3LTkwYzctNzQ5YzkxNGRmOWRl&LOF=1", icon: "headset",
    children: [
      { label: "TL Escalations", label_en: "TL Escalations", url: "https://globalfinancingsolutions-my.sharepoint.com/personal/hrashid_c_barq_com/Lists/CC%20Operations%20Escalations/AllItems.aspx?FilterField1=Team%5Fx0020%5FLeaderr%5Fx0020%5F%5Fx0020%5F&FilterValue1=fabintamim%2Ec%40barq%2Ecom&FilterType1=Choice&FilterField2=Is%5Fx0020%5Fit%5Fx0020%5Frequire%5Fx0020%5F&FilterValue2=Yes&FilterType2=Choice&sortField=Date%5Fx0020%5F%5Fx062a%5F%5Fx0627%5F%5Fx0631%5F&isAscending=true&viewid=b8abfc70%2Da74c%2D4142%2D93b8%2D3eaa90a66370&OR=Teams%2DHL&CT=1774881462955&FocusModeOff=1&isSPOFile=1&ovuser=13826052%2D38a1%2D4044%2D856f%2Df6b6c1edf081%2Csalghamdi%2Ec%40barq%2Ecom&CID=af868185%2D350f%2D4bc8%2D8273%2D5fe323836f15&clickparams=eyJBcHBOYW1lIjoiVGVhbXMtRGVza3RvcCIsIkFwcFZlcnNpb24iOiI0OS8yNjA0MTYxNzIxNSJ9&linkOpenTime=1779145701557", icon: "list-check" }
    ]
  },
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
