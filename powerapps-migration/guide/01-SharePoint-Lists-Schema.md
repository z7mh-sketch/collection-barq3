# مخطط قوائم SharePoint — Collection Barq (Power Apps)

هذا الملف يوصّف **القوائم (Lists)** اللي تنشئها في SharePoint عشان تصير مصدر بيانات تطبيق Power Apps.
كل قائمة تطابق ورقة (Sheet) + جدول (Table) في الملف `data/BarqData.xlsx`.

> **طريقة الإنشاء المختصرة:** في موقع SharePoint للفريق → **New → List → From Excel** → ارفع `BarqData.xlsx` واختر الجدول المطلوب. SharePoint ينشئ الأعمدة تلقائياً. بعدها عدّل نوع كل عمود حسب الجدول أدناه (خصوصاً Hyperlink و Choice و Number) لأن الاستيراد يخليها كلها نص.
>
> **مهم:** كل قائمة في SharePoint فيها عمود إجباري اسمه **Title**. الجدول يوضّح وش نخلي في Title لكل قائمة.

---

## ملاحظات عامة على الأنواع

| النوع في SharePoint | يُستخدم لـ |
|---|---|
| Single line of text | نص قصير (اسم، مفتاح، أيقونة) |
| Multiple lines of text | نص طويل (خطوات) |
| Hyperlink | روابط URL |
| Number | أرقام الترتيب |
| Choice | قيم ثابتة (Section, IsChild) |
| Lookup | علاقة بقائمة ثانية (المدير ← Leaders) |

كل عمود نصي ثنائي اللغة له نسختان: `...Ar` (عربي) و `...En` (إنجليزي).

---

## 1. قائمة `Leaders` (الليدرز) — من `tblLeaders` (٢٣ صف)

| العمود | النوع | ملاحظات |
|---|---|---|
| **Title** | Single line of text | ضع فيه `Key` (المعرّف الفريد، مثل `tl-salghamdi`) |
| Key | Single line of text | نفس المعرّف (مكرر للوضوح، أو استخدم Title فقط) |
| NameAr | Single line of text | الاسم بالعربي |
| NameEn | Single line of text | الاسم بالإنجليزي |
| TitleAr | Single line of text | المسمى بالعربي (سوبر فايزر / قائد فريق) |
| TitleEn | Single line of text | المسمى بالإنجليزي |
| DeptAr | Single line of text | القسم بالعربي |
| DeptEn | Single line of text | القسم بالإنجليزي |
| Email | Single line of text | إيميل الليدر (فاضي للسوبر فايزرز) |
| Phone | Single line of text | الجوال (غالباً فاضي حالياً) |
| Teams | Hyperlink | رابط محادثة Teams |
| ReportsTo | Single line of text | مفتاح المدير الأعلى (فاضي حالياً للكل). **لاحقاً** حوّله Lookup ذاتي على Leaders لبناء الهيكل |

> 💡 حالياً كل الليدرز `ReportsTo` فاضي و`escalationLinks` فاضية في الموقع — هذي فرصة تعبّيها صح في القائمة الجديدة لما تجهز الهيكل.

---

## 2. قائمة `Employees` (الموظفون) — من `tblEmployees` (٢٧٩ صف)

| العمود | النوع | ملاحظات |
|---|---|---|
| **Title** | Single line of text | ضع فيه `Name` (اسم الموظف) |
| ManagerKey | Single line of text | مفتاح الليدر المدير (يطابق `Key` في Leaders) |
| ManagerEmail | Single line of text | إيميل المدير |
| Name | Single line of text | اسم الموظف |
| HRID | Single line of text | **مهم: نص وليس رقم** (عشان ما تضيع الأرقام) |
| Email | Single line of text | إيميل الموظف |
| Title | Single line of text | المسمى (Agent) — ⚠️ يتعارض اسمه مع عمود Title الإجباري، فسمّه `JobTitle` |

> ⚠️ **تنبيه:** عمود الموظف `Title` يتصادم مع عمود SharePoint الإجباري. عند الاستيراد سمِّ عمود المسمى الوظيفي **`JobTitle`** بدل `Title`، وخلّي عمود Title الإجباري = اسم الموظف.
>
> 🔗 **العلاقة:** بعد الاستيراد، الأفضل تضيف عمود **Lookup** اسمه `Manager` يشير لقائمة Leaders (عمود Title/Key)، باستخدام `ManagerKey` للمطابقة. هذا يخلي اختيار «موظفي هذا المدير» في التطبيق نظيف.

---

## 3. قائمة `QuickLinks` (الروابط السريعة) — من `tblQuickLinks` (٦ صفوف)

