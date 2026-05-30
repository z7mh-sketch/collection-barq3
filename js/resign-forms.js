/* ============================================================
   نموذج الاستقالة (Resignation Form)
   يحاكي تدفّق نموذج المخالفة: اختيار الموظف → فورم → تعبئة الـ PDF
   - يعيد استخدام VF_EMPLOYEES / _vfCurrentEmail / _vfManagerName / _vfSafeFileName
     من pdf-forms.js (محمّل قبل هذا الملف)
   - يملأ الجهتين العربية والإنجليزية في نفس الملف
   - اسم المدير المباشر وتوقيعه تلقائياً (الليدر)، والليدر يختار التواريخ
   ============================================================ */

const RF_PDF_URL    = 'pdfs/resignation.pdf';
const RF_FILL_SCALE = 2.5;
const RF_COORDS_KEY = 'barq_rf_coords_v1';

// إحداثيات افتراضية (نِسَب 0..1 من أبعاد الكانفس) — تُضبط عبر أداة "تحديد المواضع"
const RF_DEFAULT_COORDS = {
  // ── بيانات الموظف (الإنجليزي يسار / العربي يمين) ──
  emp_name_en: { xPct: 0.300, yPct: 0.497 },
  emp_name_ar: { xPct: 0.590, yPct: 0.497 },
  hrid_en:     { xPct: 0.300, yPct: 0.520 },
  hrid_ar:     { xPct: 0.590, yPct: 0.520 },
  iqama_en:    { xPct: 0.300, yPct: 0.543 },
  iqama_ar:    { xPct: 0.590, yPct: 0.543 },
  dept_en:     { xPct: 0.300, yPct: 0.566 },
  dept_ar:     { xPct: 0.590, yPct: 0.566 },
  resign_day_en: { xPct: 0.250, yPct: 0.589 },
  resign_mon_en: { xPct: 0.300, yPct: 0.589 },
  resign_day_ar: { xPct: 0.600, yPct: 0.589 },
  resign_mon_ar: { xPct: 0.555, yPct: 0.589 },
  emp_sig:     { xPct: 0.300, yPct: 0.612 },
  // ── صندوق سبب الاستقالة + آخر يوم عمل ──
  reason_l1:   { xPct: 0.890, yPct: 0.278 },
  lastday_day: { xPct: 0.330, yPct: 0.427 },
  lastday_mon: { xPct: 0.285, yPct: 0.427 },
  // ── إجراءات المدير المباشر ──
  mgr_name:        { xPct: 0.460, yPct: 0.716 },
  mgr_sig:         { xPct: 0.460, yPct: 0.756 },
  mgr_date_day_en: { xPct: 0.250, yPct: 0.793 },
  mgr_date_mon_en: { xPct: 0.300, yPct: 0.793 },
  mgr_date_day_ar: { xPct: 0.600, yPct: 0.793 },
  mgr_date_mon_ar: { xPct: 0.555, yPct: 0.793 },
};

const RF_FIELD_LABELS = {
  emp_name_en: 'الاسم (EN)', emp_name_ar: 'الاسم (AR)',
  hrid_en: 'الرقم الوظيفي (EN)', hrid_ar: 'الرقم الوظيفي (AR)',
  iqama_en: 'الهوية (EN)', iqama_ar: 'الهوية (AR)',
  dept_en: 'القسم (EN)', dept_ar: 'القسم (AR)',
  resign_day_en: 'تاريخ الاستقالة يوم (EN)', resign_mon_en: 'تاريخ الاستقالة شهر (EN)',
  resign_day_ar: 'تاريخ الاستقالة يوم (AR)', resign_mon_ar: 'تاريخ الاستقالة شهر (AR)',
  emp_sig: 'توقيع الموظف',
  reason_l1: 'سبب الاستقالة (بداية)',
  lastday_day: 'آخر يوم عمل (يوم)', lastday_mon: 'آخر يوم عمل (شهر)',
  mgr_name: 'اسم المدير المباشر',
  mgr_sig: 'توقيع المدير المباشر',
  mgr_date_day_en: 'تاريخ المدير يوم (EN)', mgr_date_mon_en: 'تاريخ المدير شهر (EN)',
  mgr_date_day_ar: 'تاريخ المدير يوم (AR)', mgr_date_mon_ar: 'تاريخ المدير شهر (AR)',
};

