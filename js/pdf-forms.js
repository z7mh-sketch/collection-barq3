// ======================== Violation Form ========================

// ── تحكم: true = يلصق البيانات في الـ PDF الحقيقي، false = يطبع فورم HTML ──
const VF_PDF_FILL = true;

const VF_PDF_URL     = 'pdfs/violation.pdf';
const VF_COORDS_KEY  = 'barq_vf_coords_v6'; // v5 = direct canvas px + live preview
const VF_FILL_SCALE  = 2.5; // render scale for fill (higher = sharper text)

// ── حقول الفورم وترتيبها للإلصاق ──
const VF_FIELDS = [
  'vf_date', 'vf_emp_name', 'vf_job_title', 'vf_hrid',
  'vf_late_date', 'vf_early_date', 'vf_early_dur',
  'vf_absent_days', 'vf_absent_date', 'vf_consequence'
];

// ── حقول علامات الصح للمخالفات المختارة ──
const VF_CHECK_FIELDS = ['chk_late', 'chk_early', 'chk_absent', 'chk_other'];

// ── إحداثيات افتراضية (canvas 1530×1980 عند VF_FILL_SCALE=2.5) ──
// مستخرجة من نموذج المخالفة الأصلي عبر تحليل حقول الـ PDF
const VF_DEFAULT_COORDS = {
  vf_date:        { canvasX: 669,  canvasY: 448 },
  vf_emp_name:    { canvasX: 767,  canvasY: 489 },
  vf_job_title:   { canvasX: 714,  canvasY: 523 },
  vf_hrid:        { canvasX: 714,  canvasY: 563 },
  vf_late_date:   { canvasX: 1010, canvasY: 704 },
  vf_early_date:  { canvasX: 1010, canvasY: 738 },
  vf_early_dur:   { canvasX: 660,  canvasY: 744 },
  vf_absent_days: { canvasX: 900,  canvasY: 773 },
  vf_absent_date: { canvasX: 1010, canvasY: 770 },
  vf_consequence: { canvasX: 635,  canvasY: 897 },
  vf_signature:   { canvasX: 860,  canvasY: 1006 },
  chk_late:       { canvasX: 1230, canvasY: 698 },
  chk_early:      { canvasX: 1230, canvasY: 736 },
  chk_absent:     { canvasX: 1230, canvasY: 770 },
  chk_other:      { canvasX: 1230, canvasY: 808 },
};

const VF = {
  ar: {
    title:       'نموذج مخالفة موظف',
    date:        'تاريخ المخالفة',
    empName:     'اسم الموظف',
    jobTitle:    'المسمى الوظيفي',
    hrid:        'الرقم الوظيفي',
    vType:       'نوع المخالفة',
    late:        'مخالفة التأخير في الحضور لمقر العمل بتاريخ:',
    earlyLeave:  'مخالفة مغادرة مقر العمل بتاريخ:',
    forDur:      'ولمدة',
    minutes:     'دقيقة',
    hour:        'ساعة',
    absence:     'مخالفة الغياب عن العمل ولمدة',
    days:        'يوم بتاريخ:',
    other:       'أخرى:',
    consequence: 'وقد ترتب على ذلك',
    sig:         'توقيع المشرف / المدير المباشر',
    draw:        'رسم',
    type:        'كتابة',
    clear:       'مسح',
    print:       'طباعة / تحميل',
    cancel:      'إلغاء',
    sigPH:       'اكتب اسمك هنا...',
    setCoords:   'تحديد مواضع الحقول على النموذج',
    fieldLabels: {
      vf_date:        'تاريخ المخالفة',
      vf_emp_name:    'اسم الموظف',
      vf_job_title:   'المسمى الوظيفي',
      vf_hrid:        'الرقم الوظيفي',
      vf_late_date:   'تاريخ التأخير',
      vf_early_date:  'تاريخ المغادرة',
      vf_early_dur:   'مدة المغادرة',
      vf_absent_days: 'عدد أيام الغياب',
      vf_absent_date: 'تاريخ الغياب',
      vf_consequence: 'وقد ترتب على ذلك',
      chk_late:       'صح: التأخير',
      chk_early:      'صح: المغادرة',
      chk_absent:     'صح: الغياب',
      chk_other:      'صح: أخرى',
    }
  },
  en: {
    title:       'Employee Violation Form',
    date:        'Violation Date',
    empName:     'Employee Name',
    jobTitle:    'Job Title',
    hrid:        'HRID',
    vType:       'Violation Type',
    late:        'Late attendance to workplace on:',
    earlyLeave:  'Early departure from workplace on:',
    forDur:      'for',
    minutes:     'minutes',
    hour:        'hour(s)',
    absence:     'Absence from work for',
    days:        'day(s) on:',
    other:       'Other:',
    consequence: 'Accordingly',
    sig:         'Supervisor / Direct Manager Signature',
    draw:        'Draw',
    type:        'Type',
    clear:       'Clear',
    print:       'Print / Download',
    cancel:      'Cancel',
    sigPH:       'Type your name here...',
    setCoords:   'Set field positions on the form',
    fieldLabels: {
      vf_date:        'Violation Date',
      vf_emp_name:    'Employee Name',
      vf_job_title:   'Job Title',
      vf_hrid:        'HRID',
      vf_late_date:   'Late Date',
      vf_early_date:  'Early Leave Date',
      vf_early_dur:   'Duration',
      vf_absent_days: 'Absence Days',
      vf_absent_date: 'Absence Date',
      vf_consequence: 'Accordingly',
      chk_late:       'Tick: Late',
      chk_early:      'Tick: Early',
      chk_absent:     'Tick: Absent',
      chk_other:      'Tick: Other',
    }
  }
};

function _vfLang() { return (typeof currentLang !== 'undefined') ? currentLang : 'ar'; }
function _vfL(k)   { return VF[_vfLang()]?.[k] || VF.ar[k] || k; }
function _vfFmtDate(v) {
  if (!v || !v.includes('-')) return v;
  const [y, m, d] = v.split('-');
  return d ? `${d}/${m}/${y}` : v;
}
function _vfFmtDateShort(v) {
  if (!v || !v.includes('-')) return v;
  const [, m, d] = v.split('-');
  return d ? `${d} ${m}` : v;
}

let _vfSigMode = 'draw';
let _vfDrawing = false;
let _vfLX = 0, _vfLY = 0;

// ─────────────────────────────────────────────
//  فتح / إغلاق الفورم
// ─────────────────────────────────────────────
function openViolationForm() {
  _vfApplyLabels();
  _vfPopulateDM();
  _vfBindChkHighlight();
  const today = new Date();
  document.getElementById('vfDate').value = today.toISOString().split('T')[0];
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  ['vfLat', 'vfEarly', 'vfAbsent'].forEach(p => {
    const dSel = document.getElementById(p + 'Day');
    const mSel = document.getElementById(p + 'Month');
    if (dSel) dSel.value = dd;
    if (mSel) mSel.value = mm;
  });
  // reset checked state highlight
  document.querySelectorAll('.vf-vrow').forEach(r => r.classList.remove('is-checked'));
  // زر مواضع الحقول — يظهر فقط إذا VF_PDF_FILL مفعّل
  const coordBtn = document.getElementById('vfCoordBtn');
  if (coordBtn) coordBtn.style.display = VF_PDF_FILL ? 'inline-flex' : 'none';

  document.getElementById('violationFormModal').classList.remove('hidden');
  _vfInitCanvas();
}

// Populate day (01-31) and month (01-12) selects
function _vfPopulateDM() {
  const fill = (sel, n) => {
    if (!sel || sel.options.length) return;
    for (let i = 1; i <= n; i++) {
      const o = document.createElement('option');
      o.value = String(i).padStart(2, '0');
      o.textContent = String(i).padStart(2, '0');
      sel.appendChild(o);
    }
  };
  ['vfLatDay', 'vfEarlyDay', 'vfAbsentDay'].forEach(id => fill(document.getElementById(id), 31));
  ['vfLatMonth', 'vfEarlyMonth', 'vfAbsentMonth'].forEach(id => fill(document.getElementById(id), 12));
}

// Highlight row when its checkbox is checked
function _vfBindChkHighlight() {
  ['vfChkLate', 'vfChkEarly', 'vfChkAbsent', 'vfChkOther'].forEach(id => {
    const chk = document.getElementById(id);
    if (!chk || chk._vfBound) return;
    chk._vfBound = true;
    const row = chk.closest('.vf-vrow');
    chk.addEventListener('change', () => {
      if (row) row.classList.toggle('is-checked', chk.checked);
    });
  });
}

function closeViolationForm() {
  document.getElementById('violationFormModal').classList.add('hidden');
}

// ─────────────────────────────────────────────
//  تحديث النصوص حسب اللغة
// ─────────────────────────────────────────────
function _vfApplyLabels() {
  const isAr = _vfLang() === 'ar';
  document.getElementById('vfFormBody').setAttribute('dir', isAr ? 'rtl' : 'ltr');

  const s = (id, k) => { const el = document.getElementById(id); if (el) el.textContent = _vfL(k); };
  const p = (id, k) => { const el = document.getElementById(id); if (el) el.placeholder = _vfL(k); };

  s('vfModalTitle',    'title');
  s('vfLblDate',       'date');
  s('vfLblEmpName',    'empName');
  s('vfLblJobTitle',   'jobTitle');
  s('vfLblHRID',       'hrid');
  s('vfLblVType',      'vType');
  s('vfLblLate',       'late');
  s('vfLblEarlyLeave', 'earlyLeave');
  s('vfLblForDuration','forDur');
  s('vfOptMinutes',    'minutes');
  s('vfOptHour',       'hour');
  s('vfLblAbsence',    'absence');
  s('vfLblDays',       'days');
  s('vfLblOther',      'other');
  s('vfLblConsequence','consequence');
  s('vfLblSig',        'sig');
  s('vfBtnDrawLbl',    'draw');
  s('vfBtnTypeLbl',    'type');
  s('vfBtnClearLbl',   'clear');
  s('vfBtnCancel',     'cancel');
  s('vfBtnPrintLbl',   'print');
  p('vfSigText',       'sigPH');
}

// ─────────────────────────────────────────────
//  لوحة التوقيع
// ─────────────────────────────────────────────
function _vfInitCanvas() {
  const orig = document.getElementById('vfSigCanvas');
  const c = orig.cloneNode(true);
  orig.parentNode.replaceChild(c, orig);
  const ctx = c.getContext('2d');
  ctx.strokeStyle = '#111'; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';

  function pos(e) {
    const r = c.getBoundingClientRect();
    const sx = c.width / r.width, sy = c.height / r.height;
    const src = e.touches ? e.touches[0] : e;
    return { x: (src.clientX - r.left) * sx, y: (src.clientY - r.top) * sy };
  }
  function start(e) { _vfDrawing = true; const p = pos(e); _vfLX = p.x; _vfLY = p.y; }
  function move(e) {
    if (!_vfDrawing) return;
    if (e.cancelable) e.preventDefault();
    const p = pos(e);
    ctx.beginPath(); ctx.moveTo(_vfLX, _vfLY); ctx.lineTo(p.x, p.y); ctx.stroke();
    _vfLX = p.x; _vfLY = p.y;
  }
  function stop() { _vfDrawing = false; }

  c.addEventListener('mousedown',  start);
  c.addEventListener('mousemove',  move);
  c.addEventListener('mouseup',    stop);
  c.addEventListener('mouseleave', stop);
  c.addEventListener('touchstart', start, { passive: true });
  c.addEventListener('touchmove',  move,  { passive: false });
  c.addEventListener('touchend',   stop);
}

