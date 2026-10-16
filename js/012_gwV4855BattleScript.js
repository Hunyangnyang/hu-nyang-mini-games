
(()=>{
'use strict';
const enemyLv={green:1,blue:5,wolf:5,red:10};
let autoLock=0;

function field(){return (typeof rpgState!=='undefined'&&rpgState)?(rpgState.field||null):null}

/* Auto: preserve verified v4.8.52 path. */
function syncAuto(){
  const f=field(),b=document.getElementById('gwAutoSwitch53'),l=document.getElementById('gwAutoLabel53');
  if(!f||!b||!l)return;
  b.classList.toggle('on',!!f.autoBattle);
  b.setAttribute('aria-checked',f.autoBattle?'true':'false');
  l.textContent=`자동 ${f.autoBattle?'ON':'OFF'}`;
}
window.gwSyncAuto53=syncAuto;
function toggleAuto(){
  const now=performance.now();if(now-autoLock<180)return;autoLock=now;
  const f=field();if(!f?.battle)return;
  f.autoBattle=!f.autoBattle;
  if(!rpgBattleTicker)rpgStartBattleTicker();
  HuNyangDiag.line('RPG_AUTO_TOGGLE',f.autoBattle?'ON':'OFF');
  HuNyangDiag.line('RPG_AUTO_STATE',`enabled=${f.autoBattle}`);
  rpgSaveActiveSlot('rpgBattlePage','auto_battle_toggle');
  syncAuto();
  if(f.autoBattle&&f.party?.[0]?.gauge>=100)requestAnimationFrame(()=>rpgAutoPlayerAction());
}
const autoBtn=document.getElementById('gwAutoSwitch53');
if(autoBtn){
  rpgBindPress(autoBtn,toggleAuto);
  HuNyangDiag.line('RPG_AUTO_BIND_READY','v4.8.69');
}

/* Manual attack toggle and queued target. */
window.gwCancelManualAttack53=function(){
  const f=field();if(!f)return;
  f.manualAttackArmed=false;
  f.manualTargetIndex=null;
  if(!f.pendingSkill)f.targetMode=false;
  window.gwSyncEnemyCards53?.();
};
window.gwToggleManualAttack53=function(){
  const f=field(),p=f?.party?.[0];if(!f?.battle||!p||p.dead)return;
  const next=!f.manualAttackArmed;
  f.skillMenu=false;
  f.pendingSkill=null;
  f.manualAttackArmed=next;
  f.manualTargetIndex=null;
  f.targetMode=next;
  HuNyangDiag.line('RPG_MANUAL_ATTACK_TOGGLE',next?'ON':'OFF');
  rpgRenderBattlePageActions();
  window.gwSyncEnemyCards53?.();
};

function commitManualAttack(index){
  const f=field(),p=f?.party?.[0],e=f?.battle?.enemies?.[index];
  if(!f?.manualAttackArmed||!p||p.dead||!e||e.dead||(p.gauge||0)<100)return false;
  f.manualAttackArmed=false;
  f.manualTargetIndex=null;
  f.targetMode=true;
  f.pendingSkill=null;
  HuNyangDiag.line('RPG_MANUAL_ATTACK_FIRE',`target=${index}`);
  rpgPlayerAttack(index);
  window.gwSyncEnemyCards53?.();
  return true;
}
window.gwCheckQueuedAttack53=function(){
  const f=field();if(!f?.battle||!f.manualAttackArmed||f.manualTargetIndex==null)return false;
  const target=f.battle.enemies?.[f.manualTargetIndex];
  if(!target||target.dead){f.manualTargetIndex=null;window.gwSyncEnemyCards53?.();return false}
  if((f.party?.[0]?.gauge||0)<100)return false;
  return commitManualAttack(f.manualTargetIndex);
};

function enemyCardClick(index){
  const f=field(),p=f?.party?.[0],e=f?.battle?.enemies?.[index];
  if(!f?.battle||!e||e.dead)return;

  /* Targeted skill selection also uses cards. */
  if(f.pendingSkill){
    if((p?.gauge||0)<100)return;
    rpgPlayerAttack(index);
    return;
  }

  if(!f.manualAttackArmed)return;
  f.manualTargetIndex=index;
  HuNyangDiag.line('RPG_MANUAL_TARGET',`target=${index} ready=${(p?.gauge||0)>=100}`);
  window.gwSyncEnemyCards53?.();
  rpgRenderBattlePageActions();
  if((p?.gauge||0)>=100)commitManualAttack(index);
}

/* Enemy cards: always 8 visual slots, up to 8 enemies. */
window.gwSyncEnemyCards53=function(){
  const host=document.getElementById('gwEnemyCards53'),f=field();
  if(!host)return;
  const enemies=f?.battle?.enemies||[];
  const targetable=!!(f?.manualAttackArmed||f?.pendingSkill);
  const liveIndexes=enemies.map((e,i)=>(e&&!e.dead&&Number(e.hp)>0)?i:-1).filter(i=>i>=0).slice(0,8);
  let html='';
  for(let i=0;i<8;i++){
    const battleIndex=liveIndexes[i];
    const e=battleIndex===undefined?null:enemies[battleIndex];
    if(!e){html+=`<div class="gwEnemyCard53 empty" aria-hidden="true"></div>`;continue}
    const max=Math.max(1,e.maxHp||e.hp||1),hp=Math.max(0,e.hp||0),pct=Math.max(0,Math.min(100,hp/max*100));
    const lv=Number.isFinite(Number(e.level))?Number(e.level):(enemyLv[e.type]??'-');
    const selected=f?.manualTargetIndex===battleIndex;
    html+=`<button type="button" class="gwEnemyCard53${e.dead?' dead':''}${targetable&&!e.dead?' selectable':''}${selected?' selected':''}" data-enemy-card53="${battleIndex}" ${e.dead?'disabled':''}>
      <div class="gwEnemyCardHead53"><b>${e.name||'적'} ${battleIndex+1}</b><span>Lv.${lv}</span></div>
      <div class="gwEnemyHpText53">HP ${hp} / ${max}</div>
      <div class="gwEnemyHpTrack53"><i style="width:${pct}%"></i></div>
    </button>`;
  }
  host.innerHTML=html;
  host.querySelectorAll('[data-enemy-card53]').forEach(btn=>rpgBindPress(btn,()=>enemyCardClick(Number(btn.dataset.enemyCard53))));
};

/* Stable cell snap. No repeating position correction during attack animations. */
function targetCell(position,enemy){
  const p=Math.max(0,Math.min(8,Number(position)||0)),row=Math.floor(p/3),line=p%3,col=enemy?6-line:line;
  return document.querySelector(`#rpgBattleGridPlane [data-row="${row}"][data-col="${col}"]`);
}
function snapOne(unit,cell){
  if(!unit||!cell)return;
  const stage=document.getElementById('rpgBattleStage'),shadow=unit.querySelector('.shadow');
  if(!stage||!shadow)return;

  unit.style.marginLeft='0px';
  unit.style.marginTop='0px';
  if(!unit.style.translate)unit.style.translate='0px 0px';

  const sr=stage.getBoundingClientRect(),cr=cell.getBoundingClientRect();
  const cx=cr.left+cr.width/2-sr.left;
  const cy=cr.top+cr.height/2-sr.top;

  unit.style.left=cx+'px';
  unit.style.top=cy+'px';

  /* Bosses use the cell center itself as their anchor. Their art is intentionally
     oversized to visually cover the cross-shaped footprint. */
  if(unit.classList.contains('boss'))return;

  /* Regular units remain aligned by their ground shadow. */
  unit.getBoundingClientRect();
  const sh=shadow.getBoundingClientRect();
  const c2=cell.getBoundingClientRect();
  const dx=(c2.left+c2.width/2)-(sh.left+sh.width/2);
  const dy=(c2.top+c2.height/2)-(sh.top+sh.height/2);

  unit.style.left=(cx+dx)+'px';
  unit.style.top=(cy+dy)+'px';
}
function snapAll(){
  const f=field();if(!f?.battle||f.playerAttackAnimating)return;
  if(f.partyAttackAnimating&&Object.values(f.partyAttackAnimating).some(Boolean))return;
  (f.party||[]).slice(0,3).forEach(u=>snapOne(document.querySelector(`#rpgBattleUnits [data-party-unit="${u.id}"]`),targetCell(u.position,false)));
  (f.battle.enemies||[]).slice(0,8).forEach((e,i)=>snapOne(document.querySelector(`#rpgBattleUnits [data-battle-enemy="${i}"]`),targetCell(e.position,true)));
}
window.gwSnapUnits55=snapAll;

window.gwUpdateBattleVitals59=function(){
  const f=field(),host=document.getElementById('rpgBattlePartyStrip');if(!f||!host)return;
  const cards=host.querySelectorAll('.rpgBattlePartyCard');
  (f.party||[]).slice(0,3).forEach((u,i)=>{
    const card=cards[i];if(!card)return;
    const bars=card.querySelectorAll('.rpgBattlePartyVitals i');
    if(bars[0])bars[0].style.width=Math.max(0,Math.min(100,(u.hp||0)/Math.max(1,u.derived?.maxHp||1)*100))+'%';
    if(bars[1])bars[1].style.width=Math.max(0,Math.min(100,(u.mp||0)/Math.max(1,u.derived?.maxMp||1)*100))+'%';
    if(bars[2])bars[2].style.width=Math.max(0,Math.min(100,u.gauge||0))+'%';
    card.classList.toggle('dead',!!u.dead);
  });
};

window.gwBattle55PostActionRefresh=function(reason='action'){
  const f=field();if(!f?.battle)return;

  (f.party||[]).forEach(u=>{
    if(u.dead)document.querySelector(`#rpgBattleUnits [data-party-unit="${u.id}"]`)?.remove();
  });
  (f.battle.enemies||[]).forEach((e,i)=>{
    if(e.dead)document.querySelector(`#rpgBattleUnits [data-battle-enemy="${i}"]`)?.remove();
  });

  try{window.gwUpdateBattleVitals59?.()}catch(e){}
  try{rpgRenderBattlePageActions()}catch(e){}
  try{window.gwSyncEnemyCards53?.()}catch(e){}
  const log=document.getElementById('rpgBattleLog');
  if(log)log.innerHTML=(f.battle?.history||[]).slice(0,6).map(x=>`<div class="rpgHistoryRow">${x}</div>`).join('');
};

window.gwBattle55Sync=function(){
  syncAuto();
  window.gwSyncEnemyCards53?.();
  snapAll();
};

window.addEventListener('resize',()=>requestAnimationFrame(snapAll));

/* State-only refresh. Deliberately does not move units every interval. */
setInterval(()=>{
  try{
    if(activePageId()==='rpgBattlePage'){
      syncAuto();
      window.gwSyncEnemyCards53?.();
      window.gwCheckQueuedAttack53?.();
    }
  }catch(e){HuNyangDiag.line('RPG_BATTLE_UI_ERROR',e?.message||String(e))}
},220);

syncAuto();
window.gwSyncEnemyCards53?.();
})();
