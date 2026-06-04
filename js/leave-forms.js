/* ============================================================
   نموذج طلب إجازة (Leave Request Form)
   يحاكي تدفّق نموذج الاستقالة: اختيار الموظف → فورم → تعبئة الـ PDF
   - يعيد استخدام VF_EMPLOYEES / _vfCurrentEmail / _vfManagerName / _vfSafeFileName
     من pdf-forms.js (محمّل قبل هذا الملف)
   - اسم المدير المباشر وتوقيعه تلقائياً (الليدر)، والليدر يختار التواريخ ونوع الإجازة
   - المواضع تُضبط بصرياً عبر زر "ضبط المواضع" وتُحفظ في localStorage
   ============================================================ */

const LF_PDF_URL    = 'pdfs/leave-request.pdf';
const LF_FILL_SCALE = 2.5;
const LF_COORDS_KEY = 'barq_lf_coords_v1';

// إحداثيات افتراضية (نِسَب 0..1 من أبعاد الكانفس) — تُضبط عبر أداة "ضبط المواضع"
const LF_DEFAULT_COORDS = {
  emp_name:     { xPct: 0.620, yPct: 0.300 },
  hrid:         { xPct: 0.620, yPct: 0.340 },
  dept:         { xPct: 0.620, yPct: 0.380 },
  jobtitle:     { xPct: 0.620, yPct: 0.420 },
  leave_type:   { xPct: 0.620, yPct: 0.470 },
  days:         { xPct: 0.400, yPct: 0.520 },
  start_day:    { xPct: 0.700, yPct: 0.560 },
  start_mon:    { xPct: 0.630, yPct: 0.560 },
  end_day:      { xPct: 0.700, yPct: 0.600 },
  end_mon:      { xPct: 0.630, yPct: 0.600 },
  return_day:   { xPct: 0.700, yPct: 0.640 },
  return_mon:   { xPct: 0.630, yPct: 0.640 },
  mgr_name:     { xPct: 0.560, yPct: 0.790 },
  mgr_sig:      { xPct: 0.560, yPct: 0.840 },
  mgr_date_day: { xPct: 0.300, yPct: 0.880 },
  mgr_date_mon: { xPct: 0.236, yPct: 0.880 },
};

const LF_FIELD_LABELS = {
  emp_name:   'اسم الموظف',
  hrid:       'الرقم الوظيفي',
  dept:       'القسم / المشروع',
  jobtitle:   'المسمى الوظيفي',
  leave_type: 'نوع الإجازة',
  days:       'عدد الأيام',
  start_day:  'تاريخ البداية (يوم)',  start_mon:  'تاريخ البداية (شهر)',
  end_day:    'تاريخ النهاية (يوم)',  end_mon:    'تاريخ النهاية (شهر)',
  return_day: 'تاريخ المباشرة (يوم)', return_mon: 'تاريخ المباشرة (شهر)',
  mgr_name:   'اسم المدير المباشر',
  mgr_sig:    'توقيع المدير المباشر',
  mgr_date_day: 'تاريخ المدير (يوم)', mgr_date_mon: 'تاريخ المدير (شهر)',
};

// أنواع الإجازة (تُكتب كنص في موضع "نوع الإجازة")
const LF_LEAVE_TYPES = ['سنوية', 'مرضية', 'اضطرارية', 'بدون راتب', 'أخرى'];

// ─────────────────────────────────────────────
//  تخزين / تحميل الإحداثيات
// ─────────────────────────────────────────────
function _lfSaveCoords(c) { try { localStorage.setItem(LF_COORDS_KEY, JSON.stringify(c)); } catch (_) {} }
function _lfLoadCoords() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(LF_COORDS_KEY) || 'null'); } catch (_) {}
  const out = {};
  Object.keys(LF_DEFAULT_COORDS).forEach(k => {
    out[k] = (saved && saved[k]) ? saved[k] : { ...LF_DEFAULT_COORDS[k] };
  });
  return out;
}

// ─────────────────────────────────────────────
//  Step 0: طريقة الملء (يدوي / من الموظفين)
// ─────────────────────────────────────────────
function openLfLaunch() {
  document.getElementById('lfLaunchModal').classList.remove('hidden');
}
function lfLaunchManual() {
  document.getElementById('lfLaunchModal').classList.add('hidden');
  openLeaveForm();
}

