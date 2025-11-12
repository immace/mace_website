/* ================== GLOBAL / THEMES ================== */
const body = document.body;

/* lava colors from CSS */
const THEME = { lava: { c1: '#8C2F39', c2: '#591818' } };
function updateLavaColors(){
  const s = getComputedStyle(body);
  THEME.lava.c1 = s.getPropertyValue('--lava1').trim() || THEME.lava.c1;
  THEME.lava.c2 = s.getPropertyValue('--lava2').trim() || THEME.lava.c2;
}

/* ================== THEME SWITCHER (macOS dots) ================== */
const dots = document.querySelectorAll('.theme-switcher.dots .dot');

function setTheme(name){
  body.classList.remove('theme-burgundy','theme-orange','theme-purple');
  body.classList.add(`theme-${name}`);
  dots.forEach(d => d.classList.toggle('is-active', d.dataset.theme === name));
  updateLavaColors();
}
dots.forEach(dot => dot.addEventListener('click', () => setTheme(dot.dataset.theme)));
setTheme('burgundy');   // первичная тема

/* ================== PERSISTENT TILT (very subtle) ================== */
const card = document.getElementById('accentCard');
(function persistentTilt(){
  if (!card) return;
  const maxTilt = 4;      // едва заметно
  const smooth  = 0.06;
  const oscAmp  = 0.02;
  let rect = card.getBoundingClientRect();
  let mouseX = 0.5, mouseY = 0.5;
  let targetX = 0.5, targetY = 0.5;

  card.addEventListener('mousemove', (e)=>{
    mouseX = (e.clientX - rect.left) / rect.width;
    mouseY = (e.clientY - rect.top)  / rect.height;
  });
  card.addEventListener('mouseleave', ()=>{ mouseX = 0.5; mouseY = 0.5; });
  window.addEventListener('resize', ()=>{ rect = card.getBoundingClientRect(); });

  function raf(now){
    const t = now * 0.0012;
    const ox = 0.5 + Math.sin(t*1.3) * oscAmp;
    const oy = 0.5 + Math.cos(t*1.1) * oscAmp;

    const mixX = ox*0.7 + mouseX*0.3;
    const mixY = oy*0.7 + mouseY*0.3;

    targetX += (mixX - targetX) * smooth;
    targetY += (mixY - targetY) * smooth;

    card.style.setProperty('--shine-x', `${targetX*100}%`);
    card.style.setProperty('--shine-y', `${targetY*100}%`);

    const rx = (targetY - 0.5) * -2 * maxTilt;
    const ry = (targetX - 0.5) *  2 * maxTilt;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
})();

/* ================== LAVA (canvas) ================== */
const canvas = document.getElementById('lava');
const ctx = canvas.getContext('2d', { alpha:true });
let W = canvas.width  = innerWidth;
let H = canvas.height = innerHeight;

addEventListener('resize', ()=>{
  W = canvas.width  = innerWidth;
  H = canvas.height = innerHeight;
  blobs.forEach(b => { b.x = Math.random()*W; b.y = Math.random()*H; });
});

const SPEED=0.3, COUNT=6, BLUR=60, ALPHA=0.26;

class Blob{
  constructor(){ this.reset(); }
  reset(){
    this.x = Math.random()*W;
    this.y = Math.random()*H;
    this.r = Math.max(W,H) * (.08 + .10*Math.random());
    const s = (.06 + .10*Math.random()) * SPEED;
    const a = Math.random() * Math.PI * 2;
    this.vx = Math.cos(a)*s;
    this.vy = Math.sin(a)*s;
    this.phase = Math.random()*Math.PI*2;
  }
  step(dt){
    this.x += this.vx*dt;  this.y += this.vy*dt;
    if(this.x < -this.r*.3 || this.x > W + this.r*.3) this.vx *= -1;
    if(this.y < -this.r*.3 || this.y > H + this.r*.3) this.vy *= -1;
    this.phase += .0025*dt;
    this.pr = this.r * (1 + Math.sin(this.phase)*.08);
  }
  draw(g){
    const grad = g.createRadialGradient(this.x,this.y,this.pr*.1, this.x,this.y,this.pr);
    grad.addColorStop(0, hexToRgba(THEME.lava.c1, ALPHA+.10));
    grad.addColorStop(1, hexToRgba(THEME.lava.c2, ALPHA-.05));
    g.fillStyle = grad;
    g.beginPath(); g.arc(this.x,this.y,this.pr,0,Math.PI*2); g.fill();
  }
}

function hexToRgba(h,a=1){
  const n = parseInt(h.replace('#',''),16);
  const r=(n>>16)&255, g=(n>>8)&255, b=n&255;
  return `rgba(${r},${g},${b},${a})`;
}

const blobs = Array.from({length:COUNT}, () => new Blob());
let prev = performance.now();

function anim(now=performance.now()){
  const dt = Math.min(60, now-prev); prev = now;
  ctx.clearRect(0,0,W,H);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.filter = `blur(${BLUR}px)`;
  for(const b of blobs){ b.step(dt); b.draw(ctx); }
  ctx.restore();
  requestAnimationFrame(anim);
}
requestAnimationFrame(anim);

/* ================== THUMBS & PARALLAX (main image) ================== */
(function(){
  const main = document.getElementById('pcMain');
  if(!main) return;

  // thumbs -> switch main image
  const thumbs = document.querySelectorAll('.pc-thumb');
  thumbs.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const src = btn.getAttribute('data-src');
      if (!src || main.src.endsWith(src)) return;
      main.style.opacity = '0';
      setTimeout(()=>{
        main.src = src;
        thumbs.forEach(t=>t.classList.remove('is-active'));
        btn.classList.add('is-active');
        main.onload = () => { main.style.opacity = '1'; };
      }, 120);
    });
  });

  // parallax while cursor over the glass card
  const MAX_TX = 14, MAX_TY = 10;
  let rect = card.getBoundingClientRect();

  function onMove(e){
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    main.style.transform = `translate3d(${x*MAX_TX}px, ${y*MAX_TY}px, 0) scale(1.04)`;
  }
  function onLeave(){ main.style.transform = 'translate3d(0,0,0) scale(1)'; }

  window.addEventListener('resize', () => { rect = card.getBoundingClientRect(); });
  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseleave', onLeave);
})();

