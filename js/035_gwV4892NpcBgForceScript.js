
(()=>{
'use strict';
function npcPart92(){
  try{
    /* v4.8.93: use the exact same time-part source as the village clock/background. */
    if(typeof rpgWorldPart==='function')return (rpgWorldPart()?.key)||'morning';
    return (typeof rpgPartFromTurn==='function'?rpgPartFromTurn(Number(rpgState?.worldTurn)||0):{key:'morning'}).key||'morning';
  }catch(_){return 'morning'}
}
function applyNpcBg92(){
  try{
    const assets=window.GW79SceneAssets||window.GW79_ASSETS;
    const page=document.getElementById('rpgNpcPage');
    if(!assets||!page)return false;
    const key=npcPart92();
    const src={morning:assets.npc_morning,noon:assets.npc_noon,night:assets.npc_night,dawn:assets.npc_dawn}[key]||assets.npc_morning;
    if(!src)return false;
    page.style.setProperty('background',`url("${src}") center top / cover no-repeat`,'important');
    page.style.setProperty('background-color','#d9e7ef','important');
    const screen=page.querySelector(':scope > .screen');
    if(screen){
      screen.style.setProperty('background','transparent','important');
      screen.style.setProperty('background-image','none','important');
    }
    page.dataset.gwNpcBg=key;
    try{HuNyangDiag.line('RPG_NPC_BG_APPLIED',`part=${key}|asset=${src.length||0}`)}catch(_){ }
    return true;
  }catch(e){
    try{HuNyangDiag.line('RPG_NPC_BG_APPLY_FAIL',String(e?.message||e))}catch(_){ }
    return false;
  }
}
window.GW92ApplyNpcBg=applyNpcBg92;
const show92=showPage;
showPage=function(id,navDirection='auto'){
  if(id==='rpgNpcPage')applyNpcBg92();
  return show92(id,navDirection);
};
if(typeof rpgOpenTownNpc==='function'){
  const open92=rpgOpenTownNpc;
  rpgOpenTownNpc=function(){
    applyNpcBg92();
    return open92.apply(this,arguments);
  };
}
if(typeof rpgAdvanceTurns==='function'){
  const adv92=rpgAdvanceTurns;
  rpgAdvanceTurns=function(){
    const out=adv92.apply(this,arguments);
    if(document.getElementById('rpgNpcPage')?.classList.contains('active'))applyNpcBg92();
    return out;
  };
}

try{HuNyangDiag.line('RPG_V4892_READY','npc_background=forced_important|assets=reuse_v79|apply=show+open+turn')}catch(_){ }
try{HuNyangDiag.line('RPG_V4893_READY','npc_time_source=rpgWorldPart|village_npc_time_sync=on')}catch(_){ }
try{HuNyangDiag.line('RPG_V4894_READY','npc_legacy_bg=removed|npc_bg=preapply_only|flash_fix=on')}catch(_){ }
})();
