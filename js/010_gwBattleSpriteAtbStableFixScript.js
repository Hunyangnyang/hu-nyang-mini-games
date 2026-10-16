


(()=>{
'use strict';

let gwLastReady=null,gwLastSkill=null,gwLastTarget=null,gwUnitSig='';

window.rpgSmoothAtbStep=function(ts){
  if(!rpgAtbVisual.running)return;
  const f=rpgState.field;
  if(!f?.battle||activePageId()!=='rpgBattlePage'){
    rpgAtbVisual.running=false;
    cancelAnimationFrame(rpgAtbVisual.raf);
    return;
  }

  const dt=Math.min(34,Math.max(1,ts-(rpgAtbVisual.last||ts)));
  rpgAtbVisual.last=ts;
  const alpha=1-Math.exp(-dt/85);

  (f.party||[]).slice(0,3).forEach((u,i)=>{
    const key=rpgAtbVisualKey('p',i);
    const target=Math.max(0,Math.min(100,u.gauge||0));
    const cur=rpgGetVisualAtb(key,target);
    const next=Math.abs(target-cur)<.02?target:cur+(target-cur)*alpha;
    rpgSetVisualAtb(key,next);

    const unit=document.querySelector(`#rpgBattleUnits [data-party-unit="${u.id}"]`);
    const card=document.querySelector(`#rpgBattlePartyStrip .rpgBattlePartyCard:nth-child(${i+1})`);
    unit?.querySelector('.gwSideAtb54 i')?.style.setProperty('height',`${next}%`);
    unit?.classList.toggle('gwAtbReady54',next>=99.9);
    card?.querySelector('.rpgBattlePartyVitals .atb i')?.style.setProperty('width',`${next}%`);

    const hp=Math.max(0,Math.min(100,u.hp/Math.max(1,u.derived.maxHp)*100));
    const mp=Math.max(0,Math.min(100,u.mp/Math.max(1,u.derived.maxMp)*100));
    card?.querySelector('.rpgBattlePartyVitals .hp i')?.style.setProperty('width',`${hp}%`);
    card?.querySelector('.rpgBattlePartyVitals .mp i')?.style.setProperty('width',`${mp}%`);
  });

  (f.battle?.enemies||[]).forEach((u,i)=>{
    const key=rpgAtbVisualKey('e',i);
    const target=Math.max(0,Math.min(100,u.gauge||0));
    const cur=rpgGetVisualAtb(key,target);
    const next=Math.abs(target-cur)<.02?target:cur+(target-cur)*alpha;
    rpgSetVisualAtb(key,next);

    const unit=document.querySelector(`#rpgBattleUnits [data-battle-enemy="${i}"]`);
    unit?.querySelector('.gwSideAtb54 i')?.style.setProperty('height',`${next}%`);
    unit?.classList.toggle('gwAtbReady54',next>=99.9);
  });

  try{window.gwSyncEnemyCards53?.()}catch(e){}
  try{window.gwSyncAuto53?.()}catch(e){}
  try{window.gwCheckQueuedAttack53?.()}catch(e){}

  const p=f.party?.[0];
  const ready=!!p&&!p.dead&&(p.gauge||0)>=100;
  const skill=!!f.skillMenu;
  const targetMode=!!f.targetMode;

  if(ready!==gwLastReady||skill!==gwLastSkill||targetMode!==gwLastTarget){
    gwLastReady=ready;
    gwLastSkill=skill;
    gwLastTarget=targetMode;
    try{rpgRenderBattlePageActions()}catch(e){}
  }

  const sig=[...(f.party||[]),...(f.battle?.enemies||[])].map(x=>x.dead?'1':'0').join('');
  if(gwUnitSig&&sig!==gwUnitSig&&!f.playerAttackAnimating){
    gwUnitSig=sig;
    try{window.gwBattle55PostActionRefresh?.('death_state')}catch(e){}
  }else{
    gwUnitSig=sig;
  }

  const log=$('#rpgBattleLog');
  if(log){
    const rows=(f.battle?.history||[]).slice(0,6);
    const sig2=rows.join('\n');
    if(log.dataset.gwSig!==sig2){
      log.dataset.gwSig=sig2;
      log.innerHTML=rows.map(x=>`<div class="rpgHistoryRow">${x}</div>`).join('');
    }
  }

  rpgAtbVisual.raf=requestAnimationFrame(rpgSmoothAtbStep);
};

/* logic remains 20fps. Every non-player party member is AI. */
window.rpgBattleTick=function(){
  const f=rpgState.field,b=f?.battle;
  if(!b){rpgStopBattleTicker();return}

  const now=performance.now();
  const dt=Math.min(.25,Math.max(0,(now-(rpgBattleLast||now))/1000));
  rpgBattleLast=now;

  for(const u of (f.party||[]).slice(0,3)){
    if(!u.dead&&u.gauge<100){
      u.gauge=Math.min(100,u.gauge+rpgGaugeRate(rpgUnitAttackSpeed(u))*dt);
    }
  }
  for(const e of b.enemies){
    if(!e.dead&&e.gauge<100){
      e.gauge=Math.min(100,e.gauge+(e.type==='wolfBoss'&&e._wolf932?.breakMode?(100/20):rpgGaugeRate(rpgUnitAttackSpeed(e)))*dt);
    }
  }

  for(const ai of (f.party||[]).slice(1,3)){
    if(ai&&!ai.dead&&ai.gauge>=100)rpgAiAtbAction(ai);
  }

  rpgAutoPlayerAction();

  b.enemies.forEach((e,i)=>{
    if(e.gauge>=100)rpgEnemyAtbAction(e,i);
  });

  rpgCheckBattleEnd();

  if(rpgState.field?.battle&&activePageId()!=='rpgBattlePage'){
    rpgRenderField();
  }
};
})();