// ─────────────────────────────────────────────
//  تخزين / تحميل الإحداثيات
// ─────────────────────────────────────────────
function _rfSaveCoords(c) { try { localStorage.setItem(RF_COORDS_KEY, JSON.stringify(c)); } catch (_) {} }
function _rfLoadCoords() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(RF_COORDS_KEY) || 'null'); } catch (_) {}
  const out = {};
  Object.keys(RF_DEFAULT_COORDS).forEach(k => {
    out[k] = (saved && saved[k]) ? saved[k] : { ...RF_DEFAULT_COORDS[k] };
  });
  return out;
}

// ─────────────────────────────────────────────
//  Step 0: طريقة الملء (يدوي / من الموظفين)
// ─────────────────────────────────────────────
function openRfLaunch() {
  document.getElementById('rfLaunchModal').classList.remove('hidden');
}
function rfLaunchManual() {
  document.getElementById('rfLaunchModal').classList.add('hidden');
  openResignForm();
}

let _rfEmpListCache = [];

function _rfRenderEmpList(emps) {
  const list = document.getElementById('rfEmpList');
  list.innerHTML = '';
  if (!emps.length) {
    list.innerHTML = `
      <div style="color:#71717a;text-align:center;padding:2rem 1rem">
        <i class="fa-solid fa-users-slash" style="font-size:2.2rem;display:block;margin-bottom:.75rem;color:#3f3f46"></i>
        <p>لا توجد نتائج مطابقة.</p>
      </div>`;
    return;
  }
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
    btn.onclick = () => rfPickEmployee(emp);
    list.appendChild(btn);
  });
}

function rfFilterEmpList(q) {
  const term = (q || '').trim().toLowerCase();
  if (!term) return _rfRenderEmpList(_rfEmpListCache);
  const filtered = _rfEmpListCache.filter(emp =>
    (emp.name || '').toLowerCase().includes(term) ||
    String(emp.hrid || '').toLowerCase().includes(term)
  );
  _rfRenderEmpList(filtered);
}

function rfLaunchEmpPicker() {
  const userEmail = (typeof _vfCurrentEmail === 'function') ? _vfCurrentEmail() : null;
  _rfEmpListCache = (typeof VF_EMPLOYEES !== 'undefined' ? (VF_EMPLOYEES[userEmail?.toLowerCase()] || []) : []);
  const search = document.getElementById('rfEmpSearch');
  if (!_rfEmpListCache.length) {
    if (search) search.value = '';
    document.getElementById('rfEmpList').innerHTML = `
      <div style="color:#71717a;text-align:center;padding:2rem 1rem">
        <i class="fa-solid fa-users-slash" style="font-size:2.2rem;display:block;margin-bottom:.75rem;color:#3f3f46"></i>
        <p>لم يتم إضافة موظفيك بعد.</p>
        <p style="font-size:.8rem;margin-top:.35rem">تواصل مع مدير النظام لإضافة بيانات فريقك.</p>
      </div>`;
  } else {
    if (search) search.value = '';
    _rfRenderEmpList(_rfEmpListCache);
  }
  document.getElementById('rfLaunchModal').classList.add('hidden');
  document.getElementById('rfEmpPickerModal').classList.remove('hidden');
}

function rfPickEmployee(emp) {
  document.getElementById('rfEmpPickerModal').classList.add('hidden');
  openResignForm();
  setTimeout(() => {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    set('rfEmpName', emp.name);
    set('rfHRID', emp.hrid);
    set('rfDept', 'CCS');
    set('rfIqama', ''); // تُترك فاضية
  }, 120);
}

// ─────────────────────────────────────────────
//  الفورم
// ─────────────────────────────────────────────
let _rfSigMode = 'draw', _rfDrawing = false, _rfLX = 0, _rfLY = 0;

function _rfPopulateDM() {
  const fill = (sel, n) => {
    if (!sel || sel.options.length) return;
    const blank = document.createElement('option');
    blank.value = ''; blank.textContent = '—';
    sel.appendChild(blank);
    for (let i = 1; i <= n; i++) {
      const o = document.createElement('option');
      o.value = String(i).padStart(2, '0');
      o.textContent = String(i).padStart(2, '0');
      sel.appendChild(o);
    }
  };
  ['rfResignDay', 'rfLastDay', 'rfMgrDay'].forEach(id => fill(document.getElementById(id), 31));
  ['rfResignMonth', 'rfLastMonth', 'rfMgrMonth'].forEach(id => fill(document.getElementById(id), 12));
}

