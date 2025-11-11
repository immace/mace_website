// Темы со всеми нужными стилями и текстами
const themes = {
  burgundy: {
    bg: 'linear-gradient(135deg, #380303 0%, #8C2F39 100%)',
    sphere: {color1: '#8C2F39', color2: '#591818'},
    title: 'Элитный стиль',
    subtitle: 'Строгий профессионализм',
    text: 'Сайт, который транслирует статус и надёжность. Строгая геометрия, прямолинейные решения.',
    h1font: "'Playfair Display', serif",
    h2font: "'Montserrat', sans-serif",
    pfont: "'Roboto', sans-serif"
  },
  orange: {
    bg: 'linear-gradient(135deg, #6E3B10 0%, #C46C23 100%)',
    sphere: {color1: '#C46C23', color2: '#884610'},
    title: 'Дружелюбный стиль',
    subtitle: 'Тепло и доступность',
    text: 'Сайт, вызывающий доверие, плавные формы, тепло и забота.',
    h1font: "'Quicksand', sans-serif",
    h2font: "'Comfortaa', sans-serif",
    pfont: "'Open Sans', sans-serif"
  },
  purple: {
    bg: 'linear-gradient(135deg, #380D9C 0%, #8A53E9 100%)',
    sphere: {color1: '#8A53E9', color2: '#693AD4'},
    title: 'Креативный стиль',
    subtitle: 'Современность и энергия',
    text: 'Сайт, который захватывает, удивляет и мотивирует к действию. Футуристические формы, glow-эффекты.',
    h1font: "'Space Grotesk', sans-serif",
    h2font: "'Poppins', sans-serif",
    pfont: "'Segoe UI', sans-serif"
  }
};

// Переключение темы
function setTheme(theme='burgundy') {
  document.body.style.background = themes[theme].bg;
  document.getElementById('title').textContent = themes[theme].title;
  document.getElementById('subtitle').textContent = themes[theme].subtitle;
  document.getElementById('text').textContent = themes[theme].text;
  document.getElementById('title').style.fontFamily = themes[theme].h1font;
  document.getElementById('subtitle').style.fontFamily = themes[theme].h2font;
  document.getElementById('text').style.fontFamily = themes[theme].pfont;
  drawSphere(themes[theme].sphere.color1, themes[theme].sphere.color2);
  document.querySelectorAll('#theme-switcher button').forEach(btn=>btn.classList.remove('active'));
  document.querySelector(`#theme-switcher button[data-theme="${theme}"]`).classList.add('active');
}

// Обработка кликов по кнопкам тем
document.querySelectorAll('#theme-switcher button').forEach(btn=>{
  btn.onclick = ()=>setTheme(btn.dataset.theme);
});
setTheme(); // сразу применить тему 1

// 3D-Шар: вращение блика по движению мышки
let lightX = 180, lightY = 160;
function drawSphere(c1, c2) {
  const canvas = document.getElementById('sphere');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Основной градиент
  const grad = ctx.createRadialGradient(180,250,90,180,250,186);
  grad.addColorStop(0, c1); grad.addColorStop(1, c2);
  ctx.beginPath(); ctx.arc(180,250,125,0,2*Math.PI);
  ctx.fillStyle = grad; ctx.fill();

  // Shine — динамическая "блик"-область
  const shineGrad = ctx.createRadialGradient(lightX,lightY,8,lightX,lightY,40);
  shineGrad.addColorStop(0, 'rgba(255,255,255,0.55)');
  shineGrad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.beginPath(); ctx.arc(180,250,120,0,2*Math.PI);
  ctx.fillStyle = shineGrad; ctx.fill();
}

document.getElementById('sphere').addEventListener('mousemove', function(e){
  // Корректная координата блика
  const rect = this.getBoundingClientRect();
  lightX = e.clientX - rect.left;
  lightY = e.clientY - rect.top;
  // Красим
  const theme = document.querySelector('#theme-switcher .active').dataset.theme;
  drawSphere(themes[theme].sphere.color1, themes[theme].sphere.color2);
});
document.getElementById('sphere').addEventListener('mouseleave', function(){
  // Вернуть на середину
  lightX=180; lightY=160;
  const theme = document.querySelector('#theme-switcher .active').dataset.theme;
  drawSphere(themes[theme].sphere.color1, themes[theme].sphere.color2);
});

// --- Защита от копирования ---
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
