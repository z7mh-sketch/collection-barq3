# 🏗️ الدليل الشامل لبناء تطبيق Collection Barq في Power Apps
> **Master Build Runbook** — أوامر منظّمة لتنفيذها بواسطة وكيل Claude-in-Chrome (بدون قيود دومين) أو يدوياً.

## ⚠️ اقرأ هذا أولاً
- هذا الدليل يبني التطبيق كامل: **القوائم → التطبيق → الشاشات → النماذج → التدفقات → النشر**.
- **واقعياً نفّذه مرحلة-مرحلة، وتحقّق بعد كل مرحلة.** استوديو Power Apps معقّد؛ لا تتوقع نجاح كل شيء من أول مرة — بلّغ عن أي خطأ ويُعالَج.
- نفّذ المراحل **بالترتيب** (كل مرحلة تعتمد على اللي قبلها).

## الحقائق الثابتة (استخدمها حرفياً)
- **موقع SharePoint:** `https://globalfinancingsolutions.sharepoint.com/sites/CollectionBarq`
- **Power Apps:** `make.powerapps.com` · البيئة Default (Barraq Finance) · المستخدم Saud
- **القوائم السبع:** Leaders, Employees, QuickLinks, EscalationLinks, EscalationGuide, EscalationSteps, DownloadLog
- **اللغة:** عربي + إنجليزي عبر المتغيّر `varLang` · المحاذاة لليمين يدوية (لا يوجد قلب اتجاه تلقائي)
- **الألوان:** ذهبي `#FBBF24` على كحلي `#0f172a`

## خريطة المراحل
| المرحلة | المحتوى |
|---|---|
| **١** | إنشاء القوائم السبع من `BarqData.xlsx` (مرفوع في مكتبة Documents) |
| **٢** | إنشاء تطبيق Canvas + ربط البيانات + App.OnStart + الثيم + تبديل اللغة |
| **٣** | الشاشات: الرئيسية، الليدرز (بحث+فلترة)، التفاصيل، الروابط، التصعيد، دليل التصعيد |
| **٤** | شاشات النماذج الثلاثة (مخالفة/استقالة/إجازة) + توقيع Pen Input |
| **٥** | تدفقات Power Automate + ربط النماذج + النشر + المشاركة عبر Entra |

> 📌 **قوالب Word للنماذج (مرحلة ٥):** تُرفَع لاحقاً إلى OneDrive/الموقع — Saud يوفّرها قبل بناء التدفقات.

---


---
# 🗂️ المرحلة ١: إنشاء القوائم السبع
# Runbook: إنشاء قوائم SharePoint لتطبيق Collection Barq
> أوامر دقيقة لوكيل Claude-in-Chrome. نفّذها بالترتيب داخل موقع SharePoint.

## السياق
- **الموقع:** `https://globalfinancingsolutions.sharepoint.com/sites/CollectionBarq`
- **الملف المصدر:** `BarqData.xlsx` (فيه ٦ جداول: tblLeaders, tblEmployees, tblQuickLinks, tblEscalationLinks, tblEscalationGuide, tblEscalationSteps)
- **الهدف:** إنشاء ٧ قوائم (٦ من الملف + DownloadLog فاضية) وضبط أنواع الأعمدة المهمة.

## شرط مسبق (خطوة بشرية واحدة)
تأكد إن `BarqData.xlsx` مرفوع في مكتبة **Documents** بالموقع. (الرفع من القرص المحلي يسويه المستخدم يدوياً مرة وحدة — أي وكيل متصفح ما يقدر يقرأ ملفات الجهاز.) بعد ما يظهر الملف في Documents، كمّل.

---

## القاعدة الذهبية للأنواع (طبّقها في كل استيراد)
أهم شيئين فقط — لا تتجاوزهما:
1. **HRID → Single line of text** (لو خلّيته رقم بتضيع/تتغير الأرقام الطويلة).
2. في **Employees**: لو صار تعارض على عمود `Title`، سمِّ عمود المسمى الوظيفي **JobTitle**.

الباقي: خلّ SharePoint يكتشف النوع تلقائياً (نص غالباً) — أنا أتولّى التحويلات داخل Power Apps. **اختياري** لو سهل: اضبط `Order` = Number، و`Section`/`IsChild` = Choice، وأعمدة الخطوات = Multiple lines of text. لا توقف الاستيراد لو ما توفّر النوع — كمّل والباقي عليّ.

---

## الإجراء العام لكل قائمة من Excel
1. من الموقع: **+ New → List**.
2. اختر **From Excel**.
3. اضغط **Choose a file already on this site** → اختر `BarqData.xlsx`.
4. من قائمة الجداول، اختر الجدول المطلوب (انظر الجدول أدناه).
5. في معاينة الأعمدة: طبّق القاعدة الذهبية (HRID نص، JobTitle لو لزم).
6. اكتب اسم القائمة (انظر العمود "اسم القائمة").
7. **Create**.
8. تأكد من عدد الصفوف (انظر العمود "الصفوف المتوقعة").

| # | الجدول في Excel | اسم القائمة | الصفوف المتوقعة | ملاحظات خاصة |
|---|---|---|---|---|
| 1 | `tblLeaders` | **Leaders** | ٢٣ | عمود `Teams` رابط (اتركه نص عادي إن أسهل) |
| 2 | `tblEmployees` | **Employees** | ٢٧٩ | **HRID نص** · سمِّ المسمى **JobTitle** |
| 3 | `tblQuickLinks` | **QuickLinks** | ٦ | `Section` قيمتاه: Quick / Additional |
| 4 | `tblEscalationLinks` | **EscalationLinks** | ٧ | `IsChild`: Yes / No · `Order` رقم |
| 5 | `tblEscalationGuide` | **EscalationGuide** | ٦ | — |
| 6 | `tblEscalationSteps` | **EscalationSteps** | ١٩ | `StepAr`/`StepEn` نص طويل · `Order` رقم |

---

## القائمة السابعة: DownloadLog (فاضية)
1. **+ New → List → Blank list**.
2. الاسم: **DownloadLog**.
3. أضف الأعمدة التالية (+ Add column):
   - `UserEmail` — Single line of text
   - `UserName` — Single line of text
   - `FormType` — Choice (القيم: `Violation`, `Resignation`, `Leave`)
   - `TargetEmployee` — Single line of text
   - `GeneratedAt` — Date and time
   - (عمود **Title** الافتراضي اتركه — بنحط فيه اسم النموذج)

---

## التحقق النهائي
بعد الانتهاء، تأكد إن الموقع فيه ٧ قوائم بهذي الأعداد:
`Leaders=23, Employees=279, QuickLinks=6, EscalationLinks=7, EscalationGuide=6, EscalationSteps=19, DownloadLog=0`

ثم بلّغ Saud: **"خلصت القوائم السبع"** + لو فيه أي عمود ما انضبط نوعه.


---
# ⚙️ المرحلة ٢: تجهيز التطبيق
# القسم 06a — تجهيز التطبيق وربط البيانات والثيم

> **ملاحظة للوكيل المنفّذ:** كل اسم (شاشة، عمود، متغير، مجموعة) موضوع بين قوسين مربعين `[...]` أو بخط أحادي `code` يجب كتابته بالضبط كما ورد — الأحرف الكبيرة والصغيرة مهمة.  
> الصيغ (Power Fx) تُنسخ كما هي بدون ترجمة. الشرح فقط بالعربي.

---

## 1. إنشاء تطبيق Canvas (Tablet Layout)

1. افتح المتصفح وانتقل إلى `https://make.powerapps.com`.
2. تأكد أن البيئة (Environment) في شريط الأعلى هي `Default (globalfinancingsolutions)` — إذا لم تجدها اضغط على اسم البيئة الحالية وابحث عنها من القائمة.
3. من الشريط الجانبي اضغط **+ Create**.
4. اختر **Blank app**.
5. اختر **Blank canvas app**.
6. في النافذة التي تظهر:
   - **App name:** اكتب `Collection Barq` (بدون تغيير الحالة)
   - **Format:** اختر **Tablet**
7. اضغط **Create** — انتظر حتى يفتح Power Apps Studio.

---

## 2. ربط مصادر بيانات SharePoint (Data Sources)

> البيانات موجودة مسبقاً في الموقع `https://globalfinancingsolutions.sharepoint.com/sites/CollectionBarq` على هيئة قوائم (Lists) تم إنشاؤها في المرحلة الأولى (Phase 1).

1. من الشريط الجانبي داخل Power Apps Studio اضغط على أيقونة **Data** (أسطوانة البيانات — عادةً الأيقونة الثالثة أو الرابعة من اليسار).
2. اضغط **+ Add data**.
3. في مربع البحث اكتب `SharePoint` → اختر **SharePoint** من النتائج.
4. في حقل "Enter a SharePoint URL" الصق عنوان الموقع:
   ```
   https://globalfinancingsolutions.sharepoint.com/sites/CollectionBarq
   ```
5. اضغط **Connect** (أو **Go**).
6. من قائمة Lists التي تظهر، ضع علامة ✓ على القوائم السبع التالية بالترتيب:
   - `Leaders`
   - `Employees`
   - `QuickLinks`
   - `EscalationLinks`
   - `EscalationGuide`
   - `EscalationSteps`
   - `DownloadLog`
7. اضغط **Connect**.
8. انتظر حتى تظهر القوائم السبع في لوحة Data على الشريط الجانبي — تأكد أن اسم كل قائمة يطابق الأسماء أعلاه حرفاً حرفاً.

> **إذا ظهر تحذير Delegation:** هذا طبيعي في هذه المرحلة — سيُعالج في صيغ الفلترة لاحقاً. أغلق التحذير وتابع.

---

## 3. إنشاء الشاشات بأسمائها الصحيحة

> **قبل كتابة أي صيغة:** أنشئ الشاشات التسع الآن حتى تعمل صيغ `Navigate()` بدون خطأ.

1. من قائمة **Tree View** (يسار الشاشة) اضغط على **+** بجانب "Screens".
2. اختر **Blank** لكل شاشة.
3. لكل شاشة بعد الإنشاء: اضغط عليها بزر الماوس الأيمن → **Rename** → اكتب الاسم بالضبط:

| رقم | اسم الشاشة | الاستخدام |
|---|---|---|
| 1 | `scrHome` | الصفحة الرئيسية |
| 2 | `scrLeaders` | دليل الليدرز |
| 3 | `scrLeaderDetail` | تفاصيل ليدر |
| 4 | `scrQuickLinks` | الروابط السريعة |
| 5 | `scrEscalationLinks` | روابط التصعيد |
| 6 | `scrEscalationGuide` | دليل التصعيد |
| 7 | `scrFormViolation` | نموذج المخالفة |
| 8 | `scrFormResignation` | نموذج الاستقالة |
| 9 | `scrFormLeave` | نموذج الإجازة |

---

## 4. إعداد App.OnStart

> **App.OnStart** هو أول كود يُنفَّذ عند فتح التطبيق. يقوم بتهيئة اللغة والألوان والمتغيرات وتحميل البيانات من SharePoint دفعةً واحدة.

### 4-A. الوصول إلى خاصية OnStart

1. في **Tree View** اضغط على **App** (يظهر في أعلى القائمة).
2. في شريط الخصائص (Properties) يمين الشاشة ابحث عن **OnStart**.
3. اضغط على الحقل — ستفتح لوحة شريط الصيغة (Formula Bar) أعلى الشاشة.
4. احذف أي محتوى موجود ثم الصق الصيغة التالية كاملة:

```powerfx
// ─── App.OnStart — Collection Barq ────────────────────────────
Concurrent(
    // ── 1. اللغة الافتراضية ─────────────────────────────────────
    Set(varLang, "ar"),

    // ── 2. فلتر الأقسام الافتراضي ───────────────────────────────
    Set(varSelectedDept, "الكل"),

    // ── 3. متغير الليدر المختار (فارغ عند الفتح) ────────────────
    Set(varSelectedLeader, Blank()),

    // ── 4. متغيرات نافذة ITSM ────────────────────────────────────
    Set(varShowITSM, false),
    Set(varITSMRecord, Blank()),

    // ── 5. متغير تتبع الليدر الحالي (من إيميل المستخدم) ─────────
    Set(
        varMyKey,
        LookUp(Leaders, Email = User().Email, Title)
    ),

    // ── 6. متغيرات النماذج ───────────────────────────────────────
    Set(varFormEmpName,  ""),
    Set(varFormEmpHRID,  ""),
    Set(varFormEmpEmail, ""),
    Set(varFormStep,     1),
    Set(varIsSubmitting, false),

    // ── 7. ألوان الثيم ───────────────────────────────────────────
    Set(varColorBg,        Color.FromArgb(255, 15,  23, 42)),   // #0f172a خلفية داكنة
    Set(varColorGold,      Color.FromArgb(255, 251, 191, 36)),  // #FBBF24 ذهبي
    Set(varColorGoldLight, Color.FromArgb(180, 251, 191, 36)),  // ذهبي شفاف
    Set(varColorCardBg,    Color.FromArgb(255, 30,  41, 59)),   // #1e293b خلفية البطاقات
    Set(varColorText,      Color.FromArgb(255, 241, 245, 249)), // #f1f5f9 نص أبيض
    Set(varColorTextMuted, Color.FromArgb(255, 148, 163, 184)), // #94a3b8 نص ثانوي
    Set(varColorBorder,    Color.FromArgb(255, 51,  65,  85)),  // #334155 حدود
    Set(varColorSuccess,   Color.FromArgb(255, 34,  197, 94)),  // أخضر
    Set(varColorWarning,   Color.FromArgb(255, 234, 179, 8)),   // أصفر
    Set(varColorError,     Color.FromArgb(255, 239, 68,  68)),  // أحمر

    // ── 8. تحميل قائمة Leaders ───────────────────────────────────
    ClearCollect(colLeaders, Leaders),

    // ── 9. تحميل قائمة Employees ─────────────────────────────────
    ClearCollect(colEmployees, Employees),

    // ── 10. تحميل قائمة QuickLinks ───────────────────────────────
    ClearCollect(colQuickLinks, QuickLinks),

    // ── 11. تحميل قائمة EscalationLinks ──────────────────────────
    ClearCollect(colEscalationLinks, EscalationLinks),

    // ── 12. تحميل قائمة EscalationGuide ──────────────────────────
    ClearCollect(colEscalationGuide, EscalationGuide),

    // ── 13. تحميل قائمة EscalationSteps ──────────────────────────
    ClearCollect(colEscalationSteps, EscalationSteps),

    // ── 14. مجموعة مفاتيح الأكورديون المفتوحة (فارغة) ────────────
    ClearCollect(colExpandedKeys, Blank()),

    // ── 15. مجموعة الأقسام للفلتر ────────────────────────────────
    ClearCollect(
        colDepts,
        Table({DeptAr: "الكل", DeptEn: "All"}),
        AddColumns(
            Distinct(colLeaders, DeptAr),
            "DeptEn",
            LookUp(colLeaders, DeptAr = Value, DeptEn)
        )
    )
);
// ─────────────────────────────────────────────────────────────────
```

5. اضغط على أيقونة ✓ في شريط الصيغة لحفظ الصيغة.

> **ملاحظة:** `Concurrent(...)` يُشغّل جميع الأوامر بالتوازي مما يُسرّع وقت التحميل الأولي. إذا أعطى خطأ في نسخة قديمة من Power Apps، استبدله بسطور `Set(...)` و`ClearCollect(...)` مستقلة متتالية.

### 4-B. جدول المجموعات والمتغيرات المُنشأة

| الاسم | النوع | الغرض |
|---|---|---|
| `varLang` | نصي | اللغة الحالية: `"ar"` أو `"en"` |
| `varSelectedDept` | نصي | القسم المختار في فلتر الليدرز |
| `varSelectedLeader` | سجل | سجل الليدر المختار في صفحة التفاصيل |
| `varMyKey` | نصي | مفتاح (Title) الليدر المسجّل دخولاً |
| `varShowITSM` | منطقي | يظهر/يخفي نافذة ITSM |
| `varITSMRecord` | سجل | سجل بطاقة ITSM المختارة |
| `varFormEmpName` | نصي | اسم الموظف في النموذج الجاري |
| `varFormEmpHRID` | نصي | رقم HRID للموظف |
| `varFormEmpEmail` | نصي | إيميل الموظف |
| `varFormStep` | رقمي | رقم الخطوة الحالية في المعالج (1-3) |
| `varIsSubmitting` | منطقي | مؤشر الإرسال (يُعطّل الزر أثناء الانتظار) |
| `varColorBg` | لون | `#0f172a` خلفية التطبيق |
| `varColorGold` | لون | `#FBBF24` الذهبي |
| `varColorGoldLight` | لون | ذهبي شفاف |
| `varColorCardBg` | لون | `#1e293b` خلفية البطاقات |
| `varColorText` | لون | `#f1f5f9` نص أبيض |
| `varColorTextMuted` | لون | `#94a3b8` نص ثانوي |
| `varColorBorder` | لون | `#334155` حدود |
| `varColorSuccess` | لون | أخضر |
| `varColorWarning` | لون | أصفر |
| `varColorError` | لون | أحمر |
| `colLeaders` | مجموعة | نسخة محلية من قائمة `Leaders` |
| `colEmployees` | مجموعة | نسخة محلية من قائمة `Employees` |
| `colQuickLinks` | مجموعة | نسخة محلية من قائمة `QuickLinks` |
| `colEscalationLinks` | مجموعة | نسخة محلية من قائمة `EscalationLinks` |
| `colEscalationGuide` | مجموعة | نسخة محلية من قائمة `EscalationGuide` |
| `colEscalationSteps` | مجموعة | نسخة محلية من قائمة `EscalationSteps` |
| `colExpandedKeys` | مجموعة | مفاتيح الفئات المفتوحة في الأكورديون |
| `colDepts` | مجموعة | قائمة الأقسام للفلتر (تبدأ بـ "الكل") |

---

## 5. تطبيق الثيم على الشاشات

> بعد تشغيل App.OnStart مرة واحدة (أو أثناء اختبار التطبيق) تصبح متغيرات اللون متاحة. استخدمها في خصائص كل عنصر بدلاً من الألوان المكتوبة يدوياً.

### 5-A. خلفية الشاشة

1. اضغط على أي شاشة من **Tree View** (مثل `scrHome`).
2. تأكد أنك ضغطت على الشاشة نفسها وليس عنصراً داخلها.
3. في لوحة Properties يمين الشاشة اضغط على خاصية **Fill**.
4. في شريط الصيغة الصق:
   ```powerfx
   varColorBg
   ```
5. كرر هذه الخطوة لكل شاشة من الشاشات التسع.

> **بديل سريع:** إذا لم تتوفر متغيرات اللون بعد (قبل تشغيل OnStart)، استخدم `ColorValue("#0f172a")` مباشرة في خاصية Fill لكل شاشة، ثم أبدلها بـ `varColorBg` لاحقاً.

### 5-B. جدول استخدام ألوان الثيم

| الخاصية | الصيغة | الاستخدام |
|---|---|---|
| `Fill` للشاشة | `varColorBg` | خلفية كل الشاشات |
| `Fill` للبطاقة | `varColorCardBg` | خلفية بطاقة ليدر / روابط |
| `Color` للنص الرئيسي | `varColorText` | أسماء الليدرز والعناوين |
| `Color` للنص الثانوي | `varColorTextMuted` | المسمى الوظيفي، القسم |
| `BorderColor` للبطاقة | `varColorBorder` | حدود البطاقات |
| `Fill` لزر نشط | `varColorGold` | أزرار الإجراءات والتنقل |
| `Color` لنص الزر الذهبي | `varColorBg` | النص داخل الزر الذهبي |
| `Fill` لزر معطّل | `varColorBorder` | زر الإرسال قبل اكتمال البيانات |
| `Fill` لشريحة القسم المختارة | `varColorGold` | الشريحة النشطة في فلتر الأقسام |
| `Fill` لشريحة غير مختارة | `varColorCardBg` | الشرائح الأخرى |

---

## 6. نمط اللغة الثنائية (AR/EN)

### 6-A. المبدأ العام

كل نص في التطبيق يخضع للصيغة التالية:

```powerfx
// خاصية Text لأي Label ثابت
If(
    varLang = "ar",
    "النص بالعربي",
    "English Text"
)
```

### 6-B. نص من سجل داخل معرض (Gallery)

```powerfx
// خاصية Text لـ Label اسم الليدر داخل معرض Leaders
If(
    varLang = "ar",
    ThisItem.NameAr,
    ThisItem.NameEn
)
```

```powerfx
// خاصية Text لـ Label المسمى الوظيفي داخل معرض Leaders
If(
    varLang = "ar",
    ThisItem.TitleAr,
    ThisItem.TitleEn
)
```

```powerfx
// خاصية Text لـ Label القسم داخل معرض Leaders
If(
    varLang = "ar",
    ThisItem.DeptAr,
    ThisItem.DeptEn
)
```

### 6-C. نص من متغير (صفحة التفاصيل)

```powerfx
// خاصية Text لـ Label اسم الليدر في scrLeaderDetail
If(
    varLang = "ar",
    varSelectedLeader.NameAr,
    varSelectedLeader.NameEn
)
```

### 6-D. نص فئة دليل التصعيد

```powerfx
// خاصية Text لـ Label داخل معرض EscalationGuide
If(
    varLang = "ar",
    ThisItem.CategoryAr,
    ThisItem.CategoryEn
)
```

### 6-E. نص خطوة دليل التصعيد

