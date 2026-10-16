
(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,Number(n)||0));

/* Dedicated guild adventurer page */
const pageContent=q('#rpgGuildNpcPageContent');
const select=q('#rpgGuildNpcSelect'),talk=q('#rpgGuildNpcTalk');
if(pageContent&&select&&talk){
  pageContent.append(select,talk);
  const assets=window.V38_ASSETS||{};
  const rub=q('[data-guild-npc="rubia"]'),kain=q('[data-guild-npc="kain"]');
  if(rub&&!rub.querySelector('img'))rub.insertAdjacentHTML('afterbegin',`<img src="${assets.warriorHappy||''}" alt="루비아">`);
  if(kain&&!kain.querySelector('img'))kain.insertAdjacentHTML('afterbegin',`<img src="${assets.rogueNormal||''}" alt="카인">`);
}
function applyGuildNpcTheme(){const scene=q('#rpgGuildNpcPageScene'),a=window.V38_ASSETS||{};if(!scene)return;const p=rpgPartFromTurn(rpgState.worldTurn||0);scene.style.backgroundImage=`url("${(p.key==='morning'||p.key==='noon')?a.guildBright:a.guildDark}")`}
function openGuildNpcPage(){clearTimeout(window.__v38NpcTimerShim);window.V38_ensureRelations?.();if(select)select.style.display='';if(talk)talk.style.display='none';window.V38_updateNpcSelect?.();applyGuildNpcTheme();showPage('rpgGuildNpcPage');rpgSaveActiveSlot('rpgGuildNpcPage','guild_npc_page')}
q('#rpgGuildAdventurerTalkBtn')?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();openGuildNpcPage()},true);
q('#rpgGuildNpcPageBack')?.addEventListener('click',()=>{rpgRenderGuild();showPage('rpgGuildPage')});
// No X button on the dedicated page; old modal remains disabled.
q('#rpgGuildNpcClose')?.remove();
const oldLocation=rpgPageLocation;rpgPageLocation=function(page){if(page==='rpgGuildNpcPage')return '모험가 길드 · 모험가와 대화';return oldLocation(page)};
const oldHydrate2=rpgHydratePage;rpgHydratePage=function(page){if(page==='rpgGuildNpcPage'){openGuildNpcPage();return}return oldHydrate2(page)};

/* Purchase confirmation: purchase -> yes/no -> equip yes/no */
function yesNo(title,text,onYes){
  let m=q('#rpgMiniModal');
  if(!m){rpgShowConfirm(title,text,()=>{});m=q('#rpgMiniModal')}
  q('#rpgMiniModalTitle').textContent=title;q('#rpgMiniModalText').textContent=text;
  const no=q('#rpgMiniModalCancel'),yes=q('#rpgMiniModalOk');no.textContent='아니오';yes.textContent='예';m.classList.add('show');
  no.onclick=()=>m.classList.remove('show');yes.onclick=()=>{m.classList.remove('show');onYes?.()};
}
rpgBuyEquipment=function(uid){
  const item=rpgGetShopCatalog().find(i=>i.uid===uid);if(!item)return;
  if(rpgState.inventory.length>=40){toast('인벤토리가 가득 찼다냥 🐾');return}
  if((rpgState.gold||0)<item.price){toast('골드가 부족하다냥 🐾');return}
  yesNo('구매 확인',`${item.name}을(를) ${item.price}G에 구매하시겠습니까?`,()=>{
    if(rpgState.inventory.length>=40){toast('인벤토리가 가득 찼다냥 🐾');return}
    if((rpgState.gold||0)<item.price){toast('골드가 부족하다냥 🐾');return}
    rpgState.gold-=item.price;
    const bought={...item,uid:`${item.uid}_b${Date.now()}`,source:'shop'};rpgState.inventory.push(bought);
    rpgRenderShop();rpgSaveActiveSlot(null,'buy_confirmed');
    if(bought.slot)yesNo('장비 구매 완료',`${bought.name}을(를) 장착하시겠습니까?`,()=>rpgEquipItem(bought.uid));
    else toast(`${bought.name} 구매 완료`);
  });
};
// Capture any shop purchase click so stale onclick handlers cannot purchase immediately.
document.addEventListener('click',e=>{const b=e.target.closest('[data-buy]');if(!b||b.disabled)return;e.preventDefault();e.stopImmediatePropagation();rpgBuyEquipment(b.dataset.buy)},true);

