/* ================== ТЕМЫ / ГЛОБАЛ ================== */
const body = document.body;
const buttons = document.querySelectorAll('.switch-btn');
const indicator = document.querySelector('.liquid-indicator');

/* цвета лавы (обновляем из CSS-переменных) */
const THEME = {
  lava: {
    c1: getComputedStyle(document.body).getPropertyValue('--lava-c1').trim() || '#8C2F39',
    c2: getComputedStyle(document.body).getPropertyValue('--lava-c2').trim() || '#591818',
  }
};
function updateLavaColors(){
  const cs = getComputedStyle(document.body);
  THEME.lava.c1 = cs.getPropertyValue('--lava-c1').trim();
  THEME.lava.c2 = cs.getPropertyValue('--lava-c2').trim();
}

/* ============ Переключение тем + перемещение «жидкого» индикатора */
function moveIndicatorTo(btn){
  const sw = document.querySelector('.theme-switcher');
  const rWrap = sw.getBoundingClientRect();
  const rBtn = btn.getBoundingClientRect();
  const x = rBtn.left - rWrap.left + 6;             // padding 8 → +6 из стилей
  const w = rBtn.width;
  indicator.style.width = `${w}px`;
  indicator.style.transform = `translateX(${x}px)`;
}
function setActiveTheme(name){
  body.classList.remove('theme-burgundy','theme-orange','theme-purple');
  body.classList.add(`theme-${name}`);
  buttons.forEach(b => b.classList.toggle('is-active', b.dataset.theme === name));
  updateLavaColors();
  const active = [...buttons].find(b=>b.classList.contains('is-active'));
  if(active) moveIndicatorTo(active);
}
buttons.forEach(btn=>{
  btn.addEventListener('click',()=> setActiveTheme(btn.dataset.theme));
});
/* первичный рендер */
setActiveTheme('burgundy');
window.addEventListener('load',()=>{
  const active = document.querySelector('.switch-btn.is-active');
  if(active) moveIndicatorTo(active);
});
window.addEventListener('resize',()=>{
  const active = document.querySelector('.switch-btn.is-active');
  if(active) moveIndicatorTo(active);
});

