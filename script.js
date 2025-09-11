/* =====================================================================
   i18n + UI glue (fixed switch, safe translations, no text overlap)
   ===================================================================== */
(function(){
  const I18N = {
    ru: {
      htmlLang: 'ru',
      title: 'Мацэ́ · Графический дизайнер',
      cta: 'Создать дизайн →',
      roles: ['Графический дизайнер','Веб-дизайнер','Иллюстратор','Дизайнер шрифтов','Дизайнер айдентики','Дизайнер постеров'],
      modal: {
        startTitle:'Начать проект',
        startSub:'Выберите услугу, укажите ник Telegram и получите бриф',
        what:'Что хотите создать?',
        tg:'Telegram аккаунт',
        optLogo:'Логотип / айдентика',
        optFont:'Шрифт (display / text)',
        optPattern:'Дизайн на лекало / принты',
        optWeb:'Дизайн сайта / UI',
        optOther:'Другое (опишите)',
        otherPh:'Опишите задачу (нейминг, презентация, мерч)',
        tgPh:'@immalcev',
        tgErr:'Недействительный ник Telegram',
        hint:'После отправки начнётся загрузка персонального брифа',
        submit:'Получить бриф',
        close:'Закрыть'
      },
      contacts:{ ig:'Instagram @immalcev', tg:'Telegram @immalcev', mail:'Email mace4681@gmail.com' },
      footerName:'Мацэ',
      post:{ descSoon:'описание: скоро', catMap:{'Постер':'Постер','Айдентика':'Айдентика','Логотип':'Логотип','Обложка':'Обложка'} },
      switchLabel:'EN'
    },
    en: {
      htmlLang: 'en',
      title: 'Macé · Graphic Designer',
      cta: 'Start a project →',
      roles: ['Graphic Designer','Web Designer','Illustrator','Type Designer','Brand Identity Designer','Poster Designer'],
      modal: {
        startTitle:'Start a Project',
        startSub:'Choose a service, enter your Telegram handle, and get the brief',
        what:'What do you want to create?',
        tg:'Telegram account',
        optLogo:'Logo / Identity',
        optFont:'Typeface (display / text)',
        optPattern:'Apparel patterns / prints',
        optWeb:'Website / UI design',
        optOther:'Other (describe)',
        otherPh:'Describe the task (naming, deck, merch)',
        tgPh:'@immalcev',
        tgErr:'Invalid Telegram handle',
        hint:'After submitting, your personalized brief will start downloading',
        submit:'Get the brief',
        close:'Close'
      },
      contacts:{ ig:'Instagram @immalcev', tg:'Telegram @immalcev', mail:'Email mace4681@gmail.com' },
      footerName:'Macé',
      post:{ descSoon:'description: soon', catMap:{'Постер':'Poster','Айдентика':'Identity','Логотип':'Logo','Обложка':'Cover'} },
      switchLabel:'RU'
    }
  };

  // обратная карта, чтобы вернуть EN -> RU даже если data-ru нет
  const REV = { 'Poster':'Постер','Identity':'Айдентика','Logo':'Логотип','Cover':'Обложка' };

  function isLikelyRussia(){
    const langs = navigator.languages || [navigator.language || ''];
    const hasRu = langs.some(l => /^ru\b/i.test(l||''));
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const isRuTZ = /Europe\/Kaliningrad|Europe\/Moscow|Europe\/Samara|Asia\/(Yekaterinburg|Omsk|Krasnoyarsk|Irkutsk|Yakutsk|Vladivostok|Sakhalin|Magadan|Kamchatka)/.test(tz);
    const locale = Intl.DateTimeFormat().resolvedOptions().locale || '';
    const regionRU = /-RU\b/i.test(locale);
    return hasRu && (isRuTZ || regionRU);
  }

  function ensureSwitch(){
    if (document.getElementById('lang-switch')) return;
    const b = document.createElement('button');
    b.id = 'lang-switch'; b.className = 'lang-switch'; b.type = 'button';
    document.body.appendChild(b);
  }

  function resetRoles(lang){
    const t = I18N[lang];
    const roleWrap = document.querySelector('.role-wrapper');
    if (!roleWrap) return;
    roleWrap.innerHTML = '';
    const span = document.createElement('span');
    span.id = 'role';
    span.textContent = t.roles[0];
    roleWrap.appendChild(span);
    window.__roles_i18n = t.roles.slice();
    window.__roleIndex = 0;

    if (window.__rolesInterval) clearInterval(window.__rolesInterval);
    window.__rolesInterval = setInterval(() => {
      const roles = window.__roles_i18n || t.roles;
      let i = (window.__roleIndex || 0) + 1; if (i >= roles.length) i = 0;
      const el = roleWrap.querySelector('#role'); if (el) el.textContent = roles[i];
      window.__roleIndex = i;
    }, 5000);
  }

  function translatePosts(lang){
    const t = I18N[lang];
    document.querySelectorAll('.post .post-title').forEach(el=>{
      let original = el.getAttribute('data-ru');
      if (!original) {
        const current = (el.textContent || '').trim();
        original = REV[current] || current; // если был EN — восстановим RU
        el.setAttribute('data-ru', original);
      }
      const mapped = t.post.catMap[original] || original;
      el.textContent = mapped;
    });
    document.querySelectorAll('.post-description .post-desc').forEach(el=>{
      el.textContent = t.post.descSoon;
    });
  }

  function applyLang(lang){
    const t = I18N[lang] || I18N.en;
    document.documentElement.setAttribute('lang', t.htmlLang);
    document.title = t.title;

    const switchBtn = document.getElementById('lang-switch');
    if (switchBtn) switchBtn.textContent = t.switchLabel;

    const cta = document.getElementById('spm-open');
    if (cta) cta.textContent = t.cta;

    // modal texts (если модалка на странице)
    const $ = s => document.querySelector(s);
    const txt = (s,v)=>{ const el=$(s); if(el) el.textContent=v; };
    txt('#spm-title', t.modal.startTitle);
    txt('.spm-sub', t.modal.startSub);
    const labels = document.querySelectorAll('.spm-label');
    if (labels[0]) labels[0].textContent = t.modal.what;
    if (labels[1]) labels[1].textContent = t.modal.tg;

    const opts = document.querySelectorAll('.spm-option span');
    if (opts[0]) opts[0].textContent = t.modal.optLogo;
    if (opts[1]) opts[1].textContent = t.modal.optFont;
    if (opts[2]) opts[2].textContent = t.modal.optPattern;
    if (opts[3]) opts[3].textContent = t.modal.optWeb;
    if (opts[4]) opts[4].textContent = t.modal.optOther;

    const other = $('#spm-other'); if (other) other.placeholder = t.modal.otherPh;
    const tg = $('#spm-tg'); if (tg) tg.placeholder = t.modal.tgPh;
    txt('#spm-tg-error', t.modal.tgErr);
    txt('.spm-hint', t.modal.hint);
    txt('#spm-submit', t.modal.submit);

    // footer (если есть)
    const foot = document.getElementById('footer-name'); if (foot) foot.textContent = t.footerName;

    // roles + posts
    resetRoles(lang);
    translatePosts(lang);
  }

  function wireModal(){
    const overlay = document.getElementById('spm-overlay');
    const openBtn = document.getElementById('spm-open');
    const closeBtn = document.getElementById('spm-close');
    if (!overlay) return;
    const open = (e)=>{ if(e) e.preventDefault(); overlay.setAttribute('aria-hidden','false'); const inp=document.getElementById('spm-tg'); if(inp) inp.focus(); };
    const close = ()=> overlay.setAttribute('aria-hidden','true');
    openBtn && openBtn.addEventListener('click', open);
    closeBtn && closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e)=>{ if(e.target===overlay) close(); });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    ensureSwitch();
    const initial = localStorage.getItem('lang') || (isLikelyRussia() ? 'ru' : 'en');
    applyLang(initial);

    const btn = document.getElementById('lang-switch');
    btn && btn.addEventListener('click', ()=>{
      const cur = localStorage.getItem('lang') || initial;
      const next = cur === 'ru' ? 'en' : 'ru';
      localStorage.setItem('lang', next);
      applyLang(next);
    });

    wireModal();

    // в контактах обновим aria-лейблы
    const t = I18N[localStorage.getItem('lang') || initial];
    const contacts = document.querySelectorAll('#contacts .bubble-wrap');
    if (contacts[0]) contacts[0].setAttribute('aria-label', t.contacts.ig);
    if (contacts[1]) contacts[1].setAttribute('aria-label', t.contacts.tg);
    if (contacts[2]) contacts[2].setAttribute('aria-label', t.contacts.mail);
  });
})();
