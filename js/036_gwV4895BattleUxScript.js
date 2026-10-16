
(()=>{
'use strict';
const q=s=>document.querySelector(s), qa=s=>[...document.querySelectorAll(s)];
const ownerById=id=>id==='player'?rpgState:id==='ai2'?rpgState.ai2:id==='ai'?rpgState.ai:null;
const penaltyName=p=>p?.kind==='death'?'사망 패널티':p?.kind==='hunt_disconnect'?'몬스터의 원한':'능력 저하';
function penaltyEffects(owner){
  const list=Array.isArray(owner?.combatPenalties)?owner.combatPenalties:[];
  return list.filter(p=>Number(p?.remaining)>0).map(p=>({type:'debuff',name:penaltyName(p),detail:`${Math.round((Number(p.pct)||0)*100)}% 능력치 감소 (중복 적용 없음) · ${Math.ceil(Number(p.remaining)||0)}턴`,short:`${penaltyName(p)} (${Math.ceil(Number(p.remaining)||0)}턴)`}));
}
function partyEffects95(u){
  if(!u)return[];const out=penaltyEffects(ownerById(u.id));const t=performance.now(),f=rpgState.field;
  if(u.defending)out.push({type:'buff',name:'방어',detail:'다음 공격에 대비하고 있습니다.',short:'방어'});
  if((u.shield||0)>0)out.push({type:'buff',name:'보호막',detail:`보호막 ${Math.round(u.shield)} 남음`,short:'보호막'});
  if((f?._gsChainDefenseUntil||0)>t)out.push({type:'buff',name:'연계 방어',detail:'피해 95% 감소 · 치사 피해 시 HP 1 생존',short:'연계 방어'});
  if((u._gsInvulnUntil||0)>t)out.push({type:'buff',name:'무적',detail:'연계 방어 생존 효과로 잠시 피해를 받지 않습니다.',short:'무적'});
  if((u._gsCorrosionStacks||0)>0)out.push({type:'debuff',name:'부식',detail:`물리 방어 -${Math.min(3,u._gsCorrosionStacks)*10}% · ${Math.min(3,u._gsCorrosionStacks)}중첩 · 다음 ATB 행동 후 해제`,short:`부식 ${Math.min(3,u._gsCorrosionStacks)}중첩`});
  if((u._wolfRoarTurns932||0)>0)out.push({type:'debuff',name:'포효',detail:`공격력 -20% · ATB 충전 속도 -30% · 남은 ATB ${Math.max(0,u._wolfRoarTurns932)}턴`,short:`포효 ${Math.max(0,u._wolfRoarTurns932)}턴`});
  if((u._wolfBleedTurns932||0)>0)out.push({type:'debuff',name:'출혈',detail:`ATB 행동마다 최대 HP 2% 고정 피해 · 남은 ATB ${Math.max(0,u._wolfBleedTurns932)}턴`,short:`출혈 ${Math.max(0,u._wolfBleedTurns932)}턴`});
  return out;
}
function enemyEffects95(e){
  if(!e||e.dead||(Number(e.hp)||0)<=0)return[];const out=[],s=e._gs87,t=performance.now();
  if(s?.guard)out.push({type:'buff',name:'방어 증가',detail:`방어 상태 · 남은 ATB 주기 ${Math.max(0,s.guardCycles||0)}회`,short:'방어 증가'});
  if((s?.stunnedUntil||0)>t)out.push({type:'debuff',name:'브레이크 기절',detail:'BREAK 성공으로 행동 불가 상태입니다.',short:'기절'});
  if(s?.breakMode)out.push({type:'debuff',name:'BREAK 노출',detail:`브레이크 게이지 ${Math.max(0,Math.ceil(s.breakHp||0))}/${s.breakMax||500}`,short:'BREAK'});
  return out;
}
function ensurePop95(){
  let p=q('#gwEffectPop95');if(p)return p;p=document.createElement('div');p.id='gwEffectPop95';document.body.appendChild(p);return p;
}
function hidePop95(){q('#gwEffectPop95')?.classList.remove('show')}
function showPop95(anchor,title,effects){
  const p=ensurePop95();p.innerHTML=`<div class="ttl">${title}</div>`+effects.map(x=>`<div class="row"><b class="${x.type==='buff'?'gwFxBuff95':'gwFxDebuff95'}">${x.type==='buff'?'▲ 버프':'▼ 디버프'}</b><span><strong>${x.name}</strong><br>${x.detail||''}</span></div>`).join('');
  const r=anchor.getBoundingClientRect();p.classList.add('show');const pr=p.getBoundingClientRect();let left=Math.min(innerWidth-pr.width-8,Math.max(8,r.left+r.width/2-pr.width/2));let top=r.top-pr.height-8;if(top<8)top=Math.min(innerHeight-pr.height-8,r.bottom+8);p.style.left=left+'px';p.style.top=top+'px';
}
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.gwCardFx95')&&!e.target.closest('#gwEffectPop95'))hidePop95()},true);
function fxBadge95(effects,title){
  if(!effects.length)return null;const s=document.createElement('span');s.className='gwCardFx95';const b=effects.filter(x=>x.type==='buff').length,d=effects.length-b;s.innerHTML=`${b?`<span class="buff">▲${b}</span>`:''}${d?`<span class="debuff">▼${d}</span>`:''}`;s.setAttribute('role','button');s.setAttribute('tabindex','0');const open=ev=>{ev.preventDefault();ev.stopPropagation();showPop95(s,title,effects)};s.addEventListener('pointerdown',open,{passive:false});s.addEventListener('click',open);return s;
}

/* 1. Split adds exist in battle data but older refresh only rebuilt cards. Force the battlefield DOM too. */
function ensureEliteSprites95(){
  const f=rpgState.field,b=f?.battle,host=q('#rpgBattleUnits');if(!b||!host)return;
  b.enemies.forEach((e,i)=>{if(e.dead||e.name!=='엘리트 빨간 슬라임')return;let el=host.querySelector(`[data-battle-enemy="${i}"]`);if(!el){host.insertAdjacentHTML('beforeend',rpgBattleUnit2DHtml(e,true,i));el=host.querySelector(`[data-battle-enemy="${i}"]`)}if(el)el.classList.add('gwEliteSlime95')});
  try{window.gwSnapUnits55?.()}catch(_){ }
}
const oldPost95=window.gwBattle55PostActionRefresh;
window.gwBattle55PostActionRefresh=function(reason){const r=oldPost95?.apply(this,arguments);if(reason==='giant_slime_split'){requestAnimationFrame(()=>{try{rpgRenderBattlePage();ensureEliteSprites95();window.gwSyncEnemyCards53?.()}catch(_){}})}return r};

/* 2. Mobile ghost-click guard: encounter button cannot inherit the movement tap that created it. */
const renderCenter95=rpgRenderCenter;
rpgRenderCenter=function(){
  const r=renderCenter95.apply(this,arguments),f=rpgState.field,btn=q('#rpgEngageBtn');
  if(btn&&f?.encounter){
    const fresh=btn.cloneNode(true);btn.replaceWith(fresh);fresh.disabled=true;fresh.classList.add('gwEncounterArm95');
    const born=performance.now();setTimeout(()=>{if(!fresh.isConnected||!rpgState.field?.encounter)return;fresh.disabled=false;fresh.classList.remove('gwEncounterArm95')},520);
    fresh.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(performance.now()-born<500)return;window.rpgForceBattleEnter89?.()});
  }
  return r;
};

