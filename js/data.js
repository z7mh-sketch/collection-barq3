/**
 * Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…ÙˆÙ‚Ø¹ â€” Ù‡Ø°Ø§ Ø§Ù„Ù…Ù„Ù Ù‡Ùˆ Ø§Ù„ÙˆØ­ÙŠØ¯ Ø§Ù„Ù„ÙŠ ØªØ­ØªØ§Ø¬ ØªØ¹Ø¯Ù„Ù‡ Ù„Ù…Ø§ ØªØ¶ÙŠÙ Ù„ÙŠØ¯Ø± Ø¬Ø¯ÙŠØ¯
 * Ø£Ùˆ ØªØºÙŠÙ‘Ø± Ø±Ø§Ø¨Ø· Ø£Ùˆ ØªØ­Ø¯Ù‘Ø« Ù…Ø¹Ù„ÙˆÙ…Ø§Øª ØªÙˆØ§ØµÙ„.
 * Ù„Ø¥Ø¶Ø§ÙØ© ØªØ±Ø¬Ù…Ø© Ø§Ù†Ø¬Ù„ÙŠØ²ÙŠØ© Ù„Ø£ÙŠ Ø­Ù‚Ù„ Ø£Ø¶Ù Ù†ÙØ³ Ø§Ù„Ø§Ø³Ù… Ù…Ø¹ _en (Ù…Ø«Ø§Ù„: name_en)
 */

