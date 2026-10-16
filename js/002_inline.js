
/* ===== v4.8.38 runtime overrides ===== */
(function(){
  const oldPageLocation=rpgPageLocation;
  rpgPageLocation=function(page){if(page==='rpgEquipmentPage')return '라비엔 마을 · 장비창';if(page==='rpgPartyStatusPage')return '라비엔 마을 · 파티 상태';return oldPageLocation(page)};

  function ensureV4836State(){
    if(rpgState.field&&typeof rpgState.field.autoBattle!=='boolean')rpgState.field.autoBattle=false;
    if(rpgState.field&&typeof rpgState.field.autoPattern!=='number')rpgState.field.autoPattern=0;
  }
  const oldHydrate=rpgHydratePage;
  rpgHydratePage=function(page){ensureV4836State();if(page==='rpgEquipmentPage'){rpgRenderEquipmentPage();return}if(page==='rpgInventoryPage'){rpgRenderInventory();return}if(page==='rpgPartyStatusPage'){rpgRenderPartyStatusPage();return}return oldHydrate(page)};

  function rpgEquipmentEmoji(i){if(!i)return '🎒';if(!i.slot){const n=String(i.name||'');if(n.includes('포션')||n.includes('물약'))return '🧪';if(n.includes('점액'))return '💧';return '📦'}if(i.slot==='armor'){const a=i.armorType||'';return a==='plate'?'🛡️':a==='leather'?'🥋':'👕'}const wt=i.weaponType||'';return ({sword:'⚔️',greatsword:'🗡️',spear:'🔱',dagger:'🔪',bow:'🏹',crossbow:'🎯',staff:'🪄',grimoire:'📖',mace:'🔨',guitar:'🎸'})[wt]||'⚔️'}
  window.rpgEquipmentEmoji=rpgEquipmentEmoji;
  function isEquipped(i){return !!i&&((rpgState.equipment?.weapon?.uid===i.uid)||(rpgState.equipment?.armor?.uid===i.uid))}
  function itemCell(i){if(!i)return '<div class="rpgInvCell"></div>';if(i.__material){return `<button class="rpgInvCell filled" data-material-detail-inv="${i.key}" type="button"><span class="rpgItemEmoji">${i.icon||'📦'}</span><span class="rpgItemTinyName">${i.name||'재료'} ×${i.count||0}</span></button>`}const cls=i.rarity==='레어'?' rare':i.rarity==='엘리트'?' elite':'';return `<button class="rpgInvCell filled${cls}" data-item-detail="${i.uid}" type="button"><span class="rpgItemEmoji">${rpgEquipmentEmoji(i)}</span><span class="rpgItemTinyName">${i.name||'아이템'}</span>${isEquipped(i)?'<span class="rpgItemEquippedMark">E</span>':''}</button>`}

  function rpgUnequipItem(uid){rpgEnsureEquipment();for(const slot of ['weapon','armor'])if(rpgState.equipment?.[slot]?.uid===uid)rpgState.equipment[slot]=null;rpgSyncAiEquipment();rpgRenderEquipmentPage();rpgRenderInventory();rpgSaveActiveSlot(null,'unequip');toast('장착을 해제했습니다. AI 파티원 장비도 동기화됩니다.');}
  window.rpgUnequipItem=rpgUnequipItem;
  function rpgOpenItemDetail(uid){const i=rpgState.inventory.find(x=>x?.uid===uid);if(!i)return;const meta=$('#rpgItemDetailMeta'),body=$('#rpgItemDetailBody'),act=$('#rpgItemDetailActions');$('#rpgItemDetailIcon').textContent=rpgEquipmentEmoji(i);$('#rpgItemDetailName').textContent=i.name||'아이템';meta.textContent=i.slot?`${i.rarity||'일반'} · ${i.slot==='weapon'?'무기':'장비'} · 제한 Lv.${i.level||1}`:`잡화`;
    if(i.slot){const set=rpgEquipmentSetBonus({weapon:i.slot==='weapon'?i:rpgState.equipment?.weapon,armor:i.slot==='armor'?i:rpgState.equipment?.armor});const parts=[`<b>기본 효과</b><br>${rpgItemStatsText(i)}`];if(i.setAtk)parts.push(`<br><b>2세트 효과</b><br>근거리/원거리/마법 공격력 +${i.setAtk}${i.extra?`<br>${i.extra}`:''}`);if(i.source==='drop')parts.push(`<br><b>획득처</b><br>몬스터 드랍`);parts.push(`<br><b>판매가</b><br>${rpgSellPrice(i)}G`);body.innerHTML=parts.join('');const eq=isEquipped(i);act.innerHTML=eq?`<button disabled>장착중</button><button class="unequip" data-detail-unequip="${i.uid}">장착 해제</button><button class="close" data-detail-close>닫기</button>`:`<button class="equip" data-detail-equip="${i.uid}" ${(rpgState.level||1)<(i.level||1)?'disabled':''}>장착</button><button class="close" data-detail-close>닫기</button>`;
    }else{body.innerHTML=`<b>아이템 설명</b><br>${i.desc||'소지 중인 잡화 아이템입니다.'}`;act.innerHTML='<button class="close" data-detail-close>닫기</button>'}
    act.querySelector('[data-detail-equip]')?.addEventListener('click',e=>{rpgEquipItem(e.currentTarget.dataset.detailEquip);setAppModal('rpgItemDetailModal',false);rpgRenderEquipmentPage()});act.querySelector('[data-detail-unequip]')?.addEventListener('click',e=>{rpgUnequipItem(e.currentTarget.dataset.detailUnequip);setAppModal('rpgItemDetailModal',false)});act.querySelector('[data-detail-close]')?.addEventListener('click',()=>setAppModal('rpgItemDetailModal',false));setAppModal('rpgItemDetailModal',true)
  }
  window.rpgOpenItemDetail=rpgOpenItemDetail;

  let rpgInventoryView36='all';
  function rpgMaterialInventoryEntries(){const defs=window.V38_materialDefs||{};return Object.entries(rpgState.items||{}).filter(([k,n])=>(Number(n)||0)>0).map(([k,n])=>{const d=defs[k]||{};return {__material:true,key:k,name:d.name||k,icon:d.icon||'📦',desc:d.desc||'소지 중인 재료 아이템입니다.',price:Number(d.price)||0,count:Number(n)||0}})}
  function rpgOpenInventoryMaterial(key){const defs=window.V38_materialDefs||{},d=defs[key];const count=Number(rpgState.items?.[key])||0;if(!d||count<1)return;$('#rpgItemDetailIcon').textContent=d.icon||'📦';$('#rpgItemDetailName').textContent=d.name||key;$('#rpgItemDetailMeta').textContent=`잡화 · 보유 ${count}개`;$('#rpgItemDetailBody').innerHTML=`<b>아이템 설명</b><br>${d.desc||'소지 중인 재료 아이템입니다.'}<br><br><b>판매가</b><br>${Number(d.price)||0}G / 1개`;const act=$('#rpgItemDetailActions');act.innerHTML='<button class="close" data-detail-close>닫기</button>';act.querySelector('[data-detail-close]')?.addEventListener('click',()=>setAppModal('rpgItemDetailModal',false));setAppModal('rpgItemDetailModal',true)}
  rpgRenderInventory=function(){rpgEnsureEquipment();$('#rpgInventoryGold')&&($('#rpgInventoryGold').textContent=`${rpgState.gold||0}G`);const owned=rpgState.inventory.slice(),materials=rpgMaterialInventoryEntries();let list;if(rpgInventoryView36==='equipment')list=owned.filter(i=>!!i?.slot);else if(rpgInventoryView36==='misc')list=[...owned.filter(i=>!i?.slot),...materials];else list=[...owned,...materials];const grid=$('#rpgInventoryGrid');if(grid){const cells=[];for(let k=0;k<40;k++)cells.push(itemCell(list[k]));grid.innerHTML=cells.join('');grid.querySelectorAll('[data-item-detail]').forEach(b=>b.onclick=()=>rpgOpenItemDetail(b.dataset.itemDetail));grid.querySelectorAll('[data-material-detail-inv]').forEach(b=>b.onclick=()=>rpgOpenInventoryMaterial(b.dataset.materialDetailInv))}};
  rpgOpenInventory=function(view='all'){rpgInventoryView36=view==='equipment'||view==='misc'?view:'all';$$('[data-inv-tab]').forEach(b=>b.classList.toggle('active',b.dataset.invTab===rpgInventoryView36));rpgRenderInventory();showPage('rpgInventoryPage')};
  function rpgRenderEquipmentPage(){rpgEnsureEquipment();const av=$('#rpgEquipmentAvatar');if(av)av.src=rpgState.gender==='여성'?rpgPlayerArt.female:rpgPlayerArt.male;const w=$('#rpgEquipmentWeaponSlot'),a=$('#rpgEquipmentArmorSlot');if(w)w.innerHTML=`<span>${rpgEquipmentEmoji(rpgState.equipment.weapon)||'⚔️'}</span><small>무기</small><b>${rpgState.equipment.weapon?.name||'미장착'}</b>`;if(a)a.innerHTML=`<span>${rpgEquipmentEmoji(rpgState.equipment.armor)||'🛡️'}</span><small>장비</small><b>${rpgState.equipment.armor?.name||'미장착'}</b>`;const list=rpgState.inventory.filter(i=>!!i?.slot),grid=$('#rpgEquipmentGrid');if(grid){const cells=[];for(let k=0;k<20;k++)cells.push(itemCell(list[k]));grid.innerHTML=cells.join('');grid.querySelectorAll('[data-item-detail]').forEach(b=>b.onclick=()=>rpgOpenItemDetail(b.dataset.itemDetail))}}
  window.rpgRenderEquipmentPage=rpgRenderEquipmentPage;
  function rpgOpenEquipment(){rpgRenderEquipmentPage();showPage('rpgEquipmentPage')}
  window.rpgOpenEquipment=rpgOpenEquipment;
  $('#rpgEquipmentBack')?.addEventListener('click',rpgOpenStatus);$('#rpgEquipmentWeaponSlot')?.addEventListener('click',()=>{const i=rpgState.equipment?.weapon;if(i)rpgOpenItemDetail(i.uid)});$('#rpgEquipmentArmorSlot')?.addEventListener('click',()=>{const i=rpgState.equipment?.armor;if(i)rpgOpenItemDetail(i.uid)});
  $$('[data-inv-tab]').forEach(b=>{b.onclick=()=>{rpgInventoryView36=b.dataset.invTab;$$('[data-inv-tab]').forEach(x=>x.classList.toggle('active',x===b));rpgRenderInventory()}});

  // Existing listeners cannot be removed, so capture phase routes Character Hub buttons first.
  $('#rpgCharEquipBtn')?.addEventListener('click',e=>{e.stopImmediatePropagation();rpgOpenEquipment()},true);
  $('#rpgCharInventoryBtn')?.addEventListener('click',e=>{e.stopImmediatePropagation();rpgOpenInventory('all')},true);
  $('#rpgInventoryBack')?.addEventListener('click',e=>{e.stopImmediatePropagation();rpgOpenStatus()},true);

  function partyMemberModel(which){const isP=which==='player',s=isP?rpgState:(which==='ai2'?rpgState.ai2:rpgState.ai);if(!s)return null;rpgEnsureGrowth(s);rpgEnsureEquipment(s);const job=isP?rpgState.job:s.job,gender=isP?rpgState.gender:s.gender,d=rpgDerived(job,s.stats,s.skills,s.equipment),fieldU=rpgState.field?.party?.find(x=>x.id===which),hp=Math.max(0,Math.round(s.currentHp??fieldU?.hp??d.maxHp)),mp=Math.max(0,Math.round(s.currentMp??fieldU?.mp??d.maxMp));return {which,s,name:s.name,job,gender,d,hp,mp,level:s.level||1,fieldU}}
  function rpgRenderPartyDetail36(selected='player',rows=null){
    const detail=$('#rpgPartyDetail');if(!detail)return;
    rows=rows||[partyMemberModel('player'),partyMemberModel('ai'),partyMemberModel('ai2')].filter(Boolean);
    const u=rows.find(x=>x.which===selected)||rows[0];if(!u)return;
    const weaponType=u.s.equipment?.weapon?.weaponType||null,weaponSkill=window.GW79_WEAPON_SKILLS?.[weaponType],
      normalSkills=rpgSkillDefs.filter(s=>!s.weaponBasic&&(u.s.skills?.[s.id]||0)>0).map(s=>`${s.emoji}${s.name} Lv.${u.s.skills[s.id]}`),
      skills=[...(weaponType==='seriaTealStaff'?['💚힐링 Lv.1 (전용)','🌊힐링 웨이브 Lv.1 (전용)','✨큐어 Lv.1 (전용)']:(weaponSkill?[`${weaponSkill.emoji}${weaponSkill.name} Lv.1 (무기 기본)`]:[])),...normalSkills].join(' · ')||'없음';
    detail.innerHTML=`<div class="rpgStatusSheet"><div class="rpgStatusSheetHead"><span>${u.name}</span><span>${u.job?.name||'모험가'} · Lv.${u.level}</span></div><div class="rpgPartyDetailGrid"><div><b>체력 / 힘</b><strong>${u.s.stats.hp} / ${u.s.stats.str}</strong></div><div><b>민첩 / 지능</b><strong>${u.s.stats.dex} / ${u.s.stats.int}</strong></div><div><b>행운</b><strong>${u.s.stats.luck}</strong></div><div><b>공격속도</b><strong>${u.d.attackSpeed}</strong></div><div><b>근거리 / 원거리</b><strong>${u.d.meleeAtk} / ${u.d.rangedAtk}</strong></div><div><b>마법 공격</b><strong>${u.d.magicAtk}</strong></div><div><b>물리 / 마법 방어</b><strong>${u.d.physicalDefense} / ${u.d.magicDefense}</strong></div><div><b>장비</b><strong>${u.s.equipment?.weapon?.name||'무기 없음'}<br>${u.s.equipment?.armor?.name||'장비 없음'}</strong></div></div><div class="rpgPartyReadOnly">스킬: ${skills}<br>이 화면은 확인 전용이며 파티원 설정은 변경할 수 없습니다.</div></div>`;
    const host=$('#rpgPartyMemberList');
    host?.querySelectorAll('[data-party-detail]').forEach(card=>card.classList.toggle('selected',card.dataset.partyDetail===u.which));
  }
  function rpgRenderPartyStatusPage(selected='player'){
    const host=$('#rpgPartyMemberList'),detail=$('#rpgPartyDetail');if(!host||!detail)return;
    const rows=[partyMemberModel('player'),partyMemberModel('ai'),partyMemberModel('ai2')].filter(Boolean);
    host.innerHTML=rows.map(u=>{const hpPct=Math.max(0,Math.min(100,u.hp/u.d.maxHp*100)),mpPct=Math.max(0,Math.min(100,u.mp/u.d.maxMp*100)),art=u.gender==='여성'?rpgPlayerArt.female:rpgPlayerArt.male,status=u.hp<=0?'전투 불능':u.fieldU?.defending?'방어 중':'정상',effects=[];if((u.fieldU?.shield||0)>0)effects.push(`보호막 ${u.fieldU.shield}`);return `<button class="rpgPartyMemberCard" data-party-detail="${u.which}" type="button"><img src="${art}" alt="${u.name}" draggable="false"><div><h3>${u.name}</h3><div class="rpgPartyMemberMeta">${u.job?.name||'모험가'} · Lv.${u.level}<br>상태: ${status}<br>버프/디버프: ${effects.length?effects.join(', '):'없음'}</div><div class="rpgPartyMemberBars"><div class="rpgPartyMemberMeta">HP ${u.hp}/${u.d.maxHp}</div><div class="rpgPartyMemberBar hp"><i style="width:${hpPct}%"></i></div><div class="rpgPartyMemberMeta">MP ${u.mp}/${u.d.maxMp}</div><div class="rpgPartyMemberBar mp"><i style="width:${mpPct}%"></i></div></div></div></button>`}).join('');
    host.querySelectorAll('[data-party-detail]').forEach(b=>b.onclick=()=>rpgRenderPartyDetail36(b.dataset.partyDetail));
    rpgRenderPartyDetail36(selected,rows);
  }
  window.rpgRenderPartyStatusPage=rpgRenderPartyStatusPage;
  function rpgOpenPartyStatus(){rpgRenderPartyStatusPage('player');showPage('rpgPartyStatusPage')}
  $('#rpgVillagePartyBtn')?.addEventListener('click',rpgOpenPartyStatus);$('#rpgPartyStatusBack')?.addEventListener('click',rpgOpenVillage);

  // Add emojis to shop cards without changing stored item names.
  const oldItemCardHtml=rpgItemCardHtml;
  rpgItemCardHtml=function(i,mode='shop'){const html=oldItemCardHtml(i,mode);return html.replace(`<div class="rpgItemName">${i.name}</div>`,`<div class="rpgItemName">${rpgEquipmentEmoji(i)} ${i.name}</div>`)};

  // Field/battle UI updates.
  const oldStartJourney=rpgStartJourney;
  rpgStartJourney=function(){oldStartJourney();ensureV4836State()};
  const oldBeginBattle=rpgBeginBattle;
  rpgBeginBattle=function(){oldBeginBattle();ensureV4836State();if(rpgState.field){rpgState.field.autoPattern=0}};
  const oldRenderCenter=rpgRenderCenter;
  rpgRenderCenter=function(){oldRenderCenter();const f=rpgState.field,host=$('#rpgCenterActions');if(!f?.battle||!host)return;host.insertAdjacentHTML('beforeend',`<div class="rpgAutoBattleRow"><span>자동 사냥</span><button class="rpgAutoSwitch${f.autoBattle?' on':''}" id="rpgAutoBattleToggle" type="button" aria-pressed="${f.autoBattle?'true':'false'}"><i></i></button></div>`);$('#rpgAutoBattleToggle')?.addEventListener('pointerdown',(e)=>{e.preventDefault();e.stopPropagation();const btn=e.currentTarget;HuNyangDiag.line('RPG_AUTO_BATTLE_INPUT',e.pointerType||'pointer');f.autoBattle=!f.autoBattle;btn.classList.toggle('on',f.autoBattle);btn.setAttribute('aria-pressed',f.autoBattle?'true':'false');HuNyangDiag.line('RPG_AUTO_BATTLE',f.autoBattle?'ON':'OFF');rpgSaveActiveSlot('rpgFieldPage','auto_battle_toggle')})};

  function rpgUsePotionAuto(player){const idx=rpgState.inventory.findIndex(i=>!i?.slot&&/(포션|물약)/.test(String(i?.name||'')));if(idx<0)return false;const item=rpgState.inventory[idx],heal=Math.max(1,Math.round(player.derived.maxHp*.35));player.hp=Math.min(player.derived.maxHp,player.hp+heal);if((item.qty||1)>1)item.qty--;else rpgState.inventory.splice(idx,1);rpgLog(`🧪 ${player.name}이 ${item.name}을 사용해 HP ${heal} 회복!`);rpgResetGauge(player);return true}
  window.rpgUsePotionAuto=rpgUsePotionAuto;
  function rpgAutoPlayerAction(){const f=rpgState.field,b=f?.battle,p=f?.party?.[0];if(!f?.autoBattle||!b||!p||p.dead||p.gauge<100)return false;const living=b.enemies.map((e,i)=>({e,i})).filter(x=>!x.e.dead);if(!living.length)return false;if(p.hp/p.derived.maxHp<=.30){if(window.rpgUsePotionAuto?.(p)){HuNyangDiag.line('RPG_AUTO_ACTION','potion');return true}HuNyangDiag.line('RPG_AUTO_ACTION','defend');return rpgExecutePlayerAction({type:'defend'})}const step=f.autoPattern||0;f.autoPattern=(step+1)%3;if(step===2){const skills=rpgKnownActiveSkills(p).filter(s=>(p.skillCooldowns?.[s.id]||0)<=0&&p.mp>=s.mp);if(skills.length){const s=skills[0];HuNyangDiag.line('RPG_AUTO_ACTION',`skill:${s.id}`);if(s.kind==='heal')return rpgExecutePlayerAction({type:'skill',skillId:s.id});const target=living[Math.floor(Math.random()*living.length)];return rpgExecutePlayerAction({type:'skill',skillId:s.id,target:target.i})}}const target=living[Math.floor(Math.random()*living.length)];HuNyangDiag.line('RPG_AUTO_ACTION',`attack:${target.i}`);return rpgExecutePlayerAction({type:'attack',target:target.i})}
  window.rpgAutoPlayerAction=rpgAutoPlayerAction;

  // Tick at 20fps and only full-render at 10fps, reducing DOM churn that swallowed clicks.
  let rpgV36RenderAcc=0;
  const oldBattleTick=rpgBattleTick;
  rpgBattleTick=function(){const before=performance.now();const f=rpgState.field,b=f?.battle;if(!b){rpgStopBattleTicker();return}const now=performance.now(),dt=Math.min(.25,Math.max(0,(now-(rpgBattleLast||now))/1000));rpgBattleLast=now;for(const u of f.party){const w=b.enemies?.find(e=>e.type==='wolfBoss'&&!e.dead&&e._wolf932?.rageActive&&String(e._wolf932.markedId4936)===String(u.id));if(w){u.gauge=0;continue}if(!u.dead&&u.gauge<100)u.gauge=Math.min(100,u.gauge+rpgGaugeRate(rpgUnitAttackSpeed(u))*dt)}for(const e of b.enemies){if(!e.dead&&e.gauge<100){const qualificationSlow=(e.type==='wolfBoss'&&!!e._wolf932?.breakMode)||(e.type==='wolfBoss'&&!!e._wolf?.breakMode)||(e.type==='wolfBoss'&&!!e._wolfState?.breakMode);e.gauge=Math.min(100,e.gauge+(qualificationSlow?(100/30):rpgGaugeRate(rpgUnitAttackSpeed(e)))*dt)}}const ai=f.party.find(u=>u.id==='ai');if(ai?.gauge>=100)rpgAiAtbAction(ai);rpgAutoPlayerAction();b.enemies.forEach((e,i)=>{if(e.gauge>=100)rpgEnemyAtbAction(e,i)});rpgCheckBattleEnd();rpgV36RenderAcc+=dt;if(rpgState.field?.battle&&rpgV36RenderAcc>=.10){rpgV36RenderAcc=0;rpgRenderField()}};
  rpgStartBattleTicker=function(){rpgStopBattleTicker();if(!rpgState.field?.battle)return;rpgBattleLast=performance.now();rpgV36RenderAcc=0;rpgBattleTicker=setInterval(rpgBattleTick,50)};

  // Fast input path: pointerdown fires before the 100ms render can replace the pressed element.
  const battleHost=$('#rpgBattleActions');
  battleHost?.addEventListener('pointerdown',e=>{const btn=e.target.closest('button');if(!btn||btn.disabled)return;const f=rpgState.field,p=f?.party?.[0];if(!f?.battle)return;e.preventDefault();e.stopPropagation();if(btn.id==='rpgAtkBtn'){HuNyangDiag.line('RPG_BATTLE_INPUT_ATTACK','pointerdown');if(!p||p.gauge<100){HuNyangDiag.line('RPG_BATTLE_INPUT_REJECT','attack:not_ready');return}f.skillMenu=false;f.pendingSkill=null;f.targetMode=true;rpgRenderField();return}if(btn.id==='rpgSkillBtn'){HuNyangDiag.line('RPG_BATTLE_INPUT_SKILL','pointerdown');rpgOpenSkillMenu();return}if(btn.id==='rpgDefBtn'){HuNyangDiag.line('RPG_BATTLE_INPUT_DEFEND','pointerdown');rpgExecutePlayerAction({type:'defend'});return}if(btn.id==='rpgRunBtn'){HuNyangDiag.line('RPG_BATTLE_INPUT_RUN','pointerdown');rpgExecutePlayerAction({type:'run'});return}if(btn.matches('[data-skill]')){HuNyangDiag.line('RPG_BATTLE_INPUT_SKILL_CHOICE',btn.dataset.skill);rpgChooseBattleSkill(btn.dataset.skill);return}if(btn.id==='rpgSkillCancelBtn'){f.skillMenu=false;f.pendingSkill=null;f.targetMode=false;rpgRenderField()}},true);
  $('#rpgCombatEnemy')?.addEventListener('pointerdown',e=>{const unit=e.target.closest('.rpgCombatUnit[data-enemy]');if(!unit||!unit.classList.contains('targetable'))return;e.preventDefault();e.stopPropagation();const idx=Number(unit.dataset.enemy);HuNyangDiag.line('RPG_BATTLE_TARGET_CLICK',String(idx));const before=rpgState.field?.party?.[0]?.gauge||0;rpgPlayerAttack(idx);const after=rpgState.field?.party?.[0]?.gauge||0;if(after<before)HuNyangDiag.line('RPG_BATTLE_ACTION_EXEC',`target:${idx}`);else HuNyangDiag.line('RPG_BATTLE_INPUT_REJECT','target:no_action')},true);

  // Ensure buttons/listeners added after original script are active.
  rpgRenderVillage();
})();
