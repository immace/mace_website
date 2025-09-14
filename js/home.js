// Ничего в базовый /script.js не лезем. Используем уже отрендеренные посты.

// 1) Вставляем панель лайк/коммент/шэр/корзина под каждой каруселью
function injectActions() {
  document.querySelectorAll('.post').forEach((post) => {
    if (post.querySelector('.post-actions')) return; // уже вставлено
    const actions = document.createElement('div');
    actions.className = 'post-actions';
    actions.innerHTML = `
      <button class="act-like"   aria-label="Like"><img src="/icons/like.svg"   alt=""></button>
      <button class="act-cmt"    aria-label="Comment"><img src="/icons/comment.svg" alt=""></button>
      <button class="act-share"  aria-label="Share"><img src="/icons/share.svg" alt=""></button>
      <button class="act-cart"   aria-label="Order"><img src="/icons/cart.svg"  alt=""></button>
    `;
    const carousel = post.querySelector('.carousel') || post.querySelector('.post-left');
    if (carousel) carousel.insertAdjacentElement('afterend', actions);

    // навигация корзины: по типу поста
    const typeEl = post.querySelector('.post-title');
    actions.querySelector('.act-cart').addEventListener('click', () => {
      const typeRu = typeEl?.getAttribute('data-ru') || '';
      const map = { 'Айдентика':'identity', 'Логотип':'logo', 'Постер':'poster', 'Обложка':'cover' };
      const slug = map[typeRu] || 'consult';
      location.href = `/shop#${slug}`;  // на карточку услуги типа
    });

    // лайк/коммент/шэр → авторизация (заглушки)
    ['.act-like','.act-cmt','.act-share'].forEach(sel=>{
      actions.querySelector(sel).addEventListener('click', openTelegramAuth);
    });
  });
}

// 2) «Три точки» → показать описание, в конце [Свернуть]
function enableDescriptions() {
  document.querySelectorAll('.post').forEach((post)=>{
    const desc = post.querySelector('.post-meta-under .post-description');
    if (!desc || desc.__prepared) return;
    const nameSpan = desc.querySelector('.post-name');
    const dots = document.createElement('span');
    dots.className = 'dots';
    dots.textContent = '•••';

    const full = document.createElement('span');
    full.className = 'full';
    full.textContent = ' описание появится позже.';
    const close = document.createElement('span');
    close.className='toggle-close';
    close.textContent='[свернуть]';

    // Превью (как сейчас: «Имя · описание: скоро»)
    const preview = document.createElement('span');
    preview.className='preview';
    preview.innerHTML = ` · <span class="post-desc">описание: скоро</span>`;

    desc.innerHTML='';
    desc.appendChild(nameSpan);
    desc.appendChild(preview);
    desc.appendChild(dots);
    desc.appendChild(full);
    desc.appendChild(close);
    desc.__prepared = true;

    dots.addEventListener('click', ()=> post.classList.add('open'));
    close.addEventListener('click', ()=> post.classList.remove('open'));
  });
}

// 3) Telegram авторизация (заглушка — сюда вставишь свой виджет)
function openTelegramAuth(){
  alert('Окно авторизации через Telegram. Я подключу твой виджет Login позже.');
  // сюда вставим Telegram Login Widget, а после — форму имени
}

// ререндер после того как базовый /script.js построил посты
window.addEventListener('load', ()=>{
  injectActions();
  enableDescriptions();
});