function vfSetSigMode(mode) {
  _vfSigMode = mode;
  const canvas = document.getElementById('vfSigCanvas');
  const input  = document.getElementById('vfSigText');
  const dBtn   = document.getElementById('vfBtnDraw');
  const tBtn   = document.getElementById('vfBtnType');
  if (mode === 'draw') {
    canvas.style.display = 'block'; input.style.display = 'none';
    dBtn.style.borderColor = '#FBBF24'; tBtn.style.borderColor = '';
  } else {
    canvas.style.display = 'none'; input.style.display = 'block';
    tBtn.style.borderColor = '#FBBF24'; dBtn.style.borderColor = '';
  }
}

function vfClearSig() {
  const c = document.getElementById('vfSigCanvas');
  c.getContext('2d').clearRect(0, 0, c.width, c.height);
  document.getElementById('vfSigText').value = '';
}

function _vfSigUrl() {
  if (_vfSigMode === 'type') {
    const name = document.getElementById('vfSigText').value.trim();
    if (!name) return null;
    const c = document.createElement('canvas'); c.width = 500; c.height = 110;
    const ctx = c.getContext('2d');
    ctx.font = 'italic 38px Georgia, serif';
    ctx.fillStyle = '#111'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(name, 250, 55);
    return c.toDataURL();
  }
  const c = document.getElementById('vfSigCanvas');
  const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
  if (!Array.from(d).some(v => v !== 0)) return null;
  return c.toDataURL();
}

// ─────────────────────────────────────────────
//  جمع بيانات الفورم
// ─────────────────────────────────────────────
function _vfCollectData() {
  const g = id => document.getElementById(id);
  const v = id => g(id).value;
  const dm = (dId, mId) => {
    const d = g(dId)?.value, m = g(mId)?.value;
    return (d && m) ? `${d} ${m}` : '';
  };
  return {
    vf_date:        v('vfDate'),
    vf_emp_name:    v('vfEmpName'),
    vf_job_title:   v('vfJobTitle'),
    vf_hrid:        v('vfHRID'),
    chk_late:       g('vfChkLate').checked,
    vf_late_date:   dm('vfLatDay', 'vfLatMonth'),
    chk_early:      g('vfChkEarly').checked,
    vf_early_date:  dm('vfEarlyDay', 'vfEarlyMonth'),
    vf_early_dur:   v('vfEarlyDur'),
    chk_absent:     g('vfChkAbsent').checked,
    vf_absent_days: v('vfAbsentDays'),
    vf_absent_date: dm('vfAbsentDay', 'vfAbsentMonth'),
    chk_other:      g('vfChkOther').checked,
    vf_other_text:  '',
    vf_consequence: v('vfConsequence'),
  };
}

// ─────────────────────────────────────────────
//  الإخراج: طباعة HTML (مفعّل الحين)
// ─────────────────────────────────────────────
function _vfPrintHtml(data) {
  const lang = _vfLang();
  const L    = VF[lang];
  const isAr = lang === 'ar';

  const rows = [];
  if (data.chk_late)
    rows.push(`&#9745; ${L.late} ${data.vf_late_date}`);
  if (data.chk_early)
    rows.push(`&#9745; ${L.earlyLeave} ${data.vf_early_date} &mdash; ${L.forDur} ${data.vf_early_dur}`);
  if (data.chk_absent)
    rows.push(`&#9745; ${L.absence} ${data.vf_absent_days||'&mdash;'} ${L.days} ${data.vf_absent_date}`);
  if (data.chk_other)
    rows.push(`&#9745; ${L.other}`);

  const violHtml = rows.length
    ? rows.map(r => `<div class="vi">${r}</div>`).join('')
    : `<div class="vi muted">${isAr ? '(لم يتم تحديد نوع)' : '(none selected)'}</div>`;

  const sigUrl  = _vfSigUrl();
  const sigHtml = sigUrl
    ? `<img src="${sigUrl}" style="max-width:260px;max-height:90px;border:1px solid #ccc;border-radius:4px;display:block">`
    : `<div style="border-bottom:2px solid #000;width:260px;height:70px"></div>`;

  const html = `<!DOCTYPE html>
<html dir="${isAr?'rtl':'ltr'}" lang="${lang}">
<head><meta charset="UTF-8"><title>${L.title}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Tahoma,Arial,sans-serif;color:#111;padding:36px;font-size:13px}
h1{font-size:18px;font-weight:700;text-align:center;margin-bottom:20px;border-bottom:2.5px solid #000;padding-bottom:10px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:10px 28px;margin-bottom:18px}
.fld label{font-size:11px;color:#666;display:block;margin-bottom:3px}
.fld .val{border-bottom:1px solid #999;padding:3px 2px;min-height:24px;font-weight:600}
.sec{font-weight:700;font-size:12px;margin:16px 0 7px;border-bottom:1px solid #ddd;padding-bottom:3px}
.vi{padding:5px 3px;font-size:13px;line-height:1.6}
.muted{color:#aaa}
.csq-val{border:1px solid #aaa;border-radius:4px;padding:8px;min-height:55px;white-space:pre-wrap}
.sig-wrap{margin-top:28px}
.sig-lbl{font-size:11px;color:#666;margin-bottom:6px}
@media print{body{padding:18px}}
</style></head>
<body>
<h1>${L.title}</h1>
<div class="g2">
  <div class="fld"><label>${L.date}</label><div class="val">${data.vf_date||'&mdash;'}</div></div>
  <div class="fld"><label>${L.empName}</label><div class="val">${data.vf_emp_name||'&mdash;'}</div></div>
  <div class="fld"><label>${L.jobTitle}</label><div class="val">${data.vf_job_title||'&mdash;'}</div></div>
  <div class="fld"><label>${L.hrid}</label><div class="val">${data.vf_hrid||'&mdash;'}</div></div>
</div>
<div class="sec">${L.vType}</div>
${violHtml}
<div class="sec">${L.consequence}</div>
<div class="csq-val">${data.vf_consequence||''}</div>
<div class="sig-wrap"><div class="sig-lbl">${L.sig}:</div>${sigHtml}</div>
</body></html>`;

  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none';
  document.body.appendChild(iframe);
  iframe.contentDocument.open();
  iframe.contentDocument.write(html);
  iframe.contentDocument.close();
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => document.body.removeChild(iframe), 1500);
    // فتح مودال الإيميل تلقائياً بعد الطباعة
    setTimeout(() => vfOpenEmailModal(), 900);
  };
}

// ─────────────────────────────────────────────
//  الإخراج: إلصاق في الـ PDF الحقيقي (مطفي الحين — VF_PDF_FILL = false)
//  لتفعيله: 1) حدد مواضع الحقول عبر زر "تحديد مواضع الحقول"
//           2) غيّر VF_PDF_FILL إلى true في أعلى هذا الملف
// ─────────────────────────────────────────────
async function _vfFillPdf(data) {
  const coords = _vfLoadCoords() || VF_DEFAULT_COORDS;

  try {
    // رسم الـ PDF على canvas
    const pdfBytes = await fetch(VF_PDF_URL).then(r => r.arrayBuffer());
    const pdf  = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
    const page = await pdf.getPage(1);
    const vp   = page.getViewport({ scale: VF_FILL_SCALE });
    const canvas = document.createElement('canvas');
    canvas.width  = vp.width;
    canvas.height = vp.height;
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport: vp }).promise;

    // كتابة النصوص — المرساة = مركز النقطة أفقياً + وسط ارتفاع السطر عمودياً
    const fontSize = Math.round(vp.height * 0.012);
    ctx.font = `${fontSize}px Tahoma, Arial, sans-serif`;
    ctx.fillStyle = '#000';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    const FULL_DATE  = new Set(['vf_date']);
    const SHORT_DATE = new Set(['vf_late_date','vf_early_date','vf_absent_date']);
    // Map violation-specific fields to their checkbox; skip writing if unchecked.
    const CHK_GATE = {
      vf_late_date:   'chk_late',
      vf_early_date:  'chk_early',
      vf_early_dur:   'chk_early',
      vf_absent_days: 'chk_absent',
      vf_absent_date: 'chk_absent',
    };
    VF_FIELDS.forEach(field => {
      const gate = CHK_GATE[field];
      if (gate && !data[gate]) return;
      const pos = coords[field];
      if (!pos || !data[field]) return;
      const px = pos.canvasX !== undefined ? pos.canvasX : (pos.xPct !== undefined ? pos.xPct * vp.width  : pos.x);
      const py = pos.canvasY !== undefined ? pos.canvasY : (pos.yPct !== undefined ? pos.yPct * vp.height : pos.y);
      const val = FULL_DATE.has(field)  ? _vfFmtDate(String(data[field]))
                : SHORT_DATE.has(field) ? _vfFmtDateShort(String(data[field]))
                : String(data[field]);
      ctx.fillText(val, px, py);
    });

    // ── علامات الصح (✓) لكل مخالفة مختارة ──
    const tickSize = Math.round(vp.height * 0.022);
    ctx.font = `bold ${tickSize}px Tahoma, Arial, sans-serif`;
    VF_CHECK_FIELDS.forEach(name => {
      if (!data[name]) return;
      const pos = coords[name];
      if (!pos) return;
      const px = pos.canvasX !== undefined ? pos.canvasX : (pos.xPct !== undefined ? pos.xPct * vp.width  : pos.x);
      const py = pos.canvasY !== undefined ? pos.canvasY : (pos.yPct !== undefined ? pos.yPct * vp.height : pos.y);
      ctx.fillText('✓', px, py);
    });
    ctx.font = `${fontSize}px Tahoma, Arial, sans-serif`;

    // التوقيع
    const sigUrl = _vfSigUrl();
    if (sigUrl && coords['vf_signature']) {
      const sp   = coords['vf_signature'];
      const sx   = sp.canvasX !== undefined ? sp.canvasX : (sp.xPct !== undefined ? sp.xPct * vp.width  : sp.x);
      const sy   = sp.canvasY !== undefined ? sp.canvasY : (sp.yPct !== undefined ? sp.yPct * vp.height : sp.y);
      const img  = await new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = sigUrl; });
      const sigW = vp.width * 0.12, sigH = sigW * 0.3;
      ctx.drawImage(img, sx - sigW / 2, sy - sigH / 2, sigW, sigH);
    }

    // تحويل canvas → PDF وتحميله
    const { PDFDocument } = PDFLib;
    const newPdf  = await PDFDocument.create();
    const imgData = canvas.toDataURL('image/png');
    const pngImg  = await newPdf.embedPng(imgData);
    const newPage = newPdf.addPage([vp.width / 2, vp.height / 2]);
    newPage.drawImage(pngImg, { x: 0, y: 0, width: vp.width / 2, height: vp.height / 2 });
    const bytes = await newPdf.save();

    const blob = new Blob([bytes], { type: 'application/pdf' });
    // حفظ الـ blob عالمياً عشان نرفقه في الإيميل
    window._vfPdfBlob = blob;

    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'violation-filled.pdf'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 3000);

    // ── فتح مودال الإيميل تلقائياً بعد تحميل الـ PDF ──
    setTimeout(() => vfOpenEmailModal(), 800);

  } catch (err) {
    console.error('PDF fill error:', err);
    alert('تعذّر تحميل النموذج، تحقق من الاتصال وحاول مجدداً.');
  }
}

