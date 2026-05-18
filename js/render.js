const ALL_DEPT = '__all__';
const state = { activeDept: ALL_DEPT, searchTerm: '' };
const leadersById = Object.fromEntries(leaders.map(l => [l.id, l]));

// ----------- helpers -----------
function escapeHtml(text) {
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}
function getInitials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('');
}
function highlight(text, term) {
  if (!term) return escapeHtml(text);
  const safe = escapeHtml(text);
  const re = escapeHtml(term).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return safe.replace(new RegExp(re, 'gi'), m => `<mark class="search-hit">${m}</mark>`);
}

// ----------- Quick Links -----------
function renderQuickLinks() {
  document.getElementById('quickLinksGrid').innerHTML = quickLinks.map(link => {
    const iconHtml = link.img
      ? `<img src="${escapeHtml(link.img)}" alt="${escapeHtml(link.label)}" class="quick-img" onerror="this.style.display='none';this.parentElement.innerHTML='<i class=\\'fa-solid fa-${escapeHtml(link.icon)}\\'></i>'" />`
      : `<i class="fa-solid fa-${escapeHtml(link.icon)}"></i>`;
    return `
      <a class="quick-card" href="${escapeHtml(link.url)}" target="_blank" rel="noopener">
        <div class="quick-icon">${iconHtml}</div>
        <span>${escapeHtml(link.label)}</span>
      </a>`;
  }).join('');
}

// ----------- PDF Links -----------
function openLocalFile(path) {
  fetch('/api/open?path=' + encodeURIComponent(path)).catch(() => {});
}

function renderAdditionalLinks() {
  document.getElementById('additionalLinksGrid').innerHTML = additionalLinks.map(link => {
    const iconHtml = link.img
      ? `<img src="${escapeHtml(link.img)}" alt="${escapeHtml(link.label)}" class="quick-img" />`
      : `<i class="fa-solid fa-${escapeHtml(link.icon)}"></i>`;
    return `<a class="quick-card js-reveal is-visible" href="${escapeHtml(link.url)}" target="_blank" rel="noopener">
      <div class="quick-icon">${iconHtml}</div>
      <span>${escapeHtml(td(link, 'label'))}</span>
    </a>`;
  }).join('');
}

function renderPdfLinks() {
  document.getElementById('pdfGrid').innerHTML = pdfLinks.map(link => {
    const displayLabel = td(link, 'label');
    const iconHtml = link.img
      ? `<img src="${escapeHtml(link.img)}" alt="${escapeHtml(displayLabel)}" class="quick-img" onerror="this.style.display='none';this.parentElement.innerHTML='<i class=\\'fa-solid fa-${escapeHtml(link.icon)}\\'></i>'" />`
      : `<i class="fa-solid fa-${escapeHtml(link.icon)}"></i>`;
    return `
      <a class="quick-card" href="${escapeHtml(link.url)}" download>
        <div class="quick-icon">${iconHtml}</div>
        <span>${escapeHtml(displayLabel)}</span>
      </a>`;
  }).join('');
}

// ----------- Escalation Quick Links -----------
function renderEscalationQuickLinks() {
  const cards = [];
  escalationQuickLinks.forEach(link => {
    const iconHtml = link.img
      ? `<img src="${escapeHtml(link.img)}" alt="${escapeHtml(link.label)}" class="quick-img" onerror="this.style.display='none';this.parentElement.innerHTML='<i class=\\'fa-solid fa-${escapeHtml(link.icon)}\\'></i>'" />`
      : `<i class="fa-solid fa-${escapeHtml(link.icon)}"></i>`;
    const parentCard = `
      <a class="quick-card" href="${escapeHtml(link.url)}" target="_blank" rel="noopener">
        <div class="quick-icon">${iconHtml}</div>
        <span>${escapeHtml(link.label)}</span>
      </a>`;
    if (link.children && link.children.length) {
      const childCards = link.children.map(child => {
        const childIcon = `<i class="fa-solid fa-${escapeHtml(child.icon)}"></i>`;
        return `
          <div class="sub-connector">
            <i class="fa-solid fa-chevron-down"></i>
            <div class="sub-conn-line"></div>
            <i class="fa-solid fa-chevron-down"></i>
          </div>
          <a class="quick-card sub-quick-card" href="${escapeHtml(child.url)}" target="_blank" rel="noopener">
            <div class="quick-icon">${childIcon}</div>
            <span>${escapeHtml(td(child, 'label'))}</span>
          </a>`;
      }).join('');
      cards.push(`<div class="quick-card-group">${parentCard}${childCards}</div>`);
    } else {
      cards.push(parentCard);
    }
  });
  document.getElementById('escalationQuickGrid').innerHTML = cards.join('');
}

