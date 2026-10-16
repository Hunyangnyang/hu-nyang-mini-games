
(()=>{
  const sources=[];
  try{sources.push(rpgBattleCharacterArt.adventurerMaleIdle,rpgBattleCharacterArt.adventurerMaleAttack,rpgBattleCharacterArt.adventurerFemaleIdle,rpgBattleCharacterArt.adventurerFemaleAttack)}catch(e){}
  try{Object.values(rpgSlimeDefs).forEach(d=>sources.push(d.image,d.attackImage,d.hitImage))}catch(e){}
  [...new Set(sources.filter(Boolean))].forEach(src=>{const img=new Image();img.decoding='async';img.src=src;img.decode?.().catch(()=>{})});
  try{HuNyangDiag.line('RPG_ASSET_PRELOAD_READY','v4.8.69');HuNyangDiag.line('RPG_BATTLE_PERF_READY','no_100ms_full_render+compact_save+line_target');HuNyangDiag.line('RPG_AI_PROGRESSION_READY','ai2_exp+random_growth+player_equipment_mirror');HuNyangDiag.line('RPG_V4863_READY','field_daytime_summary+scene_title_removed+party_profile_icons+duplicate_audit')}catch(e){}
})();
