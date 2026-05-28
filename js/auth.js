import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

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
      <p style="color:#f59e0b;font-size:1.1rem;margin-bottom:.5rem">⏳ طلبك قيد المراجعة</p>
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

function grantAccess(user) {
  // Auto-set presence name from email if not already saved
  if (user && !localStorage.getItem('presenceName')) {
    try {
      const name = user.displayName || 'Developer';
      if (name) localStorage.setItem('presenceName', name);
    } catch (_) {}
  }
  // Always persist the current user's email so pdf-forms.js can read it
  if (user?.email) {
    try { localStorage.setItem('userEmail', user.email.toLowerCase()); } catch (_) {}
  }
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity .35s';
  setTimeout(() => { overlay.remove(); document.documentElement.style.overflow = ''; }, 380);
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

  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const approvalDoc = await getDoc(doc(db, 'approvals', user.uid));

    const status = userDoc.data()?.status;
    const approved = status === 'approved' || approvalDoc.exists();

    if (approved) {
      grantAccess(user);
    } else {
      showPending(user);
    }
  } catch {
    // Firestore error — grant access if authenticated (fail open for network issues)
    grantAccess(user);
  }
});