```powerfx
// خاصية Text لـ Label داخل معرض EscalationSteps
If(
    varLang = "ar",
    ThisItem.StepAr,
    ThisItem.StepEn
)
```

### 6-F. نص شريحة الأقسام

```powerfx
// خاصية Text لـ Label داخل [galDeptChips]
If(varLang = "ar", ThisItem.DeptAr, ThisItem.DeptEn)
```

---

## 7. عنصر زر تبديل اللغة [btnLangToggle]

> أضف هذا الزر في كل شاشة (في الشريط العلوي / Header) حتى يتمكن المستخدم من التبديل من أي مكان.

### 7-A. إنشاء الزر

1. انتقل إلى `scrHome`.
2. اضغط **Insert** → **Button**.
3. في **Tree View** أعد تسمية الزر إلى `btnLangToggle`.
4. ضعه في الزاوية العلوية اليسرى من الشاشة (في العربية يكون اليمين هو البداية، لكن زر اللغة يبقى ثابتاً في اليسار كعرف شائع).

### 7-B. خاصية Text

في شريط الصيغة لخاصية **Text** الصق:

```powerfx
// خاصية Text لـ [btnLangToggle]
If(varLang = "ar", "EN", "عربي")
```

### 7-C. خاصية OnSelect

في شريط الصيغة لخاصية **OnSelect** الصق:

```powerfx
// خاصية OnSelect لـ [btnLangToggle]
Set(
    varLang,
    If(varLang = "ar", "en", "ar")
)
```

### 7-D. تنسيق الزر

| الخاصية | القيمة |
|---|---|
| `Fill` | `varColorGold` |
| `Color` | `varColorBg` |
| `BorderRadius` | `8` |
| `Width` | `80` |
| `Height` | `40` |
| `FontSize` | `14` |

---

## 8. إرشادات RTL ومحاذاة اليمين

> Power Apps Canvas لا يعكس الواجهة تلقائياً. كل عنصر يحتاج ضبطاً يدوياً.

### 8-A. محاذاة النص لكل Label و TextInput

```powerfx
// خاصية Align لأي Label يحتوي نصاً عربياً
If(varLang = "ar", Align.Right, Align.Left)
```

> إذا التطبيق عربي فقط، يمكن تعيين `Align.Right` ثابتاً.

### 8-B. محاذاة TextInput

```powerfx
// خاصية Align لكل TextInput (مثل حقل البحث)
If(varLang = "ar", Align.Right, Align.Left)
```

### 8-C. موضع Avatar والنص في بطاقة الليدر

```powerfx
// خاصية X لـ Avatar (الدائرة) داخل بطاقة galLeaders
If(
    varLang = "ar",
    Parent.Width - 72,   // عربي: Avatar على اليمين
    8                    // إنجليزي: Avatar على اليسار
)
```

```powerfx
// خاصية X لـ Label الاسم داخل بطاقة galLeaders
If(
    varLang = "ar",
    Parent.Width - 150,  // عربي: النص يبدأ قريباً من Avatar
    80                   // إنجليزي: النص يلي Avatar من اليسار
)
```

### 8-D. موضع أزرار التواصل

```powerfx
// خاصية X لمجموعة أزرار التواصل (إيميل، هاتف، Teams) داخل بطاقة الليدر
If(
    varLang = "ar",
    8,                      // عربي: أزرار على اليسار
    Parent.Width - 120      // إنجليزي: أزرار على اليمين
)
```

### 8-E. المسافة الداخلية (Padding)

```powerfx
// خاصية PaddingLeft لـ Label
If(varLang = "ar", 0, 12)

// خاصية PaddingRight لـ Label
If(varLang = "ar", 12, 0)
```

### 8-F. محاذاة عنوان الأكورديون

```powerfx
// خاصية Align لـ Label عنوان فئة الأكورديون
Align.Right
```

### 8-G. قاعدة عامة للتخطيط اليدوي

| العنصر | الموضع في العربية | الموضع في الإنجليزية |
|---|---|---|
| Avatar / أيقونة | يمين البطاقة (X كبير) | يسار البطاقة (X صغير) |
| النص الرئيسي | يمين (بعد Avatar) | يسار (بعد Avatar) |
| أزرار التواصل | يسار البطاقة | يمين البطاقة |
| سهم الأكورديون | يسار العنوان | يمين العنوان |
| زر الرجوع | يمين الشريط العلوي | يسار الشريط العلوي |

---

## 9. التحقق من صحة الإعداد

قبل الانتقال للقسم التالي تأكد من كل البنود الآتية:

- [ ] التطبيق `Collection Barq` مُنشأ بتخطيط Tablet في بيئة `Default (globalfinancingsolutions)`
- [ ] القوائم السبع ظاهرة في لوحة **Data**: Leaders, Employees, QuickLinks, EscalationLinks, EscalationGuide, EscalationSteps, DownloadLog
- [ ] الشاشات التسع مُنشأة بأسمائها الصحيحة في **Tree View**
- [ ] `App.OnStart` يحتوي صيغة `Concurrent(...)` الكاملة بدون أخطاء (لا يوجد خط أحمر تحت أي سطر)
- [ ] خاصية `Fill` لكل شاشة تحتوي `varColorBg`
- [ ] الزر `btnLangToggle` موجود في `scrHome` ويعمل (اضغط ▶ Preview وجرّبه)
- [ ] عند الضغط على ▶ Preview لا توجد رسالة خطأ حمراء في شريط الإشعارات

---

## 10. ملاحظات إضافية للوكيل المنفّذ

1. **مصدر البيانات مقابل المجموعة المحلية:** بعد تشغيل `App.OnStart` استخدم `colLeaders` و`colEmployees` وما شابهها (المجموعات المحلية) في خصائص `Items` للمعارض — لا تستخدم `Leaders` و`Employees` مباشرة إلا في صيغة `LookUp` التي تكتب إلى SharePoint.

2. **قيمة `varLang`:** القيمة هي `"ar"` (حروف صغيرة) وليس `"AR"` — تأكد من التطابق في كل صيغة `If(varLang = "ar", ...)`.

3. **شريط الخطأ في Formula Bar:** إذا ظهر خط أحمر تحت اسم متغير، فالسبب الأكثر شيوعاً هو عدم تشغيل `App.OnStart` بعد. اضغط ▶ Preview مرة واحدة ثم عد.

4. **إصدار Power Apps والـ Concurrent:** `Concurrent()` متاح في الإصدارات الحديثة. إذا رفضه المحرر، استبدله بسلسلة من `;` مثل:
   ```powerfx
   Set(varLang, "ar");
   Set(varSelectedDept, "الكل");
   ClearCollect(colLeaders, Leaders);
   // ... إلخ
   ```

5. **ترتيب ClearCollect داخل Concurrent:** `colDepts` يعتمد على `colLeaders` — إذا استخدمت سلسلة `;` بدلاً من `Concurrent`، تأكد أن `ClearCollect(colLeaders, ...)` يأتي **قبل** `ClearCollect(colDepts, ...)`.

---

*يُكمل هذا القسم من حيث انتهى إعداد القوائم (Phase 1) ويُمهّد لبناء الشاشات في القسم 06b.*


---
# 🖥️ المرحلة ٣: بناء الشاشات
# القسم 06b — الشاشات الأساسية (Core Screens)

> **ملاحظة للمنفّذ (وكيل الأتمتة):**
> - جميع أسماء الشاشات والعناصر والمتغيرات مأخوذة **حرفياً** من `02-Build-Guide.md` و`03-PowerFx-Cookbook.md`.
> - الصيغ مكتوبة بـ Power Fx — انسخها كما هي في شريط الصيغة (Formula Bar).
> - قيمة `varLang` تساوي `"ar"` أو `"en"` (أحرف صغيرة)، كما حُدّد في `App.OnStart`.
> - الشاشات التسع ينبغي أن تكون موجودة بالفعل بأسمائها الصحيحة من القسم 06a (إنشاء التطبيق). هذا القسم يملأ محتواها.
> - **الثيم:** خلفية كل شاشة = `varColorBg` (`#0f172a`)، أكسنت = `varColorGold` (`#FBBF24`)، كروت = `varColorCardBg` (`#1e293b`).
> - **RTL:** كل Label وTextInput يجب أن تكون خاصية `Align` = `Align.Right` عند `varLang = "ar"`.

---

## المحتويات

