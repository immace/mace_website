// Темы: цвета, стили, фоновые параметры
const themes = {
  burgundy: {
    class: "burgundy",
    accent: "#FFEBDD",
    shadow: "0 18px 58px 0 rgba(140,47,57,0.22)",
    title: "Просто заголовок",
    subtitle: "Подзаголовок",
    text: "Пример текста пример текста пример текста…",
    lava: [
      { color: "#8C2F39", colorTo: "#591818" }
    ],
    fonts: {
      h1: "'Playfair Display', serif",
      h2: "'Montserrat', sans-serif",
      p: "'Roboto', sans-serif"
    }
  },
  orange: {
    class: "orange",
    accent: "#FFF6E3",
    shadow: "0 18px 58px 0 rgba(196,108,35,0.16)",
    title: "Просто заголовок",
    subtitle: "Подзаголовок",
    text: "Пример текста пример текста пример текста…",
    lava: [
      { color: "#C46C23", colorTo: "#884610" }
    ],
    fonts: {
      h1: "'Quicksand', sans-serif",
      h2: "'Comfortaa', sans-serif",
      p: "'Open Sans', sans-serif"
    }
  },
  purple: {
    class: "purple",
    accent: "#F0E8FF",
    shadow: "0 18px 58px 0 rgba(138,83,233,0.13)",
    title: "Просто заголовок",
    subtitle: "Подзаголовок",
    text: "Пример текста пример текста пример текста…",
    lava: [
      { color: "#8A53E9", colorTo: "#693AD4" }
    ],
    fonts: {
      h1: "'Space Grotesk', sans-serif",
      h2: "'Poppins', sans-serif",
      p: "'Segoe UI', sans-serif"
    }
  }
};

// Переключение темы
function setTheme(themeKey='burgundy') {
  document.body.className = themes[themeKey].class;
  document.getElementById('title').textContent = themes[themeKey].title;
  document.getElementById('subtitle').textContent = themes[themeKey].subtitle;
  document.getElementById('text').textContent = themes[themeKey].text;
  document.getElementById('title').style.fontFamily = themes[themeKey].fonts.h1;
  document.getElementById('subtitle').style.fontFamily = themes[themeKey].fonts.h2;
  document.getElementById('text').style.fontFamily = themes[themeKey].fonts.p;
  drawLavaLamp(themes[themeKey].lava);
  document.querySelectorAll('#theme-switcher button').forEach(btn=>btn.classList.remove('active'));
  document.querySelector(`#theme-switcher button[data-theme="${themeKey}"]`).classList.add('active');
}
document.querySelectorAll('#theme-switcher button').forEach(btn=>{
  btn.onclick = ()=>setTheme(btn.dataset.theme);
});
setTheme('burgundy');

// --- 3D shine на квадрате
const square = document.getElementById('accent-square');
square.addEventListener('mousemove', function(e){
  const rect = square.getBoundingClientRect();
  let x = e.clientX - rect.left - 80;
  let y = e.clientY - rect.top - 40;
  square.style.setProperty('--shine-x', `${Math.max(0, x)}px`);
  square.style.setProperty('--shine-y', `${Math.max(0, y)}px`);
});
square.addEventListener('mouseleave', function(){
  square.style.setProperty('--shine-x', `60px`);
  square.style.setProperty('--shine-y', `38px`);
});

// --- Лавовая лампа на canvas (colorful blobs)
const canvas = document.getElementById('lava');
const ctx = canvas.getContext('2d');
let w = window.innerWidth, h = window.innerHeight;
canvas.width = w; canvas.height = h;
window.addEventListener('resize', ()=>{
  w = window.innerWidth; h = window.innerHeight;
  canvas.width = w; canvas.height = h;
});

let blobs = [];
function drawLavaLamp(colors) {
  blobs = [];
  // Генерируем 4 больших шара разных цветов на экране с мягким blur и alpha
  for(let i=0;i<4;i++){
    const col = colors[0];
    blobs.push({
      x: Math.random()*w, y: Math.random()*h,
      r: 220+Math.random()*150,
      dx: 0.5 + Math.random()*0.7, dy: 0.5 + Math.random()*0.7,
      a: 0.23+0.09*Math.random(),
      color1: col.color,
      color2: col.colorTo,
      phase: Math.random()*6.28
    });
  }
}
function animateLava() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(const b of blobs) {
    // Пульсация радиуса
    let r = b.r + Math.sin(Date.now()/1100 + b.phase)*25;
    let grad = ctx.createRadialGradient(b.x, b.y, r*0.4, b.x, b.y, r);
    grad.addColorStop(0, b.color1);
    grad.addColorStop(1, b.color2);
    ctx.globalAlpha = b.a;
    ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, 2*Math.PI);
    ctx.fillStyle = grad; ctx.fill();
    // движение
    b.x += b.dx*(Math.sin((Date.now()/600)+b.phase)*0.9+1.1);
    b.y += b.dy*(Math.sin((Date.now()/700)-b.phase)*0.7+1.3);
    // отскок от краёв
    if(b.x-r<0||b.x+r>w) b.dx*=-1;
    if(b.y-r<0||b.y+r>h) b.dy*=-1;
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(animateLava);
}
drawLavaLamp(themes['burgundy'].lava);
animateLava();

// --- Защита (скриншоты, копирование)
document.addEventListener('selectstart', e => e.preventDefault());
document.addEventListener('contextmenu', e => e.preventDefault());
window.addEventListener('keydown', function(e) {
  if (
    e.key === 'PrintScreen' ||
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && e.key?.toUpperCase() === 'I')
  ) {
    document.body.innerHTML = `<div style="background:#191919;color:#fff;font-size:2rem;display:flex;align-items:center;justify-content:center;height:100vh;">Доступ запрещён</div>`;
  }
});