function openResignForm() {
  _rfPopulateDM();
  // اسم المدير المباشر = الليدر (تلقائي)
  const mgr = (typeof _vfManagerName === 'function') ? _vfManagerName() : '';
  const mgrEl = document.getElementById('rfMgrName');
  if (mgrEl) mgrEl.value = mgr || '';
  // القسم الافتراضي
  const deptEl = document.getElementById('rfDept');
  if (deptEl && !deptEl.value) deptEl.value = 'CCS';
  // التواريخ الافتراضية = اليوم (الاستقالة + تاريخ المدير)؛ آخر يوم عمل يُترك فاضي
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const sv = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  sv('rfResignDay', dd); sv('rfResignMonth', mm);
  sv('rfMgrDay', dd);    sv('rfMgrMonth', mm);
  // زر المواضع (أداة ضبط) — ظاهر مؤقتاً للمعايرة
  document.getElementById('resignFormModal').classList.remove('hidden');
  _rfInitCanvas();
  // توقيع جاهز باسم الليدر في وضع الكتابة
  vfRfSyncTypedSig();
}
function closeResignForm() {
  document.getElementById('resignFormModal').classList.add('hidden');
}

function _rfInitCanvas() {
  const orig = document.getElementById('rfSigCanvas');
  if (!orig) return;
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
  function start(e) { _rfDrawing = true; const p = pos(e); _rfLX = p.x; _rfLY = p.y; }
  function move(e) {
    if (!_rfDrawing) return;
    if (e.cancelable) e.preventDefault();
    const p = pos(e);
    ctx.beginPath(); ctx.moveTo(_rfLX, _rfLY); ctx.lineTo(p.x, p.y); ctx.stroke();
    _rfLX = p.x; _rfLY = p.y;
  }
  function stop() { _rfDrawing = false; }
  c.addEventListener('mousedown', start);
  c.addEventListener('mousemove', move);
  c.addEventListener('mouseup', stop);
  c.addEventListener('mouseleave', stop);
  c.addEventListener('touchstart', start, { passive: true });
  c.addEventListener('touchmove', move, { passive: false });
  c.addEventListener('touchend', stop);
}

function rfSetSigMode(mode) {
  _rfSigMode = mode;
  const canvas = document.getElementById('rfSigCanvas');
  const input  = document.getElementById('rfSigText');
  const dBtn   = document.getElementById('rfBtnDraw');
  const tBtn   = document.getElementById('rfBtnType');
  if (mode === 'draw') {
    canvas.style.display = 'block'; input.style.display = 'none';
    dBtn.style.borderColor = '#FBBF24'; tBtn.style.borderColor = '';
  } else {
    canvas.style.display = 'none'; input.style.display = 'block';
    tBtn.style.borderColor = '#FBBF24'; dBtn.style.borderColor = '';
    vfRfSyncTypedSig();
  }
}

function vfRfSyncTypedSig() {
  const input = document.getElementById('rfSigText');
  if (!input || input.value.trim()) return;
  const full  = (typeof _vfManagerName === 'function') ? _vfManagerName() : '';
  const first = full ? full.trim().split(/\s+/)[0] : '';
  if (first) input.value = first;
}

function rfClearSig() {
  const c = document.getElementById('rfSigCanvas');
  if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height);
  const t = document.getElementById('rfSigText'); if (t) t.value = '';
}

function _rfSigUrl() {
  if (_rfSigMode === 'type') {
    const name = document.getElementById('rfSigText').value.trim();
    if (!name) return null;
    const c = document.createElement('canvas'); c.width = 600; c.height = 160;
    const ctx = c.getContext('2d');
    ctx.font = "italic 64px 'Segoe Script', 'Brush Script MT', 'Lucida Handwriting', cursive";
    ctx.fillStyle = '#111'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(name, 300, 80);
    return c.toDataURL();
  }
  const c = document.getElementById('rfSigCanvas');
  if (!c) return null;
  const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
  if (!Array.from(d).some(v => v !== 0)) return null;
  return c.toDataURL();
}

