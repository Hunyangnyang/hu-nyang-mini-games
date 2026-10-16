
(()=>{
  'use strict';
  const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];

  const isEquipped4903=item=>!!item&&(rpgState.equipment?.weapon?.uid===item.uid||rpgState.equipment?.armor?.uid===item.uid);
  const isEnhanced4903=item=>(Number(item?.enhanceLevel)||0)>0;
  const confirmEnhanced4903=(item,action,cb)=>{
    if(!isEnhanced4903(item)){cb?.();return}
    rpgShowConfirm('⚠️ 강화 장비 경고',`${item.name}은(는) +${item.enhanceLevel} 강화 장비입니다.\n정말 ${action} 대상으로 선택하시겠습니까?`,cb);
  };

  /* 1/2. Sale list: hide equipped equipment and warn before selecting enhanced gear. */
  function patchSaleHost4903(host){
    if(!host)return;
    qa('[data-sale-card4901]',host).forEach(card=>{
      const key=card.dataset.saleCard4901||'';
      if(!key.startsWith('inv:'))return;
      const uid=key.slice(4),item=(rpgState.inventory||[]).find(x=>x?.uid===uid);
      if(!item)return;
      if(isEquipped4903(item))return;
      if(card.dataset.warnEnhanced4903)return;
      card.dataset.warnEnhanced4903='1';
      const plus=qa('[data-step]',card).filter(b=>Number(b.dataset.step)>0);
      plus.forEach(btn=>{
        btn.addEventListener('click',e=>{
          if(!isEnhanced4903(item))return;
          if(card.dataset.enhancedApproved4903==='1')return;
          e.preventDefault();e.stopImmediatePropagation();
          confirmEnhanced4903(item,'판매',()=>{
            card.dataset.enhancedApproved4903='1';
            btn.click();
          });
        },true);
      });
    });
  }
  document.addEventListener('click',()=>setTimeout(()=>{
    patchSaleHost4903(q('#rpgInventoryList'));
    patchSaleHost4903(q('#rpgGeneralInventoryList'));
  },0),true);

  /* Dismantle warnings, including batch selection. Equipped cards are already filtered out in v4.9.03. */
  document.addEventListener('click',e=>{
    const card=e.target.closest('#gwSmithDismantle4900 [data-dcard4901]');
    if(!card)return;
    const item=(rpgState.inventory||[]).find(x=>x?.uid===card.dataset.dcard4901);
    if(!item||!isEnhanced4903(item)||card.dataset.enhancedApproved4903==='1')return;
    const action=e.target.closest('[data-one-dismantle4901]')?'분해':'분해';
    e.preventDefault();e.stopImmediatePropagation();
    confirmEnhanced4903(item,action,()=>{
      card.dataset.enhancedApproved4903='1';
      const btn=e.target.closest('button');
      (btn||card).click();
    });
  },true);

  /* 3. Keep art pinned while page UI scrolls. */
  const fixPageScroll4903=id=>{
    const page=q('#'+id);if(!page)return;
    const scroller=page.querySelector(':scope > .content,:scope > .screen');
    if(scroller)scroller.scrollTop=Math.min(scroller.scrollTop,scroller.scrollHeight-scroller.clientHeight);
  };

  /* 5/6. Field controls + item bubble */
  function defs4903(){return window.V38_materialDefs||{}}
  function consumables4903(){
    return Object.entries(defs4903())
      .filter(([k,d])=>d?.consumable&&(Number(rpgState.items?.[k])||0)>0)
      .map(([key,d])=>({key,...d,count:Number(rpgState.items[key])||0}));
  }
  function fieldItemState4903(){
    const f=rpgState.field;if(!f)return null;
    return f._gwFieldItem4903||(f._gwFieldItem4903={open:false,selected:null,stage:'list'});
  }
  function closeFieldItem4903(){
    const s=fieldItemState4903();if(s){s.open=false;s.selected=null;s.stage='list'}
    q('#gwFieldItemBubble4903')?.remove();
  }
  function renderFieldItem4903(){
    const f=rpgState.field,host=q('#rpgCenterActions');if(!f||!host||f.encounter||f.battle)return;
    q('#gwFieldItemBubble4903')?.remove();
    const st=fieldItemState4903();if(!st?.open)return;
    const pop=document.createElement('div');pop.className='gwFieldItemBubble4903';pop.id='gwFieldItemBubble4903';
    const d=st.selected?defs4903()[st.selected]:null;
    if(st.stage==='targets'&&d){
      pop.innerHTML=`<div class="gwFieldItemHead4903"><b>${d.icon||'🎒'} ${d.name} · 대상 선택</b><button data-field-item-close4903>닫기</button></div>
      <div class="gwFieldTargetGrid4903">${(f.party||[]).slice(0,3).map((u,i)=>`<button type="button" data-field-item-target4903="${i}" ${u.dead?'disabled':''}>${u.name}<br><small>HP ${Math.round(u.hp||0)}/${u.derived?.maxHp||0}<br>MP ${Math.round(u.mp||0)}/${u.derived?.maxMp||0}</small></button>`).join('')}</div>`;
    }else if(st.stage==='use'&&d){
      pop.innerHTML=`<div class="gwFieldItemHead4903"><b>아이템 사용</b><button data-field-item-close4903>닫기</button></div>
      <div class="gwFieldItemUse4903"><div class="selected">${d.icon||'🎒'} <b>${d.name}</b> ×${Number(rpgState.items?.[st.selected])||0}<br><small>${String(d.consumable).toUpperCase()} ${d.restore} 회복</small></div><button class="useBtn" type="button" data-field-item-use4903>사용하기</button></div>`;
    }else{
      const items=consumables4903().slice(0,8);
      const slots=Array.from({length:8},(_,i)=>items[i]||null);
      pop.innerHTML=`<div class="gwFieldItemHead4903"><b>🎒 소모품</b><button data-field-item-close4903>닫기</button></div>
      <div class="gwFieldItemGrid4903">${slots.map(it=>it?`<button class="gwFieldItem4903" type="button" data-field-item4903="${it.key}"><strong>${it.icon||'🎒'}</strong>${it.name}<small>×${it.count}</small></button>`:`<div class="gwFieldItemEmpty4903"></div>`).join('')}</div>`;
    }
    host.appendChild(pop);
    q('[data-field-item-close4903]',pop)?.addEventListener('click',()=>{closeFieldItem4903()});
    qa('[data-field-item4903]',pop).forEach(b=>b.addEventListener('click',()=>{st.selected=b.dataset.fieldItem4903;st.stage='use';renderFieldItem4903()}));
    q('[data-field-item-use4903]',pop)?.addEventListener('click',()=>{st.stage='targets';renderFieldItem4903()});
    qa('[data-field-item-target4903]',pop).forEach(b=>b.addEventListener('click',()=>{
      const idx=Number(b.dataset.fieldItemTarget4903),u=f.party?.[idx],def=defs4903()[st.selected];
      if(!u||u.dead||!def?.consumable||(Number(rpgState.items?.[st.selected])||0)<=0)return;
      const hp=def.consumable==='hp',max=hp?(u.derived?.maxHp||u.hp||1):(u.derived?.maxMp||u.mp||1),cur=hp?(u.hp||0):(u.mp||0);
      if(cur>=max){toast?.(`${hp?'HP':'MP'}가 이미 가득 찼습니다.`);return}
      const next=Math.min(max,cur+(Number(def.restore)||0));
      rpgState.items[st.selected]-=1;
      if(hp)u.hp=next;else u.mp=next;
      rpgLog(`${def.icon||'🎒'} ${u.name}에게 ${def.name} 사용 · ${hp?'HP':'MP'} +${next-cur}`);
      rpgAdvanceTurns(1,'사냥터 아이템 사용');
      rpgSyncVitalsFromField?.();
      rpgSaveActiveSlot?.(null,'field_item_v4903');
      closeFieldItem4903();rpgRenderField();
    }));
  }

  const oldCenter4903=rpgRenderCenter;
  rpgRenderCenter=function(){
    oldCenter4903();
    const f=rpgState.field,host=q('#rpgCenterActions');if(!f||!host)return;
    if(!f.battle&&!f.encounter){
      host.innerHTML=`<button class="rpgCenterBtn" id="rpgMoveBtn" type="button">➜<br>이동</button><button class="rpgCenterBtn" id="rpgFieldItemBtn4903" type="button">🎒<br>아이템</button><button class="rpgCenterBtn safe" id="rpgReturnVillageBtn" type="button">🏠 마을<br>귀환</button>`;
      rpgBindPress(q('#rpgMoveBtn'),rpgMoveStep);
      rpgBindPress(q('#rpgReturnVillageBtn'),rpgReturnVillage);
      rpgBindPress(q('#rpgFieldItemBtn4903'),()=>{const st=fieldItemState4903();st.open=!st.open;st.selected=null;st.stage='list';renderFieldItem4903()});
      renderFieldItem4903();
    }else closeFieldItem4903();
  };

  /* 7/8. Move lock, 1-2 sec progress, encounter announcement. */
  const immediateMove4903=rpgMoveStep;
  rpgMoveStep=function(){
    const f=rpgState.field;if(!f||f.encounter||f.battle||f._gwMoving4903)return;
    closeFieldItem4903();
    f._gwMoving4903=true;
    const ms=1000+Math.floor(Math.random()*1001),btn=q('#rpgMoveBtn');
    if(btn){btn.disabled=true;btn.classList.add('gwMoving4903');btn.style.setProperty('--gwMoveMs',ms+'ms');btn.innerHTML='⏳<br>이동 중...'}
    window.GWApplyFieldLeaderStage94?.();
    setTimeout(()=>{
      const beforeEncounter=!!f.encounter;
      f._gwMoving4903=false;
      window.GWApplyFieldLeaderStage94?.();
      immediateMove4903();
      const nowF=rpgState.field;
      if(nowF?.encounter&&!beforeEncounter){
        const name=nowF.encounter.strongestName||nowF.encounter.enemies?.[0]?.name||'마물';
        showEncounterNotice4903(`${name}이(가) 등장했습니다!`);
      }
      if(activePageId?.()==='rpgFieldPage')rpgRenderField();
    },ms);
  };
  function showEncounterNotice4903(msg){
    const scene=q('#rpgScene');if(!scene)return;
    q('#gwEncounterNotice4903')?.remove();
    const el=document.createElement('div');el.className='gwEncounterNotice4903';el.id='gwEncounterNotice4903';el.textContent='⚠️ '+msg;scene.appendChild(el);
    setTimeout(()=>el.remove(),2300);
  }

  /* 9. Replace small auto switch with a plain click handler and larger hit box. */
  /* v4.9.12: legacy v4.9.03 auto-switch patch removed; v4.8.69 binding is authoritative. */

  /* v4.9.12: equipped gear is excluded by the source shop renderers before first paint. */

  /* Reapply small UI fixes after page rendering, without a MutationObserver loop. */
  const oldShow4903=showPage;
  showPage=function(id,dir='auto'){
    const v=oldShow4903(id,dir);
    requestAnimationFrame(()=>{
      fixPageScroll4903(id);
      if(id==='rpgShopPage'||id==='rpgGeneralShopPage')setTimeout(()=>patchSaleHost4903(id==='rpgShopPage'?q('#rpgInventoryList'):q('#rpgGeneralInventoryList')),30);
    });
    return v;
  };

  /* Ensure current UI gets filtered once at boot. */
  setTimeout(()=>{patchSaleHost4903(q('#rpgInventoryList'));patchSaleHost4903(q('#rpgGeneralInventoryList'))},80);

  try{HuNyangDiag.line('RPG_V4903_READY','equipped_hidden=sell+dismantle|enhanced_warning=on|ui_scroll=internal|field_party=3wide|field_item=4x2_1turn|move_delay=1_2s|encounter_notice=on|auto_toggle_hitbox=fix|split_elite=front|giant_hp=840|guard_reflect=30pct|ai_skill_cell_fix=on|wolf_freehunt=1pct_no_overwrite')}catch(_){}
})();
