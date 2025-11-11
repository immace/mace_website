// Защита от копирования и скриншотов
document.addEventListener('selectstart', e => e.preventDefault());
document.addEventListener('contextmenu', e => e.preventDefault());
window.addEventListener('keydown', function(e) {
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
    document.body.innerHTML = '<div style="background:#191919;color:#fff;font-size:1.6rem;display:flex;align-items:center;justify-content:center;height:100vh;">Доступ запрещён</div>';
  }
});

// Переключатель концепций
const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const concept1 = document.getElementById('concept1');
const concept2 = document.getElementById('concept2');

btn1.onclick = () => {
  btn1.classList.add('active'); btn2.classList.remove('active');
  concept1.style.display = 'block';
  concept2.style.display = 'none';
};
btn2.onclick = () => {
  btn2.classList.add('active'); btn1.classList.remove('active');
  concept2.style.display = 'block';
  concept1.style.display = 'none';
};
