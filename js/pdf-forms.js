(function () {
  'use strict';

  // ─── تعريف النماذج ───────────────────────────────────────
  const FORMS = {
    '/pdfs/violation.pdf': {
      title: 'نموذج المخالفة',
      icon:  'fa-triangle-exclamation',
      fields: [
        { name: 'emp_name',   label: 'اسم الموظف',         type: 'text',     req: true  },
        { name: 'emp_id',     label: 'رقم الموظف',          type: 'text'                },
        { name: 'dept',       label: 'القسم',               type: 'text',     req: true  },
        { name: 'job_title',  label: 'المسمى الوظيفي',     type: 'text'                },
        { name: 'vio_date',   label: 'تاريخ المخالفة',     type: 'date',     req: true  },
        { name: 'vio_type',   label: 'نوع المخالفة',       type: 'select',
          opts: ['تأخر متكرر','غياب بدون إذن','مخالفة سياسة الشركة','سلوك غير لائق','أخرى'] },
        { name: 'vio_desc',   label: 'وصف المخالفة',       type: 'textarea', req: true  },
        { name: 'action',     label: 'الإجراء التأديبي',   type: 'textarea'            },
        { name: 'supervisor', label: 'المسؤول المباشر',    type: 'text'                },
      ]
    },
    '/pdfs/resignation.pdf': {
      title: 'نموذج الاستقالة',
      icon:  'fa-right-from-bracket',
      fields: [
        { name: 'emp_name',  label: 'اسم الموظف',       type: 'text', req: true },
        { name: 'emp_id',    label: 'رقم الموظف',        type: 'text'           },
        { name: 'dept',      label: 'القسم',              type: 'text', req: true },
        { name: 'job_title', label: 'المسمى الوظيفي',   type: 'text'           },
        { name: 'res_date',  label: 'تاريخ الاستقالة',  type: 'date', req: true },
        { name: 'last_day',  label: 'آخر يوم عمل',      type: 'date'           },
        { name: 'reason',    label: 'سبب الاستقالة',    type: 'textarea'       },
      ]
    },
    '/pdfs/leave-request.pdf': {
      title: 'نموذج طلب إجازة',
      icon:  'fa-calendar-days',
      fields: [
        { name: 'emp_name',   label: 'اسم الموظف',    type: 'text',   req: true },
        { name: 'emp_id',     label: 'رقم الموظف',     type: 'text'             },
        { name: 'dept',       label: 'القسم',           type: 'text',   req: true },
        { name: 'leave_type', label: 'نوع الإجازة',   type: 'select',
          opts: ['سنوية','مرضية','طارئة','دراسية','أخرى'] },
        { name: 'from_date',  label: 'من تاريخ',       type: 'date',   req: true },
        { name: 'to_date',    label: 'إلى تاريخ',      type: 'date',   req: true },
        { name: 'days',       label: 'عدد الأيام',     type: 'number'           },
        { name: 'notes',      label: 'ملاحظات',        type: 'textarea'         },
      ]
    }
  };

  const COORDS_KEY = 'barq_pdf_coords_v1';
  let _url  = '';
  let _data = {};

  // ─── تحميل / حفظ الإحداثيات ─────────────────────────────
  function loadCoords(url) {
    try { return JSON.parse(localStorage.getItem(COORDS_KEY) || '{}')[url] || {}; }
    catch { return {}; }
  }
  function saveCoords(url, coords) {
    const all = JSON.parse(localStorage.getItem(COORDS_KEY) || '{}');
    all[url] = coords;
    localStorage.setItem(COORDS_KEY, JSON.stringify(all));
  }

  // ─── فتح نموذج التعبئة ───────────────────────────────────
  function openForm(pdfUrl) {
    _url = pdfUrl;
    const def = FORMS[pdfUrl];
    if (!def) return;

    document.getElementById('pdfFormTitle').innerHTML =
      `<i class="fa-solid ${def.icon}" style="color:#FBBF24;margin-left:.5rem"></i>${def.title}`;

    document.getElementById('pdfFormFields').innerHTML = def.fields.map(f => {
      let ctrl = '';
      if (f.type === 'select') {
        ctrl = `<select class="pf-ctrl" name="${f.name}">${f.opts.map(o=>`<option>${o}</option>`).join('')}</select>`;
      } else if (f.type === 'textarea') {
        ctrl = `<textarea class="pf-ctrl" name="${f.name}" rows="3"></textarea>`;
      } else {
        ctrl = `<input class="pf-ctrl" type="${f.type||'text'}" name="${f.name}" ${f.req?'required':''} />`;
      }
      return `<div class="pf-row">
        <label class="pf-label">${f.label}${f.req?' <span style="color:#FBBF24">*</span>':''}</label>${ctrl}
      </div>`;
    }).join('');

    // احتساب أيام الإجازة
    if (pdfUrl.includes('leave')) {
      const fromEl = document.querySelector('[name="from_date"]');
      const toEl   = document.querySelector('[name="to_date"]');
      const daysEl = document.querySelector('[name="days"]');
      function calcDays() {
        if (fromEl.value && toEl.value) {
          const d = (new Date(toEl.value) - new Date(fromEl.value)) / 86400000;
          if (d >= 0) daysEl.value = d + 1;
        }
      }
      fromEl.addEventListener('change', calcDays);
      toEl.addEventListener('change', calcDays);
    }

    // زر تحديد المواضع
    let mapBtn = document.getElementById('pdfMapBtn');
    if (!mapBtn) {
      mapBtn = document.createElement('button');
      mapBtn.id   = 'pdfMapBtn';
      mapBtn.type = 'button';
      mapBtn.className = 'pf-submit-btn mt-2';
      mapBtn.style.background = '#27272a';
      mapBtn.style.color = '#a1a1aa';
      mapBtn.innerHTML = '<i class="fa-solid fa-crosshairs"></i> تحديد مواضع الحقول على النموذج';
      mapBtn.onclick = () => { collectData(); openMapper(); };
      document.getElementById('pdfFormEl').appendChild(mapBtn);
    }

    document.getElementById('pdfFormModal').classList.remove('hidden');
    document.querySelector('#pdfFormFields .pf-ctrl')?.focus();
  }

  // ─── جمع البيانات من النموذج ─────────────────────────────
  function collectData() {
    _data = {};
    document.querySelectorAll('#pdfFormFields [name]').forEach(el => { _data[el.name] = el.value; });
  }

  // ─── إرسال النموذج ───────────────────────────────────────
  async function submitForm(e) {
    e.preventDefault();
    collectData();
    document.getElementById('pdfFormModal').classList.add('hidden');

    const def    = FORMS[_url];
    const coords = loadCoords(_url);
    const hasCoords = Object.keys(coords).length > 0;

    if (hasCoords) {
      // الرسم على الـ PDF الأصلي
      await drawOnPdf(_url, def, _data, coords);
    } else {
      // لا توجد إحداثيات — اعرض نموذج HTML جاهز للطباعة
      _printHtml(def, _data);
    }
  }

  // ─── رسم النص على الـ PDF ────────────────────────────────
  async function drawOnPdf(pdfUrl, def, data, coords) {
    // 1. رسم الـ PDF على canvas باستخدام PDF.js
    const canvas = await _renderPdfPage(pdfUrl, 2);
    const ctx    = canvas.getContext('2d');
    const scale  = 2;

    ctx.font      = `bold ${13 * scale}px Tajawal, Arial`;
    ctx.fillStyle = '#1a1a1a';
    ctx.direction = 'rtl';
    ctx.textAlign = 'right';

    def.fields.forEach(f => {
      const pos = coords[f.name];
      const val = data[f.name];
      if (!pos || !val) return;
      // textarea: اكسر السطر
      if (f.type === 'textarea') {
        const lines = val.split('\n');
        lines.forEach((ln, i) => {
          ctx.fillText(ln, pos.x * scale, (pos.y + i * 18) * scale);
        });
      } else {
        ctx.fillText(val, pos.x * scale, pos.y * scale);
      }
    });

    // 2. حوّل canvas لـ PNG ثم لـ PDF
    const imgDataUrl = canvas.toDataURL('image/png');
    const imgBytes   = _dataUrlToBytes(imgDataUrl);
    const { PDFDocument } = PDFLib;
    const pdfDoc = await PDFDocument.create();
    const page   = pdfDoc.addPage([canvas.width / scale, canvas.height / scale]);
    const img    = await pdfDoc.embedPng(imgBytes);
    page.drawImage(img, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() });

    const bytes = await pdfDoc.save();
    _download(bytes, def.title + '.pdf');
  }

  // ─── مساعد: رسم صفحة الـ PDF ─────────────────────────────
  async function _renderPdfPage(url, scale) {
    const lib = window.pdfjsLib;
    lib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const pdfBytes = await fetch(url).then(r => r.arrayBuffer());
    const pdf      = await lib.getDocument({ data: pdfBytes }).promise;
    const page     = await pdf.getPage(1);
    const vp       = page.getViewport({ scale });
    const canvas   = document.createElement('canvas');
    canvas.width   = vp.width;
    canvas.height  = vp.height;
    await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
    return canvas;
  }

  function _dataUrlToBytes(dataUrl) {
    const base64 = dataUrl.split(',')[1];
    const bin    = atob(base64);
    const bytes  = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  function _download(bytes, filename) {
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' })),
      download: filename
    });
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 6000);
  }

  // ─── الـ Mapper: تحديد مواضع الحقول ─────────────────────
  let _mapCanvas    = null;
  let _mapCoords    = {};
  let _mapFieldIdx  = 0;
  let _mapDef       = null;
  let _mapScale     = 1.5;

  async function openMapper() {
    _mapDef    = FORMS[_url];
    _mapCoords = { ...loadCoords(_url) };
    _mapFieldIdx = 0;

    document.getElementById('pdfMapperModal').classList.remove('hidden');

    // ارسم الـ PDF
    const canvas    = await _renderPdfPage(_url, _mapScale);
    _mapCanvas      = canvas;
    const display   = document.getElementById('mapperCanvas');
    display.width   = canvas.width;
    display.height  = canvas.height;
    display.getContext('2d').drawImage(canvas, 0, 0);

    _buildMapperFields();
    _renderMapDots();
  }

  function _buildMapperFields() {
    const container = document.getElementById('mapperFields');
    container.innerHTML = _mapDef.fields.map((f, i) => {
      const hasPos = !!_mapCoords[f.name];
      return `<div id="mf_${i}" class="mapper-field-btn" data-i="${i}"
        style="padding:.55rem .75rem;border-radius:.6rem;border:1.5px solid ${hasPos?'#FBBF24':'#3f3f46'};
               background:${hasPos?'rgba(251,191,36,.1)':'#111'};color:${hasPos?'#FBBF24':'#a1a1aa'};
               font-size:.82rem;font-weight:600;cursor:pointer;font-family:inherit;text-align:right;
               transition:all .15s">
        ${hasPos?'<i class="fa-solid fa-check" style="margin-left:.35rem"></i>':''} ${f.label}
      </div>`;
    }).join('');

    // click → يحدد هذا الحقل كـ "نشط"
    container.querySelectorAll('.mapper-field-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        _mapFieldIdx = +btn.dataset.i;
        _buildMapperFields();
        const active = document.getElementById(`mf_${_mapFieldIdx}`);
        if (active) active.style.boxShadow = '0 0 0 2px #FBBF24';
      });
    });

    // تفعيل الأول غير المحدد
    const firstEmpty = _mapDef.fields.findIndex(f => !_mapCoords[f.name]);
    _mapFieldIdx = firstEmpty >= 0 ? firstEmpty : 0;
    const active = document.getElementById(`mf_${_mapFieldIdx}`);
    if (active) active.style.boxShadow = '0 0 0 2px #FBBF24';
  }

  function _renderMapDots() {
    const dots = document.getElementById('mapperDots');
    dots.innerHTML = '';
    _mapDef.fields.forEach(f => {
      const pos = _mapCoords[f.name];
      if (!pos) return;
      const dot = document.createElement('div');
      dot.style.cssText = `position:absolute;left:${pos.x * _mapScale - 5}px;top:${pos.y * _mapScale - 5}px;
        width:10px;height:10px;border-radius:50%;background:#FBBF24;
        box-shadow:0 0 0 3px rgba(251,191,36,.3);pointer-events:none`;
      const lbl = document.createElement('span');
      lbl.style.cssText = 'position:absolute;top:-18px;right:0;font-size:10px;color:#FBBF24;white-space:nowrap;font-weight:700;';
      lbl.textContent = f.label;
      dot.appendChild(lbl);
      dots.appendChild(dot);
    });
  }

  // ─── النقر على الـ canvas لتحديد موضع ───────────────────
  function _initMapperClick() {
    const display = document.getElementById('mapperCanvas');
    display.addEventListener('click', e => {
      const rect = display.getBoundingClientRect();
      // إحداثيات بالنسبة لصفحة الـ PDF (بدون scale)
      const x = Math.round((e.clientX - rect.left) / (_mapScale * (rect.width  / display.width)));
      const y = Math.round((e.clientY - rect.top)  / (_mapScale * (rect.height / display.height)));

      const field = _mapDef.fields[_mapFieldIdx];
      _mapCoords[field.name] = { x, y };

      // انتقل للحقل التالي تلقائياً
      if (_mapFieldIdx < _mapDef.fields.length - 1) _mapFieldIdx++;

      _buildMapperFields();
      _renderMapDots();
    });
  }

  // ─── طباعة HTML احتياطي ──────────────────────────────────
  function _printHtml(def, data) {
    const today = new Date().toLocaleDateString('ar-SA-u-nu-latn', { year:'numeric', month:'long', day:'numeric' });
    const fieldsHtml = def.fields.map(f => {
      const val = data[f.name] || '';
      const full = f.type === 'textarea';
      return `<div class="field-box${full?' full':''}">
        <div class="field-label">${f.label}</div>
        <div class="field-value">${val||'&nbsp;'}</div>
      </div>`;
    }).join('');

    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><title>${def.title}</title>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Tajawal',sans-serif;background:#fff;color:#111;direction:rtl}
  .page{max-width:794px;margin:0 auto;padding:36px 44px;min-height:1123px;display:flex;flex-direction:column;gap:24px}
  .hdr{display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #000;padding-bottom:14px}
  .hdr-title{font-size:22px;font-weight:800;color:#000}
  .hdr-sub{font-size:12px;color:#555;margin-top:4px}
  .hdr-logo{font-size:13px;font-weight:700;color:#555;text-align:left;direction:ltr}
  .badge{display:inline-block;background:#000;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:4px;margin-top:6px;direction:ltr}
  .meta{display:flex;gap:12px;background:#f8f8f8;border:1px solid #e0e0e0;border-radius:8px;padding:10px 16px}
  .meta-item{flex:1;display:flex;flex-direction:column;gap:2px}
  .meta-key{font-size:11px;color:#777;font-weight:600}
  .meta-val{font-size:13px;font-weight:700;color:#111}
  .fields{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .field-box{border:1.5px solid #d0d0d0;border-radius:7px;padding:10px 14px;background:#fafafa;display:flex;flex-direction:column;gap:5px}
  .field-box.full{grid-column:1/-1}
  .field-label{font-size:11px;font-weight:700;color:#777}
  .field-value{font-size:14px;font-weight:500;color:#111;min-height:22px;border-bottom:1.5px solid #333;padding-bottom:3px}
  .sec{font-size:13px;font-weight:800;color:#fff;background:#000;padding:5px 14px;border-radius:5px}
  .sigs{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:auto;padding-top:20px;border-top:2px solid #eee}
  .sig{text-align:center}
  .sig-line{border-top:1.5px solid #333;margin:44px auto 8px;width:120px}
  .sig-name{font-size:12px;font-weight:700;color:#333}
  @media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}.no-print{display:none}}
  .print-btn{display:block;margin:0 auto;padding:10px 32px;background:#000;color:#fff;font-family:'Tajawal',sans-serif;font-size:15px;font-weight:700;border:none;border-radius:8px;cursor:pointer}
</style></head>
<body>
<div class="page">
  <div class="hdr">
    <div><div class="hdr-title">${def.title}</div><div class="hdr-sub">نموذج رسمي — للاستخدام الداخلي فقط</div></div>
    <div class="hdr-logo">Collection Barq<div class="badge">INTERNAL</div></div>
  </div>
  <div class="meta">
    <div class="meta-item"><div class="meta-key">تاريخ التعبئة</div><div class="meta-val">${today}</div></div>
    <div class="meta-item"><div class="meta-key">نوع النموذج</div><div class="meta-val">${def.title}</div></div>
    <div class="meta-item"><div class="meta-key">الحالة</div><div class="meta-val">بانتظار الموافقة</div></div>
  </div>
  <div class="sec">بيانات النموذج</div>
  <div class="fields">${fieldsHtml}</div>
  <div class="sigs">
    <div class="sig"><div class="sig-line"></div><div class="sig-name">توقيع الموظف</div></div>
    <div class="sig"><div class="sig-line"></div><div class="sig-name">المسؤول المباشر</div></div>
    <div class="sig"><div class="sig-line"></div><div class="sig-name">الموارد البشرية</div></div>
  </div>
</div>
<br><div class="no-print" style="text-align:center;padding-bottom:24px">
  <button class="print-btn" onclick="window.print()">طباعة / حفظ PDF</button>
</div>
<script>setTimeout(()=>window.print(),700);<\/script>
</body></html>`);
    win.document.close();
  }

  // ─── ربط الأحداث ─────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('pdfFormEl').addEventListener('submit', submitForm);

    document.getElementById('pdfFormClose').addEventListener('click', () =>
      document.getElementById('pdfFormModal').classList.add('hidden'));
    document.getElementById('pdfFormModal').addEventListener('click', e => {
      if (e.target.id === 'pdfFormModal') document.getElementById('pdfFormModal').classList.add('hidden');
    });

    document.getElementById('pdfMapperClose').addEventListener('click', () =>
      document.getElementById('pdfMapperModal').classList.add('hidden'));

    document.getElementById('mapperSave').addEventListener('click', () => {
      saveCoords(_url, _mapCoords);
      document.getElementById('pdfMapperModal').classList.add('hidden');
      // أعد فتح النموذج
      openForm(_url);
      // اعادة تعبئة البيانات
      setTimeout(() => {
        Object.entries(_data).forEach(([k, v]) => {
          const el = document.querySelector(`#pdfFormFields [name="${k}"]`);
          if (el) el.value = v;
        });
      }, 300);
    });

    _initMapperClick();
  });

  window.openPdfForm = openForm;
})();
