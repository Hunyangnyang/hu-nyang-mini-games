
(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s);

function syncSeriaBg935(){const src=q('#rpgPrayerPage'),dst=q('#rpgSeriaDialoguePage');if(!src||!dst)return;dst.style.backgroundImage=src.style.backgroundImage||getComputedStyle(src).backgroundImage}
function syncSeriaButtons935(){const box=q('.gwSeriaTriangle933'),quest=q('#gwSeriaQuestBtn933');if(box)box.classList.toggle('noQuest',!quest?.classList.contains('show'))}
const openSeria935=window.gwOpenSeriaDialogue933;if(typeof openSeria935==='function')window.gwOpenSeriaDialogue933=function(){const r=openSeria935.apply(this,arguments);syncSeriaBg935();setTimeout(syncSeriaButtons935,0);return r};
const show935=window.showPage;window.showPage=function(id,dir='auto'){const r=show935.apply(this,arguments);if(id==='rpgSeriaDialoguePage')setTimeout(()=>{syncSeriaBg935();syncSeriaButtons935()},0);if(id==='rpgBattlePage')setTimeout(()=>{try{window.gwApplyTimeBackground56?.('battle')}catch(_){}syncWolfBase935()},0);return r};
q('#gwSeriaQuestBtn933')?.addEventListener('click',()=>setTimeout(syncSeriaButtons935,20));

function ownerDebuffs935(id,owner){const u=rpgState.field?.party?.find?.(x=>x.id===id),src=u||owner||{},a=[];if((src._wolfRoarTurns932||0)>0)a.push(`📣 포효 ${src._wolfRoarTurns932}턴`);if((src._wolfBleedTurns932||0)>0)a.push(`🩸 출혈 ${src._wolfBleedTurns932}턴`);if((src._gsCorrosionStacks||0)>0)a.push(`🧪 부식 ${src._gsCorrosionStacks}중첩`);if((src._wolfChainDefenseTurns932||0)>0)a.push(`🛡️ 연계 방어 ${src._wolfChainDefenseTurns932}턴`);return a}
function injectPrayerDebuffs935(){const host=q('#rpgPrayerParty');if(!host||typeof rpgPartyOwnerEntries!=='function')return;const entries=rpgPartyOwnerEntries();[...host.querySelectorAll('.gwPrayerMember55')].forEach((card,i)=>{card.querySelector('.gwPrayerDebuff935')?.remove();card.querySelector('.gwPrayerDebuff934')?.remove();const ent=entries[i];if(!ent)return;const vals=ownerDebuffs935(ent.id,ent.owner);if(!vals.length)return;const d=document.createElement('div');d.className='gwPrayerDebuff935';d.innerHTML=vals.map(x=>`<span>${x}</span>`).join('');card.appendChild(d)})}
const prayer935=rpgRenderPrayer;rpgRenderPrayer=function(){const r=prayer935.apply(this,arguments);injectPrayerDebuffs935();return r};

function ensureJudge935(){const atb=q('#gwWolfAtb932');if(!atb)return null;let j=q('#gwWolfParryJudge935');if(!j){q('#gwWolfParryJudge934')?.remove();j=document.createElement('div');j.id='gwWolfParryJudge935';atb.appendChild(j)}return j}
let judgeTimer935=0;window.gwWolfJudge935=function(type,text){const j=ensureJudge935();if(!j)return;clearTimeout(judgeTimer935);j.className='';j.id='gwWolfParryJudge935';j.textContent=text;j.classList.add('show',String(type||'').toLowerCase());judgeTimer935=setTimeout(()=>j.classList.remove('show'),1200)};

function syncWolfBase935(){q('#rpgBattleUnits')?.querySelectorAll('.gwWolfBoss4935').forEach(x=>x.classList.remove('gwWolfBoss4935'));const b=rpgState.field?.battle;if(!b)return;const i=b.enemies?.findIndex?.(e=>e?.type==='wolfBoss'&&!e.dead);if(i==null||i<0)return;const el=q(`#rpgBattleUnits [data-battle-enemy="${i}"]`);if(el){el.classList.add('gwWolfBoss4935');el.classList.remove('gwWolfSingleArt4941');window.gwWolfStateSprite4936?.(b.enemies[i])}}

const move935=rpgMoveStep;rpgMoveStep=function(){const f0=rpgState.field,had=!!f0?.encounter,c0={...(rpgState.bossHuntCounters||{})},q0=typeof activeQuest==='function'?activeQuest():null;const r=move935.apply(this,arguments);const f=rpgState.field;if(!had&&!q0&&f?.encounter?.boss){const e=f.encounter.enemies?.[0],type=e?.type;if(type==='slimeBoss'||type==='wolfBoss'){const pity=type==='slimeBoss'?50:30,key=type==='slimeBoss'?'slime':'wolf',reason=(Number(c0[key])||0)>=pity?'pity':'random_1pct';try{HuNyangDiag.line('RPG_BOSS_ENCOUNTER_4935',`type=${type}|reason=${reason}|counterBefore=${Number(c0[key])||0}|pity=${pity}`)}catch(_){}}}return r};

const render935=rpgRenderBattlePage;rpgRenderBattlePage=function(){const r=render935.apply(this,arguments);try{window.gwApplyTimeBackground56?.('battle')}catch(_){}ensureJudge935();syncWolfBase935();return r};
const tick935=rpgBattleTick;rpgBattleTick=function(){const r=tick935.apply(this,arguments);ensureJudge935();syncWolfBase935();return r};

syncSeriaButtons935();injectPrayerDebuffs935();
try{HuNyangDiag.line('RPG_V4935_READY','replace_not_stack=on|wolf_motion_assets=removed|wipe_debuff_clear=on|battle_bg=restored|bleed=atb_consumption+diag|wolf_base_art=centered|version=4.9.35')}catch(_){}
})();