// ─────────────────────────────────────────────
//  تخزين / تحميل مواضع الحقول
// ─────────────────────────────────────────────
function _vfSaveCoords(coords) {
  try { localStorage.setItem(VF_COORDS_KEY, JSON.stringify(coords)); } catch(_) {}
}
function _vfLoadCoords() {
  try { return JSON.parse(localStorage.getItem(VF_COORDS_KEY) || 'null'); } catch(_) { return null; }
}

// ─────────────────────────────────────────────
//  محدد مواضع الحقول (يُفتح بزر "تحديد مواضع")
// ─────────────────────────────────────────────
let _vfMapField = null;
let _vfMapCoords = {};

function openVfCoordMapper() {
  _vfMapCoords = _vfLoadCoords() || { ...VF_DEFAULT_COORDS };
  // Pre-fill defaults for keys that may be missing in saved coords (after schema additions)
  Object.keys(VF_DEFAULT_COORDS).forEach(k => {
    if (!_vfMapCoords[k]) _vfMapCoords[k] = { ...VF_DEFAULT_COORDS[k] };
  });
  _vfMapField  = null;
  const modal  = document.getElementById('vfMapperModal');
  if (!modal) { _vfBuildMapperModal(); }
  document.getElementById('vfMapperModal').classList.remove('hidden');
  _vfRenderMapperPdf();
}

// Arrow-key nudging for fine calibration. Active only while mapper modal is open.
function _vfMapKeyDown(e) {
  const modal = document.getElementById('vfMapperModal');
  if (!modal || modal.classList.contains('hidden') || !_vfMapField) return;
  const step = e.shiftKey ? 25 : (e.ctrlKey ? 1 : 5);
  if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) return;
  e.preventDefault();
  const c = _vfMapCoords[_vfMapField] = _vfMapCoords[_vfMapField] || { canvasX: 0, canvasY: 0 };
  if (c.canvasX === undefined) c.canvasX = (c.xPct || 0) * 1530;
  if (c.canvasY === undefined) c.canvasY = (c.yPct || 0) * 1980;
  switch (e.key) {
    case 'ArrowLeft':  c.canvasX -= step; break;
    case 'ArrowRight': c.canvasX += step; break;
    case 'ArrowUp':    c.canvasY -= step; break;
    case 'ArrowDown':  c.canvasY += step; break;
  }
  _vfRedrawMapperCanvas();
  _vfUpdateMapStatus();
}

function _vfUpdateMapStatus() {
  const bar = document.getElementById('vfMapStatus');
  if (!bar) return;
  if (!_vfMapField) { bar.textContent = 'اختر حقلاً ثم انقر على النموذج، أو استخدم الأسهم ← ↑ → ↓ لضبط دقيق (Shift = قفزة 25px, Ctrl = 1px)'; return; }
  const c = _vfMapCoords[_vfMapField] || {};
  const x = Math.round(c.canvasX || 0), y = Math.round(c.canvasY || 0);
  const labels = VF[_vfLang()].fieldLabels;
  bar.textContent = `الحقل: ${labels[_vfMapField] || _vfMapField}   |   X: ${x}   Y: ${y}   |   الأسهم تضبط (Shift = 25px, Ctrl = 1px)`;
}

