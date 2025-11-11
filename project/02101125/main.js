/* ============================================================================
   MAIN.JS
   - Переключение тем и шрифтов
   - Анимация shine/параллакс для акцент-карточки
   - Анимация лавовой лампы (canvas)
   - Защита: контекстное меню, хоткеи PrintScreen/F12/Ctrl+Shift+I и пр.
   ========================================================================== */

/* ------------------------------
   Переключатель тем
   ------------------------------ */
const body = document.body;
const buttons = document.querySelectorAll('.switch-btn');

function setActiveTheme(name) {
  body.classList.remove('theme-burgundy', 'theme-orange', 'theme-purple');
  body.classList.add(`theme-${name}`);
  buttons.forEach(b => b.classList.toggle('is-active', b.dataset.theme === name));
  // Обновляем цвета лавы из CSS custom props
  updateLavaColors();
}
buttons.forEach(btn => {
  btn.addEventListener('click', () => setActiveTheme(btn.dataset.theme));
});

/* По умолчанию — бордовая */
setActiveTheme('burgundy');

/* ------------------------------
   Shine + 3D tilt на карточке
   ------------------------------ */
const card = document.getElementById('accentCard');
(function initShine() {
  const maxTilt = 10; // градусов
  let rect = card.getBoundingClientRect();

  function onMove(e) {
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;

    // координаты блика для ::before
    card.style.setProperty('--shine-x', `${px * 100}%`);
    card.style.setProperty('--shine-y', `${py * 100}%`);

    // 3D-поворот
    const rx = (py - 0.5) * -2 * maxTilt;
    const ry = (px - 0.5) * 2 * maxTilt;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  }

  function onLeave() {
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  }

  window.addEventListener('resize', () => { rect = card.getBoundingClientRect(); });
  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseleave', onLeave);
})();

/* ------------------------------
   ЛАВА-ЛАМПА (Canvas)
   ------------------------------ */
const canvas = document.getElementById('lava');
const ctx = canvas.getContext('2d', {alpha: true});

let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  // переразмещаем (чуть растягиваем поле)
  blobs.forEach(b => {
    b.x = Math.random() * W;
    b.y = Math.random() * H;
  });
});

const THEME = {
  lava: {
    c1: getComputedStyle(document.body).getPropertyValue('--lava-c1').trim() || '#8C2F39',
    c2: getComputedStyle(document.body).getPropertyValue('--lava-c2').trim() || '#591818',
  }
};

function updateLavaColors() {
  THEME.lava.c1 = getComputedStyle(document.body).getPropertyValue('--lava-c1').trim();
  THEME.lava.c2 = getComputedStyle(document.body).getPropertyValue('--lava-c2').trim();
}

/* Параметры лавы */
const BLOB_COUNT = 6;          // >4 по ТЗ
const BASE_ALPHA = 0.22;       // 0.18–0.32
const BLUR_PX = 60;            // мягкий blur
const MAX_R = Math.max(W, H) * 0.18;  // крупные шары
const MIN_R = Math.max(W, H) * 0.08;

class Blob {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = MIN_R + Math.random() * (MAX_R - MIN_R);
    const s = 0.3 + Math.random() * 0.6; // скорость
    const a = Math.random() * Math.PI * 2;
    this.vx = Math.cos(a) * s;
    this.vy = Math.sin(a) * s;
    this.jitter = 0.6 + Math.random() * 0.8; // лёгкий пульс радиуса
    this.phase = Math.random() * Math.PI * 2;
  }
  step(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // отскок от краёв
    if (this.x < -this.r*0.3 || this.x > W + this.r*0.3) this.vx *= -1;
    if (this.y < -this.r*0.3 || this.y > H + this.r*0.3) this.vy *= -1;

    // пульсация радиуса (морфинг)
    this.phase += 0.0025 * dt;
    const pulse = 1 + Math.sin(this.phase) * 0.08 * this.jitter;
    this.pr = this.r * pulse;
  }
  draw(g) {
    // радиальный градиент от c1 к c2
    const grad = g.createRadialGradient(this.x, this.y, this.pr*0.1, this.x, this.y, this.pr);
    grad.addColorStop(0, hexToRgba(THEME.lava.c1, BASE_ALPHA + 0.1));
    grad.addColorStop(1, hexToRgba(THEME.lava.c2, BASE_ALPHA - 0.04));

    g.fillStyle = grad;
    g.beginPath();
    g.arc(this.x, this.y, this.pr, 0, Math.PI * 2);
    g.fill();
  }
}

// Утилита: #RRGGBB -> rgba(...)
function hexToRgba(hex, a = 1) {
  const h = hex.replace('#','').trim();
  const bigint = parseInt(h.length === 3 ? h.split('').map(x=>x+x).join('') : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${a})`;
}

// Создаём шары
const blobs = Array.from({length: BLOB_COUNT}, () => new Blob());

let prev = performance.now();
function animate(now = performance.now()) {
  const dt = Math.min(60, now - prev);
  prev = now;

  // Очистка + режим сложения
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.filter = `blur(${BLUR_PX}px)`; // мягкий blur на всём слое

  // Рисуем шары
  for (const b of blobs) {
    b.step(dt);
    b.draw(ctx);
  }

  ctx.restore();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

/* ------------------------------
   Защита от копирования/инспектора (best effort)
   ------------------------------ */
document.addEventListener('contextmenu', (e) => e.preventDefault(), {passive: false});

document.addEventListener('keydown', (e) => {
  // F12
  if (e.key === 'F12' || e.keyCode === 123) {
    e.preventDefault(); e.stopPropagation();
  }
  // Ctrl+Shift+I / J / C (DevTools) и Ctrl+U (View Source)
  if ((e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key.toUpperCase())) ||
      (e.ctrlKey && e.key.toUpperCase() === 'U')) {
    e.preventDefault(); e.stopPropagation();
  }
  // PrintScreen (keyCode 44) — перехват на уровне браузера ограничен
  if (e.key === 'PrintScreen' || e.keyCode === 44) {
    e.preventDefault(); e.stopPropagation();
    // Мягкая реакция (best effort): затемнить на мгновение
    flashBlocker();
  }
});

// Визуальный флэш при попытках скриншота/инспектора (мягкий UX-ответ)
let blockerTimer = null;
function flashBlocker() {
  let overlay = document.getElementById('blocker-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'blocker-overlay';
    Object.assign(overlay.style, {
      position: 'fixed', inset: '0', zIndex: '9999',
      background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)',
      transition: 'opacity 200ms ease', opacity: '0'
    });
    document.body.appendChild(overlay);
  }
  overlay.style.opacity = '1';
  clearTimeout(blockerTimer);
  blockerTimer = setTimeout(() => { overlay.style.opacity = '0'; }, 300);
}