let _lfEmpListCache = [];

function _lfRenderEmpList(emps) {
  const list = document.getElementById('lfEmpList');
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
    btn.onclick = () => lfPickEmployee(emp);
    list.appendChild(btn);
  });
}

function lfFilterEmpList(q) {
  const term = (q || '').trim().toLowerCase();
  if (!term) return _lfRenderEmpList(_lfEmpListCache);
  const filtered = _lfEmpListCache.filter(emp =>
    (emp.name || '').toLowerCase().includes(term) ||
    String(emp.hrid || '').toLowerCase().includes(term)
  );
  _lfRenderEmpList(filtered);
}

function lfLaunchEmpPicker() {
  const userEmail = (typeof _vfCurrentEmail === 'function') ? _vfCurrentEmail() : null;
  _lfEmpListCache = (typeof VF_EMPLOYEES !== 'undefined' ? (VF_EMPLOYEES[userEmail?.toLowerCase()] || []) : []);
  const search = document.getElementById('lfEmpSearch');
  if (!_lfEmpListCache.length) {
    if (search) search.value = '';
    document.getElementById('lfEmpList').innerHTML = `
      <div style="color:#71717a;text-align:center;padding:2rem 1rem">
        <i class="fa-solid fa-users-slash" style="font-size:2.2rem;display:block;margin-bottom:.75rem;color:#3f3f46"></i>
        <p>لم يتم إضافة موظفيك بعد.</p>
        <p style="font-size:.8rem;margin-top:.35rem">تواصل مع مدير النظام لإضافة بيانات فريقك.</p>
      </div>`;
  } else {
    if (search) search.value = '';
    _lfRenderEmpList(_lfEmpListCache);
  }
  document.getElementById('lfLaunchModal').classList.add('hidden');
  document.getElementById('lfEmpPickerModal').classList.remove('hidden');
}

function lfPickEmployee(emp) {
  document.getElementById('lfEmpPickerModal').classList.add('hidden');
  openLeaveForm();
  setTimeout(() => {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    set('lfEmpName', emp.name);
    set('lfHRID', emp.hrid);
    set('lfDept', 'CCS');
    set('lfJobTitle', emp.title || 'Agent');
  }, 120);
}

// ─────────────────────────────────────────────
//  الفورم
// ─────────────────────────────────────────────
let _lfSigMode = 'draw', _lfDrawing = false, _lfLX = 0, _lfLY = 0;

function _lfPopulateDM() {
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
  ['lfStartDay', 'lfEndDay', 'lfReturnDay', 'lfMgrDay'].forEach(id => fill(document.getElementById(id), 31));
  ['lfStartMonth', 'lfEndMonth', 'lfReturnMonth', 'lfMgrMonth'].forEach(id => fill(document.getElementById(id), 12));
}

// اسم المدير المباشر (الليدر) من قائمة data.js حسب إيميله — بدون أي اختلاق
function _lfManagerName() {
  if (typeof _vfManagerName === 'function') {
    const n = _vfManagerName();
    if (n) return n;
  }
  let email = '';
  try { email = (localStorage.getItem('userEmail') || '').toLowerCase(); } catch (_) {}
  try {
    if (typeof leaders !== 'undefined' && Array.isArray(leaders) && email) {
      const L = leaders.find(l => ((l.contacts && l.contacts.email) || '').toLowerCase() === email);
      if (L && L.name) return L.name;
    }
  } catch (_) {}
  return '';
}

function openLeaveForm() {
  _lfPopulateDM();
  // اسم المدير المباشر = الليدر (تلقائي)
  const mgrEl = document.getElementById('lfMgrName');
  if (mgrEl) mgrEl.value = _lfManagerName() || '';
  // القسم الافتراضي
  const deptEl = document.getElementById('lfDept');
  if (deptEl && !deptEl.value) deptEl.value = 'CCS';
  // تاريخ المدير المباشر = اليوم
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const sv = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  sv('lfMgrDay', dd); sv('lfMgrMonth', mm);
  document.getElementById('leaveFormModal').classList.remove('hidden');
  _lfInitCanvas();
  vfLfSyncTypedSig();
}
function closeLeaveForm() {
  document.getElementById('leaveFormModal').classList.add('hidden');
}