// ===================== Ø§Ù„Ù„ÙŠØ¯Ø±Ø² =====================
const leaders = [
  {
    id: "ceo-001",
    name: "Ù…Ø­Ù…Ø¯ Ø§Ù„Ø³Ø§Ù„Ù…",          name_en: "Mohammed Al-Salem",
    title: "Ø§Ù„Ø±Ø¦ÙŠØ³ Ø§Ù„ØªÙ†ÙÙŠØ°ÙŠ",      title_en: "Chief Executive Officer",
    department: "Ø§Ù„Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø¹Ù„ÙŠØ§",  department_en: "Executive Management",
    photo: null,
    contacts: {
      email: "ceo@company.com",
      phone: "+966500000001",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=ceo@company.com"
    },
    escalationLinks: [
      { label: "Ø­Ø¬Ø² Ø§Ø¬ØªÙ…Ø§Ø¹ Ù…Ø¹ Ø§Ù„Ù…ÙƒØªØ¨ Ø§Ù„ØªÙ†ÙÙŠØ°ÙŠ", label_en: "Book Executive Office Meeting", url: "https://example.com/exec-booking" }
    ],
    reportsTo: null
  },
  {
    id: "cto-001",
    name: "Ø£Ø­Ù…Ø¯ Ø¹Ø¨Ø¯Ø§Ù„Ù„Ù‡",               name_en: "Ahmed Abdullah",
    title: "Ù…Ø¯ÙŠØ± Ø¹Ø§Ù… ØªÙ‚Ù†ÙŠØ© Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§Øª",   title_en: "Chief Technology Officer",
    department: "ØªÙ‚Ù†ÙŠØ© Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§Øª",        department_en: "Information Technology",
    photo: null,
    contacts: {
      email: "ahmed.abdullah@company.com",
      phone: "+966500000002",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=ahmed.abdullah@company.com"
    },
    escalationLinks: [
      { label: "Ù†Ø¸Ø§Ù… Ø§Ù„ØªØ°Ø§ÙƒØ± Ø§Ù„ØªÙ‚Ù†ÙŠØ©",   label_en: "Technical Ticketing System", url: "https://servicedesk.company.com" },
      { label: "Ø·Ù„Ø¨ ØµÙ„Ø§Ø­ÙŠØ§Øª ÙˆØµÙˆÙ„",       label_en: "Request Access Permissions",  url: "https://access.company.com" },
      { label: "Ø­Ø§Ù„Ø§Øª Ø§Ù„Ø·ÙˆØ§Ø±Ø¦ Ø§Ù„ØªÙ‚Ù†ÙŠØ©",  label_en: "Technical Emergency Cases",   url: "https://oncall.company.com" }
    ],
    reportsTo: "ceo-001"
  },
  {
    id: "chro-001",
    name: "Ø³Ø§Ø±Ø© Ø§Ù„Ù…Ø·ÙŠØ±ÙŠ",              name_en: "Sara Al-Mutairi",
    title: "Ù…Ø¯ÙŠØ± Ø¹Ø§Ù… Ø§Ù„Ù…ÙˆØ§Ø±Ø¯ Ø§Ù„Ø¨Ø´Ø±ÙŠØ©", title_en: "Chief HR Officer",
    department: "Ø§Ù„Ù…ÙˆØ§Ø±Ø¯ Ø§Ù„Ø¨Ø´Ø±ÙŠØ©",     department_en: "Human Resources",
    photo: null,
    contacts: {
      email: "sara.almutairi@company.com",
      phone: "+966500000003",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=sara.almutairi@company.com"
    },
    escalationLinks: [
      { label: "Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„Ù…ÙˆØ¸ÙÙŠÙ†",          label_en: "Employee Portal",              url: "https://hr.company.com" },
      { label: "ØªÙ‚Ø¯ÙŠÙ… Ø´ÙƒÙˆÙ‰ Ø£Ùˆ Ù…Ù„Ø§Ø­Ø¸Ø©",   label_en: "Submit Complaint or Feedback", url: "https://hr.company.com/feedback" }
    ],
    reportsTo: "ceo-001"
  },
  {
    id: "cfo-001",
    name: "Ø®Ø§Ù„Ø¯ Ø§Ù„Ø²Ù‡Ø±Ø§Ù†ÙŠ",  name_en: "Khalid Al-Zahrani",
    title: "Ø§Ù„Ù…Ø¯ÙŠØ± Ø§Ù„Ù…Ø§Ù„ÙŠ",  title_en: "Chief Financial Officer",
    department: "Ø§Ù„Ù…Ø§Ù„ÙŠØ©",   department_en: "Finance",
    photo: null,
    contacts: {
      email: "khalid.alzahrani@company.com",
      phone: "+966500000004",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=khalid.alzahrani@company.com"
    },
    escalationLinks: [
      { label: "Ø·Ù„Ø¨Ø§Øª Ø§Ù„ØµØ±Ù ÙˆØ§Ù„Ù…ØµØ§Ø±ÙŠÙ", label_en: "Expense & Disbursement Requests", url: "https://finance.company.com/expenses" },
      { label: "Ù†Ø¸Ø§Ù… Ø§Ù„ÙÙˆØ§ØªÙŠØ±",          label_en: "Invoice System",                   url: "https://finance.company.com/invoices" }
    ],
    reportsTo: "ceo-001"
  },
  {
    id: "it-mgr-001",
    name: "Ù†Ø§ØµØ± Ø§Ù„Ù‚Ø­Ø·Ø§Ù†ÙŠ",   name_en: "Nasser Al-Qahtani",
    title: "Ù…Ø¯ÙŠØ± Ø§Ù„Ø¯Ø¹Ù… Ø§Ù„ÙÙ†ÙŠ", title_en: "IT Support Manager",
    department: "ØªÙ‚Ù†ÙŠØ© Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§Øª", department_en: "Information Technology",
    photo: null,
    contacts: {
      email: "nasser.alqahtani@company.com",
      phone: "+966500000005",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=nasser.alqahtani@company.com"
    },
    escalationLinks: [
      { label: "ÙØªØ­ ØªØ°ÙƒØ±Ø© Ø¯Ø¹Ù…",         label_en: "Open a Support Ticket",    url: "https://servicedesk.company.com/new" },
      { label: "Ø­Ø§Ù„Ø© Ø§Ù„Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø­Ø§Ù„ÙŠØ©",  label_en: "Current Services Status",  url: "https://status.company.com" }
    ],
    reportsTo: "cto-001"
  },
  {
    id: "dev-mgr-001",
    name: "ÙÙŠØµÙ„ Ø§Ù„Ø´Ù…Ø±ÙŠ",   name_en: "Faisal Al-Shammari",
    title: "Ù…Ø¯ÙŠØ± Ø§Ù„ØªØ·ÙˆÙŠØ±",  title_en: "Development Manager",
    department: "ØªÙ‚Ù†ÙŠØ© Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§Øª", department_en: "Information Technology",
    photo: null,
    contacts: {
      email: "faisal.alshammari@company.com",
      phone: "+966500000006",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=faisal.alshammari@company.com"
    },
    escalationLinks: [
      { label: "Ù†Ø¸Ø§Ù… Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…Ø´Ø§Ø±ÙŠØ¹", label_en: "Project Management System", url: "https://projects.company.com" },
      { label: "Ù…Ø³ØªÙˆØ¯Ø¹Ø§Øª Ø§Ù„ÙƒÙˆØ¯",       label_en: "Code Repositories",          url: "https://git.company.com" }
    ],
    reportsTo: "cto-001"
  },
  {
    id: "hr-mgr-001",
    name: "Ù†ÙˆØ±Ø© Ø§Ù„Ø¹ØªÙŠØ¨ÙŠ",          name_en: "Noura Al-Otaibi",
    title: "Ù…Ø¯ÙŠØ±Ø© Ø´Ø¤ÙˆÙ† Ø§Ù„Ù…ÙˆØ¸ÙÙŠÙ†",  title_en: "Employee Affairs Manager",
    department: "Ø§Ù„Ù…ÙˆØ§Ø±Ø¯ Ø§Ù„Ø¨Ø´Ø±ÙŠØ©", department_en: "Human Resources",
    photo: null,
    contacts: {
      email: "noura.alotaibi@company.com",
      phone: "+966500000007",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=noura.alotaibi@company.com"
    },
    escalationLinks: [
      { label: "Ø·Ù„Ø¨ Ø¥Ø¬Ø§Ø²Ø©",        label_en: "Request Leave",           url: "https://hr.company.com/leave" },
      { label: "Ø´Ù‡Ø§Ø¯Ø§Øª ÙˆØªØ¹Ø±ÙŠÙØ§Øª",  label_en: "Certificates & Letters",  url: "https://hr.company.com/letters" }
    ],
    reportsTo: "chro-001"
  },
  {
    id: "train-mgr-001",
    name: "Ø¹Ø¨Ø¯Ø§Ù„Ø±Ø­Ù…Ù† Ø§Ù„Ø¨Ù„ÙˆÙŠ",          name_en: "Abdulrahman Al-Balawi",
    title: "Ù…Ø¯ÙŠØ± Ø§Ù„ØªØ¯Ø±ÙŠØ¨ ÙˆØ§Ù„ØªØ·ÙˆÙŠØ±",    title_en: "Training & Development Manager",
    department: "Ø§Ù„Ù…ÙˆØ§Ø±Ø¯ Ø§Ù„Ø¨Ø´Ø±ÙŠØ©",     department_en: "Human Resources",
    photo: null,
    contacts: {
      email: "abdulrahman.albalawi@company.com",
      phone: "+966500000008",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=abdulrahman.albalawi@company.com"
    },
    escalationLinks: [
      { label: "ÙƒØªØ§Ù„ÙˆØ¬ Ø§Ù„Ø¯ÙˆØ±Ø§Øª",          label_en: "Course Catalogue",              url: "https://learning.company.com" },
      { label: "Ø®Ø·Ø© Ø§Ù„ØªØ·ÙˆÙŠØ± Ø§Ù„ÙØ±Ø¯ÙŠØ©",     label_en: "Individual Development Plan",   url: "https://learning.company.com/idp" }
    ],
    reportsTo: "chro-001"
  },
  {
    id: "finance-mgr-001",
    name: "Ù…Ø§Ø¬Ø¯ Ø§Ù„Ø¯ÙˆØ³Ø±ÙŠ",    name_en: "Majid Al-Dosari",
    title: "Ù…Ø¯ÙŠØ± Ø§Ù„Ù…Ø­Ø§Ø³Ø¨Ø©",  title_en: "Accounting Manager",
    department: "Ø§Ù„Ù…Ø§Ù„ÙŠØ©",   department_en: "Finance",
    photo: null,
    contacts: {
      email: "majid.aldosari@company.com",
      phone: "+966500000009",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=majid.aldosari@company.com"
    },
    escalationLinks: [
      { label: "ÙƒØ´ÙˆÙ Ø§Ù„Ø±ÙˆØ§ØªØ¨", label_en: "Payroll Statements", url: "https://finance.company.com/payroll" }
    ],
    reportsTo: "cfo-001"
  },
  {
    id: "ops-mgr-001",
    name: "Ù‡Ù†Ø¯ Ø§Ù„ØºØ§Ù…Ø¯ÙŠ",      name_en: "Hind Al-Ghamdi",
    title: "Ù…Ø¯ÙŠØ±Ø© Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª",  title_en: "Operations Manager",
    department: "Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª",   department_en: "Operations",
    photo: null,
    contacts: {
      email: "hind.alghamdi@company.com",
      phone: "+966500000010",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=hind.alghamdi@company.com"
    },
    escalationLinks: [
      { label: "ØªÙ‚Ø§Ø±ÙŠØ± Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø§Ù„ÙŠÙˆÙ…ÙŠØ©", label_en: "Daily Operations Reports", url: "https://ops.company.com" }
    ],
    reportsTo: "ceo-001"
  },
  {
    id: "security-mgr-001",
    name: "Ø³Ù„Ø·Ø§Ù† Ø§Ù„Ø­Ø±Ø¨ÙŠ",          name_en: "Sultan Al-Harbi",
    title: "Ù…Ø¯ÙŠØ± Ø£Ù…Ù† Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§Øª",   title_en: "Information Security Manager",
    department: "ØªÙ‚Ù†ÙŠØ© Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§Øª", department_en: "Information Technology",
    photo: null,
    contacts: {
      email: "sultan.alharbi@company.com",
      phone: "+966500000011",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=sultan.alharbi@company.com"
    },
    escalationLinks: [
      { label: "Ø§Ù„Ø¥Ø¨Ù„Ø§Øº Ø¹Ù† Ø­Ø§Ø¯Ø« Ø£Ù…Ù†ÙŠ",  label_en: "Report a Security Incident",    url: "https://security.company.com/report" },
      { label: "Ø³ÙŠØ§Ø³Ø§Øª Ø£Ù…Ù† Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§Øª",  label_en: "Information Security Policies",  url: "https://security.company.com/policies" }
    ],
    reportsTo: "cto-001"
  },
  {
    id: "marketing-mgr-001",
    name: "Ø±ÙŠÙ… Ø§Ù„Ù‚Ø±Ù†ÙŠ",       name_en: "Reem Al-Qarni",
    title: "Ù…Ø¯ÙŠØ±Ø© Ø§Ù„ØªØ³ÙˆÙŠÙ‚",   title_en: "Marketing Manager",
    department: "Ø§Ù„ØªØ³ÙˆÙŠÙ‚",    department_en: "Marketing",
    photo: null,
    contacts: {
      email: "reem.alqarni@company.com",
      phone: "+966500000012",
      teams: "https://teams.microsoft.com/l/chat/0/0?users=reem.alqarni@company.com"
    },
    escalationLinks: [
      { label: "Ø·Ù„Ø¨ Ø­Ù…Ù„Ø© ØªØ³ÙˆÙŠÙ‚ÙŠØ©", label_en: "Request a Marketing Campaign", url: "https://marketing.company.com/request" }
    ],
    reportsTo: "ceo-001"
  }
];