/* Sale quantity + batch sale */
const sellQty=new Map();
function keyFor(card){if(card.dataset.generalMat)return 'mat:'+card.dataset.generalMat;const uid=card.dataset.generalInv||card.dataset.shopDetail;return uid?'inv:'+uid:''}
function maxFor(card){if(card.dataset.generalMat)return Math.max(0,Number(rpgState.items?.[card.dataset.generalMat])||0);return 1}
function setQty(card,n){const key=keyFor(card);if(!key)return;const v=clamp(n,0,maxFor(card));sellQty.set(key,v);const input=q('.rpgSellQtyInput',card);if(input)input.value=String(v)}
function injectQty(card){if(card.querySelector('.rpgSellQtyRow'))return;const key=keyFor(card);if(!key)return;const mx=maxFor(card);const old=card.querySelector('[data-sell],[data-general-sell],[data-general-mat-sell]');if(old)old.style.display='none';const row=document.createElement('div');row.className='rpgSellQtyRow';row.innerHTML=`<div class="rpgSellQtyControl"><button type="button" data-qty-minus>−</button><input class="rpgSellQtyInput" type="number" min="0" max="${mx}" inputmode="numeric" value="${sellQty.get(key)||0}" aria-label="판매 수량"><button type="button" data-qty-plus>＋</button></div><div class="rpgSellQtyAction"><button type="button" class="rpgItemBtn secondary" data-sell-selected>판매</button></div>`;card.appendChild(row);
  q('[data-qty-minus]',row).onclick=e=>{e.stopPropagation();setQty(card,(sellQty.get(key)||0)-1)};
  q('[data-qty-plus]',row).onclick=e=>{e.stopPropagation();setQty(card,(sellQty.get(key)||0)+1)};
  q('.rpgSellQtyInput',row).onclick=e=>e.stopPropagation();q('.rpgSellQtyInput',row).oninput=e=>setQty(card,e.target.value);
  q('[data-sell-selected]',row).onclick=e=>{e.stopPropagation();sellCards([card])};
}
function sellInventoryUid(uid){const idx=rpgState.inventory.findIndex(x=>x?.uid===uid);if(idx<0)return 0;const item=rpgState.inventory[idx];if(item?.noSell||item?.specialSeriaLetter4974)return 0;const price=window.V38_genericSellPrice?window.V38_genericSellPrice(item):rpgSellPrice(item);rpgState.inventory.splice(idx,1);if(rpgState.equipment?.weapon?.uid===uid)rpgState.equipment.weapon=null;if(rpgState.equipment?.armor?.uid===uid)rpgState.equipment.armor=null;rpgState.rebuy=Array.isArray(rpgState.rebuy)?rpgState.rebuy:[];rpgState.rebuy.unshift({...item,rebuyPrice:Math.max(1,price*2)});rpgState.rebuy=rpgState.rebuy.slice(0,30);return price}
function sellCards(cards){let gold=0,count=0;for(const card of cards){const key=keyFor(card),qty=clamp(sellQty.get(key)||0,0,maxFor(card));if(!qty)continue;if(key.startsWith('mat:')){const k=key.slice(4),d=window.V38_materialDefs?.[k],have=Number(rpgState.items?.[k])||0,n=Math.min(qty,have);if(d&&n){rpgState.items[k]=have-n;gold+=d.price*n;count+=n}}else{const uid=key.slice(4);if(qty>0){const p=sellInventoryUid(uid);if(p){gold+=p;count++}}}sellQty.set(key,0)}if(!count){toast('판매 수량을 선택해 주세요.');return}rpgState.gold=(rpgState.gold||0)+gold;toast(`${count}개 판매 · +${gold}G`);rpgRenderShop();window.V38_renderGeneralShop?.();rpgSaveActiveSlot(null,'batch_sell');setTimeout(enhanceSaleLists,0)}
function addBulk(host,label){if(!host||host.querySelector(':scope > .rpgBulkSellBar'))return;const bar=document.createElement('div');bar.className='rpgBulkSellBar';bar.innerHTML=`<span>판매할 수량을 지정한 뒤 한 번에 정리할 수 있습니다.</span><button type="button">일괄 판매</button>`;bar.querySelector('button').onclick=()=>sellCards(qa('.rpgShopItemClickable,.rpgMaterialCard',host));host.prepend(bar)}
function enhanceSaleLists(){
  const equip=q('#rpgInventoryList');if(equip&&equip.style.display!=='none'){addBulk(equip,'장비점');qa('.rpgShopItemClickable',equip).forEach(c=>{if(c.dataset.shopMode==='sell')injectQty(c)})}
  const gen=q('#rpgGeneralInventoryList');if(gen&&gen.style.display!=='none'){addBulk(gen,'잡화점');qa('[data-general-inv],[data-general-mat]',gen).forEach(injectQty)}
}
/* v4.9.11 cleanup: legacy sale observer retired; final shop UI uses explicit render/path refresh only. */
document.addEventListener('click',e=>{if(e.target.closest('[data-shop-tab="inventory"],[data-general-tab="inventory"]'))setTimeout(enhanceSaleLists,0)},true);
setTimeout(enhanceSaleLists,50);

/* Quest completion reward: stay in guild */
rpgFinishQuest=function(){const quest=rpgState.quest;if(!quest||!quest.completed||quest.rewarded)return;quest.rewarded=true;const gold=quest.rewardGold||10,exp=quest.rewardExp||30;rpgState.gold=(rpgState.gold||0)+gold;const alive=[];if(rpgRewardOwnerAlive61(rpgState)){rpgGainExp(rpgState,exp,rpgState.name);alive.push(rpgState.name)}if(rpgRewardOwnerAlive61(rpgState.ai)){rpgGainExp(rpgState.ai,exp,rpgState.ai.name);alive.push(rpgState.ai.name)}if(rpgRewardOwnerAlive61(rpgState.ai2)){rpgGainExp(rpgState.ai2,exp,rpgState.ai2.name);alive.push(rpgState.ai2.name)}q('#rpgQuestCompleteRewardName').textContent=`${quest.rank}급 · ${quest.name}`;q('#rpgQuestCompleteExp').textContent=alive.length?`+${exp} · 생존 ${alive.length}명`:'전원 전투 불능 · EXP 없음';q('#rpgQuestCompleteGold').textContent=`+${gold}G`;q('#rpgQuestCompleteLoot').textContent='의뢰 완료 기록';rpgRenderGuild();rpgSaveActiveSlot('rpgGuildPage','quest_complete');setAppModal('rpgQuestCompleteRewardModal',true)};
q('#rpgQuestCompleteOk')?.addEventListener('click',()=>{setAppModal('rpgQuestCompleteRewardModal',false);rpgRenderGuild();showPage('rpgGuildPage')});

/* Patch notes policy marker */
HuNyangDiag?.line?.('V4838_FOLLOWUP_READY','settings+sale_qty+buy_confirm+quest_reward+guild_npc_page');
})();
