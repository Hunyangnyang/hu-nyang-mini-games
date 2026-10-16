
(()=>{
'use strict';
const q=s=>document.querySelector(s);
function ensureRel81(k){
  const rels=window.V38_ensureRelations?.()||(rpgState.guildNpcRelations||(rpgState.guildNpcRelations={}));
  if(!rels[k]) rels[k]={affinity:0,meetings:0,lastDay:-1};
  rels[k]={affinity:0,meetings:0,lastDay:-1,...rels[k]};
  return rels[k];
}
function paintRel81(k){
  const rel=ensureRel81(k),v=Math.max(-10,Math.min(10,Number(rel.affinity)||0)),pct=(v+10)*5;
  const color=v>=6?'#ff739d':v>=2?'#ef9ab5':v<=-6?'#8c5d68':v<=-2?'#b37888':'#d7a0b5';
  const fill=q('#rpgRelationFill'),heart=q('#rpgRelationHeart');
  if(fill){fill.style.width=pct+'%';fill.style.backgroundColor=color;}
  if(heart){heart.style.color=color;heart.setAttribute('title',`성향 ${v>=0?'+':''}${v}`)}
}
/* class-talk button must load persisted relation even when normal daily talk was never opened */
document.addEventListener('click',e=>{
  const b=e.target.closest?.('.gwClassQuestBang79');if(!b)return;
  const wrap=b.closest('.guildNpcPortraitPick');const k=wrap?.querySelector?.('[data-guild-npc]')?.dataset?.guildNpc;
  if(k){ensureRel81(k);paintRel81(k);setTimeout(()=>paintRel81(k),0)}
},true);
/* also repaint whenever the class-talk page is visibly active */
const oldShow81=showPage;showPage=function(id,dir='auto'){
  const v=oldShow81(id,dir);
  if(id==='rpgGuildNpcPage')setTimeout(()=>{for(const k of ['rubia','kain'])ensureRel81(k);},0);
  return v;
};
/* Fix one-time strong quest semantics: one-time on completion, not on first acceptance.
   Old v4.8.67 acceptedQuestIds guard could permanently lock wolf king after changing/abandoning quests. */
rpgRequestQuest=function(id,rank='F',btn){
  const sameActive=rpgState.quest?.id===id&&!rpgState.quest?.rewarded;if(sameActive)return;
  if(rpgState.quest&&!rpgState.quest.rewarded){rpgOpenQuestChange(id,rank,btn);return;}
  if(!rpgQuestTestAvailable(id)){rpgShowQuestUnavailable(btn);return;}
  rpgAcceptQuest(id,rank);
};
/* remove stale accepted-only lock for the two strong quests from old saves; completedQuestIds remains authoritative */
if(Array.isArray(rpgState.acceptedQuestIds)){
  const done=new Set(Array.isArray(rpgState.completedQuestIds)?rpgState.completedQuestIds:[]);
  rpgState.acceptedQuestIds=rpgState.acceptedQuestIds.filter(id=>!['f_boss_slime','f_boss_wolf'].includes(id)||done.has(id));
}
try{HuNyangDiag.line('RPG_V4881_READY','class_relation_restore=ok|strong_accept_lock=completion_only|titles=field_aligned|chapel_smith_portrait=larger')}catch(_){}
})();