// ----------- Department Filters -----------
function renderDepartmentFilters() {
  const depts = [ALL_DEPT, ...new Set(leaders.map(l => l.department))];
  const container = document.getElementById('departmentFilters');
  container.innerHTML = depts.map(d => {
    let label;
    if (d === ALL_DEPT) {
      label = t('allDepts');
    } else {
      const rep = leaders.find(l => l.department === d);
      label = (currentLang === 'en' && rep?.department_en) ? rep.department_en : d;
    }
    const isActive = d === state.activeDept;
    return `<button class="dept-chip ${isActive ? 'active' : ''}" data-dept="${escapeHtml(d)}">${escapeHtml(label)}</button>`;
  }).join('');
  container.querySelectorAll('.dept-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeDept = btn.dataset.dept;
      renderDepartmentFilters();
      renderLeaders();
    });
  });
}

// ----------- Leaders Grid -----------
function leaderMatches(leader) {
  if (state.activeDept && state.activeDept !== ALL_DEPT && leader.department !== state.activeDept) return false;
  if (!state.searchTerm) return true;
  const term = state.searchTerm.toLowerCase();
  const fields = [
    leader.name, leader.title, leader.department,
    leader.name_en, leader.title_en, leader.department_en,
    ...(leader.escalationLinks || []).map(l => l.label),
    ...(leader.escalationLinks || []).map(l => l.label_en),
  ].filter(Boolean);
  return fields.join(' ').toLowerCase().includes(term);
}

function renderLeaders() {
  const grid = document.getElementById('leadersGrid');
  const noResults = document.getElementById('noResults');
  const term = state.searchTerm;
  const filtered = leaders.filter(leaderMatches);

  document.getElementById('leadersCount').textContent = `(${filtered.length})`;

  if (!filtered.length) {
    grid.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }
  noResults.classList.add('hidden');

  grid.innerHTML = filtered.map(leader => {
    const displayName  = td(leader, 'name');
    const displayTitle = td(leader, 'title');
    const displayDept  = td(leader, 'department');

    const avatar = leader.photo
      ? `<img src="${escapeHtml(leader.photo)}" alt="${escapeHtml(displayName)}" onerror="this.replaceWith(Object.assign(document.createElement('span'), {textContent:'${getInitials(displayName)}'}))"/>`
      : getInitials(displayName);

    const contacts = [];
    if (leader.contacts?.email)
      contacts.push(`<a class="contact-btn" href="mailto:${escapeHtml(leader.contacts.email)}"><i class="fa-solid fa-envelope"></i><span>${t('emailBtn')}</span></a>`);
    if (leader.contacts?.phone)
      contacts.push(`<a class="contact-btn" href="tel:${escapeHtml(leader.contacts.phone)}"><i class="fa-solid fa-phone"></i><span>${t('phoneBtn')}</span></a>`);
    if (leader.contacts?.teams)
      contacts.push(`<a class="contact-btn" href="${escapeHtml(leader.contacts.teams)}" target="_blank" rel="noopener"><i class="fa-solid fa-comments"></i><span>${t('teamsBtn')}</span></a>`);

    return `
      <article class="leader-card">
        <header style="display:flex;align-items:center;gap:.85rem">
          <div class="avatar">${avatar}</div>
          <div style="flex:1;min-width:0">
            <div class="leader-name truncate">${highlight(displayName, term)}</div>
            <div class="leader-title truncate">${highlight(displayTitle, term)}</div>
            <div class="leader-dept" style="margin-top:.2rem">
              <i class="fa-solid fa-building" style="font-size:.65rem;margin-inline-end:.3rem"></i>${highlight(displayDept, term)}
            </div>
          </div>
        </header>
        <div style="display:flex;flex-wrap:wrap;gap:.4rem">${contacts.join('')}</div>
        <button class="escalation-btn" data-leader="${leader.id}">
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
          ${t('escalationBtn')}
        </button>
      </article>
    `;
  }).join('');

  grid.querySelectorAll('.escalation-btn').forEach(btn => {
    btn.addEventListener('click', () => openLeaderModal(btn.dataset.leader));
  });
}

