
(()=>{
  'use strict';
  const RELOAD_KEY='hunyang_reload_resume_v4920';
  function refundInvalidWeaponSkills4920(owner,label='unit'){
    if(!owner?.skills||!Array.isArray(rpgSkillDefs))return 0;
    let refund=0;
    for(const sk of rpgSkillDefs){
      if(!sk?.weaponBasic)continue;
      const rank=Math.max(0,Math.floor(Number(owner.skills[sk.id])||0));
      if(rank){refund+=rank;owner.skills[sk.id]=0;}
    }
    if(refund){owner.skillPoints=Math.max(0,Math.floor(Number(owner.skillPoints)||0))+refund;try{HuNyangDiag.line('RPG_WEAPON_SKILL_REFUND',`${label}|refund=${refund}`)}catch(_){ }}
    return refund;
  }
  function normalizePartySkills4920(){
    refundInvalidWeaponSkills4920(rpgState,'player');
    refundInvalidWeaponSkills4920(rpgState.ai,rpgState.ai?.name||'ai1');
    refundInvalidWeaponSkills4920(rpgState.ai2,rpgState.ai2?.name||'ai2');
    if(rpgState.ai)rpgAiAutoSpendGrowth(rpgState.ai,rpgState.ai.name||'AI1');
    if(rpgState.ai2)rpgAiAutoSpendGrowth(rpgState.ai2,rpgState.ai2.name||'AI2');
  }
  window.GWNormalizePartySkills4920=normalizePartySkills4920;
  const oldMaintain4920=rpgMaintainAiProgression;
  rpgMaintainAiProgression=function(){refundInvalidWeaponSkills4920(rpgState.ai,rpgState.ai?.name||'ai1');refundInvalidWeaponSkills4920(rpgState.ai2,rpgState.ai2?.name||'ai2');return oldMaintain4920.apply(this,arguments);};
  const oldPartyPage4920=window.rpgRenderPartyStatusPage;
  if(typeof oldPartyPage4920==='function'){window.rpgRenderPartyStatusPage=function(){normalizePartySkills4920();return oldPartyPage4920.apply(this,arguments);};}
  document.addEventListener('contextmenu',e=>{e.preventDefault();const t=e.target;if(!(t instanceof HTMLElement))return;try{t.click()}catch(_){ }},true);
  document.addEventListener('dragstart',e=>e.preventDefault(),true);
  document.addEventListener('selectstart',e=>e.preventDefault(),true);
  document.addEventListener('mousedown',e=>{if(e.button===0&&e.target instanceof HTMLImageElement)e.preventDefault();},true);
  document.addEventListener('keydown',e=>{const key=String(e.key||'').toLowerCase();if(e.key==='F5'||(e.ctrlKey&&key==='r')){e.preventDefault();e.stopImmediatePropagation();try{HuNyangDiag.line('RPG_REFRESH_BLOCKED',e.key==='F5'?'F5':'CTRL_R')}catch(_){ }}},true);
  function saveReloadSnapshot4920(){
    try{const page=typeof activePageId==='function'?activePageId():'';const slot=Number(rpgActiveSlot)||0;if(!slot||!rpgState?.name)return;rpgSaveActiveSlot(page,'reload_guard_v4920');sessionStorage.setItem(RELOAD_KEY,JSON.stringify({slot,page,at:Date.now()}));}catch(_){ }
  }
  addEventListener('beforeunload',saveReloadSnapshot4920,{capture:true});
  addEventListener('pagehide',saveReloadSnapshot4920,{capture:true});
  function restoreReload4920(){
    try{
      const nav=performance.getEntriesByType?.('navigation')?.[0];if(nav?.type!=='reload')return;
      const raw=sessionStorage.getItem(RELOAD_KEY);if(!raw)return;sessionStorage.removeItem(RELOAD_KEY);
      const snap=JSON.parse(raw),slot=Number(snap?.slot)||0,page=String(snap?.page||'');if(!slot||!rpgGetSlot(slot)?.rpg)return;
      window.__gwReloadRestore4921=true;
      let loaded=false;
      try{loaded=!!rpgLoadSlot(slot)}finally{window.__gwReloadRestore4921=false}
      if(!loaded)return;
      const safePage=(page&&document.getElementById(page)&&!['splashPage','homePage','rpgSavePage'].includes(page))?page:'rpgVillagePage';
      try{rpgHydratePage?.(safePage)}catch(_){ }
      showPage(safePage);
      if(safePage==='rpgFieldPage'&&rpgState.field)rpgRenderField?.();
      if(safePage==='rpgBattlePage'&&rpgState.field?.battle){rpgRenderBattlePage?.();rpgStartBattleTicker?.();}
      try{HuNyangDiag.line('RPG_RELOAD_RESTORE',`${slot}/${safePage}`)}catch(_){ }
    }catch(err){try{HuNyangDiag.line('RPG_RELOAD_RESTORE_FAIL',err?.message||err)}catch(_){ }}
  }
  addEventListener('pageshow',()=>setTimeout(restoreReload4920,0),{once:true});
  normalizePartySkills4920();
  try{HuNyangDiag.line('RPG_V4920_READY','party_weapon_skill=matched|ai_weapon_skill_invest=blocked|right_click=left_click|drag=blocked|reload=block_and_restore|version=4.9.25')}catch(_){ }
})();
