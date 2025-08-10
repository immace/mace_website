// ===== main interactions (name scramble, roles, sticky header) =====
document.addEventListener('DOMContentLoaded', () => {
  // ... (всё верхнее без изменений)

  // ===== data / render =====
  const assetFiles = [
    'Айдентика-Ростов-1.jpg',
    'Айдентика-Ростов-2.jpg',
    'Айдентика-Ростов-3.jpg',
    'Айдентика-Ростов-4.jpg',
    'Айдентика-Ростов-5.jpg',
    'Айдентика-Ростов-6.jpg',
    'Логотип-Ростов-1.jpg',

    'Обложка-Нотное_издание-3.png',

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

    'Постер-Форма-1.jpg'
  ];

  const postsMap = {};
  assetFiles.forEach(file => {
    const [section, postName] = file.split('-');
    const key = `${section}-${postName}`;
    if (!postsMap[key]) {
      postsMap[key] = {
        category: section,
        name: postName.replace(/_/g, ' '),
        images: []
      };
    }
    postsMap[key].images.push(`/assets/${file}`);
  });

  const posts = Object.values(postsMap);

  const portfolio = document.getElementById('portfolio');

  posts.forEach((post, idx) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'post';
    if (idx === 0) wrapper.classList.add('is-first');

    // верхний тип поста
    const topTitle = document.createElement('h3');
    topTitle.className = 'post-title';
    topTitle.textContent = post.category;
    wrapper.appendChild(topTitle);

    // карусель
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

    // двухколоночный блок (не для первого)
    if (idx !== 0) {
      const body = document.createElement('div');
      body.className = 'post-body';

      const left = document.createElement('div');
      left.className = 'post-left';
      const cover = document.createElement('img');
      cover.className = 'post-cover';
      cover.src = post.images[0];
      cover.alt = `${post.category} ${post.name}`;
      cover.loading = 'lazy';
      left.appendChild(cover);

      const right = document.createElement('div');
      right.className = 'post-right';

      const thumbs = document.createElement('div');
      thumbs.className = 'post-thumbs';
      post.images.slice(1).forEach(src => {
        const t = document.createElement('img');
        t.src = src;
        t.alt = `${post.category} ${post.name}`;
        t.loading = 'lazy';
        thumbs.appendChild(t);
      });

      const meta = document.createElement('div');
      meta.className = 'post-meta';

      const type = document.createElement('p');
      type.className = 'post-title';
      type.textContent = post.category;

      const desc = document.createElement('p');
      desc.className = 'post-description';
      // имя поста делаем жирным через span.post-name
      desc.innerHTML = `<span class="post-name">${post.name}</span> · Описание: скоро`;

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

  // ... (setupCarousel и остальной код без изменений)
});