/* 3. During wipe charge, once boss ATB is >=50%, every auto-controlled ally preserves ATB for chain actions. */
function shouldHoldChain95(){
  const f=rpgState.field,b=f?.battle,boss=b?.enemies?.find(e=>e?.type==='slimeBoss'&&!e.dead);const hold=!!(boss?._gs87?.breakMode&&(boss.gauge||0)>=50);
  if(f){if(hold&&!f._gsAiHold95){f._gsAiHold95=true;try{HuNyangDiag.line('RPG_GS_CHAIN_HOLD','boss_atb>=50|auto_actions=paused')}catch(_){}}else if(!hold)f._gsAiHold95=false}
  return hold;
}
const oldAiAction95=rpgAiAtbAction;
rpgAiAtbAction=function(){if(shouldHoldChain95())return false;return oldAiAction95.apply(this,arguments)};
const oldAutoPlayer95=rpgAutoPlayerAction;
rpgAutoPlayerAction=function(){if(shouldHoldChain95())return false;return oldAutoPlayer95.apply(this,arguments)};
window.rpgAutoPlayerAction=rpgAutoPlayerAction;

/* 4/5/6/7. Card numbers + named effects + clickable bubble details. */
const oldPartyStrip95=rpgRenderBattlePartyStrip;
rpgRenderBattlePartyStrip=function(){
  const r=oldPartyStrip95.apply(this,arguments),f=rpgState.field,cards=qa('#rpgBattlePartyStrip .rpgBattlePartyCard:not(.empty)');
  (f?.party||[]).slice(0,3).forEach((u,i)=>{const card=cards[i];if(!card)return;const owner=ownerById(u.id),lv=owner?.level||1,nums=document.createElement('div');nums.className='gwBattlePartyNumbers95';nums.textContent=`Lv.${lv} · HP ${Math.max(0,Math.round(u.hp))}/${Math.round(u.derived.maxHp)} · MP ${Math.max(0,Math.round(u.mp))}/${Math.round(u.derived.maxMp)}`;card.appendChild(nums);card.querySelectorAll('.gwCardFx95').forEach(n=>n.remove());const fx=fxBadge95(partyEffects95(u),u.name||'파티원');if(fx)card.appendChild(fx)});return r;
};
const oldEnemyCards95=window.gwSyncEnemyCards53;
window.gwSyncEnemyCards53=function(){
  const r=oldEnemyCards95?.apply(this,arguments),f=rpgState.field;qa('#gwEnemyCards53 [data-enemy-card53]').forEach(btn=>{const i=Number(btn.dataset.enemyCard53),e=f?.battle?.enemies?.[i];if(!e)return;btn.querySelectorAll('.gwCardFx95').forEach(x=>x.remove());const fx=fxBadge95(enemyEffects95(e),e.name||'적');if(fx)btn.appendChild(fx)});return r;
};