function _lfInitCanvas() {
  const orig = document.getElementById('lfSigCanvas');
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
  function start(e) { _lfDrawing = true; const p = pos(e); _lfLX = p.x; _lfLY = p.y; }
  function move(e) {
    if (!_lfDrawing) return;
    if (e.cancelable) e.preventDefault();
    const p = pos(e);
    ctx.beginPath(); ctx.moveTo(_lfLX, _lfLY); ctx.lineTo(p.x, p.y); ctx.stroke();
    _lfLX = p.x; _lfLY = p.y;
  }
  function stop() { _lfDrawing = false; }
  c.addEventListener('mousedown', start);
  c.addEventListener('mousemove', move);
  c.addEventListener('mouseup', stop);
  c.addEventListener('mouseleave', stop);
  c.addEventListener('touchstart', start, { passive: true });
  c.addEventListener('touchmove', move, { passive: false });
  c.addEventListener('touchend', stop);
}

function lfSetSigMode(mode) {
  _lfSigMode = mode;
  const canvas = document.getElementById('lfSigCanvas');
  const input  = document.getElementById('lfSigText');
  const dBtn   = document.getElementById('lfBtnDraw');
  const tBtn   = document.getElementById('lfBtnType');
  if (mode === 'draw') {
    canvas.style.display = 'block'; input.style.display = 'none';
    dBtn.style.borderColor = '#FBBF24'; tBtn.style.borderColor = '';
  } else {
    canvas.style.display = 'none'; input.style.display = 'block';
    tBtn.style.borderColor = '#FBBF24'; dBtn.style.borderColor = '';
    vfLfSyncTypedSig();
  }
}

function vfLfSyncTypedSig() {
  const input = document.getElementById('lfSigText');
  if (!input || input.value.trim()) return;
  const full  = _lfManagerName();
  const first = full ? full.trim().split(/\s+/)[0] : '';
  if (first) input.value = first;
}

function lfClearSig() {
  const c = document.getElementById('lfSigCanvas');
  if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height);
  const t = document.getElementById('lfSigText'); if (t) t.value = '';
}

function _lfSigUrl() {
  if (_lfSigMode === 'type') {
    const name = document.getElementById('lfSigText').value.trim();
    if (!name) return null;
    const c = document.createElement('canvas'); c.width = 600; c.height = 160;
    const ctx = c.getContext('2d');
    ctx.font = "italic 64px 'Segoe Script', 'Brush Script MT', 'Lucida Handwriting', cursive";
    ctx.fillStyle = '#111'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(name, 300, 80);
    return c.toDataURL();
  }
  const c = document.getElementById('lfSigCanvas');
  if (!c) return null;
  const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
  if (!Array.from(d).some(v => v !== 0)) return null;
  return c.toDataURL();
}

function _lfCollectData() {
  const v = id => { const el = document.getElementById(id); return el ? el.value : ''; };
  return {
    emp_name:  v('lfEmpName'),
    hrid:      v('lfHRID'),
    dept:      v('lfDept'),
    jobtitle:  v('lfJobTitle'),
    leave_type: v('lfLeaveType'),
    days:      v('lfDays'),
    start_day: v('lfStartDay'),   start_mon: v('lfStartMonth'),
    end_day:   v('lfEndDay'),     end_mon:   v('lfEndMonth'),
    return_day: v('lfReturnDay'), return_mon: v('lfReturnMonth'),
    mgr_name:  v('lfMgrName'),
    mgr_day:   v('lfMgrDay'),     mgr_mon:   v('lfMgrMonth'),
  };
}

function _lfSafe(s) {
  if (typeof _vfSafeFileName === 'function') return _vfSafeFileName(s);
  return String(s || '').replace(/[^\w؀-ۿ \-]/g, '').replace(/\s+/g, ' ').trim();
}
function _lfFileBase(data) {
  const emp = (data || {}).emp_name || '';
  return _lfSafe('نموذج إجازة' + (emp ? ' - ' + emp : '')) || 'نموذج إجازة';
}

