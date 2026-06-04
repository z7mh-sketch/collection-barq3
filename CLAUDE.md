# Leaders Hub — Project Memory

## ما هو المشروع
موقع داخلي لشركة Barq باسم **Collection Barq** (Leaders Hub).
يجمع بيانات التواصل مع القادة وروابط التصعيد في مكان واحد.
الموقع محمي بـ Firebase Auth — فقط إيميلات `@barq.com` المعتمدة.

**GitHub:** https://github.com/z7mh-sketch/collection-barq3  
**المجلد:** `C:\Users\SaudKhalidAlghamdi\leaders-hub`  
**بعد كل تعديل:** `git add -A && git commit -m "..." && git push`

---

## هيكل الملفات

```
leaders-hub/
├── index.html          ← الصفحة الرئيسية (كل شيء تقريباً هنا)
├── login.html          ← صفحة تسجيل الدخول
├── css/
│   └── styles.css      ← كل التنسيقات
├── js/
│   ├── firebase-config.js  ← إعدادات Firebase
│   ├── auth.js             ← التحقق من الدخول + حفظ userEmail في localStorage
│   ├── render.js           ← رسم بطاقات القادة
│   ├── animations.js       ← نجوم + trail + rotating hero text
│   ├── presence.js         ← ظهور اسم المستخدم
│   ├── i18n.js             ← تبديل AR/EN
│   ├── pdf-forms.js        ← نموذج المخالفات + email flow + VF_EMPLOYEES
│   ├── resign-forms.js     ← نموذج الاستقالة (يعيد استخدام VF_EMPLOYEES)
│   └── leave-forms.js      ← نموذج طلب الإجازة (يعيد استخدام VF_EMPLOYEES)
└── pdfs/
    └── violation.pdf       ← نموذج المخالفة
```

---

## المميزات المبنية

