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

  // switch name every 8 seconds with fade animation
  setInterval(() => {
    nameEl.classList.add('fade');
    setTimeout(() => {
      nameIndex = (nameIndex + 1) % names.length;
      nameEl.textContent = names[nameIndex];
      nameEl.classList.remove('fade');
    }, 500);
  }, 8000);

  // switch role every 4 seconds with slide up/out effect
  const switchRole = () => {
    roleEl.classList.add('slide-up-out');
    setTimeout(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      roleEl.textContent = roles[roleIndex];
      roleEl.classList.remove('slide-up-out');
      roleEl.classList.add('slide-up-in');
    }, 250);
    setTimeout(() => {
      roleEl.classList.remove('slide-up-in');
    }, 500);
  };

  setInterval(switchRole, 4000);

  // initial animation
  roleEl.classList.add('slide-up-in');
  setTimeout(() => {
    roleEl.classList.remove('slide-up-in');
  }, 500);
});

