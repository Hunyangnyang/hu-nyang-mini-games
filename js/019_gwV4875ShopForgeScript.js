
(()=>{
'use strict';
const defs=window.V38_materialDefs||(window.V38_materialDefs={});
const $75=s=>document.querySelector(s), $$75=s=>Array.from(document.querySelectorAll(s));

/* general shop consumables */
const potions=[
 {key:'potionHpS',name:'소형 포션',icon:'🧪',price:3,kind:'hp',amount:10,desc:'HP를 10 회복하는 초보자용 포션.'},
 {key:'potionHpM',name:'중형 포션',icon:'🧪',price:8,kind:'hp',amount:30,desc:'HP를 30 회복하는 일반 포션.'},
 {key:'potionHpL',name:'대형 포션',icon:'🧪',price:13,kind:'hp',amount:50,desc:'HP를 50 회복하는 대형 포션.'},
 {key:'potionMpS',name:'소형 마나 포션',icon:'🔹',price:5,kind:'mp',amount:10,desc:'MP를 10 회복하는 초보자용 마나 포션.'},
 {key:'potionMpM',name:'중형 마나 포션',icon:'🔷',price:14,kind:'mp',amount:30,desc:'MP를 30 회복하는 일반 마나 포션.'},
 {key:'potionMpL',name:'대형 마나 포션',icon:'💠',price:23,kind:'mp',amount:50,desc:'MP를 50 회복하는 대형 마나 포션.'}
];
for(const p of potions) defs[p.key]={name:p.name,icon:p.icon,price:Math.max(1,Math.floor(p.price*.2)),desc:p.desc,consumable:p.kind,restore:p.amount,buyPrice:p.price};
const buyQty75=new Map();
function buyQtyGet75(key){return Math.max(0,Math.round(Number(buyQty75.get(key))||0))}
function buyQtySet75(key,n){buyQty75.set(key,Math.max(0,Math.min(999,Math.round(Number(n)||0))))}
function potionBuyCard75(p){const qty=buyQtyGet75(p.key);return `<div class="rpgMaterialCard gwBuyCard4912" data-gw-buy-card="${p.key}"><div class="rpgMaterialTop"><b>${p.icon} ${p.name}</b><span>${p.price}G</span></div><small>${p.desc}</small><div class="gwBuyRow4912"><button type="button" data-gw-buy-step="-10">-10</button><button type="button" data-gw-buy-step="-1">−</button><strong class="gwBuyQty4912">${qty}</strong><button type="button" data-gw-buy-step="1">＋</button><button type="button" data-gw-buy-step="10">+10</button></div><button class="rpgItemBtn gwBuyExec4912" data-gw-buy-potion="${p.key}" ${qty<1?'disabled':''}>구매</button></div>`}
function buyPotionNow(key,qty){const p=potions.find(x=>x.key===key);qty=Math.max(0,Math.round(Number(qty)||0));if(!p||qty<1)return false;const total=p.price*qty;if((rpgState.gold||0)<total){toast('골드가 부족합니다.');return false}rpgState.items=rpgState.items||{};rpgState.gold-=total;rpgState.items[p.key]=(rpgState.items[p.key]||0)+qty;buyQtySet75(key,0);toast(`${p.name} ×${qty} 구매 · -${total}G`);renderGeneral75();rpgSaveActiveSlot?.(null,'general_shop_bulk_buy_v4912');return true}
function buyPotion(key){const p=potions.find(x=>x.key===key),qty=buyQtyGet75(key);if(!p)return;if(qty<1){toast('구매 수량을 선택해 주세요.');return}const total=p.price*qty;if((rpgState.gold||0)<total){toast('골드가 부족합니다.');return}rpgShowConfirm('잡화 일괄 구매',`${p.name}을(를) ${qty}개, 총 ${total}G에 구매하시겠습니까?`,()=>buyPotionNow(key,qty))}
function bindGeneralBuy75(shop){if(!shop)return;shop.querySelectorAll('[data-gw-buy-card]').forEach(card=>{const key=card.dataset.gwBuyCard;card.querySelectorAll('[data-gw-buy-step]').forEach(b=>b.onclick=e=>{e.stopPropagation();buyQtySet75(key,buyQtyGet75(key)+Number(b.dataset.gwBuyStep));renderGeneral75()});card.querySelector('[data-gw-buy-potion]')?.addEventListener('click',()=>buyPotion(key))})}
function renderGeneral75(){
 const gold=$75('#rpgGeneralShopGold');if(gold)gold.textContent=`${rpgState.gold||0}G`;
 const shop=$75('#rpgGeneralShopList');
 const paint=()=>{if(shop){shop.innerHTML=potions.map(p=>potionBuyCard75(p)).join('');bindGeneralBuy75(shop)}};
 paint();
 window.V38_renderGeneralShop?.();
 /* restore the potion purchase pane after the legacy general renderer paints */
 paint();
}
const oldGreeting=rpgRenderGeneralShopGreeting;rpgRenderGeneralShopGreeting=function(){oldGreeting();renderGeneral75()};
$$75('[data-general-tab]').forEach(b=>b.addEventListener('click',()=>setTimeout(renderGeneral75,0)));

/* make HP auto potion real and safe */
window.rpgUsePotionAuto=function(unit){
 if(!unit||unit.dead)return false;rpgState.items=rpgState.items||{};
 const missing=Math.max(0,(unit.maxHp||0)-(unit.hp||0));if(missing<=0)return false;
 const order=missing>30?['potionHpL','potionHpM','potionHpS']:missing>10?['potionHpM','potionHpS','potionHpL']:['potionHpS','potionHpM','potionHpL'];
 const key=order.find(k=>(Number(rpgState.items[k])||0)>0);if(!key)return false;const p=potions.find(x=>x.key===key);if(!p)return false;
 rpgState.items[key]-=1;unit.hp=Math.min(unit.maxHp||unit.hp,(unit.hp||0)+p.amount);if(unit.id==='player'||unit===rpgState.field?.battle?.party?.[0])rpgState.hp=unit.hp;try{rpgLog(`🧪 ${p.name} 사용 · HP +${p.amount}`)}catch(_){ }rpgSaveActiveSlot?.(null,'auto_potion');return true;
};

/* blacksmith page */
if(!$75('#rpgBlacksmithPage')){
 const page=document.createElement('section');page.className='page noBottom';page.id='rpgBlacksmithPage';page.innerHTML=`<div class="safeTop"></div><div class="content"><div class="appbar"><button class="iconBtn" id="gwSmithBack75" type="button">‹</button><div style="text-align:center"><h1 class="rpgHeadTitle">라비엔 대장간</h1><div class="subhead rpgSub">재련 · 강화</div></div><div class="rpgGoldBadge" id="gwSmithGold75">0G</div></div><div class="gwSmithHero75 gwSmithHero77"><div class="gwSmithSpeech77" id="gwSmithSpeech77"></div><img id="gwSmithArt75" alt="라비엔 대장장이"><div class="gwForgeSlot77" id="gwForgeSlot77"></div><div class="gwForgeSpark77" id="gwForgeSpark77"></div></div><div class="gwSmithTabs75"><button class="active" data-gw-smith-tab="refine">재련</button><button data-gw-smith-tab="enhance">강화</button></div><div class="gwSmithPanel75" id="gwSmithRefine75"></div><div class="gwSmithPanel75" id="gwSmithEnhance75" style="display:none"></div></div>`;
 document.body.appendChild(page);
}
const smithArt=$75('#gwSmithArt75');function syncSmithArt75(){window.GW77SmithSetMain?.()}syncSmithArt75();
let noticeTimer=0;function forgeNotice(msg,ok=true){let n=$75('#gwForgeNotice75');if(!n){n=document.createElement('div');n.id='gwForgeNotice75';n.className='gwForgeNotice75';document.body.appendChild(n)}n.textContent=msg;n.className=`gwForgeNotice75 ${ok?'success':'fail'} show`;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>n.classList.remove('show'),3000)}
function have(k){return Number(rpgState.items?.[k])||0}function add(k,n){rpgState.items=rpgState.items||{};rpgState.items[k]=(rpgState.items[k]||0)+n}function take(k,n){if(have(k)<n)return false;rpgState.items[k]-=n;return true}
function repairDynamicRecipes(){
 window.HuNyangForgeData=window.HuNyangForgeData||{};
 /* v4.8.82: register every meadow restoration recipe even when the material is not owned yet. */
 for(const [wt,wd] of Object.entries(rpgWeaponDefs||{})){
   if(wt==='seriaTealStaff')continue;
   const specific='brokenMeadowWeapon_'+wt;
   defs[specific]=defs[specific]||{name:`망가진 초원의 ${wd.name}`,icon:'⚔️',price:4,desc:`망가진 초원의 ${wd.name}. 슬라임의 핵과 재련하면 초원 장비로 복원할 수 있습니다.`};
   const material=have(specific)>0?specific:'brokenMeadowWeapon';
   window.HuNyangForgeData['catalogMeadowWeapon_'+wt]={cost:{[material]:1,slimeCore:1},result:{series:'meadow',slot:'weapon',weaponType:wt}};
 }
 for(const [at,ad] of Object.entries(rpgArmorTypeDefs||{})){
   const specific='brokenMeadowArmor_'+at;
   defs[specific]=defs[specific]||{name:`망가진 초원의 ${ad.name} 방어구`,icon:'🛡️',price:4,desc:`망가진 초원의 ${ad.name} 방어구. 슬라임의 핵과 재련하면 초원 장비로 복원할 수 있습니다.`};
   const material=have(specific)>0?specific:'brokenMeadowArmor';
   window.HuNyangForgeData['catalogMeadowArmor_'+at]={cost:{[material]:1,slimeCore:1},result:{series:'meadow',slot:'armor',armorType:at}};
 }
}
function makeMeadow(result){if(rpgState.inventory.length>=40){forgeNotice('인벤토리가 가득 찼습니다.',false);return false}const item=rpgMakeEquipment({series:'meadow',slot:result.slot,weaponType:result.weaponType,armorType:result.armorType,source:'forge',prefix:'초원의',rarity:'엘리트',level:10,weaponBonus:5,pdef:3,mdef:2,setAtk:4,extra:'라비엔 지역 추가 공격력 +2',border:'purple'});rpgState.inventory.push(item);return item}
function recipeLabel(id,r){if(id==='scrapToStone')return '고철 재련';if(id==='usableScrapToStone')return '쓸만한 고철 재련';if(id.startsWith('catalogMeadowWeapon_')){const wt=id.slice('catalogMeadowWeapon_'.length);return `망가진 초원의 ${rpgWeaponDefs?.[wt]?.name||wt} 복원`;}if(id.startsWith('catalogMeadowArmor_')){const at=id.slice('catalogMeadowArmor_'.length);return `망가진 초원의 ${rpgArmorTypeDefs?.[at]?.name||at} 방어구 복원`;}return id}
function costText(cost){return Object.entries(cost||{}).map(([k,n])=>`${defs[k]?.name||k} ${have(k)}/${n}`).join(' · ')}
function canCost(cost){return Object.entries(cost||{}).every(([k,n])=>have(k)>=n)}
function doRefine(id){repairDynamicRecipes();const r=window.HuNyangForgeData?.[id];if(!r||!canCost(r.cost)){forgeNotice('재련 재료가 부족합니다.',false);window.GW77SmithSay?.('refineFail');return}for(const [k,n] of Object.entries(r.cost))take(k,n);let msg='재련 완료';if(r.result?.enhancementStone){add('enhancementStone',r.result.enhancementStone);msg=`강화석 ×${r.result.enhancementStone} 획득`;}else if(typeof r.result==='object'&&r.result.slot){const item=makeMeadow(r.result);if(!item){for(const [k,n] of Object.entries(r.cost))add(k,n);window.GW77SmithSay?.('refineFail');return}msg=`${item.name} 복원 완료`;}else{for(const [k,n] of Object.entries(r.cost))add(k,n);forgeNotice('아직 지원되지 않는 재련식입니다.',false);window.GW77SmithSay?.('refineFail');return}forgeNotice(msg,true);window.GW77SmithSay?.('refineSuccess');rpgSaveActiveSlot?.(null,'blacksmith_refine');renderSmith75()}
function renderRefine75(){repairDynamicRecipes();const host=$75('#gwSmithRefine75');if(!host)return;const data=window.HuNyangForgeData||{};const ids=Object.keys(data).filter(k=>k==='scrapToStone'||k==='usableScrapToStone'||k.startsWith('catalogMeadowWeapon_')||k.startsWith('catalogMeadowArmor_')).sort((a,b)=>{const ca=canCost(data[a]?.cost),cb=canCost(data[b]?.cost);if(ca!==cb)return cb-ca;return recipeLabel(a,data[a]).localeCompare(recipeLabel(b,data[b]),'ko')});host.innerHTML=ids.map(id=>{const r=data[id];if(!r)return '';const ok=canCost(r.cost);return `<details class="gwSmithRecipe75${ok?' craftable82':''}"><summary>${recipeLabel(id,r)}</summary><div class="gwSmithRecipeBody75"><div>${r.result?.enhancementStone?'재련 가능한 금속을 강화석으로 가공합니다.':'망가진 초원 장비를 슬라임의 핵으로 복원합니다.'}</div><div class="gwSmithCost75">${costText(r.cost)}</div><button class="gwSmithBtn75" data-gw-refine="${id}" ${ok?'':'disabled'}>재련</button></div></details>`}).join('')||'<div class="gwSmithEmpty75">현재 재련 가능한 조합식이 없습니다.</div>';host.querySelectorAll('[data-gw-refine]').forEach(b=>b.onclick=()=>doRefine(b.dataset.gwRefine))}
const stages={0:{rate:1,stone:2,gold:100,atk:1,pd:1,md:0},1:{rate:.90,stone:3,gold:130,atk:1,pd:1,md:1},2:{rate:.80,stone:4,gold:180,atk:1,pd:1,md:1},3:{rate:.65,stone:6,gold:210,atk:2,pd:2,md:2},4:{rate:.50,stone:8,gold:300,atk:5,pd:3,md:3}};
function enhanceName(i){return `${String(i.name||'장비').replace(/ \+\d+$/,'')} +${Number(i.enhanceLevel)||0}`}
function glowClass(lv){return lv>=5?'glow5':lv===4?'glow4':lv===3?'glow3':''}
function enhanceStats(i){if(i.slot==='weapon')return `현재 무기 공격력 +${i.weaponBonus||0}`;const t=rpgArmorTypeDefs[i.armorType]||rpgArmorTypeDefs.cloth;return `현재 물방 +${(i.pdef||0)+t.def} · 마방 +${(i.mdef||0)+t.def}`}
function doEnhance(uid){const i=rpgState.inventory.find(x=>x.uid===uid);if(!i)return;const lv=Number(i.enhanceLevel)||0;if((i.level||1)>10){forgeNotice('현재는 Lv.10 이하 장비만 강화할 수 있습니다.',false);return}if(lv>=5){forgeNotice('현재 장비는 최대 강화 단계입니다.',false);return}const st=stages[lv];if(have('enhancementStone')<st.stone){forgeNotice(`강화석이 부족합니다. (${have('enhancementStone')}/${st.stone})`,false);return}if((rpgState.gold||0)<st.gold){forgeNotice(`골드가 부족합니다. (${rpgState.gold||0}/${st.gold}G)`,false);return}window.GW77ForgeAnimate?.(i,lv+1);rpgState.items.enhancementStone-=st.stone;rpgState.gold-=st.gold;const success=Math.random()<st.rate;if(success){i.enhanceLevel=lv+1;i.name=String(i.name||'장비').replace(/ \+\d+$/,'')+` +${i.enhanceLevel}`;if(i.slot==='weapon')i.weaponBonus=(Number(i.weaponBonus)||0)+st.atk;else{i.pdef=(Number(i.pdef)||0)+st.pd;i.mdef=(Number(i.mdef)||0)+st.md}// Rebind equipment by UID: saved slots can deserialize inventory and equipment as different objects.
    const equipped=rpgState.equipment||{};
    for(const slot of ['weapon','armor'])if(equipped[slot]?.uid===i.uid)equipped[slot]=i;
    rpgSyncAiEquipment?.();
    for(const unit of (rpgState.field?.party||[])){
      const owner=unit.id==='player'?rpgState:unit.id==='ai'?rpgState.ai:unit.id==='ai2'?rpgState.ai2:null;
      if(!owner)continue;
      unit.equipment=owner.equipment;
      unit.weaponItem=owner.equipment?.weapon||null;
      unit.weaponType=owner.equipment?.weapon?.weaponType||null;
      if(typeof rpgDerived==='function')unit.derived=rpgDerived(owner.job,owner.stats,owner.skills,owner.equipment);
    }
    forgeNotice(`✨ 강화 성공! ${i.name}`,true);window.GW77SmithSay?.('enhanceSuccess')}else{forgeNotice(`강화 실패 · ${enhanceName(i)}은(는) 유지됩니다.`,false);window.GW77SmithSay?.('enhanceFail')}rpgSaveActiveSlot?.(null,success?'blacksmith_enhance_success':'blacksmith_enhance_fail');renderSmith75()}
function renderEnhance75(){const host=$75('#gwSmithEnhance75');if(!host)return;const list=(rpgState.inventory||[]).filter(i=>i?.slot&&(i.level||1)<=10&&!i.noEnhance);host.innerHTML=list.length?list.map(i=>{const lv=Number(i.enhanceLevel)||0,st=stages[Math.min(lv,4)],max=lv>=5;return `<div class="gwSmithEquip75 ${glowClass(lv)}"><h3>${enhanceName(i)}</h3><small>${i.slot==='weapon'?'무기':'방어구'} · 제한 Lv.${i.level||1}</small><div class="gwEnhanceGauge75">${[1,2,3,4,5].map(n=>`<i class="${lv>=n?'on':''}"></i>`).join('')}</div><div class="stats">${enhanceStats(i)}<br>${max?'최대 강화 완료':`다음 성공률 ${Math.round(st.rate*100)}% · 강화석 ${st.stone}개 · ${st.gold}G`}</div><button class="gwSmithBtn75" data-gw-enhance="${i.uid}" ${max||have('enhancementStone')<st.stone||(rpgState.gold||0)<st.gold?'disabled':''}>${max?'MAX +5':`+${lv+1} 강화`}</button></div>`}).join(''):'<div class="gwSmithEmpty75">강화할 Lv.10 이하 장비가 없습니다.</div>';host.querySelectorAll('[data-gw-enhance]').forEach(b=>b.onclick=()=>doEnhance(b.dataset.gwEnhance))}
function renderSmith75(){const g=$75('#gwSmithGold75');if(g)g.textContent=`${rpgState.gold||0}G`;renderRefine75();renderEnhance75()}
function openSmith75(){renderSmith75();showPage('rpgBlacksmithPage');window.GW77SmithEnter?.()}
$75('#gwSmithBack75')?.addEventListener('click',()=>rpgOpenShop?.());$$75('[data-gw-smith-tab]').forEach(b=>b.addEventListener('click',()=>{$$75('[data-gw-smith-tab]').forEach(x=>x.classList.toggle('active',x===b));const t=b.dataset.gwSmithTab;$75('#gwSmithRefine75').style.display=t==='refine'?'grid':'none';$75('#gwSmithEnhance75').style.display=t==='enhance'?'grid':'none';renderSmith75()}));
const oldBtn=$75('#rpgBlacksmithBtn');if(oldBtn){const nb=oldBtn.cloneNode(true);oldBtn.replaceWith(nb);nb.addEventListener('click',openSmith75)}
try{HuNyangDiag.line('RPG_V4875_READY','general_shop=6potions|blacksmith=refine+enhance|max=5|cost=2,3,4,6,8|glow=3plus')}catch(_){ }
})();