| العمود | النوع | ملاحظات |
|---|---|---|
| **Title** | Single line of text | ضع فيه `LabelEn` |
| Section | Choice | القيم: `Quick`, `Additional` |
| LabelAr | Single line of text | الاسم بالعربي |
| LabelEn | Single line of text | الاسم بالإنجليزي |
| Url | Hyperlink | الرابط (بعضها بروتوكولات مثل `msteams://` و`mailto:`) |
| Icon | Single line of text | اسم أيقونة Font Awesome (للمرجع — في Power Apps نستخدم أيقونات مدمجة) |
| Phone | Single line of text | رقم هاتف ITSM (للبطاقة اللي فيها بروتوكول مكالمة) |

---

## 4. قائمة `EscalationLinks` (روابط التصعيد) — من `tblEscalationLinks` (٧ صفوف)

| العمود | النوع | ملاحظات |
|---|---|---|
| **Title** | Single line of text | ضع فيه `LabelEn` |
| Order | Number | ترتيب العرض (الأب ورقمه، والأبناء يأخذون رقم الأب) |
| ParentLabel | Single line of text | اسم الرابط الأب (فاضي للآباء، معبّأ للأبناء) |
| IsChild | Choice | القيم: `Yes`, `No` |
| LabelAr | Single line of text | الاسم بالعربي |
| LabelEn | Single line of text | الاسم بالإنجليزي |
| Url | Hyperlink | رابط SharePoint (روابط طويلة جداً — Hyperlink يتحملها) |
| Icon | Single line of text | اسم أيقونة (مرجع) |

> 🔗 العلاقة أب/ابن مبنية عبر `ParentLabel` = `LabelAr` للأب. في التطبيق: gallery للآباء (`IsChild = "No"`)، وداخلها gallery مصغّر للأبناء المطابقين.

---

## 5. قائمة `EscalationGuide` (دليل التصعيد — الفئات) — من `tblEscalationGuide` (٦ صفوف)

| العمود | النوع | ملاحظات |
|---|---|---|
| **Title** | Single line of text | ضع فيه `Key` (مثل `cat-1`) |
| Key | Single line of text | مفتاح الفئة (cat-1 … cat-6) |
| CategoryAr | Single line of text | اسم الفئة بالعربي |
| CategoryEn | Single line of text | اسم الفئة بالإنجليزي |
| Icon | Single line of text | اسم أيقونة (مرجع) |

---

## 6. قائمة `EscalationSteps` (خطوات الدليل) — من `tblEscalationSteps` (١٩ صف)

| العمود | النوع | ملاحظات |
|---|---|---|
| **Title** | Single line of text | ضع فيه `CategoryKey` + رقم الخطوة (أو أول كلمات الخطوة) |
| CategoryKey | Single line of text | يطابق `Key` في EscalationGuide (cat-1 …) |
| Order | Number | ترتيب الخطوة داخل الفئة |
| StepAr | Multiple lines of text | نص الخطوة بالعربي |
| StepEn | Multiple lines of text | نص الخطوة بالإنجليزي |

> 🔗 العلاقة: `CategoryKey` يربط الخطوة بفئتها. في التطبيق: gallery للفئات، وداخلها gallery للخطوات المرتّبة بـ `Order`.

---

## 7. قائمة `DownloadLog` (سجل التحميلات) — **جديدة، بدون استيراد**

تُملأ تلقائياً من تدفق Power Automate لما يولّد أحد موظفيك نموذجاً (بدل `server.ps1` المحلي).

| العمود | النوع | ملاحظات |
|---|---|---|
| **Title** | Single line of text | اسم النموذج (مخالفة / استقالة / إجازة) |
| UserEmail | Single line of text | إيميل من ولّد النموذج |
| UserName | Single line of text | اسم من ولّد النموذج |
| FormType | Choice | `Violation`, `Resignation`, `Leave` |
| TargetEmployee | Single line of text | الموظف المعني (إن وُجد) |
| GeneratedAt | Date and Time | وقت التوليد |

> هذي تتقاعد محلها سيرفر PowerShell + ملف `downloads.json` + إيميل Outlook COM. كل التتبّع يصير من جوّ التدفق على السيرفر — أكثر موثوقية وما يحتاج جهازك يكون شغّال.

---

## ملخص العلاقات (Relationships)

```
Leaders (Key) ──< Employees (ManagerKey)        موظفون كثيرون لكل مدير
Leaders (Key) ──< Leaders (ReportsTo)           الهيكل الإداري (لاحقاً)
EscalationGuide (Key) ──< EscalationSteps (CategoryKey)
EscalationLinks (LabelAr للأب) ──< EscalationLinks (ParentLabel للأبناء)
```

## ترتيب الاستيراد الموصى به
1. `Leaders` أولاً (لأن Employees يعتمد عليها في الـ Lookup).
2. `Employees` (وأضف عمود Lookup `Manager` بعدها).
3. `QuickLinks`, `EscalationLinks`, `EscalationGuide`, `EscalationSteps` (مستقلة).
4. `DownloadLog` أنشئها يدوياً (فاضية).
