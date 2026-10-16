/* v4.9.58 - giant slime 10% BREAK chain UI visibility and ATB hold */
(()=>{'use strict';
const $=s=>document.querySelector(s);
let last='';
function sync(){
 const f=rpgState?.field,b=f?.battle;
 const boss=b?.enemies?.find(e=>e?.type==='slimeBoss'&&!e.dead),s=boss?._gs87;
 const host=$('#gwGSChain87');
 if(!host||!f||!b||!s){host?.classList.remove('show');return}
 const wipe=!!s.breakMode&&s.cast==='wipe'&&!s.wipeChainUsed&&!f._gwChainCineBusy4926;
 const living=(f.party||[]).filter(u=>!u.dead&&u.hp>0);
 const ready=living.length>0&&living.every(u=>Number(u.gauge)>=99.999);
 const visible=wipe&&ready;
 host.classList.toggle('show',visible);
 host.hidden=false;
 host.style.display=visible?'grid':'none';
 host.setAttribute('aria-hidden',visible?'false':'true');
 // Display the two actions directly above the enemy-card UI, like the wolf king controls.
 const lower=$('#rpgBattlePage .rpgBattleLower');
 const enemyCards=$('#gwEnemyCards53');
 if(lower&&enemyCards&&host.parentElement!==lower)lower.insertBefore(host,enemyCards);
 if(lower&&enemyCards&&host.nextElementSibling!==enemyCards)lower.insertBefore(host,enemyCards);
 if(visible&&!host.dataset.gwVisibleDiagnostic71){host.dataset.gwVisibleDiagnostic71='1';requestAnimationFrame(()=>{const rect=host.getBoundingClientRect(),css=getComputedStyle(host);try{HuNyangDiag.line('RPG_GS_CHAIN_VIS_4971',JSON.stringify({display:css.display,visibility:css.visibility,rect:[Math.round(rect.x),Math.round(rect.y),Math.round(rect.width),Math.round(rect.height)],viewport:innerHeight,insideViewport:rect.height>0&&rect.bottom>0&&rect.top<innerHeight,connected:host.isConnected,parent:host.parentElement?.className||''}))}catch(_){}})}
 if(!visible)delete host.dataset.gwVisibleDiagnostic71;
 const signature=`${s.breakMode?'BREAK':'NO_BREAK'}|${s.cast||'-'}|ready=${ready}|shown=${visible}|members=${living.length}`;
 if(signature!==last&&(visible||signature.includes('BREAK'))){
   last=signature;
   try{HuNyangDiag.line('RPG_GS_CHAIN_4958',signature)}catch(_){ }
 }
}
// Block ANY pending AI/auto action while the ten-percent charge is occurring;
// script-local casts and queued auto actions must not consume the ready gauges.
function pending(){
 const f=rpgState?.field;
 return !!f?.battle?.enemies?.some(e=>e?.type==='slimeBoss'&&!e.dead&&e._gs87?.breakMode&&e._gs87?.cast==='wipe');
}
for(const name of ['rpgAiAtbAction','rpgAutoPlayerAction']){
 const old=window[name];
 if(typeof old==='function')window[name]=function(){if(pending())return false;return old.apply(this,arguments)};
}
const oldTick=window.rpgBattleTick;
if(typeof oldTick==='function')window.rpgBattleTick=function(){const out=oldTick.apply(this,arguments);sync();return out};
const oldRender=window.rpgRenderBattlePage;
if(typeof oldRender==='function')window.rpgRenderBattlePage=function(){const out=oldRender.apply(this,arguments);sync();return out};
const oldBegin=window.rpgBeginBattle;
if(typeof oldBegin==='function')window.rpgBeginBattle=function(){const result=oldBegin.apply(this,arguments);last='';sync();return result};
window.GWGSChainRefresh4958=sync;
try{HuNyangDiag.line('RPG_V4958_READY','giant_wipe_10pct=chain_hud_sync|ai_hold=immediate|readiness=all_living_atb_100')}catch(_){ }
})();
