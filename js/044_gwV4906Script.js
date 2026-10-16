
(()=>{
  'use strict';
  const q=(s,r=document)=>r.querySelector(s);

  /* 4. Real hit target above every battle overlay. Existing v4.9.04 capture handler
        receives the click because this button remains inside .gwAutoRow53. */
  function ensureAutoHit4906(){
    /* v4.9.10 retired: no invisible overlay. */
    q('#rpgBattlePage .gwAutoHit4906')?.remove();
  }
  const oldRender4906=rpgRenderBattlePage;
  rpgRenderBattlePage=function(){
    const v=oldRender4906.apply(this,arguments);
    ensureAutoHit4906();
    cleanupDeadFx4906();
    return v;
  };

  /* 6. Remove persistent effect UI as soon as its owner is dead. */
  function cleanupDeadFx4906(){
    const b=rpgState.field?.battle;
    if(!b)return;
    const boss=b.enemies?.find(e=>e?.type==='slimeBoss');
    if(!boss||boss.dead||(Number(boss.hp)||0)<=0){
      const floating=q('#gwGSBossBuff87');
      if(floating)floating.classList.remove('show');
    }
    q('#gwEnemyCards53')?.querySelectorAll('[data-enemy-card53]').forEach(card=>{
      const i=Number(card.dataset.enemyCard53),e=b.enemies?.[i];
      if(!e||e.dead||(Number(e.hp)||0)<=0)card.querySelector('.gwCardFx95')?.remove();
    });
    q('#rpgBattlePartyStrip')?.querySelectorAll('.rpgBattlePartyCard').forEach((card,i)=>{
      const u=rpgState.field?.party?.[i];
      if(u?.dead||(Number(u?.hp)||0)<=0)card.querySelector('.gwCardFx95')?.remove();
    });
  }

  /* Ensure 3-line history even after any legacy renderer runs. */
  function trimFieldHistory4906(){
    const host=q('#rpgFieldHistory');if(!host)return;
    [...host.children].slice(3).forEach(n=>n.remove());
    host.scrollTop=0;
  }
  const oldField4906=rpgRenderField;
  rpgRenderField=function(){
    const v=oldField4906.apply(this,arguments);
    trimFieldHistory4906();
    return v;
  };

  const oldShow4906=showPage;
  showPage=function(id,dir='auto'){
    const v=oldShow4906(id,dir);
    requestAnimationFrame(()=>{
      if(id==='rpgBattlePage'){ensureAutoHit4906();cleanupDeadFx4906()}
      if(id==='rpgFieldPage')trimFieldHistory4906();
    });
    return v;
  };

  ensureAutoHit4906();
  trimFieldHistory4906();

  try{HuNyangDiag.line('RPG_V4906_READY','class_stage1=specific_targets|class_stage2=boss_target|field_history=3lines|auto_hitbox=overlay|enemy_card=taller|dead_fx=cleanup|battle_title=center|scrollbars=hidden|stray_newline=removed')}catch(_){}
})();
