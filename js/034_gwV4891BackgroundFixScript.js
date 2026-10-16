
(()=>{
'use strict';
function apply91(){
  try{
    /* Reuse v4.8.79's already embedded morning/noon/night/dawn NPC/shop assets. */
    window.GW79ApplyScene?.();
    /* v4.8.80 owns the current village/prayer background selection. */
    window.GW80ApplyScene?.();
  }catch(e){try{HuNyangDiag.line('RPG_V4891_BG_APPLY_ERROR',String(e?.message||e))}catch(_){}}
}
/* Every page transition re-applies the time-of-day scene so alternate entry paths cannot miss it. */
const oldShow91=showPage;
showPage=function(id,navDirection='auto'){
  const v=oldShow91(id,navDirection);
  if(['rpgVillagePage','rpgPrayerPage','rpgNpcPage','rpgShopSelectPage','rpgShopPage','rpgGeneralShopPage'].includes(id))requestAnimationFrame(apply91);
  return v;
};
/* Time changes while either page is open also refresh the scene immediately. */
const oldAdvance91=rpgAdvanceTurns;
rpgAdvanceTurns=function(){
  const v=oldAdvance91.apply(this,arguments);
  requestAnimationFrame(apply91);
  return v;
};
/* Explicit NPC open path, in case a legacy handler bypasses the generic page wrapper. */
if(typeof rpgOpenTownNpc==='function'){
  const oldTown91=rpgOpenTownNpc;
  rpgOpenTownNpc=function(){apply91();const v=oldTown91.apply(this,arguments);requestAnimationFrame(apply91);return v};
}
setTimeout(apply91,80);
try{HuNyangDiag.line('RPG_V4891_READY','village_bg=full_cover|npc_bg=time_refresh|assets=reuse_v79')}catch(_){}
})();