// ===================== Ø§Ù„Ø±ÙˆØ§Ø¨Ø· Ø§Ù„Ø³Ø±ÙŠØ¹Ø© =====================
const quickLinks = [
  { label: "Sprinklr",         url: "https://space-prod17.sprinklr.com/app/home",                              icon: "share-nodes", img: "assets/sprinklr.png" },
  { label: "ITSM",             url: "https://newbank2.atlassian.net/servicedesk/customer/portals",             icon: "headset",     img: "assets/atlassian.png", phone: "0547562927" },
  { label: "Microsoft Teams",  url: "msteams://",                                                              icon: "comments" },
  { label: "Outlook",          url: "mailto:",                                                                  icon: "envelope" },
  { label: "Intranet",         url: "https://intranet.prod.barraq.com.sa/workflow-status/?page=gravityflow-inbox&view=entry&id=23&lid=10902", icon: "globe" },
];

// ===================== Ø±ÙˆØ§Ø¨Ø· Ø¥Ø¶Ø§ÙÙŠØ© =====================
const additionalLinks = [
  { label: "ilovepdf",  label_en: "ilovepdf",  url: "https://www.ilovepdf.com/ar", icon: "file-pdf" },
];

// ===================== Ù…Ù„ÙØ§Øª PDF =====================
const pdfLinks = [
  { label: "Ù†Ù…ÙˆØ°Ø¬ Ø§Ù„Ù…Ø®Ø§Ù„ÙØ©",  label_en: "Violation Form",     url: "/pdfs/violation.pdf",     icon: "file-pdf", img: "assets/quickfix.png" },
  { label: "Ù†Ù…ÙˆØ°Ø¬ Ø§Ù„Ø§Ø³ØªÙ‚Ø§Ù„Ø©", label_en: "Resignation Form",   url: "/pdfs/resignation.pdf",   icon: "file-pdf", img: "assets/quickfix.png" },
  { label: "Ù†Ù…ÙˆØ°Ø¬ Ø¥Ø¬Ø§Ø²Ø©",     label_en: "Leave Request Form", url: "/pdfs/leave-request.pdf", icon: "file-pdf", img: "assets/quickfix.png" },
];