function baseDerived95(owner){
  if(!owner)return null;const keep=owner.combatPenalties;owner.combatPenalties=[];let d=null;try{d=rpgDerived(owner.job,owner.stats,owner.skills,owner.equipment)}finally{owner.combatPenalties=keep}return d;
}
function currentDerived95(owner){return owner?rpgDerived(owner.job,owner.stats,owner.skills,owner.equipment):null}
function fmtDelta95(n){n=Math.max(0,Math.round(Number(n)*10)/10);return n?`-${n}`:''}
function addDelta95(strong,vals){if(!strong||!vals?.some(Boolean)||strong.querySelector?.('.gwPenaltyDelta95'))return;const em=document.createElement('em');em.className='gwPenaltyDelta95';em.textContent=vals.filter(v=>v!==null).map(v=>v||'0').join(' / ');strong.appendChild(em)}
function decorateDerived95(root,owner){
  if(!root||!owner)return;const base=baseDerived95(owner),cur=currentDerived95(owner);if(!base||!cur)return;
  root.querySelectorAll('.rpgStatusDerived div,.rpgPartyDetailGrid div,.gwFormationDerived56 div').forEach(cell=>{const lab=cell.querySelector('b')?.textContent?.trim()||'',st=cell.querySelector('strong');if(!st)return;let keys=null;if(lab==='근거리 / 원거리')keys=['meleeAtk','rangedAtk'];else if(lab==='마법 공격')keys=['magicAtk'];else if(lab==='물리 / 마법 방어')keys=['physicalDefense','magicDefense'];else if(lab==='공격속도')keys=['attackSpeed'];else if(lab==='공속 / 회피')keys=['attackSpeed','evasion'];else if(lab==='공속 / 치명')keys=['attackSpeed','crit'];else if(lab==='치명 / 드롭')keys=['crit','dropRate'];if(!keys)return;const vals=keys.map(k=>fmtDelta95((base[k]||0)-(cur[k]||0)));if(vals.some(Boolean))addDelta95(st,vals)});
}
const oldPlayerStats95=rpgRenderPlayerStatsPage;
rpgRenderPlayerStatsPage=function(){const r=oldPlayerStats95.apply(this,arguments);decorateDerived95(q('#rpgPlayerStatsOnly'),rpgState);return r};
if(typeof rpgRenderStatus==='function'){const oldStatus95=rpgRenderStatus;rpgRenderStatus=function(){const r=oldStatus95.apply(this,arguments);const sheets=qa('#rpgStatusParty .rpgStatusSheet'),owners=[rpgState,rpgState.ai,rpgState.ai2].filter(Boolean);sheets.forEach((s,i)=>decorateDerived95(s,owners[i]));return r}}
function postPartyPage95(selected='player'){const owner=ownerById(selected)||rpgState;decorateDerived95(q('#rpgPartyDetail'),owner);const cards=qa('#rpgPartyMemberList [data-party-detail]');cards.forEach(card=>{const id=card.dataset.partyDetail,o=ownerById(id),fx=penaltyEffects(o);const meta=card.querySelector('.rpgPartyMemberMeta');if(meta&&fx.length&&!meta.querySelector('.gwPenaltyText95'))meta.insertAdjacentHTML('beforeend',`<br><span class="gwPenaltyText95">${fx.map(x=>x.short).join(' · ')}</span>`)});}
if(window.rpgRenderPartyStatusPage){const oldPartyPage95=window.rpgRenderPartyStatusPage;window.rpgRenderPartyStatusPage=function(selected='player'){const r=oldPartyPage95.apply(this,arguments);postPartyPage95(selected);return r}}
document.addEventListener('click',e=>{const c=e.target.closest?.('[data-party-detail]');if(c)setTimeout(()=>postPartyPage95(c.dataset.partyDetail),0)},true);
/* v4.8.96: show penalties immediately on first entry from the village too. */
q('#rpgVillagePartyBtn')?.addEventListener('click',()=>{try{postPartyPage95('player')}catch(_){}});

