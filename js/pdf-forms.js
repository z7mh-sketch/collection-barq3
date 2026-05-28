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
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'violation-filled.pdf'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 3000);

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
  // 'saud.alghamdi@barq.com': [
  //   { name: 'Ahmed Ali', email: 'ahmed.ali@barq.com', hrid: '10001', title: 'Agent' },
  // ]
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
  try { if (typeof auth !== 'undefined' && auth.currentUser) return auth.currentUser.email; } catch(_) {}
  return null;
}

function vfPickEmployee(emp) {
  document.getElementById('vfEmpPickerModal').classList.add('hidden');
  openViolationForm();
  setTimeout(() => {
    ['vfEmpName','vfJobTitle','vfHRID'].forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) el.value = [emp.name, emp.title, emp.hrid][i] || '';
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
  _vfEmailTpl  = 'late';

  // Build template radio options
  const container = document.getElementById('vfEmailTemplates');
  container.innerHTML = '';
  Object.entries(VF_EMAIL_SCRIPTS).forEach(([key, tpl], idx) => {
    const wrap = document.createElement('label');
    wrap.style.cssText = 'display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border:1.5px solid #27272a;border-radius:.65rem;cursor:pointer;transition:border-color .15s;user-select:none';
    if (idx === 0) wrap.style.borderColor = '#FBBF24';
    wrap.innerHTML = `
      <input type="radio" name="vfEmailTpl" value="${key}" ${idx === 0 ? 'checked' : ''} style="accent-color:#FBBF24;width:16px;height:16px;flex-shrink:0">
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

function vfDoSendEmail() {
  const { to, subject, body } = window._vfMailSend || {};
  const mailto = `mailto:${encodeURIComponent(to || '')}?subject=${encodeURIComponent(subject || '')}&body=${encodeURIComponent(body || '')}`;
  window.location.href = mailto;
  setTimeout(() => {
    ['vfEmailPreviewModal','vfEmailModal'].forEach(id => {
      document.getElementById(id)?.classList.add('hidden');
    });
  }, 600);
}