/* === Lightbox fullscreen === */
(function(){
  const lightbox = document.getElementById('lightbox');
  const imgMain  = document.getElementById('pcMain');
  const imgLb    = document.getElementById('lightboxImage');
  const thumbs   = Array.from(document.querySelectorAll('.pc-thumb'));
  const btnPrev  = document.querySelector('.lb-prev');
  const btnNext  = document.querySelector('.lb-next');
  const btnClose = document.querySelector('.lb-close');
  let current = 0;

  // открыть
  function open(index=0){
    current = index;
    const src = thumbs[index]?.getAttribute('data-src') || imgMain.src;
    imgLb.src = src;
    lightbox.classList.add('active');
  }

  // закрыть
  function close(){
    lightbox.classList.remove('active');
  }

  // навигация
  function next(){
    current = (current + 1) % thumbs.length;
    imgLb.src = thumbs[current].getAttribute('data-src');
  }
  function prev(){
    current = (current - 1 + thumbs.length) % thumbs.length;
    imgLb.src = thumbs[current].getAttribute('data-src');
  }

  // клики
  imgMain.addEventListener('click',()=>open(current));
  btnClose.addEventListener('click',close);
  lightbox.addEventListener('click',e=>{
    if(e.target===lightbox) close();
  });
  btnNext.addEventListener('click',e=>{e.stopPropagation();next();});
  btnPrev.addEventListener('click',e=>{e.stopPropagation();prev();});

  // esc
  window.addEventListener('keydown',e=>{
    if(e.key==='Escape') close();
    if(e.key==='ArrowRight') next();
    if(e.key==='ArrowLeft') prev();
  });
})();

/* === LIGHT/DARK MODE TOGGLE (фон меняется, лава — нет) === */
(function(){
  const body = document.body;
  const toggleBtn = document.querySelector('.theme-switcher.dots .dot.toggle');

  function setMode(mode){
    body.setAttribute('data-mode', mode);
    // Лава берёт цвета из --lava1/--lava2, мы их НЕ трогаем
    if (typeof updateLavaColors === 'function') updateLavaColors();
    if (toggleBtn){
      toggleBtn.setAttribute('aria-pressed', mode === 'light' ? 'true' : 'false');
      toggleBtn.title = mode === 'light' ? 'Тёмная тема' : 'Светлая тема';
    }
  }
  function toggleMode(){
    setMode((body.getAttribute('data-mode') || 'dark') === 'dark' ? 'light' : 'dark');
  }
  if (toggleBtn) toggleBtn.addEventListener('click', toggleMode);

  // дефолт
  if (!body.hasAttribute('data-mode')) setMode('dark');
})();
