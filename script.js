// Name scramble animation and header visibility

document.addEventListener('DOMContentLoaded', () => {
  const nameEl = document.getElementById('name');
  const headerNameEl = document.getElementById('header-name');
  let roleEl = document.getElementById('role');
  const roleWrapper = document.querySelector('.role-wrapper');

  // TextScramble class for letter shuffling effect
  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = 'абвгдeёжзийклмнопрстуфхцчшщъыьэюяABCDEFGHIJKLMNOPQRSTUVWXYZ';
      this.update = this.update.bind(this);
    }
    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise(resolve => this.resolve = resolve);
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 20);
        const end = start + Math.floor(Math.random() * 20);
        this.queue.push({from, to, start, end});
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
        let {from, to, start, end, char} = this.queue[i];
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

  const phrases = [
    'Дима Мальцев',
    'Мацэ'
  ];

  const fxMain = new TextScramble(nameEl);
  const fxHeader = new TextScramble(headerNameEl);
  let counter = 0;
  function next() {
    const phrase = phrases[counter];
    Promise.all([
      fxMain.setText(phrase),
      fxHeader.setText(phrase)
    ]).then(() => {
      setTimeout(next, 15000);
    });
    counter = (counter + 1) % phrases.length;
  }
  next();

  // Role rotation
  const roles = [
    'Графический дизайнер',
    'Веб-дизайнер',
    'Иллюстратор',
    'Дизайнер шрифтов',
    'Дизайнер айдентики',
    'Дизайнер постеров'
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

  const header = document.querySelector('header');
  const hero = document.querySelector('.hero');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        header.classList.remove('visible');
      } else {
        header.classList.add('visible');
      }
    });
  });

  observer.observe(hero);

  function setupCarousel(carousel) {
    const track = carousel.querySelector('.carousel-track');
    const images = Array.from(track.children);
    if (images.length === 0) return;

    const adjustHeight = () => {
      const mobile = window.innerWidth <= 768;
      if (mobile) {
        carousel.style.height = '';
      } else {
        const width = carousel.clientWidth;
        const ratio = images[0].naturalHeight / images[0].naturalWidth;
        carousel.style.height = `${width * ratio}px`;
      }
    };

    let loaded = 0;
    images.forEach(img => {
      img.addEventListener('load', () => {
        loaded++;
        if (loaded === images.length) {
          adjustHeight();
        }
      });
    });
    window.addEventListener('resize', adjustHeight);

    const mobile = window.innerWidth <= 768;
    if (mobile) {
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

    // duplicate images for seamless looping on desktop and ensure clones fit the carousel height
    images.forEach(img => {
      const clone = img.cloneNode(true);
      clone.style.height = '100%';
      clone.style.width = 'auto';
      track.appendChild(clone);
    });

    // continuous animation using requestAnimationFrame
    let pos = 0;
    const step = () => {
      pos -= 0.5;
      const resetAt = track.scrollWidth / 2;
      if (-pos >= resetAt) {
        pos = 0;
      }
      track.style.transform = `translateX(${pos}px)`;
      requestAnimationFrame(step);
    };
    step();
  }

  // Generate portfolio posts with image carousels
  const assetFiles = [
    'Айдентика-Ростов-1.jpg',
    'Айдентика-Ростов-2.jpg',
    'Айдентика-Ростов-3.jpg',
    'Айдентика-Ростов-4.jpg',
    'Айдентика-Ростов-5.jpg',
    'Айдентика-Ростов-6.jpg',
    'Логотип-Ростов-1.jpg',
    'Обложка-Нотное_издание-1.png',
    'Обложка-Нотное_издание-2.png',
    'Обложка-Нотное_издание-3.png',
    'Обложка-Нотное_издание-4.png',
    'Обложка-Нотное_издание-5.png',
    'Постер-Гувернантка-1.jpg',
    'Постер-Гувернантка-2.jpg',
    'Постер-Гувернантка-3.jpg',
    'Постер-Гувернантка-4.jpg',
    'Постер-Гувернантка-5.jpg',
    'Постер-Движение-1.jpg',
    'Постер-Движение-2.jpg',
    'Постер-Движение-3.jpg',
    'Постер-Движение-4.jpg',
    'Постер-Движение-5.jpg',
    'Постер-Майкл_Джексон-1.jpg',
    'Постер-Майкл_Джексон-2.jpg',
    'Постер-Форма-1.jpg'
  ];

  const postsMap = {};
  assetFiles.forEach(file => {
    const [section, postName, indexExt] = file.split('-');
    const key = `${section}-${postName}`;
    const index = parseInt(indexExt.split('.')[0], 10);
    if (!postsMap[key]) {
      postsMap[key] = {
        category: section,
        name: postName.replace(/_/g, ' '),
        images: []
      };
    }
    postsMap[key].images.push({ src: `assets/${file}`, index });
  });

  const posts = Object.values(postsMap);
  posts.forEach(post => {
    post.images.sort((a, b) => a.index - b.index);
    post.images = post.images.map(i => i.src);
  });

  const portfolio = document.getElementById('portfolio');
  posts.forEach(post => {
    const wrapper = document.createElement('div');
    wrapper.className = 'post';

    const topTitle = document.createElement('h3');
    topTitle.className = 'post-title';
    topTitle.textContent = post.category;
    wrapper.appendChild(topTitle);

    const carousel = document.createElement('div');
    carousel.className = 'carousel';
    const track = document.createElement('div');
    track.className = 'carousel-track';
    post.images.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${post.category} ${post.name}`;
      track.appendChild(img);
    });
    carousel.appendChild(track);
    wrapper.appendChild(carousel);

    const bottomTitle = document.createElement('p');
    bottomTitle.className = 'post-description';
    bottomTitle.textContent = post.name;
    wrapper.appendChild(bottomTitle);
    portfolio.appendChild(wrapper);
    setupCarousel(carousel);
  });
});

