// ===== i18n (EN-only): no RU for now =====
const I18N = {
  en: {
    htmlLang: 'en',
    title: 'Macé · Graphic Designer',
    cta: 'Start a project →',
    roles: [
      'Graphic Designer',
      'Web Designer',
      'Illustrator',
      'Type Designer',
      'Brand Identity Designer',
      'Poster Designer'
    ],
    modal: {
      startTitle: 'Start a Project',
      startSub: 'Choose a service, enter your Telegram handle, and get the brief',
      what: 'What do you want to create?',
      tg: 'Telegram account',
      optLogo: 'Logo / Identity',
      optFont: 'Typeface (display / text)',
      optPattern: 'Apparel patterns / prints',
      optWeb: 'Website / UI design',
      optOther: 'Other (describe)',
      otherPh: 'Describe the task (naming, deck, merch)',
      tgPh: '@immalcev',
      tgErr: 'Invalid Telegram handle',
      hint: 'After submitting, your personalized brief will start downloading',
      submit: 'Get the brief',
      close: 'Close'
    },
    contacts: {
      ig: 'Instagram @immalcev',
      tg: 'Telegram @immalcev',
      mail: 'Email mace4681@gmail.com'
    },
    footerName: 'Macé',
    post: {
      descSoon: 'description: soon',
      // IMPORTANT: your filenames/categories are RU — we map RU category to EN label
      catMap: { 'Постер':'Poster', 'Айдентика':'Identity', 'Логотип':'Logo', 'Обложка':'Cover' }
    }
  }
};

function applyLangEN(){
  const t = I18N.en;

  document.documentElement.setAttribute('lang', t.htmlLang);
  document.title = t.title;

  // CTA
  const cta = document.getElementById('spm-open');
  if (cta) cta.textContent = t.cta;

  // Roles
  window.__roles_i18n = t.roles;

  // Modal texts
  const q = (sel)=>document.querySelector(sel);
  const setTxt = (sel, val)=>{ const el=q(sel); if(el) el.textContent = val; };

  setTxt('#spm-title', t.modal.startTitle);
  setTxt('.spm-sub', t.modal.startSub);

  const labelEls = document.querySelectorAll('.spm-label');
  if (labelEls[0]) labelEls[0].textContent = t.modal.what;
  if (labelEls[1]) labelEls[1].textContent = t.modal.tg;

  const opts = document.querySelectorAll('.spm-option span');
  if (opts[0]) opts[0].textContent = t.modal.optLogo;
  if (opts[1]) opts[1].textContent = t.modal.optFont;
  if (opts[2]) opts[2].textContent = t.modal.optPattern;
  if (opts[3]) opts[3].textContent = t.modal.optWeb;
  if (opts[4]) opts[4].textContent = t.modal.optOther;

  const other = q('#spm-other'); if (other) other.placeholder = t.modal.otherPh;
  const tg = q('#spm-tg'); if (tg) tg.placeholder = t.modal.tgPh;
  setTxt('#spm-tg-error', t.modal.tgErr);
  setTxt('.spm-hint', t.modal.hint);
  setTxt('#spm-submit', t.modal.submit);
  const closeBtn = q('#spm-close'); if (closeBtn) closeBtn.setAttribute('aria-label', t.modal.close);

  // Contacts aria
  const contacts = document.querySelectorAll('#contacts .bubble-wrap');
  if (contacts[0]) contacts[0].setAttribute('aria-label', t.contacts.ig);
  if (contacts[1]) contacts[1].setAttribute('aria-label', t.contacts.tg);
  if (contacts[2]) contacts[2].setAttribute('aria-label', t.contacts.mail);

  // Footer
  const foot = document.getElementById('footer-name');
  if (foot) foot.textContent = t.footerName;

  // If posts already rendered — translate category labels
  document.querySelectorAll('.post .post-title').forEach(el=>{
    const ru = el.getAttribute('data-ru') || el.textContent.trim();
    const map = t.post.catMap;
    el.textContent = map[ru] || ru;
  });
  document.querySelectorAll('.post-description').forEach(el=>{
    const descEl = el.querySelector('.post-desc');
    if (descEl) descEl.textContent = t.post.descSoon;
  });
}