function _rfCollectData() {
  const v = id => { const el = document.getElementById(id); return el ? el.value : ''; };
  return {
    emp_name: v('rfEmpName'),
    hrid:     v('rfHRID'),
    iqama:    v('rfIqama'),
    dept:     v('rfDept'),
    resign_day: v('rfResignDay'), resign_mon: v('rfResignMonth'),
    reason:   v('rfReason'),
    lastday_day: v('rfLastDay'), lastday_mon: v('rfLastMonth'),
    mgr_name: v('rfMgrName'),
    mgr_day:  v('rfMgrDay'), mgr_mon: v('rfMgrMonth'),
  };
}

// تنظيف اسم الملف (يستخدم نسخة pdf-forms إن وُجدت)
function _rfSafe(s) {
  if (typeof _vfSafeFileName === 'function') return _vfSafeFileName(s);
  return String(s || '').replace(/[^\w؀-ۿ \-]/g, '').replace(/\s+/g, ' ').trim();
}
function _rfFileBase(data) {
  const emp = (data || {}).emp_name || '';
  return _rfSafe('نموذج استقالة' + (emp ? ' - ' + emp : '')) || 'نموذج استقالة';
}

// لفّ نص سبب الاستقالة على عدة أسطر (RTL، محاذاة يمين)
function _rfDrawReason(ctx, text, start, W, H) {
  if (!start) return;
  const rightX  = start.xPct * W;            // الحافة اليمنى للكتابة
  const topY    = start.yPct * H;
  const maxW    = W * 0.80;                   // أقصى عرض للسطر
  const lineH   = Math.round(H * 0.020);
  const fs      = Math.round(H * 0.0115);
  ctx.save();
  ctx.font = `${fs}px Tahoma, Arial, sans-serif`;
  ctx.fillStyle = '#0a2a8c';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const words = String(text).replace(/\n/g, ' \n ').split(/\s+/);
  let line = '', y = topY, lines = 0;
  const flush = () => { if (line) { ctx.fillText(line.trim(), rightX, y); y += lineH; lines++; line = ''; } };
  words.forEach(w => {
    if (w === '\n') { flush(); return; }
    const test = line ? (line + ' ' + w) : w;
    if (ctx.measureText(test).width > maxW && line) { flush(); line = w; }
    else line = test;
    if (lines >= 6) return;
  });
  flush();
  ctx.restore();
}

async function _rfFillPdf(data) {
  const C = _rfLoadCoords();
  try {
    const pdfBytes = await fetch(RF_PDF_URL).then(r => r.arrayBuffer());
    const pdf  = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
    const page = await pdf.getPage(1);
    const vp   = page.getViewport({ scale: RF_FILL_SCALE });
    const canvas = document.createElement('canvas');
    canvas.width = vp.width; canvas.height = vp.height;
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport: vp }).promise;

    const W = vp.width, H = vp.height;
    const fs = Math.round(H * 0.0125);
    ctx.font = `${fs}px Tahoma, Arial, sans-serif`;
    ctx.fillStyle = '#0a2a8c';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const put = (key, text) => {
      if (text == null || text === '') return;
      const p = C[key]; if (!p) return;
      ctx.fillText(String(text), p.xPct * W, p.yPct * H);
    };

    // بيانات الموظف (الجهتين)
    put('emp_name_en', data.emp_name); put('emp_name_ar', data.emp_name);
    put('hrid_en', data.hrid);         put('hrid_ar', data.hrid);
    put('iqama_en', data.iqama);       put('iqama_ar', data.iqama);
    put('dept_en', data.dept);         put('dept_ar', data.dept);
    // تاريخ تقديم الاستقالة (الجهتين)
    put('resign_day_en', data.resign_day); put('resign_mon_en', data.resign_mon);
    put('resign_day_ar', data.resign_day); put('resign_mon_ar', data.resign_mon);
    // آخر يوم عمل
    put('lastday_day', data.lastday_day); put('lastday_mon', data.lastday_mon);
    // المدير المباشر
    put('mgr_name', data.mgr_name);
    put('mgr_date_day_en', data.mgr_day); put('mgr_date_mon_en', data.mgr_mon);
    put('mgr_date_day_ar', data.mgr_day); put('mgr_date_mon_ar', data.mgr_mon);
    // سبب الاستقالة (لفّ متعدد الأسطر)
    if (data.reason) _rfDrawReason(ctx, data.reason, C.reason_l1, W, H);

    // توقيع المدير المباشر (تلقائي)
    const sigUrl = _rfSigUrl();
    if (sigUrl && C.mgr_sig) {
      const img = await new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = sigUrl; });
      const sw = W * 0.18, sh = sw * 0.30;
      ctx.drawImage(img, C.mgr_sig.xPct * W - sw / 2, C.mgr_sig.yPct * H - sh / 2, sw, sh);
    }

    // تصدير → PDF وتحميل
    const { PDFDocument } = PDFLib;
    const newPdf  = await PDFDocument.create();
    const imgData = canvas.toDataURL('image/png');
    const pngImg  = await newPdf.embedPng(imgData);
    const newPage = newPdf.addPage([W / 2, H / 2]);
    newPage.drawImage(pngImg, { x: 0, y: 0, width: W / 2, height: H / 2 });
    const bytes = await newPdf.save();

    const blob = new Blob([bytes], { type: 'application/pdf' });
    window._rfPdfBlob = blob;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = _rfFileBase(data) + '.pdf'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  } catch (err) {
    console.error('RF PDF fill error:', err);
    alert('تعذّر تحميل النموذج، تحقق من الاتصال وحاول مجدداً.');
  }
}

