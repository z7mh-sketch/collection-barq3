# مواصفات تدفقات Power Automate — Collection Barq

> **تاريخ الكتابة:** 2026-06-06  
> **المشروع:** ترحيل Collection Barq إلى Power Apps Canvas + SharePoint  
> **المرجع:** `01-SharePoint-Lists-Schema.md` (أسماء القوائم والأعمدة معتمدة منه)

---

## نظرة عامة

يحتوي هذا الملف على مواصفات **أربعة تدفقات** كاملة قابلة للبناء خطوة بخطوة في [make.powerautomate.com](https://make.powerautomate.com):

| # | اسم التدفق | الغرض |
|---|---|---|
| A | **GenerateViolationPDF** | توليد PDF نموذج المخالفة وإرساله بالإيميل |
| B | **GenerateResignationPDF** | توليد PDF نموذج الاستقالة وإرساله بالإيميل |
| C | **GenerateLeavePDF** | توليد PDF طلب الإجازة وإرساله بالإيميل |
| D | **ImportFromExcel** | استيراد بيانات Excel إلى قوائم SharePoint (مرة واحدة) |

---

## ملاحظة مهمة: المحتوى المميز (Premium)

> **تنبيه:** موصّل **Word Online (Business)** هو موصّل **مميز (Premium)** — يحتاج ترخيص **Power Automate Premium** أو **Power Apps Premium**.  
> المدراء الذين يولّدون النماذج (شخص أو شخصان) هم الوحيدون الذين يحتاجون هذا الترخيص.  
> باقي مستخدمي التطبيق لا يحتاجون ترخيصاً مميزاً.

---

## التدفق A: `GenerateViolationPDF`

### الغرض
يستقبل بيانات نموذج المخالفة من تطبيق Power Apps، يملأ قالب Word، يحوّله PDF، يرسله بالإيميل للمدير والموظف، ويسجّل العملية في قائمة `DownloadLog`.

---

### خطوة 0: إعداد قالب Word قبل بناء التدفق

قبل البدء، يجب أن يكون قالب Word جاهزاً في OneDrive أو مكتبة SharePoint.  
القالب يحتوي على **Content Controls** بالـ Tags التالية بالضبط:

| Tag | نوع الـ Control | وصف الحقل |
|---|---|---|
| `emp_name` | Plain Text | اسم الموظف |
| `emp_hrid` | Plain Text | الرقم الوظيفي (HRID) |
| `emp_email` | Plain Text | إيميل الموظف |
| `violation_type` | Plain Text | نوع المخالفة (تأخر / غياب / خروج / أخرى) |
| `violation_date` | Plain Text | تاريخ المخالفة |
| `violation_duration` | Plain Text | مدة التأخير أو الخروج المبكر |
| `absent_days` | Plain Text | عدد أيام الغياب |
| `notes` | Plain Text | ملاحظات إضافية |
| `manager_name` | Plain Text | اسم المدير |
| `manager_sig` | **Picture** | صورة توقيع المدير (base64) |
| `manager_date` | Plain Text | تاريخ إصدار النموذج |

**طريقة إضافة Content Control في Word:**
1. افتح قالب Word الخاص بنموذج المخالفة.
2. من تبويب **Developer** (المطور) ← **Plain Text Content Control** أو **Picture Content Control**.
3. اختر الـ Control ← **Properties** ← في حقل **Tag** اكتب الاسم من الجدول أعلاه بالضبط (حساس لحروف الكبيرة والصغيرة).
4. احفظ الملف بصيغة `.docx` في OneDrive (مثلاً: `Templates/ViolationTemplate.docx`).

---

### خطوة 1: إنشاء التدفق

1. افتح [make.powerautomate.com](https://make.powerautomate.com).
2. من القائمة الجانبية اختر **My flows** ← **New flow** ← **Instant cloud flow**.
3. في حقل **Flow name** اكتب: `GenerateViolationPDF`.
4. اختر **PowerApps (V2)** كـ Trigger.
5. اضغط **Create**.

---

### خطوة 2: إعداد الـ Trigger (PowerApps V2)

في بطاقة الـ Trigger **PowerApps (V2)**:

1. اضغط على **Add an input** لكل حقل من الحقول التالية:

| اسم المدخل (Input Name) | النوع |
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

> **ملاحظة:** `manager_sig_base64` يستقبل سلسلة base64 للصورة من Power Apps. `recipient_email` للإيميل الذي سيستقبل النموذج.

---

### خطوة 3: تعبئة قالب Word

1. اضغط **+ New step**.
2. ابحث عن: **Word Online (Business)**.
3. اختر الإجراء: **Populate a Microsoft Word template**.
4. اعبّئ الحقول:

| حقل في الإجراء | القيمة |
|---|---|
| **Location** | OneDrive for Business (أو SharePoint — حسب مكان حفظ القالب) |
| **Document Library** | OneDrive (أو اسم مكتبة SharePoint) |
| **File** | `/Templates/ViolationTemplate.docx` (المسار الكامل للقالب) |

5. بعد اختيار الملف، يظهر قسم **Dynamic content** يعرض كل الـ Tags تلقائياً. اربط كل Tag بمدخله:

| Tag في Word | القيمة من الـ Trigger |
|---|---|
| `emp_name` | `triggerBody()?['emp_name']` أو اختره من Dynamic content |
| `emp_hrid` | `triggerBody()?['emp_hrid']` |
| `emp_email` | `triggerBody()?['emp_email']` |
| `violation_type` | `triggerBody()?['violation_type']` |
| `violation_date` | `triggerBody()?['violation_date']` |
| `violation_duration` | `triggerBody()?['violation_duration']` |
| `absent_days` | `triggerBody()?['absent_days']` |
| `notes` | `triggerBody()?['notes']` |
| `manager_name` | `triggerBody()?['manager_name']` |
| `manager_sig` **(Picture Control)** | `triggerBody()?['manager_sig_base64']` |
| `manager_date` | `triggerBody()?['manager_date']` |

> **مهم لتوقيع الصورة:** حقل `manager_sig` من نوع **Picture Content Control** — عند ربطه اختر النوع **Image** وليس Text، وألصق قيمة `manager_sig_base64` مباشرة.

---

### خطوة 4: تحويل Word إلى PDF

1. اضغط **+ New step**.
2. ابحث عن: **Word Online (Business)**.
3. اختر الإجراء: **Convert Word Document to PDF**.
4. في حقل **File Content**، اختر من Dynamic content: **Microsoft Word Document** (ناتج الخطوة السابقة "Populate a Microsoft Word template" → Body → `$content`).

> هذا الإجراء يُعيد ملف PDF كـ binary content.

---

### خطوة 5: إرسال الإيميل مع PDF مرفقاً

1. اضغط **+ New step**.
2. ابحث عن: **Office 365 Outlook**.
3. اختر الإجراء: **Send an email (V2)**.
4. اعبّئ الحقول:

| الحقل | القيمة |
|---|---|
| **To** | `triggerBody()?['recipient_email']` |
| **Subject** | `نموذج مخالفة — [emp_name]` أو: `Violation Form — [emp_name]` |
| **Body** | انظر قالب HTML أدناه |
| **Is HTML** | Yes (فعّل هذا الخيار) |

5. في قسم **Attachments** اضغط **Add new item**:

| الحقل | القيمة |
|---|---|
| **Name** | `Violation_[emp_name]_[violation_date].pdf` |
| **Content** | من Dynamic content: **PDF Document** (ناتج خطوة Convert → Body → `$content`) |

---

#### قالب HTML لجسم إيميل المخالفة

```html
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
  <table width="600" cellpadding="0" cellspacing="0" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
    <!-- Header -->
    <tr>
      <td style="background-color: #0f172a; padding: 24px 32px; text-align: center;">
        <h1 style="color: #FBBF24; margin: 0; font-size: 22px; letter-spacing: 1px;">Collection Barq</h1>
        <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 13px;">نموذج مخالفة رسمي | Official Violation Form</p>
      </td>
    </tr>
    <!-- Body AR -->
    <tr>
      <td style="padding: 28px 32px;">
        <p style="color: #0f172a; font-size: 15px; margin: 0 0 16px 0;">السادة المحترمون،</p>
        <p style="color: #374151; font-size: 14px; line-height: 1.8; margin: 0 0 20px 0;">
          مرفق طيّه نموذج مخالفة رسمي خاص بالموظف <strong style="color: #0f172a;">@{triggerBody()?['emp_name']}</strong>
          (الرقم الوظيفي: <strong>@{triggerBody()?['emp_hrid']}</strong>).
        </p>
        <!-- Details Table -->
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 24px;">
          <tr style="background-color: #0f172a;">
            <th style="color: #FBBF24; padding: 10px 14px; text-align: right; font-size: 13px; border: 1px solid #1e293b;">البند</th>
            <th style="color: #FBBF24; padding: 10px 14px; text-align: right; font-size: 13px; border: 1px solid #1e293b;">التفاصيل</th>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #64748b;">اسم الموظف</td>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #0f172a; font-weight: 600;">@{triggerBody()?['emp_name']}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #64748b;">الرقم الوظيفي</td>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #0f172a;">@{triggerBody()?['emp_hrid']}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #64748b;">نوع المخالفة</td>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #dc2626; font-weight: 600;">@{triggerBody()?['violation_type']}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #64748b;">تاريخ المخالفة</td>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #0f172a;">@{triggerBody()?['violation_date']}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #64748b;">المدير المباشر</td>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #0f172a;">@{triggerBody()?['manager_name']}</td>
          </tr>
        </table>
        <p style="color: #374151; font-size: 13px; line-height: 1.7; margin: 0 0 8px 0;">
          النموذج مرفق بهذا الإيميل بصيغة PDF. يُرجى الاطلاع عليه وحفظه للأرشفة الرسمية.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
          Dear Team,<br>
          Please find attached the official violation form for employee <strong>@{triggerBody()?['emp_name']}</strong>.
          Kindly review and archive it accordingly.
        </p>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background-color: #0f172a; padding: 16px 32px; text-align: center;">
        <p style="color: #FBBF24; font-size: 12px; margin: 0;">Collection Barq — نظام إدارة الفريق الداخلي</p>
        <p style="color: #475569; font-size: 11px; margin: 4px 0 0 0;">هذا إيميل تلقائي — يُرجى عدم الرد عليه مباشرة</p>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

### خطوة 6: إنشاء سجل في قائمة `DownloadLog`

1. اضغط **+ New step**.
2. ابحث عن: **SharePoint**.
3. اختر الإجراء: **Create item**.
4. اعبّئ الحقول:

| حقل SharePoint | القيمة |
|---|---|
| **Site Address** | رابط موقع SharePoint الخاص بك |
| **List Name** | `DownloadLog` |
| **Title** | `مخالفة` |
| **UserEmail** | `triggerBody()?['recipient_email']` |
| **UserName** | `triggerBody()?['manager_name']` |
| **FormType** | `Violation` |
| **TargetEmployee** | `triggerBody()?['emp_name']` |
| **GeneratedAt** | `utcNow()` |

---

### خطوة 7: إرجاع PDF إلى Power Apps (Respond to PowerApps)

1. اضغط **+ New step**.
2. ابحث عن: **Power Apps**.
3. اختر الإجراء: **Respond to a PowerApp or flow**.
4. اضغط **+ Add an output** ← اختر **File**.
5. سمّ المخرج: `PDFFile`.
6. في القيمة: من Dynamic content اختر **PDF Document** (ناتج خطوة Convert → `$content`).

> **في Power Apps:** استخدم `Download(GenerateViolationPDF.Run(...).PDFFile)` لتحميل الـ PDF مباشرة على جهاز المدير.

---

### ربط التدفق بتطبيق Power Apps

في تطبيق Power Apps:

1. من القائمة العلوية اختر **Data** ← **Add data** ← ابحث عن `GenerateViolationPDF` واضفه.
2. على زر "توليد النموذج" اكتب الكود التالي في خاصية **OnSelect**:

```powerfx
Set(
    varViolationPDF,
    GenerateViolationPDF.Run(
        TextInputEmpName.Text,       // emp_name
        TextInputEmpHRID.Text,       // emp_hrid
        TextInputEmpEmail.Text,      // emp_email
        DropdownViolationType.Selected.Value,  // violation_type
        DatePickerViolation.SelectedDate,      // violation_date
        TextInputDuration.Text,      // violation_duration
        TextInputAbsentDays.Text,    // absent_days
        TextInputNotes.Text,         // notes
        varManagerName,              // manager_name (من متغير المدير الحالي)
        varSignatureBase64,          // manager_sig_base64 (من لوحة التوقيع)
        Text(Today(), "yyyy-mm-dd"), // manager_date
        TextInputEmpEmail.Text       // recipient_email
    )
);
Download(varViolationPDF.PDFFile)
```

> **ملاحظة:** `varSignatureBase64` يُملأ من مكوّن لوحة التوقيع (Pen Input) باستخدام: `Set(varSignatureBase64, penInputSignature.Image)`.

---

## التدفق B: `GenerateResignationPDF`

### Tags قالب Word — الاستقالة

| Tag | نوع الـ Control | وصف الحقل |
|---|---|---|
| `emp_name` | Plain Text | اسم الموظف |
| `emp_hrid` | Plain Text | الرقم الوظيفي |
| `emp_email` | Plain Text | إيميل الموظف |
| `department` | Plain Text | القسم |
| `resignation_date` | Plain Text | تاريخ تقديم الاستقالة |
| `last_working_day` | Plain Text | آخر يوم عمل |
| `reason` | Plain Text | سبب الاستقالة |
| `manager_name` | Plain Text | اسم المدير |
| `manager_sig` | **Picture** | توقيع المدير (base64) |
| `manager_date` | Plain Text | تاريخ الاعتماد |

---

### خطوة 1: إنشاء التدفق

1. **My flows** ← **New flow** ← **Instant cloud flow**.
2. الاسم: `GenerateResignationPDF`.
3. الـ Trigger: **PowerApps (V2)**.

---

### خطوة 2: مدخلات الـ Trigger

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

---

### خطوة 3: تعبئة قالب Word (Populate a Microsoft Word template)

- **File:** `/Templates/ResignationTemplate.docx`
- ربط Tags:

| Tag | المدخل |
|---|---|
| `emp_name` | `triggerBody()?['emp_name']` |
| `emp_hrid` | `triggerBody()?['emp_hrid']` |
| `emp_email` | `triggerBody()?['emp_email']` |
| `department` | `triggerBody()?['department']` |
| `resignation_date` | `triggerBody()?['resignation_date']` |
| `last_working_day` | `triggerBody()?['last_working_day']` |
| `reason` | `triggerBody()?['reason']` |
| `manager_name` | `triggerBody()?['manager_name']` |
| `manager_sig` **(Picture)** | `triggerBody()?['manager_sig_base64']` |
| `manager_date` | `triggerBody()?['manager_date']` |

---

### الخطوات 4–7: نفس التدفق A مع تعديلات

**خطوة 4 (Convert to PDF):** نفس الإجراء.

**خطوة 5 (Send email):** استخدم قالب HTML أدناه.

**خطوة 6 (DownloadLog):**
- Title: `استقالة`
- FormType: `Resignation`

**خطوة 7 (Respond):** نفس الإجراء، المخرج: `PDFFile`.

---

#### قالب HTML لجسم إيميل الاستقالة

```html
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
  <table width="600" cellpadding="0" cellspacing="0" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
    <tr>
      <td style="background-color: #0f172a; padding: 24px 32px; text-align: center;">
        <h1 style="color: #FBBF24; margin: 0; font-size: 22px; letter-spacing: 1px;">Collection Barq</h1>
        <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 13px;">نموذج استقالة رسمي | Official Resignation Form</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 28px 32px;">
        <p style="color: #0f172a; font-size: 15px; margin: 0 0 16px 0;">السادة المحترمون،</p>
        <p style="color: #374151; font-size: 14px; line-height: 1.8; margin: 0 0 20px 0;">
          مرفق طيّه نموذج استقالة رسمي خاص بالموظف <strong style="color: #0f172a;">@{triggerBody()?['emp_name']}</strong>
          (الرقم الوظيفي: <strong>@{triggerBody()?['emp_hrid']}</strong>).
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 24px;">
          <tr style="background-color: #0f172a;">
            <th style="color: #FBBF24; padding: 10px 14px; text-align: right; font-size: 13px; border: 1px solid #1e293b;">البند</th>
            <th style="color: #FBBF24; padding: 10px 14px; text-align: right; font-size: 13px; border: 1px solid #1e293b;">التفاصيل</th>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #64748b;">اسم الموظف</td>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #0f172a; font-weight: 600;">@{triggerBody()?['emp_name']}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #64748b;">الرقم الوظيفي</td>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #0f172a;">@{triggerBody()?['emp_hrid']}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #64748b;">القسم</td>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #0f172a;">@{triggerBody()?['department']}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #64748b;">تاريخ الاستقالة</td>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #0f172a;">@{triggerBody()?['resignation_date']}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #64748b;">آخر يوم عمل</td>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #dc2626; font-weight: 600;">@{triggerBody()?['last_working_day']}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #64748b;">المدير المباشر</td>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #0f172a;">@{triggerBody()?['manager_name']}</td>
          </tr>
        </table>
        <p style="color: #374151; font-size: 13px; line-height: 1.7; margin: 0 0 8px 0;">
          النموذج مرفق بهذا الإيميل بصيغة PDF. يُرجى الاطلاع عليه واتخاذ الإجراءات اللازمة.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
          Dear Team,<br>
          Please find attached the official resignation form for employee <strong>@{triggerBody()?['emp_name']}</strong>.
          Last working day: <strong>@{triggerBody()?['last_working_day']}</strong>. Please take the necessary action.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #0f172a; padding: 16px 32px; text-align: center;">
        <p style="color: #FBBF24; font-size: 12px; margin: 0;">Collection Barq — نظام إدارة الفريق الداخلي</p>
        <p style="color: #475569; font-size: 11px; margin: 4px 0 0 0;">هذا إيميل تلقائي — يُرجى عدم الرد عليه مباشرة</p>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

### ربط التدفق بـ Power Apps (الاستقالة)

```powerfx
Set(
    varResignationPDF,
    GenerateResignationPDF.Run(
        TextInputEmpName.Text,
        TextInputEmpHRID.Text,
        TextInputEmpEmail.Text,
        TextInputDept.Text,
        DatePickerResignation.SelectedDate,
        DatePickerLastDay.SelectedDate,
        TextInputReason.Text,
        varManagerName,
        varSignatureBase64,
        Text(Today(), "yyyy-mm-dd"),
        TextInputEmpEmail.Text
    )
);
Download(varResignationPDF.PDFFile)
```

---

## التدفق C: `GenerateLeavePDF`

### Tags قالب Word — الإجازة

| Tag | نوع الـ Control | وصف الحقل |
|---|---|---|
| `emp_name` | Plain Text | اسم الموظف |
| `emp_hrid` | Plain Text | الرقم الوظيفي |
| `emp_appointment` | Plain Text | تاريخ التعيين |
| `emp_dept` | Plain Text | القسم |
| `emp_jobtitle` | Plain Text | المسمى الوظيفي |
| `leave_type` | Plain Text | نوع الإجازة (سنوية / مرضية / طارئة …) |
| `last_work_day` | Plain Text | آخر يوم عمل قبل الإجازة |
| `start_date` | Plain Text | تاريخ بداية الإجازة |
| `end_date` | Plain Text | تاريخ نهاية الإجازة |
| `return_date` | Plain Text | تاريخ العودة للعمل |
| `phone` | Plain Text | رقم الهاتف أثناء الإجازة |
| `total_days` | Plain Text | إجمالي أيام الإجازة |
| `applicant_name` | Plain Text | اسم مقدّم الطلب (الموظف) |
| `applicant_sig` | **Picture** | توقيع مقدّم الطلب (base64) |
| `manager_name` | Plain Text | اسم المدير المعتمِد |
| `manager_sig` | **Picture** | توقيع المدير (base64) |
| `manager_date` | Plain Text | تاريخ الاعتماد |

> **ملاحظة:** نموذج الإجازة يحتوي على **توقيعَين**: `applicant_sig` للموظف و`manager_sig` للمدير — كلاهما من نوع **Picture Content Control**.

---

### خطوة 1: إنشاء التدفق

1. **My flows** ← **New flow** ← **Instant cloud flow**.
2. الاسم: `GenerateLeavePDF`.
3. الـ Trigger: **PowerApps (V2)**.

---

### خطوة 2: مدخلات الـ Trigger

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

---

### خطوة 3: تعبئة قالب Word (Populate a Microsoft Word template)

- **File:** `/Templates/LeaveTemplate.docx`
- ربط Tags:

| Tag | المدخل |
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
| `applicant_sig` **(Picture)** | `triggerBody()?['applicant_sig_base64']` |
| `manager_name` | `triggerBody()?['manager_name']` |
| `manager_sig` **(Picture)** | `triggerBody()?['manager_sig_base64']` |
| `manager_date` | `triggerBody()?['manager_date']` |

---

### الخطوات 4–7: نفس التدفق A مع تعديلات

**خطوة 4:** Convert to PDF — نفس الإجراء.

**خطوة 5:** Send email — استخدم قالب HTML أدناه.

**خطوة 6 (DownloadLog):**
- Title: `إجازة`
- FormType: `Leave`

**خطوة 7:** Respond to PowerApp — نفس الإجراء، المخرج: `PDFFile`.

---

#### قالب HTML لجسم إيميل الإجازة

```html
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
  <table width="600" cellpadding="0" cellspacing="0" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
    <tr>
      <td style="background-color: #0f172a; padding: 24px 32px; text-align: center;">
        <h1 style="color: #FBBF24; margin: 0; font-size: 22px; letter-spacing: 1px;">Collection Barq</h1>
        <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 13px;">طلب إجازة رسمي | Official Leave Request</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 28px 32px;">
        <p style="color: #0f172a; font-size: 15px; margin: 0 0 16px 0;">السادة المحترمون،</p>
        <p style="color: #374151; font-size: 14px; line-height: 1.8; margin: 0 0 20px 0;">
          مرفق طيّه طلب إجازة رسمي خاص بالموظف <strong style="color: #0f172a;">@{triggerBody()?['emp_name']}</strong>
          (الرقم الوظيفي: <strong>@{triggerBody()?['emp_hrid']}</strong>).
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 24px;">
          <tr style="background-color: #0f172a;">
            <th style="color: #FBBF24; padding: 10px 14px; text-align: right; font-size: 13px; border: 1px solid #1e293b;">البند</th>
            <th style="color: #FBBF24; padding: 10px 14px; text-align: right; font-size: 13px; border: 1px solid #1e293b;">التفاصيل</th>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #64748b;">اسم الموظف</td>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #0f172a; font-weight: 600;">@{triggerBody()?['emp_name']}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #64748b;">القسم</td>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #0f172a;">@{triggerBody()?['emp_dept']}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #64748b;">نوع الإجازة</td>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #0f172a; font-weight: 600;">@{triggerBody()?['leave_type']}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #64748b;">تاريخ البداية</td>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #0f172a;">@{triggerBody()?['start_date']}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #64748b;">تاريخ النهاية</td>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #0f172a;">@{triggerBody()?['end_date']}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #64748b;">تاريخ العودة</td>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #16a34a; font-weight: 600;">@{triggerBody()?['return_date']}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #64748b;">إجمالي الأيام</td>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #0f172a; font-weight: 600;">@{triggerBody()?['total_days']} يوم</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #64748b;">المدير المباشر</td>
            <td style="padding: 10px 14px; font-size: 13px; border: 1px solid #e2e8f0; color: #0f172a;">@{triggerBody()?['manager_name']}</td>
          </tr>
        </table>
        <p style="color: #374151; font-size: 13px; line-height: 1.7; margin: 0 0 8px 0;">
          النموذج مرفق بهذا الإيميل بصيغة PDF. يُرجى الاطلاع عليه واتخاذ الإجراءات المناسبة.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
          Dear Team,<br>
          Please find attached the official leave request for employee <strong>@{triggerBody()?['emp_name']}</strong>.
          Leave period: <strong>@{triggerBody()?['start_date']}</strong> to <strong>@{triggerBody()?['end_date']}</strong>
          (@{triggerBody()?['total_days']} days). Return date: <strong>@{triggerBody()?['return_date']}</strong>.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #0f172a; padding: 16px 32px; text-align: center;">
        <p style="color: #FBBF24; font-size: 12px; margin: 0;">Collection Barq — نظام إدارة الفريق الداخلي</p>
        <p style="color: #475569; font-size: 11px; margin: 4px 0 0 0;">هذا إيميل تلقائي — يُرجى عدم الرد عليه مباشرة</p>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

### ربط التدفق بـ Power Apps (الإجازة)

```powerfx
Set(
    varLeavePDF,
    GenerateLeavePDF.Run(
        TextInputEmpName.Text,
        TextInputEmpHRID.Text,
        TextInputAppointment.Text,
        TextInputDept.Text,
        TextInputJobTitle.Text,
        DropdownLeaveType.Selected.Value,
        DatePickerLastWork.SelectedDate,
        DatePickerStart.SelectedDate,
        DatePickerEnd.SelectedDate,
        DatePickerReturn.SelectedDate,
        TextInputPhone.Text,
        Text(DateDiff(DatePickerStart.SelectedDate, DatePickerEnd.SelectedDate, Days) + 1),
        TextInputApplicantName.Text,
        varApplicantSignatureBase64,  // توقيع الموظف من Pen Input
        varManagerName,
        varSignatureBase64,           // توقيع المدير من Pen Input
        Text(Today(), "yyyy-mm-dd"),
        TextInputEmpEmail.Text
    )
);
Download(varLeavePDF.PDFFile)
```

---

## التدفق D: `ImportFromExcel` (مرة واحدة فقط)

> **الغرض:** نقل بيانات الموظفين والليدرز من ملف Excel إلى قوائم SharePoint.  
> **يُنفَّذ مرة واحدة** عند الإعداد الأولي، ثم يُعطَّل أو يُحذف.

---

### تحذير مهم: تجاوز حد 256 صف

> **مشكلة:** الافتراضي في إجراء "List rows present in a table" هو إرجاع **256 صفاً** فقط.  
> لديك **279 موظفاً** في جدول `tblEmployees` — سيُقطع الاستيراد عند الصف 256 بدون هذا الإعداد.
>
> **الحل:** في بطاقة الإجراء، اضغط على **Settings** (الإعدادات) ← فعّل **Pagination** ← اضبط Threshold على **5000** (أو أي قيمة أكبر من 279).

---

### الجزء الأول: استيراد `tblLeaders` ← قائمة `Leaders`

**خطوة 1: إنشاء التدفق**
1. **My flows** ← **New flow** ← **Instant cloud flow**.
2. الاسم: `ImportFromExcel_Leaders`.
3. الـ Trigger: **Manually trigger a flow** (يدوي).

**خطوة 2: List rows present in a table**
1. ابحث عن: **Excel Online (Business)**.
2. اختر: **List rows present in a table**.
3. اعبّئ:
   - **Location:** OneDrive for Business
   - **Document Library:** OneDrive
   - **File:** `/BarqData.xlsx`
   - **Table:** `tblLeaders`
4. اضغط **Settings** ← فعّل **Pagination** ← اضبط Threshold: `5000`.

**خطوة 3: Apply to each (حلقة على كل صف)**
1. اضغط **+ New step** ← ابحث عن **Apply to each** واختره.
2. في حقل **Select an output from previous steps** اختر **value** من ناتج "List rows".
3. داخل الـ Loop أضف:
   - إجراء **SharePoint → Create item**:

| حقل SharePoint | القيمة من Excel |
|---|---|
| **Site Address** | رابط موقع SharePoint |
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

---

### الجزء الثاني: استيراد `tblEmployees` ← قائمة `Employees`

**خطوة 1: إنشاء تدفق جديد**
- الاسم: `ImportFromExcel_Employees`.
- الـ Trigger: **Manually trigger a flow**.

**خطوة 2: List rows present in a table**
- **File:** `/BarqData.xlsx`
- **Table:** `tblEmployees`
- **Settings → Pagination → Threshold: `5000`** ← **مهم جداً عشان ما تُقطع الـ 279 موظف**

**خطوة 3: Apply to each**
- داخل الـ Loop، إجراء **SharePoint → Create item**:

| حقل SharePoint | القيمة من Excel |
|---|---|
| **Site Address** | رابط موقع SharePoint |
| **List Name** | `Employees` |
| **Title** | `items('Apply_to_each')?['Name']` |
| **ManagerKey** | `items('Apply_to_each')?['ManagerKey']` |
| **ManagerEmail** | `items('Apply_to_each')?['ManagerEmail']` |
| **Name** | `items('Apply_to_each')?['Name']` |
| **HRID** | `items('Apply_to_each')?['HRID']` |
| **Email** | `items('Apply_to_each')?['Email']` |
| **JobTitle** | `items('Apply_to_each')?['Title']` |

> **ملاحظة:** عمود `Title` في Excel يقابل عمود `JobTitle` في SharePoint (لتفادي التعارض مع عمود Title الإجباري).

---

### نصائح عامة لتدفق الاستيراد

1. **شغّل Leaders أولاً** قبل Employees — لأن Employees تعتمد على مفاتيح Leaders.
2. **بعد الاستيراد:** تحقق من عدد الصفوف في قائمة Employees (يجب أن يكون 279).
3. **بعد الاستيراد:** أضف عمود Lookup اسمه `Manager` في قائمة Employees يشير لقائمة Leaders، وابطه بـ `ManagerKey`.
4. **عطّل أو احذف التدفق** بعد الاستيراد الناجح — لا تحتاجه مرة ثانية.

---

## ملخص: ترتيب الإعداد الكامل

```
1. أنشئ قوائم SharePoint (من 01-SharePoint-Lists-Schema.md)
2. شغّل ImportFromExcel_Leaders
3. شغّل ImportFromExcel_Employees
4. ارفع قوالب Word إلى OneDrive (Templates/)
5. أنشئ GenerateViolationPDF
6. أنشئ GenerateResignationPDF
7. أنشئ GenerateLeavePDF
8. أضف التدفقات الثلاثة إلى تطبيق Power Apps
9. اختبر كل تدفق من Power Apps
```

---

## مرجع سريع: أسماء القوائم والأعمدة المعتمدة

| القائمة | الأعمدة الرئيسية |
|---|---|
| `Leaders` | Title, Key, NameAr, NameEn, TitleAr, TitleEn, DeptAr, DeptEn, Email, Phone, Teams, ReportsTo |
| `Employees` | Title, ManagerKey, ManagerEmail, Name, HRID, Email, JobTitle |
| `DownloadLog` | Title, UserEmail, UserName, FormType, TargetEmployee, GeneratedAt |

---

*آخر تحديث: 2026-06-06*
