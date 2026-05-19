/**
 * منطق البحث الفوري
 * يربط مربع البحث في الشريط العلوي بـ state.searchTerm ويعيد رسم البطاقات.
 */

(function () {
  const modal  = document.getElementById('leadersModal');
  const input  = document.getElementById('searchInput');
  const hInput = document.getElementById('headerSearchInput');

  function doSearch(term) {
    state.searchTerm = term;
    // افتح مودال الليدرز وابحث فيه
    if (modal) modal.classList.remove('hidden');
    if (typeof renderDepartmentFilters === 'function') renderDepartmentFilters();
    if (typeof renderLeaders === 'function') renderLeaders();
    // مزامنة حقل البحث داخل المودال
    if (input) input.value = term;
  }

  // بحث من الهيدر
  if (hInput) {
    let timer = null;
    hInput.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => doSearch(hInput.value.trim()), 120);
    });
    hInput.addEventListener('keydown', e => {
      if (e.key === 'Escape') { hInput.value = ''; doSearch(''); hInput.blur(); }
    });
  }

  // بحث من داخل المودال
  if (input) {
    let timer = null;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        state.searchTerm = input.value.trim();
        if (hInput) hInput.value = input.value;
        if (typeof renderLeaders === 'function') renderLeaders();
      }, 120);
    });
  }

  // اختصار /
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      if (hInput) hInput.focus();
    }
  });
})();
