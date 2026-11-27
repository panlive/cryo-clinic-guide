'use strict';
(() => {
  const input = document.querySelector('#search');
  const clear = document.querySelector('#clear');
  const toggle = document.querySelector('#toggle-all');
  const categories = [...document.querySelectorAll('.category')];
  const menus = categories.filter(category => category.matches('details'));
  const results = document.querySelector('#results');
  const normal = value => value.toLocaleLowerCase('ru').replaceAll('ё', 'е').replace(/[‑–—-]/g, ' ').trim();
  let previousOpen = null;
  const updateToggle = () => {
    const visible = menus.filter(c => !c.hidden);
    toggle.textContent = visible.every(c => c.open) ? 'Свернуть все' : 'Раскрыть все';
    toggle.hidden = visible.length === 0;
  };
  function search() {
    const words = normal(input.value).split(/\s+/).filter(Boolean);
    if (words.length && previousOpen === null) previousOpen = new Map(menus.map(menu => [menu, menu.open]));
    let count = 0;
    for (const category of categories) {
      const direct = category.matches('a[data-search]');
      let matches = 0;
      for (const row of direct ? [category] : category.querySelectorAll('[data-search]')) {
        row.hidden = !words.every(word => normal(row.dataset.search).includes(word));
        if (!row.hidden) matches++;
      }
      count += matches;
      category.hidden = matches === 0;
      if (!direct) {
        category.querySelector('.count').textContent = matches;
        if (words.length) category.open = matches > 0;
        else if (previousOpen !== null) category.open = previousOpen.get(category);
      }
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
    const visible = menus.filter(c => !c.hidden);
    const open = !visible.every(c => c.open);
    visible.forEach(c => { c.open = open; });
    updateToggle();
  });
  menus.forEach(c => c.addEventListener('toggle', updateToggle));
  function followHash() {
    const aliases = { '#category-12': '#category-11', '#category-14': '#category-5' };
    const hash = aliases[location.hash] ?? location.hash;
    const category = categories.find(c => '#' + c.id === hash);
    if (!category) return;
    if (category.matches('details')) category.open = true;
    if (hash !== location.hash) category.scrollIntoView({ block: 'start' });
  }
  window.addEventListener('hashchange', followHash);
  followHash();
  search();
})();
