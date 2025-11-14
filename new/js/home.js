// HOME interactions: role rotation, smooth bg shift on scroll, service picker → /shop

// 1) АНИМАЦИЯ РОЛЕЙ (Graphic Designer ⇄ Web Designer ⇄ Illustrator)
(function roleRotate(){
  const el = document.getElementById('role');
  if (!el) return;
  const roles = ['Graphic Designer', 'Web Designer', 'Illustrator'];
  let i = 0;
  setInterval(()=>{
    i = (i + 1) % roles.length;
    el.style.opacity = 0;
    setTimeout(()=>{ el.textContent = roles[i]; el.style.opacity = 1; }, 220);
  }, 2600);
})();

// 2) ПЛАВНОЕ ИЗМЕНЕНИЕ ФОНА ПРИ СКРОЛЛЕ
(function bgShift(){
  const onScroll = () => {
    const ratio = Math.min(window.scrollY / (document.body.scrollHeight - innerHeight), 1);
    document.body.dataset.bg = (ratio > 0.18) ? 'mid' : '';
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
})();

// 3) ВЫБОР УСЛУГИ → /shop/#consultation?service=...
(function servicePicker(){
  const chips = document.getElementById('chips');
  const hidden = document.getElementById('sp-hidden-service');
  const custom = document.getElementById('sp-custom');
  const form = document.getElementById('sp-form');
  if (!chips || !form) return;

  chips.addEventListener('click', (e)=>{
    const b = e.target.closest('button[data-service]');
    if (!b) return;
    chips.querySelectorAll('button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    hidden.value = b.dataset.service;
    custom.value = '';
  });

  form.addEventListener('submit', (e)=>{
    const val = (custom.value.trim() || hidden.value.trim());
    const url = new URL(form.getAttribute('action'), location.origin);
    if (val) url.searchParams.set('service', val);
    location.href = url.toString();
    e.preventDefault();
  });
})();
