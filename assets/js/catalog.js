'use strict';
(() => {
  const input = document.querySelector('#search');
  const clear = document.querySelector('#clear');
  const toggle = document.querySelector('#toggle-all');
  const categories = [...document.querySelectorAll('.category')];
  const results = document.querySelector('#results');
  const normal = value => value.toLocaleLowerCase('ru').replaceAll('ё', 'е').replace(/[‑–—-]/g, ' ').trim();
  let previousOpen = null;
  const updateToggle = () => {
    const visible = categories.filter(c => !c.hidden);
    toggle.textContent = visible.every(c => c.open) ? 'Свернуть все' : 'Раскрыть все';
    toggle.hidden = visible.length === 0;
  };
  function search() {
    const words = normal(input.value).split(/\s+/).filter(Boolean);
    if (words.length && previousOpen === null) previousOpen = categories.map(c => c.open);
    let count = 0;
    for (const [i, category] of categories.entries()) {
      let matches = 0;
      for (const row of category.querySelectorAll('[data-search]')) {
        row.hidden = !words.every(word => normal(row.dataset.search).includes(word));
        if (!row.hidden) matches++;
      }
      count += matches;
      category.hidden = matches === 0;
      category.querySelector('.count').textContent = matches;
      if (words.length) category.open = matches > 0;
      else if (previousOpen !== null) category.open = previousOpen[i];
    }
    if (!words.length) previousOpen = null;
    clear.hidden = !input.value;
    document.querySelector('#empty').hidden = count !== 0;
    results.textContent = words.length ? `Найдено материалов: ${count}` : 'Выберите направление, чтобы увидеть процедуры';
    updateToggle();
  }
  input.addEventListener('input', search);
  document.querySelector('form').addEventListener('submit', event => event.preventDefault());
  clear.addEventListener('click', () => { input.value = ''; search(); input.focus(); });
  toggle.addEventListener('click', () => {
    const visible = categories.filter(c => !c.hidden);
    const open = !visible.every(c => c.open);
    visible.forEach(c => { c.open = open; });
    updateToggle();
  });
  categories.forEach(c => c.addEventListener('toggle', updateToggle));
  function followHash() {
    const category = categories.find(c => '#' + c.id === location.hash);
    if (category) category.open = true;
  }
  window.addEventListener('hashchange', followHash);
  followHash();
  search();
})();
