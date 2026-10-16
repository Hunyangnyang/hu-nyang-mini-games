
(()=>{
  const q=(s,r=document)=>r.querySelector(s);
  const refresh=()=>{
    try{
      if(q('#rpgInventoryList')&&q('#rpgInventoryList').style.display!=='none')window.gwEnhanceSale4902?.('rpgInventoryList');
      if(q('#rpgGeneralInventoryList')&&q('#rpgGeneralInventoryList').style.display!=='none')window.gwEnhanceSale4902?.('rpgGeneralInventoryList');
    }catch(_){}
  };
  // Expose the existing local enhancer through a tiny click-driven bridge.
  document.addEventListener('gw-sale-refresh-4902',e=>{
    const id=e?.detail?.id;
    const host=id&&q('#'+id);
    if(!host)return;
    host.querySelectorAll('.gwSaleQty4901').forEach(el=>{
      const card=el.closest('[data-sale-card4901]');
      if(card&&el.textContent==='')el.textContent='0';
    });
  });
  try{HuNyangDiag.line('RPG_V4902_READY','sale_observer_loop=removed|notice=3s|entry_postwork=reduced|field_quest=wide')}catch(_){}
})();
