# دليل بناء تطبيق Canvas — Collection Barq (Power Apps)

> **الجمهور المستهدف:** مدير غير تقني، عربي، يعمل على Windows.
> **كل اسم شاشة / عمود / قائمة مذكور هنا يجب أن يُكتب بالضبط كما ورد** — لا تُغيّر الحروف الكبيرة والصغيرة.
> **الأكواد (Power Fx) تُنسخ كما هي** — لا تترجمها.

---

## المحتويات

1. [المتطلبات الأساسية (Prerequisites)](#1-المتطلبات-الأساسية)
2. [إنشاء قوائم SharePoint السبع](#2-إنشاء-قوائم-sharepoint-السبع)
3. [إنشاء تطبيق Canvas وتوصيل البيانات](#3-إنشاء-تطبيق-canvas-وتوصيل-البيانات)
4. [بناء الشاشات — خطوة بخطوة](#4-بناء-الشاشات)
5. [الثيم والتصميم](#5-الثيم-والتصميم)
6. [RTL والثنائية اللغوية](#6-rtl-والثنائية-اللغوية)
7. [نشر التطبيق (Publish)](#7-نشر-التطبيق)
8. [مشاركة التطبيق مع مجموعة Entra](#8-مشاركة-التطبيق-مع-مجموعة-entra)
9. [قائمة التحقق النهائية](#9-قائمة-التحقق-النهائية)

---

## 1. المتطلبات الأساسية

### 1.1 ما تحتاجه قبل البدء

| المتطلب | من يؤدّيه | ملاحظات |
|---|---|---|
| **موقع فريق SharePoint** (Team Site) | مسؤول IT أو أنت | اذهب إلى `sharepoint.com` → **+ Create site** → اختر **Team site** → اسمه مثلاً `CollectionBarq` |
| **ترخيص Power Apps** (Plan 1 أو Premium) | مسؤول IT | تأكد أن حسابك يظهر في `make.powerapps.com` بدون رسالة ترخيص |
| **ترخيص Power Automate Premium** | للمدير / المدراء (1-2 شخص فقط) | مطلوب لتشغيل connector)) **Word Online (Business)** عند توليد النماذج — لا يلزم باقي المستخدمين |
| **ملف `BarqData.xlsx`** | يوجد في `C:\Users\SaudKhalidAlghamdi\leaders-hub\powerapps-migration\data\` | ارفعه إلى مكتبة Documents في موقع SharePoint |
| **صورة الشعار** (logo.png) | يوجد في `leaders-hub/assets/logo.svg` | احفظه كـ PNG بخلفية شفافة (أو ملوّنة) — لأن Power Apps لا تدعم SVG، والتوهّج (glow animation) يتحوّل لصورة ثابتة مخبوزة |
| **مجموعة أمان Entra** (Security Group) | مسؤول IT أو مسؤول Azure AD | تُنشأ في `entra.microsoft.com` → **Groups** → **New group** → النوع: **Security** → الاسم مثلاً `SG-CollectionBarq-Users` → أضف أعضاء الفريق الـ 14 |

> **ملاحظة:** مجموعة Entra تحلّ محلّ Firebase Auth بالكامل — من داخلها فقط يرى التطبيق. لا يوجد صفحة تسجيل دخول مخصصة.

### 1.2 تحقق من الوصول

1. افتح `make.powerapps.com` في المتصفح.
2. تأكد أن البيئة (Environment) المختارة في الأعلى هي بيئة مؤسستك (وليس "Personal Productivity").
3. إذا لم تجد بيئة مؤسستك — تواصل مع مسؤول Power Platform.

---

## 2. إنشاء قوائم SharePoint السبع

> **الترتيب مهم:** ابدأ بـ `Leaders` لأن `Employees` تعتمد عليها.

### 2.1 رفع BarqData.xlsx إلى SharePoint

1. افتح موقع SharePoint الذي أنشأته.
2. من الشريط الجانبي اختر **Documents**.
3. اضغط **Upload** → **Files** → اختر `BarqData.xlsx` من جهازك.
4. انتظر حتى يكتمل الرفع.

---

### 2.2 قائمة `Leaders` (الليدرز)

**الإنشاء من Excel:**

1. في موقع SharePoint اضغط **New** (أعلى يسار الصفحة) → **List**.
2. اختر **From Excel**.
3. اضغط **Upload file** → اختر `BarqData.xlsx`.
4. من القائمة المنسدلة **Table** اختر `tblLeaders`.
5. اضغط **Next** — SharePoint سيعرض الأعمدة والأنواع المقترحة.
6. **لا تغيّر شيئاً الآن** — اضغط **Create**.
7. سمّ القائمة `Leaders` ثم **Create**.

**تصحيح أنواع الأعمدة (مهم):**

بعد الإنشاء اضغط **Settings (⚙)** → **List settings** → ثم اضغط على كل عمود واحداً واحداً وعدّل النوع:

| العمود | النوع الصحيح | ملاحظة |
|---|---|---|
| Title | Single line of text | اتركه كما هو (يحتوي على `Key`) |
| Key | Single line of text | اتركه |
| NameAr | Single line of text | اتركه |
| NameEn | Single line of text | اتركه |
| TitleAr | Single line of text | اتركه |
| TitleEn | Single line of text | اتركه |
| DeptAr | Single line of text | اتركه |
| DeptEn | Single line of text | اتركه |
| Email | Single line of text | اتركه |
| Phone | Single line of text | اتركه |
| Teams | **Hyperlink** | غيّره من Text إلى Hyperlink |
| ReportsTo | Single line of text | اتركه (في المستقبل يمكن تحويله Lookup) |

---

### 2.3 قائمة `Employees` (الموظفون)

**الإنشاء من Excel:**

1. **New** → **List** → **From Excel** → نفس الملف `BarqData.xlsx`.
2. من **Table** اختر `tblEmployees`.
3. اضغط **Next** → **Create**.
4. سمّ القائمة `Employees`.

**تصحيح الأعمدة:**

| العمود | النوع الصحيح | ملاحظة |
|---|---|---|
| Title | Single line of text | SharePoint يضعه تلقائياً = `Name` |
| ManagerKey | Single line of text | اتركه |
| ManagerEmail | Single line of text | اتركه |
| Name | Single line of text | اتركه |
| HRID | Single line of text | **مهم: يجب أن يكون نصاً (Text) وليس Number** حتى لا تضيع الأصفار في بداية الأرقام |
| Email | Single line of text | اتركه |
| JobTitle | Single line of text | العمود `Title` في الـ CSV يُعاد تسميته `JobTitle` لتجنب التعارض مع عمود Title الإجباري |

**إضافة عمود Lookup للمدير (بعد إنشاء القائمة):**

1. في قائمة `Employees` اضغط **+ Add column** → **Lookup**.
2. في نافذة الإعداد:
   - **Column name:** `Manager`
   - **Get information from:** اختر قائمة `Leaders`
   - **In this column:** اختر `Title` (الذي يحتوي على `Key`)
3. اضغط **Save**.
4. هذا العمود اختياري للبداية — يمكنك ملؤه لاحقاً بعد التحقق من البيانات.

---

### 2.4 قائمة `QuickLinks` (الروابط السريعة)

1. **New** → **List** → **From Excel** → اختر `tblQuickLinks`.
2. اضغط **Next** → **Create** → سمّها `QuickLinks`.

**تصحيح الأعمدة:**

| العمود | النوع الصحيح |
|---|---|
| Title | Single line of text (يحتوي على `LabelEn`) |
| Section | **Choice** — أضف القيم: `Quick` و`Additional` |
| LabelAr | Single line of text |
| LabelEn | Single line of text |
| Url | **Hyperlink** |
| Icon | Single line of text |
| Phone | Single line of text |

**لتعيين عمود Section كـ Choice:**
- اضغط على اسم العمود `Section` في الإعدادات → غيّر النوع إلى **Choice** → في حقل **Choices** أضف سطراً: `Quick` وسطراً: `Additional` → احفظ.

---

### 2.5 قائمة `EscalationLinks` (روابط التصعيد)

1. **New** → **List** → **From Excel** → اختر `tblEscalationLinks`.
2. اضغط **Next** → **Create** → سمّها `EscalationLinks`.

**تصحيح الأعمدة:**

| العمود | النوع الصحيح |
|---|---|
| Title | Single line of text (يحتوي على `LabelEn`) |
| Order | **Number** |
| ParentLabel | Single line of text |
| IsChild | **Choice** — القيم: `Yes` و`No` |
| LabelAr | Single line of text |
| LabelEn | Single line of text |
| Url | **Hyperlink** |
| Icon | Single line of text |

---

### 2.6 قائمة `EscalationGuide` (دليل التصعيد — الفئات)

1. **New** → **List** → **From Excel** → اختر `tblEscalationGuide`.
2. اضغط **Next** → **Create** → سمّها `EscalationGuide`.

**تصحيح الأعمدة:**

| العمود | النوع الصحيح |
|---|---|
| Title | Single line of text (يحتوي على `Key` مثل `cat-1`) |
| Key | Single line of text |
| CategoryAr | Single line of text |
| CategoryEn | Single line of text |
| Icon | Single line of text |

---

### 2.7 قائمة `EscalationSteps` (خطوات الدليل)

1. **New** → **List** → **From Excel** → اختر `tblEscalationSteps`.
2. اضغط **Next** → **Create** → سمّها `EscalationSteps`.

**تصحيح الأعمدة:**

| العمود | النوع الصحيح |
|---|---|
| Title | Single line of text |
| CategoryKey | Single line of text |
| Order | **Number** |
| StepAr | **Multiple lines of text** |
| StepEn | **Multiple lines of text** |

---

### 2.8 قائمة `DownloadLog` (سجل النماذج) — تُنشأ يدوياً

هذه القائمة **لا تُستورد من Excel** — تُنشأ فارغة:

1. **New** → **List** → **Blank list**.
2. سمّها `DownloadLog` → **Create**.
3. أضف الأعمدة التالية بالضغط على **+ Add column**:

| العمود | النوع |
|---|---|
| Title | Single line of text (موجود تلقائياً — اتركه، سيحتوي اسم النموذج) |
| UserEmail | Single line of text |
| UserName | Single line of text |
| FormType | **Choice** — القيم: `Violation` و`Resignation` و`Leave` |
| TargetEmployee | Single line of text |
| GeneratedAt | **Date and Time** |

> هذه القائمة يملأها تدفق Power Automate تلقائياً عند توليد كل نموذج — لا تُعدّل صفوفها يدوياً.

---

### 2.9 ملخص القوائم السبع

| # | اسم القائمة | المصدر | عدد الصفوف التقريبي |
|---|---|---|---|
| 1 | Leaders | tblLeaders | 23 |
| 2 | Employees | tblEmployees | 279 |
| 3 | QuickLinks | tblQuickLinks | 6 |
| 4 | EscalationLinks | tblEscalationLinks | 7 |
| 5 | EscalationGuide | tblEscalationGuide | 6 |
| 6 | EscalationSteps | tblEscalationSteps | 19 |
| 7 | DownloadLog | يدوي (فارغة) | 0 |

---

## 3. إنشاء تطبيق Canvas وتوصيل البيانات

### 3.1 إنشاء التطبيق

1. افتح `make.powerapps.com`.
2. من الشريط الجانبي اضغط **+ Create**.
3. اختر **Blank app**.
4. اختر **Blank canvas app**.
5. في نافذة الإعداد:
   - **App name:** `Collection Barq`
   - **Format:** اختر **Phone** (أو **Tablet** إذا أردت واجهة أوسع — الأنسب للمديرين على الحاسوب هو Tablet)
6. اضغط **Create** — سيفتح Power Apps Studio.

### 3.2 توصيل مصادر البيانات (Data Sources)

1. من الشريط الجانبي في Power Apps Studio اضغط على أيقونة **Data** (أسطوانة البيانات).
2. اضغط **+ Add data**.
3. ابحث عن **SharePoint** في مربع البحث → اختره.
4. أدخل عنوان موقع SharePoint الخاص بك (مثل `https://yourorg.sharepoint.com/sites/CollectionBarq`) → اضغط **Connect**.
5. ستظهر قائمة بالـ Lists — ضع علامة ✓ على القوائم السبع:
   - `Leaders`
   - `Employees`
   - `QuickLinks`
   - `EscalationLinks`
   - `EscalationGuide`
   - `EscalationSteps`
   - `DownloadLog`
6. اضغط **Connect**.
7. انتظر حتى تظهر القوائم السبع في لوحة Data.

> **ملاحظة:** إذا أرسلت تحذيراً بشأن تفويض (Delegation) — هذا طبيعي وسنعالجه في الصيغ.

---

## 4. بناء الشاشات

> **تنبيه عام:** تخطيط كل شاشة (حجم العناصر، مواضعها، الألوان) عمل يدوي تقوم به داخل واجهة Power Apps Studio بالسحب والإفلات. هذا الدليل يعطيك **ما تضع في كل عنصر** (الصيغة/النص/الاسم) — أما الشكل النهائي فترتّبه بصرياً حسب ذوقك.

### إعداد أسماء الشاشات

أنشئ الشاشات التالية من القائمة **Tree View** (يسار الشاشة) بالضغط على **+ New screen** → **Blank**:

| اسم الشاشة | الاستخدام |
|---|---|
| `scrHome` | الصفحة الرئيسية |
| `scrLeaders` | دليل الليدرز |
| `scrLeaderDetail` | تفاصيل ليدر |
| `scrQuickLinks` | الروابط السريعة |
| `scrEscalationLinks` | روابط التصعيد |
| `scrEscalationGuide` | دليل التصعيد |
| `scrFormViolation` | نموذج المخالفة |
| `scrFormResignation` | نموذج الاستقالة |
| `scrFormLeave` | نموذج الإجازة |

> لتغيير اسم الشاشة: اضغط عليها بزر الماوس الأيمن في **Tree View** → **Rename**.

---

### 4.1 شاشة `scrHome` — الرئيسية

**العناصر المطلوبة:**

#### الشعار
- أضف عنصر **Image**: اضغط **Insert** → **Media** → **Image**.
- في خاصية `Image`: اضغط على أيقونة الصورة وارفع ملف `logo.png` الذي حفظته مسبقاً.
- حجّمه واجعله في أعلى المنتصف.

#### عنوان التطبيق
- أضف **Label** → اكتب في خاصية `Text`:
  ```
  If(varLang = "AR", "كوليكشن برق", "Collection Barq")
  ```
- حجم الخط: 28، لون: `#FBBF24`، محاذاة: Center.

#### أزرار التنقل (Navigation Buttons)
أضف زراً (Button) لكل شاشة رئيسية:

| النص (AR) | النص (EN) | `OnSelect` |
|---|---|---|
| دليل الليدرز | Leaders Directory | `Navigate(scrLeaders, ScreenTransition.Fade)` |
| الروابط السريعة | Quick Links | `Navigate(scrQuickLinks, ScreenTransition.Fade)` |
| روابط التصعيد | Escalation Links | `Navigate(scrEscalationLinks, ScreenTransition.Fade)` |
| دليل التصعيد | Escalation Guide | `Navigate(scrEscalationGuide, ScreenTransition.Fade)` |
| نموذج مخالفة | Violation Form | `Navigate(scrFormViolation, ScreenTransition.Fade)` |
| نموذج استقالة | Resignation Form | `Navigate(scrFormResignation, ScreenTransition.Fade)` |
| نموذج إجازة | Leave Form | `Navigate(scrFormLeave, ScreenTransition.Fade)` |

لكل زر، في خاصية `Text` استخدم الصيغة:
```
If(varLang = "AR", "دليل الليدرز", "Leaders Directory")
```
(غيّر النصين حسب كل زر)

#### زر تبديل اللغة
- أضف زراً اسمه `btnLangToggle`.
- خاصية `Text`:
  ```
  If(varLang = "AR", "EN", "AR")
  ```
- خاصية `OnSelect`:
  ```
  If(varLang = "AR", Set(varLang, "EN"), Set(varLang, "AR"))
  ```

---

### 4.2 شاشة `scrLeaders` — دليل الليدرز

**العناصر:**

#### شريط البحث
- أضف **Text input** → اسمه `inpSearch`.
- خاصية `HintText`:
  ```
  If(varLang = "AR", "ابحث عن ليدر...", "Search leaders...")
  ```
- خاصية `TextAlign`: `TextAlign.Right` (للعربية)

#### فلتر القسم (Department Filter)
- أضف **Dropdown** → اسمه `ddDept`.
- خاصية `Items`:
  ```
  Distinct(Leaders, DeptAr)
  ```
  > هذا يجلب أسماء الأقسام الفريدة من قائمة Leaders.
- أضف عنصر "الكل" في البداية عن طريق تغيير الصيغة إلى:
  ```
  ["الكل"] & Distinct(Leaders, DeptAr)
  ```
  > أو استخدم متغيراً في App OnStart كما سيرد لاحقاً.

#### معرض الليدرز (Gallery)
- أضف **Vertical Gallery** → اسمه `galLeaders`.
- خاصية `Items`:
  ```
  Filter(
      Leaders,
      (inpSearch.Text = "" || TitleAr starts with inpSearch.Text || NameAr starts with inpSearch.Text),
      (ddDept.Selected.Value = "الكل" || DeptAr = ddDept.Selected.Value)
  )
  ```
  > ملاحظة: Power Fx لا تدعم `contains` مع تفويض SharePoint — استخدم `StartsWith` لتجنب تحذير Delegation، أو اقبل التحذير مع `Search()` إذا البيانات صغيرة (23 صف كافٍ).

  الصيغة البديلة الأبسط (مقبولة لـ 23 صف):
  ```
  Filter(
      Leaders,
      (inpSearch.Text = "" || NameAr in inpSearch.Text || NameEn in inpSearch.Text),
      (ddDept.Selected.Value = "الكل" || DeptAr = ddDept.Selected.Value)
  )
  ```

**داخل بطاقة Gallery (Template):**
- **Label الاسم:** خاصية `Text`:
  ```
  If(varLang = "AR", ThisItem.NameAr, ThisItem.NameEn)
  ```
- **Label المسمى:** خاصية `Text`:
  ```
  If(varLang = "AR", ThisItem.TitleAr, ThisItem.TitleEn)
  ```
- **Label القسم:** خاصية `Text`:
  ```
  If(varLang = "AR", ThisItem.DeptAr, ThisItem.DeptEn)
  ```
- **OnSelect للبطاقة كلها:**
  ```
  Set(varSelectedLeader, ThisItem); Navigate(scrLeaderDetail, ScreenTransition.Fade)
  ```

#### زر الرجوع
- أضف زراً أو أيقونة Back في الأعلى.
- `OnSelect`:
  ```
  Navigate(scrHome, ScreenTransition.Fade)
  ```

---

### 4.3 شاشة `scrLeaderDetail` — تفاصيل الليدر

> هذه الشاشة تعرض بيانات المتغير `varSelectedLeader` الذي حفظناه عند الضغط على بطاقة الليدر.

**العناصر:**

- **Label الاسم الكامل:**
  ```
  If(varLang = "AR", varSelectedLeader.NameAr, varSelectedLeader.NameEn)
  ```
- **Label المسمى الوظيفي:**
  ```
  If(varLang = "AR", varSelectedLeader.TitleAr, varSelectedLeader.TitleEn)
  ```
- **Label القسم:**
  ```
  If(varLang = "AR", varSelectedLeader.DeptAr, varSelectedLeader.DeptEn)
  ```
- **Label الإيميل:**
  ```
  varSelectedLeader.Email
  ```
- **زر Teams (مفتوح في Teams):**
  - `Text`: `"Teams"`
  - `OnSelect`:
    ```
    If(
        varSelectedLeader.Teams.Url <> "",
        Launch(varSelectedLeader.Teams.Url),
        Notify(If(varLang="AR","لا يوجد رابط Teams","No Teams link available"), NotificationType.Warning)
    )
    ```
- **زر إيميل مباشر:**
  - `Text`: `If(varLang="AR", "مراسلة بالإيميل", "Send Email")`
  - `OnSelect`:
    ```
    Launch("mailto:" & varSelectedLeader.Email)
    ```
- **معرض موظفي هذا الليدر:**
  - أضف **Vertical Gallery** → اسمه `galLeaderEmployees`.
  - خاصية `Items`:
    ```
    Filter(Employees, ManagerKey = varSelectedLeader.Key)
    ```
  - داخل البطاقة: Label اسم الموظف = `ThisItem.Name`، Label الإيميل = `ThisItem.Email`.

- **زر الرجوع:**
  ```
  Navigate(scrLeaders, ScreenTransition.Fade)
  ```

---

### 4.4 شاشة `scrQuickLinks` — الروابط السريعة

**العناصر:**

#### قسم "Quick Links"
- أضف **Gallery** (Horizontal أو Grid) → اسمه `galQuickLinks`.
- خاصية `Items`:
  ```
  Filter(QuickLinks, Section = "Quick")
  ```
- داخل البطاقة:
  - **Label الاسم:**
    ```
    If(varLang = "AR", ThisItem.LabelAr, ThisItem.LabelEn)
    ```
  - **OnSelect:**
    ```
    If(
        ThisItem.LabelEn = "ITSM",
        UpdateContext({locShowITSM: true}),
        Launch(ThisItem.Url.Url)
    )
    ```
    > ملاحظة: الروابط من نوع Hyperlink في SharePoint تُقرأ بـ `.Url` (خاصية فرعية).

#### بوب‌أب بروتوكول مكالمة ITSM
- أضف **Rectangle** اسمه `rectITSMOverlay` (شاشة شفافة للخلفية).
- أضف **Card/Group** اسمه `grpITSMPopup`.
- خاصية `Visible` لكليهما:
  ```
  locShowITSM
  ```
- داخل البوب‌أب:
  - **Label العنوان:**
    ```
    If(varLang = "AR", "بروتوكول مكالمة ITSM", "ITSM Call Protocol")
    ```
  - **Label رقم الهاتف:**
    ```
    LookUp(QuickLinks, LabelEn = "ITSM").Phone
    ```
  - **زر اتصال:**
    - `Text`: `If(varLang="AR","اتصل الآن","Call Now")`
    - `OnSelect`:
      ```
      Launch("tel:" & LookUp(QuickLinks, LabelEn = "ITSM").Phone)
      ```
  - **زر إغلاق:**
    - `Text`: `"✕"`
    - `OnSelect`:
      ```
      UpdateContext({locShowITSM: false})
      ```

#### قسم "Additional Links"
- أضف **Gallery** اسمه `galAdditionalLinks`.
- خاصية `Items`:
  ```
  Filter(QuickLinks, Section = "Additional")
  ```
- نفس بنية بطاقة Quick Links، لكن `OnSelect`:
  ```
  Launch(ThisItem.Url.Url)
  ```

#### زر الرجوع:
```
Navigate(scrHome, ScreenTransition.Fade)
```

---

### 4.5 شاشة `scrEscalationLinks` — روابط التصعيد

**الفكرة:** Gallery للآباء (IsChild = "No")، وداخل كل بطاقة أب gallery مصغّر للأبناء.

> **تنبيه:** Gallery متداخلة (Nested Gallery) تحتاج تشغيل خاصية تجريبية. من إعدادات التطبيق (**File → Settings → Upcoming features → Experimental**) فعّل **"Nested gallery"** إذا ظهر الخيار. البديل الأبسط: استخدم متغير لتحديد الأب المختار وعرض الأبناء في Gallery منفصل.

**الطريقة البسيطة (Gallery + Gallery منفصل):**

1. **أضف Gallery للآباء** → اسمه `galEscParent`.
   - `Items`:
     ```
     Sort(Filter(EscalationLinks, IsChild = "No"), Order, SortOrder.Ascending)
     ```
   - داخل البطاقة:
     - Label اسم الرابط:
       ```
       If(varLang = "AR", ThisItem.LabelAr, ThisItem.LabelEn)
       ```
     - `OnSelect`:
       ```
       Set(varSelectedEscParent, ThisItem); UpdateContext({locShowEscChildren: true})
       ```

2. **أضف Gallery للأبناء** → اسمه `galEscChildren`.
   - `Visible`:
     ```
     locShowEscChildren
     ```
   - `Items`:
     ```
     Filter(EscalationLinks, IsChild = "Yes", ParentLabel = varSelectedEscParent.LabelAr)
     ```
   - داخل البطاقة:
     - Label الاسم:
       ```
       If(varLang = "AR", ThisItem.LabelAr, ThisItem.LabelEn)
       ```
     - `OnSelect`:
       ```
       Launch(ThisItem.Url.Url)
       ```

3. **زر الرجوع من الأبناء:**
   ```
   UpdateContext({locShowEscChildren: false})
   ```

4. **زر الرجوع للرئيسية:**
   ```
   Navigate(scrHome, ScreenTransition.Fade)
   ```

---

### 4.6 شاشة `scrEscalationGuide` — دليل التصعيد (Accordion يدوي)

**الفكرة:** Gallery للفئات الست، كل فئة قابلة للطي والبسط (accordion) بمتغير.

**الطريقة:**

1. **أضف Gallery** → اسمه `galEscGuideCategories`.
   - `Items`:
     ```
     EscalationGuide
     ```
   - داخل بطاقة الفئة:
     - Label اسم الفئة:
       ```
       If(varLang = "AR", ThisItem.CategoryAr, ThisItem.CategoryEn)
       ```
     - أيقونة السهم (أو Label بـ `▶` / `▼`):
       ```
       If(varExpandedCat = ThisItem.Key, "▼", "▶")
       ```
     - **OnSelect للبطاقة كلها:**
       ```
       If(
           varExpandedCat = ThisItem.Key,
           Set(varExpandedCat, ""),
           Set(varExpandedCat, ThisItem.Key)
       )
       ```
     - **Gallery داخلي للخطوات:**
       - أضف داخل بطاقة الفئة Gallery ثانياً → اسمه `galEscSteps`.
       - `Visible`:
         ```
         varExpandedCat = ThisItem.Key
         ```
       - `Items`:
         ```
         Sort(Filter(EscalationSteps, CategoryKey = ThisItem.Key), Order, SortOrder.Ascending)
         ```
       - داخل بطاقة الخطوة، Label النص:
         ```
         If(varLang = "AR", ThisItem.StepAr, ThisItem.StepEn)
         ```

> **ملاحظة:** Gallery المتداخلة قد تحتاج إعداد إضافي (انظر ملاحظة القسم 4.5). البديل: استخدم متغيراً `varExpandedCat` وضع Gallery الخطوات خارج Gallery الفئات، مع تصفية:
> ```
> Sort(Filter(EscalationSteps, CategoryKey = varExpandedCat), Order, SortOrder.Ascending)
> ```

#### زر الرجوع:
```
Navigate(scrHome, ScreenTransition.Fade)
```

---

### 4.7 شاشات النماذج الثلاثة (Wizard متعدد الخطوات)

> **ملاحظة:** النماذج الثلاثة (مخالفة / استقالة / إجازة) لها نفس البنية العامة. سأشرح المخالفة بالتفصيل، والآخرون يتبعون نفس النمط.

**منطق Wizard:** نستخدم متغير `locStep` (محلي للشاشة) يأخذ القيم 1، 2، 3. كل خطوة تُخفي ما قبلها وتُظهر نفسها.

---

#### 4.7.1 شاشة `scrFormViolation` — نموذج المخالفة

**الخطوة 1: اختيار الموظف**

- أضف **Dropdown** → اسمه `ddLeaderFilter`.
  - خاصية `Items`:
    ```
    AddColumns(
        Sort(Leaders, NameAr, SortOrder.Ascending),
        "DisplayName",
        If(varLang = "AR", NameAr, NameEn)
    )
    ```
  - `DisplayFields`: `["DisplayName"]`
  - `SearchField`: `"DisplayName"`

- أضف **Gallery** → اسمه `galEmpPicker`.
  - `Items`:
    ```
    Filter(
        Employees,
        ManagerKey = ddLeaderFilter.Selected.Key,
        (inpEmpSearch.Text = "" || Name starts with inpEmpSearch.Text)
    )
    ```
  - داخل البطاقة:
    - Label الاسم: `ThisItem.Name`
    - Label الـ HRID: `ThisItem.HRID`
    - `OnSelect`:
      ```
      Set(varVioEmp, ThisItem); UpdateContext({locStep: 2})
      ```

**الخطوة 2: تعبئة حقول المخالفة**

أضف العناصر التالية، كلها مع `Visible: locStep = 2`:

- **Label اسم الموظف:** `varVioEmp.Name`
- **Label الـ HRID:** `varVioEmp.HRID`
- **Label الإيميل:** `varVioEmp.Email`

- **Dropdown نوع المخالفة** → اسمه `ddVioType`:
  - `Items`: `["تأخر","غياب","خروج مبكر","أخرى"]`

- **DatePicker تاريخ المخالفة** → اسمه `dpVioDate`:
  - أضف **Text input** كبديل (Power Apps لا يحتوي DatePicker افتراضياً في Canvas) → اسمه `inpVioDate`.
  - `HintText`: `"YYYY/MM/DD"`

- **Text input مدة المخالفة** → `inpVioDuration`.
- **Text input أيام الغياب** → `inpVioAbsentDays`.
- **Text input ملاحظات** → `inpVioNotes`.

**الخطوة 3: التوقيع والإرسال**

أضف العناصر التالية مع `Visible: locStep = 3`:

- **Label تعليمات:** `If(varLang="AR","وقّع في المربع أدناه بإصبعك أو الماوس","Sign in the box below")`
- **Pen Input (التوقيع):**
  - اضغط **Insert** → **Input** → **Pen input** → اسمه `penManagerSig`.
  - خاصية `Mode`: `Draw`
  - أضف زر مسح بجانبه: `OnSelect: Reset(penManagerSig)`

- **زر الإرسال:**
  - `Text`: `If(varLang="AR","إرسال النموذج","Submit Form")`
  - `OnSelect`:
    ```
    PowerAutomate.Run(
        "ViolationFormFlow",
        {
            emp_name: varVioEmp.Name,
            emp_hrid: varVioEmp.HRID,
            emp_email: varVioEmp.Email,
            violation_type: ddVioType.Selected.Value,
            violation_date: inpVioDate.Text,
            violation_duration: inpVioDuration.Text,
            absent_days: inpVioAbsentDays.Text,
            notes: inpVioNotes.Text,
            manager_name: User().FullName,
            manager_sig: penManagerSig.Image,
            manager_date: Text(Today(), "YYYY/MM/DD")
        }
    );
    Notify(If(varLang="AR","تم إرسال النموذج بنجاح","Form submitted successfully"), NotificationType.Success);
    Navigate(scrHome, ScreenTransition.Fade)
    ```

> **مهم:** اسم التدفق `"ViolationFormFlow"` يجب أن يطابق تماماً اسم تدفق Power Automate الذي ستنشئه في الدليل التالي. ربط التدفق يتم من **Action → Power Automate → Add flow** داخل Power Apps Studio.

**أزرار التنقل بين الخطوات:**

- زر "التالي" من الخطوة 1:
  ```
  If(IsBlank(varVioEmp), Notify(If(varLang="AR","اختر موظفاً أولاً","Please select an employee"), NotificationType.Warning), UpdateContext({locStep: 2}))
  ```
- زر "السابق" من الخطوة 2:
  ```
  UpdateContext({locStep: 1})
  ```
- زر "التالي" من الخطوة 2 إلى 3:
  ```
  If(
      inpVioDate.Text = "",
      Notify(If(varLang="AR","أدخل تاريخ المخالفة","Enter violation date"), NotificationType.Warning),
      UpdateContext({locStep: 3})
  )
  ```
- زر "السابق" من الخطوة 3:
  ```
  UpdateContext({locStep: 2})
  ```
- زر الرجوع للرئيسية (في أي خطوة):
  ```
  Navigate(scrHome, ScreenTransition.Fade)
  ```

**مؤشر الخطوات (Step Indicator) — اختياري لكن موصى به:**
- أضف 3 دوائر (Circle shapes):
  - كل دائرة: `Fill: If(locStep >= [رقم الخطوة], ColorValue("#FBBF24"), ColorValue("#334155"))`

---

#### 4.7.2 شاشة `scrFormResignation` — نموذج الاستقالة

**نفس منطق المخالفة بالخطوات الثلاث، مع الحقول التالية:**

**الخطوة 1:** نفس اختيار الموظف (يمكن نسخ galEmpPicker وتسميته `galEmpPickerRes`).

**الخطوة 2: حقول الاستقالة:**
- `inpResDept` — القسم (Text input)
- `dpResDate` — تاريخ الاستقالة
- `dpResLastDay` — آخر يوم عمل
- `inpResReason` — سبب الاستقالة (Multiple lines text input)

**زر الإرسال (الخطوة 3):**
```
PowerAutomate.Run(
    "ResignationFormFlow",
    {
        emp_name: varResEmp.Name,
        emp_hrid: varResEmp.HRID,
        emp_email: varResEmp.Email,
        department: inpResDept.Text,
        resignation_date: dpResDate.Text,
        last_working_day: dpResLastDay.Text,
        reason: inpResReason.Text,
        manager_name: User().FullName,
        manager_sig: penManagerSigRes.Image,
        manager_date: Text(Today(), "YYYY/MM/DD")
    }
);
Notify(If(varLang="AR","تم إرسال النموذج","Form submitted"), NotificationType.Success);
Navigate(scrHome, ScreenTransition.Fade)
```

---

#### 4.7.3 شاشة `scrFormLeave` — نموذج الإجازة

**نفس المنطق، مع الحقول التالية:**

**الخطوة 1:** اختيار الموظف.

**الخطوة 2: حقول الإجازة:**
- `inpLeaveAppt` — التعيين (Appointment)
- `inpLeaveDept` — القسم
- `inpLeaveJobTitle` — المسمى الوظيفي
- `ddLeaveType` — نوع الإجازة (Dropdown):
  ```
  ["اعتيادية","طارئة","مرضية","إجازة أمومة","إجازة أبوة","بدون راتب","حج","دراسية"]
  ```
- `inpLeaveLastWork` — آخر يوم عمل
- `inpLeaveStart` — تاريخ بداية الإجازة
- `inpLeaveEnd` — تاريخ نهاية الإجازة
- `inpLeaveReturn` — تاريخ المباشرة
- `inpLeavePhone` — رقم الهاتف
- `inpLeaveTotalDays` — مجموع الأيام

**الخطوة 3: التوقيعات (يوجد توقيعان: مقدم الطلب + المدير):**
- `penApplicantSig` — توقيع مقدم الطلب (الموظف)
- `penManagerSigLeave` — توقيع المدير

**زر الإرسال:**
```
PowerAutomate.Run(
    "LeaveFormFlow",
    {
        emp_name: varLeaveEmp.Name,
        emp_hrid: varLeaveEmp.HRID,
        emp_appointment: inpLeaveAppt.Text,
        emp_dept: inpLeaveDept.Text,
        emp_jobtitle: inpLeaveJobTitle.Text,
        leave_type: ddLeaveType.Selected.Value,
        last_work_day: inpLeaveLastWork.Text,
        start_date: inpLeaveStart.Text,
        end_date: inpLeaveEnd.Text,
        return_date: inpLeaveReturn.Text,
        phone: inpLeavePhone.Text,
        total_days: inpLeaveTotalDays.Text,
        applicant_name: varLeaveEmp.Name,
        applicant_sig: penApplicantSig.Image,
        manager_name: User().FullName,
        manager_sig: penManagerSigLeave.Image,
        manager_date: Text(Today(), "YYYY/MM/DD")
    }
);
Notify(If(varLang="AR","تم إرسال الطلب","Request submitted"), NotificationType.Success);
Navigate(scrHome, ScreenTransition.Fade)
```

---

## 5. الثيم والتصميم

### 5.1 الألوان

| الاستخدام | الكود |
|---|---|
| خلفية الشاشات | `ColorValue("#0f172a")` — نيفي داكن |
| اللون الأكسنت (ذهبي) | `ColorValue("#FBBF24")` |
| نص ثانوي / وصفي | `ColorValue("#94a3b8")` |
| خلفية البطاقات | `ColorValue("#1e293b")` |
| نص أبيض | `ColorValue("#f8fafc")` |

**تطبيق الخلفية على كل شاشة:**
- اضغط على الشاشة (خارج أي عنصر) → في لوحة Properties يسار/يمين الشاشة → **Fill** → أدخل `ColorValue("#0f172a")`.

### 5.2 الخط

Power Apps لا تدعم تحميل خطوط خارجية مباشرة. أقرب خيار:
- استخدم `Font.SegoeUI` وهو الخط الافتراضي — مقبول للإنجليزية.
- للعربية، في خاصية `Font` اختر `Font.SegoeUI` كذلك — سيظهر بشكل معقول للعربية.
- إذا أردت Tajawal تحديداً، يمكن دمجه عبر HTML Text control (متقدم).

**لكل Label عربي:**
- `TextAlignment`: `TextAlign.Right`
- `VerticalAlignment`: `VerticalAlign.Middle`

### 5.3 الشعار

- أضف **Image control** في scrHome وفي Header (شريط علوي) لكل شاشة.
- ارفع `logo.png` مرة واحدة من **Media** panel ← **Upload media**.
- **ملاحظة:** التوهّج المتحرك (glow animation) من الموقع الأصلي لا يعمل في Power Apps — الصورة تبقى ثابتة. إذا أردت توهجاً بصرياً، افتح `logo.svg` في برنامج تصميم (مثل Inkscape أو Figma) وصدّره كـ PNG مع تأثير توهّج مُدمج في الصورة نفسها.

### 5.4 أسلوب الأزرار

لكل زر:
- `Fill`: `ColorValue("#FBBF24")` (الذهبي)
- `Color`: `ColorValue("#0f172a")` (النص نيفي داكن)
- `BorderRadius`: `8` (حواف دائرية)
- `HoverFill`: `ColorValue("#f59e0b")` (أغمق قليلاً عند التمرير)

---

## 6. RTL والثنائية اللغوية

### 6.1 المتغير العالمي `varLang`

**في خاصية `OnStart` للتطبيق:**
1. اضغط على `App` في Tree View.
2. في خاصية `OnStart` أضف:

```
// تعيين اللغة الافتراضية
Set(varLang, "AR");

// تحميل Collections محلية لتقليل طلبات SharePoint
ClearCollect(colLeaders, Leaders);
ClearCollect(colEmployees, Employees);
ClearCollect(colQuickLinks, QuickLinks);
ClearCollect(colEscalationLinks, EscalationLinks);
ClearCollect(colEscalationGuide, EscalationGuide);
ClearCollect(colEscalationSteps, EscalationSteps);

// تعيين متغيرات اللغة الافتراضية
Set(varExpandedCat, "");
Set(varSelectedLeader, Blank());
Set(varSelectedEscParent, Blank())
```

> **شرح `ClearCollect`:** يحمّل بيانات SharePoint في الذاكرة مرة واحدة عند فتح التطبيق، فتصبح الشاشات أسرع. بعدها استخدم `colLeaders` بدل `Leaders` في صيغ الـ Items حيثما أردت.

### 6.2 المحاذاة اليمينية (RTL اليدوي)

Power Apps Canvas **لا** تحوّل الواجهة إلى RTL تلقائياً. يجب:

1. **كل Label:** خاصية `TextAlignment` = `TextAlign.Right`.
2. **كل Text input:** خاصية `TextAlignment` = `TextAlign.Right`.
3. **ترتيب العناصر:** ضع الأيقونات والأرقام على اليسار، والنص على اليمين.
4. **Gallery:** إذا أردت عرضاً من اليمين لليسار، رتّب البطاقات يدوياً.
5. **للأزرار والتسميات ثنائية اللغة:** استخدم دائماً الصيغة:
   ```
   If(varLang = "AR", "النص العربي", "English Text")
   ```

### 6.3 جدول ترجمة نموذجي (للرجوع إليه)

| المفتاح | العربي | الإنجليزي |
|---|---|---|
| nav_leaders | دليل الليدرز | Leaders Directory |
| nav_quicklinks | الروابط السريعة | Quick Links |
| nav_escalation_links | روابط التصعيد | Escalation Links |
| nav_escalation_guide | دليل التصعيد | Escalation Guide |
| nav_form_violation | نموذج مخالفة | Violation Form |
| nav_form_resignation | نموذج استقالة | Resignation Form |
| nav_form_leave | نموذج إجازة | Leave Form |
| lbl_name | الاسم | Name |
| lbl_department | القسم | Department |
| lbl_title | المسمى | Title |
| lbl_email | الإيميل | Email |
| lbl_search | بحث | Search |
| btn_submit | إرسال النموذج | Submit Form |
| btn_next | التالي | Next |
| btn_prev | السابق | Previous |
| btn_back | رجوع | Back |
| btn_sign_clear | امسح التوقيع | Clear Signature |

---

## 7. نشر التطبيق (Publish)

1. من **File** (أعلى يسار Power Apps Studio) → **Save**.
2. اضغط **Publish**.
3. في نافذة التأكيد اضغط **Publish this version**.
4. ستظهر رسالة نجاح — التطبيق الآن جاهز للمشاركة.

> **نصيحة:** انشر دائماً بعد كل مجموعة تغييرات، وليس بعد كل تعديل صغير.

---

## 8. مشاركة التطبيق مع مجموعة Entra

> هذه الخطوة تحلّ محلّ Firebase Auth بالكامل — فقط من في مجموعة `SG-CollectionBarq-Users` يستطيع فتح التطبيق.

### 8.1 مشاركة التطبيق

1. من `make.powerapps.com` اضغط على قائمة **Apps** من الشريط الجانبي.
2. ابحث عن **Collection Barq** → اضغط على **...** (النقاط الثلاث) بجانبه → **Share**.
3. في حقل البحث اكتب اسم مجموعة Entra: `SG-CollectionBarq-Users`.
4. اختر المجموعة من القائمة المنسدلة.
5. **Role:** اختر **User** (وليس Co-owner — هذا للمديرين التقنيين فقط).
6. اضغط **Share**.

### 8.2 مشاركة مصادر بيانات SharePoint

مشاركة التطبيق وحدها لا تكفي — يجب أيضاً أن يكون للمجموعة صلاحية **قراءة** القوائم:

1. افتح موقع SharePoint → **Settings** → **Site permissions**.
2. اضغط **Share site**.
3. أضف مجموعة `SG-CollectionBarq-Users` بصلاحية **Read** (للمستخدمين العاديين).
4. إذا أردت أن يتمكن بعضهم من إضافة صفوف في DownloadLog — أضفهم بصلاحية **Contribute** على تلك القائمة تحديداً.

> **ملاحظة مهمة:** تدفقات Power Automate تعمل بصلاحية المدير الذي أنشأها (connection owner) — لا تحتاج المستخدمون العاديون أي صلاحية premium لتشغيل النموذج. فقط المدير الذي يُنشئ التدفق يحتاج ترخيص Premium.

### 8.3 رابط التطبيق للمستخدمين

بعد المشاركة، انسخ رابط التطبيق من نافذة Share وأرسله للفريق:
- الرابط يكون بالشكل: `https://apps.powerapps.com/play/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- يمكن أيضاً إضافة التطبيق كتاب في Microsoft Teams: في Teams → **Apps** → **Power Apps** → ابحث عن **Collection Barq** → **Add to a tab**.

---

## 9. قائمة التحقق النهائية

### مرحلة SharePoint

- [ ] موقع SharePoint للفريق موجود ويمكن الوصول إليه
- [ ] `BarqData.xlsx` مرفوع في مكتبة Documents
- [ ] قائمة `Leaders` منشأة، 23 صف، عمود `Teams` نوعه Hyperlink
- [ ] قائمة `Employees` منشأة، 279 صف، عمود `HRID` نوعه Text، عمود `JobTitle` موجود
- [ ] عمود `Manager` (Lookup إلى Leaders) أُضيف لقائمة Employees
- [ ] قائمة `QuickLinks` منشأة، عمود `Section` نوعه Choice (Quick / Additional)، عمود `Url` نوعه Hyperlink
- [ ] قائمة `EscalationLinks` منشأة، عمود `IsChild` نوعه Choice (Yes / No)، عمود `Order` نوعه Number، عمود `Url` نوعه Hyperlink
- [ ] قائمة `EscalationGuide` منشأة، 6 صفوف
- [ ] قائمة `EscalationSteps` منشأة، 19 صف، عمود `Order` نوعه Number، عمودا StepAr وStepEn نوعهما Multiple lines of text
- [ ] قائمة `DownloadLog` منشأة يدوياً، فارغة، أعمدتها الستة موجودة

### مرحلة Power Apps Studio

- [ ] التطبيق `Collection Barq` منشأ كـ Canvas App
- [ ] مصادر البيانات السبعة (SharePoint Lists) متصلة
- [ ] الشاشات التسع منشأة بأسمائها الصحيحة
- [ ] `App.OnStart` يحتوي `Set(varLang, "AR")` و `ClearCollect` للقوائم الست
- [ ] `scrHome`: شعار + 7 أزرار تنقل + زر تبديل اللغة
- [ ] `scrLeaders`: بحث + فلتر قسم + gallery بصيغة Filter صحيحة + OnSelect يحفظ `varSelectedLeader`
- [ ] `scrLeaderDetail`: يعرض بيانات `varSelectedLeader` + gallery موظفيه + زر Teams
- [ ] `scrQuickLinks`: gallery للـ Quick + popup ITSM + gallery للـ Additional
- [ ] `scrEscalationLinks`: gallery الآباء + gallery الأبناء مع Filter صحيح
- [ ] `scrEscalationGuide`: accordion بمتغير `varExpandedCat` + خطوات مرتّبة بـ `Order`
- [ ] `scrFormViolation`: 3 خطوات + اختيار موظف + Pen Input + زر إرسال متصل بالتدفق
- [ ] `scrFormResignation`: 3 خطوات + حقول الاستقالة + Pen Input + زر إرسال
- [ ] `scrFormLeave`: 3 خطوات + حقول الإجازة + توقيعان + زر إرسال
- [ ] كل شاشة: خلفية `#0f172a`، أكسنت `#FBBF24`، محاذاة يمينية للنصوص العربية
- [ ] زر تبديل اللغة يعمل في كل الشاشات

### مرحلة النشر والمشاركة

- [ ] التطبيق نُشر (Publish)
- [ ] مجموعة Entra `SG-CollectionBarq-Users` أُنشئت وأُضيف إليها الفريق الـ 14
- [ ] التطبيق شُورك مع المجموعة بصلاحية User
- [ ] موقع SharePoint شُورك مع المجموعة بصلاحية Read
- [ ] قائمة `DownloadLog` لها صلاحية Contribute للمجموعة (أو لتدفق Power Automate فقط)
- [ ] رابط التطبيق أُرسل للفريق أو أُضيف في Teams

### مرحلة التدفقات (الخطوة التالية)

- [ ] تدفق `ViolationFormFlow` في Power Automate منشأ ومتصل بالتطبيق
- [ ] تدفق `ResignationFormFlow` في Power Automate منشأ ومتصل بالتطبيق
- [ ] تدفق `LeaveFormFlow` في Power Automate منشأ ومتصل بالتطبيق
- [ ] كل تدفق يكتب صفاً في `DownloadLog` بعد التوليد
- [ ] قوالب Word (.docx) الثلاثة بـ Content Controls مرفوعة في SharePoint

---

> **الخطوة التالية:** راجع ملف `03-Word-Templates-Guide.md` لبناء قوالب Word بالـ Content Controls، ثم `04-Power-Automate-Flows.md` لربط تدفقات التوليد والإرسال.
