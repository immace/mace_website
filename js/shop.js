const items = [
  { slug:'logo',     img:'/assets/Логотип-Ростов-1.jpg',  price:'от 20 000 ₽' },
  { slug:'identity', img:'/assets/Айдентика-Ростов-1.jpg', price:'от 50 000 ₽' },
  { slug:'poster',   img:'/assets/Постер-Движение-1.jpg',  price:'от 10 000 ₽' },
  { slug:'cover',    img:'/assets/Обложка-Нотное_издание-3.png', price:'от 12 000 ₽' },
];

const grid = document.getElementById('services');
items.forEach(it=>{
  const el=document.createElement('article');
  el.className='card';
  el.innerHTML=`
    <img src="${it.img}" alt="${it.slug}">
    <div class="body">
      <div class="price">${it.price}</div>
      <div class="row">
        <a class="btn" href="/shop#${it.slug}">Подробнее</a>
        <a class="btn" href="#" data-slug="${it.slug}">Заказать</a>
      </div>
    </div>
  `;
  grid.appendChild(el);
});
grid.addEventListener('click',(e)=>{
  const btn = e.target.closest('a.btn[data-slug]');
  if(!btn) return;
  e.preventDefault();
  // авторизация → консультация
  alert('Авторизация через Telegram → затем окно «Консультация по графическому дизайну».');
  // после — редирект в твоего бота:
  // location.href = 'https://t.me/mace_assistant_bot?start=pay_consult';
});
