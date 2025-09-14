// ===== i18n (имя, роли, посты, футер) =====
const I18N = {
  ru: {
    htmlLang: 'ru',
    title: 'Мацэ́ · Графический дизайнер',
    phrases: ['Дима Мальцев','Мацэ́'],
    roles: [
      'Графический дизайнер','Веб-дизайнер','Иллюстратор',
      'Дизайнер шрифтов','Дизайнер айдентики','Дизайнер постеров'
    ],
    footerName:'Мацэ',
    post:{ descSoon:'описание: скоро', catMap:{'Постер':'Постер','Айдентика':'Айдентика','Логотип':'Логотип','Обложка':'Обложка'} }
  },
  en: {
    htmlLang: 'en',
    title: 'Macé · Graphic Designer',
    phrases: ['Dima Malcev','Macé'],
    roles: [
      'Graphic Designer','Web Designer','Illustrator',
      'Type Designer','Brand Identity Designer','Poster Designer'
    ],
    footerName:'Macé',
    post:{ descSoon:'description: soon', catMap:{'Постер':'Poster','Айдентика':'Identity','Логотип':'Logo','Обложка':'Cover'} }
  }
};

function isLikelyRussia(){
  const langs = navigator.languages || [navigator.language||''];
  const hasRu = langs.some(l=>/^ru\b/i.test(l));
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone||'';
  const isRuTZ=/Europe\/Moscow|Europe\/Samara|Asia\//.test(tz);
  return hasRu||isRuTZ;
}
function decideInitialLang(){ return isLikelyRussia() ? 'ru':'en'; }

function applyLang(lang){
  const t = I18N[lang]||I18N.en;
  document.documentElement.setAttribute('lang',t.htmlLang);
  document.title=t.title;
  window.__roles_i18n=t.roles;
  window.__phrases_i18n=t.phrases;
  const foot=document.getElementById('footer-name'); if(foot) foot.textContent=t.footerName;

  // Перевод категорий и описаний (работает и для desktop-meta, и для mobile-meta)
  document.querySelectorAll('.post .post-title').forEach(el=>{
    const ru=el.getAttribute('data-ru')||el.textContent.trim();
    const map=t.post.catMap; el.textContent=map[ru]||ru;
  });
  document.querySelectorAll('.post-description .post-desc').forEach(el=>{ el.textContent=t.post.descSoon; });
}