/* ================== Постоянный 3D-tilt + shine ================== */
const card = document.getElementById('accentCard');
(function persistentTilt(){
  const maxTilt = 10;         // градусы
  let rect = card.getBoundingClientRect();
  let mouseX = 0.5, mouseY = 0.5;      // нормированные координаты (0..1)
  let targetX = 0.5, targetY = 0.5;    // цель для сглаживания
  const smooth = 0.08;                 // сглаживание мыши
  const oscAmp = 0.12;                 // амплитуда автоколебаний
  let t0 = performance.now();

  card.addEventListener('mousemove', (e)=>{
    mouseX = (e.clientX - rect.left) / rect.width;
    mouseY = (e.clientY - rect.top) / rect.height;
  });
  card.addEventListener('mouseleave', ()=>{
    mouseX = 0.5; mouseY = 0.5;
  });
  window.addEventListener('resize', ()=> rect = card.getBoundingClientRect());

  function raf(now){
    const dt = now - t0; t0 = now;
    // автоколебания
    const t = now * 0.0012; // скорость качания
    const ox = 0.5 + Math.sin(t*1.3) * oscAmp;
    const oy = 0.5 + Math.cos(t*1.1) * oscAmp;

    // плавно тянем цель к смеси автоколебаний и мыши (70/30)
    const mixX = ox*0.7 + mouseX*0.3;
    const mixY = oy*0.7 + mouseY*0.3;
    targetX += (mixX - targetX) * smooth;
    targetY += (mixY - targetY) * smooth;

    // shine
    card.style.setProperty('--shine-x', `${targetX*100}%`);
    card.style.setProperty('--shine-y', `${targetY*100}%`);

    // поворот
    const rx = (targetY - 0.5) * -2 * maxTilt;
    const ry = (targetX - 0.5) *  2 * maxTilt;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
})();

/* ================== ЛАВА (canvas) — медленнее ================== */
const canvas = document.getElementById('lava');
const ctx = canvas.getContext('2d', {alpha:true});
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

window.addEventListener('resize', ()=>{
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  blobs.forEach(b=>{ b.x = Math.random()*W; b.y = Math.random()*H; });
});

/* поддержка blur фильтра */
let supportFilter = true;
try{ ctx.filter = 'blur(1px)'; } catch{ supportFilter=false; }
if(ctx.filter !== 'blur(1px)') supportFilter=false;
ctx.filter = 'none';

const SPEED_FACTOR = 0.35;        // <— медленнее общего движения
const BLOB_COUNT = 6;
const BASE_ALPHA = 0.26;
const MAX_R = Math.max(W,H)*0.18;
const MIN_R = Math.max(W,H)*0.09;

class Blob{
  constructor(){ this.reset(); }
  reset(){
    this.x = Math.random()*W; this.y = Math.random()*H;
    this.r = MIN_R + Math.random()*(MAX_R - MIN_R);
    const s = (0.06 + Math.random()*0.10) * SPEED_FACTOR; // медленнее
    const a = Math.random()*Math.PI*2;
    this.vx = Math.cos(a)*s; this.vy = Math.sin(a)*s;
    this.jitter = 0.6 + Math.random()*0.8;
    this.phase = Math.random()*Math.PI*2;
  }
  step(dt){
    this.x += this.vx*dt; this.y += this.vy*dt;
    if(this.x < -this.r*0.3 || this.x > W + this.r*0.3) this.vx *= -1;
    if(this.y < -this.r*0.3 || this.y > H + this.r*0.3) this.vy *= -1;
    this.phase += 0.0020*dt;
    const pulse = 1 + Math.sin(this.phase)*0.08*this.jitter;
    this.pr = this.r*pulse;
  }
  draw(g){
    const grad = g.createRadialGradient(this.x,this.y,this.pr*0.1,this.x,this.y,this.pr);
    grad.addColorStop(0, hexToRgba(THEME.lava.c1, BASE_ALPHA + 0.10));
    grad.addColorStop(1, hexToRgba(THEME.lava.c2, BASE_ALPHA - 0.06));
    if(!supportFilter){ g.shadowColor = hexToRgba(THEME.lava.c1,0.6); g.shadowBlur=60; }
    g.fillStyle = grad; g.beginPath(); g.arc(this.x,this.y,this.pr,0,Math.PI*2); g.fill();
    if(!supportFilter){ g.shadowBlur=0; g.shadowColor='transparent'; }
  }
}
function hexToRgba(hex,a=1){const h=hex.replace('#','').trim();const f=h.length===3?h.split('').map(x=>x+x).join(''):h;const n=parseInt(f,16);const r=(n>>16)&255,g=(n>>8)&255,b=n&255;return `rgba(${r},${g},${b},${a})`;}
const blobs = Array.from({length:BLOB_COUNT},()=>new Blob());
let prev = performance.now();
function animate(now=performance.now()){
  const dt = Math.min(60, now-prev); prev = now;
  ctx.clearRect(0,0,W,H); ctx.save(); ctx.globalCompositeOperation='lighter';
  if(supportFilter) ctx.filter='blur(60px)';
  for(const b of blobs){ b.step(dt); b.draw(ctx); }
  if(supportFilter) ctx.filter='none'; ctx.restore();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

/* ================== Защита (best-effort) ================== */
const WATERMARK_TEXT = 'macé.art — demo';
let overlayWM=null;
function ensureWatermark(){
  if(overlayWM) return;
  overlayWM=document.createElement('div');
  Object.assign(overlayWM.style,{
    position:'fixed',inset:'0',zIndex:'9998',pointerEvents:'none',
    backgroundImage:
      `repeating-linear-gradient(45deg, rgba(255,255,255,.04) 0 40px, rgba(255,255,255,.08) 40px 80px),
       repeating-linear-gradient(-45deg, rgba(0,0,0,.03) 0 40px, rgba(0,0,0,.06) 40px 80px)`,
    mixBlendMode:'overlay'
  });
  const label=document.createElement('div'); label.textContent=WATERMARK_TEXT;
  Object.assign(label.style,{
    position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%) rotate(-18deg)',
    font:'700 28px/1.2 system-ui,sans-serif',letterSpacing:'2px',
    color:'rgba(255,255,255,.25)',textShadow:'0 1px 2px rgba(0,0,0,.2)'
  });
  overlayWM.appendChild(label); document.body.appendChild(overlayWM);
}
function flashBlocker(){
  let overlay=document.getElementById('blocker-overlay');
  if(!overlay){
    overlay=document.createElement('div'); overlay.id='blocker-overlay';
    Object.assign(overlay.style,{position:'fixed',inset:'0',zIndex:'9999',
      background:'rgba(0,0,0,.7)',backdropFilter:'blur(3px)',transition:'opacity 150ms ease',opacity:'0'});
    document.body.appendChild(overlay);
  }
  overlay.style.opacity='1'; setTimeout(()=>{overlay.style.opacity='0';},250);
}
ensureWatermark();

document.addEventListener('contextmenu',e=>e.preventDefault(),{passive:false});
document.addEventListener('keydown',(e)=>{
  if(e.key==='F12'||e.keyCode===123){e.preventDefault();e.stopPropagation();flashBlocker();}
  if((e.ctrlKey&&e.shiftKey&&['I','J','C'].includes(e.key.toUpperCase()))||
     (e.ctrlKey&&e.key.toUpperCase()==='U')||e.key==='PrintScreen'||e.keyCode===44){
    e.preventDefault();e.stopPropagation();flashBlocker();
  }
});
document.addEventListener('visibilitychange',()=>{ if(document.visibilityState!=='visible'){ flashBlocker(); }});