// ----------- Leader Modal -----------
function openLeaderModal(id) {
  const leader = leadersById[id];
  if (!leader) return;
  document.getElementById('modalTitle').textContent = `${td(leader, 'name')} — ${td(leader, 'title')}`;

  const sections = [];

  const contactRows = [];
  if (leader.contacts?.email)
    contactRows.push(`<a class="modal-link" href="mailto:${escapeHtml(leader.contacts.email)}"><i class="fa-solid fa-envelope" style="width:1.2rem;text-align:center;color:#FBBF24"></i><span>${escapeHtml(leader.contacts.email)}</span></a>`);
  if (leader.contacts?.phone)
    contactRows.push(`<a class="modal-link" href="tel:${escapeHtml(leader.contacts.phone)}"><i class="fa-solid fa-phone" style="width:1.2rem;text-align:center;color:#FBBF24"></i><span dir="ltr">${escapeHtml(leader.contacts.phone)}</span></a>`);
  if (leader.contacts?.teams)
    contactRows.push(`<a class="modal-link" href="${escapeHtml(leader.contacts.teams)}" target="_blank" rel="noopener"><i class="fa-solid fa-comments" style="width:1.2rem;text-align:center;color:#FBBF24"></i><span>${t('teamsChat')}</span><i class="fa-solid fa-arrow-up-left-from-square link-ext"></i></a>`);

  if (contactRows.length)
    sections.push(`<div style="margin-bottom:1.25rem"><div class="modal-section-title">${t('contactInfoLabel')}</div><div style="display:flex;flex-direction:column;gap:.5rem">${contactRows.join('')}</div></div>`);

  if (leader.escalationLinks?.length) {
    const links = leader.escalationLinks.map(l =>
      `<a class="modal-link" href="${escapeHtml(l.url)}" target="_blank" rel="noopener"><i class="fa-solid fa-link" style="width:1.2rem;text-align:center;color:#FBBF24"></i><span>${escapeHtml(td(l, 'label'))}</span><i class="fa-solid fa-arrow-up-left-from-square link-ext"></i></a>`
    ).join('');
    sections.push(`<div><div class="modal-section-title">${t('escalationLinksLabel')}</div><div style="display:flex;flex-direction:column;gap:.5rem">${links}</div></div>`);
  }

  if (leader.reportsTo) {
    const boss = leadersById[leader.reportsTo];
    if (boss)
      sections.push(`<div style="margin-top:1.1rem;padding-top:1.1rem;border-top:1px solid #f4f4f5"><div class="modal-section-title">${t('reportsToLabel')}</div><button type="button" class="modal-link" data-jump-to="${boss.id}"><i class="fa-solid fa-user-tie" style="width:1.2rem;text-align:center;color:#FBBF24"></i><span>${escapeHtml(td(boss, 'name'))} — ${escapeHtml(td(boss, 'title'))}</span></button></div>`);
  }

  const body = document.getElementById('modalBody');
  body.innerHTML = sections.join('') || `<p style="color:#71717a;font-size:.875rem">${t('noLinksText')}</p>`;
  body.querySelectorAll('[data-jump-to]').forEach(b => b.addEventListener('click', () => openLeaderModal(b.dataset.jumpTo)));
  document.getElementById('leaderModal').classList.remove('hidden');
}

function closeLeaderModal() {
  document.getElementById('leaderModal').classList.add('hidden');
}

// ----------- Org Chart -----------
function renderOrgChart() {
  const lines = ['flowchart TD'];
  leaders.forEach(l => lines.push(`  ${l.id}["${td(l, 'name')}<br/><small>${td(l, 'title')}</small>"]`));
  leaders.forEach(l => { if (l.reportsTo && leadersById[l.reportsTo]) lines.push(`  ${l.reportsTo} --> ${l.id}`); });

  const topIds = leaders.filter(l => !l.reportsTo).map(l => l.id);
  const midIds = leaders.filter(l =>  l.reportsTo).map(l => l.id);
  lines.push('  classDef top fill:#000,stroke:#FBBF24,color:#FBBF24,stroke-width:2px;');
  lines.push('  classDef mid fill:#fff,stroke:#000,color:#000,stroke-width:1.5px;');
  if (topIds.length) lines.push(`  class ${topIds.join(',')} top;`);
  if (midIds.length) lines.push(`  class ${midIds.join(',')} mid;`);

  const el = document.getElementById('orgChart');
  el.removeAttribute('data-processed');
  el.textContent = lines.join('\n');
  mermaid.initialize({ startOnLoad: false, securityLevel: 'loose', flowchart: { htmlLabels: true, curve: 'basis' } });
  mermaid.run({ nodes: [el] }).catch(console.error);
}

