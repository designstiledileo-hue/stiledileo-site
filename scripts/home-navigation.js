(() => {
  const menu = document.querySelector('.stile-menu, .mobile-menu');
  if (!menu) return;
  const trigger = menu.querySelector('summary');

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) menu.open = false;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !menu.open) return;
    menu.open = false;
    trigger.focus();
  });
  document.addEventListener('pointerdown', (event) => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  matchMedia('(max-width: 70em)').addEventListener('change', ({ matches }) => {
    if (!matches) menu.open = false;
  });
})();
