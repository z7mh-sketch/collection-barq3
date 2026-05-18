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

  function initNameModal() {
    const modal = document.getElementById('nameModal');
    const input = document.getElementById('nameInput');
    const btn   = document.getElementById('nameSubmit');
    const skip  = document.getElementById('nameSkip');

    function submit() {
      const name = input.value.trim();
      if (!name) { input.focus(); return; }
      localStorage.setItem('presenceName', name);
      userName = name;
      modal.classList.add('hidden');
      startPresence();
    }

    btn.addEventListener('click', submit);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    skip.addEventListener('click', () => modal.classList.add('hidden'));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNameModal();
    if (userName) {
      startPresence();
    } else {
      document.getElementById('nameModal').classList.remove('hidden');
    }
  });
})();
