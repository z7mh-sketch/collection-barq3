# دليل Power Fx — Collection Barq Canvas App
## كل الصيغ جاهزة للنسخ واللصق مع شرح عربي

> **ملاحظة قبل البداية:**
> - أسماء القوائم والأعمدة تطابق تماماً ما هو محدد في ملف `01-SharePoint-Lists-Schema.md`.
> - اسم كل **Control** (مربع نص، زر، معرض) موضوع بين قوسين مربعين مثل `[btnLangToggle]` — غيّره ليطابق الاسم الفعلي في تطبيقك.
> - الصيغ مكتوبة بالإنجليزية (هذا مطلب Power Fx) والشرح بالعربي.
> - المسافة البادئة في الصيغ مقصودة لتسهيل القراءة — Power Apps يتقبلها.

---

## الفهرس

1. [App.OnStart — تهيئة التطبيق](#1-apponstart)
2. [نمط اللغة الثنائية — التسميات](#2-bilingual-label-pattern)
3. [زر تبديل اللغة](#3-language-toggle-button)
4. [معرض الليدرز — البحث والفلترة والترتيب](#4-leaders-gallery)
5. [شرائح فلتر الأقسام](#5-department-filter-chips)
6. [الأحرف الأولى من الاسم (Initials)](#6-initials-formula)
7. [أزرار التواصل — إيميل، هاتف، Teams](#7-contact-buttons)
8. [الانتقال لصفحة تفاصيل الليدر](#8-leader-detail-navigate)
9. [معرض الروابط السريعة + نافذة ITSM](#9-quicklinks-gallery--itsm-popup)
10. [معرض روابط التصعيد — الأب والأبناء](#10-escalation-links-gallery)
11. [أكورديون دليل التصعيد](#11-escalation-guide-accordion)
12. [معالج النموذج — ضبط المتغيرات](#12-form-wizard-variables)
13. [التقاط توقيع Pen Input](#13-pen-input-signature)
14. [استدعاء تدفق Power Automate](#14-power-automate-run-call)
15. [متغيرات الألوان والثيم](#15-theme-color-variables)
16. [ملاحظات RTL ومحاذاة اليمين](#16-rtl-alignment-notes)

---

## 1. App.OnStart

**الشرح:**
هذه الصيغة تعمل لحظة فتح التطبيق. مهامها:
- تضبط اللغة الافتراضية على العربية (`varLang = "ar"`).
- تحمّل بيانات كل قائمة SharePoint في مجموعات محلية (`ClearCollect`) حتى يعمل التطبيق بسرعة بدون طلبات شبكة متكررة.
- تضبط القسم الافتراضي في فلتر الأقسام على "الكل".

```powerfx
// ─── App.OnStart ───────────────────────────────────────────────
Concurrent(
    // 1. ضبط اللغة الافتراضية
    Set(varLang, "ar"),

    // 2. ضبط الفلتر الافتراضي للأقسام
    Set(varSelectedDept, "الكل"),

    // 3. تحميل قائمة Leaders
    ClearCollect(
        colLeaders,
        Leaders
    ),

    // 4. تحميل قائمة Employees
    ClearCollect(
        colEmployees,
        Employees
    ),

    // 5. تحميل قائمة QuickLinks
    ClearCollect(
        colQuickLinks,
        QuickLinks
    ),

    // 6. تحميل قائمة EscalationLinks
    ClearCollect(
        colEscalationLinks,
        EscalationLinks
    ),

    // 7. تحميل قائمة EscalationGuide
    ClearCollect(
        colEscalationGuide,
        EscalationGuide
    ),

    // 8. تحميل قائمة EscalationSteps
    ClearCollect(
        colEscalationSteps,
        EscalationSteps
    ),

    // 9. تهيئة مجموعة مفاتيح الأكورديون المفتوحة (فارغة)
    ClearCollect(colExpandedKeys, Blank()),

    // 10. متغير يتتبع الليدر المختار في صفحة التفاصيل
    Set(varSelectedLeader, Blank()),

    // 11. متغير يخفي/يظهر نافذة ITSM
    Set(varShowITSM, false),

    // 12. تهيئة متغيرات النماذج
    Set(varFormEmpName,  ""),
    Set(varFormEmpHRID,  ""),
    Set(varFormEmpEmail, ""),
    Set(varFormStep,     1)
);
// ───────────────────────────────────────────────────────────────
```

> **ملاحظة:** `Concurrent(...)` يشغّل كل الأوامر بالتوازي فيسرّع وقت التحميل. إذا واجهت خطأ في إصدار قديم من Power Apps، استبدلها بسطور `Set(...)` و`ClearCollect(...)` مستقلة.

---

## 2. نمط اللغة الثنائية — التسميات

**الشرح:**
كل تسمية (Label) تحتاج تعرض نصاً يتغير حسب اللغة. الصيغة أدناه تُضاف في خاصية `Text` لأي Label.

### 2-A. نص ثابت (لا يأتي من قائمة)

```powerfx
// خاصية Text لـ Label عادي
If(
    varLang = "ar",
    "الروابط السريعة",
    "Quick Links"
)
```

### 2-B. نص من سجل في معرض (Gallery) — يستخدم ThisItem

```powerfx
// خاصية Text لـ Label داخل معرض Leaders
If(
    varLang = "ar",
    ThisItem.NameAr,
    ThisItem.NameEn
)
```

```powerfx
// خاصية Text للمسمى الوظيفي داخل معرض Leaders
If(
    varLang = "ar",
    ThisItem.TitleAr,
    ThisItem.TitleEn
)
```

```powerfx
// خاصية Text لاسم القسم داخل معرض Leaders
If(
    varLang = "ar",
    ThisItem.DeptAr,
    ThisItem.DeptEn
)
```

### 2-C. نص من متغير (الليدر المختار في صفحة التفاصيل)

```powerfx
// خاصية Text لـ Label في صفحة تفاصيل الليدر
If(
    varLang = "ar",
    varSelectedLeader.NameAr,
    varSelectedLeader.NameEn
)
```

### 2-D. نص فئة دليل التصعيد

```powerfx
// خاصية Text لـ Label داخل معرض EscalationGuide
If(
    varLang = "ar",
    ThisItem.CategoryAr,
    ThisItem.CategoryEn
)
```

### 2-E. نص خطوة دليل التصعيد

```powerfx
// خاصية Text لـ Label داخل معرض EscalationSteps
If(
    varLang = "ar",
    ThisItem.StepAr,
    ThisItem.StepEn
)
```

---

## 3. زر تبديل اللغة

**الشرح:**
زر واحد يقلب اللغة بين العربية والإنجليزية. أضف هذه الصيغة في خاصية `OnSelect` للزر `[btnLangToggle]`.

```powerfx
// خاصية OnSelect لـ [btnLangToggle]
Set(
    varLang,
    If(varLang = "ar", "en", "ar")
)
```

**نص الزر نفسه** — خاصية `Text`:

```powerfx
// خاصية Text لـ [btnLangToggle]
If(varLang = "ar", "EN", "عربي")
```

---

## 4. معرض الليدرز — البحث والفلترة والترتيب

**الشرح:**
المعرض الرئيسي يعرض الليدرز مع:
- **بحث** في الاسم والمسمى والقسم (عربي وإنجليزي).
- **فلتر** حسب القسم المختار (شرائح في القسم التالي).
- **ترتيب** تصاعدي حسب الاسم العربي.

أضف الصيغة أدناه في خاصية `Items` لمعرض `[galLeaders]`. تأكد أن مربع البحث اسمه `[txtSearchLeaders]`.

```powerfx
// خاصية Items لـ [galLeaders]
SortByColumns(
    Filter(
        colLeaders,
        // ── فلتر القسم ──────────────────────────────────────────
        varSelectedDept = "الكل"
            || DeptAr = varSelectedDept,

        // ── فلتر البحث (ثنائي اللغة) ────────────────────────────
        (
            IsBlank(txtSearchLeaders.Text)
            || txtSearchLeaders.Text = ""
        )
        ||
        (
            Search(NameAr,   txtSearchLeaders.Text, "NameAr")   <> Blank()
            || Search(NameEn,  txtSearchLeaders.Text, "NameEn")  <> Blank()
            || Search(TitleAr, txtSearchLeaders.Text, "TitleAr") <> Blank()
            || Search(DeptAr,  txtSearchLeaders.Text, "DeptAr")  <> Blank()
        )
    ),
    // ── الترتيب ─────────────────────────────────────────────────
    "NameAr", SortOrder.Ascending
)
```

> **ملاحظة:** دالة `Search` في Power Apps تُستدعى على **قائمة** (أو مجموعة)، لكن الاستخدام المباشر داخل `Filter` مع عمود واحد بالنمط أعلاه يعمل في Canvas. إذا أعطت خطأ، استبدل بلوك البحث بـ:
>
> ```powerfx
> // بديل نص البحث إذا رفض المحرر الصيغة أعلاه
> (
>     IsBlank(txtSearchLeaders.Text)
>     || txtSearchLeaders.Text = ""
>     || StartsWith(NameAr, txtSearchLeaders.Text)
>     || StartsWith(NameEn, txtSearchLeaders.Text)
>     || StartsWith(TitleAr, txtSearchLeaders.Text)
>     || StartsWith(DeptAr,  txtSearchLeaders.Text)
> )
> ```

### الصيغة الموصى بها (الأكثر موثوقية في Canvas)

```powerfx
// خاصية Items لـ [galLeaders] — النسخة الموثوقة
SortByColumns(
    Filter(
        colLeaders,
        // فلتر القسم
        varSelectedDept = "الكل" || DeptAr = varSelectedDept,
        // فلتر البحث
        IsBlank(txtSearchLeaders.Text)
            || txtSearchLeaders.Text = ""
            || StartsWith(NameAr,   txtSearchLeaders.Text)
            || StartsWith(NameEn,   txtSearchLeaders.Text)
            || StartsWith(TitleAr,  txtSearchLeaders.Text)
            || StartsWith(DeptAr,   txtSearchLeaders.Text)
    ),
    "NameAr", SortOrder.Ascending
)
```

---

## 5. شرائح فلتر الأقسام

**الشرح:**
صف من الأزرار ("الكل"، "خدمة العملاء"، ...) يفلتر معرض الليدرز.
نستخدم `Distinct` لاستخراج الأقسام الفريدة من `colLeaders`.

### 5-A. بناء مجموعة الأقسام (أضفها في App.OnStart بعد ClearCollect الليدرز)

```powerfx
// أضف هذا السطر داخل Concurrent في App.OnStart
ClearCollect(
    colDepts,
    // صف "الكل" أولاً
    Table({DeptAr: "الكل", DeptEn: "All"}),
    // ثم الأقسام الفريدة من Leaders
    AddColumns(
        Distinct(colLeaders, DeptAr),
        "DeptEn",
        LookUp(colLeaders, DeptAr = Value, DeptEn)
    )
)
```

### 5-B. معرض شرائح الأقسام

```powerfx
// خاصية Items لـ [galDeptChips]
colDepts
```

### 5-C. نص الشريحة

```powerfx
// خاصية Text لـ Label داخل [galDeptChips]
If(varLang = "ar", ThisItem.DeptAr, ThisItem.DeptEn)
```

### 5-D. الضغط على شريحة

```powerfx
// خاصية OnSelect لـ [galDeptChips] (على الزر أو الحاوية)
Set(varSelectedDept, ThisItem.DeptAr)
```

### 5-E. لون الخلفية — تمييز الشريحة المختارة

```powerfx
// خاصية Fill لكل شريحة داخل [galDeptChips]
If(
    ThisItem.DeptAr = varSelectedDept,
    varColorGold,       // ذهبي للمختار
    varColorCardBg      // رمادي غامق للبقية
)
```

---

## 6. الأحرف الأولى من الاسم (Initials)

**الشرح:**
تُستخدم في دائرة Avatar داخل بطاقة الليدر. الصيغة تأخذ أول حرف من الكلمة الأولى وأول حرف من الكلمة الثانية.

```powerfx
// خاصية Text لـ Label داخل دائرة Avatar في [galLeaders]
// تعمل مع الاسم الإنجليزي (NameEn)
Concatenate(
    Upper(Left(ThisItem.NameEn, 1)),
    Upper(
        Left(
            Mid(
                ThisItem.NameEn,
                Find(" ", ThisItem.NameEn) + 1,
                1
            ),
            1
        )
    )
)
```

> **مثال:** `"Alanoud Fahad Surayyi"` يعطي `"AF"`

**نسخة مقاومة للخطأ** (إذا لم يكن في الاسم مسافة):

```powerfx
// خاصية Text لـ Avatar Label — نسخة آمنة
If(
    IsBlank(Find(" ", ThisItem.NameEn)),
    // اسم بكلمة واحدة — حرفان أوليان فقط
    Upper(Left(ThisItem.NameEn, 2)),
    // اسم بكلمتين أو أكثر — أول حرف من كل كلمة
    Concatenate(
        Upper(Left(ThisItem.NameEn, 1)),
        Upper(Mid(ThisItem.NameEn, Find(" ", ThisItem.NameEn) + 1, 1))
    )
)
```

---

## 7. أزرار التواصل — إيميل، هاتف، Teams

**الشرح:**
ثلاثة أزرار في بطاقة الليدر أو صفحة تفاصيله.

### 7-A. زر الإيميل

```powerfx
// خاصية OnSelect لـ [btnEmail]
If(
    !IsBlank(ThisItem.Email) && ThisItem.Email <> "",
    Launch("mailto:" & ThisItem.Email),
    Notify(
        If(varLang="ar", "لا يوجد إيميل لهذا الليدر", "No email for this leader"),
        NotificationType.Warning
    )
)
```

**في صفحة التفاصيل** (تستخدم `varSelectedLeader` بدل `ThisItem`):

```powerfx
// خاصية OnSelect لـ [btnEmailDetail]
If(
    !IsBlank(varSelectedLeader.Email) && varSelectedLeader.Email <> "",
    Launch("mailto:" & varSelectedLeader.Email),
    Notify(
        If(varLang="ar", "لا يوجد إيميل", "No email available"),
        NotificationType.Warning
    )
)
```

### 7-B. زر الهاتف

```powerfx
// خاصية OnSelect لـ [btnPhone]
If(
    !IsBlank(ThisItem.Phone) && ThisItem.Phone <> "",
    Launch("tel:" & ThisItem.Phone),
    Notify(
        If(varLang="ar", "لا يوجد رقم هاتف", "No phone number"),
        NotificationType.Warning
    )
)
```

### 7-C. زر Teams (الدردشة المباشرة)

```powerfx
// خاصية OnSelect لـ [btnTeams]
// يستخدم رابط Teams المخزن في عمود Teams في قائمة Leaders
If(
    !IsBlank(ThisItem.Teams) && ThisItem.Teams <> "",
    Launch(ThisItem.Teams),
    // بديل: بناء رابط Deep Link من الإيميل
    If(
        !IsBlank(ThisItem.Email) && ThisItem.Email <> "",
        Launch(
            "https://teams.microsoft.com/l/chat/0/0?users=" & ThisItem.Email
        ),
        Notify(
            If(varLang="ar", "لا يوجد رابط Teams", "No Teams link"),
            NotificationType.Warning
        )
    )
)
```

### 7-D. إخفاء/إظهار الأزرار حسب توفر البيانات

```powerfx
// خاصية Visible لـ [btnEmail]
!IsBlank(ThisItem.Email) && ThisItem.Email <> ""

// خاصية Visible لـ [btnTeams]
!IsBlank(ThisItem.Teams) && ThisItem.Teams <> ""
```

---

## 8. الانتقال لصفحة تفاصيل الليدر

**الشرح:**
عند الضغط على بطاقة ليدر في المعرض، نحفظ السجل في متغير `varSelectedLeader` ثم ننتقل لشاشة التفاصيل.

```powerfx
// خاصية OnSelect للبطاقة داخل [galLeaders]
// (أو على الحاوية الرئيسية للبطاقة)
Set(varSelectedLeader, ThisItem);
Navigate(scrLeaderDetail, ScreenTransition.Fade)
```

> **ملاحظة:** `scrLeaderDetail` هو اسم الشاشة التي تعرض تفاصيل الليدر — غيّره ليطابق اسم الشاشة عندك.

**زر الرجوع في صفحة التفاصيل:**

```powerfx
// خاصية OnSelect لـ [btnBack] في scrLeaderDetail
Back()
```

---

## 9. معرض الروابط السريعة + نافذة ITSM

**الشرح:**
قائمة QuickLinks فيها روابط عادية وبطاقة ITSM التي لها رقم هاتف. عند الضغط على ITSM تظهر نافذة منبثقة بخيار الاتصال.

### 9-A. معرض القسم "Quick"

```powerfx
// خاصية Items لـ [galQuickLinks]
SortByColumns(
    Filter(colQuickLinks, Section = "Quick"),
    "LabelEn", SortOrder.Ascending
)
```

### 9-B. معرض القسم "Additional"

```powerfx
// خاصية Items لـ [galAdditionalLinks]
Filter(colQuickLinks, Section = "Additional")
```

### 9-C. نص الرابط (ثنائي اللغة)

```powerfx
// خاصية Text لـ Label داخل معرض QuickLinks
If(varLang = "ar", ThisItem.LabelAr, ThisItem.LabelEn)
```

### 9-D. الضغط على رابط سريع

```powerfx
// خاصية OnSelect للبطاقة داخل [galQuickLinks]
If(
    // بطاقة ITSM لها رقم هاتف — نفتح النافذة المنبثقة
    !IsBlank(ThisItem.Phone) && ThisItem.Phone <> "",
    Set(varITSMRecord, ThisItem);
    Set(varShowITSM, true),
    // بقية الروابط تُفتح مباشرة
    Launch(ThisItem.Url)
)
```

### 9-E. إظهار/إخفاء نافذة ITSM

```powerfx
// خاصية Visible للحاوية [conITSMPopup]
varShowITSM
```

### 9-F. زر الاتصال داخل نافذة ITSM

```powerfx
// خاصية OnSelect لـ [btnCallITSM]
Launch("tel:" & varITSMRecord.Phone);
Set(varShowITSM, false)
```

### 9-G. زر إغلاق نافذة ITSM

```powerfx
// خاصية OnSelect لـ [btnCloseITSM]
Set(varShowITSM, false)
```

### 9-H. رقم الهاتف داخل النافذة

```powerfx
// خاصية Text لـ Label رقم الهاتف داخل [conITSMPopup]
varITSMRecord.Phone
```

---

## 10. معرض روابط التصعيد — الأب والأبناء

**الشرح:**
قائمة `EscalationLinks` فيها سجلات "آباء" (`IsChild = "No"`) وسجلات "أبناء" (`IsChild = "Yes"`).
نبني معرضاً رئيسياً للآباء، وداخل كل بطاقة أب نبني معرضاً فرعياً للأبناء المرتبطين به.

### 10-A. المعرض الرئيسي (الآباء)

```powerfx
// خاصية Items لـ [galEscParent]
SortByColumns(
    Filter(colEscalationLinks, IsChild = "No"),
    "Order", SortOrder.Ascending
)
```

### 10-B. نص عنوان الأب (ثنائي اللغة)

```powerfx
// خاصية Text لـ Label عنوان الأب داخل [galEscParent]
If(varLang = "ar", ThisItem.LabelAr, ThisItem.LabelEn)
```

### 10-C. المعرض الفرعي (الأبناء) — داخل بطاقة الأب

```powerfx
// خاصية Items لـ [galEscChildren]
// هذا المعرض داخل [galEscParent]
// ThisItem هنا يشير لسجل الأب
Filter(
    colEscalationLinks,
    IsChild = "Yes",
    ParentLabel = ThisItem.LabelAr
)
```

### 10-D. نص الابن (ثنائي اللغة)

```powerfx
// خاصية Text لـ Label داخل [galEscChildren]
If(varLang = "ar", ThisItem.LabelAr, ThisItem.LabelEn)
```

### 10-E. فتح رابط الأب أو الابن

```powerfx
// خاصية OnSelect للبطاقة داخل [galEscParent] أو [galEscChildren]
If(
    !IsBlank(ThisItem.Url) && ThisItem.Url <> "",
    Launch(ThisItem.Url),
    Notify(
        If(varLang="ar", "لا يوجد رابط", "No URL available"),
        NotificationType.Warning
    )
)
```

---

## 11. أكورديون دليل التصعيد

**الشرح:**
دليل التصعيد يعرض **فئات** (`EscalationGuide`) كأقسام قابلة للطي والفتح.
عند الضغط على فئة تُعرض **خطواتها** (`EscalationSteps`). المنطق:
- مجموعة `colExpandedKeys` تحتفظ بمفاتيح الفئات المفتوحة.
- عند الضغط: إذا كان المفتاح موجوداً نحذفه (يُطوى)، وإذا لم يكن نضيفه (يُفتح).

### 11-A. مجموعة المفاتيح (تمت تهيئتها في App.OnStart)

```powerfx
// في App.OnStart — تهيئة المجموعة فارغة
ClearCollect(colExpandedKeys, Blank())
```

### 11-B. معرض الفئات

```powerfx
// خاصية Items لـ [galEscGuide]
SortByColumns(colEscalationGuide, "Key", SortOrder.Ascending)
```

### 11-C. عنوان الفئة

```powerfx
// خاصية Text لـ Label عنوان الفئة داخل [galEscGuide]
If(varLang = "ar", ThisItem.CategoryAr, ThisItem.CategoryEn)
```

### 11-D. الضغط على فئة لفتحها أو طيّها

```powerfx
// خاصية OnSelect للحاوية أو الزر داخل [galEscGuide]
If(
    // هل المفتاح موجود في المجموعة؟
    CountIf(colExpandedKeys, Value = ThisItem.Key) > 0,
    // نعم — احذفه (أطوِه)
    RemoveIf(colExpandedKeys, Value = ThisItem.Key),
    // لا — أضفه (افتحه)
    Collect(colExpandedKeys, {Value: ThisItem.Key})
)
```

### 11-E. إظهار/إخفاء خطوات الفئة

```powerfx
// خاصية Visible لمعرض الخطوات [galEscSteps] داخل [galEscGuide]
CountIf(colExpandedKeys, Value = ThisItem.Key) > 0
```

### 11-F. معرض الخطوات داخل كل فئة

```powerfx
// خاصية Items لـ [galEscSteps] (داخل [galEscGuide])
SortByColumns(
    Filter(
        colEscalationSteps,
        CategoryKey = ThisItem.Key
    ),
    "Order", SortOrder.Ascending
)
```

### 11-G. نص الخطوة

```powerfx
// خاصية Text لـ Label الخطوة داخل [galEscSteps]
If(varLang = "ar", ThisItem.StepAr, ThisItem.StepEn)
```

### 11-H. أيقونة السهم (مفتوح / مطوي)

```powerfx
// خاصية Icon لـ [icnAccordion] داخل [galEscGuide]
If(
    CountIf(colExpandedKeys, Value = ThisItem.Key) > 0,
    Icon.ChevronDown,
    Icon.ChevronRight
)
```

---

## 12. معالج النموذج — ضبط المتغيرات

**الشرح:**
كل نموذج (مخالفة / استقالة / إجازة) يمر بخطوات (Wizard). نحتفظ بمتغيرات لكل حقل، ونتتبع رقم الخطوة الحالية بـ `varFormStep`.

### 12-A. فتح معالج نموذج المخالفة

```powerfx
// خاصية OnSelect لزر "نموذج مخالفة"
// نصفّر المتغيرات قبل الفتح
Set(varFormType,          "Violation");
Set(varFormStep,          1);
Set(varFormEmpName,       "");
Set(varFormEmpHRID,       "");
Set(varFormEmpEmail,      "");
Set(varFormViolationType, "");
Set(varFormViolationDate, Today());
Set(varFormDuration,      "");
Set(varFormAbsentDays,    "");
Set(varFormNotes,         "");
Set(varFormMgrName,       User().FullName);
Set(varFormMgrDate,       Text(Today(), "dd/mm/yyyy"));
// اذهب للشاشة
Navigate(scrFormWizard, ScreenTransition.Cover)
```

### 12-B. اختيار موظف من المعرض (الخطوة 1)

```powerfx
// خاصية OnSelect لبطاقة موظف داخل [galFormEmployees]
// [galFormEmployees] مصدره: Filter(colEmployees, ManagerKey = varMyKey)
// varMyKey = مفتاح الليدر الحالي المسجّل دخولاً
Set(varFormEmpName,  ThisItem.Name);
Set(varFormEmpHRID,  ThisItem.HRID);
Set(varFormEmpEmail, ThisItem.Email);
Set(varFormStep,     2)
// varMyKey تُضبط في App.OnStart:
// Set(varMyKey, LookUp(colLeaders, Email = User().Email, Title))
```

### 12-C. تصفية موظفي الليدر الحالي

```powerfx
// خاصية Items لـ [galFormEmployees] في الخطوة 1
SortByColumns(
    Filter(
        colEmployees,
        ManagerKey = varMyKey
    ),
    "Name", SortOrder.Ascending
)
```

> **ملاحظة:** `varMyKey` تُضبط في `App.OnStart` بهذه الصيغة:
>
> ```powerfx
> // في App.OnStart — داخل Concurrent
> Set(
>     varMyKey,
>     LookUp(colLeaders, Email = User().Email, Title)
> )
> ```

### 12-D. التنقل بين خطوات المعالج

```powerfx
// خاصية OnSelect لزر "التالي" [btnNext]
If(
    varFormStep < 3,
    Set(varFormStep, varFormStep + 1),
    // الخطوة الأخيرة — أرسل النموذج
    // (انظر القسم 14)
    true
)
```

```powerfx
// خاصية OnSelect لزر "السابق" [btnBack]
If(
    varFormStep > 1,
    Set(varFormStep, varFormStep - 1),
    Navigate(scrHome, ScreenTransition.UnCover)
)
```

```powerfx
// خاصية Visible لكل مجموعة حقول (حسب الخطوة)
// مثال: مجموعة الخطوة 2
varFormStep = 2
```

---

## 13. التقاط توقيع Pen Input

**الشرح:**
Control اسمه `Pen Input` يسمح بالرسم بالإصبع أو الماوس. لإرسال التوقيع للتدفق كصورة Base64، نستخدم `JSON` مع خاصية `Image`.

### 13-A. تحويل التوقيع إلى Base64

```powerfx
// هذه الصيغة تُستخدم وقت إرسال النموذج (انظر القسم 14)
// penSignature = اسم الـ Pen Input Control
JSON(
    penSignature.Image,
    JSONFormat.IncludeBinaryData
)
```

> الناتج سيكون نصاً مثل:
> `"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."`
> هذا النص يذهب مباشرة لتدفق Power Automate الذي يضعه في Content Control من نوع Image في قالب Word.

### 13-B. زر مسح التوقيع

```powerfx
// خاصية OnSelect لـ [btnClearSig]
Reset(penSignature)
```

### 13-C. تمييز لوحة التوقيع (الإظهار فقط في الخطوة الصحيحة)

```powerfx
// خاصية Visible لـ [penSignature] وزر المسح
varFormStep = 3
```

### 13-D. التحقق من وجود توقيع قبل الإرسال

```powerfx
// خاصية DisplayMode لزر "إرسال النموذج" [btnSubmitForm]
If(
    penSignature.Image = Blank() || IsBlank(penSignature.Image),
    DisplayMode.Disabled,
    DisplayMode.Edit
)
```

---

## 14. استدعاء تدفق Power Automate

**الشرح:**
بعد أن يملأ المستخدم جميع الحقول ويرسم التوقيع، نستدعي تدفق Power Automate بكل البيانات.
اسم التدفق في الأمثلة أدناه افتراضي — غيّره ليطابق اسم التدفق الفعلي في تطبيقك بعد إضافته من Power Automate.

### 14-A. نموذج المخالفة (Violation)

```powerfx
// خاصية OnSelect لزر "إرسال" في الخطوة الأخيرة من معالج المخالفة
// اسم التدفق الافتراضي: FlowViolation (غيّره حسب اسمك)
Set(varIsSubmitting, true);

FlowViolation.Run(
    varFormEmpName,                                  // emp_name
    varFormEmpHRID,                                  // emp_hrid
    varFormEmpEmail,                                 // emp_email
    varFormViolationType,                            // violation_type
    Text(varFormViolationDate, "dd/mm/yyyy"),         // violation_date
    varFormDuration,                                 // violation_duration
    Text(varFormAbsentDays),                         // absent_days
    varFormNotes,                                    // notes
    varFormMgrName,                                  // manager_name
    JSON(penSignature.Image, JSONFormat.IncludeBinaryData), // manager_sig
    Text(Today(), "dd/mm/yyyy")                      // manager_date
);

Set(varIsSubmitting, false);
Notify(
    If(varLang="ar", "تم إرسال النموذج بنجاح", "Form submitted successfully"),
    NotificationType.Success
);
Navigate(scrHome, ScreenTransition.UnCover)
```

### 14-B. نموذج الاستقالة (Resignation)

```powerfx
// خاصية OnSelect لزر "إرسال" في معالج الاستقالة
Set(varIsSubmitting, true);

FlowResignation.Run(
    varFormEmpName,                                   // emp_name
    varFormEmpHRID,                                   // emp_hrid
    varFormEmpEmail,                                  // emp_email
    varFormDepartment,                                // department
    Text(varFormResignDate, "dd/mm/yyyy"),             // resignation_date
    Text(varFormLastWorkDay, "dd/mm/yyyy"),            // last_working_day
    varFormReason,                                    // reason
    varFormMgrName,                                   // manager_name
    JSON(penSignature.Image, JSONFormat.IncludeBinaryData),  // manager_sig
    Text(Today(), "dd/mm/yyyy")                       // manager_date
);

Set(varIsSubmitting, false);
Notify(
    If(varLang="ar", "تم إرسال الاستقالة بنجاح", "Resignation submitted successfully"),
    NotificationType.Success
);
Navigate(scrHome, ScreenTransition.UnCover)
```

### 14-C. نموذج الإجازة (Leave)

```powerfx
// خاصية OnSelect لزر "إرسال" في معالج الإجازة
Set(varIsSubmitting, true);

FlowLeave.Run(
    varFormEmpName,                                   // emp_name
    varFormEmpHRID,                                   // emp_hrid
    varFormEmpAppointment,                            // emp_appointment
    varFormEmpDept,                                   // emp_dept
    varFormEmpJobTitle,                               // emp_jobtitle
    varFormLeaveType,                                 // leave_type
    Text(varFormLastWorkDay, "dd/mm/yyyy"),            // last_work_day
    Text(varFormStartDate, "dd/mm/yyyy"),              // start_date
    Text(varFormEndDate, "dd/mm/yyyy"),                // end_date
    Text(varFormReturnDate, "dd/mm/yyyy"),             // return_date
    varFormPhone,                                     // phone
    Text(varFormTotalDays),                           // total_days
    varFormApplicantName,                             // applicant_name
    JSON(penApplicantSig.Image, JSONFormat.IncludeBinaryData), // applicant_sig
    varFormMgrName,                                   // manager_name
    JSON(penSignature.Image, JSONFormat.IncludeBinaryData),    // manager_sig
    Text(Today(), "dd/mm/yyyy")                       // manager_date
);

Set(varIsSubmitting, false);
Notify(
    If(varLang="ar", "تم إرسال طلب الإجازة بنجاح", "Leave request submitted successfully"),
    NotificationType.Success
);
Navigate(scrHome, ScreenTransition.UnCover)
```

### 14-D. مؤشر التحميل أثناء الإرسال

```powerfx
// خاصية Visible لأي مؤشر دوران (spinner) أثناء الإرسال
varIsSubmitting

// خاصية DisplayMode لزر الإرسال أثناء الانتظار
If(varIsSubmitting, DisplayMode.Disabled, DisplayMode.Edit)
```

---

## 15. متغيرات الألوان والثيم

**الشرح:**
نحتفظ بالألوان في متغيرات حتى يسهل تغييرها لاحقاً من مكان واحد. أضف هذه الأسطر في `App.OnStart` داخل `Concurrent`.

```powerfx
// في App.OnStart — داخل Concurrent
// ── ألوان التطبيق الرئيسية ─────────────────────────────────────
Set(varColorBg,          Color.FromArgb(255, 15,  23, 42)),   // #0f172a - خلفية داكنة
Set(varColorGold,        Color.FromArgb(255, 251, 191, 36)),  // #FBBF24 - ذهبي
Set(varColorGoldLight,   Color.FromArgb(180, 251, 191, 36)),  // ذهبي شفاف
Set(varColorCardBg,      Color.FromArgb(255, 30,  41, 59)),   // #1e293b - خلفية البطاقات
Set(varColorText,        Color.FromArgb(255, 241, 245, 249)), // #f1f5f9 - نص أبيض
Set(varColorTextMuted,   Color.FromArgb(255, 148, 163, 184)), // #94a3b8 - نص ثانوي
Set(varColorBorder,      Color.FromArgb(255, 51,  65,  85)),  // #334155 - حدود البطاقات
Set(varColorSuccess,     Color.FromArgb(255, 34,  197, 94)),  // أخضر
Set(varColorWarning,     Color.FromArgb(255, 234, 179, 8)),   // أصفر
Set(varColorError,       Color.FromArgb(255, 239, 68,  68))   // أحمر
```

**استخدام الألوان في خصائص Controls:**

```powerfx
// خاصية Fill للشاشة الرئيسية
varColorBg

// خاصية Fill لبطاقة ليدر
varColorCardBg

// خاصية Color لنص اسم الليدر
varColorText

// خاصية Color لنص المسمى الوظيفي
varColorTextMuted

// خاصية BorderColor لبطاقة الليدر
varColorBorder

// خاصية Color للزر الذهبي
varColorGold

// خاصية Fill لزر "إرسال" نشط
varColorGold

// خاصية Fill لزر "إرسال" معطّل
varColorBorder
```

---

## 16. ملاحظات RTL ومحاذاة اليمين

**الشرح:**
Power Apps Canvas لا يعكس الواجهة تلقائياً لـ RTL. هذه القواعد اليدوية لازمة لكل Control.

### 16-A. محاذاة النص

```powerfx
// خاصية Align لأي Label أو TextInput يحتوي عربياً
Align.Right

// إذا أردت التكيف مع اللغة
If(varLang = "ar", Align.Right, Align.Left)
```

### 16-B. محاذاة النص داخل TextInput

```powerfx
// خاصية Align لـ TextInput
If(varLang = "ar", Align.Right, Align.Left)
```

### 16-C. ترتيب العناصر (X Position)

في الواجهة العربية يكون العنصر الرئيسي على اليمين.

| العنصر | X في العربية | X في الإنجليزية |
|---|---|---|
| أيقونة Avatar | يمين (X كبير) | يسار (X صغير) |
| أزرار التواصل | يسار البطاقة | يمين البطاقة |
| سهم الأكورديون | يسار | يمين |

```powerfx
// خاصية X لمجموعة أزرار التواصل
If(
    varLang = "ar",
    // موضع من اليسار في العربية (RTL)
    8,
    // موضع من اليسار في الإنجليزية (LTR)
    Parent.Width - 120
)
```

### 16-D. اتجاه Label في الأكورديون

```powerfx
// خاصية Align لـ Label عنوان الفئة في الأكورديون
Align.Right
```

### 16-E. ترتيب الأيقونة والنص في بطاقة الليدر

```powerfx
// خاصية X لـ Avatar (الدائرة)
If(
    varLang = "ar",
    // عربي: Avatar على اليمين
    Parent.Width - 72,
    // إنجليزي: Avatar على اليسار
    8
)

// خاصية X لـ Label الاسم
If(
    varLang = "ar",
    // عربي: نص من اليمين، يبدأ قريباً من Avatar
    Parent.Width - 150,
    // إنجليزي: نص يلي Avatar من اليسار
    80
)
```

### 16-F. تلميح عام للـ PaddingRight / PaddingLeft

```powerfx
// خاصية PaddingLeft لـ Label (يعطي مسافة داخلية صحيحة)
If(varLang = "ar", 0, 12)

// خاصية PaddingRight لـ Label
If(varLang = "ar", 12, 0)
```

---

## ملحق — جدول سريع لأسماء القوائم والأعمدة

| القائمة | الأعمدة الرئيسية |
|---|---|
| `Leaders` | Title(Key), Key, NameAr, NameEn, TitleAr, TitleEn, DeptAr, DeptEn, Email, Phone, Teams, ReportsTo |
| `Employees` | Title(Name), ManagerKey, ManagerEmail, Name, HRID, Email, JobTitle |
| `QuickLinks` | Title(LabelEn), Section, LabelAr, LabelEn, Url, Icon, Phone |
| `EscalationLinks` | Title(LabelEn), Order, ParentLabel, IsChild, LabelAr, LabelEn, Url, Icon |
| `EscalationGuide` | Title(Key), Key, CategoryAr, CategoryEn, Icon |
| `EscalationSteps` | Title, CategoryKey, Order, StepAr, StepEn |
| `DownloadLog` | Title, UserEmail, UserName, FormType, TargetEmployee, GeneratedAt |

---

## ملحق — جدول Content Controls للنماذج

| النموذج | Tags المطلوبة |
|---|---|
| **Violation** | emp_name, emp_hrid, emp_email, violation_type, violation_date, violation_duration, absent_days, notes, manager_name, manager_sig (IMAGE), manager_date |
| **Resignation** | emp_name, emp_hrid, emp_email, department, resignation_date, last_working_day, reason, manager_name, manager_sig (IMAGE), manager_date |
| **Leave** | emp_name, emp_hrid, emp_appointment, emp_dept, emp_jobtitle, leave_type, last_work_day, start_date, end_date, return_date, phone, total_days, applicant_name, applicant_sig (IMAGE), manager_name, manager_sig (IMAGE), manager_date |

---

*آخر تحديث: 2026-06-06 — يطابق مخطط قوائم `01-SharePoint-Lists-Schema.md`*
