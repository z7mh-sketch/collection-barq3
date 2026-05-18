(function () {
  // ── Password config ──────────────────────────────────────
  // غيّر كلمة المرور هنا
  const PASS = 'barq2025';
  const KEY  = 'barq_auth_v1';
  const TTL  = 30 * 24 * 60 * 60 * 1000; // 30 يوم

  function token() { return btoa(encodeURIComponent(PASS)); }

  function isAuthed() {
    try {
      const s = localStorage.getItem(KEY);
      if (!s) return false;
      const { t, exp } = JSON.parse(s);
      return Date.now() < exp && t === token();
    } catch { return false; }
  }

  if (isAuthed()) return;

  // ── Build overlay ────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.id = 'authOverlay';
  overlay.innerHTML = `
    <div class="auth-box">
      <div class="auth-logo">Collection Barq</div>
      <p class="auth-sub">أدخل كلمة المرور للدخول</p>
      <input type="password" id="authPass" class="search-input"
        placeholder="كلمة المرور..."
        autocomplete="current-password"
        style="width:100%;margin-bottom:.75rem;text-align:center;letter-spacing:.25em" />
      <button id="authBtn" class="escalation-btn" style="width:100%">
        <i class="fa-solid fa-right-to-bracket"></i> دخول
      </button>
      <p id="authErr" style="color:#ef4444;font-size:.8rem;margin-top:.75rem;display:none">
        <i class="fa-solid fa-circle-xmark"></i> كلمة المرور غير صحيحة
      </p>
    </div>`;
  document.documentElement.style.overflow = 'hidden';
  document.body.appendChild(overlay);

  function tryLogin() {
    const val = document.getElementById('authPass').value;
    if (val === PASS) {
      localStorage.setItem(KEY, JSON.stringify({ t: token(), exp: Date.now() + TTL }));
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity .4s';
      setTimeout(() => { overlay.remove(); document.documentElement.style.overflow = ''; }, 420);
    } else {
      const err = document.getElementById('authErr');
      err.style.display = 'block';
      const inp = document.getElementById('authPass');
      inp.value = '';
      inp.style.borderColor = '#ef4444';
      setTimeout(() => { inp.style.borderColor = ''; }, 1200);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('authBtn').addEventListener('click', tryLogin);
    document.getElementById('authPass').addEventListener('keydown', e => {
      if (e.key === 'Enter') tryLogin();
    });
    document.getElementById('authPass').focus();
  });
})();
