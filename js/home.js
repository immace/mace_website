// Выбор предустановленной услуги
(function servicePicker(){
  const wrap = document.querySelector('.sp-options');
  const hidden = document.getElementById('sp-hidden-service');
  const custom = document.getElementById('sp-custom');
  const form = document.getElementById('sp-form');

  if (!wrap || !form) return;

  wrap.addEventListener('click', (e)=>{
    const b = e.target.closest('button[data-service]');
    if (!b) return;
    wrap.querySelectorAll('button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    hidden.value = b.dataset.service;
    custom.value = '';
  });

  form.addEventListener('submit', (e)=>{
    // если пользователь написал своё — приоритет кастомного
    const val = custom.value.trim() || hidden.value.trim();
    const url = new URL(form.getAttribute('action'), location.origin);
    if (val) url.searchParams.set('service', val);
    // ведём на /shop/#consultation с параметром ?service=
    location.href = url.toString();
    e.preventDefault();
  });
})();
