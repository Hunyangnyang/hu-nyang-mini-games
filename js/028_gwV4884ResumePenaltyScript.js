
(()=>{
'use strict';
const PENALTY_KEYS84=['meleeAtk','rangedAtk','magicAtk','physicalDefense','magicDefense','attackSpeed','evasion','crit','patk','matk','defense','dex','luck'];
const owners84=()=>[rpgState,rpgState.ai,rpgState.ai2].filter(Boolean);
function normalizePenalty84(owner){
  if(!owner)return [];
  const active=Array.isArray(owner.combatPenalties)?owner.combatPenalties.filter(p=>p&&Number(p.remaining)>0&&Number(p.pct)>0):[];
  const merged=new Map();for(const p of active){const k=String(p.kind||'penalty');const prior=merged.get(k);if(!prior)merged.set(k,{...p});else{prior.pct=Math.max(Number(prior.pct)||0,Number(p.pct)||0);prior.remaining=Math.max(Number(prior.remaining)||0,Number(p.remaining)||0)}}
  owner.combatPenalties=[...merged.values()];
  return owner.combatPenalties;
}
function addPenalty84(owner,pct,turns,kind){
  if(!owner)return;
  const list=normalizePenalty84(owner);
  const k=String(kind||'penalty');const current=list.find(p=>p.kind===k);
  if(current){current.pct=Math.max(Number(current.pct)||0,Number(pct)||0);current.remaining=Math.max(Number(current.remaining)||0,Number(turns)||0)}
  else list.push({pct:Number(pct)||0,remaining:Math.max(0,Number(turns)||0),kind:k,at:Number(rpgState.worldTurn)||0});
}
function addPartyPenalty84(pct,turns,kind){owners84().forEach(o=>addPenalty84(o,pct,turns,kind));}
function penaltyPct84(owner){
  // Combat penalties do not stack additively. Use the strongest active reduction.
  // A 50% monster grudge remains 50% even when another penalty is active.
  return Math.min(1,normalizePenalty84(owner).reduce((max,p)=>Math.max(max,Math.max(0,Number(p.pct)||0)),0));
}
function ownerForStats84(stats){
  if(stats===rpgState.stats)return rpgState;
  if(rpgState.ai&&stats===rpgState.ai.stats)return rpgState.ai;
  if(rpgState.ai2&&stats===rpgState.ai2.stats)return rpgState.ai2;
  return null;
}
window.GW84PenaltyTotal=owner=>penaltyPct84(owner||rpgState);
function refreshFieldDerived84(){
  const f=rpgState.field;if(!f?.party)return;
  const map={player:rpgState,ai:rpgState.ai,ai2:rpgState.ai2};
  for(const u of f.party){
    const o=map[u.id];if(!o)continue;
    const d=rpgDerived(o.job,o.stats,o.skills,o.equipment);u.derived=d;
    u.hp=Math.max(0,Math.min(d.maxHp,Number(u.hp)||0));u.mp=Math.max(0,Math.min(d.maxMp,Number(u.mp)||0));u.dead=u.hp<=0;
  }
}

/* Apply the strongest active combat-stat penalty without changing max HP/MP. */
const oldDerived84=rpgDerived;
rpgDerived=function(job,stats,skills,equipment){
  const d=oldDerived84.apply(this,arguments),owner=ownerForStats84(stats),pct=owner?penaltyPct84(owner):0;
  if(!pct)return d;
  const mult=Math.max(0,1-pct);
  for(const k of PENALTY_KEYS84){
    if(!Number.isFinite(Number(d[k])))continue;
    if(k==='attackSpeed')d[k]=Math.max(.1,Math.round(Number(d[k])*mult*10)/10);
    else if(k==='evasion'||k==='crit')d[k]=Math.max(0,Math.round(Number(d[k])*mult*10)/10);
    else d[k]=Math.max(0,Math.round(Number(d[k])*mult*10)/10);
  }
  return d;
};

/* Penalties expire by world turns; reductions do not stack additively. */
const oldAdvance84=rpgAdvanceTurns;
rpgAdvanceTurns=function(n,why){
  const result=oldAdvance84.apply(this,arguments),step=Math.max(0,Number(n)||0);
  if(step){
    owners84().forEach(owner=>{
      const before=normalizePenalty84(owner).length;
      owner.combatPenalties.forEach(p=>p.remaining=Math.max(0,Number(p.remaining)-step));
      owner.combatPenalties=owner.combatPenalties.filter(p=>p.remaining>0);
      if(before&&!owner.combatPenalties.length&&owner===rpgState){try{HuNyangDiag.line('RPG_COMBAT_PENALTY_END','player')}catch(_){}}
    });
    refreshFieldDerived84();
  }
  return result;
};

/* Party wipe: revive immediately at chapel using the same HP/MP ratio as Revival Prayer, then add -30% / 10 turns. */
const oldBattleEnd84=rpgCheckBattleEnd;
rpgCheckBattleEnd=function(){
  const f=rpgState.field,b=f?.battle;
  if(f&&b&&Array.isArray(f.party)&&f.party.length&&f.party.every(u=>u.dead)){
    rpgLog('💀 파티가 전멸했습니다. 라비엔 기도원으로 후송됩니다.');
    try{rpgSyncVitalsFromField?.()}catch(_){}
    rpgState.gold=Math.max(0,(Number(rpgState.gold)||0)-Math.ceil((Number(rpgState.gold)||0)*.1));
    rpgFinalizeBattleState();
    rpgAdvanceTurns(1,'전투 종료');
    /* Wipe recovery = Revival Prayer recovery, but automatic and free: HP 30% / MP 20%. */
    rpgState.prayerReviveCount4927=(Number(rpgState.prayerReviveCount4927)||0)+1;
    for(const entry of rpgPartyOwnerEntries()){
      const d=rpgEnsureOwnerVitals(entry),o=entry.owner;
      o.currentHp=Math.max(1,Math.ceil(d.maxHp*.30));
      o.currentMp=Math.max(0,Math.ceil(d.maxMp*.20));
      for(const k of ['_wolfRoarTurns932','_wolfBleedTurns932','_wolfChainDefenseTurns932','_gsCorrosionStacks','_gsCorrosionTurns'])o[k]=0;
    }
    addPartyPenalty84(.30,10,'death');
    rpgState.field=null;
    const lines=[
      '정신이 드시나요? 다행이에요. 기도로 간신히 몸을 추슬렀어요.',
      '눈을 뜨셨군요. 아직 온전하진 않으니 무리하지 마세요.',
      '정신이 돌아왔군요. 응급 기도로 살려냈지만 몸 상태가 좋진 않아요.'
    ];
    const wake=lines[Math.floor(Math.random()*lines.length)];
    setTimeout(()=>rpgBattleTransition(()=>{
      rpgRenderPrayer();showPage('rpgPrayerPage');
      const sp=document.querySelector('#gwPrayerSpeech77');if(sp)sp.textContent=wake;
      try{HuNyangDiag.line('RPG_PARTY_WIPE_CHAPEL','auto_revive=hp30_mp20|death_penalty=-30%|turns=10')}catch(_){}
      rpgSaveActiveSlot('rpgPrayerPage','party_wipe_auto_revive');
    }),350);
    return;
  }
  return oldBattleEnd84.apply(this,arguments);
};

/* Resume policy v4.8.90: every continue starts in village.
   If the saved session ended in field/battle, apply the hunt-disconnect penalty once. */
const oldLoadSlot84=rpgLoadSlot;
rpgLoadSlot=function(n){
  const data=rpgGetSlot(n),savedPage=data?.page||'rpgVillagePage';
  const wasField=savedPage==='rpgFieldPage'||savedPage==='rpgBattlePage';
  const reloadRestore=window.__gwReloadRestore4921===true;
  const ok=oldLoadSlot84.apply(this,arguments);if(!ok)return false;
  if(reloadRestore){
    try{HuNyangDiag.line('RPG_RELOAD_LOAD_BYPASS',`${n}/${savedPage}|continue_village_policy=skipped`)}catch(_){ }
    return true;
  }
  try{rpgStopBattleTicker?.();rpgSyncVitalsFromField?.()}catch(_){ }
  if(wasField){
    addPartyPenalty84(.50,10,'hunt_disconnect');
    try{HuNyangDiag.line('RPG_FIELD_EXIT_PENALTY',`from=${savedPage}|penalty=-50%|turns=10`)}catch(_){ }
  }
  rpgState.field=null;
  rpgRenderVillage();showPage('rpgVillagePage');
  rpgSaveActiveSlot('rpgVillagePage',wasField?'field_exit_return_v4890':'continue_return_village');
  try{HuNyangDiag.line('RPG_CONTINUE_VILLAGE_ONLY',`from=${savedPage}|to=rpgVillagePage`)}catch(_){ }
  return true;
};

/* Existing saved characters gain the penalty container lazily. */
owners84().forEach(normalizePenalty84);
try{HuNyangDiag.line('RPG_V4890_RESUME_POLICY','continue=village_only|field_or_battle_exit_penalty=-50%x10|reconnect_grace=removed')}catch(_){}
})();