function rfDownload() {
  const data = _rfCollectData();
  _rfFillPdf(data);
}

// ─────────────────────────────────────────────
//  أداة تحديد مواضع الحقول
// ─────────────────────────────────────────────
let _rfMapField = null;
let _rfMapCoords = {};

function openRfCoordMapper() {
  _rfMapCoords = _rfLoadCoords();
  _rfMapField = null;
  if (!document.getElementById('rfMapperModal')) _rfBuildMapperModal();
  document.getElementById('rfMapperModal').classList.remove('hidden');
  _rfRenderMapperPdf();
}

function _rfMapKeyDown(e) {
  const modal = document.getElementById('rfMapperModal');
  if (!modal || modal.classList.contains('hidden') || !_rfMapField) return;
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
  e.preventDefault();
  const cv = document.getElementById('rfMapCanvas');
  const stepPx = e.shiftKey ? 25 : (e.ctrlKey ? 1 : 5);
  const dx = stepPx / cv.width, dy = stepPx / cv.height;
  const c = _rfMapCoords[_rfMapField] = _rfMapCoords[_rfMapField] || { xPct: 0.5, yPct: 0.5 };
  if (e.key === 'ArrowLeft')  c.xPct -= dx;
  if (e.key === 'ArrowRight') c.xPct += dx;
  if (e.key === 'ArrowUp')    c.yPct -= dy;
  if (e.key === 'ArrowDown')  c.yPct += dy;
  _rfRedrawMapperCanvas();
  _rfUpdateMapStatus();
}

function _rfUpdateMapStatus() {
  const bar = document.getElementById('rfMapStatus');
  if (!bar) return;
  if (!_rfMapField) { bar.textContent = 'اختر حقلاً ثم انقر على النموذج، أو استخدم الأسهم للضبط الدقيق (Shift = 25px, Ctrl = 1px)'; return; }
  const c = _rfMapCoords[_rfMapField] || {};
  bar.textContent = `الحقل: ${RF_FIELD_LABELS[_rfMapField] || _rfMapField}   |   X: ${(c.xPct || 0).toFixed(3)}   Y: ${(c.yPct || 0).toFixed(3)}   |   الأسهم تضبط (Shift = 25px, Ctrl = 1px)`;
}

