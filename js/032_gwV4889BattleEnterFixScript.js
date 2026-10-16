
(()=>{
  /* v4.8.89: harden field/battle saves and make encounter -> battle entry fail-safe. */
  const save88=rpgSaveActiveSlot;
  rpgSaveActiveSlot=function(pageOverride=null,reason='auto'){
    const requested=pageOverride||activePageId();
    if((requested==='rpgFieldPage'||requested==='rpgBattlePage')&&!rpgState.field){
      try{HuNyangDiag.line('RPG_ORPHAN_FIELD_SAVE_BLOCKED',`${requested}/${reason}`)}catch(_){ }
      return false;
    }
    if(requested==='rpgBattlePage'&&!rpgState.field?.battle){
      try{HuNyangDiag.line('RPG_ORPHAN_BATTLE_SAVE_BLOCKED',`${requested}/${reason}`)}catch(_){ }
      return false;
    }
    return save88.apply(this,arguments);
  };

  function forceBattleEnter89(){
    const f=rpgState.field;
    try{HuNyangDiag.line('RPG_BATTLE_ENTER_REQUEST',`encounter=${!!f?.encounter}|battle=${!!f?.battle}|page=${activePageId()}`)}catch(_){ }
    if(!f)return false;
    if(f.battle){
      try{rpgHydratePage?.('rpgBattlePage')}catch(_){ }
      showPage('rpgBattlePage');
      try{rpgStartBattleTicker?.()}catch(_){ }
      try{rpgRenderBattlePage?.()}catch(_){ }
      rpgSaveActiveSlot('rpgBattlePage','battle_enter_existing_v4889');
      try{HuNyangDiag.line('RPG_BATTLE_ENTER_OK','existing_battle')}catch(_){ }
      return true;
    }
    if(!f.encounter){
      try{HuNyangDiag.line('RPG_BATTLE_ENTER_FAIL','encounter_missing')}catch(_){ }
      return false;
    }

    /* Do not depend on a possibly stale transition lock. Create battle state first, then show the page. */
    try{
      rpgBeginBattle();
    }catch(err){
      try{HuNyangDiag.line('RPG_BATTLE_ENTER_FAIL',`begin_throw:${err?.message||err}`)}catch(_){ }
      return false;
    }
    if(!f.battle){
      try{HuNyangDiag.line('RPG_BATTLE_ENTER_FAIL','battle_not_created')}catch(_){ }
      return false;
    }
    try{rpgHydratePage?.('rpgBattlePage')}catch(_){ }
    showPage('rpgBattlePage');
    try{rpgRenderBattlePage?.()}catch(_){ }
    try{rpgStartBattleTicker?.()}catch(_){ }
    rpgSaveActiveSlot('rpgBattlePage','battle_enter_v4889');
    const boss=f.battle.enemies?.find(e=>e?.type==='slimeBoss'||e?.boss);
    try{HuNyangDiag.line('RPG_BATTLE_ENTER_OK',`${boss?'boss':'normal'}|enemies=${f.battle.enemies?.length||0}`)}catch(_){ }
    return true;
  }

  /* Replace the field center button binding after every render, so old handlers cannot silently swallow the tap. */
  const renderCenter88=rpgRenderCenter;
  rpgRenderCenter=function(){
    const out=renderCenter88.apply(this,arguments);
    const f=rpgState.field,btn=document.getElementById('rpgEngageBtn');
    if(btn&&f?.encounter){
      const fresh=btn.cloneNode(true);
      btn.replaceWith(fresh);
      fresh.addEventListener('pointerdown',e=>{
        e.preventDefault();e.stopPropagation();
        forceBattleEnter89();
      },{passive:false});
      fresh.addEventListener('click',e=>{
        e.preventDefault();e.stopPropagation();
        forceBattleEnter89();
      });
    }
    return out;
  };

  /* Public recovery hook for existing rendered encounter screens. */
  window.rpgForceBattleEnter89=forceBattleEnter89;
  setTimeout(()=>{try{rpgRenderCenter?.()}catch(_){ }},0);
  try{HuNyangDiag.line('RPG_V4889_READY','battle_enter_fail_safe=on|orphan_field_save_block=on|orphan_battle_save_block=on')}catch(_){ }
})();
