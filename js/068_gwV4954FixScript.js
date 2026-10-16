(()=>{'use strict';
const q=(s,root=document)=>root.querySelector(s);
const qa=(s,root=document)=>Array.from(root.querySelectorAll(s));
function clearBattleFx54(){
 const stage=q('#rpgBattleStage');if(!stage)return;
 ['#gwGSSplash87','#gwGSNotice87','#gwGSBreak87','#gwGSTime87','#gwGSBossBuff87','#gwGSChain87'].forEach(s=>{const el=q(s);if(el)el.classList.remove('show','active')});
 qa('.gwGSHit87,.gwGSChainDef87,.gwGSDevourHeal97,.gwGSExplode87,.gwGSWipe87,.gwGSAoe87,.gwGSSplit87,.gwGSAttack87',stage).forEach(el=>el.classList.remove('gwGSHit87','gwGSChainDef87','gwGSDevourHeal97','gwGSExplode87','gwGSWipe87','gwGSAoe87','gwGSSplit87','gwGSAttack87'));
 qa('.gwGSSplash87,.gwChainCine4926,.gwChainSlash4926,.gwChainShield4926,.rpgDamageFloat',stage).forEach(el=>el.remove());
 window.GWResetChain53?.();
}
const oldAdvance54=rpgAdvanceTurns;rpgAdvanceTurns=function(n,why){const before=Number(rpgState?.worldTurn)||0;const v=oldAdvance54.apply(this,arguments);try{HuNyangDiag.line('RPG_TURN_4954',`${why||'unknown'}|delta=${Number(rpgState?.worldTurn||0)-before}|now=${rpgState?.worldTurn}`)}catch(_){}return v};
const oldBegin=rpgBeginBattle;rpgBeginBattle=function(){clearBattleFx54();const out=oldBegin.apply(this,arguments);const b=rpgState.field?.battle;if(b){for(const e of b.enemies||[]){if(e.type==='wolfBoss'){e.maxHp=2200;e.hp=2200}else if(e.type==='slimeBoss'){e.maxHp=2000;e.hp=2000}}}return out};
// Leave spell/attack illustrations in place during hit; the active boss controller owns sprite states.
function holdActiveSprite(el,e){if(!el||!e)return;const gs=e._gs87,active=gs&&(gs.cast||gs.busy||gs.breakMode||gs.splitPhase||gs.visual&&gs.visual!=='idle');if(!active)return;el.classList.remove('rpgBattleHit','rpgHit','hit');const img=q('.rpgBattleUnitSprite img',el);if(img){img.style.filter='';if(gs.visual==='wipe')el.classList.add('gwGSFlip87');}}
const oldRender=rpgRenderBattlePage;rpgRenderBattlePage=function(){const out=oldRender.apply(this,arguments);const enemies=rpgState.field?.battle?.enemies||[];enemies.forEach((e,i)=>holdActiveSprite(q(`#rpgBattleUnits [data-battle-enemy="${i}"]`),e));return out};
// Equipment enhancement mutates inventory; equipped reference may be detached after save/load.
function syncGear54(){const eq=rpgState?.equipment,inv=rpgState?.inventory||[];if(!eq)return;for(const slot of ['weapon','armor']){const current=eq[slot],updated=current?.uid&&inv.find(x=>x?.uid===current.uid);if(updated&&current!==updated)eq[slot]=updated}try{rpgSyncAiEquipment?.()}catch(_){}try{rpgRenderEquipmentPage?.()}catch(_){}try{rpgRenderStatus?.()}catch(_){} }
const oldOpenEq=window.rpgOpenEquipment;if(typeof oldOpenEq==='function')window.rpgOpenEquipment=function(){syncGear54();return oldOpenEq.apply(this,arguments)};
const oldHydrate=rpgHydratePage;rpgHydratePage=function(page){if(['rpgEquipmentPage','rpgStatusPage','rpgPartyStatusPage','rpgCharStatsPage'].includes(page))syncGear54();return oldHydrate.apply(this,arguments)};
// Formation help: clear concise mechanical guide using the present targeting and distance rules.
const legend=q('#rpgFormationPage .rpgFormationLegend');if(legend&&!q('.gwPositionHelp54',legend)){const btn=document.createElement('button');btn.type='button';btn.className='gwPositionHelp54';btn.textContent='포지션 안내 ?';btn.setAttribute('aria-label','포지션 전투 안내');btn.onclick=()=>{const text='적의 기본 공격 대상 확률: 전열 80%, 중앙 15%, 후열 5%. 근거리 공격: 전열 110%, 중앙 90%, 후열 70%. 원거리·마법 공격은 거리 페널티 없음. 거대 보스 대상 공격은 100%.';if(typeof toast==='function')toast(text);else alert(text)};legend.appendChild(btn)}
// Priest story is an unlocked dialogue, not a job-change mechanic yet.
try{HuNyangDiag.line('RPG_V4954_READY','boss_hp=2000,2200|fx_cleanup=on|run_turn=0|formation_help=on|seria_priest_lead=on')}catch(_){}
})();