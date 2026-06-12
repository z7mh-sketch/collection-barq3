import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// ── Session idle timeout — auto sign-out after 12h without activity ─────────
const IDLE_LIMIT_MS = 12 * 60 * 60 * 1000;   // 12 hours
const LAST_ACTIVE_KEY = 'barq_lastActive';

function markActive() {
  try { localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now())); } catch (_) {}
}
function sessionExpired() {
  const last = parseInt(localStorage.getItem(LAST_ACTIVE_KEY) || '', 10);
  return Number.isFinite(last) && last > 0 && (Date.now() - last) > IDLE_LIMIT_MS;
}
function expireSession() {
  try { localStorage.removeItem(LAST_ACTIVE_KEY); } catch (_) {}
  signOut(auth).finally(() => location.replace('login.html?err=expired'));
}
let idleGuardStarted = false;
function startIdleGuard() {
  if (idleGuardStarted) return;
  idleGuardStarted = true;
  markActive();
  let lastWrite = Date.now();
  const onActivity = () => {
    if (sessionExpired()) { expireSession(); return; }
    const now = Date.now();
    if (now - lastWrite > 30000) { lastWrite = now; markActive(); }   // throttle writes to 30s
  };
  ['click', 'keydown', 'mousemove', 'scroll', 'touchstart'].forEach(ev =>
    document.addEventListener(ev, onActivity, { passive: true }));
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && sessionExpired()) expireSession();
  });
  setInterval(() => { if (sessionExpired()) expireSession(); }, 60000);   // check every minute
}

// Show checking overlay immediately
const overlay = document.createElement('div');
overlay.id = 'authOverlay';
overlay.innerHTML = `
  <div class="auth-box">
    <div class="auth-logo">Collection Barq</div>
    <p class="auth-sub" style="color:#94a3b8">جاري التحقق...</p>
  </div>`;
document.documentElement.style.overflow = 'hidden';
document.body.appendChild(overlay);

function showPending(user) {
  overlay.innerHTML = `
    <div class="auth-box">
      <div class="auth-logo">Collection Barq</div>
      <p style="color:#aab0ba;font-size:1.1rem;margin-bottom:.5rem">⏳ طلبك قيد المراجعة</p>
      <p style="color:#94a3b8;font-size:.85rem;margin-bottom:1.25rem">
        سيتم إشعارك على بريدك الإلكتروني عند الموافقة على طلبك.
      </p>
      <p style="color:#64748b;font-size:.8rem;margin-bottom:1rem">${user.email}</p>
      <button id="authSignOut" style="padding:.55rem 1.75rem;background:#334155;color:#e2e8f0;border:none;border-radius:.5rem;cursor:pointer;font-size:.9rem">
        تسجيل الخروج
      </button>
    </div>`;
  document.getElementById('authSignOut').addEventListener('click', () => {
    signOut(auth).then(() => location.replace('login.html'));
  });
}

function nameFromEmail(email) {
  // e.g. "saud.alghamdi@barq.com"  →  "Saud Alghamdi"
  // also handles  "saud.alghamdi.c@barq.com"  (trailing .c suffix)
  const local = email.split('@')[0].toLowerCase();
  const parts = local.split('.').filter(p => p.length > 1 || /^\d+$/.test(p) === false);
  // drop single-char suffixes like ".c" at the end
  const cleaned = parts.filter((p, i) => !(i === parts.length - 1 && p.length === 1));
  return cleaned.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
}

function deriveName(user, userData, approvalData) {
  // الاسم المعتمد = الاسم المُدخل وقت التسجيل (Firestore) ← ثم displayName ← ثم اشتقاق من الإيميل
  return (userData && userData.name)
      || (approvalData && approvalData.name)
      || (user && user.displayName)
      || (user && user.email ? nameFromEmail(user.email) : '')
      || 'مستخدم';
}

async function revealAdminLink(user) {
  // يظهر رابط لوحة الإدارة فقط لمن هو admin فعلاً في Firestore (admins/{uid})
  try {
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    if (adminDoc.exists()) {
      const link = document.getElementById('adminLink');
      if (link) link.style.display = 'inline-flex';
    }
  } catch (_) {}
}

function grantAccess(user, userData, approvalData) {
  // تعيين اسم الحضور من بيانات تسجيل الدخول — مرة واحدة، بدون سؤال المستخدم
  try {
    const name = deriveName(user, userData, approvalData);
    if (name) localStorage.setItem('presenceName', name);
  } catch (_) {}
  // Always persist the current user's email so pdf-forms.js can read it
  if (user?.email) {
    try { localStorage.setItem('userEmail', user.email.toLowerCase()); } catch (_) {}
  }
  // Log this login once per browser session (for the admin dashboard analytics)
  try {
    if (!sessionStorage.getItem('barq_login_logged')) {
      sessionStorage.setItem('barq_login_logged', '1');
      fetch('/api/log-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: (localStorage.getItem('presenceName') || '').trim(),
          email: (user?.email || '').toLowerCase()
        })
      }).catch(() => {});
    }
  } catch (_) {}
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity .35s';
  setTimeout(() => { overlay.remove(); document.documentElement.style.overflow = ''; }, 380);
  revealAdminLink(user);
  wireLogout();
  startIdleGuard();
}

function wireLogout() {
  const btn = document.getElementById('logoutBtn');
  if (!btn || btn.dataset.wired) return;
  btn.dataset.wired = '1';
  btn.addEventListener('click', () => {
    btn.disabled = true;
    signOut(auth)
      .then(() => location.replace('login.html'))
      .catch(() => { location.replace('login.html'); });
  });
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.replace('login.html');
    return;
  }

  if (!user.email?.toLowerCase().endsWith('@barq.com')) {
    await signOut(auth);
    location.replace('login.html?err=domain');
    return;
  }

  // Auto sign-out if the site hasn't been used for 12+ hours
  if (sessionExpired()) { expireSession(); return; }

  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const approvalDoc = await getDoc(doc(db, 'approvals', user.uid));

    const userData = userDoc.data();
    const approvalData = approvalDoc.data();
    const status = userData?.status;
    const approved = status === 'approved' || approvalDoc.exists();

    if (approved) {
      grantAccess(user, userData, approvalData);
    } else {
      showPending(user);
    }
  } catch {
    // Firestore error — fail CLOSED: never grant access when we can't verify status.
    // Show the pending screen so a network blip (or a deliberately blocked request)
    // can't be used to bypass approval gating.
    showPending(user);
  }
});