async function _lfFillPdf(data) {
  const C = _lfLoadCoords();
  try {
    const pdfBytes = await fetch(LF_PDF_URL).then(r => r.arrayBuffer());
    const pdf  = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
    const page = await pdf.getPage(1);
    const vp   = page.getViewport({ scale: LF_FILL_SCALE });
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

    put('emp_name', data.emp_name);
    put('hrid', data.hrid);
    put('dept', data.dept);
    put('jobtitle', data.jobtitle);
    put('leave_type', data.leave_type);
    put('days', data.days);
    put('start_day', data.start_day);   put('start_mon', data.start_mon);
    put('end_day', data.end_day);       put('end_mon', data.end_mon);
    put('return_day', data.return_day); put('return_mon', data.return_mon);
    put('mgr_name', data.mgr_name);
    put('mgr_date_day', data.mgr_day);  put('mgr_date_mon', data.mgr_mon);

    // توقيع المدير المباشر (تلقائي)
    const sigUrl = _lfSigUrl();
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
    window._lfPdfBlob = blob;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = _lfFileBase(data) + '.pdf'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  } catch (err) {
    console.error('LF PDF fill error:', err);
    alert('تعذّر تحميل النموذج، تحقق من الاتصال وحاول مجدداً.');
  }
}

function lfDownload() {
  const data = _lfCollectData();
  _lfFillPdf(data);
}

// ─────────────────────────────────────────────
//  أداة تحديد مواضع الحقول
// ─────────────────────────────────────────────
let _lfMapField = null;
let _lfMapCoords = {};

function openLfCoordMapper() {
  _lfMapCoords = _lfLoadCoords();
  _lfMapField = null;
  if (!document.getElementById('lfMapperModal')) _lfBuildMapperModal();
  document.getElementById('lfMapperModal').classList.remove('hidden');
  _lfRenderMapperPdf();
}

function _lfMapKeyDown(e) {
  const modal = document.getElementById('lfMapperModal');
  if (!modal || modal.classList.contains('hidden') || !_lfMapField) return;
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
  e.preventDefault();
  const cv = document.getElementById('lfMapCanvas');
  const stepPx = e.shiftKey ? 25 : (e.ctrlKey ? 1 : 5);
  const dx = stepPx / cv.width, dy = stepPx / cv.height;
  const c = _lfMapCoords[_lfMapField] = _lfMapCoords[_lfMapField] || { xPct: 0.5, yPct: 0.5 };
  if (e.key === 'ArrowLeft')  c.xPct -= dx;
  if (e.key === 'ArrowRight') c.xPct += dx;
  if (e.key === 'ArrowUp')    c.yPct -= dy;
  if (e.key === 'ArrowDown')  c.yPct += dy;
  _lfRedrawMapperCanvas();
  _lfUpdateMapStatus();
}

function _lfUpdateMapStatus() {
  const bar = document.getElementById('lfMapStatus');
  if (!bar) return;
  if (!_lfMapField) { bar.textContent = 'اختر حقلاً ثم انقر على النموذج، أو استخدم الأسهم للضبط الدقيق (Shift = 25px, Ctrl = 1px)'; return; }
  const c = _lfMapCoords[_lfMapField] || {};
  bar.textContent = `الحقل: ${LF_FIELD_LABELS[_lfMapField] || _lfMapField}   |   X: ${(c.xPct || 0).toFixed(3)}   Y: ${(c.yPct || 0).toFixed(3)}   |   الأسهم تضبط (Shift = 25px, Ctrl = 1px)`;
}

