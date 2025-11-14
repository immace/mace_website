// /js/dark-bg.js — плавное изменение фона при скролле и шум
(function(){
  const body = document.body;
  const html = document.documentElement;

  // шумовая текстура
  const noise = document.createElement('div');
  Object.assign(noise.style, {
    position:'fixed', inset:'0',
    background:'url("https://grainy-gradients.vercel.app/static/noise.png") repeat',
    opacity:'.05', pointerEvents:'none', zIndex:'0'
  });
  document.body.appendChild(noise);

  // плавное изменение оттенка при скролле
  window.addEventListener('scroll', ()=>{
    const scrollTop = window.scrollY;
    const max = (html.scrollHeight - window.innerHeight);
    const ratio = Math.min(scrollTop / max, 1);

    // вычисляем холодный переход от #0a0b0d к #e9ecef
    const dark = 10 + ratio * 110; // 10 -> 120
    body.style.background = `linear-gradient(180deg, rgb(${dark},${dark+5},${dark+10}) 0%, rgb(${dark+20},${dark+25},${dark+30}) 90%)`;
  }, {passive:true});
})();
