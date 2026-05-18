/**
 * منطق البحث الفوري
 * يربط مربع البحث في الشريط العلوي بـ state.searchTerm ويعيد رسم البطاقات.
 */

(function () {
  const input = document.getElementById('searchInput');
  if (!input) return;

  let timer = null;

  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      state.searchTerm = input.value.trim();
      renderLeaders();
    }, 120);
  });

  // اختصار /: يركّز على البحث (مثل GitHub)
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      input.focus();
    }
    if (e.key === 'Escape' && document.activeElement === input) {
      input.value = '';
      state.searchTerm = '';
      renderLeaders();
      input.blur();
    }
  });
})();
