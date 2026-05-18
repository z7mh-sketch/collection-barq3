# مرجع الليدرز

موقع داخلي بسيط يستخدم كمرجع سريع لمعلومات تواصل الليدرز في الشركة وروابط التصعيد.

## كيف تشغّل الموقع محلياً

افتح ملف `index.html` بأي متصفح (Chrome / Edge / Firefox). الموقع كله ثابت ولا يحتاج خادم.

## كيف تعدّل البيانات

كل البيانات في ملف واحد: `js/data.js`. تحتاج تعدله فقط لما:
- تضيف ليدر جديد أو تشيل واحد
- تغيّر إيميل أو جوال
- تضيف رابط تصعيد جديد
- تعدّل دليل التصعيد
- تضيف رابط سريع لنظام جديد

### 1. إضافة ليدر جديد

افتح `js/data.js` ودوّر على مصفوفة `leaders`. انسخ آخر كائن وعدّل قيمه:

```javascript
{
  id: "unique-id-here",            // معرف فريد بدون مسافات
  name: "اسم الليدر",
  title: "المنصب",
  department: "القسم",              // لازم يطابق قسم موجود أو يضيف قسم جديد تلقائياً
  photo: null,                      // أو "assets/photos/filename.jpg"
  contacts: {
    email: "name@company.com",
    phone: "+9665xxxxxxxx",
    teams: "https://teams.microsoft.com/..."
  },
  escalationLinks: [
    { label: "اسم الرابط", url: "https://..." }
  ],
  reportsTo: "ceo-001"              // id الليدر الأعلى منه، أو null إذا في القمة
}
```

### 2. إضافة صورة لليدر

1. ضع الصورة في مجلد `assets/photos/` (مفضّل تكون مربعة، 200x200 على الأقل)
2. عدّل `photo: null` إلى `photo: "assets/photos/filename.jpg"`

### 3. إضافة رابط سريع

في نفس الملف، دوّر على مصفوفة `quickLinks` وأضف:

```javascript
{ label: "اسم النظام", url: "https://...", icon: "اسم-الأيقونة" }
```

الأيقونات من [Font Awesome](https://fontawesome.com/icons) — استخدم الاسم بدون `fa-` (مثل `users`، `envelope`، `gear`).

### 4. تعديل دليل التصعيد

دوّر على مصفوفة `escalationGuide` وأضف أو عدّل:

```javascript
{
  category: "اسم الفئة",
  icon: "اسم-الأيقونة",
  steps: [
    "الخطوة الأولى",
    "الخطوة الثانية",
    "..."
  ],
  relatedLeaders: ["id-ليدر-1", "id-ليدر-2"]   // اختياري
}
```

## النشر على إنترانت الشركة

### الخيار 1: IIS (Windows Server)
1. انسخ مجلد `leaders-hub` بالكامل إلى مجلد المواقع (`C:\inetpub\wwwroot\` مثلاً)
2. افتح IIS Manager → Add Website → أشر للمجلد
3. اضبط البورت أو الـ Host Header المطلوب

### الخيار 2: Apache / Nginx
ارفع المجلد لأي مسار يخدمه الخادم. الموقع كله static فلا يحتاج إعدادات خاصة.

### الخيار 3: مجلد مشترك على الشبكة
لو الشركة ما عندها خادم داخلي، يكفي تحط المجلد على مجلد مشترك (Shared Folder) ويفتحه كل واحد من `index.html` مباشرة.

## الأمان والخصوصية

- البيانات (إيميلات وأرقام) موجودة بصيغة واضحة في `data.js` — هذا مقبول للنشر الداخلي فقط
- **لا ترفع المجلد على GitHub أو أي خدمة خارجية**
- لو محتاج حماية أعلى، أضف Basic Auth على مستوى الخادم (IIS/Apache) ولا تعدّل الكود

## المتطلبات

- اتصال إنترنت (لأن المكتبات تُحمّل من CDN خارجي)
- لو الإنترانت ما يسمح بـ CDN خارجي، حمّل المكتبات محلياً:
  - Tailwind: `https://cdn.tailwindcss.com`
  - Font Awesome: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css`
  - Mermaid: `https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js`
  - Tajawal font: `https://fonts.googleapis.com/css2?family=Tajawal:...`

## اختصارات لوحة المفاتيح

- `/` — التركيز على مربع البحث
- `Esc` — مسح البحث / إغلاق النافذة المنبثقة

## هيكل الملفات

```
leaders-hub/
├── index.html              # الصفحة الرئيسية
├── README.md               # هذا الملف
├── css/styles.css          # تنسيقات
├── js/
│   ├── data.js             # ← البيانات (الملف الوحيد اللي تعدّله عادة)
│   ├── render.js           # منطق العرض
│   └── search.js           # منطق البحث
└── assets/photos/          # صور الليدرز
```