// ===== main interactions =====
document.addEventListener('DOMContentLoaded',()=>{
  const nameEl=document.getElementById('name');
  const headerNameEl=document.getElementById('header-name');
  let roleEl=document.getElementById('role');
  const roleWrapper=document.querySelector('.role-wrapper');

  class TextScramble{
    constructor(el){ this.el=el; this.chars='абвгдеёжзийклмнопрстуфхцчшщъыьэюяABCDEFGHIJKLMNOPQRSTUVWXYZ'; }
    setText(newText){
      const oldText=this.el.innerText;
      const length=Math.max(oldText.length,newText.length);
      const promise=new Promise(res=>this.resolve=res);
      this.queue=[];
      for(let i=0;i<length;i++){
        const from=oldText[i]||'',to=newText[i]||'';
        const start=Math.floor(Math.random()*20);
        const end=start+Math.floor(Math.random()*20);
        this.queue.push({from,to,start,end});
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame=0; this.update(); return promise;
    }
    update(){
      let output='',complete=0;
      for(let i=0;i<this.queue.length;i++){
        let {from,to,start,end,char}=this.queue[i];
        if(this.frame>=end){ complete++; output+=to; }
        else if(this.frame>=start){ if(!char||Math.random()<.28){ char=this.randomChar(); this.queue[i].char=char; } output+=`<span class="dud">${char}</span>`; }
        else output+=from;
      }
      this.el.innerHTML=output;
      if(complete===this.queue.length) this.resolve();
      else { this.frameRequest=requestAnimationFrame(this.update.bind(this)); this.frame+=2; }
    }
    randomChar(){ return this.chars[Math.floor(Math.random()*this.chars.length)]; }
  }

  // Имя/псевдоним — меняются по локали
  let phrases=I18N[decideInitialLang()].phrases;
  window.__phrases_i18n=phrases;
  const fxMain=new TextScramble(nameEl);
  const fxHeader=new TextScramble(headerNameEl);
  let counter=0;
  function next(){
    phrases=window.__phrases_i18n||phrases;
    const phrase=phrases[counter];
    Promise.all([fxMain.setText(phrase),fxHeader.setText(phrase)]).then(()=>{ setTimeout(next,15000); });
    counter=(counter+1)%phrases.length;
  }
  next();

  // Роли
  let roles=I18N[decideInitialLang()].roles;
  window.__roles_i18n=roles;
  let roleIndex=0;
  roleEl.textContent=roles[roleIndex];
  setInterval(()=>{
    roles=window.__roles_i18n||roles;
    const nextIndex=(roleIndex+1)%roles.length;
    const next=document.createElement('span');
    next.textContent=roles[nextIndex];
    next.classList.add('slide-in');
    roleWrapper.appendChild(next);
    roleEl.classList.add('slide-out');
    setTimeout(()=>{ roleWrapper.removeChild(roleEl); next.id='role'; roleEl=next; },500);
    roleIndex=nextIndex;
  },5000);

  // sticky header
  const header=document.querySelector('header'); const hero=document.querySelector('.hero');
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) header.classList.remove('visible');
      else header.classList.add('visible');
    });
  });
  observer.observe(hero);

  // Карусель
  function setupCarousel(carousel){
    const track=carousel.querySelector('.carousel-track');
    const images=Array.from(track.children); if(images.length===0)return;
    const mobile=window.innerWidth<=768;
    if(mobile){
      if(images.length>1){
        const indicators=document.createElement('div');
        indicators.className='carousel-indicators';
        images.forEach((_,i)=>{ const dot=document.createElement('span'); if(i===0) dot.classList.add('active'); indicators.appendChild(dot); });
        carousel.appendChild(indicators);
        const updateIndicators=()=>{ const index=Math.round(carousel.scrollLeft/carousel.clientWidth); indicators.querySelectorAll('span').forEach((dot,i)=>{ dot.classList.toggle('active',i===index); }); };
        carousel.addEventListener('scroll',updateIndicators);
      }
      return;
    }
    track.style.height='100%'; track.style.alignItems='center';
    images.forEach(img=>img.loading='lazy');
    images.forEach(img=>track.appendChild(img.cloneNode(true)));
    let pos=0; const step=()=>{ pos-=0.5; const resetAt=track.scrollWidth/2; if(-pos>=resetAt) pos=0; track.style.transform=`translateX(${pos}px)`; requestAnimationFrame(step); }; step();
  }

  // Данные
  const assetFiles=[
    'Айдентика-Ростов-1.jpg','Айдентика-Ростов-2.jpg','Айдентика-Ростов-3.jpg',
    'Айдентика-Ростов-4.jpg','Айдентика-Ростов-5.jpg','Айдентика-Ростов-6.jpg',
    'Логотип-Ростов-1.jpg','Обложка-Нотное_издание-3.png',
    'Постер-Гувернантка-4.jpg','Постер-Гувернантка-1.jpg','Постер-Гувернантка-2.jpg',
    'Постер-Гувернантка-3.jpg','Постер-Гувернантка-5.jpg',
    'Постер-Движение-1.jpg','Постер-Движение-2.jpg','Постер-Движение-3.jpg',
    'Постер-Движение-4.jpg','Постер-Движение-5.jpg',
    'Постер-Форма-1.jpg'
  ];

  const postsMap={};
  assetFiles.forEach(file=>{
    const parts=file.split('-'); if(parts.length<2)return;
    const indexExt=parts.pop();
    const base=parts.join('-');
    const [section,...rest]=base.split('-');
    const postName=rest.join('-');
    const index=parseInt(indexExt.split('.')[0],10);
    const key=`${section}-${postName}`;
    if(!postsMap[key]){
      postsMap[key]={ category:section, name:postName.replace(/_/g,' '), images:[] };
    }
    postsMap[key].images.push({src:`/assets/${file}`, idx:isNaN(index)?0:index});
  });

  const posts=Object.values(postsMap).map(post=>{
    post.images.sort((a,b)=>a.idx-b.idx);
    post.images=post.images.map(i=>i.src);
    return post;
  });

  // Рендер
  const portfolio=document.getElementById('portfolio');
  const currentLang=decideInitialLang();
  applyLang(currentLang);
  const tPost=I18N[currentLang].post;

  posts.forEach((post,idx)=>{
    const wrapper=document.createElement('div');
    wrapper.className='post';
    if(idx===0) wrapper.classList.add('is-first');

    // Карусель (идёт первой у всех постов)
    const carousel=document.createElement('div'); carousel.className='carousel';
    const track=document.createElement('div'); track.className='carousel-track';
    const mappedForAlt=(I18N[currentLang].post.catMap[post.category]||post.category);
    post.images.forEach(src=>{
      const img=document.createElement('img');
      img.src=src; img.alt=`${mappedForAlt} ${post.name}`; img.loading='lazy';
      track.appendChild(img);
    });
    carousel.appendChild(track);
    wrapper.appendChild(carousel);

    // 🔹 ТОЛЬКО для первого поста — заголовок ПОД каруселью (десктопный)
    if(idx===0){
      const topTitle=document.createElement('h3');
      topTitle.className='post-title';
      topTitle.setAttribute('data-ru',post.category);
      const mapped=tPost.catMap[post.category]||post.category;
      topTitle.textContent=mapped;
      wrapper.appendChild(topTitle);
    }

    // Десктопный блок для остальных постов (две колонки)
    if(idx!==0){
      const body=document.createElement('div'); body.className='post-body';

      const left=document.createElement('div'); left.className='post-left';
      const cover=document.createElement('img'); cover.className='post-cover';
      cover.src=post.images[0]; cover.alt=`${mappedForAlt} ${post.name}`; cover.loading='lazy';
      left.appendChild(cover);

      const right=document.createElement('div'); right.className='post-right';

      const thumbs=document.createElement('div'); thumbs.className='post-thumbs';
      post.images.slice(1).forEach(src=>{
        const t=document.createElement('img'); t.src=src; t.alt=`${mappedForAlt} ${post.name}`;
        t.loading='lazy'; thumbs.appendChild(t);
      });

      const meta=document.createElement('div'); meta.className='post-meta';

      const type=document.createElement('p');
      type.className='post-title';
      type.setAttribute('data-ru',post.category);
      type.textContent=I18N[currentLang].post.catMap[post.category]||post.category;

      const desc=document.createElement('p'); desc.className='post-description';
      const prettyName=post.name?post.name[0].toUpperCase()+post.name.slice(1):post.name;
      desc.innerHTML=`<span class="post-name">${prettyName}</span> · <span class="post-desc">${I18N[currentLang].post.descSoon}</span>`;

      meta.appendChild(type); meta.appendChild(desc);
      right.appendChild(thumbs); right.appendChild(meta);

      body.appendChild(left); body.appendChild(right);
      wrapper.appendChild(body);
    }

    // 🔹 Мобильный мета-блок ПОД каруселью — у всех постов
    const mobileMeta=document.createElement('div');
    mobileMeta.className='post-meta-under';

    const mobileType=document.createElement('p');
    mobileType.className='post-title';
    mobileType.setAttribute('data-ru',post.category);
    mobileType.textContent=I18N[currentLang].post.catMap[post.category]||post.category;

    const mobileDesc=document.createElement('p');
    mobileDesc.className='post-description';
    const prettyNameMobile=post.name?post.name[0].toUpperCase()+post.name.slice(1):post.name;
    mobileDesc.innerHTML=`<span class="post-name">${prettyNameMobile}</span> · <span class="post-desc">${I18N[currentLang].post.descSoon}</span>`;

    mobileMeta.appendChild(mobileType);
    mobileMeta.appendChild(mobileDesc);
    wrapper.appendChild(mobileMeta);

    portfolio.appendChild(wrapper);
    setupCarousel(carousel);
  });
});