### 1. Auth (auth.js)
- Firebase Auth — فقط `@barq.com`
- يحفظ `presenceName` و `userEmail` في localStorage عند grantAccess
- **الاسم يؤخذ مرة واحدة من تسجيل الدخول فقط**: `presenceName` = اسم Firestore (`users/{uid}.name` المُدخل وقت التسجيل) ← ثم displayName ← ثم اشتقاق من الإيميل. يُحدَّث في كل دخول (overwrite). presence.js ما يطلب الاسم أبداً — ينتظر auth.js (نافذة #nameModal صارت dead code)

### 2. نموذج المخالفات (pdf-forms.js)
- زر "نموذج مخالفة" يفتح wizard متعدد الخطوات
- الخطوة 1: اختيار يدوي أو من قائمة الموظفين
- `VF_EMPLOYEES`: object يضم 21 ليدر، كل واحد بقائمة موظفيه
  - المفتاح = إيميل الليدر (lowercase)
  - القيمة = array of `{ name, hrid, email, title }`
- بعد اختيار الموظف يفتح PDF ويملأه
- زر "إرسال بالإيميل" يفتح mailto مع 4 قوالب (تأخر/غياب/خروج/أخرى) بـ AR+EN

### 2.1 نموذج الاستقالة (resign-forms.js) ونموذج الإجازة (leave-forms.js)
- نفس تدفّق المخالفة: launch modal (اختر موظف / يدوي / تحميل فاضي) → فورم → تعبئة PDF → تحميل
- يعيدان استخدام `VF_EMPLOYEES` + `_vfManagerName` + `_vfCurrentEmail` + `_vfSafeFileName` من pdf-forms.js (يجب تحميلهما بعده)
- اسم المدير المباشر + توقيعه (رسم/كتابة) + تاريخه تلقائي = الليدر؛ الليدر يختار التواريخ
- **المواضع تُضبط بصرياً** عبر زر "ضبط المواضع" (mapper) وتُحفظ في localStorage:
  - الاستقالة: `barq_rf_coords_v2` (مُعايرة من المستخدم) — leave: `barq_lf_coords_v2` (مُعايرة على النموذج الحقيقي 2026-06-04)
- النموذجان نص/صورة بدون حقول AcroForm (مثل المخالفة) → لا يمكن استخراج إحداثيات تلقائياً، لذلك المعايرة البصرية ضرورية
- **نموذج الإجازة = "Leave and Travel Request" (QuickFix)**: حقوله الحقيقية = معلومات الموظف (اسم/رقم/تعيين/قسم/مسمى) + نوع الإجازة (8 مربعات، ✓ في المختار) + تواريخ (آخر يوم عمل/بداية/نهاية/مباشرة بصيغة 2026/MM/DD) + هاتف + مجموع أيام + اعتمادات (مقدم الطلب=الموظف، المدير المباشر=الليدر بالاسم+التوقيع). `LF_TYPE_COORD` يربط نوع الإجازة بمربعه.
- **معايرة PDF بدون متصفح:** استخدم WinRT `Windows.Data.Pdf` في PowerShell لرسم الـ PDF صورة، ثم System.Drawing لرسم شبكة %/قيم تجريبية والتحقق بصرياً (pdf.js يتجمد في معاينة headless عند scale 2.5). راجع سجل المحادثة.

### 2.2 تتبّع التحميلات (server.ps1 + render.js + admin.html)
- أي ضغط على بطاقة PDF يستدعي `trackDownload(label)` → POST `/api/log-download`
- السيرفر يحفظ في `downloads.json` ويرسل إيميل Outlook (COM) لـ salghamdi.c@barq.com
- admin.html تاب "التحميلات" يعرض الأسماء مجمّعة (`/api/downloads`)
- ⚠️ server.ps1 يجب أن يبقى **بدون نص عربي** (encoding يتخرب) — استخدم HTML entities `&#1575;` في جسم الإيميل

### 3. Sticky Notes Widget (index.html)
- شريط جانبي ثابت على اليسار (AR) أو اليمين (EN)
- يملأ كامل ارتفاع الصفحة
- **localStorage key:** `barq_tasks_v1`
- **هيكل البيانات:** `{ page, open, pages: [{title, tasks:[{text,done}]}] }`
- مميزات: عنوان قابل للتعديل، متعدد النوتات (pagination)، حذف نوت
- شريط تنسيق: Bold/Italic/Underline/Strikethrough/List/Image
- Enter = مهمة جديدة، Shift+Enter = سطر جديد
- زر إغلاق (−) داخل الهيدر، شريط رفيع يظهر عند الإغلاق للفتح

### 4. Animations (animations.js)
- نجوم ذهبية تتحرك على canvas
- Mouse trail ذهبي
- Hero rotating text — يشمل: "🏆 مبروك الفوز للعالمين! 🏆"

### 5. Chain Animation (styles.css)
- `.sub-conn-line` بين بطاقات القادة
- SVG متكرر 12×17px يصنع سلسلة ذهبية متحركة لأسفل

### 6. Search Input
- حدود ذهبية دائماً مرئية: `border: 1.5px solid rgba(251,191,36,.55)`

### 7. قسم "Additional Links"
- سابقاً "روابط إضافية" — غُيّر للإنجليزي

---

## الألوان والتصميم
- خلفية: `#0f172a` (dark navy)
- أكسنت: `#FBBF24` (ذهبي)
- نص ثانوي: `#94a3b8`
- الخط: Tajawal (عربي)
- الاتجاه: RTL افتراضياً

---

## Firebase
- Auth: إيميلات @barq.com فقط
- Firestore: `users/{uid}.status === 'approved'` أو `approvals/{uid}` للوصول
- الملف: `js/firebase-config.js`

---

## ⚠️ إحداثيات نموذج المخالفة — معتمدة نهائياً (لا تُغيَّر)
`VF_FILL_COORDS` في `js/pdf-forms.js` معتمدة من المستخدم بتاريخ 2026-05-29 (commit d027fcc).
**ممنوع تعديلها** إلا بطلب صريح من المستخدم:
- التأخير: y=704، day_x=900، mon_x=848 — مدة التأخير late_dur x=741,y=704 (أُضيفت بطلب المستخدم 2026-05-30)
- الخروج المبكر: y=737، day_x=977، mon_x=927 — المدة early_dur x=741,y=737
- الغياب: y=770، day_x=841، mon_x=804 — أيام الغياب absent_days x=979,y=770

## ملاحظات مهمة
- `pdf-forms.js` لا يستورد `auth` مباشرة — يقرأ `userEmail` من localStorage
- البيانات تُحفظ كلها في localStorage (لا backend للـ tasks/presence)
- الموقع يعمل بدون build step — HTML/CSS/JS مباشر
- لا يوجد framework (vanilla JS + TailwindCDN + Firebase CDN)