function _vfBuildMapperModal() {
  const div = document.createElement('div');
  div.id = 'vfMapperModal';
  div.className = 'hidden fixed inset-0 z-[60] flex items-center justify-center p-4';
  div.style.background = 'rgba(0,0,0,.85)';
  div.innerHTML = `
    <div class="modal-box w-full max-w-4xl max-h-[92vh] overflow-y-auto">
      <div class="modal-header">
        <h4 class="modal-title">تحديد مواضع الحقول على النموذج</h4>
        <button onclick="document.getElementById('vfMapperModal').classList.add('hidden')" class="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="p-4">
        <div id="vfMapStatus" style="font-size:.82rem;color:#FBBF24;margin-bottom:.5rem;padding:.45rem .6rem;background:rgba(251,191,36,.08);border-radius:.4rem;border:1px solid rgba(251,191,36,.3)">اختر حقلاً ثم انقر على النموذج، أو استخدم الأسهم ← ↑ → ↓ لضبط دقيق (Shift = قفزة 25px, Ctrl = 1px)</div>
        <div id="vfMapFieldBtns" style="display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.75rem"></div>
        <div style="position:relative;display:inline-block;width:100%">
          <canvas id="vfMapCanvas" tabindex="0" style="width:100%;border:1.5px solid #3f3f46;border-radius:.5rem;cursor:crosshair;display:block;outline:none"></canvas>
          <div id="vfMapDots" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none"></div>
        </div>
        <div style="display:flex;gap:.5rem;justify-content:flex-end;margin-top:.75rem">
          <button onclick="_vfMapCoords={...VF_DEFAULT_COORDS};_vfRedrawMapperCanvas();_vfUpdateMapStatus()" class="contact-btn"><i class="fa-solid fa-rotate-left"></i> الإحداثيات الافتراضية</button>
          <button onclick="_vfSaveCoords(_vfMapCoords);document.getElementById('vfMapperModal').classList.add('hidden')" class="escalation-btn"><i class="fa-solid fa-floppy-disk"></i> حفظ</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(div);

  // زر التوقيع
  const allFields = [...VF_FIELDS, 'vf_signature', ...VF_CHECK_FIELDS];
  const labels = VF[_vfLang()].fieldLabels;
  const btns = document.getElementById('vfMapFieldBtns');
  allFields.forEach(f => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'contact-btn';
    b.dataset.field = f;
    b.textContent = labels[f] || f;
    b.onclick = () => {
      _vfMapField = f;
      btns.querySelectorAll('.contact-btn').forEach(x => x.style.borderColor = '');
      b.style.borderColor = '#FBBF24';
      _vfUpdateMapStatus();
      const cv = document.getElementById('vfMapCanvas');
      if (cv) cv.focus();
    };
    btns.appendChild(b);
  });

  document.getElementById('vfMapCanvas').addEventListener('click', _vfMapCanvasClick);
  document.addEventListener('keydown', _vfMapKeyDown);
}

async function _vfRenderMapperPdf() {
  const canvas = document.getElementById('vfMapCanvas');
  if (!canvas) return;
  try {
    const bytes = await fetch(VF_PDF_URL).then(r => r.arrayBuffer());
    const pdf   = await pdfjsLib.getDocument({ data: bytes }).promise;
    const page  = await pdf.getPage(1);
    const vp    = page.getViewport({ scale: VF_FILL_SCALE });
    canvas.width  = vp.width;
    canvas.height = vp.height;
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport: vp }).promise;
    // Snapshot the clean PDF so we can redraw it when dots change
    canvas._basePdf = ctx.getImageData(0, 0, canvas.width, canvas.height);
    _vfRedrawMapperCanvas();
  } catch(e) { console.error(e); }
}

function _vfMapCanvasClick(e) {
  if (!_vfMapField) return;
  const canvas = e.target;
  const rect   = canvas.getBoundingClientRect();
  // Convert CSS click coords → actual canvas pixels
  const scaleX = canvas.width  / rect.width;
  const scaleY = canvas.height / rect.height;
  const cx = Math.round((e.clientX - rect.left) * scaleX);
  const cy = Math.round((e.clientY - rect.top)  * scaleY);
  _vfMapCoords[_vfMapField] = { canvasX: cx, canvasY: cy };
  _vfRedrawMapperCanvas();
  _vfUpdateMapStatus();
}

function _vfRedrawMapperCanvas() {
  const canvas = document.getElementById('vfMapCanvas');
  if (!canvas || !canvas._basePdf) return;
  const ctx = canvas.getContext('2d');
  // Restore original PDF rendering
  ctx.putImageData(canvas._basePdf, 0, 0);
  // Draw all stored field positions as live previews
  const fontSize = Math.round(canvas.height * 0.016);
  ctx.font         = `bold ${fontSize}px Tahoma, Arial, sans-serif`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  const labels = VF[_vfLang()].fieldLabels;
  Object.entries(_vfMapCoords).forEach(([f, pos]) => {
    if (!pos) return;
    const px = pos.canvasX !== undefined ? pos.canvasX : pos.xPct * canvas.width;
    const py = pos.canvasY !== undefined ? pos.canvasY : pos.yPct * canvas.height;
    // Highlight box
    const label = labels[f] || f;
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = 'rgba(251,191,36,.25)';
    ctx.fillRect(px - tw / 2 - 4, py - fontSize / 2 - 2, tw + 8, fontSize + 4);
    // Text
    ctx.fillStyle = '#000';
    ctx.fillText(label, px, py);
    // Crosshair dot
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
  });
}

function _vfRenderMapperDots() {
  // Dots are now drawn directly on the canvas — delegate to redraw
  _vfRedrawMapperCanvas();
}

// ─────────────────────────────────────────────
//  زر الإرسال الرئيسي
// ─────────────────────────────────────────────
function vfPrint() {
  const data = _vfCollectData();
  if (VF_PDF_FILL) {
    _vfFillPdf(data);
  } else {
    _vfPrintHtml(data);
  }
}

// ═══════════════════════════════════════════════════════════
//  VIOLATION FORM — LAUNCH FLOW + EMAIL FLOW
// ═══════════════════════════════════════════════════════════

// ── Employee data per leader email (populate when list is received) ──
const VF_EMPLOYEES = {

  'salghamdi.c@barq.com': [
    { name: 'Mohammed Nifal',               hrid: '554100361', email: 'Mjnifal.c@barq.com',         title: 'Agent' },
    { name: 'Motaz Alswaileh',              hrid: '553360744', email: 'Mmalswaileh.c@barq.com',     title: 'Agent' },
    { name: 'Saeed Awad Alasmari',          hrid: '68210431',  email: 'saalasmari.c@barq.com',      title: 'Agent' },
    { name: 'Abdullah Ahmed Alhussain',     hrid: '549493946', email: 'Aaalhussain.c@barq.com',     title: 'Agent' },
    { name: 'Abdullah Aljadaan',            hrid: '505752579', email: 'AAAljadaan.c@barq.com',      title: 'Agent' },
    { name: 'Abdullah Alshahrani',          hrid: '550278747', email: 'Aalialshahrani.c@barq.com',  title: 'Agent' },
    { name: 'Abdulrahman Ibrahim Jammah',   hrid: '533025855', email: 'Aijammah.c@barq.com',        title: 'Agent' },
    { name: 'Feras Khalid Alharbi',         hrid: '582366621', email: 'Fkalharbi.c@barq.com',       title: 'Agent' },
    { name: 'Mohammed Abdulrahman Alomar',  hrid: '500762233', email: 'Maalomar.c@barq.com',        title: 'Agent' },
    { name: 'Riyadh Khalid Almutairi',      hrid: '534729147', email: 'rikalmutairi.c@barq.com',    title: 'Agent' },
    { name: 'Nawaf Fahad Aldossri',         hrid: '536003003', email: 'nfaldossari.c@barq.com',     title: 'Agent' },
    { name: 'Mohammed Fehaid Alessa',       hrid: '556029665', email: 'Mfalessa.c@barq.com',        title: 'Agent' },
    { name: 'Abdulaziz Alshakrah',          hrid: '509652139', email: 'Akalshakrah.c@barq.com',     title: 'Agent' },
    { name: 'Abdullah Nasser Almutairi',    hrid: '509900941', email: 'Analmutairi.c@barq.com',     title: 'Agent' },
  ],

  'akaljeraisy.c@barq.com': [
    { name: 'Abdulaziz Ali Almeshari',      hrid: '580339293', email: 'aaalmeshari.c@barq.com',     title: 'Agent' },
    { name: 'Abdulaziz Mousa Alfaifi',      hrid: '508985010', email: 'Amalfaifi.c@barq.com',       title: 'Agent' },
    { name: 'Danah Saad Aldowsari',         hrid: '537426299', email: 'Dsaldowsari.c@barq.com',     title: 'Agent' },
    { name: 'Muhammed Abdullah Alaidrous',  hrid: '570799880', email: 'Maalaidrous.c@barq.com',     title: 'Agent' },
    { name: 'Mohammed Ahmed Bahammam',      hrid: '532884122', email: 'MABahammam.c@barq.com',      title: 'Agent' },
    { name: 'Omar Muath Fallatah',          hrid: '68210750',  email: 'omfallatah.c@barq.com',      title: 'Agent' },
    { name: 'Turki Muhammed Alotaibi',      hrid: '557436260', email: 'Tmalotaibi.c@barq.com',      title: 'Agent' },
    { name: 'Abdulmuhsin Faisal Alsaif',    hrid: '68209754',  email: 'aalsaif.c@barq.com',         title: 'Agent' },
  ],

  'akalshammari.c@barq.com': [
    { name: 'Raed Alanazi',                 hrid: '558219900', email: 'Rfalanazi.c@barq.com',       title: 'Agent' },
    { name: 'Abdulellah Alotaibi',          hrid: '591369622', email: 'abaalotaibi.c@barq.com',     title: 'Agent' },
    { name: 'Abdullatif Alanazi',           hrid: '532000588', email: 'Abfalanazi.c@barq.com',      title: 'Agent' },
    { name: 'Ali Mesfer Alyami',            hrid: '569852528', email: 'Amalyami.c@barq.com',        title: 'Agent' },
    { name: 'Abdulrahman Nijr Alaftan',     hrid: '533115620', email: 'analaftan.c@barq.com',       title: 'Agent' },
    { name: 'Khaled Abdel Hamid',           hrid: '557436365', email: 'kaaldakla.c@barq.com',       title: 'Agent' },
    { name: 'Mohammed Abdulrahman Alshehri',hrid: '536418972', email: 'maalshehri.c@barq.com',      title: 'Agent' },
    { name: 'Musab Alotaibi',               hrid: '505498506', email: 'MMAlotaibi.c@barq.com',      title: 'Agent' },
    { name: 'Turki Nasser Alsaykhan',       hrid: '553332601', email: 'Tnalsaykhan.c@barq.com',     title: 'Agent' },
    { name: 'Omar Abdullah Alabdulkarim',   hrid: '534954169', email: 'Oaalabdulkarim.c@barq.com',  title: 'Agent' },
    { name: 'Mohammed Abdulaziz Al-Ajlan',  hrid: '532202252', email: 'maalajlan.c@barq.com',       title: 'Agent' },
  ],

  'afsurayyi.c@barq.com': [
    { name: 'Fatema Ibrahem Alhakami',      hrid: '501806212', email: 'Fialhakami.c@barq.com',      title: 'Agent' },
    { name: 'Afnan Abdullah Aljehail',      hrid: '68210377',  email: 'aaaljehail.c@barq.com',      title: 'Agent' },
    { name: 'Ghaythah Muslih Alalyani',     hrid: '558701174', email: 'Gmalalyani.c@barq.com',      title: 'Agent' },
    { name: 'Lina Saad Alhammad',           hrid: '562838002', email: 'Lsalhammad.c@barq.com',      title: 'Agent' },
    { name: 'Mashaer Marwan Salamah',       hrid: '532865738', email: 'Mmsalamah.c@barq.com',       title: 'Agent' },
    { name: 'Mona Safar Alghmadi',          hrid: '557688827', email: 'msalghmadi.c@barq.com',      title: 'Agent' },
    { name: 'Mashael Saeed Alnahdi',        hrid: '580931123', email: 'Msalnahdi.c@barq.com',       title: 'Agent' },
    { name: 'Monera Saad Dera',             hrid: '535540509', email: 'Msdera.c@barq.com',           title: 'Agent' },
    { name: 'Malak Sultan Kuthaylah',       hrid: '533038485', email: 'Mskuthaylah.c@barq.com',     title: 'Agent' },
    { name: 'Raghad Fawaz Almotairi',       hrid: '560548314', email: 'Rfalmotairi.c@barq.com',     title: 'Agent' },
    { name: 'Ruaa Khaled Aldarwish',        hrid: '558877091', email: 'Rkaldarwish.c@barq.com',     title: 'Agent' },
    { name: 'Shatha Sultan Aldawsari',      hrid: '581423304', email: 'Ssaldawsari.c@barq.com',     title: 'Agent' },
  ],

  'amrayyani.c@barq.com': [
    { name: 'Abdulrahman Awad AlKhalifi',   hrid: '553727372', email: 'Aaalkhalifi.c@barq.com',     title: 'Agent' },
    { name: 'Abdullah Mohammed Alanazi',    hrid: '505764554', email: 'abmalanazi.c@barq.com',      title: 'Agent' },
    { name: 'Ahmed Turki Ghunum',           hrid: '534218413', email: 'atghunum.c@barq.com',        title: 'Agent' },
    { name: 'Abdulsalam Yousef Alwably',    hrid: '536904220', email: 'ayalwably.c@barq.com',       title: 'Agent' },
    { name: 'Faisal Ruthaya Alqahtani',     hrid: '543066213', email: 'fralqahtani.c@barq.com',     title: 'Agent' },
    { name: 'Muhannad Abdulrahman Murayr',  hrid: '551244555', email: 'mamurayr.c@barq.com',        title: 'Agent' },
    { name: 'Mohammed Khalaf Alanazi',      hrid: '545909293', email: 'mkalanazi.c@barq.com',       title: 'Agent' },
    { name: 'Mazen Sulaiman Alnafisah',     hrid: '562203923', email: 'msalnafisah.c@barq.com',     title: 'Agent' },
    { name: 'Abdulaziz Sulaiman Alshurayhi',hrid: '558488351', email: 'asalshurayhi.c@barq.com',    title: 'Agent' },
    { name: 'Bader Almouhanna',             hrid: '595754993', email: 'baalmouhanna.c@barq.com',    title: 'Agent' },
    { name: 'Nawaf Saad Alotabi',           hrid: '568733739', email: 'Nsalotabi.c@barq.com',       title: 'Agent' },
    { name: 'Sheddi Sarhan Almatrafi',      hrid: '536723196', email: 'ssalmatrafi.c@barq.com',     title: 'Agent' },
    { name: 'Musaad Rsheed Alnahil',        hrid: '544811291', email: 'mralharbi.c@barq.com',       title: 'Agent' },
  ],

  'fabintamim.c@barq.com': [
    { name: 'Ibrahim Muattish',                       hrid: '556178798', email: 'ifmuattish.c@barq.com',    title: 'Agent' },
    { name: 'Khalid Alsanea',                         hrid: '537078311', email: 'Kaalsanea.c@barq.com',     title: 'Agent' },
    { name: 'Yasir Hassan Alharbi',                   hrid: '554180301', email: 'yhalharbi.c@barq.com',     title: 'Agent' },
    { name: 'Abdulrhman Waleed Almuayli',             hrid: '556857579', email: 'awalmuayli.c@barq.com',    title: 'Agent' },
    { name: 'Faisal Saeed Babkir',                    hrid: '590209995', email: 'fsbabkir.c@barq.com',      title: 'Agent' },
    { name: 'Ibrahim Aldahmash',                      hrid: '537500700', email: 'Isaldahmash.c@barq.com',   title: 'Agent' },
    { name: 'Khalid Alzahrani',                       hrid: '530157352', email: 'Kaalzahrani.c@barq.com',   title: 'Agent' },
    { name: 'Mohammed Ghandoor',                      hrid: '555868616', email: 'Maghandoor.c@barq.com',    title: 'Agent' },
    { name: 'Mohammed Algahtani',                     hrid: '554095668', email: 'Mmalgahtani.c@barq.com',   title: 'Agent' },
    { name: 'Turki Mohammed Ghunum',                  hrid: '598507800', email: 'Tmghunum.c@barq.com',      title: 'Agent' },
    { name: 'Emad Ali Almutairi',                     hrid: '566276582', email: 'emaalmutairi.c@barq.com',  title: 'Agent' },
    { name: 'Faisal Alharbi',                         hrid: '551650660', email: 'fmalharbi.c@barq.com',     title: 'Agent' },
  ],

  'falmeshari.c@barq.com': [
    { name: 'Abdullah Saeed Aljabri',       hrid: '565599203', email: 'Asaljabri.c@barq.com',       title: 'Agent' },
    { name: 'Abdulmalik Mohammed Alwarafi', hrid: '68210383',  email: 'amalwarafi.c@barq.com',      title: 'Agent' },
    { name: 'Abdulrahman Hadi Almadani',    hrid: '533249474', email: 'ahalmadani.c@barq.com',      title: 'Agent' },
    { name: 'Abdulaziz Ibrahim Muzaffar',   hrid: '554803760', email: 'aimuthaffar.c@barq.com',     title: 'Agent' },
    { name: 'Abdullah Khaled Alhwaish',     hrid: '559295970', email: 'Akalhwaish.c@barq.com',      title: 'Agent' },
    { name: 'Ibrahim Mohammed Alharbi',     hrid: '505107782', email: 'Imalharbi.c@barq.com',       title: 'Agent' },
    { name: 'Khalid Mubarak Alqahtani',     hrid: '530996404', email: 'kmalqahtani.c@barq.com',     title: 'Agent' },
    { name: 'Mohammed Mansour Aljbilah',    hrid: '549542474', email: 'mmaljbilah.c@barq.com',      title: 'Agent' },
    { name: 'Nawaf Khalid Alkhuzayyim',     hrid: '502832916', email: 'nkalkhuzayyim.c@barq.com',   title: 'Agent' },
    { name: 'Waleed Khalaf Aljabri',        hrid: '583070324', email: 'wkaljabri.c@barq.com',       title: 'Agent' },
    { name: 'Faris Mousa Ismail',           hrid: '533538243', email: 'fmismail.c@barq.com',        title: 'Agent' },
    { name: 'Fahad Ali Albinh',             hrid: '532396726', email: 'Faalbinh.c@barq.com',        title: 'Agent' },
    { name: 'Khaled Mohammed Omeer',        hrid: '547896086', email: 'Kmomeer.c@barq.com',         title: 'Agent' },
    { name: 'Sultan Alzeer',                hrid: '553293846', email: 'skalzeer.c@barq.com',        title: 'Agent' },
    { name: 'Alhassan Abdoalwhab Alhazmi',  hrid: '569377202', email: 'aaabdulfatah.c@barq.com',    title: 'Agent' },
  ],

  'fmalmutairi.c@barq.com': [
    { name: 'Eman Mohammed Almutairi',      hrid: '68210358',  email: 'eaalmutairi.c@barq.com',     title: 'Agent' },
    { name: 'Waad Radeni Alali',            hrid: '550365742', email: 'Wralali.c@barq.com',         title: 'Agent' },
    { name: 'Abdullah Ali Alqahtani',       hrid: '68209739',  email: 'aalqahtani.c@barq.com',      title: 'Agent' },
    { name: 'Abdulaziz Saleh Alanazi',      hrid: '68210457',  email: 'asalanzi.c@barq.com',        title: 'Agent' },
    { name: 'Fahad Mubark Aldoussry',       hrid: '68210429',  email: 'fmaldoussry.c@barq.com',     title: 'Agent' },
    { name: 'Hatem Basheer Alamoodi',       hrid: '507046772', email: 'hbalamoodi.c@barq.com',      title: 'Agent' },
    { name: 'Naif Muteb Abdulali',          hrid: '68210433',  email: 'nmabdulali.c@barq.com',      title: 'Agent' },
    { name: 'Mashael Hadi Alqhtani',        hrid: '566462227', email: 'mhalqhtani.c@barq.com',      title: 'Agent' },
    { name: 'Wasel Ali Alghamdi',           hrid: '68210370',  email: 'waalghamdi.c@barq.com',      title: 'Agent' },
  ],

  'hrashid.c@barq.com': [
    { name: 'Atiqa Afzal Javaid',           hrid: '593428724', email: 'aajavaid.c@barq.com',        title: 'Agent' },
    { name: 'Hamza Khalid',                 hrid: '592782806', email: 'hkhalid.c@barq.com',         title: 'Agent' },
    { name: 'Shaharyar Aslam Noor',         hrid: '554256491', email: 'sanoor.c@barq.com',          title: 'Agent' },
    { name: 'Sumayyah Mohammed',            hrid: '598283864', email: 'sumohammed.c@barq.com',      title: 'Agent' },
    { name: 'Yakub Mudassir Mohammed',      hrid: '560414851', email: 'ymmohammed.c@barq.com',      title: 'Agent' },
    { name: 'Abdulrahman Mateen Khan',      hrid: '596940039', email: 'Amkhan.c@barq.com',          title: 'Agent' },
    { name: 'Hannan Faisal Gillani',        hrid: '569613597', email: 'Hfgillani.c@barq.com',       title: 'Agent' },
    { name: 'Hafiz Amir Waqas',             hrid: '58605019',  email: 'hwaqas.c@barq.com',          title: 'Agent' },
    { name: 'Mohammed Hunain Afzal',        hrid: '591483246', email: 'mhafzal.c@barq.com',         title: 'Agent' },
    { name: 'Rowel Besana',                 hrid: '60801686',  email: 'rbesana.c@barq.com',         title: 'Agent' },
    { name: 'Roberto Eria Edang',           hrid: '60801688',  email: 'redang.c@barq.com',          title: 'Agent' },
    { name: 'Shahida Akther',               hrid: '544912210', email: 'sakther.c@barq.com',         title: 'Agent' },
    { name: 'Saadullah Mohammed',           hrid: '503562023', email: 'samohammed.c@barq.com',      title: 'Agent' },
    { name: 'Mohammed Maaz Khan',           hrid: '534160297', email: 'Mmkhan.c@barq.com',          title: 'Agent' },
    { name: 'Sayed Shah',                   hrid: '542760925', email: 'smshah.c@barq.com',           title: 'Agent' },
    { name: 'Sajjad Shah',                  hrid: '543497149', email: 'sashah.c@barq.com',           title: 'Agent' },
    { name: 'Mohammed Nazeeruddin',         hrid: '571490790', email: 'mnazeeruddin.c@barq.com',    title: 'Agent' },
    { name: 'Riaz Ullah',                   hrid: '501719975', email: 'ruali.c@barq.com',            title: 'Agent' },
    { name: 'Mohammed Ibrahim',             hrid: '537607153', email: 'mimohammed.c@barq.com',      title: 'Agent' },
    { name: 'Syed Naima Tullah',            hrid: '531824276', email: 'nsyed.c@barq.com',           title: 'Agent' },
    { name: 'Mehak Rehman Sethi',           hrid: '591216420', email: 'mrsethi.c@barq.com',         title: 'Agent' },
    { name: 'Moon Jawairya',                hrid: '538165390', email: 'mjhamza.c@barq.com',         title: 'Agent' },
    { name: 'Mohammed Yousuf',              hrid: '538937054', email: 'myshawdari.c@barq.com',      title: 'Agent' },
    { name: 'Yaseer Shahbaz Mohammed',      hrid: '599145364', email: 'ysmohammed.c@barq.com',      title: 'Agent' },
    { name: 'Adnan Amjad',                  hrid: '569204843', email: 'aamehmood.c@barq.com',       title: 'Agent' },
  ],

  'hahumadi.c@barq.com': [
    { name: 'Aji Oommen',                   hrid: '35610071',  email: 'aoommen.c@barq.com',         title: 'Agent' },
    { name: 'John Bagolcol Fortin',         hrid: '60801687',  email: 'jfortin.c@barq.com',         title: 'Agent' },
    { name: 'Maaz Muhammad Rashid',         hrid: '596582740', email: 'Mmrashid.c@barq.com',        title: 'Agent' },
    { name: 'Reynaldo Jauod',               hrid: '60801684',  email: 'rjauod.c@barq.com',          title: 'Agent' },
    { name: 'Abdullah Merajuddin',          hrid: '592484208', email: 'amerajuddin.c@barq.com',     title: 'Agent' },
    { name: 'Abdullah Amir Sultan',         hrid: '506034380', email: 'aasultan.c@barq.com',        title: 'Agent' },
    { name: 'Asmat Ullah Khan',             hrid: '597741492', email: 'aukhan.c@barq.com',          title: 'Agent' },
    { name: 'Fariha Dawood Khan',           hrid: '564274119', email: 'Fdkhan.c@barq.com',          title: 'Agent' },
    { name: 'Hassan Iqbal Khan',            hrid: '593130477', email: 'hikhan.c@barq.com',          title: 'Agent' },
    { name: 'Hafeez Mohammed',              hrid: '564240897', email: 'Hmohammed.c@barq.com',       title: 'Agent' },
    { name: 'Norman Perion Ortiz',          hrid: '60801685',  email: 'nortiz.c@barq.com',          title: 'Agent' },
    { name: 'Reem Shakeel',                 hrid: '543329853', email: 'rshakeel.c@barq.com',        title: 'Agent' },
    { name: 'Yousuf Ali Mohammad',          hrid: '543198165', email: 'yamohammad.c@barq.com',      title: 'Agent' },
    { name: 'Syed Amer Mehdi',              hrid: '511352817', email: 'samehdi.c@barq.com',         title: 'Agent' },
    { name: 'Muhammad Usman',               hrid: '591492808', email: 'musaman.c@barq.com',         title: 'Agent' },
    { name: 'Aimen Hassan',                 hrid: '556779615', email: 'ahzafar.c@barq.com',         title: 'Agent' },
    { name: 'Mirza Ibrahim Baig',           hrid: '501164540', email: 'ibmirza.c@barq.com',         title: 'Agent' },
    { name: 'Ali Imran',                    hrid: '510520768', email: 'aiishaq.c@barq.com',         title: 'Agent' },
    { name: 'Abdulrahman Abdulhameed',      hrid: '567842876', email: 'aabdulhameed.c@barq.com',    title: 'Agent' },
    { name: 'Mariam Jahanzeb',              hrid: '581213320', email: '',                            title: 'Agent' },
    { name: 'Syed Ather Mohiuddin',         hrid: '538667810', email: 'samohiuddin.c@barq.com',     title: 'Agent' },
    { name: 'Mudassir Ahmed Mohammed',      hrid: '536706517', email: 'mamohammed.c@barq.com',      title: 'Agent' },
    { name: 'Syeda Farkhanda Majid',        hrid: '545209808', email: 'sfhamdani.c@barq.com',       title: 'Agent' },
  ],

  'imabahussain.c@barq.com': [
    { name: 'Deema Fahad Alshehri',         hrid: '551337632', email: 'Dfalshehri.c@barq.com',      title: 'Agent' },
    { name: 'Aljawharah Abdulaziz Alolyan', hrid: '593327058', email: 'aaalolyan.c@barq.com',       title: 'Agent' },
    { name: 'Bayan Khalid Aldawsari',       hrid: '508788652', email: 'bkaldawsari.c@barq.com',     title: 'Agent' },
    { name: 'Ghala Dhafer Alshehri',        hrid: '558805257', email: 'gdalshehri.c@barq.com',      title: 'Agent' },
    { name: 'Alanoud Mohammed Alazmi',      hrid: '534560195', email: 'almalazmi.c@barq.com',       title: 'Agent' },
    { name: 'Bayan Edhah Mazruea',          hrid: '560757495', email: 'BEMazruea.c@barq.com',       title: 'Agent' },
    { name: 'Fay Mohammed Aldheayan',       hrid: '580392971', email: 'Fmaldheayan.c@barq.com',     title: 'Agent' },
    { name: 'Ghadeer Seleim Altayar',       hrid: '580170315', email: 'Gsaltayar.c@barq.com',       title: 'Agent' },
    { name: 'Ghala Tayle Aldosry',          hrid: '552823180', email: 'gtaldosry.c@barq.com',       title: 'Agent' },
    { name: 'Modhi Ghanem Alsaud',          hrid: '509752618', email: 'Mgalsaud.c@barq.com',        title: 'Agent' },
    { name: 'Sara Abdoallh Aldosari',       hrid: '559442109', email: 'saaldosari.c@barq.com',      title: 'Agent' },
  ],

  'ihjapr.c@barq.com': [
    { name: 'Mashal Abdullatif Habah',      hrid: '577286312', email: 'mahabah.c@barq.com',         title: 'Agent' },
    { name: 'Hamoud Zaid Alotaibi',         hrid: '558429559', email: 'Hzalotaibi.c@barq.com',      title: 'Agent' },
    { name: 'Abdulrazaq Alyawir Alanazi',   hrid: '541756467', email: 'aaalanazi.c@barq.com',       title: 'Agent' },
    { name: 'Abdullah Dhafalleh Alazwari',  hrid: '558624462', email: 'adalazwari.c@barq.com',      title: 'Agent' },
    { name: 'Abdulkarim Mubarak Alamri',    hrid: '582214465', email: 'AMAlamri.c@barq.com',        title: 'Agent' },
    { name: 'Feras Saed Almalki',           hrid: '533555168', email: 'fsalmalki.c@barq.com',       title: 'Agent' },
    { name: 'Hassan Alkhalifah',            hrid: '569569626', email: 'Haalkhalifah.c@barq.com',    title: 'Agent' },
    { name: 'Mohammed Awyedh Alotaibi',     hrid: '534893977', email: 'maalotaibi.c@barq.com',      title: 'Agent' },
    { name: 'Muath Mohammed Alamer',        hrid: '557707324', email: 'mmalamer.c@barq.com',        title: 'Agent' },
    { name: 'Mohammed Saber Alzahrani',     hrid: '566970263', email: 'mosalzahrani.c@barq.com',    title: 'Agent' },
    { name: 'Rayan Jaber Alzahrani',        hrid: '500174917', email: 'rjalzahrani.c@barq.com',     title: 'Agent' },
    { name: 'Rashed Mohammed Aldossari',    hrid: '538119705', email: 'Rmaldossari.c@barq.com',     title: 'Agent' },
    { name: 'Samer Meshary Almutairi',      hrid: '502751179', email: 'Saalmutairi.c@barq.com',     title: 'Agent' },
    { name: 'Mohammed Muteb Alobaid',       hrid: '536284289', email: 'mmalobaid.c@barq.com',       title: 'Agent' },
  ],

  'maalramli.c@barq.com': [
    { name: 'Abdullah Adeeb Alhumidhi',     hrid: '554474188', email: 'Aaalhumidhi.c@barq.com',     title: 'Agent' },
    { name: 'Bader Abdulmajeed Bin Khunfur',hrid: '68210428',  email: 'babinkhunfur.c@barq.com',    title: 'Agent' },
    { name: 'Shafi Benider AlMaimoni',      hrid: '68210689',  email: 'sbalmaimoni.c@barq.com',     title: 'Agent' },
    { name: 'Nawal Abdulaziz Alkhofi',      hrid: '68210372',  email: 'naalkhofi.c@barq.com',       title: 'Agent' },
    { name: 'Ali Saeed Alzarah',            hrid: '68209748',  email: 'aalzarah.c@barq.com',        title: 'Agent' },
    { name: 'Abdullah Zaid Alhamad',        hrid: '509647224', email: 'Azalhamad.c@barq.com',       title: 'Agent' },
    { name: 'Nada Mohammed Alanzi',         hrid: '68210363',  email: 'nmalanzi.c@barq.com',        title: 'Agent' },
    { name: 'Rahaf Fahad Alosaimee',        hrid: '68210360',  email: 'rfalosaimee.c@barq.com',     title: 'Agent' },
    { name: 'Yazeed Fandi Alanazi',         hrid: '549202444', email: 'Yfalanazi.c@barq.com',       title: 'Agent' },
  ],

  'mgalotaibi.c@barq.com': [
    { name: 'Rayan Mohammed Bin Rashed',    hrid: '68210530',  email: 'rmbinrashed.c@barq.com',     title: 'Agent' },
    { name: 'Abdullah Adel Altwiimy',       hrid: '555127229', email: 'aaaltwiimy.c@barq.com',      title: 'Agent' },
    { name: 'Mamdouh Munawir Alshammari',   hrid: '551755499', email: 'mamalshammari.c@barq.com',   title: 'Agent' },
    { name: 'Mohammed Khalid Almuthri',     hrid: '534958405', email: 'mkalmuthri.c@barq.com',      title: 'Agent' },
    { name: 'Nawaf Abdulrhman Almgelth',    hrid: '569014618', email: 'naalmgelth.c@barq.com',      title: 'Agent' },
    { name: 'Abdulaziz Fahad Alghamdi',     hrid: '505236559', email: 'afalghamdi.c@barq.com',      title: 'Agent' },
    { name: 'Abdulrahman Hejab Alotaibi',   hrid: '566909511', email: 'Ahalotaibi.c@barq.com',      title: 'Agent' },
    { name: 'Abdulaziz Suilman Almansour',  hrid: '500464464', email: 'Asalmansour.c@barq.com',     title: 'Agent' },
    { name: 'Bandar Said Alasmri',          hrid: '555266163', email: 'Bsalasmri.c@barq.com',       title: 'Agent' },
    { name: 'Fahad Sari Alharbi',           hrid: '533642596', email: 'fsalharbi.c@barq.com',       title: 'Agent' },
    { name: 'Mubarak Aldawsari',            hrid: '568534799', email: 'MAAldawsari.c@barq.com',     title: 'Agent' },
    { name: 'Zakaria Mhammed Swadi',        hrid: '508933813', email: 'Zmswadi.c@barq.com',         title: 'Agent' },
    { name: 'Hatem Zahrani',                hrid: '550325582', email: 'Hmzahrani.c@barq.com',       title: 'Agent' },
    { name: 'Mohammed Abdullah Alhajri',    hrid: '553811243', email: 'Maalhajri.c@barq.com',       title: 'Agent' },
  ],

  'malanzi.c@barq.com': [
    { name: 'Meshari Abdulaziz Alsuhaibani',hrid: '503321149', email: 'aalsuhaibani.c@barq.com',    title: 'Agent' },
    { name: 'Jarah Alshammari',             hrid: '557043101', email: 'Jhalshammari.c@barq.com',    title: 'Agent' },
    { name: 'Sara Sulaiman Almousa',        hrid: '68210367',  email: 'ssalmousa.c@barq.com',       title: 'Agent' },
    { name: 'Abdullah Ibrahim Ateen',       hrid: '562720996', email: 'AIAteen.c@barq.com',         title: 'Agent' },
    { name: 'Yazeed Rasheed Gayadib',       hrid: '580740745', email: 'Yrgayadib.c@barq.com',       title: 'Agent' },
    { name: 'Ziyad Ali Alharbi',            hrid: '68210381',  email: 'zaalharbi.c@barq.com',       title: 'Agent' },
    { name: 'Raghad Ibrahim Alzuhayri',     hrid: '540208067', email: 'Rialzuhayri.c@barq.com',     title: 'Agent' },
    { name: 'Abdullrhman Rashed Alzeer',    hrid: '68210444',  email: 'aralzeer.c@barq.com',        title: 'Agent' },
  ],

  'maalajmi.c@barq.com': [
    { name: 'Elaf Mesfer Thafir',           hrid: '535408180', email: 'emthafir.c@barq.com',        title: 'Agent' },
    { name: 'Weam Yousef Tunsi',            hrid: '546106050', email: 'Wytunsi.c@barq.com',         title: 'Agent' },
    { name: 'Atheer Mansour Duwayrim',      hrid: '533644870', email: 'Amduwayrim.c@barq.com',      title: 'Agent' },
    { name: 'Dimah Abdullah Alotaibi',      hrid: '535931867', email: 'Daalotaibi.c@barq.com',      title: 'Agent' },
    { name: 'Gharam Muidh Almutairi',       hrid: '68210747',  email: 'gmalmutairi.c@barq.com',     title: 'Agent' },
    { name: 'Jana Mousa Shpeer',            hrid: '551216130', email: 'Jmshpeer.c@barq.com',        title: 'Agent' },
    { name: 'Norah Mulifi Almulifi',        hrid: '581848479', email: 'Nmalmulifi.c@barq.com',      title: 'Agent' },
    { name: 'Raya Saud Alanazi',            hrid: '534859345', email: 'Rsalanazi.c@barq.com',       title: 'Agent' },
    { name: 'Razan Saleh Alotaibi',         hrid: '68210399',  email: 'rsalotaibi.c@barq.com',      title: 'Agent' },
    { name: 'Shahad Mohammed Surayyi',      hrid: '552791933', email: 'smsurayyi.c@barq.com',       title: 'Agent' },
    { name: 'Haya Ahmed Aldughayshem',      hrid: '531546753', email: 'Haaldughayshem.c@barq.com',  title: 'Agent' },
  ],

  'naalrusayyis.c@barq.com': [
    { name: 'Faisal Mohammed Ramadan',      hrid: '58605022',  email: 'framadan.c@barq.com',        title: 'Agent' },
    { name: 'Imran Azeem Mohammed',         hrid: '35610073',  email: 'imohammed.c@barq.com',       title: 'Agent' },
    { name: 'Sumaira Dar',                  hrid: '58605025',  email: 'sdar.c@barq.com',            title: 'Agent' },
    { name: 'Shujahed Ali Mohammed',        hrid: '35610074',  email: 'smohammed.c@barq.com',       title: 'Agent' },
    { name: 'Asayel Abdulrhman Falatah',    hrid: '597001433', email: 'AAFalatah.c@barq.com',       title: 'Agent' },
    { name: 'Muna Mufadhi Alshammari',      hrid: '553637920', email: 'Mmalshammari.c@barq.com',    title: 'Agent' },
    { name: 'Yazeed Hassan Alamri',         hrid: '567257218', email: 'Yhalamri.c@barq.com',        title: 'Agent' },
    { name: 'Ameer Khan',                   hrid: '35610070',  email: 'akhan.c@barq.com',           title: 'Agent' },
    { name: 'Muhammad AbdurRehman',         hrid: '58605023',  email: 'mabdurrehman.c@barq.com',    title: 'Agent' },
    { name: 'Musheera Khan',                hrid: '35610075',  email: 'mkhan.c@barq.com',           title: 'Agent' },
    { name: 'Omar Suliman Alzobrery',       hrid: '552614933', email: 'Osalzobrery.c@barq.com',     title: 'Agent' },
    { name: 'Abdullah Salem Alanazi',       hrid: '530871881', email: 'asalanazi.c@barq.com',       title: 'Agent' },
    { name: 'Ammar Almushayqih',            hrid: '535561516', email: 'ASAlmushayqih.c@barq.com',   title: 'Agent' },
    { name: 'Elyas Ali Yousef',             hrid: '583177579', email: 'eayousef.c@barq.com',        title: 'Agent' },
    { name: 'Maha Sultan Alodeyla',         hrid: '554608213', email: 'MSAlodeyla.c@barq.com',      title: 'Agent' },
    { name: 'Rana Rashed Aldossari',        hrid: '554617625', email: 'Rraldossari.c@barq.com',     title: 'Agent' },
    { name: 'Yousef Saleh Albuaigi',        hrid: '594797276', email: 'Ysalbuaigi.c@barq.com',      title: 'Agent' },
    { name: 'Majed Abdullah Alnaimi',       hrid: '537388547', email: 'maalnaimi.c@barq.com',       title: 'Agent' },
    { name: 'Sultan Salem Alotebi',         hrid: '540264645', email: 'Ssalotebi.c@barq.com',       title: 'Agent' },
    { name: 'Faisal Saad Alarjani',         hrid: '544918449', email: 'fsalarjani.c@barq.com',      title: 'Agent' },
    { name: 'Shahida Akther',               hrid: '544912210', email: 'sakther.c@barq.com',         title: 'Agent' },
  ],

  'nbindawood.c@barq.com': [
    { name: 'Abdullah Hameed',              hrid: '552746714', email: 'Amhamid.c@barq.com',         title: 'Agent' },
    { name: 'Abdullah Aldossari',           hrid: '553414010', email: 'Asaldossari.c@barq.com',     title: 'Agent' },
    { name: 'Mohammed Alshuwaier',          hrid: '540446841', email: 'Mtalshuwaier.c@barq.com',    title: 'Agent' },
    { name: 'Ibrahim Abdulaziz Alsaeed',    hrid: '509969944', email: 'iaalsaeed.c@barq.com',       title: 'Agent' },
    { name: 'Nasser Alotaibi',              hrid: '599515244', email: 'Naalotaibi.c@barq.com',      title: 'Agent' },
    { name: 'Nawaf Salem Alanazi',          hrid: '582717013', email: 'nasalanazi.c@barq.com',      title: 'Agent' },
    { name: 'Sultan Rubayan',               hrid: '533897441', email: 'Strubaian.c@barq.com',       title: 'Agent' },
    { name: 'Abdullah Alqahtani',           hrid: '565581550', email: 'Abmalqahtani.c@barq.com',    title: 'Agent' },
    { name: 'Abdulla Aljohani',             hrid: '548903091', email: 'Akaljohani.c@barq.com',      title: 'Agent' },
    { name: 'Abdullah Alqhtanai',           hrid: '506899067', email: 'Akalqahtani.c@barq.com',     title: 'Agent' },
    { name: 'Abdulrahman Alzahrani',        hrid: '556965320', email: 'amalzahrani.c@barq.com',     title: 'Agent' },
    { name: 'Faisal Ibrahim Alwehaibi',     hrid: '555105229', email: 'fialwehaibi.c@barq.com',     title: 'Agent' },
    { name: 'Hisham Zuqayl',               hrid: '536158823', email: 'HMZuqayl.c@barq.com',        title: 'Agent' },
  ],

  'nfalmutairi.c@barq.com': [
    { name: 'Motaz Alqarni',                hrid: '581934257', email: 'Maalqarni.c@barq.com',       title: 'Agent' },
    { name: 'Ziyad Alshaya',                hrid: '509964446', email: 'Zaalshaya.c@barq.com',       title: 'Agent' },
    { name: 'Hafiz Thafrani',               hrid: '553628935', email: 'Hithafrani.c@barq.com',      title: 'Agent' },
    { name: 'Ibrahim Ahmed Alsamani',       hrid: '544503732', email: 'iaalsamani.c@barq.com',      title: 'Agent' },
    { name: 'Ibrahim Alluhaib',             hrid: '554121193', email: 'IKAlluhaib.c@barq.com',      title: 'Agent' },
    { name: 'Mohammed Khalid Alqahtani',    hrid: '538322291', email: 'mokalqahtani.c@barq.com',    title: 'Agent' },
    { name: 'Nawaf Almuzayrie',             hrid: '598553703', email: 'NAAlmuzayrie.c@barq.com',    title: 'Agent' },
    { name: 'Nawaf Alomari',                hrid: '582216272', email: 'NMAlomari.c@barq.com',       title: 'Agent' },
    { name: 'Yazeed Abdulaziz Aldoweesh',   hrid: '581471596', email: 'yaaldoweesh.c@barq.com',     title: 'Agent' },
    { name: 'Abdulmohsen Fahad Altilasi',   hrid: '582239262', email: 'afaltilasi.c@barq.com',      title: 'Agent' },
    { name: 'Naif Alqahtani',               hrid: '543542995', email: 'Noalqahtani.c@barq.com',     title: 'Agent' },
    { name: 'Abdullah Ahmed Alzahrani',     hrid: '548658454', email: 'Aaalzahrani.c@barq.com',     title: 'Agent' },
    { name: 'Majed Hussain Alqahtani',      hrid: '568132214', email: 'mahalqahtani.c@barq.com',    title: 'Agent' },
    { name: 'Nasser Hadi Alolayan',         hrid: '508634214', email: 'NHAlolayan.c@barq.com',      title: 'Agent' },
  ],

  'smalhleel.c@barq.com': [
    { name: 'Afrah Abduallah Alzhrane',     hrid: '550342476', email: 'aaalzhrane.c@barq.com',      title: 'Agent' },
    { name: 'Ajaeb Badr Almutairi',         hrid: '555858425', email: 'Abalmutairi.c@barq.com',     title: 'Agent' },
    { name: 'Alhanouf Hamad Alosaimi',      hrid: '68210356',  email: 'ahalosaimi.c@barq.com',      title: 'Agent' },
    { name: 'Fathiyah Adel Alhurayyis',     hrid: '531823152', email: 'faalhurayyis.c@barq.com',    title: 'Agent' },
    { name: 'Mashael Mousa Mutlaq',         hrid: '545443922', email: 'mmmutlaq.c@barq.com',        title: 'Agent' },
    { name: 'Taif Ali Alakeel',             hrid: '536656396', email: 'taalakeel.c@barq.com',       title: 'Agent' },
    { name: 'Yara Bunyyan Alnamshan',       hrid: '532616462', email: 'ybalnamshan.c@barq.com',     title: 'Agent' },
    { name: 'Alaa Ibrahim Alsuraibi',       hrid: '546327176', email: 'aialsuraibi.c@barq.com',     title: 'Agent' },
    { name: 'Arwa Mohammed Almuhawwis',     hrid: '532176384', email: 'amalmuhawwis.c@barq.com',    title: 'Agent' },
    { name: 'Alaa Zeyad Madani',            hrid: '500838327', email: 'Azmadani.c@barq.com',        title: 'Agent' },
    { name: 'Razan Turki Alshammari',       hrid: '559117412', email: 'rtalshammari.c@barq.com',    title: 'Agent' },
  ],

  'wahazazi.c@barq.com': [
    { name: 'Thamra Saeed Alshehri',        hrid: '559633643', email: 'Thalshehri.c@barq.com',      title: 'Agent' },
    { name: 'Ghezlan Ali Aldosari',         hrid: '530052859', email: 'Gaaldosari.c@barq.com',      title: 'Agent' },
    { name: 'Gharam Ahmed Asiri',           hrid: '551406002', email: 'Gaasiri.c@barq.com',         title: 'Agent' },
    { name: 'Hanadi Mansour Almawi',        hrid: '536965407', email: 'hmalmawi.c@barq.com',        title: 'Agent' },
    { name: 'Haya Mohammed Alsurayyi',      hrid: '533066524', email: 'hmalsurayyi.c@barq.com',     title: 'Agent' },
    { name: 'Maryam Nawaf Alanazi',         hrid: '583490335', email: 'Mnalanazi.c@barq.com',       title: 'Agent' },
    { name: 'Rawan Mohammad Almowald',      hrid: '567951125', email: 'Rmalmowald.c@barq.com',      title: 'Agent' },
    { name: 'Ruza Mansour Alrajhi',         hrid: '551461882', email: 'rmalrajhi.c@barq.com',       title: 'Agent' },
    { name: 'Shahad Turki Almohammed',      hrid: '541596333', email: 'stalmohammed.c@barq.com',    title: 'Agent' },
    { name: 'Wajd Sami Alghamdi',           hrid: '502921433', email: 'wsalghamdi.c@barq.com',      title: 'Agent' },
    { name: 'Norah Mohammed Alrothai',      hrid: '555251971', email: 'nmalrothai.c@barq.com',      title: 'Agent' },
  ],

};

// ── Email script templates ──
const VF_EMAIL_SCRIPTS = {
  late: {
    label_ar: 'مخالفة تأخير',
    label_en: 'Late Attendance',
    ar:
`السلام عليكم ورحمة الله وبركاته،

أخي / أختي {emp_name}،

نود إحاطتكم علماً بأنه تم رصد غياب بتاريخ {date}، وقد تم بذلك احتساب مخالفة تأخير.

يرجى مراجعة إدارة الموارد البشرية للاطلاع على تفاصيل المخالفة والتوقيع على النموذج المرفق.

وتفضلوا بقبول فائق الاحترام والتقدير،
المشرف المباشر`,
    en:
`Dear {emp_name},

This is to formally inform you that a late attendance violation has been recorded on {date}.

Kindly review the attached violation form and sign it accordingly. Please contact HR for further details.

Best regards,
Direct Supervisor`
  },
  absent: {
    label_ar: 'مخالفة غياب',
    label_en: 'Absence Violation',
    ar:
`السلام عليكم ورحمة الله وبركاته،

أخي / أختي {emp_name}،

نود إحاطتكم علماً بأنه تم رصد حالة غياب بتاريخ {date}، وقد تم احتساب مخالفة غياب.

يرجى مراجعة إدارة الموارد البشرية للاطلاع على تفاصيل المخالفة والتوقيع على النموذج المرفق.

وتفضلوا بقبول فائق الاحترام والتقدير،
المشرف المباشر`,
    en:
`Dear {emp_name},

This is to formally inform you that an absence violation has been recorded on {date}.

Kindly review the attached violation form and sign it accordingly. Please contact HR for further details.

Best regards,
Direct Supervisor`
  },
  exit: {
    label_ar: 'مخالفة خروج غير مصرّح',
    label_en: 'Unauthorized Exit',
    ar:
`السلام عليكم ورحمة الله وبركاته،

أخي / أختي {emp_name}،

نود إحاطتكم علماً بأنه تم رصد خروج من موقع العميل دون إذن المشرف المباشر في الفلور، وقد ترتب على ذلك احتساب مخالفة خروج من غير علم.

يرجى مراجعة إدارة الموارد البشرية للاطلاع على تفاصيل المخالفة والتوقيع على النموذج المرفق.

وتفضلوا بقبول فائق الاحترام والتقدير،
المشرف المباشر`,
    en:
`Dear {emp_name},

This is to formally inform you that an unauthorized departure from the client site was recorded without the direct supervisor's approval on {date}. An unauthorized exit violation has been issued accordingly.

Kindly review the attached violation form and sign it accordingly. Please contact HR for further details.

Best regards,
Direct Supervisor`
  },
  other: {
    label_ar: 'أخرى (نص حر)',
    label_en: 'Other (Custom)',
    ar: '',
    en: ''
  }
};

let _vfEmailData = null;
let _vfEmailLang = 'ar';
let _vfEmailTpl  = 'late';

// ─────────────────────────────────────────────
//  Step 0 — Launch modal
// ─────────────────────────────────────────────
function openVfLaunch() {
  document.getElementById('vfLaunchModal').classList.remove('hidden');
}

function vfLaunchManual() {
  document.getElementById('vfLaunchModal').classList.add('hidden');
  openViolationForm();
}

function vfLaunchEmpPicker() {
  const userEmail = _vfCurrentEmail();
  const emps = (VF_EMPLOYEES[userEmail?.toLowerCase()] || []);
  const list = document.getElementById('vfEmpList');
  list.innerHTML = '';

  if (!emps.length) {
    list.innerHTML = `
      <div style="color:#71717a;text-align:center;padding:2rem 1rem">
        <i class="fa-solid fa-users-slash" style="font-size:2.2rem;display:block;margin-bottom:.75rem;color:#3f3f46"></i>
        <p>لم يتم إضافة موظفيك بعد.</p>
        <p style="font-size:.8rem;margin-top:.35rem">تواصل مع مدير النظام لإضافة بيانات فريقك.</p>
      </div>`;
  } else {
    emps.forEach(emp => {
      const btn = document.createElement('button');
      btn.className = 'contact-btn';
      btn.style.cssText = 'width:100%;justify-content:flex-start;gap:.75rem;padding:.75rem 1rem;text-align:right;display:flex;align-items:center';
      btn.innerHTML = `
        <span style="width:36px;height:36px;border-radius:50%;background:#FBBF2422;border:1.5px solid #FBBF2455;display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <i class="fa-solid fa-user" style="color:#FBBF24;font-size:.85rem"></i>
        </span>
        <span style="flex:1;min-width:0">
          <strong style="display:block;font-size:.9rem">${emp.name}</strong>
          <span style="color:#71717a;font-size:.77rem">${emp.title || ''} ${emp.hrid ? '· ' + emp.hrid : ''}</span>
        </span>
        <i class="fa-solid fa-chevron-left" style="color:#52525b;font-size:.75rem"></i>`;
      btn.onclick = () => vfPickEmployee(emp);
      list.appendChild(btn);
    });
  }

  document.getElementById('vfLaunchModal').classList.add('hidden');
  document.getElementById('vfEmpPickerModal').classList.remove('hidden');
}

function _vfCurrentEmail() {
  // Try Firebase auth first, fall back to localStorage set by auth.js
  try { if (typeof auth !== 'undefined' && auth.currentUser) return auth.currentUser.email.toLowerCase(); } catch(_) {}
  try { const e = localStorage.getItem('userEmail'); if (e) return e; } catch(_) {}
  return null;
}

function vfPickEmployee(emp) {
  document.getElementById('vfEmpPickerModal').classList.add('hidden');
  openViolationForm();
  setTimeout(() => {
    ['vfEmpName','vfJobTitle','vfHRID'].forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) el.value = [emp.name, 'CCS', emp.hrid][i] || '';
    });
    const toEl = document.getElementById('vfEmailTo');
    if (toEl && emp.email) toEl.value = emp.email;
  }, 120);
}

// ─────────────────────────────────────────────
//  Email flow
// ─────────────────────────────────────────────
function vfOpenEmailModal() {
  _vfEmailData = _vfCollectData();
  _vfEmailLang = 'ar';

  // Auto-detect violation type from checked checkboxes
  const chkMap = { vfChkLate:'late', vfChkEarly:'early', vfChkAbsent:'absent', vfChkOther:'other' };
  _vfEmailTpl = 'late'; // default
  for (const [chkId, tplKey] of Object.entries(chkMap)) {
    if (document.getElementById(chkId)?.checked) { _vfEmailTpl = tplKey; break; }
  }

  // Build template radio options
  const container = document.getElementById('vfEmailTemplates');
  container.innerHTML = '';
  Object.entries(VF_EMAIL_SCRIPTS).forEach(([key, tpl]) => {
    const isSelected = key === _vfEmailTpl;
    const wrap = document.createElement('label');
    wrap.style.cssText = 'display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border:1.5px solid #27272a;border-radius:.65rem;cursor:pointer;transition:border-color .15s;user-select:none';
    if (isSelected) wrap.style.borderColor = '#FBBF24';
    wrap.innerHTML = `
      <input type="radio" name="vfEmailTpl" value="${key}" ${isSelected ? 'checked' : ''} style="accent-color:#FBBF24;width:16px;height:16px;flex-shrink:0">
      <span>
        <strong style="display:block;font-size:.88rem">${tpl.label_ar}</strong>
        <span style="color:#71717a;font-size:.77rem">${tpl.label_en}</span>
      </span>`;
    const radio = wrap.querySelector('input');
    radio.addEventListener('change', () => {
      _vfEmailTpl = key;
      vfEmailUpdateBody();
      container.querySelectorAll('label').forEach(l => l.style.borderColor = '#27272a');
      wrap.style.borderColor = '#FBBF24';
    });
    container.appendChild(wrap);
  });

  // Set language buttons
  document.getElementById('vfEmailLangAr').style.borderColor = '#FBBF24';
  document.getElementById('vfEmailLangEn').style.borderColor = '';

  vfEmailUpdateBody();
  document.getElementById('vfEmailModal').classList.remove('hidden');

  // ── Autocomplete for email input ──
  setTimeout(() => _vfAttachEmailAC(), 80);
}

function _vfAttachEmailAC() {
  const input = document.getElementById('vfEmailTo');
  if (!input || input._acAttached) return;
  input._acAttached = true;

  // Build flat list of all employees across all leaders
  const allEmps = [];
  Object.values(VF_EMPLOYEES).forEach(list => {
    list.forEach(e => { if (e.email) allEmps.push(e); });
  });

  // Create dropdown container
  const dropdown = document.createElement('div');
  dropdown.id = 'vfEmailAC';
  dropdown.style.cssText = `
    position:absolute; z-index:9999; background:#1c1917;
    border:1.5px solid #3f3f46; border-radius:.55rem;
    max-height:200px; overflow-y:auto;
    box-shadow:0 8px 24px rgba(0,0,0,.6);
    display:none; width:100%;
  `;
  input.parentElement.style.position = 'relative';
  input.parentElement.appendChild(dropdown);

  function showSuggestions(q) {
    dropdown.innerHTML = '';
    if (!q || q.length < 2) { dropdown.style.display = 'none'; return; }
    const hits = allEmps.filter(e =>
      e.email.toLowerCase().includes(q.toLowerCase()) ||
      e.name.toLowerCase().includes(q.toLowerCase())
    ).slice(0, 8);
    if (!hits.length) { dropdown.style.display = 'none'; return; }
    hits.forEach(e => {
      const item = document.createElement('div');
      item.style.cssText = 'padding:.45rem .75rem;cursor:pointer;display:flex;align-items:center;gap:.6rem;border-bottom:1px solid #27272a;';
      item.innerHTML = `
        <div style="flex:1;min-width:0">
          <div style="font-size:.82rem;color:#f4f4f5;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${e.name}</div>
          <div style="font-size:.73rem;color:#71717a;direction:ltr">${e.email}</div>
        </div>`;
      item.addEventListener('mousedown', ev => {
        ev.preventDefault();
        input.value = e.email;
        dropdown.style.display = 'none';
      });
      item.addEventListener('mouseover', () => item.style.background = 'rgba(255,255,255,.07)');
      item.addEventListener('mouseout',  () => item.style.background = '');
      dropdown.appendChild(item);
    });
    dropdown.style.display = 'block';
  }

  input.addEventListener('input', () => showSuggestions(input.value));
  input.addEventListener('focus', () => showSuggestions(input.value));
  input.addEventListener('blur',  () => setTimeout(() => { dropdown.style.display = 'none'; }, 150));
}

function vfEmailSetLang(lang) {
  _vfEmailLang = lang;
  document.getElementById('vfEmailLangAr').style.borderColor = lang === 'ar' ? '#FBBF24' : '';
  document.getElementById('vfEmailLangEn').style.borderColor = lang === 'en' ? '#FBBF24' : '';
  document.getElementById('vfEmailBody').setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  vfEmailUpdateBody();
}

function vfEmailUpdateBody() {
  const tpl  = VF_EMAIL_SCRIPTS[_vfEmailTpl];
  if (!tpl) return;
  const d    = _vfEmailData || {};
  const date = d.vf_late_date || d.vf_early_date || d.vf_absent_date || '';
  let body   = tpl[_vfEmailLang] || '';
  body = body
    .replace(/\{emp_name\}/g, d.vf_emp_name || '...')
    .replace(/\{date\}/g,     date           || '...');
  const ta = document.getElementById('vfEmailBody');
  ta.value = body;
  ta.setAttribute('dir', _vfEmailLang === 'ar' ? 'rtl' : 'ltr');
}

function vfShowEmailPreview() {
  const to   = (document.getElementById('vfEmailTo')?.value || '').trim();
  const body = (document.getElementById('vfEmailBody')?.value || '').trim();
  const d    = _vfEmailData || {};
  const name = d.vf_emp_name || '...';
  const subj = _vfEmailLang === 'ar'
    ? `إشعار مخالفة — ${name}`
    : `Violation Notice — ${name}`;

  document.getElementById('vfPrevTo').textContent      = to      || '(لم يُحدد بعد)';
  document.getElementById('vfPrevSubject').textContent = subj;
  document.getElementById('vfPrevBody').textContent    = body;

  window._vfMailSend = { to, subject: subj, body };
  document.getElementById('vfEmailPreviewModal').classList.remove('hidden');
}

// ─── حفظ سجل المخالفة في localStorage ───
function _vfSaveViolationLog() {
  try {
    const data = _vfCollectData();
    const lang = _vfEmailLang || 'ar';

    // تحديد نوع المخالفة
    const chkMap = {
      vfChkLate:   { ar:'تأخير',       en:'Late Arrival' },
      vfChkEarly:  { ar:'خروج مبكر',   en:'Early Exit' },
      vfChkAbsent: { ar:'غياب',        en:'Absence' },
      vfChkOther:  { ar:'أخرى',        en:'Other' }
    };
    let vType = lang === 'ar' ? 'أخرى' : 'Other';
    for (const [chkId, labels] of Object.entries(chkMap)) {
      if (document.getElementById(chkId)?.checked) {
        vType = lang === 'ar' ? labels.ar : labels.en;
        break;
      }
    }

    const record = {
      empName:  data.vf_emp_name || '',
      hrid:     data.vf_hrid     || '',
      date:     data.vf_date     || new Date().toISOString().split('T')[0],
      type:     vType,
      lang:     lang,
      savedAt:  new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('barq_violations_v1') || '[]');
    existing.unshift(record);                 // الأحدث أولاً
    localStorage.setItem('barq_violations_v1', JSON.stringify(existing));
  } catch(_) {}
}

function vfDoSendEmail() {
  const { to, subject, body } = window._vfMailSend || {};

  // حفظ سجل المخالفة
  _vfSaveViolationLog();

  function closeModals() {
    ['vfEmailPreviewModal','vfEmailModal'].forEach(id => {
      document.getElementById(id)?.classList.add('hidden');
    });
  }

  // mailto — يفتح تطبيق الإيميل الافتراضي
  window.location.href = `mailto:${encodeURIComponent(to||'')}?subject=${encodeURIComponent(subject||'')}&body=${encodeURIComponent(body||'')}`;


  setTimeout(closeModals, 800);
}

function vfRedownloadPdf() {
  if (!window._vfPdfBlob) { alert('لا يوجد ملف محفوظ — أعد تحميل النموذج أولاً.'); return; }
  const url = URL.createObjectURL(window._vfPdfBlob);
  const a = document.createElement('a');
  a.href = url; a.download = 'violation-form.pdf'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