// ===================== Ø±ÙˆØ§Ø¨Ø· Ø§Ù„ØªØµØ¹ÙŠØ¯ Ø§Ù„Ø³Ø±ÙŠØ¹Ø© =====================
const escalationQuickLinks = [
  { label: "CC Technical Ticket",  label_en: "CC Technical Ticket",  url: "https://globalfinancingsolutions-my.sharepoint.com/personal/hrashid_c_barq_com/_layouts/15/listforms.aspx?cid=NmYyNDNiNzgtZmY3NC00NTM2LWI2NWQtMjEzZjQyMjEzYTlk&ct=1778373203795&or=Teams-HL&nav=NDIyNjlmOTYtYjEyNC00NjJmLWFjZGQtMDQyZjE1Y2UyZDI1", icon: "ticket",
    children: [
      { label: "CC Technical Tracker", label_en: "CC Technical Tracker", url: "https://globalfinancingsolutions-my.sharepoint.com/personal/hrashid_c_barq_com/Lists/CC%20Technical%20Ticket%20Tracker/AllItems.aspx?isSPOFile=1&xsdata=MDV8MDJ8fGZjN2NmZDhmMTI3MTRmZTkyNmRmMDhkZThlNjNkMDI1fDEzODI2MDUyMzhhMTQwNDQ4NTZmZjZiNmMxZWRmMDgxfDB8MHw2MzkxMDQ3NTY0NzgxOTEzMjd8VW5rbm93bnxWR1ZoYlhOVFpXTjFjbWwwZVZObGNuWnBZMlY4ZXlKRFFTSTZJbFJsWVcxelgwRlVVRk5sY25acFkyVmZVMUJQVEU5R0lpd2lWaUk2SWpBdU1DNHdNREF3SWl3aVVDSTZJbGRwYmpNeUlpd2lRVTRpT2lKUGRHaGxjaUlzSWxkVUlqb3hNWDA5fDF8TDJOb1lYUnpMekU1T2pFNU5EWmlPVE0wTWpnMU5qUmlZakk0WW1VMU9XUmxPR1UyTnpReFpERTBRSFJvY21WaFpDNTJNaTl0WlhOellXZGxjeTh4TnpjME9EYzROelU1T1RRNHxiNmQ2MzNkMjc4NmE0YjYzMjZkZjA4ZGU4ZTYzZDAyNXw4MmJlNmFiYTc2YmU0ZjdiOWFkNzM3YjA0ODJmY2JiZA%3D%3D&sdata=ckllSW10VkxhVVFGNnJFWkcrZS84eWo4THJCNDQxTHVpa1pxMDRFRGF4WT0%3D&ovuser=13826052-38a1-4044-856f-f6b6c1edf081%2Csalghamdi.c%40barq.com&OR=Teams-HL&CT=1778385785321&clickparams=eyJBcHBOYW1lIjoiVGVhbXMtRGVza3RvcCIsIkFwcFZlcnNpb24iOiI0OS8yNjA0MDQwMTcyMyJ9&linkOpenTime=1778385785325", icon: "list-check" }
    ]
  },
  { label: "HR-FLOW",              url: "https://globalfinancingsolutions.sharepoint.com/sites/test/_layouts/15/listforms.aspx?cid=M2JjMjdiZWUtMjAxOC00OTgwLThmNTItOTcyZjY2YjAwZmI5&nav=M2Q3MGI2YjUtOWE3ZC00NTM2LTkyM2ItOTZmMTZiODFkMWFi&LOF=1", icon: "users",
    children: [
      { label: "Ø³Ø¬Ù„ HR-FLOW", label_en: "HR-FLOW Tracker", url: "https://globalfinancingsolutions.sharepoint.com/sites/test/Lists/HRFLOW/AllItems.aspx?sortField=StartDate&isAscending=false&viewid=0dbe5ca5%2D4cbb%2D4502%2Dbf06%2D88f78ffbda51&ovuser=13826052%2D38a1%2D4044%2D856f%2Df6b6c1edf081%2Csalghamdi%2Ec%40barq%2Ecom&OR=Teams%2DHL&CT=1772016582838&clickparams=eyJBcHBOYW1lIjoiVGVhbXMtRGVza3RvcCIsIkFwcFZlcnNpb24iOiI0OS8yNjAyMDEwMTExNyIsIkhhc0ZlZGVyYXRlZFVzZXIiOmZhbHNlfQ%3D%3D", icon: "list-ul" }
    ]
  },
  { label: "ØªØµØ¹ÙŠØ¯ Ø§Ù„Ù…ÙˆØ¸ÙÙŠÙ†", label_en: "Agent Escalation", url: "https://globalfinancingsolutions-my.sharepoint.com/personal/hrashid_c_barq_com/_layouts/15/listforms.aspx?cid=OTU0NTk5NWUtMjViNC00ZjliLWFjMTItMWJmZGEwYjVmZjgw&ct=1779145693110&or=Teams-HL&cid=92de48ed-0e77-455f-909a-edd476810ff4&nav=NGJkZjc4N2UtN2ExYi00ZDM3LTkwYzctNzQ5YzkxNGRmOWRl&LOF=1", icon: "headset",
    children: [
      { label: "TL Escalations", label_en: "TL Escalations", url: "https://globalfinancingsolutions-my.sharepoint.com/personal/hrashid_c_barq_com/Lists/CC%20Operations%20Escalations/AllItems.aspx?FilterField1=Team%5Fx0020%5FLeaderr%5Fx0020%5F%5Fx0020%5F&FilterValue1=fabintamim%2Ec%40barq%2Ecom&FilterType1=Choice&FilterField2=Is%5Fx0020%5Fit%5Fx0020%5Frequire%5Fx0020%5F&FilterValue2=Yes&FilterType2=Choice&sortField=Date%5Fx0020%5F%5Fx062a%5F%5Fx0627%5F%5Fx0631%5F&isAscending=true&viewid=b8abfc70%2Da74c%2D4142%2D93b8%2D3eaa90a66370&OR=Teams%2DHL&CT=1774881462955&FocusModeOff=1&isSPOFile=1&ovuser=13826052%2D38a1%2D4044%2D856f%2Df6b6c1edf081%2Csalghamdi%2Ec%40barq%2Ecom&CID=af868185%2D350f%2D4bc8%2D8273%2D5fe323836f15&clickparams=eyJBcHBOYW1lIjoiVGVhbXMtRGVza3RvcCIsIkFwcFZlcnNpb24iOiI0OS8yNjA0MTYxNzIxNSJ9&linkOpenTime=1779145701557", icon: "list-check" }
    ]
  },
  { label: "CC Agent Tracker", label_en: "CC Agent Tracker", url: "https://globalfinancingsolutions-my.sharepoint.com/personal/hrashid_c_barq_com/_layouts/15/listforms.aspx?cid=OTFmZWVlZDQtM2FmMy00N2I4LWI5MjYtNTgxODBmMmE1MTBi&nav=NGNkYWI5MmYtOWZjYy00MWQyLTkwNmEtODc3YTYxNjc2MzM3&xsdata=MDV8MDJ8fDE1OTZkMTcxMzA3NTQ0ZTdjZGNiMDhkZWI4MjNhNjQ1fDEzODI2MDUyMzhhMTQwNDQ4NTZmZjZiNmMxZWRmMDgxfDB8MHw2MzkxNTA2NjAzODYxNTczNTJ8VW5rbm93bnxWR1ZoYlhOVFpXTjFjbWwwZVZObGNuWnBZMlY4ZXlKRFFTSTZJbFJsWVcxelgwRlVVRk5sY25acFkyVmZVMUJQVEU5R0lpd2lWaUk2SWpBdU1DNHdNREF3SWl3aVVDSTZJbGRwYmpNeUlpd2lRVTRpT2lKUGRHaGxjaUlzSWxkVUlqb3hNWDA5fDF8TDJOb1lYUnpMekU1T2pWbE5UZGlOV0ZpTFRjeU1UVXROR1ppWWkwNU1tVmtMVE5oTm1Wa1ltWmxaREl3T1Y5bVpERm1Oemt5TVMwMFpqQmlMVFExTlRFdE9HTXhNUzB3TmpkbFl6RmhabUppWTJSQWRXNXhMbWRpYkM1emNHRmpaWE12YldWemMyRm5aWE12TVRjM09UUTJPVEl6TnpJd01nPT18YzBjMGU0MjRmMTViNGUzNTMxMTcwOGRlYjgyM2E2NDV8ZTk5NTZmNTViYzA3NGViNjk4NjZlNDVjNGU5NWIyOTE%3D&sdata=d2V5V0Rxc1pJWXVWMFRuZ1o5OUZSNnRoOFMwemMzRU1FUlpGekltVzlzdz0%3D&ovuser=13826052-38a1-4044-856f-f6b6c1edf081%2Csalghamdi.c%40barq.com&TeamsCID=8c7d0c33-fec5-4a69-9f26-ad8646c771ab&OR=Teams-HL&CT=1779469245270&clickparams=eyJBcHBOYW1lIjoiVGVhbXMtRGVza3RvcCIsIkFwcFZlcnNpb24iOiI0OS8yNjA0MzAxOTIxNiIsIkhhc0ZlZGVyYXRlZFVzZXIiOmZhbHNlfQ%3D%3D", icon: "chart-bar" },
];

