
(()=>{
  'use strict';
  const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
  function ensureAuto4912(){
    qa('#rpgBattlePage .gwAutoHit4906').forEach(n=>n.remove());
    const btn=q('#rpgBattlePage #gwAutoSwitch53');
    if(!btn)return;
    btn.style.pointerEvents='auto';
    btn.style.cursor='pointer';
    btn.style.touchAction='manipulation';
    /* Do not add another input listener. v4.8.69 rpgBindPress is the single owner. */
    window.gwSyncAuto53?.();
  }
  function cleanupDeadFx4912(){
    const b=rpgState?.field?.battle;if(!b)return;
    const boss=b.enemies?.find(e=>e?.type==='slimeBoss');
    if(!boss||boss.dead||(Number(boss.hp)||0)<=0)q('#gwGSBossBuff87')?.classList.remove('show');
    qa('#gwEnemyCards53 [data-enemy-card53]').forEach(card=>{const i=Number(card.dataset.enemyCard53),e=b.enemies?.[i];if(!e||e.dead||(Number(e.hp)||0)<=0)card.querySelector('.gwCardFx95')?.remove()});
    qa('#rpgBattlePartyStrip .rpgBattlePartyCard').forEach((card,i)=>{const u=rpgState?.field?.party?.[i];if(u?.dead||(Number(u?.hp)||0)<=0)card.querySelector('.gwCardFx95')?.remove()});
  }
  function trimFieldHistory4912(){const host=q('#rpgFieldHistory');if(!host)return;[...host.children].slice(3).forEach(n=>n.remove());host.scrollTop=0}
  function syncClassBang4912(){
    const root=q('#rpgGuildNpcPage');if(!root)return;const cq=rpgState?.classQuest;
    qa('.gwClassQuestBang79',root).forEach(b=>{const k=b.closest('.guildNpcPortraitPick')?.querySelector('[data-guild-npc]')?.dataset.guildNpc;const stage=Math.max(1,Number(cq?.stage)||1),show=!!(cq&&!cq.rewarded&&stage===1&&cq.completed&&k===cq.mentor);b.classList.toggle('show',show);b.classList.toggle('gwStage2Ready4904',show);if(!show)b.classList.remove('lockedBy4905')});
  }
  const renderBattle4912=rpgRenderBattlePage;
  rpgRenderBattlePage=function(){const v=renderBattle4912.apply(this,arguments);ensureAuto4912();cleanupDeadFx4912();return v};
  const renderField4912=rpgRenderField;
  rpgRenderField=function(){const v=renderField4912.apply(this,arguments);trimFieldHistory4912();return v};
  const show4912=showPage;
  showPage=function(id,dir='auto'){const v=show4912(id,dir);requestAnimationFrame(()=>{if(id==='rpgBattlePage'){ensureAuto4912();cleanupDeadFx4912()}if(id==='rpgFieldPage')trimFieldHistory4912();if(id==='rpgGuildNpcPage')syncClassBang4912()});return v};
  ensureAuto4912();trimFieldHistory4912();syncClassBang4912();
  try{HuNyangDiag.line('RPG_V4912_READY','shop_equipped=hidden_first_render|general_bulk_buy=qty_controls|leader_badge=exp_below|auto_overlap=topbar46_single_binding|field_item=one_turn_log_clean|home_build=4.9.25')}catch(_){ }
})();