/* Keep battlefield/cards enhanced after any full render. */
const renderBattle95=rpgRenderBattlePage;
rpgRenderBattlePage=function(){const r=renderBattle95.apply(this,arguments);ensureEliteSprites95();window.gwSyncEnemyCards53?.();return r};

/* v4.8.96: formation page mirrors party-status penalty visibility and reduced-stat deltas. */
function postFormation96(){
  qa('#rpgFormationPartyCards [data-member]').forEach(card=>{
    card.querySelector('.gwFormationPenalty96')?.remove();
    const o=ownerById(card.dataset.member),fx=penaltyEffects(o);if(!fx.length)return;
    const tag=document.createElement('span');tag.className='gwFormationPenalty96';tag.textContent=fx.map(x=>x.short).join(' · ');card.appendChild(tag);
  });
  const id=(typeof rpgFormationExpandedId!=='undefined'&&rpgFormationExpandedId)?rpgFormationExpandedId:null,detail=q('#rpgFormationDetail');
  detail?.querySelector('.gwFormationPenaltyDetail96')?.remove();
  if(id&&detail){
    const o=ownerById(id),fx=penaltyEffects(o),panel=detail.querySelector('.gwFormationDetailPanel56');
    if(panel&&fx.length){const box=document.createElement('div');box.className='gwFormationPenaltyDetail96';box.innerHTML=fx.map(x=>`<span>▼ ${x.short}</span>`).join('');const head=panel.querySelector('.gwFormationDetailHead56');if(head)head.insertAdjacentElement('afterend',box);else panel.prepend(box)}
    if(o)decorateDerived95(detail,o);
  }
}
if(typeof rpgRenderFormationParty56==='function'){
  const oldFormationParty96=rpgRenderFormationParty56;
  rpgRenderFormationParty56=function(){const r=oldFormationParty96.apply(this,arguments);postFormation96();return r};
}
try{HuNyangDiag.line('RPG_V4896_READY','party_penalty=visible_on_entry|formation_penalty=visible|formation_stat_delta=on')}catch(_){ }

try{HuNyangDiag.line('RPG_V4895_READY','split_sprite=forced|encounter_ghost_click=guarded|wipe_ai_hold_atb=50|penalty_names=death+grudge|effect_popup=on|battle_vitals=on|stat_delta=on')}catch(_){ }
})();