// ----------- Escalation Guide -----------
function renderEscalationGuide() {
  const list = document.getElementById('escalationList');
  list.innerHTML = escalationGuide.map((g, i) => {
    const stepsArr = td(g, 'steps') || g.steps;
    const steps = stepsArr.map(s => `<div class="escalation-step">${escapeHtml(s)}</div>`).join('');
    const related = (g.relatedLeaders || []).map(id => {
      const l = leadersById[id];
      return l ? `<button type="button" class="contact-btn" data-jump-leader="${l.id}"><i class="fa-solid fa-user"></i><span>${escapeHtml(td(l, 'name'))}</span></button>` : '';
    }).join('');
    return `
      <div class="escalation-item" data-idx="${i}">
        <div class="escalation-header">
          <div class="escalation-icon"><i class="fa-solid fa-${g.icon || 'circle-info'}"></i></div>
          <div class="escalation-category">${escapeHtml(td(g, 'category'))}</div>
          <i class="fa-solid fa-chevron-down chev"></i>
        </div>
        <div class="escalation-body">
          <div class="escalation-body-inner">
            <div class="escalation-steps mb-3">${steps}</div>
            ${related ? `<div style="padding-top:.75rem;border-top:1px solid #f4f4f5"><div class="modal-section-title" style="margin-bottom:.5rem">${t('responsibleLabel')}</div><div style="display:flex;flex-wrap:wrap;gap:.4rem">${related}</div></div>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  list.querySelectorAll('.escalation-header').forEach(h =>
    h.addEventListener('click', () => h.closest('.escalation-item').classList.toggle('open'))
  );
  list.querySelectorAll('[data-jump-leader]').forEach(b =>
    b.addEventListener('click', e => { e.stopPropagation(); openLeaderModal(b.dataset.jumpLeader); })
  );
}

// ----------- Theme -----------
function initTheme() {
  const btn = document.getElementById('themeToggle');
  const root = document.documentElement;
  if (localStorage.getItem('theme') !== 'light') root.classList.add('dark');
  updateIcon();
  btn.addEventListener('click', () => {
    root.classList.toggle('dark');
    localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
    updateIcon();
    renderOrgChart();
  });
  function updateIcon() {
    btn.innerHTML = root.classList.contains('dark')
      ? '<i class="fa-solid fa-sun" style="color:#FBBF24"></i>'
      : '<i class="fa-solid fa-moon" style="color:#FBBF24"></i>';
  }
}

// ----------- Init -----------
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved language without re-rendering (first render happens below)
  const html = document.documentElement;
  html.setAttribute('lang', currentLang);
  html.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
  document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = t(el.getAttribute('data-i18n')));
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => el.placeholder = t(el.getAttribute('data-i18n-placeholder')));
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === currentLang));

  // Wire language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });

  renderQuickLinks();
  renderAdditionalLinks();
  renderPdfLinks();
  renderEscalationQuickLinks();
  renderEscalationGuide();
  renderOrgChart();
  initTheme();

  // Leader modal close
  document.getElementById('modalClose').addEventListener('click', closeLeaderModal);
  document.getElementById('leaderModal').addEventListener('click', e => { if (e.target.id === 'leaderModal') closeLeaderModal(); });

  // Leaders modal
  const leadersModal = document.getElementById('leadersModal');
  document.getElementById('leadersNavBtn').addEventListener('click', () => {
    leadersModal.classList.remove('hidden');
    renderDepartmentFilters();
    renderLeaders();
  });
  document.getElementById('leadersModalClose').addEventListener('click', () => leadersModal.classList.add('hidden'));
  leadersModal.addEventListener('click', e => { if (e.target.id === 'leadersModal') leadersModal.classList.add('hidden'); });

  // Org chart modal
  const orgChartModal = document.getElementById('orgChartModal');
  document.getElementById('orgChartNavBtn').addEventListener('click', () => {
    orgChartModal.classList.remove('hidden');
    renderOrgChart();
  });
  document.getElementById('orgChartClose').addEventListener('click', () => orgChartModal.classList.add('hidden'));
  orgChartModal.addEventListener('click', e => { if (e.target.id === 'orgChartModal') orgChartModal.classList.add('hidden'); });

  // Escalation modal
  const escalationModal = document.getElementById('escalationModal');
  document.getElementById('escalationNavBtn').addEventListener('click', () => {
    escalationModal.classList.remove('hidden');
    renderEscalationGuide();
  });
  document.getElementById('escalationModalClose').addEventListener('click', () => escalationModal.classList.add('hidden'));
  escalationModal.addEventListener('click', e => { if (e.target.id === 'escalationModal') escalationModal.classList.add('hidden'); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeLeaderModal();
      leadersModal.classList.add('hidden');
      orgChartModal.classList.add('hidden');
      escalationModal.classList.add('hidden');
    }
  });
});