1. [شاشة `scrHome` — الرئيسية](#1-شاشة-scrhome)
2. [شاشة `scrLeaders` — دليل الليدرز](#2-شاشة-scrleaders)
3. [شاشة `scrLeaderDetail` — تفاصيل الليدر](#3-شاشة-scrleaderdetail)
4. [شاشة `scrQuickLinks` — الروابط السريعة](#4-شاشة-scrquicklinks)
5. [شاشة `scrEscalationLinks` — روابط التصعيد](#5-شاشة-screscalationlinks)
6. [شاشة `scrEscalationGuide` — دليل التصعيد](#6-شاشة-screscalationguide)

---

## 1. شاشة `scrHome`

### 1.1 تهيئة الشاشة

1. في **Tree View** اضغط على `scrHome`.
2. في لوحة الخصائص (Properties) عيّن:
   - **Fill:** `varColorBg`
3. تأكد أن `App.OnStart` يحتوي على الكود التالي (من `03-PowerFx-Cookbook.md` § 1):

```powerfx
// App → OnStart
Concurrent(
    Set(varLang, "ar"),
    Set(varSelectedDept, "الكل"),
    ClearCollect(colLeaders, Leaders),
    ClearCollect(colEmployees, Employees),
    ClearCollect(colQuickLinks, QuickLinks),
    ClearCollect(colEscalationLinks, EscalationLinks),
    ClearCollect(colEscalationGuide, EscalationGuide),
    ClearCollect(colEscalationSteps, EscalationSteps),
    ClearCollect(colExpandedKeys, Blank()),
    Set(varSelectedLeader, Blank()),
    Set(varShowITSM, false),
    Set(varITSMRecord, Blank()),
    Set(varFormStep, 1),
    Set(varFormEmpName, ""),
    Set(varFormEmpHRID, ""),
    Set(varFormEmpEmail, ""),
    Set(varMyKey, LookUp(colLeaders, Email = User().Email, Title)),
    Set(varColorBg,        Color.FromArgb(255, 15,  23, 42)),
    Set(varColorGold,      Color.FromArgb(255, 251, 191, 36)),
    Set(varColorGoldLight, Color.FromArgb(180, 251, 191, 36)),
    Set(varColorCardBg,    Color.FromArgb(255, 30,  41, 59)),
    Set(varColorText,      Color.FromArgb(255, 241, 245, 249)),
    Set(varColorTextMuted, Color.FromArgb(255, 148, 163, 184)),
    Set(varColorBorder,    Color.FromArgb(255, 51,  65,  85))
)
```

---

### 1.2 الشعار — `imgLogo`

1. اضغط **Insert → Media → Image**.
2. سمّ العنصر `imgLogo`.
3. في لوحة Properties → **Image**: اضغط على أيقونة الصورة وارفع `logo.png` (المُصدَّر من `assets/logo.svg`).
4. عيّن الخصائص:

| الخاصية | القيمة |
|---|---|
| X | `(Parent.Width - 120) / 2` |
| Y | `24` |
| Width | `120` |
| Height | `120` |
| ImagePosition | `ImagePosition.Fit` |
| BorderThickness | `0` |

---

### 1.3 عنوان التطبيق — `lblAppTitle`

1. اضغط **Insert → Text → Label**.
2. سمّه `lblAppTitle`.
3. في شريط الصيغة الصق في خاصية **Text**:

```powerfx
If(varLang = "ar", "كوليكشن برق", "Collection Barq")
```

4. عيّن الخصائص:

| الخاصية | القيمة |
|---|---|
| X | `0` |
| Y | `imgLogo.Y + imgLogo.Height + 12` |
| Width | `Parent.Width` |
| Height | `44` |
| Size | `28` |
| Color | `varColorGold` |
| Align | `Align.Center` |
| Font | `Font.SegoeUI` |
| FontWeight | `FontWeight.Bold` |
| Fill | `Transparent` |

---

### 1.4 أزرار التنقل — `btnNav_*`

أضف **7 أزرار** (Button) مرتبة عمودياً. ابدأ من Y = `lblAppTitle.Y + lblAppTitle.Height + 24`. ارفع كل زر بارتفاع `52` ومسافة `12` بين الأزرار.

لكل زر، نفّذ الخطوات:
1. اضغط **Insert → Button**.
2. عيّن الاسم والخصائص من الجدول أدناه.
3. في شريط الصيغة الصق صيغة `Text` و`OnSelect`.

| الاسم | خاصية `Text` | خاصية `OnSelect` |
|---|---|---|
| `btnNavLeaders` | `If(varLang="ar","دليل الليدرز","Leaders Directory")` | `Navigate(scrLeaders, ScreenTransition.Fade)` |
| `btnNavQuickLinks` | `If(varLang="ar","الروابط السريعة","Quick Links")` | `Navigate(scrQuickLinks, ScreenTransition.Fade)` |
| `btnNavEscLinks` | `If(varLang="ar","روابط التصعيد","Escalation Links")` | `Navigate(scrEscalationLinks, ScreenTransition.Fade)` |
| `btnNavEscGuide` | `If(varLang="ar","دليل التصعيد","Escalation Guide")` | `Navigate(scrEscalationGuide, ScreenTransition.Fade)` |
| `btnNavViolation` | `If(varLang="ar","نموذج مخالفة","Violation Form")` | `Navigate(scrFormViolation, ScreenTransition.Fade)` |
| `btnNavResignation` | `If(varLang="ar","نموذج استقالة","Resignation Form")` | `Navigate(scrFormResignation, ScreenTransition.Fade)` |
| `btnNavLeave` | `If(varLang="ar","نموذج إجازة","Leave Form")` | `Navigate(scrFormLeave, ScreenTransition.Fade)` |

**خصائص مشتركة لكل زر التنقل:**

| الخاصية | القيمة |
|---|---|
| X | `24` |
| Width | `Parent.Width - 48` |
| Height | `52` |
| Fill | `varColorCardBg` |
| Color | `varColorGold` |
| BorderColor | `varColorBorder` |
| BorderThickness | `1` |
| RadiusTopLeft | `8` |
| RadiusTopRight | `8` |
| RadiusBottomLeft | `8` |
| RadiusBottomRight | `8` |
| Size | `16` |
| Align | `Align.Center` |
| HoverFill | `varColorBorder` |
| PressedFill | `varColorGold` |
| PressedColor | `varColorBg` |

---

### 1.5 زر تبديل اللغة — `btnLangToggle`

1. اضغط **Insert → Button**.
2. سمّه `btnLangToggle`.
3. في شريط الصيغة الصق في **Text**:

```powerfx
If(varLang = "ar", "EN", "عربي")
```

4. في شريط الصيغة الصق في **OnSelect**:

```powerfx
Set(varLang, If(varLang = "ar", "en", "ar"))
```

5. عيّن الخصائص:

| الخاصية | القيمة |
|---|---|
| X | `Parent.Width - 80` |
| Y | `16` |
| Width | `64` |
| Height | `36` |
| Fill | `varColorGold` |
| Color | `varColorBg` |
| RadiusTopLeft | `18` |
| RadiusTopRight | `18` |
| RadiusBottomLeft | `18` |
| RadiusBottomRight | `18` |
| Size | `14` |
| FontWeight | `FontWeight.Bold` |

---

### 1.6 مؤشر اسم المستخدم — `lblWelcome`

1. اضغط **Insert → Text → Label**.
2. سمّه `lblWelcome`.
3. في شريط الصيغة الصق في **Text**:

```powerfx
If(
    varLang = "ar",
    "مرحباً، " & User().FullName,
    "Welcome, " & User().FullName
)
```

4. عيّن:

| الخاصية | القيمة |
|---|---|
| X | `0` |
| Y | `btnLangToggle.Y + btnLangToggle.Height + 8` |
| Width | `Parent.Width` |
| Height | `28` |
| Color | `varColorTextMuted` |
| Size | `13` |
| Align | `Align.Center` |
| Fill | `Transparent` |

---

## 2. شاشة `scrLeaders`

### 2.1 تهيئة الشاشة

1. اضغط على `scrLeaders` في Tree View.
2. **Fill:** `varColorBg`.

---

### 2.2 رأس الصفحة — `lblLeadersHeader`

1. **Insert → Text → Label** → اسمه `lblLeadersHeader`.
2. في **Text**:

```powerfx
If(varLang = "ar", "دليل الليدرز", "Leaders Directory")
```

3. الخصائص:

| الخاصية | القيمة |
|---|---|
| X | `0` |
| Y | `16` |
| Width | `Parent.Width - 80` |
| Height | `40` |
| Size | `22` |
| Color | `varColorGold` |
| Align | `Align.Right` |
| PaddingRight | `16` |
| Fill | `Transparent` |
| FontWeight | `FontWeight.Bold` |

---

### 2.3 زر الرجوع — `btnBackLeaders`

1. **Insert → Icons → Left** (أو Button نصي) → اسمه `btnBackLeaders`.
2. في **OnSelect**:

```powerfx
Navigate(scrHome, ScreenTransition.Fade)
```

3. الخصائص:

| الخاصية | القيمة |
|---|---|
| X | `8` |
| Y | `16` |
| Width | `40` |
| Height | `40` |
| Color | `varColorGold` |
| Fill | `Transparent` |

---

### 2.4 مربع البحث — `txtSearchLeaders`

1. **Insert → Input → Text input** → اسمه `txtSearchLeaders`.
2. في **HintText**:

```powerfx
If(varLang = "ar", "ابحث بالاسم أو المسمى أو القسم...", "Search by name, title or dept...")
```

3. الخصائص:

| الخاصية | القيمة |
|---|---|
| X | `16` |
| Y | `lblLeadersHeader.Y + lblLeadersHeader.Height + 12` |
| Width | `Parent.Width - 32` |
| Height | `44` |
| Align | `If(varLang="ar", Align.Right, Align.Left)` |
| Fill | `varColorCardBg` |
| Color | `varColorText` |
| BorderColor | `varColorBorder` |
| BorderThickness | `1` |
| RadiusTopLeft | `8` |
| RadiusTopRight | `8` |
| RadiusBottomLeft | `8` |
| RadiusBottomRight | `8` |
| PaddingLeft | `If(varLang="ar", 8, 12)` |
| PaddingRight | `If(varLang="ar", 12, 8)` |

---

### 2.5 معرض شرائح الأقسام — `galDeptChips`

> قبل إضافة المعرض، تأكد أن `App.OnStart` يحتوي على هذا السطر داخل `Concurrent` (أضفه إن لم يكن موجوداً):

```powerfx
// داخل Concurrent في App.OnStart
ClearCollect(
    colDepts,
    Table({DeptAr: "الكل", DeptEn: "All"}),
    AddColumns(
        Distinct(colLeaders, DeptAr),
        "DeptEn",
        LookUp(colLeaders, DeptAr = Value, DeptEn)
    )
)
```

1. **Insert → Gallery → Horizontal** → اسمه `galDeptChips`.
2. في شريط الصيغة الصق في **Items**:

```powerfx
colDepts
```

3. الخصائص الخارجية للمعرض:

| الخاصية | القيمة |
|---|---|
| X | `0` |
| Y | `txtSearchLeaders.Y + txtSearchLeaders.Height + 8` |
| Width | `Parent.Width` |
| Height | `48` |
| TemplatePadding | `4` |
| ShowScrollbar | `false` |
| Fill | `Transparent` |

4. **داخل قالب `galDeptChips`**، أضف **Rectangle** اسمه `rectChip`:

| الخاصية | القيمة |
|---|---|
| Width | `Parent.TemplateWidth` |
| Height | `Parent.TemplateHeight` |
| RadiusTopLeft | `20` |
| RadiusTopRight | `20` |
| RadiusBottomLeft | `20` |
| RadiusBottomRight | `20` |
| Fill | `If(ThisItem.DeptAr = varSelectedDept, varColorGold, varColorCardBg)` |
| BorderColor | `If(ThisItem.DeptAr = varSelectedDept, varColorGold, varColorBorder)` |
| BorderThickness | `1` |

5. **داخل قالب `galDeptChips`**، أضف **Label** اسمه `lblChipText`:

```powerfx
// خاصية Text
If(varLang = "ar", ThisItem.DeptAr, ThisItem.DeptEn)
```

| الخاصية | القيمة |
|---|---|
| Color | `If(ThisItem.DeptAr = varSelectedDept, varColorBg, varColorText)` |
| Align | `Align.Center` |
| Size | `13` |
| PaddingLeft | `12` |
| PaddingRight | `12` |

6. **خاصية `OnSelect` لقالب `galDeptChips`** (اضغط على الـ Template نفسه):

```powerfx
Set(varSelectedDept, ThisItem.DeptAr)
```

---

### 2.6 معرض الليدرز — `galLeaders`

1. **Insert → Gallery → Vertical** → اسمه `galLeaders`.
2. في شريط الصيغة الصق في **Items**:

```powerfx
// خاصية Items لـ galLeaders
SortByColumns(
    Filter(
        colLeaders,
        // ── فلتر القسم ──────────────────────────────────────
        varSelectedDept = "الكل" || DeptAr = varSelectedDept,
        // ── فلتر البحث (عربي + إنجليزي) ─────────────────────
        IsBlank(txtSearchLeaders.Text)
            || txtSearchLeaders.Text = ""
            || StartsWith(NameAr,  txtSearchLeaders.Text)
            || StartsWith(NameEn,  txtSearchLeaders.Text)
            || StartsWith(TitleAr, txtSearchLeaders.Text)
            || StartsWith(DeptAr,  txtSearchLeaders.Text)
    ),
    "NameAr", SortOrder.Ascending
)
```

3. الخصائص الخارجية:

| الخاصية | القيمة |
|---|---|
| X | `0` |
| Y | `galDeptChips.Y + galDeptChips.Height + 8` |
| Width | `Parent.Width` |
| Height | `Parent.Height - galDeptChips.Y - galDeptChips.Height - 8` |
| TemplateSize | `88` |
| TemplatePadding | `0` |
| Fill | `Transparent` |
| ShowScrollbar | `true` |

---

### 2.7 محتوى بطاقة الليدر داخل `galLeaders`

أضف العناصر التالية **داخل قالب `galLeaders`**:

#### أ) خلفية البطاقة — `rectLeaderCard`

1. **Insert → Shapes → Rectangle** → اسمه `rectLeaderCard`.

| الخاصية | القيمة |
|---|---|
| X | `8` |
| Y | `4` |
| Width | `Parent.TemplateWidth - 16` |
| Height | `80` |
| Fill | `varColorCardBg` |
| BorderColor | `varColorBorder` |
| BorderThickness | `1` |
| RadiusTopLeft | `12` |
| RadiusTopRight | `12` |
| RadiusBottomLeft | `12` |
| RadiusBottomRight | `12` |

#### ب) دائرة الأحرف الأولى (Avatar) — `cirAvatar`

1. **Insert → Shapes → Circle** → اسمه `cirAvatar`.

| الخاصية | القيمة |
|---|---|
| X | `If(varLang="ar", Parent.TemplateWidth - 72, 16)` |
| Y | `16` |
| Width | `56` |
| Height | `56` |
| Fill | `varColorGold` |
| BorderThickness | `0` |

#### ج) نص الأحرف الأولى — `lblInitials`

1. **Insert → Text → Label** → اسمه `lblInitials`.
2. في **Text** الصق (من `03-PowerFx-Cookbook.md` § 6):

```powerfx
If(
    IsBlank(Find(" ", ThisItem.NameEn)),
    Upper(Left(ThisItem.NameEn, 2)),
    Concatenate(
        Upper(Left(ThisItem.NameEn, 1)),
        Upper(Mid(ThisItem.NameEn, Find(" ", ThisItem.NameEn) + 1, 1))
    )
)
```

| الخاصية | القيمة |
|---|---|
| X | `cirAvatar.X` |
| Y | `cirAvatar.Y` |
| Width | `cirAvatar.Width` |
| Height | `cirAvatar.Height` |
| Align | `Align.Center` |
| VerticalAlign | `VerticalAlign.Middle` |
| Color | `varColorBg` |
| Size | `18` |
| FontWeight | `FontWeight.Bold` |
| Fill | `Transparent` |

#### د) اسم الليدر — `lblLeaderName`

1. **Insert → Text → Label** → اسمه `lblLeaderName`.
2. في **Text**:

```powerfx
If(varLang = "ar", ThisItem.NameAr, ThisItem.NameEn)
```

| الخاصية | القيمة |
|---|---|
| X | `If(varLang="ar", 16, 80)` |
| Y | `16` |
| Width | `Parent.TemplateWidth - 112` |
| Height | `26` |
| Color | `varColorText` |
| Size | `15` |
| FontWeight | `FontWeight.Bold` |
| Align | `If(varLang="ar", Align.Right, Align.Left)` |
| Fill | `Transparent` |

#### ه) المسمى الوظيفي — `lblLeaderTitle`

1. **Insert → Text → Label** → اسمه `lblLeaderTitle`.
2. في **Text**:

```powerfx
If(varLang = "ar", ThisItem.TitleAr, ThisItem.TitleEn)
```

| الخاصية | القيمة |
|---|---|
| X | `lblLeaderName.X` |
| Y | `lblLeaderName.Y + lblLeaderName.Height + 2` |
| Width | `lblLeaderName.Width` |
| Height | `22` |
| Color | `varColorGold` |
| Size | `12` |
| Align | `If(varLang="ar", Align.Right, Align.Left)` |
| Fill | `Transparent` |

#### و) اسم القسم — `lblLeaderDept`

1. **Insert → Text → Label** → اسمه `lblLeaderDept`.
2. في **Text**:

```powerfx
If(varLang = "ar", ThisItem.DeptAr, ThisItem.DeptEn)
```

| الخاصية | القيمة |
|---|---|
| X | `lblLeaderName.X` |
| Y | `lblLeaderTitle.Y + lblLeaderTitle.Height + 2` |
| Width | `lblLeaderName.Width` |
| Height | `20` |
| Color | `varColorTextMuted` |
| Size | `11` |
| Align | `If(varLang="ar", Align.Right, Align.Left)` |
| Fill | `Transparent` |

#### ز) أزرار التواصل السريع (إيميل + هاتف + Teams)

أضف ثلاثة أيقونات/أزرار صغيرة في أسفل يسار البطاقة:

**زر الإيميل — `btnCardEmail`:**
1. **Insert → Icons → Email** → اسمه `btnCardEmail`.
2. في **OnSelect** (من `03-PowerFx-Cookbook.md` § 7-A):

```powerfx
If(
    !IsBlank(ThisItem.Email) && ThisItem.Email <> "",
    Launch("mailto:" & ThisItem.Email),
    Notify(
        If(varLang="ar","لا يوجد إيميل لهذا الليدر","No email for this leader"),
        NotificationType.Warning
    )
)
```

| الخاصية | القيمة |
|---|---|
| X | `If(varLang="ar", 16, Parent.TemplateWidth - 108)` |
| Y | `46` |
| Width | `28` |
| Height | `28` |
| Color | `varColorTextMuted` |
| Fill | `Transparent` |
| Visible | `!IsBlank(ThisItem.Email) && ThisItem.Email <> ""` |

**زر الهاتف — `btnCardPhone`:**
1. **Insert → Icons → Phone** → اسمه `btnCardPhone`.
2. في **OnSelect** (من `03-PowerFx-Cookbook.md` § 7-B):

```powerfx
If(
    !IsBlank(ThisItem.Phone) && ThisItem.Phone <> "",
    Launch("tel:" & ThisItem.Phone),
    Notify(
        If(varLang="ar","لا يوجد رقم هاتف","No phone number"),
        NotificationType.Warning
    )
)
```

| الخاصية | القيمة |
|---|---|
| X | `btnCardEmail.X + 36` |
| Y | `46` |
| Width | `28` |
| Height | `28` |
| Color | `varColorTextMuted` |
| Fill | `Transparent` |
| Visible | `!IsBlank(ThisItem.Phone) && ThisItem.Phone <> ""` |

**زر Teams — `btnCardTeams`:**
1. **Insert → Icons → Chat** (أو أي أيقونة متاحة) → اسمه `btnCardTeams`.
2. في **OnSelect** (من `03-PowerFx-Cookbook.md` § 7-C):

```powerfx
If(
    !IsBlank(ThisItem.Teams) && ThisItem.Teams <> "",
    Launch(ThisItem.Teams),
    If(
        !IsBlank(ThisItem.Email) && ThisItem.Email <> "",
        Launch("https://teams.microsoft.com/l/chat/0/0?users=" & ThisItem.Email),
        Notify(
            If(varLang="ar","لا يوجد رابط Teams","No Teams link"),
            NotificationType.Warning
        )
    )
)
```

| الخاصية | القيمة |
|---|---|
| X | `btnCardPhone.X + 36` |
| Y | `46` |
| Width | `28` |
| Height | `28` |
| Color | `varColorTextMuted` |
| Fill | `Transparent` |
| Visible | `!IsBlank(ThisItem.Email) && ThisItem.Email <> ""` |

#### ح) `OnSelect` للبطاقة كلها (اضغط على `rectLeaderCard`)

في **OnSelect** لـ `rectLeaderCard` (من `03-PowerFx-Cookbook.md` § 8):

```powerfx
Set(varSelectedLeader, ThisItem);
Navigate(scrLeaderDetail, ScreenTransition.Fade)
```

---

## 3. شاشة `scrLeaderDetail`

### 3.1 تهيئة الشاشة

1. اضغط على `scrLeaderDetail` في Tree View.
2. **Fill:** `varColorBg`.

> هذه الشاشة تعرض بيانات المتغير `varSelectedLeader` الذي حُفظ عند الضغط على بطاقة الليدر.

---

### 3.2 زر الرجوع — `btnBackDetail`

1. **Insert → Icons → Left** → اسمه `btnBackDetail`.
2. في **OnSelect**:

```powerfx
Back()
```

| الخاصية | القيمة |
|---|---|
| X | `8` |
| Y | `16` |
| Width | `40` |
| Height | `40` |
| Color | `varColorGold` |
| Fill | `Transparent` |

---

### 3.3 دائرة الأحرف الأولى الكبيرة — `cirDetailAvatar`

1. **Insert → Shapes → Circle** → اسمه `cirDetailAvatar`.

| الخاصية | القيمة |
|---|---|
| X | `(Parent.Width - 80) / 2` |
| Y | `72` |
| Width | `80` |
| Height | `80` |
| Fill | `varColorGold` |
| BorderThickness | `0` |

**Label الأحرف — `lblDetailInitials`:**

```powerfx
// خاصية Text
If(
    IsBlank(Find(" ", varSelectedLeader.NameEn)),
    Upper(Left(varSelectedLeader.NameEn, 2)),
    Concatenate(
        Upper(Left(varSelectedLeader.NameEn, 1)),
        Upper(Mid(varSelectedLeader.NameEn, Find(" ", varSelectedLeader.NameEn) + 1, 1))
    )
)
```

| الخاصية | القيمة |
|---|---|
| X | `cirDetailAvatar.X` |
| Y | `cirDetailAvatar.Y` |
| Width | `80` |
| Height | `80` |
| Align | `Align.Center` |
| VerticalAlign | `VerticalAlign.Middle` |
| Color | `varColorBg` |
| Size | `24` |
| FontWeight | `FontWeight.Bold` |
| Fill | `Transparent` |

---

### 3.4 تسميات بيانات الليدر

أضف Labels تالية بدءاً من `Y = cirDetailAvatar.Y + 96`:

**الاسم الكامل — `lblDetailName`:**

```powerfx
// خاصية Text
If(varLang = "ar", varSelectedLeader.NameAr, varSelectedLeader.NameEn)
```

| الخاصية | القيمة |
|---|---|
| X | `16` |
| Width | `Parent.Width - 32` |
| Height | `32` |
| Size | `20` |
| Color | `varColorText` |
| FontWeight | `FontWeight.Bold` |
| Align | `Align.Center` |
| Fill | `Transparent` |

**المسمى الوظيفي — `lblDetailTitle`:**

```powerfx
If(varLang = "ar", varSelectedLeader.TitleAr, varSelectedLeader.TitleEn)
```

| الخاصية | القيمة |
|---|---|
| X | `16` |
| Width | `Parent.Width - 32` |
| Height | `26` |
| Size | `14` |
| Color | `varColorGold` |
| Align | `Align.Center` |
| Fill | `Transparent` |

**القسم — `lblDetailDept`:**

```powerfx
If(varLang = "ar", varSelectedLeader.DeptAr, varSelectedLeader.DeptEn)
```

| الخاصية | القيمة |
|---|---|
| X | `16` |
| Width | `Parent.Width - 32` |
| Height | `22` |
| Size | `13` |
| Color | `varColorTextMuted` |
| Align | `Align.Center` |
| Fill | `Transparent` |

**الإيميل — `lblDetailEmail`:**

```powerfx
varSelectedLeader.Email
```

| الخاصية | القيمة |
|---|---|
| X | `16` |
| Width | `Parent.Width - 32` |
| Height | `22` |
| Size | `12` |
| Color | `varColorTextMuted` |
| Align | `Align.Center` |
| Fill | `Transparent` |

**يُرفع إلى — `lblDetailReportsTo`** (اعرضه فقط إذا كانت القيمة غير فارغة):

```powerfx
// خاصية Text
If(
    varLang = "ar",
    If(!IsBlank(varSelectedLeader.ReportsTo), "يُرفع إلى: " & varSelectedLeader.ReportsTo, ""),
    If(!IsBlank(varSelectedLeader.ReportsTo), "Reports To: " & varSelectedLeader.ReportsTo, "")
)
```

| الخاصية | القيمة |
|---|---|
| X | `16` |
| Width | `Parent.Width - 32` |
| Height | `22` |
| Size | `12` |
| Color | `varColorTextMuted` |
| Align | `Align.Center` |
| Visible | `!IsBlank(varSelectedLeader.ReportsTo) && varSelectedLeader.ReportsTo <> ""` |
| Fill | `Transparent` |

---

### 3.5 أزرار التواصل التفصيلية

أضف ثلاثة أزرار أفقية تحت التسميات (Y ≈ `lblDetailReportsTo.Y + 40`):

**زر الإيميل — `btnDetailEmail`:**

```powerfx
// خاصية Text
If(varLang = "ar", "مراسلة بالإيميل", "Send Email")
```

```powerfx
// خاصية OnSelect
If(
    !IsBlank(varSelectedLeader.Email) && varSelectedLeader.Email <> "",
    Launch("mailto:" & varSelectedLeader.Email),
    Notify(
        If(varLang="ar","لا يوجد إيميل","No email available"),
        NotificationType.Warning
    )
)
```

| الخاصية | القيمة |
|---|---|
| X | `16` |
| Width | `(Parent.Width - 56) / 3` |
| Height | `44` |
| Fill | `varColorCardBg` |
| Color | `varColorGold` |
| BorderColor | `varColorBorder` |
| BorderThickness | `1` |
| RadiusTopLeft | `8` |
| RadiusTopRight | `8` |
| RadiusBottomLeft | `8` |
| RadiusBottomRight | `8` |
| Size | `13` |

**زر الهاتف — `btnDetailPhone`:**

```powerfx
// خاصية Text
If(varLang = "ar", "اتصال", "Call")
```

```powerfx
// خاصية OnSelect
If(
    !IsBlank(varSelectedLeader.Phone) && varSelectedLeader.Phone <> "",
    Launch("tel:" & varSelectedLeader.Phone),
    Notify(
        If(varLang="ar","لا يوجد رقم هاتف","No phone number"),
        NotificationType.Warning
    )
)
```

| الخاصية | القيمة |
|---|---|
| X | `btnDetailEmail.X + btnDetailEmail.Width + 12` |
| Width | `btnDetailEmail.Width` |
| Height | `44` |
| Fill | `varColorCardBg` |
| Color | `varColorGold` |
| BorderColor | `varColorBorder` |
| BorderThickness | `1` |
| RadiusTopLeft | `8` |
| RadiusTopRight | `8` |
| RadiusBottomLeft | `8` |
| RadiusBottomRight | `8` |
| Size | `13` |

**زر Teams — `btnDetailTeams`:**

```powerfx
// خاصية Text
"Teams"
```

```powerfx
// خاصية OnSelect
If(
    !IsBlank(varSelectedLeader.Teams) && varSelectedLeader.Teams <> "",
    Launch(varSelectedLeader.Teams),
    If(
        !IsBlank(varSelectedLeader.Email) && varSelectedLeader.Email <> "",
        Launch("https://teams.microsoft.com/l/chat/0/0?users=" & varSelectedLeader.Email),
        Notify(
            If(varLang="ar","لا يوجد رابط Teams","No Teams link"),
            NotificationType.Warning
        )
    )
)
```

| الخاصية | القيمة |
|---|---|
| X | `btnDetailPhone.X + btnDetailPhone.Width + 12` |
| Width | `btnDetailEmail.Width` |
| Height | `44` |
| Fill | `varColorCardBg` |
| Color | `Color.FromArgb(255, 100, 153, 255)` |
| BorderColor | `varColorBorder` |
| BorderThickness | `1` |
| RadiusTopLeft | `8` |
| RadiusTopRight | `8` |
| RadiusBottomLeft | `8` |
| RadiusBottomRight | `8` |
| Size | `13` |

---

### 3.6 فاصل وعنوان موظفي الليدر — `lblLeaderEmployeesTitle`

```powerfx
// خاصية Text
If(varLang = "ar", "الموظفون المرتبطون", "Direct Reports")
```

| الخاصية | القيمة |
|---|---|
| X | `16` |
| Y | `btnDetailEmail.Y + btnDetailEmail.Height + 20` |
| Width | `Parent.Width - 32` |
| Height | `28` |
| Color | `varColorGold` |
| Size | `15` |
| FontWeight | `FontWeight.Bold` |
| Align | `If(varLang="ar", Align.Right, Align.Left)` |
| Fill | `Transparent` |

---

### 3.7 معرض موظفي الليدر — `galLeaderEmployees`

1. **Insert → Gallery → Vertical** → اسمه `galLeaderEmployees`.
2. في **Items**:

```powerfx
SortByColumns(
    Filter(colEmployees, ManagerKey = varSelectedLeader.Key),
    "Name", SortOrder.Ascending
)
```

3. الخصائص:

| الخاصية | القيمة |
|---|---|
| X | `0` |
| Y | `lblLeaderEmployeesTitle.Y + lblLeaderEmployeesTitle.Height + 8` |
| Width | `Parent.Width` |
| Height | `Parent.Height - lblLeaderEmployeesTitle.Y - 44` |
| TemplateSize | `56` |
| Fill | `Transparent` |

4. داخل القالب، أضف **Label** اسمه `lblEmpName`:

```powerfx
// خاصية Text
ThisItem.Name
```

| الخاصية | القيمة |
|---|---|
| X | `If(varLang="ar", 16, 64)` |
| Y | `8` |
| Width | `Parent.TemplateWidth - 80` |
| Height | `22` |
| Color | `varColorText` |
| Size | `14` |
| Align | `If(varLang="ar", Align.Right, Align.Left)` |
| Fill | `Transparent` |

أضف **Label** آخر اسمه `lblEmpJobTitle`:

```powerfx
// خاصية Text
ThisItem.JobTitle
```

| الخاصية | القيمة |
|---|---|
| X | `lblEmpName.X` |
| Y | `lblEmpName.Y + lblEmpName.Height + 2` |
| Width | `lblEmpName.Width` |
| Height | `18` |
| Color | `varColorTextMuted` |
| Size | `11` |
| Align | `If(varLang="ar", Align.Right, Align.Left)` |
| Fill | `Transparent` |

---

## 4. شاشة `scrQuickLinks`

### 4.1 تهيئة الشاشة

1. اضغط على `scrQuickLinks` في Tree View.
2. **Fill:** `varColorBg`.

---

### 4.2 رأس الصفحة وزر الرجوع

أضف `lblQuickLinksHeader` و`btnBackQuickLinks` بنفس نمط شاشة `scrLeaders`:

```powerfx
// خاصية Text لـ lblQuickLinksHeader
If(varLang = "ar", "الروابط السريعة", "Quick Links")
```

```powerfx
// خاصية OnSelect لـ btnBackQuickLinks
Navigate(scrHome, ScreenTransition.Fade)
```

---

### 4.3 عنوان قسم Quick — `lblSectionQuick`

```powerfx
// خاصية Text
If(varLang = "ar", "الروابط الرئيسية", "Main Links")
```

| الخاصية | القيمة |
|---|---|
| X | `16` |
| Y | `lblQuickLinksHeader.Y + lblQuickLinksHeader.Height + 16` |
| Width | `Parent.Width - 32` |
| Height | `24` |
| Color | `varColorGold` |
| Size | `13` |
| Align | `If(varLang="ar", Align.Right, Align.Left)` |
| Fill | `Transparent` |

---

### 4.4 معرض الروابط السريعة — `galQuickLinks`

1. **Insert → Gallery → Horizontal** → اسمه `galQuickLinks`.
2. في **Items** (من `03-PowerFx-Cookbook.md` § 9-A):

```powerfx
SortByColumns(
    Filter(colQuickLinks, Section = "Quick"),
    "LabelEn", SortOrder.Ascending
)
```

3. الخصائص:

| الخاصية | القيمة |
|---|---|
| X | `0` |
| Y | `lblSectionQuick.Y + lblSectionQuick.Height + 8` |
| Width | `Parent.Width` |
| Height | `120` |
| TemplateSize | `140` |
| TemplatePadding | `8` |
| ShowScrollbar | `false` |
| Fill | `Transparent` |

4. داخل القالب، أضف **Rectangle** اسمه `rectQLCard`:

| الخاصية | القيمة |
|---|---|
| Width | `Parent.TemplateWidth - 8` |
| Height | `Parent.TemplateHeight` |
| Fill | `varColorCardBg` |
| BorderColor | `varColorBorder` |
| BorderThickness | `1` |
| RadiusTopLeft | `12` |
| RadiusTopRight | `12` |
| RadiusBottomLeft | `12` |
| RadiusBottomRight | `12` |

5. داخل القالب، أضف **Label** اسمه `lblQLName`:

```powerfx
// خاصية Text
If(varLang = "ar", ThisItem.LabelAr, ThisItem.LabelEn)
```

| الخاصية | القيمة |
|---|---|
| X | `4` |
| Y | `64` |
| Width | `Parent.TemplateWidth - 16` |
| Height | `40` |
| Color | `varColorText` |
| Size | `12` |
| Align | `Align.Center` |
| Fill | `Transparent` |

6. **خاصية `OnSelect` للقالب** (من `03-PowerFx-Cookbook.md` § 9-D):

```powerfx
If(
    !IsBlank(ThisItem.Phone) && ThisItem.Phone <> "",
    Set(varITSMRecord, ThisItem);
    Set(varShowITSM, true),
    Launch(ThisItem.Url)
)
```

---

### 4.5 عنوان قسم Additional — `lblSectionAdditional`

```powerfx
// خاصية Text
If(varLang = "ar", "روابط إضافية", "Additional Links")
```

| الخاصية | القيمة |
|---|---|
| X | `16` |
| Y | `galQuickLinks.Y + galQuickLinks.Height + 16` |
| Width | `Parent.Width - 32` |
| Height | `24` |
| Color | `varColorGold` |
| Size | `13` |
| Align | `If(varLang="ar", Align.Right, Align.Left)` |
| Fill | `Transparent` |

---

### 4.6 معرض الروابط الإضافية — `galAdditionalLinks`

1. **Insert → Gallery → Vertical** → اسمه `galAdditionalLinks`.
2. في **Items** (من `03-PowerFx-Cookbook.md` § 9-B):

```powerfx
Filter(colQuickLinks, Section = "Additional")
```

3. الخصائص:

| الخاصية | القيمة |
|---|---|
| X | `0` |
| Y | `lblSectionAdditional.Y + lblSectionAdditional.Height + 8` |
| Width | `Parent.Width` |
| Height | `Parent.Height - lblSectionAdditional.Y - 44` |
| TemplateSize | `60` |
| Fill | `Transparent` |

4. داخل القالب، أضف **Label** اسمه `lblAddLinkName`:

```powerfx
If(varLang = "ar", ThisItem.LabelAr, ThisItem.LabelEn)
```

| الخاصية | القيمة |
|---|---|
| X | `If(varLang="ar", 16, 16)` |
| Y | `10` |
| Width | `Parent.TemplateWidth - 60` |
| Height | `40` |
| Color | `varColorText` |
| Size | `14` |
| Align | `If(varLang="ar", Align.Right, Align.Left)` |
| Fill | `Transparent` |

5. **OnSelect للقالب:**

```powerfx
Launch(ThisItem.Url)
```

---

### 4.7 نافذة بروتوكول مكالمة ITSM (Popup)

> أضف المجموعة بعد معرض `galQuickLinks`. تظهر فوق كل عناصر الشاشة عند `varShowITSM = true`.

#### أ) طبقة التعتيم — `rectITSMOverlay`

1. **Insert → Shapes → Rectangle** → اسمه `rectITSMOverlay`.

| الخاصية | القيمة |
|---|---|
| X | `0` |
| Y | `0` |
| Width | `Parent.Width` |
| Height | `Parent.Height` |
| Fill | `RGBA(0, 0, 0, 0.6)` |
| Visible | `varShowITSM` |
| ZIndex | يجب أن يكون أعلى من معارض الشاشة — ارفعه في Tree View |

**OnSelect لـ `rectITSMOverlay`** (الإغلاق عند الضغط خارج الـ Popup):

```powerfx
Set(varShowITSM, false)
```

#### ب) حاوية الـ Popup — `conITSMPopup`

1. **Insert → Shapes → Rectangle** → اسمه `conITSMPopup`.
2. في **Visible** (من `03-PowerFx-Cookbook.md` § 9-E):

```powerfx
varShowITSM
```

| الخاصية | القيمة |
|---|---|
| X | `32` |
| Y | `(Parent.Height - 260) / 2` |
| Width | `Parent.Width - 64` |
| Height | `260` |
| Fill | `varColorCardBg` |
| BorderColor | `varColorGold` |
| BorderThickness | `2` |
| RadiusTopLeft | `16` |
| RadiusTopRight | `16` |
| RadiusBottomLeft | `16` |
| RadiusBottomRight | `16` |

#### ج) محتوى الـ Popup (أضف فوق `conITSMPopup` في نفس المستوى)

**عنوان الـ Popup — `lblITSMTitle`:**

```powerfx
// خاصية Text
If(varLang = "ar", "بروتوكول مكالمة ITSM", "ITSM Call Protocol")
```

| الخاصية | القيمة |
|---|---|
| X | `conITSMPopup.X + 16` |
| Y | `conITSMPopup.Y + 20` |
| Width | `conITSMPopup.Width - 32` |
| Height | `30` |
| Color | `varColorGold` |
| Size | `17` |
| FontWeight | `FontWeight.Bold` |
| Align | `Align.Center` |
| Visible | `varShowITSM` |
| Fill | `Transparent` |

**رقم الهاتف — `lblITSMPhone`:**

```powerfx
// خاصية Text (من 03-PowerFx-Cookbook.md § 9-H)
varITSMRecord.Phone
```

| الخاصية | القيمة |
|---|---|
| X | `conITSMPopup.X + 16` |
| Y | `lblITSMTitle.Y + lblITSMTitle.Height + 16` |
| Width | `conITSMPopup.Width - 32` |
| Height | `40` |
| Color | `varColorText` |
| Size | `22` |
| FontWeight | `FontWeight.Bold` |
| Align | `Align.Center` |
| Visible | `varShowITSM` |
| Fill | `Transparent` |

**وصف الخدمة — `lblITSMDesc`:**

```powerfx
// خاصية Text
If(varLang = "ar", "اضغط الاتصال للتحدث مع مركز دعم ITSM", "Tap Call to reach the ITSM support center")
```

| الخاصية | القيمة |
|---|---|
| X | `conITSMPopup.X + 16` |
| Y | `lblITSMPhone.Y + lblITSMPhone.Height + 8` |
| Width | `conITSMPopup.Width - 32` |
| Height | `36` |
| Color | `varColorTextMuted` |
| Size | `12` |
| Align | `Align.Center` |
| Visible | `varShowITSM` |
| Fill | `Transparent` |

**زر الاتصال — `btnCallITSM`:**

```powerfx
// خاصية Text
If(varLang = "ar", "اتصال الآن", "Call Now")
```

```powerfx
// خاصية OnSelect (من 03-PowerFx-Cookbook.md § 9-F)
Launch("tel:" & varITSMRecord.Phone);
Set(varShowITSM, false)
```

| الخاصية | القيمة |
|---|---|
| X | `conITSMPopup.X + 16` |
| Y | `lblITSMDesc.Y + lblITSMDesc.Height + 16` |
| Width | `(conITSMPopup.Width - 56) / 2` |
| Height | `44` |
| Fill | `varColorGold` |
| Color | `varColorBg` |
| RadiusTopLeft | `8` |
| RadiusTopRight | `8` |
| RadiusBottomLeft | `8` |
| RadiusBottomRight | `8` |
| Size | `14` |
| FontWeight | `FontWeight.Bold` |
| Visible | `varShowITSM` |

**زر الإغلاق — `btnCloseITSM`:**

```powerfx
// خاصية Text
If(varLang = "ar", "إغلاق", "Close")
```

```powerfx
// خاصية OnSelect (من 03-PowerFx-Cookbook.md § 9-G)
Set(varShowITSM, false)
```

| الخاصية | القيمة |
|---|---|
| X | `btnCallITSM.X + btnCallITSM.Width + 24` |
| Y | `btnCallITSM.Y` |
| Width | `btnCallITSM.Width` |
| Height | `44` |
| Fill | `varColorCardBg` |
| Color | `varColorTextMuted` |
| BorderColor | `varColorBorder` |
| BorderThickness | `1` |
| RadiusTopLeft | `8` |
| RadiusTopRight | `8` |
| RadiusBottomLeft | `8` |
| RadiusBottomRight | `8` |
| Size | `14` |
| Visible | `varShowITSM` |

---

## 5. شاشة `scrEscalationLinks`

### 5.1 تهيئة الشاشة

1. اضغط على `scrEscalationLinks` في Tree View.
2. **Fill:** `varColorBg`.

---

### 5.2 رأس الصفحة وزر الرجوع

أضف `lblEscLinksHeader` و`btnBackEscLinks`:

```powerfx
// خاصية Text لـ lblEscLinksHeader
If(varLang = "ar", "روابط التصعيد", "Escalation Links")
```

```powerfx
// خاصية OnSelect لـ btnBackEscLinks
Navigate(scrHome, ScreenTransition.Fade)
```

---

### 5.3 معرض الآباء — `galEscParent`

1. **Insert → Gallery → Vertical** → اسمه `galEscParent`.
2. في **Items** (من `03-PowerFx-Cookbook.md` § 10-A):

```powerfx
SortByColumns(
    Filter(colEscalationLinks, IsChild = "No"),
    "Order", SortOrder.Ascending
)
```

3. الخصائص:

| الخاصية | القيمة |
|---|---|
| X | `0` |
| Y | `lblEscLinksHeader.Y + lblEscLinksHeader.Height + 12` |
| Width | `Parent.Width` |
| Height | `Parent.Height - lblEscLinksHeader.Y - 56` |
| TemplateSize | `If(CountIf(colExpandedKeys, Value = ThisItem.LabelAr) > 0, 200, 64)` |
| Fill | `Transparent` |

> **ملاحظة حول ارتفاع القالب المتغير:** Power Apps لا يدعم ارتفاعاً متغيراً تلقائياً للـ Gallery. استخدم القيمة الثابتة `200` وأخفِ المعرض الفرعي بـ `Visible` بدلاً من تغيير الارتفاع.

قيمة `TemplateSize` الثابتة الموصى بها: `200` (يكفي لعرض الأبناء عند الفتح).

---

### 5.4 محتوى بطاقة الأب داخل `galEscParent`

#### أ) خلفية البطاقة — `rectEscParentCard`

| الخاصية | القيمة |
|---|---|
| X | `8` |
| Y | `4` |
| Width | `Parent.TemplateWidth - 16` |
| Height | `56` |
| Fill | `varColorCardBg` |
| BorderColor | `If(CountIf(colExpandedKeys, Value = ThisItem.LabelAr) > 0, varColorGold, varColorBorder)` |
| BorderThickness | `1` |
| RadiusTopLeft | `10` |
| RadiusTopRight | `10` |
| RadiusBottomLeft | `10` |
| RadiusBottomRight | `10` |

#### ب) عنوان الأب — `lblEscParentName`

```powerfx
// خاصية Text (من 03-PowerFx-Cookbook.md § 10-B)
If(varLang = "ar", ThisItem.LabelAr, ThisItem.LabelEn)
```

| الخاصية | القيمة |
|---|---|
| X | `If(varLang="ar", 52, 20)` |
| Y | `12` |
| Width | `Parent.TemplateWidth - 80` |
| Height | `32` |
| Color | `varColorText` |
| Size | `14` |
| FontWeight | `FontWeight.SemiBold` |
| Align | `If(varLang="ar", Align.Right, Align.Left)` |
| Fill | `Transparent` |

#### ج) أيقونة السهم — `icnEscParentArrow`

أضف **Icon → ChevronDown/ChevronRight** → اسمه `icnEscParentArrow`.

```powerfx
// خاصية Icon
If(
    CountIf(colExpandedKeys, Value = ThisItem.LabelAr) > 0,
    Icon.ChevronDown,
    Icon.ChevronRight
)
```

| الخاصية | القيمة |
|---|---|
| X | `If(varLang="ar", Parent.TemplateWidth - 44, 16)` |
| Y | `16` |
| Width | `24` |
| Height | `24` |
| Color | `varColorGold` |
| Fill | `Transparent` |

#### د) `OnSelect` للبطاقة الأب (اضغط على `rectEscParentCard`):

```powerfx
If(
    CountIf(colExpandedKeys, Value = ThisItem.LabelAr) > 0,
    RemoveIf(colExpandedKeys, Value = ThisItem.LabelAr),
    Collect(colExpandedKeys, {Value: ThisItem.LabelAr})
)
```

> **ملاحظة:** هنا نستخدم `LabelAr` بدل `Key` لأن `EscalationLinks` لا تملك عمود `Key` — العلاقة أب/ابن مبنية على `ParentLabel = LabelAr`. راجع `01-SharePoint-Lists-Schema.md` § 4.

---

### 5.5 معرض الأبناء داخل بطاقة الأب — `galEscChildren`

1. **Insert → Gallery → Vertical** → اسمه `galEscChildren`.
2. أضفه **داخل قالب `galEscParent`** (اسحبه تحت `rectEscParentCard`).
3. في **Items** (من `03-PowerFx-Cookbook.md` § 10-C):

```powerfx
Filter(
    colEscalationLinks,
    IsChild = "Yes",
    ParentLabel = ThisItem.LabelAr
)
```

4. في **Visible**:

```powerfx
CountIf(colExpandedKeys, Value = ThisItem.LabelAr) > 0
```

5. الخصائص:

| الخاصية | القيمة |
|---|---|
| X | `8` |
| Y | `64` |
| Width | `Parent.TemplateWidth - 16` |
| Height | `128` |
| TemplateSize | `48` |
| Fill | `Transparent` |

6. داخل قالب `galEscChildren`, أضف **Label** اسمه `lblEscChildName`:

```powerfx
// خاصية Text (من 03-PowerFx-Cookbook.md § 10-D)
If(varLang = "ar", ThisItem.LabelAr, ThisItem.LabelEn)
```

| الخاصية | القيمة |
|---|---|
| X | `If(varLang="ar", 8, 32)` |
| Y | `4` |
| Width | `Parent.TemplateWidth - 56` |
| Height | `40` |
| Color | `varColorTextMuted` |
| Size | `13` |
| Align | `If(varLang="ar", Align.Right, Align.Left)` |
| Fill | `Transparent` |

7. **OnSelect لقالب `galEscChildren`** (من `03-PowerFx-Cookbook.md` § 10-E):

```powerfx
If(
    !IsBlank(ThisItem.Url) && ThisItem.Url <> "",
    Launch(ThisItem.Url),
    Notify(
        If(varLang="ar","لا يوجد رابط","No URL available"),
        NotificationType.Warning
    )
)
```

---

## 6. شاشة `scrEscalationGuide`

### 6.1 تهيئة الشاشة

1. اضغط على `scrEscalationGuide` في Tree View.
2. **Fill:** `varColorBg`.

---

### 6.2 رأس الصفحة وزر الرجوع

أضف `lblEscGuideHeader` و`btnBackEscGuide`:

```powerfx
// خاصية Text لـ lblEscGuideHeader
If(varLang = "ar", "دليل التصعيد", "Escalation Guide")
```

```powerfx
// خاصية OnSelect لـ btnBackEscGuide
Navigate(scrHome, ScreenTransition.Fade)
```

---

### 6.3 معرض الفئات (الأكورديون) — `galEscGuide`

1. **Insert → Gallery → Vertical** → اسمه `galEscGuide`.
2. في **Items** (من `03-PowerFx-Cookbook.md` § 11-B):

```powerfx
SortByColumns(colEscalationGuide, "Key", SortOrder.Ascending)
```

3. الخصائص:

| الخاصية | القيمة |
|---|---|
| X | `0` |
| Y | `lblEscGuideHeader.Y + lblEscGuideHeader.Height + 12` |
| Width | `Parent.Width` |
| Height | `Parent.Height - lblEscGuideHeader.Y - 56` |
| TemplateSize | `240` |
| TemplatePadding | `0` |
| Fill | `Transparent` |
| ShowScrollbar | `true` |

> قيمة `TemplateSize = 240` تكفي لعرض رأس الفئة (64px) + معرض الخطوات (176px). الخطوات تظهر/تختفي بـ `Visible` دون تغيير الحجم.

---

### 6.4 محتوى بطاقة الفئة داخل `galEscGuide`

#### أ) خلفية رأس الفئة — `rectCatHeader`

| الخاصية | القيمة |
|---|---|
| X | `8` |
| Y | `4` |
| Width | `Parent.TemplateWidth - 16` |
| Height | `56` |
| Fill | `If(CountIf(colExpandedKeys, Value = ThisItem.Key) > 0, RGBA(251,191,36,0.15), varColorCardBg)` |
| BorderColor | `If(CountIf(colExpandedKeys, Value = ThisItem.Key) > 0, varColorGold, varColorBorder)` |
| BorderThickness | `1` |
| RadiusTopLeft | `10` |
| RadiusTopRight | `10` |
| RadiusBottomLeft | `If(CountIf(colExpandedKeys, Value = ThisItem.Key) > 0, 0, 10)` |
| RadiusBottomRight | `If(CountIf(colExpandedKeys, Value = ThisItem.Key) > 0, 0, 10)` |

#### ب) عنوان الفئة — `lblCatName`

```powerfx
// خاصية Text (من 03-PowerFx-Cookbook.md § 11-C)
If(varLang = "ar", ThisItem.CategoryAr, ThisItem.CategoryEn)
```

| الخاصية | القيمة |
|---|---|
| X | `If(varLang="ar", 52, 20)` |
| Y | `12` |
| Width | `Parent.TemplateWidth - 80` |
| Height | `32` |
| Color | `varColorText` |
| Size | `15` |
| FontWeight | `FontWeight.SemiBold` |
| Align | `If(varLang="ar", Align.Right, Align.Left)` |
| Fill | `Transparent` |

#### ج) أيقونة السهم — `icnAccordion`

أضف **Icon** → اسمه `icnAccordion`.

```powerfx
// خاصية Icon (من 03-PowerFx-Cookbook.md § 11-H)
If(
    CountIf(colExpandedKeys, Value = ThisItem.Key) > 0,
    Icon.ChevronDown,
    Icon.ChevronRight
)
```

| الخاصية | القيمة |
|---|---|
| X | `If(varLang="ar", Parent.TemplateWidth - 44, 16)` |
| Y | `16` |
| Width | `24` |
| Height | `24` |
| Color | `varColorGold` |
| Fill | `Transparent` |

#### د) `OnSelect` لـ `rectCatHeader` (الضغط لفتح/طي الفئة):

```powerfx
// من 03-PowerFx-Cookbook.md § 11-D
If(
    CountIf(colExpandedKeys, Value = ThisItem.Key) > 0,
    RemoveIf(colExpandedKeys, Value = ThisItem.Key),
    Collect(colExpandedKeys, {Value: ThisItem.Key})
)
```

---

### 6.5 معرض الخطوات داخل الفئة — `galEscSteps`

1. **Insert → Gallery → Vertical** → اسمه `galEscSteps`.
2. أضفه **داخل قالب `galEscGuide`** تحت `rectCatHeader` مباشرة.
3. في **Items** (من `03-PowerFx-Cookbook.md` § 11-F):

```powerfx
SortByColumns(
    Filter(
        colEscalationSteps,
        CategoryKey = ThisItem.Key
    ),
    "Order", SortOrder.Ascending
)
```

4. في **Visible** (من `03-PowerFx-Cookbook.md` § 11-E):

```powerfx
CountIf(colExpandedKeys, Value = ThisItem.Key) > 0
```

5. الخصائص:

| الخاصية | القيمة |
|---|---|
| X | `8` |
| Y | `60` |
| Width | `Parent.TemplateWidth - 16` |
| Height | `176` |
| TemplateSize | `72` |
| TemplatePadding | `0` |
| Fill | `varColorCardBg` |
| BorderColor | `varColorBorder` |
| ShowScrollbar | `false` |

> إذا كانت الخطوات أكثر من 2-3، زِد `Height` إلى `240` أو فعّل `ShowScrollbar = true`.

---

### 6.6 محتوى بطاقة الخطوة داخل `galEscSteps`

#### أ) خط الترقيم — `lblStepNum`

```powerfx
// خاصية Text
Text(ThisItem.Order)
```

| الخاصية | القيمة |
|---|---|
| X | `If(varLang="ar", Parent.TemplateWidth - 36, 8)` |
| Y | `8` |
| Width | `28` |
| Height | `28` |
| Color | `varColorGold` |
| Size | `13` |
| FontWeight | `FontWeight.Bold` |
| Align | `Align.Center` |
| Fill | `RGBA(251,191,36,0.15)` |
| RadiusTopLeft | `14` |
| RadiusTopRight | `14` |
| RadiusBottomLeft | `14` |
| RadiusBottomRight | `14` |

#### ب) نص الخطوة — `lblStepText`

```powerfx
// خاصية Text (من 03-PowerFx-Cookbook.md § 11-G)
If(varLang = "ar", ThisItem.StepAr, ThisItem.StepEn)
```

| الخاصية | القيمة |
|---|---|
| X | `If(varLang="ar", 8, 44)` |
| Y | `4` |
| Width | `Parent.TemplateWidth - 56` |
| Height | `64` |
| Color | `varColorText` |
| Size | `12` |
| Align | `If(varLang="ar", Align.Right, Align.Left)` |
| Fill | `Transparent` |
| Overflow | `Overflow.Scroll` |

#### ج) خط فاصل بين الخطوات — `lineStepDivider`

1. **Insert → Shapes → Rectangle** → اسمه `lineStepDivider`.

| الخاصية | القيمة |
|---|---|
| X | `8` |
| Y | `Parent.TemplateHeight - 1` |
| Width | `Parent.TemplateWidth - 16` |
| Height | `1` |
| Fill | `varColorBorder` |
| BorderThickness | `0` |

---

## قائمة التحقق للقسم 06b

بعد الانتهاء من بناء الشاشات الست، تأكد مما يلي:

### شاشة `scrHome`
- [ ] الشعار `imgLogo` يظهر في وسط الأعلى
- [ ] عنوان التطبيق `lblAppTitle` يعرض الاسم الثنائي اللغة
- [ ] 7 أزرار تنقل تعمل بـ `Navigate` للشاشات الصحيحة
- [ ] زر `btnLangToggle` يقلب `varLang` بين `"ar"` و`"en"`
- [ ] تسمية الترحيب `lblWelcome` تعرض اسم `User().FullName`

### شاشة `scrLeaders`
- [ ] `txtSearchLeaders` يفلتر `galLeaders` بـ `StartsWith` على 4 أعمدة
- [ ] `galDeptChips` يعرض "الكل" + الأقسام من `colDepts`
- [ ] الشريحة المختارة تتميز بلون ذهبي (`varSelectedDept`)
- [ ] `galLeaders` يعرض Avatar + اسم + مسمى + قسم + أزرار تواصل
- [ ] الضغط على بطاقة يحفظ `varSelectedLeader` وينتقل لـ `scrLeaderDetail`

### شاشة `scrLeaderDetail`
- [ ] تعرض بيانات `varSelectedLeader` (الاسم، المسمى، القسم، الإيميل)
- [ ] `lblDetailReportsTo` يظهر فقط إذا كانت `ReportsTo` غير فارغة
- [ ] زر الإيميل يفتح `mailto:` مع التحقق من وجود إيميل
- [ ] زر الهاتف يفتح `tel:` مع التحقق من وجود رقم
- [ ] زر Teams يفتح رابط Teams أو يبني رابط `l/chat` من الإيميل
- [ ] `galLeaderEmployees` يعرض موظفي `varSelectedLeader.Key`
- [ ] `btnBackDetail` يستخدم `Back()`

### شاشة `scrQuickLinks`
- [ ] `galQuickLinks` يعرض `Section = "Quick"` من `colQuickLinks`
- [ ] `galAdditionalLinks` يعرض `Section = "Additional"` من `colQuickLinks`
- [ ] الضغط على بطاقة ITSM (التي فيها `Phone`) يفتح `varShowITSM = true`
- [ ] `rectITSMOverlay` و`conITSMPopup` وجميع Label/أزرار الـ Popup مخفية عند `varShowITSM = false`
- [ ] `btnCallITSM` يفتح `tel:` من `varITSMRecord.Phone` ويغلق الـ Popup
- [ ] `btnCloseITSM` يضع `varShowITSM = false`

### شاشة `scrEscalationLinks`
- [ ] `galEscParent` يعرض `IsChild = "No"` مرتباً بـ `Order`
- [ ] الضغط على الأب يُضيف/يحذف `LabelAr` في `colExpandedKeys`
- [ ] `galEscChildren` مرئي فقط عند وجود `LabelAr` في `colExpandedKeys`
- [ ] `galEscChildren` مصفّى بـ `ParentLabel = ThisItem.LabelAr`
- [ ] الضغط على ابن يفتح `Launch(ThisItem.Url)`

### شاشة `scrEscalationGuide`
- [ ] `galEscGuide` مصدره `colEscalationGuide` مرتباً بـ `Key`
- [ ] الضغط على فئة يُضيف/يحذف `Key` في `colExpandedKeys`
- [ ] `galEscSteps` مرئي فقط عند وجود `Key` في `colExpandedKeys`
- [ ] `galEscSteps` مصفّى بـ `CategoryKey = ThisItem.Key` ومرتباً بـ `Order`
- [ ] رقم الخطوة `lblStepNum` يعرض `ThisItem.Order` بدائرة ذهبية
- [ ] نص الخطوة `lblStepText` يعرض `StepAr` أو `StepEn` حسب `varLang`

---

*يتبع القسم 06c: شاشات النماذج (scrFormViolation / scrFormResignation / scrFormLeave).*


---
# 📝 المرحلة ٤: شاشات النماذج
# القسم 06c — شاشات النماذج الثلاثة (مخالفة / استقالة / إجازة)

> **المرجع الأساسي:** `03-PowerFx-Cookbook.md` الأقسام 12، 13، 14 — كل صيغة هنا مأخوذة أو مشتقة منها مباشرة.
> **أسماء القوائم والأعمدة:** من `01-SharePoint-Lists-Schema.md`.
> **أسماء التدفقات:** من `04-PowerAutomate-Flows.md` (GenerateViolationPDF / GenerateResignationPDF / GenerateLeavePDF).
> **أسماء الشاشات المعتمدة:** scrFormViolation / scrFormResignation / scrFormLeave (من `02-Build-Guide.md`).

---

## نمط Wizard المشترك للنماذج الثلاثة

كل شاشة نموذج تعمل بمتغير عالمي `varFormStep` يأخذ القيم 1 أو 2 أو 3:

| الخطوة | المحتوى |
|---|---|
| 1 | اختيار الموظف من القائمة المصفّاة |
| 2 | تعبئة حقول النموذج |
| 3 | التوقيع والإرسال |

مؤشر التقدم (3 دوائر) يُضاف في أعلى كل شاشة — راجع القسم الخاص به أدناه.

**إعداد `varMyKey` في `App.OnStart`** (داخل `Concurrent` — مطلوب لتصفية الموظفين):

```powerfx
// في App.OnStart — داخل Concurrent
// يجلب مفتاح الليدر الحالي من قائمة Leaders بناءً على إيميله
Set(
    varMyKey,
    LookUp(colLeaders, Email = User().Email, Title)
)
```

---

## شاشة `scrFormViolation` — نموذج المخالفة

### إعداد الشاشة

1. في **Tree View** افتح شاشة `scrFormViolation`.
2. اضغط على خلفية الشاشة → **Fill**:

```powerfx
varColorBg
```

3. أضف **Label** عنوان في الأعلى → خاصية `Text`:

```powerfx
If(varLang = "ar", "نموذج مخالفة", "Violation Form")
```

خاصية `Color`: `varColorGold` — خاصية `Align`: `Align.Right`

---

### مؤشر الخطوات (Step Indicator)

أضف 3 دوائر (`Circle` من Insert → Shapes) بجانب بعضها في أعلى الشاشة.

لكل دائرة عيّن خاصية `Fill` على التوالي:

```powerfx
// الدائرة 1
If(varFormStep >= 1, varColorGold, varColorBorder)

// الدائرة 2
If(varFormStep >= 2, varColorGold, varColorBorder)

// الدائرة 3
If(varFormStep >= 3, varColorGold, varColorBorder)
```

---

### الخطوة 1 — اختيار الموظف

كل عناصر هذه الخطوة لها خاصية `Visible`:

```powerfx
varFormStep = 1
```

#### 1-أ. حقل البحث عن موظف

- اضغط **Insert** → **Text** → **Text input** → سمّه `txtVioEmpSearch`.
- خاصية `HintText`:

```powerfx
If(varLang = "ar", "ابحث باسم الموظف...", "Search employee...")
```

- خاصية `Align`: `Align.Right`

#### 1-ب. معرض الموظفين المصفّاة (مصدره موظفو المدير الحالي فقط)

- اضغط **Insert** → **Gallery** → **Vertical** → سمّه `galVioEmpPicker`.
- خاصية `Items` (القسم 12-C من الكتاب):

```powerfx
// يصفّي الموظفين بـ ManagerKey = varMyKey أي موظفو المدير الحالي فقط
SortByColumns(
    Filter(
        colEmployees,
        ManagerKey = varMyKey,
        IsBlank(txtVioEmpSearch.Text)
            || txtVioEmpSearch.Text = ""
            || StartsWith(Name, txtVioEmpSearch.Text)
    ),
    "Name", SortOrder.Ascending
)
```

داخل بطاقة المعرض أضف:
- **Label الاسم** → خاصية `Text`: `ThisItem.Name` — خاصية `Color`: `varColorText`
- **Label الرقم الوظيفي** → خاصية `Text`: `ThisItem.HRID` — خاصية `Color`: `varColorTextMuted`
- **Label الإيميل** → خاصية `Text`: `ThisItem.Email` — خاصية `Color`: `varColorTextMuted`

خاصية `OnSelect` للبطاقة (القسم 12-B من الكتاب):

```powerfx
// يحفظ بيانات الموظف المختار ويتقدم للخطوة 2
Set(varFormEmpName,  ThisItem.Name);
Set(varFormEmpHRID,  ThisItem.HRID);
Set(varFormEmpEmail, ThisItem.Email);
Set(varFormStep, 2)
```

#### 1-ج. زر التالي

- أضف **Button** → سمّه `btnVioNext1`.
- خاصية `Text`: `If(varLang = "ar", "التالي ←", "Next →")`
- خاصية `Fill`: `varColorGold` — خاصية `Color`: `varColorBg`
- خاصية `OnSelect`:

```powerfx
If(
    varFormEmpName = "" || IsBlank(varFormEmpName),
    Notify(
        If(varLang = "ar", "يرجى اختيار موظف أولاً", "Please select an employee first"),
        NotificationType.Warning
    ),
    Set(varFormStep, 2)
)
```

#### 1-د. زر الرجوع للرئيسية

- أضف **Button** → سمّه `btnVioBackHome1`.
- خاصية `Text`: `If(varLang = "ar", "→ رجوع", "← Back")`
- خاصية `OnSelect`:

```powerfx
Set(varFormStep, 1);
Navigate(scrHome, ScreenTransition.UnCover)
```

---

### الخطوة 2 — حقول المخالفة

كل عناصر هذه الخطوة لها خاصية `Visible`:

```powerfx
varFormStep = 2
```

#### جدول ربط الحقول بـ Content Control Tags

| اسم الحقل في الشاشة | نوع العنصر | اسم المتغير / القيمة | Content Control Tag |
|---|---|---|---|
| اسم الموظف | Label (قراءة فقط) | `varFormEmpName` | `emp_name` |
| الرقم الوظيفي | Label (قراءة فقط) | `varFormEmpHRID` | `emp_hrid` |
| إيميل الموظف | Label (قراءة فقط) | `varFormEmpEmail` | `emp_email` |
| نوع المخالفة | Dropdown | `ddVioType` → `.Selected.Value` → `varFormViolationType` | `violation_type` |
| تاريخ المخالفة | Text input | `inpVioDate` → `.Text` → `varFormViolationDate` | `violation_date` |
| مدة المخالفة | Text input | `inpVioDuration` → `.Text` → `varFormDuration` | `violation_duration` |
| أيام الغياب | Text input | `inpVioAbsentDays` → `.Text` → `varFormAbsentDays` | `absent_days` |
| ملاحظات | Text input | `inpVioNotes` → `.Text` → `varFormNotes` | `notes` |
| اسم المدير | تلقائي | `User().FullName` → `varFormMgrName` | `manager_name` |
| توقيع المدير | Pen Input | `penSignature` | `manager_sig` (Picture) |
| تاريخ الإصدار | تلقائي | `Text(Today(), "dd/mm/yyyy")` | `manager_date` |

#### 2-أ. عرض بيانات الموظف المختار (قراءة فقط)

أضف 3 عناصر **Label**:

```powerfx
// Label اسم الموظف — خاصية Text
If(varLang = "ar", "الموظف: ", "Employee: ") & varFormEmpName

// Label الرقم الوظيفي — خاصية Text
If(varLang = "ar", "الرقم: ", "ID: ") & varFormEmpHRID

// Label الإيميل — خاصية Text
If(varLang = "ar", "الإيميل: ", "Email: ") & varFormEmpEmail
```

لكل Label: خاصية `Color`: `varColorText` — خاصية `Align`: `Align.Right`

#### 2-ب. Dropdown نوع المخالفة

- اضغط **Insert** → **Input** → **Drop down** → سمّه `ddVioType`.
- خاصية `Items`:

```powerfx
["تأخر", "غياب", "خروج مبكر", "أخرى"]
```

أضف **Label** فوقه:

```powerfx
If(varLang = "ar", "نوع المخالفة *", "Violation Type *")
```

#### 2-ج. حقل تاريخ المخالفة

- اضغط **Insert** → **Text** → **Text input** → سمّه `inpVioDate`.
- خاصية `HintText`: `"dd/mm/yyyy"`
- خاصية `Align`: `Align.Right`

أضف **Label** فوقه:

```powerfx
If(varLang = "ar", "تاريخ المخالفة *", "Violation Date *")
```

#### 2-د. حقل مدة المخالفة

- **Text input** → سمّه `inpVioDuration`.
- خاصية `HintText`: `If(varLang = "ar", "مثال: 45 دقيقة", "e.g. 45 minutes")`
- خاصية `Align`: `Align.Right`

أضف **Label** فوقه:

```powerfx
If(varLang = "ar", "مدة المخالفة", "Duration")
```

#### 2-هـ. حقل أيام الغياب

- **Text input** → سمّه `inpVioAbsentDays`.
- خاصية `HintText`: `If(varLang = "ar", "عدد أيام الغياب", "Number of absent days")`
- خاصية `Align`: `Align.Right`

أضف **Label** فوقه:

```powerfx
If(varLang = "ar", "أيام الغياب", "Absent Days")
```

#### 2-و. حقل الملاحظات

- **Text input** → سمّه `inpVioNotes`.
- خاصية `Mode`: `TextMode.MultiLine`
- خاصية `HintText`: `If(varLang = "ar", "ملاحظات إضافية...", "Additional notes...")`
- خاصية `Align`: `Align.Right`

أضف **Label** فوقه:

```powerfx
If(varLang = "ar", "ملاحظات", "Notes")
```

#### 2-ز. أزرار التنقل

- زر "التالي" → سمّه `btnVioNext2`:

```powerfx
// خاصية OnSelect
If(
    inpVioDate.Text = "",
    Notify(
        If(varLang = "ar", "يرجى إدخال تاريخ المخالفة", "Please enter violation date"),
        NotificationType.Warning
    ),
    // حفظ قيم الحقول في متغيرات
    Set(varFormViolationType, ddVioType.Selected.Value);
    Set(varFormViolationDate, inpVioDate.Text);
    Set(varFormDuration,      inpVioDuration.Text);
    Set(varFormAbsentDays,    inpVioAbsentDays.Text);
    Set(varFormNotes,         inpVioNotes.Text);
    Set(varFormMgrName,       User().FullName);
    Set(varFormStep, 3)
)
```

- زر "السابق" → سمّه `btnVioPrev2`:

```powerfx
// خاصية OnSelect
Set(varFormStep, 1)
```

---

### الخطوة 3 — التوقيع والإرسال

كل عناصر هذه الخطوة لها خاصية `Visible`:

```powerfx
varFormStep = 3
```

#### 3-أ. تعليمات التوقيع

أضف **Label**:

```powerfx
If(varLang = "ar", "وقّع في المربع أدناه بإصبعك أو الماوس", "Sign in the box below with your finger or mouse")
```

#### 3-ب. Pen Input — توقيع المدير

- اضغط **Insert** → **Input** → **Pen input** → سمّه `penSignature`.
- خاصية `Mode`: `PenMode.Draw`
- خاصية `BorderColor`: `varColorGold`
- خاصية `Fill`: `varColorCardBg`

#### 3-ج. زر مسح التوقيع (القسم 13-B من الكتاب)

- أضف **Button** → سمّه `btnVioClrSig`.
- خاصية `Text`: `If(varLang = "ar", "امسح التوقيع", "Clear Signature")`
- خاصية `OnSelect`:

```powerfx
Reset(penSignature)
```

#### 3-د. زر الإرسال — يستدعي تدفق `GenerateViolationPDF`

> المرجع: القسم 14-A من `03-PowerFx-Cookbook.md`.

- أضف **Button** → سمّه `btnVioSubmit`.
- خاصية `Text`: `If(varLang = "ar", "إرسال النموذج", "Submit Form")`
- خاصية `Fill`: `varColorGold` — خاصية `Color`: `varColorBg`
- خاصية `DisplayMode` (يُعطَّل إذا لم يوجد توقيع — القسم 13-D):

```powerfx
If(
    penSignature.Image = Blank() || IsBlank(penSignature.Image),
    DisplayMode.Disabled,
    DisplayMode.Edit
)
```

- خاصية `OnSelect`:

```powerfx
// القسم 14-A من 03-PowerFx-Cookbook.md
Set(varIsSubmitting, true);

Set(
    varViolationPDF,
    GenerateViolationPDF.Run(
        varFormEmpName,                                          // emp_name
        varFormEmpHRID,                                          // emp_hrid
        varFormEmpEmail,                                         // emp_email
        varFormViolationType,                                    // violation_type
        varFormViolationDate,                                    // violation_date
        varFormDuration,                                         // violation_duration
        varFormAbsentDays,                                       // absent_days
        varFormNotes,                                            // notes
        varFormMgrName,                                          // manager_name
        JSON(penSignature.Image, JSONFormat.IncludeBinaryData),  // manager_sig_base64
        Text(Today(), "dd/mm/yyyy"),                             // manager_date
        varFormEmpEmail                                          // recipient_email
    )
);

Download(varViolationPDF.PDFFile);

Set(varIsSubmitting, false);
Notify(
    If(varLang = "ar", "تم إرسال النموذج بنجاح", "Form submitted successfully"),
    NotificationType.Success
);
// إعادة تعيين الخطوة ثم العودة للرئيسية
Set(varFormStep, 1);
Navigate(scrHome, ScreenTransition.UnCover)
```

> **ربط التدفق:** قبل حفظ الشاشة اذهب إلى **Action** (في شريط أعلى Power Apps Studio) → **Power Automate** → **Add a flow** → اختر `GenerateViolationPDF` من القائمة. بعدها يصبح الاسم `GenerateViolationPDF` صالحاً في الكود.

#### 3-هـ. مؤشر التحميل أثناء الإرسال (القسم 14-D من الكتاب)

- أضف **Label** دوّار أو صورة spinner → سمّه `lblVioLoading`.
- خاصية `Text`: `If(varLang = "ar", "جارٍ التوليد...", "Generating...")`
- خاصية `Visible`:

```powerfx
varIsSubmitting
```

#### 3-و. زر السابق

- أضف **Button** → سمّه `btnVioPrev3`.
- خاصية `Text`: `If(varLang = "ar", "← السابق", "← Previous")`
- خاصية `OnSelect`:

```powerfx
Set(varFormStep, 2)
```

---

## شاشة `scrFormResignation` — نموذج الاستقالة

### إعداد الشاشة

1. افتح شاشة `scrFormResignation`.
2. خلفية الشاشة **Fill**: `varColorBg`
3. أضف **Label** عنوان:

```powerfx
If(varLang = "ar", "نموذج استقالة", "Resignation Form")
```

أضف نفس مؤشر الخطوات الثلاث بنفس الصيغة أعلاه.

---

### الخطوة 1 — اختيار الموظف

> **البنية مطابقة تماماً لـ scrFormViolation الخطوة 1** — أسماء العناصر تختلف فقط.

كل عناصر الخطوة 1: `Visible` = `varFormStep = 1`

- **Text input بحث** → سمّه `txtResEmpSearch` — نفس صيغة `HintText`.
- **Gallery** → سمّه `galResEmpPicker` — خاصية `Items`:

```powerfx
SortByColumns(
    Filter(
        colEmployees,
        ManagerKey = varMyKey,
        IsBlank(txtResEmpSearch.Text)
            || txtResEmpSearch.Text = ""
            || StartsWith(Name, txtResEmpSearch.Text)
    ),
    "Name", SortOrder.Ascending
)
```

- خاصية `OnSelect` للبطاقة:

```powerfx
Set(varFormEmpName,  ThisItem.Name);
Set(varFormEmpHRID,  ThisItem.HRID);
Set(varFormEmpEmail, ThisItem.Email);
Set(varFormStep, 2)
```

- زر "التالي" → سمّه `btnResNext1`:

```powerfx
If(
    varFormEmpName = "" || IsBlank(varFormEmpName),
    Notify(
        If(varLang = "ar", "يرجى اختيار موظف أولاً", "Please select an employee first"),
        NotificationType.Warning
    ),
    Set(varFormStep, 2)
)
```

---

### الخطوة 2 — حقول الاستقالة

كل عناصر الخطوة 2: `Visible` = `varFormStep = 2`

#### جدول ربط الحقول بـ Content Control Tags

| اسم الحقل في الشاشة | نوع العنصر | اسم العنصر | Content Control Tag |
|---|---|---|---|
| اسم الموظف | Label (قراءة) | — | `emp_name` |
| الرقم الوظيفي | Label (قراءة) | — | `emp_hrid` |
| إيميل الموظف | Label (قراءة) | — | `emp_email` |
| القسم | Text input | `inpResDept` | `department` |
| تاريخ الاستقالة | Text input | `inpResDate` | `resignation_date` |
| آخر يوم عمل | Text input | `inpResLastDay` | `last_working_day` |
| سبب الاستقالة | Text input (MultiLine) | `inpResReason` | `reason` |
| اسم المدير | تلقائي | `User().FullName` | `manager_name` |
| توقيع المدير | Pen Input | `penSignature` | `manager_sig` (Picture) |
| تاريخ الاعتماد | تلقائي | `Text(Today(), "dd/mm/yyyy")` | `manager_date` |

#### 2-أ. Labels بيانات الموظف المختار

```powerfx
// Label 1
If(varLang = "ar", "الموظف: ", "Employee: ") & varFormEmpName

// Label 2
If(varLang = "ar", "الرقم: ", "ID: ") & varFormEmpHRID
```

#### 2-ب. حقل القسم

- **Text input** → سمّه `inpResDept`.
- خاصية `HintText`: `If(varLang = "ar", "القسم الوظيفي", "Department")`
- خاصية `Align`: `Align.Right`

أضف **Label** فوقه: `If(varLang = "ar", "القسم *", "Department *")`

#### 2-ج. حقل تاريخ الاستقالة

- **Text input** → سمّه `inpResDate`.
- خاصية `HintText`: `"dd/mm/yyyy"`
- خاصية `Align`: `Align.Right`

أضف **Label** فوقه: `If(varLang = "ar", "تاريخ الاستقالة *", "Resignation Date *")`

#### 2-د. حقل آخر يوم عمل

- **Text input** → سمّه `inpResLastDay`.
- خاصية `HintText`: `"dd/mm/yyyy"`
- خاصية `Align`: `Align.Right`

أضف **Label** فوقه: `If(varLang = "ar", "آخر يوم عمل *", "Last Working Day *")`

#### 2-هـ. حقل سبب الاستقالة

- **Text input** → سمّه `inpResReason`.
- خاصية `Mode`: `TextMode.MultiLine`
- خاصية `HintText`: `If(varLang = "ar", "سبب تقديم الاستقالة...", "Reason for resignation...")`
- خاصية `Align`: `Align.Right`

أضف **Label** فوقه: `If(varLang = "ar", "سبب الاستقالة", "Reason")`

#### 2-و. أزرار التنقل

- زر "التالي" → سمّه `btnResNext2`:

```powerfx
If(
    inpResDate.Text = "" || inpResLastDay.Text = "",
    Notify(
        If(varLang = "ar", "يرجى تعبئة التواريخ المطلوبة", "Please fill in required dates"),
        NotificationType.Warning
    ),
    Set(varFormDepartment,  inpResDept.Text);
    Set(varFormResignDate,  inpResDate.Text);
    Set(varFormLastWorkDay, inpResLastDay.Text);
    Set(varFormReason,      inpResReason.Text);
    Set(varFormMgrName,     User().FullName);
    Set(varFormStep, 3)
)
```

- زر "السابق" → سمّه `btnResPrev2`:

```powerfx
Set(varFormStep, 1)
```

---

### الخطوة 3 — التوقيع والإرسال

كل عناصر الخطوة 3: `Visible` = `varFormStep = 3`

#### 3-أ. Pen Input — توقيع المدير

> **ملاحظة:** نموذج الاستقالة فيه توقيع المدير فقط (بخلاف الإجازة التي فيها توقيعان). يُستخدم نفس `penSignature` في الخطوة 3 — لا توجد تعارضات لأن كل شاشة مستقلة.

- **Pen input** → سمّه `penSignature` (اسم موحّد في كل الشاشات الثلاث لأن كل شاشة مستقلة).
- خاصية `Mode`: `PenMode.Draw`
- خاصية `BorderColor`: `varColorGold`

- زر مسح → سمّه `btnResClrSig`:

```powerfx
Reset(penSignature)
```

#### 3-ب. زر الإرسال — يستدعي تدفق `GenerateResignationPDF`

> المرجع: القسم 14-B من `03-PowerFx-Cookbook.md`.

- **Button** → سمّه `btnResSubmit`.
- خاصية `DisplayMode`:

```powerfx
If(
    penSignature.Image = Blank() || IsBlank(penSignature.Image),
    DisplayMode.Disabled,
    DisplayMode.Edit
)
```

- خاصية `OnSelect`:

```powerfx
// القسم 14-B من 03-PowerFx-Cookbook.md
Set(varIsSubmitting, true);

Set(
    varResignationPDF,
    GenerateResignationPDF.Run(
        varFormEmpName,                                          // emp_name
        varFormEmpHRID,                                          // emp_hrid
        varFormEmpEmail,                                         // emp_email
        varFormDepartment,                                       // department
        varFormResignDate,                                       // resignation_date
        varFormLastWorkDay,                                      // last_working_day
        varFormReason,                                           // reason
        varFormMgrName,                                          // manager_name
        JSON(penSignature.Image, JSONFormat.IncludeBinaryData),  // manager_sig_base64
        Text(Today(), "dd/mm/yyyy"),                             // manager_date
        varFormEmpEmail                                          // recipient_email
    )
);

Download(varResignationPDF.PDFFile);

Set(varIsSubmitting, false);
Notify(
    If(varLang = "ar", "تم إرسال الاستقالة بنجاح", "Resignation submitted successfully"),
    NotificationType.Success
);
Set(varFormStep, 1);
Navigate(scrHome, ScreenTransition.UnCover)
```

> **ربط التدفق:** من **Action** → **Power Automate** → **Add a flow** → اختر `GenerateResignationPDF`.

- مؤشر التحميل `lblResLoading` → خاصية `Visible`: `varIsSubmitting`
- زر "السابق" → سمّه `btnResPrev3`:

```powerfx
Set(varFormStep, 2)
```

---

## شاشة `scrFormLeave` — نموذج الإجازة

### إعداد الشاشة

1. افتح شاشة `scrFormLeave`.
2. خلفية الشاشة **Fill**: `varColorBg`
3. **Label** عنوان:

```powerfx
If(varLang = "ar", "طلب إجازة", "Leave Request")
```

أضف نفس مؤشر الخطوات الثلاث.

---

### الخطوة 1 — اختيار الموظف

> **البنية مطابقة للشاشتين السابقتين** — أسماء العناصر مختلفة فقط.

كل عناصر الخطوة 1: `Visible` = `varFormStep = 1`

- **Text input** → سمّه `txtLeaveEmpSearch`.
- **Gallery** → سمّه `galLeaveEmpPicker` — خاصية `Items`:

```powerfx
SortByColumns(
    Filter(
        colEmployees,
        ManagerKey = varMyKey,
        IsBlank(txtLeaveEmpSearch.Text)
            || txtLeaveEmpSearch.Text = ""
            || StartsWith(Name, txtLeaveEmpSearch.Text)
    ),
    "Name", SortOrder.Ascending
)
```

- خاصية `OnSelect` للبطاقة:

```powerfx
Set(varFormEmpName,      ThisItem.Name);
Set(varFormEmpHRID,      ThisItem.HRID);
Set(varFormEmpEmail,     ThisItem.Email);
Set(varFormApplicantName, ThisItem.Name);
Set(varFormStep, 2)
```

> **ملاحظة:** `varFormApplicantName` يُحفظ هنا مبكراً لأن نموذج الإجازة يحتوي حقل `applicant_name` مستقل عن `emp_name` (وإن كانا يشيران لنفس الشخص).

- زر "التالي" → سمّه `btnLeaveNext1`:

```powerfx
If(
    varFormEmpName = "" || IsBlank(varFormEmpName),
    Notify(
        If(varLang = "ar", "يرجى اختيار موظف أولاً", "Please select an employee first"),
        NotificationType.Warning
    ),
    Set(varFormStep, 2)
)
```

---

### الخطوة 2 — حقول الإجازة

كل عناصر الخطوة 2: `Visible` = `varFormStep = 2`

#### جدول ربط الحقول بـ Content Control Tags

| اسم الحقل في الشاشة | نوع العنصر | اسم العنصر | Content Control Tag |
|---|---|---|---|
| اسم الموظف | Label (قراءة) | — | `emp_name` |
| الرقم الوظيفي | Label (قراءة) | — | `emp_hrid` |
| تاريخ التعيين | Text input | `inpLeaveAppt` | `emp_appointment` |
| القسم | Text input | `inpLeaveDept` | `emp_dept` |
| المسمى الوظيفي | Text input | `inpLeaveJobTitle` | `emp_jobtitle` |
| نوع الإجازة | Dropdown | `ddLeaveType` | `leave_type` |
| آخر يوم عمل | Text input | `inpLeaveLastWork` | `last_work_day` |
| تاريخ البداية | Text input | `inpLeaveStart` | `start_date` |
| تاريخ النهاية | Text input | `inpLeaveEnd` | `end_date` |
| تاريخ المباشرة | Text input | `inpLeaveReturn` | `return_date` |
| رقم الهاتف | Text input | `inpLeavePhone` | `phone` |
| إجمالي الأيام | Text input | `inpLeaveTotalDays` | `total_days` |
| اسم مقدم الطلب | Label (قراءة) | `varFormApplicantName` | `applicant_name` |
| توقيع مقدم الطلب | Pen Input | `penApplicantSig` | `applicant_sig` (Picture) |
| اسم المدير | تلقائي | `User().FullName` | `manager_name` |
| توقيع المدير | Pen Input | `penSignature` | `manager_sig` (Picture) |
| تاريخ الاعتماد | تلقائي | `Text(Today(), "dd/mm/yyyy")` | `manager_date` |

#### 2-أ. Labels بيانات الموظف

```powerfx
// Label الاسم
If(varLang = "ar", "الموظف: ", "Employee: ") & varFormEmpName

// Label الرقم
If(varLang = "ar", "الرقم: ", "ID: ") & varFormEmpHRID
```

#### 2-ب. حقل تاريخ التعيين

- **Text input** → سمّه `inpLeaveAppt`.
- خاصية `HintText`: `"dd/mm/yyyy"`
- خاصية `Align`: `Align.Right`

أضف **Label**: `If(varLang = "ar", "تاريخ التعيين", "Appointment Date")`

#### 2-ج. حقل القسم

- **Text input** → سمّه `inpLeaveDept`.
- خاصية `HintText`: `If(varLang = "ar", "القسم الوظيفي", "Department")`
- خاصية `Align`: `Align.Right`

أضف **Label**: `If(varLang = "ar", "القسم *", "Department *")`

#### 2-د. حقل المسمى الوظيفي

- **Text input** → سمّه `inpLeaveJobTitle`.
- خاصية `Default`: `varFormEmpName` (اختياري — لو أردت ملأه من بيانات الموظف)
- خاصية `HintText`: `If(varLang = "ar", "المسمى الوظيفي", "Job Title")`
- خاصية `Align`: `Align.Right`

أضف **Label**: `If(varLang = "ar", "المسمى الوظيفي *", "Job Title *")`

#### 2-هـ. Dropdown نوع الإجازة

- **Drop down** → سمّه `ddLeaveType`.
- خاصية `Items`:

```powerfx
["اعتيادية", "طارئة", "مرضية", "إجازة أمومة", "إجازة أبوة", "بدون راتب", "حج", "دراسية"]
```

أضف **Label**: `If(varLang = "ar", "نوع الإجازة *", "Leave Type *")`

#### 2-و. حقل آخر يوم عمل

- **Text input** → سمّه `inpLeaveLastWork`.
- خاصية `HintText`: `"dd/mm/yyyy"`

أضف **Label**: `If(varLang = "ar", "آخر يوم عمل *", "Last Working Day *")`

#### 2-ز. حقل تاريخ البداية

- **Text input** → سمّه `inpLeaveStart`.
- خاصية `HintText`: `"dd/mm/yyyy"`

أضف **Label**: `If(varLang = "ar", "تاريخ البداية *", "Start Date *")`

#### 2-ح. حقل تاريخ النهاية

- **Text input** → سمّه `inpLeaveEnd`.
- خاصية `HintText`: `"dd/mm/yyyy"`

أضف **Label**: `If(varLang = "ar", "تاريخ النهاية *", "End Date *")`

#### 2-ط. حقل تاريخ المباشرة

- **Text input** → سمّه `inpLeaveReturn`.
- خاصية `HintText`: `"dd/mm/yyyy"`

أضف **Label**: `If(varLang = "ar", "تاريخ المباشرة *", "Return Date *")`

#### 2-ي. حقل رقم الهاتف

- **Text input** → سمّه `inpLeavePhone`.
- خاصية `HintText`: `If(varLang = "ar", "رقم الهاتف أثناء الإجازة", "Phone during leave")`
- خاصية `Align`: `Align.Right`

أضف **Label**: `If(varLang = "ar", "رقم الهاتف", "Phone")`

#### 2-ك. حقل إجمالي الأيام

- **Text input** → سمّه `inpLeaveTotalDays`.
- خاصية `HintText`: `If(varLang = "ar", "عدد الأيام", "Number of days")`
- خاصية `Default` (حساب تلقائي — اختياري):

```powerfx
// يحسب عدد الأيام تلقائياً إذا أُدخلت التواريخ بصيغة نصية
// (هذا الحساب يعمل فقط إذا كان التنسيق dd/mm/yyyy — يمكن تركه فارغاً للإدخال اليدوي)
""
```

أضف **Label**: `If(varLang = "ar", "إجمالي الأيام *", "Total Days *")`

#### 2-ل. زر "التالي"

- سمّه `btnLeaveNext2`:

```powerfx
If(
    inpLeaveStart.Text = "" || inpLeaveEnd.Text = "" || ddLeaveType.Selected.Value = "",
    Notify(
        If(varLang = "ar", "يرجى تعبئة الحقول المطلوبة (نوع الإجازة والتواريخ)", "Please fill in required fields"),
        NotificationType.Warning
    ),
    // حفظ قيم الخطوة 2
    Set(varFormEmpAppointment, inpLeaveAppt.Text);
    Set(varFormEmpDept,        inpLeaveDept.Text);
    Set(varFormEmpJobTitle,    inpLeaveJobTitle.Text);
    Set(varFormLeaveType,      ddLeaveType.Selected.Value);
    Set(varFormLastWorkDay,    inpLeaveLastWork.Text);
    Set(varFormStartDate,      inpLeaveStart.Text);
    Set(varFormEndDate,        inpLeaveEnd.Text);
    Set(varFormReturnDate,     inpLeaveReturn.Text);
    Set(varFormPhone,          inpLeavePhone.Text);
    Set(varFormTotalDays,      inpLeaveTotalDays.Text);
    Set(varFormMgrName,        User().FullName);
    Set(varFormStep, 3)
)
```

- زر "السابق" → سمّه `btnLeavePrev2`:

```powerfx
Set(varFormStep, 1)
```

---

### الخطوة 3 — التوقيعان والإرسال

كل عناصر الخطوة 3: `Visible` = `varFormStep = 3`

> **تنبيه:** نموذج الإجازة يحتوي **توقيعَين** — توقيع مقدم الطلب (الموظف) وتوقيع المدير المعتمِد. انظر التدفق C في `04-PowerAutomate-Flows.md`.

#### 3-أ. توقيع مقدم الطلب (الموظف)

أضف **Label** تعليمات:

```powerfx
If(varLang = "ar", "توقيع مقدم الطلب (الموظف)", "Applicant Signature (Employee)")
```

- **Pen input** → سمّه `penApplicantSig`.
- خاصية `Mode`: `PenMode.Draw`
- خاصية `BorderColor`: `varColorGold`
- خاصية `Fill`: `varColorCardBg`

- زر مسح → سمّه `btnLeaveClrApplicantSig`:

```powerfx
Reset(penApplicantSig)
```

#### 3-ب. توقيع المدير

أضف **Label** تعليمات:

```powerfx
If(varLang = "ar", "توقيع المدير المعتمِد", "Approving Manager Signature")
```

- **Pen input** → سمّه `penSignature`.
- خاصية `Mode`: `PenMode.Draw`
- خاصية `BorderColor`: `varColorGold`
- خاصية `Fill`: `varColorCardBg`

- زر مسح → سمّه `btnLeaveClrMgrSig`:

```powerfx
Reset(penSignature)
```

#### 3-ج. زر الإرسال — يستدعي تدفق `GenerateLeavePDF`

> المرجع: القسم 14-C من `03-PowerFx-Cookbook.md`.

- **Button** → سمّه `btnLeaveSubmit`.
- خاصية `Text`: `If(varLang = "ar", "إرسال الطلب", "Submit Request")`
- خاصية `Fill`: `varColorGold` — خاصية `Color`: `varColorBg`
- خاصية `DisplayMode`:

```powerfx
If(
    (penApplicantSig.Image = Blank() || IsBlank(penApplicantSig.Image))
        || (penSignature.Image = Blank() || IsBlank(penSignature.Image)),
    DisplayMode.Disabled,
    DisplayMode.Edit
)
```

- خاصية `OnSelect`:

```powerfx
// القسم 14-C من 03-PowerFx-Cookbook.md
Set(varIsSubmitting, true);

Set(
    varLeavePDF,
    GenerateLeavePDF.Run(
        varFormEmpName,                                                  // emp_name
        varFormEmpHRID,                                                  // emp_hrid
        varFormEmpAppointment,                                           // emp_appointment
        varFormEmpDept,                                                  // emp_dept
        varFormEmpJobTitle,                                              // emp_jobtitle
        varFormLeaveType,                                                // leave_type
        varFormLastWorkDay,                                              // last_work_day
        varFormStartDate,                                                // start_date
        varFormEndDate,                                                  // end_date
        varFormReturnDate,                                               // return_date
        varFormPhone,                                                    // phone
        varFormTotalDays,                                                // total_days
        varFormApplicantName,                                            // applicant_name
        JSON(penApplicantSig.Image, JSONFormat.IncludeBinaryData),       // applicant_sig_base64
        varFormMgrName,                                                  // manager_name
        JSON(penSignature.Image, JSONFormat.IncludeBinaryData),          // manager_sig_base64
        Text(Today(), "dd/mm/yyyy"),                                     // manager_date
        varFormEmpEmail                                                  // recipient_email
    )
);

Download(varLeavePDF.PDFFile);

Set(varIsSubmitting, false);
Notify(
    If(varLang = "ar", "تم إرسال طلب الإجازة بنجاح", "Leave request submitted successfully"),
    NotificationType.Success
);
Set(varFormStep, 1);
Navigate(scrHome, ScreenTransition.UnCover)
```

> **ربط التدفق:** من **Action** → **Power Automate** → **Add a flow** → اختر `GenerateLeavePDF`.

- مؤشر التحميل `lblLeaveLoading` → خاصية `Visible`: `varIsSubmitting`
- زر "السابق" → سمّه `btnLeavePrev3`:

```powerfx
Set(varFormStep, 2)
```

---

## إعداد App.OnStart — إضافة المتغيرات المطلوبة للنماذج

في خاصية `App.OnStart` داخل `Concurrent` أضف الأسطر التالية (القسم 12-A من الكتاب):

```powerfx
// متغيرات النماذج الثلاثة — تُضبط عند فتح أي نموذج
Set(varFormType,          ""),
Set(varFormStep,          1),
Set(varFormEmpName,       ""),
Set(varFormEmpHRID,       ""),
Set(varFormEmpEmail,      ""),
Set(varFormApplicantName, ""),
Set(varFormMgrName,       User().FullName),

// متغيرات المخالفة
Set(varFormViolationType, ""),
Set(varFormViolationDate, ""),
Set(varFormDuration,      ""),
Set(varFormAbsentDays,    ""),
Set(varFormNotes,         ""),

// متغيرات الاستقالة
Set(varFormDepartment,    ""),
Set(varFormResignDate,    ""),
Set(varFormLastWorkDay,   ""),
Set(varFormReason,        ""),

// متغيرات الإجازة
Set(varFormEmpAppointment,""),
Set(varFormEmpDept,       ""),
Set(varFormEmpJobTitle,   ""),
Set(varFormLeaveType,     ""),
Set(varFormStartDate,     ""),
Set(varFormEndDate,       ""),
Set(varFormReturnDate,    ""),
Set(varFormPhone,         ""),
Set(varFormTotalDays,     ""),

// حالة الإرسال
Set(varIsSubmitting,      false)
```

---

## إعداد أزرار التنقل من `scrHome` لشاشات النماذج

في شاشة `scrHome` الأزرار الثلاثة (موجودة من الأساس — راجع `02-Build-Guide.md` قسم 4.1) أضف على كل منها إعادة تهيئة الخطوة:

- زر "نموذج مخالفة":

```powerfx
Set(varFormStep, 1);
Set(varFormEmpName, "");
Navigate(scrFormViolation, ScreenTransition.Cover)
```

- زر "نموذج استقالة":

```powerfx
Set(varFormStep, 1);
Set(varFormEmpName, "");
Navigate(scrFormResignation, ScreenTransition.Cover)
```

- زر "نموذج إجازة":

```powerfx
Set(varFormStep, 1);
Set(varFormEmpName, "");
Navigate(scrFormLeave, ScreenTransition.Cover)
```

---

## قائمة تحقق — النماذج الثلاثة

### `scrFormViolation`
- [ ] `varMyKey` يُضبط في App.OnStart بـ `LookUp(colLeaders, Email = User().Email, Title)`
- [ ] `galVioEmpPicker` مصدره `Filter(colEmployees, ManagerKey = varMyKey, ...)`
- [ ] `OnSelect` البطاقة يحفظ `varFormEmpName` و`varFormEmpHRID` و`varFormEmpEmail`
- [ ] `ddVioType` فيه القيم الأربع
- [ ] `inpVioDate` و`inpVioDuration` و`inpVioAbsentDays` و`inpVioNotes` موجودة
- [ ] `penSignature` مع زر `Reset`
- [ ] `btnVioSubmit` متصل بـ `GenerateViolationPDF`
- [ ] `btnVioSubmit.DisplayMode` يتحقق من وجود توقيع
- [ ] الكود يستخدم `JSON(penSignature.Image, JSONFormat.IncludeBinaryData)` (القسم 13-A)
- [ ] `Download(varViolationPDF.PDFFile)` بعد الإرسال
- [ ] `varIsSubmitting` يتحكم في spinner ومنع الضغط المزدوج

### `scrFormResignation`
- [ ] `galResEmpPicker` مصدره `Filter(colEmployees, ManagerKey = varMyKey, ...)`
- [ ] `inpResDept` و`inpResDate` و`inpResLastDay` و`inpResReason` موجودة
- [ ] `penSignature` مع زر `Reset`
- [ ] `btnResSubmit` متصل بـ `GenerateResignationPDF`
- [ ] `Download(varResignationPDF.PDFFile)` بعد الإرسال

### `scrFormLeave`
- [ ] `galLeaveEmpPicker` مصدره `Filter(colEmployees, ManagerKey = varMyKey, ...)`
- [ ] جميع الحقول الـ 10 موجودة (appointment / dept / jobtitle / leave_type / last_work_day / start / end / return / phone / total_days)
- [ ] `penApplicantSig` لتوقيع الموظف
- [ ] `penSignature` لتوقيع المدير
- [ ] كلا الـ Pen Input لهما أزرار `Reset` منفصلة
- [ ] `btnLeaveSubmit.DisplayMode` يتحقق من كلا التوقيعَين
- [ ] `btnLeaveSubmit` متصل بـ `GenerateLeavePDF`
- [ ] `JSON(penApplicantSig.Image, JSONFormat.IncludeBinaryData)` لـ `applicant_sig_base64`
- [ ] `JSON(penSignature.Image, JSONFormat.IncludeBinaryData)` لـ `manager_sig_base64`
- [ ] `Download(varLeavePDF.PDFFile)` بعد الإرسال

---

*آخر تحديث: 2026-06-06 — يطابق أسماء التدفقات في `04-PowerAutomate-Flows.md` وأسماء الأعمدة في `01-SharePoint-Lists-Schema.md`*


---
# 🔄 المرحلة ٥: التدفقات والنشر
# القسم 06d — تدفقات Power Automate والنشر والمشاركة

> **تاريخ الكتابة:** 2026-06-06
> **المشروع:** ترحيل Collection Barq إلى Power Apps Canvas + SharePoint
> **المراجع:** `02-Build-Guide.md` (§7 و§8) — `03-PowerFx-Cookbook.md` (§14) — `04-PowerAutomate-Flows.md`

---

## تنبيهات مهمة قبل البدء

> **Premium — ترخيص مطلوب:**
> موصّل **Word Online (Business)** هو موصّل **مميز (Premium)**. فقط المدير/المديران اللذان ينشئان التدفقات يحتاجان ترخيص **Power Automate Premium** أو **Power Apps Premium**. باقي مستخدمي التطبيق لا يحتاجون أي ترخيص مميز.

> **قوالب Word — رفعها قبل بناء أي تدفق:**
> يجب رفع ملفات القوالب الثلاثة من مجلد `templates/` في حزمة الترحيل إلى OneDrive في مجلد `Templates/`:
> - `Templates/ViolationTemplate.docx`
> - `Templates/ResignationTemplate.docx`
> - `Templates/LeaveTemplate.docx`
>
> طريقة الرفع: افتح `onedrive.live.com` أو مجلد OneDrive على جهازك → انتقل إلى `Documents` → أنشئ مجلد اسمه `Templates` → ارفع الملفات الثلاثة.
> البديل: ارفعها في مكتبة Documents في موقع SharePoint نفسه (`https://globalfinancingsolutions.sharepoint.com/sites/CollectionBarq`) واختر Location = SharePoint عند إعداد الخطوة 3 في كل تدفق.

> **ترتيب القوالب — Content Controls:**
> كل قالب يحتوي Content Controls بـ Tags محددة. إذا كانت القوالب غير جاهزة بعد، راجع القسم المقابل في `04-PowerAutomate-Flows.md` لجدول Tags كل نموذج.

---

## الجزء الأول: بناء التدفقات الأربعة

---

## التدفق A: `GenerateViolationPDF`

### الخطوة 0 — رفع قالب Word

1. ارفع `ViolationTemplate.docx` إلى OneDrive في المسار: `/Documents/Templates/ViolationTemplate.docx`
2. تحقق أن Content Controls التالية موجودة بالـ Tags بالضبط:

| Tag | نوع الـ Control |
|---|---|
| `emp_name` | Plain Text |
| `emp_hrid` | Plain Text |
| `emp_email` | Plain Text |
| `violation_type` | Plain Text |
| `violation_date` | Plain Text |
| `violation_duration` | Plain Text |
| `absent_days` | Plain Text |
| `notes` | Plain Text |
| `manager_name` | Plain Text |
| `manager_sig` | **Picture** |
| `manager_date` | Plain Text |

### الخطوة 1 — إنشاء التدفق

1. افتح [make.powerautomate.com](https://make.powerautomate.com).
2. من الشريط الجانبي اضغط **My flows** ← **New flow** ← **Instant cloud flow**.
3. في حقل **Flow name** اكتب: `GenerateViolationPDF`
4. اختر **PowerApps (V2)** كـ Trigger.
5. اضغط **Create**.

### الخطوة 2 — إعداد Trigger: PowerApps (V2)

في بطاقة الـ Trigger **PowerApps (V2)** اضغط **Add an input** لكل حقل:

| اسم المدخل | النوع |
|---|---|
| `emp_name` | Text |
| `emp_hrid` | Text |
| `emp_email` | Text |
| `violation_type` | Text |
| `violation_date` | Text |
| `violation_duration` | Text |
| `absent_days` | Text |
| `notes` | Text |
| `manager_name` | Text |
| `manager_sig_base64` | Text |
| `manager_date` | Text |
| `recipient_email` | Text |

> **ملاحظة:** `manager_sig_base64` يستقبل سلسلة base64 للصورة قادمة من Power Apps عبر `JSON(penSignature.Image, JSONFormat.IncludeBinaryData)`. `recipient_email` هو إيميل المستقبِل (الموظف والمدير).

### الخطوة 3 — تعبئة قالب Word (Populate a Microsoft Word template)

1. اضغط **+ New step**.
2. ابحث عن: `Word Online (Business)` ← اختر الإجراء: **Populate a Microsoft Word template**.
3. اعبّئ الحقول الأساسية:

| الحقل | القيمة |
|---|---|
| **Location** | `OneDrive for Business` |
| **Document Library** | `OneDrive` |
| **File** | `/Documents/Templates/ViolationTemplate.docx` |

4. بعد اختيار الملف تظهر Tags تلقائياً — اربط كل Tag من Dynamic content:

| Tag في Word | القيمة |
|---|---|
| `emp_name` | `triggerBody()?['emp_name']` |
| `emp_hrid` | `triggerBody()?['emp_hrid']` |
| `emp_email` | `triggerBody()?['emp_email']` |
| `violation_type` | `triggerBody()?['violation_type']` |
| `violation_date` | `triggerBody()?['violation_date']` |
| `violation_duration` | `triggerBody()?['violation_duration']` |
| `absent_days` | `triggerBody()?['absent_days']` |
| `notes` | `triggerBody()?['notes']` |
| `manager_name` | `triggerBody()?['manager_name']` |
| `manager_sig` **(Picture)** | `base64ToBinary(triggerBody()?['manager_sig_base64'])` |
| `manager_date` | `triggerBody()?['manager_date']` |

> **مهم لصورة التوقيع:** عند ربط `manager_sig` اختر النوع **Image** وليس Text، وضع التعبير: `base64ToBinary(triggerBody()?['manager_sig_base64'])` في حقل القيمة عبر زر **Expression** في نافذة Dynamic content.

### الخطوة 4 — تحويل Word إلى PDF

1. اضغط **+ New step**.
2. ابحث عن: `Word Online (Business)` ← اختر: **Convert Word Document to PDF**.
3. في حقل **File Content** اختر من Dynamic content: **Microsoft Word Document** (ناتج "Populate a Microsoft Word template" ← `body/$content`).

### الخطوة 5 — إرسال الإيميل مع PDF مرفقاً

1. اضغط **+ New step**.
2. ابحث عن: `Office 365 Outlook` ← اختر: **Send an email (V2)**.
3. اعبّئ الحقول:

| الحقل | القيمة |
|---|---|
| **To** | `triggerBody()?['recipient_email']` |
| **Subject** | `نموذج مخالفة — ` ثم Dynamic content: `triggerBody()?['emp_name']` |
| **Body** | الصق قالب HTML أدناه |
| **Is HTML** | فعّل الخيار (Yes) |

4. افتح **Show advanced options** ← قسم **Attachments** ← اضغط **Add new item**:

| الحقل | القيمة |
|---|---|
| **Name** | `Violation_` + Dynamic content `emp_name` + `_` + Dynamic content `violation_date` + `.pdf` |
| **Content** | من Dynamic content: **PDF Document** (ناتج خطوة Convert ← `body/$content`) |

**قالب HTML لجسم إيميل المخالفة — الصق هذا في حقل Body:**

```html
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"></head>
<body style="font-family:'Segoe UI',Tahoma,Arial,sans-serif;background-color:#f5f5f5;margin:0;padding:20px;">
  <table width="600" cellpadding="0" cellspacing="0" style="margin:0 auto;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.15);">
    <tr>
      <td style="background-color:#0f172a;padding:24px 32px;text-align:center;">
        <h1 style="color:#FBBF24;margin:0;font-size:22px;letter-spacing:1px;">Collection Barq</h1>
        <p style="color:#94a3b8;margin:6px 0 0 0;font-size:13px;">نموذج مخالفة رسمي | Official Violation Form</p>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 32px;">
        <p style="color:#0f172a;font-size:15px;margin:0 0 16px 0;">السادة المحترمون،</p>
        <p style="color:#374151;font-size:14px;line-height:1.8;margin:0 0 20px 0;">
          مرفق طيّه نموذج مخالفة رسمي خاص بالموظف <strong style="color:#0f172a;">@{triggerBody()?['emp_name']}</strong>
          (الرقم الوظيفي: <strong>@{triggerBody()?['emp_hrid']}</strong>).
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
          <tr style="background-color:#0f172a;">
            <th style="color:#FBBF24;padding:10px 14px;text-align:right;font-size:13px;border:1px solid #1e293b;">البند</th>
            <th style="color:#FBBF24;padding:10px 14px;text-align:right;font-size:13px;border:1px solid #1e293b;">التفاصيل</th>
          </tr>
          <tr style="background-color:#f8fafc;">
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#64748b;">اسم الموظف</td>
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#0f172a;font-weight:600;">@{triggerBody()?['emp_name']}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#64748b;">الرقم الوظيفي</td>
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#0f172a;">@{triggerBody()?['emp_hrid']}</td>
          </tr>
          <tr style="background-color:#f8fafc;">
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#64748b;">نوع المخالفة</td>
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#dc2626;font-weight:600;">@{triggerBody()?['violation_type']}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#64748b;">تاريخ المخالفة</td>
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#0f172a;">@{triggerBody()?['violation_date']}</td>
          </tr>
          <tr style="background-color:#f8fafc;">
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#64748b;">المدير المباشر</td>
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#0f172a;">@{triggerBody()?['manager_name']}</td>
          </tr>
        </table>
        <p style="color:#374151;font-size:13px;line-height:1.7;margin:0 0 8px 0;">النموذج مرفق بهذا الإيميل بصيغة PDF. يُرجى الاطلاع عليه وحفظه للأرشفة الرسمية.</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;">
        <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">
          Dear Team, please find attached the official violation form for employee <strong>@{triggerBody()?['emp_name']}</strong>. Kindly review and archive it accordingly.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color:#0f172a;padding:16px 32px;text-align:center;">
        <p style="color:#FBBF24;font-size:12px;margin:0;">Collection Barq — نظام إدارة الفريق الداخلي</p>
        <p style="color:#475569;font-size:11px;margin:4px 0 0 0;">هذا إيميل تلقائي — يُرجى عدم الرد عليه مباشرة</p>
      </td>
    </tr>
  </table>
</body>
</html>
```

### الخطوة 6 — إنشاء سجل في قائمة `DownloadLog`

1. اضغط **+ New step**.
2. ابحث عن: `SharePoint` ← اختر: **Create item**.
3. اعبّئ الحقول:

| حقل SharePoint | القيمة |
|---|---|
| **Site Address** | `https://globalfinancingsolutions.sharepoint.com/sites/CollectionBarq` |
| **List Name** | `DownloadLog` |
| **Title** | `مخالفة` |
| **UserEmail** | `triggerBody()?['recipient_email']` |
| **UserName** | `triggerBody()?['manager_name']` |
| **FormType** | `Violation` |
| **TargetEmployee** | `triggerBody()?['emp_name']` |
| **GeneratedAt** | في حقل Expression اكتب: `utcNow()` |

### الخطوة 7 — إرجاع PDF إلى Power Apps (Respond to a PowerApp or flow)

1. اضغط **+ New step**.
2. ابحث عن: `Power Apps` ← اختر: **Respond to a PowerApp or flow**.
3. اضغط **+ Add an output** ← اختر **File**.
4. سمّ المخرج: `PDFFile`
5. في حقل القيمة: من Dynamic content اختر **PDF Document** (ناتج خطوة Convert ← `body/$content`).

### الخطوة 8 — حفظ التدفق

1. اضغط **Save** في الأعلى.
2. انتظر حتى تظهر رسالة "Your flow is ready to use".
3. انسخ رابط التدفق من شريط العنوان — ستحتاجه لاحقاً لإضافته في Power Apps.

---

## التدفق B: `GenerateResignationPDF`

### الخطوة 0 — رفع قالب Word

- ارفع `ResignationTemplate.docx` إلى OneDrive في: `/Documents/Templates/ResignationTemplate.docx`
- Content Controls المطلوبة: `emp_name`، `emp_hrid`، `emp_email`، `department`، `resignation_date`، `last_working_day`، `reason`، `manager_name`، `manager_sig` **(Picture)**، `manager_date`

### الخطوة 1 — إنشاء التدفق

1. **My flows** ← **New flow** ← **Instant cloud flow**.
2. الاسم: `GenerateResignationPDF`
3. الـ Trigger: **PowerApps (V2)** ← **Create**.

### الخطوة 2 — مدخلات Trigger: PowerApps (V2)

اضغط **Add an input** لكل حقل:

| اسم المدخل | النوع |
|---|---|
| `emp_name` | Text |
| `emp_hrid` | Text |
| `emp_email` | Text |
| `department` | Text |
| `resignation_date` | Text |
| `last_working_day` | Text |
| `reason` | Text |
| `manager_name` | Text |
| `manager_sig_base64` | Text |
| `manager_date` | Text |
| `recipient_email` | Text |

### الخطوة 3 — تعبئة قالب Word

1. **+ New step** ← `Word Online (Business)` ← **Populate a Microsoft Word template**.
2. **Location:** `OneDrive for Business` | **File:** `/Documents/Templates/ResignationTemplate.docx`
3. اربط Tags:

| Tag | القيمة |
|---|---|
| `emp_name` | `triggerBody()?['emp_name']` |
| `emp_hrid` | `triggerBody()?['emp_hrid']` |
| `emp_email` | `triggerBody()?['emp_email']` |
| `department` | `triggerBody()?['department']` |
| `resignation_date` | `triggerBody()?['resignation_date']` |
| `last_working_day` | `triggerBody()?['last_working_day']` |
| `reason` | `triggerBody()?['reason']` |
| `manager_name` | `triggerBody()?['manager_name']` |
| `manager_sig` **(Picture)** | `base64ToBinary(triggerBody()?['manager_sig_base64'])` |
| `manager_date` | `triggerBody()?['manager_date']` |

### الخطوات 4–7 — نفس التدفق A مع الفروقات التالية

**الخطوة 4 (Convert to PDF):** نفس الإجراء تماماً.

**الخطوة 5 (Send email):**
- **Subject:** `نموذج استقالة — ` + `triggerBody()?['emp_name']`
- **Body:** استخدم قالب HTML أدناه:

```html
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"></head>
<body style="font-family:'Segoe UI',Tahoma,Arial,sans-serif;background-color:#f5f5f5;margin:0;padding:20px;">
  <table width="600" cellpadding="0" cellspacing="0" style="margin:0 auto;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.15);">
    <tr>
      <td style="background-color:#0f172a;padding:24px 32px;text-align:center;">
        <h1 style="color:#FBBF24;margin:0;font-size:22px;letter-spacing:1px;">Collection Barq</h1>
        <p style="color:#94a3b8;margin:6px 0 0 0;font-size:13px;">نموذج استقالة رسمي | Official Resignation Form</p>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 32px;">
        <p style="color:#0f172a;font-size:15px;margin:0 0 16px 0;">السادة المحترمون،</p>
        <p style="color:#374151;font-size:14px;line-height:1.8;margin:0 0 20px 0;">
          مرفق طيّه نموذج استقالة رسمي خاص بالموظف <strong>@{triggerBody()?['emp_name']}</strong>
          (الرقم الوظيفي: <strong>@{triggerBody()?['emp_hrid']}</strong>).
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
          <tr style="background-color:#0f172a;">
            <th style="color:#FBBF24;padding:10px 14px;text-align:right;font-size:13px;border:1px solid #1e293b;">البند</th>
            <th style="color:#FBBF24;padding:10px 14px;text-align:right;font-size:13px;border:1px solid #1e293b;">التفاصيل</th>
          </tr>
          <tr style="background-color:#f8fafc;">
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#64748b;">اسم الموظف</td>
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#0f172a;font-weight:600;">@{triggerBody()?['emp_name']}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#64748b;">القسم</td>
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#0f172a;">@{triggerBody()?['department']}</td>
          </tr>
          <tr style="background-color:#f8fafc;">
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#64748b;">تاريخ الاستقالة</td>
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#0f172a;">@{triggerBody()?['resignation_date']}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#64748b;">آخر يوم عمل</td>
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#dc2626;font-weight:600;">@{triggerBody()?['last_working_day']}</td>
          </tr>
          <tr style="background-color:#f8fafc;">
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#64748b;">المدير المباشر</td>
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#0f172a;">@{triggerBody()?['manager_name']}</td>
          </tr>
        </table>
        <p style="color:#374151;font-size:13px;line-height:1.7;margin:0;">النموذج مرفق بهذا الإيميل بصيغة PDF. يُرجى الاطلاع عليه واتخاذ الإجراءات اللازمة.</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;">
        <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">
          Dear Team, please find attached the official resignation form for <strong>@{triggerBody()?['emp_name']}</strong>.
          Last working day: <strong>@{triggerBody()?['last_working_day']}</strong>. Please take the necessary action.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color:#0f172a;padding:16px 32px;text-align:center;">
        <p style="color:#FBBF24;font-size:12px;margin:0;">Collection Barq — نظام إدارة الفريق الداخلي</p>
        <p style="color:#475569;font-size:11px;margin:4px 0 0 0;">هذا إيميل تلقائي — يُرجى عدم الرد عليه مباشرة</p>
      </td>
    </tr>
  </table>
</body>
</html>
```

**الخطوة 6 (DownloadLog):**

| حقل | القيمة |
|---|---|
| **Site Address** | `https://globalfinancingsolutions.sharepoint.com/sites/CollectionBarq` |
| **List Name** | `DownloadLog` |
| **Title** | `استقالة` |
| **FormType** | `Resignation` |
| **TargetEmployee** | `triggerBody()?['emp_name']` |
| **UserName** | `triggerBody()?['manager_name']` |
| **UserEmail** | `triggerBody()?['recipient_email']` |
| **GeneratedAt** | Expression: `utcNow()` |

**الخطوة 7 (Respond):** نفس الإجراء، المخرج: `PDFFile` من ناتج Convert.

**الخطوة 8:** اضغط **Save**.

---

## التدفق C: `GenerateLeavePDF`

### الخطوة 0 — رفع قالب Word

- ارفع `LeaveTemplate.docx` إلى OneDrive في: `/Documents/Templates/LeaveTemplate.docx`
- Content Controls المطلوبة: `emp_name`، `emp_hrid`، `emp_appointment`، `emp_dept`، `emp_jobtitle`، `leave_type`، `last_work_day`، `start_date`، `end_date`، `return_date`، `phone`، `total_days`، `applicant_name`، `applicant_sig` **(Picture)**، `manager_name`، `manager_sig` **(Picture)**، `manager_date`

> **ملاحظة:** هذا النموذج يحتوي **توقيعَين** — `applicant_sig` للموظف و`manager_sig` للمدير — كلاهما من نوع Picture Content Control.

### الخطوة 1 — إنشاء التدفق

1. **My flows** ← **New flow** ← **Instant cloud flow**.
2. الاسم: `GenerateLeavePDF`
3. الـ Trigger: **PowerApps (V2)** ← **Create**.

### الخطوة 2 — مدخلات Trigger: PowerApps (V2)

| اسم المدخل | النوع |
|---|---|
| `emp_name` | Text |
| `emp_hrid` | Text |
| `emp_appointment` | Text |
| `emp_dept` | Text |
| `emp_jobtitle` | Text |
| `leave_type` | Text |
| `last_work_day` | Text |
| `start_date` | Text |
| `end_date` | Text |
| `return_date` | Text |
| `phone` | Text |
| `total_days` | Text |
| `applicant_name` | Text |
| `applicant_sig_base64` | Text |
| `manager_name` | Text |
| `manager_sig_base64` | Text |
| `manager_date` | Text |
| `recipient_email` | Text |

### الخطوة 3 — تعبئة قالب Word

1. **+ New step** ← `Word Online (Business)` ← **Populate a Microsoft Word template**.
2. **File:** `/Documents/Templates/LeaveTemplate.docx`
3. اربط Tags:

| Tag | القيمة |
|---|---|
| `emp_name` | `triggerBody()?['emp_name']` |
| `emp_hrid` | `triggerBody()?['emp_hrid']` |
| `emp_appointment` | `triggerBody()?['emp_appointment']` |
| `emp_dept` | `triggerBody()?['emp_dept']` |
| `emp_jobtitle` | `triggerBody()?['emp_jobtitle']` |
| `leave_type` | `triggerBody()?['leave_type']` |
| `last_work_day` | `triggerBody()?['last_work_day']` |
| `start_date` | `triggerBody()?['start_date']` |
| `end_date` | `triggerBody()?['end_date']` |
| `return_date` | `triggerBody()?['return_date']` |
| `phone` | `triggerBody()?['phone']` |
| `total_days` | `triggerBody()?['total_days']` |
| `applicant_name` | `triggerBody()?['applicant_name']` |
| `applicant_sig` **(Picture)** | `base64ToBinary(triggerBody()?['applicant_sig_base64'])` |
| `manager_name` | `triggerBody()?['manager_name']` |
| `manager_sig` **(Picture)** | `base64ToBinary(triggerBody()?['manager_sig_base64'])` |
| `manager_date` | `triggerBody()?['manager_date']` |

### الخطوات 4–7 — نفس التدفق A مع الفروقات التالية

**الخطوة 4 (Convert to PDF):** نفس الإجراء تماماً.

**الخطوة 5 (Send email):**
- **Subject:** `طلب إجازة — ` + `triggerBody()?['emp_name']`
- **Body:** استخدم قالب HTML أدناه:

```html
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"></head>
<body style="font-family:'Segoe UI',Tahoma,Arial,sans-serif;background-color:#f5f5f5;margin:0;padding:20px;">
  <table width="600" cellpadding="0" cellspacing="0" style="margin:0 auto;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.15);">
    <tr>
      <td style="background-color:#0f172a;padding:24px 32px;text-align:center;">
        <h1 style="color:#FBBF24;margin:0;font-size:22px;letter-spacing:1px;">Collection Barq</h1>
        <p style="color:#94a3b8;margin:6px 0 0 0;font-size:13px;">طلب إجازة رسمي | Official Leave Request</p>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 32px;">
        <p style="color:#0f172a;font-size:15px;margin:0 0 16px 0;">السادة المحترمون،</p>
        <p style="color:#374151;font-size:14px;line-height:1.8;margin:0 0 20px 0;">
          مرفق طيّه طلب إجازة رسمي خاص بالموظف <strong>@{triggerBody()?['emp_name']}</strong>
          (الرقم الوظيفي: <strong>@{triggerBody()?['emp_hrid']}</strong>).
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
          <tr style="background-color:#0f172a;">
            <th style="color:#FBBF24;padding:10px 14px;text-align:right;font-size:13px;border:1px solid #1e293b;">البند</th>
            <th style="color:#FBBF24;padding:10px 14px;text-align:right;font-size:13px;border:1px solid #1e293b;">التفاصيل</th>
          </tr>
          <tr style="background-color:#f8fafc;">
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#64748b;">القسم</td>
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#0f172a;">@{triggerBody()?['emp_dept']}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#64748b;">نوع الإجازة</td>
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#0f172a;font-weight:600;">@{triggerBody()?['leave_type']}</td>
          </tr>
          <tr style="background-color:#f8fafc;">
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#64748b;">تاريخ البداية</td>
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#0f172a;">@{triggerBody()?['start_date']}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#64748b;">تاريخ النهاية</td>
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#0f172a;">@{triggerBody()?['end_date']}</td>
          </tr>
          <tr style="background-color:#f8fafc;">
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#64748b;">تاريخ العودة</td>
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#16a34a;font-weight:600;">@{triggerBody()?['return_date']}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#64748b;">إجمالي الأيام</td>
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#0f172a;font-weight:600;">@{triggerBody()?['total_days']} يوم</td>
          </tr>
          <tr style="background-color:#f8fafc;">
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#64748b;">المدير المباشر</td>
            <td style="padding:10px 14px;font-size:13px;border:1px solid #e2e8f0;color:#0f172a;">@{triggerBody()?['manager_name']}</td>
          </tr>
        </table>
        <p style="color:#374151;font-size:13px;line-height:1.7;margin:0;">النموذج مرفق بهذا الإيميل بصيغة PDF. يُرجى الاطلاع عليه واتخاذ الإجراءات المناسبة.</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;">
        <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">
          Dear Team, please find attached the official leave request for <strong>@{triggerBody()?['emp_name']}</strong>.
          Period: <strong>@{triggerBody()?['start_date']}</strong> to <strong>@{triggerBody()?['end_date']}</strong>
          (@{triggerBody()?['total_days']} days). Return: <strong>@{triggerBody()?['return_date']}</strong>.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color:#0f172a;padding:16px 32px;text-align:center;">
        <p style="color:#FBBF24;font-size:12px;margin:0;">Collection Barq — نظام إدارة الفريق الداخلي</p>
        <p style="color:#475569;font-size:11px;margin:4px 0 0 0;">هذا إيميل تلقائي — يُرجى عدم الرد عليه مباشرة</p>
      </td>
    </tr>
  </table>
</body>
</html>
```

**الخطوة 6 (DownloadLog):**

| حقل | القيمة |
|---|---|
| **Site Address** | `https://globalfinancingsolutions.sharepoint.com/sites/CollectionBarq` |
| **List Name** | `DownloadLog` |
| **Title** | `إجازة` |
| **FormType** | `Leave` |
| **TargetEmployee** | `triggerBody()?['emp_name']` |
| **UserName** | `triggerBody()?['manager_name']` |
| **UserEmail** | `triggerBody()?['recipient_email']` |
| **GeneratedAt** | Expression: `utcNow()` |

**الخطوة 7 (Respond):** نفس الإجراء، المخرج: `PDFFile` من ناتج Convert.

**الخطوة 8:** اضغط **Save**.

---

## التدفق D: `ImportFromExcel` (اختياري — يُشغَّل مرة واحدة)

> **الغرض:** نقل بيانات الموظفين والليدرز من `BarqData.xlsx` إلى قوائم SharePoint في المرحلة الأولى من الإعداد. يُعطَّل أو يُحذف بعد نجاح الاستيراد.

### الجزء 1 — استيراد Leaders

1. **My flows** ← **New flow** ← **Instant cloud flow**.
2. الاسم: `ImportFromExcel_Leaders` | الـ Trigger: **Manually trigger a flow** ← **Create**.
3. اضغط **+ New step** ← ابحث عن `Excel Online (Business)` ← اختر: **List rows present in a table**.
4. اعبّئ:
   - **Location:** `OneDrive for Business`
   - **Document Library:** `OneDrive`
   - **File:** `/Documents/BarqData.xlsx`
   - **Table:** `tblLeaders`
5. اضغط **Settings** (ترس الإعدادات في بطاقة الخطوة) ← فعّل **Pagination** ← اضبط **Threshold:** `5000`.
6. اضغط **+ New step** ← ابحث عن `Control` ← اختر: **Apply to each**.
7. في **Select an output** اختر `value` (Dynamic content من "List rows").
8. داخل الـ Loop اضغط **Add an action** ← `SharePoint` ← **Create item**:

| حقل SharePoint | القيمة |
|---|---|
| **Site Address** | `https://globalfinancingsolutions.sharepoint.com/sites/CollectionBarq` |
| **List Name** | `Leaders` |
| **Title** | `items('Apply_to_each')?['Key']` |
| **Key** | `items('Apply_to_each')?['Key']` |
| **NameAr** | `items('Apply_to_each')?['NameAr']` |
| **NameEn** | `items('Apply_to_each')?['NameEn']` |
| **TitleAr** | `items('Apply_to_each')?['TitleAr']` |
| **TitleEn** | `items('Apply_to_each')?['TitleEn']` |
| **DeptAr** | `items('Apply_to_each')?['DeptAr']` |
| **DeptEn** | `items('Apply_to_each')?['DeptEn']` |
| **Email** | `items('Apply_to_each')?['Email']` |
| **Phone** | `items('Apply_to_each')?['Phone']` |
| **Teams** | `items('Apply_to_each')?['Teams']` |
| **ReportsTo** | `items('Apply_to_each')?['ReportsTo']` |

9. اضغط **Save** ← ثم **Run** للاختبار.

### الجزء 2 — استيراد Employees

1. **My flows** ← **New flow** ← **Instant cloud flow**.
2. الاسم: `ImportFromExcel_Employees` | الـ Trigger: **Manually trigger a flow**.
3. نفس الخطوات 3–5 مع **Table:** `tblEmployees` و**Threshold: `5000`** (مهم — لديك 279 موظفاً يتجاوزون الحد الافتراضي 256).
4. داخل Apply to each، إجراء **SharePoint → Create item**:

| حقل SharePoint | القيمة |
|---|---|
| **Site Address** | `https://globalfinancingsolutions.sharepoint.com/sites/CollectionBarq` |
| **List Name** | `Employees` |
| **Title** | `items('Apply_to_each')?['Name']` |
| **ManagerKey** | `items('Apply_to_each')?['ManagerKey']` |
| **ManagerEmail** | `items('Apply_to_each')?['ManagerEmail']` |
| **Name** | `items('Apply_to_each')?['Name']` |
| **HRID** | `items('Apply_to_each')?['HRID']` |
| **Email** | `items('Apply_to_each')?['Email']` |
| **JobTitle** | `items('Apply_to_each')?['Title']` |

> **ملاحظة:** عمود `Title` في Excel يُعيَّن إلى عمود `JobTitle` في SharePoint لتفادي التعارض مع عمود Title الإجباري.

5. **شغّل Leaders أولاً** ثم Employees — لأن Employees تعتمد على مفاتيح Leaders.
6. بعد الاستيراد الناجح: تحقق من عدد صفوف Employees (يجب أن يكون 279) ← ثم **عطّل أو احذف** كلا التدفقين.

---

## الجزء الثاني: ربط كل تدفق بنموذجه في Power Apps

### إضافة التدفقات للتطبيق

1. افتح تطبيق Canvas في [make.powerapps.com](https://make.powerapps.com) ← اضغط **Edit**.
2. من الشريط الجانبي اضغط على أيقونة **Power Automate** (سهمَي دائرة).
3. اضغط **Add flow**.
4. من القائمة ابحث عن `GenerateViolationPDF` ← اضغط عليه لإضافته.
5. كرّر لإضافة `GenerateResignationPDF` و`GenerateLeavePDF`.

> بعد الإضافة يظهر اسم التدفق في لوحة Power Automate، ويصبح متاحاً كـ Function في صيغ Power Fx.

---

### ربط نموذج المخالفة — `scrFormViolation`

انتقل إلى شاشة `scrFormViolation` ← اختر زر "إرسال النموذج" (الخطوة 3) ← في شريط الصيغة الصق:

```powerfx
// خاصية OnSelect لزر الإرسال في scrFormViolation
Set(varIsSubmitting, true);

Set(
    varViolationPDF,
    GenerateViolationPDF.Run(
        varFormEmpName,
        varFormEmpHRID,
        varFormEmpEmail,
        varFormViolationType,
        Text(varFormViolationDate, "dd/mm/yyyy"),
        varFormDuration,
        Text(varFormAbsentDays),
        varFormNotes,
        varFormMgrName,
        JSON(penSignature.Image, JSONFormat.IncludeBinaryData),
        Text(Today(), "dd/mm/yyyy"),
        varFormEmpEmail
    )
);

Download(varViolationPDF.PDFFile);
Set(varIsSubmitting, false);
Notify(
    If(varLang = "ar", "تم إرسال النموذج بنجاح", "Form submitted successfully"),
    NotificationType.Success
);
Navigate(scrHome, ScreenTransition.UnCover)
```

> **ملاحظة:** `penSignature` هو اسم عنصر Pen Input في الخطوة 3 من شاشة المخالفة. `varFormMgrName` يأتي من `User().FullName` أو من حقل نصي يملأه المدير.

---

### ربط نموذج الاستقالة — `scrFormResignation`

انتقل إلى شاشة `scrFormResignation` ← اختر زر "إرسال النموذج" ← في شريط الصيغة الصق:

```powerfx
// خاصية OnSelect لزر الإرسال في scrFormResignation
Set(varIsSubmitting, true);

Set(
    varResignationPDF,
    GenerateResignationPDF.Run(
        varFormEmpName,
        varFormEmpHRID,
        varFormEmpEmail,
        varFormDepartment,
        Text(varFormResignDate, "dd/mm/yyyy"),
        Text(varFormLastWorkDay, "dd/mm/yyyy"),
        varFormReason,
        varFormMgrName,
        JSON(penSignature.Image, JSONFormat.IncludeBinaryData),
        Text(Today(), "dd/mm/yyyy"),
        varFormEmpEmail
    )
);

Download(varResignationPDF.PDFFile);
Set(varIsSubmitting, false);
Notify(
    If(varLang = "ar", "تم إرسال الاستقالة بنجاح", "Resignation submitted successfully"),
    NotificationType.Success
);
Navigate(scrHome, ScreenTransition.UnCover)
```

---

### ربط نموذج الإجازة — `scrFormLeave`

انتقل إلى شاشة `scrFormLeave` ← اختر زر "إرسال الطلب" ← في شريط الصيغة الصق:

```powerfx
// خاصية OnSelect لزر الإرسال في scrFormLeave
Set(varIsSubmitting, true);

Set(
    varLeavePDF,
    GenerateLeavePDF.Run(
        varFormEmpName,
        varFormEmpHRID,
        varFormEmpAppointment,
        varFormEmpDept,
        varFormEmpJobTitle,
        varFormLeaveType,
        Text(varFormLastWorkDay, "dd/mm/yyyy"),
        Text(varFormStartDate, "dd/mm/yyyy"),
        Text(varFormEndDate, "dd/mm/yyyy"),
        Text(varFormReturnDate, "dd/mm/yyyy"),
        varFormPhone,
        Text(varFormTotalDays),
        varFormEmpName,
        JSON(penApplicantSig.Image, JSONFormat.IncludeBinaryData),
        varFormMgrName,
        JSON(penSignature.Image, JSONFormat.IncludeBinaryData),
        Text(Today(), "dd/mm/yyyy"),
        varFormEmpEmail
    )
);

Download(varLeavePDF.PDFFile);
Set(varIsSubmitting, false);
Notify(
    If(varLang = "ar", "تم إرسال طلب الإجازة بنجاح", "Leave request submitted successfully"),
    NotificationType.Success
);
Navigate(scrHome, ScreenTransition.UnCover)
```

> **ملاحظة:** `penApplicantSig` هو توقيع الموظف مقدم الطلب، و`penSignature` هو توقيع المدير — كلاهما عناصر Pen Input في الخطوة 3 من شاشة الإجازة.

### إضافة مؤشر التحميل أثناء الإرسال

في كل شاشة نموذج، أضف Label أو Spinner بخاصية:

```powerfx
// خاصية Visible لمؤشر التحميل (Spinner / Loading Label)
varIsSubmitting
```

```powerfx
// خاصية DisplayMode لزر الإرسال (يُعطَّل أثناء الانتظار)
If(varIsSubmitting, DisplayMode.Disabled, DisplayMode.Edit)
```

---

## الجزء الثالث: نشر التطبيق (Publish)

1. في Power Apps Studio افتح القائمة **File** (أعلى يسار الشاشة).
2. اضغط **Save** ← انتظر حتى تظهر رسالة "Saved successfully".
3. اضغط **Publish**.
4. في نافذة التأكيد اضغط **Publish this version**.
5. انتظر حتى تظهر رسالة النجاح — التطبيق أصبح متاحاً للمستخدمين.

> **نصيحة:** انشر دائماً بعد مجموعة من التغييرات، وليس بعد كل تعديل صغير، لتجنب نشر نسخ غير مكتملة.

---

## الجزء الرابع: مشاركة التطبيق مع مجموعة Entra Security Group

> هذه الخطوة **تحلّ محلّ Firebase Auth بالكامل**. فقط أعضاء مجموعة `Barq Collection` في Microsoft Entra يستطيعون فتح التطبيق — لا توجد صفحة تسجيل دخول مخصصة ولا إدارة كلمات مرور منفصلة.

### الخطوة 1 — إنشاء مجموعة Entra (إذا لم تُنشأ بعد)

1. افتح [entra.microsoft.com](https://entra.microsoft.com) (يتطلب صلاحية Global Admin أو Groups Admin).
2. من الشريط الجانبي اختر **Groups** ← **All groups** ← **New group**.
3. اعبّئ الحقول:
   - **Group type:** `Security`
   - **Group name:** `Barq Collection`
   - **Group description:** `مستخدمو تطبيق Collection Barq`
   - **Membership type:** `Assigned`
4. اضغط **Create**.
5. افتح المجموعة ← اضغط **Members** ← **Add members** ← أضف أعضاء الفريق الـ 14 بإيميلاتهم.

### الخطوة 2 — مشاركة التطبيق مع المجموعة

1. افتح [make.powerapps.com](https://make.powerapps.com).
2. من الشريط الجانبي اضغط **Apps**.
3. ابحث عن **Collection Barq** ← اضغط على **...** (النقاط الثلاث) بجانبه ← **Share**.
4. في حقل البحث في نافذة Share اكتب: `Barq Collection`
5. اختر المجموعة من القائمة المنسدلة.
6. في قسم **Data permissions**:
   - تأكد أن SharePoint يظهر في القائمة ← اتركه على **Can use** (الوصول للقراءة كافٍ لغالبية المستخدمين).
7. **Role:** اختر **User** (وليس Co-owner — هذا للمديرين التقنيين فقط).
8. اضغط **Share**.

> **تنبيه:** مشاركة التطبيق وحدها لا تكفي — يجب أيضاً أن تملك المجموعة صلاحية **قراءة** قوائم SharePoint.

### الخطوة 3 — مشاركة موقع SharePoint مع المجموعة

1. افتح موقع SharePoint: `https://globalfinancingsolutions.sharepoint.com/sites/CollectionBarq`
2. اضغط على **Settings** (ترس الإعدادات ← أعلى يمين) ← **Site permissions**.
3. اضغط **Share site**.
4. في حقل البحث اكتب: `Barq Collection`
5. اختر المجموعة ← حدد الصلاحية: **Read**.
6. اضغط **Add**.
7. لإتاحة الكتابة في `DownloadLog` (لأن Power Automate يكتب فيها):
   - في صفحة Site permissions اضغط **Advanced permissions settings**.
   - ابحث عن `DownloadLog` في Libraries/Lists.
   - أضف المجموعة أو حساب الخدمة الذي ينفّذ التدفقات بصلاحية **Contribute** على تلك القائمة تحديداً.

> **ملاحظة مهمة:** تدفقات Power Automate تعمل بصلاحيات المدير الذي أنشأها (connection owner) — لا يحتاج المستخدمون العاديون أي ترخيص Premium لتشغيل النموذج من داخل التطبيق. فقط المدير منشئ التدفق يحتاج ترخيص Premium.

### الخطوة 4 — إرسال الرابط للفريق

1. بعد المشاركة، انسخ رابط التطبيق من نافذة Share.
   - الرابط بالشكل: `https://apps.powerapps.com/play/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
2. أرسل الرابط للفريق.
3. البديل الأفضل — إضافة التطبيق كتاب (Tab) في Microsoft Teams:
   - في Teams افتح القناة المطلوبة ← اضغط **+** بجانب التبويبات العليا.
   - ابحث عن **Power Apps** ← اختره.
   - ابحث عن **Collection Barq** ← اضغط **Add** ← **Save**.
   - الآن يفتح التطبيق مباشرة من داخل Teams دون الحاجة لرابط منفصل.

---

## قائمة التحقق النهائية — هذا القسم

### التدفقات

- [ ] ملفات قوالب Word الثلاثة مرفوعة في OneDrive: `/Documents/Templates/`
- [ ] تدفق `GenerateViolationPDF` منشأ، 7 خطوات، اختبار تشغيل ناجح
- [ ] تدفق `GenerateResignationPDF` منشأ، 7 خطوات، اختبار تشغيل ناجح
- [ ] تدفق `GenerateLeavePDF` منشأ، 7 خطوات (توقيعان)، اختبار تشغيل ناجح
- [ ] كل تدفق يكتب صفاً في `DownloadLog` بعد التوليد
- [ ] تدفق `ImportFromExcel_Leaders` شُغِّل بنجاح (23 صف في Leaders)
- [ ] تدفق `ImportFromExcel_Employees` شُغِّل بنجاح (279 صف في Employees)
- [ ] تدفقا الاستيراد مُعطَّلان أو محذوفان بعد الاكتمال

### ربط التطبيق

- [ ] التدفقات الثلاثة مضافة في لوحة Power Automate داخل Power Apps Studio
- [ ] زر إرسال المخالفة يستدعي `GenerateViolationPDF.Run(...)` بالمعاملات الصحيحة
- [ ] زر إرسال الاستقالة يستدعي `GenerateResignationPDF.Run(...)` بالمعاملات الصحيحة
- [ ] زر إرسال الإجازة يستدعي `GenerateLeavePDF.Run(...)` بالمعاملات الصحيحة
- [ ] مؤشر `varIsSubmitting` يُعطّل الزر أثناء الانتظار

### النشر والمشاركة

- [ ] التطبيق نُشر من File ← Save ← Publish ← Publish this version
- [ ] مجموعة Entra `Barq Collection` منشأة وأعضاء الفريق الـ 14 مضافون
- [ ] التطبيق شُورك مع المجموعة بصلاحية User من نافذة Share في make.powerapps.com
- [ ] موقع SharePoint شُورك مع المجموعة بصلاحية Read
- [ ] قائمة `DownloadLog` لها صلاحية Contribute لحساب منشئ التدفقات
- [ ] رابط التطبيق أُرسل للفريق **أو** أُضيف كـ Tab في Teams
- [ ] Firebase Auth القديم لا يُستخدم لهذا التطبيق (تم استبداله بالكامل بمجموعة Entra)

---

*آخر تحديث: 2026-06-06*
