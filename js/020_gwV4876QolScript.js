
(()=>{
 'use strict';
 const defs=window.V38_materialDefs||(window.V38_materialDefs={});
 Object.assign(defs,{
  slimeGel:{name:'슬라임 점액',icon:'💧',price:1,desc:'예전 전리품 데이터에 남아 있는 일반 슬라임 점액. 잡화 재료로 취급됩니다.'},
  slimeBossCore:defs.slimeBossCore||{name:'거대 슬라임 핵점액',icon:'💧',price:18,desc:'이전 버전에서 획득한 거대 슬라임 핵점액. 현재 슬라임의 핵과 같은 계열의 보스 재료입니다.'},
  wolfBossFang:defs.wolfBossFang||{name:'늑대왕 송곳니',icon:'🦴',price:24,desc:'이전 버전에서 획득한 늑대왕 송곳니. 희귀 야수 재료입니다.'}
 });
 function fallbackMaterial(key){if(defs[key])return defs[key];if(String(key).startsWith('brokenMeadowWeapon_')){const wt=String(key).slice('brokenMeadowWeapon_'.length),wd=window.rpgWeaponDefs?.[wt]||rpgWeaponDefs?.[wt],nm=wd?.name||wt;return defs[key]={name:`망가진 초원의 ${nm}`,icon:'⚔️',price:4,desc:`망가진 초원의 ${nm}. 슬라임의 핵과 함께 재련하면 초원 장비로 복원할 수 있습니다.`}}if(String(key).startsWith('brokenMeadowArmor_')){const at=String(key).slice('brokenMeadowArmor_'.length),ad=window.rpgArmorTypeDefs?.[at]||rpgArmorTypeDefs?.[at],nm=ad?.name||at;return defs[key]={name:`망가진 초원의 ${nm}`,icon:'🛡️',price:4,desc:`망가진 초원의 ${nm}. 슬라임의 핵과 함께 재련하면 초원 장비로 복원할 수 있습니다.`}}const pretty=String(key||'아이템').replaceAll('_',' ');return defs[key]={name:pretty,icon:'📦',price:0,desc:'이전 버전 또는 테스트 과정에서 획득한 잡화 아이템입니다. 현재 별도 사용처 정보가 등록되어 있지 않습니다.'}}
 function openMaterial76(key){const d=fallbackMaterial(key),count=Number(rpgState.items?.[key])||0;if(count<1)return;document.querySelector('#rpgItemDetailIcon').textContent=d.icon||'📦';document.querySelector('#rpgItemDetailName').textContent=d.name||key;document.querySelector('#rpgItemDetailMeta').textContent=`잡화 · 보유 ${count}개`;document.querySelector('#rpgItemDetailBody').innerHTML=`<b>아이템 설명</b><br>${d.desc||'소지 중인 잡화 아이템입니다.'}<br><br><b>보유 수량</b><br>${count}개<br><br><b>판매가</b><br>${Number(d.price)||0}G / 1개`;const act=document.querySelector('#rpgItemDetailActions');act.innerHTML='<button class="close" data-detail-close>닫기</button>';act.querySelector('[data-detail-close]')?.addEventListener('click',()=>setAppModal('rpgItemDetailModal',false));setAppModal('rpgItemDetailModal',true)}
 const oldInv=rpgRenderInventory;rpgRenderInventory=function(){for(const [k,n] of Object.entries(rpgState.items||{}))if(Number(n)>0)fallbackMaterial(k);oldInv();document.querySelectorAll('#rpgInventoryGrid [data-material-detail-inv]').forEach(b=>b.onclick=()=>openMaterial76(b.dataset.materialDetailInv))};
 try{HuNyangDiag.line('RPG_V4876_READY','smith_art=merchant_copy|shop_confirm=on|inventory_fallback=on|free_hunt_ticker=hidden|presence_text=on|elina_followup=5x5')}catch(_){ }
})();
