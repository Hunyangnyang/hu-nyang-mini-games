(()=>{'use strict';
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

function injectCss57(){
  if(q('#gwBatchPatch57Style'))return;
  const style=document.createElement('style');
  style.id='gwBatchPatch57Style';
  style.textContent=`
  #rpgBattlePage .rpgBattleUnit2D.enemy:not(.boss):not(.gwGSBoss87):not(.gwWolf4904) .rpgBattleUnitSprite img{width:68px!important;height:68px!important;max-width:none!important;max-height:none!important;object-fit:contain}
  #rpgFieldPage .gwFieldPopup57{display:none;position:relative;margin:8px 0 4px;z-index:5}
  #rpgFieldPage .gwFieldPopup57.show{display:block}
  #rpgFieldPage .gwFieldPopupCard57{background:linear-gradient(180deg,#fffaf1 0%,#fff4e1 100%);border:2px solid #d7b080;border-radius:16px;padding:12px 14px;box-shadow:0 10px 24px rgba(65,45,30,.16);color:#5c3d2b}
  #rpgFieldPage .gwFieldPopupTitle57{font-weight:800;font-size:15px;margin-bottom:6px}
  #rpgFieldPage .gwFieldPopupBody57{font-size:13px;line-height:1.55;white-space:pre-line}
  #rpgFieldPage .gwFieldPopupBody57 ul{margin:8px 0 0 18px;padding:0}
  #rpgFieldPage .gwFieldPopupBody57 li{margin:3px 0}
  #rpgFieldPage #rpgCenterActions:has(.gwEventBtn57){display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;gap:10px!important;min-height:78px!important}
  #rpgFieldPage #rpgCenterActions .gwEventBtn57{min-height:78px!important;width:min(43%,180px)!important;flex:0 1 180px!important;margin:0!important;position:relative!important;inset:auto!important}
  #rpgFieldPage .rpgCenterActions .gwEventBtn57 small{display:block;font-size:11px;opacity:.8}
  `;
  document.head.appendChild(style);
}
injectCss57();

function materialName57(key){
  return window.V38_materialDefs?.[key]?.name||(typeof materialDefs!=='undefined'&&materialDefs[key]?.name)||({scrapMetal:'고철',usableScrap:'쓸만한 고철',enhancementStone:'강화석'}[key])||key;
}
function weightedQty57(min,max,power=1.7){
  const span=Math.max(0,max-min);
  return min+Math.floor(Math.pow(Math.random(),power)*(span+1));
}
function uniquePositions57(total){
  const out=[];
  while(out.length<total){
    const p=Math.floor(Math.random()*9);
    if(!out.includes(p))out.push(p);
  }
  return out;
}
function buildEncounter57(defs){
  const positions=uniquePositions57(defs.length);
  const enemies=defs.map((def,i)=>window.rpgCreateEncounterEnemy(def,positions[i],i));
  const encounter={count:enemies.length,type:enemies.some(e=>e?.boss)?'boss':'mixed',enemies};
  const strongest=window.rpgStrongestEncounterEnemy?rpgStrongestEncounterEnemy(encounter):enemies[0];
  encounter.strongestType=strongest?.type||null;
  encounter.strongestName=strongest?.name||'마물';
  return encounter;
}
function buildBossEncounter57(typeId){
  const active=normalizeQuest57();
  if(active?.id==='f_boss_wolf')typeId='wolfBoss';
  else if(active?.id==='f_boss_slime')typeId='slimeBoss';
  // rpgSlimeDefs is a global lexical const, not a window property. Never silently substitute another boss.
  const def=(typeof rpgSlimeDefs!=='undefined'&&rpgSlimeDefs[typeId]?.id===typeId)?rpgSlimeDefs[typeId]:null;
  if(!def){try{HuNyangDiag.line('RPG_ENCOUNTER_ERROR',JSON.stringify({reason:'BOSS_DEFINITION_MISSING',requestedType:typeId,questId:active?.id||null}))}catch(_){};return null;}
  if(!def)return null;
  const enemy=window.rpgCreateEncounterEnemy(def,4,0);
  enemy.position=4;
  enemy.boss=true;
  enemy.footprint=Array.isArray(def.footprint)&&def.footprint.length?[...def.footprint]:[1,3,4,5,7];
  const encounter={count:1,type:'boss',enemies:[enemy],strongestType:enemy.type,strongestName:enemy.name||'보스'};
  return encounter;
}
function weightedPickDef57(pool){
  const list=(pool||[]).filter(Boolean);
  if(!list.length)return null;
  const total=list.reduce((s,d)=>s+Math.max(1,Number(d?.chance)||0),0);
  let roll=Math.random()*total;
  for(const def of list){
    roll-=Math.max(1,Number(def?.chance)||0);
    if(roll<0)return def;
  }
  return list[0];
}
function buildRandomEncounter57(){
  const pool=[rpgSlimeDefs?.green,rpgSlimeDefs?.blue,rpgSlimeDefs?.wolf,rpgSlimeDefs?.red].filter(Boolean);
  const total=1+Math.floor(Math.random()*4);
  const defs=[];
  const counts={};
  while(defs.length<total){
    const available=pool.filter(def=>(counts[def.id]||0)<Math.max(1,Number(def?.count?.[1])||4));
    const pick=weightedPickDef57(available.length?available:pool);
    if(!pick)break;
    counts[pick.id]=(counts[pick.id]||0)+1;
    defs.push(pick);
  }
  return defs.length?buildEncounter57(defs):null;
}
function inferEnemyTypes57(quest){
  const list=Array.isArray(quest?.enemyTypes)&&quest.enemyTypes.length?quest.enemyTypes.filter(Boolean):null;
  if(list)return [...new Set(list)];
  const label=`${quest?.enemyLabel||''}${quest?.name||''}`;
  if(label.includes('늑대왕'))return ['wolfBoss'];
  if(label.includes('늑대'))return ['wolf'];
  if(label.includes('거대 슬라임'))return ['slimeBoss'];
  return ['green','blue','red'];
}
function normalizeQuest57(){
  const src=rpgState?.quest;
  if(!src||src.rewarded)return null;
  const def=typeof window.rpgQuestById==='function'?rpgQuestById(src.id,src.rank):null;
  const quest={...(def||{}),...(src||{})};
  quest.target=Math.max(0,Number(quest.target)||0);
  quest.kills=Math.max(0,Number(quest.kills)||0);
  quest.isBoss=!!quest.isBoss;
  quest.routeTotal=Math.max(1,Number(quest.routeTotal)||5);
  quest.enemyTypes=inferEnemyTypes57(quest);
  // Guild boss quest IDs are authoritative even if a legacy save retained another boss type.
  if(quest.id==='f_boss_wolf'){quest.isBoss=true;quest.enemyTypes=['wolfBoss'];quest.enemyLabel='늑대왕';}
  if(quest.id==='f_boss_slime'){quest.isBoss=true;quest.enemyTypes=['slimeBoss'];quest.enemyLabel='거대 슬라임';}
  quest.enemyLabel=quest.enemyLabel||def?.enemyLabel||((quest.enemyTypes[0]&&rpgSlimeDefs?.[quest.enemyTypes[0]]?.name)||'마물');
  return quest;
}
function ensureQuestTracker57(field,quest){
  if(!field||!quest||quest.isBoss)return null;
  const current=field.questTracker57||{};
  const remaining=Math.max(0,quest.target-quest.kills);
  let deadline=Math.max(15,Number(current.deadlineStep)||15);
  while(remaining>Math.max(1,deadline-(Number(current.step)||0))*3)deadline+=5;
  const tracker=field.questTracker57={
    questId:quest.id,
    step:Math.max(0,Number(current.step)||0),
    deadlineStep:deadline,
    openedAtTurn:Number(current.openedAtTurn)||Number(rpgState?.worldTurn)||0
  };
  return tracker;
}
function syncQuestField57(field,quest){
  if(!field)return;
  if(!quest){
    delete field.questTracker57;
    return;
  }
  if(quest.isBoss){
    field.questRouteTotal=15;
    if(!Number.isFinite(Number(field.questRouteProgress)))field.questRouteProgress=0;
    if(typeof field.questObjectiveReached!=='boolean')field.questObjectiveReached=!!quest.completed;
    return;
  }
  const tracker=ensureQuestTracker57(field,quest);
  field.questRouteTotal=Math.max(15,Number(tracker?.deadlineStep)||15);
  field.questRouteProgress=Math.max(0,Number(tracker?.step)||0);
  field.questObjectiveReached=true;
}
function buildQuestEncounter57(quest,field,force=false){
  if(!quest||quest.completed)return null;
  if(quest.isBoss)return buildBossEncounter57(quest.enemyTypes?.[0]);
  const tracker=ensureQuestTracker57(field,quest);
  const remaining=Math.max(0,quest.target-quest.kills);
  if(remaining<=0)return null;
  while(remaining>Math.max(1,(tracker.deadlineStep-tracker.step+1))*3)tracker.deadlineStep+=5;
  const stepsLeft=Math.max(1,tracker.deadlineStep-tracker.step+1);
  const mustSpawn=force||stepsLeft<=Math.ceil(remaining/3)||tracker.step>=tracker.deadlineStep;
  const urgency=clamp(tracker.step/Math.max(1,tracker.deadlineStep),0,1);
  const chance=mustSpawn?1:clamp(0.18+urgency*0.55+Math.min(0.12,remaining*0.01),0.18,0.95);
  if(Math.random()>=chance)return null;

  const targetPool=quest.enemyTypes.map(id=>rpgSlimeDefs?.[id]).filter(Boolean);
  const fillerPool=[rpgSlimeDefs?.green,rpgSlimeDefs?.blue,rpgSlimeDefs?.wolf,rpgSlimeDefs?.red].filter(def=>def&&!quest.enemyTypes.includes(def.id));
  const counts={};
  const avgNeed=Math.ceil(remaining/stepsLeft);
  let targetCount;
  if(mustSpawn){
    targetCount=clamp(avgNeed,1,Math.min(3,remaining));
    if(urgency>0.85&&remaining>=targetCount+1)targetCount=Math.min(3,targetCount+1,remaining);
  }else{
    targetCount=1;
    if(avgNeed>=2&&Math.random()<0.55+urgency*.25)targetCount=2;
    if(avgNeed>=3&&Math.random()<0.22+urgency*.33)targetCount=3;
    targetCount=Math.min(targetCount,remaining,3);
  }
  const total=Math.max(targetCount,Math.min(4,targetCount+(Math.random()<0.62?1:0)+(Math.random()<0.20?1:0)));
  const defs=[];
  for(let i=0;i<targetCount;i++){
    const available=targetPool.filter(def=>(counts[def.id]||0)<Math.max(1,Number(def?.count?.[1])||4));
    const pick=weightedPickDef57(available.length?available:targetPool);
    if(!pick)break;
    counts[pick.id]=(counts[pick.id]||0)+1;
    defs.push(pick);
  }
  while(defs.length<total){
    const pool=(fillerPool.length?fillerPool:targetPool).filter(def=>(counts[def.id]||0)<Math.max(1,Number(def?.count?.[1])||4));
    const pick=weightedPickDef57(pool.length?pool:(fillerPool.length?fillerPool:targetPool));
    if(!pick)break;
    counts[pick.id]=(counts[pick.id]||0)+1;
    defs.push(pick);
  }
  return defs.length?buildEncounter57(defs):null;
}
function maybeCreateInspectEvent57(field){
  if(!field||field.pendingEvent57||field.rewardPopup57||field.encounter||field.battle)return false;
  if(Math.random()>=0.0625)return false;
  field.pendingEvent57={kind:'inspect'};
  return true;
}
function ensureFieldPopup57(){
  const page=q('#rpgFieldPage .content');
  if(!page)return null;
  let wrap=q('#gwFieldPopup57',page);
  if(wrap)return wrap;
  wrap=document.createElement('div');
  wrap.id='gwFieldPopup57';
  wrap.className='gwFieldPopup57';
  wrap.innerHTML='<div class="gwFieldPopupCard57"><div class="gwFieldPopupTitle57" id="gwFieldPopupTitle57"></div><div class="gwFieldPopupBody57" id="gwFieldPopupBody57"></div></div>';
  const controls=q('#rpgFieldPage .rpgFieldControls',page);
  if(controls)page.insertBefore(wrap,controls); else page.appendChild(wrap);
  return wrap;
}
function renderFieldPopup57(){
  const wrap=ensureFieldPopup57();
  if(!wrap)return;
  const title=q('#gwFieldPopupTitle57',wrap),body=q('#gwFieldPopupBody57',wrap),f=rpgState?.field;
  let popup=null;
  if(f?.rewardPopup57)popup=f.rewardPopup57;
  else if(f?.pendingEvent57)popup={title:'수상한 기척',html:'앞쪽에 무언가가 보입니다.\n확인해보시겠습니까?'};
  if(!popup){wrap.classList.remove('show');if(title)title.textContent='';if(body)body.textContent='';return;}
  wrap.classList.add('show');
  if(title)title.textContent=popup.title||'이벤트';
  if(body){
    if(popup.html!=null)body.innerHTML=popup.html;
    else body.textContent=popup.text||'';
  }
}
function closeRewardPopup57(){
  const f=rpgState?.field;if(!f)return;
  delete f.rewardPopup57;
  rpgRenderField?.();
}
function makeRewardHtml57(lines){
  return '<ul>'+lines.map(line=>`<li>${line}</li>`).join('')+'</ul>';
}
function createMeadowGear57(){
  const weaponKeys=Object.keys(window.rpgWeaponDefs||{}).filter(k=>k!=='seriaTealStaff');
  const armorKeys=Object.keys(window.rpgArmorTypeDefs||{});
  const slot=Math.random()<0.5?'weapon':'armor';
  return window.rpgMakeEquipment?.({
    series:'meadow',slot,
    weaponType:weaponKeys[Math.floor(Math.random()*Math.max(1,weaponKeys.length))],
    armorType:armorKeys[Math.floor(Math.random()*Math.max(1,armorKeys.length))],
    source:'event',prefix:'초원의',rarity:'엘리트',level:10,weaponBonus:5,pdef:3,mdef:2,setAtk:4,extra:'라비엔 지역 추가 공격력 +2',border:'purple'
  })||null;
}
function grantChestReward57(kind){
  rpgState.items=rpgState.items||{};
  const gained=[];
  let title='보물상자';
  if(kind==='old'){
    title='낡은 보물상자';
    const gold=weightedQty57(10,30,1.9);
    rpgState.gold=(rpgState.gold||0)+gold;
    gained.push(`${gold}G`);
    const scrap=weightedQty57(0,4,2.1);
    if(scrap>0){rpgState.items.scrapMetal=(rpgState.items.scrapMetal||0)+scrap;gained.push(`${materialName57('scrapMetal')} ×${scrap}`)}
    const usable=weightedQty57(0,2,1.8);
    if(usable>0){rpgState.items.usableScrap=(rpgState.items.usableScrap||0)+usable;gained.push(`${materialName57('usableScrap')} ×${usable}`)}
    rpgLog?.(`📦 낡은 보물상자를 열었다 · ${gained.join(' · ')}`);
  }else{
    title='튼튼한 보물상자';
    const gold=weightedQty57(20,80,1.85);
    rpgState.gold=(rpgState.gold||0)+gold;
    gained.push(`${gold}G`);
    const scrap=weightedQty57(0,4,1.95);
    if(scrap>0){rpgState.items.scrapMetal=(rpgState.items.scrapMetal||0)+scrap;gained.push(`${materialName57('scrapMetal')} ×${scrap}`)}
    const usable=weightedQty57(0,4,1.95);
    if(usable>0){rpgState.items.usableScrap=(rpgState.items.usableScrap||0)+usable;gained.push(`${materialName57('usableScrap')} ×${usable}`)}
    const stones=weightedQty57(1,3,2.0);
    rpgState.items.enhancementStone=(rpgState.items.enhancementStone||0)+stones;
    gained.push(`${materialName57('enhancementStone')} ×${stones}`);
    if(Math.random()<0.001){
      const item=createMeadowGear57();
      if(item&&Array.isArray(rpgState.inventory)&&(rpgState.inventory.length<40)){
        rpgState.inventory.push(item);
        gained.push(`${item.name} ×1`);
      }else if(item){
        gained.push('초원 장비 ×1 (인벤토리 가득 참으로 획득 실패)');
      }
    }
    rpgLog?.(`🎁 튼튼한 보물상자를 열었다 · ${gained.join(' · ')}`);
  }
  return {title,lines:gained};
}
function resolveInspect57(){
  const f=rpgState?.field;if(!f?.pendingEvent57)return;
  delete f.pendingEvent57;
  const quest=normalizeQuest57();
  const roll=Math.random();
  if(roll<0.50){
    const chestKind=Math.random()<0.80?'old':'sturdy';
    const reward=grantChestReward57(chestKind==='old'?'old':'sturdy');
    f.rewardPopup57={title:reward.title,html:`상자 안에서 다음 보상을 발견했다!${makeRewardHtml57(reward.lines)}`};
    rpgSaveActiveSlot?.(null,'field_chest_reward_4957');
    rpgRenderField?.();
    return;
  }
  if(roll<0.80){
    let encounter=null;
    if(quest&&!quest.completed&&!quest.isBoss)encounter=buildQuestEncounter57(quest,f,true);
    if(!encounter)encounter=buildRandomEncounter57();
    if(encounter){
      f.encounter=encounter;
      traceEncounter62('EXPLORATION_EVENT',encounter,'INSPECT_COMBAT_30PCT',quest);
      rpgLog?.(`⚠️ 수상한 기척을 확인했더니 ${encounter.strongestName} 조우 · ${rpgEncounterSummary(encounter)}`);
    }else{
      f.rewardPopup57={title:'수상한 기척',text:'확인했지만 아무 일도 일어나지 않았다.'};
    }
    rpgRenderField?.();
    return;
  }
  f.rewardPopup57={title:'수상한 기척',text:'확인해 보았지만 아무것도 없었다.'};
  rpgLog?.('🔎 수상한 기척을 확인했지만 아무 일도 없었다.');
  rpgRenderField?.();
}
function ignoreInspect57(){
  const f=rpgState?.field;if(!f?.pendingEvent57)return;
  delete f.pendingEvent57;
  rpgLog?.('↪ 수상한 기척을 그냥 지나쳤다.');
  rpgRenderField?.();
}

const oldReset57=window.rpgReset;
if(typeof oldReset57==='function')window.rpgReset=function(){
  oldReset57.apply(this,arguments);
  rpgState.combatPenalties=[];
  delete rpgState._questTracker57;
  if(rpgState.field){delete rpgState.field.pendingEvent57;delete rpgState.field.rewardPopup57;delete rpgState.field.questTracker57;}
};
const oldLoad57=window.rpgLoadSlot;
if(typeof oldLoad57==='function')window.rpgLoadSlot=function(){
  const out=oldLoad57.apply(this,arguments);
  if(out){
    if(!Array.isArray(rpgState.combatPenalties))rpgState.combatPenalties=[];
    if(rpgState.field){
      if(rpgState.quest&&!rpgState.quest.isBoss){
        const quest=normalizeQuest57();
        syncQuestField57(rpgState.field,quest);
      }
      delete rpgState.field.pendingEvent57;
      delete rpgState.field.rewardPopup57;
    }
  }
  return out;
};

const oldAccept57=window.rpgAcceptQuest;
if(typeof oldAccept57==='function')window.rpgAcceptQuest=function(){
  const out=oldAccept57.apply(this,arguments);
  const quest=normalizeQuest57();
  if(rpgState.field&&quest)syncQuestField57(rpgState.field,quest);
  return out;
};
const oldStart57=window.rpgStartJourney;
if(typeof oldStart57==='function')window.rpgStartJourney=function(){
  const out=oldStart57.apply(this,arguments);
  const quest=normalizeQuest57();
  if(rpgState.field&&quest){
    syncQuestField57(rpgState.field,quest);
    if(!quest.isBoss)rpgLog?.('🧭 의뢰 몬스터는 기본 3턴(15칸) 안에 순차적으로 등장합니다.');
  }
  return out;
};

const oldRenderCenter57=window.rpgRenderCenter;
if(typeof oldRenderCenter57==='function')window.rpgRenderCenter=function(){
  const f=rpgState?.field,host=q('#rpgCenterActions');
  if(!f||!host)return oldRenderCenter57.apply(this,arguments);
  if(f._gwMoving4903){
    host.innerHTML='<button class="rpgCenterBtn gwMoving4903" id="rpgMoveBtn" type="button" disabled style="--gwMoveMs:'+Math.max(1,Number(f._gwMoveDuration61)||1500)+'ms">⏳<br>이동 중...</button>' ;
    return;
  }
  if(f.rewardPopup57){
    host.innerHTML='<button class="rpgCenterBtn safe gwEventBtn57" id="gwRewardClose57" type="button">확인<small>보상 닫기</small></button>';
    q('#gwRewardClose57',host)?.addEventListener('click',closeRewardPopup57);
    return;
  }
  if(f.pendingEvent57){
    host.innerHTML='<button class="rpgCenterBtn danger gwEventBtn57" id="gwInspectYes57" type="button">확인<small>살펴본다</small></button><button class="rpgCenterBtn safe gwEventBtn57" id="gwInspectNo57" type="button">무시<small>지나친다</small></button>';
    q('#gwInspectYes57',host)?.addEventListener('click',resolveInspect57);
    q('#gwInspectNo57',host)?.addEventListener('click',ignoreInspect57);
    return;
  }
  return oldRenderCenter57.apply(this,arguments);
};

const oldRenderField57=window.rpgRenderField;
if(typeof oldRenderField57==='function')window.rpgRenderField=function(){
  const out=oldRenderField57.apply(this,arguments);
  renderFieldPopup57();
  return out;
};
const oldShow57=window.showPage;
if(typeof oldShow57==='function')window.showPage=function(id){
  const out=oldShow57.apply(this,arguments);
  if(id==='rpgFieldPage')requestAnimationFrame(renderFieldPopup57);
  return out;
};

function applyMoveBookkeeping57(field){
  field.distance=(field.distance||0)+1;
  rpgState.moveStepCounter=(rpgState.moveStepCounter||0)+1;
  rpgLog?.(`👣 초원을 이동했습니다. · 누적 ${field.distance}회`);
  if(rpgState._travelFirstCycle52!==false&&rpgState._travelPos52===5){
    rpgState._travelFirstCycle52=false;
    rpgState._travelPos52=1;
  }else if(rpgState._travelFirstCycle52===false&&rpgState._travelPos52===5){
    rpgState._travelPos52=1;
  }else{
    rpgState._travelPos52=Math.min(5,(Number(rpgState._travelPos52)||0)+1);
  }
  if(rpgState.moveStepCounter>=5){
    rpgState.moveStepCounter-=5;
    rpgAdvanceTurns?.(1,'이동 5회');
  }
}
function traceEncounter62(source,encounter,reason,quest){
  if(!encounter)return;
  const types=(encounter.enemies||[]).map(e=>e?.type||e?.id||'unknown');
  const payload={source,reason,questId:quest?.id||null,targetType:quest?.enemyTypes?.[0]||null,enemyTypes:types,move:Number(rpgState?.field?.distance)||0,turn:Number(rpgState?.worldTurn)||0};
  try{HuNyangDiag.line('RPG_ENCOUNTER_TRACE',JSON.stringify(payload))}catch(_){}
}
function selectFreeBoss62(){
  const completed=rpgState.completedQuestIds||[];
  const classQuest=rpgState.classQuest;
  const classTarget=(classQuest&&!classQuest.rewarded&&!classQuest.completed&&Number(classQuest.stage)===2)?classQuest.bossType:null;
  const eligible=['slimeBoss','wolfBoss'].filter(t=>completed.includes(t==='slimeBoss'?'f_boss_slime':'f_boss_wolf')||classTarget===t);
  const counters=rpgState.bossHuntCounters||(rpgState.bossHuntCounters={slime:0,wolf:0});
  const pity=[['slimeBoss','slime',50],['wolfBoss','wolf',30]];
  for(const [type,key,limit] of pity){if(eligible.includes(type)&&Number(counters[key]||0)>=limit)return {type,key,reason:'BOSS_PITY'};}
  // Independently roll 1% for each unlocked boss; only one encounter may be created.
  for(const type of eligible){if(Math.random()<.01)return {type,key:type==='slimeBoss'?'slime':'wolf',reason:'BOSS_RANDOM_1PCT'};}
  return null;
}
function processBossQuestMove57(field,quest){
  syncQuestField57(field,quest);
  if(!quest.completed&&!field.questObjectiveReached){
    field.questRouteProgress=Math.min(field.questRouteTotal||quest.routeTotal||5,(field.questRouteProgress||0)+1);
    if(field.questRouteProgress>=(field.questRouteTotal||quest.routeTotal||5)){
      field.questObjectiveReached=true;
      rpgLog?.(`📍 의뢰 지점 도착 · ${quest.enemyLabel} 토벌 준비`);
    }
  }
  // Quest travel should use the same natural roaming encounters as free hunting.
  // The guaranteed quest boss remains available when the travel target is reached.
  if(!field.questObjectiveReached&&Math.random()<0.20){
    const roaming=buildRandomEncounter57();
    if(roaming){field.encounter=roaming;traceEncounter62('QUEST_ROAMING',roaming,'NORMAL_27PCT',quest);rpgLog?.(`⚠️ 이동 중 ${roaming.strongestName} 조우 · ${rpgEncounterSummary(roaming)}`);return;}
  }
  if(!field.questObjectiveReached&&maybeCreateInspectEvent57(field))return;
  let encounter=null;
  if(!quest.completed&&field.questObjectiveReached)encounter=buildBossEncounter57(quest.enemyTypes?.[0]);
  if(encounter){
    field.encounter=encounter;
    traceEncounter62('GUILD_QUEST',encounter,'GUARANTEED_WITHIN_15_MOVES',quest);
    rpgLog?.(`⚠️ ${encounter.strongestName} 조우 · ${rpgEncounterSummary(encounter)}`);
  }
}
function processNormalQuestMove57(field,quest){
  syncQuestField57(field,quest);
  const tracker=ensureQuestTracker57(field,quest);
  tracker.step=Math.max(0,Number(tracker.step)||0)+1;
  field.questRouteProgress=tracker.step;
  field.questRouteTotal=tracker.deadlineStep;
  while(Math.max(0,quest.target-quest.kills)>Math.max(1,tracker.deadlineStep-tracker.step+1)*3)tracker.deadlineStep+=5;
  field.questRouteTotal=tracker.deadlineStep;
  if(maybeCreateInspectEvent57(field))return;
  const encounter=buildQuestEncounter57(quest,field,false);
  if(encounter){
    field.encounter=encounter;
    traceEncounter62('GUILD_QUEST',encounter,'KILL_QUEST',quest);
    rpgLog?.(`⚠️ ${encounter.strongestName} 조우 · ${rpgEncounterSummary(encounter)}`);
  }
}
function processFreeHuntMove57(field){
  const boss=selectFreeBoss62();
  if(boss){
    const encounter=buildBossEncounter57(boss.type);
    if(encounter){
      field.encounter=encounter;
      rpgState.bossHuntCounters[boss.key]=0;
      traceEncounter62(boss.reason,encounter,boss.reason,null);
      rpgLog?.(`⚠️ ${encounter.strongestName} 조우 · ${rpgEncounterSummary(encounter)}`);
      return;
    }
  }
  if(Math.random()<0.20){
    const encounter=buildRandomEncounter57();
    if(encounter){
      field.encounter=encounter;
      traceEncounter62('FREE_RANDOM',encounter,'NORMAL_20PCT',null);
      rpgLog?.(`⚠️ ${encounter.strongestName} 조우 · ${rpgEncounterSummary(encounter)}`);
      return;
    }
  }
  maybeCreateInspectEvent57(field);
}

function commitMove61(field){
  if(!field||rpgState.field!==field||!field._gwMoving4903)return;
  field._gwMoving4903=false;
  delete field._gwMoveDuration61;
  if(typeof activePageId==='function'&&activePageId()!=='rpgFieldPage')return;
  const quest=normalizeQuest57();
  applyMoveBookkeeping57(field);
  if(quest&&!quest.completed){
    if(quest.isBoss)processBossQuestMove57(field,quest);
    else processNormalQuestMove57(field,quest);
  }else{
    processFreeHuntMove57(field);
  }
  if(field.encounter){
    const scene=q('#rpgScene');
    if(scene){
      q('#gwEncounterNotice4903',scene)?.remove();
      const alert=document.createElement('div');alert.id='gwEncounterNotice4903';alert.className='gwEncounterNotice4903';
      alert.textContent='⚠️ '+(field.encounter.strongestName||'마물')+'이(가) 등장했습니다!';
      scene.appendChild(alert);
      setTimeout(()=>alert.remove(),2300);
    }
  }
  rpgRenderField?.();
}
window.rpgMoveStep=function(){
  const field=rpgState?.field;
  if(!field||field.encounter||field.battle||field.pendingEvent57||field.rewardPopup57||field._gwMoving4903)return;
  const ms=1000+Math.floor(Math.random()*1001);
  field._gwMoving4903=true;
  field._gwMoveDuration61=ms;
  // Keep v4.9.03 animated movement while letting v4.9.57 own encounter/quest outcomes.
  const button=q('#rpgMoveBtn');
  if(button){button.disabled=true;button.classList.add('gwMoving4903');button.style.setProperty('--gwMoveMs',ms+'ms');button.innerHTML='⏳<br>이동 중...';}
  window.GWApplyFieldLeaderStage94?.();
  setTimeout(()=>commitMove61(field),ms);
};

try{HuNyangDiag.line('RPG_V4962_READY','guild_boss_15steps|free_boss_1pct_pity|classquest_no_extra_spawn|encounter_trace=on')}catch(_){}
try{HuNyangDiag.line('RPG_V4957_READY','grudge_reset=slot_safe|battle_enemy_size=restored|quest_15step_guarantee=on|field_treasure_event=confirm_popup|teal_staff_shop_removed=kept')}catch(_){ }
})();