// Init EN once
(function initEnglishOnly(){
  // Force EN for now
  localStorage.setItem('lang', 'en');
  applyLangEN();

  // If you have a language switch button in HTML — hide it for now (optional)
  const btn = document.getElementById('lang-switch');
  if (btn) btn.style.display = 'none';
})();

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
      this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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
    randomChar() { return this.chars[Math.floor(Math.random() * this.chars.length)]; }
  }

  const phrases = ['Dima Malcev', 'Macé'];
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

  // -- rotating roles (берём текущий словарь)
  let roles = window.__roles_i18n || I18N[localStorage.getItem('lang') || 'en'].roles;
  let roleIndex = 0;
  roleEl.textContent = roles[roleIndex];
  function changeRole() {
    // обновляем массив, если сменили язык
    roles = window.__roles_i18n || roles;

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

    if (getComputedStyle(carousel).display === 'none') return;

    track.style.height = '100%';
    track.style.alignItems = 'center';
    images.forEach(img => (img.loading = 'lazy'));

    images.forEach(img => track.appendChild(img.cloneNode(true)));

    let pos = 0;
    const step = () => {
      pos -= 0.5;
      const resetAt = track.scrollWidth / 2;
      if (-pos >= resetAt) pos = 0;
      track.style.transform = `translateX(${pos}px)`;
      requestAnimationFrame(step);
    };
    step();
  }

  // ===== data: files and ordering/filters =====
  const assetFiles = [
    'Айдентика-Ростов-1.jpg',
    'Айдентика-Ростов-2.jpg',
    'Айдентика-Ростов-3.jpg',
    'Айдентика-Ростов-4.jpg',
    'Айдентика-Ростов-5.jpg',
    'Айдентика-Ростов-6.jpg',
    'Логотип-Ростов-1.jpg',
    'Обложка-Нотное_издание-3.png',
    'Постер-Гувернантка-4.jpg',
    'Постер-Гувернантка-1.jpg',
    'Постер-Гувернантка-2.jpg',
    'Постер-Гувернантка-3.jpg',
    'Постер-Гувернантка-5.jpg',
    'Постер-Движение-1.jpg',
    'Постер-Движение-2.jpg',
    'Постер-Движение-3.jpg',
    'Постер-Движение-4.jpg',
    'Постер-Движение-5.jpg',
    'Постер-Форма-1.jpg'
  ];

  // Группируем по "Категория-Название"
  const postsMap = {};
  assetFiles.forEach(file => {
    const parts = file.split('-');
    if (parts.length < 2) return;

    const indexExt = parts.pop();
    const base = parts.join('-');
    const [section, ...rest] = base.split('-');
    const postName = rest.join('-');
    const index = parseInt(indexExt.split('.')[0], 10);

    const key = `${section}-${postName}`;
    if (!postsMap[key]) {
      postsMap[key] = {
        category: section,
        name: postName.replace(/_/g, ' '),
        images: []
      };
    }
    postsMap[key].images.push({ src: `/assets/${file}`, idx: isNaN(index) ? 0 : index });
  });

  // Сортируем изображения внутри поста
  const posts = Object.values(postsMap).map(post => {
    post.images.sort((a, b) => a.idx - b.idx);
    post.images = post.images.map(i => i.src);
    return post;
  });

  // ===== render =====
  const portfolio = document.getElementById('portfolio');
  const tPost = I18N.en.post;

  posts.forEach((post, idx) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'post';
    if (idx === 0) wrapper.classList.add('is-first');

    // Заголовок (тип поста)
    const topTitle = document.createElement('h3');
    topTitle.className = 'post-title';
    topTitle.setAttribute('data-ru', post.category); // чтобы при смене языка знать оригинал
    const mapped = tPost.catMap[post.category] || post.category;
    topTitle.textContent = mapped;
    wrapper.appendChild(topTitle);

    // Карусель
    const carousel = document.createElement('div');
    carousel.className = 'carousel';
    const track = document.createElement('div');
    track.className = 'carousel-track';
    post.images.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${mapped} ${post.name}`;
      img.loading = 'lazy';
      track.appendChild(img);
    });
    carousel.appendChild(track);
    wrapper.appendChild(carousel);

    // 2-колоночный корпус
    if (idx !== 0) {
      const body = document.createElement('div');
      body.className = 'post-body';

      const left = document.createElement('div');
      left.className = 'post-left';
      const cover = document.createElement('img');
      cover.className = 'post-cover';
      cover.src = post.images[0];
      cover.alt = `${mapped} ${post.name}`;
      cover.loading = 'lazy';
      left.appendChild(cover);

      const right = document.createElement('div');
      right.className = 'post-right';

      const thumbs = document.createElement('div');
      thumbs.className = 'post-thumbs';
      post.images.slice(1).forEach(src => {
        const t = document.createElement('img');
        t.src = src;
        t.alt = `${mapped} ${post.name}`;
        t.loading = 'lazy';
        thumbs.appendChild(t);
      });

      const meta = document.createElement('div');
      meta.className = 'post-meta';

      const type = document.createElement('p');
      type.className = 'post-title';
      type.setAttribute('data-ru', post.category);
      type.textContent = mapped;

      const desc = document.createElement('p');
      desc.className = 'post-description';
      const prettyName = post.name
        ? post.name[0].toUpperCase() + post.name.slice(1)
        : post.name;
      desc.innerHTML = `<span class="post-name">${prettyName}</span> · <span class="post-desc">${tPost.descSoon}</span>`;

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


// ==== Start Project Modal (Vanilla JS) ====
// (ниже — твой исходный код модалки, без функциональных изменений)
(function(){
  const BRIEFS = {
    logo: "/briefs/brief-logo.pdf",
    font: "/briefs/brief-font.pdf",
    pattern: "/briefs/brief-pattern.pdf",
    web: "/briefs/brief-web.pdf",
    general: "/briefs/brief-general.pdf",
  };
  const $ = (id)=>document.getElementById(id);
  const isValidTg = (u)=>/^[a-zA-Z0-9_]{5,32}$/.test(u);

  const openBtn = $('spm-open');
  const overlay = $('spm-overlay');
  const closeBtn = $('spm-close');
  const submitBtn = $('spm-submit');
  const otherWrap = $('spm-other-wrap');

  const tgCard = $('spm-tg-card');
  const tgInputWrap = $('spm-tg-inputwrap');
  const tgInput = $('spm-tg');
  const tgErr = $('spm-tg-error');
  const tgName = $('spm-tg-name');
  const tgAva = $('spm-ava-img');

  const serviceRadios = Array.from(document.querySelectorAll('input[name="spm-service"]'));

  function open(){ overlay.setAttribute('aria-hidden','false'); tgInput && tgInput.focus(); }
  function close(){ overlay.setAttribute('aria-hidden','true'); resetTg(); }

  openBtn && openBtn.addEventListener('click', open);
  closeBtn && closeBtn.addEventListener('click', close);
  overlay && overlay.addEventListener('click', (e)=>{ if(e.target===overlay) close(); });

  serviceRadios.forEach(r => r.addEventListener('change', ()=>{
    const checked = serviceRadios.find(x=>x.checked);
    otherWrap.classList.toggle('hidden', !(checked && checked.value==='other'));
  }));

  function resetTg(){
    tgInput.value = '';
    tgErr.classList.add('hidden');
    tgInputWrap.classList.remove('error');
    tgCard.classList.remove('glow');
    tgName.classList.add('hidden');
    tgName.textContent = '';
    tgAva.removeAttribute('src');
    submitBtn.disabled = true;
  }

  function updateTg(){
    const raw = tgInput.value.trim();
    const tg = raw.replace(/^@+/, '');
    if(!tg){ resetTg(); return; }

    if(!/^[a-zA-Z0-9_]{5,32}$/.test(tg)){
      tgErr.classList.remove('hidden');
      tgInputWrap.classList.add('error');
      tgCard.classList.remove('glow');
      tgName.classList.add('hidden');
      tgAva.removeAttribute('src');
      submitBtn.disabled = true;
      return;
    }

    // ✅ валидный ник
    tgErr.classList.add('hidden');
    tgInputWrap.classList.remove('error');
    tgCard.classList.add('glow');
    tgAva.src = `https://t.me/i/userpic/320/${tg}.jpg`;
    tgName.textContent = `@${tg}`;
    tgName.classList.remove('hidden');
    submitBtn.disabled = false;
  }

  tgInput && tgInput.addEventListener('input', updateTg);

  submitBtn && submitBtn.addEventListener('click', ()=>{
    const raw = tgInput.value.trim();
    const tg = raw.replace(/^@+/, '');
    if(!isValidTg(tg)) return;

    const checked = serviceRadios.find(r=>r.checked);
    const service = checked ? checked.value : 'general';
    const url = BRIEFS[service] || BRIEFS.general;
    const base = service==='general' ? 'brief-general' : `brief-${service}`;
    const filename = `${base}__@${tg}.pdf`;

    const a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    close();
  });
})();

