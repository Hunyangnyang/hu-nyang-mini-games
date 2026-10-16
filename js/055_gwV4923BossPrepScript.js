
(()=>{
  if(typeof rpgSlimeDefs!=='undefined'&&rpgSlimeDefs?.wolfBoss){
    Object.assign(rpgSlimeDefs.wolfBoss,{
      hp:1800,
      attack:40,
      defense:13,
      magicDefense:13,
      dex:14
    });
  }
  try{
    const w=(typeof rpgSlimeDefs!=='undefined')?rpgSlimeDefs?.wolfBoss:null;
    const aspd=w?1+(Number(w.dex||1)-1)*.08:0;
    HuNyangDiag.line('RPG_WOLF_BOSS_STATS_4924',`hp=${w?.hp}|atk=${w?.attack}|def=${w?.defense}|dex=${w?.dex}|attackSpeed=${aspd.toFixed(2)}`);
    HuNyangDiag.line('RPG_V4924_READY','wolf_stats=1800,40,13,dex14|giant_split=80pct+15s+2atb_stun|devour=remaining_hp50|wipe=killable_before_cast+deferred_priority|chain_buttons=hidden_below_stage|version=4.9.25');
  }catch(_){}
})();
