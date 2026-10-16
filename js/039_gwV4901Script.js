
(()=>{
  'use strict';
  const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];

  /* ---------- blacksmith dismantle ---------- */
  let dismantleBatch4901=false;
  const dismantleSelected4901=new Set();

  function smithSay4901(msg){
    const el=q('#gwSmithSpeech77');
    if(el)el.textContent=msg;
  }
  function dismantleRule4901(i){
    if(!i||i.noDismantle||i.specialSeriaLetter4974||i.weaponType==='seriaTealStaff'||i.specialSeriaStaff932||i.source==='shop')return null;
    if(i.series==='slime')return {n:{scrapMetal:2,usableScrap:1},g:{enhancementStone:1},r:.05,l:'고철 ×2 + 쓸만한 고철 ×1',gl:'강화석 ×1'};
    if(i.series==='meadow')return {n:{usableScrap:2},g:{enhancementStone:2},r:.05,l:'쓸만한 고철 ×2',gl:'강화석 ×2'};
    const lv=Number(i.level)||1,rar=String(i.rarity||'');
    if(rar.includes('엘리트')||lv>=10)return {n:{usableScrap:2},g:{enhancementStone:2},r:.05,l:'쓸만한 고철 ×2',gl:'강화석 ×2'};
    if(rar.includes('레어')||lv>=5)return {n:{scrapMetal:2,usableScrap:1},g:{enhancementStone:1},r:.05,l:'고철 ×2 + 쓸만한 고철 ×1',gl:'강화석 ×1'};
    return {n:{scrapMetal:2},g:{usableScrap:1},r:.05,l:'고철 ×2',gl:'쓸만한 고철 ×1'};
  }
  function equipped4901(i){
    return !!i&&(rpgState.equipment?.weapon?.uid===i.uid||rpgState.equipment?.armor?.uid===i.uid);
  }
  function materialName4901(k){
    return window.V38_materialDefs?.[k]?.name||k;
  }
  function rewardText4901(reward){
    return Object.entries(reward||{}).filter(([,n])=>n>0).map(([k,n])=>`${materialName4901(k)} ${n}개`).join(', ');
  }
  function addReward4901(reward,total){
    rpgState.items=rpgState.items||{};
    for(const [k,n] of Object.entries(reward||{})){
      rpgState.items[k]=(Number(rpgState.items[k])||0)+n;
      total[k]=(Number(total[k])||0)+n;
    }
  }
  function removeInventory4901(uid){
    const idx=(rpgState.inventory||[]).findIndex(x=>x?.uid===uid);
    if(idx>=0)rpgState.inventory.splice(idx,1);
  }
  function dismantleOne4901(item){
    const rule=dismantleRule4901(item);
    if(!item||!rule||equipped4901(item))return;
    const great=Math.random()<rule.r;
    const reward=great?rule.g:rule.n;
    removeInventory4901(item.uid);
    const total={};addReward4901(reward,total);
    smithSay4901(great
      ? `오, 대성공이네! ${item.name}을 분해해서 ${rewardText4901(reward)} 나왔어.`
      : `${item.name} 분해 끝. ${rewardText4901(reward)} 챙겨가.`);
    try{rpgSaveActiveSlot?.(null,'blacksmith_dismantle_v4901')}catch(_){}
    renderDismantle4901();
  }
  function finishBatchDismantle4901(items){
    const totals={},greatItems=[];
    for(const item of items){
      const rule=dismantleRule4901(item);
      if(!rule||equipped4901(item))continue;
      const great=Math.random()<rule.r;
      const reward=great?rule.g:rule.n;
      if(great)greatItems.push(item.name||'장비');
      removeInventory4901(item.uid);
      addReward4901(reward,totals);
    }
    dismantleSelected4901.clear();
    dismantleBatch4901=false;
    const totalText=rewardText4901(totals)||'반환 재료 없음';
    smithSay4901(greatItems.length
      ? `일괄 분해 끝났어. ${totalText}. 그리고 대성공 ${greatItems.length}회도 터졌네!`
      : `일괄 분해 끝. 총 ${totalText} 나왔어. 대성공은 없었네.`);
    try{rpgSaveActiveSlot?.(null,'blacksmith_bulk_dismantle_v4901')}catch(_){}
    renderDismantle4901();
  }
  function selectedItems4901(){
    return [...dismantleSelected4901].map(uid=>(rpgState.inventory||[]).find(x=>x?.uid===uid)).filter(Boolean);
  }
  function renderDismantle4901(){
    const host=q('#gwSmithDismantle4900');if(!host)return;
    const list=(rpgState.inventory||[]).filter(i=>dismantleRule4901(i)&&!equipped4901(i));
    const selCount=selectedItems4901().length;
    const toolbar=`<div class="gwDismantleToolbar4901">
      <div class="left">
        <button class="mode${dismantleBatch4901?' active':''}" type="button" data-batch-mode4901>${dismantleBatch4901?'일괄 분해 취소':'일괄 분해'}</button>
        ${dismantleBatch4901?`<span class="gwDismantleCount4901">선택 ${selCount}개</span>`:''}
      </div>
      <div class="right">${dismantleBatch4901?`<button class="execute" type="button" data-batch-exec4901 ${selCount?'':'disabled'}>분해</button>`:''}</div>
    </div>${dismantleBatch4901?'<div class="gwDismantleHint4901">분해할 장비를 눌러 선택하세요. 선택된 장비는 분홍색으로 강조됩니다.</div>':''}`;
    const cards=list.length?list.map(i=>{
      const r=dismantleRule4901(i),eq=equipped4901(i),selected=dismantleSelected4901.has(i.uid);
      return `<div class="gwDismantle4900 gwDismantleCard4901${dismantleBatch4901?' batch-mode':''}${selected?' selected':''}" data-dcard4901="${i.uid}">
        <h3>${i.name||'장비'}</h3>
        <small>${i.rarity||'일반'} · Lv.${i.level||1}</small>
        <div class="gwDismantleReward4900">일반: ${r.l}<br>✨ 대성공 5%: ${r.gl}</div>
        ${dismantleBatch4901
          ? `<button type="button" ${eq?'disabled':''}>${eq?'장착 해제 필요':selected?'선택 해제':'선택'}</button>`
          : `<button type="button" data-one-dismantle4901="${i.uid}" ${eq?'disabled':''}>${eq?'장착 해제 필요':'분해'}</button>`}
      </div>`;
    }).join(''):'<div class="gwSmithEmpty75">분해 가능한 드랍 장비가 없습니다.</div>';
    host.innerHTML=toolbar+cards;

    q('[data-batch-mode4901]',host)?.addEventListener('click',()=>{
      dismantleBatch4901=!dismantleBatch4901;
      dismantleSelected4901.clear();
      smithSay4901(dismantleBatch4901?'분해할 장비를 골라봐. 선택한 건 한 번에 처리해줄게.':'일괄 분해 선택을 취소했어.');
      renderDismantle4901();
    });
    q('[data-batch-exec4901]',host)?.addEventListener('click',()=>{
      const items=selectedItems4901();if(!items.length)return;
      rpgShowConfirm('일괄 분해 확인',`선택한 장비 ${items.length}개를 진짜 분해하시겠습니까?`,()=>finishBatchDismantle4901(items));
    });
    qa('[data-one-dismantle4901]',host).forEach(btn=>btn.addEventListener('click',e=>{
      e.stopPropagation();
      const item=(rpgState.inventory||[]).find(x=>x?.uid===btn.dataset.oneDismantle4901);
      dismantleOne4901(item);
    }));
    qa('[data-dcard4901]',host).forEach(card=>card.addEventListener('click',e=>{
      if(!dismantleBatch4901||e.target.closest('button'))return;
      const item=(rpgState.inventory||[]).find(x=>x?.uid===card.dataset.dcard4901);
      if(!item||equipped4901(item))return;
      if(dismantleSelected4901.has(item.uid))dismantleSelected4901.delete(item.uid);
      else dismantleSelected4901.add(item.uid);
      renderDismantle4901();
    }));
    if(dismantleBatch4901){
      qa('[data-dcard4901] button',host).forEach(btn=>btn.addEventListener('click',e=>{
        e.stopPropagation();
        const card=e.currentTarget.closest('[data-dcard4901]');
        const item=(rpgState.inventory||[]).find(x=>x?.uid===card?.dataset.dcard4901);
        if(!item||equipped4901(item))return;
        if(dismantleSelected4901.has(item.uid))dismantleSelected4901.delete(item.uid);
        else dismantleSelected4901.add(item.uid);
        renderDismantle4901();
      }));
    }
  }

  /* Make our dismantle UI replace the v4.9.00 immediate version after its tab handler runs. */
  function bindDismantleTab4901(){
    const btn=q('#rpgBlacksmithPage [data-gw-smith-tab="dismantle"]');
    if(!btn||btn.dataset.v4901)return;
    btn.dataset.v4901='1';
    btn.addEventListener('click',()=>setTimeout(renderDismantle4901,0));
  }

  const smithObs4901=new MutationObserver(()=>{
    bindDismantleTab4901();
    const p=q('#gwSmithDismantle4900');
    if(p&&p.style.display!=='none'&&!p.querySelector('.gwDismantleToolbar4901'))queueMicrotask(renderDismantle4901);
  });
  const smithPage4901=q('#rpgBlacksmithPage');
  if(smithPage4901)smithObs4901.observe(smithPage4901,{childList:true,subtree:true});
  bindDismantleTab4901();

  /* ---------- shop batch sale ---------- */
  const sale4901=new Map();
  let saleRenderGuard4901=false;

  function saleKey4901(card){
    if(card.dataset.generalMat)return 'mat:'+card.dataset.generalMat;
    if(card.dataset.materialDetail)return 'mat:'+card.dataset.materialDetail;
    const uid=card.dataset.generalInv||((card.dataset.shopMode==='sell')?card.dataset.shopDetail:null);
    return uid?'inv:'+uid:null;
  }
  function saleMax4901(key){
    if(!key)return 0;
    if(key.startsWith('mat:'))return Math.max(0,Number(rpgState.items?.[key.slice(4)])||0);
    return (rpgState.inventory||[]).some(x=>x?.uid===key.slice(4))?1:0;
  }
  function saleUnit4901(key){
    if(key.startsWith('mat:'))return Number(window.V38_materialDefs?.[key.slice(4)]?.price)||0;
    const item=(rpgState.inventory||[]).find(x=>x?.uid===key.slice(4));
    return item?(window.V38_genericSellPrice?.(item)??rpgSellPrice(item)):0;
  }
  function saleQty4901(key){
    return Math.max(0,Math.min(saleMax4901(key),Number(sale4901.get(key))||0));
  }
  function saleSet4901(key,n){
    sale4901.set(key,Math.max(0,Math.min(saleMax4901(key),Math.round(Number(n)||0))));
  }
  function saleTotal4901(host){
    let total=0;
    qa('[data-sale-card4901]',host).forEach(card=>{
      const key=card.dataset.saleCard4901;
      total+=saleQty4901(key)*saleUnit4901(key);
    });
    return total;
  }
  function updateSaleUi4901(host){
    qa('[data-sale-card4901]',host).forEach(card=>{
      const key=card.dataset.saleCard4901;
      const el=q('.gwSaleQty4901',card);
      if(el)el.textContent=String(saleQty4901(key));
    });
    const total=saleTotal4901(host),box=q('.gwBulkGold4901',host),btn=q('[data-bulk-sell4901]',host);
    if(box)box.textContent=`${total}G`;
    if(btn)btn.disabled=total<=0;
  }
  function sellInv4901(uid){
    const idx=(rpgState.inventory||[]).findIndex(x=>x?.uid===uid);if(idx<0)return 0;
    const item=rpgState.inventory[idx];if(item?.noSell||item?.specialSeriaLetter4974)return 0;const price=window.V38_genericSellPrice?.(item)??rpgSellPrice(item);
    rpgState.inventory.splice(idx,1);
    if(rpgState.equipment?.weapon?.uid===uid)rpgState.equipment.weapon=null;
    if(rpgState.equipment?.armor?.uid===uid)rpgState.equipment.armor=null;
    rpgState.rebuy=Array.isArray(rpgState.rebuy)?rpgState.rebuy:[];
    rpgState.rebuy.unshift({...item,rebuyPrice:Math.max(1,price*2)});
    rpgState.rebuy=rpgState.rebuy.slice(0,30);
    return price;
  }
  function executeBulkSale4901(host){
    let total=0,count=0;
    const keys=qa('[data-sale-card4901]',host).map(c=>c.dataset.saleCard4901);
    for(const key of keys){
      const qty=saleQty4901(key);if(!qty)continue;
      if(key.startsWith('mat:')){
        const k=key.slice(4),have=Number(rpgState.items?.[k])||0,n=Math.min(have,qty),unit=Number(window.V38_materialDefs?.[k]?.price)||0;
        if(n){rpgState.items[k]=have-n;total+=unit*n;count+=n;}
      }else{
        const uid=key.slice(4);
        if(qty>0){const price=sellInv4901(uid);if(price){total+=price;count++;}}
      }
      sale4901.set(key,0);
    }
    if(!count){toast?.('판매 수량을 선택해 주세요.');return}
    rpgState.gold=(Number(rpgState.gold)||0)+total;
    rpgSyncAiEquipment?.();
    toast?.(`${count}개 일괄 판매 · +${total}G`);
    try{rpgSaveActiveSlot?.(null,'bulk_sell_v4901')}catch(_){}
    rpgRenderShop?.();window.V38_renderGeneralShop?.();
    setTimeout(()=>enhanceSale4901(host.id),0);
  }
  function eligibleSaleCards4901(host){
    if(host.id==='rpgInventoryList'){
      return qa('.rpgShopItemClickable',host).filter(c=>c.dataset.shopMode==='sell'||c.dataset.materialDetail);
    }
    return qa('[data-general-inv],[data-general-mat]',host);
  }
  function enhanceSale4901(hostId){
    if(saleRenderGuard4901)return;
    const host=typeof hostId==='string'?q('#'+hostId):hostId;
    if(!host||host.style.display==='none')return;
    saleRenderGuard4901=true;
    try{
      qa(':scope > .rpgBulkSellBar',host).forEach(x=>x.remove());
      const cards=eligibleSaleCards4901(host);
      for(const card of cards){
        const key=saleKey4901(card);if(!key)continue;
        card.dataset.saleCard4901=key;
        const existing=card.querySelector('.gwSaleCtrl4901');
        if(existing)continue;
        qa('.rpgSellQtyRow',card).forEach(x=>x.remove());
        const old=card.querySelector('[data-sell],[data-general-sell],[data-general-mat-sell],[data-material-sell]');
        if(old)old.style.display='none';
        const row=document.createElement('div');
        row.className='rpgSellQtyRow gwSaleRow4901';
        row.innerHTML=`<div class="gwSaleCtrl4901">
          <button type="button" data-step="-10">-10</button>
          <button type="button" data-step="-1">−</button>
          <div class="gwSaleQty4901">0</div>
          <button type="button" data-step="1">＋</button>
          <button type="button" data-step="10">+10</button>
        </div>`;
        card.appendChild(row);
        qa('[data-step]',row).forEach(btn=>btn.addEventListener('click',e=>{
          e.stopPropagation();
          saleSet4901(key,saleQty4901(key)+Number(btn.dataset.step));
          updateSaleUi4901(host);
        }));
      }
      if(cards.length){
        const bar=document.createElement('div');
        bar.className='rpgBulkSellBar gwBulkSell4901';
        bar.innerHTML=`<div class="gwBulkGold4901">0G</div><button type="button" data-bulk-sell4901 disabled>일괄 판매</button>`;
        host.appendChild(bar);
        q('[data-bulk-sell4901]',bar).addEventListener('click',()=>executeBulkSale4901(host));
      }
      updateSaleUi4901(host);
    }finally{
      saleRenderGuard4901=false;
    }
  }

  /* v4.9.02: mutation observer removed. It repeatedly rebuilt the sale controls and
     could reset the visible quantity before the click result was painted. */
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-shop-tab="inventory"]'))setTimeout(()=>enhanceSale4901('rpgInventoryList'),20);
    if(e.target.closest('[data-general-tab="inventory"]'))setTimeout(()=>enhanceSale4901('rpgGeneralInventoryList'),20);
  },true);

  /* Page-entry supplementation */
  const oldShow4901=showPage;
  showPage=function(id,dir='auto'){
    const v=oldShow4901(id,dir);
    setTimeout(()=>{
      if(id==='rpgBlacksmithPage'){bindDismantleTab4901();const p=q('#gwSmithDismantle4900');if(p&&p.style.display!=='none')renderDismantle4901();}
      if(id==='rpgShopPage'&&q('#rpgInventoryList')?.style.display!=='none')enhanceSale4901('rpgInventoryList');
      if(id==='rpgGeneralShopPage'&&q('#rpgGeneralInventoryList')?.style.display!=='none')enhanceSale4901('rpgGeneralInventoryList');
    },30);
    return v;
  };

  try{HuNyangDiag.line('RPG_V4901_READY','smith_speech=dismantle_result|bulk_dismantle=select_confirm_sum|shop_qty=-10,-,0,+,+10|bulk_sell_total=on')}catch(_){}
})();