(function(){
  const openLink = document.getElementById('spm-open');
  const overlay  = document.getElementById('spm-overlay');
  if (openLink && overlay) openLink.addEventListener('click', () => {
    overlay.setAttribute('aria-hidden','false');
    const inp = document.getElementById('spm-tg');
    inp && inp.focus();
  });
})();

function averageColorFromURL(url){
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    img.onload = () => {
      try{
        const w = 24, h = 24;
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const { data } = ctx.getImageData(0,0,w,h);
        let r=0,g=0,b=0,count=0;
        for(let i=0;i<data.length;i+=4){ r+=data[i]; g+=data[i+1]; b+=data[i+2]; count++; }
        r = Math.round(r/count); g = Math.round(g/count); b = Math.round(b/count);
        const toHex = (n)=>n.toString(16).padStart(2,'0');
        resolve(`#${toHex(r)}${toHex(g)}${toHex(b)}`);
      }catch(e){
        resolve('#a3c1d9');
      }
    };
    img.onerror = () => resolve('#a3c1d9');
    img.src = url;
  });
}

async function applyTgAccentFromAvatar(tg){
  const tgCard = document.getElementById('spm-tg-card');
  if (!tgCard) return;
  const avatarUrl = `https://t.me/i/userpic/320/${tg}.jpg`;
  const color = await averageColorFromURL(avatarUrl);
  tgCard.style.setProperty('--tg', color);
}

(function integrateTgColor(){
  const tgInput = document.getElementById('spm-tg');
  if (!tgInput) return;
  tgInput.addEventListener('input', async () => {
    const raw = tgInput.value.trim();
    const tg = raw.replace(/^@+/, '');
    if (!/^[a-zA-Z0-9_]{5,32}$/.test(tg)) return;
    await applyTgAccentFromAvatar(tg);
  });
})();

// 🎄 Reconstruction Countdown (MSK)
(() => {
  const modal = document.getElementById("reconModal");
  const closeBtn = document.getElementById("reconClose");

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  // Target date: 17 Jan 2026, 17:09 MSK (UTC+3)
  const target = new Date(Date.UTC(2026, 0, 17, 14, 9, 0)); // UTC time

  function updateTimer() {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateTimer();
  setInterval(updateTimer, 1000);

  closeBtn.addEventListener("click", () => {
    modal.style.opacity = "0";
    modal.style.pointerEvents = "none";
    setTimeout(() => modal.remove(), 300);
  });
})();
