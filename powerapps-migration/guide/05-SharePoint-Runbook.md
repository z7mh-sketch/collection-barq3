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
