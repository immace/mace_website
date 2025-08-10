// ===== main interactions (name scramble, roles, sticky header, portfolio render) =====
document.addEventListener('DOMContentLoaded', () => {
  // -- name + header text scramble
  const nameEl = document.getElementById('name');
  const headerNameEl = document.getElementById('header-name');
  let roleEl = document.getElementById('role');
  const roleWrapper = document.querySelector('.role-wrapper');

  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = 'абвгдeёжзийклмнопрстуфхцчшщъыьэюяABCDEFGHIJKLMNOPQRSTUVWXYZ';
      this.update = this.update.bind(this);
    }
    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise(resolve => (this.resolve = resolve));
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 20);
        const end = start + Math.floor(Math.random() * 20);
        this.queue.push({ from, to, start, end });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }
    update() {
      let output = '';
      let complete = 0;
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `<span class="dud">${char}</span>`;
        } else {
          output += from;
        }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame += 2;
      }
    }
    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }

  const phrases = ['Дима Мальцев', 'Мацэ'];
  const fxMain = new TextScramble(nameEl);
  const fxHeader = new TextScramble(headerNameEl);
  let counter = 0;
  function next() {
    const phrase = phrases[counter];
    Promise.all([fxMain.setText(phrase), fxHeader.setText(phrase)]).then(() => {
      setTimeout(next, 15000);
    });
    counter = (counter + 1) % phrases.length;
  }
  next();

  // -- rotating roles
  const roles = [
    'Графический дизайнер',
    'Веб-дизайнер',
    'Иллюстратор',
    'Дизайнер шрифтов',
    'Дизайнер айдентики',
    'Дизайнер постеров',
  ];
  let roleIndex = 0;
  roleEl.textContent = roles[roleIndex];
  function changeRole() {
    const nextIndex = (roleIndex + 1) % roles.length;
    const next = document.createElement('span');
    next.textContent = roles[nextIndex];
    next.classList.add('slide-in');
    roleWrapper.appendChild(next);
    roleEl.classList.add('slide-out');
    setTimeout(() => {
      roleWrapper.removeChild(roleEl);
      next.id = 'role';
      roleEl = next;
    }, 500);
    roleIndex = nextIndex;
  }
  setInterval(changeRole, 5000);

  // -- sticky header
  const header = document.querySelector('header');
  const hero = document.querySelector('.hero');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) header.classList.remove('visible');
      else header.classList.add('visible');
    });
  });
  observer.observe(hero);

  // ===== carousel logic =====
  function setupCarousel(carousel) {
    const track = carousel.querySelector('.carousel-track');
    const images = Array.from(track.children);
    if (images.length === 0) return;

    const mobile = window.innerWidth <= 768;
    if (mobile) {
      // мобилка: без автопрокрутки, индикаторы точками
      if (images.length > 1) {
        const indicators = document.createElement('div');
        indicators.className = 'carousel-indicators';
        images.forEach((_, i) => {
          const dot = document.createElement('span');
          if (i === 0) dot.classList.add('active');
          indicators.appendChild(dot);
        });
        carousel.appendChild(indicators);
        const updateIndicators = () => {
          const index = Math.round(carousel.scrollLeft / carousel.clientWidth);
          indicators.querySelectorAll('span').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
          });
        };
        carousel.addEventListener('scroll', updateIndicators);
      }
      return;
    }

    // десктоп: автопрокрутка только если карусель реально видима (по CSS она видима у первого поста)
    if (getComputedStyle(carousel).display === 'none') return;

    track.style.height = '100%';
    track.style.alignItems = 'center';
    images.forEach(img => (img.loading = 'lazy'));

    // дублируем кадры для бесконечной ленты
    images.forEach(img => track.appendChild(img.cloneNode(true)));

    let pos = 0;
    const step = () => {
      pos -= 0.5; // скорость
      const resetAt = track.scrollWidth / 2;
      if (-pos >= resetAt) pos = 0; // зацикливание
      track.style.transform = `translateX(${pos}px)`;
      requestAnimationFrame(step);
    };
    step();
  }

  // ===== data: files and ordering/filters =====
  // Скрыто: Нотное издание (1,2,4,5), Майкл Джексон (2)
  // Порядок "Гувернантка": 4, затем 1,2,3,5
  const assetFiles = [
    // Айдентика / Ростов
    'Айдентика-Ростов-1.jpg',
    'Айдентика-Ростов-2.jpg',
    'Айдентика-Ростов-3.jpg',
    'Айдентика-Ростов-4.jpg',
    'Айдентика-Ростов-5.jpg',
    'Айдентика-Ростов-6.jpg',

    // Отдельный пост "Логотип / Ростов" (одна картинка)
    'Логотип-Ростов-1.jpg',

    // Обложка / Нотное издание — ПОКАЗЫВАЕМ ТОЛЬКО №3
    // 'Обложка-Нотное_издание-1.png',
    // 'Обложка-Нотное_издание-2.png',
    'Обложка-Нотное_издание-3.png',
    // 'Обложка-Нотное_издание-4.png',
    // 'Обложка-Нотное_издание-5.png',

    // Постер / Гувернантка — порядок: 4, затем 1,2,3,5
    'Постер-Гувернантка-4.jpg',
    'Постер-Гувернантка-1.jpg',
    'Постер-Гувернантка-2.jpg',
    'Постер-Гувернантка-3.jpg',
    'Постер-Гувернантка-5.jpg',

    // Постер / Движение — все
    'Постер-Движение-1.jpg',
    'Постер-Движение-2.jpg',
    'Постер-Движение-3.jpg',
    'Постер-Движение-4.jpg',
    'Постер-Движение-5.jpg',

    // Постер / Майкл Джексон — ТОЛЬКО №1
    //'Постер-Майкл_Джексон-1.jpg',
    // 'Постер-Майкл_Джексон-2.jpg',

    // Постер / Форма — одна работа
    'Постер-Форма-1.jpg',
  ];

  // Группируем по "Категория-Название"
  const postsMap = {};
  assetFiles.forEach(file => {
    // Безопасный разбор: берём всё до последнего "-" как "section + postName",
    // а последнюю часть до точки считаем индексом
    const parts = file.split('-');
    if (parts.length < 2) return;

    const indexExt = parts.pop(); // например: "1.jpg"
    const base = parts.join('-'); // например: "Постер-Гувернантка"
    const [section, ...rest] = base.split('-');
    const postName = rest.join('-'); // "Гувернантка"

    const key = `${section}-${postName}`;
    const index = parseInt(indexExt.split('.')[0], 10);

    if (!postsMap[key]) {
      postsMap[key] = {
        category: section,
        name: postName.replace(/_/g, ' '),
        images: [],
      };
    }
    postsMap[key].images.push({ src: `/assets/${file}`, idx: isNaN(index) ? 0 : index });
  });

  // Сортируем картинки каждого поста по индексу и разворачиваем в массив src
  const posts = Object.values(postsMap).map(post => {
    post.images.sort((a, b) => a.idx - b.idx);
    post.images = post.images.map(i => i.src);
    return post;
  });

  // ===== render =====
  const portfolio = document.getElementById('portfolio');

  posts.forEach((post, idx) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'post';
    if (idx === 0) wrapper.classList.add('is-first'); // первый пост — карусель на десктопе

    // заголовок (тип поста)
    const topTitle = document.createElement('h3');
    topTitle.className = 'post-title';
    topTitle.textContent = post.category;
    wrapper.appendChild(topTitle);

    // Карусель (у всех; на десктопе видна только у первого благодаря CSS)
    const carousel = document.createElement('div');
    carousel.className = 'carousel';
    const track = document.createElement('div');
    track.className = 'carousel-track';
    post.images.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${post.category} ${post.name}`;
      img.loading = 'lazy';
      track.appendChild(img);
    });
    carousel.appendChild(track);
    wrapper.appendChild(carousel);

    // Для остальных постов (не первого) — двухколоночный корпус
    if (idx !== 0) {
      const body = document.createElement('div');
      body.className = 'post-body';

      // слева — обложка (теперь управляется по ширине в CSS)
      const left = document.createElement('div');
      left.className = 'post-left';
      const cover = document.createElement('img');
      cover.className = 'post-cover';
      cover.src = post.images[0];
      cover.alt = `${post.category} ${post.name}`;
      cover.loading = 'lazy';
      left.appendChild(cover);

      // справа — превью + текст
      const right = document.createElement('div');
      right.className = 'post-right';

      // превью остальных (3 в ряд; без жёсткой высоты — пусть подстраиваются)
      const thumbs = document.createElement('div');
      thumbs.className = 'post-thumbs';
      post.images.slice(1).forEach(src => {
        const t = document.createElement('img');
        t.src = src;
        t.alt = `${post.category} ${post.name}`;
        t.loading = 'lazy';
        thumbs.appendChild(t);
      });

      // текст: тип (чуть толще) + строка с названием/описанием (тоньше, с заглавной)
      const meta = document.createElement('div');
      meta.className = 'post-meta';

      const type = document.createElement('p');
      type.className = 'post-title'; // тот же стиль типа поста (жирнее/акцент)
      type.textContent = post.category;

      const desc = document.createElement('p');
      desc.className = 'post-description';
      const nameCap =
        post.name.length ? post.name[0].toUpperCase() + post.name.slice(1) : post.name;
      desc.textContent = `${nameCap} · описание: скоро`;

      meta.appendChild(type);
      meta.appendChild(desc);

      right.appendChild(thumbs);
      right.appendChild(meta);

      body.appendChild(left);
      body.appendChild(right);
      wrapper.appendChild(body);
    }

    portfolio.appendChild(wrapper);
    setupCarousel(carousel);
  });
});