function _lfBuildMapperModal() {
  const div = document.createElement('div');
  div.id = 'lfMapperModal';
  div.className = 'hidden fixed inset-0 z-[60] flex items-center justify-center p-4';
  div.style.background = 'rgba(0,0,0,.85)';
  div.innerHTML = `
    <div class="modal-box w-full max-w-4xl max-h-[92vh] overflow-y-auto">
      <div class="modal-header">
        <h4 class="modal-title">تحديد مواضع حقول الإجازة</h4>
        <button onclick="document.getElementById('lfMapperModal').classList.add('hidden')" class="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="p-4">
        <div id="lfMapStatus" style="font-size:.82rem;color:#FBBF24;margin-bottom:.5rem;padding:.45rem .6rem;background:rgba(251,191,36,.08);border-radius:.4rem;border:1px solid rgba(251,191,36,.3)">اختر حقلاً ثم انقر على النموذج، أو استخدم الأسهم للضبط الدقيق (Shift = 25px, Ctrl = 1px)</div>
        <div id="lfMapFieldBtns" style="display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.75rem"></div>
        <div style="position:relative;display:inline-block;width:100%">
          <canvas id="lfMapCanvas" tabindex="0" style="width:100%;border:1.5px solid #3f3f46;border-radius:.5rem;cursor:crosshair;display:block;outline:none"></canvas>
        </div>
        <div style="display:flex;gap:.5rem;justify-content:flex-end;margin-top:.75rem">
          <button onclick="_lfMapCoords=JSON.parse(JSON.stringify(LF_DEFAULT_COORDS));_lfRedrawMapperCanvas();_lfUpdateMapStatus()" class="contact-btn"><i class="fa-solid fa-rotate-left"></i> الافتراضي</button>
          <button onclick="_lfSaveCoords(_lfMapCoords);document.getElementById('lfMapperModal').classList.add('hidden')" class="escalation-btn"><i class="fa-solid fa-floppy-disk"></i> حفظ</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(div);

  const btns = document.getElementById('lfMapFieldBtns');
  Object.keys(LF_DEFAULT_COORDS).forEach(f => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'contact-btn';
    b.style.fontSize = '.72rem';
    b.dataset.field = f;
    b.textContent = LF_FIELD_LABELS[f] || f;
    b.onclick = () => {
      _lfMapField = f;
      btns.querySelectorAll('.contact-btn').forEach(x => x.style.borderColor = '');
      b.style.borderColor = '#FBBF24';
      _lfUpdateMapStatus();
      const cv = document.getElementById('lfMapCanvas'); if (cv) cv.focus();
    };
    btns.appendChild(b);
  });

  document.getElementById('lfMapCanvas').addEventListener('click', _lfMapCanvasClick);
  document.addEventListener('keydown', _lfMapKeyDown);
}

async function _lfRenderMapperPdf() {
  const canvas = document.getElementById('lfMapCanvas');
  if (!canvas) return;
  try {
    const bytes = await fetch(LF_PDF_URL).then(r => r.arrayBuffer());
    const pdf   = await pdfjsLib.getDocument({ data: bytes }).promise;
    const page  = await pdf.getPage(1);
    const vp    = page.getViewport({ scale: LF_FILL_SCALE });
    canvas.width = vp.width; canvas.height = vp.height;
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport: vp }).promise;
    canvas._basePdf = ctx.getImageData(0, 0, canvas.width, canvas.height);
    _lfRedrawMapperCanvas();
  } catch (e) { console.error(e); }
}

function _lfMapCanvasClick(e) {
  if (!_lfMapField) return;
  const canvas = e.target;
  const rect = canvas.getBoundingClientRect();
  const cx = (e.clientX - rect.left) * (canvas.width / rect.width);
  const cy = (e.clientY - rect.top) * (canvas.height / rect.height);
  _lfMapCoords[_lfMapField] = { xPct: cx / canvas.width, yPct: cy / canvas.height };
  _lfRedrawMapperCanvas();
  _lfUpdateMapStatus();
}

function _lfRedrawMapperCanvas() {
  const canvas = document.getElementById('lfMapCanvas');
  if (!canvas || !canvas._basePdf) return;
  const ctx = canvas.getContext('2d');
  ctx.putImageData(canvas._basePdf, 0, 0);
  const fontSize = Math.round(canvas.height * 0.013);
  ctx.font = `bold ${fontSize}px Tahoma, Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  Object.entries(_lfMapCoords).forEach(([f, pos]) => {
    if (!pos) return;
    const px = pos.xPct * canvas.width, py = pos.yPct * canvas.height;
    const label = LF_FIELD_LABELS[f] || f;
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = (f === _lfMapField) ? 'rgba(239,68,68,.30)' : 'rgba(251,191,36,.22)';
    ctx.fillRect(px - tw / 2 - 4, py - fontSize / 2 - 2, tw + 8, fontSize + 4);
    ctx.fillStyle = '#000';
    ctx.fillText(label, px, py);
    ctx.fillStyle = (f === _lfMapField) ? '#ef4444' : '#b45309';
    ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
  });
}
