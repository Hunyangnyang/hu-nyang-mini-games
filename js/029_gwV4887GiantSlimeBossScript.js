
(()=>{
const ASSETS={"idle":"assets/images/0091_3aff903977.webp","attack":"assets/images/0092_455973574d.webp","split":"assets/images/0093_cb1dcdea4b.webp","guard":"assets/images/0094_11d5cd5667.webp","area":"assets/images/0095_471966e5b4.webp","wipe":"assets/images/0096_8fdcc9fc0c.webp","stun":"assets/images/0097_da7b9fb990.webp"};
const attackPreload87=new Image();attackPreload87.src=ASSETS.attack;
const OLD_ENEMY_ACTION=rpgEnemyAtbAction;
const OLD_APPLY_DAMAGE=rpgApplyDamage;
const OLD_RENDER_BATTLE=rpgRenderBattlePage;
const OLD_BEGIN_BATTLE=rpgBeginBattle;
const OLD_FINALIZE=rpgFinalizeBattleState;
const q=s=>document.querySelector(s);
const qa=s=>[...document.querySelectorAll(s)];
const rand5=()=>Math.floor(Math.random()*6);
const now=()=>performance.now();
function isBoss(e){return !!e&&e.type==='slimeBoss'}
function gs(e){
  if(!e._gs87)e._gs87={turn:0,split70:false,split30:false,cast:null,busy:false,guard:false,guardCycles:0,wipeStarted:false,wipePending:false,wipeResolved:false,wipeChainUsed:false,breakMode:false,breakHp:500,breakMax:500,stunnedUntil:0,splitProtected:false,splitPhase:false,splitPhaseType:null,splitDeadline:0,splitStunCycles:0,splitRearm70:false,splitRearm30:false,devourPending:false,nextAoe:8+rand5(),nextGuard:5+rand5(),visual:'idle',anim:'',visualToken:0,baseDefense:e.defense||0,baseMagicDefense:e.magicDefense||e.defense||0};
  return e._gs87;
}
function findBoss(){const b=rpgState.field?.battle;if(!b)return null;const i=b.enemies.findIndex(isBoss);return i<0?null:{e:b.enemies[i],i}}
function ensureHud(){
  const stage=q('#rpgBattleStage');if(!stage)return;
  if(!q('#gwGSNotice87')){const n=document.createElement('div');n.id='gwGSNotice87';stage.appendChild(n)}
  if(!q('#gwGSBreak87')){const d=document.createElement('div');d.id='gwGSBreak87';d.innerHTML='<div class="head"><span>BREAK</span><span id="gwGSBreakText87">500 / 500</span></div><div class="track"><i id="gwGSBreakFill87"></i></div>';stage.appendChild(d)}
  if(!q('#gwGSTime87')){const d=document.createElement('div');d.id='gwGSTime87';d.innerHTML='<div class="head"><span>TIME</span><span id="gwGSTimeText87">15.0초</span></div><div class="track"><i id="gwGSTimeFill87"></i></div>';stage.appendChild(d)}
  if(!q('#gwGSBossBuff87')){const b=document.createElement('div');b.id='gwGSBossBuff87';b.textContent='🛡 방어 증가';stage.appendChild(b)}
  if(!q('#gwGSChain87')){const c=document.createElement('div');c.id='gwGSChain87';c.innerHTML='<button type="button" id="gwGSChainAtk87">연계 공격</button><button type="button" class="def" id="gwGSChainDef87">연계 방어</button>';stage.insertAdjacentElement('afterend',c);q('#gwGSChainAtk87').addEventListener('click',chainAttack);q('#gwGSChainDef87').addEventListener('click',chainDefense)}
}
let noticeTimer=0;
function announce(text){ensureHud();const n=q('#gwGSNotice87');if(!n)return;n.textContent=text;n.classList.add('show');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>n.classList.remove('show'),2200)}
function bossEl(index){return q(`#rpgBattleUnits [data-battle-enemy="${index}"]`)}
function bossImg(index){return bossEl(index)?.querySelector('.rpgBattleUnitSprite img')}
function assetFor(s){return ASSETS[s.visual]||ASSETS.idle}
function syncBossDom(){
  ensureHud();const hit=findBoss();if(!hit)return;const {e,i}=hit,s=gs(e),el=bossEl(i),img=bossImg(i);if(!el||!img)return;
  el.classList.add('gwGSBoss87');
  // Keep a running attack/area animation mounted across UI sync ticks.
  // Removing and readding classes on every render restarts keyframes and briefly exposes the default facing.
  const classes=['gwGSAttack87','gwGSSplit87','gwGSGuard87','gwGSAoe87','gwGSWipe87','gwGSExplode87','gwGSStun87'];
  const nextAnim=classes.includes(s.anim)?s.anim:'';
  const nextFlip=s.visual==='attack'||s.visual==='area'||s.visual==='wipe';
  const nextSrc=assetFor(s);
  if(img.getAttribute('src')!==nextSrc)img.src=nextSrc;
  el.classList.toggle('gwGSFlip87',nextFlip);
  for(const c of classes)el.classList.toggle(c,c===nextAnim);
  const buff=q('#gwGSBossBuff87');
  if(buff){buff.classList.toggle('show',!!s.guard&&!e.dead&&(Number(e.hp)||0)>0);const r=el.getBoundingClientRect(),sr=q('#rpgBattleStage')?.getBoundingClientRect();if(sr){buff.style.left=(r.left-sr.left+r.width*.5-36)+'px';buff.style.top=Math.max(82,r.top-sr.top-12)+'px'}}
}
function setVisual(e,visual,anim='',ms=0){const s=gs(e);s.visual=visual;s.anim=anim;s.visualToken++;const t=s.visualToken;syncBossDom();if(ms)setTimeout(()=>{if(!e._gs87||e._gs87.visualToken!==t)return;const st=gs(e);if(st.guard){st.visual='guard';st.anim='gwGSGuard87'}else if(st.breakMode&&st.cast==='wipe'){st.visual='wipe';st.anim='gwGSWipe87'}else if(st.cast&&String(st.cast).startsWith('split')){st.visual='split';st.anim='gwGSSplit87'}else{st.visual='idle';st.anim=''}syncBossDom()},ms)}
function updateHud(){
  ensureHud();const hit=findBoss(),br=q('#gwGSBreak87'),tm=q('#gwGSTime87'),chain=q('#gwGSChain87');
  if(!hit){br?.classList.remove('show');tm?.classList.remove('show');chain?.classList.remove('show');return}
  const s=gs(hit.e),pct=Math.max(0,Math.min(100,s.breakHp/s.breakMax*100));
  br?.classList.toggle('show',s.breakMode);const fill=q('#gwGSBreakFill87');if(fill)fill.style.width=pct+'%';const txt=q('#gwGSBreakText87');if(txt)txt.textContent=`${Math.max(0,Math.ceil(s.breakHp))} / ${s.breakMax}`;
  const remain=s.splitPhase?Math.max(0,s.splitDeadline-now()):0,timePct=s.splitPhase?Math.max(0,Math.min(100,remain/30000*100)):0;
  tm?.classList.toggle('show',!!s.splitPhase);const tf=q('#gwGSTimeFill87');if(tf)tf.style.width=timePct+'%';const tt=q('#gwGSTimeText87');if(tt)tt.textContent=`${(remain/1000).toFixed(1)}초`;
  const living=(rpgState.field?.party||[]).filter(u=>!u.dead),ready=living.length>0&&living.every(u=>(u.gauge||0)>=100);
  chain?.classList.toggle('show',!!(s.breakMode||s.cast==='wipe')&&ready&&!s.wipeChainUsed&&!rpgState.field?._gwChainCineBusy4926);
  syncBossDom();
}
function partyEl(u){return q(`#rpgBattleUnits [data-party-unit="${u.id}"]`)}
function flashParty(u){const el=partyEl(u);if(!el)return;el.classList.remove('gwGSHit87');void el.offsetWidth;el.classList.add('gwGSHit87');setTimeout(()=>el.classList.remove('gwGSHit87'),500)}
function splashParty(targets){const stage=q('#rpgBattleStage');if(!stage||!targets.length)return;let fx=q('#gwGSSplash87');if(!fx){fx=document.createElement('div');fx.id='gwGSSplash87';fx.className='gwGSSplash87';stage.appendChild(fx)}const rects=targets.map(partyEl).filter(Boolean).map(x=>x.getBoundingClientRect()),sr=stage.getBoundingClientRect();if(!rects.length)return;const x=rects.reduce((a,r)=>a+r.left+r.width/2,0)/rects.length-sr.left,y=rects.reduce((a,r)=>a+r.top+r.height/2,0)/rects.length-sr.top;fx.style.left=x+'px';fx.style.top=y+'px';fx.classList.remove('show');void fx.offsetWidth;fx.classList.add('show')}
function finish(e){const s=gs(e);s.busy=false;updateHud();try{rpgCheckBattleEnd()}catch(_ ){}}
function pickLineTargets(){const living=(rpgState.field?.party||[]).filter(u=>!u.dead);if(!living.length)return[];const pick=rpgPickPartyTargetByLine(living);const mod=pick.line==='front'?2:pick.line==='mid'?1:0;const row=living.filter(u=>u.position%3===mod);return row.length?row:[pick.target]}
function applyCorrosion87(target){
  if(!target||target.dead)return;
  target._gsCorrosionStacks=Math.min(3,Math.max(0,Number(target._gsCorrosionStacks)||0)+1);
  target._gsCorrosionTurns=1;
  const pct=target._gsCorrosionStacks*10;
  rpgLog(`🧪 ${target.name}에게 부식 ${target._gsCorrosionStacks}중첩 · 물리 방어 -${pct}% · 다음 ATB 행동까지`);
  try{window.gwBattle55PostActionRefresh?.('giant_slime_corrosion')}catch(_){}
}
function normalAttack(e,index){const s=gs(e),living=(rpgState.field?.party||[]).filter(u=>!u.dead);if(!living.length)return;s.busy=true;s.turn++;rpgResetGauge(e);const target=rpgPickPartyTargetByLine(living).target;setVisual(e,'attack','gwGSAttack87',850);setTimeout(()=>{if(!rpgState.field?.battle||e.dead||target.dead)return;flashParty(target);const dealt=rpgPhysicalHit(e,target,e.name,target.name,`#rpgBattleUnits [data-party-unit="${target.id}"]`);if(dealt>0)applyCorrosion87(target)},380);setTimeout(()=>finish(e),900)}
function beginCast(e,type,rate){const s=gs(e);if(s.busy||s.cast||s.guard)return false;s.cast=type;s.castRate=rate;e.gauge=0;if(String(type).startsWith('split')){s[type==='split70'?'split70':'split30']=true;s.splitProtected=true;s.splitPhaseType=type;setVisual(e,'split','gwGSSplit87');announce('거대 슬라임의 몸이 갈라집니다. · 받는 피해 80% 감소')}else if(type==='aoe')setVisual(e,'area','');else if(type==='wipe'){s.wipeStarted=true;s.wipePending=false;s.wipeChainUsed=false;s.breakMode=true;s.breakHp=s.breakMax;setVisual(e,'wipe','gwGSWipe87');announce('거대 슬라임의 몸집이 부풉니다.')}updateHud();return true}
function freeSpawnPositions(b){const used=new Set();(b?.enemies||[]).filter(x=>!x.dead).forEach(x=>{const cells=Array.isArray(x?.footprint)&&x.footprint.length?x.footprint:[x.position];cells.forEach(p=>used.add(p))});return [2,8,0,6].filter(x=>!used.has(x))}
function spawnElites(){const b=rpgState.field?.battle,red=rpgSlimeDefs.red;if(!b||!red)return;const spots=freeSpawnPositions(b),fallback=[0,6];for(let k=0;k<2;k++){const pos=spots[k]??fallback[k]??0;const add=rpgCreateEncounterEnemy(red,pos,b.enemies.length);add.name='엘리트 빨간 슬라임';add.rank='엘리트';add._giantSplitElite=true;add.rewardExp=0;add.hp=add.maxHp=220;add.attack=Math.max(1,Math.round((red.attack||1)*1.5));add.defense=Math.max(0,Math.round((red.defense||0)*1.5));add.magicDefense=add.defense;add.dex=Math.max(1,Math.round((red.dex||1)*1.5));add.gauge=0;b.enemies.push(add)}try{window.gwBattle55PostActionRefresh?.('giant_slime_split')}catch(_ ){rpgRenderBattlePage()}}
function livingEliteAdds(b){return (b?.enemies||[]).filter(x=>!x.dead&&x.name==='엘리트 빨간 슬라임')}
function bossHealFx97(e,amount){const i=rpgState.field?.battle?.enemies?.indexOf(e)??-1;if(i<0)return;const sel=`#rpgBattleUnits [data-battle-enemy="${i}"]`,el=q(sel);if(el){el.classList.remove('gwGSDevourHeal97');void el.offsetWidth;el.classList.add('gwGSDevourHeal97');setTimeout(()=>el.classList.remove('gwGSDevourHeal97'),920)}if(amount>0)requestAnimationFrame(()=>rpgShowDamage(sel,`+${amount}`,true))}
function restoreGuardBase87(e,s){if(!s.guard)return;s.guard=false;s.guardCycles=0;e.defense=s.baseDefense;e.magicDefense=s.baseMagicDefense;s.guardDamageTaken=0}
function splitSuccess87(e){const s=gs(e);if(!s.splitPhase)return;s.splitPhase=false;s.splitProtected=false;s.splitDeadline=0;s.devourPending=false;restoreGuardBase87(e,s);s.cast=null;s.castRate=1;s.busy=false;s.splitStunCycles=2;e.gauge=0;setVisual(e,'stun','gwGSStun87');announce('엘리트 슬라임 격파 성공! · 거대 슬라임 ATB 2회 기절');rpgLog('💫 분열 기믹 성공! 거대 슬라임이 ATB 2회 동안 기절합니다.');updateHud()}
function releaseSplitRearm87(e){const s=gs(e);if(s.splitRearm70){s.split70=false;s.splitRearm70=false;rpgLog('↺ 거대 슬라임의 HP가 70%를 다시 넘어 첫 번째 분열이 재활성화됩니다.')}if(s.splitRearm30){s.split30=false;s.splitRearm30=false;rpgLog('↺ 거대 슬라임의 HP가 30%를 다시 넘어 두 번째 분열이 재활성화됩니다.')}}
function resolveDevour(e){const b=rpgState.field?.battle,s=gs(e),elites=livingEliteAdds(b);if(!b||!elites.length)return false;s.busy=true;s.devourPending=false;s.splitPhase=false;s.splitProtected=false;s.splitDeadline=0;s.castRate=1;rpgResetGauge(e);s.turn++;let healRaw=0,count=0;for(const elite of elites){healRaw+=(elite.hp||0)*.5;elite.hp=0;elite.dead=true;elite.gauge=0;count++}const before=e.hp||0,heal=Math.max(0,Math.round(healRaw));e.hp=Math.min(e.maxHp||e.hp||1,before+heal);const ratio=(e.hp||0)/Math.max(1,e.maxHp||1);if(s.split70&&ratio>.70)s.splitRearm70=true;if(s.split30&&ratio>.30)s.splitRearm30=true;setVisual(e,'idle','',420);rpgLog(`🟢 TIME 종료 · 거대 슬라임이 포식합니다. 엘리트 슬라임 ${count}마리의 남은 HP 50%를 흡수했습니다.`);rpgLog(`💚 거대 슬라임 HP ${before} → ${e.hp} (+${Math.max(0,e.hp-before)})`);setTimeout(()=>{bossHealFx97(e,Math.max(0,e.hp-before));try{rpgRenderBattlePage();window.gwSyncEnemyCards53?.()}catch(_){ }updateHud()},70);setTimeout(()=>finish(e),540);return true}
function resolveSplit(e){const s=gs(e);s.busy=true;const type=s.cast;s.cast=null;s.castRate=1;rpgResetGauge(e);s.turn++;setVisual(e,'split','gwGSExplode87',1250);setTimeout(()=>{spawnElites();s.splitPhase=true;s.splitProtected=true;s.splitPhaseType=type;s.splitDeadline=now()+30000;announce('TIME 30초 · 엘리트 슬라임을 모두 처치하세요.');updateHud()},520);setTimeout(()=>finish(e),1300)}
function checkSplitPhase87(e){const s=gs(e),b=rpgState.field?.battle;if(!s.splitPhase||!b)return;const elites=livingEliteAdds(b);if(!elites.length){splitSuccess87(e);return}if(now()>=s.splitDeadline){if(s.busy||s.cast){s.devourPending=true;return}resolveDevour(e)}}
function resolveAoe(e){const s=gs(e);s.busy=true;s.cast=null;s.castRate=1;rpgResetGauge(e);s.turn++;s.nextAoe=s.turn+8+rand5();const targets=(rpgState.field?.party||[]).filter(u=>!u.dead),n=Math.max(1,targets.length),rate=.80/n;setVisual(e,'area','gwGSAoe87',1450);setTimeout(()=>{splashParty(targets);for(const u of targets){if(u.dead)continue;flashParty(u);const amount=Math.max(1,Math.round((u.derived?.maxHp||u.hp||1)*rate));const dealt=exactPartyDamage(u,amount);rpgLog(`🌊 ${e.name}의 광역 공격! ${u.name}에게 ${dealt} 피해 (최대 HP ${Math.round(rate*1000)/10}% · 생존 ${n}명)`)}},850);setTimeout(()=>finish(e),1500)}
function startGuard(e){const s=gs(e);s.busy=true;s.guard=true;s.guardDamageTaken=0;s.guardCycles=3;s.turn++;s.nextGuard=s.turn+5+rand5();s.baseDefense=e.defense||0;s.baseMagicDefense=e.magicDefense||e.defense||0;e.defense=Math.round(s.baseDefense*2);e.magicDefense=Math.round(s.baseMagicDefense*2);rpgResetGauge(e);setVisual(e,'guard','gwGSGuard87',700);setTimeout(()=>{s.busy=false;s.visual='guard';s.anim='gwGSGuard87';updateHud()},720)}
function guardCycle(e){const s=gs(e);rpgResetGauge(e);s.turn++;s.guardCycles--;if(s.guardCycles<=0){s.guard=false;e.defense=s.baseDefense;e.magicDefense=s.baseMagicDefense;s.visual='idle';s.anim='';const party=(rpgState.field?.party||[]).filter(u=>!u.dead),retaliate=Math.max(0,Math.round((s.guardDamageTaken||0)*.30));if(retaliate>0&&party.length){const each=Math.max(1,Math.round(retaliate/party.length));rpgLog(`🛡️ 거대 슬라임이 방어 중 받은 피해 ${Math.round(s.guardDamageTaken||0)}의 30%를 반사합니다. · 아군 전체 ${each} 피해`);for(const u of party)exactPartyDamage(u,each)}s.guardDamageTaken=0}updateHud()}
function exactPartyDamage(u,amount){if(!u||u.dead)return 0;if(window.HuNyangDevInvincible?.enabled?.()){try{requestAnimationFrame(()=>rpgShowDamage(`#rpgBattleUnits [data-party-unit="${u.id}"]`,`0`,false));flashParty(u)}catch(_){}return 0}const f=rpgState.field,t=now();if((u._gsInvulnUntil||0)>t)return 0;const guarded=(f?._gsChainDefenseUntil||0)>t;let dmg=Math.max(0,Math.round(amount*(guarded?.05:1))),before=u.hp;if(guarded&&dmg>=u.hp){u.hp=1;u.dead=false;u._gsInvulnUntil=t+5000;dmg=Math.max(0,before-1)}else{u.hp=Math.max(0,u.hp-dmg);if(u.hp<=0)u.dead=true}requestAnimationFrame(()=>rpgShowDamage(`#rpgBattleUnits [data-party-unit="${u.id}"]`,`-${dmg}`,false));flashParty(u);return dmg}
function wipeFail(e){const s=gs(e);if(!s.breakMode)return;s.busy=true;s.cast=null;s.castRate=1;s.breakMode=false;s.wipeResolved=true;rpgResetGauge(e);setVisual(e,'wipe','gwGSExplode87',1500);setTimeout(()=>{const living=(rpgState.field?.party||[]).filter(u=>!u.dead);splashParty(living);for(const u of living)exactPartyDamage(u,e.maxHp||e.hp||1)},520);setTimeout(()=>finish(e),1550)}
function breakSuccess(e){const s=gs(e);if(!s.breakMode)return;s.breakMode=false;s.wipeResolved=true;s.cast=null;s.castRate=1;s.breakHp=0;e.gauge=0;s.stunnedUntil=now()+3000;s.busy=true;setVisual(e,'stun','gwGSStun87',3000);updateHud();setTimeout(()=>{s.busy=false;s.visual='idle';s.anim='';updateHud();rpgCheckBattleEnd()},3050)}
function currentAttack(u){if(!u?.derived)return Number(u?.attack)||0;const physical=typeof rpgWeaponPhysicalPower==='function'?rpgWeaponPhysicalPower(u):Math.max(u.derived.meleeAtk||0,u.derived.rangedAtk||0);const magic=typeof rpgWeaponMagicPower==='function'?rpgWeaponMagicPower(u):(u.derived.magicAtk||0);return Math.max(physical,magic,u.derived.meleeAtk||0,u.derived.rangedAtk||0,u.derived.magicAtk||0)}
function chainAttack(){const hit=findBoss();if(!hit)return;const f=rpgState.field,s=gs(hit.e),living=(f?.party||[]).filter(u=>!u.dead);if(f?._gwChainCineBusy4926||!s.breakMode||s.wipeChainUsed||!living.length||!living.every(u=>(u.gauge||0)>=100))return;s.wipeChainUsed=true;const battleRef=f?.battle,bossRef=hit.e;for(const u of living)u.gauge=0;if(f)f._gwChainCineBusy4926=true;updateHud();const apply=()=>{try{if(rpgState.field?.battle!==battleRef||bossRef.dead)return;const nowHit=findBoss();if(!nowHit||nowHit.e!==bossRef)return;const state=gs(bossRef);if(!state.breakMode)return;const dmg=Math.max(1,Math.round(living.reduce((sum,u)=>sum+currentAttack(u),0)*1.5)),before=state.breakHp;state.breakHp-=dmg;const overflow=Math.max(0,-state.breakHp);if(overflow>0){bossRef.hp=Math.max(0,bossRef.hp-overflow);if(bossRef.hp<=0)bossRef.dead=true}requestAnimationFrame(()=>rpgShowDamage(`#rpgBattleUnits [data-battle-enemy="${nowHit.i}"]`,`BREAK -${Math.min(before,dmg)}`,false));updateHud();if(state.breakHp<=0)breakSuccess(bossRef);else try{window.gwBattle55PostActionRefresh?.('chain_attack')}catch(_){}}finally{if(rpgState.field===f)delete f._gwChainCineBusy4926}};if(typeof window.gwPlayChainCinematic4926==='function')window.gwPlayChainCinematic4926('attack',living,hit.i,apply);else apply()}
function chainDefense(){const hit=findBoss(),f=rpgState.field,living=(f?.party||[]).filter(u=>!u.dead);if(!hit)return;const s=gs(hit.e);if(f?._gwChainCineBusy4926||!s.breakMode||s.wipeChainUsed||!living.length||!living.every(u=>(u.gauge||0)>=100))return;s.wipeChainUsed=true;const battleRef=f?.battle;for(const u of living)u.gauge=0;if(f)f._gwChainCineBusy4926=true;updateHud();const apply=()=>{try{if(rpgState.field?.battle!==battleRef)return;rpgState.field._gsChainDefenseUntil=now()+5000;for(const u of living)partyEl(u)?.classList.add('gwGSChainDef87');updateHud();setTimeout(()=>{if(rpgState.field?.battle!==battleRef)return;for(const u of living)partyEl(u)?.classList.remove('gwGSChainDef87');updateHud()},5000)}finally{if(rpgState.field===f)delete f._gwChainCineBusy4926}};if(typeof window.gwPlayChainCinematic4926==='function')window.gwPlayChainCinematic4926('defense',living,hit.i,apply);else apply()}
function threshold(e){const s=gs(e);if(s.busy||s.stunnedUntil>now()||s.splitPhase||s.devourPending||s.wipeStarted)return;const p=(e.hp||0)/Math.max(1,e.maxHp||1),elites=livingEliteAdds(rpgState.field?.battle);let type=null;if(p<=.30&&!s.split30&&!elites.length)type='split30';else if(p<=.70&&!s.split70)type='split70';else if(p<=.10&&!s.wipeStarted)type='wipe';if(!type)return;if(s.guard)restoreGuardBase87(e,s);if(s.cast){s.cast=null;s.castRate=1}e.gauge=0;s.busy=false;beginCast(e,type,type==='wipe'?1/5:2/3);rpgLog(`⚠️ HP 임계 기믹 우선 · 예약된 패턴을 취소하고 ${type==='split70'?'70% 분열':type==='split30'?'30% 분열':'10% 전멸/BREAK'}을 발동합니다.`)}
rpgApplyDamage=function(target,amount,magic=false){
  const f=rpgState.field,t=now();
  if(isBoss(target)){const s=gs(target);if(s.breakMode){const def=magic?(target.magicDefense||0):(target.defense||0),dmg=Math.max(0,rpgRound(Math.max(0,amount)-def)),before=s.breakHp;s.breakHp=Math.max(0,s.breakHp-dmg);updateHud();if(dmg)requestAnimationFrame(()=>{const i=rpgState.field?.battle?.enemies?.indexOf(target);if(i>=0)rpgShowDamage(`#rpgBattleUnits [data-battle-enemy="${i}"]`,`BREAK -${dmg}`,false)});if(s.breakHp<=0)setTimeout(()=>breakSuccess(target),0);return {hpDamage:dmg,absorbed:0,before:target.hp,after:target.hp,breakDamage:dmg}}
    const reduced=s.splitProtected?amount*.20:amount,before=target.hp,res=OLD_APPLY_DAMAGE(target,reduced,magic);if(s.guard&&res?.hpDamage>0)s.guardDamageTaken=(s.guardDamageTaken||0)+res.hpDamage;return res}
  const party=f?.party||[];if(party.includes(target)){if(window.HuNyangDevInvincible?.enabled?.()){const hp=target.hp;return {hpDamage:0,absorbed:Math.max(0,Math.round(Number(amount)||0)),before:hp,after:hp,devInvincible:true}}if((target._gsInvulnUntil||0)>t)return {hpDamage:0,absorbed:0,before:target.hp,after:target.hp};const guarded=(f._gsChainDefenseUntil||0)>t,before=target.hp,res=OLD_APPLY_DAMAGE(target,guarded?amount*.05:amount,magic);if(guarded&&target.dead){target.hp=1;target.dead=false;target._gsInvulnUntil=t+5000;res.hpDamage=Math.max(0,before-1);res.after=1}return res}
  return OLD_APPLY_DAMAGE(target,amount,magic)
};
rpgEnemyAtbAction=function(e,index){
  if(!isBoss(e))return OLD_ENEMY_ACTION(e,index);const f=rpgState.field;if(!f?.battle||e.dead)return;const s=gs(e);if(s.busy||s.stunnedUntil>now())return;
  const hpRatio=(e.hp||0)/Math.max(1,e.maxHp||1);
  if(s.devourPending&&!s.cast)return resolveDevour(e);
  if(hpRatio<=.10&&!s.wipeStarted&&!s.splitPhase&&!s.splitProtected){if(s.guard)restoreGuardBase87(e,s);if(s.cast&&s.cast!=='wipe'){s.cast=null;s.castRate=1}s.wipePending=false;if(!s.cast)beginCast(e,'wipe',1/5)}
  if(s.guard){if(e.gauge>=100)guardCycle(e);return}
  if(s.cast){if(e.gauge<100)return;if(String(s.cast).startsWith('split'))return resolveSplit(e);if(s.cast==='aoe')return resolveAoe(e);if(s.cast==='wipe')return wipeFail(e)}
  if(e.gauge>=100&&(s.splitRearm70||s.splitRearm30))releaseSplitRearm87(e);
  if(s.splitStunCycles>0){
    if(e.gauge<100)return;
    rpgResetGauge(e);s.turn++;s.splitStunCycles--;rpgLog(`💫 거대 슬라임이 기절해 행동하지 못합니다. · 남은 기절 ${s.splitStunCycles}회`);
    if(s.splitStunCycles<=0){s.visual='idle';s.anim='';setVisual(e,'idle','',260)}else setVisual(e,'stun','gwGSStun87');
    updateHud();return;
  }
  threshold(e);if(s.cast||s.guard||s.busy)return;if(e.gauge<100)return;
  if(s.splitPhase&&hpRatio<=.10&&!s.wipeStarted)s.wipePending=true;
  if(s.wipePending&&!s.wipeStarted&&!s.splitPhase&&!s.splitProtected)return beginCast(e,'wipe',1/5);
  const wipeDue=hpRatio<=.10&&!s.wipeStarted&&!s.splitPhase&&!s.splitProtected;
  if(s.turn>=s.nextAoe){if(wipeDue)s.wipePending=true;return beginCast(e,'aoe',2/3)}
  if(s.turn>=s.nextGuard){if(wipeDue)s.wipePending=true;return startGuard(e)}
  if(wipeDue)return beginCast(e,'wipe',1/5);
  normalAttack(e,index)
};
rpgBattleTick=function(){
  const f=rpgState.field,b=f?.battle;if(!b){rpgStopBattleTicker();return}const t=now(),dt=Math.min(.25,Math.max(0,(t-(rpgBattleLast||t))/1000));rpgBattleLast=t;
  const wolf47=b.enemies.find(x=>x.type==='wolfBoss'&&!x.dead),wolfSt47=wolf47?wolf47._wolf932:null;
  const pause47=!!(wolfSt47&&Date.now()<(wolfSt47.rageResultUntil4946||0));
  for(const u of (f.party||[]).slice(0,3)){if(pause47)continue;if(wolfSt47?.rageActive&&String(wolfSt47.markedId4936)===String(u.id)){u.gauge=0;continue}if(!u.dead&&u.gauge<100)(u.gauge=Math.min(100,u.gauge+rpgGaugeRate(rpgUnitAttackSpeed(u))*dt),u.gauge>=100&&window.gwTickWolfEffectsOnAtb52?.(u))};
  for(const e of b.enemies){if(e.dead||e.gauge>=100)continue;if(pause47&&e.type==='wolfBoss'){e.gauge=0;continue}if(e.type==='wolfBoss'){const w=e._wolf932;if(w?.breakMode){e.gauge=Math.min(100,e.gauge+(100/20)*dt)}else{const rate=w?.cast?(w.castRate||1):1;e.gauge=Math.min(100,e.gauge+rpgGaugeRate(rpgUnitAttackSpeed(e))*rate*dt)}}else if(isBoss(e)){const s=gs(e);if(s.stunnedUntil>t)continue;const mult=s.castRate||1;e.gauge=Math.min(100,e.gauge+rpgGaugeRate(rpgUnitAttackSpeed(e))*mult*dt)}else e.gauge=Math.min(100,e.gauge+rpgGaugeRate(rpgUnitAttackSpeed(e))*dt)}
  for(const e of b.enemies)if(isBoss(e)){checkSplitPhase87(e);threshold(e)}
  if(!pause47){const wipeReady=b.enemies.some(e=>isBoss(e)&&gs(e).breakMode&&gs(e).cast==='wipe');if(!wipeReady){for(const ai of (f.party||[]).slice(1,3))if(ai&&!ai.dead&&ai.gauge>=100)rpgAiAtbAction(ai);rpgAutoPlayerAction()}}b.enemies.forEach((e,i)=>{if(!(pause47&&e.type==='wolfBoss')&&(e.gauge>=100||isBoss(e)&&gs(e).cast))rpgEnemyAtbAction(e,i)});rpgCheckBattleEnd();updateHud();if(f.battle&&activePageId()!=='rpgBattlePage')rpgRenderField()
};
rpgRenderBattlePage=function(){OLD_RENDER_BATTLE.apply(this,arguments);ensureHud();syncBossDom();updateHud()};
rpgBeginBattle=function(){const r=OLD_BEGIN_BATTLE.apply(this,arguments);setTimeout(()=>{const hit=findBoss();if(hit){hit.e.image=ASSETS.idle;hit.e.attackImage=ASSETS.attack;gs(hit.e);syncBossDom();updateHud()}},0);return r};
rpgFinalizeBattleState=function(){const f=rpgState.field;if(f){delete f._gsChainDefenseUntil;delete f._gwChainCineBusy4926}return OLD_FINALIZE.apply(this,arguments)};
if(rpgSlimeDefs?.slimeBoss){rpgSlimeDefs.slimeBoss.image=ASSETS.idle;rpgSlimeDefs.slimeBoss.attackImage=ASSETS.attack;rpgSlimeDefs.slimeBoss.hitImage=ASSETS.idle}
setTimeout(()=>{const hit=findBoss();if(hit){hit.e.image=ASSETS.idle;hit.e.attackImage=ASSETS.attack;gs(hit.e);syncBossDom();updateHud()}},0);
try{HuNyangDiag.line('RPG_V4887_READY','giant_slime_live_patterns=normal+split70+split30+guard+aoe+wipe|split_time=30s|split_reduce=80pct|split_success_stun=2atb|devour=elite_remaining_hp50|break=500|chain=attack,defense')}catch(_ ){}
})();
