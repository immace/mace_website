// Name and role rotation with letter-by-letter transformation

document.addEventListener('DOMContentLoaded', () => {
  const nameEl = document.getElementById('name');
  const roleEl = document.getElementById('role');

  const roles = [
    'Графический дизайнер',
    'Веб-дизайнер',
    'Иллюстратор',
    'Дизайнер шрифтов',
    'Дизайнер айдентики',
    'Дизайнер постеров'
  ];

  const holdTime = 24000; // ms to keep each final word
  const stepDelay = 1000; // ms between letter changes

  const stepsToMace = [
    'Дима Мальцев',
    'Диа Мальцев',
    'Да Мальцев',
    ' Мальцев',
    'Маьцев',
    'Маьце',
    'Маце',
    'Мацэ'
  ];

  const stepsToDima = [
    'Мацэ',
    'Маце',
    'Маьце',
    'Маьцев',
    ' Мальцев',
    'Да Мальцев',
    'Диа Мальцев',
    'Дима Мальцев'
  ];

  const transformDuration = stepDelay * (stepsToMace.length - 1);

  function runSequence(steps, index, done) {
    nameEl.textContent = steps[index];
    if (index < steps.length - 1) {
      setTimeout(() => runSequence(steps, index + 1, done), stepDelay);
    } else if (done) {
      done();
    }
  }

  let direction = 'toMace';

  function cycleNames() {
    if (direction === 'toMace') {
      runSequence(stepsToMace, 0, () => {
        direction = 'toDima';
        setTimeout(cycleNames, holdTime);
      });
    } else {
      runSequence(stepsToDima, 0, () => {
        direction = 'toMace';
        setTimeout(cycleNames, holdTime);
      });
    }
  }

  // start the cycle immediately on load
  cycleNames();

  // switch roles less frequently
  let roleIndex = 0;
  roleEl.textContent = roles[roleIndex];
  const roleInterval = holdTime * 2 + transformDuration;
  setInterval(() => {
    roleIndex = (roleIndex + 1) % roles.length;
    roleEl.textContent = roles[roleIndex];
  }, roleInterval);
});
