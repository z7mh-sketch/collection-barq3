(function () {
  const PING_MS = 30000;
  let userName = localStorage.getItem('presenceName');

  function esc(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function updateUI(users) {
    const online = (users || []).filter(u => u.status === 'online');
    const idle   = (users || []).filter(u => u.status === 'idle');

    document.getElementById('onlineNum').textContent = online.length;
    document.getElementById('idleNum').textContent   = idle.length;

    document.getElementById('onlineTooltip').innerHTML = online.length
      ? online.map(u => `<div class="pt-name">${esc(u.name)}</div>`).join('')
      : `<div class="pt-empty">لا أحد متصل</div>`;

    document.getElementById('idleTooltip').innerHTML = idle.length
      ? idle.map(u => `<div class="pt-name">${esc(u.name)}</div>`).join('')
      : `<div class="pt-empty">لا أحد خامل</div>`;
  }

  async function ping() {
    try {
      const res  = await fetch('/api/ping', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: userName })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      document.getElementById('presenceWidget').classList.remove('hidden');
      updateUI(data.users);
    } catch (_) {
      // no backend — hide widget silently
      document.getElementById('presenceWidget').classList.add('hidden');
    }
  }

  function startPresence() {
    ping();
    setInterval(ping, PING_MS);
  }

  document.addEventListener('DOMContentLoaded', () => {
    // تأكيد إخفاء أي نافذة قديمة لطلب الاسم — الاسم يُؤخذ من تسجيل الدخول فقط
    document.getElementById('nameModal')?.classList.add('hidden');

    // الاسم يضبطه auth.js بعد تحقق Firebase (غير متزامن) — ننتظره ولا نسأل المستخدم
    userName = localStorage.getItem('presenceName');
    if (userName) { startPresence(); return; }

    let tries = 0;
    const waitForName = setInterval(() => {
      userName = localStorage.getItem('presenceName');
      if (userName) { clearInterval(waitForName); startPresence(); }
      else if (++tries > 50) { clearInterval(waitForName); } // ~10s ثم نتوقف بصمت دون نافذة
    }, 200);
  });
})();