// ===================== Ø¯Ù„ÙŠÙ„ Ø§Ù„ØªØµØ¹ÙŠØ¯ =====================
const escalationGuide = [
  {
    category: "Ù…Ø´Ø§ÙƒÙ„ ØªÙ‚Ù†ÙŠØ© (Ø£Ø¬Ù‡Ø²Ø© / Ø¨Ø±Ø§Ù…Ø¬ / Ø´Ø¨ÙƒØ©)",
    category_en: "Technical Issues (Hardware / Software / Network)",
    icon: "laptop-code",
    steps: [
      "Ø§ÙØªØ­ ØªØ°ÙƒØ±Ø© ÙÙŠ Ù†Ø¸Ø§Ù… Ø§Ù„Ø¯Ø¹Ù… Ø§Ù„ÙÙ†ÙŠ ÙˆØ§Ø°ÙƒØ± ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ù…Ø´ÙƒÙ„Ø© ÙˆØµÙˆØ± Ø¥Ù† ÙˆØ¬Ø¯Øª",
      "Ø¥Ø°Ø§ Ù…Ø§ ØªÙ… Ø§Ù„Ø±Ø¯ Ø®Ù„Ø§Ù„ 4 Ø³Ø§Ø¹Ø§Øª Ø¹Ù…Ù„ØŒ ØªÙˆØ§ØµÙ„ Ù…Ø¹ Ù†Ø§ØµØ± Ø§Ù„Ù‚Ø­Ø·Ø§Ù†ÙŠ (Ù…Ø¯ÙŠØ± Ø§Ù„Ø¯Ø¹Ù… Ø§Ù„ÙÙ†ÙŠ)",
      "Ø¥Ø°Ø§ Ø§Ù„Ù…Ø´ÙƒÙ„Ø© Ø­Ø±Ø¬Ø© Ø£Ùˆ ØªØ¤Ø«Ø± Ø¹Ù„Ù‰ ÙØ±ÙŠÙ‚ ÙƒØ§Ù…Ù„ØŒ ØµØ¹Ù‘Ø¯ Ù„Ø£Ø­Ù…Ø¯ Ø¹Ø¨Ø¯Ø§Ù„Ù„Ù‡ (Ù…Ø¯ÙŠØ± Ø¹Ø§Ù… ØªÙ‚Ù†ÙŠØ© Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§Øª)",
      "Ù„Ù„Ø­Ø§Ù„Ø§Øª Ø§Ù„Ø·Ø§Ø±Ø¦Ø© Ø®Ø§Ø±Ø¬ Ø£ÙˆÙ‚Ø§Øª Ø§Ù„Ø¯ÙˆØ§Ù…ØŒ Ø§Ø³ØªØ®Ø¯Ù… Ø®Ø· Ø§Ù„Ø·ÙˆØ§Ø±Ø¦ Ø§Ù„ØªÙ‚Ù†ÙŠØ©"
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
    category: "Ø£Ù…Ù† Ù…Ø¹Ù„ÙˆÙ…Ø§Øª (Ø§Ø®ØªØ±Ø§Ù‚ / ØªØ³Ø±ÙŠØ¨ / Ø±Ø³Ø§Ø¦Ù„ Ù…Ø´Ø¨ÙˆÙ‡Ø©)",
    category_en: "Information Security (Breach / Leak / Suspicious Messages)",
    icon: "shield-halved",
    steps: [
      "Ù„Ø§ ØªØªØ¹Ø§Ù…Ù„ Ù…Ø¹ Ø§Ù„Ø±Ø§Ø¨Ø· Ø£Ùˆ Ø§Ù„Ù…Ù„Ù Ø§Ù„Ù…Ø´Ø¨ÙˆÙ‡ ÙˆÙ„Ø§ ØªØ¹ÙŠØ¯ ØªÙˆØ¬ÙŠÙ‡Ù‡",
      "Ø£Ø¨Ù„Øº ÙÙˆØ±Ø§Ù‹ Ø¹Ø¨Ø± Ù†Ù…ÙˆØ°Ø¬ 'Ø§Ù„Ø¥Ø¨Ù„Ø§Øº Ø¹Ù† Ø­Ø§Ø¯Ø« Ø£Ù…Ù†ÙŠ'",
      "ØªÙˆØ§ØµÙ„ Ù…Ø¨Ø§Ø´Ø±Ø© Ù…Ø¹ Ø³Ù„Ø·Ø§Ù† Ø§Ù„Ø­Ø±Ø¨ÙŠ (Ù…Ø¯ÙŠØ± Ø£Ù…Ù† Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§Øª) â€” Ù‡Ø°ÙŠ Ø­Ø§Ù„Ø§Øª Ù„Ø§ ØªÙ†ØªØ¸Ø±",
      "ÙˆØ«Ù‘Ù‚ ÙˆÙ‚Øª Ø§Ù„Ø­Ø§Ø¯Ø« ÙˆØ£ÙŠ ØªÙØ§ØµÙŠÙ„ Ù‚Ø¨Ù„ Ø§ØªØ®Ø§Ø° Ø£ÙŠ Ø¥Ø¬Ø±Ø§Ø¡"
    ],
    steps_en: [
      "Do not interact with the suspicious link or file and do not forward it",
      "Report immediately using the 'Report a Security Incident' form",
      "Contact Sultan Al-Harbi (Information Security Manager) directly â€” these cases cannot wait",
      "Document the time of the incident and any relevant details before taking further action"
    ],
    relatedLeaders: ["security-mgr-001"]
  },
  {
    category: "Ù…ÙˆØ§Ø±Ø¯ Ø¨Ø´Ø±ÙŠØ© (Ø¥Ø¬Ø§Ø²Ø§Øª / Ø±ÙˆØ§ØªØ¨ / ØªØ¹Ø±ÙŠÙØ§Øª)",
    category_en: "Human Resources (Leave / Payroll / Letters)",
    icon: "user-tie",
    steps: [
      "Ø§Ø¯Ø®Ù„ Ø¹Ù„Ù‰ Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„Ù…ÙˆØ¸ÙÙŠÙ† ÙˆÙ‚Ø¯Ù‘Ù… Ø§Ù„Ø·Ù„Ø¨ Ù…Ù† Ø§Ù„Ù‚Ù†ÙˆØ§Øª Ø§Ù„Ø±Ø³Ù…ÙŠØ©",
      "Ø¥Ø°Ø§ ØªØ£Ø®Ø± Ø§Ù„Ø±Ø¯ Ø£ÙƒØ«Ø± Ù…Ù† 3 Ø£ÙŠØ§Ù… Ø¹Ù…Ù„ØŒ ØªÙˆØ§ØµÙ„ Ù…Ø¹ Ù†ÙˆØ±Ø© Ø§Ù„Ø¹ØªÙŠØ¨ÙŠ (Ù…Ø¯ÙŠØ±Ø© Ø´Ø¤ÙˆÙ† Ø§Ù„Ù…ÙˆØ¸ÙÙŠÙ†)",
      "Ù„Ù„Ù…ÙˆØ§Ø¶ÙŠØ¹ Ø§Ù„Ø­Ø³Ø§Ø³Ø© Ø£Ùˆ Ø§Ù„Ø´ÙƒØ§ÙˆÙ‰ØŒ ØµØ¹Ù‘Ø¯ Ù„Ø³Ø§Ø±Ø© Ø§Ù„Ù…Ø·ÙŠØ±ÙŠ (Ù…Ø¯ÙŠØ± Ø¹Ø§Ù… Ø§Ù„Ù…ÙˆØ§Ø±Ø¯ Ø§Ù„Ø¨Ø´Ø±ÙŠØ©)"
    ],
    steps_en: [
      "Log into the employee portal and submit your request through the official channels",
      "If no response within 3 working days, contact Noura Al-Otaibi (Employee Affairs Manager)",
      "For sensitive matters or complaints, escalate to Sara Al-Mutairi (Chief HR Officer)"
    ],
    relatedLeaders: ["hr-mgr-001", "chro-001"]
  },
  {
    category: "Ø£Ù…ÙˆØ± Ù…Ø§Ù„ÙŠØ© (ØµØ±Ù / ÙÙˆØ§ØªÙŠØ± / Ù…ØµØ§Ø±ÙŠÙ)",
    category_en: "Financial Matters (Disbursements / Invoices / Expenses)",
    icon: "money-bill-wave",
    steps: [
      "Ù‚Ø¯Ù‘Ù… Ø§Ù„Ø·Ù„Ø¨ Ø¹Ø¨Ø± Ù†Ø¸Ø§Ù… Ø§Ù„ØµØ±Ù ÙˆØ§Ù„Ù…ØµØ§Ø±ÙŠÙ Ù…Ø¹ Ø§Ù„Ù…Ø±ÙÙ‚Ø§Øª Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø©",
      "ØªÙˆØ§ØµÙ„ Ù…Ø¹ Ù…Ø§Ø¬Ø¯ Ø§Ù„Ø¯ÙˆØ³Ø±ÙŠ (Ù…Ø¯ÙŠØ± Ø§Ù„Ù…Ø­Ø§Ø³Ø¨Ø©) Ù„Ù„Ø§Ø³ØªÙØ³Ø§Ø±Ø§Øª",
      "Ù„Ù„Ù…ÙˆØ§ÙÙ‚Ø§Øª Ø§Ù„ÙƒØ¨ÙŠØ±Ø© Ø£Ùˆ Ø­Ø§Ù„Ø§Øª Ø§Ù„ØªØ£Ø®Ø±ØŒ ØµØ¹Ù‘Ø¯ Ù„Ø®Ø§Ù„Ø¯ Ø§Ù„Ø²Ù‡Ø±Ø§Ù†ÙŠ (Ø§Ù„Ù…Ø¯ÙŠØ± Ø§Ù„Ù…Ø§Ù„ÙŠ)"
    ],
    steps_en: [
      "Submit your request through the expense & disbursement system with all required attachments",
      "Contact Majid Al-Dosari (Accounting Manager) for any inquiries",
      "For large approvals or delayed cases, escalate to Khalid Al-Zahrani (CFO)"
    ],
    relatedLeaders: ["finance-mgr-001", "cfo-001"]
  },
  {
    category: "Ø·Ù„Ø¨Ø§Øª ØªØ·ÙˆÙŠØ± Ø£Ùˆ Ù…Ø´Ø§Ø±ÙŠØ¹ Ø¬Ø¯ÙŠØ¯Ø©",
    category_en: "Development Requests or New Projects",
    icon: "code",
    steps: [
      "Ø­Ø¶Ù‘Ø± ÙˆØ«ÙŠÙ‚Ø© Ù‚ØµÙŠØ±Ø© ÙÙŠÙ‡Ø§ Ø§Ù„Ù‡Ø¯Ù ÙˆØ§Ù„Ù…ØªØ·Ù„Ø¨Ø§Øª ÙˆØ§Ù„Ù‚ÙŠÙ…Ø© Ø§Ù„Ù…ØªÙˆÙ‚Ø¹Ø©",
      "ØªÙˆØ§ØµÙ„ Ù…Ø¹ ÙÙŠØµÙ„ Ø§Ù„Ø´Ù…Ø±ÙŠ (Ù…Ø¯ÙŠØ± Ø§Ù„ØªØ·ÙˆÙŠØ±) Ù„Ù…Ù†Ø§Ù‚Ø´Ø© Ø§Ù„Ø¬Ø¯ÙˆÙ‰",
      "Ø¥Ø°Ø§ Ø§Ù„Ø·Ù„Ø¨ ÙŠØ­ØªØ§Ø¬ Ù…ÙˆØ§Ø±Ø¯ ÙƒØ¨ÙŠØ±Ø©ØŒ ÙŠØªÙ… Ø±ÙØ¹Ù‡ Ù„Ø£Ø­Ù…Ø¯ Ø¹Ø¨Ø¯Ø§Ù„Ù„Ù‡ Ù„Ù„Ø§Ø¹ØªÙ…Ø§Ø¯"
    ],
    steps_en: [
      "Prepare a brief document outlining the objective, requirements, and expected value",
      "Contact Faisal Al-Shammari (Development Manager) to discuss feasibility",
      "If the request requires significant resources, it will be escalated to Ahmed Abdullah for approval"
    ],
    relatedLeaders: ["dev-mgr-001", "cto-001"]
  },
  {
    category: "Ø·Ù„Ø¨Ø§Øª ØªØ³ÙˆÙŠÙ‚ÙŠØ© (Ø­Ù…Ù„Ø§Øª / Ù…ÙˆØ§Ø¯ / ØªØµØ§Ù…ÙŠÙ…)",
    category_en: "Marketing Requests (Campaigns / Materials / Designs)",
    icon: "bullhorn",
    steps: [
      "Ø§Ù…Ù„Ø£ Ù†Ù…ÙˆØ°Ø¬ 'Ø·Ù„Ø¨ Ø­Ù…Ù„Ø© ØªØ³ÙˆÙŠÙ‚ÙŠØ©' Ø¨ÙƒÙ„ Ø§Ù„ØªÙØ§ØµÙŠÙ„ ÙˆØ§Ù„Ù…ÙˆØ¹Ø¯ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨",
      "ØªÙˆØ§ØµÙ„ Ù…Ø¹ Ø±ÙŠÙ… Ø§Ù„Ù‚Ø±Ù†ÙŠ (Ù…Ø¯ÙŠØ±Ø© Ø§Ù„ØªØ³ÙˆÙŠÙ‚) Ù„Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ø·Ù„Ø¨"
    ],
    steps_en: [
      "Fill in the 'Marketing Campaign Request' form with all details and the required deadline",
      "Contact Reem Al-Qarni (Marketing Manager) to follow up on the request"
    ],
    relatedLeaders: ["marketing-mgr-001"]
  }
];
