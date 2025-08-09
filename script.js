// Rotate name and roles on the hero section
// Name switches every 8 seconds between "Мацэ" and "Дима"
// Role switches every 4 seconds with slide-up animation

document.addEventListener('DOMContentLoaded', () => {
  const names = ['Мацэ', 'Дима'];
  const roles = [
    'Графический дизайнер',
    'Веб-дизайнер',
    'Иллюстратор',
    'Дизайнер шрифтов',
    'Дизайнер айдентики',
    'Дизайнер постеров'
  ];

  const nameEl = document.getElementById('name');
  const roleEl = document.getElementById('role');

  let nameIndex = 0;
  let roleIndex = 0;

  // switch name every 8 seconds
  setInterval(() => {
    nameIndex = (nameIndex + 1) % names.length;
    nameEl.textContent = names[nameIndex];
  }, 8000);

  // helper to trigger slide animation
  const animateRole = () => {
    roleEl.classList.remove('slide');
    // Trigger reflow to restart the animation
    void roleEl.offsetWidth;
    roleEl.classList.add('slide');
  };

  // switch role every 4 seconds
  setInterval(() => {
    roleIndex = (roleIndex + 1) % roles.length;
    roleEl.textContent = roles[roleIndex];
    animateRole();
  }, 4000);

  // run animation on initial load
  animateRole();
});

