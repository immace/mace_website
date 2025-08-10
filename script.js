// ===== Имя, шапка, роли (оставил как лёгкий базис) =====
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const hero   = document.querySelector('.hero');

  // Показ/скрытие хедера при скролле за герой
  if (header && hero) {
    const io = new IntersectionObserver(([e])=>{
      header.classList.toggle('visible', !e.isIntersecting);
    }, {threshold: 0.01});
    io.observe(hero);
  }

  // ====== ПОРТФОЛИО ======
  const portfolio = document.getElementById('portfolio');
  if (!portfolio) return;

  // Список файлов в /assets (пример — подставь свои имена, как у тебя уже заведено)
  const assetFiles = [
    'Айдентика-Ростов-1.jpg','Айдентика-Ростов-2.jpg','Айдентика-Ростов-3.jpg','Айдентика-Ростов-4.jpg','Айдентика-Ростов-5.jpg','Айдентика-Ростов-6.jpg',
    'Логотип-Ростов-1.jpg',
    'Обложка-Нотное_издание-1.png','Обложка-Нотное_издание-2.png','Обложка-Нотное_издание-3.png','Обложка-Нотное_издание-4.png','Обложка-Нотное_издание-5.png',
    'Постер-Гувернантка-1.jpg','Постер-Гувернантка-2.jpg','Постер-Гувернантка-3.jpg','Постер-Гувернантка-4.jpg','Постер-Гувернантка-5.jpg',
    'Постер-Движение-1.jpg','Постер-Движение-2.jpg','Постер-Движение-3.jpg','Постер-Движение-4.jpg','Постер-Движение-5.jpg',
    'Постер-Майкл_Джексон-1.jpg','Постер-Майкл_Джексон-2.jpg','Постер-Форма-1.jpg'
  ];

  // Группируем по «Тип-Название»
  const postsMap = {};
  assetFiles.forEach(f=>{
    const [section, name, indexExt] = f.split('-');
    const index = parseInt(indexExt.split('.')[0],10);
    const key = `${section}-${name}`;
    if(!postsMap[key]) postsMap[key] = { type: section, name: name.replace(/_/g,' '), images: [] };
    postsMap[key].images.push({src:`assets/${f}`, index});
  });

  const posts = Object.values(postsMap)
    .map(p=>({ ...p, images: p.images.sort((a,b)=>a.index-b.index).map(i=>i.src) }));

  // Рендер
  const isDesktop = () => window.innerWidth >= 1024;

  posts.forEach((post, idx) => {
    const postEl = document.createElement('div');
    postEl.className = 'post';

    // На мобильном показываем тип/заголовок (на десктопе — нет)
    if (!isDesktop()) {
      const h3 = document.createElement('h3');
      h3.className = 'post-title';
      h3.textContent = post.type;
      postEl.appendChild(h3);
    }

    if (isDesktop()) {
      // ===== ДЕСКТОП =====
      if (idx === 0) {
        // Первый пост — карусель
        postEl.classList.add('post-is-first');
        postEl.appendChild(makeCarousel(post.images));
      } else {
        // Остальные: 2-колонки
        const body = document.createElement('div');
        body.className = 'post-body';

        // левая (большой кадр)
        const left = document.createElement('div');
        left.className = 'post-left';
        const big = document.createElement('img');
        big.src = post.images[0];
        big.alt = `${post.type} ${post.name}`;
        left.appendChild(big);

        // правая (миниатюры + мета)
        const right = document.createElement('div');
        right.className = 'post-right';

        const thumbs = document.createElement('div');
        thumbs.className = 'post-thumbs';
        // остальные снимки (если есть)
        if (post.images.length > 1) {
          post.images.slice(1).forEach(src=>{
            const im = document.createElement('img');
            im.src = src; im.alt = `${post.type} ${post.name}`;
            thumbs.appendChild(im);
          });
        }
        right.appendChild(thumbs);

        const meta = document.createElement('div');
        meta.className = 'post-meta';
        const name = document.createElement('span');
        name.className = 'post-name';
        name.textContent = post.name;
        const desc = document.createElement('span');
        desc.className = 'post-description';
        desc.textContent = 'описание: скоро';
        meta.appendChild(name);
        meta.appendChild(document.createTextNode(' · '));
        meta.appendChild(desc);
        right.appendChild(meta);

        body.appendChild(left);
        body.appendChild(right);
        postEl.appendChild(body);
      }
    } else {
      // ===== МОБИЛЬНЫЙ: все карусели =====
      postEl.appendChild(makeCarousel(post.images));
    }

    portfolio.appendChild(postEl);
  });

  // Карусель
  function makeCarousel(images){
    const carousel = document.createElement('div');
    carousel.className = 'carousel';
    const track = document.createElement('div');
    track.className = 'carousel-track';
    images.forEach(src=>{
      const img = document.createElement('img');
      img.src = src; img.alt = ''; img.loading = 'lazy';
      track.appendChild(img);
    });
    carousel.appendChild(track);

    if (isDesktop()) {
      // дубли для бесшовности
      images.forEach(src=>{
        const img = document.createElement('img');
        img.src = src; img.alt = ''; img.loading='lazy';
        track.appendChild(img);
      });
      // бесконечный бегунок
      let pos = 0;
      const step = ()=>{
        pos -= 0.5; // скорость
        const resetAt = track.scrollWidth/2;
        if (-pos >= resetAt) pos = 0;
        track.style.transform = `translateX(${pos}px)`;
        requestAnimationFrame(step);
      };
      step();
    }
    return carousel;
  }

  // перестраиваем при ресайзе (переключение мобильный/десктоп)
  let lastDesktop = isDesktop();
  window.addEventListener('resize', ()=>{
    const now = isDesktop();
    if (now !== lastDesktop) location.reload();
  });
});
