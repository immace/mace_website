// Читаем ?service= из /home и подставляем в карточку консультации + добавляем заметку в ссылку Prodamus
(function initConsultation(){
  const params = new URLSearchParams(location.search);
  const service = params.get('service');
  const slot = document.getElementById('selected-service');
  const desc = document.getElementById('c-desc');
  const pay = document.getElementById('prodamus-pay');

  if (service){
    slot.textContent = service;
    desc.innerHTML = `Session focused on: <b>${service}</b>. We’ll clarify scope & next steps.`;
    try {
      const url = new URL(pay.href);
      url.searchParams.set('note', service); // если у тебя в Prodamus есть параметр для комментария
      pay.href = url.toString();
    } catch(e){}
  }
})();