function _rfBuildMapperModal() {
  const div = document.createElement('div');
  div.id = 'rfMapperModal';
  div.className = 'hidden fixed inset-0 z-[60] flex items-center justify-center p-4';
  div.style.background = 'rgba(0,0,0,.85)';
  div.innerHTML = `
    <div class="modal-box w-full max-w-4xl max-h-[92vh] overflow-y-auto">
      <div class="modal-header">
        <h4 class="modal-title">تحديد مواضع حقول الاستقالة</h4>
        <button onclick="document.getElementById('rfMapperModal').classList.add('hidden')" class="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="p-4">
        <div id="rfMapStatus" style="font-size:.82rem;color:#FBBF24;margin-bottom:.5rem;padding:.45rem .6rem;background:rgba(251,191,36,.08);border-radius:.4rem;border:1px solid rgba(251,191,36,.3)">اختر حقلاً ثم انقر على النموذج، أو استخدم الأسهم للضبط الدقيق (Shift = 25px, Ctrl = 1px)</div>
        <div id="rfMapFieldBtns" style="display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.75rem"></div>
        <div style="position:relative;display:inline-block;width:100%">
          <canvas id="rfMapCanvas" tabindex="0" style="width:100%;border:1.5px solid #3f3f46;border-radius:.5rem;cursor:crosshair;display:block;outline:none"></canvas>
        </div>
        <div style="display:flex;gap:.5rem;justify-content:flex-end;margin-top:.75rem">
          <button onclick="_rfMapCoords=JSON.parse(JSON.stringify(RF_DEFAULT_COORDS));_rfRedrawMapperCanvas();_rfUpdateMapStatus()" class="contact-btn"><i class="fa-solid fa-rotate-left"></i> الافتراضي</button>
          <button onclick="_rfSaveCoords(_rfMapCoords);document.getElementById('rfMapperModal').classList.add('hidden')" class="escalation-btn"><i class="fa-solid fa-floppy-disk"></i> حفظ</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(div);

  const btns = document.getElementById('rfMapFieldBtns');
  Object.keys(RF_DEFAULT_COORDS).forEach(f => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'contact-btn';
    b.style.fontSize = '.72rem';
    b.dataset.field = f;
    b.textContent = RF_FIELD_LABELS[f] || f;
    b.onclick = () => {
      _rfMapField = f;
      btns.querySelectorAll('.contact-btn').forEach(x => x.style.borderColor = '');
      b.style.borderColor = '#FBBF24';
      _rfUpdateMapStatus();
      const cv = document.getElementById('rfMapCanvas'); if (cv) cv.focus();
    };
    btns.appendChild(b);
  });

  document.getElementById('rfMapCanvas').addEventListener('click', _rfMapCanvasClick);
  document.addEventListener('keydown', _rfMapKeyDown);
}

async function _rfRenderMapperPdf() {
  const canvas = document.getElementById('rfMapCanvas');
  if (!canvas) return;
  try {
    const bytes = await fetch(RF_PDF_URL).then(r => r.arrayBuffer());
    const pdf   = await pdfjsLib.getDocument({ data: bytes }).promise;
    const page  = await pdf.getPage(1);
    const vp    = page.getViewport({ scale: RF_FILL_SCALE });
    canvas.width = vp.width; canvas.height = vp.height;
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport: vp }).promise;
    canvas._basePdf = ctx.getImageData(0, 0, canvas.width, canvas.height);
    _rfRedrawMapperCanvas();
  } catch (e) { console.error(e); }
}

function _rfMapCanvasClick(e) {
  if (!_rfMapField) return;
  const canvas = e.target;
  const rect = canvas.getBoundingClientRect();
  const cx = (e.clientX - rect.left) * (canvas.width / rect.width);
  const cy = (e.clientY - rect.top) * (canvas.height / rect.height);
  _rfMapCoords[_rfMapField] = { xPct: cx / canvas.width, yPct: cy / canvas.height };
  _rfRedrawMapperCanvas();
  _rfUpdateMapStatus();
}

function _rfRedrawMapperCanvas() {
  const canvas = document.getElementById('rfMapCanvas');
  if (!canvas || !canvas._basePdf) return;
  const ctx = canvas.getContext('2d');
  ctx.putImageData(canvas._basePdf, 0, 0);
  const fontSize = Math.round(canvas.height * 0.013);
  ctx.font = `bold ${fontSize}px Tahoma, Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  Object.entries(_rfMapCoords).forEach(([f, pos]) => {
    if (!pos) return;
    const px = pos.xPct * canvas.width, py = pos.yPct * canvas.height;
    const label = RF_FIELD_LABELS[f] || f;
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = (f === _rfMapField) ? 'rgba(239,68,68,.30)' : 'rgba(251,191,36,.22)';
    ctx.fillRect(px - tw / 2 - 4, py - fontSize / 2 - 2, tw + 8, fontSize + 4);
    ctx.fillStyle = '#000';
    ctx.fillText(label, px, py);
    ctx.fillStyle = (f === _rfMapField) ? '#ef4444' : '#b45309';
    ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
  });
}
